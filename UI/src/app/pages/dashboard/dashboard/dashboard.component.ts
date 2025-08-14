import { Component, OnInit, ViewChild } from '@angular/core';
import { NgApexchartsModule, ChartComponent } from 'ng-apexcharts';
import { HttpClient } from '@angular/common/http';
import moment from 'moment';

@Component({
	selector: 'app-dashboard',
	standalone: true,
	imports: [NgApexchartsModule],
	templateUrl: './dashboard.component.html',
	styleUrl: './dashboard.component.scss'
})

export class DashboardComponent implements OnInit {

  basicCandlestickChart: any;
  @ViewChild("basicCandlestickChart") chart!: ChartComponent;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this._basicCandlestickChart();
    this.loadNiftyCandles();
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
                x: new Date(c[0]).toLocaleDateString('en-GB'),
                y: [c[1], c[2], c[3], c[4]] // Open, High, Low, Close
              }));

            // Get the last 14 candles
            const last14 = candleData.slice(-15);

            // Highs are at index 1, Lows at index 2 in OHLC
            const highAdr = last14.map((c) => c.y[1]);
            const lowAdr = last14.map((c) => c.y[2]);

            // Calculate averages
            const avgHigh = highAdr.reduce((a, b) => a + b, 0) / highAdr.length;
            const avgLow = lowAdr.reduce((a, b) => a + b, 0) / lowAdr.length;

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
                  borderColor: "#000000",
                  strokeDashArray: 0,
                  borderWidth: 2,
                  label: {
                    borderColor: "#000000",
                    style: { color: "#fff", background: "#000000" },
                    text: `ADR High (${avgHigh.toFixed(2)})`
                  }
                },
                {
                  y: avgLow,
                  borderColor: "#000000",
                  strokeDashArray: 0,
                  borderWidth: 2,
                  label: {
                    borderColor: "#000000",
                    style: { color: "#fff", background: "#000000" },
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
}
