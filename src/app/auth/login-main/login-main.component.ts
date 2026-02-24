
// login-main.component.ts
import {
  Component,
  OnInit,
  NgZone,
  CUSTOM_ELEMENTS_SCHEMA,
  HostListener, // Import HostListener
  AfterViewInit, // Import AfterViewInit
  ElementRef, // Import ElementRef
  Renderer2,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import {
  MatDialog,
  MatDialogModule,
  MatDialogConfig,
} from '@angular/material/dialog';
import { LoginToDiffAccPopupComponent } from './login-to-diff-acc-popup/login-to-diff-acc-popup.component';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/core/services/authservice/auth.service';
import { TokenService } from 'src/app/core/services/tokenservice/token.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NavigationService } from 'src/app/core/services/navigationservice/navigation.service';
import { LoginComponent } from '../login/login.component';
import { RegisterComponent } from '../register/register.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common'; // Import NgClass for conditional classes



declare var bootstrap: any; // Declare bootstrap to avoid TypeScript errors if not imported directly

@Component({
  selector: 'app-login-main',
  standalone: true,
  imports: [
    MatIconModule,
    MatDialogModule,
    // LoginComponent, // Removed because it's not used directly in the template
    //RegisterComponent,
    CommonModule,
    FormsModule,
   // NgClass,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './login-main.component.html',
  styleUrls: ['./login-main.component.scss'],
})
export class LoginMainComponent implements OnInit, AfterViewInit {
currentIndex = 0;
cardWidth = 280;
gap = 20;

  switchTab(arg0: string) {
    throw new Error('Method not implemented.');
  } // Implement AfterViewInit

   goToContributors() {
    this.router.navigate(['/contributors']);  
  }

  isLoggedIn = false;
  username = 'User';
  private lastScrollTop = 0; // For header hide/show on scroll

  // --- New Property and Method for Contributors Section ---
  showContributors: boolean = false;

  toggleContributors(): void {
    this.showContributors = !this.showContributors;
  }

 // --- Data Array for All Contributors (1 Architect, 3 Team Leads, 10 Developers) ---
  contributors = [
    // Project Architect (1)
    { name: 'Deepa Anil Kumar', role: 'Architect', designation: 'System Design', imageSrc: '../../../assets/blank-profile.jpg' },
    
    // Team Leads (3)
    { name: 'Jeelan Shaik', role: 'Team Lead', designation: 'Mangement Lead', imageSrc: '../../../assets/blank-profile.jpg' },
    { name: 'Shivnath jha', role: 'Team Lead', designation: 'Tech Lead', imageSrc: '../../../assets/blank-profile.jpg' }, 
    { name: 'Chandradeep Kumar', role: 'Team Lead', designation: 'Tech Lead', imageSrc: '../../../assets/Chandradeep.jpg' },
    { name: 'Sourabh Patil ', role: 'Team Lead', designation: 'Project Lead', imageSrc: '../../../assets/blank-profile.jpg' },
    { name: 'Shivasagar Reddy', role: 'Team Lead', designation: 'Senior Developer', imageSrc: '../../../assets/blank-profile.jpg' },   
    { name: 'Shankar kumar Saw', role: 'Team Lead', designation: 'Senior Developer', imageSrc: '../../../assets/Shankar.jpg' },
    { name: 'Hemanta Ku.', role: 'Team Lead', designation: 'Senior Developer', imageSrc: '../../../assets/blank-profile.jpg' },
    { name: 'Dayanidhi Tripathi', role: 'Team Lead', designation: 'Senior Developer', imageSrc: '../../../assets/blank-profile.jpg' },
    { name: 'Tavva Tejeswara Rao', role: 'Team Lead', designation: 'Senior Developer', imageSrc: '../../../assets/Teja.jpg' },
    // Developers (10)
    { name: ' Kanhu Ch.Behera', role: 'Developer', designation: 'FullStack Dev ', imageSrc: '../../../assets/Kanhu.jpg' },
    { name: ' Pulak Kanti ', role: 'Developer', designation: 'Junior Developer', imageSrc: '../../../assets/Kanti.jpg' },
    { name: 'Rakesh Goud', role: 'Developer', designation: 'Senior Developer', imageSrc: '../../../assets/Rakesha.jpg' },
    { name: 'Nagamani', role: 'Developer', designation: 'FullStack Dev', imageSrc: '../../../assets/Nagamani.jpg' },
    { name: 'Wasim', role: 'Developer', designation: 'FullStack Devr', imageSrc: '../../../assets/Wasim.jpg' },
    { name: 'Ranjit Sahoo', role: 'Developer', designation: 'Full-Stack Dev', imageSrc: '../../../assets/Ranjit.jpg' },
    { name: 'Alok Pradhan', role: 'Developer', designation: 'FullStack Dev', imageSrc: '../../../assets/Alok.jpg' },
    { name: 'Shivam Shrivastva', role: 'Developer', designation: 'FullStack Dev', imageSrc: '../../../assets/Shivam.jpg' },
    { name: 'Anusha Muthyala', role: 'Developer', designation: 'FullStack Dev', imageSrc: '../../../assets/MuthyalaAnusha.jpg' },
    { name: 'Anju Nishad', role: 'Developer', designation: 'FullStack Dev', imageSrc: '../../../assets/Anju.jpg' },
    { name: 'Rajalaxmi', role: 'Developer', designation: 'FullStack Dev', imageSrc: '../../../assets/Rajyalaxmi.jpg' },
    { name: 'NagaSaiRam', role: 'Developer', designation: 'FullStack Dev', imageSrc: '../../../assets/Sai.jpg' },
    { name: 'Rakesha Maradana', role: 'Developer', designation: 'FullStack Dev', imageSrc: '../../../assets/blank-profile.jpg' },
    { name: 'Lakshmi Narayana Murthy Pappula', role: 'Developer', designation: 'FullStack Dev', imageSrc: '../../../assets/blank-profile.jpg' },
    { name: 'Devavrat Upadhyay', role: 'Developer', designation: 'FullStack Dev', imageSrc: '../../../assets/Deva.jpg' },
    { name: 'Sabinedi Balachandra', role: 'Developer', designation: 'FullStack Dev', imageSrc: '../../../assets/blank-profile.jpg' },
   
   

  ];

 architects = this.contributors.filter(c => c.role === 'Architect');

teamLeads = this.contributors.filter(c => 
  c.role.includes('Team Lead') 
);



  

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private http: HttpClient,
    private ngZone: NgZone,
    private tokenService: TokenService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private navigationService: NavigationService,
    private el: ElementRef, // Inject ElementRef
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    setInterval(() => {
    this.currentIndex = (this.currentIndex + 1) % this.teamLeads.length;
  }, 3000); // scroll every 3s

    this.isLoggedIn = (this.tokenService as any).hasValidToken();
    this.username = (this.tokenService as any).getUsername() || 'User';

    if (window.google && window.google.accounts?.id) {
      window.google.accounts.id.initialize({
        client_id:
          '282387866257-nkoqplsvhptndjn1e8spi3aaio7vkr3g.apps.googleusercontent.com',
        callback: this.handleCredentialResponse.bind(this),
      });
    } else {
      console.warn('Google Sign-In SDK not loaded.');
    }
  }

  ngAfterViewInit(): void {
    // Initialize Bootstrap Carousel after the view has been initialized
    const carouselElement = this.el.nativeElement.querySelector(
      '#carouselExampleIndicators'
    );
    if (
      carouselElement &&
      typeof bootstrap !== 'undefined' &&
      bootstrap.Carousel
    ) {
      new bootstrap.Carousel(carouselElement, {
        interval: 3000, // Interval for automatic sliding (5 seconds)
        wrap: true, // Whether the carousel should cycle continuously
      });
    }
  }

  // HostListener for scroll event to hide/show header
  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    const st = window.pageYOffset || document.documentElement.scrollTop;
    const header = this.el.nativeElement.querySelector('.header');

    if (st > this.lastScrollTop && st > header.offsetHeight) {
      // Downscroll, hide header
      header.classList.add('hidden');
    } else {
      // Upscroll or at the very top, show header
      header.classList.remove('hidden');
    }
    this.lastScrollTop = st <= 0 ? 0 : st; // For Mobile or negative scrolling
  }

  setActiveTab(tab: 'signin' | 'signup', event: MouseEvent): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = 'attractive-dialog-panel';

    const rect = (event.target as HTMLElement).getBoundingClientRect();
    dialogConfig.position = {
      top: `${rect.bottom + 10}px`,
      right: `${window.innerWidth - rect.right}px`,
    };

    dialogConfig.width = '450px';

    if (tab === 'signin') {
      this.dialog.open(LoginComponent, dialogConfig);
    } else if (tab === 'signup') {
      this.dialog.open(RegisterComponent, dialogConfig);
    }
  }

  handleCredentialResponse(response: any): void {
    console.log('Encoded JWT ID token: ' + response.credential);
    this.sendGoogleTokenToBackend(response.credential);
  }

  sendGoogleTokenToBackend(token: string): void {
    this.authService.googleLogin(token).subscribe({
      next: (response: any) => {
        console.log('Login Success:', response);
        this.tokenService.storeTokens(
          response.data.accessToken,
          response.data.refreshToken
        );
        this.isLoggedIn = true;
        this.username = response.data.username || 'User';
        this.snackBar.open('Login Successful!', 'Close', { duration: 3000 });
        this.navigateToDashboard();
      },
      error: (error) => {
        console.error('Login Failed:', error);
        this.snackBar.open('Google login failed. Please try again.', 'Close', {
          duration: 3000,
        });
      },
    });
  }

  LogInToDifferentAccount(): void {
    this.dialog.open(LoginToDiffAccPopupComponent, {
      width: '400px',
      panelClass: 'attractive-dialog-panel-centered',
      disableClose: false,
    });
  }

  // navigateToDashboard(): void {
  //   this.ngZone.run(() => {
  //     this.router.navigate(['/layout/dashboard']);
  //   });
  // }

  // THIS IS THE MAIN NAVIGATION METHOD
  navigateToDashboard(): void {
    console.log('Attempting to navigate to /layout/dashboard'); // Debugging line
    this.ngZone.run(() => {
      this.router
        .navigate(['/layout/dashboard'])
        .then((success) => {
          if (success) {
            console.log('Navigation to dashboard successful!');
            // Optionally close dialogs after successful login and navigation
            this.dialog.closeAll();
          } else {
            console.warn('Navigation to dashboard failed or was prevented.');
          }
        })
        .catch((error) => {
          console.error('Error during navigation:', error);
        });
    });
  }

  logout() {
    this.tokenService.clearTokens();
    this.isLoggedIn = false;
    this.username = 'User';
    this.snackBar.open('Logged out successfully.', 'Close', { duration: 3000 });
    this.router.navigate(['/']);
  }

  features = [
    {
      icon: 'https://static.vecteezy.com/system/resources/previews/018/887/298/non_2x/chat-line-icon-png.png',
      title: 'Chat Option',
      description: 'Real-time user-to-user messaging with secure channels.',
    },
    {
      icon: 'https://thumbs.dreamstime.com/b/virtual-online-work-business-office-video-conference-home-telework-people-sits-computer-distance-videocall-internet-freelance-263029510.jpg',
      title: 'Video Call Option',
      description:
        'Seamless video conferencing for effective team collaboration.',
    },
    {
      icon: 'https://media.istockphoto.com/id/532417235/vector/moving-documents-between-two-folders.jpg?s=612x612&w=0&k=20&c=0JmJcQbWzEmIw-GWX9BCoPQBH-bYb2jui5-w2W3ygSk=',
      title: 'File Transfer Option',
      description: 'Securely upload, share, and manage files with ease.',
    },
    {
      icon: 'https://ignatiuz-timesheet.azurewebsites.net/wp-content/uploads/2024/10/Timesheet-Pro-Icon.png',
      title: 'Timesheet Option',
      description:
        'Effortlessly log working hours and manage project schedules.',
    },
    {
      icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkPg2EOS45e40BIshybnHUwh6nl7Gn_EQauA&s',
      title: 'Help Desk Option',
      description:
        'Raise support tickets and access comprehensive documentation.',
    },
    {
      icon: 'https://tse2.mm.bing.net/th/id/OIP.O_6UfAXU7VwAxtLz0ncjAQHaHW?pid=Api&P=0&h=180',
      title: 'Attendance Option',
      description: 'Daily attendance tracking and reporting for your team.',
    },
    {
      icon: 'https://www.shutterstock.com/image-vector/checkin-checkout-icon-vector-filled-260nw-574755751.jpg',
      title: 'Check-In / Check-Out',
      description: 'Mark your start and end times for precise work tracking.',
    },
    {
      icon: 'https://static.vecteezy.com/system/resources/previews/013/278/884/original/an-editable-design-icon-of-business-report-management-vector.jpg',
      title: 'Custom Reports',
      description: 'Generate insightful reports to analyze your CRM data.',
    },
  ];

  carouselItems = [
    {
      imgSrc:
        'https://www.freshbooks.com/blog/wp-content/uploads/2017/08/collaboration-1.jpg',
      heading: 'Seamless Collaboration',
      description:
        'Connect with your team and clients effortlessly with integrated tools.',
    },
    {
      imgSrc:
        'https://www.championtutor.com/blog/wp-content/uploads/2023/05/Picture63-1.jpg',
      heading: 'Enhanced Productivity',
      description:
        'Automate tasks and manage workflows efficiently for better output.',
    },
    {
      imgSrc:
        'https://up.yimg.com/ib/th/id/OIP.94uSCvgBEGu8asjYGeQvAAHaEK?pid=Api&rs=1&c=1&qlt=95&w=215&h=120',
      heading: 'Stronger Customer Relationships',
      description: 'Track interactions and personalize customer experience.',
    },
    {
      imgSrc:
        'https://sidgs.com/wp-content/uploads/2023/01/Enhancing-Digital-Customer-Experiences-Through-Data-Driven-Insights.png',
      heading: 'Data-Driven Insights',
      description:
        'Access powerful analytics to make informed business decisions.',
    },
    {
      imgSrc:
        'https://www.macobserver.com/wp-content/uploads/2020/12/Cloud-storage.jpg',
      heading: 'Secure Cloud Storage',
      description:
        'Keep your documents safe and accessible from anywhere, anytime.',
    },
    {
      imgSrc:
        'https://www2.planplusonline.com/wp-content/uploads/2013/05/5-Tips-for-Effective-Project-Management2.jpg',
      heading: 'Efficient Project Management',
      description:
        'Plan, execute, and monitor projects with ease and transparency.',
    },
    {
      imgSrc:
        'https://www.isaacinstruments.com/wp-content/uploads/2019/06/Solution-scalable-EN.jpg',
      heading: 'Scalable Solutions',
      description:
        'Grow your business with a platform that adapts to your evolving needs.',
    },
    {
      imgSrc:
        'https://static.vecteezy.com/system/resources/previews/021/796/929/original/24-hours-servises-24-7-support-technical-support-customer-help-tech-support-customer-service-business-and-technology-concept-wireframe-hand-touching-digital-interface-illustration-vector.jpg',
      heading: '24/7 Support',
      description:
        'Dedicated assistance whenever you need it to keep your operations smooth.',
    },
  ];
}
