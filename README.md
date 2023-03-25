# ItemPriceSearch - FR

Ce programme est une API basée sur Node.js qui permet aux utilisateurs de rechercher le prix d'un produit sur différents sites de commerce électronique. Pour cela, le programme utilise les modules Express, Cheerio et Axios pour récupérer les données des sites de commerce électronique. Lorsqu'un utilisateur effectue une requête à l'API en spécifiant le nom du produit qu'il recherche, le programme va récupérer le prix sur différents sites de commerce électronique (tels que Alternate, LDLC et Amazon.com) en utilisant des requêtes HTTP.

Le programme utilise le module Cheerio pour extraire le prix de chaque site web en analysant le HTML de la page, et calcule la moyenne des prix pour renvoyer une réponse complète. Les résultats sont renvoyés au format JSON, qui contient le nom du produit, le nom des sites de commerce électronique et le prix de chaque site, ainsi que la moyenne des prix.

Ce programme est utile pour les personnes qui souhaitent comparer rapidement les prix d'un produit sur différents sites de commerce électronique. Grâce à cette API, les utilisateurs peuvent éviter de naviguer manuellement sur plusieurs sites web pour rechercher les prix des produits, et peuvent obtenir une réponse complète et rapide en utilisant simplement un navigateur web ou un outil de ligne de commande.

Cependant cet outil a été développer pour renseigner à des inventaires de matériel informatiques le prix d'un objet.

# ItemPriceSearch - EN

This program is a Node.js based API that allows users to search for the price of a product on different e-commerce sites. To do this, the program uses Express, Cheerio and Axios modules to retrieve data from e-commerce sites. When a user makes a request to the API specifying the name of the product he is looking for, the program will retrieve the price from different e-commerce sites (such as Alternate, LDLC and Amazon.com) using HTTP requests.

The program uses the Cheerio module to extract the price from each website by parsing the HTML of the page, and averages the prices to return a complete answer. The results are returned in JSON format, which contains the product name, the name of the e-commerce sites and the price of each site, as well as the average price.

This program is useful for people who want to quickly compare prices of a product on different e-commerce sites. With this API, users can avoid manually browsing multiple websites to look up product prices, and can get a complete and quick answer simply by using a web browser or command line tool.

However, this tool was developed to provide hardware inventories with the price of an item.

# Usage

GET /search/Product Name
