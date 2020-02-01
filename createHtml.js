
exports.createJson = function (html, data){
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

exports.createCSV = function (html, data){
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

