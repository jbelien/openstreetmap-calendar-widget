"use strict";

import Event from "./Event";
import Filter from "./Filter";
import Options from "./Options";

abstract class Widget {
  private url = "https://osmcal.org/api/v1/";

  protected filter: Filter = {};
  protected limit = -1;

  protected element: HTMLElement;

  constructor (options?: Options) {
    if (typeof options !== "undefined") {
      this.filter = options.filter;
      this.limit = options.limit;
    }
  }

  protected init (): void {
    if (typeof this.element.dataset.in !== "undefined") {
      this.filter.in = this.element.dataset.in;
    }
    if (typeof this.element.dataset.limit !== "undefined") {
      this.limit = parseInt(this.element.dataset.limit);
    }
  }

  protected async fetch (): Promise<Event[]> {
    let url = `${this.url}events/`;

    if (typeof this.filter !== "undefined") {
      url += `?${new URLSearchParams(Object.entries(this.filter)).toString()}`;
    }

    const response = await fetch(url);
    const events = (await response.json()) as Event[];

    if (this.limit > 0) {
      return events.slice(0, this.limit);
    }

    return events;
  }

  abstract display(element: HTMLElement): void;
}

export { Widget as default };
