//Export single readline object for entire application
const readline = require ('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

module.exports = {rl};