<script>
    import {h} from "vue"
    import DraggableItem from "./DraggableItem.vue"
    import DraggableTitle from "./DraggableTitle";
    import {Utils} from "./Utils"

    export default {
        name: "DraggableDiv",
        props: {
            title: String,
            width: Number,
            height: Number,
        },
        data() {
            return {
                slotMapInited: false,
                // id -> slot map
                idSlotMap: new Map(),
                curSelectedItem: -1
            }
        },
        methods: {
            initIdMap() {
                this.idSlotMap.clear();

                this.$slots.default().forEach(
                    slot => {
                        if (slot.type == DraggableItem) {
                            let slotTitle = slot.props["title"]
                            let itemId = Utils.getSlotId(slot)
                            this.idSlotMap.set(itemId, {title: slotTitle, itemId: itemId, content: slot})

                            if (this.curSelectedItem < 0) {
                                this.curSelectedItem = itemId;
                            }
                        }
                    }
                );
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
            if (!this.slotMapInited) {
                this.initIdMap()
                this.slotMapInited = true
            }
            let titleBarArray = [];

            let contentArray = [];

            this.idSlotMap.forEach(
                (value) => {
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

            return h("div", [titleBarArray, contentArray]);
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

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