window.onload = function () {

    let canvasWidth = 900;
    let canvasHeight = 600;
    let ctx;
    let x = 0;
    let y = 0;
    let delay = 100;

    init();

    function init() {
        let canvas = document.createElement('canvas');
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        document.body.appendChild(canvas);
        ctx = canvas.getContext('2d');
        refreshCanvas();
    }

    function refreshCanvas() {
        x += 3;
        y += 1;
        ctx.clearRect(0,0,canvasWidth,canvasHeight)
        ctx.fillStyle = 'green';
        ctx.fillRect(x, y, 80, 40);
        setTimeout(refreshCanvas, delay);
    }

}