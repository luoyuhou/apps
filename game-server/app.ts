import { pinus } from 'pinus';
import { preload } from './preload';
import { getConnectionOptions, createConnection } from 'typeorm';

/**
 *  替换全局Promise
 *  自动解析sourcemap
 *  捕获全局错误
 */
preload();

/**
 * Init app for client.
 */
const app = pinus.createApp();
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

const connectDB = async () => {
  const connectionOptions = await getConnectionOptions();
  return await createConnection(connectionOptions);
};

connectDB().then((con) => {
  // start app
  app.start();
}).catch((error) => {
  console.error('Connect db error: ', error.message);
});

process.on('uncaughtException', function (err) {
  console.error(' Caught exception: ' + err.stack);
});
