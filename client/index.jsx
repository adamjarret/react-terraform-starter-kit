/* global process */
import React from 'react'
import {render} from 'react-dom'
import {BrowserRouter} from 'react-router-dom'
import {Provider} from 'react-redux'
import {createStore, combineReducers, applyMiddleware} from 'redux'
import thunkMiddleware from 'redux-thunk'
import App from '~/components/App'
import * as reducers from './reducers'

const middleware = [thunkMiddleware];

render((
    <Provider store={createStore(combineReducers(reducers), applyMiddleware(...middleware))}>
        <BrowserRouter>
            <App/>
        </BrowserRouter>
    </Provider>
), document.getElementById('app'));
