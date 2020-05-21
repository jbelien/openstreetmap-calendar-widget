"use strict";

import Handlebars from "handlebars/dist/handlebars";

import Event from "../Event";
import OptionsCalendar, { Position } from "./Options/Calendar";
import Widget from "../Widget";

class Calendar extends Widget {
  private table: HTMLTableElement;
  private list: HTMLUListElement;

  private locales: string|string[];
  private position: Position;

  private year: number;
  private month: number;

  private template: string =
    "<div class=\"osmcal-event-name\">{{ name }}</div>" +
    "<div class=\"osmcal-event-details\">{{ date.human }}{{#if location.short}} in {{ location.short }}{{/if}}</div>";

  public setTemplate (template: string): this {
    this.template = template;

    return this;
  }

  private render (event: Event): string {
    const template = Handlebars.compile(this.template);

    return template(event);
  }

  constructor (element: HTMLElement, options?: OptionsCalendar) {
    super(element, options);

    if (typeof this.element.dataset.locales !== "undefined") {
      this.locales = this.element.dataset.locales;
    }
    if (typeof this.element.dataset.position !== "undefined") {
      this.position = this.element.dataset.position as Position;
    }

    if (typeof options !== "undefined") {
      this.locales = options.locales;
      this.position = options.position;
    }

    this.year = new Date().getFullYear();
    this.month = new Date().getMonth();

    const div = document.createElement("div");

    div.style.display = "flex";

    switch (this.position) {
      case "bottom":
        div.style.flexDirection = "column";
        break;
      case "left":
        div.style.flexDirection = "row-reverse";
        break;
      case "right":
      default:
        div.style.flexDirection = "row";
        break;
      case "top":
        div.style.flexDirection = "column-reverse";
        break;
    }

    this.table = this.createTable(this.month, this.year);
    this.list = this.createList();

    div.append(this.table);
    div.append(this.list);

    this.element.append(div);
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

  private createList (): HTMLUListElement {
    const ul = document.createElement("ul");

    ul.className = "osmcal-events";

    return ul;
  }

  public async display (): Promise<Event[]> {
    const events = await this.fetch();

    if (events.length > 0) {
      const group: Record<string, Event[]> = {};

      events.forEach((event: Event) => {
        const start = new Date(event.date.start);

        const startString = start.toISOString();

        if (typeof group[startString] === "undefined") {
          group[startString] = [];
        }

        group[startString].push(event);
      });

      Object.keys(group).forEach((dateString: string) => {
        const _date = new Date(dateString);

        const year = _date.getFullYear();
        const month = _date.getMonth();
        const date = _date.getDate();

        const events = group[dateString];

        if (month === this.month && year === this.year) {
          const td = this.table.querySelector(`td[data-year="${year}"][data-month="${month + 1}"][data-date="${date}"]`) as HTMLTableCellElement;

          td.classList.add("event");
          td.title = events.length.toString();

          const a = document.createElement("a");

          a.href = "#";
          a.innerText = td.innerText;

          a.addEventListener("click", (event) => {
            event.preventDefault();

            this.displayList(events);
          });

          td.innerHTML = "";
          td.append(a);
        }
      });
    }

    return events;
  }

  private displayList (events: Event[]): void {
    this.list.innerHTML = "";

    events.forEach((event: Event) => {
      const li = document.createElement("li");

      li.className = "osmcal-event";

      const a = document.createElement("a");

      a.href = event.url;
      a.target = "_blank";
      a.innerHTML = this.render(event);

      li.append(a);

      this.list.append(li);
    });
  }
}

export { Calendar as default };
