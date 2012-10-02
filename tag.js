var http = require("http");
var url = require("url");
var fs = require("fs");

http.createServer(function(req, res) {


	if((req.method == 'POST') ) {

	  switch (url.parse(req.url).pathname){ 
		 case '/': 
		   console.log('server side methodcalled'); 
			fs.readFile(__dirname + '/index.html',
			 function (err, data) {    
				res.writeHead(200);
				res.end(data);
			 });
			break;
		 case '/tag': 
		   console.log('server side method called: TAG');
			//console.log(req);
			console.log(res);
			res.end("olha a resposta aí.....");
		   break; 
		 default: 
		   console.log('server side method called: DEFAULT');
		   break;
	  }
	}//if
	else{
		console.log("Not a POST");
		res.writeHead(200, {"Content-Type": "text/plain"});
		//console.log(req);
		res.end("Hello World\n");
	}
}).listen(8000);
