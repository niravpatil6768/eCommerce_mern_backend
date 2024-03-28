const http = require('http'); //require to create http server and handling http req. and response
const app = require('./app');  //import isntanc of express application 
const port = process.env.PORT || 3000; //define post on which incoming http req. will be listen

const server = http.createServer(app); //create server. take app as a arguments 
                                      //it means server will handle req. according to logic define in app.js 

server.listen(port);   //server will listen on specified port
