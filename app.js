var express = require('express')
  , routes = require('./routes')
  , http = require('http')

// mongodb
var Db = require('mongodb').Db;
var Server = require('mongodb').Server;
  
var app = express();

app.configure(function(){
  app.set('port', 8080);
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
  
  app.engine('html', require('hbs').__express);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'html');
});

app.configure('development', function(){
  app.use(express.errorHandler());
});


app.get('/:id', function(req, res){
    var listData = function(err, collection) {
        collection.find({"resourceID" : req.params.id}).toArray(function(err, results) {
            res.render('index.html', { layout : false , 'results' : results, "resourceID" :req.params.id });
			console.log(results);
		});
	}
	
	var Client = new Db('local', new Server('127.0.0.1', 27017, {}));
    Client.open(function(err, pClient) {
        Client.collection('tags', listData);
    });
	
});

app.post('/resource', function(req, res) {
    var data = {'resourceID' : req.body.resourceID , 'tagName' : req.body.tagName };
    
	var insertData = function(err, collection) {
        collection.insert(data);
    }
	
	var listData = function(err, collection) {
        collection.find({"resourceID" : req.body.resourceID}).toArray(function(err, results) {
			console.log(results);
			//res.contentType('json');
			res.send({ layout : false , 'results' : results, "resourceID" : req.body.resourceID });
		});
	}
	
    var Client = new Db('local', new Server('127.0.0.1', 27017, {}));
    Client.open(function(err, pClient) {
        Client.collection('tags', insertData);
		Client.collection('tags', listData);
        //Client.close();
    });  
});

app.post('/remove', function(req, res) {
    var data = {'resourceID' : req.body.resourceID , 'tagName' : req.body.tagName };
    
    var Client = new Db('local', new Server('127.0.0.1', 27017, {}));
    Client.open(function(err, pClient) {
        Client.collection('tags', function(err, collection) {
			collection.remove(data);
			res.send();
		});
    });  
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
