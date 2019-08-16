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
var errorstatus;
const multiplier = 1;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
const { NFC } = require('nfc-pcsc');
//const nfc = new NFC(); // optionally you can pass logger

http.listen(4000, function () {
  console.log('Server corriendo en puerto 4000, bien hecho!');
});

//INCLUIR LIBRERIA NFC
/*
nfc.on('reader', reader => {

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

    socket.emit('rfid', tarjeta)
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

app.get('/doc_exist', function (req, res) {
  res.sendFile(__dirname + '/doc_exist.html');
});

app.get('/card_exist', function (req, res) {
  res.sendFile(__dirname + '/card_exist.html');
});

app.get('/alert', function (req, res) {
  res.sendFile(__dirname + '/alert.png');
});

app.get('/jquery-3.4.1.min.js', function (req, res) {
  res.sendFile(__dirname + '/jquery-3.4.1.min.js');
});

app.get('/jquery.validate.min.js', function (req, res) {
  res.sendFile(__dirname + '/jquery.validate.min.js');
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

app.post("/registrar", function (req, res) {
    console.log(req.body.documento);
    console.log(req.body.nacimiento);
    console.log(req.body.localidad);
    console.log(req.body.sexo);
    console.log(req.body.tarjeta);
    errorstatus = 0;
    var db_query = "SELECT EXISTS(SELECT * FROM clientes WHERE documento = ?) as exist";
    db.query(db_query, req.body.documento, function (err, datos_db, fields) {
      if (datos_db[0].exist == 1) {
        console.log("Error registrando cliente: Documento ya existe");
        return res.redirect('/doc_exist');
      } else {
        db_query = "SELECT EXISTS(SELECT * FROM clientes WHERE tarjeta = ?) as exist";
        db.query(db_query, req.body.tarjeta, function (err, datos_db, fields) {
          if (datos_db[0].exist == 1) {
            console.log("Error registrando cliente: Tarjeta ya registrada");
              return res.redirect('/card_exist');
          } else {
            var db_query = "INSERT into clientes (`documento`, `nacimiento`, `localidad`, `sexo`, `tarjeta`) VALUES (?, ?, ?, ?, ?)"
            db.query(db_query, [req.body.documento, req.body.nacimiento,req.body.localidad,req.body.sexo,req.body.tarjeta]);
            return res.redirect('/exito');
          };
        });
      };
    });
});

io.on('connection', function(socket){
  socket.on('evento', function(msg){

  });
});
