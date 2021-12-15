<template>
  <div ref="holder" class="titlebar_holder">
    <slot></slot>
  </div>
</template>

<script lang="ts">
  export default {
    name: "TitleBarHolder",
    methods:{
      in(x: number, y:number): boolean{
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