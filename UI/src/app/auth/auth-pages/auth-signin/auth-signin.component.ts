import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from '../../../core/services/auth.service';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
	selector: 'app-auth-signin',
	standalone: true,
	imports: [FormsModule, ReactiveFormsModule, HttpClientModule, CommonModule, NgbCarouselModule, RouterModule],
	templateUrl: './auth-signin.component.html',
	styleUrl: './auth-signin.component.scss'
})
export class AuthSigninComponent {
	loginForm: FormGroup;
	errorMessage: string = '';

	constructor(
		private fb: FormBuilder,
		private authService: AuthenticationService,
		private router: Router
	) {
		this.loginForm = this.fb.group({
			username: ['', Validators.required],
			password: ['', Validators.required]
		});
	}

	onSubmit(): void {
		if (this.loginForm.valid) {
			this.authService.signIn(this.loginForm.value).subscribe(
				(response: any) => {
					// console.log('Login successful', response);
					localStorage.setItem('authToken', response.token); // Store token
					localStorage.setItem('username', response.username); // Store username
					this.router.navigate(['/pages/dashboard']);
				},
				error => {
					console.error('Login failed', error);
					this.errorMessage = 'Invalid username or password';
				}
			);
		}
	}

	testimonials = [
		{
			title: '“I feel confident imposing on myself”',
			content:
				'Vestibulum auctor orci in risus iaculis consequat suscipit felis rutrum aliquet iaculis augue sed tempus In elementum ullamcorper lectus vitae pretium Nullam ultricies diam eu ultrices sagittis.',
		},
		{
			title: '“Our task must be to free widening circle”',
			content:
				'Curabitur eget nulla eget augue dignissim condintum Nunc imperdiet ligula porttitor commodo elementum Vivamus justo risus fringilla suscipit faucibus orci luctus ultrices posuere cubilia curae ultricies cursus.',
		},
		{
			title: '“I\'ve learned that people forget what you”',
			content:
				'Pellentesque lacinia scelerisque arcu in aliquam augue molestie rutrum Fusce dignissim dolor id auctor accumsan vehicula dolor vivamus feugiat odio erat sed  quis Donec nec scelerisque magna',
		},
	];

}
