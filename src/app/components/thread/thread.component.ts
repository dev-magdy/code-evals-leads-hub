import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Thread } from '../../models/Thread';

@Component({
  selector: 'app-thread',
  templateUrl: './thread.component.html',
  styleUrls: ['./thread.component.css']
})
export class ThreadComponent implements OnInit {

  @Output() threadDelete = new EventEmitter<number>();
  @Input() index: number = 0;
  @Input() content: Thread;

  labelClass: string = "";
  repliesID: string = 'replies-' + Math.random().toString(36).substring(2, 9);

  constructor() {
    this.content = new Thread;
   }

  ngOnInit(): void {
    const classMap = {
      "Minor issue": "text-bg-warning",
      "Major issue": "text-bg-danger",
      "Praise": "text-bg-success",
      "General": "text-bg-primary"
    };
    let key = this.content.severity as keyof typeof classMap;
    this.labelClass = classMap[key]

    if (this.content.resolved) {
      this.labelClass += " opacity-50"
    }
  }

  removeThread(i: number): void {
    this.threadDelete.emit(i)
  }
}