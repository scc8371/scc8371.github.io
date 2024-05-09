
import { loadProjectPreviewData, loadProjectData } from "./main.js";

let xhr = new XMLHttpRequest();

let projectData = '';



xhr.onload = () => {
    if (xhr.status === 200) {
        projectData = JSON.parse(xhr.responseText);
        let projectDescSection = document.querySelector("#project-desc-section");
        let projectSection = document.querySelector('.projectSection')
        if (projectSection) loadProjectPreviewData();
        else if(projectDescSection) loadProjectData();
    }
}

xhr.open('GET', 'data/projects.json');
xhr.send();

export { projectData };