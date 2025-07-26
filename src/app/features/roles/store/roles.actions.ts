import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { PagedList } from "../../../core/models/paged-list.model";
import { Role } from "../../../core/models/role.model";

export const RolesActions = createActionGroup({
  source: 'Roles',
  events: {
    'Load Roles': props<{
      page: number;
      pageSize: number;
      searchTerm?: string;
    }>(),
    'Load Roles Success': props<{ pagedList: PagedList<Role> }>(),
    'Load Roles Failure': props<{ error: string }>(),

    'Create Role': props<{ name: string; permissionNames: string[] }>(),
    'Create Role Success': emptyProps(),
    'Create Role Failure': props<{ error: string }>(),

    'Update Role': props<{ id: number; name: string; permissionNames: string[] }>(),
    'Update Role Success': emptyProps(),
    'Update Role Failure': props<{ error: string }>(),
  },
});