enum Directions {
    Up = 8,
    Down = 4,
    Right = 2,
    Left = 1,
}
export class KeyBoard {
    keyState: number;
    lastSend: number;
    directionUpdate: Function;
    constructor(callback) {
        this.keyState = 0;
        this.lastSend = 0;
        this.directionUpdate = callback;
        window.addEventListener('keydown', e => this.keydown(e.which));
        window.addEventListener('keyup', e => this.keyup(e.which));
    }
    keydown(which: number): void {
        if (which === 87 || which === 38) this.keyState |= Directions.Up;
        if (which === 83 || which === 40) this.keyState |= Directions.Down;
        if (which === 65 || which === 37) this.keyState |= Directions.Left;
        if (which === 68 || which === 39) this.keyState |= Directions.Right;
        this.keyChanged();
    }
    keyup(which: number): void {
        if (which === 87 || which === 38) this.keyState &= ~Directions.Up;
        if (which === 83 || which === 40) this.keyState &= ~Directions.Down;
        if (which === 65 || which === 37) this.keyState &= ~Directions.Left;
        if (which === 68 || which === 39) this.keyState &= ~Directions.Right;
        this.keyChanged();
    }
    keyChanged() {
        if (this.keyState !== this.lastSend) {
            this.directionUpdate(this.keyState);
            this.lastSend = this.keyState;
        }
    }
}
