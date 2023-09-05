import * as projectPanel from './projectPanel.js';
import * as loader from './loader.js';
import * as sectionHeader from "./sectionHeader.js"

//load project panels and display in the project section
let isLeft = true;
let projectSection = document.querySelector('.projectSection')

window.onload = () => {
    if (projectSection) loadProjectPreviewData();

    let projectDescSection = document.querySelector("#project-desc-section");

    if(projectDescSection){
        //load info into section based on clicked panel/local storage
        console.log(window.localStorage.getItem("scc8371-activeLink"));
        console.log(window.localStorage.getItem("scc8371-name"));
        console.log(window.localStorage.getItem("scc8371-activeTrailer"));
        console.log(window.localStorage.getItem("scc8371-activeRole"));
    }
}


function loadProjectPreviewData() {
    loader.projectData.projects.forEach(project => {
        let panel = new projectPanel.ProjectPanel(project.name, project.shortDescription, project.description, project.coverImage, project.trailerEmbed, project.role, project.link, isLeft);
        projectSection.appendChild(panel);
        isLeft = !isLeft;
    });
}


let scrollToTopButton = document.querySelector(".back-button");
let backToProjectsButton = document.querySelector(".backToProjectsButton");

if(backToProjectsButton && window.innerWidth <= 950){
    backToProjectsButton.classList.add("hidden");
    backToProjectsButton.style.left = "-100%";
}



window.onresize = () => {
    if(!backToProjectsButton) return;

    if(window.innerWidth > 950){
        backToProjectsButton.classList.add("shown");
        backToProjectsButton.classList.remove("hidden");
    }
    else{
        backToProjectsButton.classList.remove("shown");
        backToProjectsButton.classList.add("hidden");
    }
}


scrollToTopButton.addEventListener('click', scrollToTop);

let root = document.documentElement;

function scrollToTop() {
    root.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
};

window.onscroll = () => {
    let top = window.scrollY || root.scrollTop

    if (top > window.innerHeight) {
        scrollToTopButton.classList.remove("hidden");
        scrollToTopButton.classList.add("shown");

        if(backToProjectsButton){
            if(window.innerWidth <= 950){
                backToProjectsButton.classList.remove("hidden");
                backToProjectsButton.classList.add("shown");
            }
        }
    }
    else {
        scrollToTopButton.classList.add("hidden");
        scrollToTopButton.classList.remove("shown");

        if(backToProjectsButton){
            console.log(window.innerWidth);
            if(window.innerWidth <= 950){
                backToProjectsButton.classList.add("hidden");
                backToProjectsButton.classList.remove("shown");
            }
        }
    }
}

