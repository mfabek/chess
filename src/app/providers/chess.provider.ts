import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class ChessProvider {
  private url = 'http://localhost:8080/chess/';

  constructor(private http: HttpClient) {
  }

  public join(name: string): Observable<any> {
    return this.http.post(this.url + 'join', name);
  }
}
