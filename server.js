const {readRecipes} = require ("./database.js");

const express = require('express');

const app = express();
const cors = require ('cors');

//middleware to allow frontend requests from cross-origin domain to this server
app.use(cors({
    origin: "localhost:4200"
})); 

//HTTP backend response to get all recipes created by a user
app.get('/users/:userID', cors(), (req, res) => {
    const userID = req.params.userID;
    readRecipes(userID)
    .then ((data) =>
    {
        res.json(data);
    })
    .catch((reason) => 
    {
        res.status(400);
    }
    );
});

app.listen(8000, () => {
    console.log("Listening on port 8000");
});
