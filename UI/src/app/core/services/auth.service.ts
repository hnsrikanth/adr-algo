import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { User } from '../models/auth.models';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { tap } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })

/**
 * Auth-service Component
 */
export class AuthenticationService {

    user!: User;
    currentUserValue: any;

    private apiUrl = 'http://localhost:5000/api/signin';
    private authStatus = new BehaviorSubject<boolean>(this.hasToken());

    constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: any) {}

    private hasToken(): boolean {
		if (isPlatformBrowser(this.platformId)) {
			return !!localStorage.getItem('authToken');
		}
		return false;
	}

	// Observable to track login status
	getAuthStatus(): Observable<boolean> {
		return this.authStatus.asObservable();
	}

	getUsername(): string | null {
		if (isPlatformBrowser(this.platformId)) {
			return localStorage.getItem('username');
		}
		return null;
	}	

	isLoggedIn(): boolean {
		if (isPlatformBrowser(this.platformId)) {
			// Only check localStorage if running in the browser
			return !!localStorage.getItem('authToken');
		}
		return false;
	}

	signIn(credentials: { username: string; password: string }): Observable<any> {
		return this.http.post<any>(this.apiUrl, credentials).pipe(
			tap((response: any) => {
				if (isPlatformBrowser(this.platformId)) {
					localStorage.setItem('authToken', response.token); // Store token
					localStorage.setItem('username', response.username); // Store username
					this.authStatus.next(true); // Notify subscribers of login
				}
			})
		);
	}

    logout(): void {
		if (isPlatformBrowser(this.platformId)) {
			localStorage.removeItem('authToken');
			localStorage.removeItem('username');
			this.authStatus.next(false); // Notify subscribers of logout
		}
	}
}