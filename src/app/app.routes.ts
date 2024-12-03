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
import { BusinessRoleGuard } from '../guard/BusinessRoleGuard';
import { UserRoleGuard } from '../guard/UserRoleGuard';

export const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [UserRoleGuard],
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'navbar',
    component: NavbarComponent,
  },
  {
    path: 'mode',
    children: [
      { path: '', component: ModeComponent },
      { path: 'signup', component: UsersignupComponent },
    ],
  },
  {
    path: 'signup',
    component: UsersignupComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'business-type',
    component: BusinessTypeComponent,
  },
  {
    path: 'company',
    component: CompanyComponent,
  },
  {
    path: 'map',
    component: MapComponent,
  },
  {
    path: 'basicinfo',
    component: BasicinfoComponent,
  },
  {
    path: 'addvehicle',
    component: AddvehicleComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [BusinessRoleGuard],
  },
  {
    path: 'business',
    component: BusinessComponent,
  },
  {
    path: 'search',
    component: SearchComponent,
    canActivate: [UserRoleGuard],
  },
  {
    path: 'service',
    component: ServiceComponent,
    canActivate: [UserRoleGuard],
  },
  {
    path: 'about',
    component: AboutComponent,
    canActivate: [UserRoleGuard],
  },
  {
    path: 'faq',
    component: FaqComponent,
    canActivate: [UserRoleGuard],
  },
  {
    path: 'contact',
    component: ContactComponent,
    canActivate: [UserRoleGuard],
  },
  {
    path: 'businesslist',
    component: BusinesslistComponent,
    canActivate: [UserRoleGuard],
  },
  {
    path: 'updatedetail',
    component: UpdatedetailComponent,
  },
  {
    path: 'booking',
    component: BookingComponent,
    canActivate: [BusinessRoleGuard],
  },
  {
    path: 'vehicle',
    component: VehicleComponent,
    canActivate: [BusinessRoleGuard],

  },
  {
    path: 'businessnotification',
    component: BusinessnotificationComponent,
    canActivate: [BusinessRoleGuard],
  },
  {
    path: 'businesshistory',
    component: BusinesshistoryComponent,
    canActivate: [BusinessRoleGuard],
  },
  {
    path: 'userbookinghistory',
    component: UserbookinghistoryComponent,
  },
  {
    path: 'usernotification',
    component: UsernotificationComponent,
    canActivate: [UserRoleGuard],
  },
  {
    path: 'businessdetail/:businessId',
    component: GetbusinessdetailComponent,
    canActivate: [UserRoleGuard],
  },
];
