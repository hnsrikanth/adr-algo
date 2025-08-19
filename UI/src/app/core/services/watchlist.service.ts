import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class WatchlistService {

	private apiUrl = 'http://localhost:3000/api/user-watchlists';

	constructor(private http: HttpClient) { }

	getWatchlist(): Observable<any> {
		return this.http.get<any>(this.apiUrl);
	}
}
