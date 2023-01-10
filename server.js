const {readRecipes, addRecipeToBook, removeRecipeFromBook, getSpecificRecipe} = require ("./database.js");

const express = require('express');
const cors = require ('cors');
const bodyParser = require("body-parser");
const { checkSchema, validationResult } = require('express-validator');

const app = express();
const {addRecipeSchema} = require ("./data-validators/add-recipe-schema.ts"); 
const { check } = require("express-validator/src/middlewares/validation-chain-builders.js");

//middleware to allow browser requests from cross-origin domains 
app.use(cors({
    origin: "localhost:4200"
})); 

//middleware to parse JSON post req body
app.use(bodyParser.json());

//HTTP GET response to get all recipes or a specific one created by a user
//for reading all recipes: handle optional query for dietary filter: 
app.get('/users/:userID/:recipename?', (req, res) => {
    const userID = req.params.userID;
    const recipeName = req.params.recipename;

    //only fetch one specific recipe
    if (recipeName)
    {
        getSpecificRecipe(userID, recipeName)
        .then ((data) =>
        {
            res.status(200).json(data);
        })
        .catch((reason) => 
        {
            res.status(400).send(reason);
        });
    }
    //read all recipes for a user
    else
    {
        const searchedFlags = req.query.dietaryfilter;
        readRecipes(userID, searchedFlags)
        .then ((data) =>
        {
            res.status(200).json(data);
        })
        .catch((reason) => 
        {
            res.status(400).send(reason);
        });
    }
});

//HTTP POST response to create new recipes
//ingredients, attributes are sent as JSON in request body
app.post('/users/:userID/:recipeName', 
    //use express validators middleware to check queries, params with default errors
    //check post req JSON body using custom schema and error messages
    [
        checkSchema(addRecipeSchema), 
        check("userID").isString(),
        check("recipeName").isString()
    ],
    (req, res) => {
    const errors = validationResult (req); 
    if (!errors.isEmpty())
    {
        errorMessages = [];
        for (const error of errors.errors)
        {
            errorMessages.push(error.msg);
        }
        res.status(400).send(errorMessages);
        return; 
    }
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
app.delete('/users/:userID/:recipeName', 
    [
        check("userID").isString(),
        check("recipeName").isString()
    ], 
    (req, res) => {
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