import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  DataTableComponent,
  TableColumn,
} from '../../../shared/components/data-table/data-table.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { Store } from '@ngrx/store';
import {
  selectAllUsers,
  selectIsLoading,
  selectUsersState,
} from '../store/users.reducer';
import { map } from 'rxjs';
import { User } from '../../../core/models/user.model';
import { UsersActions } from '../store/users.actions';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { ModalService } from '../../../shared/services/modal.service';
import { UserFormComponent } from '../components/user-form/user-form.component';

@Component({
  selector: 'app-user-list',
  imports: [
    CommonModule,
    DataTableComponent,
    PaginationComponent,
    StatusBadgeComponent,
    ButtonComponent,
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
})
export class UserListComponent implements OnInit {
  private store = inject(Store);
  private modalService = inject(ModalService);

  @ViewChild('statusTpl', { static: true }) statusTpl!: TemplateRef<any>;
  @ViewChild('actionsTpl', { static: true }) actionsTpl!: TemplateRef<any>;

  users$ = this.store.select(selectAllUsers);
  isLoading$ = this.store.select(selectIsLoading);

  usersState$ = this.store.select(selectUsersState);
  paginationData$ = this.usersState$.pipe(
    map((state) => ({
      currentPage: state.currentPage,
      pageSize: state.pageSize,
      totalCount: state.totalCount,
    }))
  );

  columns: TableColumn<User>[] = [];

  ngOnInit(): void {
    this.loadUsers(1);
  }

  ngAfterViewInit(): void {
    // We define the columns here, after the view (and templates) are initialized
    setTimeout(() => {
      this.columns = [
        { key: 'userCode', title: 'User Code' },
        { key: 'email', title: 'Email' },
        { key: 'firstName', title: 'First Name' },
        { key: 'lastName', title: 'Last Name' },
        { key: 'isActive', title: 'Status', customTpl: this.statusTpl }, // Assign the template
        { key: 'actions', title: 'Actions', customTpl: this.actionsTpl }, // Assign the template
      ];
    });
  }

  loadUsers(page: number): void {
    this.store.dispatch(
      UsersActions.loadUsers({ page, pageSize: 10, searchTerm: null })
    );
  }

  onPageChange(page: number): void {
    this.loadUsers(page);
  }

  openUserForm(user?: User) {
    const modalRef = this.modalService.open(UserFormComponent, {
      title: user ? 'Edit User' : 'Create New User',
      data: { user },
    });

    modalRef.subscribe((formData) => {
      if (formData) {
        if (user) {
          // This is where we would dispatch an "Update User" action
          console.log('Updating user:', { ...user, ...formData });
        } else {
          // This is where we would dispatch a "Create User" action
          console.log('Creating user:', formData);
        }
      }
    });
  }

  // Methods for actions (we'll wire these up later)
  editUser(user: User) {
    console.log('Editing user:', user);
  }

  deleteUser(user: User) {
    console.log('Deleting user:', user);
  }
}
