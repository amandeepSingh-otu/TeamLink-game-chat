let singleGameLogic;
let currentUser;


function startGameComp() {
    currentUser = 0;
    singleGameLogic = new GameLogic("canvaSingle");
    singleGameLogic.updateGame();
    unBlockRollButtonSingle();


}

function singleRoll(){
    blockRollButtonSingle();
    let diceResult = singleGameLogic.rollDice();
    if(singleGameLogic.gameOver()!==-1){
        blockRollButtonSingle();
    }
    else{
        singleGameLogic.main(diceResult,currentUser)
        diceResult = singleGameLogic.rollDice()
        setTimeout(() => {  singleGameLogic.main(diceResult,1); unBlockRollButtonSingle();}, 2000)


    }
}



//to block user from rolling the dice if it's not their turn
function blockRollButtonSingle(){
    document.getElementById('singleDice').disabled = true;
    document.getElementById('singleDice').onclick = null;
}

//unblock user when it is their turn
function  unBlockRollButtonSingle(){
    document.getElementById('singleDice').disabled = false;
    document.getElementById('singleDice').onclick = singleRoll;
}
