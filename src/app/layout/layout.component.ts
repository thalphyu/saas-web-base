import { Component, OnInit, HostListener } from '@angular/core';
import { Globals } from '../globals';

@Component({
	 selector: 'app-layout',
	 templateUrl: './layout.component.html',
	 styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {
	 globals: Globals;
	 constructor(globals: Globals) {
		  this.globals = globals;
	 }

	 resetToggle($event: Event) {
		  $event.stopPropagation();
		  this.globals.collapsed = false;

        if(!this.globals.sideOpen)
            {$('body').removeClass('scrollblock');}
	 }

	 /*@HostListener('click', ['$event']) click(event) {
       event.stopPropagation();
    }
    @HostListener("document:click") clickout(event) {
         this.globals.sideOpen = false;

			$('body').removeClass('scrollblock');
    }*/

}

