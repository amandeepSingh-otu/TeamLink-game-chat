let singleGameLogic;
let currentUser;


function startGameComp() {
    currentUser = 0;
    singleGameLogic = new GameLogic("canvaSingle");
    singleGameLogic.updateGame();
    blockRollButtonSingle();

    console.log("Display Game works!")
}





function singleRoll(){
    let diceResult = singleGameLogic.rollDice();
    if(singleGameLogic.gameOver()!==-1){
        blockRollButtonSingle();
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
function blockRollButtonSingle(){
    document.getElementById('singleDice').disabled = true;
    document.getElementById('singleDice').onclick = null;
}

//unblock user when it is their turn
function  unBlockRollButtonSingle(){
    document.getElementById('singleDice').disabled = false;
    document.getElementById('singleDice').onclick = roll;
}
