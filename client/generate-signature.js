const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === '[::1]' ||
    // 127.0.0.1/8 is considered localhost for IPv4.
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
);

class FormValidate {  

  this.privateId = "12ij3i23"
  this.Signature = "16b15f88bbd2e0a22d1d0084b8b7080f2003ea83eab1a00f80d8c18446c9c1b6224f17aa09eaf167717ca4f355bb6dc94356e037edf3adf6735a86fc3741f5231b"
  this.encryptMnemonic = "{\"data\": \"PE1C05/DTSzikUtS9fn3nh2+m/MuD7lzWHPtbsc4bYstwuZRbewEITQ5dsAXr3PkAYtCQbHekJRcV6VO3G6CMLvrPZvb66HvpOEUToGKHjugTc2D92Kgw4IvOy1t\",\"iv\": \"Wh86E08FCx7ahZM4ePiqlw==\",\"salt\": \"P2FhZBPjH3+2IOl5BxaF9VFsemSuFr2ph1GVnWRuP0Q=\"}"
  this.masqueId = "LazyDuck"
  this.message = "xxxxxxxxxxx"  
}


function checkValidServiceWorker(swUrl, config) {
  // Check if the service worker can be found. If it can't reload the page.
  fetch(swUrl)
    .then(response => {
      // Ensure service worker exists, and that we really are getting a JS file.
      const contentType = response.headers.get('content-type');
      if (
        response.status === 404 ||
        (contentType != null && contentType.indexOf('javascript') === -1)
      ) {
        // No service worker found. Probably a different app. Reload the page.
        navigator.serviceWorker.ready.then(registration => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        // Service worker found. Proceed as normal.
        registerValidSW(swUrl, config);
      }
    })
    .catch(() => {
      console.log(
        'No internet connection found. App is running in offline mode.'
      );
    });
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(registration => {
      registration.unregister();
    });
  }
}
