import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
})
export class AlertComponent {
  @Input() message: string;
  @Output() closed = new EventEmitter();

  onClose() {
    console.log('emitted Closed');
    this.closed.emit(closed);
  }
}
