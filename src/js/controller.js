import * as model from "./Model.js";
import recipeView from "./Views/recipeView.js";
import searchView from "./Views/searchView.js";
import "core-js/stable";
import "regenerator-runtime/runtime";

const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    // Spinner
    recipeView.renderSpinner();
    // 1- loading Recipes
    await model.loadRecipe(id);
    // 2- Render Recipes
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError(err);
  }
};
// ["hashchange", "load"].forEach((ev) => window.addEventListener(ev, showRecipe));
const controlSearchResult = async function () {
  try {
    const query = searchView.getQuery();
    if (!query) return;
    await model.loadSearchResults(query);
    console.log(model.state.search.results);
  } catch (err) {
    throw err;
  }
};
const init = function () {
  recipeView.addHandlerRender(controlRecipe);
  searchView.addHandlerSearch(controlSearchResult);
};
init();
