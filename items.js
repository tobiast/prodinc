// oppsett av express
var express = require('express');
var router = express.Router();

// funksjon som viser liste av produkter
router.get('/', async function(req, res, next){

   try{
         console.log("geting Items root")
         let limit = req.query.limit;
         let s = req.query.s;
         let order = req.query.sortOrder;

         // hent alle produkter
         let products = await getProducts(0, 100)
         let searchString; 

         // Hvis søkeparameter er med - filtrer ut de produktene som har søketeksten i seg
         if (s){
            products = products.filter(product => containsSearchString(product, s))
            searchString = 'Viser resultater for: ' + s;
        }

        // Hvis sortorder sendes som parameter. Sorter slik 
        if (order){
           products = sort(products, order);
        }

        // hvis antallbegresninger er med. Ta bort de overflødige
        if (limit){
            createPagination(limit, products.length)
            products = products.slice(0,limit)
        }

        // Vis siden med liste over items
        res.render("items", { title: 'Items!',  products: products, searchString: searchString})
   } catch(err){
       next(err);
   }
});

function createPagination(numbersToShow, totalNumber){

    let numberOfPages = Math.round(totalNumber / numbersToShow)
    let pageLinks = ""; 
    console.log("Showwing pages: " + numberOfPages);     
}

function sort(products, order){

   console.log("order: "  + order)
      if (order){
         switch(order){
            case "1": {
                return products.sort((product1, product2) => product1.price - product2.price)
            }
            case "2": {
               return products.sort((product1, product2) => product2.price - product1.price)
           }
            case "3": {   
               return products.sort((product1, product2) => product1.title.localeCompare(product2.title))
            }
            case "4": {   
               return products.sort((product1, product2) => product2.title.localeCompare(product1.title))
           }
           case "5": {
               return products.sort((product1, product2) => product1.discountPercentage - product2.discountPercentage)
            }
            case "6": {
               return products.sort((product1, product2) => product2.discountPercentage - product1.discountPercentage)
            }
            case "7": {   
               return products.sort((product1, product2) => product1.brand.localeCompare(product2.brand))   
            }
            case "8": {   
               return products.sort((product1, product2) => product2.brand.localeCompare(product1.brand))
            }
         }
      }

}

// funksjon som håndterer detaljvisning av et produkt på ID
router.get('/:id', async function(req, res){

   // isNaN (is not a number) returnerer true hvis parameteret _ikke_ inneholder et tall. 
   if (!isNaN(req.params.id)){
      let products = await getProducts(0, 100)
      res.render("item", { title: 'Item!',  product: products[req.params.id-1]})
   }  else {
       res.render("error", { title: 'Siden finnes ikke!', message: 'Du har forsøkt å gå til en side som ikke finnes.'})
   }
});


// setter sammmen en tekst av viktige deler av produkt. Sjekker om søkestreng er en del av dem. 
function containsSearchString(product, s){
   let fieldsToSearch = product.title + product.desctiption + product.brand
   return fieldsToSearch.toLowerCase().includes(s.toLowerCase())
}

// funksjon som henter en liste av produkter. 
// dummyjson.com støtter søk og limit, men jeg ville gjerne kode det selv
// så jeg bruker ikke det. 
async function getProducts(num, page){

   const url = 'https://dummyjson.com/products?skip=' + num + '&limit=' + page 
    
return await fetch(url)
   .then((response) => response.json())
   .then((json) => json.products)
   .catch(function (err) {
      console.log("Unable to fetch -", err);
      err.type = 'redirect'
      return err
   });   
}

//Sørg for at rutene er tilgjengelig for app.js
module.exports = router;