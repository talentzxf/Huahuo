enum MovingStatus{
    SameLine,
    CrossLine
}

class TabMover{
    private static instance: TabMover;

    private constructor() {
    }

    public static getInstance(): TabMover{
        if(!TabMover.instance)
            TabMover.instance = new TabMover()

        return TabMover.instance
    }
}

export {TabMover}