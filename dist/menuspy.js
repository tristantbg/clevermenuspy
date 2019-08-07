(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.MenuSpy = factory());
}(this, function () { 'use strict';

  var classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  var createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var MenuSpy = function () {
    function MenuSpy(elem, config) {
      classCallCheck(this, MenuSpy);


      var defaults = {
        activeClass: 'active'
      };

      this.options = Object.assign({}, defaults, config);

      this.activeIndex = 0;

      this.elem = typeof elem === 'string' ? document.querySelector(elem) : elem;

      this.links = this.elem.querySelectorAll('a[href^="#"]');

      this.init();
    }

    createClass(MenuSpy, [{
      key: 'init',
      value: function init() {
        var options = {
          rootMargin: '0% 0% -50% 0%', // center of viewport
          threshold: [0, 1]
        };

        var observer = new IntersectionObserver(this.onChange.bind(this), options);

        this.links.forEach(function (link) {
          var selector = link.getAttribute('href');
          var el = document.querySelector(selector);

          if (el) observer.observe(el);
        });

        this.setActive();
      }
    }, {
      key: 'removeActiveClass',
      value: function removeActiveClass() {
        var activeClass = this.options.activeClass;

        var activeLink = this.elem.querySelector('.' + activeClass);

        if (activeLink) {
          activeLink.classList.remove(activeClass);
        }
      }
    }, {
      key: 'setActive',
      value: function setActive() {
        var link = this.links[this.activeIndex];
        var item = link.parentElement;
        this.removeActiveClass();
        item.classList.add(this.options.activeClass);
      }
    }, {
      key: 'onChange',
      value: function onChange(changes, observer) {
        var _this = this;

        var activeClass = this.options.activeClass;

        // current index must be memoized or tracked outside of function for comparison

        var localActiveIndex = this.activeIndex;

        // track which elements register above or below the document's current position
        var aboveIndeces = [];
        var belowIndeces = [];

        // loop through each intersection element
        //  due to the asychronous nature of observers, callbacks must be designed to handle 1 or many intersecting elements
        changes.forEach(function (element) {

          var id = element.target.id;
          var link = _this.elem.querySelector('a[href="#' + id + '"]');

          // detect if intersecting element is above the browser viewport; include cross browser logic
          var boundingClientRectY = typeof element.boundingClientRect.y !== 'undefined' ? element.boundingClientRect.y : element.boundingClientRect.top;
          var rootBoundsY = typeof element.rootBounds.y !== 'undefined' ? element.rootBounds.y : element.rootBounds.top;
          var isAbove = boundingClientRectY < rootBoundsY;

          // get index of intersecting element from DOM attribute
          var intersectingElemIdx = [].indexOf.call(_this.links, link);

          // record index as either above or below current index
          if (isAbove) aboveIndeces.push(intersectingElemIdx);else belowIndeces.push(intersectingElemIdx);
        });

        // determine min and max fired indeces values (support for multiple elements firing at once)
        var minIndex = Math.min.apply(Math, belowIndeces);
        var maxIndex = Math.max.apply(Math, aboveIndeces);

        // determine how to adjust localActiveIndex based on scroll direction
        if (aboveIndeces.length > 0) {
          // scrolling down - set to max of fired indeces
          localActiveIndex = maxIndex;
        } else if (belowIndeces.length > 0 && minIndex <= this.activeIndex) {
          // scrolling up - set to minimum of fired indeces
          localActiveIndex = minIndex - 1 >= 0 ? minIndex - 1 : 0;
        }

        // render new index to DOM (if required)
        if (localActiveIndex != this.activeIndex) {
          this.activeIndex = localActiveIndex;
          this.setActive();
        }
      }
    }]);
    return MenuSpy;
  }();

  return MenuSpy;

}));
