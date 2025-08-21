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
  // Bear trades
  strategyBearTradesMain: any = {};
  strategyBearTradesHedge: any = {};

  strategyBearTradesMain2: any = {};
  strategyBearTradesHedge2: any = {};

  strategyBearTradesMain3: any = {};
  strategyBearTradesHedge3: any = {};

  strategyBearTradesMain4: any = {};
  strategyBearTradesHedge4: any = {};

  // Bull trades
  strategyBullTradesMain: any = {};
  strategyBullTradesHedge: any = {};

  strategyBullTradesMain2: any = {};
  strategyBullTradesHedge2: any = {};

  strategyBullTradesMain3: any = {};
  strategyBullTradesHedge3: any = {};

  strategyBullTradesMain4: any = {};
  strategyBullTradesHedge4: any = {};

  showMarketProtection = false; // default hidden

  onOrderTypeChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.showMarketProtection = (value === 'Market Protection');
  }

  constructor(private strategyService: StrategyService) { }

  ngOnInit(): void {
    this.loadStrategy();
  }

  // Add strategy
  onAddStrategy() {
    const payload = {
      name: 'DefaultSession', // or dynamic from a form field
      data: {
        globalSettings: this.strategyData,
        strategies: {
          BearCallSpread: {
            trade1: {
              mainPosition: this.strategyBearTradesMain,
              hedgePosition: this.strategyBearTradesHedge
            },
            trade2: {
              mainPosition: this.strategyBearTradesMain2,
              hedgePosition: this.strategyBearTradesHedge2
            },
            trade3: {
              mainPosition: this.strategyBearTradesMain3,
              hedgePosition: this.strategyBearTradesHedge3
            },
            trade4: {
              mainPosition: this.strategyBearTradesMain4,
              hedgePosition: this.strategyBearTradesHedge4
            }
          },
          BullPutSpread: {
            trade1: {
              mainPosition: this.strategyBullTradesMain,
              hedgePosition: this.strategyBullTradesHedge
            },
            trade2: {
              mainPosition: this.strategyBullTradesMain2,
              hedgePosition: this.strategyBullTradesHedge2
            },
            trade3: {
              mainPosition: this.strategyBullTradesMain3,
              hedgePosition: this.strategyBullTradesHedge3
            },
            trade4: {
              mainPosition: this.strategyBullTradesMain4,
              hedgePosition: this.strategyBullTradesHedge4
            }
          }
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
        console.log('Full API Response:', res);

        if (res && res.length > 0) {
          const session = res[0];
          this.strategyData = session.data.globalSettings;

          // Bear trades
          this.strategyBearTradesMain = session.data.strategies.BearCallSpread.trade1.mainPosition;
          this.strategyBearTradesHedge = session.data.strategies.BearCallSpread.trade1.hedgePosition;

          this.strategyBearTradesMain2 = session.data.strategies.BearCallSpread.trade2.mainPosition;
          this.strategyBearTradesHedge2 = session.data.strategies.BearCallSpread.trade2.hedgePosition;

          this.strategyBearTradesMain3 = session.data.strategies.BearCallSpread.trade3.mainPosition;
          this.strategyBearTradesHedge3 = session.data.strategies.BearCallSpread.trade3.hedgePosition;

          this.strategyBearTradesMain4 = session.data.strategies.BearCallSpread.trade4.mainPosition;
          this.strategyBearTradesHedge4 = session.data.strategies.BearCallSpread.trade4.hedgePosition;

          // Bull trades
          this.strategyBullTradesMain = session.data.strategies.BullPutSpread.trade1.mainPosition;
          this.strategyBullTradesHedge = session.data.strategies.BullPutSpread.trade1.hedgePosition;

          this.strategyBullTradesMain2 = session.data.strategies.BullPutSpread.trade2.mainPosition;
          this.strategyBullTradesHedge2 = session.data.strategies.BullPutSpread.trade2.hedgePosition;

          this.strategyBullTradesMain3 = session.data.strategies.BullPutSpread.trade3.mainPosition;
          this.strategyBullTradesHedge3 = session.data.strategies.BullPutSpread.trade3.hedgePosition;

          this.strategyBullTradesMain4 = session.data.strategies.BullPutSpread.trade4.mainPosition;
          this.strategyBullTradesHedge4 = session.data.strategies.BullPutSpread.trade4.hedgePosition;
        }
      },
      error: (err) => console.error('Error fetching strategy:', err)
    });
  }

  readonly step = 75;
  readonly max = 1800;

  // Bear trade

  // Bear Trade 1 values
  increaseBear() {
    if (this.strategyBearTradesMain['Qty'] + this.step <= this.max) {
      this.strategyBearTradesMain['Qty'] += this.step;
    }
  }

  decreaseBear() {
    if (this.strategyBearTradesMain['Qty'] > this.step) {
      this.strategyBearTradesMain['Qty'] -= this.step;
    }
  }

  toggleBear() {
    if (this.strategyBearTradesMain['Buy/Sell'] === 'Buy') {
      this.strategyBearTradesMain['Buy/Sell'] = 'Sell';
    } else {
      this.strategyBearTradesMain['Buy/Sell'] = 'Buy';
    }
  }

  toggleCEBear() {
    if (this.strategyBearTradesMain['CE/PE'] === 'CE') {
      this.strategyBearTradesMain['CE/PE'] = 'PE';
    } else {
      this.strategyBearTradesMain['CE/PE'] = 'CE';
    }
  }

  increaseBearRow() {
    if (this.strategyBearTradesHedge['Qty'] + this.step <= this.max) {
      this.strategyBearTradesHedge['Qty'] += this.step;
    }
  }

  decreaseBearRow() {
    if (this.strategyBearTradesHedge['Qty'] > this.step) {
      this.strategyBearTradesHedge['Qty'] -= this.step;
    }
  }

  toggleBearRow() {
    if (this.strategyBearTradesHedge['Buy/Sell'] === 'Buy') {
      this.strategyBearTradesHedge['Buy/Sell'] = 'Sell';
    } else {
      this.strategyBearTradesHedge['Buy/Sell'] = 'Buy';
    }
  }

  toggleCEBearRow() {
    if (this.strategyBearTradesHedge['CE/PE'] === 'CE') {
      this.strategyBearTradesHedge['CE/PE'] = 'PE';
    } else {
      this.strategyBearTradesHedge['CE/PE'] = 'CE';
    }
  }

  // Bear Trade 2 values
  increaseBearTrade2() {
    if (this.strategyBearTradesMain2['Qty'] + this.step <= this.max) {
      this.strategyBearTradesMain2['Qty'] += this.step;
    }
  }

  decreaseBearTrade2() {
    if (this.strategyBearTradesMain2['Qty'] > this.step) {
      this.strategyBearTradesMain2['Qty'] -= this.step;
    }
  }

  toggleBearTrade2() {
    if (this.strategyBearTradesMain2['Buy/Sell'] === 'Buy') {
      this.strategyBearTradesMain2['Buy/Sell'] = 'Sell';
    } else {
      this.strategyBearTradesMain2['Buy/Sell'] = 'Buy';
    }
  }

  toggleCEBearTrade2() {
    if (this.strategyBearTradesMain2['CE/PE'] === 'CE') {
      this.strategyBearTradesMain2['CE/PE'] = 'PE';
    } else {
      this.strategyBearTradesMain2['CE/PE'] = 'CE';
    }
  }

  increaseBearRowTrade2() {
    if (this.strategyBearTradesHedge2['Qty'] + this.step <= this.max) {
      this.strategyBearTradesHedge2['Qty'] += this.step;
    }
  }

  decreaseBearRowTrade2() {
    if (this.strategyBearTradesHedge2['Qty'] > this.step) {
      this.strategyBearTradesHedge2['Qty'] -= this.step;
    }
  }

  toggleBearRowTrade2() {
    if (this.strategyBearTradesHedge2['Buy/Sell'] === 'Buy') {
      this.strategyBearTradesHedge2['Buy/Sell'] = 'Sell';
    } else {
      this.strategyBearTradesHedge2['Buy/Sell'] = 'Buy';
    }
  }

  toggleCEBearRowTrade2() {
    if (this.strategyBearTradesHedge2['CE/PE'] === 'CE') {
      this.strategyBearTradesHedge2['CE/PE'] = 'PE';
    } else {
      this.strategyBearTradesHedge2['CE/PE'] = 'CE';
    }
  }

  // Bear Trade 3 values
  increaseBearTrade3() {
    if (this.strategyBearTradesMain3['Qty'] + this.step <= this.max) {
      this.strategyBearTradesMain3['Qty'] += this.step;
    }
  }

  decreaseBearTrade3() {
    if (this.strategyBearTradesMain3['Qty'] > this.step) {
      this.strategyBearTradesMain3['Qty'] -= this.step;
    }
  }

  toggleBearTrade3() {
    if (this.strategyBearTradesMain3['Buy/Sell'] === 'Buy') {
      this.strategyBearTradesMain3['Buy/Sell'] = 'Sell';
    } else {
      this.strategyBearTradesMain3['Buy/Sell'] = 'Buy';
    }
  }

  toggleCEBearTrade3() {
    if (this.strategyBearTradesMain3['CE/PE'] === 'CE') {
      this.strategyBearTradesMain3['CE/PE'] = 'PE';
    } else {
      this.strategyBearTradesMain3['CE/PE'] = 'CE';
    }
  }

  increaseBearRowTrade3() {
    if (this.strategyBearTradesHedge3['Qty'] + this.step <= this.max) {
      this.strategyBearTradesHedge3['Qty'] += this.step;
    }
  }

  decreaseBearRowTrade3() {
    if (this.strategyBearTradesHedge3['Qty'] > this.step) {
      this.strategyBearTradesHedge3['Qty'] -= this.step;
    }
  }

  toggleBearRowTrade3() {
    if (this.strategyBearTradesHedge3['Buy/Sell'] === 'Buy') {
      this.strategyBearTradesHedge3['Buy/Sell'] = 'Sell';
    } else {
      this.strategyBearTradesHedge3['Buy/Sell'] = 'Buy';
    }
  }

  toggleCEBearRowTrade3() {
    if (this.strategyBearTradesHedge3['CE/PE'] === 'CE') {
      this.strategyBearTradesHedge3['CE/PE'] = 'PE';
    } else {
      this.strategyBearTradesHedge3['CE/PE'] = 'CE';
    }
  }

  // Bear Trade 4 values
  increaseBearTrade4() {
    if (this.strategyBearTradesMain4['Qty'] + this.step <= this.max) {
      this.strategyBearTradesMain4['Qty'] += this.step;
    }
  }

  decreaseBearTrade4() {
    if (this.strategyBearTradesMain4['Qty'] > this.step) {
      this.strategyBearTradesMain4['Qty'] -= this.step;
    }
  }

  toggleBearTrade4() {
    if (this.strategyBearTradesMain4['Buy/Sell'] === 'Buy') {
      this.strategyBearTradesMain4['Buy/Sell'] = 'Sell';
    } else {
      this.strategyBearTradesMain4['Buy/Sell'] = 'Buy';
    }
  }

  toggleCEBearTrade4() {
    if (this.strategyBearTradesMain4['CE/PE'] === 'CE') {
      this.strategyBearTradesMain4['CE/PE'] = 'PE';
    } else {
      this.strategyBearTradesMain4['CE/PE'] = 'CE';
    }
  }

  increaseBearRowTrade4() {
    if (this.strategyBearTradesHedge4['Qty'] + this.step <= this.max) {
      this.strategyBearTradesHedge4['Qty'] += this.step;
    }
  }

  decreaseBearRowTrade4() {
    if (this.strategyBearTradesHedge4['Qty'] > this.step) {
      this.strategyBearTradesHedge4['Qty'] -= this.step;
    }
  }

  toggleBearRowTrade4() {
    if (this.strategyBearTradesHedge4['Buy/Sell'] === 'Buy') {
      this.strategyBearTradesHedge4['Buy/Sell'] = 'Sell';
    } else {
      this.strategyBearTradesHedge4['Buy/Sell'] = 'Buy';
    }
  }

  toggleCEBearRowTrade4() {
    if (this.strategyBearTradesHedge4['CE/PE'] === 'CE') {
      this.strategyBearTradesHedge4['CE/PE'] = 'PE';
    } else {
      this.strategyBearTradesHedge4['CE/PE'] = 'CE';
    }
  }

  // Bull trade

  // Bull Trade 1 values
  increaseBull() {
    if (this.strategyBullTradesMain['Qty'] + this.step <= this.max) {
      this.strategyBullTradesMain['Qty'] += this.step;
    }
  }

  decreaseBull() {
    if (this.strategyBullTradesMain['Qty'] > this.step) {
      this.strategyBullTradesMain['Qty'] -= this.step;
    }
  }

  toggleBull() {
    if (this.strategyBullTradesMain['Buy/Sell'] === 'Buy') {
      this.strategyBullTradesMain['Buy/Sell'] = 'Sell';
    } else {
      this.strategyBullTradesMain['Buy/Sell'] = 'Buy';
    }
  }

  toggleCEBull() {
    if (this.strategyBullTradesMain['CE/PE'] === 'CE') {
      this.strategyBullTradesMain['CE/PE'] = 'PE';
    } else {
      this.strategyBullTradesMain['CE/PE'] = 'CE';
    }
  }

  increaseBullRow() {
    if (this.strategyBullTradesHedge['Qty'] + this.step <= this.max) {
      this.strategyBullTradesHedge['Qty'] += this.step;
    }
  }

  decreaseBullRow() {
    if (this.strategyBullTradesHedge['Qty'] > this.step) {
      this.strategyBullTradesHedge['Qty'] -= this.step;
    }
  }

  toggleBullRow() {
    if (this.strategyBullTradesHedge['Buy/Sell'] === 'Buy') {
      this.strategyBullTradesHedge['Buy/Sell'] = 'Sell';
    } else {
      this.strategyBullTradesHedge['Buy/Sell'] = 'Buy';
    }
  }

  toggleCEBullRow() {
    if (this.strategyBullTradesHedge['CE/PE'] === 'CE') {
      this.strategyBullTradesHedge['CE/PE'] = 'PE';
    } else {
      this.strategyBullTradesHedge['CE/PE'] = 'CE';
    }
  }

  // Bull Trade 2 values
  increaseBullTrade2() {
    if (this.strategyBullTradesMain2['Qty'] + this.step <= this.max) {
      this.strategyBullTradesMain2['Qty'] += this.step;
    }
  }

  decreaseBullTrade2() {
    if (this.strategyBullTradesMain2['Qty'] > this.step) {
      this.strategyBullTradesMain2['Qty'] -= this.step;
    }
  }

  toggleBullTrade2() {
    if (this.strategyBullTradesMain2['Buy/Sell'] === 'Buy') {
      this.strategyBullTradesMain2['Buy/Sell'] = 'Sell';
    } else {
      this.strategyBullTradesMain2['Buy/Sell'] = 'Buy';
    }
  }

  toggleCEBullTrade2() {
    if (this.strategyBullTradesMain2['CE/PE'] === 'CE') {
      this.strategyBullTradesMain2['CE/PE'] = 'PE';
    } else {
      this.strategyBullTradesMain2['CE/PE'] = 'CE';
    }
  }

  increaseBullRowTrade2() {
    if (this.strategyBullTradesHedge2['Qty'] + this.step <= this.max) {
      this.strategyBullTradesHedge2['Qty'] += this.step;
    }
  }

  decreaseBullRowTrade2() {
    if (this.strategyBullTradesHedge2['Qty'] > this.step) {
      this.strategyBullTradesHedge2['Qty'] -= this.step;
    }
  }

  toggleBullRowTrade2() {
    if (this.strategyBullTradesHedge2['Buy/Sell'] === 'Buy') {
      this.strategyBullTradesHedge2['Buy/Sell'] = 'Sell';
    } else {
      this.strategyBullTradesHedge2['Buy/Sell'] = 'Buy';
    }
  }

  toggleCEBullRowTrade2() {
    if (this.strategyBullTradesHedge2['CE/PE'] === 'CE') {
      this.strategyBullTradesHedge2['CE/PE'] = 'PE';
    } else {
      this.strategyBullTradesHedge2['CE/PE'] = 'CE';
    }
  }

  // Bull Trade 3 values
  increaseBullTrade3() {
    if (this.strategyBullTradesMain3['Qty'] + this.step <= this.max) {
      this.strategyBullTradesMain3['Qty'] += this.step;
    }
  }

  decreaseBullTrade3() {
    if (this.strategyBullTradesMain3['Qty'] > this.step) {
      this.strategyBullTradesMain3['Qty'] -= this.step;
    }
  }

  toggleBullTrade3() {
    if (this.strategyBullTradesMain3['Buy/Sell'] === 'Buy') {
      this.strategyBullTradesMain3['Buy/Sell'] = 'Sell';
    } else {
      this.strategyBullTradesMain3['Buy/Sell'] = 'Buy';
    }
  }

  toggleCEBullTrade3() {
    if (this.strategyBullTradesMain3['CE/PE'] === 'CE') {
      this.strategyBullTradesMain3['CE/PE'] = 'PE';
    } else {
      this.strategyBullTradesMain3['CE/PE'] = 'CE';
    }
  }

  increaseBullRowTrade3() {
    if (this.strategyBullTradesHedge3['Qty'] + this.step <= this.max) {
      this.strategyBullTradesHedge3['Qty'] += this.step;
    }
  }

  decreaseBullRowTrade3() {
    if (this.strategyBullTradesHedge3['Qty'] > this.step) {
      this.strategyBullTradesHedge3['Qty'] -= this.step;
    }
  }

  toggleBullRowTrade3() {
    if (this.strategyBullTradesHedge3['Buy/Sell'] === 'Buy') {
      this.strategyBullTradesHedge3['Buy/Sell'] = 'Sell';
    } else {
      this.strategyBullTradesHedge3['Buy/Sell'] = 'Buy';
    }
  }

  toggleCEBullRowTrade3() {
    if (this.strategyBullTradesHedge3['CE/PE'] === 'CE') {
      this.strategyBullTradesHedge3['CE/PE'] = 'PE';
    } else {
      this.strategyBullTradesHedge3['CE/PE'] = 'CE';
    }
  }

  // Bull Trade 4 values
  increaseBullTrade4() {
    if (this.strategyBullTradesMain4['Qty'] + this.step <= this.max) {
      this.strategyBullTradesMain4['Qty'] += this.step;
    }
  }

  decreaseBullTrade4() {
    if (this.strategyBullTradesMain4['Qty'] > this.step) {
      this.strategyBullTradesMain4['Qty'] -= this.step;
    }
  }

  toggleBullTrade4() {
    if (this.strategyBullTradesMain4['Buy/Sell'] === 'Buy') {
      this.strategyBullTradesMain4['Buy/Sell'] = 'Sell';
    } else {
      this.strategyBullTradesMain4['Buy/Sell'] = 'Buy';
    }
  }

  toggleCEBullTrade4() {
    if (this.strategyBullTradesMain4['CE/PE'] === 'CE') {
      this.strategyBullTradesMain4['CE/PE'] = 'PE';
    } else {
      this.strategyBullTradesMain4['CE/PE'] = 'CE';
    }
  }

  increaseBullRowTrade4() {
    if (this.strategyBullTradesHedge4['Qty'] + this.step <= this.max) {
      this.strategyBullTradesHedge4['Qty'] += this.step;
    }
  }

  decreaseBullRowTrade4() {
    if (this.strategyBullTradesHedge4['Qty'] > this.step) {
      this.strategyBullTradesHedge4['Qty'] -= this.step;
    }
  }

  toggleBullRowTrade4() {
    if (this.strategyBullTradesHedge4['Buy/Sell'] === 'Buy') {
      this.strategyBullTradesHedge4['Buy/Sell'] = 'Sell';
    } else {
      this.strategyBullTradesHedge4['Buy/Sell'] = 'Buy';
    }
  }

  toggleCEBullRowTrade4() {
    if (this.strategyBullTradesHedge4['CE/PE'] === 'CE') {
      this.strategyBullTradesHedge4['CE/PE'] = 'PE';
    } else {
      this.strategyBullTradesHedge4['CE/PE'] = 'CE';
    }
  }
}
