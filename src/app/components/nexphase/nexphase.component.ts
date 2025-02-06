import { Component, inject, OnInit } from '@angular/core';
import { ThreeComponent } from './three/three.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';

//services
import { NexphaseService } from 'src/app/services/nexphase.service';
import { InputSwitchModule, InputSwitchOnChangeEvent } from 'primeng/inputswitch';

@Component({
  selector: 'app-nexphase',
  standalone: true,
  templateUrl: './nexphase.component.html',
  styleUrls: ['./nexphase.component.css'],
  imports: [ThreeComponent, CommonModule, InputSwitchModule, ReactiveFormsModule]
})
export class NexphaseComponent implements OnInit{
 
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
  public isPaneOpen: boolean = false;
  
  
  public togglersForm = new FormGroup({
    deadfronts: new FormControl<boolean | null>(true, {validators:[], nonNullable: true}),
    doors: new FormControl<boolean | null>(true, {validators:[], nonNullable: true}),  
  });


  public toggleDoor(ev: InputSwitchOnChangeEvent){
    this.isDoorOpen = ev.checked;
    this.nexphaseService.toggleDoor(this.isDoorOpen);
  }

  public toggleDeadfront(ev: InputSwitchOnChangeEvent){
    this.isDeadfrontOn = ev.checked;
    this.nexphaseService.toggleDeadfront(this.isDeadfrontOn);
  }

  public selectPart($ev: Event, idx: number){
    console.log($ev.target, idx);
    this.nexphaseService.showInfo();
  }

  public closeInfoPane(){
    this.isPaneOpen = false;
    this.nexphaseService.isPaneOpen.next(false);
  }


  trackByTitle(index: number, item: any): number {
    return item.title;
  }

  ngOnInit(): void {
    
    this.nexphaseService.isPaneOpen.subscribe((value) => {
      this.isPaneOpen = value;
    });

  }
}
