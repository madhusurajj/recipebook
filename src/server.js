const {readRecipes, addRecipeToBook, removeRecipeFromBook, getSpecificRecipe} = require ("./database.js");

const express = require('express');
const cors = require ('cors');
const bodyParser = require("body-parser");
const { checkSchema, validationResult } = require('express-validator');

const app = express();
const {addRecipeSchema} = require ("./data-validators/add-recipe-schema.ts"); 
const { check } = require("express-validator/src/middlewares/validation-chain-builders.js");

//middleware to handle image file uploads
const multer = require('multer');
const upload = multer();

//middleware to allow browser requests from cross-origin domains 
app.use(cors({
    origin: "localhost:4200"
})); 

//middleware to parse JSON post req body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/* 
    * HTTP GET response to get all recipes or a specific one created by a user
    * Handle requests to filter data by dietary flags
*/
app.get('/users/:userID/:recipename?', (req, res) => {
    const userID = req.params.userID;
    const recipeName = req.params.recipename;

    //only fetch a specific recipe
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

/* 
    * HTTP POST response to create new recipes
    * Ingredients, attributes, images are sent as JSON in request body
*/
app.post('/users/:userID/:recipeName', 
    //upload image file from form data using multer 
    upload.single('image'), 

    //use express validators middleware to check data from queries and params with default errors
    [
        //check post req JSON body using custom schema and error messages
        checkSchema(addRecipeSchema), 
        check("userID").isString(),
        check("recipeName").isString()
    ],

    (req, res) => 
    {
        //return status 400 if any validation errors were found
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
        //req body is passed in through multipart/form-data, so stringified data must be converted to json
        const ingredients = JSON.parse(req.body.ingredients);
        const flags = JSON.parse(req.body.attributes);
        console.log("flags:" + flags);
        //object created by multer in req.file storing image buffer and metadata
        const image = req.file; 
        addRecipeToBook (req.params.userID, req.params.recipeName, ingredients, flags, image)
        .then (() =>
        {
            res.status(201).send({message: "Successfully added recipe"});
        })
        .catch ((message) => 
        {
            res.status(400).send(message);; 
        })
    }
);

/* 
    HTTP DELETE response to remove specific recipe
*/
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