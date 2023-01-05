const firebase = require('firebase/app');
const { getFirestore, collection, setDoc, query, doc, deleteDoc, getDocs, where} = require("firebase/firestore");

const firebaseConfig = require("./firebase-config.json")

const app = firebase.initializeApp(firebaseConfig);
const database = getFirestore(app);

const {filterForIngredients} = require("./util.js");

//add to realtime database using reference with user id and recipe name
//add/update ingredients with optional param
async function addRecipeToBook(user, recipename, ingredients = null)
{
    return new Promise ((resolve) => {
        console.log(ingredients);
        //id format userid_recipename
        const docID = user + "_" + recipename;
        //set overwrites duplicates -> only one instance of each recipe per user
        setDoc(doc(database, "recipes", docID), 
        {
            userID: user,
            recipeName: recipename,
            ingredients: ingredients
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

//delete recipes with using name reference from firestore
async function removeRecipeFromBook(user, recipe)
{
    return new Promise (async (resolve, reject) =>  {
        const toDeleteID = user + "_" + recipe;
        deleteDoc(doc(database, "recipes", toDeleteID))
        .then(() =>
        {
            resolve();
        })
        .catch (() =>
        {
            reject();
        });
    });
}

//listen for changes in this user's recipe list' and retrieve
//access all recipe documents in the collection, querying by userID
function readRecipes (user)
{
    let recipesAsJson = {};
    return new Promise (async (resolve, reject) => {
        const q = query(collection(database, "recipes"), where("userID", "==", user), where("ingredients", "array-contains", ingredient));
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