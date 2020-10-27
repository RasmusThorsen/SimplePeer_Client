import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  _baseUrl = 'http://localhost:4000'

  constructor(private http: HttpClient) { }

  createRoom(name: string) {
    return this.http.post(`${this._baseUrl}/createroom`, {
      roomName: name
    });
  }
}
