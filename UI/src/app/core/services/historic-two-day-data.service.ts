import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class HistoricTwoDayDataService {

  private readonly apiUrl = 'http://localhost:3000/api/two-days-historic-data';

  constructor(private http: HttpClient) {}

  /** Fetch 2-day historic NIFTY data */
  getTwoDayHistoricData(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}
