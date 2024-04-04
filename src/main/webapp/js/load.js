let divBody=document.getElementById("right-section").innerHTML;

window.addEventListener("load", loadMainPage);
function loadAbout(){
    //removing all event listeners before switching the page
    let inputMessage=document.getElementById("chatInput");
    inputMessage.removeEventListener("keyup", sendMessageUsingEnter);
    divBody=document.getElementById("right-section").innerHTML;
    document.getElementById("right-section").innerHTML='<object type="text/html" data="about.html" ' +
        'width="100%" height="100%"></object>'


}
function loadMainPage(){
    //adding all event listeners  before switching the page
    document.getElementById("right-section").innerHTML = divBody;
    let inputMessage=document.getElementById("chatInput");
    inputMessage.addEventListener("keyup", sendMessageUsingEnter);
    console.log("Main");

}