# Recipe Book API
Backend API for a personalized recipe book web application, developed using Node.js, Express.js, Firebase Cloud Firestore, and Cloud Storage. Endpoints are defined to support the following features for users:
* Upload recipes with images, ingredients, and key attributes/flags.
* Search for a specific recipe 
* Filter for recipes (eg "vegetarian" and "gluten-free")
* View all recipes they have created, including download URLs to their images in Cloud Storage
* Login/signup with session management.

## Authentication and Authorization
Authentication is handled using JSON Web Tokens (JWTs). When a user signs up or logs in, a JWT is returned in the HTTP response body that should be stored securely client side. It should be included in the headers of subsequent HTTP requests to edit a user's recipe book. 

## Getting Started
These instructions will get a copy of the project up and running on your local machine.

### Prerequisites
* Node.js
* npm
* Firebase account and a project setup

#### Installing
* Clone this repository
* Install dependencies using npm install
* Update the admin-private-key-template.json file and the firebase-config-template.json file with the API keys for your Firebase project.
* Start the server by running *node server*
* The API will be running at http://localhost:8000

## API Endpoints
*POST /signup*: Create a new user with email and password.
*   Parameters: none
*   Request Body: JSON with username and password.
*   Returns the JWT if signup is successful. 

*POST /login*: Login with email and password in request body, and get a JWT.
*   Parameters: none
*   Request Body: JSON with username and password.
*   Returns the JWT if login is successful. 

*POST /users/:userID/:recipeName*: Add a new recipe to a user's recipe book. This endpoint recieves form-data, allowing for direct upload of images. The images will be stored in Cloud Storage, with the link saved in Firestore.
*   Parameters: userID, recipeName
*   Request body (form-data as key-value pairs):
*    Image file
*    Ingredients: (a string array)
*    Attributes: (as boolean flags in JSON format, such as {"vegan": true, "low-calorie": false}).
*   Request header: JWT

*GET /users/:userID/:* Get all the recipes created by a user
*   Parameters: userID
*   Request header: JWT
*   Returns JSON in response body with all recipes created by userID

*GET /users/:userID/?dietaryFilter=someFlag1&dietaryFilter=someFlag2&dietaryFilter=someFlag3* Get all recipes which satisfy certain dietary filters. 
*   Parameters: userID
*   Queries: dietaryFilter
*   Request header: JWT
*   Example: /users/madhu/?dietaryFilter=vegan&dietaryFilter=low-calorie 
*   Returns all recipes as JSON in response body that pass through the filters. 

*GET /users/:userID/:recipeName/:* Search for a specific recipe created by a user.
*   Parameters: userID, recipeName
*   Request header: JWT
*   Returns JSON in response body with the recipe containing ingredients, attributes, and a direct download URL to the image stored in Cloud Storage

*DELETE /users/:userID/:recipeName:* Delete a specific recipe by name.
*   Parameters: userID, recipeName
*   Request header: JWT

Express middleware is used to ensure that the data entered into the recipebook is validated and of the expected format, as outlined above.
