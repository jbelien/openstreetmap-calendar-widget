"use strict";

class Month {
    public element: HTMLDivElement;

    constructor () {
      const div = document.createElement("div");

      div.className = "osmcal-calendar__month";

      this.element = div;
    }
}

export { Month as default };
