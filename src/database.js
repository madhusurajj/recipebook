/* 
    * Methods to perform CRUD operations on Firestore database with advanced querying and filtering of recipes
    * Each recipe is a separate document to avoid client-side filtering, as Firestore doesn't support partial 
        document queries.
*/
const {collection, setDoc, query, doc, deleteDoc, getDoc, getDocs, where} = require("firebase/firestore");
const {database} = require ("./setup")
const {storageUploadImage} = require ("./storage")

/*
    * Add recipe to Firestore using reference with user id and recipe name
    * Add/update ingredients and attributes with optional params
    * Upload recipe image, passing in as buffer (binary image data)
*/
function addRecipeToBook(user, recipename, ingredients, attributes = null, image = null)
{
    return new Promise (async (resolve, reject) => {
        //id format userid_recipename
        const docID = user + "_" + recipename;
        
        //first store image (if it exists) in cloud storage, and put link in db -> more scalable
        const bucketUrl = user + "/" + recipename;
        //returns download url
        storageUploadImage(image, bucketUrl)
        .then ((imageURL) => {
            //set overwrites duplicates -> only one instance of each recipe per user
            setDoc(doc(database, "recipes", docID), 
            {
                userID: user,
                recipeName: recipename,
                ingredients: ingredients,
                attributes,
                imageURL
            })
            .then (() => {
                console.log("Uploaded to db: url is " + imageURL)
                resolve();
            })
            .catch ((message) =>
            {
                reject();
            })
        })
        .catch(() => {
            reject("User is not authorized to write to this storage bucket.");
        });
    });
}

/* 
    Delete recipes with using name reference from Firestore 
*/
function removeRecipeFromBook(user, recipe)
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

/* 
    Retrieve all recipe documents in the collection, querying by userID 
*/
function readRecipes (user, dietaryfilter)
{
    let recipesAsJson = {};
    return new Promise (async (resolve, reject) => {
        let q = query(collection(database, "recipes"), where("userID", "==", user));
        //dynamically build compound query using array of optional flag values
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
        //format document data into JSON
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

/*
    Search for a specific recipe, retrieving using documentID (user_recipename) 
*/
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