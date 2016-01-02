'use strict';
/* global document, window */
/* exported straube */
/* author Michał Budzyński <michal@virtualdesign.pl> */

var straube = (function() {
  // Remember initial screen size. It's needed in calculating if the
  // viewport is shrinking or expanding.
  var screenSize = document.body.offsetWidth;
  // Const variables with class names.
  var STRAUBE_CLASS = 'straube';
  var STRAUBE_WRAPPER_CLASS = 'straube-wrapper';

  // Initial array of elements with given class
  var elements = Array.prototype.slice.call(
    document.querySelectorAll('.' + STRAUBE_CLASS)
  );

  // Elements will be cached after the first function call so let's
  // set a flag in here.
  var firstRun = true;

  // Each straube element will be wrapped in outer span. We'll use
  // this variable to store it.
  var wrapperElement;

  // Re-rendering is expensive, so we don't want to do it on every
  // resize. We'll start 100ms after last event.
  var resizeInterval;
  var resizeTimeout = 100;
  window.addEventListener('resize', function() {
    // If the user scrolls, clear the interval set on previous action...
    clearTimeout(resizeInterval);
    // ... so this timeout will fire after 100ms of idle
    resizeInterval = setTimeout(straube, resizeTimeout);
  });

  // Return the public part of this object -the rendering function.
  // It will use private variables stored above.
  return function() {
    // First, let's hide everything in the document's body. DOM is
    // slower than a Lada full of elephants going uphill, but hidding
    // it while making changes helps a little
    document.body.style.visibility = 'hidden';

    // Let's check if the resolution is getting bigger or smaller and
    // set a proper flag.
    var isSmaller = (document.body.offsetWidth - screenSize) < 0;
    // Then remember the screen size for the next resize event.
    screenSize = document.body.offsetWidth;

    // Steps we'll use to increment/decrement size of the font
    var incrementDelta = 1;
    var decrementDelta = 0.1;

    // Same for making the resolution smaller than it was before
    // the event occurs
    if (isSmaller) {
      incrementDelta = 0.1;
      decrementDelta = 1;
    }

    // The core of the app. For each element...
    elements.forEach(function(element) {
      // ... thats not empty...
      if (element.textContent.replace(/\s+/g, '').length === 0) {
        return;
      }

      // ... and hasn't been wrapped in Straube container yet...
      if (!element.parentNode.classList.contains(STRAUBE_WRAPPER_CLASS)) {
        // ...change the way spaces whitechars will be handled...
        element.style.whiteSpace = 'pre';
        // ...wrap it in Straube container...
        wrapperElement = document.createElement('span');
        // ...that from definition takes as much place in the document
        // as possible. To do so let's create a new span, give it
        // proper classname...
        wrapperElement.classList.add(STRAUBE_WRAPPER_CLASS);
        // ...insert WHOLE (outerHTML) computed node inside the newly
        // created...
        wrapperElement.innerHTML = element.outerHTML;
        // ...and insert this new container in place of the one that's
        // now inside. It's not actually the same node, it's cloned, but it's
        // doing the work since STRAUBE is ment to work mostly with text.
        element.parentNode.replaceChild(wrapperElement, element);
        // Now our element is the whole wrapper, not only the one inside it.
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

    document.body.style.visibility = '';
  };
})();

straube();
