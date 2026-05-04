export function updateBullets(bullets: any[], canvas: HTMLCanvasElement) {
    for (let i = bullets.length - 1; i >= 0; i--) {
        const bullet = bullets[i];

        bullet.update();

        if (
            bullet.position.x < 0 ||
            bullet.position.x > canvas.width ||
            bullet.position.y < 0 ||
            bullet.position.y > canvas.height
        ) {
            bullets.splice(i, 1);
        }
    }
}