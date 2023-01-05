const firebase = require('firebase/app');
const { getFirestore, collection, addDoc, query, doc, deleteDoc, getDocs, where} = require("firebase/firestore");

const firebaseConfig = require("./firebase-config.json")

const app = firebase.initializeApp(firebaseConfig);
const database = getFirestore(app);

const {filterForIngredients} = require("./util.js");

//add to realtime database using reference with user id
//add/update ingredients with optional param
async function addRecipeToBook(user, name, ingredient = null)
{
    return new Promise ((resolve) => {
        const recipeDocRef = addDoc(collection(database, "recipes"), 
        {
            userID: user,
            recipeName: name
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

//delete recipes with this name from firestore
async function removeRecipeFromBook(user, recipe)
{
    return new Promise (async (resolve, reject) =>  {
        const q = query(collection(database, "recipes"), where("recipeName", "==", recipe));
        const snapshotToDelete = await getDocs(q);
        try
        {
            snapshotToDelete.forEach(async (document) => {
                await deleteDoc(doc(database, "recipes", document.id));
            });
            resolve();
        }
        finally 
        {
            reject({message: "Could not delete" + recipe});
        }
    });
}

//listen for changes in this user's recipe list' and retrieve
//access all recipe documents in the collection, querying by userID
function readRecipes (user)
{
    let recipesAsJson = {};
    return new Promise (async (resolve, reject) => {
        const q = query(collection(database, "recipes"), where("userID", "==", user));
        const querySnapshot = await getDocs(q);
        let enumeration = 0;
        querySnapshot.forEach((doc) => {
            recipesAsJson[enumeration] = doc.data();
            enumeration++;
        });
        resolve(recipesAsJson);
    });
}
module.exports = {database, addRecipeToBook, removeRecipeFromBook, readRecipes};