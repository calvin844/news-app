import { createStore, combineReducers } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { CollApsedReducer } from './reducers/CollApsedReducer';
import { LoadingReducer } from './reducers/LoadingReducer';

const persistConfig = {
    key: 'root',
    storage,
    blacklist: ['LoadingReducer']
}

const reducers = combineReducers({
    CollApsedReducer,
    LoadingReducer
})

const persistedReducer = persistReducer(persistConfig, reducers)
// const store = createStore(persistedReducer);

let store = createStore(persistedReducer)
let persistor = persistStore(store)

export { store, persistor }

// export default store