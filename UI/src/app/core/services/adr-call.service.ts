import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AdrCallService {

  private readonly baseUrl = 'http://localhost:3000/api/adr';

  constructor(private http: HttpClient) {}

  /** Start Bear Call Spread */
  startBearCall(): Observable<any> {
    return this.http.post(`${this.baseUrl}/start`, { strategy: 'BearCallSpread' });
  }

  /** Start Bull Put Spread */
  startBullPut(): Observable<any> {
    return this.http.post(`${this.baseUrl}/start`, { strategy: 'BullPutSpread' });
  }

  /** Exit All Trades */
  exitAllTrades(): Observable<any> {
    return this.http.post(`${this.baseUrl}/exitAll`, {});
  }
}
