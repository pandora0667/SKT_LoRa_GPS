const file = '/dev/ttyACM0';
const file2 = '/dev/ttyACM1';
const SerialPort = require('serialport');
const GPS = require('gps');
const gps = new GPS;

const port = new SerialPort(file, {
    baudrate: 4800,
    parser: SerialPort.parsers.readline('\r\n')
});

const LoRa = new SerialPort(file2, {
    baudrate: 115200,
    parser: SerialPort.parsers.readline('\r\n')
});
console.log('----------    Trucker V1.0 LoRa Send GPS Starting...   ----------');
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
    let send = latitude + ',' + longitude;
    LoRa.write(send);
    console.log('LoRa Send : ' + send);
}, 5000);

port.on('data', function (data) {
    gps.update(data);
});
