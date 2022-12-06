var https = require('https');
var parseString = require('xml2js').parseString;

let xmlToJson = (url, callback) => {
	var req = https.get(url, function(res) {
	  var xml = '';
	  
	  res.on('data', function(chunk) {
		xml += chunk;
	  });
  
	  res.on('error', function(e) {
		callback(e, null);
	  }); 
  
	  res.on('timeout', function(e) {
		callback(e, null);
	  }); 
  
	  res.on('end', function() {
		parseString(xml, function(err, result) {
		  callback(null, result);
		});
	  });
	});
  }

  let getDataInURL = async (linkURL) => {
	let items = [];
	for await (let item of linkURL) {
	  await xmlToJson(item.link, (err, data) => {
		if (err) { return console.err(err); }
		items.push(data.rss.channel[0].item);
		console.log(item.link, '-', items.length);
		console.log(items[0].length);
	  });
	}
	return items;
  }
  

module.exports = {
    xmlToJson,
	getDataInURL,
}