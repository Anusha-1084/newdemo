import { Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-login-to-diff-acc-popup',
  standalone: true,
  imports: [
    MatDialogModule,
  ],
  templateUrl: './login-to-diff-acc-popup.component.html',
  styleUrl: './login-to-diff-acc-popup.component.scss'
})
export class LoginToDiffAccPopupComponent {

  githubLoginUrl: string = 'http://localhost:8081/oauth2/authorization/github';

  loginWithGitHub() {
    window.location.href = this.githubLoginUrl;
  }

}
