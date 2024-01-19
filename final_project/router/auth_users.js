const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();
const usersdb = require("./usersdb.js");
const isValid = (username) => {
    if (usersdb[username]) {
        return true;
    }
    return false;
}

const authenticatedUser = (username, password) => {
    //check if the user exists in the usersdb
    //   console.log("What is the username111", username)
    if (isValid(username)) {//check if the password matches
        //       console.log("What is the password", password)
        if (usersdb[username].password === password) {
            //         console.log("Authentificated user return true")
            return true;
        }
    }
    //   console.log("Authentificated user return false")
    return false;
};

const checkthatuserexists = (username) => {
    if (isValid(username)) {
        return true;
    }
    return false;
}

regd_users.post("/login", (req, res) => {
    let user = req.query.user, password = req.query.password;

//    console.log("What is the username==", user)
    //   console.log("What is the password==", password)
    if (authenticatedUser(user, password)) {
        let token = jwt.sign({username: user}, "fingerprint_customer");
        //       console.log("User logged in successfully")
        return res.status(200).json({message: "User logged in successfully", token: token});
    } else {
        return res.status(401).json({message: "Invalid credentials"});
    }
});


// Add a book review
regd_users.put("/auth/review", (req, res) => {
    // check that the user is logged in and have token in the header
    //   console.log("What is the req.headers.authorization")
    let token = req.headers.authorization;
    // console.log("What is the token", token)
    //   console.log("Is the token true?  " + (typeof token !== 'undefined'));
    if (typeof token !== 'undefined') {
        //      console.log("jwt verification" + jwt.verify(token, "fingerprint_customer"))
        jwt.verify(token, "fingerprint_customer", (err, authData) => {
            if (err) {
                res.sendStatus(403);
            } else {
                let isbn = req.query.isbn;
                let review = req.query.review;
                if (!isbn || !review) {
                    return res.status(400).json({message: "ISBN and review are required"});
                }
                let bookFound = false;

                for (let key in books) {
                    if (books[key].ISBN === isbn) {
                        books[key].reviews = {review: review};
                        bookFound = true;
                        return res.status(200).json({message: "Review added successfully"});
                    }
                }
                if (!bookFound) {
                    console.log("Response 404")
                    return res.status(404).json({message: "Book not found"});
                }
            }
        });
    } else {
        res.sendStatus(403);
    }

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
//module.exports.users = users;
module.exports.checkthatuserexists = checkthatuserexists;
