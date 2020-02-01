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

request('https://www.bnefoodtrucks.com.au/api/1/trucks', function(error, response, body){
	console.log("data loaded")
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
