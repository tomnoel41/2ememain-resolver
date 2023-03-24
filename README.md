# ItemPriceSearch

Ce programme est une API basée sur Node.js qui permet aux utilisateurs de rechercher le prix d'un produit sur différents sites de commerce électronique. Pour cela, le programme utilise les modules Express, Cheerio et Axios pour récupérer les données des sites de commerce électronique. Lorsqu'un utilisateur effectue une requête à l'API en spécifiant le nom du produit qu'il recherche, le programme va récupérer le prix sur différents sites de commerce électronique (tels que Alternate, LDLC et Amazon.com) en utilisant des requêtes HTTP.

Le programme utilise le module Cheerio pour extraire le prix de chaque site web en analysant le HTML de la page, et calcule la moyenne des prix pour renvoyer une réponse complète. Les résultats sont renvoyés au format JSON, qui contient le nom du produit, le nom des sites de commerce électronique et le prix de chaque site, ainsi que la moyenne des prix.

Ce programme est utile pour les personnes qui souhaitent comparer rapidement les prix d'un produit sur différents sites de commerce électronique. Grâce à cette API, les utilisateurs peuvent éviter de naviguer manuellement sur plusieurs sites web pour rechercher les prix des produits, et peuvent obtenir une réponse complète et rapide en utilisant simplement un navigateur web ou un outil de ligne de commande.

# Usage

GET /search/Product Name
