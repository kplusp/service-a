const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;
const NANO_SERVICE_URL = process.env.NANO_SERVICE_URL || 'http://nano-service-a:3000';

app.get('/', (req, res) => {
  res.json({ service: 'service-a', status: 'running' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/nano', async (req, res) => {
  try {
    const response = await fetch(`${NANO_SERVICE_URL}/`);
    const data = await response.json();
    res.json({ from: 'service-a', nano: data });
  } catch (err) {
    console.error('Failed to reach nano-service-a:', err.message);
    res.status(502).json({ error: 'Failed to reach nano-service-a', details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`service-a listening on port ${PORT}`);
  console.log(`NANO_SERVICE_URL=${NANO_SERVICE_URL}`);
});
