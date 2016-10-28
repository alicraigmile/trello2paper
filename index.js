var express = require('express'),
    app = express();
	
app.use(express.static('public'));
app.listen(7001, function () {
    console.log('trello2paper listening on port 7001!');
});

