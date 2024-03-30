// Example using Express.js
const express = require('express');
const app = express();
const bodyParser = require("body-parser");

// Middleware to parse JSON body
app.use(bodyParser.json());

// Include route files
const notion_Route = require('./routes/notion');

// Use routes
app.use('/notion', notion_Route);

// For Json 
app.use(express.json());

// Example defining a route in Express
app.get('/', (req, res) => {
   const data =  {
        name : "surendra"
    }
    res.send(data);
    console.log(data)
});

app.post("/submit-form", (req, res) => {
    const formData = req.body; // Access form data from request body
    console.log("Form data received:", formData);
  
    // Process the form data as needed
    // For example, you can save it to a database or perform other actions
  
    res.json({ success: true, message: "Form data received successfully" });
  });

// Example specifying the port and starting the server
const port = 3000; // You can use environment variables for port configuration
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});