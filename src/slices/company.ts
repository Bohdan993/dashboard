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
    }
  }
});

export const { reducer } = slice;
