"use strict";

import Handlebars from "handlebars/dist/handlebars";

import Event from "../Event";
import Widget from "../Widget";

class List extends Widget {
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

  public async display (): Promise<Event[]> {
    const events = await this.fetch();

    if (events.length > 0) {
      const ul = document.createElement("ul");

      ul.className = "osmcal-events";

      this.element.append(ul);

      events.forEach((event: Event) => {
        const liElement = document.createElement("li");

        liElement.className = "osmcal-event";

        const aElement = document.createElement("a");

        aElement.href = event.url;
        aElement.target = "_blank";
        aElement.innerHTML = this.render(event);

        liElement.appendChild(aElement);

        ul.appendChild(liElement);
      });
    }

    return events;
  }
}

export { List as default };
