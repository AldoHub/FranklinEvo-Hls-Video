import { NgModule } from '@angular/core';
import {CommonModule} from "@angular/common";

import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';
import { HttpClientModule  } from '@angular/common/http';
import { VimeoPlayerModule } from "@mintplayer/ng-vimeo-player";
import { SpinnerComponent } from '../spinner/spinner.component';
import {VgCoreModule} from '@videogular/ngx-videogular/core';
import {VgControlsModule} from '@videogular/ngx-videogular/controls';
import {VgOverlayPlayModule} from '@videogular/ngx-videogular/overlay-play';
import {VgBufferingModule} from '@videogular/ngx-videogular/buffering';

@NgModule({
  imports: [
    MainRoutingModule,
    CommonModule,
    HttpClientModule,
    VimeoPlayerModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule
  ],
  declarations: [MainComponent, SpinnerComponent]
})
export class MainModule { }