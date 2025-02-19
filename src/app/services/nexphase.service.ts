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
      "partName": "marker",
      "texture": "",
      "material": "",
      "object": "/assets/model/obj/marker.obj"
    },
    {
      "partName": "marker_2",
      "texture": "",
      "material": "",
      "object": "/assets/model/obj/marker_2.obj"
    },
   
    {
      "partName": "main_body",
      "texture": "/assets/model/textures/metal_frame_alpha.png",
      "material": "/assets/model/materials/main_body.mtl",
      "object": "/assets/model/obj/main_body.obj"
    },
    {
      "partName": "back_panel",
      "texture": "",
      "material": "/assets/model/materials/back_panel.mtl",
      "object": "/assets/model/obj/back_panel.obj"
    },
    {
      "partName": "front_equipment",
      "texture": "",
      "material": "/assets/model/materials/front_equipment.mtl",
      "object": "/assets/model/obj/front_equipment.obj"
    },
    {
      "partName": "deadfront",
      "texture": "",
      "material": "/assets/model/materials/deadfront.mtl",
      "object": "/assets/model/obj/deadfront.obj"
    },
    {
      "partName": "front_panel",
      "texture": "/assets/model/textures/shell_front_door.png",
      "material": "/assets/model/materials/front_panel.mtl",
      "object": "/assets/model/obj/front_panel.obj"
    },
    {
      "partName": "concrete",
      "texture": "/assets/model/textures/concrete.png",
      "material": "/assets/model/materials/concrete.mtl",
      "object": "/assets/model/obj/concrete.obj"
    }
      
    
  ];


  //hotspots coords
  private hotspots: Hotspot[] = [
    {
      
      "x": 0.266,
      "y": 0.503,
      "z": 0.219
    } 
    
    /*
    {
      "x": -0.2,
      "y": 1.9,
      "z": 1
    },
  
    { 
      "x": -0.2,
      "y": 1.6,
      "z": 1
    },
    { 
      "x": 0,
      "y": 1.6,
      "z": 1
    },
    { 
      "x": 0.2,
      "y": 1.5,
      "z": 1
    },
    
    { 
      "x": 0.1,
      "y": 1,
      "z": 1
    },
    { 
      "x": 0.4,
      "y": 1,
      "z": 1
    },
    { 
      "x": 0.1,
      "y": 0.6,
      "z": 1
    },
    {
      "x": 0,
      "y": 0,
      "z": 0
    }
      */
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

  public getHotspots(): Hotspot[]{
    return this.hotspots;
  }

  public setPartdata(idx: number): void{
    this.partData.next(this.parts[idx]);
    this.selectedItem.next(idx);
  }

  public toggleInfoPane(value: boolean): void{
    setTimeout(() => {
      this.isPaneOpen.next(value);
    }, this.paneTime);
  }

  public focusPart(idx: number){

    let camera = this.camera;
    //let scene = this.scene;
    let controls = this.controls;
    let distance = 4;
    let hotspots = this.hotspots
    //controls.maxPolarAngle = Math.PI / 2;
    //controls.minPolarAngle = Math.PI / 3;
    controls.maxDistance = distance;
    controls.minDistance = distance;

    //do the animation
    gsap.to(this.camera.position, { x:this.hotspots[idx].x, y: this.hotspots[idx].y, z: distance,
      duration: 2,
      //ease: "back.out",
      onUpdate: function(){
        camera.lookAt( new THREE.Vector3(hotspots[idx].x, hotspots[idx].y, distance) ) 
        controls.update();
      },
      onStart: function(){
        //do stuff
      },
      onComplete: function(){
        //reset the distances
        controls.maxDistance = 1000;
        controls.minDistance = 0;
      }
      })
      .play()
/*
    //pass the index to the service
    this.nexphaseService.setPartdata(parseInt(idx));
    this.pastIndex = idx;
    e.target.parentNode.classList.add('active')
    
    this.nexphaseService.toggleInfoPane(true);
*/
  }

}
