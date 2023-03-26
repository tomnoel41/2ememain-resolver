// Libraries 
const express = require('express');
const cheerio = require('cheerio');
const axios = require('axios');
const fs = require('fs');
const rateLimit = require("express-rate-limit");

// Configuration
const port = 3000;
const rlAPI = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  max: 45, // limit each IP to 45 requests per windowMs
  message: { error: "Too many requests, please try again later" },
  handler: (req, res, next) => {
    res.status(429).json({ error: "Too many requests, please try again later" });
  }
});

const app = express();
app.use(rlAPI); // Remove if you do not want a rate limit
const commerceData = JSON.parse(fs.readFileSync('commerce.json'));

// Configure Proxy for all request to commercial websites
const instance = axios.create({
  proxy: {
    protocol: 'http',
    host: 'proxy.scrapingbee.com',
    port: 8886,
    auth: {
      username: 'YE5FBZKEKARF2ORZF4JD2BGIZESENWUMHKO30C5H9CJ18PZRMH6L46I6Q9ST652PTR9WNR08PWRWTCMA',
      password: 'render_js=False&premium_proxy=True'
    }
  }
});

// Log function
function addLog(ip, response) {
  const logEntry = { ip, response };
  const logFile = "log.json";
  if (!fs.existsSync("log.json")) {
    fs.writeFileSync("log.json", "[]");
  }

  // Read existing logs
  let logs = [];
  try {
    const data = fs.readFileSync(logFile);
    logs = JSON.parse(data);
  } catch (err) {}

  // Add the new log entry
  logs.push(logEntry);

  // Write logs to file
  fs.writeFileSync(logFile, JSON.stringify(logs));
}

app.get('/', async (req, res) => {
  res.send({get : "/search/<product_name>", getdownload : "/search/<product_name>?download=1"})
});

app.get('/search/:product', async (req, res) => {
  const productName = req.params.product;
  const prices = {};

  for (const commerce of commerceData) {
    try {
      const response = await instance.get(commerce.searchUrl + productName);
      const $ = cheerio.load(response.data);
      const price = $(commerce.priceSelector).first().text().replace(/\s/g, '');
      prices[commerce.name] = price;
    } catch (error) {
      console.error(`Error while searching on ${commerce.name}: ${error}`);
    }
  }

  // Calculation of the average price
  const priceArray = Object.values(prices).filter(price => !isNaN(parseFloat(price)));
  const averagePrice = priceArray.length > 0 ? (priceArray.reduce((acc, price) => acc + parseFloat(price), 0) / priceArray.length).toFixed(2) : null;

  // Building the JSON response
  const response = {
    product: productName,
    prices: prices,
    averagePrice: averagePrice
  };

  if (req.query.download) {
    // Sending the JSON file
    res.setHeader('Content-disposition', `attachment; filename=ItemPriceSearch-${productName}.json`);
    res.setHeader('Content-type', 'application/json');
    res.json(response);
  } else {
    // Sending the JSON response
    res.json(response);
    addLog(req.ip, response);
  }
});

app.listen(port, () => {
  console.log(`Serveur lancé, port : ${port}`);
});