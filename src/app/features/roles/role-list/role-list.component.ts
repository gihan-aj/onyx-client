import { AfterViewInit, Component, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectAllRoles } from '../store/roles.reducer';

@Component({
  selector: 'app-role-list',
  imports: [],
  templateUrl: './role-list.component.html',
  styleUrl: './role-list.component.scss'
})
export class RoleListComponent implements OnInit, AfterViewInit{
  private store = inject(Store);

  @ViewChild('actionTpl', { static: true }) actionTpl!: TemplateRef<any>;

  roles$ = this.store.select(selectAllRoles);
  
  ngAfterViewInit(): void {
    throw new Error('Method not implemented.');
  }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

}
