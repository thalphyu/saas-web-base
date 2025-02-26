import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { DialogComponent } from '../../dialog/dialog.component';

@Injectable()
export class ModalDialogService {
  safeHtml: SafeHtml;

  constructor(
    config: NgbModalConfig,
    private modalService: NgbModal,
    private sanitizer: DomSanitizer) {

    config.backdrop = 'static';
    config.keyboard = false;
  }

  public confirm(
    title: string,
    message: string,
    btnOkText: string = 'OK',
    btnCancelText: string = 'Cancel',
    iColor: string = '',
    svgIcon: string = '',
    bodyTitle: string = '',
    //dialogSize: string = 'md'): Promise<boolean> {
    //dialogSize: 'sm'|'lg' = 'sm'): Promise<boolean> {
    ): Promise<boolean> {
    const modalRef = this.modalService.open(DialogComponent, {  });

    modalRef.componentInstance.title = title;
    modalRef.componentInstance.message = this.sanitizer.bypassSecurityTrustHtml(message);
    //modalRef.componentInstance.message = message;
    modalRef.componentInstance.btnOkText = btnOkText;
    modalRef.componentInstance.btnCancelText = btnCancelText;
    modalRef.componentInstance.iColor = iColor;
    modalRef.componentInstance.svgIcon = svgIcon;
    modalRef.componentInstance.bodyTitle = bodyTitle;

    return modalRef.result;
  }


  public confirmRoute(
    title: string,
    message: string,
    btnOkText: string = 'OK',
    btnCancelText: string = 'Cancel',
    Isroutebtnclick: boolean = true,
    ): Promise<boolean> {
    const modalRef = this.modalService.open(DialogComponent, {  });
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.message = message;
    modalRef.componentInstance.btnOkText = btnOkText;
    modalRef.componentInstance.btnCancelText = btnCancelText;
    modalRef.componentInstance.Isroutebtnclick = Isroutebtnclick;

    return modalRef.result;
  }

}
