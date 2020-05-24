"use strict";

class List {
    public element: HTMLUListElement;

    constructor () {
      const ul = document.createElement("ul");

      ul.className = "osmcal-calendar__list";

      this.element = ul;
    }
}

export { List as default };
