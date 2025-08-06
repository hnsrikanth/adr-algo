import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { webSocket } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root'
})
export class TickService {

  constructor() { }

  private tickSocket = webSocket('ws://localhost:3000'); // WebSocket URL

	getTicks(): Observable<any> {
		return this.tickSocket.asObservable();
	}
}