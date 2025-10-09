// npm i express geoip-lite
import express from 'express';
import geoip  from 'geoip-lite';

const app = express();

function countryToCurrency(countryCode) {
  return countryCode === 'PK' ? 'PKR' : 'USD'; // extend as needed
}

app.use((req, res, next) => {
  const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;
  const geo = geoip.lookup(ip) || {};
  const country = (geo.country || '').toUpperCase();
  req.currency = countryToCurrency(country);
  next();
});

app.get('/', (req, res) => {
  res.send(`Currency for you: ${req.currency}`);
});

app.listen(3000);