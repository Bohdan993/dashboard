import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type { Contact } from '../types/contact';

interface ContactState {
  contacts: Contact[];
}

const initialState: ContactState = {
  contacts: []
};

export const slice = createSlice({
  name: 'contact',
  initialState,
  reducers: {
    getContacts(
      state: ContactState,
      action: PayloadAction<Contact[]>
    ): void {
      state.contacts = action.payload;
    },
    createContact(
      state: ContactState,
      action: PayloadAction<Contact>
    ): void {
      state.contacts.push(action.payload);
    },
    updateContact(
      state: ContactState,
      action: PayloadAction<Contact>
    ): void {
      const contact = action.payload;

      state.contacts = state.contacts.map((_contact) => {
        if (_contact.id === contact.id) {
          return contact;
        }

        return _contact;
      });
    },
    deleteContact(
      state: ContactState,
      action: PayloadAction<number>
    ): void {
      state.contacts = state.contacts.filter((contact) => contact.id !== action.payload);
    }
  }
});

export const { reducer } = slice;
