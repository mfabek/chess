import {Injectable, NgZone, OnInit} from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({providedIn: 'root'})
export class SseService {
    private url = environment.url + 'chess/sse';
    private evtSource: EventSource;
    public gameStartSubject = new BehaviorSubject(false);
    public boardSubject = new BehaviorSubject<string>(null);

    constructor(private zone: NgZone) {}

    public establishSseConnection(name: string) {
        const urlWithParams = this.url + `?name=${name}`;
        this.evtSource = new EventSource(urlWithParams);
        this.evtSource.onmessage = (event) => {
            this.zone.run(() => {
                switch(event.data) { 
                    case 'gameStart': { 
                        this.gameStartSubject.next(true);
                        break; 
                    } 
                    default: {
                        console.log(event.data)
                        this.boardSubject.next(event.data);
                        break; 
                    } 
                }
            })
        };
        // this.evtSource.addEventListener("gameStart", (event) => {
        //     console.log(event)
        //     this.gameStartSubject.next(true);
        //     // const time = JSON.parse(event.data).time;
        //   });
        // this.evtSource.addEventListener("board", (event: MessageEvent) => {
        //     console.log(event)
        //     this.boardSubject.next(event.data);
        //   });
    }
}
