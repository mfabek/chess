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

        // this.evtSource.onmessage = (event) => {
        //     this.zone.run(() => {
        //         switch(event.data) { 
        //             case 'gameStart': { 
        //                 this.gameStartSubject.next(true);
        //                 break; 
        //             } 
        //             default: {
        //                 this.boardSubject.next(event.data);
        //                 break; 
        //             } 
        //         }
        //     });
        // };

        this.evtSource.onerror = ((error: Event) => {
            this.zone.run(() => {
                console.log(error); // when for example connection is lost
            });
        });

        this.evtSource.addEventListener("gameStart", (_: MessageEvent) => {
            this.zone.run(() => {
                this.gameStartSubject.next(true);
            });
        });

        this.evtSource.addEventListener("board", (event: MessageEvent) => {
            this.zone.run(() => {
                this.boardSubject.next(event.data);
            });
        });
    }
}
