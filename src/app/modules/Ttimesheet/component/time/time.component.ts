import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-time',
  templateUrl: './time.component.html',
  styleUrls: ['./time.component.scss'],
  standalone: true,
  imports: [RouterModule],  // <-- Make sure to add this!
})
export class TimeComponent implements OnInit {
  activeTab = 'logtime';

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    const currentRoute = this.route.snapshot.firstChild?.routeConfig?.path;
    if (currentRoute) {
      this.activeTab = currentRoute;
    }
  }

  navigateTo(tab: string) {
    this.activeTab = tab;
    this.router.navigate([tab], { relativeTo: this.route });
  }
}
