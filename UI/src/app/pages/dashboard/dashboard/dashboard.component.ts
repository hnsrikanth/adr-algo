import { Component, OnInit, ViewChild, NgModule } from '@angular/core';
import { NgApexchartsModule, ChartComponent } from 'ng-apexcharts';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WatchlistService } from '../../../core/services/watchlist.service';
import { TickService } from '../../../core/services/tick.service';
import moment from 'moment';

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

  // ADR High and Low values for HTML binding
  adrHigh: number = 0;
  adrLow: number = 0;
  adrRange: number = 0;

  // Ticks Data - Watchlist
	ticks: any[] = [];
	stocks: any[] = [];

  private apiUrl = 'http://localhost:3000/api/user-watchlists';

  // Helper function to check NaN
	isNaN(value: any): boolean {
		return Number.isNaN(value);
	}

  constructor(
    private http: HttpClient,
    private watchlistService: WatchlistService,
    private tickService: TickService,
  ) {}

  ngOnInit(): void {
    this._basicCandlestickChart();
    this.loadNiftyCandles();

    // Watchlist

    // Fetch the watchlist
		this.watchlistService.getWatchlist().subscribe((watchlist) => {
      console.log("✅ Watchlist fetched:", watchlist);
			// Populate the stocks array
			this.stocks = watchlist.map((item: any) => ({
				id: item.id,
				name: item.name,
				symbol: item.symbol,
				instrumentToken: item.instrumentToken,
				price: NaN,
				change: NaN,
			}));

      console.log("✅ Stocks initialized:", this.stocks);
			// Now subscribe to live tick data
			this.tickService.getTicks().subscribe((ticks) => {
        console.log("📡 Tick data received:", ticks);
				this.updateStockPrices(ticks);
			});
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

  // Watchlist
  updateStockPrices(ticks: any[]): void {
    console.log("🔄 Updating stock prices with ticks:", ticks);
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
}
