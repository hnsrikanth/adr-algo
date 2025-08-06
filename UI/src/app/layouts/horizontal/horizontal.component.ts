import { Component } from '@angular/core';
import { HorizontalTopbarComponent } from '../horizontal-topbar/horizontal-topbar.component';
import { RightsidebarComponent } from '../rightsidebar/rightsidebar.component';
import { FooterComponent } from '../footer/footer.component';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { TopbarComponent } from '../topbar/topbar.component';

@Component({
  selector: 'app-horizontal',
  standalone: true,
  imports: [TopbarComponent, SidebarComponent, RouterModule, FooterComponent, RightsidebarComponent, HorizontalTopbarComponent],
  templateUrl: './horizontal.component.html',
  styleUrl: './horizontal.component.scss'
})
export class HorizontalComponent {

  // onSettingsButtonClicked() {
  //   document.body.classList.toggle('right-bar-enabled');
  //   const rightBar = document.getElementById('theme-settings-offcanvas');
  //   if (rightBar != null) {
  //     rightBar.classList.toggle('show');
  //     rightBar.setAttribute('style', "visibility: visible;");

  //   }
  // }

}
