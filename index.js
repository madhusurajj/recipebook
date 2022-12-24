const {addRecipeToBook, removeRecipeFromBook, readRecipes, database} = require ("./database.js");

const { signin } = require ("./auth.js");

const {rl} = require ("./readline.js");

function displayMenu  (user)
{
    rl.question ("Enter A to add a new recipe, or D to delete recipe, or V to view your recipes, or Q to quit program\n", function (string) {
        if (string == "Q")
        {
            rl.close();
            process.exit();
        }
        else if (string == "A")
        {
            addRecipeRequest(user);
            console.log("added")
            displayMenu();
        }
        else if (string == "D")
        {
            removeRecipeRequest(user);
            displayMenu();
        }
        else if (string == "V")
        {
            readRecipes(user, database);
        }
        else
        {
            console.log("Invalid command. please try again");
            displayFunction();
        }
    });
}


function addRecipeRequest (user)
{
    rl.question("Add a new recipe to recipebook\n", async function (string) {
        recipeName = string;
        console.log("Adding " + recipeName + " to your recipe book...");
        await addRecipeToBook(user, recipeName, database);
        displayMenu();
      });
}

function removeRecipeRequest (user)
{
    rl.question("Remove a recipe from recipe book\n", async function (string) {
        recipeName = string;
        console.log("Removing " + recipeName + " from your recipe book...");
        await removeRecipeFromBook(user, recipeName, database);
        displayMenu();
      });
}

signin(displayMenu, rl);