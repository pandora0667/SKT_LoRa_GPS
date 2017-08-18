const port = '/dev/ttyACM0';
const SerialPort = require('serialport');
const GPS = require('gps');
const gps = new GPS;

const net = require('net');
const serialGPS = new SerialPort(port, {
    baudrate: 4800,
    parser: SerialPort.parsers.readline('\r\n')
});

function getConnection(connName) {
    let client = net.connect({port: 5001, host: 'localhost'}, function () {
        console.log(connName + ' Connected: ');
        console.log('   local = %s:%s', this.localAddress, this.localPort);
        console.log('   remote = %s:%s', this.remoteAddress, this.remotePort);
        this.setEncoding('utf8');

        this.on('data', function (data) {
            console.log(connName + ' From Server: ' + data);
        });
        this.on('end', function () {
            console.log(connName + ' Client disconnected');
        });
        this.on('error', function (err) {
            console.log('Socket Error: ', JSON.stringify(err));
        });
        this.on('timeout', function () {
            console.log('Socket Timed Out');
        });
        this.on('close', function () {
            console.log('Socket Closed');
        });
    });
    return client;
}

function writeData(socket, data) {
    socket.write(data);
}

let latitude = 0;
let longitude = 0;
gps.on(function () {

    if (gps.state.lat !== undefined && gps.state.lon !== undefined) {
        latitude = gps.state.lat.toString();
        latitude = latitude.substring(0, 7);

        longitude = gps.state.lon.toString();
        longitude = longitude.substring(0, 9);
    }
});

setInterval(function () {
    let gpsData = {code: '00', lat: latitude, lon: longitude};
    console.log(gpsData);
    writeData(node1, JSON.stringify(gpsData));
}, 3000);

serialGPS.on('data', function (data) {
    gps.update(data);
});

const node1 = getConnection("node1");
