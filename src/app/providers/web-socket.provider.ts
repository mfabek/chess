import { Injectable, OnInit } from "@angular/core";
import {Stomp} from '@stomp/stompjs';
import { BehaviorSubject, Subject } from "rxjs";
import * as SockJS from 'sockjs-client';

@Injectable({providedIn: 'root'})
export class WebSocketProvider implements OnInit {
    public subject = new BehaviorSubject(-1);
    public stompClient: any = null;

    constructor() {
        this.initializeWebSocketConnection();    
    }
    
    ngOnInit(): void {
    }

    initializeWebSocketConnection(): void {
        const serverUrl = 'http://localhost:8080/socket';
        const ws = new SockJS(serverUrl);
        this.stompClient = Stomp.over(ws);

        this.stompClient.connect({}, function(frame: any) {
            this.stompClient.subscribe('/topic', (message: string) => {
                console.log("tu smo");
                this.subject.next(message);
            });
        });
    }
    
    sendMessage(name: string): void {
        this.stompClient.send('/chess/getCount', {}, name);
    }

    disconnect(): void {
        if (this.stompClient != null) {
            this.stompClient.disconnect();
        }
    }
}