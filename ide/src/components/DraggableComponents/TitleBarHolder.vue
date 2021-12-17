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

        if(this.overlap(targetPos.X, targetPos.Y, ele.getWidth(), ele.getHeight())){

          let holderY = this.$refs.holder.offsetTop
          ele.SetScrPos(targetPos.X, holderY)
          return true;
        }

        return false;

      },
      overlap(x, y, width, height){
        if( this.in(x,y) || this.in(x+width, y+height))
          return true;
        
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