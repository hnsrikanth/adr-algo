import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class StrategyService {
  private apiUrl = 'http://localhost:3000/api/strategy';

  constructor(private http: HttpClient) {}

  getStrategy(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  addStrategy(strategy: any) {
    return this.http.post('http://localhost:3000/api/strategy', strategy);
  }

}
