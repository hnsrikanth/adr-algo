import { CommonModule, DecimalPipe } from '@angular/common';
import { Component, QueryList, ViewChildren } from '@angular/core';
import { FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { Observable, BehaviorSubject } from 'rxjs';
import { NgbdGridJsSortableHeader } from '../../shared/gridjs-table-data/gridjs-sortable.directive';
import { GridJsService } from '../../shared/gridjs-table-data/gridjs.service';
import { PageTitleComponent } from '../../shared/page-title/page-title.component';
import { HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ChangeDetectorRef } from '@angular/core';

interface Symbol {
	id: number;
	symbol: string;
	token: number;
	name: string;
}

interface UserStrategySymbols {
	id: number;
	userId: number;
	strategyId: number;
	symbolToken: string;
}

export interface UserStrategyWithSymbols {
	userStrategyId: number;
	userId: number;
	strategyId: number;
	strategyName: string;
	strategyImage: string;
	symbols: {
		userStrategySymbolId: number;
		userStrategySymbolToken: string;
		symbolId: number;
		symbolName: string;
		symbolCode: string;
		token: string;
	}[];
}

@Component({
	selector: 'app-user-strategy',
	standalone: true,
	imports: [
		PaginationModule,
		FormsModule,
		CommonModule,
		PageTitleComponent,
		ReactiveFormsModule,
		NgSelectModule
	],
	templateUrl: './user-strategy.component.html',
	styleUrl: './user-strategy.component.scss',
	providers: [GridJsService, DecimalPipe]
})

export class UserStrategyComponent {
	// bread crumb items
	breadCrumbItems!: Array<{}>;

	totalSearch$: Observable<number>;
	@ViewChildren(NgbdGridJsSortableHeader) headers!: QueryList<NgbdGridJsSortableHeader>;

	userStrategies: UserStrategyWithSymbols[] = [];
	userStrategySymbols: UserStrategySymbols[] = [];
	strategies: any[] = [];
	userStrategyForm: FormGroup;
	groupedUserStrategies: any[] = [];
	isEditMode: boolean = false;
	editingStrategyId!: number;

	addUserStrategySymbolForm: FormGroup;
	symbols: any[] = [];
	selectedSymbols: any[] = [];
	dynamicTitle: string = '';
	selectedStrategyId: number | null = null;

	patterns = [
		{ name: 'RHS', image: 'assets/images/Square/RHS_Square.png' },
		{ name: 'HS', image: 'assets/images/Square/HS_Square.png' },
		{ name: 'Double Top', image: 'assets/images/Square/DT_Square.png' },
		{ name: 'Support', image: 'assets/images/Square/Support_Square.png' },
		{ name: 'Double Bottom', image: 'assets/images/Square/DB_Square.png' },
		{ name: 'Resistance', image: 'assets/images/Square/Resistance_Square.png' },
	];

	constructor(
		public serviceTest: GridJsService,
		private http: HttpClient,
		private modalService: NgbModal,
		private fb: FormBuilder,
		private cdr: ChangeDetectorRef
	) {
		this.totalSearch$ = serviceTest.total$;

		this.userStrategyForm = this.fb.group({
			strategyId: ['', Validators.required],
		});

		this.addUserStrategySymbolForm = this.fb.group({
			// strategyId: ['', Validators.required],
			symbols: ['', Validators.required],
		});
	}

	ngOnInit(): void {
		this.loadStrategies();
		this.fetchUserStrategies();
		this.loadSymbols();
	}

	loadStrategies(): void {
		const token = localStorage.getItem('authToken');
		const headers = { Authorization: `Bearer ${token}` };

		this.http.get('http://localhost:5000/api/strategies', { headers }).subscribe({
			next: (response: any) => {
				this.strategies = response;
			},
			error: (error) => {
				console.error('Error fetching strategies:', error);
			},
		});
	}

	fetchUserStrategies(): void {
		const token = localStorage.getItem('authToken');
		if (!token) {
			alert('Authentication token is missing!');
			return;
		}

		const headers = { Authorization: `Bearer ${token}` };

		this.http
			.get<UserStrategyWithSymbols[]>('http://localhost:5000/api/user-strategies-with-symbols', { headers })
			.subscribe({
				next: (response) => {
					// Map API response directly to the interface
					this.userStrategies = response.map(strategy => ({
						userStrategyId: strategy.userStrategyId,
						userId: strategy.userId,
						strategyId: strategy.strategyId,
						strategyName: strategy.strategyName,
						strategyImage: strategy.strategyImage,
						symbols: strategy.symbols.map(symbol => ({
							userStrategySymbolId: symbol.userStrategySymbolId,
							userStrategySymbolToken: symbol.userStrategySymbolToken,
							symbolId: symbol.symbolId,
							symbolName: symbol.symbolName,
							symbolCode: symbol.symbolCode,
							token: symbol.token,
						})),
					}));
				},
				error: (error) => {
					console.error('Error fetching User Strategies with Symbols:', error);
					alert('Failed to fetch User Strategies with Symbols.');
				},
			});
	}


	getStrategyName(strategyId: number): string {
		const strategy = this.strategies.find((s) => s.id === strategyId);
		return strategy ? strategy.name : 'Unknown Strategy';
	}

	// Modal Open Function for Add or Edit
	openModal(content: any, userStrategyId?: number) {
		console.log('User Strategy ID:', userStrategyId);

		// Fetch the user strategy details based on the userStrategyId
		const userStrategy = this.userStrategies.find((us) => us.strategyId === userStrategyId);

		console.log("UserStrategy ", userStrategy);

		if (userStrategy) {
			const strategyId = userStrategy.strategyId; // Extract the strategyId
			console.log('Strategy ID:', strategyId);

			this.selectedStrategyId = strategyId;

			// Find the strategy details based on strategyId
			const selectedStrategy = this.strategies.find((s) => s.id === strategyId);

			if (selectedStrategy) {
				this.dynamicTitle = selectedStrategy.name; // Set the dynamic title
			} else {
				this.dynamicTitle = 'Add Symbols to strategy'; // Fallback title
				console.warn('No strategy found for ID:', strategyId);
			}
		} else {
			this.dynamicTitle = 'Add Symbols to strategy'; // Fallback title
			console.warn('No user strategy found for ID:', userStrategyId);
		}

		// Load other required data
		this.loadStrategies();
		this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
	}

	loadUserStrategyDetails(strategyId: number): void {
		const token = localStorage.getItem('authToken');
		const headers = { Authorization: `Bearer ${token}` };

		this.http
			.get(`http://localhost:5000/api/user-strategy/${strategyId}`, { headers })
			.subscribe({
				next: (response: any) => {
					this.userStrategyForm.patchValue({
						strategyId: response.strategyId,
					});
				},
				error: (error) => {
					console.error('Error fetching user strategy details:', error);
					alert('Failed to load user strategy details.');
				},
			});
	}

	onSubmit(): void {
		if (this.userStrategyForm.valid) {
			const formData = this.userStrategyForm.value;
			const token = localStorage.getItem('authToken');

			if (!token) {
				alert('Authentication token is missing!');
				return;
			}

			const headers = { Authorization: `Bearer ${token}` };
			// Add logic
			this.http
				.post('http://localhost:5000/api/user-strategy', formData, { headers })
				.subscribe({
					next: () => {
						alert('User Strategy added successfully!');
						this.userStrategyForm.reset(); // Reset form
						window.location.reload();
					},
					error: (error) => {
						if (error.status === 400 && error.error.message === 'Strategy with this name already exists!') {
							alert('This strategy name is already in use!');
						} else {
							alert('Failed to create strategy. Please try again.');
						}
					},
				});
		} else {
			alert('Please fill all required fields!');
		}
	}

	loadSymbols(): void {
		const token = localStorage.getItem('authToken');
		if (!token) {
			alert('Authentication token is missing!');
			return;
		}

		const headers = { Authorization: `Bearer ${token}` };
		this.http.get('http://localhost:5000/api/symbols', { headers }).subscribe({
			next: (response: any) => {
				// Assuming response is an array of objects with `id` and `name`
				this.symbols = response.map((symbol: any) => ({
					id: symbol.id,
					name: symbol.name,
				}));
			},
			error: (error) => {
				console.error('Error fetching symbols:', error);
				alert('Failed to load symbols.');
			},
		});
	}

	onStrategyChange(selectedId: string): void {
		const strategyId = parseInt(selectedId, 10);
		this.addUserStrategySymbolForm.patchValue({ strategyId });
	}

	// Add New User Strategy Symbol
	onUserStrategySymbolSubmit(): void {
		if (this.addUserStrategySymbolForm.valid) {
			const formData = this.addUserStrategySymbolForm.value;

			// Prepare the request body
			const requestBody = {
				strategyId: this.selectedStrategyId, // Ensure this is correctly passed from form
				symbolTokens: formData.symbols, // The selected symbol tokens
			};

			const token = localStorage.getItem('authToken');
			if (!token) {
				alert('Authentication token is missing!');
				return;
			}

			const headers = { Authorization: `Bearer ${token}` };

			this.http
				.post('http://localhost:5000/api/user-strategy-symbol', requestBody, { headers })
				.subscribe({
					next: () => {
						alert('User Strategy Symbol added successfully!');
						window.location.reload();
					},
					error: (error) => {
						if (error.status === 400 && error.error.message === 'symbols already exist.') {
							alert('Failed to add symbol.');
						} else {
							alert('Symbols are already added.');
						}
					},
				});
		} else {
			alert('Please fill all required fields!');
		}
	}

	// Method to get symbols for a given strategyId
	getSymbolsForStrategy(strategyId: number): string {
		const strategy = this.strategies.find(s => s.id === strategyId);
		if (strategy) {
			return strategy.symbols.map((symbol: Symbol) => symbol.symbol).join(', '); // Join multiple symbol names
		}
		return ''; // Return an empty string if no symbols are found
	}

	deleteUserStrategy(userStrategyId: number): void {
		const token = localStorage.getItem('authToken');
		if (!token) {
			alert('Authentication token is missing!');
			return;
		}

		const headers = { Authorization: `Bearer ${token}` };

		this.http.delete(`http://localhost:5000/api/user-strategy/${userStrategyId}`, { headers }).subscribe({
			next: () => {
				this.userStrategies = this.userStrategies.filter(
					userStrategy => userStrategy.userStrategyId !== userStrategyId
				);
				alert('User Strategy deleted successfully!');
			},
			error: (error) => {
				console.error('Error deleting user strategy:', error);
				alert('Failed to delete user strategy.');
			}
		});
	}

	deleteUserStrategySymbol(userStrategySymbolId: number): void {
		const token = localStorage.getItem('authToken');
		if (!token) {
			alert('Authentication token is missing!');
			return;
		}

		const headers = { Authorization: `Bearer ${token}` };

		this.http.delete(`http://localhost:5000/api/user-strategy-symbol/${userStrategySymbolId}`, { headers }).subscribe({
			next: () => {
				// Find and remove the deleted symbol from the groupedUserStrategies array
				this.groupedUserStrategies.forEach((strategy) => {
					strategy.symbolNames = strategy.symbolNames.filter(
						// (symbol) => symbol.id !== userStrategySymbolId
						(symbol: { id: number }) => symbol.id !== userStrategySymbolId
					);
					this.cdr.detectChanges();
				});
				alert('User Strategy Symbol deleted successfully!');
				window.location.reload();
			},
			error: (error) => {
				console.error('Error deleting User Strategy Symbol:', error);
				alert('Failed to delete User Strategy Symbol.');
			},
		});
	}
}