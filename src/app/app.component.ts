import { Component } from '@angular/core';
import { Thread } from "./models/Thread";
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'code-evals-lead-hub';
  isDark: boolean = localStorage.getItem("theme") == "dark";

  toast = {
    style: "text-bg-success",
    message: "Copied successfully to clipboard!"
  };

  score: number = 7;
  generalThreads: Thread[] = [];
  majorThreads: Thread[] = [];
  minorThreads: Thread[] = [];
  praiseThreads: Thread[] = [];

  switchTheme(e: Event): void {
    this.isDark = (e.target as HTMLInputElement).checked;
    if (this.isDark) {
      document.documentElement.setAttribute('data-bs-theme', 'dark');
      localStorage.setItem("theme", "dark")
    } else {
      document.documentElement.setAttribute('data-bs-theme', 'light');
      localStorage.setItem("theme", "light")
    }
  }

  copyJSON() {
    let obj = { 
      "Score": this.score,
      "General": this.generalThreads,
      "Major issue": this.majorThreads,
      "Minor issue": this.minorThreads,
      "Praise": this.praiseThreads
    };

    const jsonString = JSON.stringify(obj, null, 2); // Pretty print with 2 spaces
    const toastLiveExample = document.getElementById('liveToast');
    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample as Element);

    navigator.clipboard.writeText(jsonString).then(() => {
      console.log('JSON copied to clipboard');
      this.toast.style = "text-bg-success";
      this.toast.message = "Copied successfully to clipboard!";
      toastBootstrap.show()
    }).catch(err => {
      console.error('Failed to copy JSON to clipboard', err);
      this.toast.style = "text-bg-danger";
      this.toast.message = "Error copying data to clipboard!";
      toastBootstrap.show()
    });
  }

  calcScore(): void {
    let score = 7;

    if (this.minorThreads.length) {
      score = 4
    } else if (this.majorThreads.length) {
      score = 1
    }

    this.score = score
  }

  extractComments(html: string): void {
    let el = document.getElementById("comments-html");

    if (el == null) {
      el = document.createElement("div");
      el.setAttribute("id", "comments-html");
      el.setAttribute("style", "display: none;")
    }

    el.innerHTML = html;

    this.generalThreads = [];
    this.majorThreads = [];
    this.minorThreads = [];
    this.praiseThreads = [];

    var locators = {
      "threadsList": ".flex.border-slate-300",
      "threadSections": "gap-3",	// inside a thread
      "commentType": ".MuiChip-root > span",	// inside a section
      "commentLevel": "blockquote",	// inside a section
      "text": "div.whitespace-pre-wrap"	// inside a section
    };

    function getComment(div: HTMLElement) {
      let comment = new Thread;
      comment.author = div.getElementsByTagName("a")[0].innerText;
      comment.severity = (div.querySelector(locators.commentType) as HTMLElement).innerText;

      let cLevel = div.getElementsByTagName("blockquote");
      comment.location = cLevel.length ? cLevel[0].innerText : "root";
      comment.text = (div.querySelector(locators.text) as HTMLElement).innerText;

      return comment
    }

    function getReplies(divs: HTMLElement[]) {
      let replies = [];
      for (let div of divs) {
        replies.push({
          "author": div.getElementsByTagName("a")[0].innerText,
          "text": (div.querySelector(locators.text) as HTMLElement).innerText
        })
      }

      return replies
    }

    let threads = Array.from(el.querySelectorAll(locators.threadsList));
    console.log(threads);

    for (let thread of threads) {
      let sections = Array.from(thread.getElementsByClassName(locators.threadSections)) as HTMLElement[];
      let comment = getComment(sections[0]);
      comment.replies = sections.length > 1 ? getReplies(sections.slice(1)) : [];

      switch (comment.severity) {
        case "General":
          this.generalThreads.unshift(comment);
          break;
        case "Major issue":
          this.majorThreads.unshift(comment);
          break;
        case "Minor issue":
          this.minorThreads.unshift(comment);
          break;
        case "Praise":
          this.praiseThreads.unshift(comment);
          break;
      }
    };

    this.calcScore();
  }

  ngOnInit(): void {
    document.documentElement.setAttribute('data-bs-theme', localStorage.getItem("theme") as string);
  }
}
