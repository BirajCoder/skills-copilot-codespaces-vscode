// Create web server
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Set up MongoDB
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017";
const dbName = 'comment';
const client = new MongoClient(url);

// Set up body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Set up template engine
app.set('view engine', 'ejs');

// Set up static files
app.use(express.static('public'));

// Connect to MongoDB
client.connect(function(err) {
    if (err) throw err;
    console.log('Connected to MongoDB successfully');
    const db = client.db(dbName);
    const collection = db.collection('comment');

    // Render index.ejs
    app.get('/', (req, res) => {
        collection.find().toArray(function(err, result) {
            if (err) throw err;
            res.render('index.ejs', {comments: result});
        });
    });

    // Post comment
    app.post('/comment', (req, res) => {
        collection.insertOne(req.body, function(err, result) {
            if (err) throw err;
            console.log('Comment posted');
            res.redirect('/');
        });
    });

    // Delete comment
    app.delete('/comment', (req, res) => {
        collection.deleteOne(req.body, function(err, result) {
            if (err) throw err;
            console.log('Comment deleted');
            res.json('Comment deleted');
        });
    });

    // Update comment
    app.put('/comment', (req, res) => {
        collection.updateOne(req.body[0], req.body[1], function(err, result) {
            if (err) throw err;
            console.log('Comment updated');
            res.json('Comment updated');
        });
    });

    // Listen to port
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
});

