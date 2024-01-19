const express = require('express');
let books = require("./booksdb.js");
const {checkthatuserexists} = require("./auth_users");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const router = express.Router();

// Register a new user
public_users.post("/register", (req, res) => {
    // Extract login and password from request body
    const {login, password} = req.query;

    return res.status(200).json({message: "User registered successfully"});
});

public_users.get('/', function (req, res) {
    // Check if books is empty
    if (Object.keys(books).length === 0) {
        return res.status(404).json({message: "No books available in the shop"});
    }
    // Get the book list available in the shop from booksdb.js file and return it as a response
    let book_list = [];
    for (let book in books) {
        book_list.push(books[book]);
    }
    return res.status(200).json(book_list);
});


// Get book details based on ISBN
public_users.get('/isbn', function (req, res) {
    // Extract ISBN from request query
    const {isbn} = req.query;

    // Check if ISBN is provided
    if (!isbn) {
        return res.status(400).json({message: "ISBN is required"});
    }

    // Check if the given isbn exists in the books
    for (let book in books) {
        if (books[book].ISBN === isbn) {
            // Return the book details as a response
            return res.status(200).json(books[book]);
        }
    }

    // If the book is not found
    return res.status(404).json({message: "Book not found"});
});


// Get book details based on author
public_users.get('/author', function (req, res) {
    //Write your code here
    const {author} = req.query;
    //check that author is provided
    if (!author) {
        return res.status(400).json({message: "Author is required"});
    }
    //check if the given author exists in the books
    for (let book in books) {
        if (books[book].author === author) {
            //return the book details as a response
            return res.status(200).json(books[book]);
        }
    }
    //if the book is not found
    return res.status(404).json({message: "Book not found"});
});

// Get all books based on title
public_users.get('/title', function (req, res) {
// check if the title is provided
    const {title} = req.query;
    if (!title) {
        return res.status(400).json({message: "Title is required"});
    }
    //check if the given title exists in the books
    for (let book in books) {
        if (books[book].title === title) {
            //return the book details as a response
            return res.status(200).json(books[book]);
        }
    }
    //if the book is not found
    return res.status(404).json({message: "Book not found"});

});

//  Get book review
public_users.get('/review/', function (req, res) {
    //check that isbn is provided
    const {isbn} = req.query;
    if (!isbn) {
        return res.status(400).json({message: "ISBN is required"});
    }
    //check if the given isbn exists in the books
    for (let book in books) {
        if (books[book].ISBN === isbn) {
            //return the book details as a response
            return res.status(200).json(books[book].reviews);
            console.log("Testtttt", req);
        }
    }
    //if the book is not found
    return res.status(404).json({message: "Book not found"});
});

module.exports = {
    general: public_users,
    router: router
};
