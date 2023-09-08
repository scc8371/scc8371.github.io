
import { loadProjectPreviewData } from "./main.js";

let xhr = new XMLHttpRequest();

let projectData = '';



xhr.onload = () => {
    if (xhr.status === 200) {
        projectData = JSON.parse(xhr.responseText);
        let projectSection = document.querySelector('.projectSection')
        if (projectSection) loadProjectPreviewData();
    }
}

xhr.open('GET', 'data/projects.json');
xhr.send();

export { projectData };