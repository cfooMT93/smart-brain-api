/* Things to add to your server.js
/ --> res = this is working
/signin --> POST = success/fail (we want to post it inside of the body [not a query string], ideally over https so its hidden from man in the middle attacks)
/register --> POST = user
/profile/:userID --> GET = user (GETs userID page)
/image --> PUT --> user (updates image count for user using PUT)
*/

const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');

const app = express();

app.use(bodyParser.json());
app.use(cors());

const database = {
    users: [
        {
            id: '123',
            name: 'John',
            email: 'john@gmail.com',
            password: 'cookies',
            entries: 0,
            joined: new Date()
        },
        {
            id: '124',
            name: 'Sally',
            email: 'Sally@gmail.com',
            password: 'bananas',
            entries: 0,
            joined: new Date()
        }
    ],
    login: [
        {
            id: '987',
            hash: '',
            email: 'john@gmail.com'
        }
    ]
}

// ROOT route
app.get('/', (req, res) => {
    res.send(database.users);
});

// SIGNIN
// test by going to postman: use 'POST' and localhost:3000/signin just like the directory used in here
app.post('/signin', (req, res) => {
    // res.send('') gives us signin is working but res.json('') gives us the json string "signin is working"
    // res.json('signin is working')

    // compare password hashes 
    bcrypt.compare("apples", '$2a$10$hckttkAzmHGJ9PsKyKLZUekjMOJlnXypa/UsGAB0iNNzZqvB.iHxy', function(err, res) {
        console.log('first guess', res)
    });
    bcrypt.compare("veggies", '$2a$10$hckttkAzmHGJ9PsKyKLZUekjMOJlnXypa/UsGAB0iNNzZqvB.iHxy', function(err, res) {
        console.log('second guess', res)
    });

    // in order for the code to check with the email object, we must parse it using bodyParser (and using body-parser you need app.use())
    if (req.body.email === database.users[0].email &&
            req.body.password === database.users[0].password) {
                res.json('success');
            } else {
                res.status(400).json('error logging in');
            }
})

// REGISTER
app.post('/register', (req, res) => {
    const { email, name, password } = req.body;
    // Secure Password when user registers - using bcrypt-nodejs
    // bcrypt.hash(password, null, null, function(err, hash) {
    //     console.log(hash);
    // });
    database.users.push({
        id: '125',
        name: name,
        email: email,
        password: password,
        entries: 0,
        joined: new Date()
    })
    // grabs the last user in the array; if there are 3 users (newly made one included) then the last user will be [2] therefore he does users.length -1
    res.json(database.users[database.users.length-1]);
})

// PROFILE :id
app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    let found = false;
    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            return res.json(user);
        } 
    })
    if (!found) {
        res.status(400).json('not found');
    }
})

// IMAGE COUNT
app.post('/image', (req, res) => {
    const { id } = req.body;
    let found = false;
    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            user.entries++
            return res.json(user.entries);
        } 
    })
    if (!found) {
        res.status(400).json('not found');
    }    
})

// // BCRYPT-NODEJS
// bcrypt.hash("bacon", null, null, function(err, hash) {
//     // Store hash in your password DB.
// });

// // Load hash from your password DB.
// bcrypt.compare("bacon", hash, function(err, res) {
//     // res == true
// });
// bcrypt.compare("veggies", hash, function(err, res) {
//     // res = false
// });

app.listen(3000, () => {
    console.log('app is running on port 3000')
}); 


