const express = require('express');
const cheerio = require('cheerio');
const axios = require('axios');

const app = express();

app.get('/search/:product', async (req, res) => {
  const productName = req.params.product;
  const prices = {};

  // Recherche sur Alternate
  try {
    const alternate = await axios.get(`https://fr.alternate.be/html/search.html?query=${productName}`);
    const $ = cheerio.load(alternate.data);
    const price = $('span.price').first().text().replace(/\s/g, '');
    prices.alternate = price;
  } catch (error) {
    console.error(`Erreur lors de la recherche sur Alternate: ${error}`);
  }

  // Recherche sur LDLC
  try {
    const ldlc = await axios.get(`https://www.ldlc.com/recherche/${productName}`);
    const $ = cheerio.load(ldlc.data);
    const price = $('div.price').first().text().replace(/\s/g, '');
    prices.ldlc = price;
  } catch (error) {
    console.error(`Erreur lors de la recherche sur LDLC: ${error}`);
  }

  // Recherche sur TopAchat
  try {
    const topachat = await axios.get(`https://www.topachat.com/search/${productName}`);
    const $ = cheerio.load(topachat.data);
    const price = $('span.offer-price__price').first().text().replace(/\s/g, '');
    prices.topachat = price;
  } catch (error) {
    console.error(`Erreur lors de la recherche sur TopAchat: ${error}`);
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

  // Envoi de la réponse JSON
  res.json(response);
});

app.listen(3000, () => {
  console.log('Serveur lancé sur le port 3000');
});