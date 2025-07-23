import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { PermissionGroup } from '../models/permission.model';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrls.permissions;

  constructor() { }

  getPermissions() : Observable<PermissionGroup[]> {
    return this.http.get<PermissionGroup[]>(this.apiUrl);
  }
}
