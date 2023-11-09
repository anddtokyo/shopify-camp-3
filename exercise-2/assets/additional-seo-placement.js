class CollectionDescription extends HTMLElement {
  constructor() {
    super();
    this.addEventListener("click", function (event) {
      const sectionId = this.getAttribute("data-collection-id");
      const textElement = document.getElementById(
        `collection__description__text-${sectionId}`
      );
      const button = document.getElementById(
        `collection__description__button-${sectionId}`
      );

      const currentStyle = textElement.style.cssText;

      if (currentStyle.includes("-webkit-line-clamp: 2;")) {
        const updatedStyle = currentStyle.replace("-webkit-line-clamp: 2;", "");
        textElement.style.cssText = updatedStyle;
        button.style.transform = "rotate(180deg)";
      } else {
        textElement.style.cssText = currentStyle + " -webkit-line-clamp: 2;";
        button.style.transform = "rotate(0deg)";
      }
    });
  }
}

customElements.define("collection-description", CollectionDescription);
