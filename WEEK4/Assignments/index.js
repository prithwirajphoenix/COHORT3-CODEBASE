/*
Assignments #1 - Create a cli

Create a `command line interface` that lets the user specify a 
file path and the nodejs process counts the number of words inside it.

Input - node index.js /Users/kirat/file.txt
Output - You have 10 words in this file

Command - `node index.js count_words filePath`
*/

//commander is a npm package which is used to create command line interface
//command line interface is a way to interact with the computer
//using commands in the terminal
//like we can use git commands in the terminal
//like we can use npm commands in the terminal
// examples of commands are like 'git init', 'npm init'
//we can create our own commands using commander npm package
// for example we can create a command like 'node index.js count_words filePath'
// here the command is 'count_words' and the argument is 'filePath'
//argument means the value that we pass to the command
// To put it simply, arguments are the data that we pass to the command
//An object is a self-contained entity that consists of properties (data) and methods (functions).
//An instance is a copy of an object that is created by a constructor function.

//code:

const fs = require('fs'); // This is a core module of nodejs which is used to read and write files.
//  It's the first line of code in the file in every nodejs file.
const { Command } = require('commander');// Since we are creating a command line interface, we need to import the commander package.
const program = new Command();// We are creating a new instance of the Command class from the commander package.
// This instance will be used to create commands and arguments.
//Think of program as the object that will hold all the commands and arguments of the CLI.

// Now since we created the program, 
// we can start adding commands to it.


program
  .name('lines-counter')                                   //name of the program 
  .description('CLI to do file based tasks')        //description of the program
  .version('0.1.0')                               //version of the program

program.command('count')            // Program has a command called 'count'.It means that we can run 'count' command in the terminal.
  .description('Count the number of lines in a file')       //description of the command explaining what it does 
  .argument('a.txt', 'file to count lines')         //argument of the command. It means that the command needs a file as an argument.
  .action((file) => {                          //action of the command. It is the code that will run when the command is executed. It means I am ordering what to do when the command is executed.
    fs.readFile(file, 'utf8', (err, data) => {                  //reading the file ; 'utf8' is the encoding of the file; err is the error and data is the content of the file
      if (err) {                                                //if there is an error in reading the file then what to do is written here
        console.log(err);                               //printing the error    
      } else {                                              //if there is no error in reading the file then what to do is written here
        const lines = data.split('\n').length;             //const means constant; lines is the number of lines in the file; data.split('\n') is splitting the data into lines and .length is counting the number of lines
        console.log(`There are ${lines} lines in ${file}`);
      }
    });
  });

program.parse();
//parse is a method of the program object that is used to parse the command line arguments.
//The word parse means to analyze a string or text into logical syntactic components.
//It is compulsory to call the parse method after adding all the commands and arguments to the program object, because it is the method that actually runs the commands and arguments.
//The use of const is to declare a constant variable.
//For example if we declare a variable using const then we cannot change the value of that variable, like in const lines = data.split('\n').length; we cannot change the value of lines.
//We had to use .length because split('\n') will return an array of lines and we need to count the number of lines in the array.
//the use of .length is to count the number of elements in the array.
//.length is an example of a method(a method is a function that belongs to an object) of an array.
// Note:
// To execute yeh command we have type "node THIS_FILE_NAME COMMAND_NAME NAME_OF_THE_OTHER_FILE_JISPE_COMMAND_OPERATE_KREGA" ...EX - 'node injex.js count a.txt'