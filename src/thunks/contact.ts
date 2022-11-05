import { contactsApi } from '../api/contacts-api';
import { slice } from '../slices/contact';
import { AppThunk } from '../store';
import { Contact } from '../types/contact';

type GetContactsParams = {
  company_id: number;
};

export const getContacts = (params: GetContactsParams): AppThunk => async (dispatch): Promise<void> => {
  const response = await contactsApi.getContacts(params.company_id);

  dispatch(slice.actions.getContacts(response));
};

type CreateContactParams = {
  contact: Contact;
  company_id: number;
};

export const createContact = (params: CreateContactParams): AppThunk => async (dispatch): Promise<void> => {
  const response = await contactsApi.createContact(params.contact, params.company_id);

  dispatch(slice.actions.createContact(response));
};

type UpdateContactParams = {
  contact: Contact;
  company_id: number;
};

export const updateContact = (params: UpdateContactParams): AppThunk => async (dispatch) : Promise<void> => {
  const {id, ...rest} = params.contact;
  const response = await contactsApi.updateContact(id!, params.company_id, rest);

  dispatch(slice.actions.updateContact(response));
}

type DeleteContactParams = {
  contactId: number;
  company_id: number;
};

export const deleteContact = (params: DeleteContactParams): AppThunk => async (dispatch) : Promise<void> => {
  await contactsApi.deleteContact(params.contactId, params.company_id);

  dispatch(slice.actions.deleteContact(params.contactId));
}
 