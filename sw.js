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
        `https://github.com/ndiadedev/Currency-Converter/blob/master/index.html`,
        `https://github.com/ndiadedev/Currency-Converter/blob/master/sw.js`,
        `https://github.com/ndiadedev/Currency-Converter/tree/master/assets/css/style.css`,
        `https://github.com/ndiadedev/Currency-Converter/tree/master/assets/css/font-awesome.css`,
        `https://github.com/ndiadedev/Currency-Converter/tree/master/assets/fonts/fontawesome-webfont.eot`,
        `https://github.com/ndiadedev/Currency-Converter/tree/master/assets/fonts/fontawesome-webfont.svg`,
        `https://github.com/ndiadedev/Currency-Converter/tree/master/assets/fonts/fontawesome-webfont.ttf`,
        `https://github.com/ndiadedev/Currency-Converter/tree/master/assets/fonts/fontawesome-webfont.woff`,
        `https://github.com/ndiadedev/Currency-Converter/tree/master/assets/fonts/fontawesome-webfont.woff2`,
        `https://github.com/ndiadedev/Currency-Converter/tree/master/assets/fonts/FontAwesome.otf`,
        `https://github.com/ndiadedev/Currency-Converter/tree/master/assets/images/bg.jpg`,
        `https://github.com/ndiadedev/Currency-Converter/tree/master/assets/images/favicon.png`,
        `https://github.com/ndiadedev/Currency-Converter/tree/master/assets/images/img1.jpg`,
        `https://github.com/ndiadedev/Currency-Converter/tree/master/js/jquery-1.11.1.min.js`,
        `https://github.com/ndiadedev/Currency-Converter/tree/master/js/idb.js`,
        `https://github.com/ndiadedev/Currency-Converter/tree/master/js/main.js`,
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
        
      