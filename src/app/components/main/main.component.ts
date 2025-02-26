import { Component, OnInit, AfterViewInit, OnDestroy, HostListener, AfterContentInit, ViewChild, ElementRef, inject } from '@angular/core';
import { DataService } from '../../services/data.service';
import { SplitscreenService } from '../../services/splitscreen.service';
import { BehaviorSubject, Observable, Subject} from 'rxjs';

import Hls from 'hls.js';
import { NexphaseService } from 'src/app/services/nexphase.service';

let catTimer: any;
let timer: any;
let inactiveTimer: any

@Component({
  selector: 'app-main',
  standalone: false,
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})

export class MainComponent implements OnInit, AfterViewInit, OnDestroy{

  constructor(
    private dataService: DataService,
    private splitscreenService: SplitscreenService,
  ){
    this._setTimeout();
    this.userInactive.subscribe(() => {
      this.setDefaultView();
      if(this.isMenuActive){
        this.isMenuActive = false;
      }
     
    });
  }

  _setTimeout() {
    this.userActivity = setTimeout(() => this.userInactive.next(undefined), this.timeouttime);
  }

  @HostListener('window:mousemove') refreshUserState() {
    clearTimeout(this.userActivity);
    clearTimeout(inactiveTimer);
    this._setTimeout();
  }


  @HostListener('window:resize', ['$event'])
  onResize() {
    //-- ON RESIZE CHECK THE WINDOW SIZING
    this.innerWidth = window.innerWidth;
    this.checkWindowSize(this.innerWidth);
   
  }


  //HSL PLAYERS
  @ViewChild('idleVideoNew', {static: true}) idleVideoNew!: ElementRef<any>;
  idleVideoElement!: HTMLVideoElement;

  @ViewChild('categoryVideoNew', {static: true}) categoryVideoNew!: ElementRef<any>;
  categoryVideoElement!: HTMLVideoElement;

  @ViewChild('subCategoryVideoNew', {static: true}) subCategoryVideoNew!: ElementRef<any>;
  subCategoryVideoElement!: HTMLVideoElement;

  public isStarting: boolean = true;
  public isFirstLoad: boolean = true;

  public innerWidth!:any; 

  //vimeo vars
  public showIdleVideoPlayer: boolean = true;
  public showCategoryVideoPlayer: boolean = false;
  public showSubCategoryVideoPlayer: boolean = false;
  public isPausedBybSubcatSelect: boolean = false;
  public isVimeoLoading: boolean = false;
  public shouldOpenTab: boolean = false;

  public idlee!:string;
  public isMenuActive:boolean = false;
  public isSectionSelected:boolean = false;
  public isSubCategorySelected:boolean = false;
  public isIntroVideoLoaded: boolean = false;
  public isSubVideoLoaded:boolean = false;
  public videosFolder = "../../assets/videos/";
  public isSubVideoRunning: boolean = false;
  public contentBoxTimer:any = "";
  public contentShouldBeVisible:boolean = false;
  public isMoreInfoSelected:boolean = false;
  public buttonShouldDisplay: boolean = false;
  public currentCategory:string = "";
  public timeouttime:number = 1200000; //12000
  public isDesktop:boolean = true;
  public isMobile:boolean = false;
  public shouldShowSubmenu = false;

  public titles!:Observable<any[]>;  
  public data!:any;
  public subcategories!:Observable<string[]>;
  public categorySelected!:string;
  public subCategorySelected!:string;
  public categoryVideo!:string;
  public subCategoryVideo!:any;
  public isVideoOnQueue:string = "";
  public videoDuration!:any;
  public videoFrameStart!:any;
  public selectedItem!:any;
  public shouldDisableBtn:boolean = true;
  public shouldDisableMiniMenu:boolean = false;
  public isIdle:boolean = true;
  public oldTime!:any;
  public breadcrumbsShouldBeVisible:boolean = false;
  public breadcrumbCat!:string;
  public breadcrumbSubCat!: string;

  public userActivity!:any;
  public userInactive: Subject<any> = new Subject();
  public isVideoPaused: BehaviorSubject<boolean> = new BehaviorSubject(false);

  //variable speed
  public isVariableSpeed: boolean = false;
  public shouldMinimizeSubmenu:boolean = false;

  //nexphase
  public isNexphase: boolean = false;
  public hideCanvas: boolean = true;
  public isAppLoading: boolean = true;

  public nexphaseService = inject(NexphaseService);

  public checkWindowSize(innerwidth: number){
    if(innerwidth <= 579){
      this.isMobile = true;
      this.isDesktop = false;
      this.shouldShowSubmenu = false;

      //mobile check needed for the splitscreen options
      this.dataService.isDesktopCheck.next(this.isDesktop);
    }
    else if(innerwidth >= 580 && innerWidth <= 1200){
      this.isMobile = false;
      this.isDesktop = false;

      //mobile check needed for the splitscreen options
      this.dataService.isDesktopCheck.next(this.isDesktop);
      //this.shouldShowSubmenu = true;
    }else{
      this.isMobile = false;
      this.isDesktop = true;

      //mobile check needed for the splitscreen options
      this.dataService.isDesktopCheck.next(this.isDesktop);
      //this.shouldShowSubmenu = true;
    }
  }

  public setDefaultView(){
    console.log("SETS THE APP TO THE INITIAL STATE");
    
    // clear the timer
    if(timer){
      clearTimeout(timer);
    }
    
    
    //clean the ui
    this.isSectionSelected = false;
    this.isSubCategorySelected = false;
    this.isSubVideoLoaded = false;
    this.isSubVideoRunning = false;

    this.categoryVideo = "";
    this.subCategoryVideo = "";
   
    this.showCategoryVideoPlayer = false;
    this.showSubCategoryVideoPlayer = false;
    this.contentShouldBeVisible = false;
    this.breadcrumbsShouldBeVisible = false;
    this.isMoreInfoSelected = false;
  
    //play the idle video again
    this.isFirstLoad = true;
    this.idleVideoElement.play();

  }


  public openMenu(){
    this.isMenuActive = !this.isMenuActive;
    
  }

  public showSubMenu(){
    this.shouldShowSubmenu = !this.shouldShowSubmenu;
  }

  public async getData(){
   
    let categories = await this.dataService.getNavData();
    this.titles = categories;
  
    //---- get and set the idle video
    this.idlee = await this.dataService.getIdleVideo(); 
   
  
  }

  public async onCategorySelect(name:string, $event: Event, slug:string){

    //this.toggleNexphase(false);

    this.hideCanvas = true;

    this.isVariableSpeed = false;
    this.shouldMinimizeSubmenu = false;

    this.dataService.splitscreenSubject.next(false);

    //console.log("ISVARIABLESPEED: ", this.isVariableSpeed)

    clearTimeout(timer);

    if(this.isStarting){
      this.isStarting = false;
    }

    if(!this.isMobile){
      this.isVimeoLoading = true;
    }
  
    if(this.showSubCategoryVideoPlayer){
      this.showSubCategoryVideoPlayer = false;
    }
 
    //disable the subcategory buttons
    this.shouldDisableBtn = true;
    this.breadcrumbCat = name;
    this.breadcrumbSubCat = "";
    this.breadcrumbsShouldBeVisible = false;
    
    //pause the idle videos
    this.idleVideoElement.pause();

    this.categorySelected = name;
    this.selectedItem = "";
    this.isVideoOnQueue = ""
    this.isSubVideoRunning = false;
    this.isSubVideoLoaded = false;
    this.buttonShouldDisplay = false;

    this.isSectionSelected = true;
    this.contentShouldBeVisible = true;

    //pass subcategories for the submenu
    this.subcategories = this.dataService.getSectionCategories(name);

    //set the category intro video
    this.categoryVideo = await this.dataService.getSectionIntroVideo(name);
    //get the time
    let v_time:any = await this.dataService.getSectionVideoTime(this.categorySelected);
  
    //load the video
    if(!this.isMobile){

      //console.log("loding category video: ", this.categoryVideo)
      this.loadVideos("category", this.categoryVideo);
      this.isVimeoLoading = false;
      //show the category player
      this.showCategoryVideoPlayer = true;
   
      //set the timer for pausing the category video
      catTimer = setTimeout(() => {
        this.shouldDisableBtn = false;
        this.shouldShowSubmenu = true;
      }, v_time);
  
      //ui cleaning
      this.isMenuActive = false;
      this.showCategoryVideoPlayer = true;
      this.breadcrumbsShouldBeVisible = true;
     

    }

    //do mobile stuff
    if(this.isMobile){
      //toggle the class
      let submenu: HTMLElement | null = document.querySelector(`#${slug}-submenu`);
      if(submenu){
        if(submenu.classList.contains('open')){
          submenu.classList.remove('open');
          submenu.style.height = "0px";
        }else{
          submenu.classList.add('open');
          console.log(submenu);
          //find out how many children it has
          let innerMenu = submenu.firstElementChild;
          let count:any | undefined = innerMenu?.childElementCount;
          
          if(count){
            let setHeight: number =   (parseInt(count) * 20) * 2;
            //console.log(setHeight);
            submenu.style.height = setHeight + "px";
          }       
        }
      }
    }

   
  }


  public async onSubCategorySelect(name:string, index:any){
   
    this.hideCanvas = true;

    if(!this.isDesktop){
      //close the menu
      this.isMenuActive = false;
      this.idleVideoElement.play();
    }

    //set the first load to false
    if(this.isFirstLoad){
      this.isFirstLoad = false;
    }

    this.isVimeoLoading = true;
   
   
    //alert(timer);
    if(timer){
      clearTimeout(timer);
    }
    
    //clear the stuff
    this.buttonShouldDisplay = false;
    this.isSubCategorySelected = false;
    this.isSubVideoLoaded = true;

    //Set the active
    this.selectedItem = index;

    //get and set the data
    let categoryData:any = await this.dataService.getCategoryData(name);
    this.data = categoryData["description"];
    this.subCategoryVideo = categoryData["video"];
    this.videoDuration = categoryData["video_duration"];
    this.videoFrameStart = categoryData["video_frame_animation_start"];

/*
    if(name == "Pump Selection"){
      this.isVariableSpeed = true;     
      this.shouldMinimizeSubmenu = true;
      this.splitscreenService.splitData.next(this.data);
    }else{
      this.isVariableSpeed = false;
      this.shouldMinimizeSubmenu = false;
      //this.splitscreenService.splitData.next('');
      this.dataService.splitscreenSubject.next(false);
    }

*/


    if(name == "Pump Selection"){
      this.toggleSplitscreen(true);
    }else if(name == 'Nexphase'){
      //this.toggleNexphase(true);
      if(this.isNexphase == false){
        this.isNexphase = true;
      }
      this.hideCanvas = false;
      this.isSubVideoRunning = false;
      this.isVimeoLoading = false;
      //this.categoryVideoElement.pause();
      this.subCategoryVideoElement.pause();
      this.subCategoryVideo = '';
      this.categorySelected = '';
      this.subCategorySelected = '';
     
    }else{
      this.disableSpecialSections();
      this.subcategoryVideosHandler(categoryData);
    }

    //console.log("ISVARIABLESPEED: ", this.isVariableSpeed)

    //if theres a video already running?
    /*
    if(this.isSubVideoRunning){  

      console.log("THERES A SUBCATEGORY VIDEO RUNNING")
      this.isVimeoLoading = false;
      //trigger for pause checking
      this.isPausedBybSubcatSelect = true;  
      
      //set a video on the queue
      this.isVideoOnQueue = categoryData["video"];
      
      //get previous video data
      let oldData:any = await this.dataService.getCategoryData(this.subCategorySelected);
      
      //get the current time of the vimeo player
      let currTime = this.subCategoryVideoElement.currentTime;
      if(currTime && (currTime < (Math.floor((oldData["video_duration"]/ 1000))))){
        this.subCategoryVideoElement.currentTime = Math.floor((oldData["video_duration"]/ 1000));  
      }

      //play the video again
      this.subCategoryVideoElement.play();
    
    }else{
      
      //console.log("loding subcategory video: ", this.subCategoryVideo);
      this.loadVideos("subcategory", this.subCategoryVideo)
      //show subcategory video
      this.showSubCategoryVideoPlayer = true;     
      //set it to have a video running - for the queue
      this.isSubVideoRunning = true;
      this.isVimeoLoading = false;
    
    }
   */

    this.subCategorySelected = name;
    this.breadcrumbSubCat = name;

    //-- CHECK IF WE ARE ON MOBILE AND HIDE THE SUBMENU
    if(!this.isDesktop){
      this.shouldShowSubmenu = false;
      this.breadcrumbsShouldBeVisible = true;
    }

  }


  public async subcategoryVideosHandler(categoryData:any){
    //if theres a video already running?
    if(this.isSubVideoRunning){  

      console.log("THERES A SUBCATEGORY VIDEO RUNNING")
      this.isVimeoLoading = false;
      //trigger for pause checking
      this.isPausedBybSubcatSelect = true;  
      
      //set a video on the queue
      this.isVideoOnQueue = categoryData["video"];

      //get previous video data
      let oldData:any = await this.dataService.getCategoryData(this.subCategorySelected);
      
      //get the current time of the vimeo player
      let currTime = this.subCategoryVideoElement.currentTime;
      if(currTime && (currTime < (Math.floor((oldData["video_duration"]/ 1000))))){
        this.subCategoryVideoElement.currentTime = Math.floor((oldData["video_duration"]/ 1000));  
      }
      //play the video again
      this.subCategoryVideoElement.play();
    
    }else{
      //console.log("loding subcategory video: ", this.subCategoryVideo);
      this.loadVideos("subcategory", this.subCategoryVideo)
      //show subcategory video
      this.showSubCategoryVideoPlayer = true;     
      //set it to have a video running - for the queue
      this.isSubVideoRunning = true;
      this.isVimeoLoading = false;   
    }
  }


  public closeSubcategory(){
   
    this.buttonShouldDisplay = true;

    //check where the event is coming from 
    if(this.isMoreInfoSelected){
      this.isMoreInfoSelected = false;
    }else{
      //this.subcategoryVideoPlayer.play();
      this.shouldDisableBtn = false;
      this.isSubVideoRunning = false;
      this.shouldDisableMiniMenu = false;
      
    }
   
  }

  public openSubcategoryInfo(){
   this.isMoreInfoSelected = true;
   this.buttonShouldDisplay = false;
   //this.isVideoPaused.next(false);
  }

  public async replaySubcategoryVideo(){

    clearTimeout(timer);
    this.buttonShouldDisplay = false;
    
    this.subCategoryVideoElement.currentTime = this.videoFrameStart;
    this.subCategoryVideoElement.play();

    //reset the timer to have the correct stopping point after the replay
    timer = setTimeout(() => {
      //console.log("ONSELECTSUB TIMER");
      this.subCategoryVideoElement.pause();
      this.shouldDisableBtn = false;
      this.shouldDisableMiniMenu = false;
      this.buttonShouldDisplay = true; 
     
    }, this.videoDuration - (this.videoFrameStart * 1000));

  }

  //load the videos according to the data type passed
  public loadVideos(type: string, src:string){
    var hls = new Hls();
    hls.loadSource(src);

    //loads the idle video
    if(type == 'idle'){
      console.log("LOADING IDLE VIDEO");

      if(this.idleVideoElement.canPlayType('application/vnd.apple.mpegurl')){
        this.idleVideoElement.src= src;
      }else{
        hls.attachMedia(this.idleVideoElement);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          this.idleVideoElement.muted = true;
          this.idleVideoElement.play();
        });
      }
    }

    //loads the category video
    if(type == 'category'){
      console.log("LOADING CATEGORY VIDEO");

      if(this.categoryVideoElement.canPlayType('application/vnd.apple.mpegurl')){
        this.categoryVideoElement.src= src;
      }else{
        hls.attachMedia(this.categoryVideoElement);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          this.categoryVideoElement.muted = true;
          this.categoryVideoElement.play();
        });
      }
      
    }
   
    //loads the category video
    if(type == 'subcategory'){
      console.log("LOADING SUBCATEGORY VIDEO");
      if(this.subCategoryVideoElement.canPlayType('application/vnd.apple.mpegurl')){
        this.subCategoryVideoElement.src= src;
      }else{
        hls.attachMedia(this.subCategoryVideoElement);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          this.subCategoryVideoElement.muted = true;
          this.subCategoryVideoElement.play();  
        });
      }
    }
    
  }

  public minimizeSubMenu() {
    this.shouldMinimizeSubmenu = !this.shouldMinimizeSubmenu;
  }

  public toggleSplitscreen(isSelected: boolean){
    this.isVariableSpeed = isSelected;     
    this.shouldMinimizeSubmenu = isSelected;
    this.splitscreenService.splitData.next(this.data);
  }

  public toggleNexphase(isSelected: boolean){
    this.isNexphase = isSelected;
    //NOTE --- might need to disable/ hide videos***
    //this.showSubCategoryVideoPlayer = false;
    this.isSubVideoRunning = false;
    this.isVimeoLoading = false;
    //this.categoryVideoElement.pause();
    this.subCategoryVideoElement.pause();
    this.subCategoryVideo = '';
    this.categorySelected = '';
    this.subCategorySelected = '';
    //TODO --- add observable for this prop
  }

  public disableSpecialSections(): void{
    this.isVariableSpeed = false;
    this.isNexphase = false;
    this.shouldMinimizeSubmenu = false;
    //this.splitscreenService.splitData.next('');
    this.dataService.splitscreenSubject.next(false);
  }

  //--- AFTERVIEWINIT
  async ngAfterViewInit(): Promise<any>{
   
    //-- DEFINE THE PLAYERS 
    this.idleVideoElement = this.idleVideoNew?.nativeElement;
    this.categoryVideoElement = this.categoryVideoNew?.nativeElement;
    this.subCategoryVideoElement = this.subCategoryVideoNew?.nativeElement;
        
    //--- WAIT FOR THE DATA
    await this.getData();
   
    //--- INIT THE PLAYERS (LOAD THE IDLE VIDEO)
    this.loadVideos("idle", this.idlee);
   
    this.isVimeoLoading = false;

    if(this.subCategoryVideoElement){

      //playing event for subcategory videos
      this.subCategoryVideoElement.addEventListener("playing", () => {
        this.isVimeoLoading = false;
        if(!this.isFirstLoad){
    
          //if there is a new select
          if(!this.isPausedBybSubcatSelect){
           
            timer = setTimeout(async () => {
              this.subCategoryVideoElement.pause();
              this.isVideoPaused.next(true);

              if(this.isVariableSpeed){
                this.dataService.splitscreenSubject.next(this.isVariableSpeed);
              }
              
            }, Math.floor(this.videoDuration))
          }
        }

      });




      //ended event for subcategory videos
      this.subCategoryVideoElement.addEventListener("ended", () => {
        console.log("SUBCATEGORY VIDEO IS DONE!!");
        clearTimeout(timer);

        //set the checking for pause to be false
        this.isPausedBybSubcatSelect = false;
        if(this.isVideoOnQueue != ""){
         
          this.isVimeoLoading = true;
          //load the video on the queue
          this.subCategoryVideo = this.isVideoOnQueue;

          //load the video on queue
          this.loadVideos('subcategory', this.subCategoryVideo);
          this.isVimeoLoading = false;
          
   
        }
        this.shouldDisableBtn = false;
        this.shouldDisableMiniMenu = false;
        this.isVideoOnQueue = "";
      });
    }


  }




  ngOnInit(): void { 
  
    //-- SET INNERWIDTH
    this.innerWidth = window.innerWidth;
  
    //-- CHECK WINDOW WIDTH
    this.checkWindowSize(this.innerWidth);
    
    this.isVimeoLoading = true;
    this.isVideoPaused.subscribe((value) => {
      if(value){
        //console.log("SUBJECT CHANGED!!")
        this.isSectionSelected = true;
        this.contentShouldBeVisible = true;
        this.shouldDisableBtn = false;
        this.shouldDisableMiniMenu = false;
        this.buttonShouldDisplay = true;
        this.isVideoPaused.next(false);
      }
    })
  
  /*  setTimeout(() => {
  
    this.isAppLoading = false;
    console.log("component initialized!");
   }, 10000)
   */
    this.nexphaseService.loading.subscribe((value) => {
      if(value == "LOADED"){
        this.isAppLoading = false;
      }
    })

  }

  ngOnDestroy(): void {
      clearTimeout(timer);
  }

}
