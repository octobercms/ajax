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
oc.Request.send('onDoSomething');

// Enable data attributes API
oc.Framework.start();

// Enable extra features
oc.Extras.start();

// Enable turbo routing
oc.Turbo.start();
```

## License

The October CMS platform is licensed software, see [End User License Agreement](./LICENSE.md) (EULA) for more details.
