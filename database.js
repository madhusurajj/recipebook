const firebase = require('firebase/app');
const { getDatabase, set, ref, remove, onValue, startAt, endAt, push, equalTo} = require('firebase/database');
const {query, orderByChild} = require('firebase/database');

const firebaseConfig = require("./firebase-config.json")

const app = firebase.initializeApp(firebaseConfig);
const database = getDatabase(app);

const {filterForIngredients} = require("./util.js");

//add to realtime database using reference with user id
//add/update ingredients with optional param
async function addRecipeToBook(user, recipeName, ingredients = null)
{
    return new Promise ((resolve) => {
        set(ref (database, 'users/' + user + '/recipes/' + recipeName), 
            ingredients
        )
        .then (() => {
            resolve();
        })
        .catch ((message) =>
        {
            reject(message);
        })
    });
}

//remove from realtime database using reference 
async function removeRecipeFromBook(user, recipe)
{
    return new Promise ((resolve, reject) => {
        remove(ref(database, 'users/' + user + '/recipes/' + recipe))
        .then (() => {
            resolve();
        })
        .catch ((message) => {
            reject(message);
        })
    });
}

//listen for changes in this user's recipe list' and retrieve list
//prepTime: optional parameter allows users to filter by length of preparation
function readRecipes (user, prepTime = null)
{
    return new Promise ((resolve, reject) => {
         onValue (query(ref(database, 'users/' + user + '/recipes'), orderByChild("prep-time"),equalTo(prepTime)), (snapshot) => {
            if (snapshot.exists())
            {
                resolve(snapshot.val());
            }
            else
            {
                reject("Data at this reference doesn't exist");
            }
        });
    });
}
module.exports = {database, addRecipeToBook, removeRecipeFromBook, readRecipes};