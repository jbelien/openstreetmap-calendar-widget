"use strict";

import Handlebars from "handlebars/dist/handlebars";

import Event from "./Event";
import Filter from "./Filter";

class Widget {
    private url = "https://osmcal.org/api/v1/";
    private element: HTMLElement;
    private filter: Filter;

    private template: string =
        "<div class=\"osmcal-event-name\">{{ name }}</div>" +
        "<div class=\"osmcal-event-details\">{{ date.human }}{{#if location.short}} in {{ location.short }}{{/if}}</div>";

    constructor (element: HTMLElement) {
      this.element = element;

      if (typeof this.element.dataset.in !== "undefined") {
        this.filter = {
          in: this.element.dataset.in.toString()
        };
      }
    }

    public setFilter (options: Filter): this {
      this.filter = options;

      return this;
    }

    public setTemplate (template: string): this {
      this.template = template;

      return this;
    }

    private render (event: Event): string {
      const template = Handlebars.compile(this.template);

      return template(event);
    }

    private display (event: Event): void {
      const liElement = document.createElement("li");
      liElement.className = "osmcal-event";

      const aElement = document.createElement("a");

      aElement.href = event.url;
      aElement.target = "_blank";
      aElement.innerHTML = this.render(event);

      liElement.appendChild(aElement);

      this.element.firstChild.appendChild(liElement);
    }

    public async fetch (): Promise<Event[]> {
      let url = `${this.url}events/`;

      if (typeof this.filter !== "undefined") {
        url += `?${new URLSearchParams(Object.entries(this.filter)).toString()}`;
      }

      const response = await fetch(url);
      const events = (await response.json()) as Event[];

      if (events.length > 0) {
        const ul = document.createElement("ul");

        ul.className = "osmcal-events";

        this.element.append(ul);

        events.forEach((event: Event) => {
          this.display(event);
        });
      }

      return events;
    }
}

export { Widget as default };
