<template>
  <div ref="holder" class="titlebar_holder">
    <slot></slot>
  </div>
</template>

<script>
  import {TabMover} from "./TabMover";

  export default {
    name: "TitleBarHolder",
    mounted() {
      // Register call back for the title moving
      TabMover.getInstance().AddFront(this.onTitleMoving)
    },
    methods:{
      onTitleMoving(param){
        let ele = param.ele
        let targetPos = param.targetPos

        console.log("Got title moving event")

        console.log(ele)
        console.log(targetPos)

        if(this.in(targetPos.X, targetPos.Y)){

          let holderY = this.$refs.holder.offsetTop
          ele.SetScrPos(targetPos.X, holderY)

          // // if the target position is still within the titlebar holder, just rearrange the tab order accordingly.
          // if(this.$parent.in(targetX, targetY)){
          //   this.scrX = targetX + "px";
          //   this.scrY = this.startElePos.Y + "px";
          // }else{
          //   this.scrX = targetX + "px";
          //   this.scrY = targetY + "px";
          // }

          return true;
        }

        return false;

      },
      in(x, y){
        let ele = this.$refs.holder;

        let eleRect = ele.getBoundingClientRect()
        let top = eleRect.top
        let bottom = eleRect.bottom
        if(y < top || y > bottom)
          return false

        let left = eleRect.left
        let right = eleRect.right
        if( x < left || x > right)
          return false

        return true
      }
    }
  }
</script>

<style scoped>
  .titlebar_holder{
    border: 1px solid darkblue;
    display: flex;
    flex-direction: row;
  }
</style>