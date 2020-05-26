const puppeteer = require('puppeteer');
const fs = require('fs')

// Population by year 

const getDataGlobal = async () => {
  // Igualmente se lanza el browser con la página
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const url = 'https://www.worldometers.info/world-population/world-population-by-year/';

  await page.goto(url);
  const data = await page.evaluate(() => {
    // Aquí lo que hago es buscar una tabla, igualmente es la única y obtengo todos los 
    // tr de la tabla en un array.
    let tableTr = Array.from(document.getElementsByTagName('table')[0].children[1].children)
    // Esto es para obtener solo 10 datos de la tabla
    tableTr = tableTr.slice(0, 10);
    // Igual hago un map para obtener un json en array con cada dato que ocupamos.
    const topCountries = tableTr.map( (tr) => {
      let year = tr.children[0].textContent
      let population = tr.children[1].textContent
      let yearlyChange = tr.children[2].textContent
      let netChange = tr.children[3].textContent
      let density = tr.children[4].textContent
      let urbanPop = tr.children[5].textContent
      let urbanPopPercentage = tr.children[6].textContent
      return { 
        year,
        population,
        yearlyChange,
        netChange,
        density,
        urbanPop,
        urbanPopPercentage,
        }
    } )
    return topCountries
  });
  
  const json = JSON.stringify(data);
  const cb = () => console.log('listo');
  fs.writeFile('dataGlobal.json', json, 'utf8', cb);
  await browser.close();
  return 0;
};

module.exports = getDataGlobal;
