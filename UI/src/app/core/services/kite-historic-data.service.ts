import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class KiteHistoricDataService {

  private readonly apiUrl = 'http://localhost:3000/api/kite-historic-data';

  constructor(private http: HttpClient) {}

  /** Fetch NIFTY historic data */
  getNiftyHistoricData(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}
