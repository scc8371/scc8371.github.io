import * as projectPanel from './projectPanel.js';
import * as loader from './loader.js';
import * as sectionHeader from "./sectionHeader.js"
import * as popoutWords from "./popoutWords.js"

//load project panels and display in the project section
let isLeft = true;
let projectSection = document.querySelector('.projectSection')

window.onload = () => {
    if (projectSection) loadProjectPreviewData();

    let projectDescSection = document.querySelector("#project-desc-section");

    if(projectDescSection){
        //load info into section based on clicked panel/local storage
        
        let name = window.localStorage.getItem("scc8371-name");
        let link = window.localStorage.getItem("scc8371-activeLink");
        let trailer = window.localStorage.getItem("scc8371-activeTrailer");
        let role = window.localStorage.getItem("scc8371-activeRole");
        let images = window.localStorage.getItem("scc8371-activeImages").split(',');

        if(name != null) document.querySelector(".modTitle").innerHTML = name;
        else document.querySelector(".modTitle").innerHTML = "Dark Matter";

        if(name != null){
            document.querySelector('.modButton').setAttribute("href", link);
            console.log('found link button!');
        } 
        else document.querySelector(".modButton").setAttribute("href", "https://prestosilver.itch.io/dark-matter");

        if(trailer != null) document.querySelector(".modFrame").setAttribute("src", trailer);
        else document.querySelector(".modFrame").setAttribute("src", "https://www.youtube.com/embed/OlgM1a4RoXk");

        if(role != null) document.querySelector(".modP").innerHTML = role;
        else document.querySelector(".modP").innerHTML = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus praesentium, nesciunt animi recusandae consequatur hic quasi. Perspiciatis, asperiores a? Voluptatum rem ex debitis vero possimus corrupti modi laborum consequatur exercitationem similique dolore harum minus est quisquam in voluptatem quasi consectetur labore, fuga obcaecati. Quisquam pariatur vel debitis error, nobis, illum nesciunt quis recusandae voluptate corporis non blanditiis adipisci veniam aliquam quod sint modi nihil totam tenetur ducimus? Inventore nobis eos expedita possimus modi maiores officia, voluptas iusto hic temporibus similique, amet tenetur impedit ab non laboriosam fugit architecto commodi. Ipsa, dignissimos tempora inventore provident culpa hic aliquam? Earum, animi delectus?";

        let imageSection = document.querySelector(".imgSection");

        if(images != null){
            for(let image of images){
                let img = document.createElement("img");
                img.setAttribute("src", image);
                img.classList.add("procImg");
                imageSection.appendChild(img);            
            }
        }
        else{
            let notice = document.createElement("p");
            p.innerHTML = "No images for this project!"
            imageSection.appendChild(notice);
        }
    }
}


function loadProjectPreviewData() {
    loader.projectData.projects.forEach(project => {
        let panel = new projectPanel.ProjectPanel(project.name, project.shortDescription, project.description, project.coverImage, project.trailerEmbed, project.role, project.link, project.photoGallery, isLeft);
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

