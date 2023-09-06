const template = `

<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css">
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/css/bootstrap.min.css" rel="stylesheet"
  integrity="sha384-gH2yIJqKdNHPEq0n4Mqa/HGKIhSkIHeL5AyhkYV8i59U5AR6csBvApHHNl/vI1Bx" crossorigin="anonymous">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.2/css/all.min.css"
  integrity="sha512-1sCRPdkRXhBV2PBLUdRb4tMg1w2YPf37qatUFeS7zlBy7jJI8Lf4VHwWfZZfpXtYSLy85pkm9GaYVYMfw5BC1A=="
  crossorigin="anonymous" referrerpolicy="no-referrer" />
<link rel="stylesheet" href="styles/c_styles.css">
<link rel="stylesheet" href="styles/e_styles.css">
<link rel="stylesheet" href="styles/i_styles.css">

<div class="project-panel">
<div class="card">
  <img src="media/bottle-knights.png" class="card-img-top" alt="Default">
  <div class="card-body">   
  
  <h5 class="card-title">Default</h5>
    <p class="card-text">Default</p>
  </div>
</div>
</div>
`

class ProjectPanel extends HTMLElement {
    constructor(name, shortDescription, description, image, trailer, role, projectLink, images, left = true) {
        super();

        this.name = name;
        this.description = description;
        this.shortDescription = shortDescription;
        this.trailer = trailer;
        this.role = role;
        this.image = image;
        this.link = "project.html#project-desc-section";
        this.isLeft = left;
        this.projectLink = projectLink;
        this.images = images;


        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = template;
    }

    connectedCallback() {
        this.shadowRoot.querySelector('.card-img-top').src = this.image;
        this.shadowRoot.querySelector('.card-title').innerHTML = this.name;
        this.shadowRoot.querySelector('.card-text').innerHTML = this.description;

        this.shadowRoot.querySelector('.card').onclick = () => {
            location.href = this.link;
            //set in local storage
            window.localStorage.setItem("scc8371-name", this.name);
            window.localStorage.setItem("scc8371-activeLink", this.link);
            window.localStorage.setItem("scc8371-activeTrailer", this.trailer);
            window.localStorage.setItem("scc8371-activeRole", this.role);
            window.localStorage.setItem("scc8371-activeImages", this.images);
        }
        this.shadowRoot.querySelector('.card').style.cursor = "pointer";

        if (this.isLeft) {
            this.shadowRoot.querySelector('.card').classList.add('left');
        }
        else {
            this.shadowRoot.querySelector('.card').classList.add('right');
        }
    }

    static get observedAttributes() {
        return ['name', 'description', 'image', 'link', 'left'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case 'name':
                this.name = newValue;
                break;
            case 'description':
                this.description = newValue;
                break;
            case 'image':
                this.image = newValue;
                break;
            case 'link':
                this.link = newValue;
                break;;
            case 'left':
                this.isLeft = newValue;
                break;
        }
    }
}

customElements.define('project-panel', ProjectPanel);

export { ProjectPanel };