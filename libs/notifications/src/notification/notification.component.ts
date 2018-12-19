import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { ToastData, ToastOptions, ToastyService } from 'ng2-toasty';

@Component({
  selector: 'notification',
  templateUrl: './notification.component.html',
  styleUrls: [
    './notification.component.scss',
    '../../../../node_modules/ng2-toasty/style-bootstrap.css',
    '../../../../node_modules/ng2-toasty/style-default.css',
    '../../../../node_modules/ng2-toasty/style-material.css'
  ],
  encapsulation: ViewEncapsulation.None
})
export class NotificationComponent implements OnInit {

  @Input() customNotification: any;

  public position: string;
  public title: string;
  public msg: string;
  public theme: string;
  public type: string;

  public showClose = true;
  public closeOther = false;

  constructor(private toastyService: ToastyService) {}

  ngOnInit() {
    setTimeout(() => this.addToast(this.customNotification));
  }

  addToast(options) {
    console.log(options);
    if (options.closeOther) {
      this.toastyService.clearAll();
    }
    this.position = options.position ? options.position : this.position;
    const toastOptions: ToastOptions = {
      title: options.title,
      msg: options.msg,
      showClose: options.showClose,
      timeout: options.timeout,
      theme: options.theme,
      onAdd: (toast: ToastData) => {
        /* added */
      },
      onRemove: (toast: ToastData) => {
        /* removed */
      }
    };

    switch (options.type) {
      case 'default':
        this.toastyService.default(toastOptions);
        break;
      case 'info':
        this.toastyService.info(toastOptions);
        break;
      case 'success':
        this.toastyService.success(toastOptions);
        break;
      case 'wait':
        this.toastyService.wait(toastOptions);
        break;
      case 'error':
        this.toastyService.error(toastOptions);
        break;
      case 'warning':
        this.toastyService.warning(toastOptions);
        break;
    }
  }

}
