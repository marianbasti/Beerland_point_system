var express = require('express');
var app = express();
var http = require('http').createServer(app);
var bodyParser = require('body-parser');
var fs = require('fs'); //require filesystem module
var port;
var io = require('socket.io')(http);
var mysql = require('mysql')
// Define our db creds
var db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'db'
})
var viejospuntos;
const multiplier = 1;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
const { NFC } = require('nfc-pcsc');
//const nfc = new NFC(); // optionally you can pass logger

http.listen(4000, function () {
  console.log('Server corriendo en puerto 4000, bien hecho!');
});

//INCLUIR LIBRERIA NFC
/*nfc.on('reader', reader => {

	console.log(`${reader.reader.name}  device attached`);

	// enable when you want to auto-process ISO 14443-4 tags (standard=TAG_ISO_14443_4)
	// when an ISO 14443-4 is detected, SELECT FILE command with the AID is issued
	// the response is available as card.data in the card event
	// see examples/basic.js line 17 for more info
	// reader.aid = 'F222222222';

	reader.on('card', card => {

		// card is object containing following data
		// [always] String type: TAG_ISO_14443_3 (standard nfc tags like MIFARE) or TAG_ISO_14443_4 (Android HCE and others)
		// [always] String standard: same as type
		// [only TAG_ISO_14443_3] String uid: tag uid
		// [only TAG_ISO_14443_4] Buffer data: raw data from select APDU response

		console.log(`${reader.reader.name}  card detected`, card);

	});

	reader.on('card.off', card => {
		console.log(`${reader.reader.name}  card removed`, card);
	});

	reader.on('error', err => {
		console.log(`${reader.reader.name}  an error occurred`, err);
	});

	reader.on('end', () => {
		console.log(`${reader.reader.name}  device removed`);
	});

});

nfc.on('error', err => {
	console.log('an error occurred', err);
});
*/

//Express
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/sumar', function (req, res) {
  res.sendFile(__dirname + '/sumar.html');
});

app.get('/exito', function (req, res) {
  res.sendFile(__dirname + '/exito.html');
});

app.get('/usar', function (req, res) {
  res.sendFile(__dirname + '/usar.html');
});

app.get('/registrar', function (req, res) {
  res.sendFile(__dirname + '/registrar.html');
});

app.get('/verpuntos', function (req, res) {
  res.sendFile(__dirname + '/verpuntos.html');
});

app.get('/acercade', function (req, res) {
  res.sendFile(__dirname + '/acercade.html');
});

app.get('/alert', function (req, res) {
  res.sendFile(__dirname + '/alert.png');
});

app.post("/sumar", function (req, res) {
    console.log(req.body.DNI);
    console.log(req.body.monto);
    db.query("SELECT puntos FROM clientes WHERE dni = ?", req.body.DNI, function (err, datos_db, fields) {
      console.log('Puntos que tiene ' + req.body.DNI + ':');
      console.log(datos_db[0].puntos);
      viejospuntos = datos_db[0].puntos;
    });
    var nuevospuntos = viejospuntos + (req.body.monto*multiplier)
    var sql = "UPDATE clientes SET puntos = ? WHERE dni = ?";
    db.query(sql, [nuevospuntos,req.body.DNI]);
    return res.redirect('/exito');
});

io.on('connection', function(socket){
  socket.on('evento', function(msg){

  });
});
