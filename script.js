'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScollTo = document.querySelector(`.btn--scroll-to`);
const section1 = document.querySelector(`#section--1`);
const tabs = document.querySelectorAll(`.operations__tab`);
const tabsContainer = document.querySelector(`.operations__tab-container`);
const tabsContent = document.querySelectorAll(`.operations__content`);
const nav = document.querySelector(`.nav`);

///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));
// Old way - now with forEach
// for (let i = 0; i <button btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

///////////////////////////////////////////////
// Implementing smooth scrolling

btnScollTo.addEventListener(`click`, function (e) {
  // Only to show the old way and what is going on
  /* const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);

  console.log(e.target.getBoundingClientRect());

  console.log(`Current scroll (X/Y)`, window.pageXOffset, window.pageYOffset);

  console.log(
    `height/ width viewport`,
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  ); */

  // Scrolling
  // window.scrollTo(
  //   s1coords.left + window.pageXOffset,
  //   s1coords.top + window.pageYOffset
  // );

  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: `smooth`,
  // });

  // this is the mordern Way to do it!! ONLY works with modern Browsern
  section1.scrollIntoView({ behavior: `smooth` });
});

///////////////////////////////////////////////
// Page navigation

// document.querySelectorAll(`.nav__link`).forEach(function (el) {
//   el.addEventListener(`click`, function (e) {
//     e.preventDefault();
//     const id = this.getAttribute(`href`);
//     console.log(id);
//     document.querySelector(id).scrollIntoView({ behavior: `smooth` });
//   });
// });

// 1. Add event listener to common parent element
// 2. Determine what element originated the event

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  // Matching strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

///////////////////////////////////////////////
// Building a Tabbed Component
// ALL ABOVE!!!
// const tabs = document.querySelectorAll(`.operations__tab`);
// const tabsContainer = document.querySelector(`.operations__tab-container`);
// const tabsContent = document.querySelectorAll(`.operations__content`);

// BAD PRACTICE
// tabs.forEach(t => t.addEventListener(`click`, () => console.log(`TAB`)));

tabsContainer.addEventListener(`click`, function (e) {
  const clicked = e.target.closest(`.operations__tab`);
  // console.log(clicked);

  // Guard clause
  if (!clicked) return;

  // Remove active classes
  tabs.forEach(t => t.classList.remove(`operations__tab--active`));
  tabsContent.forEach(c => c.classList.remove(`operations__content--active`));

  // Active tab
  clicked.classList.add(`operations__tab--active`);

  // Activate content area
  // console.log(clicked.dataset.tab);
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add(`operations__content--active`);
});

///////////////////////////////////////
// Menu fade animation
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

// Passing `argument`into handler
nav.addEventListener(`mouseover`, handleHover.bind(0.5));
nav.addEventListener(`mouseout`, handleHover.bind(1));

///////////////////////////////////////
// Sticky navigation: Intersection Observer API

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;
  // console.log(entry);

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);

///////////////////////////////////////////////
// Reveal Sections
const allSections = document.querySelectorAll(`.section`);

const revealSection = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.classList.remove(`section--hidden`);
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add(`section--hidden`);
});

///////////////////////////////////////////////
// Lazy loading images
const imgTargets = document.querySelectorAll(`img[data-src]`);
// console.log(imgTargets);

const loadImg = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);

  if (!entry.isIntersecting) return;

  // Replace src with data-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener(`load`, function () {
    entry.target.classList.remove(`lazy-img`);
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  // plus for reaching them without seeing blured
  // minus to see the blurry effect
  rootMargin: `+200px`,
});

imgTargets.forEach(img => imgObserver.observe(img));

///////////////////////////////////////////////
// Building a Slider Component
// The whole slider in one function to not pollute the const name environment
const slider = function () {
  const slides = document.querySelectorAll(`.slide`);
  const btnLeft = document.querySelector(`.slider__btn--left`);
  const btnRight = document.querySelector(`.slider__btn--right`);
  const dotContainer = document.querySelector(`.dots`);

  let curSlide = 0;
  const maxSlide = slides.length;

  // Functions
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        `beforeend`,
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activeDot = function (slide) {
    document
      .querySelectorAll(`.dots__dot`)
      .forEach(dot => dot.classList.remove(`dots__dot--active`));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add(`dots__dot--active`);
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
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
    activeDot(curSlide);
  };

  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activeDot(curSlide);
  };

  const init = function () {
    createDots();
    activeDot(0);
    goToSlide(0);
  };
  init();

  // Event handlers
  btnRight.addEventListener(`click`, nextSlide);
  btnLeft.addEventListener(`click`, prevSlide);

  document.addEventListener(`keydown`, function (e) {
    // console.log(e);
    // same but diffrent writing
    if (e.key === `ArrowLeft`) prevSlide();
    e.key === `ArrowRight` && nextSlide();
  });

  dotContainer.addEventListener(`click`, function (e) {
    if (e.target.classList.contains(`dots__dot`)) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activeDot(slide);
    }
  });
};
slider();

///////////////////////////////////////////////
///////////////////////////////////////////////
///////////////////////////////////////////////
/*
// Selecting, creating and deleting Elements

// entier document
console.log(document.documentElement);

console.log(document.head);
console.log(document.body);

// will return the first that matches the selector (`.header`)
const header = document.querySelector(`.header`);
// multiple elements selected
const allSections = document.querySelectorAll(`.section`);
console.log(allSections);

// WE ONLY PASS the ID name itself without the selector
document.getElementById(`section--1`);
// selecting all Buttons - will return a HTML Collection (live)
const allButtons = document.getElementsByTagName(`button`);
console.log(allButtons);

// is simailar to getElementById
console.log(document.getElementsByClassName(`btn`));

//////
// Creating and inserting elements

// .insertAdjacentHTML
// Best methode:
// interprets the specified text as HTML or XML and inserts the resulting node into the DOM at the specified position. The target object is not reinterpreted, which means that existing elements contained within it are not affected.

// creates a DOM Element and we can use it after that
const message = document.createElement(`div`);
message.classList.add(`cookie-message`);
// message.textContent = `We use cookies for improving functionality and analytics.`;
message.innerHTML = `We use cookies for improved functionality and analytics. <Got class="btn btn--close-cookie">Got it!</button>`;
// prepend to insert and append to move it to the last child
// header.prepend(message);
header.append(message);
// header.append(message.cloneNode(true));

// header.before(message);
// header.after(message);

// Delete elements
document
  .querySelector(`.btn--close-cookie`)
  .addEventListener(`click`, function () {
    message.remove();
    // earlier for removing
    // message.parentElement.removeChild(message);
  });

// Styles / inlines
message.style.backgroundColor = `#37383d`;
message.style.width = `120%`;

// only works for inline styles
console.log(message.style.height);
console.log(message.style.color);
console.log(message.style.backgroundColor);

// but it still works with:
console.log(getComputedStyle(message).color);
console.log(getComputedStyle(message).height);

// adding
message.style.height =
  Number.parseFloat(getComputedStyle(message).height, 10) + 30 + `px`;

// changing Property / still better with style.backgroundColor
document.documentElement.style.setProperty(`--color-primary`, `orangered`);

// Attributes
const logo = document.querySelector(`.nav__logo`);
console.log(logo.alt);
console.log(logo.className);

logo.alt = `Beautiful minimalist logo`;

// NON standard
console.log(logo.designer);
console.log(logo.getAttribute(`designer`));
logo.setAttribute(`company`, `Bankist`);

// absolute
console.log(logo.src);
// relative
console.log(logo.getAttribute(`src`));

const link = document.querySelector(`.twitter-link`);
console.log(link.href);
console.log(link.getAttribute(`href`));

const link2 = document.querySelector(`.nav__link--btn`);
console.log(link2.href);
console.log(link2.getAttribute(`href`));

// speciale type of Attributes / DATA
console.log(logo.dataset.versionNumber);

// Classes
logo.classList.add(`c`, `j`);
logo.classList.remove(`c`, `j`);
logo.classList.toggle(`c`);
logo.classList.contains(`c`); // not includes

// Do NOT use
logo.className = `jonas`;
*/

///////////////////////////////////////////////////////
// Types of Events and Event Handlers
/*
const h1 = document.querySelector(`h1`);

// mdn javascript event reference
// only one time useable
const alertH1 = function (e) {
  alert(`addEventListener: Great! You are reading the heading :D`);
};

h1.addEventListener(`mouseenter`, alertH1);

setTimeout(() => h1.removeEventListener(`mouseenter`, alertH1), 5000);

// oldschool
// h1.onmouseenter = function (e) {
//   alert(`onmouseenter: Great! You are reading the heading :D`);
// };
*/

///////////////////////////////////////////////////////
// Event Propagation in Practice
/*
// rgb(255,255,255)
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);
const randomColor = () =>
  `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;

document.querySelector('.nav__link').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('LINK', e.target, e.currentTarget);
  console.log(e.currentTarget === this);

  // Stop propagation
  // e.stopPropagation();
});

document.querySelector('.nav__links').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('CONTAINER', e.target, e.currentTarget);
});

document.querySelector('.nav').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('NAV', e.target, e.currentTarget);
});
*/

///////////////////////////////////////////////////////
// DOM Traversing
/*
const h1 = document.querySelector(`h1`);

// Going downwards: child
console.log(h1.querySelectorAll(`.highlight`));
console.log(h1.childNodes);
console.log(h1.children);
h1.firstElementChild.style.color = `white`;
h1.lastElementChild.style.color = `orangered`;

// Going upwards: Parents
console.log(h1.parentNode);
console.log(h1.parentElement);

h1.closest(`.header`).style.background = `var(--gradient-secondary)`;

h1.closest(`h1`).style.background = `var(--gradient-primary)`;

// Going sideways: siblings
console.log(h1.previousElementSibling);
console.log(h1.nextElementSibling);

console.log(h1.previousSibling);
console.log(h1.nextSibling);

console.log(h1.parentElement.children);
[...h1.parentElement.children].forEach(function (el) {
  if (el != h1) el.style.transform = `scale(0.5)`;
});
*/

///////////////////////////////////////////////////////
// Lifecycle DOM Events

// document.addEventListener(`DOMContentLoaded`, function (e) {
//   console.log(`HTML pares and DOM tree built!`, e);
// });

// window.addEventListener(`load`, function (e) {
//   console.log(`Page fully loaded`, e);
// });

// Gets a question if you really want to leave the page
// window.addEventListener(`beforeunload`, function (e) {
//   e.preventDefault();
//   console.log(e);
//   e.returnValue = ``;
// });
