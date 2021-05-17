import { pinus } from 'pinus';
import { preload } from './preload';

/**
 *  替换全局Promise
 *  自动解析sourcemap
 *  捕获全局错误
 */
preload();

/**
 * Init app for client.
 */
var app = pinus.createApp();
app.set('name', 'apps');

// app configuration
app.configure('production|development', 'connector', function(){
  app.set('connectorConfig',
    {
      connector : pinus.connectors.sioconnector,
      // 'websocket', 'polling-xhr', 'polling-jsonp', 'polling'
      transports : ['websocket', 'polling'],
      heartbeats : true,
      closeTimeout : 60 * 1000,
      heartbeatTimeout : 60 * 1000,
      heartbeatInterval : 25 * 1000
    });
});

// start app
app.start();

process.on('uncaughtException', function (err) {
  console.error(' Caught exception: ' + err.stack);
});
