import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchFilterPipe } from './search-filter.pipe';

@Component({
  selector: 'app-contributors',
  standalone: true,
  imports: [CommonModule, SearchFilterPipe],
  templateUrl: './contributors.component.html',
  styleUrl: './contributors.component.scss'
})
export class ContributorsComponent implements OnInit {
   searchTerm: string = '';
   selectedMember: any = null;

  teamMembers = [
   // Project Architect (1)
    { name: 'Deepa Anil Kumar', role: 'Architect', designation: 'System Design', imageSrc: '../../../assets/blank-profile.jpg' },
    
    // Team Leads (3)
    { name: 'Jeelan Shaik', role: 'Team Lead', designation: 'Mangement Lead', imageSrc: '../../../assets/blank-profile.jpg' },
    { name: 'Shivnath jha', role: 'Team Lead', designation: 'Tech Lead', imageSrc: '../../../assets/blank-profile.jpg' }, 
    { name: 'Chandradeep Kumar', role: 'Team Lead', designation: 'Tech Lead', imageSrc: '../../../assets/Chandradeep.jpg' },
    { name: 'Sourabh Patil ', role: 'Team Lead', designation: 'Project Lead', imageSrc: '../../../assets/blank-profile.jpg' },
    { name: 'Shivasagar Reddy', role: 'Team Lead', designation: 'Senior Developer', imageSrc: '../../../assets/blank-profile.jpg' },   
    { name: 'Shankar kumar Saw', role: 'Team Lead', designation: 'Senior Developer', imageSrc: '../../../assets/Shankar.jpg' },
    { name: 'Hemanth V', role: 'Team Lead', designation: 'Senior Developer', imageSrc: '../../../assets/blank-profile.jpg' },
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
    { name: 'Muthyala Anusha', role: 'Developer', designation: 'FullStack Dev', imageSrc: '../../../assets/MuthyalaAnusha.jpg' },
    { name: 'Anju Nishad', role: 'Developer', designation: 'FullStack Dev', imageSrc: '../../../assets/Anju.jpg' },
    { name: 'Rajalaxmi', role: 'Developer', designation: 'FullStack Dev', imageSrc: '../../../assets/Rajyalaxmi.jpg' },
    { name: 'NagaSaiRam', role: 'Developer', designation: 'FullStack Dev', imageSrc: '../../../assets/Sai.jpg' },
    { name: 'Rakesha Maradana', role: 'Developer', designation: 'FullStack Dev', imageSrc: '../../../assets/blank-profile.jpg' },
    { name: 'Lakshmi Narayana Murthy Pappula', role: 'Developer', designation: 'FullStack Dev', imageSrc: '../../../assets/blank-profile.jpg' },
    { name: 'Devavrat Upadhyay', role: 'Developer', designation: 'FullStack Dev', imageSrc: '../../../assets/Deva.jpg' },
    { name: 'Sabinedi Balachandra', role: 'Developer', designation: 'FullStack Dev', imageSrc: '../../../assets/blank-profile.jpg' },
   
  ];

  architects: any[] = [];
  teamLeads: any[] = [];
  developers: any[] = [];

  ngOnInit() {
    this.architects = this.teamMembers.filter(m => m.role === 'Architect');
    this.teamLeads = this.teamMembers.filter(m => m.role === 'Team Lead');
    this.developers = this.teamMembers.filter(m => m.role === 'Developer');
  }

  openProfile(member: any) {
  this.selectedMember = member;
}

closeProfile() {
  this.selectedMember = null;
}
}
