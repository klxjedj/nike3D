import 'react-app-polyfill/ie11';
import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import Sunset from './scenes/Sunset';
import Prelaunch from './scenes/Prelaunch';

import { isSunset, hasLaunched } from './lib/locale';
import * as serviceWorker from './serviceWorker';

import * as Sentry from '@sentry/browser';

import { isProduction } from './lib/common';

// All integration that come with an SDK can be found on Sentry.Integrations object
// Custom integration must conform Integration interface: https://github.com/getsentry/sentry-javascript/blob/master/packages/types/src/index.ts

Sentry.init({ dsn: 'https://51124df79da9415295affa272740c54f@sentry.io/1357064' });

let experience = <App />

if (isProduction()) {
    if (isSunset()) {
        experience = <Sunset />
    }

    if (!hasLaunched()) {
        experience = <Prelaunch />
    }
}

// /* TESTING */
// experience = <Prelaunch/>

ReactDOM.render(experience, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
