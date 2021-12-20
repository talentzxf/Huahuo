<template>
    <span ref="draggable_div_ref" class='title_embedded' :style="{
        border: selected?'5px solid gray': '1px solid blue',
        position: floating? 'absolute':'relative',
        left: scrX,
        top: scrY,
        marginLeft: marginLeft + 'px',
        zIndex: zIndex
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
    import {Utils} from "./Utils";
    import {Events} from "./Events";

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
            marginLeft: 0,
            zIndex: 0
          }
        },
        watch: {
          isMoving: function (val) {
            if (val) { // isMoving
              this.floating = true;
            } else { // dropped and not moving
              this.floating = false;
            }
          }
        },
        methods:{
            tabSelected(){
                this.$emit('tabSelected', this.itemId)
            },
            SetScrPos(X, Y){
              this.scrX = X + "px";
              this.scrY = Y + "px";
            },
            SetMarginLeft(marginLeft){
              this.marginLeft = marginLeft
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

              this.zIndex = 9999
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

              TabMover.getInstance().TryMove(this, new Vector2D(targetX, targetY))
            }
          },
          onMouseUp() {
            this.beginToMove = false;
            this.isMoving = false;
            this.scrX = 0;
            this.scrY = 0;

            document.onmousemove = null;
            document.onmouseup = null;
            this.zIndex = 0

            console.log("Emitting events.titledropped")
            Utils.Event.emit(Events.TitleDropped, {component: this})
          }
        },
        computed: {
          x: function() {
            return this.$refs.draggable_div_ref.offsetLeft
          },
          y: function(){
            return this.$refs.draggable_div_ref.offsetTop
          },
          width: function(){
            return this.$refs.draggable_div_ref.clientWidth
          },
          height: function(){
            return this.$refs.draggable_div_ref.clientHeight
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