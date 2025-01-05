const express = require('express');
const bcrypt = require('bcrypt');
const { randomUUID } = require('crypto');
const app = express();

app.use(express.json());

const users = [];

// Signup endpoint
app.post("/signup", async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).send({ message: "Username and password are required" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ username, password: hashedPassword });
    res.send({ message: "You have signed up" });
});

// Signin endpoint
app.post("/signin", async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).send({ message: "Username and password are required" });
    }
    const foundUser = users.find(user => user.username === username);
    if (foundUser && await bcrypt.compare(password, foundUser.password)) {
        const token = randomUUID();
        foundUser.token = token;
        res.json({ token });
    } else {
        res.status(403).send({ message: "Invalid username or password" });
    }
});

// Protected endpoint to fetch user details
app.get("/me", (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).send({ message: "Authorization token is missing" });
    }
    const foundUser = users.find(user => user.token === token);
    if (foundUser) {
        res.json({ username: foundUser.username });
    } else {
        res.status(403).send({ message: "Token Invalid" });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port 3000`));