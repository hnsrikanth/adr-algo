import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'app-admin',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './admin.component.html',
	styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit {
	isLoading: boolean = false;
	successMessage: string | null = null;
	errorMessage: string | null = null;

	constructor(private http: HttpClient) { }

	ngOnInit() {
		this.checkKiteCallback();
	}

	loginToKiteAccount() {
		// Redirect to Kite login page through backend API
		window.location.href = 'http://localhost:3000/api/login';
	}

	checkKiteCallback() {
		const urlParams = new URLSearchParams(window.location.search);
		const action = urlParams.get('action');
		const type = urlParams.get('type');
		const status = urlParams.get('status');
		const requestToken = urlParams.get('request_token');

		if (action === 'login' && type === 'login' && status === 'success' && requestToken) {
			const broker = 'Zerodha'; // Adjust this value as needed
			this.isLoading = true;
			this.successMessage = null;
			this.errorMessage = null;

			// Call the API to generate the access token
			this.http
				.post('http://localhost:3000/api/master-broker-tokens', {
					broker,
					requestToken,
				})
				.subscribe({
					next: (response: any) => {
						this.isLoading = false;
						this.successMessage = 'Access token generated successfully!';
						console.log(response);
					},
					error: (error) => {
						this.isLoading = false;
						this.errorMessage = 'Error generating access token. Please try again.';
						console.error('Error generating session or storing access token', error);
					},
				});
		}
	}
}