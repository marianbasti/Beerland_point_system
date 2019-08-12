var express = require('express');
var app = express();
var http = require('http').createServer(app);
var bodyParser = require('body-parser');
var fs = require('fs'); //require filesystem module
var port;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
//Crear puerto serie
const SerialPort = require('serialport')

http.listen(4000, function () {
  console.log('Server corriendo en puerto 4000, bien hecho!');
});



//SERIAL
//Enlistar puertos disponibles
SerialPort.list(function (err, results) {
    if (err) {
        throw err;
    }
    //console.log(results);
    console.log("Buscando lector de tarjetas...");
    //console.log(results);
    var i = 0;
    if (results.length > 0) {
      //Busco productId del Arduino Micro
      while (results[i].productId != 8037){
        i++;
        if (i == results.length) {
          console.log("Lector no encontrado.");
          comPort = "undefined";
          throw err;
          break;
        }
      }
      var comPort = results[i].comName;
      console.log("Lector encontrado en puerto " + results[i].comName);
      serialConnect (comPort);
    } else {
      console.log("No se han encontrado dispositivos");
    }
});


function serialConnect (com) {
  port = new SerialPort(com, {
    baudRate: 9600
  });
  //Mensaje al conectarse
  port.on('open', function() {
    //Despierto al Arduino
    console.log("Conectado exitosamente.");
  });

  port.on('close', function() {
    console.log("Se ha desconectado el controlador. Esta todo bien?");
    console.log("Reiniciar server para recuperar funcionalidad");
  });
}

function read () // for reading
{
    port.on('data', function(data)
    {
        console.log(data.toString());
    });
};

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
    return res.redirect('/exito');
});
