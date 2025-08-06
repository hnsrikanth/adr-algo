import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-auth-lockscreen',
  standalone: true,
  imports: [CommonModule,NgbCarouselModule,RouterModule],
  templateUrl: './auth-lockscreen.component.html',
  styleUrl: './auth-lockscreen.component.scss'
})
export class AuthLockscreenComponent {
  testimonials = [
    {
      title: '“I feel confident imposing on myself”',
      content:
        'Vestibulum auctor orci in risus iaculis consequat suscipit felis rutrum aliquet iaculis augue sed tempus In elementum ullamcorper lectus vitae pretium Nullam ultricies diam eu ultrices sagittis.',
    },
    {
      title: '“Our task must be to free widening circle”',
      content:
        'Curabitur eget nulla eget augue dignissim condintum Nunc imperdiet ligula porttitor commodo elementum Vivamus justo risus fringilla suscipit faucibus orci luctus ultrices posuere cubilia curae ultricies cursus.',
    },
    {
      title: '“I\'ve learned that people forget what you”',
      content:
        'Pellentesque lacinia scelerisque arcu in aliquam augue molestie rutrum Fusce dignissim dolor id auctor accumsan vehicula dolor vivamus feugiat odio erat sed  quis Donec nec scelerisque magna',
    },
  ];
}
