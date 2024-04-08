const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const tileSize = 50;
const numRows = 10;
const numCols = 10;

const player = {
    position: 0
};

//this is basically a list which
const snakesAndLadders = {
    16: 6,
    47: 26,
    49: 11,
    56: 53,
    62: 19,
    64: 60,
    87: 24,
    93: 73,
    95: 75,
    98: 78
};

// Load the background image
const backgroundImage = new Image();
backgroundImage.src = 'image.jfif'; // Replace 'path_to_background_image.jpg' with your image path

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

            let cellNum = row * numCols + col + 1;
            ctx.fillStyle = '#000';
            ctx.font = '16px Arial';
            ctx.fillText(cellNum, x + 10, y + 20);
        }
    }
}

function drawPlayer() {
    let row = Math.floor(player.position / numCols);
    let col = player.position % numCols;

    let x = col * tileSize + tileSize / 2;
    let y = row * tileSize + tileSize / 2;

    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fill();
}

function movePlayer(steps) {
    player.position += steps;
    if (snakesAndLadders[player.position]) {
        player.position = snakesAndLadders[player.position];
    }
}

function rollDice() {
    return Math.floor(Math.random() * 6) + 1;
}

function drawSnake(start, end) {
    let startX = (start % numCols) * tileSize + tileSize / 2;
    let startY = Math.floor(start / numCols) * tileSize + tileSize / 2;

    let endX = (end % numCols) * tileSize + tileSize / 2;
    let endY = Math.floor(end / numCols) * tileSize + tileSize / 2;

    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
}

function drawLadder(start, end) {
    let startX = (start % numCols) * tileSize + tileSize / 2;
    let startY = Math.floor(start / numCols) * tileSize + tileSize / 2;

    let endX = (end % numCols) * tileSize + tileSize / 2;
    let endY = Math.floor(end / numCols) * tileSize + tileSize / 2;

    ctx.strokeStyle = 'red';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
}

function drawSnakesAndLadders() {
    for (const [start, end] of Object.entries(snakesAndLadders)) {
        if (start < end) {
            drawLadder(start, end);
        } else {
            drawSnake(start, end);
        }
    }
}

function updateGame() {
    drawBoard();
    drawSnakesAndLadders();
    drawPlayer();
}

function main() {
    updateGame();

    document.addEventListener('keydown', function(event) {
        if (event.key === ' ') {
            let steps = rollDice();
            movePlayer(steps);
            updateGame();
        }
    });
}
