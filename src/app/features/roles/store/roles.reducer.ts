import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { Role } from '../../../core/models/role.model';
import { createFeature, createReducer, on } from '@ngrx/store';
import { RolesActions } from './roles.actions';

export interface RolesState extends EntityState<Role> {
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  pageSize: number;
  totalCount: number;
}

export const rolesAdapter = createEntityAdapter<Role>({
  selectId: (role: Role) => role.id,
});

export const initialState: RolesState = rolesAdapter.getInitialState({
  isLoading: false,
  error: null,
  currentPage: 1,
  pageSize: 10,
  totalCount: 0,
});

export const rolesFeature = createFeature({
  name: 'roles',
  reducer: createReducer(
    initialState,
    on(RolesActions.loadRoles, (state, { page, pageSize }) => ({
      ...state,
      isLoading: true,
      currentPage: page,
      pageSize,
    })),
    on(RolesActions.loadRolesSuccess, (state, { pagedList }) =>
      rolesAdapter.setAll(pagedList.items, {
        ...state,
        isLoading: false,
        totalCount: pagedList.totalCount,
      })
    ),
    on(RolesActions.loadRolesFailure, (state, { error }) => ({
      ...state,
      isLoading: false,
      error,
    })),

    on(RolesActions.createRole, (state) => ({ ...state, isLoading: true })),
    on(RolesActions.createRoleSuccess, (state) => ({
      ...state,
      isLoading: false,
    })),
    on(RolesActions.createRoleFailure, (state, { error }) => ({
      ...state,
      isLoading: false,
      error,
    }))
  ),

  extraSelectors: ({ selectRolesState }) => ({
    ...rolesAdapter.getSelectors(selectRolesState),
  }),
});

export const {
    selectIsLoading: selectRolesLoading,
    selectError: selectRolesError,
    selectAll: selectAllRoles,
    selectRolesState
} = rolesFeature;
