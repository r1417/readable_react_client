import React from 'react';
import ReactDOM from 'react-dom';
import TcpConsole from './TcpConsole';
import registerServiceWorker from './registerServiceWorker';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();
 
const element = <TcpConsole  />;


ReactDOM.render(element, document.getElementById('root'));



registerServiceWorker();
