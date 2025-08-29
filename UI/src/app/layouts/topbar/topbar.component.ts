import { Component, EventEmitter, Inject, Output, PLATFORM_ID } from '@angular/core';
import { SimplebarAngularModule } from 'simplebar-angular';
import { Store } from '@ngrx/store';
import { getLayoutMode, getSidebarSize } from '../../store/layouts/layout-selector';
import { LAYOUT_MODE, SIDEBAR_SIZE } from '../../store/layouts/layout';
import { changeMode, changeSidebarSize } from '../../store/layouts/layout-action';
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { LanguageService } from '../../core/services/language.service';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
	selector: 'app-topbar',
	standalone: true,
	imports: [SimplebarAngularModule, NgbDropdownModule, CommonModule],
	templateUrl: './topbar.component.html',
	styleUrl: './topbar.component.scss'
})
export class TopbarComponent {
	MODE = LAYOUT_MODE;
	SIDEBAR_SIZE = SIDEBAR_SIZE
	currantMode!: string;
	sidebarSize!: string;
	element: any;

	selectedItem!: any;
	cookieValue: any;
	flagvalue: any;
	valueset: any;
	countryName: any;
	userData: any;
	
	username: string = '';
	isLoggedIn: boolean = false;

	@Output() mobileMenuButtonClicked = new EventEmitter();

	listLang = [
		{ text: 'English', flag: 'assets/images/flags/us.svg', lang: 'en' },
		{ text: 'Española', flag: 'assets/images/flags/spain.svg', lang: 'sp' },
		{ text: 'Deutsche', flag: 'assets/images/flags/germany.svg', lang: 'gr' },
		{ text: 'Italiana', flag: 'assets/images/flags/italy.svg', lang: 'it' },
		{ text: 'русский', flag: 'assets/images/flags/russia.svg', lang: 'ru' },
		{ text: '中国人', flag: 'assets/images/flags/china.svg', lang: 'ch' },
		{ text: 'français', flag: 'assets/images/flags/french.svg', lang: 'fr' },
		{ text: 'Arabic', flag: 'assets/images/flags/ae.svg', lang: 'ar' },
	];

	constructor(private store: Store,
		private authService: AuthenticationService,
		private router: Router,
		@Inject(DOCUMENT) private document: any,
		@Inject(PLATFORM_ID) private platformId: object,
		public languageService: LanguageService,
		public _cookiesService: CookieService
	) {
		this.element = document.documentElement;

		this.store.select(getLayoutMode).subscribe((mode) => {
			this.currantMode = mode
		})
		this.store.select(getSidebarSize).subscribe((sSize) => {
			this.sidebarSize = sSize
		})
	}

	ngOnInit(): void {

		// Cookies wise Language set
		this.cookieValue = this._cookiesService.get('lang');
		const val = this.listLang.filter(x => x.lang === this.cookieValue);
		this.countryName = val.map(element => element.text);
		if (val.length === 0) {
			if (this.flagvalue === undefined) { this.valueset = 'assets/images/flags/us.svg'; }
		} else {
			this.flagvalue = val.map(element => element.flag);
		}

		this.authService.getAuthStatus().subscribe((status: boolean) => {
			this.isLoggedIn = status;
		});
		if (isPlatformBrowser(this.platformId)) {
			this.checkLoginState();
		}
	}

	checkLoginState(): void {
		this.isLoggedIn = this.authService.isLoggedIn();
		if (this.isLoggedIn) {
			this.username = localStorage.getItem('username') || 'User';
		}
	}

	modeChange() {
		const mode = this.currantMode === this.MODE.LIGHTMODE ? this.MODE.DARKMODE : this.MODE.LIGHTMODE
		this.store.dispatch(changeMode({ mode }));
	}

	windowScroll() {
		if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
			(document.getElementById('back-to-top') as HTMLElement).style.display = "block";
			document.getElementById('page-topbar')?.classList.add('topbar-shadow')
		} else {
			(document.getElementById('back-to-top') as HTMLElement).style.display = "none";
			document.getElementById('page-topbar')?.classList.remove('topbar-shadow')
		}
	}

	toggleMobileMenu(event: any) {
		// const sidebarSize = this.sidebarSize === this.SIDEBAR_SIZE.SMALL ? this.SIDEBAR_SIZE.LARGE : this.SIDEBAR_SIZE.SMALL;
		// this.store.dispatch(changeSidebarSize({ sidebarSize }));
		document.querySelector('.hamburger-icon')?.classList.toggle('open')
		event.preventDefault();
		this.mobileMenuButtonClicked.emit();
	}

	fullscreen() {
		document.body.classList.toggle('fullscreen-enable');
		if (
			!document.fullscreenElement && !this.element.mozFullScreenElement &&
			!this.element.webkitFullscreenElement) {
			if (this.element.requestFullscreen) {
				this.element.requestFullscreen();
			} else if (this.element.mozRequestFullScreen) {
				/* Firefox */
				this.element.mozRequestFullScreen();
			} else if (this.element.webkitRequestFullscreen) {
				/* Chrome, Safari and Opera */
				this.element.webkitRequestFullscreen();
			} else if (this.element.msRequestFullscreen) {
				/* IE/Edge */
				this.element.msRequestFullscreen();
			}
		} else {
			if (this.document.exitFullscreen) {
				this.document.exitFullscreen();
			} else if (this.document.mozCancelFullScreen) {
				/* Firefox */
				this.document.mozCancelFullScreen();
			} else if (this.document.webkitExitFullscreen) {
				/* Chrome, Safari and Opera */
				this.document.webkitExitFullscreen();
			} else if (this.document.msExitFullscreen) {
				/* IE/Edge */
				this.document.msExitFullscreen();
			}
		}
	}

	setLanguage(text: string, lang: string, flag: string) {
		this.countryName = text;
		this.flagvalue = flag;
		this.cookieValue = lang;
		this.languageService.setLanguage(lang);
	}

	logout(): void {
		this.authService.logout(); // Clear auth data
		this.router.navigate(['/auth']); // Redirect to login page
	}
}
