if ('serviceWorker' in navigator) {
	// Override the default scope of '/' with './', so that the registration applies
	// to the current directory and everything underneath it.
	navigator.serviceWorker.register('sw.js', {scope: './'}).then(function(registration) {
		console.log(registration)
		console.log('Registration succeeded');
	}).catch(function(error) {
		console.warn('Registration failed');
	});
}