const express = require('express');
const cheerio = require('cheerio');
const axios = require('axios');
const fs = require('fs');
const { WebhookClient } = require('discord.js');

const port = 3000;
const app = express();
const instance = axios.create();
let previousAds = [];

const productName = "Peugot Fox Classe A";
const name = '2ememain';
const searchUrl = 'https://www.2ememain.be/q/';
const endUrl = '/#Language:all-languages|sortBy:SORT_INDEX|sortOrder:DECREASING|searchInTitleAndDescription:true';
const priceSelector = 'span.hz-text-price-label';
const nameSelector = 'h3.hz-Listing-title';
const descriptionSelector = 'p.hz-Listing-description';
const adSelector = 'li.hz-Listing';
const webhook = new WebhookClient({ id: '1125138318670188544', token: '_pMXrwDEsT3KUKOf6DsLCvtHv9UTdXniEsQujFXQRQArk3IFlCr38jlwRASXOlrI_I60' });

app.get('/search/', async (req, res) => {
  const ads = [];

  try {
    const response = await instance.get(searchUrl + productName);
    const $ = cheerio.load(response.data);

    $(adSelector).each((index, element) => {
      const price = $(element).find(priceSelector).first().text().replace(/\s/g, '');
      const name = $(element).find(nameSelector).first().text();
      const description = $(element).find(descriptionSelector).first().text();

      const ad = {
        price: price,
        name: name,
        description: description
      };

      if (!previousAds.some(prevAd => prevAd.name === ad.name && prevAd.description === ad.description)) {

        webhook.send(`Nouvelle annonce 2ememain pour le produit **${productName}** ! \n================================= \nNom de l'offre: **${ad.name}** \nDescription de l'offre: **${ad.description}** \nPrix de l'offre: **${ad.price}** \n================================= \n2ememain resolver - par <@965675962022920262>`);

      }
      

      ads.push(ad);
    });

  } catch (error) {
    console.error(`Error while searching on ${name}: ${error}`);
  }

  previousAds = ads;

  const response = {
    product: productName,
    totalAds: ads.length,
    ads: ads
  };

  res.json(response);
});

app.listen(port, () => {
  console.log(`Serveur lancé, port : ${port}`);
});

// Fonction pour vérifier les nouvelles annonces
async function checkForNewAds() {
  const response = await axios.get(`http://localhost:${port}/search/`);
}

// Appeler la fonction pour la première fois
checkForNewAds();

// Planifier l'exécution de la fonction toutes les 1 minute
setInterval(checkForNewAds, 1 * 60 * 1000);
