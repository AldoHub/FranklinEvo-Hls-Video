import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SplitscreenService {

  constructor() { }

  public splitDataSubscription!: Subscription;
  public splitData:BehaviorSubject<string> = new BehaviorSubject<string>(''); 

  
}
