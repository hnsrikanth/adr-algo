import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
	selector: 'app-auth-signup',
	standalone: true,
	imports: [RouterModule, NgbCarouselModule, CommonModule, ReactiveFormsModule],
	templateUrl: './auth-signup.component.html',
	styleUrl: './auth-signup.component.scss'
})
export class AuthSignupComponent {
	registerUser: FormGroup;

	constructor(private http: HttpClient, private fb: FormBuilder) {
		this.registerUser = this.fb.group({			
			FName: ['', Validators.required],
			LName: ['', Validators.required],
			Phone: ['', Validators.required],
			Email: ['', Validators.required],
			Address: ['', Validators.required],
			GST: ['', Validators.required],
			Gender: ['', Validators.required],
		});
	}

	onSubmit(): void {
		if (this.registerUser.valid) {
			const UserInfoData = this.registerUser.value;

			this.http
				.post('http://localhost:5000/api/register', UserInfoData)
				.subscribe({
					next: () => {
						alert('New User added successfully!');
						window.location.reload()
					},
					error: (error) => {
						console.error('Error adding User:', error);
						alert('Failed to add User.');
					},
				});
		} else {
			alert('Please fill all required fields!');
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
