import * as projectPanel from './projectPanel.js';
import * as loader from './loader.js';
import * as sectionHeader from "./sectionHeader.js"

//load project panels and display in the project section
let isLeft = true;
let projectSection = document.querySelector('.projectSection')
console.log(projectSection);

window.onload = () =>{
    loader.projectData.projects.forEach(project => {
        let panel = new projectPanel.ProjectPanel(project.name, project.description, project.image, project.link, isLeft);

        projectSection.appendChild(panel);
        isLeft = !isLeft;
    });
}

let scrollToTopButton = document.querySelector(".back-button");

scrollToTopButton.addEventListener('click', scrollToTop);

let root = document.documentElement;

function scrollToTop(){
    root.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
};

window.onscroll = () => {
    let top = window.scrollY || root.scrollTop

    if(top > window.innerHeight){
        console.log("true");
        scrollToTopButton.classList.remove("hidden");
        scrollToTopButton.classList.add("shown");
    }
    else{
        scrollToTopButton.classList.add("hidden");
        scrollToTopButton.classList.remove("shown");
    }
}

