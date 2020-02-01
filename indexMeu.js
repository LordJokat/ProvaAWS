const http = require('http');
const request = require('request');
const fs = require('fs');

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
    console.log(content);   // Put all of the code here (not the best solution)
    processFile();          // Or put the next step in a function and invoke it
});

function processFile() {
    console.log(content);
}


var requestBody;

function createJson(data){
//	let html = 
//			"<title>Data aggregator</title>" +
//			"<table>ss";
	let html = content;
	html += "<table><tr>";
	for (let attribute in data[0]){
		if(typeof attribute[0][attribute] !== 'object'){
			html += "<td>${attribute}</td>";
		}
	}
	html += "</tr>";
	data.forEach(function(innerData){
		html += "</tr>";
		for (let attribute in innerData){
			if(typeof innerData[attribute] !== 'object'){
				html += "<td>"+innerData[attribute]+"</td>";
			}
		}
		html += "</tr>";
	})
	html += "</table>";
	
	return html;
}

request('https://www.bnefoodtrucks.com.au/api/1/trucks', function(error, response, body){
	requestBody = body;
});

console.log("start")
http.createServer(function(request, response){
	console.log("connect")
	if (requestBody && content){
		response.writeHead(200, {'Content-Type': 'text/html'});
		response.end(createJson(JSON.parse(requestBody)));
	}else{
		response.writeHead(200, {'Content-Type': 'text/html'});
		response.end('Nothing');
	}
}).listen(8080);

console.log("started")
