import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';

import rootReducer from './reducers';

export default function configureAppStore(preloadedState: any = {}) {
  const store = configureStore({
    reducer: rootReducer,
    middleware: [...getDefaultMiddleware()],
    preloadedState,
    enhancers: []
  });

  return store;
}
