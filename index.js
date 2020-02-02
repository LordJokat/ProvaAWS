const http = require('http');
const request = require('request');
const fs = require('fs');
const csv = require('csv');
const url = require('url');

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

function createJson(data){
	let html = content;
	
	html += '<div class="wrapper">';
	html += '	<div class="table">';
	html += '		<div class="row header">';
	
	for (let attribute in data[0]){
		if(typeof attribute[0][attribute] !== 'object'){
			html += '	<div class="cell">'+attribute+'</div>';
		}
	}
	html += '		</div>';

	data.forEach(function(innerData){
		html += '	<div class="row">';
		for (let attribute in innerData){
			if(typeof innerData[attribute] !== 'object'){
				html += '<div class="cell" data-title="Name">'+innerData[attribute]+'</div>'
			}
		}
		html += '	</div>';
	})
	html += '	</div>';
	html += '</div>';
	
	return html;
}

function createCSV(data){
	let html = content;
	
	html += '<div class="wrapper">';
	html += '	<div class="table">';
	html += '		<div class="row header">';
	
	data[0].forEach(function(attribute){
		html += '	<div class="cell">'+attribute+'</div>';
	})
	html += '		</div>';
	
	var moreData = data.slice(1);
	
	moreData.forEach(function(innerData){
		html += '	<div class="row">';
		innerData.forEach(function(cell){
			html += '<div class="cell" data-title="Name">'+cell+'</div>'
		})
		html += '	</div>';
	})
	html += '	</div>';
	html += '</div>';
	
	return html;
}

request('https://www.bnefoodtrucks.com.au/api/1/trucks', function(error, response, body){
	console.log("data loaded")
	requestBodyJson = body;
});

request('https://www.data.brisbane.qld.gov.au/data/dataset/1e11bcdd-fab1-4ec5-b671-396fd1e6dd70/resource/3c972b8e-9340-4b6d-8c7b-2ed988aa3343/download/public-art-open-data-2020-01-09.csv', function(error, response, body){
	console.log("data CSV loaded")
	csv.parse(body, function(error, data) {
		requestBodyCsv = data;
	})
});

console.log("start")
http.createServer(function(request, response){
	console.log("connect")
	if (requestBodyJson && requestBodyCsv && content){
		response.writeHead(200, {'Content-Type': 'text/html'});
		
		var requestUrl = url.parse(request.url);
		switch(requestUrl.path){
		case '/json':
			response.end(createJson(JSON.parse(requestBodyJson)));
			break;
		case '/csv':
			response.end(createCSV(requestBodyCsv));
			break;
		}
	}else{
		response.writeHead(200, {'Content-Type': 'text/html'});
		response.end('Nothing');
	}
}).listen(8080);

console.log("Server started at port 8080.")
