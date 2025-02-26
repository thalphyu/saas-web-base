import { Component, OnInit, ElementRef, AfterViewInit, Renderer2 } from '@angular/core';
import { Globals } from './globals';

@Component({
	 selector: 'app-root',
	 templateUrl: './app.component.html',
	 styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
	globals: Globals;
	private native: any;
	private bodyEle: any;

	constructor(
		private elementRef: ElementRef,
		private renderer: Renderer2,
		globals: Globals) {

		this.globals = globals;
		this.native = elementRef.nativeElement.parentElement;
		this.bodyEle = this.native.parentElement;
	}

	ngAfterViewInit() {

		if( this.globals.storedTheme == null || this.globals.storedSkin == null ){
			this.globals.storedTheme = 'theme-indigo';
			this.globals.storedSkin = 'light';
		}
		else {
			this.globals.storedTheme = localStorage.getItem('theme-color');
			this.globals.storedSkin = localStorage.getItem('skin-color');
		}

		const dataAttributes = [
			{ attr: 'header-theme', value: this.globals.storedTheme },
			{ attr: 'active-menu-theme', value: this.globals.storedTheme },
			{ attr: 'sidebar-theme', value: this.globals.storedSkin },
			{
				attr: 'data-layout-config',
				value: '{"headerTheme":"' + this.globals.storedTheme + '", "sidebarTheme":"' + this.globals.storedSkin + '", "activeMenuTheme":"' + this.globals.storedTheme + '"}'
			}
		];

		for (const { attr, value } of dataAttributes) {
			this.native.setAttribute(attr, value);
		}

		this.darkMode(this.globals.storedSkin);

	}

	public darkMode(skin) {
		if( skin === 'dark' )
			{this.renderer.setAttribute( this.bodyEle, 'body-theme', this.globals.storedSkin );}
		else
			{this.renderer.removeAttribute( this.bodyEle, 'body-theme' );}
	}

	public setTheme(theme) {
		localStorage.setItem('theme-color', theme);
		this.globals.storedTheme = localStorage.getItem('theme-color');
		this.renderer.setAttribute( this.native, 'header-theme', this.globals.storedTheme );
		this.renderer.setAttribute( this.native, 'active-menu-theme', this.globals.storedTheme );
	}

	public setSkin(skin) {
		localStorage.setItem('skin-color', skin);
		this.globals.storedSkin = localStorage.getItem('skin-color');
		this.renderer.setAttribute( this.native, 'sidebar-theme', this.globals.storedSkin );

		this.darkMode(skin);
	}


}
