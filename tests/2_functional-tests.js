/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {

    let testId;
    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai 
          .request(server)
          .post('/api/books')
          .send({title: 'Test Book'})
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.property(res.body, 'title');
            assert.property(res.body, '_id');
            assert.equal(res.body.title, 'Test Book');
            testId = res.body._id; 
            done();
          })
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai
         .request(server)
         .post('/api/books')
         .send({})
         .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'missing required field title');
          done();
         });
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai 
         .request(server)
         .get('/api/books')
         .end(function(err,res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          if(res.body.length>0) {
            assert.property(res.body[0], 'title');
            assert.property(res.body[0], '_id');
            assert.property(res.body[0], 'commentcount');
          }
          done();
         })
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai
        .request(server)
        .get('/api/books/000000000000000000000000')
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'no book exists');
          done();
        });

        //done();
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai
         .request(server)
         .get('/api/books/'+testId)
         .end(function(err,res){
            assert.equal(res.status, 200);
            assert.property(res.body, "title");
            assert.property(res.body, '_id');
            assert.property(res.body,"comments");
            assert.isArray(res.body.comments);
            done();
         })
        //done();
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        chai
         .request(server)
         .post('/api/books/'+testId)
         .send({comment: 'Great read'})
         .end(function(err, res){
          assert.equal(res.status, 200);
          assert.property(res.body, 'comments');
          assert.include(res.body.comments, "Great read");
          done();
         })
        //done();
      });

      test('Test POST /api/books/[id] without comment field', function(done){
        chai 
         .request(server)
         .post('/api/books/'+testId)
         .send({})
         .end(function(err,res){
            assert.equal(res.status, 200);
            assert.equal(res.text, "missing required field comment");
            done();
          })
        //done();
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        chai 
         .request(server)
         .post('/api/books/000000000000000000000000')
         .send({comment: 'Oops'})
         .end(function(err, res){
          assert.equal(res.status, 200)
          assert.equal(res.text, "no book exists");
          done();
         })
        //done();
      });
      
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {
      let testId2;

      before(function(done) {
        chai.request(server)
        .post('/api/books')
        .send({ title: 'Book to delete' })
        .end(function(err, res) {
          testId2 = res.body._id;
          done();
        });
      });

      test('Test DELETE /api/books/[id] with valid id in db', function(done){
        chai
          .request(server)
          .delete('/api/books/'+testId2)
          .end(function(err,res){
            assert.equal(res.status,200);
            assert.equal(res.text,"delete successful");
            done();
          })

        //done();
      });

      test('Test DELETE /api/books', function (done) {
        chai
          .request(server)
          .delete('/api/books')
          .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'complete delete successful');
          done();
          });
      });



      test('Test DELETE /api/books/[id] with  id not in db', function(done){
        chai
         .request(server)
         .delete('/api/books/000000000000000000000000')
         .end(function(err,res){
           assert.equal(res.status, 200);
           assert.equal(res.text, 'no book exists');
           done();
         });
        //done();
      });

    });

  });

});
