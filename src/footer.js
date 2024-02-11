const template = `<div>
    <p>Made by Sami Chamberlain</p>
    <p>Last Updated: 2/11/2024</p>  
</div>

<style>
        div{
            background-color: rgba(0, 0, 0, 0.8);
            color: white;
            margin: 0rem;

            display: flex;
            flex-direction: row;
            justify-content: space-between;
            
        }

        p{
            margin: 0.5rem;
            padding: 0rem;
            margin-left: 2rem;
            margin-right: 2rem;
        }
    </style>`;

class WebFooter extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = template;
    }
}

customElements.define("web-footer", WebFooter);

export { WebFooter };