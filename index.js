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
var request = require('request')

/** Prometheus (monitoring) **/

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

function updateGauge(data, index) {
  if (!gauges[index]) gauges[index] = createGauge(index)
  g = gauges[index]
  g.temp.set({ period: argv.scrape_interval }, data.temperature)
  g.power.set({ period: argv.scrape_interval }, data.gpu_power_usage)
  g.hashrate.set({ period: argv.scrape_interval }, data.speed_sps)
}

function scrape() {
  request(`http://${argv.miner_host}:${argv.miner_port}/getstat`, (err, response, body) => {
    if (err) {
      console.error(err)
      return loop()
    }
    try {
      JSON.parse(body).result.forEach(updateGauge)
    } catch(err) {
      console.error(err)
    }
    loop()
  })
}

function loop() {
  setTimeout(scrape, argv.scrape_interval)
}
loop()

/** Server **/

prom.listen(argv.port)
console.log('Prometheus metrics on port :'+argv.port+'/metrics')
