import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { PagedList } from '../models/paged-list.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrls.users;

  constructor() {}

  getUsers(
    page: number,
    pageSize: number,
    searchTerm: string | null = null
  ): Observable<PagedList<User>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (searchTerm) {
      params = params.set('searchTerm', searchTerm);
    }

    return this.http.get<PagedList<User>>(this.apiUrl, { params });
  }
}
