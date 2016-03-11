'use strict';
/* global document, window */
/* exported straube */
/* author Michał Budzyński <michal@virtualdesign.pl> */
window.onload = function() {
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
          // Now our element is still the element inside the wrapper,
          // but since it was cloned and replaced we need to take the
          // reference again. This whole process is expensive, but we do it
          // just once, at the initial rendering.
          element = wrapperElement.children[0];

        }

        // ---------------------
        // Here comes the magic.
        // ---------------------
        // Take the width of the element's parent node (the Straube wrapper)
        var wrapperWidth = element.parentNode.offsetWidth;
        // Set it's CSS fontSize explicitly as an inline style, even if it's
        // set somewhere else. In this case we'll get the size of the fonts
        // set in external stylesheets, etc. .getComputedStyle() is expensive,
        // so after it will be set as an inline style, we gain easy and cheap
        // access to it later.
        // XXX: This probably can be moved above to the wrapping part, so
        // it'll be computed just once and should be faster
        element.style.fontSize = parseFloat(
          window.getComputedStyle(element, null).getPropertyValue('font-size')
        ) + 'px';

        // If the element is not filling whole wrapper...
        while (element.offsetWidth < wrapperWidth) {
          // ...increment it's font size. The element will 'grow' (it's probably
          // not the best English word in here but it's 4:50AM and I had my
          // last cigarette around midnight) together with the font inside till
          // it will became bigger than it's wrapper
          element.style.fontSize = parseFloat(element.style.fontSize, 10) +
            incrementDelta + 'px';
        }

        // If the wrapper is smaller than the element, decrease the font size.
        // In most cases (on startup and while the screen size is
        // 'growing' [again...]) this means we have already make the font bigger
        // than the container, so it needs to be shrinked by 0.1 to be exactly
        // like the wrapper. If the screen size is decreasing, then the font is
        // shrinked by 1. Those factors are already explained and defined above.
        while (element.offsetWidth > wrapperWidth) {
          element.style.fontSize = parseFloat(element.style.fontSize, 10) -
            decrementDelta + 'px';
        }
      });

      // This part is a little embarassing, but I'll fix this in my next
      // freetime window.
      // If it's the first time straube() function is called...
      if (firstRun) {
        // ... get all the elements and cache them for the future. This will
        // make the lib faster on screen resize.
        elements = Array.prototype.slice.call(
          document.querySelectorAll('.' + STRAUBE_CLASS)
        );
        firstRun = false;
      }

      // Show everything
      document.body.style.visibility = '';
    };
  })();

  straube();
};
