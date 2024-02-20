import * as model from "./Model.js";
import recipeView from "./Views/recipeView.js";
import "core-js/stable";
import "regenerator-runtime/runtime";
const recipeContainer = document.querySelector(".recipe");

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const showRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    console.log(id);
    // Spinner
    recipeView.renderSpinner();
    // 1- loading Recipes
    await model.loadRecipe(id);
    // 2- Render Recipes
    recipeView.render(model.state.recipe);
  } catch (err) {
    console.error(err + "BOOOOOOOOM");
  }
};
["hashchange", "load"].forEach((ev) => window.addEventListener(ev, showRecipe));
