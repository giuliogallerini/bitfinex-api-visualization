import { applyMiddleware, compose, createStore } from "redux"
import persistCombineReducers from "redux-persist/lib/persistCombineReducers"
import storage from "redux-persist/lib/storage"
import thunk from "redux-thunk"
import createFilter from "redux-persist-transform-filter"
import { routerMiddleware } from "connected-react-router"

// import client from "../configure/client"

// import createApiClient from "./middleware/apiClient"
import requestQueue from "./middleware/requestQueue"

import { reducerName as authReducerName } from "./reducers/core/authentication/actionNames"
import { reducerName as firstLoadReducerName } from "./reducers/core/firstLoad/actionNames"

import reducers, { history } from "./reducers"

export const saveFirstLoadFilter = createFilter(
    firstLoadReducerName,
    ["isFirstLoad"],
)

export const loadFirstLoadFilter = createFilter(
    authReducerName,
    null,
    ["isFirstLoad"],
)

export const saveAuthFilter = createFilter(
    authReducerName,
    ["data"],
)

export const loadAuthFilter = createFilter(
    authReducerName,
    null,
    ["data"],
)


const storageConfig = {
    // TODO: Let's set this to something like "appical" or "appical-io"
    key: "ggporfolio",
    storage,
    whitelist: [
        firstLoadReducerName,
        authReducerName,
    ],
    transforms: [
        saveFirstLoadFilter,
        loadFirstLoadFilter,
        saveAuthFilter,
        loadAuthFilter,
    ],
}

const configureStore = (initialState = {}) => {
    const usableReducers = persistCombineReducers(storageConfig, reducers)

    const composeWithDevToolsExtension = process.env.REACT_APP_ENV === "dev"
        // eslint-disable-next-line no-undef,no-underscore-dangle
        && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    const composeEnhancers = (typeof composeWithDevToolsExtension === "function")
        ? composeWithDevToolsExtension
        : compose

    const middleware = composeEnhancers(applyMiddleware(
        routerMiddleware(history),
        thunk,
        requestQueue,
        // createApiClient(client),
    ))

    return createStore(usableReducers, initialState, middleware)
}

export default configureStore