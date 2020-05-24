"use strict";

function daysInMonth (month: number, year: number): number {
  return 32 - new Date(year, month, 32).getDate();
}

class Table {
    public element: HTMLTableElement;

    constructor () {
      const table = document.createElement("table");

      table.className = "osmcal-calendar__table";
      table.style.width = "100%";

      this.element = table;
    }

    public update (month: number, year: number): HTMLTableSectionElement {
      const tbody = document.createElement("tbody");

      const now = new Date();
      const firstDay = (((new Date(year, month)).getDay() - 1) + 7) % 7;

      let date = 1;

      for (let i = 0; i < 6; i++) {
        const tr = document.createElement("tr");

        for (let j = 0; j < 7; j++) {
          if (date > daysInMonth(month, year)) {
            break;
          }

          const td = document.createElement("td");

          td.className = "osmcal-calendar__date";

          if (i > 0 || j >= firstDay) {
            if (date === now.getDate() && year === now.getFullYear() && month === now.getMonth()) {
              td.classList.add("osmcal-calendar__date--today");
            }

            td.dataset.year = year.toString();
            td.dataset.month = (month + 1).toString();
            td.dataset.date = date.toString();

            td.innerText = (date++).toString();
          }

          tr.append(td);
        }

        tbody.append(tr);
      }

      this.element.innerHTML = "";
      this.element.append(tbody);

      return tbody;
    }
}

export { Table as default };
