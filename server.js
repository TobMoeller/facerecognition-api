const express = require("express");
const cors = require("cors");

const app = express();

const database = {
    users: [
        {
            id: "123",
            name: "Mary",
            email: "mary@mary.de",
            password: "pw1234",
            entries: 0,
            joined: new Date(),
        },
        {
            id: "124",
            name: "Cary",
            email: "cary@cary.de",
            password: "pw4321",
            entries: 0,
            joined: new Date(),
        }
    ]
}

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.send(database.users);
})

app.post("/signin", (req, res) => {
    if (req.body.email === database.users[1].email &&
        req.body.password === database.users[1].password) {
            res.json(database.users[1]);
        } else {
            res.status(400).json("error logging in")
        }
})

app.post("/register", (req, res) => {
    const { email, name, password } = req.body;
    database.users.push({
        id: "125",
        name: name,
        email: email,
        password: password,
        entries: 0,
        joined: new Date(),
    })
    res.json(database.users[database.users.length-1]);
})

app.get("/profile/:id", (req, res) => {
    const  { id } = req.params;
    let found = false;
    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            return res.json(user);
        }
    })
    if (!found) {
        return res.status(400).json("user not found");
    }
})

app.put("/image", (req, res) => {
    const  { id } = req.body;
    let found = false;
    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            user.entries++;
            return res.json(user.entries);
        }
    })
    if (!found) {
        return res.status(400).json("user not found");
    }
})

// Applistener on Port 3000

app.listen(3000, ()=> {
    console.log("app is running on port 3000")
})