const config = require('../config');
const axios = require('axios');
const https = require('https');

const axiosAPI = axios.create({
  baseURL: config.storageURL,
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
  headers: { Authorization: config.storageApikey },
});

class Storage {
  async getSettings() {
    const response = await axiosAPI.get('/conf');
    return response.data;
  }
}

const storageInstance = new Storage();

module.exports = storageInstance;
