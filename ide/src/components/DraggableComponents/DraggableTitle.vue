<template>
    <span ref="draggable_div_ref" class='title_embedded' :style="{
        border: selected?'5px solid gray': '1px solid blue',
        position: floating? 'absolute':'relative',
        left: scrX,
        top: scrY
    }"
    @click="tabSelected"
    v-on:mousedown.stop.prevent="onTitleMouseDown"
    >
        {{title}}
    </span>
</template>

<script>
    import {Vector2D} from "@/math/Vector2D"

    export default {
        name: "DraggableTitle",
        props: {
            title: String,
            selected: Boolean,
            itemId: Number
        },
        data: function (){
          return {
            beginToMove: false,
            isMoving: false,
            prevMousePos: new Vector2D(0.0, 0.0),
            floating: false,
            scrX: 0,
            scrY: 0,
          }
        },
        watch: {
          isMoving: function (val) {
            if (val) { // isMoving
              this.floating = true;

              console.log("Floating div")
            } else { // dropped and not moving
              this.floating = false;

              console.log("Embedded div")
            }
          }
        },
        methods:{
            tabSelected(){
                this.$emit('tabSelected', this.itemId)
            },
            onTitleMouseDown(evt) {
              this.beginToMove = true;
              this.prevMousePos.X = evt.clientX;
              this.prevMousePos.Y = evt.clientY;

              document.onmousemove = this.onMouseMove;
              document.onmouseup = this.onMouseUp;
          },
          onMouseMove(evt) {
            if (this.beginToMove && !this.prevMousePos.equals(evt.clientX, evt.clientY)) {
              this.isMoving = true;
            }

            if (this.isMoving) {

              console.log("Prev mouse X:" + this.prevMousePos.X)
              console.log("Prev mouse X:" + this.prevMousePos.Y)

              console.log("Cur mouse X:" + evt.clientX)
              console.log("Cur mouse Y:" + evt.clientY)

              let offsetX = evt.clientX - this.prevMousePos.X;
              let offsetY = evt.clientY - this.prevMousePos.Y;

              console.log("offsetX:" + offsetX)
              console.log("offsetY:" + offsetY)

              this.prevMousePos.X = evt.clientX;
              this.prevMousePos.Y = evt.clientY;

              let ele = this.$refs.draggable_div_ref;

              console.log("elemX" + ele.offsetLeft)
              console.log("elemY:" + ele.offsetTop)

              this.scrX = (ele.offsetLeft + offsetX) + "px";
              this.scrY = (ele.offsetTop + offsetY) + "px";

              console.log("new scrX" + this.scrX)
              console.log("new scrY" + this.scrY)
            }
          },
          onMouseUp() {
            this.beginToMove = false;
            this.isMoving = false;

            console.log("OnTitleMouseUp")
            document.onmousemove = null;
            document.onmouseup = null;
          },
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