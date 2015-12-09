'use strict';
/* global document, window */
/* exported straube */
var straube = function() {
  var STRABE_CLASS = 'straube';
  var STRABE_WRAPPER_CLASS = 'straube-wrapper';
  var elements = [document.querySelectorAll('.' + STRABE_CLASS)[5]];
  var wrapperElement;
  var securityAlert = 500;
  Array.prototype.slice.call(elements).forEach(function(element){
    securityAlert = 1500;
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
      element.style.fontSize = parseFloat(element.style.fontSize, 10) + 1 + 'px';
    }

    if (securityAlert === 0) {
      alert('dupa');
    }
  });
};

straube();
