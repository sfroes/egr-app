import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { HeaderComponent } from './header/header.component'; // Caminho correto
import { FooterComponent } from './footer/footer.component'; // Caminho correto

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ToastModule, HeaderComponent, FooterComponent], // Mantém as importações
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  providers: [MessageService],
})
export class LayoutComponent {}
