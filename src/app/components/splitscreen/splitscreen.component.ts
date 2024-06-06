import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { DataService } from "../../services/data.service";

@Component({
  selector: 'app-splitscreen',
  templateUrl: './splitscreen.component.html',
  styleUrls: ['./splitscreen.component.css']
})
export class SplitscreenComponent implements OnInit, AfterViewInit {

  constructor(private dataService: DataService){}
  

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
 
  //gauges
  public vgm!:number;  
  public fgm!:number;

  public configurations = [
    {
      configNumber: 0,
      carsLayout: `${this.imagesFolder}bg_no_cars.jpg`,
      vgpm_2: 0,
      vgpm_4: 0,
      fgpm_2: 0,
      fgpm_4: 0,
      vpsi_2: 0,
      vpsi_4: 0,
      fpsi_2: 0,
      fpsi_4: 0
    },
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

  //behavior subject
  //public splitscreen: boolean = this.dataService.splitscreen;

  public units: string[] = ["gpm", "psi"];
 
  public currentConfiguration:any = this.configurations[1];

  //dummy data
  public activeNozzles = ['2', '4', '6', '8'];
  public variableSpeedSelector = ['2', '4'];
  public fixedSpeedSelector = ['2', '4'];

  public configSelector(value: string, index: string){
    
    //shows the speed menu
    this.selectedItemTop = index;
    
    this.configurations.map((c, i) => {
      if(this.configurations[i].configNumber == parseInt(value)){
        //console.log(this.configurations[i]);
        this.currentConfiguration = this.configurations[i];
     
        if(this.currentMetric == 'gpm'){
          this.setVariableSpeed(this.currentConfiguration.vgpm_2); 
          this.setFixedSpeed(this.currentConfiguration.fgpm_2);    
        }else{
          this.setVariableSpeed(this.currentConfiguration.vpsi_2);  
          this.setFixedSpeed(this.currentConfiguration.fpsi_2);  
        }
      
      }
      
    });

    //selects the defaults for the bottom speeds menu
    this.selectedItem = '2';
    this.selectedItem2 = '2';
   
  }



  public selectSpeeds(value: string, index: string){
    
    //--- tie the selectors, both will act on click
    //depending on the current metric do the calcs needed
    if(this.currentMetric == 'gpm'){
      if(value == '2'){
        this.setVariableSpeed(this.currentConfiguration.vgpm_2);
        this.setFixedSpeed(this.currentConfiguration.fgpm_2);

      }else{
        //use 4hp data
        this.setVariableSpeed(this.currentConfiguration.vgpm_4);
        this.setFixedSpeed(this.currentConfiguration.fgpm_4);
      }
    }else{ 
      if(value == '2'){
        this.setVariableSpeed(this.currentConfiguration.vpsi_2);
        this.setFixedSpeed(this.currentConfiguration.fpsi_2);
      
      }else{
        //use 4hp data
        this.setVariableSpeed(this.currentConfiguration.vpsi_4);
        this.setFixedSpeed(this.currentConfiguration.fpsi_4);

      }
    }

    //select the correct option
    this.selectedItem = index;
    this.selectedItem2 = index;

  }


  public unitsChange(unit: string, index: string){
  
    this.selectedUnit = index;

    this.selectedGauge = `${this.imagesFolder}${unit}.png`;
    this.currentMetric = unit;
    
    //select first item
    this.selectedItem = '2'; //select first
    this.selectedItem2 = '2' //select first

    if(this.currentMetric == 'gpm'){
      this.setVariableSpeed(this.currentConfiguration.vgpm_2);
      this.setFixedSpeed(this.currentConfiguration.fgpm_2);  
    }else{
      this.setVariableSpeed(this.currentConfiguration.vpsi_2);  
      this.setFixedSpeed(this.currentConfiguration.fpsi_2);  
    }
    

  }

  //**** --- each gauge marker is 13.5 degrees aprox */

  //--- calc gauge rotation
  public setVariableSpeed(value: string){
    console.log("VARIABLE VALUE: ", value);
    
    let calc!: number;
    
    if(this.currentMetric == 'gpm'){
      calc = (13.5 * parseInt(value)) - 110;
    }else{
      calc = (13.5 * parseInt(value) / 3) - 110;
    }

    this.vgm = calc;

    //set the rotation
    this.needleLeft.nativeElement.setAttribute('style', 'transform:rotate('+ this.vgm +'deg)');

  }


  public setFixedSpeed(value: string){
    console.log("FIXED VALUE: ", value);
    
    let calc!: number;
    
    if(this.currentMetric == 'gpm'){
      calc = (13.5 * parseInt(value)) - 110;
    }else{
      calc = (13.5 * parseInt(value) / 3) - 110;
    }

    this.fgm = calc;

    //set the rotation
    this.needleRight.nativeElement.setAttribute('style', 'transform:rotate('+ this.fgm +'deg)');

  }
  
  public toggleInstructions(){
    this.isInstructionsEnabled = !this.isInstructionsEnabled;
  }


  ngOnInit(): void {
    this.selectedGauge = `${this.imagesFolder}gpm.png`;
  }

  ngAfterViewInit(): void{
    /*
    setTimeout(() => {
      //this.showCarsLayout = true;
      this.showWrapper = true;
      this.selectedUnit = 'gpm';
      this.configSelector('2', '2');
      }, 4500);
  
      */

      this.dataService.splitscreenSubject.subscribe(val => {
        if(val){
            this.showCarsLayout = true;
            this.showWrapper = true;
            this.selectedUnit = 'gpm';
            this.configSelector('2', '2'); 
        }
      })
  }


}
