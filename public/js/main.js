window.serverConnection = io.connect('http://localhost:3000');

window.serverConnection.on('message', function (data) {
	console.log("Received:", data);
});
var API_KEY = "IzaSyC-Bqq9iHjKRKUwu2jqpbY0wGI8dPvCJV4";

function initialiseState(registration) {
	if (!('showNotification' in ServiceWorkerRegistration.prototype)) {  
	    console.warn('Notifications aren\'t supported.');  
	    return;  
	} else {
		console.log('Notifications are supported.');
	}

	if (Notification.permission === 'denied') {  
	    console.warn('The user has blocked notifications.');  
	    return;  
	} else {
	    console.log('The user has allowed notifications.');  
	}

	if (!('PushManager' in window)) {  
	    console.warn('Push messaging isn\'t supported.');  
	    return;  
	} else {
	    console.log('Push messaging is supported');  
	}

	navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
		serviceWorkerRegistration.pushManager.getSubscription()  
      		.then(function(subscription) {
		        var pushButton = document.querySelector('.js-push-button'); 
  				var messageSpan = document.querySelector('#message'); 
		        pushButton.disabled = false;

		        if (!subscription) {  
		          // We aren't subscribed to push, so set UI  
		          // to allow the user to enable push  
		          return;  
		        }

		        // Set your UI to show they have subscribed for  
		        // push messages  
		        messageSpan.textContent = 'Disable Push Messages';  
		        isPushEnabled = true;  
	      	})  
		    .catch(function(err) {  
		        console.warn('Error during getSubscription()', err);  
		    });
	});
};

function subscribe() {
  var pushButton = document.querySelector('.js-push-button');
  var messageSpan = document.querySelector('#message');
  pushButton.disabled = true;

  navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
    serviceWorkerRegistration.pushManager.subscribe({userVisibleOnly: true})
      .then(function(subscription) {
        isPushEnabled = true;
        messageSpan.textContent = 'Disable Push Messages';
        pushButton.disabled = false;

        // TODO: Send the subscription subscription.endpoint
        // to your server and save it to send a push message
        // at a later date
      })
      .catch(function(e) {
        if (Notification.permission === 'denied') {
          console.log('Permission for Notifications was denied');
          pushButton.disabled = true;
        } else {
          console.log('Unable to subscribe to push.', e);
          pushButton.disabled = false;
          messageSpan.textContent = 'Enable Push Messages';
        }
      });
  });
}

function unsubscribe() {  
  	var pushButton = document.querySelector('.js-push-button');  
  	var messageSpan = document.querySelector('#message');
  	pushButton.disabled = true;

  	navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
	    serviceWorkerRegistration.pushManager.getSubscription()
	    	.then(function(pushSubscription) {  
		        if (!pushSubscription) {  
		          // No subscription object, so set the state  
		          // to allow the user to subscribe to push  
		          isPushEnabled = false;  
		          pushButton.disabled = false;  
		          messageSpan.textContent = 'Enable Push Messages';  
		          return;  
		        }  

		        // TODO: Make a request to your server to remove
		        // the users data from your data store so you
		        // don't attempt to send them push messages anymore

		        // We have a subscription, so call unsubscribe on it  
		        pushSubscription.unsubscribe().then(function(successful) {  
		          pushButton.disabled = false;  
		          messageSpan.textContent = 'Enable Push Messages';  
		          isPushEnabled = false;  
		        }).catch(function(e) {  
		          // We failed to unsubscribe, this can lead to  
		          // an unusual state, so may be best to remove   
		          // the users data from your data store and   
		          // inform the user that you have done so

		          console.log('Unsubscription error: ', e);  
		          pushButton.disabled = false;
		          messageSpan.textContent = 'Enable Push Messages'; 
		        });
		    })
			.catch(function(e) {  
		        console.error('Error thrown while unsubscribing from push messaging.', e);  
		    });  
  		});  
}

var isPushEnabled = false;

window.addEventListener('load', function() {  
   	var pushButton = document.querySelector('.js-push-button');  
   	pushButton.addEventListener('click', function() {
	    if (isPushEnabled) {  
	    	unsubscribe();  
	    } else {  
	    	subscribe(); 
		} 
     })
});

if ('serviceWorker' in navigator) {
	// Override the default scope of '/' with './', so that the registration applies
	// to the current directory and everything underneath it.
	navigator.serviceWorker
		.register('sw.js', {scope: './'})
		.then(initialiseState)
		.catch(function(error) {
			console.warn('Registration failed');
		});
}