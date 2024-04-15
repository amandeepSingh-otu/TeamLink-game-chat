
//getting canvas onjects


const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let currentPlayerIndex=0;

//this will set the number of rows, columsn and tilesize
const tileSize = 50;
const numRows = 10;
const numCols = 10;

const players = [
    //at start both player gonna be at 0
    { position: 0, color: 'black' },
    { position: 0, color: 'blue' }
];


/*we are storing the positions related with snakes and ladder on the board in a hashmap, so in each step we can
 check if we are on snake or ladder, if we are we gonna update the position accordingly*/
const snakesAndLadders = {
    0: 37,
    3: 13,
    8: 30,
    16: 6,
    20: 41,
    27: 83,
    50: 66,
    53: 33,
    61: 17,
    63: 59,
    79: 98,
    86: 35,
    92: 72,
    94: 74,
    97: 78
};

// Load the background image
const backgroundImage = new Image();
backgroundImage.src = 'snakeAndLadderBoard.png';

// Once the image is loaded, start the game
backgroundImage.onload = function() {
    main();
};

function drawBoard() {
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
            let x = col * tileSize;
            let y = row * tileSize;

            let cellNum ;

            //we are assigning them number according to our picture so it would be helpful to find a pattern
            if (row % 2 === 0) {
                //this will let you go in increasing order from left to right according to board
                cellNum = ((row-10)*numCols+col)*-1;
            } else {
                //this will let you go in increasing order form right to left according to board
                cellNum = ((9-row)*10+col+1);
            }
        }
    }
}

//we add player to the game
function drawPlayer(player) {
    let row = Math.floor(player.position / numCols);
    let col;

    if (row % 2 === 0) {
        // For even rows, calculate the column from left to right
        col = player.position % numCols;
    } else {
        // For odd rows, calculate the column from right to left
        col = numCols - 1 - (player.position % numCols);
    }

    let x = col * tileSize + tileSize / 2;
    let y = (numRows - row - 1) * tileSize + tileSize / 2;

    ctx.fillStyle = player.color;
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fill();
}

//gonna take ouput from the some other function and update the info according
function movePlayer(player, steps) {
    let newPosition = player.position + steps;
    let finalPosition = newPosition;
    if(finalPosition==99){
        ctx.clear()
        ctx.write("player"+player.color+"has won")
    }
    if (snakesAndLadders[newPosition]) {
        finalPosition = snakesAndLadders[newPosition];
    }

    // Calculate cell coordinates for ending position
    let endRow = Math.floor(finalPosition / numCols);
    let endCol;
    if (endRow % 2 === 0) {
        endCol = finalPosition % numCols;
    } else {
        endCol = numCols - 1 - (finalPosition % numCols);
    }

    // Calculate pixel coordinates for ending position
    let endX = endCol * tileSize + tileSize / 2;
    let endY = (numRows - endRow - 1) * tileSize + tileSize / 2;

    // Animation parameters
    let animationSteps = 10; // Number of steps for the animation
    let deltaX = (endX - player.x) / animationSteps;
    let deltaY = (endY - player.y) / animationSteps;
    let currentStep = 0;

    // Animation loop
    let animationInterval = setInterval(() => {
        player.x += deltaX;
        player.y += deltaY;
        currentStep++;

        if (currentStep >= animationSteps) {
            player.position = finalPosition;
            clearInterval(animationInterval);
            updateGame();
        } else {
            updateGame();
        }
    }, 50);
}

function rollDice() {
    return Math.floor(Math.random() * 6) + 1;
}


function updateGame() {
    drawBoard();
    players.forEach(player => drawPlayer(player));
}

function main() {
    updateGame();


    //to make it comply with backend we need to get data from other user, so we gonna get steps from other person and run
    //steps over here
    document.addEventListener('keydown', function(event) {
        if (event.key === ' ') {
            let currentPlayer = players[currentPlayerIndex];
            let steps = rollDice();
            console.log(`${currentPlayer.color} rolled: ${steps}`);
            movePlayer(currentPlayer, steps);

            // Switch to the next player's turnaa
            currentPlayerIndex = (currentPlayerIndex + 1) % players.length;

            updateGame();
        }
    });
}