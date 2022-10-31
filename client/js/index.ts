import { GameClient } from './Game';

const setCanvasSize = canvas => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
};

const startCanavs = () => {
    const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    window.addEventListener('resize', () => {
        setCanvasSize(canvas);
    });
    setCanvasSize(canvas);

    return { canvas, ctx };
};

export const { canvas, ctx } = startCanavs();

const game = new GameClient(3000);

let then: number = 0;
const loop = () => {
    const now = Date.now();
    const delta = (now - then) / 100;
    then = now;

    game.renderer.update(delta, now);
    requestAnimationFrame(loop);
};
loop();
