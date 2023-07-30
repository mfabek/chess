import { Injectable, OnInit } from "@angular/core";
import { Stomp } from '@stomp/stompjs';
import { BehaviorSubject, Subject } from "rxjs";
import * as SockJS from 'sockjs-client';
import { environment } from "src/environments/environment";

@Injectable({ providedIn: 'root' })
export class WebSocketProvider implements OnInit {
    public subject = new BehaviorSubject(-1);
    public subject2: BehaviorSubject<string> = new BehaviorSubject<string>(null);
    public stompClient: any = null;
    private url = environment.url;

    constructor() {
        // this.initializeWebSocketConnection();
    }

    ngOnInit(): void {
    }

    // initializeWebSocketConnection(): void {
    //     const serverUrl = this.url + 'socket';
    //     const ws = new SockJS(serverUrl);
    //     this.stompClient = Stomp.over(ws);

    //     const that = this;

    //     this.stompClient.connect({}, (frame: any) => {
    //         this.stompClient.subscribe('/topic', (message: any) => {
    //             this.subject.next(message.body);
    //         });
    //         this.stompClient.subscribe('/topic2', (message: any) => {
    //             this.subject2.next(message.body);
    //         });
    //     });
    // }

    // sendCountMessage(name: string): void {
    //     this.stompClient.send('/chess/getCount', {}, name);
    // }

    // sendBoardMessage(name: string): void {
    //     this.stompClient.send('/chess/getBoard', {}, name);
    // }

    // disconnect(): void {
    //     if (this.stompClient != null) {
    //         this.stompClient.disconnect();
    //     }
    // }
}