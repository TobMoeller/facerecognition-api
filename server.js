const express = require("express");

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

app.get("/", (req, res) => {
    res.send(database.users);
})

app.post("/signin", (req, res) => {
    if (req.body.email === database.users[1].email &&
        req.body.password === database.users[1].password) {
            res.json("success");
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


app.listen(3000, ()=> {
    console.log("app is running on port 3000")
})

/*
root => res = this is working
signin => POST = success/fail
register => POST = user
profile/:userID => GET = user
image => PUT = count

*/