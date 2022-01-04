<script>
import {h} from "vue"
import DraggableItem from "./DraggableItem.vue"
import DraggableTitle from "./DraggableTitle";
import TitleBarHolder from "./TitleBarHolder";
import {Utils} from "./Utils"

export default {
  name: "DraggableDiv",
  props: {
    title: String,
    width: Number,
    height: Number,
  },
  mounted() {
    this.initIdMap()
  },
  data() {
    return {
      // id -> slot map
      idSlotMap: new Map(),
      curSelectedItem: -1
    }
  },
  methods: {
    initIdMap() {
      this.idSlotMap.clear();

      let renderOrder = 0
      this.$slots.default().forEach(
          slot => {
            // console.log("Initing slot")
            if (slot.type == DraggableItem) {
              let slotTitle = slot.props["title"]
              let itemId = Utils.getSlotId(slot)
              this.idSlotMap.set(itemId, {title: slotTitle, itemId: itemId, content: slot, renderOrder: renderOrder})

              if (this.curSelectedItem < 0) {
                this.curSelectedItem = itemId;
              }

              renderOrder++
            }
          }
      );

      // console.log("Init ID map")
      // this.debugIdSlotMap()
    },
    getRenderOrder(itemId) {
      // console.log("From getRenderOrder")
      // this.debugIdSlotMap()
      return this.idSlotMap.get(itemId).renderOrder
    },
    debugIdSlotMap() {
      // this.idSlotMap.forEach(value =>{
      //   let itemId = value.itemId
      //   let content = value.content
      //
      //   if(content.el != null)
      //     console.log("itemId:" + itemId + " is:" + content.el.innerHTML)
      // })
    },
    setRenderOrder(itemId, inRenderOrder) {

      this.idSlotMap.get(itemId).renderOrder = inRenderOrder
      // console.log("From setRenderOrder")
      // this.debugIdSlotMap()
    },
    titleEvent(targetId) {
      // console.log("From title event")
      //   this.debugIdSlotMap()

      this.idSlotMap.forEach(
          value => {
            let itemId = value.itemId
            let content = value.content

            if (itemId === targetId) {
              content.component.props["active"] = true;
              this.curSelectedItem = targetId;
            } else {
              content.component.props["active"] = false;
            }

            content.component.update()
          }
      )

      // console.log("After title event")
      // this.debugIdSlotMap()
    },
    debugRenderOrder(inTitleObjArray) {
      inTitleObjArray.forEach(obj => {
        console.log("Title:" + obj.title + " order:" + obj.renderOrder)
      })
    }
  },
  render: function () {
    let titleBarArray = [];

    let contentArray = [];

    let titleObjArray = Array.from(this.idSlotMap.values()).sort((objA, objB) => {
      return objA.renderOrder - objB.renderOrder
    })

    this.idSlotMap.forEach(value => {
      let itemId = value.itemId
      let content = value.content
      contentArray.push(content)

      if (itemId == this.curSelectedItem) {
        content.props["active"] = true
      } else {
        content.props["active"] = false
      }
    })

    this.debugIdSlotMap()
    // this.debugRenderOrder(titleObjArray)

    titleObjArray.forEach(
        value => {
          let title = value.title
          let itemId = value.itemId
          let selected = itemId == this.curSelectedItem;

          titleBarArray.push(h(DraggableTitle, {
            title: title,
            selected: selected,
            itemId: itemId,
            onTabSelected: this.titleEvent
          }))
        }
    )

    let titleBarDiv = h(TitleBarHolder, titleBarArray)
    // console.log("After render")
    // this.debugIdSlotMap()
    let obj = h("div", {class: "draggle_panel"}, [titleBarDiv, contentArray]);
    // console.log("After render again")
    // this.debugIdSlotMap()

    return obj
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.draggle_panel {
  display: flex;
  flex-direction: column;
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