const firebase = require('firebase/app');
const { getDatabase, set, ref, remove, onValue} = require('firebase/database');
require('firebase/database');

const firebaseConfig = require("./firebase-config.json")

const app = firebase.initializeApp(firebaseConfig);
const database = getDatabase(app);

//add to realtime database using reference with user id
async function addRecipeToBook(user, recipe)
{
    return new Promise ((resolve) => {
        set(ref(database, 'users/' + user + '/recipes/' + recipe), {
            recipeName: recipe
          })
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
function readRecipes (user)
{
    const userRef = ref (database, 'users/' + user);
    return new Promise ((resolve, reject) => {
        onValue (userRef, (snapshot) => {
            if (snapshot.exists())
            {
                const data = JSON.stringify(snapshot.val());
                console.log(data);
                resolve(data);
            }
            else
            {
                reject("Data at this reference doesn't exist");
            }
        })
    });
}
module.exports = {database, addRecipeToBook, removeRecipeFromBook, readRecipes};