import { Injectable } from '@angular/core';
import { Observable, lastValueFrom, of, BehaviorSubject, Subject } from "rxjs";
import { Part } from '../interfaces/part';
import { ObjPart } from '../interfaces/objpart';
import { Hotspot } from '../interfaces/hotspot';


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
    }
  ];


  //hotspots coords
  private hotspots: Hotspot[] = [
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
    }
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


}
