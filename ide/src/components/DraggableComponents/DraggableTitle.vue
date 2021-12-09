<template>
    <span class='title_embedded' :style="{
        border: selected?'5px solid gray': '1px solid blue'
    }"
    @click="tabSelected">
        {{title}}
    </span>
</template>

<script>
    export default {
        name: "DraggableTitle",
        props: {
            title: String,
            selected: Boolean,
            itemId: Number
        },
        methods:{
            tabSelected(){
                this.$emit('tabSelected', this.itemId)
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .title_embedded {
        background-color: gray;
        text-align: left;
        cursor: move;
    }

    .content_container {
        border: 1px solid blue;
    }

    .div_floating {
        position: absolute;
    }

    .div_embedded {
        position: relative;
    }

</style>