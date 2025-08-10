import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {

  readonly step = 75;
  readonly max = 1800;

  // Bull trade values
  bullQuantity = 75;
  // Bear trade values
  bearQuantity = 75;

  increaseBull() {
    if (this.bullQuantity + this.step <= this.max) {
      this.bullQuantity += this.step;
    }
  }

  decreaseBull() {
    if (this.bullQuantity > this.step) {
      this.bullQuantity -= this.step;
    }
  }

  increaseBear() {
    if (this.bearQuantity + this.step <= this.max) {
      this.bearQuantity += this.step;
    }
  }

  decreaseBear() {
    if (this.bearQuantity > this.step) {
      this.bearQuantity -= this.step;
    }
  }

  // Bull trade values
  bullQuantity2 = 75;
  // Bear trade values
  bearQuantity2 = 75;

  increaseBull2() {
    if (this.bullQuantity2 + this.step <= this.max) {
      this.bullQuantity2 += this.step;
    }
  }

  decreaseBull2() {
    if (this.bullQuantity2 > this.step) {
      this.bullQuantity2 -= this.step;
    }
  }

  increaseBear2() {
    if (this.bearQuantity2 + this.step <= this.max) {
      this.bearQuantity2 += this.step;
    }
  }

  decreaseBear2() {
    if (this.bearQuantity2 > this.step) {
      this.bearQuantity2 -= this.step;
    }
  }

  // Bull trade values
  bullQuantity3 = 75;
  // Bear trade values
  bearQuantity3 = 75;

  increaseBull3() {
    if (this.bullQuantity3 + this.step <= this.max) {
      this.bullQuantity3 += this.step;
    }
  }

  decreaseBull3() {
    if (this.bullQuantity3 > this.step) {
      this.bullQuantity3 -= this.step;
    }
  }

  increaseBear3() {
    if (this.bearQuantity3 + this.step <= this.max) {
      this.bearQuantity3 += this.step;
    }
  }

  decreaseBear3() {
    if (this.bearQuantity3 > this.step) {
      this.bearQuantity3 -= this.step;
    }
  }

  // BULL trade
  @Input() bullIsBuy: boolean = false; // false = Sell, true = Buy
  @Output() bullChanged = new EventEmitter<boolean>();

  toggleBull() {
    this.bullIsBuy = !this.bullIsBuy;
    this.bullChanged.emit(this.bullIsBuy);
  }

  @Input() bullIsCE: boolean = false; // false = PE, true = CE
  @Output() bullChangedCE = new EventEmitter<boolean>();

  toggleBullCE() {
    this.bullIsCE = !this.bullIsCE;
    this.bullChangedCE.emit(this.bullIsCE);
  }

  // BEAR trade
  @Input() bearIsBuy: boolean = false;
  @Output() bearChanged = new EventEmitter<boolean>();

  toggleBear() {
    this.bearIsBuy = !this.bearIsBuy;
    this.bearChanged.emit(this.bearIsBuy);
  }

  @Input() bearIsCE: boolean = false;
  @Output() bearChangedCE = new EventEmitter<boolean>();

  toggleBearCE() {
    this.bearIsCE = !this.bearIsCE;
    this.bearChangedCE.emit(this.bearIsCE);
  }

    // BULL trade 2
  @Input() bullIsBuy2: boolean = false; // false = Sell, true = Buy
  @Output() bullChanged2 = new EventEmitter<boolean>();

  toggleBull2() {
    this.bullIsBuy2 = !this.bullIsBuy2;
    this.bullChanged2.emit(this.bullIsBuy2);
  }

  @Input() bullIsCE2: boolean = false; // false = PE, true = CE
  @Output() bullChangedCE2 = new EventEmitter<boolean>();

  toggleBullCE2() {
    this.bullIsCE2 = !this.bullIsCE2;
    this.bullChangedCE2.emit(this.bullIsCE2);
  }

  // BEAR trade 2
  @Input() bearIsBuy2: boolean = false;
  @Output() bearChanged2 = new EventEmitter<boolean>();

  toggleBear2() {
    this.bearIsBuy2 = !this.bearIsBuy2;
    this.bearChanged2.emit(this.bearIsBuy2);
  }

  @Input() bearIsCE2: boolean = false;
  @Output() bearChangedCE2 = new EventEmitter<boolean>();

  toggleBearCE2() {
    this.bearIsCE2 = !this.bearIsCE2;
    this.bearChangedCE2.emit(this.bearIsCE2);
  }

  // BULL trade 3
  @Input() bullIsBuy3: boolean = false; // false = Sell, true = Buy
  @Output() bullChanged3 = new EventEmitter<boolean>();

  toggleBull3() {
    this.bullIsBuy3 = !this.bullIsBuy3;
    this.bullChanged3.emit(this.bullIsBuy3);
  }

  @Input() bullIsCE3: boolean = false; // false = PE, true = CE
  @Output() bullChangedCE3 = new EventEmitter<boolean>();

  toggleBullCE3() {
    this.bullIsCE3 = !this.bullIsCE3;
    this.bullChangedCE3.emit(this.bullIsCE3);
  }

  // BEAR trade 3
  @Input() bearIsBuy3: boolean = false;
  @Output() bearChanged3 = new EventEmitter<boolean>();

  toggleBear3() {
    this.bearIsBuy3 = !this.bearIsBuy3;
    this.bearChanged3.emit(this.bearIsBuy3);
  }

  @Input() bearIsCE3: boolean = false;
  @Output() bearChangedCE3 = new EventEmitter<boolean>();

  toggleBearCE3() {
    this.bearIsCE3 = !this.bearIsCE3;
    this.bearChangedCE3.emit(this.bearIsCE3);
  }

}
