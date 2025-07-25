import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Role } from '../../../../core/models/role.model';
import {
  selectPermissionGroups,
  selectPermissionsLoading,
} from '../../../permissions/store/permissions.reducer';
import { PermissionsActions } from '../../../permissions/store/permissions.actions';
import { CommonModule } from '@angular/common';
import { FormFieldComponent } from '../../../../shared/components/form-field/form-field.component';
import { CustomInputComponent } from '../../../../shared/components/custom-input/custom-input.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { PermissionTreeComponent } from '../permission-tree/permission-tree.component';

@Component({
  selector: 'app-role-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormFieldComponent,
    CustomInputComponent,
    ButtonComponent,
    PermissionTreeComponent,
  ],
  templateUrl: './role-form.component.html',
  styleUrl: './role-form.component.scss',
})
export class RoleFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private store = inject(Store);

  @Input() data?: { role: Role };
  @Output() close = new EventEmitter<any>();

  roleForm = this.fb.group({
    name: ['', Validators.required],
    permissions: [[] as string[], Validators.required],
  });

  isEditMode = false;
  permissionGroups$ = this.store.select(selectPermissionGroups);
  permissionsLoading$ = this.store.select(selectPermissionsLoading);

  ngOnInit(): void {
    // Dispatch action to load permissions if they are not already loaded.
    this.store.dispatch(PermissionsActions.loadPermsiions());

    if (this.data?.role) {
      this.isEditMode = true;
      this.roleForm.patchValue(this.data.role);
    }
  }

  onSave() {
    if (this.roleForm.valid) {
      this.close.emit(this.roleForm.value);
    }
  }

  onCancel() {
    this.close.emit(null);
  }
}
