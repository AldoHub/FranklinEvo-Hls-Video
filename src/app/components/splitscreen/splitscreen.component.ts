import { Component } from '@angular/core';

@Component({
  selector: 'app-splitscreen',
  templateUrl: './splitscreen.component.html',
  styleUrls: ['./splitscreen.component.css']
})
export class SplitscreenComponent {

  //dummy data
  public activeNozzles = ['2', '4', '6', '8'];
  public variableSpeedSelector = ['2', '4'];
  public fixedSpeedSelector = ['2', '4'];

  public stepsSelector(value: String){
    alert("selected: " + value);
  }


  



}
