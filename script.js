// Function to navigate to a specific page
function goToPage(page) {
  window.location.href = page;
}

// Access the Images
let slideImages = document.querySelectorAll(".slides img");
// Access the next and prev buttons
let next = document.querySelector(".next");
let prev = document.querySelector(".prev");
// Access the indicators
let dots = document.querySelectorAll(".dot");

let counter = 0;

// Ensure the first image is visible without animation
window.addEventListener("DOMContentLoaded", () => {
  slideImages[counter].classList.add("active");
  indicators();
});

// Code for next button
next.addEventListener("click", slideNext);
function slideNext() {
  slideImages[counter].classList.remove("active");
  slideImages[counter].style.animation = "next1 0.5s ease-in forwards";
  counter = counter >= slideImages.length - 1 ? 0 : counter + 1;
  slideImages[counter].classList.add("active");
  slideImages[counter].style.animation = "next2 0.5s ease-in forwards";
  indicators();
}

// Code for prev button
prev.addEventListener("click", slidePrev);
function slidePrev() {
  slideImages[counter].classList.remove("active");
  slideImages[counter].style.animation = "prev1 0.5s ease-in forwards";
  counter = counter == 0 ? slideImages.length - 1 : counter - 1;
  slideImages[counter].classList.add("active");
  slideImages[counter].style.animation = "prev2 0.5s ease-in forwards";
  indicators();
}

// Auto sliding
let deleteInterval; // Define deleteInterval globally
function autoSliding() {
  deleteInterval = setInterval(() => {
    slideNext();
    indicators();
  }, 5000);
}
autoSliding();

// Stop auto sliding when mouse is over
const container = document.querySelector(".slide-container");
container.addEventListener("mouseover", () => clearInterval(deleteInterval));

// Resume sliding when mouse is out
container.addEventListener("mouseout", autoSliding);

// Add and remove active class from the indicators
function indicators() {
  dots.forEach((dot, i) => {
    dot.classList.toggle("active", i === counter);
  });
}

// Add click event to the indicator
function switchImage(currentImage) {
  let imageId = parseInt(currentImage.getAttribute("attr"));
  if (imageId === counter) return;

  slideImages[counter].classList.remove("active");
  slideImages[counter].style.animation =
    imageId > counter
      ? "next1 0.5s ease-in forwards"
      : "prev1 0.5s ease-in forwards";
  counter = imageId;
  slideImages[counter].classList.add("active");
  slideImages[counter].style.animation =
    imageId > counter
      ? "next2 0.5s ease-in forwards"
      : "prev2 0.5s ease-in forwards";
  indicators();
}

// API Slider JavaScript
const apiUrl =
  "https://api-ap-south-1.hygraph.com/v2/clu1cn0fq034r07w2weul52cy/master";
const query = `
query OmniSlider {
  omniSliders {
    id
    image {
      url
    }
    name
  }
}`;

async function fetchData() {
  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });
  const data = await response.json();
  return data.data.omniSliders;
}

function createApiSliderItem(slider) {
  const slide = document.createElement("div");
  slide.className = "api-slide";
  slide.innerHTML = `
    <img src="${slider.image.url}" alt="${slider.name}">
    <p>${slider.name}</p>
  `;
  return slide;
}

async function initApiSlider() {
  const sliders = await fetchData();
  const sliderContainer = document.getElementById("api-slider");

  sliders.forEach((slider, index) => {
    const slide = createApiSliderItem(slider);
    sliderContainer.appendChild(slide);

    // Add click event listener to each slide
    slide.addEventListener("click", () => {
      // Define the URLs for each slide
      const urls = ["bag.html", "camera.html"]; // Add more URLs as needed

      // Navigate to the corresponding page based on the index of the slide
      if (index < urls.length) {
        window.location.href = urls[index];
      }
    });
  });

  // Initialize the first slide as active
  document.querySelector(".api-slide").classList.add("active");
}

function showApiSlide(index) {
  const slides = document.querySelectorAll(".api-slide");
  const containerWidth = document.querySelector(
    ".api-slider-container"
  ).offsetWidth;
  const numSlidesToShow = 4; // Adjust this value based on how many slides you want visible at a time
  const gapBetweenSlides = -10; // Adjust this value based on the desired gap between slides
  const totalGap = (numSlidesToShow - 1) * gapBetweenSlides;
  const slideWidth = (containerWidth - totalGap) / numSlidesToShow;
  if (index >= slides.length) {
    index = 0; // Reset to first slide if index is beyond the last slide
  } else if (index < 0) {
    index = slides.length - 1; // Set to last slide if index is less than 0
  }
  apiCounter = index;
  const offset = -apiCounter * (slideWidth + gapBetweenSlides); // Calculate the correct offset
  document.getElementById(
    "api-slider"
  ).style.transform = `translateX(${offset}px)`;
}

function apiNextSlide() {
  const slides = document.querySelectorAll(".api-slide");
  apiCounter = (apiCounter + 1) % slides.length; // Increment and loop back to 0 if reached the end
  showApiSlide(apiCounter);
}

function apiPrevSlide() {
  const slides = document.querySelectorAll(".api-slide");
  apiCounter = (apiCounter - 1 + slides.length) % slides.length; // Decrement and loop back to last if reached the beginning
  showApiSlide(apiCounter);
}

// Initialize the API slider
initApiSlider();

// Event listeners for API slider navigation
document.querySelector(".api-prev").addEventListener("click", apiPrevSlide);
document.querySelector(".api-next").addEventListener("click", apiNextSlide);
