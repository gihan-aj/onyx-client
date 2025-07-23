import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { PermissionGroup } from '../../../core/models/permission.model';

export const PermissionsActions = createActionGroup({
  source: 'Permissions',
  events: {
    'Load Permsiions': emptyProps(),
    'Load Permissions Success': props<{
      permissionGroups: PermissionGroup[];
    }>(),
    'Load Permissions Failure': props<{ error: string }>(),
  },
});
