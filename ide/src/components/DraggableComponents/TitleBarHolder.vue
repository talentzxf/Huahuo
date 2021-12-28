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
    onTitleDrop(param) {
      try {
        let panel = this.$parent
        let titleComponent = param.component
        let itemId = titleComponent.itemId

        // This is the target title bar holder
        if (this == occupiedTitleBarHolder) {
          console.log("Target is me!")
          if (this == titleComponent.$parent) {
            let currentRenderOrder = panel.getRenderOrder(itemId)
            console.log("TitleComponent dropped:" + titleComponent.$refs.draggable_div_ref.innerText)

            let newOrder = panel.getRenderOrder(occupiedTitle.itemId)
            if (newOrder != currentRenderOrder) {
              // 0 -- Drag from right to left. renderOrder of all cells in between need to +1
              // 1 -- Drag from left to right. renderOrder of all cells in between need to -1
              let direction = newOrder < currentRenderOrder ? 0 : 1

              this.$slots.default().forEach(
                  titleBar => {
                    let titleBarComponent = titleBar.component.proxy
                    let titleBarComponentRenderOrder = panel.getRenderOrder(titleBarComponent.itemId)

                    if (direction == 0) {
                      if (titleBarComponentRenderOrder >= newOrder && titleBarComponentRenderOrder < currentRenderOrder) {
                        panel.setRenderOrder(titleBarComponent.itemId, titleBarComponentRenderOrder + 1)
                      }
                    } else if (direction == 1) {
                      if (titleBarComponentRenderOrder > currentRenderOrder && titleBarComponentRenderOrder <= newOrder) {
                        panel.setRenderOrder(titleBarComponent.itemId, titleBarComponentRenderOrder - 1)
                      }
                    }
                  }
              )
              panel.setRenderOrder(itemId, newOrder)
            }
          }
        }
      } finally {
        if (occupiedTitle != null) {
          console.log("Cleared occupited title in onTitleDrop!")
          occupiedTitle.SetMarginLeft(0)
          occupiedTitle = null
          occupiedTitleBarHolder = null
        }
      }
    },
    getLastChild(){
      let panel = this.$parent
      let lastChildRenderOrder = -1
      let lastChild = null

      this.$slots.default().forEach(titleBar=>{
        let candidateTitleBarComponent = titleBar.component.proxy // UGLY but really don't know how to access computed property in slot items

        if (panel.getRenderOrder(candidateTitleBarComponent.itemId) > lastChildRenderOrder) {
          lastChild = candidateTitleBarComponent
          lastChildRenderOrder = panel.getRenderOrder(candidateTitleBarComponent.itemId)
        }
      })

      return lastChild
    },
    onTitleMoving(param) {
      let ele = param.ele
      let targetPos = param.targetPos

      if (this.overlap(targetPos.X, targetPos.Y, ele.width, ele.height)) {

        let holderY = this.$refs.holder.offsetTop
        ele.SetScrPos(targetPos.X, holderY)

        let targetRect = new Rect2D(targetPos.X, targetPos.Y, targetPos.X + ele.width, targetPos.Y + ele.height)

        let lastChild = this.getLastChild()

        let overlapWithChild = false
        // Move current titles if needed
        this.$slots.default().forEach(titleBar => {
          let candidateTitleBarComponent = titleBar.component.proxy // UGLY but really don't know how to access computed property in slot items

          let x = candidateTitleBarComponent.x
          let y = candidateTitleBarComponent.y
          let width = candidateTitleBarComponent.width
          let height = candidateTitleBarComponent.height

          let childTitleRect = new Rect2D(x, y, x + width, y + height)

          if (candidateTitleBarComponent.itemId != ele.itemId) {
            if (childTitleRect.overlap(targetRect)) {
              overlapWithChild = true

              if (occupiedTitle != null) {
                occupiedTitle.SetMarginLeft(0)
                occupiedTitleBarHolder = null
              }

              occupiedTitle = candidateTitleBarComponent
              occupiedTitle.SetMarginLeft(ele.width)

              occupiedTitleBarHolder = this
            }
          }

          // If this title doesn't overlap with child, it might be the last one
          if (!overlapWithChild) {
            occupiedTitle = lastChild
            occupiedTitleBarHolder = this
          }
        })

        return true;
      }

      if (this.occupiedTitle != null) {
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