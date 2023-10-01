import { Route } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { canActivateUser } from './core/guards/can-activate-guard';
import { canLeavePage } from './core/guards/can-deactivate-guards';
import { QuestionComponent } from './pages/dashboard/question/question.component';

export const appRoutes: Route[] = [
  {
    path: "",
    redirectTo: "login",
    pathMatch: "full",
  },
  {
    path: "ui",
    // component:  LoginComponent,
    loadComponent: () =>
      import('./pages/ui-element/ui-element.component').then((x) => x.UiElementComponent),
  },
  {
    path: "login",
    // component:  LoginComponent,
    loadComponent: () =>
      import('./pages/auth/login/login.component').then((x) => x.LoginComponent),
  },
  {
    path: "verify",
    // component:  LoginComponent,
    loadComponent: () =>
      import('./pages/auth/verify-otp/verify-otp.component').then((x) => x.VerifyOtpComponent),
  },
  {
    path: "user-detail",
    // component:  LoginComponent,
    loadComponent: () =>
      import('./pages/auth/enter-name/enter-name.component').then((x) => x.EnterNameComponent),
  },
  {
    path: "dashboard",
    // component:  LoginComponent,
    loadComponent: () =>
      import('./pages/dashboard/dashboard.component').then((x) => x.DashboardComponent),
    canActivate: [canActivateUser]
  },
  {
    path: "instructions/:testId",
    loadComponent: () =>
      import('./pages/dashboard/instructions/instructions.component').then((x) => x.InstructionsComponent),
    canActivate: [canActivateUser]
  },
  {
    path: "test/:testId",
    loadComponent: () =>
      import('./pages/dashboard/question/question.component').then((x) => x.QuestionComponent),
    canActivate: [canActivateUser],
    canDeactivate: [(component: QuestionComponent) => component.canDeactivate()],
  },
  {
    path: "test-schedule",
    loadComponent: () =>
      import('./pages/dashboard/test-schedule/test-schedule.component').then((x) => x.TestScheduleComponent),
    canActivate: [canActivateUser],
  },
  {
    path: "admin",
    loadComponent: () =>
      import('./pages/admin/admin.component').then((x) => x.AdminComponent),
    children: [
      {
        path: "",
        loadComponent: () =>
          import('./pages/admin/tests/tests.component').then((x) => x.TestsComponent),
      },
      {
        path: "test-result/:testId",
        loadComponent: () =>
          import('./pages/admin/test-result/test-result.component').then((x) => x.TestResultComponent),
      },
      {
        path: "add-test",
        loadComponent: () =>
          import('./pages/admin/add-test/add-test.component').then((x) => x.AddTestComponent),
      },
      {
        path: "edit-test/:testId",
        loadComponent: () =>
          import('./pages/admin/add-test/add-test.component').then((x) => x.AddTestComponent),
      }
    ]
  },

];
