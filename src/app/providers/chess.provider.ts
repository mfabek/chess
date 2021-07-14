import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {MovePieceCommand} from '../model/command/MovePieceCommand';

@Injectable({providedIn: 'root'})
export class ChessProvider {
  public name: string;
  public onePlayer = false; // if there is only one player in room
  public type: string; // what player are you, black or white
  private url = 'http://localhost:8080/chess/';

  constructor(private http: HttpClient) {
  }

  public join(name: string): Observable<any> {
    return this.http.post(this.url + 'join', name);
  }

  public getCount(name: string): Observable<any> {
    return this.http.post(this.url + 'getCount', name);
  }

  public getBoard(name: string): Observable<any> {
    return this.http.post(this.url + 'getBoard', name, {responseType: 'text'});
  }

  public boardChanged(command: MovePieceCommand): Observable<any> {
    return this.http.post(this.url + 'boardChanged', command);
  }

  public reset(name: string): Observable<any> {
    return this.http.post(this.url + 'reset', name);
  }

  public getAllMoves(name: string): Observable<any> {
    return this.http.post(this.url + 'getAllMoves', name);
  }
}
