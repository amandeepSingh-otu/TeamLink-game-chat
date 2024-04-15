let divBody=document.getElementById("right-section").innerHTML;

window.addEventListener("load", loadMainPage);
function loadAbout(){
    //removing all event listeners before switching the page
    fetch('about.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('Start').innerHTML = html;
            let inputMessage = document.getElementById('chatInput');
            inputMessage.addEventListener('keyup', sendMessageUsingEnter);
            console.log('Main');
        })
        .catch(error => {
            console.error('Error loading Multiplayer.html:', error);
        });


}
function loadMainPage(){

}
function loadMultiplayer(){
    console.log("Multiplayer");
   // adding all event listeners  before switching the page
    fetch('Multiplayer.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('Start').innerHTML = html;
            let inputMessage = document.getElementById('chatInput');
            inputMessage.addEventListener('keyup', sendMessageUsingEnter);
            console.log('Main');
        })
        .catch(error => {
            console.error('Error loading Multiplayer.html:', error);
        });

}

function loadCompVsHuman(){
    fetch('compVsPlayerSetup.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('Start').innerHTML = html;
            let inputMessage = document.getElementById('chatInput');
            inputMessage.addEventListener('keyup', sendMessageUsingEnter);
        })
        .catch(error => {
            console.error('Error loading Multiplayer.html:', error);
        });
}
function goBack(){
    window.location.href = 'index.html';
}