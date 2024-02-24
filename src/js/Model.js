import { API_URL, KEY } from "./config";
import { AJAX } from "./helpers";
import { RES_PAE_PAGE } from "./config";
export const state = {
  recipe: {},
  search: {
    query: "",
    results: [],
    resultsPerPage: RES_PAE_PAGE,
    page: 1,
  },
  bookMarks: [],
};
const createRecipeObject = function (data) {
  let { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};
export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}/${id}?key=${KEY}`);
    state.recipe = createRecipeObject(data);
    if (state.bookMarks.some((recipe) => recipe.id === id)) state.recipe.bookMarked = true;
    else state.recipe.bookMarked = false;
  } catch (err) {
    throw err;
  }
};
export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    state.search.results = data.data.recipes.map((rec) => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
    state.search.page = 1;
  } catch (err) {
    throw err;
  }
};
export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * RES_PAE_PAGE; //0
  const end = page * RES_PAE_PAGE; //10 but this not including in slice method so that's perfect
  return state.search.results.slice(start, end);
};
export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach((ing) => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });
  state.recipe.servings = newServings;
};
export const persistBookmarks = function () {
  localStorage.setItem("bookmarks", JSON.stringify(state.bookMarks));
};
export const addBookMark = function (recipe) {
  // Add to our State
  state.bookMarks.push(recipe);
  //mark current recipe as book mark
  if (recipe.id === state.recipe.id) state.recipe.bookMarked = true;
  persistBookmarks();
};
export const removeBookMark = function (id) {
  const index = state.bookMarks.findIndex((el) => el.id === id);
  state.bookMarks.splice(index, 1);
  if (id === state.recipe.id) state.recipe.bookMarked = false;
  persistBookmarks();
};
const init = function () {
  const storage = localStorage.getItem("bookmarks");
  if (storage) state.bookMarks = JSON.parse(storage);
};
init();
export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter((entry) => entry[0].startsWith("ingredient") && entry[1] != "")
      .map((ing) => {
        const ingArray = ing[1].split(",").map((el) => el.trim());
        if (ingArray.length !== 3) throw new Error("Wrong ingredients Format! , Please use the correct format ;)");
        const [quantity, unit, description] = ingArray;
        return { quantity: quantity ? +quantity : null, unit, description };
      });
    const recipe = {
      title: newRecipe.title,
      publisher: newRecipe.publisher,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      servings: +newRecipe.servings,
      cooking_time: +newRecipe.cookingTime,
      ingredients,
    };
    console.log(recipe);
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookMark(state.recipe);
  } catch (err) {
    throw err;
  }
};
