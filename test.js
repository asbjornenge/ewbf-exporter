#!/usr/bin/env node
var argv = require('minimist')(process.argv.slice(2), {
  default: {
    host: '127.0.0.1',
    port: '1728',
    msg: JSON.stringify({
      imei: 9999999999,
      lat: 1,
      lon: 1,
      timestamp: new Date().getTime()
    }) 
  }
})
var dgram = require('dgram');
var message = Buffer.from(argv.msg);
var client = dgram.createSocket('udp4');
client.send(message, argv.port, argv.host, (err) => {
  client.close();
});
