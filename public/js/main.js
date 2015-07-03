window.serverConnection = io.connect("http://localhost:3000");

window.serverConnection.on('message', function (data) {
	navigator.serviceWorker.controller.postMessage(data);
});

function initialiseState(registration) {
	if (!('showNotification' in ServiceWorkerRegistration.prototype)) {  
	    console.warn('Notifications aren\'t supported.');  
	    return;  
	}

	if (Notification.permission === 'denied') {  
	    console.warn('The user has blocked notifications.');  
	    return;  
	}

	if (!('PushManager' in window)) {  
	    console.warn('Push messaging isn\'t supported.');  
	    return;  
	}

	navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
		serviceWorkerRegistration.pushManager.getSubscription()  
      		.then(function(subscription) {
		        var pushButton = document.querySelector('.js-push-button'); 
  				var messageSpan = document.querySelector('#enabled'); 
		        pushButton.disabled = false;

		        if (!subscription) { 
		          return;  
		        }

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
  var messageSpan = document.querySelector('#enabled');
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
  	var messageSpan = document.querySelector('#enabled');
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
     });

   	var sendButton = document.getElementById('send-trigger');
   	sendButton.addEventListener('click', function() {
   		var message = document.getElementById('message-to-send').value;

		window.serverConnection.emit('push', {
			name : 'Jaco',
			message: message
		});
   	});
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