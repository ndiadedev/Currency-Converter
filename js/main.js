/*
*Declare a const for currency api url
*fetching it in defferents instrustions
*/
const url_currency = "https://free.currencyconverterapi.com/api/v5/currencies";
fetch(url_currency)
  .then(handleErrors)
  .then(parseJSON)
  .then(dataParse)
  .then(populateSelect)
  .catch(Errors);

  //handlling errors response function
function handleErrors(res) {
  if ( !res.ok ) {
    throw Error(res.status);
  }
  return res;
}

//Parsing Response into JSON format
function parseJSON(res) {
  return res.json();
}

//Looping data parse into for loop with key
function dataParse(data) {
  for ( const key in data ) {
    return data[key];

  }
}

//Populate curruncies data through select fields
function populateSelect(res) {
  for ( const results in res) {
    const value = res[results].id;
    const currency = res[results].currencyName;
    $('#from, #to').append($('<option>').text(`(${value}) ${currency}`).attr('value', value)
      );
  }
}  

function populateSelect(res){
  for ( const results in res) {
    const value = res[results].id;
    const currency = res[results].currencyName;
    $('#from, #to').append($('<option>').text(`(${value}) ${currency}`).attr('value', value));
  }
} 

//Errors handling
function Errors(error) {
  console.log("Errors", error);
}

//Instructions for conversion click actions
$("#clicktoconvert").on("click", () => {
  const amount = $('#amount').val();
  const From = $('#from option:selected').val();
  const To = $('#to option:selected').val(); 
  const query = `${From}_${To}`;
  const queryUrl = `https://free.currencyconverterapi.com/api/v5/convert?q=${query}&compact=y`; 
  fetch(queryUrl)
    .then(parseJSON)
    .then(parsedData => {
      for(let rate in parsedData){
         let calc = (parsedData[rate].val); 
      let total = (Number(amount) * calc);
      $('#result').val(Math.round(total * 100) / 100);
      }
    })
    .catch(Errors);
});

/*
*Create Db currencies api into into IndexDB
*objectStore Name: currencyRates
*/
let dbPromise = idb.open("mws-currencyConverter", 1, function(upgradeDB) {
    let rateStore = upgradeDB.createObjectStore("currencyRates");
    //Test Put datas in db successful done
  //rateStore.put('world', 'hello');
});

console.log(dbPromise);

let storeRate = (query, rate) => {
  let query_currencies = query.split("_");

  dbPromise.then(db => {
      let tx = db.transaction("currencyRates", "readwrite");
      let rateStore = tx.objectStore("currencyRates");

      if (query_currencies[0] == query_currencies[1]){
        rateStore.put(parseFloat(rate).toFixed(6), query);
        return tx.complete;
      }

      rateStore.put(parseFloat(rate).toFixed(6), query);
      rateStore.put(
        parseFloat(1 / rate).toFixed(6),
        `${query_currencies[1]}_${query_currencies[0]}`
      );
      return tx.complete;
    })
    .then(() => console.log("currency store for =>", query))
    .catch((err) => console.log("Error occured when saving query to db", err));
}; 