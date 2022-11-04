import { contactsApi } from '../api/contacts-api';
import { slice } from '../slices/contact';
import { AppThunk } from '../store';
import { Contact } from '../types/contact';

export const getContacts = (): AppThunk => async (dispatch): Promise<void> => {
  const response = await contactsApi.getContacts();

  dispatch(slice.actions.getContacts(response));
};

type CreateContactParams = Contact;

export const createContact = (params: CreateContactParams): AppThunk => async (dispatch): Promise<void> => {
  const response = await contactsApi.createContact(params);

  dispatch(slice.actions.createContact(response));
};

type UpdateContactParams = Contact;

export const updateContact = (params: UpdateContactParams): AppThunk => async (dispatch) : Promise<void> => {
  const {id, ...rest} = params;
  const response = await contactsApi.updateContact(id!, rest);

  dispatch(slice.actions.updateContact(response));
}

type DeleteContactParams = {
  contactId: number;
};

export const deleteContact = (params: DeleteContactParams): AppThunk => async (dispatch) : Promise<void> => {
  await contactsApi.deleteContact(params.contactId);

  dispatch(slice.actions.deleteContact(params.contactId));
}
 