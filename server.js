const express = require('express');
const path = require('path');
const fs = require("fs");

//const api = require('./routes/index.js');

const PORT = process.env.PORT || 3001;

const app = express();



// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//app.use('/api', api);

app.use(express.static('public'));
app.post('/api/notes', (req, res) => {
  // Log that a POST request was received
  console.info(`${req.method} request received to add a review`);

  // Destructuring assignment for the items in req.body
  const { title, text} = req.body;

  // If all the required properties are present
  if (title, text) {
    // Variable for the object we will save
    const newReview = {
      title,
      text,
      //review_id: uuid(),
    };

    // Obtain existing reviews
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        // Convert string into JSON object
        const parsedReviews = JSON.parse(data);

        // Add a new review
        parsedReviews.push(newReview);

        // Write updated reviews back to the file
        fs.writeFile(
          './db/db.json',
          JSON.stringify(parsedReviews, null, 4),
          (writeErr) =>
            writeErr
              ? console.error(writeErr)
              : console.info('Successfully updated reviews!')
        );
      }
    });

    const response = {
      status: 'success',
      body: newReview,
    };

    console.log(response);
    res.status(201).json(response);
  } else {
    res.status(500).json('Error in posting review');
  }
});

app.get('/api/notes', (req, res) =>{
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
          console.error(err);
        } else {
          // Convert string into JSON object
          const parsednotes = JSON.parse(data);
          res.json(parsednotes)
        }
    })
})

// GET Route for homepage
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
  
);

// GET Route for feedback page
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, './public/notes.html'))
);

// Wildcard route to direct users to a 404 page
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, './public/index.html'))
);

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);
