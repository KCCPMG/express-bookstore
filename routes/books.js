const express = require("express");
const Book = require("../models/book");
const jsonschema = require('jsonschema');
const bookSchema = require('../schemas/bookSchema.json');


const router = new express.Router();


const validateBook = (req, res, next) => {
  const validation = jsonschema.validate(req.body, bookSchema);
  if (validation.valid) {
    return next();
  } else {
    return res.status(400).json({errors: validation.errors})
  }
}


/** GET / => {books: [book, ...]}  */

router.get("/", async function (req, res, next) {
  try {
    const books = await Book.findAll(req.query);
    return res.json({ books });
  } catch (err) {
    return next(err);
  }
});

/** GET /[id]  => {book: book} */

router.get("/:id", async function (req, res, next) {
  try {
    const book = await Book.findOne(req.params.id);
    return res.json({ book });
  } catch (err) {
    return next(err);
  }
});

/** POST /   bookData => {book: newBook}  */

router.post("/", validateBook, async function (req, res, next) {
  try {
    const book = await Book.create(req.body);
    return res.status(201).json({ book });
  } catch(err) {
    return next(err);
  }

});




/** PUT /[isbn]   bookData => {book: updatedBook}  */

router.put("/:isbn", validateBook, async function (req, res, next) {
  try {
    const book = await Book.update(req.params.isbn, req.body);
    return res.json({ book });
  } catch (err) {
    return next(err);
  }
});

/** DELETE /[isbn]   => {message: "Book deleted"} */

router.delete("/:isbn", async function (req, res, next) {
  try {
    await Book.remove(req.params.isbn);
    return res.json({ message: "Book deleted" });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;