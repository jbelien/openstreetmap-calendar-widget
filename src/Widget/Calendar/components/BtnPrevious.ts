"use strict";

class BtnPrevious {
    public element: HTMLDivElement;

    constructor () {
      const div = document.createElement("div");

      div.className = "osmcal-calendar__btn-previous";
      div.style.cursor = "pointer";
      div.style.textAlign = "center";
      div.innerHTML = "&lt;";

      this.element = div;
    }
}

export { BtnPrevious as default };
