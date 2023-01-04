const {readRecipes, addRecipeToBook, removeRecipeFromBook} = require ("./database.js");

const express = require('express');
const cors = require ('cors');
const bodyParser = require("body-parser");

const app = express();

//middleware to allow browser requests from cross-origin domains
app.use(cors({
    origin: "localhost:4200"
})); 

//middleware to parse JSON post request body
app.use(bodyParser.json());

//HTTP GET response to get all recipes created by a user
app.get('/users/:userID', cors(), (req, res) => {
    const userID = req.params.userID;
    readRecipes(userID, req.query.ingredient)
    .then ((data) =>
    {
        res.status(200).json(data);
    })
    .catch((reason) => 
    {
        res.status(400).send(reason);
    }
    );
});

//HTTP POST response to create new recipes
app.post('/users/:userID/:recipeName', cors(), (req, res) => {
    addRecipeToBook (req.params.userID, req.params.recipeName, req.body)
    .then (() =>
    {
        res.status(201).send({message: "Succcessfully added recipe"});
    })
    .catch (() => 
    {
        res.status(400).send({message: "Could not add recipe"});; 
    })
});

//HTTP DELETE response to create new recipes
app.delete('/users/:userID/:recipeName', cors(), (req, res) => {
    removeRecipeFromBook (req.params.userID, req.params.recipeName)
    .then (() =>
    {
        res.status(204).send({message: "Succcessfully deleted recipe"});
    })
    .catch ((message) => 
    {
        res.status(400).send(message);; 
    })
});

app.listen(8000, () => {
    console.log("Listening on port 8000");
});