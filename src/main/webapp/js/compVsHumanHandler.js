let singleGameLogic;

document.addEventListener("DOMContentLoaded",function (){
    singleGameLogic = new GameLogic("canvaSingle");
    singleGameLogic.updateGame();
});
function startGameComp(){
    singleGameLogic = new GameLogic("canvaSingle");
    singleGameLogic.updateGame();
}

function singleRoll(){
    console.log("Roll worked");
}
