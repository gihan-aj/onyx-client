import { AfterViewInit, Component, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  selectAllRoles,
  selectRolesLoading,
  selectRolesState,
} from '../store/roles.reducer';
import { map } from 'rxjs';
import {
  DataTableComponent,
  TableColumn,
} from '../../../shared/components/data-table/data-table.component';
import { Role } from '../../../core/models/role.model';
import { RolesActions } from '../store/roles.actions';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { ModalService } from '../../../shared/services/modal.service';
import { RoleFormComponent } from '../components/role-form/role-form.component';

@Component({
  selector: 'app-role-list',
  imports: [
    CommonModule,
    DataTableComponent,
    PaginationComponent,
    ButtonComponent,
  ],
  templateUrl: './role-list.component.html',
  styleUrl: './role-list.component.scss',
})
export class RoleListComponent implements OnInit, AfterViewInit {
  private store = inject(Store);
  private modalService = inject(ModalService);

  @ViewChild('actionsTpl', { static: true }) actionsTpl!: TemplateRef<any>;

  roles$ = this.store.select(selectAllRoles);
  isLoading$ = this.store.select(selectRolesLoading);
  paginationData$ = this.store.select(selectRolesState).pipe(
    map((state) => ({
      currentPage: state.currentPage,
      pageSize: state.pageSize,
      totalCount: state.totalCount,
    }))
  );

  columns: TableColumn<Role>[] = [];

  ngAfterViewInit(): void {
    this.loadRoles(1);
  }
  ngOnInit(): void {
    setTimeout(() => {
      this.columns = [
        { key: 'name', title: 'Role Name' },
        { key: 'isDefault', title: 'Default' },
        { key: 'actions', title: 'Actions', customTpl: this.actionsTpl },
      ];
    });
  }

  loadRoles(page: number) {
    this.store.dispatch(RolesActions.loadRoles({ page, pageSize: 10 }));
  }

  onPageChange(page: number) {
    this.loadRoles(page);
  }

  openRoleForm(role?: Role) {
    const modalRef = this.modalService.open(RoleFormComponent, {
      title: role ? 'Edit Role' : 'Create New Role',
      data: { role },
    });

    modalRef.subscribe((formData) => {
      if (formData) {
        if (role) {
          this.store.dispatch(
            RolesActions.updateRole({ id: role.id, ...formData })
          );
        } else {
          this.store.dispatch(RolesActions.createRole(formData));
        }
      }
    });
  }

  deleteRole(role: Role) {
    console.log('Deleting role:', role);
  }
}
