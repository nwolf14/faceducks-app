import { createStore, applyMiddleware, Store } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from "redux-devtools-extension";
import rootReducer from "./reducers";
import { IUserState } from './reducers/users';
import { ICommonState } from './reducers/common';
import { IPhotosReducerState } from './reducers/photos';

export interface IApplicationState {
  user: IUserState,
  common: ICommonState,
  photos: IPhotosReducerState
}

export let store: Store<IApplicationState>;

export function configureStore(): Store<IApplicationState> {
  store = createStore(rootReducer, {}, composeWithDevTools(applyMiddleware(thunk)));
  return store;
}
