/*
*Declare a const for currency api url
*fetching it in defferents instrustions
*/
let fromCurr = document.querySelector('#from');
let toCurr = document.querySelector('#to');
const urlCurrencies = 'https://free.currencyconverterapi.com/api/v5/currencies';

//function to get all the currencies ids
currencies = ()=>{
  fetch(urlCurrencies)
    .then((response) =>{
      //return data in json
       return response.json();
    })
    .then((data)=> {      
        let jsonData = data.results;

        //create option elements,
        //loop and get the id of every currency object
        // and add them to the select options
        for(const curr in jsonData){

          //create option element
          let optionElement = document.createElement('option');
          optionElement.value = jsonData[curr].id;
          //setting the value of select dropdowns to the currency id and currencyName from the api
          optionElement.innerHTML = `${jsonData[curr].id} - ${jsonData[curr].currencyName}`;
          //setting default selected value in both select elements
          if(optionElement.value === 'USD'){
            optionElement.setAttribute('selected','selected');
          }
          //clone the options of the fromCUrr to the 
          let  cln = optionElement.cloneNode(true);
          fromCurr.appendChild(optionElement);
        toCurr.appendChild(cln);
      }
    }).catch((err)=>{
        console.error(`Error: ${err}`);
    });
}

//function to post amount to exchange and get exchange value and amount
convertCurrency = ()=>{
  //get the value user enters in the input box
  let inputAmount = document.querySelector('#amount').value;
  let exchangeAmountDisplay = document.querySelector('#result');

  //get conversion currencies values and request them through the api
  let currFrom = fromCurr.value;
  let currTo = toCurr.value;
  let urlConversions = `https://free.currencyconverterapi.com/api/v5/convert?q=${currFrom}_${currTo}`;

  fetch(urlConversions)
    .then((response)=>{
      return response.json();
    })
    .then((data)=>{
      //calculate and display the exchange amount
      let results = data.results;
      for(const c in results){
        let excValue = results[c].val
        exchangeAmountDisplay.value=(inputAmount * excValue).toFixed(4);
        //saving currency id and exchange rate into the database
        SaveInTheDatabase(results[c]);
      }

    });
}

//oepning database and creating objectStore
openDb = ()=>{
  //initializing DB
  const dbName = "mws-CurrencyDB";
  const database = indexedDB.open(dbName,1);

  //catching errors
  database.onerror = (event)=>{
    console.log('Error occurred while opening database');
    return false;
  };

  //updrade database version
  database.onupgradeneeded = (event)=>{
    //listen to eventrrsponse and
    //create objectStore
      let upgradeDb = event.target.result;
      let objectStore = upgradeDb.createObjectStore('currencyStore');
    };
    return database;
}

//saving into the currencyStore
SaveInTheDatabase = (data)=>{

  const dB = openDb();

  dB.onsuccess = (event)=>{
    
    const results = event.target.result;

    //check if user exists symbol
    const currencyStore = results.transaction('currencyStore').objectStore('currencyStore').get(data.id);
    //wait for result
    currencyStore.onsuccess = (event)=>{

    const dbData = results;

    // open a read/write db transaction, ready for adding the data
    const store = results.transaction('currencyStore','readwrite').objectStore('currencyStore');

    if(!dbData){
      //add the data into the currencyStore
      store.add(data.val, `${inputAmount}-${data.id}`);
    }else{
      //update existing data in the currencyStore
      store.put(data.val, data.id);
    }

    };
  };
}
//load currencies in the select dropdowns on app load
document.body.onload = currencies;