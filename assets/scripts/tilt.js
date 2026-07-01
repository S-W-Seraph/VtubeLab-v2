(function () {
  var MAX_TILT_DEG = 15;

  document.querySelectorAll('[data-tilt]').forEach(function (el) {
    var scale = parseFloat(el.getAttribute('data-tilt-scale')) || 1.1;
    var reverse = el.hasAttribute('data-tilt-reverse') ? -1 : 1;

    el.classList.add('tilt-el');

    el.addEventListener('mousemove', function (event) {
      var rect = el.getBoundingClientRect();
      var x = (event.clientX - rect.left) / rect.width - 0.5;
      var y = (event.clientY - rect.top) / rect.height - 0.5;
      var rotateX = reverse * (-y * MAX_TILT_DEG);
      var rotateY = reverse * (x * MAX_TILT_DEG);

      el.style.transform =
        'perspective(600px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) scale(' + scale + ')';
    });

    el.addEventListener('mouseleave', function () {
      el.style.transform = '';
    });
  });
})();
