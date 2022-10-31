enum Directions {
    Up = 8,
    Down = 4,
    Right = 2,
    Left = 1,
}
export class Player {
    socket: any;
    id: number;
    x: number;
    y: number;
    dir: number;
    speed: number;
    view: {
        halfWidth: number;
        halfHeight: number;
    };
    canSee: Set<number>;
    players: Map<number, Player>;
    name: string;
    constructor(players, ws, id, x, y) {
        this.players = players;
        this.socket = ws;
        this.socket.useStream();
        this.id = id;
        this.x = x;
        this.y = y;
        this.dir = 0;
        this.speed = 20;
        this.view = {
            halfWidth: 1920 / 2,
            halfHeight: 1080 / 2,
        };
        this.canSee = new Set();
        this.name = 'bob';
    }
    sendID() {
        this.socket.stream.add('id', { id: this.id });
    }
    createPlayer(player) {
        console.log('CREATING PLAYER');
        this.socket.stream.add('createPlayer', { id: player.id, x: player.x, y: player.x, name: player.name });
    }
    updatePlayer(player) {
        this.socket.stream.add('updatePlayer', { id: player.id, x: player.x, y: player.y });
    }
    deletePlayer(player) {
        this.socket.stream.add('deletePlayer', { id: player.id });
    }
    sendUpdate() {
        this.socket.stream.send();
        this.socket.stream.reset();
    }
    private updateMovement(delta) {
        let speed = this.speed;
        const vel = {
            x: 0,
            y: 0,
        };

        if ((this.dir & (this.dir - 1)) != 0) speed /= Math.SQRT2;

        if (this.dir & Directions.Left) vel.x -= speed;
        if (this.dir & Directions.Right) vel.x += speed;
        if (this.dir & Directions.Up) vel.y -= speed;
        if (this.dir & Directions.Down) vel.y += speed;

        this.x += vel.x * delta;
        this.y += vel.y * delta;
    }
    updateNetwork() {
        this.players.forEach(player => {
            if (this.hasView(player)) {
                if (!this.canSee.has(player.id)) {
                    // create this player
                    this.canSee.add(player.id);
                    this.createPlayer(player);
                } else {
                    // update player
                    this.updatePlayer(player);
                }
            } else if (this.canSee.has(player.id)) {
                this.deletePlayer(player);
                this.canSee.delete(player.id);
            }
        });
    }
    updatePhysics() {
        this.x = Math.min(Math.max(0, this.x), 1000);
        this.y = Math.min(Math.max(0, this.y), 1000);
    }
    update(delta: number): void {
        this.updateMovement(delta);
        this.updatePhysics();
        this.updateNetwork();
    }
    hasView(vec) {
        return this.x + this.view.halfWidth >= vec.x && this.x - this.view.halfWidth <= vec.x && this.y - this.view.halfHeight <= vec.y && this.y + this.view.halfHeight >= vec.y;
    }
}
