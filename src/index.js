import React from 'react';
import ReactDOM from 'react-dom';
import numeral from 'numeral';
import './index.less';
import App from './App';
import * as serviceWorker from './serviceWorker';

numeral.register('locale', 'chs', {
  delimiters: {
    thousands: ',',
    decimal: '.',
  },
  abbreviations: {
    thousand: '千',
    million: '百万',
    billion: '十亿',
    trillion: '兆',
  },
  ordinal(number) {
    return '.';
  },
  currency: {
    symbol: '¥',
  },
});

numeral.locale('chs');

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
