import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import subscribedReducer from './App/Sidebar/subscribedSlice'
import authenticatorReducer from './Authenticator/authenticatorSlice'
import { api } from './constants/api'

const persistConfig = {
  key: 'Geek-Infiltration',
  storage,
  whitelist: ['authenticator', 'subscribed'],
}

const reducers = combineReducers({
  authenticator: authenticatorReducer,
  subscribed: subscribedReducer,
  [api.reducerPath]: api.reducer,
})

const persistedReducer = persistReducer(persistConfig, reducers)
export const store = configureStore({
  devTools: import.meta.env.DEV ? true : false,
  middleware: (getDefaultMiddleware) =>
    // Adding the api middleware enables caching, invalidation, polling,
    // and other useful features of `rtk-query`.
    getDefaultMiddleware({ serializableCheck: false }).concat(api.middleware),
  reducer: persistedReducer,
})
// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch)

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch