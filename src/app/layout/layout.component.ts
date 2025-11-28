import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ToastModule],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  providers: [MessageService],
})
export class LayoutComponent {}
