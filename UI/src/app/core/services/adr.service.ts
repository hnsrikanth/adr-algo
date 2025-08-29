import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface AdrData {
  refreshDate: string;
  marketOpen: number;
  adrHigh: number;
  adrLow: number;
  adrRange: number;
  adrPlus_25: number;
  adrPlus_50: number;
  adrPlus_75: number;
  adrPlus_1: number;
  adrMinus_25: number;
  adrMinus_50: number;
  adrMinus_75: number;
  adrMinus_1: number;
}

@Injectable({
  providedIn: 'root'
})
export class AdrService {
  private apiUrl = 'http://localhost:3000/api/adr';

  constructor(private http: HttpClient) { }

  getAdrData(): Observable<AdrData> {
    return this.http.get<any>(this.apiUrl).pipe(
      map((data) => ({
        refreshDate: data.date,
        marketOpen: data.market_open,
        adrHigh: data.adr_high,
        adrLow: data.adr_low,
        adrRange: data.adr_range,
        adrPlus_25: data.positive_0_25,
        adrPlus_50: data.positive_0_50,
        adrPlus_75: data.positive_0_75,
        adrPlus_1: data.positive_1_00,
        adrMinus_25: data.nagative_0_25,
        adrMinus_50: data.nagative_0_50,
        adrMinus_75: data.nagative_0_75,
        adrMinus_1: data.nagative_1_00
      }))
    );
  }
}
