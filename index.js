#!/usr/bin/env node
var argv = require('minimist')(process.argv.slice(2), {
  default: {
    miner_host: process.env['MINER_HOST'] || '127.0.0.1',
    miner_port: process.env['MINER_PORT'] || '42000',
    scrape_interval: process.env['SCRAPE_INTERVAL'] || '5000',
    host: process.env['HOST'] || '127.0.0.1',
    port: process.env['PORT'] || 9100,
  }
})
var Prometheus = require('prometheus-client')

/** Prometheus (monitoring) 

results: []

{
gpuid: 0,
cudaid: 0,
busid: "0000:01:00.0",
name: "GeForce GTX 1070",
gpu_status: 2,
solver: 0,
temperature: 74,
gpu_power_usage: 174,
speed_sps: 436,
accepted_shares: 142,
rejected_shares: 5,
start_time: 1503087595
},

**/

var prom = new Prometheus()
var gauges = {}

function createGauge(index) {
  var gpu_gauge = {}
  gpu_gauge.temp = prom.newGauge({
    namespace: 'ewbf',
    name: 'gpu_temp_'+index,
    help: 'GPU Temperature'
  })
  gpu_gauge.power = prom.newGauge({
    namespace: 'ewbf',
    name: 'gpu_power_'+index,
    help: 'GPU Power Usage'
  })
  gpu_gauge.hashrate = prom.newGauge({
    namespace: 'ewbf',
    name: 'gpu_hashrate_'+index,
    help: 'GPU Hashrate'
  })
  return gpu_gauge
}

function updateGauge(index) {

}

function scrape() {
  console.log(`scraping`)
  loop() 
}

function loop() {
  setTimeout(scrape, argv.scrape_interval)
}
loop()

/** Server **/

prom.listen(argv.port)
console.log('Prometheus metrics on port :'+argv.port+'/metrics')
