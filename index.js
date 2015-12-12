'use strict';
/* global document, window */
/* exported straube */

var screenSize = document.body.offsetWidth;
var straube = function() {
  var STRAUBE_CLASS = 'straube';
  var STRAUBE_WRAPPER_CLASS = 'straube-wrapper';
  var elements = document.querySelectorAll('.' + STRAUBE_CLASS);
  var wrapperElement;
  var securityAlert = 500;

  var isSmaller = (document.body.offsetWidth - screenSize) < 0;
  screenSize = document.body.offsetWidth;

  var incrementDelta = 1;
  var decrementDelta = 0.1;

  if (isSmaller) {
    incrementDelta = 0.1;
    decrementDelta = 1;
  }

  Array.prototype.slice.call(elements).forEach(function(element){
    securityAlert = 1500;
    if (element.textContent.replace(/\s+/g, '').length === 0) {
      return;
    }

    element.style.whiteSpace = 'pre';
    wrapperElement = document.createElement('span');
    wrapperElement.classList.add(STRAUBE_WRAPPER_CLASS);
    wrapperElement.innerHTML = element.outerHTML;
    //element.outerHTML = wrapperElement.outerHTML;

    element.parentNode.replaceChild(wrapperElement, element);
    element = wrapperElement.children[0];

    // calculations
    var wrapperWidth = element.parentNode.offsetWidth;
    element.style.fontSize = parseFloat(
      window.getComputedStyle(element, null).getPropertyValue('font-size')
    ) + 'px';

    while (element.offsetWidth < wrapperWidth && --securityAlert) {
      element.style.fontSize = parseFloat(element.style.fontSize, 10) +
                               incrementDelta + 'px';
    }

    while (element.offsetWidth > wrapperWidth && securityAlert > 0) {
      element.style.fontSize = parseFloat(element.style.fontSize, 10) -
                               decrementDelta + 'px';
    }

    if (securityAlert === 0) {
      alert('dupa');
    }
  });
};

var resizeInterval;
var resizeTimeout = 100;
window.addEventListener('resize', function() {
  clearTimeout(resizeInterval);
  resizeInterval = setTimeout(straube, resizeTimeout);
});

straube();
