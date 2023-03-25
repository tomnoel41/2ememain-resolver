const express = require('express');
const cheerio = require('cheerio');
const axios = require('axios');
const fs = require('fs');
const rateLimit = require("express-rate-limit");

const rlAPI = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  max: 45, // limit each IP to 45 requests per windowMs
  message: { error: "Too many requests, please try again later" },
  handler: (req, res, next) => {
    res.status(429).json({ error: "Too many requests, please try again later" });
  }
});

const app = express();
app.use(rlAPI);

const commerceData = JSON.parse(fs.readFileSync('commerce.json'));

app.get('/search/:product', async (req, res) => {
  const productName = req.params.product;
  const prices = {};

  for (const commerce of commerceData) {
    try {
      const response = await axios.get(commerce.searchUrl + productName);
      const $ = cheerio.load(response.data);
      const price = $(commerce.priceSelector).first().text().replace(/\s/g, '');
      prices[commerce.name] = price;
    } catch (error) {
      console.error(`Error while searching on ${commerce.name}: ${error}`);
    }
  }

  // Calcul de la moyenne des prix
  const priceArray = Object.values(prices).filter(price => !isNaN(parseFloat(price)));
  const averagePrice = priceArray.length > 0 ? (priceArray.reduce((acc, price) => acc + parseFloat(price), 0) / priceArray.length).toFixed(2) : null;

  // Construction de la réponse JSON
  const response = {
    product: productName,
    prices: prices,
    averagePrice: averagePrice
  };

  if (req.query.download == true) {
    // Envoi du fichier JSON
    res.setHeader('Content-disposition', `attachment; filename=ItemPriceSearch-${productName}.json`);
    res.setHeader('Content-type', 'application/json');
    res.json(response);
  } else {
    // Envoi de la réponse JSON
    res.json(response);
  }
});

app.listen(3000, () => {
  console.log('Serveur lancé sur le port 3000');
});