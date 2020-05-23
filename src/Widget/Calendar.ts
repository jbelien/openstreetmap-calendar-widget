"use strict";

import Handlebars from "handlebars/dist/handlebars";

import Event from "../Event";
import Components from "./Calendar/Components";
import OptionsCalendar, { Position } from "./Options/Calendar";
import Widget from "../Widget";

import createTablesDates from "./Calendar/dates";

class Calendar extends Widget {
  private locales: string|string[];
  private position: Position;

  private year: number;
  private month: number;

  private events: Event[] = [];

  private template: string =
    "<div class=\"osmcal-calendar__event__name\">{{ name }}</div>" +
    "<div class=\"osmcal-calendar__event__details\">{{ date.human }}{{#if location.short}} in {{ location.short }}{{/if}}</div>";

  public setTemplate (template: string): this {
    this.template = template;

    return this;
  }

  private render (event: Event): string {
    const template = Handlebars.compile(this.template);

    return template(event);
  }

  private createElement (): HTMLDivElement {
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

    div.append(Components.createDivTable());
    div.append(Components.createDivList());

    return div;
  }

  private displayMonth (): void {
    const element = this.element.querySelector(".osmcal-calendar__month") as HTMLDivElement;

    element.innerText = new Date(this.year, this.month).toLocaleDateString(this.locales, { month: "long", year: "numeric" });
  }

  private displayDates (): void {
    const element = this.element.querySelector(".osmcal-calendar__table") as HTMLTableElement;

    element.innerHTML = "";
    element.append(createTablesDates(this.month, this.year));
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

    this.element.append(this.createElement());

    const divPrevious = this.element.querySelector(".osmcal-calendar__btn-previous") as HTMLDivElement;
    divPrevious.addEventListener("click", () => {
      this.month--;

      if (this.month < 0) {
        this.month = 12;
        this.year--;
      }

      this.update();
    });

    const divNext = this.element.querySelector(".osmcal-calendar__btn-next") as HTMLDivElement;
    divNext.addEventListener("click", () => {
      this.month++;

      if (this.month > 11) {
        this.month = 0;
        this.year++;
      }

      this.update();
    });

    this.update();
  }

  private update (): void {
    const list = this.element.querySelector(".osmcal-calendar__list") as HTMLUListElement;

    list.innerHTML = "";

    this.displayMonth();
    this.displayDates();
    this.updateTableWithEvents();
  }

  public async display (): Promise<Event[]> {
    this.events = await this.fetch();

    if (this.events.length > 0) {
      this.updateTableWithEvents();
    }

    return this.events;
  }

  private updateTableWithEvents (): void {
    const table = this.element.querySelector(".osmcal-calendar__table") as HTMLTableElement;

    const group: Record<string, Event[]> = {};

    this.events.forEach((event: Event) => {
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
        const td = table.querySelector(`td[data-year="${year}"][data-month="${month + 1}"][data-date="${date}"]`) as HTMLTableCellElement;

        td.classList.add("osmcal-calendar__date--has-event");
        td.title = events.length.toString();

        const a = document.createElement("a");

        a.href = "#";
        a.innerText = td.innerText;

        a.addEventListener("click", (event) => {
          event.preventDefault();

          this.displayEventsList(events);
        });

        td.innerHTML = "";
        td.append(a);
      }
    });
  }

  private displayEventsList (events: Event[]): void {
    const list = this.element.querySelector(".osmcal-calendar__list") as HTMLUListElement;

    list.innerHTML = "";

    events.forEach((event: Event) => {
      const li = document.createElement("li");

      li.className = "osmcal-calendar__event";

      const a = document.createElement("a");

      a.href = event.url;
      a.target = "_blank";
      a.innerHTML = this.render(event);

      li.append(a);

      list.append(li);
    });
  }
}

export { Calendar as default };
