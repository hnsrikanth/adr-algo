import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface AdrData {
	date: string;
	market_open: number;
	adr_high: number;
	adr_low: number;
	adr_range: number;
	positive_0_25: number;
	positive_0_50: number;
	positive_0_75: number;
	positive_1_00: number;
	nagative_0_25: number;
	nagative_0_50: number;
	nagative_0_75: number;
	nagative_1_00: number;
}

@Injectable({
	providedIn: 'root'
})

export class AdrService {
	private apiUrl = 'http://localhost:3000/api/adr';

	constructor(private http: HttpClient) { }

	getAdrData(): Observable<AdrData> {
		const today = new Date().toISOString().slice(0, 10);
		const cached = localStorage.getItem('adrData');

		if (cached) {
			const parsed: AdrData = JSON.parse(cached);
			if (parsed.date === today) {
				// ✅ Already have today's ADR → return cached observable
				return of(parsed);
			}
		}

		// ✅ Otherwise fetch from API and cache it
		return this.http.get<AdrData>(this.apiUrl).pipe(
			tap((data) => {
				localStorage.setItem('adrData', JSON.stringify(data));
			})
		);
	}
}
