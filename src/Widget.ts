"use strict";

import Handlebars from "handlebars/dist/handlebars";

import Event from "./Event";
import Filter from "./Filter";
import Options from "./Options";
import { messages } from "./i18n";

import { version } from "../package.json";

abstract class Widget {
  private url = "https://osmcal.org/api/v1/";

  protected filter: Filter = {};
  protected future = true;
  protected hideCancelled = false;
  protected limit = -1;
  protected locales: string|string[];
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
    if (typeof this.element.dataset.locale !== "undefined") {
      this.locales = this.element.dataset.locale;
    }
    if (typeof this.element.dataset.locales !== "undefined") {
      this.locales = this.element.dataset.locales.split(",");
    }

    if (typeof options !== "undefined") {
      this.filter = options.filter;
      this.hideCancelled = options.hideCancelled;
      this.limit = options.limit;
      this.locales = options.locales;

      if (typeof options.future !== "undefined" || typeof options.past !== "undefined") {
        this.future = (options.future === true);
        this.past = (options.past === true);
      }
    }
  }

  protected async fetch (request: string): Promise<Event[]> {
    let url = `${this.url}events/${request}`;

    if (typeof this.filter !== "undefined") {
      url += `?${new URLSearchParams(Object.entries(this.filter)).toString()}`;
    }

    const headers = new Headers();
    headers.append("Client-App", `osmcal-widget/${version}`);
    if (typeof this.locales !== "undefined") {
      headers.append("Accept-Language", Array.isArray(this.locales) ? this.locales.join(",") : this.locales);
    }

    const response = await fetch(url, {
      cache: "no-cache",
      headers
    });
    return (await response.json());
  }

  protected async getEvents (): Promise<Event[]> {
    let events: Event[] = [];

    if (this.future === true) {
      events = events.concat(await this.fetch(""));
    }
    if (this.past === true) {
      events = events.concat(await this.fetch("past/"));
    }

    if (this.hideCancelled === true) {
      events = events.filter((event: Event) => typeof event.cancelled === "undefined" || event.cancelled === false);
    }

    if (this.limit > 0) {
      return events.slice(0, this.limit);
    }

    return events;
  }

  protected getMessages (): Record<string, string> {
    const lang = Array.isArray(this.locales)
      ? this.locales[0]
      : typeof this.locales !== "undefined"
        ? this.locales
        : "en";

    return typeof messages[lang] !== "undefined" ? messages[lang] : messages.en;
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
