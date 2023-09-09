let template = `
    <span class='game-developer'>Game Developer</span>

    <style>
        .game-developer{
            color: #00A8E8;
            font-size: 1.35rem;

            font-family: 'Lalezar', cursive;
            text-shadow: 2px 0 #000, -2px 0 #000, 0 2px #000, 0 -2px #000,
        1px 1px #000, -1px -1px #000, 1px -1px #000, -1px 1px #000;

        }
    </style>
`

let template2 = `
    <span class='software-developer'>Software Developer</span>

    <style>
        .software-developer{
            color: #C1C1C1;
            font-size: 1.35rem;

            font-family: 'Lalezar', cursive;
            text-shadow: 2px 0 #000, -2px 0 #000, 0 2px #000, 0 -2px #000,
        1px 1px #000, -1px -1px #000, 1px -1px #000, -1px 1px #000;
        }
    </style>
`

let template3 = `
<span class='ui-developer'>Backend Developer</span>

<style>
    .ui-developer{
        color: #1E1E1E;
        font-size: 1.35rem;

        font-family: 'Lalezar', cursive;
            text-shadow: 2px 0 #000, -2px 0 #000, 0 2px #000, 0 -2px #000,
        1px 1px #000, -1px -1px #000, 1px -1px #000, -1px 1px #000;
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