const express = require('express');
const app = express();

module.exports = {
	execute() {
    publishSite();
  }
}

function publishSite()
{
  app.get('/', (req, res) => {
    res.send('<head><meta name="google-site-verification" content="FKrV3op8mG8X8NSJwuc-uv--9a0jiG8x3gmoYYhS0yY" /></head><body>We zijn online!</body>');
  });
  const PORT = process.env.PORT || 6565;
  app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
  });
}