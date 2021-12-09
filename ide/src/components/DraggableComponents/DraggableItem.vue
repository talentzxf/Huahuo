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
            active: Boolean,
            itemId: Number
        }
    }
</script>