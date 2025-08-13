import { Component, OnInit } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
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

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this._basicCandlestickChart();
    this.loadNiftyCandles();
  }

  /** Initialize empty chart */
  private _basicCandlestickChart() {
    this.basicCandlestickChart = {
      series: [
        {
          data: [],
        },
      ],
      chart: {
        type: "candlestick",
        height: 350,
        toolbar: { show: false },
      },
      title: {
        text: "NIFTY Candlestick Chart",
        align: "left",
        style: { fontWeight: 600 },
      },
      xaxis: { type: "datetime" },
      yaxis: {
        tooltip: { enabled: true },
      },
    };
  }

  /** Fetch API data and update chart */
  private loadNiftyCandles() {
    this.http.get<any>('http://localhost:3000/api/kite-historic-data')
      .subscribe({
        next: (res) => {
          if (res?.status === 'success' && res.data?.candles) {
            const candleData = res.data.candles.map((c: any) => {
              return {
                x: new Date(c[0]), // date
                y: [c[1], c[2], c[3], c[4]] // open, high, low, close
              };
            });

            this.basicCandlestickChart.series = [
              { data: candleData }
            ];
          }
        },
        error: (err) => {
          console.error('Error fetching NIFTY candle data:', err);
        }
      });
  }
}
