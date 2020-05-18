"use strict";

import Handlebars from "handlebars/dist/handlebars";
import L from "leaflet";

import Event from "../Event";
import Options from "../Options";
import Widget from "../Widget";

class Map extends Widget {
  private map: L.Map;
  private layer: L.FeatureGroup;

  private template: string =
    "<div class=\"osmcal-popup-event-name\">{{ name }}</div>" +
    "<div class=\"osmcal-popup-event-details\">{{ date.human }}{{#if location.short}} in {{ location.short }}{{/if}}</div>";

  constructor (element: HTMLElement, options?: Options) {
    super(options);

    this.element = element;

    this.init();
    this.addLink();
  }

  public setTemplate (template: string): this {
    this.template = template;

    return this;
  }

  public getMap (): L.Map {
    return this.map;
  }

  private addLink (): void {
    const link = document.createElement("link");

    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.6.0/dist/leaflet.css";
    link.integrity = "sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ==";
    link.crossOrigin = "";

    document.head.append(link);
  }

  private addBaselayer (): void {
    const baselayer = new L.TileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>"
      }
    );

    this.map.addLayer(baselayer);
  }

  private addLayer (): void {
    this.layer = new L.FeatureGroup();

    this.map.addLayer(this.layer);
  }

  private render (event: Event): string {
    const template = Handlebars.compile(this.template);

    return template(event);
  }

  private addMarker (event: Event): void {
    const marker = new L.Marker(
      new L.LatLng(
        event.location.coords[1],
        event.location.coords[0]
      )
    );

    const aElement = document.createElement("a");

    aElement.href = event.url;
    aElement.target = "_blank";
    aElement.innerHTML = this.render(event);

    marker.bindPopup(aElement);

    this.layer.addLayer(marker);
  }

  public async display (): Promise<Event[]> {
    const events = await this.fetch();

    this.map = new L.Map(this.element, {
      center: [51.505, -0.09],
      zoom: 13
    });
    this.addBaselayer();
    this.addLayer();

    if (events.length > 0) {
      events.forEach((event: Event) => {
        if (typeof event.location !== "undefined") {
          this.addMarker(event);
        }
      });

      this.map.fitBounds(this.layer.getBounds(), { padding: [15, 15], maxZoom: 18 });
    }

    return events;
  }
}

export { Map as default };
