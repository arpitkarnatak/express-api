const express = require('express');
const { check, validationResult } = require('express-validator')
const bodyparser = require('body-parser')
const path = require('path')
const router = express.Router();
const db = {
    "abc@gmail.com": {
        "username": "ARPIT",
        "password": "ARPIT"
    }
}


const app = express();

app.set("views", path.join(__dirname))
app.use("/", router);
app.use(bodyparser.urlencoded({ extended: false }))
app.use(bodyparser.json())
// Root Path
app.get('/', (req, res) => {
    res.send(db);
});

// Get  Details for an Email
// Used Async Await to wait for loading the resource from login
app.get('/db/:email', async (req, res) => {
    const { email } = req.params
    const ans = await db[email]
    res.send(ans)
})

// Post an Email
app.post('/api/signup',
    [check('email', 'It is not an Email').isEmail(),
    check('password', 'Invalid Password').matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i"), // Regular expression for password matching
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (req.body.password.toString().includes(req.body.username.toString())){
            res.send("Contains username")
        }
        if (!errors.isEmpty()) {
            res.send(errors.json())
        }
        else {
            const { email, username, password } = req.body
            db[email] = { username: username, password: password }
            res.send({
                status: 200,
                database: db
            });
        }
    })


//Listener
app.listen(3000, () => {
    console.log('listening on port 3001');
});