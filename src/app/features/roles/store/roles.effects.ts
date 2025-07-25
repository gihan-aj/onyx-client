import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { RoleService } from '../../../core/services/role.service';
import { RolesActions } from './roles.actions';
import { catchError, exhaustMap, map, of } from 'rxjs';

@Injectable()
export class RolesEffects {
  private actions$ = inject(Actions);
  private roleService = inject(RoleService);

  loadRoles$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RolesActions.loadRoles),
      exhaustMap((action) =>
        this.roleService
          .getRoles(action.page, action.pageSize, action.searchTerm)
          .pipe(
            map((pagedList) => RolesActions.loadRolesSuccess({ pagedList })),
            catchError((error) =>
              of(
                RolesActions.loadRolesFailure({ error: 'Failed to load roles' })
              )
            )
          )
      )
    )
  );

  createRoles$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RolesActions.createRole),
      exhaustMap((action) =>
        this.roleService.createRole(action).pipe(
          map(() => RolesActions.createRoleSuccess()),
          catchError((error) =>
            of(
              RolesActions.createRoleFailure({ error: 'Failed to create role' })
            )
          )
        )
      )
    )
  );

  updateRole$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RolesActions.updateRole),
      exhaustMap((action) =>
        this.roleService
          .updateRole(action.id, {
            name: action.name,
            permissions: action.permissions,
          })
          .pipe(
            map(() => RolesActions.updateRoleSuccess()),
            catchError((error) =>
              of(
                RolesActions.updateRoleFailure({
                  error: 'Failed to update role',
                })
              )
            )
          )
      )
    )
  );
}
