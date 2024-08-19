import { Reply } from "./Reply";

export class Thread {
    author: string;
    severity: string;
    location: string;
    text: string;
    replies: Reply[];

    constructor() {
        this.author = '';
        this.severity = '';
        this.location = '';
        this.text = '';
        this.replies = []
    }
}