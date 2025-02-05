import { Injectable } from '@angular/core';
import { Observable, lastValueFrom, of, BehaviorSubject, Subject } from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class NexphaseService {

  constructor() { }

  public isDoorOpen: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public isDeadfrontOn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  

  public toggleDoor(value: boolean){
    this.isDoorOpen.next(value);
  }

  public toggleDeadfront(value: boolean){
    this.isDeadfrontOn.next(value);
  }

}
