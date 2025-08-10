import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {

  showMarketProtection = false; // default hidden

  onOrderTypeChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.showMarketProtection = (value === 'Market Protection');
  }

  readonly step = 75;
  readonly max = 1800;

  // Bull trade values
  bullQuantity = 75;
  bullQuantityRow = 75;
  // Bear trade values
  bearQuantity = 75;
  bearQuantityRow = 75;

  increaseBull() {
    if (this.bullQuantity + this.step <= this.max) {
      this.bullQuantity += this.step;
    }
  }

  increaseBullRow() {
    if (this.bullQuantityRow + this.step <= this.max) {
      this.bullQuantityRow += this.step;
    }
  }

  decreaseBull() {
    if (this.bullQuantity > this.step) {
      this.bullQuantity -= this.step;
    }
  }

  decreaseBullRow() {
    if (this.bullQuantityRow > this.step) {
      this.bullQuantityRow -= this.step;
    }
  }

  increaseBear() {
    if (this.bearQuantity + this.step <= this.max) {
      this.bearQuantity += this.step;
    }
  }

  increaseBearRow() {
    if (this.bearQuantityRow + this.step <= this.max) {
      this.bearQuantityRow += this.step;
    }
  }

  decreaseBear() {
    if (this.bearQuantity > this.step) {
      this.bearQuantity -= this.step;
    }
  }

  decreaseBearRow() {
    if (this.bearQuantityRow > this.step) {
      this.bearQuantityRow -= this.step;
    }
  }

  // BULL trade
  bullIsBuy = false;

  toggleBull() {
    this.bullIsBuy = !this.bullIsBuy;
  }

  bullIsBuyRow = false;

  toggleBullRow() {
    this.bullIsBuyRow = !this.bullIsBuyRow;
  }

  bullIsCE = false;

  toggleBullCE() {
    this.bullIsCE = !this.bullIsCE;
  }

  bullIsCERow = false;

  toggleBullCERow() {
    this.bullIsCERow = !this.bullIsCERow;
  }

  // BEAR trade
  bearIsBuy = false;

  toggleBear() {
    this.bearIsBuy = !this.bearIsBuy;
  }

  bearIsBuyRow = false;

  toggleBearRow() {
    this.bearIsBuyRow = !this.bearIsBuyRow;
  }

  bearIsCE = false;

  toggleBearCE() {
    this.bearIsCE = !this.bearIsCE;
  }

  bearIsCERow = false;

  toggleBearCERow() {
    this.bearIsCERow = !this.bearIsCERow;
  }

  // Trade 2 values

  // Bull trade values
  bullQuantityTrade2 = 75;
  bullQuantityRowTrade2 = 75;
  // Bear trade values
  bearQuantityTrade2 = 75;
  bearQuantityRowTrade2 = 75;

  increaseBullTrade2() {
    if (this.bullQuantityTrade2 + this.step <= this.max) {
      this.bullQuantityTrade2 += this.step;
    }
  }

  increaseBullRowTrade2() {
    if (this.bullQuantityRowTrade2 + this.step <= this.max) {
      this.bullQuantityRowTrade2 += this.step;
    }
  }

  decreaseBullTrade2() {
    if (this.bullQuantityTrade2 > this.step) {
      this.bullQuantityTrade2 -= this.step;
    }
  }

  decreaseBullRowTrade2() {
    if (this.bullQuantityRowTrade2 > this.step) {
      this.bullQuantityRowTrade2 -= this.step;
    }
  }

  increaseBearTrade2() {
    if (this.bearQuantityTrade2 + this.step <= this.max) {
      this.bearQuantityTrade2 += this.step;
    }
  }

  increaseBearRowTrade2() {
    if (this.bearQuantityRowTrade2 + this.step <= this.max) {
      this.bearQuantityRowTrade2 += this.step;
    }
  }

  decreaseBearTrade2() {
    if (this.bearQuantityTrade2 > this.step) {
      this.bearQuantityTrade2 -= this.step;
    }
  }

  decreaseBearRowTrade2() {
    if (this.bearQuantityRowTrade2 > this.step) {
      this.bearQuantityRowTrade2 -= this.step;
    }
  }

  // BULL trade
  bullIsBuyTrade2 = false;

  toggleBullTrade2() {
    this.bullIsBuyTrade2 = !this.bullIsBuyTrade2;
  }

  bullIsBuyRowTrade2 = false;

  toggleBullRowTrade2() {
    this.bullIsBuyRowTrade2 = !this.bullIsBuyRowTrade2;
  }

  bullIsCETrade2 = false;

  toggleBullCETrade2() {
    this.bullIsCETrade2 = !this.bullIsCETrade2;
  }

  bullIsCERowTrade2 = false;

  toggleBullCERowTrade2() {
    this.bullIsCERowTrade2 = !this.bullIsCERowTrade2;
  }

  // BEAR trade
  bearIsBuyTrade2 = false;

  toggleBearTrade2() {
    this.bearIsBuyTrade2 = !this.bearIsBuyTrade2;
  }

  bearIsBuyRowTrade2 = false;

  toggleBearRowTrade2() {
    this.bearIsBuyRowTrade2 = !this.bearIsBuyRowTrade2;
  }

  bearIsCETrade2 = false;

  toggleBearCETrade2() {
    this.bearIsCETrade2 = !this.bearIsCETrade2;
  }

  bearIsCERowTrade2 = false;

  toggleBearCERowTrade2() {
    this.bearIsCERowTrade2 = !this.bearIsCERowTrade2;
  }

  // Trade 3 values

  // Bull trade values
  bullQuantityTrade3 = 75;
  bullQuantityRowTrade3 = 75;
  // Bear trade values
  bearQuantityTrade3 = 75;
  bearQuantityRowTrade3 = 75;

  increaseBullTrade3() {
    if (this.bullQuantityTrade3 + this.step <= this.max) {
      this.bullQuantityTrade3 += this.step;
    }
  }

  increaseBullRowTrade3() {
    if (this.bullQuantityRowTrade3 + this.step <= this.max) {
      this.bullQuantityRowTrade3 += this.step;
    }
  }

  decreaseBullTrade3() {
    if (this.bullQuantityTrade3 > this.step) {
      this.bullQuantityTrade3 -= this.step;
    }
  }

  decreaseBullRowTrade3() {
    if (this.bullQuantityRowTrade3 > this.step) {
      this.bullQuantityRowTrade3 -= this.step;
    }
  }

  increaseBearTrade3() {
    if (this.bearQuantityTrade3 + this.step <= this.max) {
      this.bearQuantityTrade3 += this.step;
    }
  }

  increaseBearRowTrade3() {
    if (this.bearQuantityRowTrade3 + this.step <= this.max) {
      this.bearQuantityRowTrade3 += this.step;
    }
  }

  decreaseBearTrade3() {
    if (this.bearQuantityTrade3 > this.step) {
      this.bearQuantityTrade3 -= this.step;
    }
  }

  decreaseBearRowTrade3() {
    if (this.bearQuantityRowTrade3 > this.step) {
      this.bearQuantityRowTrade3 -= this.step;
    }
  }

  // BULL trade
  bullIsBuyTrade3 = false;

  toggleBullTrade3() {
    this.bullIsBuyTrade3 = !this.bullIsBuyTrade3;
  }

  bullIsBuyRowTrade3 = false;

  toggleBullRowTrade3() {
    this.bullIsBuyRowTrade3 = !this.bullIsBuyRowTrade3;
  }

  bullIsCETrade3 = false;

  toggleBullCETrade3() {
    this.bullIsCETrade3 = !this.bullIsCETrade3;
  }

  bullIsCERowTrade3 = false;

  toggleBullCERowTrade3() {
    this.bullIsCERowTrade3 = !this.bullIsCERowTrade3;
  }

  // BEAR trade
  bearIsBuyTrade3 = false;

  toggleBearTrade3() {
    this.bearIsBuyTrade3 = !this.bearIsBuyTrade3;
  }

  bearIsBuyRowTrade3 = false;

  toggleBearRowTrade3() {
    this.bearIsBuyRowTrade3 = !this.bearIsBuyRowTrade3;
  }

  bearIsCETrade3 = false;

  toggleBearCETrade3() {
    this.bearIsCETrade3 = !this.bearIsCETrade3;
  }

  bearIsCERowTrade3 = false;

  toggleBearCERowTrade3() {
    this.bearIsCERowTrade3 = !this.bearIsCERowTrade3;
  }
}
