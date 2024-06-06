import { Injectable } from '@angular/core';
import { Observable, lastValueFrom, of, BehaviorSubject, Subject } from "rxjs";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  public config!:Observable<any>;

  public splitscreenSubject: Subject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    private httpClient: HttpClient
  ) {
      //read the file when the service loads 
     this.config = this.httpClient.get<any>('./assets/categories.json', {headers: new HttpHeaders({'Content-Type': 'application/json'})});
      //this.config = this.httpClient.get<any>('http://franklinevo.clientdemos.net/wp/wp-content/uploads/2023/09/categories.json');
      //this.config = this.httpClient.get<any>('http://franklinwp.clientdemos.net/wp-content/uploads/2023/09/categories.json');
     //this.config = this.httpClient.get<any>('https://www.franklinfueling.com/wp-content/uploads/2023/09/categories.json');
    
     
   }

  //---- populates the subcategories or each main section/category
  public getSectionCategories(name: string){

    return this.config.pipe(
      map((json) => {
        return json.categories;
      }),
      map((categories) => {
        let _subcategories:any;
       
        categories.map((cat:any) => {
         
          if(cat.name == name){
           _subcategories = cat.subcategories;
          }  
        });
    
        let subcategories:string[] = [];
        let r = _subcategories.replace("[", "");
        let s =  r.replace("]", "");
        
        let _subs = s.replace(/["']/g, "");
        let _subsArray = _subs.split(",");

        _subsArray.map((it:string) => {
          subcategories.push(it.trim());
        });

        return subcategories;
      })
    );
  
  }

  //---- populates the sie nav with the category titles
  public async getNavData(){

    let categories!:any;

    await Promise.all(
    await lastValueFrom(this.config.pipe(
      map((json) => {
        return categories =  json.categories;
      })
    )));

    await Promise.all(
    categories.map(async (cat:any) => {
      let subs = await lastValueFrom(this.getSectionCategories(cat.name));
        //console.log(subs);
        cat["subcategories"] = subs;
        cat["slug"] = cat.name.replaceAll(" ", "-");
    
    }));

    return of(categories);
   
  }

  public getSectionVideoTime(name:string){

    return lastValueFrom(this.config.pipe(
      map((json) => {
        return json.categories;
      }),
      map((categories) => {
        let time = "";
        categories.map((cat:any) => {
          if(cat.name == name){
            time = cat.time;
          }  
        });
    
        return time;
      })
    ));
   
  }

  public getSectionIntroVideo(name: string){

    return lastValueFrom(this.config.pipe(
      map((json) => {
        return json.categories;
      }),
      map((categories) => {
        let intro = "";
        categories.map((cat:any) => {
          if(cat.name == name){
            intro = cat.intro_video;
          }  
        });
    
        return intro;
      })
    ));

  }


  //---- populates the data for the subcategories
  public getCategoryData(name:string){

    return lastValueFrom(this.config.pipe(
      map((json:any) => {
        return json.subcategories;
      }),
      map((subcategories) => {
        let subcategory = "";
        subcategories.map((sub:any) => {
          if(sub.name == name){
            subcategory = sub;
          }
        });
        return subcategory;
      })   
    ));

  }

  public getIdleVideo(){
   return lastValueFrom(this.config.pipe(
    map((json) => {
     return json.idle;
    })
   ));
  }
  
}
