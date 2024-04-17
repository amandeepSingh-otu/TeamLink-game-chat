let ws;
let code;
let gameLogic;
function startGame(){
    gameLogic = new GameLogic("canvaMulti");
    blockRollButton();
}
function newRoom(){
    // calling the ChatServlet to retrieve a new room ID
    //this function also assign the  depending on who created the room.
    let callURL= "http://localhost:8080/WSChatServer-1.0-SNAPSHOT/chat-servlet";
    clearMessageArea();
    fetch(callURL, {
        method: 'GET',
        headers: {
            'Accept': 'text/plain',
        },
    })
        .then(response => response.text())
        .then(response => enterRoom(response)).then(response=>unBlockRollButton()); // enter the room with the code
}
function clearMessageArea(){
    document.getElementById("messageArea").innerHTML = "";
}

function getRooms(){
    // calling the servlets to get the room code
    /*
    * This return codes in csv format like LKMNQ, ABCDE, .......
    */
    let callURL= "http://localhost:8080/WSChatServer-1.0-SNAPSHOT/room-info-servlets";
    fetch(callURL, {
        method: 'GET',
        headers: {
            'Accept': 'text/plain',
        },
    })
        .then(response => response.text())
        .then(response => addRooms(response)); // enter the room with the code
}
function getUsers(){
    // calling the api to get the data about users in the room;
    /*
    * This return the users in csv format like Aman, josiah, simon ......
    */

   let  userList;
    let callURL= "http://localhost:8080/WSChatServer-1.0-SNAPSHOT/user-Inroom-servlets/"+code;
    fetch(callURL, {
        method: 'GET',
        headers: {
            'Accept': 'text/plain',
        },
    })
        .then(response => response.text()).then(response => addUsers(response));
    return userList

}

//this will take the return response (user names) from api and split it and add to list
function addUsers(response){
    let users=response.split(",");
    let userList = document.getElementById("addUsers");
    userList.innerHTML=""
    if(users!=null){
        users.forEach(function(user) {
            let listItem = document.createElement("li");
            if(user.trim()!=="") {
                listItem.textContent = user.trim();
                userList.appendChild(listItem);
            }
        });
    }
}
//this will take the return response( room names) from api and split it and add to list as button
function addRooms(response){

    let users=response.split(",");
    //console.log(users);
    let userList = document.getElementById("addRooms");
    userList.innerHTML=""
    if(users!=null){
        users.forEach(function(user) {
            let listItem = document.createElement("li");
           // console.log("User trim"+user.trim());
            if(user.trim()!=="") {
                listItem.textContent = user.trim();
                userList.appendChild(listItem);
                getRoomMsgs(listItem,user.trim());
            }

        });
    }
}
// adds event listener to evey room list element that changes the chatroom to the one clicked
function getRoomMsgs(listItem, roomcode) {
    listItem.addEventListener('click', function(event) {
        clearMessageArea();

       enterRoom(roomcode);
        getRooms();
        getUsers();
    });
}



//this function generates time stamp for the chat

function timestamp() {
    let d = new Date(), minutes = d.getMinutes();
    if (minutes < 10) minutes = '0' + minutes;
    return d.getDay()+"/"+d.getMonth()+"/"+d.getFullYear()+" at "+d.getHours() + ':' + minutes;
}


//this function takes code and let you enter the room, can be used to enter and existing room or new room
function enterRoom(response){

  //  console.log("enter room response"+response);
    code=response.substring(0,5)



    if(ws!==undefined){
        ws.close();
        startGame();
        ws=undefined;
   }
    // create the web socket
    ws = new WebSocket("ws://localhost:8080/WSChatServer-1.0-SNAPSHOT/ws/"+code);
    document.getElementById("roomMessage").innerHTML ="You are currently in the room "+code;
    // parse messages received from the server and update the UI accordingly
    ws.onmessage = function (event) {
        //console.log(event.data);
        // parsing the server's message as json
        let message = JSON.parse(event.data);
        // handle message
        console.log(message.type,message.message);
        //Case we have a userName
        if (message.userName != null){

                document.getElementById("messageArea").innerHTML +=
                    "<p><div class = messageHeader><span class='userName'>" + message.userName +
                    "</span><span class='timeStamp'>[" + timestamp() + "]</span></div> <span id=normalMsg'> " +
                    message.message + "</span></p>";

        } else{
            if(message.type==="roll"){
                gameLogic.main(parseInt(message.message),1)
                unBlockRollButton();

            }
            else {
                document.getElementById("messageArea").innerHTML += "<p id='joiningMessage'>" + message.message + "<span class='timeStamp'>[" + timestamp() + "] </span> </p" +
                    ">";
            }
        }

        refresh();
    }

}

//Listen to the event of pressing key and send message to the server

sendMessageUsingEnter=function (event) {
    if (event.key === "Enter" && event.target.value!=='') {
        //we gonna send the room number in the message so it's easier on backend to identify the message
        let request = {"type": "chat","roomId":code, "msg": event.target.value};
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(request));
            event.target.value = "";
        } else {
            console.error("WebSocket connection not open.");
        }
    }
};
function sendRollNumber(steps){
    refresh();
    let request = {"type": "roll","roomId":code, "msg": steps.toString()};

        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(request));
            console.log(request);
        } else {
            console.error("WebSocket connection not open.");
        }
}

//Listen to the event of clicking send button and send message to the server
function sendMessage(){
    refresh();
    let inputMessage=document.getElementById("chatInput");
    if (inputMessage.value!=='') {
        let request = {"type": "chat","roomId":code, "msg": inputMessage.value};

        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(request));
            inputMessage.value = "";
        } else {
            console.error("WebSocket connection not open.");
        }
    }
}
//get the room initially
getRooms();

//update the data about rooms and users
function refresh(){
    //this refresh the list of room present
    getRooms();
    getUsers();
}

let gameLoopRunner;
function gameLoop(){
          gameLoopRunner=setInterval(function(){
              if(gameLogic.gameOver()!==-1){
                  //write what to do on ethe game over
                  clearInterval(gameLoopRunner);
              }
          },10)
}


function blockRollButton(){
    document.getElementById('rollTheDice').disabled = true;
    document.getElementById('rollTheDice').onclick = null;
}
function  unBlockRollButton(){
    document.getElementById('rollTheDice').disabled = false;
    document.getElementById('rollTheDice').onclick = roll;
}
function roll(){
    let steps=gameLogic.rollDice();
    sendRollNumber(steps);
    gameLogic.main(steps,0)
    blockRollButton();
}
