import Thunk from 'redux-thunk'
import { fromJS } from 'immutable'
import promiseMiddleware from 'redux-promise-middleware'
import { combineReducers } from 'redux-immutable'
import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'

import reducers from './root-reducer'

export default function (initialState) {
  return createStore(
    combineReducers(reducers),
    fromJS(initialState),
    composeWithDevTools(applyMiddleware(promiseMiddleware(), Thunk))
  )
}
