import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { User } from '../../../core/models/user.model';
import { createFeature, createReducer, on } from '@ngrx/store';
import { UsersActions } from './users.actions';

export interface UsersState extends EntityState<User> {
  isLoading: boolean;
  error: string | null;
  // Pagination metadata
  currentPage: number;
  pageSize: number;
  totalCount: number;
}

export const usersAdapter = createEntityAdapter<User>({
    selectId: (user: User) => user.id,
});

export const initialState : UsersState = usersAdapter.getInitialState({
    isLoading: false,
    error: null,
    currentPage: 1,
    pageSize: 10,
    totalCount: 0
});

export const usersFeature = createFeature({
  name: 'users',
  reducer: createReducer(
    initialState,
    on(UsersActions.loadUsers, (state, { page, pageSize }) => ({
      ...state,
      isLoading: true,
      currentPage: page,
      pageSize: pageSize,
    })),
    on(UsersActions.loadUsersSuccess, (state, { pagedList }) => {
      // Use the adapter to set the user items, and also update pagination state
      return usersAdapter.setAll(pagedList.items, {
        ...state,
        isLoading: false,
        totalCount: pagedList.totalCount,
      });
    }),
    on(UsersActions.loadUsersFailure, (state, { error }) => ({
      ...state,
      isLoading: false,
      error,
    }))
  ),
  extraSelectors: ({ selectUsersState }) => ({
    ...usersAdapter.getSelectors(selectUsersState),
  })
});

export const {
    selectIsLoading,
    selectError,
    selectAll: selectAllUsers,
    selectTotal: selectUsersOnPage,
    selectUsersState,
} = usersFeature;
