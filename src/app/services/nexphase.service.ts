import { Injectable } from '@angular/core';
import { Observable, lastValueFrom, of, BehaviorSubject, Subject } from "rxjs";
import { Part } from '../interfaces/part';
import { ObjPart } from '../interfaces/objpart';
import { Hotspot } from '../interfaces/hotspot';
import * as THREE from "three";
import { gsap } from "gsap";


@Injectable({
  providedIn: 'root'
})
export class NexphaseService {

  constructor() { }

  //info panel data
  private parts: Part[] = [
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

  private objParts: ObjPart[] = [
    
    {
      "partName": "marker_1",
      "normal": "",
      "alpha": "",
      "material": "",
      "object": "/assets/model/obj/marker1_new.obj"
    },
    {
      "partName": "marker_2",
      "normal": "",
      "alpha": "",
      "material": "",
      "object": "/assets/model/obj/marker2_new.obj"
    },
    {
      "partName": "marker_3",
      "normal": "",
      "alpha": "",
      "material": "",
      "object": "/assets/model/obj/marker3_new.obj"
    },
    {
      "partName": "marker_4",
      "normal": "",
      "alpha": "",
      "material": "",
      "object": "/assets/model/obj/marker4_new.obj"
    },
    {
      "partName": "marker_5",
      "normal": "",
      "alpha": "",
      "material": "",
      "object": "/assets/model/obj/marker5_new.obj"
    },
    {
      "partName": "marker_6",
      "normal": "",
      "alpha": "",
      "material": "",
      "object": "/assets/model/obj/marker6_new.obj"
    },
    {
      "partName": "marker_7",
      "normal": "",
      "alpha": "",
      "material": "",
      "object": "/assets/model/obj/marker7_new.obj"
    },
    {
      "partName": "marker_8",
      "normal": "",
      "alpha": "",
      "material": "",
      "object": "/assets/model/obj/marker8_new.obj"
    },
    {
      "partName": "marker_9",
      "normal": "",
      "alpha": "",
      "material": "",
      "object": "/assets/model/obj/marker9_new.obj"
    },
    {
      "partName": "marker_10",
      "normal": "",
      "alpha": "",
      "material": "",
      "object": "/assets/model/obj/marker10_new.obj"
    },
    {
      "partName": "marker_11",
      "normal": "",
      "alpha": "",
      "material": "",
      "object": "/assets/model/obj/marker11_new.obj"
    },
    {
      "partName": "marker_12",
      "normal": "",
      "alpha": "",
      "material": "",
      "object": "/assets/model/obj/marker12_new.obj"
    },
    {
      "partName": "marker_13",
      "normal": "",
      "alpha": "",
      "material": "",
      "object": "/assets/model/obj/marker13_new.obj"
    },
    
    {
      "partName": "front_panel",
      "normal": "/assets/model/textures/front_panel/Normal.png",
      "alpha": "/assets/model/textures/front_panel/Alpha.png",
      "material": "/assets/model/materials/front_panel_new.mtl",
      "object": "/assets/model/obj/front_panel_new.obj"
    },
   
    {
      "partName": "back_panel",
      "normal": "/assets/model/textures/front_panel/Normal.png",
      "alpha": "/assets/model/textures/front_panel/Alpha.png",
      "material": "/assets/model/materials/back_panel_new.mtl",
      "object": "/assets/model/obj/back_panel_new.obj"
    },
     
    {
      "partName": "concrete",
      "normal": "/assets/model/textures/front_panel/Normal.png",
      "alpha": "/assets/model/textures/front_panel/Alpha.png",
      "material": "/assets/model/materials/concrete_new.mtl",
      "object": "/assets/model/obj/concrete_new.obj"
    },  
    
    {
      "partName": "equipment",
      "normal": "/assets/model/textures/front_panel/Normal.png",
      "alpha": "/assets/model/textures/front_panel/Alpha.png",
      "material": "/assets/model/materials/equipment_new.mtl",
      "object": "/assets/model/obj/equipment_new.obj"
    },
    {
      "partName": "front_deadfront",
      "normal": "/assets/model/textures/front_panel/Normal.png",
      "alpha": "/assets/model/textures/front_panel/Alpha.png",
      "material": "/assets/model/materials/front_deadfront_new.mtl",
      "object": "/assets/model/obj/front_deadfront_new.obj"
    },
    
    {
      "partName": "back_deadfront",
      "normal": "/assets/model/textures/front_panel/Normal.png",
      "alpha": "/assets/model/textures/front_panel/Alpha.png",
      "material": "/assets/model/materials/back_deadfront_new.mtl",
      "object": "/assets/model/obj/back_deadfront_new.obj"
    }, 
    
    {
      "partName": "main_body",
      "normal": "/assets/model/textures/main_body/Normal.png",
      "alpha": "/assets/model/textures/main_body/Alpha.png",
      "material": "/assets/model/materials/main_body_new.mtl",
      "object": "/assets/model/obj/main_body_new.obj"
    },
   
   
  ];


  public isDoorOpen: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  public isDeadfrontOn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  public isPaneOpen: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public partData: BehaviorSubject<Part> = new BehaviorSubject<Part>({
    title: "",
    image: "",
    content: ""
  });
  private paneTime: number = 800;
  public selectedItem: BehaviorSubject<number> = new BehaviorSubject<number>(20);
  public _hotspots: BehaviorSubject<Hotspot[]> = new BehaviorSubject<Hotspot[]>([]);
  public loading: BehaviorSubject<string> = new BehaviorSubject<string>('');



  camera!: any;
  controls!: any;

  public setCameraInstance(camera: any){
    this.camera = camera;
  }

  public setControlsInstance(controls: any){
    this.controls = controls;
  }

  public toggleDoor(value: boolean){
    this.isDoorOpen.next(value);
  }

  public toggleDeadfront(value: boolean){
    this.isDeadfrontOn.next(value);
  }

  public getPaneData(): Part[]{
    return this.parts;
  }

  public getObjParts(): ObjPart[]{
    return this.objParts;
  }

  
  public setPartdata(idx: number): void{
    this.partData.next(this.parts[idx]);
    this.selectedItem.next(idx);
  }

  public toggleInfoPane(value: boolean): void{
    /*
    setTimeout(() => {
      this.isPaneOpen.next(value);
    }, this.paneTime);
  */
    }

  public focusPart(idx: number){

    let camera = this.camera;
    //let scene = this.scene;
    let controls = this.controls;
    let distance = 4;
    let hotspots = this._hotspots.getValue();
    //controls.maxPolarAngle = Math.PI / 2;
    //controls.minPolarAngle = Math.PI / 3;
    controls.maxDistance = distance;
    controls.minDistance = distance;

    console.log(this._hotspots.getValue());

    //do the animation
    gsap.to(this.camera.position, { x:this._hotspots.getValue()[idx].x, y: 0, z: this._hotspots.getValue()[idx].z,
      //ease: "back.out",
      onUpdate: function(){
        camera.lookAt( new THREE.Vector3(hotspots[idx].x, hotspots[idx].y, hotspots[idx].z) ) 
        controls.update();
      },
      onStart: function(){
        //do stuff
      },
      onComplete: function(){
        //reset the distances
        controls.maxDistance = 10;
        controls.minDistance = 1;
      }
      })
      .play()
      

  }

}
