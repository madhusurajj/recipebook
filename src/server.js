/* 
    * Defines routes and endpoints to edit recipe book, login, and signup.
*/
const {readRecipes, addRecipeToBook, removeRecipeFromBook, getSpecificRecipe} = require ("./database.js");

const express = require('express');
const cors = require ('cors');
const bodyParser = require("body-parser");
const { checkSchema, validationResult } = require('express-validator');
const {signup, signin, authenticateByJWT} = require ("./auth.js")

const app = express();
const {addRecipeSchema} = require ("./data-validators/add-recipe-schema.ts"); 
const { check } = require("express-validator/src/middlewares/validation-chain-builders.js");

//middleware to handle image file uploads
const multer = require('multer');
const { resolve } = require("path");
const { rejects } = require("assert");
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
    //json web token which should have been stored client side after login/signup,
    //and now is needed to verify actions are authenticated and match the userID
    const jwt = req.headers.authorization; 
    console.log(" jwt: ", jwt); 
    authenticateByJWT(jwt)
    .then ((jwtDecodedID) => {
        //if the jwt is valid but doesn't match userID being accessed in recipe book -> status 403 
        if (jwtDecodedID != userID)
        {
            res.status(403).send({message: "Don't have permission to access this userID"});
            return;
        }
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
    })
    .catch(() => {
        res.status(401).send({message: "Unknown user token"});
        return;
    });
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
            console.log(errors);
            errorMessages = [];
            for (const error of errors.errors)
            {
                errorMessages.push(error.msg);
            }
            console.log("vallidation error:")
            res.status(400).send(errorMessages);
            return; 
        }
        const jwt = req.headers.authorization; 
        console.log(jwt); 
        authenticateByJWT(jwt)
        .then ((jwtDecodedID, resolve, reject) => {
            const userID = req.params.userID;
            if (jwtDecodedID != userID)
            {
                res.status(403).send({message: "Don't have permission to access this userID"});
                return;
            }
            //req body is passed in through multipart/form-data, so stringified data must be converted to json
            const ingredients = JSON.parse(req.body.ingredients);
            const flags = null;
            if (req.body.attributes)
            {
                JSON.parse(req.body.attributes);
            }
            //object created by multer in req.file storing image buffer and metadata
            const image = req.file; 
            addRecipeToBook (userID, req.params.recipeName, ingredients, flags, image)
            .then (() =>
            {
                res.status(201).send({message: "Successfully added recipe"});
                resolve();
                return;
            })
            .catch ((message) => 
            {
                console.log(message);
                res.status(400).send({message: "Unable to upload recipe for this user- try logging in again"});
                return;
            });
        })
        .catch((error) => {
            console.log(error)
            res.status(401).send({message: "Unknown user token"});
            return;
        });
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
        const jwt = req.headers.authorization; 
        authenticateByJWT(jwt)
        .then ((jwtDecodedID) => 
        {
            if (jwtDecodedID != userID)
            {
                res.status(403).send({message: "Don't have permission to access this userID"});
                return;
            }    
        removeRecipeFromBook (req.params.userID, req.params.recipeName)
        .then ((message) =>
        {
            res.status(204).send(message);
        })
        .catch ((message) => 
        {
            res.status(400).send(message);; 
        })
    })
    .catch (() => {
        res.status(401).send({message: "Unknown user token"});
        return;
    })
});

/* 
    HTTP POST response to create an account / sign up
    Email / password combo are passed in as JSON in request body
    Returns a JSON Web Token that the client can send in header of future requests
*/
app.post('/signup', 
    [
        //add further validation here 
        check("email").isString(),
        check("password").isString()
    ], 
    (req, res) => {
    signup (req.body.email, req.body.password)
    .then ((userTokenAndID) =>  {
        res.status(201).json(userTokenAndID);
    })
    .catch (() => {
        res.status(400).send({message: "Could not create an account for this user"});
    });
});

/* 
    HTTP POST response to log in
    Email / password combo are passed in as JSON in request body
    Returns a JSON Web Token that the client can send in header of future requests
*/
app.post('/login', 
    [
        //add further validation here 
        check("email").isString(),
        check("password").isString()
    ], 
    (req, res) => {
    signin (req.body.email, req.body.password)
    .then ((userData) =>  {
        res.status(201).json(userData);
    })
    .catch (() => {
        res.status(401).send({message: "Invalid email/password: unable to authenticate this user"});
    })
});

/* Route to handle situation where a user makes a request to the base URL without any parameters */
app.get('/', (req, res) => {
    res.status(404).send('This is the base URL for my recipebook API. Please provide parameters to access API resources.' );
  });
  
//8080 is the default port used by App Engine
app.listen(8080,'0.0.0.0', () => {
    console.log("Listening on port 8080");
});