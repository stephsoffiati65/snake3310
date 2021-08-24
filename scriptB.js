
    let canvas = document.createElement('canvas');
    let div = document.querySelector('div');
    let image = document.querySelector('img');
    let canvasWidth = 350;
    let canvasHeight = 233;
    let blocksize = 12;
    let widthInBlocks = canvasWidth / blocksize;
    let heightInBlocks = canvasHeight / blocksize;
    let ctx;
    let delay = 100;
    let boa;
    let golden;
    let score;
    let timeout;
      
    init();

    function init() {

        document.body.addEventListener("keyup", evt => {
            console.log(evt.key);
            if (evt.key === " ") {
                image.style.display = "none";
                canvas.width = canvasWidth;
                canvas.height = canvasHeight;
                div.appendChild(canvas);
                ctx = canvas.getContext('2d');
                boa = new Snake([[7, 4], [6, 4], [5, 4], [4, 4]], "right");
                golden = new Apple([10, 10]);
                score = 0;
                refreshCanvas();
            }
        });

        
    }

    function refreshCanvas() {
        canvas.style.backgroundColor = "#52723F";
        boa.advance(); 
        if (boa.checkCollision()) {
            gameOver();
            
        } else {
            if(boa.isEatingApple(golden)){
                score ++;
                boa.ateApple = true;
                do {
                    golden.setNewPosition();
                }
                while (golden.isOnSnake(boa))
            }
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);
            drawScore();
            boa.draw();
            golden.draw(); 
            timeout = setTimeout(refreshCanvas, delay);
        }
    }

    function restart(){
        boa = new Snake([[7,4], [6, 4], [5, 4], [4, 4]], "right");
        golden = new Apple([10, 10]);
        score = 0;
        clearTimeout(timeout);
        refreshCanvas();
    }

    function drawScore(){
        ctx.save();
        ctx.font = "bold 15px sans-serif";
        ctx.fillStyle = "090D00";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        let centreX = 30;
        let centreY = 10;
        ctx.fillText("Score: " + score.toString(), centreX, centreY);
        ctx.restore();
    }

    function drawBlock(ctx, position) {
        let x = position[0] * blocksize;
        let y = position[1] * blocksize;
        ctx.fillRect(x, y, blocksize, blocksize);
    } 
    
    function gameOver(){
        ctx.save();
        let audio = new Audio('son.mp3');
        audio.play();
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        canvas.style.backgroundColor = "#73A582";
        ctx.font = "bold 40px Joystix";
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.lineWidth = 5;
        let centreX = canvasWidth / 2;
        let centreY = canvasHeight / 2;
        ctx.fillText("Game Over", centreX, centreY-80);
        ctx.font = "bold 15px Joystix";
        ctx.fillText("Ton score est de " + score + " points", centreX, centreY-50);
        ctx.font = "bold 10px Joystix";
        ctx.fillText("Appuyez sur la touche ESPACE pour rejouer", centreX, centreY +20);
        ctx.restore();
    }

    function Snake(body, direction) {
        this.body = body;
        this.direction = direction;
        this.ateApple = false;
        this.draw = function () {
            ctx.save();
            ctx.fillStyle = "090D00";
            for (let i = 0; i < this.body.length; i++) {
                drawBlock(ctx, this.body[i]);
            }
            ctx.restore();
        };
        this.advance = function () {
            let nextPosition = this.body[0].slice();
            switch (this.direction) {
                case "left":
                    nextPosition[0]--;
                    break;
                case "right":
                    nextPosition[0]++;
                    break;
                case "down":
                    nextPosition[1]++;
                    break;
                case "up":
                    nextPosition[1]--;
                    break;
                default:
                    throw ("Invalid Direction");
            }
            this.body.unshift(nextPosition);
            if(!this.ateApple){
                this.body.pop();
            } else {
                this.ateApple = false;
            }          
        };
        this.setDirection = function (newDirection) {
            let allowedDirections;
            switch (this.direction) {
                case "left":
                case "right":
                    allowedDirections = ["up", "down"];
                    break;
                case "down":
                case "up":
                    allowedDirections = ["left", "right"];
                    break;
                default:
                    throw ("Invalid Direction");
            }
            if (allowedDirections.indexOf(newDirection) > -1) {
                this.direction = newDirection;
            }
        };
        this.checkCollision = function () {

            let wallCollision = false;
            let snakeCollision = false;
            let head = this.body[0];
            let rest = this.body.slice(1);
            let snakeX = head[0];
            let snakeY = head[1];
            let minX = 0;
            let minY = 0;
            let maxX = widthInBlocks - 1;
            let maxY = heightInBlocks - 1;
            let isNotBetweenHwalls = snakeX < minX || snakeX > maxX;
            let isNotBetweenVwalls = snakeY < minY || snakeY > maxY;

            if (isNotBetweenHwalls || isNotBetweenVwalls) {
                wallCollision = true;
            }

            for (let i = 0; i < rest.length; i++) {
                if (snakeX === rest[i][0] && snakeY === rest[i][1]) {
                    snakeCollision = true;
                }
            }
            return wallCollision || snakeCollision;
        };

        this.isEatingApple = function(appleToEat){
            let head = this.body[0];
            if(head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1]){
                return true;
            }else{
               return false;
            }
        };

    }

    function Apple(position) {

        this.position = position;
        this.draw = function () {
            ctx.save();
            ctx.fillStyle = "090D00";
            ctx.beginPath();
            let radius = blocksize / 2;
            let x = this.position[0] * blocksize + radius;
            let y = this.position[1] * blocksize + radius;
            ctx.arc(x, y, radius, 0, Math.PI * 2, true);
            ctx.fill();
            ctx.restore();
        };

        this.setNewPosition = function() {

            let newX = Math.round(Math.random() * (widthInBlocks - 1));
            let newY = Math.round(Math.random() * (heightInBlocks - 1));
            this.position = [newX, newY];
        };

        this.isOnSnake = function(snakeToCheck) {
            let isOnSnake = false;
            for(let i=0; i < snakeToCheck.body.length; i++)
            {
                if(this.position[0] === snakeToCheck.body[i][0] && this.position[1] === snakeToCheck.body[i][1]){
                isOnSnake = true;  
                }
            }
            return isOnSnake;
        };

    }

    document.onkeydown = function handleKeyDown(e) {
        
        let key = e.key;
        let newDirection;
        switch (key) {
            case "ArrowLeft":
                newDirection = "left";
                break;
            case "ArrowUp":
                newDirection = "up";
                break;
            case "ArrowRight":
                newDirection = "right";
                break;
            case "ArrowDown":
                newDirection = "down";
                break;
            case " ":
                restart();
                break;  
            default:
                return;
        }
        boa.setDirection(newDirection);
    }

