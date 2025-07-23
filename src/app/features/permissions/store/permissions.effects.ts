import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { PermissionService } from '../../../core/services/permission.service';
import { PermissionsActions } from './permissions.actions';
import { catchError, exhaustMap, map, of } from 'rxjs';

@Injectable()
export class PermissionEffects {
  private actions$ = inject(Actions);
  private permissionsService = inject(PermissionService);

  loadPermissions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PermissionsActions.loadPermsiions),
      exhaustMap(() =>
        this.permissionsService.getPermissions().pipe(
          map((permissionGroups) =>
            PermissionsActions.loadPermissionsSuccess({ permissionGroups })
          ),
          catchError((error) =>
            of(
              PermissionsActions.loadPermissionsFailure({
                error: 'Failed to Load Permissions',
              })
            )
          )
        )
      )
    )
  );
}
