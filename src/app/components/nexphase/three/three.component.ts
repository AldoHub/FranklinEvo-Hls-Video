import { Component, AfterViewInit, ElementRef, Input, OnInit, ViewChild, inject, HostListener } from '@angular/core';
import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';

//service
import { NexphaseService } from 'src/app/services/nexphase.service';
import { ObjPart } from 'src/app/interfaces/objpart';

import { gsap } from "gsap";
import { Hotspot } from 'src/app/interfaces/hotspot';

@Component({
  selector: 'app-three',
  standalone: true,
  templateUrl: './three.component.html',
  styleUrls: ['./three.component.css']
})
export class ThreeComponent implements OnInit, AfterViewInit {

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.onWindowResize();
  }
  

  public nexphaseService = inject(NexphaseService);

  //canvas ref
  @ViewChild('canvas', {static: true}) canvasRef!: ElementRef<HTMLCanvasElement>;
  private renderer!: THREE.WebGLRenderer;
  private css2drenderer: CSS2DRenderer = new CSS2DRenderer();
  private camera!: THREE.PerspectiveCamera;
  private scene!: THREE.Scene;
  private loaderOBJ: OBJLoader = new OBJLoader();
  private loaderMTL: MTLLoader = new MTLLoader();
  private loaderTexture: THREE.TextureLoader = new THREE.TextureLoader(); 
  private controls!: OrbitControls;
  private ambientLight!: THREE.AmbientLight;
  private directionalLight!: THREE.DirectionalLight;
  
  private light1!: THREE.PointLight;

  private light2!: THREE.PointLight;

  private light3!: THREE.PointLight;

  private light4!: THREE.PointLight;
  private model: any;
  private material: any;
  private texture: any;
  private normalTexture: any;

  //object parts
  private main_body!: THREE.Object3D;
  private back_panel!: THREE.Object3D;
  private front_equipment!: THREE.Object3D;
  private front_panel!: THREE.Object3D;
  private deadfront!: THREE.Object3D;
  private markers: THREE.Object3D[] = [];
  //private markers!: THREE.Object3D;
  private THREEBox: THREE.Group = new THREE.Group();
  private raycaster: THREE.Raycaster = new THREE.Raycaster();
  private isGroup: boolean = true; //tells the way of rendering the objs on the scene - as a whole group or individual pieces

  private objParts!: ObjPart[];
  public hotspots!: Hotspot[];
  public cssLabels: any[] = [];
  private pastIndex!: number;
  

  private async createScene(): Promise<void>{
    console.log("Creating Scene...");
    
    //Create the scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xe9eaea);
    
    //camera settings
    let aspectRatio = this.getAspectRatio();
    this.camera = new THREE.PerspectiveCamera(
      50, // FOV
      aspectRatio,
      0.01, //near clipping page
      1000 //far clipping pane
    );

    this.nexphaseService.setCameraInstance(this.camera);

    this.camera.position.x = -2;
    this.camera.position.y = 1.3;
    this.camera.position.z = 3;//4
    
    //ambient light
    this.ambientLight = new THREE.AmbientLight(0xffffff, 1);
    this.ambientLight.castShadow = true;
    this.scene.add(this.ambientLight);
   
    
    //directional light
    this.directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    this.directionalLight.position.set(-180, 50, 20);
    //this.directionalLight.position.set(180, 50, 20);
    this.directionalLight.castShadow = true;
    this.scene.add(this.directionalLight);
    
    //TODO --- FIX point lights
    /* 
   
    this.light1 = new THREE.PointLight(0xffffff, 10);
    this.light1.position.set(0, 200, 400);
    this.scene.add(this.light1);
    this.light2 = new THREE.PointLight(0xffffff, 10);
    this.light2.position.set(500, 100, 0);
    this.scene.add(this.light2);
    this.light3 = new THREE.PointLight(0xffffff, 10);
    this.light3.position.set(0, 100, -500);
    this.scene.add(this.light3);
    this.light4 = new THREE.PointLight(0xffffff, 10);
    this.light4.position.set(-500, 300, 500);
    this.scene.add(this.light4);
    */

    //load the box
    console.log("Assembling Box...");
    await this.assembleBoxParts();
  }

  //return the native element canvas
  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }

  //aspect ratio
  private getAspectRatio(): number{
    return this.canvas.clientWidth / this.canvas.clientHeight;
  }

/*
  public createCSS2Objects(){
      this.createModelHotspots(this.hotspots);
  }
*/
  private startRenderingLoop(){
    this.renderer = new THREE.WebGLRenderer({canvas: this.canvas, antialias: true});
    this.renderer.setPixelRatio(devicePixelRatio);
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    let component: ThreeComponent = this;
    //
    let labels = this.cssLabels;
    let raycaster = this.raycaster;
    let camera = this.camera;
    let model = this.THREEBox;
    let controls = this.controls;
   
    
    //render
    (function render(): void{
      component.renderer.render(component.scene, component.camera);
      component.css2drenderer.render(component.scene, component.camera)
      requestAnimationFrame(render);
      //--- animations
     // labels[labels.length-1].visible = false;
     /*
      //toggle labels visibility
      labels.map((label, i) => {
        label.getWorldPosition(raycaster.ray.origin);
        let rd = camera.position.clone().sub(raycaster.ray.origin).normalize();
        raycaster.ray.direction.set(rd.x, rd.y, rd.z);
        let hits = raycaster.intersectObjects([model]);
     
        if(i != labels.length -1){
          if(hits.length > 0) {
            label.visible = false;
          }else{
            label.visible = true;
          }
        }
       
      });
  */
    }());
   
  }

  private createCSS2DRenderer = () => {
    console.log("Creating CSS2DRender...");
    this.css2drenderer.setSize(window.innerWidth, window.innerHeight);
    this.css2drenderer.domElement.style.position = 'absolute';
    this.css2drenderer.domElement.style.top = '0px';
    //get the correct wrapper for the rendered canvas
    let nexphaseWrapper2 = document.querySelector('.three-wrapper .full-width');
    //append the CSS2DRenderer
    nexphaseWrapper2?.appendChild(this.css2drenderer.domElement);
  };

  private createControls = () => {
    console.log("Loading controls...");
    //set controls and settings
    this.controls = new OrbitControls(this.camera, this.css2drenderer.domElement);
    this.controls.autoRotate = false;
    this.controls.enableZoom = true;
    this.controls.enablePan = false;
    this.controls.update();
    
    this.nexphaseService.setControlsInstance(this.controls);
   
  };

  private async assembleBoxParts(): Promise<void>{
    
    //use the parts array
    this.objParts.map((part, idx) => {
      //create each part
      this.createOBJ(part.texture, part.material, part.object, part.partName, idx)
    });

  }

  private async createOBJ(texturePath: string, materialPath: string, OBJPath: string, partName: string, idx: number){
   console.log("Creating ", partName)
   
   //load the material
   await this.loaderMTL.load(materialPath, (mtl: MTLLoader.MaterialCreator) => {
    
      const texturesSRC = [
         texturePath,
         "/assets/model/textures/metal_frame_N.png"
      ].map(texture => texture)
      
      Promise.all(this.getTextures(texturesSRC))
        .then(textures => {
            
            if(textures.length == 1) {
              this.texture = '';
              this.normalTexture = textures[0];
            }else{
              this.texture = textures[0];
              this.normalTexture = textures[1]
            }
            //setting material
            this.material = mtl;
            this.material.preload();
            this.loaderOBJ.setMaterials(this.material);
            
        })
        .catch(err => console.error(err))

          //setting model obj
          this.loaderOBJ.load(OBJPath, (obj: THREE.Object3D ) => {
          this.model = obj;
        
          if(this.isGroup){
            //add to group
            this.THREEBox.add(this.model);
          }
        
          //adding texture
          this.model.traverse((o: any) => {
            if(o.isMesh){
              o.material.map = this.texture;
              //load the normal map
              o.material.normalMap = this.normalTexture;
            }
          });
        
          this.THREEBox.layers.enableAll();
  
          //assign to the global vars  
        
          if(partName == 'main_body') {
            this.main_body = obj;
          }
          if(partName == 'back_panel') {
            this.back_panel = obj;
          }
          if(partName == 'front_equipment') {
            this.front_equipment = obj;
          }
          if(partName == 'deadfront') {
            this.deadfront= obj;
            //console.log("DEADFRONT:_ ", this.deadfront, obj)
          }
          if(partName == 'front_panel') {
            this.front_panel= obj;
          }
  
          if(partName.includes("marker")){
            //this.markers = obj;
            //console.log(this.markers)
            this.markers.push(obj);
          }
          //check if its a group and render it as a whole at the end of the proccessing
          if(this.isGroup){
            if(this.objParts.length == (idx + 1)){
              this.addGroupToScene();
              this.createModelHotspots(this.markers)
              //this.createModelHotspots(this.hotspots)
            }
          }else{
            //add the objects to the scene individually
            this.scene.add(this.model);
          }
          
        });
      
      })
      
  }
  //load the textures
  private getTextures (texturesSources: any) {
    const loader = new THREE.TextureLoader()
    return texturesSources.map((textureSource: any) => {
        return new Promise((resolve, reject) => {
            loader.load(
                textureSource,
                texture => resolve(texture),
                undefined, // onProgress callback not supported from r84
                err => reject(err)
            )
        })
    })
}

  private centerGroupBox(){
    //center and add the model to the scene     
    const box = new THREE.Box3().setFromObject(this.THREEBox);
    const center = box.getCenter(new THREE.Vector3());
    this.THREEBox.position.sub(center);
  }

  private addGroupToScene(){
    //center the entire group
    this.centerGroupBox();      
    //add the group of objects to the scene
    this.scene.add(this.THREEBox);
    
  }

  private getObjectParts(){
    this.objParts = this.nexphaseService.getObjParts();
  }

  public loadHotspots(){
    this.hotspots = this.nexphaseService.getHotspots();
  }

  private createModelHotspots(hotspots: any){
   
   this.scene.updateMatrixWorld(true);
console.log(this.markers)
    this.markers.map((h: any, i: number) => {

      console.log(h.children[0])
      
      let mesh: THREE.Mesh =h.children[0];
      
      mesh.geometry.computeBoundingBox();
      let center = new THREE.Vector3();
      mesh.geometry.boundingBox?.getCenter(center);
      mesh.geometry.center();
      mesh.position.copy(center);
      /*
      let pos = new THREE.Vector3();
     console.log(h);
      pos.setFromMatrixPosition( h.matrixWorld );
      console.log(pos);
      */
      h.layers.enableAll();
      //create the element wrapper
      let outerDiv = document.createElement('div');
     
      outerDiv.setAttribute('data-index', i.toString())
      //create the element label
      let elemDiv = document.createElement('div');
      elemDiv.textContent = (i + 1).toString();
      outerDiv.className = 'hotspot';
      outerDiv.appendChild(elemDiv);
     
      //create the CSS2D object using the element created before
      let hotspotLabel = new CSS2DObject(outerDiv);
      hotspotLabel.position.set( mesh.position.x, mesh.position.y, mesh.position.z );
      this.cssLabels.push(hotspotLabel);
      hotspotLabel.center.set( 1, 1 );
      //h.add(hotspotLabel);
      //this.markers.add(hotspotLabel)
      h.add(hotspotLabel)
      hotspotLabel.layers.set( 0 );
     
      //add the event to the circles
      elemDiv.addEventListener("pointerdown", (e: any) => {
        e.stopPropagation();

        let target = e.target.parentNode;
        let idx = target.getAttribute('data-index');
        
        //TODO -- remove all actiive classes on the hotspots
        let hotspots = document.querySelectorAll(".hotspot");
        let spots = Array.from(hotspots);

      spots.map(spot => {
        spot.classList.remove('active');
      })
       
        this.nexphaseService.focusPart(idx);
        //pass the index to the service
        this.nexphaseService.setPartdata(parseInt(idx));
        this.pastIndex = idx;
        e.target.parentNode.classList.add('active')
        
        this.nexphaseService.toggleInfoPane(true);
      })
     
    })
    
   
    
    /*
    hotspots.map((h: any, i: number) => {
      //create the element wrapper
      let outerDiv = document.createElement('div');
      outerDiv.className = 'hotspot';
      
      if(i == hotspots.length -1){
        outerDiv.className = 'hotspot hidden';
      }else{
        outerDiv.className = 'hotspot';
      }
        
      outerDiv.setAttribute('data-index', i.toString())
      //create the element label
      let elemDiv = document.createElement('div');
      elemDiv.textContent = (i + 1).toString();
     

      outerDiv.appendChild(elemDiv);
      //create the CSS2D object using the element created before
      let hotspotLabel = new CSS2DObject(outerDiv);
      hotspotLabel.position.set( h.x, h.y, h.z );
      this.cssLabels.push(hotspotLabel);
      hotspotLabel.center.set( 1, 1 );
      
      this.THREEBox.add(hotspotLabel);
      hotspotLabel.layers.set( 0 );
      
      
      //add the event to the circles
      elemDiv.addEventListener("pointerdown", (e: any) => {
        e.stopPropagation();

        let target = e.target.parentNode;
        let idx = target.getAttribute('data-index');
        
        //TODO -- remove all actiive classes on the hotspots
        let hotspots = document.querySelectorAll(".hotspot");
        let spots = Array.from(hotspots);

      spots.map(spot => {
        spot.classList.remove('active');
      })
       
        this.nexphaseService.focusPart(idx);
        //pass the index to the service
        this.nexphaseService.setPartdata(parseInt(idx));
        this.pastIndex = idx;
        e.target.parentNode.classList.add('active')
        
        this.nexphaseService.toggleInfoPane(true);
      })
        
    })
      */
    
      
  }

 
  private onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.css2drenderer.setSize( window.innerWidth, window.innerHeight );

  }

  ngAfterViewInit(): void {
    this.createScene();
    //this.createCSS2Objects();
    this.startRenderingLoop();
    this.createCSS2DRenderer();
    this.createControls();
   
  }

  ngOnInit(): void {
 
    //get the object parts to render on scene
    this.getObjectParts();
    this.loadHotspots();
  
    //TODO --- HANDLE DESTROY OF SUBSCRIPTIONS
    this.nexphaseService.isDoorOpen.subscribe((value) => {
      this.front_panel.visible = value;
      this.back_panel.visible = value;
    });

    this.nexphaseService.isDeadfrontOn.subscribe((value) => {
      this.deadfront.visible = value;
    });
    
   
  }

}
