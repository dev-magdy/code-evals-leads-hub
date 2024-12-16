import { Reply } from "./Reply";

export class Thread {
    resolved: boolean;
    author: string;
    severity: string;
    label: string;
    location: string;
    text: string;
    replies: Reply[];

    constructor() {
        this.resolved = false;
        this.author = '';
        this.severity = '';
        this.label = '';
        this.location = '';
        this.text = '';
        this.replies = []
    }
}