(function () {
  var MIN_VISIBLE_MS = 350;
  var LEAVE_MS = 300;
  var shownAt = Date.now();

  function reveal() {
    var preloader = document.getElementById('preloader');
    var delay = Math.max(0, MIN_VISIBLE_MS - (Date.now() - shownAt));

    setTimeout(function () {
      document.body.classList.add('page-ready');
      if (preloader) {
        preloader.classList.add('preloader--hidden');
        preloader.addEventListener('transitionend', function () {
          preloader.remove();
        }, { once: true });
      }
    }, delay);
  }

  if (document.readyState === 'complete') {
    reveal();
  } else {
    window.addEventListener('load', reveal);
  }

  document.querySelectorAll('a[data-page-link]').forEach(function (link) {
    link.addEventListener('click', function (event) {
      var href = link.getAttribute('href');
      if (!href || link.target === '_blank') {
        return;
      }

      event.preventDefault();
      document.body.classList.remove('page-ready');
      document.body.classList.add('page-leaving');

      setTimeout(function () {
        window.location.href = href;
      }, LEAVE_MS);
    });
  });
})();
