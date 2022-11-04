import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type { Project } from '../types/project';

interface ProjectState {
  projects: Project[];
}

const initialState: ProjectState = {
  projects: []
};

export const slice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    getProjects(
      state: ProjectState,
      action: PayloadAction<Project[]>
    ): void {
      state.projects = action.payload;
    },
    createProject(
      state: ProjectState,
      action: PayloadAction<Project>
    ): void {
      state.projects.push(action.payload);
    },
    updateProject(
      state: ProjectState,
      action: PayloadAction<Project>
    ): void {
      const project = action.payload;

      state.projects = state.projects.map((_project) => {
        if (_project.id === project.id) {
          return project;
        }

        return _project;
      });
    },
    deleteProject(
      state: ProjectState,
      action: PayloadAction<number>
    ): void {
      state.projects = state.projects.filter((project) => project.id !== action.payload);
    }
  }
});

export const { reducer } = slice;
