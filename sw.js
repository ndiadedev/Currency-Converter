/*self.importScripts('js/idb.js');*/

/*
 *
 *  Mobile Web Specialist Currency Converter App
 *  Set cache files for offline purpose
 *
 */
 const cacheNameCurrency = 'mws-currencyConvert-v1';
 const FilesToCache = [
      
        `./index.html`,
        `./sw.js`,
        `assets/css/style.css`,
        `assets/images/bg.jpg`,
        `assets/images/favicon.png`,
        `assets/images/img1.jpg`,
        `js/idb.js`,
        `js/mainConvert.js`,
        'https://free.currencyconverterapi.com/api/v5/currencies'           
 ];

self.addEventListener('install', (event)=>{
  //console.log('serviceWorker installing');

    event.waitUntil(
      caches.open(cacheNameCurrency).then((cache)=>{
      //console.log('caching files for offline purpose');
      return cache.addAll(FilesToCache);
  }));

});

self.addEventListener('activate', (event)=>{

  event.waitUntil(caches.keys().then((cacheNames)=>{
    return Promise.all(cacheNames.map((cacheName)=>{
      if(cacheName !== cacheNameCurrency){
        //console.log('deleting old cache from ',cacheName);
        return caches.delete(cacheNameCurrency);
      }       
    }));
  }));
  //console.log('serviceWorker activated');
});

self.addEventListener('fetch', (event)=>{
 
    event.respondWith(
      //function tries to get resource from cache after user getting offline,
      //otherwise loads from the network resources
        serveCurrency(event.request)
      );
  });

//function that responds to request
//and checks for request in the cache,
//if no cache, it loads from the network resources
serveCurrency = (request)=>{
  let currUrl = request.url;
  //opning cache resources
  return caches.open(cacheNameCurrency).then((cache)=>{
    //try match the request with the request in the cache resources
    return cache.match(currUrl).then((response)=>{
      if (response) {
        //console.log('serviceWorker Response found in cache resources ', request.url);
        return response;
      }
      //if no request cached, fetch from the network resources
      return fetch(request).then((networkResponse)=>{
        //add new request into the cache resources
        cache.put(currUrl, networkResponse.clone());
        return networkResponse;
      }).catch((error)=>{
      console.log('Error occurred while getting data. Check internet connection.',error);
    });
    });
  }
 )}
        
      