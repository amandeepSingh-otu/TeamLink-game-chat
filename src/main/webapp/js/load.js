let divBody=document.getElementById("right-section").innerHTML;


function loadAbout(){
    document.getElementById("right-section").innerHTML='<object type="text/html" data="about.html" ' +
        'width="100%" height="100%"></object>'
    console.log("About");

}
function loadMainPage(){
    document.getElementById("right-section").innerHTML = divBody;
    console.log("Main");

}