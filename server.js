var express = require('express');
var app = express();
var http = require('http').createServer(app);
var bodyParser = require('body-parser');
var fs = require('fs'); //require filesystem module
var io = require('socket.io')(http);
var mysql = require('mysql')
// Define our db creds
var db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'db'
})
//MULTIPLICADOR PARA DETERMINAR CUANTOS PUNTOS POR PLATA GASTADA
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
//Sirvo las pagias y librerias pa que funque
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/exito', function (req, res) {
  res.sendFile(__dirname + '/exito.html');
});

app.get('/registrar', function (req, res) {
  res.sendFile(__dirname + '/registrar.html');
});

app.get('/eliminar', function (req, res) {
  res.sendFile(__dirname + '/eliminar.html');
});

app.get('/acercade', function (req, res) {
  res.sendFile(__dirname + '/acercade.html');
});

app.get('/doc_exist', function (req, res) {
  res.sendFile(__dirname + '/doc_exist.html');
});

app.get('/doc_noexist', function (req, res) {
  res.sendFile(__dirname + '/doc_noexist.html');
});

app.get('/card_exist', function (req, res) {
  res.sendFile(__dirname + '/card_exist.html');
});

app.get('/card_noexist', function (req, res) {
  res.sendFile(__dirname + '/card_noexist.html');
});

app.get('/alert', function (req, res) {
  res.sendFile(__dirname + '/alert.png');
});

app.get('/jquery-3.4.1.min.js', function (req, res) {
  res.sendFile(__dirname + '/jquery-3.4.1.min.js');
});

app.get('/jquery.sumtr.js', function (req, res) {
  res.sendFile(__dirname + '/jquery.sumtr.js');
});

app.get('/jquery.validate.min.js', function (req, res) {
  res.sendFile(__dirname + '/jquery.validate.min.js');
});

//CUANDO ME PIDEN REGISTRAR UN CLIENTE
//ME ASEGURO QUE NI EL DOCUMENTO NI LA TARJETA ESTEN REGISTRADAS
app.post("/registrar", function (req, res) {
    console.log(req.body.documento);
    console.log(req.body.nacimiento);
    console.log(req.body.localidad);
    console.log(req.body.sexo);
    console.log(req.body.tarjeta);
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
            db_query = "INSERT into clientes (`documento`, `nacimiento`, `localidad`, `sexo`, `tarjeta`) VALUES (?, ?, ?, ?, ?)"
            db.query(db_query, [req.body.documento, req.body.nacimiento,req.body.localidad,req.body.sexo,req.body.tarjeta]);
            return res.redirect('/exito');
          };
        });
      };
    });
});

//CUANDO ME PIDEN ELIMINAR UN CLIENTE, YA SEA POR TARJETA O INGRESANDO EL DOCUMENTO
app.post("/eliminar", function (req, res) {
   var db_query = "SELECT EXISTS(SELECT * FROM clientes WHERE documento = ?) as exist";
   db.query(db_query, req.body.documento, function (err, datos_db, fields) {
   if (datos_db[0].exist == 1) {
    var db_query= "DELETE FROM `clientes` WHERE documento = ?"
    db.query(db_query,req.body.documento);
    return res.redirect('/exito');
   } else {
     console.log("ERROR: Documento ingresado no está regristrado")
     return res.redirect('/doc_noexist');
   }
 });
});

//CUANDO ME PIDEN SUMAR PUNTOS A CLIENTE
app.post("/sumar", function (req, res) {
  var db_query= "SELECT puntos FROM `clientes` WHERE `tarjeta` = ?"
  db.query(db_query, req.body.tarjeta, function(err, puntos, fields) {
    console.log(req.body.comida);
    var puntosNuevos = req.body.monto*multiplier + puntos[0].puntos;
    var db_query= "UPDATE `clientes` SET puntos = ? WHERE tarjeta = ?"
    db.query(db_query, [puntosNuevos, req.body.tarjeta]);
  });
  return res.redirect('/exito');
 });

io.on('connection', function(socket){
  //CUANDO ME PIDEN LOS DATOS DE UN CLIENTE POR TARJETA
  socket.on('cargarcliente', function(tarjeta){
    var db_query = "SELECT EXISTS(SELECT * FROM clientes WHERE tarjeta = ?) as exist";
    db.query(db_query, tarjeta, function (err, datos_db, fields) {
     if (datos_db[0].exist == 1) {
      var db_query= "SELECT * FROM clientes WHERE tarjeta = ?"
      db.query(db_query, tarjeta, function (err, cliente, fields) {
        socket.emit('datoscliente', cliente);
      });
     } else {
       console.log("ERROR: Tarjeta no regristrada");
       socket.emit('reload', 1);
     }
   });
 });


 //EMULO UNA TARJETA PORQUE NO TENGO EL HARWARE :3
 setTimeout(function() {
   var card = 987654321
   socket.emit('rfid', card);
   console.log("emulando tarjeta: " + card)
 }, 1000)

});
