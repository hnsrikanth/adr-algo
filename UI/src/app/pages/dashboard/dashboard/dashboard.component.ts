import { Component, OnInit, ViewChild, NgModule } from '@angular/core';
import { NgApexchartsModule, ChartComponent } from 'ng-apexcharts';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
        animations: {
          enabled: false
        }
      },
      plotOptions: {
        candlestick: {
          colors: {
            upward: '#4407f8ff', // White for bullish candles
            downward: '#000000' // Black for bearish candles
          }
        }
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
                  borderColor: "#14bb2aff",
                  strokeDashArray: 0,
                  borderWidth: 2,
                  label: {
                    borderColor: "#14bb2aff",
                    style: { color: "#fff", background: "#14bb2aff" },
                    text: `ADR High (${avgHigh.toFixed(2)})`
                  }
                },
                {
                  y: avgLow,
                  borderColor: "#f11010ff",
                  strokeDashArray: 0,
                  borderWidth: 2,
                  label: {
                    borderColor: "#f11010ff",
                    style: { color: "#fff", background: "#f11010ff" },
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
