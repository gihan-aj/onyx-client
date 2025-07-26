import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { RoleService } from '../../../core/services/role.service';
import { RolesActions } from './roles.actions';
import { catchError, exhaustMap, map, of } from 'rxjs';
import { ErrorHandlingService } from '../../../core/services/error-handling.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class RolesEffects {
  private actions$ = inject(Actions);
  private roleService = inject(RoleService);
  private notificationService = inject(NotificationService);
  private errorHandlingService = inject(ErrorHandlingService);

  loadRoles$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RolesActions.loadRoles),
      exhaustMap((action) =>
        this.roleService
          .getRoles(action.page, action.pageSize, action.searchTerm)
          .pipe(
            map((pagedList) => RolesActions.loadRolesSuccess({ pagedList })),
            catchError((error: HttpErrorResponse) => {
              const errorMessage =
                this.errorHandlingService.parseHttpError(error);
              this.notificationService.showError(errorMessage);
              return of(
                RolesActions.loadRolesFailure({ error: 'Failed to load roles' })
              );
            })
          )
      )
    )
  );

  createRoles$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RolesActions.createRole),
      exhaustMap((action) =>
        this.roleService.createRole(action).pipe(
          map(() => {
            this.notificationService.showSuccess('Role created successfully.');
            return RolesActions.createRoleSuccess();
          }),
          catchError((error: HttpErrorResponse) => {
            const errorMessage =
              this.errorHandlingService.parseHttpError(error);
            this.notificationService.showError(errorMessage);
            return of(RolesActions.createRoleFailure({ error: errorMessage }));
          })
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
            permissionNames: action.permissionNames,
          })
          .pipe(
            map(() => {
              this.notificationService.showSuccess(
                'Role updated successfully.'
              );
              return RolesActions.updateRoleSuccess();
            }),
            catchError((error: HttpErrorResponse) => {
              const errorMessage =
                this.errorHandlingService.parseHttpError(error);
              this.notificationService.showError(errorMessage);
              return of(
                RolesActions.updateRoleFailure({
                  error: errorMessage,
                })
              );
            })
          )
      )
    )
  );
}
