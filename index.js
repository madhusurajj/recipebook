const firebase = require('firebase/app');
const { getDatabase, set, ref, remove } = require('firebase/database');
require('firebase/database');

const readline = require ('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const firebaseConfig = {
    apiKey: "AIzaSyDWooMBmoB-vEam73E-UTPfOUBuqroHtCo",
    authDomain: "starter-5c929.firebaseapp.com",
    databaseURL: "https://starter-5c929-default-rtdb.firebaseio.com",
    projectId: "starter-5c929",
    storageBucket: "starter-5c929.appspot.com",
    messagingSenderId: "255238054024",
    appId: "1:255238054024:web:cd8efd0081a74b1851ff3d",
    measurementId: "G-WGY79YKNL7"
};

const app = firebase.initializeApp(firebaseConfig);
const database = getDatabase(app);


// question user to enter name
exitMenu = false;
const displayMenu = function ()
{
    rl.question ("Enter A to add a new recipe, or D to delete recipe, or Q to quit program\n", function (string) {
        if (string == "Q")
        {
            rl.close();
            process.exit();
        }
        else if (string == "A")
        {
            addRecipeRequest();
            console.log("added")
            displayMenu();
        }
        else if (string == "D")
        {
            removeRecipeRequest();
            displayMenu();
        }
        else
        {
            console.log("Invalid command. please try again");
            displayFunction();
        }
    });
}


function addRecipeRequest ()
{
    rl.question("Add a new recipe to recipebook\n", function (string) {
        recipeName = string;
        console.log("Adding " + recipeName + " to your recipe book...");
        addRecipeToBook(recipeName);
      });
}

function removeRecipeRequest ()
{
    rl.question("Remove a recipe from recipe book\n", function (string) {
        recipeName = string;
        console.log("Removing " + recipeName + " from your recipe book...");
        removeRecipeFromBook(recipeName);
      });
}

function addRecipeToBook(recipe)
{
    set(ref(database, 'recipes/' + recipe), {
        recipeName: recipe
      })
    .then (() => {
        console.log("done!");
        displayMenu();
    })
}

//remove from realtime database using reference 
function removeRecipeFromBook(recipe)
{
    remove(ref(database, 'recipes/' + recipe))
    .then (() => {
        console.log("done!");
        displayMenu();
    })
}

displayMenu();
