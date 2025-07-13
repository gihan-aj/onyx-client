import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { User } from "../../../core/models/user.model";
import { PagedList } from "../../../core/models/paged-list.model";

export const UsersActions = createActionGroup({
  source: 'Users',
  events: {
    'Load Users': props<{
      page: number;
      pageSize: number;
      searchTerm: string | null;
    }>(),
    'Load Users Success': props<{ pagedList: PagedList<User> }>(),
    'Load Users Failure': props<{ error: string }>(),
  },
});