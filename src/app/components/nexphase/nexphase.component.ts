import { AfterViewChecked, AfterViewInit, ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ThreeComponent } from './three/three.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';

//services
import { NexphaseService } from 'src/app/services/nexphase.service';
import { InputSwitchModule, InputSwitchOnChangeEvent } from 'primeng/inputswitch';

//interfaces
import { Part } from 'src/app/interfaces/part';
import { Hotspot } from 'src/app/interfaces/hotspot';

@Component({
  selector: 'app-nexphase',
  standalone: true,
  templateUrl: './nexphase.component.html',
  styleUrls: ['./nexphase.component.css'],
  imports: [ThreeComponent, CommonModule, InputSwitchModule, ReactiveFormsModule],
  
})
export class NexphaseComponent implements OnInit{
 
  public nexphaseService = inject(NexphaseService);
 
  public parts!: Part[];
  private isDoorOpen:boolean = false;
  private isDeadfrontOn:boolean = false;
  public isPaneOpen: boolean = false;
  public selectedItem!: number;
  public currentPart!: Part; 
  private pastIndex!: number;
  public loadingNumbers: string = '';
  public hideLoadingMessage: boolean = true;

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
    this.nexphaseService.setPartdata(idx);
    this.nexphaseService.toggleInfoPane(true);

    let hotspots = document.querySelectorAll(".hotspot");
    //console.log("---->", hotspots, this.pastIndex)
  
    
    let spots = Array.from(hotspots);

  spots.map(spot => {
    spot.classList.remove('active');
  })

    this.pastIndex = idx;
    hotspots[idx].classList.add('active');
    

    //TODO --- rotate the camera etc, update the model pointer
    this.nexphaseService.focusPart(idx);
    
  }

  public closeInfoPane(){
    this.isPaneOpen = false;
    this.nexphaseService.isPaneOpen.next(false);
  }

  public loadPaneData(){
    this.parts = this.nexphaseService.getPaneData();
  }

  trackByTitle(index: number, item: any): number {
    return item.title;
  }


  ngOnInit(): void {

    //get the parts from the service
    this.loadPaneData();
  

    this.nexphaseService.isPaneOpen.subscribe((value) => {
      this.isPaneOpen = value;
    });

    this.nexphaseService.partData.subscribe((value) => {
      this.currentPart = value;
    })

    this.nexphaseService.selectedItem.subscribe((value) => {
      this.selectedItem = value;
      console.log(value);
    })

   

  }
}
