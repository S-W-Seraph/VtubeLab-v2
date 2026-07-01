(function () {
  var slidesContainer = document.getElementById('slides');
  if (!slidesContainer) {
    return;
  }

  var slides = Array.prototype.slice.call(slidesContainer.querySelectorAll('.slide'));
  if (!slides.length) {
    return;
  }

  var dotsContainer = document.getElementById('slideDots');
  var scrollHint = document.getElementById('scrollHint');

  var TRANSITION_MS = 500;
  var IDLE_MS = 5000;

  var currentIndex = 0;
  var isAnimating = false;
  var idleTimer = null;
  var touchStartY = null;

  document.documentElement.classList.add('has-slides');
  slides[0].classList.add('is-active');

  var dots = slides.map(function (slide, index) {
    var dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'slide-dot';
    dot.setAttribute('aria-label', 'Слайд ' + (index + 1));
    dot.addEventListener('click', function () {
      goToSlide(index);
    });
    if (dotsContainer) {
      dotsContainer.appendChild(dot);
    }
    return dot;
  });

  function updateDots() {
    dots.forEach(function (dot, index) {
      dot.classList.toggle('is-active', index === currentIndex);
    });
  }

  function showHint() {
    if (scrollHint) {
      scrollHint.classList.add('is-visible');
    }
  }

  function hideHint() {
    if (scrollHint) {
      scrollHint.classList.remove('is-visible');
    }
  }

  function resetIdleTimer() {
    hideHint();
    clearTimeout(idleTimer);
    if (currentIndex < slides.length - 1) {
      idleTimer = setTimeout(showHint, IDLE_MS);
    }
  }

  function goToSlide(targetIndex) {
    if (isAnimating || targetIndex === currentIndex || targetIndex < 0 || targetIndex >= slides.length) {
      return;
    }

    isAnimating = true;
    resetIdleTimer();

    var direction = targetIndex > currentIndex ? 'down' : 'up';
    var current = slides[currentIndex];
    var next = slides[targetIndex];

    current.classList.remove('is-active');
    current.classList.add(direction === 'down' ? 'is-leaving-up' : 'is-leaving-down');

    setTimeout(function () {
      current.classList.remove('is-leaving-up', 'is-leaving-down');

      var enterClass = direction === 'down' ? 'is-entering-from-bottom' : 'is-entering-from-top';
      next.classList.add(enterClass);
      void next.offsetHeight;
      next.classList.remove(enterClass);
      next.classList.add('is-active');

      currentIndex = targetIndex;
      updateDots();

      setTimeout(function () {
        isAnimating = false;
      }, TRANSITION_MS);
    }, TRANSITION_MS);
  }

  window.addEventListener(
    'wheel',
    function (event) {
      event.preventDefault();
      if (isAnimating) {
        return;
      }
      if (event.deltaY > 0) {
        goToSlide(currentIndex + 1);
      } else if (event.deltaY < 0) {
        goToSlide(currentIndex - 1);
      }
    },
    { passive: false }
  );

  window.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowDown' || event.key === 'PageDown') {
      event.preventDefault();
      goToSlide(currentIndex + 1);
    } else if (event.key === 'ArrowUp' || event.key === 'PageUp') {
      event.preventDefault();
      goToSlide(currentIndex - 1);
    }
  });

  window.addEventListener(
    'touchstart',
    function (event) {
      touchStartY = event.touches[0].clientY;
    },
    { passive: true }
  );

  window.addEventListener(
    'touchend',
    function (event) {
      if (touchStartY === null) {
        return;
      }
      var deltaY = touchStartY - event.changedTouches[0].clientY;
      touchStartY = null;
      if (Math.abs(deltaY) < 40) {
        return;
      }
      goToSlide(deltaY > 0 ? currentIndex + 1 : currentIndex - 1);
    },
    { passive: true }
  );

  document.querySelectorAll('[data-slide-target]').forEach(function (trigger) {
    trigger.addEventListener('click', function (event) {
      event.preventDefault();
      goToSlide(parseInt(trigger.getAttribute('data-slide-target'), 10));
    });
  });

  updateDots();
  resetIdleTimer();
})();
