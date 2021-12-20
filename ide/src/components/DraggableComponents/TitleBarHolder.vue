<template>
  <div ref="holder" class="titlebar_holder">
    <slot></slot>
  </div>
</template>

<script>
import {TabMover} from "./TabMover";
import {Rect2D} from "@/math/Rect2D";
import {Utils} from "./Utils";
import {Events} from "./Events";

let occupiedTitle = null
let occupiedTitleBarHolder = null

export default {
  name: "TitleBarHolder",
  mounted() {
    // Register call back for the title moving
    TabMover.getInstance().AddFront(this.onTitleMoving)

    Utils.Event.on(Events.TitleDropped, this.onTitleDrop)
  },
  methods: {
    onTitleDrop(param){
      let titleComponent = param.component
      console.log("TitleComponent dropped:" + titleComponent.$refs.draggable_div_ref.innerText)

      // This is the target title bar holder
      if(this == occupiedTitleBarHolder){
        console.log("Target is me!")

        if(this == occupiedTitle.$parent){
          this.$slots.default()
          console.log("Same line, rearrange order")
        }
      }

      if(occupiedTitle != null){
        occupiedTitle.SetMarginLeft(0)
        occupiedTitle = null
        occupiedTitleBarHolder = null
      }
    },
    onTitleMoving(param) {
      let ele = param.ele
      let targetPos = param.targetPos

      if (this.overlap(targetPos.X, targetPos.Y, ele.width, ele.height)) {

        let holderY = this.$refs.holder.offsetTop
        ele.SetScrPos(targetPos.X, holderY)

        let targetRect = new Rect2D(targetPos.X, targetPos.Y, targetPos.X + ele.width, targetPos.Y + ele.height)

        let insideMe = false
        // Move current titles if needed
        this.$slots.default().forEach(titleBar => {
          let titleBarComponent = titleBar.component.proxy // UGLY but really don't know how to access computed property in slot items
          let x = titleBarComponent.x
          let y = titleBarComponent.y
          let width = titleBarComponent.width
          let height = titleBarComponent.height

          let childTitleRect = new Rect2D(x,  y, x + width, y + height)

          if(titleBarComponent.itemId != ele.itemId){
            if (childTitleRect.overlap(targetRect)) {
              insideMe = true

              if(occupiedTitle != null){
                occupiedTitle.SetMarginLeft(0)
                occupiedTitleBarHolder = null
              }

              occupiedTitle = titleBarComponent
              occupiedTitle.SetMarginLeft(ele.width)

              occupiedTitleBarHolder = this
            }
          }

          if(!insideMe && occupiedTitle != null){
            occupiedTitle.SetMarginLeft(0)
            occupiedTitle = null
            occupiedTitleBarHolder = null
          }
        })

        return true;
      }

      if(this.occupiedTitle != null){
        this.occupiedTitle.SetMarginLeft(0)
        this.occupiedTitle = null
      }

      return false;

    },
    overlap(x, y, width, height) {
      let ele = this.$refs.holder
      let eleRect = Rect2D.fromDomRect(ele.getBoundingClientRect())

      let targetRect = new Rect2D(x, y, x + width, y + height)
      return eleRect.overlap(targetRect);
    }
  }
}
</script>

<style scoped>
.titlebar_holder {
  border: 1px solid darkblue;
  display: flex;
  flex-direction: row;
}
</style>