/*
*
*
*       Complete the API routing below
*       
*       
*/
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Model = mongoose.model

'use strict';

module.exports = function (app) {

  const connect = mongoose.connect(process.env.DB, {useNewUrlParser: true, useUnifiedTopology: true})

  const bookSchema = new Schema({
    title: {type: String, required: true},
    comments: [String]
  })

  const book = Model('Book', bookSchema)

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]

      let books = []
      let temp_book 

      book.find({}, (err, data) => {
        if (!err && data) {
          data.forEach((result) => {
            temp_book = result.toJSON()
            temp_book['commentcount'] = temp_book.comments.length
            books.push(temp_book)
          })
        
          return res.json(books)
        }
      })
    })
    
    .post(function (req, res){
      let title = req.body.title;
      //response will contain new book object including atleast _id and title

      if (!title) 
        return res.json('missing required field title')

      const newBook = new book({
        title: title,
        comments: []
      })

      newBook.save((err, data) => {
        if (!err && data) 
          return res.json(data) 
      })
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'

      book.deleteMany({}, (err, succeed) => {
        if (!err && succeed)
          return res.json('complete delete successful')

        return res.json('failed to complete delete')
      })
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}

      book.findById(bookid, (err, data) => {
        if (!err && data) 
          return res.json(data)
        
        return res.json('no book exists')
      })
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
      if (!comment) 
        return res.json('missing required field comment')

      book.findByIdAndUpdate(
        bookid,
        {$push: {comments: comment}},
        {new: true},
        (err, updated) => {
          if (!err && updated) 
            return res.json(updated)
          
          return res.json('no book exists')
        }
      )
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      //if successful response will be 'delete successful'

      book.findByIdAndRemove(bookid, (err, succeed) => {
        if (!err && succeed) 
          return res.json('delete successful')
        
        return res.json('no book exists')
      })
    });
  
};
