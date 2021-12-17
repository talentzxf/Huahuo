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
    import {TabMover} from "./TabMover";

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
            startMousePos: new Vector2D(0.0, 0.0),
            startElePos: new Vector2D(0.0, 0.0),
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
              this.startMousePos.X = evt.clientX;
              this.startMousePos.Y = evt.clientY;

              let ele = this.$refs.draggable_div_ref;
              this.startElePos.X = ele.offsetLeft
              this.startElePos.Y = ele.offsetTop

              document.onmousemove = this.onMouseMove;
              document.onmouseup = this.onMouseUp;
          },
          onMouseMove(evt) {
            if (this.beginToMove && !this.startMousePos.equals(evt.clientX, evt.clientY)) {
              this.isMoving = true;
            }

            if (this.isMoving) {
              let offsetX = evt.clientX - this.startMousePos.X;
              let offsetY = evt.clientY - this.startMousePos.Y;

              let targetX = this.startElePos.X + offsetX;
              let targetY = this.startElePos.Y + offsetY;

              TabMover.instance.TryMove(this, targetX, targetY)

              // // if the target position is still within the titlebar holder, just rearrange the tab order accordingly.
              // if(this.$parent.in(targetX, targetY)){
              //   this.scrX = targetX + "px";
              //   this.scrY = this.startElePos.Y + "px";
              // }else{
              //   this.scrX = targetX + "px";
              //   this.scrY = targetY + "px";
              // }
            }
          },
          onMouseUp() {
            this.beginToMove = false;
            this.isMoving = false;
            this.scrX = 0;
            this.scrY = 0;

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