var http = require("http");
var express = require('express')

var app = express();
var logger = require('morgan')
var bodyParser = require('body-parser')
var cors = require("cors")

var server = http.createServer(app);
let port = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({ extended: false })); //Parses urlencoded bodies
app.use(bodyParser.json()) //SendJSON response
app.use(logger('dev'))
app.use(cors());

// Imports the Google Cloud client library
const language = require('@google-cloud/language');

// Instantiates a client
const client = new language.LanguageServiceClient();


let router = express.Router();
router.route('/health').
      get((req, res)=>{
        res.send({"status":"ok"})
      })
router.route("/review")
      .post((req, res)=>{
        console.log(req.body);
        let review = req.body;
        let document = {
            content: review.text,
            type: 'PLAIN_TEXT',
          };
        client
        .analyzeSentiment({document:document})
        .then((result)=>{
          res.status(200).send(result);
        })
        .catch((err)=>{
          res.status(500).send(err);
        });
         
      })

app.use("/", router);

server.listen(port,()=>{
    console.log(`backend listening on port:${port}`);
})






//#region Usage Example
// // The text to analyze
// const text = 'Hello, world!';

// const document = {
//   content: text,
//   type: 'PLAIN_TEXT',
// };

// // Detects the sentiment of the text
// client
//   .analyzeSentiment({document: document})
//   .then(results => {
//     const sentiment = results[0].documentSentiment;

//     console.log(`Text: ${text}`);
//     console.log(`Sentiment score: ${sentiment.score}`);
//     console.log(`Sentiment magnitude: ${sentiment.magnitude}`);
//   })
//   .catch(err => {
//     console.error('ERROR:', err);
//   });

//#endregion

