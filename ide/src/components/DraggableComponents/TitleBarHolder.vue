<template>
  <div ref="holder" class="titlebar_holder">
    <slot></slot>
  </div>
</template>

<script>
  import {Events} from "./Events"
  import {Utils} from "./Utils"

  export default {
    name: "TitleBarHolder",
    mounted() {
      Utils.Event.on(Events.TitleMoving, this.methods.onTitleMoving)
    },
    methods:{
      onTitleMoving(){
        console.log("Got title moving event")
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