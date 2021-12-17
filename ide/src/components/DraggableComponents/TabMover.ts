import {Vector2D} from "@/math/Vector2D";
import {ResponsibleChain} from "./ResponsibleChain";

class TabMoveParam {
    private ele: any
    private targetPos: Vector2D

    public constructor(inEle: any, inTargetPos: Vector2D) {
        this.ele = inEle
        this.targetPos = inTargetPos
    }
}

class TabMover{
    private static instance: TabMover;

    private handlerChain: ResponsibleChain<TabMoveParam>| null = null;

    private constructor() {
    }

    public static getInstance(): TabMover{
        if(!TabMover.instance)
            TabMover.instance = new TabMover()

        return TabMover.instance
    }

    public TryMove(obj: any, inTargetPos: Vector2D){
        this.handlerChain?.execute(new TabMoveParam(obj,inTargetPos))
    }
}

export {TabMover}