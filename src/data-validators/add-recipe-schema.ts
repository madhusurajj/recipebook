require ('express-validator');

/* Schema to validate the fields in POST request body when adding a recipe*/
const addRecipeSchema = {
    /*
    Ingredients should be stringified by client / Postman when sending 
    in post req body, since the req body can't be in a nested JSON format
    as it contains image files.
    */
    ingredients: {
        in: "body",
        notEmpty: true,
        isString: true,
        custom: {
            options: (ingredientString) =>
            {
                const ingredientsArr = JSON.parse(ingredientString);
                for (const ingredient of ingredientsArr)
                {
                    console.log(ingredient);
                    if (typeof ingredient != "string") return false
                }
                return true;
            }
        },
        errorMessage: "Ingredients must be formatted as a stringified array of strings"
    },
    flags: {
        in: "body",
        optional: true, 
        custom: {
            options: (flagsJSON) => 
            {
                if (typeof flagsJSON != "object") return false;
                for (let key in flagsJSON)
                {
                    if (typeof key != "string" || typeof flagsJSON[key] != "boolean") return false;
                }
                return true;
            },
        },
        errorMessage: "Flags must be in JSON format with string keys and boolean values",
    }
}

module.exports = {addRecipeSchema}