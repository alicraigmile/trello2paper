# trello2paper

Print cards from your trello boards on paper (remember that!).

## Try it out here!

http://trello2paper.xgusties.com/

## Installing trello2paper

### Pre-requisites:

To set it up for youself, you will need:

* node.JS

### Installation

git clone git@github.com:alicraigmile/trello2paper.git
cd trello2paper

### Configuration

* To make trello2paper work for you, you'll need a API Key from Trello. Get yours from https://trello.com/app-key and add it to config.json.
* You can change the HTTP port in config.json.

### To run integration tests

./ci.sh

### To run the application

npm install
./bin/trello2paper

The application can then be accessed on http://localhost:7001
