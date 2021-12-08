class Vector2D{
    public X:Number
    public Y:Number

    public constructor(X:number,Y:number) {
        this.X = X
        this.Y = Y;
    }

    equals(otherX: number, otherY: number){
        if(this.X === otherX && this.Y === otherY){
            return true;
        }
        return false;
    }
}

export {Vector2D}