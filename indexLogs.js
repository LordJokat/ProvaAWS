const http = require('http');
const request = require('request');
const fs = require('fs');
const csv = require('csv');
const url = require('url');
const createHtml = require('./createHtml.js');
const updateLog = require('./updateLog.js');

var content;
// First I want to read the file
fs.readFile('./index.html', 'utf8', function read(err, data) {
    if (err) {
        throw err;
    }
    content = data;

    // Invoke the next step here however you like
    console.log("file read")
});


var requestBodyJson;
var requestBodyCsv;

setInterval(function(){
	request('https://www.bnefoodtrucks.com.au/api/1/trucks', function(error, response, body){
		requestBodyJson = body;
	});
	
	request('https://www.data.brisbane.qld.gov.au/data/dataset/1e11bcdd-fab1-4ec5-b671-396fd1e6dd70/resource/3c972b8e-9340-4b6d-8c7b-2ed988aa3343/download/public-art-open-data-2020-01-09.csv', function(error, response, body){
		csv.parse(body, function(error, data) {
			requestBodyCsv = data;
		})
	});
}, 2000);

console.log("start")
http.createServer(function(request, response){
	console.log("connect")
	if (requestBodyJson && requestBodyCsv && content){
		response.writeHead(200, {'Content-Type': 'text/html'});
		
		var requestUrl = url.parse(request.url);
		switch(requestUrl.path){
		case '/json':
			updateLog.updateLogFile("Accessed JSON data");
			response.end(createHtml.createJson(content, JSON.parse(requestBodyJson)));
			break;
		case '/csv':
			updateLog.updateLogFile("Accessed CSV data");
			response.end(createHtml.createCSV(content, requestBodyCsv));
			break;
		}
	}else{
		response.writeHead(200, {'Content-Type': 'text/html'});
		response.end('Nothing');
	}
}).listen(8080);

console.log("started on 8080");
