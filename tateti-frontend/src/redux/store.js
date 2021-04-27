import { createStore } from 'redux'

import tatetiReducer from './tatetiDucks'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();

export const store = createStore(tatetiReducer, composeEnhancers)