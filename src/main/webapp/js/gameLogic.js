
/*
*
* This is game logic class which takes canvas id in constructor and run the whole logic for
* the game, we have multiple function which can be called to update the position of player and
* update the board.
* the main entry point of this is main function where we can pass the step size and player number. it will
* then update the position of the player according to the step size
* some references and ideas on how to code some elements are taken from here
* https://www.geeksforgeeks.org/snake-ladder-problem-2/
*
* */
class GameLogic {

    //constructor to initiate everything
    constructor(canvaId) {
        //setting the tile and cell size according the picture we used and number of cells it has.
        this.ctx = document.getElementById(canvaId).getContext('2d');
        this.tileSize = 50;
        this.numRows = 10;
        this.numCols = 10;
        this.winner=-1;

        this.players = [
            { position: 0, color: 'black' },
            { position: 0, color: 'blue' }
        ];


        //this is basically hashmap, which mapping one cellNumber to another
        this.snakesAndLadders = {
            1:22,  //this one is a ladder since we are going from 5 to 22
            5:44,
            19:58,
            51:71,
            56:95,
            70:91,
            49:5,
            42:16,
            55:7,
            72:14, //this one is a snake since we are going from 72 to 14 ouch
            83:57,
            86:48,
            97:39


        };

        this.backgroundImage = new Image();
        this.backgroundImage.src = 'images/snakeAndLadderBoard.png';
        this.backgroundImage.onload=()=> {
            this.drawBoard();
            this.updateGame();
        }

    }

    //this basically draws board on the given canvas
    drawBoard() {
        this.ctx.drawImage(this.backgroundImage, 0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        //we gonna assign all the boxes a number so it is easier to deal with them
        for (let row = 0; row < this.numRows; row++) {
            for (let col = 0; col < this.numCols; col++) {
                let x = col * this.tileSize;
                let y = row * this.tileSize;

                let cellNum;

                if (row % 2 === 0) {
                    //flow of rows are different, so we are checking which row are we on to assign them accurate number
                    cellNum = ((row - 10) * this.numCols + col) * -1;
                } else {
                    cellNum = ((9 - row) * 10 + col + 1);
                }
            }
        }
    }

    //this basically draws the player based on their locations
    drawPlayer(player) {
        let row = Math.floor(player.position / this.numCols);
        let col;

        //cause flow of rows are in opposite direction for even and odd number, so we have to check what row are we on
        //and then choose the location accordingly
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


    //this function takes step size and player number to move the player according to the steps
    movePlayer(player, steps) {
        let newPosition = player.position + steps;
        let finalPosition = newPosition;


        //checking for the position of snakes and ladders
        if (this.snakesAndLadders[newPosition]) {
            finalPosition = this.snakesAndLadders[newPosition];
        }

        //check the placement of the column and rows based of our grid
        let endRow = Math.floor(finalPosition / this.numCols);
        let endCol;
        if (endRow % 2 === 0) {
            endCol = finalPosition % this.numCols;
        } else {
            endCol = this.numCols - 1 - (finalPosition % this.numCols);
        }

        let endX = endCol * this.tileSize + this.tileSize / 2;
        let endY = (this.numRows - endRow - 1) * this.tileSize + this.tileSize / 2;

        let animationSteps = 20;
        let deltaX = (endX - player.x) / animationSteps;
        let deltaY = (endY - player.y) / animationSteps;
        let currentStep = 0;


        //we tried to add animation to the movement but it's not what we expected. Anyway it does the job
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

    //generate random number between 1 and 6
    rollDice() {
        return Math.floor(Math.random() * 6) + 1;
    }


    //helper function to update the game
    updateGame() {
        this.drawBoard();
        this.players.forEach(player => this.drawPlayer(player));
    }

    //helper function for handlers to check if we have winner
    gameOver(){
        return this.winner;
    }

    //main entry point of the game, it will let you enter a step size and it will update the board
    main(stepSize,playerNumber) {
        this.updateGame();
        let currentPlayer = this.players[playerNumber];
        console.log(`${currentPlayer.color} rolled: ${stepSize}`);
        this.movePlayer(currentPlayer, stepSize);
        this.updateGame();
    }
}
