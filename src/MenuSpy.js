class MenuSpy {
  constructor(elem, config) {

    const defaults = {
      activeClass: 'active',
      linkClass: 'section'
    };

    this.options = Object.assign({}, defaults, config);

    this.activeIndex = 0;

    this.elem = typeof elem === 'string' ? document.querySelector(elem) : elem;

    this.links = this.elem.querySelectorAll(`a.${this.options.linkClass}[href^="#"]`);

    if(this.links.length > 0) this.init();
  }

  init() {
    const options = {
      rootMargin: '0% 0% -50% 0%', // center of viewport
      threshold: [0,1]
    };

    const observer = new IntersectionObserver(this.onChange.bind(this), options);

    this.links.forEach(link => {
      const selector = link.getAttribute('href');
      const el = document.querySelector(selector);

      if(el) observer.observe(el);
    });

    this.setActive()
  }

  removeActiveClass() {
    const { activeClass, linkClass } = this.options;
    const activeLink = this.elem.querySelector(`.${linkClass}.${activeClass}`);

    if (activeLink) {
      activeLink.classList.remove(activeClass);
    }
  }

  setActive() {
    const link = this.links[this.activeIndex];
    const item = link.parentElement ? link.parentElement : link;
    this.removeActiveClass();
    item.classList.add(this.options.activeClass);
  }

  onChange(changes, observer) {
      const { activeClass } = this.options;

      // current index must be memoized or tracked outside of function for comparison
      let localActiveIndex = this.activeIndex

      // track which elements register above or below the document's current position
      const aboveIndeces = []
      const belowIndeces = []

      // loop through each intersection element
      //  due to the asychronous nature of observers, callbacks must be designed to handle 1 or many intersecting elements
      changes.forEach(element => {

        const id = element.target.id;
        const link = this.elem.querySelector(`a[href="#${id}"]`);

        // detect if intersecting element is above the browser viewport; include cross browser logic
        const boundingClientRectY = (typeof element.boundingClientRect.y !== 'undefined') ? element.boundingClientRect.y : element.boundingClientRect.top
        const rootBoundsY = (typeof element.rootBounds.y !== 'undefined') ? element.rootBounds.y : element.rootBounds.top
        const isAbove = boundingClientRectY < rootBoundsY

        // get index of intersecting element from DOM attribute
        const intersectingElemIdx = [].indexOf.call(this.links, link)

        // record index as either above or below current index
        if (isAbove) aboveIndeces.push(intersectingElemIdx)
        else belowIndeces.push(intersectingElemIdx)
      })

      // determine min and max fired indeces values (support for multiple elements firing at once)
      const minIndex = Math.min.apply(Math, belowIndeces)
      const maxIndex = Math.max.apply(Math, aboveIndeces)

      // determine how to adjust localActiveIndex based on scroll direction
      if (aboveIndeces.length > 0) {
        // scrolling down - set to max of fired indeces
        localActiveIndex = maxIndex
      } else if (belowIndeces.length > 0 && minIndex <= this.activeIndex) {
        // scrolling up - set to minimum of fired indeces
        localActiveIndex = (minIndex - 1 >= 0) ? minIndex - 1 : 0
      }

      // render new index to DOM (if required)
      if (localActiveIndex != this.activeIndex){
        this.activeIndex = localActiveIndex
        this.setActive()
      }
    };
  }

export default MenuSpy;
