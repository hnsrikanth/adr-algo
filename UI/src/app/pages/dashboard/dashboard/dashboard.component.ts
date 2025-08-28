import { Component, OnInit, ViewChild, NgModule } from '@angular/core';
import { NgApexchartsModule, ChartComponent } from 'ng-apexcharts';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
	// @ViewChild("basicCandlestickChartTwoDayChart") chartData!: ChartComponent;
	@ViewChild("chartTwoDay") chartTwoDay!: ChartComponent;

	// ADR High and Low values for HTML binding
	adrHigh: number = 0;
	adrLow: number = 0;
	adrRange: number = 0;

	constructor(
		private http: HttpClient
	) { }

	ngOnInit(): void {
		this._basicCandlestickChart();
		this.loadNiftyCandles();

		this._basicCandlestickTwoDayChart();
		this.loadNiftyCandlesTwoDayData();
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

						// Transform into ApexCharts format
						const candleData = candlesRaw
							.filter(c => c && c.length >= 5)
							.map(c => ({
								x: new Date(c[0]).toLocaleDateString('en-GB', {
									day: '2-digit',
									month: 'short'
								}),
								y: [c[1], c[2], c[3], c[4]] // Open, High, Low, Close
							}));

						// Get the last 14 candles
						const last14 = candleData.slice(-14);

						// Highs are at index 1, Lows at index 2 in OHLC
						const highAdr = last14.map((c) => c.y[1]);
						const lowAdr = last14.map((c) => c.y[2]);

						// Calculate averages
						let sumHigh = 0;
						let sumLow = 0;

						for (let i = 0; i < highAdr.length; i++) {
							sumHigh += highAdr[i];
							sumLow += lowAdr[i];
						}

						const avgHigh = sumHigh / 14; // or highAdr.length if dynamic
						const avgLow = sumLow / 14;


						// Assign to variables for HTML display
						this.adrHigh = avgHigh;
						this.adrLow = avgLow;
						this.adrRange = avgHigh - avgLow;

						// Update candlestick chart with ADR lines
						this.basicCandlestickChart.series = [
							{ data: last14 }
						];

						// After calculating avgHigh and avgLow
						// Update ADR annotation lines
						this.basicCandlestickChart.annotations = {
							yaxis: [
								{
									y: avgHigh,
									borderColor: "#060606dd",
									strokeDashArray: 0,
									borderWidth: 2,
									label: {
										borderColor: "#060606dd",
										style: { color: "#fff", background: "#060606dd" },
										text: `ADR High (${avgHigh.toFixed(2)})`
									}
								},
								{
									y: avgLow,
									borderColor: "#060606dd",
									strokeDashArray: 0,
									borderWidth: 2,
									label: {
										borderColor: "#060606dd",
										style: { color: "#fff", background: "#060606dd" },
										text: `ADR Low (${avgLow.toFixed(2)})`
									}
								}
							]
						};

						// Actually update the chart
						this.chart.updateOptions({
							series: this.basicCandlestickChart.series,
							annotations: this.basicCandlestickChart.annotations
						});
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

						// ✅ Convert to Apex-friendly format with IST timestamps
						const candleData = candlesRaw.map(c => ({
							x: this.toIST(new Date(c[0]).getTime()), // ensure IST
							y: [c[1], c[2], c[3], c[4]]
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
							const step = this.adrRange / 4;

							const levels: { value: number; label: string }[] = [
								{ value: sessionOpen, label: `Open ${sessionOpen.toFixed(2)}` }
							];

							// Generate positive (above open)
							for (let i = 1; i <= 4; i++) {
								levels.push({
									value: sessionOpen + i * step,
									label: `Positive ${i} (${(sessionOpen + i * step).toFixed(2)})`
								});
							}

							// Generate negative (below open)
							for (let i = 1; i <= 4; i++) {
								levels.push({
									value: sessionOpen - i * step,
									label: `Negative ${i} (${(sessionOpen - i * step).toFixed(2)})`
								});
							}

							// Sort levels from bottom → top
							levels.sort((a, b) => a.value - b.value);

							// ✅ Annotations with proper labels
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

						const min = candleData[0]?.x;
						const max = candleData[candleData.length - 1]?.x;

						this.basicCandlestickChartTwoDayChart.xaxis = {
							type: "datetime",
							min,
							max,
							labels: {
								datetimeUTC: false,
								datetimeFormatter: { hour: "HH:mm" },
								rotate: -45
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
