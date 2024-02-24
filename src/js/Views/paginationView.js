import View from "./view";
import icons from "url:../../img/icons.svg";
class PaginationView extends View {
  _parent = document.querySelector(".pagination");
  _generateMarkup() {
    const curPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    // if in first page and not only one page
    if (curPage === 1 && numPages > 1)
      return this.#generateButton(curPage, "next");

    //last page
    if (curPage === numPages && numPages > 1)
      return this.#generateButton(curPage, "prev");

    //other Pages
    if (curPage < numPages)
      return this.#generateButton(curPage, "prev", "next");

    // only one page
    return "";
  }
  addHandlerButton(handler) {
    this._parent.addEventListener("click", function (e) {
      const btn = e.target.closest(".btn--inline");
      if (!btn) return;
      const page = +btn.dataset.page;
      handler(page);
    });
  }
  #generateButton(curPage, ...types) {
    return types
      .map((type) => {
        let newPage,
          contant = "";
        if (type === "next") {
          newPage = curPage + 1;
          contant = `
          <span>Page ${newPage}</span>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
          </svg>
          `;
        } else {
          newPage = curPage - 1;
          contant = `
          <svg class="search__icon">
          <use href="${icons}#icon-arrow-left"></use>
          </svg>
          <span>Page ${newPage}</span>
          `;
        }
        return `
      <button class="btn--inline pagination__btn--${type}" data-page =${newPage}>${contant}</button>`;
      })
      .join("\n");
  }
}
export default new PaginationView();
