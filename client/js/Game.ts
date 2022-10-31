import { Client } from 'wsbitpacket';
import { KeyBoard } from './KeyBoard';
import { Player } from './Player';
import { Renderer } from './Renderer';

export class GameClient {
    client: Client;
    port: number;
    renderer: Renderer;
    keyBoard: KeyBoard;
    id: number;
    players: Map<number, Player>;

    constructor(PORT: number) {
        this.port = PORT;
        this.renderer = new Renderer(this);
        this.client = new Client(`ws://localhost:${this.port}`);
        this.id = -1;
        this.players = new Map();
        this.keyBoard = new KeyBoard(keyState => {
            this.client.send('direction', { dir: keyState });
        });
        this.client.on('connection', () => {
            this.client.on('id', ({ id }) => {
                this.id = id;
                console.log('MY ID');
            });
            this.client.on('createPlayer', ({ id, x, y, name }) => {
                console.log('createPlayer');
                this.players.set(id, new Player(this, { id, x, y, name }, Date.now()));
            });
            this.client.on('updatePlayer', ({ id, x, y }) => {
                const time = Date.now();
                if (this.players.has(id)) {
                    const player = this.players.get(id) as Player;
                    player.netUpdate({ x, y }, time);
                }
            });
            this.client.on('deletePlayer', ({ id }) => {
                console.log('deletePlayer');
                this.players.delete(id);
            });
        });
        this.client.on('disconnect', () => {
            console.log('I have disconnected from the websocket');
        });
    }
}
