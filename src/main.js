import * as projectPanel from './projectPanel.js';
import * as webFooter from "./footer.js";
import * as loader from './loader.js';
import * as sectionHeader from "./sectionHeader.js"
import * as popoutWords from "./popoutWords.js"
import * as particles from "./particles.js"

//load project panels and display in the project section
let projectSection = document.querySelector('.projectSection')

let url = window.location.href;
let predefProject;

let primaryBgColor = "#9a9a9a";
let secondaryBgColor = "#676767";
let thirdBgColor = "#343434";

let rt = document.querySelector(":root");
rt.style.setProperty("--primaryColor", primaryBgColor);
rt.style.setProperty("--secondaryColor", secondaryBgColor);
rt.style.setProperty("--trinaryColor", thirdBgColor);

let selectedColor;
let selectedElement = undefined;

let sidePanel = document.querySelector("#no-move");

let projectColor;
let centDiv;

window.requestAnimationFrame(update);

let cards = [];

let particleColor = "#FFFFF0";

const isMobile = {
    Android: function () {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function () {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function () {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function () {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function () {
        return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
    },
    any: function () {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};

if (url.includes("project=")) {
    let sstring = url.substring(url.indexOf("=") + 1);
    predefProject = sstring.split("%20").join(' ');
}

function loadProjectPreviewData() {
    loader.projectData.projects.forEach(project => {
        let panel = new projectPanel.ProjectPanel(project.name, project.shortDescription, project.description, project.coverImage, loader.projectData.projects.indexOf(project), project.icon, project.color);
        projectSection.appendChild(panel);

        cards.push(panel);

        panel.addEventListener("mousemove", (e) => {
            rotateElement(e, panel);
        });

        panel.addEventListener("mouseenter", (e) => {
            selectedColor = project.color;
            selectedElement = e.target;
        });

        panel.addEventListener("mouseleave", (e) => {
            selectedColor = undefined;
            selectedElement = undefined;
        });
    });
}

function update() {
    if (isMobile.any()) return;

    window.requestAnimationFrame(update);

    if (selectedElement != undefined) {
        let style = getComputedStyle(selectedElement);

        if (selectedColor != undefined) {
            let newColorPrimary = interpolate(style.getPropertyValue("--primaryColor"), selectedColor, 0.1);
            let newColorSecondary = interpolate(style.getPropertyValue("--primaryColor"), LightenColor(selectedColor, -50), 0.5);
            let newColorTrinary = interpolate(style.getPropertyValue("--primaryColor"), LightenColor(selectedColor, -150), 0.5);


            selectedElement.style.setProperty("--primaryColor", newColorPrimary);
            selectedElement.style.setProperty("--secondaryColor", newColorSecondary);
            selectedElement.style.setProperty("--trinaryColor", newColorTrinary);

            sidePanel.style.setProperty("--primaryColor", newColorPrimary);
            sidePanel.style.setProperty("--secondaryColor", newColorSecondary);
            sidePanel.style.setProperty("--trinaryColor", newColorTrinary);
        }


    }
    else {
        let style = getComputedStyle(sidePanel);

        let newColorPrimary;
        let newColorSecondary;
        let newColorTrinary;

        if (loader.projectDescSection && projectColor) {
            newColorPrimary = interpolate(style.getPropertyValue("--primaryColor"), projectColor, 0.1);
            newColorSecondary = interpolate(style.getPropertyValue("--primaryColor"), LightenColor(projectColor, -50), 0.5);
            newColorTrinary = interpolate(style.getPropertyValue("--primaryColor"), LightenColor(projectColor, -150), 0.5);

            centDiv.style.setProperty("--primaryColor", newColorPrimary);
            centDiv.style.setProperty("--secondaryColor", newColorSecondary);
            centDiv.style.setProperty("--trinaryColor", newColorTrinary);
        }
        else {

            newColorPrimary = interpolate(style.getPropertyValue("--primaryColor"), primaryBgColor, .1);
            newColorSecondary = interpolate(style.getPropertyValue("--primaryColor"), secondaryBgColor, .5);
            newColorTrinary = interpolate(style.getPropertyValue("--primaryColor"), thirdBgColor, .5);
        }

        sidePanel.style.setProperty("--primaryColor", newColorPrimary);
        sidePanel.style.setProperty("--secondaryColor", newColorSecondary);
        sidePanel.style.setProperty("--trinaryColor", newColorTrinary);
    }

    for (let card of cards) {
        let style = getComputedStyle(card);

        if (card != selectedElement && style.getPropertyValue("--primaryColor") != primaryBgColor) {
            let newColorPrimary = interpolate(style.getPropertyValue("--primaryColor"), primaryBgColor, 1);
            let newColorSecondary = interpolate(style.getPropertyValue("--primaryColor"), secondaryBgColor, 1);
            let newColorTrinary = interpolate(style.getPropertyValue("--primaryColor"), thirdBgColor, 1);


            card.style.setProperty("--primaryColor", newColorPrimary);
            card.style.setProperty("--secondaryColor", newColorSecondary);
            card.style.setProperty("--trinaryColor", newColorTrinary);
        }
    }
}

function loadProjectData() {
    //load info into section based on clicked panel/local storage

    let index = window.localStorage.getItem("scc8371-projectIndex");
    let previousIndex = window.localStorage.getItem("scc8371-previousProjectIndex");

    if (predefProject) {
        let newProject = loader.projectData.projects.find(project => project.name == predefProject);
        index = loader.projectData.projects.indexOf(newProject);
        window.localStorage.setItem("scc8371-projectIndex", index);
    }
    else if (previousIndex != "-1") {
        window.localStorage.setItem("scc8371-projectIndex", previousIndex);
        window.localStorage.setItem("scc8371-previousProjectIndex", "-1");
    }

    let project = loader.projectData.projects[index];

    centDiv = document.querySelector(".centered-div");

    let name = project.name;
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
    let retrospect = project.retrospect;
    projectColor = project.color;

    //header + trailer embeds
    if (name != null) document.querySelector(".modTitle").innerHTML = name;
    if (link != null) document.querySelector('.modButton').setAttribute("href", link);
    if (trailer != null) document.querySelector(".modFrame").setAttribute("src", trailer);
    else{
        let embedFrame = document.querySelector(".embed-responsive");
        embedFrame.parentElement.removeChild(embedFrame);
    } 


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
    if (retrospect) modP.innerHTML += `<hr><u>What I Would Have Done Differently</u>: <br>&emsp;<b>${retrospect}</b>`;

    let externalLinks = modP.querySelectorAll('.project-redir');

    externalLinks.forEach(link => {
        let projectName = link.dataset.name.split("%").join(" ").trim().replace('`', '').replace('`', "");

        let new_index = 0;
        let foundProject = false;

        loader.projectData.projects.forEach(project => {
            if (project.name == projectName) {
                foundProject = true;
            }
            else if (!foundProject) new_index++;
        });

        link.addEventListener("click", () => {
            console.log("here");
            window.localStorage.setItem("scc8371-projectIndex", new_index);
            window.localStorage.setItem("scc8371-previousProjectIndex", index);
        });
    });

    let imageSection = document.querySelector(".imgSection");

    if (images) {
        for (let image of images) {
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

    const offsetX = ((x - middleX) / elementPos.width) * 30;
    const offsetY = ((y - middleY) / elementPos.width) * 30;

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

function interpolate(color1, color2, percent) {
    // Convert the hex colors to RGB values
    const r1 = parseInt(color1.substring(1, 3), 16);
    const g1 = parseInt(color1.substring(3, 5), 16);
    const b1 = parseInt(color1.substring(5, 7), 16);

    const r2 = parseInt(color2.substring(1, 3), 16);
    const g2 = parseInt(color2.substring(3, 5), 16);
    const b2 = parseInt(color2.substring(5, 7), 16);

    // Interpolate the RGB values
    const r = Math.round(r1 + (r2 - r1) * percent);
    const g = Math.round(g1 + (g2 - g1) * percent);
    const b = Math.round(b1 + (b2 - b1) * percent);

    // Convert the interpolated RGB values back to a hex color
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function LightenColor(color, percent) {
    var num = parseInt(color.replace("#", ""), 16),
        amt = Math.round(2.55 * percent),
        R = (num >> 16) + amt,
        B = (num >> 8 & 0x00FF) + amt,
        G = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + (B < 255 ? B < 1 ? 0 : B : 255) * 0x100 + (G < 255 ? G < 1 ? 0 : G : 255)).toString(16).slice(1);
};


export { loadProjectPreviewData, loadProjectData, particleColor };

