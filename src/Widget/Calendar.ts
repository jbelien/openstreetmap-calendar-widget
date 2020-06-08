"use strict";

import BtnNext from "./Calendar/components/BtnNext";
import BtnPrevious from "./Calendar/components/BtnPrevious";
import List from "./Calendar/components/List";
import Month from "./Calendar/components/Month";
import Table from "./Calendar/components/Table";
import Event from "../Event";
import OptionsCalendar, { Position } from "./Options/Calendar";
import Widget from "../Widget";

class Calendar extends Widget {
  protected future = true;
  protected past = true;

  private position: Position;

  private year: number;
  private month: number;

  private events: Event[] = [];

  private components: {
    btnNext: BtnNext;
    btnPrevious: BtnPrevious;
    list: List;
    month: Month;
    table: Table;
  };

  protected template: string =
    "<div class=\"osmcal-calendar__event__name\">{{ name }}</div>" +
    "<div class=\"osmcal-calendar__event__details\">{{ date.human }}{{#if location.short}} in {{ location.short }}{{/if}}</div>";

  private createElement (): HTMLDivElement {
    this.components = {
      btnNext: new BtnNext(),
      btnPrevious: new BtnPrevious(),
      list: new List(),
      month: new Month(),
      table: new Table()
    };

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

    const divMonth = document.createElement("div");

    divMonth.style.display = "flex";
    divMonth.style.justifyContent = "space-between";

    divMonth.append(
      this.components.btnPrevious.element,
      this.components.month.element,
      this.components.btnNext.element
    );

    const divTable = document.createElement("div");

    divTable.style.display = "flex";
    divTable.style.flexDirection = "column";

    divTable.append(divMonth, this.components.table.element);

    div.append(divTable);
    div.append(this.components.list.element);

    return div;
  }

  private displayMonth (): void {
    this.components.month.element.innerText = new Date(this.year, this.month).toLocaleDateString(this.locales, { month: "long", year: "numeric" });
  }

  private displayDates (): void {
    this.components.table.update(this.month, this.year);
  }

  constructor (element: HTMLElement, options?: OptionsCalendar) {
    super(element, options);

    if (typeof this.element.dataset.position !== "undefined") {
      this.position = this.element.dataset.position as Position;
    }

    if (typeof options !== "undefined") {
      this.position = options.position;
    }

    this.year = new Date().getFullYear();
    this.month = new Date().getMonth();

    this.element.append(this.createElement());

    this.components.btnPrevious.element.addEventListener("click", () => {
      this.month--;

      if (this.month < 0) {
        this.month = 12;
        this.year--;
      }

      // const minimum = this.events.reduce((accumulator, currentValue) => {
      //   if (currentValue.date.start < accumulator.date.start) {
      //     return currentValue;
      //   }

      //   return accumulator;
      // }, this.events[0]);

      this.update();
    });

    this.components.btnNext.element.addEventListener("click", () => {
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
    this.components.list.element.innerHTML = "";

    this.displayMonth();
    this.displayDates();
    this.updateTableWithEvents();
  }

  public async display (): Promise<Event[]> {
    this.events = await this.getEvents();

    if (this.events.length > 0) {
      this.updateTableWithEvents();
    }

    return this.events;
  }

  private updateTableWithEvents (): void {
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
        const td = this.components.table.element.querySelector(`td[data-year="${year}"][data-month="${month + 1}"][data-date="${date}"]`) as HTMLTableCellElement;

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
    this.components.list.element.innerHTML = "";

    events.forEach((event: Event) => {
      const li = document.createElement("li");

      li.className = "osmcal-calendar__event";

      if (event.cancelled === true) {
        li.classList.add("osmcal-calendar__event--cancelled");
      }

      const a = document.createElement("a");

      a.href = event.url;
      a.target = "_blank";
      a.innerHTML = this.render(event);

      li.append(a);

      this.components.list.element.append(li);
    });
  }
}

export { Calendar as default };
