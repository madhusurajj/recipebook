# Recipe Book API
Backend API for a personalized recipe book web application, deployed on App Engine and developed using Node.js, Express.js, and Cloud Firestore. Endpoints are defined to support the following features:
* Upload recipes with images, ingredients, and key attributes/flags.
* Search for a specific recipe 
* Filter for recipes (eg "vegetarian" and "gluten-free")
* View all recipes for a user, including download URLs to their images in Cloud Storage
* Login/signup with session management.

## Authentication and Authorization
Authentication is handled using JSON Web Tokens (JWTs). When a user signs up or logs in, a JWT is returned in the HTTP response body that should be stored securely client side. It should be included in the headers of subsequent HTTP requests to edit a user's recipe book. 

## Using this API
The API has been deployed to App Engine, and all requests can be sent to the following URL: https://recipe-book-backend-375618.wm.r.appspot.com/

## API Endpoints
*POST /signup*: Create a new user with email and password.
*   Request Body: JSON with username and password.
*   Returns the JWT if signup is successful. 

*POST /login*: Login with email and password in request body, and get a JWT.
*   Request Body: JSON with username and password.
*   Returns the JWT if login is successful. 

*POST /users/:userID/:recipeName*: Add a new recipe to a user's recipe book. This endpoint recieves form-data, allowing for direct upload of images. The images will be stored in Cloud Storage, with the link saved in Firestore.
*   URL Parameters: userID, recipeName
*   Request body (form-data as key-value pairs):
*    Image file
*    Ingredients: (a string array)
*    Attributes: (as boolean flags in JSON format, such as {"vegan": true, "low-calorie": false}).
*   Request header: JWT

*GET /users/:userID/:* Get all the recipes created by a user
*   URL Parameters: userID
*   Request header: JWT
*   Returns JSON in response body with all recipes created by userID

*GET /users/:userID/?dietaryFilter=someFlag1&dietaryFilter=someFlag2&dietaryFilter=someFlag3* Get all recipes which satisfy certain dietary filters. 
*   URL Parameters: userID
*   Queries: dietaryFilter
*   Request header: JWT
*   Example: /users/madhu/?dietaryFilter=vegan&dietaryFilter=low-calorie 
*   Returns all recipes as JSON in response body that pass through the filters. 

*GET /users/:userID/:recipeName/:* Search for a specific recipe created by a user.
*   URL Parameters: userID, recipeName
*   Request header: JWT
*   Returns JSON in response body with the recipe containing ingredients, attributes, and a direct download URL to the image stored in Cloud Storage

*DELETE /users/:userID/:recipeName:* Delete a specific recipe by name.
*   URL Parameters: userID, recipeName
*   Request header: JWT
