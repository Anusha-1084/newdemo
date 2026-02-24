		import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-file-sidebar',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './file-sidebar.component.html',
  styleUrls: ['./file-sidebar.component.scss']
})
export class FileSidebarComponent {}
