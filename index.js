'use strict';
/* global document, window */
/* exported straube */

var screenSize = document.body.offsetWidth;
var straube = function() {
  var STRABE_CLASS = 'straube';
  var STRABE_WRAPPER_CLASS = 'straube-wrapper';
  var elements = document.querySelectorAll('.' + STRABE_CLASS + '-test');
  var wrapperElement;
  var securityAlert = 500;

  var isSmaller = (document.body.offsetWidth - screenSize) < 0;
  screenSize = document.body.offsetWidth;

  var bigDelta = 1;
  var smallDelta = 0.1;

  if (isSmaller) {
    bigDelta = 0.1;
    smallDelta = 1;
  }

  Array.prototype.slice.call(elements).forEach(function(element){
    securityAlert = 1500;
    if (element.innerHTML.length === 0) {
      return;
    }

    element.style.whiteSpace = 'pre';
    wrapperElement = document.createElement('span');
    wrapperElement.classList.add(STRABE_WRAPPER_CLASS);
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
                               bigDelta + 'px';
    }

    while (element.offsetWidth > wrapperWidth && securityAlert > 0) {
      element.style.fontSize = parseFloat(element.style.fontSize, 10) -
                               smallDelta + 'px';
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
