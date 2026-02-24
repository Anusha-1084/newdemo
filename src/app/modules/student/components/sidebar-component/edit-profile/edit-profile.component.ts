
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { EditProfileService } from 'src/app/core/services/editProfileService/edit-profile-service';
import { UserDataService } from 'src/app/core/services/user-data.service';
@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [BrowserModule, ReactiveFormsModule],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.scss'
})
export class EditProfileComponent implements OnInit {

  successMessage: string = '';
  errorMessage: string = '';
  showSuccessToast: boolean = false;
  showErrorToast: boolean = false;
  profileForm!: FormGroup;
  previewUrl: string | ArrayBuffer | null = null;

  // Track original image for comparison
  originalProfileImage: string | ArrayBuffer | null = null;
  imageChanged: boolean = false;

  constructor(private editProfileService: EditProfileService,
    private userDataService: UserDataService
  ) { }

  ngOnInit() {
    this.profileForm = new FormGroup({
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      username: new FormControl(''),
      profileImage: new FormControl(''),
      email: new FormControl(''),
      mobileNo: new FormControl(''),
      bio: new FormControl(''),
      location: new FormControl(''),
      createdAt: new FormControl(''),
    });

    // Fetch profile data and set form + preview image
    this.editProfileService.getUserProfile().subscribe((data: any) => {
      this.previewUrl = data.profileImage?.startsWith('data:image')
        ? data.profileImage
        : 'data:image/png;base64,' + data.profileImage;

      // Save original image for change tracking
      this.originalProfileImage = this.previewUrl;

      this.profileForm.patchValue({
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.username,
        email: data.email,
        mobileNo: data.mobileNo,
        bio: data.bio,
        location: data.location,
        profileImage: this.previewUrl,
        createdAt: data.createdAt
      });
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
        this.profileForm.patchValue({ profileImage: reader.result });

        // Detect if image changed from original
        this.imageChanged = this.previewUrl !== this.originalProfileImage;
      };
      reader.readAsDataURL(file);
    }
  }

  // Getter to check if any form value or image changed
  get hasChanges(): boolean {
    return this.profileForm.dirty || this.imageChanged;
  }

  onSubmit() {
    if (this.profileForm.invalid) {
      this.errorMessage = 'Please fill in all required fields correctly.';
      this.showErrorToast = true;
      this.autoHideToast('error');
      return;
    }

    const user = this.profileForm.value;

    this.editProfileService.updateUserProfile(user).subscribe({
      next: (response) => {
        this.successMessage = 'Profile updated successfully!';
        this.showSuccessToast = true;
        this.autoHideToast('success');

        // Reset tracking states after successful update
        this.profileForm.markAsPristine();
        this.originalProfileImage = this.previewUrl;
        this.imageChanged = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to update profile. Please try again.';
        this.showErrorToast = true;
        this.autoHideToast('error');
      }
    });
  }

  autoHideToast(type: 'success' | 'error') {
    setTimeout(() => {
      if (type === 'success') {
        this.showSuccessToast = false;
        this.successMessage = '';
      } else {
        this.showErrorToast = false;
        this.errorMessage = '';
      }
    }, 3000); // hides after 3 seconds
  }

}
