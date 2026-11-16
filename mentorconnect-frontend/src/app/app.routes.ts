import { Routes } from '@angular/router';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ExploreComponent } from './pages/explore/explore.component';
import { MentorshipComponent } from './pages/mentorship/mentorship.component';
import { MessagesComponent } from './pages/messages/messages.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';

export const routes: Routes = [
  { path: '', component: MainPageComponent, title: 'MentorConnect | Peer Mentorship Network' },
  { path: 'login', component: LoginComponent, title: 'Login | MentorConnect' },
  { path: 'register', component: RegisterComponent, title: 'Register | MentorConnect' },
  { path: 'dashboard', component: DashboardComponent, title: 'Dashboard | MentorConnect' },
  { path: 'profile', component: ProfileComponent, title: 'My Profile | MentorConnect' },
  { path: 'profile/:id', component: ProfileComponent, title: 'Profile | MentorConnect' },
  { path: 'explore', component: ExploreComponent, title: 'Explore Mentors & Resources | MentorConnect' },
  { path: 'mentorship', component: MentorshipComponent, title: 'Mentorship Management | MentorConnect' },
  { path: 'messages', component: MessagesComponent, title: 'Workspaces & Collaboration | MentorConnect' },
  { path: 'settings', component: SettingsComponent, title: 'Settings | MentorConnect' },
  { path: 'admin-dashboard', component: AdminDashboardComponent, title: 'Admin Console | MentorConnect' },
  { path: '**', redirectTo: '' }
];
