import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CourseContentSidebarComponent } from '../course-content-sidebar/course-content-sidebar.component';
import { CoursesService } from '../course-enrollment/courses.service';
interface CourseContent {
  section: string;
  completed: string;
  total: string;
  duration: string;
  contentUrl: string;
  contentType: string;
}

@Component({
  standalone: true,
  selector: 'app-course-content',
  templateUrl: './course-content.component.html',
  styleUrls: ['./course-content.component.scss'],
  imports: [CommonModule,CourseContentSidebarComponent],
})
export class CourseContentComponent implements OnInit {
  courseId!: number;
  courseTitle: string = 'React Essentials Course';
  videoTitle: string = '';
  videoUrl: string = '';
  sanitizedVideoUrl!: SafeResourceUrl;
  courseContents: CourseContent[] = [
    { section: 'Getting Started', completed: '6', total: '11', duration: '42min', contentUrl: 'https://www.youtube.com/watch?v=SycSR-NuDF0', contentType: 'video' },
    { section: 'JavaScript Refresher', completed: '1', total: '25', duration: '1hr 42min', contentUrl: 'https://www.youtube.com/watch?v=PkZNo7MFNFg', contentType: 'video' },
    { section: 'React Essentials - Components, JSX, Props, State & More', completed: '0', total: '40', duration: '2hr 27min', contentUrl: 'https://www.youtube.com/watch?v=w7ejDZ8SWv8', contentType: 'video' },
  ];

  course:any;

  constructor(private route: ActivatedRoute, private sanitizer: DomSanitizer,private courseService:CoursesService ) {}

  ngOnInit() {

    this.course=this.courseService.getCourses1();
    
    this.route.params.subscribe((params) => {
      this.courseId = params['id'];
   
      this.selectVideo(this.courseContents[0].contentUrl, this.courseContents[0].section);
    });
  }

  selectVideo(url: string, title: string) {
    this.videoUrl = url;
    this.videoTitle = title;
    this.sanitizedVideoUrl = this.getSanitizedVideoUrl(url);
  }

  getSanitizedVideoUrl(url: string): SafeResourceUrl {
    const videoId = this.extractYouTubeId(url);
    const embedUrl = `https://www.youtube.com/embed/${videoId}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }

  extractYouTubeId(url: string): string {
    const match = url.match(/[?&]v=([^&#]*)|youtu\.be\/([^&#]*)/);
    return match && (match[1] || match[2]) ? (match[1] || match[2]) : '';
  }
}
