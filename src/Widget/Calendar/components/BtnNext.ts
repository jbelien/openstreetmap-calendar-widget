"use strict";

class BtnNext {
    public element: HTMLDivElement;

    constructor () {
      const div = document.createElement("div");

      div.className = "osmcal-calendar__btn-next";
      div.style.cursor = "pointer";
      div.style.textAlign = "center";
      div.innerHTML = "&gt;";

      this.element = div;
    }
}

export { BtnNext as default };
