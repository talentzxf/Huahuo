<template>
  <div ref="holder" class="titlebar_holder">
    <slot></slot>
  </div>
</template>

<script>
import {TabMover} from "./TabMover";
import {Rect2D} from "@/math/Rect2D";

let occupiedTitle = null

export default {
  name: "TitleBarHolder",
  mounted() {
    // Register call back for the title moving
    TabMover.getInstance().AddFront(this.onTitleMoving)
  },
  methods: {
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
              }

              occupiedTitle = titleBarComponent
              occupiedTitle.SetMarginLeft(ele.width)
            }
          }

          if(!insideMe && occupiedTitle != null){
            occupiedTitle.SetMarginLeft(0)
            occupiedTitle = null
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