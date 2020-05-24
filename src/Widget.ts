"use strict";

import Handlebars from "handlebars/dist/handlebars";

import Event from "./Event";
import Filter from "./Filter";
import Options from "./Options";

abstract class Widget {
  private url = "https://osmcal.org/api/v1/";

  protected filter: Filter = {};
  protected limit = -1;
  protected past = false;

  protected element: HTMLElement;
  protected template: string;

  constructor (element: HTMLElement, options?: Options) {
    this.element = element;

    if (typeof this.element.dataset.in !== "undefined") {
      this.filter.in = this.element.dataset.in;
    }
    if (typeof this.element.dataset.limit !== "undefined") {
      this.limit = parseInt(this.element.dataset.limit);
    }

    if (typeof options !== "undefined") {
      this.filter = options.filter;
      this.limit = options.limit;
      this.past = (options.past === true);
    }
  }

  protected async fetch (): Promise<Event[]> {
    let url = `${this.url}events/` + (this.past ? "past/" : "");

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

  public setTemplate (template: string): this {
    this.template = template;

    return this;
  }

  protected render (event: Event): string {
    const template = Handlebars.compile(this.template);

    return template(event);
  }

  public abstract async display(): Promise<Event[]>;
}

export { Widget as default };
