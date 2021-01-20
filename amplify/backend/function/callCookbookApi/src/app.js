/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/




var express = require('express')
var bodyParser = require('body-parser')
var awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
var axios = require('axios')

//Import get secrets function
var secret = require('./secret-manager')

// declare a new express app
var app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
// app.use(function(req, res, next) {
//   console.log("within the app.use for enabling CORS")
//   res.header("Access-Control-Allow-Origin", "*")
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
//   next()
// });
console.log("Line 32 of app")

app.use(function (request, res, next) {
  console.log("within the app.use for enabling CORS")
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  //intercept the OPTIONS call so we don't double up on calls to the integration
  if ('OPTIONS' === request.method) {
    res.send(200);
  } else {
    next();
  }
});


/**********************
 * Example get method *
 **********************/

// app.get('/cookbook', function(req, res) {
//   // Add your code here
//   res.json({success: 'get call succeed!', url: req.url});
// });

// app.get('/cookbook/*', function(req, res) {
//   // Add your code here
//   res.json({success: 'get call succeed!', url: req.url});
// });

/****************************
* Example post method *
****************************/



app.post('/cookbook', function(req, res) {

    const { currentUrl } = req.body

    const secretObj = await secret()

    var options = {
      method: 'POST',
      url: 'https://mycookbook-io1.p.rapidapi.com/recipes/rapidapi',
      headers: {
        'content-type': 'application/xml',
        'x-rapidapi-key': secretObj["RAPIDAPI_API_KEY"],
        'x-rapidapi-host': 'mycookbook-io1.p.rapidapi.com'
      },
      data: currentUrl
    };
    
    console.log("Line above axios in app.js")

    axios.request(options)
      .then(res => {
        // console.log(res.data);
        console.log("Successfully entered the Axios .then")
        const recipeData = res.data.body[0]
        return res.send(recipeData)
      })
      .catch(err => {
        console.error(error);
        return res.status(500).send("Error")
      });
  });

// app.post('/cookbook', function(req, res) {
//   // Add your code here
//   res.json({success: 'post call succeed!', url: req.url, body: req.body})
// });

// app.post('/cookbook/*', function(req, res) {
//   // Add your code here
//   res.json({success: 'post call succeed!', url: req.url, body: req.body})
// });

// /****************************
// * Example put method *
// ****************************/

// app.put('/cookbook', function(req, res) {
//   // Add your code here
//   res.json({success: 'put call succeed!', url: req.url, body: req.body})
// });

// app.put('/cookbook/*', function(req, res) {
//   // Add your code here
//   res.json({success: 'put call succeed!', url: req.url, body: req.body})
// });

// /****************************
// * Example delete method *
// ****************************/

// app.delete('/cookbook', function(req, res) {
//   // Add your code here
//   res.json({success: 'delete call succeed!', url: req.url});
// });

// app.delete('/cookbook/*', function(req, res) {
//   // Add your code here
//   res.json({success: 'delete call succeed!', url: req.url});
// });

app.listen(3000, function() {
    console.log("App started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
