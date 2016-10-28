var express = require('express'),
    app = express(),
		package = require('../package');
	
app.get('/status',function (req, res) {
    res.json({ app: package.name, version: package.version });
});

app.use(express.static('public'));

module.exports = app;
