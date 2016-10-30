var express = require('express'),
    app = express(),
		package = require('../package'),
		config = require('../config');
	
app.get('/status',function (req, res) {
    res.json({ app: package.name, version: package.version });
});

app.use(express.static('public'));

app.get('/config', function (req, res) {
		res.json({ 'trello-developer-key': config['trello-developer-key'] });
});

module.exports = app;
