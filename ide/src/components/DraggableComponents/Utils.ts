class Utils{
    static SlotMap = new Map<any, number>();

    static curItemId: number = 1;

    static Event:any = require('tiny-emitter/instance');

    static GenerateItemId(): number{
        return Utils.curItemId++;
    }
    static getSlotId(slot:any): number{
        if(Utils.SlotMap.has(slot))
            return Utils.SlotMap.get(slot) as number;
        const itemId:number = Utils.GenerateItemId();
        Utils.SlotMap.set(slot, itemId)
        return itemId;
    }
}

export {Utils}