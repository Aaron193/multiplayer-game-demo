export function drawCircle(ctx, x, y, rad, color, alpha) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(x, y);
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(0, 0, rad, Math.PI * 2, 0);
    ctx.fill();
    ctx.restore();
}
