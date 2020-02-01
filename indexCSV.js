const http = require('http');
const request = require('request');
const fs = require('fs');
const csv = require('csv');

//	fs.unlink('index.html', (error) =>{
//		if(error) throw error;
//		console.log("success")
//	});
//const fs = require('fs');
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


var requestBody;

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
	
	console.log("csv0 "+data[0].toString())
	data[0].forEach(function(attribute){
		html += '	<div class="cell">'+attribute+'</div>';
	})
//	for (let attribute in data[0]){
//		if(typeof attribute[0][attribute] !== 'object'){
//			html += '	<div class="cell">'+attribute+'</div>';
//		}
//	}
	html += '		</div>';
	
	var moreData = data.slice(1);
	
	moreData.forEach(function(innerData){
		html += '	<div class="row">';
		innerData.forEach(function(cell){
			html += '<div class="cell" data-title="Name">'+cell+'</div>'
		})
//		for (let attribute in innerData){
//			if(typeof innerData[attribute] !== 'object'){
//				html += '<div class="cell" data-title="Name">'+innerData[attribute]+'</div>'
//			}
//		}
		html += '	</div>';
	})
//	moreData.forEach(function(innerData){
//		html += '	<div class="row">';
//		for (let attribute in innerData){
//			if(typeof innerData[attribute] !== 'object'){
//				html += '<div class="cell" data-title="Name">'+innerData[attribute]+'</div>'
//			}
//		}
//		html += '	</div>';
//	})
	html += '	</div>';
	html += '</div>';
	
	return html;
}

//request('https://www.bnefoodtrucks.com.au/api/1/trucks', function(error, response, body){
//	console.log("data loaded")
//	requestBody = body;
//});

request('https://www.data.brisbane.qld.gov.au/data/dataset/1e11bcdd-fab1-4ec5-b671-396fd1e6dd70/resource/3c972b8e-9340-4b6d-8c7b-2ed988aa3343/download/public-art-open-data-2020-01-09.csv', function(error, response, body){
	console.log("data CSV loaded")
	csv.parse(body, function(error, data) {
		requestBody = data;
	})
});

console.log("start")
http.createServer(function(request, response){
	console.log("connect")
	if (requestBody && content){
		response.writeHead(200, {'Content-Type': 'text/html'});
		//response.end(createJson(JSON.parse(requestBody)));
		response.end(createCSV(requestBody));
	}else{
		response.writeHead(200, {'Content-Type': 'text/html'});
		response.end('Nothing');
	}
}).listen(8080);

console.log("started")
