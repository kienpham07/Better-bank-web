'use strict';

//const { createElement } = require('react');

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

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

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

btnScrollTo.addEventListener('click', function (e) {
  section1.scrollIntoView({ behavior: 'smooth' });
});

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
