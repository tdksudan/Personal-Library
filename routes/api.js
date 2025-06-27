/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const Book = require('../bookModels'); // assuming you have a Book model defined
const mongoose = require('mongoose');


module.exports = function (app) {

  app.route('/api/books')
    .get( async function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      try{
        const books = await Book.find({}, 'title comments');
        const formattedBooks = books.map(book => ({
          _id: book._id,
          title: book.title,
          commentcount: book.comments.length  
        }));
        res.json(formattedBooks);
      }catch(error)
      {
        console.error("Error fetching books:", error);
        res.status(500).send("Server error");
      }
    })
    
    .post(async function (req, res){
      let title = req.body.title;
      //response will contain new book object including atleast _id and title
      if (!title)return res.send ('missing required field title');
      try{
          const newBook = new Book ({ title, comments: []});
          const saved = await newBook.save();
          res.json({_id: saved._id, title:saved.title});  
      }catch{
          res.status(500).send('server error');
      }
    })
    
    .delete(async function(req, res){
      //if successful response will be 'complete delete successful'
      try{
        await Book.deleteMany({});
        res.send('compelete delete successful');
      }catch (err){
        res.status(500).send('server error');
      }
    });



  app.route('/api/books/:id')
    .get(async function (req, res){
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      try{
        const book = await Book.findById(bookid);
        if(!book) return res.send('no book exists');
        res.json({_id: book.id, title: book.title, comments: book.comments});
      }
      catch (err){
        res.send("no book exists");
      }
    })
    
    .post( async function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
      if (!comment) return res.send('missing required field comment');

      try{
        const book = await Book.findById(bookid);
        if(!book) res.send ('no book exists');
        book.comments.push(comment);
        await book.save();
        res.json({_id: book._id, title: book.title, comments: book.comments});
      }catch (err){
        res.send('no book exists');
      }
    })
    
    .delete(async function (req, res) {
      const bookid = req.params.id;
      try {
        const deleted = await Book.findByIdAndDelete(bookid);
        if (!deleted) return res.send('no book exists');
        res.send('delete successful');
      } catch (err) {
        res.send('no book exists');
      }
    });

  
};
