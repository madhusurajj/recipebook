const {readRecipes, addRecipeToBook, removeRecipeFromBook, getSpecificRecipe} = require ("./database.js");

const express = require('express');
const cors = require ('cors');
const bodyParser = require("body-parser");

const app = express();

//middleware to allow browser requests from cross-origin domains
app.use(cors({
    origin: "localhost:4200"
})); 

//middleware to parse JSON post req body
app.use(bodyParser.json());

//HTTP GET response to get all recipes or a specific one created by a user
app.get('/users/:userID/:recipename?', cors(), (req, res) => {
    const userID = req.params.userID;
    const recipeName = req.params.recipename;
    let data;
    //only fetch specific recipe
    if (recipeName)
    {
        getSpecificRecipe(userID, recipeName)
        .then ((data) =>
        {
            console.log(data);
            res.status(200).json(data);
        })
        .catch((reason) => 
        {
            res.status(400).send(reason);
        });
    }
    //read all recipes for a user
    else   {
        readRecipes(userID)
        .then ((data) =>
        {
            console.log("all recipes", data);
            res.status(200).json(data);
        })
        .catch((reason) => 
        {
            res.status(400).send(reason);
        });
    }
});

//HTTP POST response to create new recipes
//ingredients are sent as JSON in request body
/*individual attributes specified using flags, since firestore doesn't support AND for array-contains*/
app.post('/users/:userID/:recipeName', cors(), (req, res) => {
    const ingredients = req.body["ingredients"];
    const flags = req.body["flags"];
    addRecipeToBook (req.params.userID, req.params.recipeName, ingredients, flags)
    .then (() =>
    {
        res.status(201).send({message: "Successfully added recipe"});
    })
    .catch (() => 
    {
        res.status(400).send({message: "Could not add recipe"});; 
    })
});

//HTTP DELETE response to create new recipes
app.delete('/users/:userID/:recipeName', cors(), (req, res) => {
    removeRecipeFromBook (req.params.userID, req.params.recipeName)
    .then ((message) =>
    {
        res.status(204).send(message);
    })
    .catch ((message) => 
    {
        res.status(400).send(message);; 
    })
});

app.listen(8000, () => {
    console.log("Listening on port 8000");
});