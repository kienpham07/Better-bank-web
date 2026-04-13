'use strict';
//const { createElement } = require('react');

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');

///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault(); // Always use this
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// Handle Next step button in modal form with validation
const modalForm = document.querySelector('.modal__form');
const btnNextStep = document.querySelector('.modal__form .btn');
const formInputs = document.querySelectorAll('.modal__form input');

// Disable button initially
btnNextStep.disabled = true;
btnNextStep.style.opacity = '0.6';
btnNextStep.style.cursor = 'not-allowed';

// Check if all fields are filled
const checkFormValidity = function () {
  const allFilled = Array.from(formInputs).every(
    input => input.value.trim() !== '',
  );

  btnNextStep.disabled = !allFilled;
  btnNextStep.style.opacity = allFilled ? '1' : '0.6';
  btnNextStep.style.cursor = allFilled ? 'pointer' : 'not-allowed';
};

// Add event listeners to all inputs
formInputs.forEach(input => {
  input.addEventListener('input', checkFormValidity);
  input.addEventListener('change', checkFormValidity);
});

const resetModalForm = function () {
  if (!modalForm) return;
  modalForm.reset();
  checkFormValidity();
  closeModal();
};

window.addEventListener('pageshow', function (e) {
  if (e.persisted) {
    resetModalForm();
  } else {
    resetModalForm();
  }
});

// Handle Next step button click
btnNextStep.addEventListener('click', function (e) {
  e.preventDefault();
  window.location.href = 'https://bank-web-nu.vercel.app/';
});

// Scrolling effect for button "Learn more"
btnScrollTo.addEventListener('click', function (e) {
  section1.scrollIntoView({ behavior: 'smooth' });
});

// Page navigation - Event delegation (Scrolling to the section if the button on navigation is pressed)
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  // Matching to find child element (.nav__link inside .nav__links)
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

// Tabbed components
tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  // Guard clause
  if (!clicked) return;

  // Remove active status from tabs and tabsContent each time the user click to the new one
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  // Add Active status to the tabs
  clicked.classList.add('operations__tab--active');

  // Active Active status to content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

// Menu fade animation on the button in navigation
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

// Passing "argumment" into handler
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

// Sticky navigation (Old version)
// const obsCallBack = function (entries, observer) {
//   entries.forEach(entry => {
//     console.log(entry);
//   });
// };

// const obsOption = {
//   root: 'null',
//   threshold: [0, 0.2],
// };

// const observer = new IntersectionObserver(obsCallBack, obsOption);
// observer.observe(section1);

// Sticky Navigation (Better Version)
const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null, // Using viewport to measure properties
  threshold: 0, // How many percent should I scroll over so that it trigger the callback
  rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);

// Reveal sections (image, content, ...)
const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry); - Test in console

  entries.forEach(entry => {
    // When the web first reloads at any position, all observed section will be observed at first, and then when we scroll, each target will be oberseved again at each time
    if (!entry.isIntersecting) return;
    entry.target.classList.remove('section--hidden');
    observer.unobserve(entry.target);
  });
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

// Lazy Loading image
const imgTarget = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  // Replace dataset with src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '-50px',
});

imgTarget.forEach(img => imgObserver.observe(img));

// Slider section for review
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0;
  const maxSlide = slides.length;

  // <------Function------>
  // Function for dot slider:
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`,
      );
    });
  };

  // Function for activate dot effect
  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  // Function for the slide movement:
  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`),
    );
  };

  // Next slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  // Prev Slide
  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  // Initalize variable when we first load website.
  const init = function () {
    goToSlide(0);
    createDots();
    activateDot(0);
  };
  init();

  // <-----Event handler for button of review slider section----->
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const curSlide = Number(e.target.dataset.slide);
      goToSlide(curSlide);
      activateDot(curSlide);
    }
  });
};
slider(); // Call the function to activate the effect for slider review section.
//////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////

// const header = document.querySelector('header');
// const message = document.createElement('div');
// message.classList.add('.cookie-message');

// message.innerHTML =
//   'We rely on cookies to provide a smoother experience and track site usage. <button class = "btn btn--close-cookie">Got it</button>';

// header.append(message);

// // Delete element
// document
//   .querySelector('.btn--close-cookie')
//   //message.parentElement.removeChild(message)
//   .addEventListener('click', function () {
//     message.remove();
//   });

// const randomInt = (min, max) =>
//   Math.floor(Math.random() * (max - min + 1) + min);

// const randomColor = () =>
//   `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;

// document.querySelector('.nav__link').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log('LINK', e.target, e.currentTarget);
//   console.log(e.currentTarget === this);

//   // Stop propagation
//   // e.stopPropagation(); --> Stop bubbling phase
// });

// document.querySelector('.nav__links').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log('CONTAINER', e.target, e.currentTarget);
// });

// document.querySelector('.nav').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log('NAV', e.target, e.currentTarget);
// });
