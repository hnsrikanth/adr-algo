import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { MENU } from './menu';
import { MenuItem } from './menu.model';

import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { SimplebarAngularModule } from 'simplebar-angular';
import { LanguageService } from '../../core/services/language.service';
import { AuthenticationService } from '../../core/services/auth.service';

import { HttpClient } from '@angular/common/http';

@Component({
	selector: 'app-horizontal-topbar',
	templateUrl: './horizontal-topbar.component.html',
	styleUrls: ['./horizontal-topbar.component.scss'],
	standalone: true,
	imports: [TranslateModule, SimplebarAngularModule, CommonModule, RouterModule],
	providers: [LanguageService]
})
export class HorizontalTopbarComponent {
	menu: any;
	toggle: any = true;
	menuItems: MenuItem[] = [];
	@ViewChild('sideMenu') sideMenu!: ElementRef;
	@Output() mobileMenuButtonClicked = new EventEmitter();
	username: string | null = null;

	isLoading: boolean = false;
	successMessage: string | null = null;
	errorMessage: string | null = null;

	hasTodayToken: boolean = false; // ✅ flag to show tick or cross

	constructor(private router: Router, public translate: TranslateService, private authService: AuthenticationService, private http: HttpClient) {
		translate.setDefaultLang('en');
	}

	ngOnInit(): void {
		this.menuItems = MENU;
		// Retrieve username from the auth service (or localStorage)
		this.username = this.authService.getUsername();

		// Dynamically filter menu based on the username
		this.menuItems = MENU.filter((item) => {
			if (item.label === 'MENUITEMS.ADMINKITE.LIST.KITE') {
				return this.username === 'admin'; // Show "Kite Connect" only for admin
			}
			return true; // Show all other menu items
		});

		// Check Kite callback on initialization
		this.checkKiteCallback();
		this.checkAccessTokenFromDB(); // ✅ check DB when component loads
	}

	isAdmin(): boolean {
		return this.username === 'admin'; // Check if the logged-in user is admin
	}

	/***
	 * Activate droup down set
	 */
	ngAfterViewInit() {
		this.initActiveMenu();
	}

	removeActivation(items: any) {
		items.forEach((item: any) => {
			if (item.classList.contains("menu-link")) {
				if (!item.classList.contains("active")) {
					item.setAttribute("aria-expanded", false);
				}
				(item.nextElementSibling) ? item.nextElementSibling.classList.remove("show") : null;
			}
			if (item.classList.contains("nav-link")) {
				if (item.nextElementSibling) {
					item.nextElementSibling.classList.remove("show");
				}
				item.setAttribute("aria-expanded", false);
			}
			item.classList.remove("active");
		});
	}

	toggleSubItem(event: any) {
		let isCurrentMenuId = event.target.closest('a.nav-link');
		let isMenu = isCurrentMenuId.nextElementSibling as any;
		if (isMenu.classList.contains("show")) {
			isMenu.classList.remove("show");
			isCurrentMenuId.setAttribute("aria-expanded", "false");
		} else {
			let dropDowns = Array.from(document.querySelectorAll('.sub-menu'));
			dropDowns.forEach((node: any) => {
				node.classList.remove('show');
			});

			let subDropDowns = Array.from(document.querySelectorAll('.menu-dropdown .nav-link'));
			subDropDowns.forEach((submenu: any) => {
				submenu.setAttribute('aria-expanded', "false");
			});

			if (event.target && event.target.nextElementSibling) {
				isCurrentMenuId.setAttribute("aria-expanded", "true");
				event.target.nextElementSibling.classList.toggle("show");
			}
		}
	};

	toggleExtraSubItem(event: any) {
		let isCurrentMenuId = event.target.closest('a.nav-link');
		let isMenu = isCurrentMenuId.nextElementSibling as any;
		if (isMenu.classList.contains("show")) {
			isMenu.classList.remove("show");
			isCurrentMenuId.setAttribute("aria-expanded", "false");
		} else {
			let dropDowns = Array.from(document.querySelectorAll('.extra-sub-menu'));
			dropDowns.forEach((node: any) => {
				node.classList.remove('show');
			});

			let subDropDowns = Array.from(document.querySelectorAll('.menu-dropdown .nav-link'));
			subDropDowns.forEach((submenu: any) => {
				submenu.setAttribute('aria-expanded', "false");
			});

			if (event.target && event.target.nextElementSibling) {
				isCurrentMenuId.setAttribute("aria-expanded", "true");
				event.target.nextElementSibling.classList.toggle("show");
			}
		}
	};

	// Click wise Parent active class add
	toggleParentItem(event: any) {
		let isCurrentMenuId = event.target.closest('a.nav-link');
		let dropDowns = Array.from(document.querySelectorAll('#navbar-nav .show'));
		dropDowns.forEach((node: any) => {
			node.classList.remove('show');
		});
		const ul = document.getElementById("navbar-nav");
		if (ul) {
			const iconItems = Array.from(ul.getElementsByTagName("a"));
			let activeIconItems = iconItems.filter((x: any) => x.classList.contains("active"));
			activeIconItems.forEach((item: any) => {
				item.setAttribute('aria-expanded', "false")
				item.classList.remove("active");
			});
		}
		isCurrentMenuId.setAttribute("aria-expanded", "true");
		if (isCurrentMenuId) {
			this.activateParentDropdown(isCurrentMenuId);
		}
	}

	toggleItem(event: any) {
		let isCurrentMenuId = event.target.closest('a.nav-link');
		let isMenu = isCurrentMenuId.nextElementSibling as any;
		if (isMenu.classList.contains("show")) {
			isMenu.classList.remove("show");
			isCurrentMenuId.setAttribute("aria-expanded", "false");
		} else {
			let dropDowns = Array.from(document.querySelectorAll('#navbar-nav .show'));
			dropDowns.forEach((node: any) => {
				node.classList.remove('show');
			});
			(isMenu) ? isMenu.classList.add('show') : null;
			const ul = document.getElementById("navbar-nav");
			if (ul) {
				const iconItems = Array.from(ul.getElementsByTagName("a"));
				let activeIconItems = iconItems.filter((x: any) => x.classList.contains("active"));
				activeIconItems.forEach((item: any) => {
					item.setAttribute('aria-expanded', "false")
					item.classList.remove("active");
				});
			}
			isCurrentMenuId.setAttribute("aria-expanded", "true");
			if (isCurrentMenuId) {
				this.activateParentDropdown(isCurrentMenuId);
			}
		}
	}

	activateParentDropdown(item: any) {
		item.classList.add("active");
		let parentCollapseDiv = item.closest(".collapse.menu-dropdown");

		if (parentCollapseDiv) {
			// to set aria expand true remaining
			parentCollapseDiv.classList.add("show");
			parentCollapseDiv.parentElement.children[0].classList.add("active");
			parentCollapseDiv.parentElement.children[0].setAttribute("aria-expanded", "true");
			if (parentCollapseDiv.parentElement.closest(".collapse.menu-dropdown")) {
				parentCollapseDiv.parentElement.closest(".collapse").classList.add("show");
				if (parentCollapseDiv.parentElement.closest(".collapse").previousElementSibling)
					parentCollapseDiv.parentElement.closest(".collapse").previousElementSibling.classList.add("active");
				if (parentCollapseDiv.parentElement.closest(".collapse").previousElementSibling.closest(".collapse")) {
					parentCollapseDiv.parentElement.closest(".collapse").previousElementSibling.closest(".collapse").classList.add("show");
					parentCollapseDiv.parentElement.closest(".collapse").previousElementSibling.closest(".collapse").previousElementSibling.classList.add("active");
				}
			}
			return false;
		}
		return false;
	}

	updateActive(event: any) {
		const ul = document.getElementById("navbar-nav");
		if (ul) {
			const items = Array.from(ul.querySelectorAll("a.nav-link"));
			this.removeActivation(items);
		}
		this.activateParentDropdown(event.target);
	}

	initActiveMenu() {
		const pathName = window.location.pathname;
		const ul = document.getElementById("navbar-nav");
		if (ul) {
			const items = Array.from(ul.querySelectorAll("a.nav-link"));
			let activeItems = items.filter((x: any) => x.classList.contains("active"));
			this.removeActivation(activeItems);

			let matchingMenuItem = items.find((x: any) => {
				return x.pathname === pathName;
			});
			if (matchingMenuItem) {
				this.activateParentDropdown(matchingMenuItem);
			}
		}
	}

	/**
	 * Returns true or false if given menu item has child or not
	 * @param item menuItem
	 */
	hasItems(item: MenuItem) {
		return item.subItems !== undefined ? item.subItems.length > 0 : false;
	}

	/**
	 * Toggle the menu bar when having mobile screen
	 */
	toggleMobileMenu(event: any) {
		var sidebarsize = document.documentElement.getAttribute("data-sidebar-size");
		if (sidebarsize == 'sm-hover-active') {
			document.documentElement.setAttribute("data-sidebar-size", 'sm-hover')
		} else {
			document.documentElement.setAttribute("data-sidebar-size", 'sm-hover-active')
		}
	}

	/**
	 * SidebarHide modal
	 * @param content modal content
	 */
	SidebarHide() {
		document.body.classList.remove('vertical-sidebar-enable');
	}

	/**
	 * Generate Access Token using Kite Connect API
	 * This function is called when the user clicks on the "Refresh Token" button.
	 * It redirects the user to the Kite login page, and upon successful login,
	 * it retrieves the request token from the URL parameters and generates an access token.
	 */

	loginToKiteAccount() {
		// Redirect to Kite login page through backend API
		window.location.href = 'http://localhost:3000/api/login';
	}

	checkKiteCallback() {
		const urlParams = new URLSearchParams(window.location.search);
		const action = urlParams.get('action');
		const type = urlParams.get('type');
		const status = urlParams.get('status');
		const requestToken = urlParams.get('request_token');

		if (action === 'login' && type === 'login' && status === 'success' && requestToken) {
			const broker = 'Zerodha'; // Adjust this value as needed
			const user = 'Kite';
			this.isLoading = true;
			this.successMessage = null;
			this.errorMessage = null;

			// Call the API to generate the access token
			this.http
				.post('http://localhost:3000/api/master-broker-tokens', {
					user,
					broker,
					requestToken,
				})
				.subscribe({
					next: (response: any) => {
						this.isLoading = false;
						this.successMessage = 'Access token generated successfully!';
						console.log('Access token response:', response);

						this.checkAccessTokenFromDB(); // refresh token status after saving
					},
					error: (error) => {
						this.isLoading = false;
						this.errorMessage = 'Error generating access token. Please try again.';
						console.error('Error generating session or storing access token', error);
					},
				});
		}
	}

	checkAccessTokenFromDB() {
		this.http.get<any[]>('http://localhost:3000/api/master-broker-tokens').subscribe({
			next: (tokens) => {
				if (tokens && tokens.length > 0) {
					// Always take the latest by updatedAt
					const latestToken = tokens.sort(
						(a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
					)[0];

					const tokenDateUTC = new Date(latestToken.updatedAt); // ✅ use updatedAt
					const tokenDateIST = new Date(tokenDateUTC.getTime() + (5.5 * 60 * 60 * 1000));

					const nowUTC = new Date();
					const nowIST = new Date(nowUTC.getTime() + (5.5 * 60 * 60 * 1000));

					const isSameISTDate =
						tokenDateIST.getFullYear() === nowIST.getFullYear() &&
						tokenDateIST.getMonth() === nowIST.getMonth() &&
						tokenDateIST.getDate() === nowIST.getDate();

					console.log("Latest updatedAt (IST):", tokenDateIST, "Now IST:", nowIST, "Same Date?", isSameISTDate);

					this.hasTodayToken = isSameISTDate;
				} else {
					this.hasTodayToken = false;
				}
			},
			error: (error) => {
				console.error('Error fetching tokens', error);
				this.hasTodayToken = false;
			},
		});
	}
}
