import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type { Company } from '../types/company';

interface CompanyState {
  companies: Company[];
  activeCompany: Company | null;
}

const initialState: CompanyState = {
  companies: [],
  activeCompany: null
};

export const slice = createSlice({
  name: 'company',
  initialState,
  reducers: {
    getCompanies(
      state: CompanyState,
      action: PayloadAction<Company[]>
    ): void {
      state.companies = action.payload;
    },
    getActiveCompany(
      state: CompanyState,
      action: PayloadAction<Company>
    ): void {
        state.activeCompany = action.payload;
    },
    createCompany(
      state: CompanyState,
      action: PayloadAction<Company>
    ): void {
      state.companies.push(action.payload);
    },
    updateCompany(
      state: CompanyState,
      action: PayloadAction<Company>
    ): void {
      const company = action.payload;

      state.companies = state.companies.map((_company) => {
        if (_company.id === company.id) {
          return company;
        }

        return _company;
      });
    },
    deleteCompany(
      state: CompanyState,
      action: PayloadAction<number>
    ): void {
      state.companies = state.companies.filter((company) => company.id !== action.payload);
    },
    logout: state => {
      // From here we can take action only at this "company" state
      // But, as we have taken care of this particular "logout" action
      // in rootReducer, we can use it to CLEAR the complete Redux Store's state
    }
  }
});

export const { reducer } = slice;
