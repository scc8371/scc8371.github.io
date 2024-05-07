import * as projectPanel from './projectPanel.js';
import * as webFooter from "./footer.js";
import * as loader from './loader.js';
import * as sectionHeader from "./sectionHeader.js"
import * as popoutWords from "./popoutWords.js"
import * as particles from "./particles.js"

//load project panels and display in the project section
let isLeft = true;
let projectSection = document.querySelector('.projectSection')

window.onload = () => {
    let projectDescSection = document.querySelector("#project-desc-section");

    if (projectDescSection) {
        //load info into section based on clicked panel/local storage

        let name = window.localStorage.getItem("scc8371-name");
        let link = window.localStorage.getItem("scc8371-link");
        let trailer = window.localStorage.getItem("scc8371-trailer");
        let role = window.localStorage.getItem("scc8371-role");
        let images = JSON.parse(window.localStorage.getItem("scc8371-images").split(','));
        let teamSize = window.localStorage.getItem("scc8371-teamSize");
        let engine = window.localStorage.getItem("scc8371-engine");
        let tools = window.localStorage.getItem("scc8371-tools");
        let duration = window.localStorage.getItem("scc8371-duration");
        let docs = window.localStorage.getItem("scc8371-docs");
        let overview = window.localStorage.getItem("scc8371-overview");
        let goals = window.localStorage.getItem("scc8371-goals").split(',');
        let responsibilities = window.localStorage.getItem("scc8371-responsibilities");

        //header + trailer embeds
        if (name != null) document.querySelector(".modTitle").innerHTML = name;
        if (link != null) document.querySelector('.modButton').setAttribute("href", link);
        if (trailer != null) document.querySelector(".modFrame").setAttribute("src", trailer);


        let modP = document.querySelector(".modP");
        
        //game description.
        if (role != "undefined") modP.innerHTML = `Role: ${role}`;
        if(teamSize != "undefined") modP.innerHTML += `<br>Team Size: <b>${teamSize}</b>`;
        if(engine != "undefined") modP.innerHTML += `<br>Engine: <b>${engine}</b>`;
        if(tools != "undefined") modP.innerHTML += `<br>Tools Used: <b>${tools}</b>`;
        if(duration != "undefined") modP.innerHTML += `<br>Time Spent on Project: <b>${duration}</b>`;
        if(overview != "undefined") modP.innerHTML += `<hr>Overview: <br>&emsp;<b>${overview}</b>`;
        if(goals != "undefined"){
            modP.innerHTML += `<br><br>Goals: <ul>`;

            for(let goal of goals){
                modP.innerHTML += `<li><b>${goal}</b></li>`;
            }

            modP.innerHTML += `</ul>`;
        } 

        if(responsibilities != "undefined") modP.innerHTML += `<hr>Responsibilities: <br>&emsp;<b>${responsibilities}</b>`;

        if(docs != "undefined") modP.innerHTML += `<br><br><a href=${docs}>Click Here to View Project Documentation</a>`

        let imageSection = document.querySelector(".imgSection");

        if (images != null) {
            for (let image of images) {
                console.log(image);
                let container = document.createElement("div");


                let img = document.createElement("img");
                img.setAttribute("src", image.url);
                img.classList.add("procImg");

                let subtitle = document.createElement("span");
                subtitle.innerHTML = image.subtitle;

                container.appendChild(img);
                container.appendChild(subtitle);
                imageSection.appendChild(container);

                img.addEventListener("mousemove", (e) => {
                    rotateElement(e, img);
                });

                container.classList.add("imageContainer");
            }
        }
    }
}


function loadProjectPreviewData() {
    loader.projectData.projects.forEach(project => {
        let panel = new projectPanel.ProjectPanel(project.name, project.shortDescription, project.description, project.coverImage, project.trailerEmbed, project.role, project.link, project.photoGallery, project.teamSize, project.engine, project.tools, project.duration, project.docs, project.overview, project.goals, project.responsibilities);
        projectSection.appendChild(panel);

        panel.addEventListener("mousemove", (e) => {
            rotateElement(e, panel);
        })
    });
}


let scrollToTopButton = document.querySelector(".back-button");
let backToProjectsButton = document.querySelector(".backToProjectsButton");

if (backToProjectsButton && window.innerWidth <= 950) {
    backToProjectsButton.classList.add("hidden");
    backToProjectsButton.style.left = "-100%";
}



window.onresize = () => {
    if (!backToProjectsButton) return;

    if (window.innerWidth > 950) {
        backToProjectsButton.classList.add("shown");
        backToProjectsButton.classList.remove("hidden");
    }
    else {
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

        if (backToProjectsButton) {
            if (window.innerWidth <= 950) {
                backToProjectsButton.classList.remove("hidden");
                backToProjectsButton.classList.add("shown");
            }
        }
    }
    else {
        scrollToTopButton.classList.add("hidden");
        scrollToTopButton.classList.remove("shown");

        if (backToProjectsButton) {
            if (window.innerWidth <= 950) {
                backToProjectsButton.classList.add("hidden");
                backToProjectsButton.classList.remove("shown");
            }
        }
    }
}

function rotateElement(event, element) {
    //get mouse position
    const x = event.clientX + window.scrollX;
    const y = event.clientY + window.scrollY;

    const elementPos = getOffset(element);

    const middleX = elementPos.x + (elementPos.width / 2);
    const middleY = elementPos.y + (elementPos.height / 2);

    const offsetX = ((x - middleX) / elementPos.width) * 25;
    const offsetY = ((y - middleY) / elementPos.width) * 25;

    element.style.setProperty("--rotateX", -1 * offsetY + "deg");
    element.style.setProperty("--rotateY", offsetX + "deg");

}

function getOffset(el) {
    const rect = el.getBoundingClientRect();
    return {
        x: rect.left + window.scrollX,
        y: rect.top + window.scrollY,
        width: rect.width,
        height: rect.height
    };
}


export { loadProjectPreviewData };

