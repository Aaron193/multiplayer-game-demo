export class IdPool {
    id: number;
    max: number;
    unused: number[];
    constructor() {
        this.id = 0;
        this.unused = [];
        this.max = 0xffff;
    }
    getNext(): number {
        const id = this.unused.pop() || this.id++;
        return id < this.max ? id : -1;
    }
    delete(id: number) {
        this.unused.push(id);
    }
}
