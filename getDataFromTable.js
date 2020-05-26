const puppeteer = require('puppeteer');
const fs = require('fs')

const getDataFromTable = async () => {
  // Se lanza el browser con una nueva página y se le da la URL
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const url = 'https://www.worldometers.info/world-population/population-by-country/';
  await page.goto(url);

  // Aquí comienza lo complicado. Lo que yo hice fue buscar por nombre de etiqueta. En este caso es
  // la única tabla de la página entonces pude acceder directo a ella y ya solo le fui asignando
  // valores a cada variable e irlo empujando en un array. 
  const data = await page.evaluate(() => {
    let tableTags = Array.from(document.getElementsByTagName('tr'))
    const countries = tableTags.map( (tr) => {
      console.log(tr)
      let country = tr.children[1].textContent
      let population = tr.children[2].textContent
      let yearlyChange = tr.children[3].textContent
      let netChange = tr.children[4].textContent
      let density = tr.children[5].textContent
      let landArea = tr.children[6].textContent
      let migrants = tr.children[7].textContent
      let fertRate = tr.children[8].textContent
      let medAge = tr.children[9].textContent
      let urbanPop = tr.children[10].textContent
      let worldShare = tr.children[11].textContent
      return { 
        country,
        population,
        yearlyChange,
        netChange,
        density,
        landArea,
        migrants,
        fertRate,
        medAge,
        urbanPop,
        worldShare
       }
    })
    return countries
  });
  
  // Ya una vez teniendo el array de datos json lo pase a string y lo guardé en un archivo data.json
  const json = JSON.stringify(data);
  const cb = () => console.log('listo');
  fs.writeFile('data.json', json, 'utf8', cb);
  await browser.close();
  return 0;
};

module.exports = getDataFromTable;
