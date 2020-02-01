var fs = require('fs');

exports.updateLogFile = function(message){
	fs.readFile('./log.txt', function(error, logContent){
		if (error) throw error;
		
		logContent =logContent + "";
		
		var lines = logContent.split('\n');
		
		var firstLine = lines[0];
		var accessCounter = firstLine.indexOf(':');
		var numberOfAccesses = parseInt(firstLine.slice(accessCounter + 2));
		
		lines[0] = "Number of accesses: "+(numberOfAccesses+1);
		var newLogContent = lines.join('\n') + message + "\n";
		fs.writeFile('./log.txt', newLogContent, function(error){
			if(error) throw error;
		});
	})
	
}