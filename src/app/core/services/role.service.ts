import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { PagedList } from '../models/paged-list.model';
import { Role } from '../models/role.model';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrls.roles;

  constructor() {}

  getRoles(
    page: number,
    pageSize: number,
    searchTerm?: string
  ): Observable<PagedList<Role>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (searchTerm) {
      params.set('searchTerm', searchTerm);
    }

    return this.http.get<PagedList<Role>>(this.apiUrl, { params });
  }

  createRole(role: { name: string; permissions: string[] }): Observable<void> {
    return this.http.post<void>(this.apiUrl, role);
  }

  updateRole(
    id: number,
    role: { name: string; permissions: string[] }
  ): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, role);
  }

  deleteRole(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
