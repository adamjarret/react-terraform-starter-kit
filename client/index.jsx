/* global process */
import React from 'react';
import {render} from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
import {Provider} from 'react-redux';
import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunkMiddleware from 'redux-thunk';
import Loadable from 'react-loadable';
import loading from '~/components/LoadingIndicator';
import {endpointPrefix} from '~/constants/ClientConfig';
import * as reducers from './reducers';

const middleware = [thunkMiddleware];

// Dynamically load App component to keep core bundle size down
const App = Loadable({loading, loader: () => import(/* webpackChunkName: "App" */ '~/components/App')});

render((
    <Provider store={createStore(combineReducers(reducers), applyMiddleware(...middleware))}>
        <BrowserRouter basename={endpointPrefix}>
            <App/>
        </BrowserRouter>
    </Provider>
), document.getElementById('app'));
