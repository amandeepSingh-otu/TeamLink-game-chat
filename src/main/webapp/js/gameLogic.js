class GameLogic {
    constructor(canvaId) {
        this.ctx = document.getElementById(canvaId).getContext('2d');
        this.tileSize = 50;
        this.numRows = 10;
        this.numCols = 10;
        this.winner=-1;

        this.players = [
            { position: 0, color: 'black' },
            { position: 0, color: 'blue' }
        ];

        this.snakesAndLadders = {
            1:22,
            5:44,
            19:58,
            51:71,
            56:95,
            70:91,
            49:5,
            42:16,
            55:7,
            72:14,
            83:57,
            86:48,
            97:39


        };

        this.backgroundImage = new Image();
        this.backgroundImage.src = 'images/snakeAndLadderBoard.png';

    }

    drawBoard() {
        this.ctx.drawImage(this.backgroundImage, 0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        for (let row = 0; row < this.numRows; row++) {
            for (let col = 0; col < this.numCols; col++) {
                let x = col * this.tileSize;
                let y = row * this.tileSize;

                let cellNum;

                if (row % 2 === 0) {
                    cellNum = ((row - 10) * this.numCols + col) * -1;
                } else {
                    cellNum = ((9 - row) * 10 + col + 1);
                }
            }
        }
    }

    drawPlayer(player) {
        let row = Math.floor(player.position / this.numCols);
        let col;

        if (row % 2 === 0) {
            col = player.position % this.numCols;
        } else {
            col = this.numCols - 1 - (player.position % this.numCols);
        }

        let x = col * this.tileSize + this.tileSize / 2;
        let y = (this.numRows - row - 1) * this.tileSize + this.tileSize / 2;

        this.ctx.fillStyle = player.color;
        this.ctx.beginPath();
        this.ctx.arc(x, y, 20, 0, Math.PI * 2);
        this.ctx.fill();
    }

    movePlayer(player, steps) {
        let newPosition = player.position + steps;
        let finalPosition = newPosition;

        if (this.snakesAndLadders[newPosition]) {
            finalPosition = this.snakesAndLadders[newPosition];
        }

        let endRow = Math.floor(finalPosition / this.numCols);
        let endCol;
        if (endRow % 2 === 0) {
            endCol = finalPosition % this.numCols;
        } else {
            endCol = this.numCols - 1 - (finalPosition % this.numCols);
        }

        let endX = endCol * this.tileSize + this.tileSize / 2;
        let endY = (this.numRows - endRow - 1) * this.tileSize + this.tileSize / 2;

        let animationSteps = 10;
        let deltaX = (endX - player.x) / animationSteps;
        let deltaY = (endY - player.y) / animationSteps;
        let currentStep = 0;

        let animationInterval = setInterval(() => {
            player.x += deltaX;
            player.y += deltaY;
            currentStep++;

            if (currentStep >= animationSteps) {
                player.position = finalPosition;
                clearInterval(animationInterval);
                if(finalPosition>=99){
                        //end game
                    this.winner=player.position;
                }
                this.updateGame();

            } else {
                this.updateGame();
            }
        }, 50);

    }

    rollDice() {
        return Math.floor(Math.random() * 6) + 1;
    }

    updateGame() {
        this.drawBoard();
        this.players.forEach(player => this.drawPlayer(player));
    }

    gameOver(){
        return this.winner;
    }
    main(stepSize,playerNumber) {
        this.updateGame();
        let currentPlayer = this.players[playerNumber];
        console.log(`${currentPlayer.color} rolled: ${stepSize}`);
        this.movePlayer(currentPlayer, stepSize);
        this.updateGame();
    }
}
