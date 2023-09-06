let template = `
    <span class='game-developer'>Game Developer</span>

    <style>
        .game-developer{
            background-color: #00A8E8;
            outline: 3px solid #005B7F;
            border-radius: 10px;
            font-size: 1.35rem;
            padding-left: 0.5rem;
            padding-right: 0.5rem;
            margin-left: 0.25rem;
            margin-right: 0.25rem;
        }
    </style>
`

let template2 = `
    <span class='software-developer'>Software Developer</span>

    <style>
        .software-developer{
            background-color: #1E1E1E;
            outline: 3px solid #333333;
            border-radius: 10px;
            font-size: 1.35rem;
            padding-left: 0.5rem;
            padding-right: 0.5rem;

            margin-left: 0.25rem;
            margin-right: 0.25rem;
        }
    </style>
`

let template3 = `
<span class='ui-developer'>UI/UX Designer</span>

<style>
    .ui-developer{
        background-color:  #FF6B6B;
        outline: 3px solid #FFD166;
        border-radius: 10px;
        font-size: 1.35rem;
        padding-left: 0.5rem;
        padding-right: 0.5rem;

        margin-left: 0.25rem;
        margin-right: 0.25rem;
    }
</style>
`

class GameDeveloper extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: "open" });
        this.shadowRoot.innerHTML = template;
    }
}

class SoftwareDeveloper extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: "open" });
        this.shadowRoot.innerHTML = template2;
    }
}

class UIDeveloper extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: "open" });
        this.shadowRoot.innerHTML = template3;
    }
}

customElements.define("game-developer", GameDeveloper);
customElements.define("software-developer", SoftwareDeveloper);
customElements.define("ui-designer", UIDeveloper);

export { GameDeveloper, SoftwareDeveloper, UIDeveloper };