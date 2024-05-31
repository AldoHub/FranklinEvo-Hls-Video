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
  public selectedItemTop:any = "";
  //gauges
  public numberOfMarkers = 9;
  public vgm!:number;  

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
      vgpm_4: 7,
      fgpm_2: 12,
      fgpm_4: 12,
      vpsi_2: 30,
      vpsi_4: 30,
      fpsi_2: 40,
      fpsi_4: 35
    }
  ]


 
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
        this.setVGPM(this.currentConfiguration.vgpm_2);      
      }
      
    });

    this.selectedItem = '2';
   
  }


  public vSpeedSelector(value: string, index: string){
    console.log("SELECTED INDEX: ", index);
    console.log("SELECTED VALUE: ", value);
    this.selectedItem = index;

    if(value == '2'){
      this.setVGPM(this.currentConfiguration.vgpm_2);
    }else{
      this.setVGPM(this.currentConfiguration.vgpm_4);
    }

   
  }


  public fSpeedSelector(value: string){
    alert("selected: " + value);
  }


  //--- calc gauge rotation
  public setVGPM(value: any){
    
    //**** --- each gauge marker is 26 degrees aprox
    let defaultDegrees = (26 * value) - 110;
          
    let removeMarkers = defaultDegrees / this.numberOfMarkers;
    let correction = removeMarkers + 10;
    this.vgm = parseInt(correction.toFixed(0));

    let d:any = document.querySelector(".needle-left");
    d.style.transform = 'rotate('+ this.vgm +'deg)';
  }

  ngOnInit(): void {
  
    setTimeout(() => {
    this.showCarsLayout = true;
    }, 4500);
  }




}
