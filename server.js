// Server Configuration
var express = require('express');
var fabric = require('fabric').fabric;
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());

// Server Routing
app.post('/', function(req, res){
	
	// Allow Cross-Domain requests from anywhere
	res.set({
	  	'Access-Control-Allow-Origin': '*',
	  	'Content-Type': 'application/json'
	});

	var data = '';
	
	req.on('data', function(chunk){
		data += chunk;

		// ~ 1MB limit; otherwise destroy connection.
        // if (data.length > 1e6) { 
        //     req.connection.destroy();
        // }
	});

	req.on('end', function(){
		console.log('Serving up: ', data);
		sendDataURI(data, res);
	});
});

// Functions
function sendDataURI(url, res){
	fabric.Image.fromURL(url, function(oImg) {
	  var canvas = new fabric.Canvas();
	  canvas.setDimensions({width: oImg.width, height: oImg.height});
	  canvas.add(oImg);
	  var dataURL = canvas.toDataURL();
	  res.send({dataURI: dataURL, src: url});
	});
}

// Start Server
var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});