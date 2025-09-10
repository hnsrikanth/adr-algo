import { Component, OnInit, ViewChild } from '@angular/core';
import { NgApexchartsModule, ChartComponent } from 'ng-apexcharts';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdrService, AdrData } from '../../../core/services/adr.service';

@Component({
	selector: 'app-dashboard',
	standalone: true,
	imports: [NgApexchartsModule, CommonModule, FormsModule],
	templateUrl: './dashboard.component.html',
	styleUrl: './dashboard.component.scss'
})

export class DashboardComponent implements OnInit {

	basicCandlestickChart: any;
	@ViewChild("basicCandlestickChart") chart!: ChartComponent;

	basicCandlestickChartTwoDayChart: any;
	@ViewChild("chartTwoDay") chartTwoDay!: ChartComponent;

	// ADR High and Low values for HTML binding
	adrHigh: number = 0;
	adrLow: number = 0;
	adrRange: number = 0;
	todayOpen: number = 0;

	adrData: AdrData | null = null;

	constructor(
		private http: HttpClient,
		private adrService: AdrService
	) { }

	ngOnInit(): void {
		this._basicCandlestickChart();
		this.loadNiftyCandles();

		this.loadAdrData();

		this._basicCandlestickTwoDayChart();
		this.loadNiftyCandlesTwoDayData();
	}

	loadAdrData() {
		this.adrService.getAdrData().subscribe({
			next: (data) => {
				this.adrHigh = data.adr_high;
				this.adrLow = data.adr_low;
				this.adrRange = data.adr_range;
				this.todayOpen = data.market_open;

				this.basicCandlestickChart.annotations = {
					yaxis: [
						{
							y: this.adrHigh,
							borderColor: "#000",
							borderWidth: 2,
							label: {
								borderColor: "#000",
								style: { color: "#fff", background: "#000" },
								text: `ADR High (${this.adrHigh.toFixed(2)})`
							}
						},
						{
							y: this.adrLow,
							borderColor: "#000",
							borderWidth: 2,
							label: {
								borderColor: "#000",
								style: { color: "#fff", background: "#000" },
								text: `ADR Low (${this.adrLow.toFixed(2)})`
							}
						}
					]
				};

				if (this.chart) {
					this.chart.updateOptions({
						annotations: this.basicCandlestickChart.annotations
					});
				}

				// ✅ Build levels array from backend response
				const levels = [
					{ value: this.todayOpen, label: `Open (${this.todayOpen.toFixed(2)})` },
					{ value: data.positive_0_25, label: `Positive 0.25 (${data.positive_0_25.toFixed(2)})` },
					{ value: data.positive_0_50, label: `Positive 0.50 (${data.positive_0_50.toFixed(2)})` },
					{ value: data.positive_0_75, label: `Positive 0.75 (${data.positive_0_75.toFixed(2)})` },
					{ value: data.positive_1_00, label: `Positive 1.00 (${data.positive_1_00.toFixed(2)})` },
					{ value: data.nagative_0_25, label: `Negative 0.25 (${data.nagative_0_25.toFixed(2)})` },
					{ value: data.nagative_0_50, label: `Negative 0.50 (${data.nagative_0_50.toFixed(2)})` },
					{ value: data.nagative_0_75, label: `Negative 0.75 (${data.nagative_0_75.toFixed(2)})` },
					{ value: data.nagative_1_00, label: `Negative 1.00 (${data.nagative_1_00.toFixed(2)})` }
				].sort((a, b) => a.value - b.value);

				// ✅ Annotations for 2-day chart
				const annotations2Day = levels.map(lvl => ({
					y: lvl.value,
					borderColor: "#ff9800",
					strokeDashArray: 3,
					label: {
						borderColor: "#ff9800",
						style: { color: "#000", background: "#ffeb3b" },
						text: lvl.label
					}
				}));

				this.basicCandlestickChartTwoDayChart.annotations = { yaxis: annotations2Day };

				if (this.chartTwoDay) {
					this.chartTwoDay.updateOptions({
						annotations: this.basicCandlestickChartTwoDayChart.annotations
					});
				}
			},
			error: (err) => console.error("Error fetching ADR via WS:", err)
		});
	}

	/** Initialize empty chart config */
	private _basicCandlestickChart() {
		this.basicCandlestickChart = {
			series: [
				{ data: [] }
			],
			chart: {
				type: "candlestick",
				height: 350,
				toolbar: { show: false },
				animations: {
					enabled: false
				}
			},
			fill: {
				opacity: 1
			},
			plotOptions: {
				candlestick: {
					colors: {
						upward: '#28ca38ff', // White for bullish candles
						downward: '#f61515ff' // Black for bearish candles
					},
					wick: {
						useFillColor: true // wicks use same color
					}
				}
			},
			stroke: {
				show: true,
				width: 1,               // thickness of the border
				colors: ['#000000'],    // black border for both up & down candles
			},
			title: {
				text: "NIFTY 14 Days Candle",
				align: "left",
				style: { fontWeight: 600 },
			},
			xaxis: {
				type: "category", // show labels only, no weekend gaps
				labels: { rotate: -45 }
			},
			yaxis: {
				tooltip: { enabled: true },
			},
			annotations: { yaxis: [] } // placeholder for ADR lines
		};
	}

	/** Fetch API data and update chart */
	private loadNiftyCandles() {
		this.http.get<any>('http://localhost:3000/api/kite-historic-data')
			.subscribe({
				next: (res) => {
					if (res?.status === 'success' && Array.isArray(res.data?.candles)) {
						const candlesRaw: [string, number, number, number, number, number][] = res.data.candles;
						const candleData = candlesRaw
							.filter(c => c && c.length >= 5)
							.map(c => ({
								x: new Date(c[0]).toLocaleDateString('en-GB', {
									day: '2-digit',
									month: 'short'
								}),
								y: [c[1], c[2], c[3], c[4]] // Open, High, Low, Close
							}));
						const last14 = candleData.slice(-14);
						this.basicCandlestickChart.series = [
							{ data: last14 }
						];
						// Update chart series first
						this.chart.updateOptions({
							series: this.basicCandlestickChart.series
						});
						// Now load ADR data from backend and update annotations
						this.loadAdrData();
					}
				},
				error: (err) => {
					console.error('Error fetching NIFTY candle data:', err);
				}
			});
	}


	/** Initialize empty 2-day candle chart config */
	private _basicCandlestickTwoDayChart() {
		this.basicCandlestickChartTwoDayChart = {
			series: [
				{ data: [] }
			],
			chart: {
				type: "candlestick",
				height: 350,
				toolbar: { show: false },
				animations: {
					enabled: false
				}
			},
			fill: {
				opacity: 1
			},
			plotOptions: {
				candlestick: {
					colors: {
						upward: '#28ca38ff', // White for bullish candles
						downward: '#f61515ff' // Black for bearish candles
					},
					wick: {
						useFillColor: true // wicks use same color
					}
				}
			},
			stroke: {
				show: true,
				width: 1,               // thickness of the border
				colors: ['#000000'],    // black border for both up & down candles
			},
			title: {
				text: "NIFTY 2 Days Candle",
				align: "left",
				style: { fontWeight: 600 },
			},
			xaxis: {
				type: "datetime",
				min: new Date().setHours(9, 15, 0, 0),   // 09:15 start
				max: new Date().getTime(),               // current time (from API toDate)
				labels: {
					datetimeFormatter: {
						hour: 'HH:mm'
					},
					rotate: -45
				}
			},
			yaxis: {
				tooltip: { enabled: true },
			},
			annotations: { yaxis: [] } // placeholder for ADR lines
		};
	}

	private loadNiftyCandlesTwoDayData() {
		this.http.get<any>('http://localhost:3000/api/two-days-historic-data')
			.subscribe({
				next: (res) => {
					if (res?.status === 'success' && Array.isArray(res.data?.candles)) {
						const candlesRaw: [string, number, number, number, number, number][] = res.data.candles;

						// ✅ Convert candles to Apex-friendly format using index (no gaps)
						const candleData = candlesRaw.map((c, i) => ({
							x: i, // category index instead of datetime
							y: [c[1], c[2], c[3], c[4]],
							rawTime: c[0] // keep original time for labels
						}));

						this.basicCandlestickChartTwoDayChart.series = [
							{ data: candleData }
						];

						// ✅ Detect latest session date (could be today or last business day)
						const sessionDates = [...new Set(candlesRaw.map(c => c[0].substring(0, 10)))];
						const latestSession = sessionDates.sort().pop(); // get most recent date string "YYYY-MM-DD"
						const sessionCandles = candlesRaw.filter(c => c[0].startsWith(latestSession!));

						if (sessionCandles.length > 0 && this.adrRange) {
							const sessionOpen = sessionCandles[0][1];
							const step = this.adrRange; // full ADR range
							const levels: { value: number; label: string }[] = [
								{ value: sessionOpen, label: `Open ${sessionOpen.toFixed(2)}` }
							];

							// Positive levels: +0.25, +0.50, +0.75, +1.00 ADR
							const positives = [0.25, 0.50, 0.75, 1.00];
							positives.forEach(factor => {
								const val = sessionOpen + step * factor;
								levels.push({
									value: val,
									label: `Positive ${factor} (${val.toFixed(2)})`
								});
							});

							// Negative levels: -0.25, -0.50, -0.75, -1.00 ADR
							const negatives = [0.25, 0.50, 0.75, 1.00];
							negatives.forEach(factor => {
								const val = sessionOpen - step * factor;
								levels.push({
									value: val,
									label: `Negative ${factor} (${val.toFixed(2)})`
								});
							});

							// Sort bottom → top
							levels.sort((a, b) => a.value - b.value);

							const annotations = levels.map((lvl) => ({
								y: lvl.value,
								borderColor: "#ff9800",
								strokeDashArray: 3,
								label: {
									borderColor: "#ff9800",
									style: { color: "#000", background: "#ffeb3b" },
									text: lvl.label
								}
							}));

							this.basicCandlestickChartTwoDayChart.annotations = { yaxis: annotations };

							if (this.chartTwoDay) {
								this.chartTwoDay.updateOptions({
									annotations: this.basicCandlestickChartTwoDayChart.annotations
								});
							}
						}


						// ✅ Switch X-axis to "category" to remove gaps
						this.basicCandlestickChartTwoDayChart.xaxis = {
							type: "category",
							labels: {
								rotate: -45,
								formatter: (val: string | number, _opts: any): string => {
									const idx = Number(val); // category index
									const raw = candleData[idx]?.rawTime;
									return raw
										? new Date(raw).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
										: "";
								}
							}
						};


						// 🔄 Update chart fully
						this.chartTwoDay.updateOptions({
							series: this.basicCandlestickChartTwoDayChart.series,
							annotations: this.basicCandlestickChartTwoDayChart.annotations,
							xaxis: this.basicCandlestickChartTwoDayChart.xaxis
						});
					}
				},
				error: (err) => {
					console.error('Error fetching NIFTY 2-day candle data:', err);
				}
			});
	}

	// ✅ Convert UTC → IST
	toIST(tsUtc: number): number {
		return tsUtc + (5.5 * 60 * 60 * 1000);
	}
}
