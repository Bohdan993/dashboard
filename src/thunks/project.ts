import { projectsApi } from '../api/projects-api';
import { slice } from '../slices/project';
import { AppThunk } from '../store';
import { Project } from '../types/project';

type GetProjectsParams = {
  company_id: number;
};

export const getProjects = (params: GetProjectsParams): AppThunk => async (dispatch): Promise<void> => {
  const response = await projectsApi.getProjects(params.company_id);

  dispatch(slice.actions.getProjects(response));
};

type CreateProjectParams = {
  project: Project;
  company_id: number;
};

export const createProject = (params: CreateProjectParams): AppThunk => async (dispatch): Promise<void> => {
  const response = await projectsApi.createProject(params.project, params.company_id);

  dispatch(slice.actions.createProject(response));
};

type UpdateProjectParams = {
  project: Project;
  company_id: number;
}

export const updateProject = (params: UpdateProjectParams): AppThunk => async (dispatch) : Promise<void> => {
  const {id, ...rest} = params.project;
  const response = await projectsApi.updateProject(id!, params.company_id, rest);

  dispatch(slice.actions.updateProject(response));
}

type DeleteProjectParams = {
  projectId: number;
  company_id: number;
};

export const deleteProject = (params: DeleteProjectParams): AppThunk => async (dispatch) : Promise<void> => {
  await projectsApi.deleteProject(params.projectId, params.company_id);

  dispatch(slice.actions.deleteProject(params.projectId));
}
 