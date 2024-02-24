import icons from "url:../../img/icons.svg";
export default class View {
  _data;
  _clear() {
    this._parent.innerHTML = "";
  }
  renderSpinner = function () {
    const markup = `
      <div class="spinner">
      <svg>
        <use href="${icons}#icon-loader"></use>
      </svg>
    </div> 
      `;
    this._clear();
    this._parent.insertAdjacentHTML("afterbegin", markup);
  };
  /**
   * //Render the recived Object to the Dom
   * @param {Object | Object[]} data the data to be rendered(e.g.  recipe)
   * @param {boolean} [render=true] If false , return markeup String only without render to DOM
   * @returns {undefined | String } A markup string is returned if render is false
   * @this {Object} View instance
   * @author Mohamed Mahmoud
   */
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0)) return this.renderError();
    this._data = data;
    const markup = this._generateMarkup();
    if (!render) return markup;
    this._clear();
    this._parent.insertAdjacentHTML("afterbegin", markup);
  }
  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll("*"));
    const curElements = Array.from(this._parent.querySelectorAll("*"));
    newElements.forEach((element, i) => {
      const curEle = curElements[i];
      if (!element.isEqualNode(curEle) && curEle.firstChild?.nodeValue.trim() !== "") {
        curEle.textContent = element.textContent;
      }
      if (!element.isEqualNode(curEle)) Array.from(element.attributes).forEach((attr) => curEle.setAttribute(attr.name, attr.value));
    });
  }
  renderMessage(message = this._message) {
    const markup = `
        <div class="message">
              <div>
                <svg>
                  <use href="${icons}#icon-smile"></use>
                </svg>
              </div>
              <p>${message}</p>
            </div> 
      `;
    this._clear();
    this._parent.insertAdjacentHTML("afterbegin", markup);
  }
  renderError(message = this._errorMessage) {
    const markup = `
        <div class="error">
              <div>
                <svg>
                  <use href="${icons}#icon-alert-triangle"></use>
                </svg>
              </div>
              <p>${message}</p>
            </div> 
      `;
    this._clear();
    this._parent.insertAdjacentHTML("afterbegin", markup);
  }
}
