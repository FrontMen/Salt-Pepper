self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open('v1').then(function(cache) {
      return cache.addAll([
        '/stylesheets/style.css',
        '/js/main.js',
        '/',
        'images/FM-logo-192.png'
      ]);
    })
  );
});

self.addEventListener('activate', function(e) {
  console.log('Activate event:', e);
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      if (response) {
        console.log('Found response in cache:', response);

        return response;
      }

      console.log('No response found in cache. About to fetch from network...');
      return fetch(event.request).then(function(response) {
        console.log('Response from network is:', response);

        return response;
      }).catch(function(error) {
        // This catch() will handle exceptions thrown from the fetch() operation.
        // Note that a HTTP error response (e.g. 404) will NOT trigger an exception.
        // It will return a normal response object that has the appropriate error code set.
        console.error('Fetching failed:', error);

        throw error;
      });
    })
  );
});

self.addEventListener('message', function(event) {
  var title = 'Message from ' + event.data.name;  
  var body = event.data.message;  
  var icon = '/images/FM-logo-192.png';
  var tag = 'simple-push-demo-notification-tag';

  self.registration.showNotification(title, {  
    body: body,  
    icon: icon,  
    tag: tag  
  }); 

});