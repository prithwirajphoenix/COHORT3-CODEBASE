const express = require('express') // This line is used to import the express module
const app = express()// This line is used to create an express application, which means we are activating the express module

app.get('/', function (req, res) {      
  res.send('Hello World')
})

app.get('/asd', function (req, res) {   
  res.send('Heyyy from asd endpoint')
})

app.post('/asd', function (req, res) {   
  res.send('Hii from lol')
})

//How can we post anything in the localhost 3000?
//Answer: We can use postman to post anything in the localhost 3000.
//Process: We have to open the postman and then we have to select the post option and then we have to write the localhost 3000 and then we have to write the endpoint name and then we have to click on send button and then we can see the output in the postman itself.

app.listen(3000)                        //This specifies the port number and yeh local host ko start rakhega as we can check this in postman too by checking the get req of localhost 3000


