"use strict";

abstract class Components {
  private static createDivMonth (): HTMLDivElement {
    const div = document.createElement("div");

    div.style.display = "flex";
    div.style.justifyContent = "space-between";
    div.style.flexShrink = "1";

    const divPrevious = document.createElement("div");

    divPrevious.className = "osmcal-calendar__btn-previous";
    divPrevious.style.cursor = "pointer";
    divPrevious.style.textAlign = "center";
    divPrevious.innerHTML = "&lt;";

    div.append(divPrevious);

    const divMonth = document.createElement("div");

    divMonth.className = "osmcal-calendar__month";

    div.append(divMonth);

    const divNext = document.createElement("div");

    divNext.className = "osmcal-calendar__btn-next";
    divNext.style.cursor = "pointer";
    divNext.style.textAlign = "center";
    divNext.innerHTML = "&gt;";

    div.append(divNext);

    return div;
  }

  private static createTable (): HTMLTableElement {
    const table = document.createElement("table");

    table.className = "osmcal-calendar__table";
    table.style.width = "100%";

    return table;
  }

  public static createDivTable (): HTMLDivElement {
    const div = document.createElement("div");

    div.style.display = "flex";
    div.style.flexDirection = "column";

    div.append(Components.createDivMonth());
    div.append(Components.createTable());

    return div;
  }

  public static createDivList (): HTMLDivElement {
    const div = document.createElement("div");

    const ul = document.createElement("ul");

    ul.className = "osmcal-calendar__list";

    div.append(ul);

    return div;
  }
}

export { Components as default };
