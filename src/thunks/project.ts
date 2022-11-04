import { projectsApi } from '../api/projects-api';
import { slice } from '../slices/project';
import { AppThunk } from '../store';
import { Project } from '../types/project';

export const getProjects = (): AppThunk => async (dispatch): Promise<void> => {
  const response = await projectsApi.getProjects();

  dispatch(slice.actions.getProjects(response));
};

type CreateProjectParams = Project;

export const createProject = (params: CreateProjectParams): AppThunk => async (dispatch): Promise<void> => {
  const response = await projectsApi.createProject(params);

  dispatch(slice.actions.createProject(response));
};

type UpdateProjectParams = Project;

export const updateProject = (params: UpdateProjectParams): AppThunk => async (dispatch) : Promise<void> => {
  const {id, ...rest} = params;
  const response = await projectsApi.updateProject(id!, rest);

  dispatch(slice.actions.updateProject(response));
}

type DeleteProjectParams = {
  projectId: number;
};

export const deleteProject = (params: DeleteProjectParams): AppThunk => async (dispatch) : Promise<void> => {
  await projectsApi.deleteProject(params.projectId);

  dispatch(slice.actions.deleteProject(params.projectId));
}
 