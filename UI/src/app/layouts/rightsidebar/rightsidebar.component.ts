import { Component, EventEmitter, Output, TemplateRef, ViewChild } from '@angular/core';

import { EventService } from '../../core/services/event.service';
import { SimplebarAngularModule } from 'simplebar-angular';
import { CommonModule } from '@angular/common';
import { RootReducerState } from '../../store';
import { Store } from '@ngrx/store';
import { changelayout, changeLayoutPosition, changeLayoutWidth, changeMode, changeSidebarColor, changeSidebarSize, changeSidebarView, changeSidebarVisibility, changeTopbar, resetLayoutState } from '../../store/layouts/layout-action';

@Component({
  selector: 'app-rightsidebar',
  templateUrl: './rightsidebar.component.html',
  styleUrls: ['./rightsidebar.component.scss'],
  standalone: true,
  imports: [CommonModule, SimplebarAngularModule]
})
export class RightsidebarComponent {

  layout: string | undefined;
  mode: string | undefined;
  theme: string | undefined;
  width: string | undefined;
  position: string | undefined;
  topbar: string | undefined;
  size: string | undefined;
  sidebarView: string | undefined;
  sidebar: string | undefined;
  attribute: any;
  sidebarImage: any;
  sidebarVisibility: any;
  preLoader: any;
  grd: any;
  showBackDrop = false

  @Output() settingsButtonClicked = new EventEmitter();
  constructor(private eventService: EventService, private store: Store<RootReducerState>) { }

  ngOnInit(): void {
    this.store.select('layout').subscribe((data) => {
      this.layout = data.LAYOUT;
      this.mode = data.LAYOUT_MODE;
      this.width = data.LAYOUT_WIDTH;
      this.position = data.LAYOUT_POSITION;
      this.topbar = data.TOPBAR;
      this.size = data.SIDEBAR_SIZE;
      this.sidebarView = data.SIDEBAR_VIEW;
      this.sidebar = data.SIDEBAR_COLOR;
      this.sidebarVisibility = data.SIDEBAR_VISIBILITY
    })

  }

  ngAfterViewInit() {
  }

  /**
   * Change the layout onclick
   * @param layout Change the layout
   */

  // Mode Change
  changeMode(mode: string) {
    this.store.dispatch(changeMode({ mode }));
  }

  changeLayout(layout: string) {
    this.store.dispatch(changelayout({ layout }));
  }

  reset() {
    this.store.dispatch(resetLayoutState());
  }

  // Position Change
  changePosition(layoutPosition: string) {
    this.store.dispatch(changeLayoutPosition({ layoutPosition }));
  }

  // Width Change
  changeWidth(layoutWidth: string) {
    this.store.dispatch(changeLayoutWidth({ layoutWidth }));
  }

  // Topbar Change
  changeTopColor(topbarColor: string) {
    this.store.dispatch(changeTopbar({ topbarColor }));
  }

  // Sidebar Size Change
  changeSidebarSize(sidebarSize: string) {
    this.store.dispatch(changeSidebarSize({ sidebarSize }));
  }

  // Sidebar Size Change
  changeSidebar(sidebarView: string) {
    this.store.dispatch(changeSidebarView({ sidebarView }));
  }

  // Sidebar Color Change
  changeSidebarColor(sidebarColor: string) {
    this.store.dispatch(changeSidebarColor({ sidebarColor }));
  }

  // Add Active Class
  addActive(grdSidebar: any) {
    this.grd = grdSidebar;
    document.documentElement.setAttribute('data-sidebar', grdSidebar)
    document.getElementById('collapseBgGradient')?.classList.toggle('show');
    document.getElementById('collapseBgGradient1')?.classList.add('active');
  }

  // Remove Active Class
  removeActive() {
    this.grd = '';
    document.getElementById('collapseBgGradient1')?.classList.remove('active');
    document.getElementById('collapseBgGradient')?.classList.remove('show');
  }

  closeoffcanvas() {
    document.querySelector('.offcanvas')?.classList.remove('show');
    document.getElementById('backdrop')?.classList.remove('show');

    this.showBackDrop = false;
  }

  // Sidebar Image Change
  changeSidebarImage(img: string) {
    this.sidebarImage = img;
    document.documentElement.setAttribute('data-sidebar-image', img);
  }

  // PreLoader Image Change
  changeLoader(loader: string) {
    this.preLoader = loader;
    document.documentElement.setAttribute('data-preloader', loader);
    var preloader = document.getElementById("preloader");
    if (preloader) {
      setTimeout(function () {
        (document.getElementById("preloader") as HTMLElement).style.opacity = "0";
        (document.getElementById("preloader") as HTMLElement).style.visibility = "hidden";
      }, 1000);
    }
  }

  // When the user clicks on the button, scroll to the top of the document
  topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }

  //  Filter Offcanvas Set
  openEnd() {
    document.querySelector('.offcanvas')?.classList.add('show')
    document.getElementById('backdrop')?.classList.add('show')
    this.showBackDrop = true;
    setTimeout(() => {
      this.attribute = document.documentElement.getAttribute('data-layout')
      if (this.attribute == 'vertical') {
        var vertical = document.getElementById('customizer-layout01') as HTMLInputElement;
        if (vertical != null) {
          vertical.setAttribute('checked', 'true');
        }
      }
      if (this.attribute == 'horizontal') {
        const horizontal = document.getElementById('customizer-layout02');
        if (horizontal != null) {
          horizontal.setAttribute('checked', 'true');
        }
      }
      if (this.attribute == 'twocolumn') {
        const Twocolumn = document.getElementById('customizer-layout03');
        if (Twocolumn != null) {
          Twocolumn.setAttribute('checked', 'true');
        }
      }
      if (this.attribute == 'semibox') {
        const Twocolumn = document.getElementById('customizer-layout04');
        if (Twocolumn != null) {
          Twocolumn.setAttribute('checked', 'true');
        }
      }
    }, 100);
  }

}
