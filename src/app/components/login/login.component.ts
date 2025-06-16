import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-login',
  imports: [  ToastModule,CommonModule, ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule],
  providers: [MessageService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  checked: boolean = false;
  errorMsg: string = '';

  constructor(private authService: AuthService, 
    private router: Router,  
    private messageService: MessageService) { }

  onLogin() {
    this.authService.login(this.email, this.password).subscribe({
      next: res => {
        this.router.navigate(['/layout/inicio']);
        console.log("Login exitoso");
        this.messageService.add({ 
          severity: 'success',
           summary: 'Éxito',
            detail: 'Inicio de sesión exitoso'
           });
      },
      error: err => {
        console.log(err.error.error);
        this.errorMsg = err.error.error || 'Error al iniciar sesión';
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Error', 
          detail: this.errorMsg
        });
      }
    });
  }
}