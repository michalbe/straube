'use strict';
/* global document, window */
/* exported straube */
var straube = (function() {
  var screenSize = document.body.offsetWidth;
  var STRAUBE_CLASS = 'straube';
  var STRAUBE_WRAPPER_CLASS = 'straube-wrapper';
  var elements = Array.prototype.slice.call(
    document.querySelectorAll('.' + STRAUBE_CLASS)
  );
  var firstRun = true;
  var wrapperElement;

  var resizeInterval;
  var resizeTimeout = 30;
  window.addEventListener('resize', function() {
    clearTimeout(resizeInterval);
    resizeInterval = setTimeout(straube, resizeTimeout);
  });

  return function() {
    var startDate = (new Date()).getTime();

    var isSmaller = (document.body.offsetWidth - screenSize) < 0;
    screenSize = document.body.offsetWidth;

    var incrementDelta = 1;
    var decrementDelta = 0.1;

    if (isSmaller) {
      incrementDelta = 0.1;
      decrementDelta = 1;
    }

    elements.forEach(function(element) {
      if (element.textContent.replace(/\s+/g, '').length === 0) {
        return;
      }

      if (!element.parentNode.classList.contains(STRAUBE_WRAPPER_CLASS)) {
        element.style.whiteSpace = 'pre';
        wrapperElement = document.createElement('span');
        wrapperElement.classList.add(STRAUBE_WRAPPER_CLASS);
        wrapperElement.innerHTML = element.outerHTML;
        //element.outerHTML = wrapperElement.outerHTML;

        element.parentNode.replaceChild(wrapperElement, element);
        element = wrapperElement.children[0];
      }

      // calculations
      var wrapperWidth = element.parentNode.offsetWidth;
      element.style.fontSize = parseFloat(
        window.getComputedStyle(element, null).getPropertyValue('font-size')
      ) + 'px';

      while (element.offsetWidth < wrapperWidth) {
        element.style.fontSize = parseFloat(element.style.fontSize, 10) +
          incrementDelta + 'px';
      }

      while (element.offsetWidth > wrapperWidth> 0) {
        element.style.fontSize = parseFloat(element.style.fontSize, 10) -
          decrementDelta + 'px';
      }
    });
    if (firstRun) {
      elements = Array.prototype.slice.call(
        document.querySelectorAll('.' + STRAUBE_CLASS)
      );
      firstRun = false;
    }

    console.log('rendering time', (new Date()).getTime() - startDate);
  };
})();

straube();
