import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  images = [
    'assets/images/slideshow1.jpg',
    'assets/images/slideshow2.jpg',
    'assets/images/slideshow3.jpg'
  ];

  activeIndex = 0;
  intervalId: any;

  ngOnInit(): void {
    this.startSlideshow();
  }

  startSlideshow(): void {
    this.intervalId = setInterval(() => {
      this.nextSlide();
    }, 5000); // Cambia cada 5 segundos
  }

  nextSlide(): void {
    this.activeIndex = (this.activeIndex + 1) % this.images.length;
  }

  goToSlide(index: number): void {
    this.activeIndex = index;
    this.resetSlideshow(); // Reinicia el temporizador
  }

  resetSlideshow(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    this.startSlideshow();
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
