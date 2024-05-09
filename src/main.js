import * as projectPanel from './projectPanel.js';
import * as webFooter from "./footer.js";
import * as loader from './loader.js';
import * as sectionHeader from "./sectionHeader.js"
import * as popoutWords from "./popoutWords.js"
import * as particles from "./particles.js"

//load project panels and display in the project section
let projectSection = document.querySelector('.projectSection')

function loadProjectPreviewData() {
    loader.projectData.projects.forEach(project => {
        let panel = new projectPanel.ProjectPanel(project.name, project.shortDescription, project.description, project.coverImage, loader.projectData.projects.indexOf(project));
        projectSection.appendChild(panel);

        panel.addEventListener("mousemove", (e) => {
            rotateElement(e, panel);
        })
    });
}

function loadProjectData() {
    //load info into section based on clicked panel/local storage

    let index = window.localStorage.getItem("scc8371-projectIndex");
    let project = loader.projectData.projects[index];
    console.log(project);

    let name = project.name;
    console.log(name);
    let link = project.link;
    let trailer = project.trailerEmbed;
    let role = project.role;
    let images = project.photoGallery;
    let teamSize = project.teamSize;
    let engine = project.engine;
    let tools = project.tools;
    let duration = project.duration;
    let docs = project.docs;
    let overview = project.overview;
    let goals = project.goals;
    let responsibilities = project.responsibilities;

    //header + trailer embeds
    if (name != null) document.querySelector(".modTitle").innerHTML = name;
    if (link != null) document.querySelector('.modButton').setAttribute("href", link);
    if (trailer != null) document.querySelector(".modFrame").setAttribute("src", trailer);


    let modP = document.querySelector(".modP");

    //game description.
    if (role) modP.innerHTML = `<u>Role</u>: ${role}`;
    if (teamSize) modP.innerHTML += `<br><u>Team Size</u>: <b>${teamSize}</b>`;
    if (engine) modP.innerHTML += `<br><u>Engine</u>: <b>${engine}</b>`;
    if (tools) modP.innerHTML += `<br><u>Tools Used</u>: <b>${tools}</b>`;
    if (duration) modP.innerHTML += `<br><u>Time Spent on Project</u>: <b>${duration}</b>`;
    if (docs) modP.innerHTML += `<br><br><a href=${docs}>Click Here to View Project Documentation</a>`
    if (overview) modP.innerHTML += `<hr><u>Overview</u>: <br>&emsp;<b>${overview}</b>`;
    if (goals) {
        modP.innerHTML += `<br><br><u>My Goals With This Project</u>: <ul>`;

        for (let goal of goals) {
            modP.innerHTML += `<li><b>${goal}</b></li>`;
        }

        modP.innerHTML += `</ul>`;
    }

    if (responsibilities) modP.innerHTML += `<hr><u>Responsibilities</u>: <br>&emsp;<b>${responsibilities}</b>`;

    let imageSection = document.querySelector(".imgSection");

    if (images) {
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


export { loadProjectPreviewData, loadProjectData };

