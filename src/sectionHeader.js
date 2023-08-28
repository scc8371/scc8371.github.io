
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

<div class="sectionHeader">
<hr class="sectionHeaderHr" / >
<h3 class="sectionHeaderH3"><slot name="text">Default Text</slot></h3>
</div>
`

class SectionHeader extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = template;
    }
}

customElements.define("section-header", SectionHeader);

export {SectionHeader};