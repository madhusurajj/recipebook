const { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } = require( "firebase/auth");

const auth = getAuth();

/* Signs up using email-password combo and return JWT upon success */
function signup (email, password) {
    return new Promise ((resolve, reject) => {
        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Json web token that is returned to client
            userCredential.user.getIdToken()
            .then ((userToken) => {
                console.log("Account created! Welcome to your RecipeBook, " + email);
                console.log(userToken)
                resolve(userToken); 
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
            //return promise with json web token of this use
            userCredential.user.getIdToken()
            .then ((userJwt) => {
                console.log("Logged in.. welcome back, " + email + "!");
                resolve(userJwt);
            })
        })
        .catch((error) => {
            const errorMessage = error.message; 
            console.log("Login failed!!!!");
            reject(errorMessage); 
        });
    });
}

module.exports= {signin, signup};