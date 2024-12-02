// import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { AddvehicleComponent } from './addvehicle/addvehicle.component';
import { BusinessTypeComponent } from './business-type/business-type.component';
import { CompanyComponent } from './company/company.component';
import { HomeComponent } from './home/home.component';
import { BusinessComponent } from './business/business.component';
import { SearchComponent } from './search/search.component';
import { ServiceComponent } from './service/service.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { FaqComponent } from './faq/faq.component';
import { ModeComponent } from './mode/mode.component';
import { LoginComponent } from './login/login.component';
import { UsersignupComponent } from './usersignup/usersignup.component';
import { NavbarComponent } from './navbar/navbar.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BasicinfoComponent } from './basicinfo/basicinfo.component';
import { MapComponent } from './map/map.component';
import { BusinesslistComponent } from './businesslist/businesslist.component';
import { UpdatedetailComponent } from './updatedetail/updatedetail.component';
import { BookingComponent } from './booking/booking.component';
import { VehicleComponent } from './vehicle/vehicle.component';
import { NotificationComponent } from './notification/notification.component';
import { BusinessnotificationComponent } from './businessnotification/businessnotification.component';
import { BusinesshistoryComponent } from './businesshistory/businesshistory.component';
import { UserbookinghistoryComponent } from './userbookinghistory/userbookinghistory.component';
import { UsernotificationComponent } from './usernotification/usernotification.component';
import { GetbusinessdetailComponent } from './getbusinessdetail/getbusinessdetail.component';
// import { NotificationComponent } from './notification/notification.component';

export const routes: Routes = [
    {
        path: 'home',
        component:HomeComponent
    },
    {
        path:"",redirectTo:"home",pathMatch:"full"
    },
    {
        path: 'navbar',
        component:NavbarComponent
    },
    {
        path:'mode',
        children:[
            {path:"", component: ModeComponent},
            {path:"signup", component: UsersignupComponent} 
        ]
        
    },
    {
        path: 'signup',
        component:UsersignupComponent
    },
    {
        path: 'login',
        component:LoginComponent
    },
    
    {
        path: 'business-type',
        component:BusinessTypeComponent
    },


    {
        path: 'company',
        component:CompanyComponent
    },
    {
        path: 'map',
        component:MapComponent
    },
    {
        path: 'basicinfo',
        component:BasicinfoComponent
    },
    {
        path: 'addvehicle',
        component:AddvehicleComponent
    },
    // {
    //     path:'basicinfo',
    //     children:[
    //         {path:"", component: BasicinfoComponent},
    //         {path:"add-vehicle", 
    //             children:[
    //                 {path:"", component:AddvehicleComponent},
    //                 {path:"carinfo",component:CarInfoComponent}, 
    //                 {path:"scooter",component:ScooterComponent},
    //                 {path:"bicycle",component:BicycleComponent},
    //             ]
    //         } 
    //     ]
        
    // },
    // {path:"add-vehicle", 
    //     children:[
    //         {path:"", component:AddvehicleComponent},
    //         {path:"carinfo",component:CarInfoComponent}, 
    //         {path:"scooter",component:ScooterComponent},
    //         {path:"bicycle",component:BicycleComponent},
    //     ]
    // } ,
    {
        path: 'dashboard',
        component:DashboardComponent
    },
    {
        path: 'business',
        component:BusinessComponent
    },
    {
        path: 'search',
        component:SearchComponent
    },
    {
        path: 'service',
        component:ServiceComponent
    },
     {
        path: 'about',
         component:AboutComponent
     },
     {
        path: 'faq',
         component:FaqComponent
     },
     {
        path: 'contact',
         component:ContactComponent
     },
     {
        path: 'businesslist',
         component:BusinesslistComponent
     },
     {
        path: 'updatedetail',
         component:UpdatedetailComponent
     },
     {
        path:'booking',
        component:BookingComponent
     },
     {
        path:'vehicle',
        component:VehicleComponent
     },
     {
        path:'businessnotification',
        component:BusinessnotificationComponent
     },
     {
        path:'businesshistory',
        component:BusinesshistoryComponent
     },
     {
        path:'userbookinghistory',
        component:UserbookinghistoryComponent
     },
     {
        path:'usernotification',
        component:UsernotificationComponent
     },
     {
        path:'businessdetail/:businessId',
        component:GetbusinessdetailComponent
     }
    


];
