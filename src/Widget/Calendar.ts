"use strict";

import Event from "../Event";
import Options from "../Options";
import Widget from "../Widget";

class Calendar extends Widget {
  private table: HTMLTableElement;

  private locales: string|string[];

  private year: number;
  private month: number;

  constructor (element: HTMLElement, options?: Options, locales?: string|string[]) {
    super(element, options);

    this.locales = locales;

    this.year = new Date().getFullYear();
    this.month = new Date().getMonth();

    this.table = this.createTable(this.month, this.year);

    this.element.append(this.table);
  }

  private static daysInMonth (month: number, year: number): number {
    return 32 - new Date(year, month, 32).getDate();
  }

  private createTable (month: number, year: number): HTMLTableElement {
    const table = document.createElement("table");

    const caption = document.createElement("caption");

    caption.innerText = new Date(year, month).toLocaleDateString(this.locales, { month: "long", year: "numeric" });

    table.append(caption);

    const tbody = document.createElement("tbody");

    const now = new Date();
    const firstDay = (((new Date(year, month)).getDay() - 1) + 7) % 7;

    let date = 1;

    for (let i = 0; i < 6; i++) {
      const tr = document.createElement("tr");

      for (let j = 0; j < 7; j++) {
        if (date > Calendar.daysInMonth(month, year)) {
          break;
        }

        const td = document.createElement("td");

        if (i > 0 || j >= firstDay) {
          if (date === now.getDate() && year === now.getFullYear() && month === now.getMonth()) {
            td.classList.add("today");
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

    table.append(tbody);

    return table;
  }

  public async display (): Promise<Event[]> {
    const events = await this.fetch();

    if (events.length > 0) {
      events.forEach((event: Event) => {
        const start = new Date(event.date.start);

        const year = start.getFullYear();
        const month = start.getMonth();
        const date = start.getDate();

        if (month === this.month && year === this.year) {
          const td = this.table.querySelector(`td[data-year="${year}"][data-month="${month + 1}"][data-date="${date}"]`) as HTMLTableCellElement;

          td.classList.add("event");

          td.title = event.name;
          if (typeof event.location !== "undefined") {
            td.title += ` in ${event.location.short}`;
          }

          td.innerHTML = `<a target="_blank" href="${event.url}">${td.innerText}</a>`;
        }
      });
    }

    return events;
  }
}

export { Calendar as default };
