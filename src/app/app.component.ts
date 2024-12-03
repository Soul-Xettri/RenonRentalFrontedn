import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { BusinessTypeComponent } from "./business-type/business-type.component";
import { AddvehicleComponent } from "./addvehicle/addvehicle.component";
import { CompanyComponent } from './company/company.component';
import { CarInfoComponent } from './car-info/car-info.component';
import { ScooterComponent } from './scooter/scooter.component';
import { BicycleComponent } from './bicycle/bicycle.component';
import { ModeComponent } from './mode/mode.component';
import { LoginComponent } from './login/login.component';
import { NavbarComponent } from './navbar/navbar.component';
import { PokharaMapComponent } from './components/pokhara-map/pokhara-map.component';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,PokharaMapComponent,RouterLink,BusinessTypeComponent,PokharaMapComponent,AddvehicleComponent,CompanyComponent,CarInfoComponent,ScooterComponent,BicycleComponent , RouterLinkActive,ModeComponent,LoginComponent,NavbarComponent,],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
  
})
export class AppComponent {
  title = 'RevOn_Project';
     
}

