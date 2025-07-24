import { CommonModule } from '@angular/common';
import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { PermissionGroup } from '../../../../core/models/permission.model';

@Component({
  selector: 'app-permission-tree',
  imports: [CommonModule],
  templateUrl: './permission-tree.component.html',
  styleUrl: './permission-tree.component.scss',
  providers:[
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PermissionTreeComponent),
      multi: true
    }
  ]
})
export class PermissionTreeComponent implements ControlValueAccessor{
  @Input() permissionGroups: PermissionGroup[] = [];

  selectedPermissions = new Set<string>();
  isDisabled = false;

  onChange = (value: string[]) => {};
  onTouched = () => {};

  writeValue(value: string[]): void {
    this.selectedPermissions = new Set(value || []);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  onPermissionChange(permissionName: string, checked: boolean){
    if(checked){
      this.selectedPermissions.add(permissionName)
    }else {
      this.selectedPermissions.delete(permissionName);
    }

    this.onTouched();
    this.onChange(Array.from(this.selectedPermissions));
  }

  onGroupChange(group: PermissionGroup, checked: boolean){
    const groupPermissionNames = group.permissions.map(p => p.name);
    if(checked){
      groupPermissionNames.forEach(name => this.selectedPermissions.add(name));
    }else{
      groupPermissionNames.forEach(name => this.selectedPermissions.delete(name));
    }

    this.onTouched();
    this.onChange(Array.from(this.selectedPermissions));
  }

  // Helper to determine if a group's 'select all' checkbox should be checked
  isGroupSelected(group: PermissionGroup): boolean {
    return group.permissions.every(p => this.selectedPermissions.has(p.name));
  }

  // Helper to determine if a group's 'select all' checkbox should be indeterminate
  isGroupIndeterminate(group: PermissionGroup): boolean {
    const hasSelected = group.permissions.some(p => this.selectedPermissions.has(p.name));
    return hasSelected && !this.isGroupSelected(group);
  }
}
