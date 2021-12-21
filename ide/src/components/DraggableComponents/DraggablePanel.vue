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
        mounted(){
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
            },
            getRenderOrder(itemId){
              return this.idSlotMap.get(itemId).renderOrder
            },
            setRenderOrder(itemId, inRenderOrder){
              this.idSlotMap.get(itemId).renderOrder = inRenderOrder
            },
            titleEvent(targetId){
                this.idSlotMap.forEach(
                    value => {
                        let itemId = value.itemId
                        let content = value.content

                        if(itemId === targetId){
                            content.props["active"] = true;
                            this.curSelectedItem = targetId;
                        }else{
                            content.props["active"] = false;
                        }
                    }
                )
            }
        },
        render: function () {
            let titleBarArray = [];

            let contentArray = [];

            let titleObjArray = Array.from(this.idSlotMap.values()).sort( (objA, objB)=>{
              return objA.renderOrder - objB.renderOrder
            })

            titleObjArray.forEach(
                value => {
                    let title = value.title
                    let itemId = value.itemId
                    let content = value.content

                    let selected = itemId == this.curSelectedItem;

                    titleBarArray.push(h(DraggableTitle, {
                        title: title,
                        selected: selected,
                        itemId: itemId,
                        onTabSelected: this.titleEvent
                    }))

                    content.props["active"] = selected
                    contentArray.push(content)
                }
            )

            let titleBarDiv = h(TitleBarHolder, titleBarArray)

            return h("div", {class:"draggle_panel"} ,[titleBarDiv, contentArray]);
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

    .draggle_panel{
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