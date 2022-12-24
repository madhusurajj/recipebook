const firebase = require('firebase/app');
const { getDatabase, set, ref, remove, onValue} = require('firebase/database');
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
async function removeRecipeFromBook(user, recipe, database)
{
    return new Promise ((resolve) => {
        remove(ref(database, 'users/' + user + '/recipes/' + recipe))
        .then (() => {
            console.log("done!");
            resolve();
        })
    });
}

//listen for changes in this user's recipe list' and retrieve list
async function readRecipes (user, database)
{
    const userRef = ref (database, 'users/' + user);
    onValue (userRef, (snapshot) => {
        console.log (snapshot.val());
    });
}
module.exports = {database, addRecipeToBook, removeRecipeFromBook, readRecipes};