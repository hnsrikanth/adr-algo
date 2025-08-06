import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthenticationService } from '../services/auth.service';

@Injectable({
	providedIn: 'root',
})
export class AdminGuard implements CanActivate {
	constructor(private authService: AuthenticationService, private router: Router) { }

	canActivate(): boolean {
		const username = this.authService.getUsername();
		if (username === 'admin') {
			return true; // Allow access
		}
		this.router.navigate(['/pages/dashboard']); // Redirect if not admin
		return false;
	}
}
