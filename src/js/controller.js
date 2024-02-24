import * as model from "./Model.js";
import recipeView from "./Views/recipeView.js";
import searchView from "./Views/searchView.js";
import resultView from "./Views/resultView.js";
import bookmarkView from "./Views/bookmarkView.js";
import "core-js/stable";
import "regenerator-runtime/runtime";
import paginationView from "./Views/paginationView.js";
import addRecipeView from "./Views/addRecipeView.js";
import { HIDE_FORM } from "./config.js";

const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    resultView.update(model.getSearchResultsPage());

    // Spinner
    recipeView.renderSpinner();
    // 1- loading Recipes
    await model.loadRecipe(id);
    // 2- Render Recipes
    recipeView.render(model.state.recipe);

    bookmarkView.update(model.state.bookMarks);
  } catch (err) {
    recipeView.renderError(err);
  }
};
// ["hashchange", "load"].forEach((ev) => window.addEventListener(ev, showRecipe));
const controlSearchResult = async function () {
  try {
    resultView.renderSpinner();
    const query = searchView.getQuery();
    if (!query) return;
    await model.loadSearchResults(query);
    resultView.render(model.getSearchResultsPage());
    paginationView.render(model.state.search);
  } catch (err) {
    throw err;
  }
};
const controlPage = function (page) {
  resultView.render(model.getSearchResultsPage(page));
  paginationView.render(model.state.search);
  console.log("hi");
};
const controlServings = function (newServings) {
  // update state in model
  model.updateServings(newServings);
  // update recipe view
  recipeView.update(model.state.recipe);
};

const controlAddBookMark = function () {
  if (model.state.recipe.bookMarked) model.removeBookMark(model.state.recipe.id);
  else model.addBookMark(model.state.recipe);
  recipeView.update(model.state.recipe);
  bookmarkView.render(model.state.bookMarks);
};
const controlBookmark = function () {
  bookmarkView.render(model.state.bookMarks);
};
const controlAddRecipe = async function (newRecipe) {
  try {
    addRecipeView.renderSpinner();
    await model.uploadRecipe(newRecipe);
    addRecipeView.renderMessage();
    bookmarkView.render(model.state.bookMarks);
    recipeView.render(model.state.recipe);
    // change url
    window.history.pushState(null, "", `#${model.state.recipe.id}`);
    // setTimeout(() => {
    //   addRecipeView.toggleWindow();
    // }, HIDE_FORM * 1000);
  } catch (err) {
    addRecipeView.renderError(err.message);
  }
};
const init = function () {
  bookmarkView.addHandlerRender(controlBookmark);
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookMark);
  searchView.addHandlerSearch(controlSearchResult);
  paginationView.addHandlerButton(controlPage);
  addRecipeView._addHandlerUpload(controlAddRecipe);
};
init();
