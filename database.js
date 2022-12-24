const firebase = require('firebase/app');
const { getDatabase, set, ref, remove} = require('firebase/database');
require('firebase/database');

const firebaseConfig = require("./config.json")

const app = firebase.initializeApp(firebaseConfig);
const database = getDatabase(app);

//add to realtime database using reference 
async function addRecipeToBook(user, recipe, database)
{
    return new Promise ((resolve) => {
        set(ref(database, 'users/' + user + '/recipes/' + recipe), {
            recipeName: recipe
          })
        .then (() => {
            console.log("done!");
            resolve();
        })
    });
}

//remove from realtime database using reference 
async function removeRecipeFromBook(recipe, database)
{
    return new Promise ((resolve) => {
        remove(ref(database, 'users/' + user + '/recipes/' + recipe))
        .then (() => {
            console.log("done!");
            resolve();
        })
    });
}

module.exports = {database, addRecipeToBook, removeRecipeFromBook};