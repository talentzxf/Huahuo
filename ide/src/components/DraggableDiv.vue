<template>
    <div ref="draggable_div_ref" :style="{
        border: '1px solid red',
        position: floating? 'absolute': 'relative',
        left: scrX,
        top: scrY
  }">
        <div class="title_embedded" v-on:mousedown.stop.prevent="onTitleMouseDown">{{title}}</div>
        <br>
        <div class="content_container">
            <slot></slot>
        </div>
    </div>
</template>

<script>
    import {Vector2D} from "@/math/Vector2D"
    export default{
        name:"DraggableDiv",
        props:{
            title: String,
            width: Number,
            height: Number
        },
        data(){
            return {
                beginToMove: false,
                isMoving: false,
                startMovingPos: new Vector2D(0.0, 0.0),
                floating: false,
                scrX: 0,
                scrY: 0
            }
        },
        methods:{
            onTitleMouseDown(evt){
                this.beginToMove = true;
                this.startMovingPos.X = evt.clientX;
                this.startMovingPos.Y = evt.clientY;

                document.onmousemove = this.onMouseMove;
                document.onmouseup = this.onMouseUp;
            },
            onMouseUp(){
                this.beginToMove = false;
                this.isMoving = false;

                console.log("OnTitleMouseUp")
                document.onmousemove = null;
                document.onmouseup = null;
            },
            onMouseMove(evt){
                if(this.beginToMove && !this.startMovingPos.equals(evt.clientX, evt.clientY)){
                    this.isMoving = true;
                }

                if(this.isMoving){
                    let offsetX = this.startMovingPos.X - evt.clientX;
                    let offsetY = this.startMovingPos.Y - evt.clientY;

                    this.startMovingPos.X = evt.clientX;
                    this.startMovingPos.Y = evt.clientY;

                    let ele = this.$refs.draggable_div_ref;

                    this.scrX = (ele.offsetLeft - offsetX) + "px";
                    this.scrY = (ele.offsetTop - offsetY) + "px";

                    console.log("Move to:" + this.scrX + "," + this.scrY)
                }
            }
        },
        watch:{
            isMoving: function(val){
                if(val){ // isMoving
                    this.floating = true;

                    console.log("Floating div")
                }else{ // dropped and not moving
                    this.floating = false;

                    console.log("Embedded div")
                }
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .title_embedded{
        background-color: gray;
        text-align: left;
        float: left;
        cursor: move;
    }
    .content_container{
        border: 1px solid blue;
    }

    .div_floating{
        position: absolute;
    }

    .div_embedded{
        position: relative;
    }

</style>