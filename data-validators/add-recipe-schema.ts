require ('express-validator');

/* Schema to validate the fields in POST request body */
const addRecipeSchema = {
    ingredients: {
        in: "body",
        notEmpty: true,
        isArray: true,
        custom: {
            options: (ingredientsArr) =>
            {
                return ingredientsArr.every(i => typeof i == "string")
            }
        },
        errorMessage: "Ingredients must be an array of strings"
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