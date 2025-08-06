import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class WatchlistService {

	private apiUrl = 'http://localhost:5000/api/user-watchlists';

	constructor(private http: HttpClient) { }

	getWatchlist(): Observable<any> {
		const token = localStorage.getItem('authToken'); // Retrieve the auth token from localStorage
		if (!token) {
			console.error('Authentication token is missing!');
			throw new Error('Authentication token is missing!');
		}

		const headers = new HttpHeaders({
			Authorization: `Bearer ${token}`, // Set the Bearer token in the headers
		});

		return this.http.get<any>(this.apiUrl, { headers });
	}
}