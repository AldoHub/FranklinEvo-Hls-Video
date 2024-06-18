import { Component, ElementRef, OnInit, ViewChild, AfterViewInit, OnDestroy, AfterContentInit } from '@angular/core';
import { DataService } from "../../services/data.service";
import { SplitscreenService } from '../../services/splitscreen.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-splitscreen',
  templateUrl: './splitscreen.component.html',
  styleUrls: ['./splitscreen.component.css']
})
export class SplitscreenComponent implements OnInit, AfterViewInit, AfterContentInit ,OnDestroy {

  constructor(
    private dataService: DataService, 
    private splitscreenService: SplitscreenService)
    {}
  

  @ViewChild('needleLeft', {static: true}) needleLeft!: ElementRef<HTMLElement>;
  @ViewChild('needleRight', {static: true}) needleRight!: ElementRef<HTMLElement>;
  

  public showCarsLayout:boolean = false; 
  public imagesFolder: string = "../../../assets/images/";
  public selectedItem:any = "";
  public selectedItem2:any = "";
  public selectedItemTop:any = "";
  public selectedGauge!:string;
  public selectedUnit!: string;
  public currentMetric: string = 'gpm';
  public showWrapper: boolean = false;
  public isInstructionsEnabled:boolean = false;
  public isDesktop:boolean = false;
  public instructions!:string;
 
  //gauges
  public vgm!:number;  
  public fgm!:number;


  public splitscreensubscription!:Subscription;
  public isMobileSubscription!: Subscription;

  public configurations = [
    
    {
      configNumber: 2,
      carsLayout: `${this.imagesFolder}2.jpg`,
      vgpm_2: 10,
      vgpm_4: 10,
      fgpm_2: 11,
      fgpm_4: 14,
      vpsi_2: 30,
      vpsi_4: 30,
      fpsi_2: 34,
      fpsi_4: 43
    },
    {
      configNumber: 4,
      carsLayout: `${this.imagesFolder}4.jpg`,
      vgpm_2: 10,
      vgpm_4: 10,
      fgpm_2: 10,
      fgpm_4: 12,
      vpsi_2: 31,
      vpsi_4: 31,
      fpsi_2: 32,
      fpsi_4: 36
    },
    {
      configNumber: 6,
      carsLayout: `${this.imagesFolder}6.jpg`,
      vgpm_2: 10,
      vgpm_4: 10,
      fgpm_2: 9,
      fgpm_4: 10,
      vpsi_2: 30,
      vpsi_4: 32,
      fpsi_2: 30,
      fpsi_4: 33
    },
    {
      configNumber: 8,
      carsLayout: `${this.imagesFolder}8.jpg`,
      vgpm_2: 9,
      vgpm_4: 10,
      fgpm_2: 8,
      fgpm_4: 9,
      vpsi_2: 31,
      vpsi_4: 36,
      fpsi_2: 26,
      fpsi_4: 29
    }
  ];

  public units: string[] = ["gpm", "psi"];
  public currentConfiguration:any = this.configurations[1];

  //dummy data
  public activeNozzles = ['2', '4', '6', '8'];
  //public variableSpeedSelector = ['2', '4'];
  public variableSpeedSelector = ['2(Hp MVS2)', '4(Hp MVS4)'];
  public fixedSpeedSelector = ['2Hp Std PSI (M200)', '2Hp High PSI (HM200)'];

  public configSelector(value: string, index: string){
    //shows the speed menu
    this.selectedItemTop = index;
    
    this.configurations.map((c, i) => {
      if(this.configurations[i].configNumber == parseInt(value)){
       
        //setting global config
        this.currentConfiguration = this.configurations[i];
        //select the speeds according the data passed, on the current config
        this.selectSpeed(0, 'variable');
        this.selectSpeed(0, 'fixed');
      }
      
    });
  }


/*
  public selectSpeeds(value: string, index: string){

  
    console.log(value)

    //--- tie the selectors, both will act on click
    //depending on the current metric do the calcs needed
    //this.setSpeeds(index, this.currentConfiguration);

    //select the correct option
    this.selectedItem = index;
    this.selectedItem2 = index;
  

   
  }
*/


  public unitsChange(unit: string, index: string){
  
    this.selectedUnit = index;

    this.selectedGauge = `${this.imagesFolder}${unit}.png`;
    this.currentMetric = unit;
  
    //this.setSpeeds(index, this.currentConfiguration);

  }


  public selectSpeed(i:number, mode:string){

        if(mode == 'variable'){
          this.selectVariableSpeed(i);
        }else{
          this.selectFixedSpeed(i)
        }

  }


  
  //Variable Speed Selector
  public selectVariableSpeed(i: number){
    // this.setSpeeds(i, this.currentConfiguration);
    this.selectedItem = i;
    if(this.currentMetric = 'gpm'){
      if(i == 0){
        this.setVariableSpeed(this.currentConfiguration.vgpm_2);
      }else{
        this.setVariableSpeed(this.currentConfiguration.vgpm_4);
      }
    }  
  }
 
 
  //Fixed Speed Selector
  public selectFixedSpeed(i:number){
    this.selectedItem2 = i;
    if(this.currentMetric = 'gpm'){
      if(i == 0){
        this.setFixedSpeed(this.currentConfiguration.fgpm_2);
      }else{
        this.setFixedSpeed(this.currentConfiguration.fgpm_4);
      }
    } 
  }
 
 
  //**** --- each gauge marker is 13.5 degrees aprox */

  //--- calc gauge rotation
  public setVariableSpeed(value: string){

    let calc = this.calculateRotation(value);
    this.vgm = calc;
    //set the rotation
    this.needleLeft.nativeElement.setAttribute('style', 'transform:rotate('+ this.vgm +'deg)');

  }


  public setFixedSpeed(value: string){
   
    let calc = this.calculateRotation(value);
    this.fgm = calc;
    //set the rotation
    this.needleRight.nativeElement.setAttribute('style', 'transform:rotate('+ this.fgm +'deg)');

  }
  

  public calculateRotation(value:string){
    let calc!: number;
    
    if(this.currentMetric == 'gpm'){
      calc = (13.5 * parseInt(value)) - 110;
    }else{
      calc = (13.5 * parseInt(value) / 3) - 110;
    }

    return calc;
  }



  public toggleInstructions(){
    this.isInstructionsEnabled = !this.isInstructionsEnabled;
  }


  ngOnInit(): void {
    this.selectedGauge = `${this.imagesFolder}gpm.png`;
  }

  ngAfterViewInit(): void{
    //do something   
  }

  ngAfterContentInit(): void {
    this.splitscreensubscription = this.dataService.splitscreenSubject.subscribe(val => {
      if(val){
      
          this.showCarsLayout = true;
          this.showWrapper = true;
          this.selectedUnit = 'gpm';
          //this.configSelector('2', '2'); 
          this.configSelector('2', '2');

          }
    });

    this.isMobileSubscription = this.dataService.isDesktopCheck.subscribe(val => {
      this.isDesktop = val;
    });

    this.splitscreenService.splitData.subscribe( instructions => {
      this.instructions = instructions;
    })

  }


  ngOnDestroy(): void {
      this.showWrapper = false;
      if(this.splitscreensubscription){
        this.splitscreensubscription.unsubscribe();
        this.isMobileSubscription.unsubscribe();

      }
      
  }

}
