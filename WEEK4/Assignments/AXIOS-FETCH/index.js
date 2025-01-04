//Axios is an external library that allows us to make HTTP requests to external resources./
//It is written by some really smart people at NPM, and it is a very popular library./
//It is written because the syntax of fetch is a little bit cumbersome, and it is a little bit hard to use.//
//Axios makes it a little bit easier to make HTTP requests to external resources.//
//It is a little bit more user-friendly than fetch.//
//Hence the popular way to send back-end requests to the server is to use Axios.///
//Axios is a promise-based library.//


//Fetch example
// Fetch is a built-in function in JavaScript that allows us to make HTTP requests to external resources.//
//Inferior to Axios in terms of syntax.//

async function main(){
    const response = await fetch("https://sum-server.100xdevs.com/todos")
    const json = await response.json();
    console.log(json.todos.length);
}

main();

//Axios example
//we have to externally install axios using npm install axios
const axios = require("axios");
async function main(){
    const response = await axios.get("https://sum-server.100xdevs.com/todos");
    console.log(response.data.todos.length);
}


main();
