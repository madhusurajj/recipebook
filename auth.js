const { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } = require( "firebase/auth");

const auth = getAuth();
let email;
let password;
const {rl} = require ("./readline.js");

async function signup (afterSignOn) {
    await enterEmail();
    await enterPassword();
    await createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        console.log("Account created! Welcome to your RecipeBook, " + email);
        afterSignOn(user.uid); 
        // ...
    })
    .catch(async (error) => {
        const errorMessage = error.message;
        console.log("Signup attempt failed!!!");
        console.log(errorMessage);
        process.exit();
    });
}

async function signin (afterSignOn) {
    console.log("Please log in:");
    await enterEmail();
    await enterPassword();
    await signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log("Logged in.. welcome back, " + email + "!");
        afterSignOn(user.uid);
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message; 
        console.log("Login failed!!!!");
        console.log(errorMessage);
        if (errorMessage == "Firebase: Error (auth/user-not-found).")
        {
          //redirect to sign up page
          console.log("This email is not registered with RecipeBook- redirecting to sign up..."); 
          signup(afterSignOn);
        }
        else
        {
          process.exit();
        }
    });
}

async function enterEmail ()
{
    return new Promise ((resolve) => {
      rl.question ("Email: \n", function (response)   {
            email = response;
            resolve(response);
        }); 
    })
    
}
async function enterPassword()
{
    return new Promise ((resolve) => {
      rl.question ("Password: \n", function (response)   {
            password = response;
            resolve(response);
        }); 
    })
}
module.exports= {signin};