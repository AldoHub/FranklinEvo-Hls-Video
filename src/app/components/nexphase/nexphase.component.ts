import { Component, inject } from '@angular/core';
import { ThreeComponent } from './three/three.component';
import { CommonModule } from '@angular/common';

//services
import { NexphaseService } from 'src/app/services/nexphase.service';



@Component({
  selector: 'app-nexphase',
  standalone: true,
  templateUrl: './nexphase.component.html',
  styleUrls: ['./nexphase.component.css'],
  imports: [ThreeComponent, CommonModule]
})
export class NexphaseComponent {
  public nexphaseService = inject(NexphaseService);
  //TODO --- MOVE TO SERVICE
  //info panel data
  public parts = [
    {
      "title": "Monitoring & Control Panel",
      "image": "",
      "content": "some data" 
    },
    {
      "title": "Maintenance Mode Switch",
      "image": "",
      "content": "some data" 
    },
    {
      "title": "GFCI Outlet",
      "image": "",
      "content": "some data" 
    },
    {
      "title": "Main Breaker",
      "image": "",
      "content": "some data" 
    },
    {
      "title": "Branch Breakers",
      "image": "",
      "content": "some data" 
    },
    {
      "title": "Monitoring & Control Breaker",
      "image": "",
      "content": "some data" 
    },
    {
      "title": "Charger & Sensor Connection Panel",
      "image": "",
      "content": "some data" 
    },
    {
      "title": "Lockable Door",
      "image": "",
      "content": "some data" 
    },
    {
      "title": "Cellular Antenna",
      "image": "",
      "content": "some data" 
    },
    {
      "title": "Meter Socket",
      "image": "",
      "content": "some data" 
    },
    {
      "title": "Meter Test Switch Plate",
      "image": "",
      "content": "some data" 
    },
    {
      "title": "Current Transformer Mounting Plates",
      "image": "",
      "content": "some data" 
    },
    {
      "title": "Underground Untility Service Connections",
      "image": "",
      "content": "some data" 
    },

  ];

  private isDoorOpen:boolean = false;
  private isDeadfrontOn:boolean = false;

  public toggleDoor(){
    this.isDoorOpen = !this.isDoorOpen;
    this.nexphaseService.toggleDoor(this.isDoorOpen);
  }

  public toggleDeadfront(){
    this.isDeadfrontOn = !this.isDeadfrontOn;
    this.nexphaseService.toggleDeadfront(this.isDeadfrontOn);
  }

  public selectPart($ev: Event, idx: number){
    /*console.log($ev.target, idx);
    alert("PART SELECTED")*/
    //this.nexphaseService.testFunction();
  }

  trackByTitle(index: number, item: any): number {
    return item.title;
  }
}
