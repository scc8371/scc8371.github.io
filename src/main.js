import * as projectPanel from './projectPanel.js';
import * as loader from './loader.js';

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