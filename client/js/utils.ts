export const lerp = (x: number, y: number, a: number) => x * (1 - a) + y * a;
export const copyVec = (a, b) => {
    a.x = b.x;
    a.y = b.y;
};
