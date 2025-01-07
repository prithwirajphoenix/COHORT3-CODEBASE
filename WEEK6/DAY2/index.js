const express = require("express");
const jwt = require("jsonwebtoken");
const JWT_HONEYSINGH = "honeysinghmoduri";
const app = express();
app.use(express.json());
const users = [];

function pookie (req, res,next){            //yeh ek logger middleware bnay jo bta raha hai like which req is coming to the server..aur yeh hamare terminal pe btayega ki kaunsa req aa rha hai 
    console.log(req.method + " - Request came !")
    next();
}

app.get("/", function(req, res){            //frontend part ko idhar se connect kr diya like jaise hi localhost:3000 search krenge backend server strt krne ke badd then woh yeh file ko return krega 
    res.sendFile(__dirname + "/public/index.html");
})

// This one generates the JWT:
app.post("/signup", pookie, function(req, res) {
    const username = req.body.username; // //username and password yaha se input le rha hai woh jo user provide kr rha hai 
    const password = req.body.password;

    users.push({          ////yeh global array pe data store kr diye hai..uspe yeh datas push krke 
        username: username,
        password: password
    });

    res.json({
        message: "Aaiye aapka intezaar tha"
    });
});

//We should actually check whether the same username exists already
//This one verifies the JWT 
/*app.post("/signin", function(req,res){
    const username = req.body.username
    const password = req.body.password*/
   /* let foundUser = null;
    
    for (let i=0; i< users.length; i++){
        if (users[i].username === username && users[i].password){
            foundUser = users[i]
        }
    }
        if (!foundUser){
            res.json({
                message:"Yeh accha baat nahi hai"
            })
            return
        }   else{
            const token = jwt.sign({
                username
            }, JWT_HONEYSINGH);
            res.json({
                token: token
            })

        }    
        }

})
 */
app.post("/signin", pookie , function (req, res) {
    const username = req.body.username;
    const password = req.body.password;

    // Check if the user exists and the password matches
   /* let foundUser = users.find(
        (user) => user.username === username && user.password === password
    );*/

    let foundUser = null;                               //pehle isko null rakhe hai ekdm empty

    for (let i = 0; i < users.length; i++) {            //yeh users array se search kr rha hai jo ki yaha ke input upar wle input se kaunse wle se match kr rha hai..usko founUser pe store krna hai
        if (users[i].username === username && users[i].password === password) {
            foundUser = users[i];                       //yaha store kiya hai
        }
    }

    if (!foundUser) {
        // If the user is not found or password is incorrect, send an error response
        return res.status(401).json({  
            message: "Accha baat nahi hai"  // Fixed the semicolon here
        });
    }

    else{                                              //aur agar hai then jwt se usko sign kro means encode kro apne secret key se 
        const token = jwt.sign({ 
            username
        }, JWT_HONEYSINGH);

        res.json({ 
            token: token,
            message: "Saajan ji ghar aaye!"
                                    //aur yeh token return kr do
        });
    }
});

    /*// If user is found, sign a JWT token
    const token = jwt.sign(
        {
            username, // Payload
        },
        JWT_HONEYSINGH // Secret key
    );

    res.json({
        token: token,
        message: "Saajan ji ghar aaye!",
    });
});*/


/*app.get("/me", function(req,res){
    res.sendFile(__dirname + "/Public/SathiDas.html")    
})
 */

function auth(req, res, next) {
    const token = req.headers.token;                    //header se token lega yeh aur token variable pe store kr rha hai
    if (!token) {                                       //agar token nahi hai toh ..yeh status code aur message show kr do
        return res.status(401).json({ message: "Token is missing" });
    }
    try {
        const decodedData = jwt.verify(token, JWT_HONEYSINGH);      //yaha se token se woh username ko nikal rhe hai jo phle hmlg encode kiye the isliye same secret key se verify kr rhe ki kya hai wahi username hai ya nahi
        if (decodedData.username) {                             //aur if decodedData.username hai toh yeh kro
            req.username = decodedData.username;                //yeh req.username pe isliye store kiye hai decodedData ko isliye kyuki req aur res abko access kr skte toh yeh data sabhi pe easily pass ho jaye
            next();                                             //aur yeh niche wle method ko call kr diya 
        } else {                                                //aur woh decodedData nhi hua toh yeh return kro
            res.status(401).json({ message: "Invalid token" });
        }
    } catch (error) {                                           //warna kuch error aye toh yeh status and message return kr do 
        res.status(401).json({ message: "Failed to authenticate token" });
    }
}
    


app.get("/me", pookie, auth, function(req, res) {
    const foundUser = users.find(user => user.username === req.username);           //yeh loop ki trah hai middleware se pass hue req.username ko leke check rha hai..arrow function hai ki function agrument pe user diye aur usse chcek kr rhe user.username wahi req.username hai ki nahi aur usko foundUser pe store kr diye hai
    
    if (!foundUser) {                                                   //agar foundUser nhi hai toh yeh status show kro message ke sath
        return res.status(404).json({ message: "User not found" });
    }

    res.json({                                                          //and if its there then return this data as a response of it.
        username: foundUser.username,
        password: foundUser.password
    });
});



app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running...");
});
/*
/*The GET / route is only serving a static file (index.html), so logging may not be considered necessary for this route.
The POST /signup route involves user input and interaction (e.g., processing form data). Logging requests here helps track important activity, like signups.
try block: Contains the code that might throw an error.
catch block: Executes code when an error occurs in the try block. 
In this code, the first part handles user authentication by checking the provided credentials against a list of users, generating a JWT token if the credentials are valid. The second part, the auth middleware, is used to verify the token that is provided with subsequent requests. Both serve different but complementary purposes, and here's why both are necessary:

1. Initial Authentication (Generating the Token)
The first block of code authenticates the user by:

Checking if the provided username and password match any entry in the users array.
If a match is found, it generates a JWT token containing the username and signs it with a secret key (JWT_HONEYSINGH).
The token is then sent to the user in the response.
This step is necessary for user login. It ensures that only valid users (with correct credentials) can obtain a JWT token, which they can later use to authenticate their requests.

2. Token Authentication (Verifying the Token)
The second block is middleware used to authenticate future requests from users who already have a valid token.

When a user makes a subsequent request (e.g., to access a protected route), they must send the JWT token in the request headers.
The auth middleware checks for the presence of the token in the request header. If no token is found, it sends a 401 Unauthorized status with a message "Token is missing".
If the token is found, the middleware uses the jwt.verify method to decode and verify the token. This checks:
Whether the token is valid and matches the secret key (JWT_HONEYSINGH).
Whether the decoded data contains the username.
If the token is valid, it stores the username from the decoded data into req.username so that the request handler can access it in the next middleware or route handler.
If the token is invalid or verification fails, it returns a 401 Unauthorized status with a relevant error message.
Why Both Steps Are Necessary:
Authentication during Login (JWT generation):

This is the process where the user provides their credentials (username/password) to log in.
If valid, a token is issued that proves the user is who they claim to be. The token contains information (like username) that can be used to authenticate the user for future requests.
Authentication for Future Requests (JWT verification):

Even after generating the token, we need a way to authenticate future requests to protected routes.
The token must be verified in every request that requires the user to be authenticated. The auth middleware does this by checking if the token is valid and extracting the user's information (like username) for further processing.
Without this middleware, anyone could send arbitrary requests without being authenticated.
Why Can't We Just Use the Initial Authentication Code Again?
The initial authentication logic is meant for the login process — it's a one-time check to authenticate the user and generate a token. Once the token is issued, you don't want to repeat the authentication process every time the user makes a request. Instead, you need a way to validate that the user is still authorized to access the requested resource using the JWT token.

JWT tokens are typically used to authenticate requests across multiple interactions, making it unnecessary to re-check the credentials (username/password) each time the user makes a request.
The auth middleware acts as a token verification mechanism that ensures users are still valid without needing to repeatedly check their credentials.
Summary:
Initial Authentication: Checks the username and password, generates a token upon successful login.
Token Authentication: Verifies the token in subsequent requests to ensure that the user is authorized to access protected resources.
Both processes are important because:
The first one ensures that only valid users get a token.
The second one ensures that the user is still valid when making future requests without needing to re-check their credentials.*/


