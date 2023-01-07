const firebase = require('firebase/app');
const { getFirestore, collection, setDoc, query, doc, deleteDoc, getDoc, getDocs, where} = require("firebase/firestore");

const firebaseConfig = require("./firebase-config.json")

const app = firebase.initializeApp(firebaseConfig);
const database = getFirestore(app);

//add to realtime database using reference with user id and recipe name
//add/update ingredients with optional param
async function addRecipeToBook(user, recipename, ingredients, attributes)
{
    return new Promise ((resolve) => {
        //id format userid_recipename
        const docID = user + "_" + recipename;
        //set overwrites duplicates -> only one instance of each recipe per user
        setDoc(doc(database, "recipes", docID), 
        {
            userID: user,
            recipeName: recipename,
            ingredients: ingredients,
            attributes
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
function readRecipes (user, dietaryfilter)
{
    let recipesAsJson = {};
    return new Promise (async (resolve, reject) => {
        let q = query(collection(database, "recipes"), where("userID", "==", user));
        //dynamically build compound query using array of flag values
        if (dietaryfilter)
        {
            if (typeof dietaryfilter == 'string')
            {
                dietaryfilter = [dietaryfilter];
            }
            dietaryfilter.forEach((filter) =>
            {
                const attributeFieldPath = "attributes." + filter;
                q = query(q, where (attributeFieldPath, "==", true));
            });
        }
        else
        {
            q = query(collection(database, "recipes"), where("userID", "==", user));
        }
        getDocs(q)
        .then((querySnapshot) => {
            let enumeration = 0;
            querySnapshot.forEach((doc) => {
                recipesAsJson[enumeration] = doc.data();
                enumeration++;
            });
            resolve(recipesAsJson);
        })
        .catch((reason) => {
            reject(reason);
        });
    });
}

function getSpecificRecipe (user, recipe)
{
    const docID = user + "_" + recipe;
    return new Promise ((resolve, reject) => {
        const docRef = doc(database, "recipes", docID);
        getDoc (docRef)
        .then((docSnap) =>
        {
            if (docSnap.exists())
            {
                resolve(docSnap.data());
            }
            else
            {
                reject({message: "This recipe does not exist"});
            }
        })
        .catch((error) =>
        {
            console.log(error);
            reject(error);
        })
    });
}

module.exports = {database, addRecipeToBook, removeRecipeFromBook, readRecipes, getSpecificRecipe};