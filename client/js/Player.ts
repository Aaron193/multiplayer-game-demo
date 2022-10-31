import { ctx } from '.';
import { TICK_RATE, TPS } from '../../shared/constants';
import { iSnapshot, iVec } from '../../types/globals';
import { drawCircle } from './draw';
import { GameClient } from './Game';
import { copyVec, lerp } from './utils';

export class Player {
    client: GameClient;
    id: number;
    name: string;
    serverPos: [iSnapshot, iSnapshot];
    drawPos: iVec;
    constructor(client, { id, x, y, name }, timestamp) {
        this.client = client;
        this.id = id;
        this.drawPos = {
            x: x,
            y: y,
        };

        this.serverPos = [
            // earlier
            {
                x: 0,
                y: 0,
                t: timestamp,
            },
            // later
            {
                x: 0,
                y: 0,
                t: timestamp - TICK_RATE,
            },
        ];
        this.name = name;
    }

    interpolate(now: number) {
        const snapshotA = this.serverPos[0];
        const snapshotB = this.serverPos[1];

        const lerpRatio = (now - snapshotA.t) / (snapshotB.t - snapshotA.t);

        this.drawPos.x = lerp(snapshotA.x, snapshotB.x, lerpRatio) + (snapshotB.x - snapshotA.x);
        this.drawPos.y = lerp(snapshotA.y, snapshotB.y, lerpRatio) + (snapshotB.y - snapshotA.y);
    }
    netUpdate({ x, y }, timestamp) {
        copyVec(this.serverPos[1], this.serverPos[0]);
        this.serverPos[1].t = this.serverPos[0].t;
        copyVec(this.serverPos[0], { x, y });
        this.serverPos[0].t = timestamp;
    }
    draw(delta: number, now: number) {
        this.interpolate(now);
        drawCircle(ctx, this.drawPos.x, this.drawPos.y, 30, 'red', 1);
        // draw server positions
        // drawCircle(ctx, this.serverPos[0].x, this.serverPos[0].y, 30, 'white', 0.3);
        // drawCircle(ctx, this.serverPos[1].x, this.serverPos[1].y, 30, 'blue', 0.3);
    }
}
