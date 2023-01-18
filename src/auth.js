const { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, verifyIdToken} = require( "firebase/auth");
const {admin} = require("../firebase/admin-sdk")
const auth = getAuth();

/* Signs up using email-password combo and return JWT upon success */
function signup (email, password) {
    return new Promise ((resolve, reject) => {
        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            getUserMetadata(userCredential)
            .then ((data) => 
            {
                resolve(data);
            })
            .catch ((error) => {
                console.log(error);
                reject(error);
            });
        })
        .catch((error) => {
            const errorMessage = error.message;
            console.log("Signup attempt failed!!!");
            console.log(errorMessage);
            reject(error);
        });
    })
}

/* Return a JWT for the given user when successfully logged in */
function signin (email, password) {
    return new Promise ((resolve, reject) => {
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            getUserMetadata(userCredential)
            .then ((data) => 
            {
                resolve(data);
            })
            .catch ((error) => {
                console.log(error);
                reject(error);
            });
        })
        .catch((error) => {
            const errorMessage = error.message; 
            console.log("Login failed!!!!");
            reject(errorMessage); 
        });
    });
}

/* Decode JWT passed in from client and extract userID */
function authenticateByJWT (jwt)
{
    return new Promise ((resolve, reject) => {
        admin.auth().verifyIdToken(jwt)
        .then ((decodedUser) => {
            console.log("Success!");
            resolve(decodedUser.uid);
        })
        .catch ((error) => {
            reject(error); 
        });
    })
}

/* internal helper function to get user id and JWT token from credential */
function getUserMetadata (userCredential)
{
    {
        return new Promise ((resolve, reject) => {
            userCredential.user.getIdToken()
            .then ((userJwt) => {
                userMetadata = {
                    "jwt": userJwt, 
                    "userID": userCredential.user.uid
                }
                resolve(userMetadata);
            })
            .catch (() => {
                reject(); 
            })
        });
    }
}
module.exports= {signin, signup, authenticateByJWT};