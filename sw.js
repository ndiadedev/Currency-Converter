/*self.importScripts('js/idb.js');*/

/*
 *
 *  Mobile Web Specialist Currency Converter App
 *  Set cache files for offline purpose
 *
 */
 const cacheName = 'mws-currency';
 const FilesToCache = [
        `/`,
        `./index.html`,
        `assets/css/style.css`,
        `assets/css/font-awesome.css`,
        `assets/fonts/fontawesome-webfont.eot`,
        `assets/fonts/fontawesome-webfont.svg`,
        `assets/fonts/fontawesome-webfont.ttf`,
        `assets/fonts/fontawesome-webfont.woff`,
        `assets/fonts/fontawesome-webfont.woff2`,
        `assets/fonts/FontAwesome.otf`,
        `assets/images/bg.jpg`,
        `assets/images/favicon.png`,
        `assets/images/img1.jpg`,
        `js/main.js`,
        `https://fonts.googleapis.com/css?family=Maven+Pro:900|Yantramanav:400,500,700`,
        'https://free.currencyconverterapi.com/api/v5/currencies'      
 ];

//Install cache
 self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(cacheName)
        .then(cache => {
            console.info('caching files');
            return cache.addAll(FilesToCache);
        })
    );
});

//Activate cache
self.addEventListener('activate', event => {
  event.waitUntil(
      caches.keys()
        .then(keyList => Promise.all(keyList.map(keyCache => {
        if (keyCache !== cacheName){
            console.log("removing cached files", keyCache);
            return caches.delete(keyCache);        
        }
    })))
    );
  return self.clients.claim();
});

//Fetching data
self.addEventListener('fetch', event => {
  event.respondWith(caches.match(event.request)
    .then(response => response || fetch(event.request)
      .then(response => caches.open(cacheName)
        .then(cache => {
          cache.put(event.request, response);
            return response.clone();
          }) 
          .catch(event => {
          console.log('error caching and fetching');
        }))
      ));
    });
        
      