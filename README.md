# October AJAX Framework

This repository contains the AJAX framework of October CMS. If you want to build a website using October CMS, visit the main [October CMS repository](http://github.com/octobercms/october).

## Installation outside October CMS

Your application can use the `octobercms` npm package to install the AJAX Framework as a module for build tools like webpack.

1. Add the `octobercms` package to your application.

```js
npm install --save octobercms
```

2. Require and start the Framework in your JavaScript bundle.

```js
var oc = require('octobercms');

// Make an AJAX request
oc.ajax('onSomething', { data: someVar });

// Serialize an element with the request
oc.request('.some-element', 'onSomething', { data: someVar });
```

### jQuery Adapter

If jQuery is found, the traditional API can also be used.

```js
// AJAX request with jQuery
$.request('onSomething', { data: someVar });

// Serialized request with jQuery
$('.some-element').request('onSomething', { data: someVar });
```

## Documentation

[Read the complete documentation](https://docs.octobercms.com/3.x/cms/ajax/introduction.html) on the October CMS website.

## License

The October CMS platform is licensed software, see [End User License Agreement](./LICENSE.md) (EULA) for more details.
