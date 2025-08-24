import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StrategyService } from '../../core/services/strategy.service';
import { HttpClient } from '@angular/common/http';

@Component({
	selector: 'app-settings',
	standalone: true,
	imports: [FormsModule, CommonModule],
	templateUrl: './settings.component.html',
	styleUrl: './settings.component.scss'
})
export class SettingsComponent implements OnInit {

	strategyData: any = {};

	showMarketProtection = false; // default hidden

	bearTrades: any[] = [];
	bullTrades: any[] = [];

	readonly step = 75;
	readonly max = 1800;

	// Bear trades
	strategyBearTradesMain: any = {};
	strategyBearTradesHedge: any = {};

	// Bull trades
	strategyBullTradesMain: any = {};
	strategyBullTradesHedge: any = {};

	constructor(private strategyService: StrategyService) { }

	ngOnInit(): void {
		this.loadStrategy();

		// Initialize with existing trades if required
		this.bullTrades = [
			{
				name: 'Trade 1',
				mainPosition: { "Buy/Sell": "Buy", Strike: "", Qty: 75, "CE/PE": "CE", Expiry: "" },
				hedgePosition: { "Buy/Sell": "Sell", Strike: "", Qty: 75, "CE/PE": "PE", Expiry: "" }
			}
		];

		this.bearTrades = [
			{
				name: 'Trade 1',
				mainPosition: { "Buy/Sell": "Buy", Strike: "", Qty: 75, "CE/PE": "CE", Expiry: "" },
				hedgePosition: { "Buy/Sell": "Sell", Strike: "", Qty: 75, "CE/PE": "PE", Expiry: "" }
			}
		];
	}

	onOrderTypeChange(event: Event) {
		const value = (event.target as HTMLInputElement).value;
		this.showMarketProtection = (value === 'Market Protection');
	}

	// -----------------------
	// Bear Trades
	// -----------------------
	addBearTrade() {
		const index = this.bearTrades.length + 1;
		this.bearTrades.push({
			name: `Trade ${index}`,
			mainPosition: { "Buy/Sell": "Buy", Strike: "", Qty: 75, "CE/PE": "CE", Expiry: "" },
			hedgePosition: { "Buy/Sell": "Sell", Strike: "", Qty: 75, "CE/PE": "PE", Expiry: "" }
		});
	}

	removeBearTrade(i: number) {
		this.bearTrades.splice(i, 1);
		this.renameTrades(this.bearTrades);
	}

	// -----------------------
	// Bull Trades
	// -----------------------
	addBullTrade() {
		const index = this.bullTrades.length + 1;
		this.bullTrades.push({
			name: `Trade ${index}`,
			mainPosition: { "Buy/Sell": "Buy", Strike: "", Qty: 75, "CE/PE": "CE", Expiry: "" },
			hedgePosition: { "Buy/Sell": "Sell", Strike: "", Qty: 75, "CE/PE": "PE", Expiry: "" }
		});
	}

	removeBullTrade(i: number) {
		this.bullTrades.splice(i, 1);
		this.renameTrades(this.bullTrades);
	}

	// -----------------------
	// Helpers for dynamic Qty/toggles
	// -----------------------
	increaseQty(position: any) {
		if (position['Qty'] + this.step <= this.max) {
			position['Qty'] += this.step;
		}
	}

	decreaseQty(position: any) {
		if (position['Qty'] > this.step) {
			position['Qty'] -= this.step;
		}
	}

	toggleBuySell(position: any) {
		position['Buy/Sell'] = position['Buy/Sell'] === 'Buy' ? 'Sell' : 'Buy';
	}

	toggleCEPE(position: any) {
		position['CE/PE'] = position['CE/PE'] === 'CE' ? 'PE' : 'CE';
	}

	// Add strategy
	onAddStrategy() {
		const payload = {
			name: 'DefaultSession',
			data: {
				globalSettings: this.strategyData,
				strategies: {
					BearCallSpread: this.bearTrades.reduce((acc, trade, idx) => {
						acc[`trade${idx + 1}`] = {
							mainPosition: trade.mainPosition,
							hedgePosition: trade.hedgePosition
						};
						return acc;
					}, {} as any),
					BullPutSpread: this.bullTrades.reduce((acc, trade, idx) => {
						acc[`trade${idx + 1}`] = {
							mainPosition: trade.mainPosition,
							hedgePosition: trade.hedgePosition
						};
						return acc;
					}, {} as any)
				}
			}
		};

		this.strategyService.addStrategy(payload).subscribe({
			next: (res) => {
				console.log('Strategy saved:', res);
				alert('Strategy saved successfully!');
			},
			error: (err) => {
				console.error('Error saving strategy:', err);
				alert('Error saving strategy!');
			}
		});
	}

	loadStrategy() {
		this.strategyService.getStrategy().subscribe({
			next: (res) => {
				if (res && res.length > 0) {
					const session = res[0];
					this.strategyData = session.data.globalSettings;

					// Load dynamic Bear trades
					this.bearTrades = Object.keys(session.data.strategies.BearCallSpread).map((k, idx) => ({
						name: `Trade ${idx + 1}`,
						mainPosition: session.data.strategies.BearCallSpread[k].mainPosition,
						hedgePosition: session.data.strategies.BearCallSpread[k].hedgePosition
					}));

					// Load dynamic Bull trades
					this.bullTrades = Object.keys(session.data.strategies.BullPutSpread).map((k, idx) => ({
						name: `Trade ${idx + 1}`,
						mainPosition: session.data.strategies.BullPutSpread[k].mainPosition,
						hedgePosition: session.data.strategies.BullPutSpread[k].hedgePosition
					}));
				}
			},
			error: (err) => console.error('Error fetching strategy:', err)
		});
	}

	private renameTrades(trades: any[]) {
		trades.forEach((t, idx) => (t.name = `Trade ${idx + 1}`));
	}
}
