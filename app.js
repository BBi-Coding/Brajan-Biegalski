let slideIndex = 0;
const slides = document.getElementsByClassName("slide");
const dots = document.getElementsByClassName("dot");

function showSlide(n) {
  if (n >= slides.length) slideIndex = 0;
  if (n < 0) slideIndex = slides.length - 1;

  for (let i = 0; i < slides.length; i++) {
    slides[i].classList.remove("active");
  }
  for (let i = 0; i < dots.length; i++) {
    dots[i].classList.remove("active");
  }

  slides[slideIndex].classList.add("active");
  dots[slideIndex].classList.add("active");
}

function nextSlide() {
  slideIndex++;
  showSlide(slideIndex);
}

function currentSlide(n) {
  slideIndex = n - 1;
  showSlide(slideIndex);
}

// Auto-play
setInterval(nextSlide, 4000);

// Initial load
window.onload = () => {
  showSlide(slideIndex);
};
