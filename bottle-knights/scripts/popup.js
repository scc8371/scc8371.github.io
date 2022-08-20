"use strict";

//Derived from my project 2, summons a popup to the screen.

let body = null;
let popup = null;

//creates a popup that is shown on the screen.
function createPopup(){
    destroyPopup();
    //creates basic elements of the popup
    popup = document.createElement("div");

    //exit button
    let exit = document.createElement("button");
    exit.innerHTML = "X";
    exit.className = "exitButton";

    //exit button styles
    exit.onclick = destroyPopup;
    exit.addEventListener("click", playClick);
    exit.style.width = "4vw";
    exit.style.height = "4vw";


    popup.appendChild(exit);
    
    popup.className = "popup";
    popup.style.zIndex = "100000";
    
    body.appendChild(popup);

    return popup;

}

function destroyPopup(){
    let popups = document.querySelectorAll("div[class='popup']");

    //removes all popups of the body.
    for(let popup of popups){
        body.removeChild(popup);
    }
}

//runs when the window instantiates, assigns popup values.
let instantiatePopup = (e) =>{
    body =  document.querySelector("body");
}

window.addEventListener("load", instantiatePopup);

//gives helpful information about brawl stars to the user
function appendHelpPopup(description, type){

    switch(type){
        case "heading":
            let heading = document.createElement("h1");
            heading.innerHTML = description;
            popup.appendChild(heading);
        break;
        case "description":
            //paragraph
            let descriptionPopup = document.createElement("p");
            //general information
            descriptionPopup.innerHTML += description;    
            popup.appendChild(descriptionPopup);
        break;
    }
}

//creates a button on the popup that is 
//attached to a certain event
function createButton(description, event, id){
    let popupButton = document.createElement("button");
    popupButton.innerHTML = description;
    popup.appendChild(popupButton);
    popupButton.id = id;

    popupButton.onclick = event;

    return popupButton;
}