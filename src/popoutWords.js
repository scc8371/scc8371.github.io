let template = `
    <span class='game-developer'>Game Developer</span>

    <style>
        .game-developer{
            background-color: #00A8E8;
            outline: 3px solid #005B7F;
            border-radius: 10px;
            font-size: 1.35rem;
            margin-left: 0.25rem;
            margin-right: 0.25rem;
            box-shadow: 0px 0px 10px #00A8E8;

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
            background-color: #1E1E1E;
            outline: 3px solid #333333;
            border-radius: 10px;
            font-size: 1.35rem;

            margin-left: 0.25rem;
            margin-right: 0.25rem;
            box-shadow: 0px 0px 15px black;

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
        background-color:  #1E1E1E;
        outline: 3px solid #333333;
        border-radius: 10px;
        font-size: 1.35rem;

        margin-left: 0.25rem;
        margin-right: 0.25rem;
        box-shadow: 0px 0px 15px black;
        margin-top: -0.25rem;


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