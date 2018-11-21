import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App'
import registerServiceWorker from './registerServiceWorker';
import {Provider} from 'react-redux';
import store from './store/store';

const render = Component => {
    ReactDOM.render(
        <Provider store={store}>
            <Component />
        </Provider>,
        document.getElementById('root'),
    )
}

render(App);
registerServiceWorker();
