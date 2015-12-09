'use strict';
/* global document */
/* exported straube */
var straube = function() {
  var STRABE_CLASS = 'straube';
  var STRABE_WRAPPER_CLASS = 'straube-wrapper';
  var elements = document.querySelectorAll('.' + STRABE_CLASS);
  var wrapperElement;

  Array.prototype.slice.call(elements).forEach(function(element){
    element.style.display = 'inner-block';
    element.style.whiteSpace = 'pre';
    wrapperElement = document.createElement('div');
    wrapperElement.classList.add(STRABE_WRAPPER_CLASS);
    wrapperElement.innerHTML = element.outerHTML;
    element.innerHTML = wrapperElement.outerHTML;
  });
};

straube();
