let singleGameLogic;
let currentUser;


function startGameComp() {
    currentUser = 0;
    singleGameLogic = new GameLogic("canvaSingle");
    singleGameLogic.updateGame();
    blockRollButton();

    console.log("Display Game works!")
}

function startGame(){
    singleGameLogic = new GameLogic("canvaSingle");
    singleGameLogic.updateGame();
    unBlockRollButton();
    console.log("Start Game works!")
}



function singleRoll(){
    let diceResult = singleGameLogic.rollDice();
    if(singleGameLogic.gameOver()!==-1){
        blockRollButton();
    }
    else{
        singleGameLogic.main(diceResult,currentUser)
        diceResult = singleGameLogic.rollDice()
        singleGameLogic.updateGame();
        setTimeout(() => {  singleGameLogic.main(diceResult,1); }, 2000)
        singleGameLogic.updateGame();
    }
    console.log("Roll worked");
}

function aiTurn() {
    if (!gameOver && currentPlayer === 1) {
        const diceRoll = Math.floor(Math.random() * 6) + 1;
        movePlayer(currentPlayer, diceRoll);
        switchPlayer();
    }
    console.log("Ai's Turn");
}

//to block user from rolling the dice if it's not their turn
function blockRollButton(){
    document.getElementById('rollTheDice').disabled = true;
    document.getElementById('rollTheDice').onclick = null;
}

//unblock user when it is their turn
function  unBlockRollButton(){
    document.getElementById('rollTheDice').disabled = false;
    document.getElementById('rollTheDice').onclick = roll;
}
