import previewView from "./previewView.js";
import View from "./view.js";
import icons from "url:../../img/icons.svg";
class ResultView extends View {
  _parent = document.querySelector(".results");
  _errorMessage = `Sorry this recipe not found , Please Try Again..!`;
  _message = "";

  addHandlerResults(handler) {
    this._parent.addEventListener("click", function (e) {
      const item = e.target.closest(".preview__link");
      if (!item) return;
      handler(item);
    });
  }
  _generateMarkup() {
    return this._data.map(bookmark=>previewView.render(bookmark,false)).join('');
  }
}
export default new ResultView();
