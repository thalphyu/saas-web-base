import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent {

  @Input() title: string;
  @Input() iColor: string;
  @Input() svgIcon: string;
  @Input() bodyTitle: string;
  @Input() message: string;
  @Input() btnOkText: string;
  @Input() btnCancelText: string;
  public Isroutebtnclick = false;


  constructor(private activeModal: NgbActiveModal, private router: Router) { }

  public decline() {
    this.activeModal.close(false);
  }

  public accept() {
    this.activeModal.close(true);
  }

  public dismiss() {
    this.activeModal.dismiss();
  }

  public acceptRoute() {
    this.activeModal.close(true);
    this.router.navigate(['/login']);
  }

  public dismissRoute() {
    this.activeModal.dismiss();
    this.router.navigate(['/login']);
  }

}
