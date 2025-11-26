import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { LoginComponent } from './login.component';
import { AuthService } from '../../../core/services/auth.service';

// PrimeNG Modules
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { InputMaskModule } from 'primeng/inputmask';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(async () => {
    // Create a spy object for the AuthService with a mock 'login' method
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);

    await TestBed.configureTestingModule({
      imports: [
        LoginComponent, // Standalone component
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([]),
        NoopAnimationsModule, // Disable animations for tests
        // Import PrimeNG modules used in the template
        CardModule,
        InputTextModule,
        DropdownModule,
        ButtonModule,
        InputMaskModule
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router);
    
    // Initial ngOnInit call
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Validations', () => {
    it('should have an invalid form when created', () => {
      expect(component.loginForm.valid).toBeFalsy();
    });

    it('should mark form as valid when all required fields are filled', () => {
      component.loginForm.controls['nome'].setValue('Test User');
      component.loginForm.controls['dataNascimento'].setValue('10/10/2000');
      component.loginForm.controls['cursoId'].setValue('1');
      expect(component.loginForm.valid).toBeTruthy();
    });

    it('should require a name', () => {
      const nameControl = component.loginForm.controls['nome'];
      nameControl.setValue('');
      expect(nameControl.hasError('required')).toBeTruthy();
    });

    it('should require a birth date', () => {
      const dateControl = component.loginForm.controls['dataNascimento'];
      dateControl.setValue('');
      expect(dateControl.hasError('required')).toBeTruthy();
    });

    it('should require a course', () => {
      const courseControl = component.loginForm.controls['cursoId'];
      courseControl.setValue(null);
      expect(courseControl.hasError('required')).toBeTruthy();
    });

    it('should fail date validation for an invalid date format', () => {
      const dateControl = component.loginForm.controls['dataNascimento'];
      dateControl.setValue('2000-10-10'); // Invalid format
      expect(dateControl.hasError('invalidDateFormat')).toBeTruthy();
    });

    it('should fail date validation for an incomplete date', () => {
      const dateControl = component.loginForm.controls['dataNascimento'];
      dateControl.setValue('10/10/20__'); // Incomplete
      expect(dateControl.hasError('invalidDateFormat')).toBeTruthy();
    });

    it('should fail date validation for an invalid day', () => {
      const dateControl = component.loginForm.controls['dataNascimento'];
      dateControl.setValue('32/10/2000');
      expect(dateControl.hasError('invalidDateDay')).toBeTruthy();
    });

    it('should fail date validation for an invalid month', () => {
      const dateControl = component.loginForm.controls['dataNascimento'];
      dateControl.setValue('10/13/2000');
      expect(dateControl.hasError('invalidDateMonth')).toBeTruthy();
    });

    it('should pass date validation for a valid date', () => {
      const dateControl = component.loginForm.controls['dataNascimento'];
      dateControl.setValue('29/02/2024'); // Leap year
      expect(dateControl.valid).toBeTruthy();
    });
  });

  describe('onSubmit', () => {
    beforeEach(() => {
      // Spy on the router's navigate method
      spyOn(router, 'navigate');
    });

    it('should not call authService.login if the form is invalid', () => {
      component.onSubmit();
      expect(authService.login).not.toHaveBeenCalled();
    });

    it('should call authService.login when the form is valid', () => {
      component.loginForm.controls['nome'].setValue('Test User');
      component.loginForm.controls['dataNascimento'].setValue('10/10/2000');
      component.loginForm.controls['cursoId'].setValue('1');
      
      authService.login.and.returnValue(of({ success: true, token: 'fake-token', message: 'Success' }));
      
      component.onSubmit();
      
      expect(authService.login).toHaveBeenCalledWith(component.loginForm.value);
    });

    it('should navigate to "/app/busca-aluno" on successful login', () => {
      component.loginForm.controls['nome'].setValue('Test User');
      component.loginForm.controls['dataNascimento'].setValue('10/10/2000');
      component.loginForm.controls['cursoId'].setValue('1');

      authService.login.and.returnValue(of({ success: true, token: 'fake-token', message: 'Success' }));

      component.onSubmit();

      expect(router.navigate).toHaveBeenCalledWith(['/app/busca-aluno']);
    });

    it('should not navigate on failed login', () => {
      component.loginForm.controls['nome'].setValue('Test User');
      component.loginForm.controls['dataNascimento'].setValue('10/10/2000');
      component.loginForm.controls['cursoId'].setValue('1');

      authService.login.and.returnValue(of({ success: false, message: 'Invalid credentials' }));

      component.onSubmit();

      expect(router.navigate).not.toHaveBeenCalled();
    });
  });
});