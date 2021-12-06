const express = require('express');
// create a new express server
const app = express();
const fileUpload = require('express-fileupload');
const multer = require('multer');


app.use(express.static(`${__dirname}/dist/src/web-app`));

app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 },
}));


var documentunderstanding = require('./routes/documentunderstanding')

app.use('/api/documentunderstanding',documentunderstanding);



const port = process.env.PORT || 3001


app.listen(port, '0.0.0.0', () => {
    // print a message when the server starts listening
    console.log(`server starting on ${port}`);
  });
