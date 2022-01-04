<template>
    <div :style="{
         border: '1px solid green',
         display: active? 'block': 'none'
        }">
        <slot></slot>
    </div>
</template>

<script>
    export default{
        name:"DraggableItem",
        props:{
            title: String,
            itemId: Number,
            active: Boolean
        },
        // watch:{
        //   active(newValue, oldValue){
        //     console.log("Active changed from:"+ oldValue + " to:" + newValue)
        //   }
        // }
    }
</script>