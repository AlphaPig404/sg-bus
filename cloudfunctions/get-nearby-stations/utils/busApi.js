const axios = require('axios')
const instance = axios.create({
  baseURL: 'http://datamall2.mytransport.sg',
  headers: {
    'AccountKey': 'D/ikPTgqQTWnbEYOgFUeDQ==',
    'accept': 'application/json'
  }
});

module.exports = instance;