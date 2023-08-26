
let xhr = new XMLHttpRequest();

let projectData = '';



xhr.onload = () => {
    if(xhr.status === 200){
        projectData = JSON.parse(xhr.responseText);
    }
}

xhr.open('GET', 'data/projects.json');
xhr.send();

export {projectData};