import { AnyAction, combineReducers, Reducer } from '@reduxjs/toolkit';
import { reducer as companyReducer } from '../slices/company'
import { reducer as projectReducer } from '../slices/project'
import { reducer as contactReducer } from '../slices/contact'
import { reducer as appReducer } from '../slices/app'
import type { RootState } from './index'

const combinedReducer = combineReducers({
  company: companyReducer,
  project: projectReducer,
  contact: contactReducer,
  app: appReducer,
});

export const rootReducer: Reducer = (state: RootState, action: AnyAction) => {
  if (action.type === 'company/logout') {
    state = {} as RootState;
  }
  return combinedReducer(state, action);
};
