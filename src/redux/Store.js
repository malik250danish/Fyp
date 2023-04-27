import {configureStore , getDefaultMiddleware } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage'
import {combineReducers} from "redux";
import { persistReducer } from 'redux-persist'

// importing reducers
import usersReducer from './reducers/UserReducer'
import homePageReducer from './reducers/HomePageReducer'
import ticketsReducer from './reducers/TicketsReducer'
import forumsReducer from './reducers/ForumsReducer'
import partnerReducer from './reducers/PartnerReducer'
import articlesReducer from './reducers/ArticlesReducer'
import customerChatsReducer from './reducers/CustomerChatsReducer'
import customerMessagesReducer from './reducers/CustomerMessagesReducer'
import partnerChatsReducer from './reducers/PartnerChatReducer'
import partnerMessagesReducer from './reducers/PartnerMessagesReducer'

import  persistStore from 'redux-persist/es/persistStore'

const persistConfig = {
    key: 'root',
    version: 1,
    storage,
    //blacklist: ['homePageReducer']
}


    // combining all reducers

const rootReducer = combineReducers({
    usersReducer,
    homePageReducer,
    ticketsReducer,
    forumsReducer,
    partnerReducer,
    articlesReducer,
    customerChatsReducer,
    customerMessagesReducer,
    partnerChatsReducer,
    partnerMessagesReducer
})
const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
        serializableCheck: false,
    })
});

let persistor = persistStore(store)

export default store;
export {persistor}