import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-splitscreen',
  templateUrl: './splitscreen.component.html',
  styleUrls: ['./splitscreen.component.css']
})
export class SplitscreenComponent implements OnInit {
  public showCarsLayout:boolean = false; 
  public imagesFolder: string = "../../../assets/images/";
  public selectedItem:any = "";
  public selectedItem2:any = "";
  public selectedItemTop:any = "";
  public selectedGauge!:string;
  public selectedUnit!: string;
  public currentMetric: string = 'gpm';

  //gauges
  public numberOfMarkers = 9;
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
      vgpm_4: 12,
      fgpm_2: 11,
      fgpm_4: 14,
      vpsi_2: 30,
      vpsi_4: 30,
      fpsi_2: 40,
      fpsi_4: 35
    },
    {
      configNumber: 4,
      carsLayout: `${this.imagesFolder}4.jpg`,
      vgpm_2: 10,
      vgpm_4: 12,
      fgpm_2: 10,
      fgpm_4: 12,
      vpsi_2: 30,
      vpsi_4: 30,
      fpsi_2: 40,
      fpsi_4: 35
    },
    {
      configNumber: 6,
      carsLayout: `${this.imagesFolder}6.jpg`,
      vgpm_2: 10,
      vgpm_4: 12,
      fgpm_2: 9,
      fgpm_4: 10,
      vpsi_2: 30,
      vpsi_4: 30,
      fpsi_2: 40,
      fpsi_4: 35
    },
    {
      configNumber: 8,
      carsLayout: `${this.imagesFolder}8.jpg`,
      vgpm_2: 8,
      vgpm_4: 10,
      fgpm_2: 8,
      fgpm_4: 9,
      vpsi_2: 30,
      vpsi_4: 30,
      fpsi_2: 40,
      fpsi_4: 35
    }
  ];


  public units: string[] = ["gpm", "psi"];


 
  public currentConfiguration:any = this.configurations[0];

  //dummy data
  public activeNozzles = ['2', '4', '6', '8'];
  public variableSpeedSelector = ['2', '4'];
  public fixedSpeedSelector = ['2', '4'];

  public configSelector(value: string, index: string){
    
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

    this.selectedItem = '2';
    this.selectedItem2 = '2';
    this.selectedUnit = 'gpm';
   
  }

  //changes the value for the Variable gauge
  public vSpeedSelector(value: string, index: string){

    this.selectedItem = index;
    //depending on the current metric do the calcs needed

    if(this.currentMetric == 'gpm'){
      if(value == '2'){
        this.setVariableSpeed(this.currentConfiguration.vgpm_2);
      }else{
        this.setVariableSpeed(this.currentConfiguration.vgpm_4);
      }
    }else{
      if(value == '2'){
        this.setVariableSpeed(this.currentConfiguration.vpsi_2);
      }else{
        this.setVariableSpeed(this.currentConfiguration.vpsi_4);
      }
    }

   
    
    
  }

  //changes the value for the Fixed gauge
  public fSpeedSelector(value: string, index: string){
   
     //depending on the current metric do the calcs needed
     this.selectedItem2= index;

     if(this.currentMetric == 'gpm'){
       if(value == '2'){
         this.setFixedSpeed(this.currentConfiguration.fgpm_2);
       }else{
         this.setFixedSpeed(this.currentConfiguration.fgpm_4);
       }
     }else{
      if(value == '2'){
        this.setFixedSpeed(this.currentConfiguration.fpsi_2);  
      }else{
        this.setFixedSpeed(this.currentConfiguration.fpsi_4);  
      }
    }
  
   
  }


  public unitsChange(unit: string, index: string){
    
    console.log(index);

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


  //--- calc gauge rotation
  public setVariableSpeed(value: any){
    /*
    //**** --- each gauge marker is 26 degrees aprox */
       
    let defaultDegrees = (12 * value) - 110;
    let removeMarkers = defaultDegrees / this.numberOfMarkers;
    
    if(this.currentMetric == 'gpm'){
     
      let correction = removeMarkers + 22;
      this.vgm = parseInt(correction.toFixed(0));
  
      
    }else{
      let correction = removeMarkers;
      this.vgm = parseInt(correction.toFixed(0));
    }

    //set rotation value
    let d:any = document.querySelector(".needle-left");
    d.style.transform = 'rotate('+ this.vgm +'deg)';

    console.log("SET VSPEED TO: ", this.vgm);

  }


  public setFixedSpeed(value: any){
 
    let defaultDegrees = (12 * value) - 110;
    let removeMarkers = defaultDegrees / this.numberOfMarkers;
    
    if(this.currentMetric == 'gpm'){
      let correction = removeMarkers + 22;
      this.fgm = parseInt(correction.toFixed(0));
      
    }else{
      let correction = removeMarkers;
      this.fgm = parseInt(correction.toFixed(0));
    }

    //set rotation value
    let d:any = document.querySelector(".needle-right");
    d.style.transform = 'rotate('+ this.fgm +'deg)';

    console.log("SET FSPEED TO: ", this.fgm);
  }
 

  ngOnInit(): void {
    this.selectedGauge = `${this.imagesFolder}gpm.png`;
    setTimeout(() => {
    this.showCarsLayout = true;
    }, 4500);
  }




}
