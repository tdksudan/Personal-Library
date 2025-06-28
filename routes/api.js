/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const Book = require('../bookModels');
const mongoose = require('mongoose');

module.exports = function (app) {
  
  app.route('/api/books')
    .get(async function (req, res) {
      try {
        const books = await Book.find({}, 'title comments');
        const formattedBooks = books.map(book => ({
          _id: book._id,
          title: book.title,
          commentcount: book.comments.length
        }));
        return res.json(formattedBooks);
      } catch (error) {
        console.error("Error fetching books:", error);
        return res.status(500).send("server error");
      }
    })

    .post(async function (req, res) {
      const title = req.body.title;

      if (!title) return res.send('missing required field title');

      try {
        const newBook = new Book({ title, comments: [] });
        const saved = await newBook.save();
        return res.json({ _id: saved._id, title: saved.title });
      } catch (err) {
        console.error("Error saving book:", err);
        return res.status(500).send('server error');
      }
    })

    .delete(async function (req, res) {
      try {
        await Book.deleteMany({});
        return res.send('complete delete successful');
      } catch (err) {
        console.error("Error deleting books:", err);
        return res.status(500).send('server error');
      }
    });

  app.route('/api/books/:id')
    .get(async function (req, res) {
      const bookid = req.params.id;

      try {
        const book = await Book.findById(bookid);
        if (!book) return res.send('no book exists');
        return res.json({ _id: book.id, title: book.title, comments: book.comments });
      } catch (err) {
        console.error("Error fetching book:", err);
        return res.send('no book exists');
      }
    })

    .post(async function (req, res) {
      const bookid = req.params.id;
      const comment = req.body.comment;

      if (!comment) return res.send('missing required field comment');

      try {
        const book = await Book.findById(bookid);
        if (!book) return res.send('no book exists');

        book.comments.push(comment);
        await book.save();

        return res.json({ _id: book._id, title: book.title, comments: book.comments });
      } catch (err) {
        console.error("Error adding comment:", err);
        return res.status(500).send('server error');
      }
    })

    .delete(async function (req, res) {
      const bookid = req.params.id;

      try {
        const deleted = await Book.findByIdAndDelete(bookid);
        if (!deleted) return res.send('no book exists');
        return res.send('delete successful');
      } catch (err) {
        console.error("Error deleting book:", err);
        return res.status(500).send('server error');
      }
    });

};
