import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
		return this.http.get<AdrData>(this.apiUrl);
	}
}