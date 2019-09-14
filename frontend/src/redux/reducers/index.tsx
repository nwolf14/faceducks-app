import { combineReducers } from 'redux';
import { user } from './users';
import { common } from './common';
import { photos } from './photos';
import { IApplicationState} from '../store';

export default combineReducers<IApplicationState>({
  user,
  common,
  photos
});