import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { UserService } from "../../../core/services/user.service";
import { NotificationService } from "../../../shared/services/notification.service";
import { ErrorHandlingService } from "../../../core/services/error-handling.service";
import { catchError, exhaustMap, map, of } from "rxjs";
import { UsersActions } from "./users.actions";
import { HttpErrorResponse } from "@angular/common/http";

@Injectable()
export class UsersEffects {
  private actions$ = inject(Actions);
  private userService = inject(UserService);
  private notificationService = inject(NotificationService);
  private errorHandlingService = inject(ErrorHandlingService);

  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.loadUsers),
      exhaustMap((action) =>
        this.userService
          .getUsers(action.page, action.pageSize, action.searchTerm)
          .pipe(
            map((pagedList) => UsersActions.loadUsersSuccess({ pagedList })),
            catchError((error: HttpErrorResponse) => {
              const errorMessage =
                this.errorHandlingService.parseHttpError(error);
              this.notificationService.showError(errorMessage);
              return of(UsersActions.loadUsersFailure({ error: errorMessage }));
            })
          )
      )
    )
  );
}