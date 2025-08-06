import { Component, ViewChild, ElementRef, OnInit, ViewChildren, QueryList } from '@angular/core';
import { IChartApi } from 'lightweight-charts';
import { NgApexchartsModule } from 'ng-apexcharts';
import { CommonModule } from '@angular/common';
import { WatchlistService } from '../../../core/services/watchlist.service';
import { TickService } from '../../../core/services/tick.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule, FormGroup } from '@angular/forms';
import {
	ChartComponent,
	ApexAxisChartSeries,
	ApexChart,
	ApexXAxis,
	ApexYAxis,
	ApexTitleSubtitle,
	ApexTooltip,
	ApexMarkers,
	ApexDataLabels,
	ApexStroke,
	ApexPlotOptions
} from 'ng-apexcharts';

import { AccordionModule } from 'ngx-bootstrap/accordion';
import { CollapseModule } from 'ngx-bootstrap/collapse';

export type ChartOptions = {
	series: ApexAxisChartSeries;
	chart: ApexChart;
	xaxis: ApexXAxis;
	yaxis: ApexYAxis | ApexYAxis[]; // required, no `?`
	title: ApexTitleSubtitle;       // required
	tooltip: ApexTooltip;
	plotOptions: ApexPlotOptions;
	dataLabels: ApexDataLabels;
	stroke: ApexStroke;
	markers: any;
	annotations?: any; // <-- Add this line to allow annotations property
};

@Component({
	selector: 'app-dashboard',
	standalone: true,
	imports: [
		NgApexchartsModule,
		CommonModule,
		NgSelectModule,
		ReactiveFormsModule,
		FormsModule,
		AccordionModule,
		CollapseModule
	],
	templateUrl: './dashboard.component.html',
	styleUrl: './dashboard.component.scss'
})

export class DashboardComponent implements OnInit {

	@ViewChild("chart") chart!: ChartComponent;
	// bread crumb items
	breadCrumbItems!: Array<{}>;
	basicScatterChart: any;
	dateTimeScatterChart: any;
	public chartOptions!: ChartOptions;
	scatterChartData: any; // Placeholder for chart configuration

	// Ticks Data - Watchlist
	ticks: any[] = [];
	stocks: any[] = [];
	symbols: any[] = [];
	selectedSymbols: any[] = [];
	private apiUrl = 'http://localhost:5000/api/user-watchlist';

	// Accordion and Collapse with TradingView
	@ViewChildren('chartContainer') chartContainers!: QueryList<ElementRef>;
	candleCharts: IChartApi[] = []; // Array to hold each chart instance
	dPlusOpen: boolean[] = [];
	yAxisSymbols: string[] = [];
	xAxisTimes: string[] = [];
	openedIndices: number[] = [];
	maxOpenAccordions = 3; // Set how many accordions you want open at once
	patternsImage: { time: string; image: string; symbol: string; strategyName: string; accuracy: number }[] = [];
	chartOptionsList: ChartOptions[] = [];
	symbolHasEventsToday: Map<string, boolean> = new Map<string, boolean>();
	apexChartsRefs: { [symbol: string]: any } = {};

	// Helper function to check NaN
	isNaN(value: any): boolean {
		return Number.isNaN(value);
	}

	constructor(
		private watchlistService: WatchlistService,
		private tickService: TickService,
		private http: HttpClient,
	) { }

	ngOnInit(): void {
		// Fetch the watchlist
		this.watchlistService.getWatchlist().subscribe((watchlist) => {
			// Populate the stocks array
			this.stocks = watchlist.map((item: any) => ({
				id: item.id,
				name: item.name,
				symbol: item.symbol,
				instrumentToken: item.instrumentToken,
				price: NaN,
				change: NaN,
			}));
			// Now subscribe to live tick data
			this.tickService.getTicks().subscribe((ticks) => {
				this.updateStockPrices(ticks);
			});
		});

		this.loadSymbols();
		this.dPlusOpen = this.yAxisSymbols.map(() => false);
		// this.generateXAxisSlots();
		this.initializeChart();
	}

	updateStockPrices(ticks: any[]): void {
		ticks.forEach((tick) => {
			// Ensure the instrument tokens are of the same type for comparison
			const stock = this.stocks.find(
				(s) => String(s.instrumentToken) === String(tick.instrument_token)
			);

			if (stock) {
				console.log('binding stock:', stock);
				stock.price = tick.last_price || 'NA';
				stock.change = tick.change * 100 || 'NA'; // Convert to percentage if needed
			}
		});
	}

	// Method to delete a stock from the watchlist
	deleteUserWatchlist(stockId: number | undefined): void {
		if (!stockId) {
			alert('Invalid stock ID!');
			return;
		}

		const token = localStorage.getItem('authToken');
		if (!token) {
			alert('Authentication token is missing!');
			return;
		}

		const headers = { Authorization: `Bearer ${token}` };

		this.http.delete(`${this.apiUrl}/${stockId}`, { headers }).subscribe({
			next: () => {
				this.stocks = this.stocks.filter(stock => stock.id !== stockId);
				alert('Stock removed from watchlist successfully!');
			},
			error: (error) => {
				console.error('Error deleting stock:', error);
				alert('Failed to delete stock.');
			}
		});
	}

	// Symbols list
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
					token: symbol.token,
					symbol: symbol.symbol,
				}));
			},
			error: (error) => {
				console.error('Error fetching symbols:', error);
				alert('Failed to load symbols.');
			},
		});
	}

	addSymbolToWatchlist(symbol: any): void {
		const token = localStorage.getItem('authToken');
		if (!token) {
			alert('Authentication token is missing!');
			return;
		}

		const headers = { Authorization: `Bearer ${token}` };
		const requestBody = {
			instrumentToken: symbol.token,
			name: symbol.name,
			symbol: symbol.symbol,
			json: JSON.stringify(symbol),
		};

		this.http.post(this.apiUrl, requestBody, { headers }).subscribe({
			next: (response) => {
				// Assuming the response returns the added symbol details
				console.log('Symbol added to watchlist:', response);

				// Add the symbol to the stocks array to reflect changes in the UI
				this.stocks.push({
					id: symbol.id, // Ensure the correct id is used
					name: symbol.name,
					symbol: symbol.symbol,
					instrumentToken: symbol.token,
					price: NaN,
					change: NaN,
				});

				this.selectedSymbols = []; // Clear the selected value
			},
			error: (error) => {
				if (error.status === 400 && error.error.message === 'Symbol already exists!') {
					alert('This symbol is already in use!');
				} else {
					alert('Failed to add symbol. Please try again.');
				}
			},
		});
	}

	private initializeChart(): void {
		this.fetchAndUpdateChart();
	}

	private fetchAndUpdateChart(): void {
		const token = localStorage.getItem('authToken');
		if (!token) {
			console.error('Authentication token is missing!');
			return;
		}

		const headers = { Authorization: `Bearer ${token}` };
		this.http.get("http://localhost:5000/api/user-strategy-symbols", { headers }).subscribe({
			next: (response: any) => {
				console.log('Fetched chart data:', response);

				// ✅ Sort by latest event createdAt descending
				const sortedSymbols = response
					.filter((item: any) =>
						item.userSymbol?.events?.length > 0
					)
					.sort((a: any, b: any) => {
						const latestA = new Date(a.userSymbol.events[0].createdAt).getTime();
						const latestB = new Date(b.userSymbol.events[0].createdAt).getTime();
						return latestB - latestA;
					});

				this.extractImagePatterns(sortedSymbols);
			},
			error: (error) => {
				console.error('Error fetching chart data:', error);
			},
		});
	}

	generateCandleChartOptions(
		candleData: any[],
		minX: number,
		maxX: number,
		highlightTime?: number,
		message?: string,
		symbol?: string
	): ChartOptions {
		return {
			series: [{ data: candleData }],
			chart: {
				type: 'candlestick',
				height: 300,
				toolbar: {
					show: false,
					tools: {
						download: false,
						zoom: true,
						selection: true,
						zoomin: true,
						zoomout: true,
						pan: true,
						reset: true
					},
					autoSelected: 'zoom'
				},
				zoom: {
					enabled: true,
					type: 'x', // Only horizontal zoom (time)
					autoScaleYaxis: true,
					zoomedArea: {
						fill: {
							color: '#90CAF9',
							opacity: 0.4
						},
						stroke: {
							color: '#0D47A1',
							opacity: 0.4,
							width: 1
						}
					}
				},
				animations: { enabled: true },
				events: {
					mounted: (chartContext: any, config: any) => {
						const chartEl = chartContext.el;
						this.addStrategyImagesToChart(chartEl, symbol || '', minX, maxX);
					},
					updated: (chartContext: any, config: any) => {
						const chartEl = chartContext.el;
						this.addStrategyImagesToChart(chartEl, symbol || '', minX, maxX);
					}
				}
			},
			xaxis: {
				type: 'datetime',
				min: minX,
				max: maxX,
				labels: {
					datetimeFormatter: {
						hour: 'HH:mm'
					},
					formatter: function (value: string, timestamp?: number) {
						if (!timestamp) return value;
						return new Date(timestamp).toLocaleTimeString('en-IN', {
							hour: '2-digit',
							minute: '2-digit',
							hour12: false,
							timeZone: 'Asia/Kolkata'
						});
					}
				}
			},
			yaxis: {
				tooltip: { enabled: true }
			},
			title: {
				text: 'Candlestick Chart',
				align: 'left'
			},
			tooltip: { enabled: true },
			plotOptions: {
				candlestick: {
					wick: { useFillColor: true }
				}
			},
			dataLabels: { enabled: false },
			stroke: {
				show: true,
				curve: 'straight',
				lineCap: 'butt',
				width: 1
			},
			markers: { size: 0 },
			// 🔥 Highlight strategy signal
			annotations: highlightTime ? {
				xaxis: [{
					x: highlightTime,
					borderColor: '#FF4560',
					label: {
						borderColor: '#FF4560',
						style: {
							color: '#fff',
							background: '#FF4560'
						},
						orientation: 'horizontal',
						text: message || 'Signal'
					}
				}]
			} : {}
		};
	}

	private convertKiteCandlesToApexFormat(kiteData: any[]): { x: number; y: number[] }[] {
		const IST_OFFSET_MS = 60 * 1000; // 1 minute buffer
		const nowIST = new Date(new Date().getTime() + IST_OFFSET_MS);

		const candles = kiteData.map((candle: any) => {
			const istDate = new Date(candle.time); // already milliseconds

			const hours = istDate.getHours();
			const minutes = istDate.getMinutes();

			const isInMarketHours =
				(hours === 9 && minutes >= 30) ||
				(hours > 9 && hours < 15) ||
				(hours === 15 && minutes <= 30);

			const isBeforeNow = istDate <= nowIST;

			if (isInMarketHours && isBeforeNow) {
				return {
					x: istDate.getTime(),
					y: [candle.open, candle.high, candle.low, candle.close]
				};
			}
			return null;
		});

		return candles.filter((c): c is { x: number; y: number[] } => c !== null);
	}


	loadCandleDataForSymbol(symbol: string, index: number): Promise<void> {
		return new Promise((resolve, reject) => {
			const token = localStorage.getItem('authToken');
			if (!token) {
				console.error('Token missing');
				return;
			}

			const headers = { Authorization: `Bearer ${token}` };

			// ✅ Use actual IST date (not offset math)
			const nowIST = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
			const now = new Date(nowIST); // parsed IST date

			const yyyy = now.getFullYear();
			const mm = String(now.getMonth() + 1).padStart(2, '0');
			const dd = String(now.getDate()).padStart(2, '0');
			const hh = String(now.getHours()).padStart(2, '0');
			const min = String(now.getMinutes()).padStart(2, '0');
			const ss = String(now.getSeconds()).padStart(2, '0');

			const from = `${yyyy}-${mm}-${dd}T09:15:00`;
			const to = `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;

			const url = `http://localhost:3000/api/kite-candles?symbol=${symbol}&interval=minute&from=${from}&to=${to}`;
			console.log(`✅ Fetching ${symbol} from ${from} to ${to}`);

			const hasEvents = this.symbolHasEventsToday.get(symbol);
			const message = hasEvents ? undefined : 'Today there is no event match for this Symbol';


			this.http.get(url, { headers }).subscribe({
				next: (res: any) => {
					const apexFormattedData = this.convertKiteCandlesToApexFormat(res.data);
					const times = apexFormattedData.map(d => d.x);
					const minX = Math.min(...times);
					const maxX = Math.max(...times);

					// this.chartOptionsList[index] = this.generateCandleChartOptions(apexFormattedData, minX, maxX);
					this.chartOptionsList[index] = this.generateCandleChartOptions(
						apexFormattedData,
						minX,
						maxX,
						undefined, // highlightTime
						message,
						symbol
					);

					// this.chartOptionsList[index] = this.generateCandleChartOptions(apexFormattedData);
				},
				error: (err) => {
					console.error(`❌ Failed to load candle data for ${symbol}`, err);
				}
			});
		});
	}

	// Generate X-axis slots
	// generateXAxisSlots() {
	// 	const start = new Date();
	// 	start.setHours(9, 30, 0, 0);
	// 	const end = new Date();
	// 	end.setHours(15, 30, 0, 0);

	// 	const result = [];
	// 	while (start <= end) {
	// 		const hour = start.getHours();
	// 		const minute = start.getMinutes();
	// 		const timeStr = `${hour % 24 === 0 ? 24 : hour % 24}:${minute.toString().padStart(2, '0')}`;
	// 		result.push(timeStr);
	// 		start.setMinutes(start.getMinutes() + 1);
	// 	}
	// 	this.xAxisTimes = result;
	// }

	generateXAxisSlots(index: number) {
		const start = new Date();
		start.setHours(9, 30, 0, 0);
		const end = new Date();
		end.setHours(15, 30, 0, 0);

		const result = [];
		while (start <= end) {
			const hour = start.getHours();
			const minute = start.getMinutes();
			const timeStr = `${hour % 24 === 0 ? 24 : hour % 24}:${minute.toString().padStart(2, '0')}`;
			result.push(timeStr);
			start.setMinutes(start.getMinutes() + 1);
		}

		const candles = this.chartOptionsList[index]?.series?.[0]?.data || [];
		this.xAxisTimes = candles.map((c: any) => c.x);
		console.log("xAxisTimes:", this.xAxisTimes);
	}

	private extractImagePatterns(apiData: any[]): void {
		const newPatterns: { time: string; image: string; symbol: string; strategyName: string; accuracy: number }[] = [];
		const symbolSet = new Set<string>();
		const symbolLatestEventMap = new Map<string, string>();
		this.symbolHasEventsToday = new Map<string, boolean>(); // define this in the component

		apiData.forEach((item: any) => {
			const symbol = item.userSymbol?.symbol;
			const strategyId = item.strategyId;
			const image = item.userStrategy?.image?.startsWith("http")
				? item.userStrategy.image
				: `../../../../${item.userStrategy.image}`;

			if (!symbol || !item.userSymbol?.events) return;

			symbolSet.add(symbol);

			const today = new Date().toISOString().split('T')[0];

			const matchingEvents = item.userSymbol.events.filter(
				(event: any) =>
					event.symbol === symbol &&
					event.strategyId === strategyId &&
					event.accuracyPercentage > 65 &&
					new Date(event.createdAt).toISOString().split('T')[0] === today
			);

			matchingEvents.forEach((event: any) => {
				const eventTime = new Date(event.createdAt);
				// const minutes = eventTime.getMinutes();
				// const roundedMinutes = minutes < 15 ? 0 : minutes < 45 ? 30 : 0;
				// if (minutes >= 45) eventTime.setHours(eventTime.getHours() + 1);
				// eventTime.setMinutes(roundedMinutes);
				eventTime.setSeconds(0);
				eventTime.setMilliseconds(0);

				const hours = String(eventTime.getHours()).padStart(2, '0');
				const formattedMinutes = String(eventTime.getMinutes()).padStart(2, '0');
				const formattedTime = `${hours}:${formattedMinutes}`;

				newPatterns.push({
					time: formattedTime,
					image: image,
					symbol: symbol,
					strategyName: item.userStrategy?.name || 'N/A',
					accuracy: event.accuracyPercentage ? +event.accuracyPercentage.toFixed(2) : 0
				});

				this.symbolHasEventsToday.set(symbol, matchingEvents.length > 0);

				// Track the latest event timestamp
				const existingTime = symbolLatestEventMap.get(symbol);
				if (!existingTime || new Date(event.createdAt) > new Date(existingTime)) {
					symbolLatestEventMap.set(symbol, event.createdAt);
				}
			});
		});

		this.patternsImage = newPatterns;
		this.yAxisSymbols = Array.from(symbolSet)
			.sort((a, b) => {
				const timeA = new Date(symbolLatestEventMap.get(a) || 0).getTime();
				const timeB = new Date(symbolLatestEventMap.get(b) || 0).getTime();
				return timeB - timeA; // Descending
			});

		this.dPlusOpen = new Array(this.yAxisSymbols.length).fill(false);

		console.log("patternsImage:", this.patternsImage);

	}

	onAccordionToggle(isOpen: boolean, symbol: string, index: number): void {
		if (isOpen) {
			// Opening a new accordion
			this.dPlusOpen[index] = true;

			// Add to queue
			this.openedIndices.push(index);

			// Enforce limit
			if (this.openedIndices.length > this.maxOpenAccordions) {
				const oldestIndex = this.openedIndices.shift(); // Remove the first opened
				if (oldestIndex !== undefined) {
					this.dPlusOpen[oldestIndex] = false;
				}
			}
		} else {
			// Manually closed, remove from queue
			this.dPlusOpen[index] = false;
			this.openedIndices = this.openedIndices.filter(i => i !== index);
		}

		// if (isOpen && !this.chartOptionsList[index]) {
		// 	this.loadCandleDataForSymbol(symbol, index);
		// }
		if (isOpen && !this.chartOptionsList[index]) {
			this.loadCandleDataForSymbol(symbol, index).then(() => {
				this.generateXAxisSlots(index);
			});
		}

		if (!isOpen) {
			// cleanup strategy elements
			const chartContainer = this.getChartElementByIndex(index); // ✅ index must be passed
			if (chartContainer) {
				const elements = chartContainer.querySelectorAll('.strategy-img, .strategy-label');
				elements.forEach(el => el.remove());
			}
		}

		const chartContainer = this.getChartElementByIndex(index);
		if (chartContainer) {
			const overlays = chartContainer.querySelectorAll('.strategy-img, .strategy-label');
			overlays.forEach(el => el.remove());
		}
	}

	getPixelX(time: string, symbol: string): number {
		const chartInstance = this.apexChartsRefs[symbol]; // You need to track chart ref by symbol
		if (!chartInstance) return 0;

		const timestamp = new Date(`2025-05-30T${time}:00`).getTime();

		// You'll need to map timestamp -> pixel X using ApexCharts X-axis scale
		const xaxisMin = chartInstance?.chart?.w?.globals?.minX;
		const xaxisMax = chartInstance?.chart?.w?.globals?.maxX;
		const plotWidth = chartInstance?.chart?.w?.gridWidth;

		if (xaxisMin !== undefined && xaxisMax !== undefined && plotWidth) {
			const relativeX = (timestamp - xaxisMin) / (xaxisMax - xaxisMin);
			return relativeX * plotWidth;
		}

		return 0;
	}

	addStrategyImagesToChart(chartEl: HTMLElement, symbol: string, minX: number, maxX: number): void {
		// Remove existing strategy elements within this chart only
		const existing = chartEl.querySelectorAll('.strategy-img-wrapper');
		existing.forEach(el => el.remove());

		const patterns = this.patternsImage.filter(p => p.symbol === symbol);
		const xaxis = chartEl.querySelector('.apexcharts-xaxis');
		const plot = chartEl.querySelector('.apexcharts-inner');

		if (!xaxis || !plot) return;

		const xaxisRect = xaxis.getBoundingClientRect();
		const plotRect = plot.getBoundingClientRect();
		const chartRect = chartEl.getBoundingClientRect();

		const chartWidth = plotRect.width;
		const offsetLeft = plotRect.left - chartRect.left;
		const offsetTop = xaxisRect.top - chartRect.top;

		const verticalSpacing = 40;
		let currentLine = 0;

		patterns.forEach((p, i) => {
			const timestamp = this.convertTimeToTimestamp(p.time);
			const positionRatio = (timestamp - minX) / (maxX - minX);
			const left = Math.round(offsetLeft + positionRatio * chartWidth);
			const topOffset = offsetTop - 35 - currentLine * verticalSpacing;
			currentLine++; // Next element should go to the next line

			// Wrapper div for easier positioning
			const wrapper = document.createElement('div');
			wrapper.className = 'strategy-img-wrapper';
			wrapper.style.position = 'absolute';
			wrapper.style.left = `${left}px`;
			wrapper.style.top = `${topOffset}px`;
			wrapper.style.display = 'flex';
			wrapper.style.alignItems = 'center';
			wrapper.style.zIndex = '10';

			// Strategy image + arrow wrapper
			const imageWrapper = document.createElement('div');
			imageWrapper.style.display = 'flex';
			imageWrapper.style.flexDirection = 'column';
			imageWrapper.style.alignItems = 'center';

			// Strategy image
			const img = document.createElement('img');
			img.src = p.image;
			img.style.width = '20px';
			img.style.height = '20px';
			img.className = 'strategy-img';

			// Downward arrow (CSS triangle)
			const arrow = document.createElement('div');
			arrow.style.width = '0';
			arrow.style.height = '0';
			arrow.style.borderLeft = '5px solid transparent';
			arrow.style.borderRight = '5px solid transparent';
			arrow.style.borderTop = '6px solid gray';  // Color of arrow (can match candle)
			arrow.style.marginTop = '2px';

			imageWrapper.appendChild(img);
			imageWrapper.appendChild(arrow);

			// Strategy label
			const label = document.createElement('div');
			label.className = 'strategy-label';
			label.title = `${p.time} | ${p.strategyName} | ${p.accuracy}%`;
			label.style.background = 'rgba(0, 0, 0, 0.7)';
			label.style.color = '#fff';
			label.style.padding = '2px 6px';
			label.style.borderRadius = '4px';
			label.style.fontSize = '10px';
			label.style.whiteSpace = 'nowrap';
			label.style.pointerEvents = 'none';
			label.style.maxWidth = '180px';
			label.style.overflow = 'hidden';
			label.style.textOverflow = 'ellipsis';
			label.textContent = `${p.time} | ${p.strategyName} | ${p.accuracy}%`;

			wrapper.appendChild(imageWrapper);
			wrapper.appendChild(label);

			chartEl.appendChild(wrapper);
		});
	}

	ngOnDestroy(): void {
		const elements = document.querySelectorAll('.strategy-img, .strategy-label');
		elements.forEach(el => el.remove());
	}

	getChartElementByIndex(index: number): HTMLElement | null {
		return document.querySelector(`#chart-container-${index}`);
	}

	convertTimeToTimestamp(time: string): number {
		const [hours, minutes] = time.split(':').map(Number);
		const today = new Date();
		today.setHours(hours, minutes, 0, 0);
		return today.getTime();
	}
}