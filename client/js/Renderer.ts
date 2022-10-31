import { canvas, ctx } from '.';
import { TICK_RATE, TPS } from '../../shared/constants';
import { GameClient } from './Game';

export class Renderer {
    gameClient: GameClient;
    constructor(client) {
        this.gameClient = client;
    }
    update(delta: number, now: number) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const me = this.gameClient.players.get(this.gameClient.id);
        if (me == null) return;
        ctx.save();
        ctx.translate(-me.drawPos.x, -me.drawPos.y);
        ctx.translate(canvas.width / 2, canvas.height / 2);

        this.drawBoarders();
        this.gameClient.players.forEach(player => player.draw(delta, now));

        ctx.restore();
    }
    drawBoarders(): void {
        ctx.save();
        ctx.fillStyle = '#12291b';
        ctx.fillRect(0, 0, 1000, 1000);
        ctx.restore();
    }
}
