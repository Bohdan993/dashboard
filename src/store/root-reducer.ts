import { combineReducers } from '@reduxjs/toolkit';
import { reducer as calendarReducer } from '../slices/calendar';
import { reducer as chatReducer } from '../slices/chat';
import { reducer as kanbanReducer } from '../slices/kanban';
import { reducer as mailReducer } from '../slices/mail';
import { reducer as companyReducer } from '../slices/company'
import { reducer as projectReducer } from '../slices/project'
import { reducer as contactReducer } from '../slices/contact'

export const rootReducer = combineReducers({
  calendar: calendarReducer,
  chat: chatReducer,
  kanban: kanbanReducer,
  mail: mailReducer,
  company: companyReducer,
  project: projectReducer,
  contact: contactReducer
});
