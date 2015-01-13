var http = require('http');
var url = require('url');
var items = [];

var server = http.createServer(function(req, res){	
	function getIndex(reqURL){
		var pathName = url.parse(reqURL).pathname;
		return parseInt(pathName.slice(1), 10);
	}

	function isValidItem(index){
		
		var statusCode = 200,
			 message = 'ok';
			 
		if(isNaN(index)){
			statusCode = 400;
			message = 'Item id not valid';
		} else if(!items[index]){
			statusCode = 404;
			message = 'Item not found';
		} else{
			item = items[index];
		}
		return {
			statusCode: statusCode,
			message: message			
		}
	}

	switch(req.method){
		case 'POST' : 
			var item = "";
			req.setEncoding('utf8');
			req.on('data', function(chunk){
				item += chunk;
			});

			req.on('end', function(){
				items.push(item);
				res.end('Item added\n');
			});
			break;
		case 'GET' :
			items.forEach(function(item, i){
				res.write(i + "." + item + "\n");
			});
			res.end();
			break;
		case 'DELETE' :	
			var index = getIndex(req.url);
			var obj = isValidItem(index);
			if(obj.statusCode === 200){
				items.splice(index, 1);
				res.end('Item deleted successfully.');
			} else {
				res.statusCode = obj.statusCode;
				res.end(obj.message);
			}			
			break;
		case 'PUT' :
			var i = getIndex(req.url);
			var obj = isValidItem(i);
			if(obj.statusCode === 200){
				var item = "";
				req.setEncoding('utf8');
				req.on('data', function(chunk){
					item += chunk;
				});

				req.on('end', function(){
					items[i] = item;
					res.end('Item updated!');
				})

			} else {
				res.statusCode = obj.statusCode;
				res.end(obj.message);
			}

	}
});

server.listen(9000, function(){
	console.log('listening at port 9000');
});