import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Thread } from '../../models/Thread';

@Component({
  selector: 'app-comments-list',
  templateUrl: './comments-list.component.html',
  styleUrls: ['./comments-list.component.css']
})
export class CommentsListComponent implements OnInit {

  @Input() threads: Thread[];
  @Output() threadsUpdated = new EventEmitter();

  constructor() {
    this.threads = []
   }

  ngOnInit(): void {
  }

  deleteThread(i: number): void {
    this.threads.splice(i, 1);
    this.threadsUpdated.emit();
  }

}
