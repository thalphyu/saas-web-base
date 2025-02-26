import {
	OnInit,
	AfterViewInit,
	Directive,
	ElementRef,
	HostBinding,
	Input,
	OnDestroy,
	Renderer2,
	NgZone
} from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { debounceTime, throttleTime } from 'rxjs/operators';

@Directive({
	selector: '[gridHeight]',
	exportAs: 'heightDirective'
})

export class GridHeightDirective implements OnInit, AfterViewInit, OnDestroy {
	@Input() minHeight: number;
	@Input('gridHeight') topOffset: number;
	//@Input() kGridHeight: number;
	//@HostBinding('style.overflow-y') overflowY = 'auto';

	public kGridHeight: number;

	private domElement: HTMLElement;
	private resizeSub: Subscription;

	constructor(
		private renderer: Renderer2,
		private elementRef: ElementRef,
		private zone: NgZone) {
			// get ref HTML element
			this.domElement = this.elementRef.nativeElement as HTMLElement;

			// register on window resize event
			this.resizeSub = fromEvent(window, 'resize')
				.pipe(throttleTime(500), debounceTime(500))
				.subscribe(() => this.setHeight());

			// work on route change without refresh page ***
			this.zone.run(() => {
				setTimeout(() => {
					this.setHeight();
				});
			});
	}

	ngAfterViewInit() {
		setTimeout(() => {
			this.setHeight();
		}, 1);
	}

	ngOnDestroy(){
		this.resizeSub.unsubscribe();
	}

	ngOnInit() {
		setTimeout(() => {
			this.setHeight();
		}, 1);
	}

	private setHeight() {
		const windowHeight = window?.innerHeight;
		const topOffset = this.topOffset || this.calcTopOffset();
		let height = ( windowHeight - 35 ) - topOffset;

		if (this.minHeight && height < this.minHeight) {
			height = this.minHeight;
		}
		this.kGridHeight = height;
		//debugger;
		//this.renderer.setStyle(this.domElement, 'height', `${height}px`);
	}

	private calcTopOffset(): number {
		try {
			const rect = this.domElement.getBoundingClientRect();
			const scrollTop =
				window.pageYOffset || document.documentElement.scrollTop;

			return rect.top + scrollTop;
		} catch (e) {
			return 0;
		}
	}
}
