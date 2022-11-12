import { companiesApi } from '../api/companies-api';
import { slice } from '../slices/company';
import { AppThunk } from '../store';
import { Company } from '../types/company';

export const getCompanies = (): AppThunk => async (dispatch): Promise<void> => {
  const response = await companiesApi.getCompanies();

  dispatch(slice.actions.getCompanies(response));
};

type GetActiveCompanyParams = Company;

export const getActiveCompany = (params: GetActiveCompanyParams): AppThunk => (dispatch) : void => {
  dispatch(slice.actions.getActiveCompany(params));
}

type CreateCompanyParams = Company;

export const createCompany = (params: CreateCompanyParams): AppThunk => async (dispatch): Promise<void> => {
  const response = await companiesApi.createCompany(params);

  dispatch(slice.actions.createCompany(response));
};

type UpdateCompanyParams = Company;

export const updateCompany = (params: UpdateCompanyParams): AppThunk => async (dispatch) : Promise<void> => {
  const {id, ...rest} = params;
  const response = await companiesApi.updateCompany(id!, rest);

  dispatch(slice.actions.updateCompany(response));
}

type DeleteCompanyParams = {
  companyId: number;
};

export const deleteCompany = (params: DeleteCompanyParams): AppThunk => async (dispatch) : Promise<void> => {
  await companiesApi.deleteCompany(params.companyId);

  dispatch(slice.actions.deleteCompany(params.companyId));
}


export const logout = (): AppThunk => (dispatch) : void => {
  dispatch(slice.actions.logout());
}
 