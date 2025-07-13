import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-user-list',
  imports: [CommonModule, DataTableComponent, PaginationComponent],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
})
export class UserListComponent implements OnInit {
  private store = inject(Store);

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

  columns: TableColumn<User>[] = [
    { key: 'userCode', title: 'User Code' },
    { key: 'email', title: 'Email' },
    { key: 'firstName', title: 'First Name' },
    { key: 'lastName', title: 'Last Name' },
    { key: 'isActive', title: 'Status' }, // Custom template
    { key: 'actions', title: 'Actions' }, // Custom template
  ];

  ngOnInit(): void {
    this.loadUsers(1);
  }

  loadUsers(page: number): void {
    this.store.dispatch(
      UsersActions.loadUsers({ page, pageSize: 10, searchTerm: null })
    );
  }

  onPageChange(page: number): void {
    this.loadUsers(page);
  }
}
