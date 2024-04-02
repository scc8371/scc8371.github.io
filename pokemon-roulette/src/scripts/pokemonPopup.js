const template = document.createElement("template");

template.innerHTML = `
    <link rel="stylesheet" href="src/bootstrap/main.css">
    <script src="src/bootstrap/bootstrap.bundle.min.js"></script>
    <script src="src/scripts/main.js" type="module"></script>
    <span id="pkmnID">
        <p class="container-fluid" id="pkmnName">Pokemon name</p>
            <span id="pkmnHead" class="container-fluid">
            <img src = "x" id="entImg">
            <span id="pkmnTypes" class="container-fluid">
            </span>        
        </span>
    </span>
`;

class PokemonPopup extends HTMLElement {
    pName = '';
    pTypes = [];
    pClassification = '';
    pDescription = '';
    pImg = ' ';


    constructor() {
        super();
        this.classList.add("pkmnPopup");
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
    updateDex() {
        let img = this.shadowRoot.querySelector("#entImg");
        img.src = this.pImg;

        let pkmnTypes = this.shadowRoot.querySelector("#pkmnTypes");
        
        while(pkmnTypes.firstChild){
            pkmnTypes.removeChild(pkmnTypes.firstChild);
        }

        this.pTypes.forEach(type => {
            let img = new Image;
            img.src = `resources/${type}.png`;
            img.classList.add("typeImg");
            pkmnTypes.appendChild(img);
        });

        let pkmnName = this.shadowRoot.querySelector("#pkmnName");
        pkmnName.innerHTML = this.pName;
    }

    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case 'name':
                this.pName = newValue;
                break;
            case 'types':
                this.pTypes = newValue.split(',');
                break;
            case 'classification':
                this.pClassification = newValue;
                break;
            case 'description':
                console.log(newValue);
                this.pDescription = newValue;
                break;
            case 'image':
                this.pImg = newValue;
                break;
        }

        this.updateDex();
    }

    static get observedAttributes() {
        return ['name', 'types', 'classification', 'description', 'image'];
    }
}

customElements.define("pokemon-popup", PokemonPopup);

export { PokemonPopup };