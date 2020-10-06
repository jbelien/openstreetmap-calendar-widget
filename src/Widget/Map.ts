"use strict";

import L from "leaflet";
import "leaflet.markercluster";

import Event from "../Event";
import Options from "../Options";
import Widget from "../Widget";

class Map extends Widget {
  private map: L.Map;
  private layer: L.FeatureGroup;
  private markerCluster: L.MarkerClusterGroup;

  protected template: string =
    "<div class=\"osmcal-map__event__name\">{{ name }}</div>" +
    "<div class=\"osmcal-map__event__details\">{{ date.human }}{{#if location.short}} in {{ location.short }}{{/if}}</div>";

  constructor (element: HTMLElement, options?: Options) {
    super(element, options);

    this.addLink();
    this.addLinkCluster();

    this.map = new L.Map(this.element);
    this.addBaselayer();
    this.addLayer();
  }

  public getMap (): L.Map {
    return this.map;
  }

  private addLink (): void {
    const link = document.createElement("link");

    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.7.1/dist/leaflet.css";
    link.integrity = "sha384-VzLXTJGPSyTLX6d96AxgkKvE/LRb7ECGyTxuwtpjHnVWVZs2gp5RDjeM/tgBnVdM";
    link.crossOrigin = "";

    document.head.append(link);
  }

  private addLinkCluster (): void {
    const link = document.createElement("link");

    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.Default.css";
    link.integrity = "sha384-5kMSQJ6S4Qj5i09mtMNrWpSi8iXw230pKU76xTmrpezGnNJQzj0NzXjQLLg+jE7k";
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

    this.markerCluster = L.markerClusterGroup();

    this.map.addLayer(this.markerCluster);
  }

  private addMarker (event: Event): void {
    const marker = new L.Marker(
      new L.LatLng(
        event.location.coords[1],
        event.location.coords[0]
      )
    );

    const divElement = document.createElement("div");

    divElement.className = "osmcal-map__event";

    if (event.cancelled === true) {
      divElement.classList.add("osmcal-map__event--cancelled");
    }

    const aElement = document.createElement("a");

    aElement.href = event.url;
    aElement.target = "_blank";
    aElement.innerHTML = this.render(event);

    divElement.append(aElement);

    marker.bindPopup(divElement);

    this.markerCluster.addLayer(marker);
  }

  public async display (): Promise<Event[]> {
    const events = await this.getEvents();

    if (events.length > 0) {
      events.forEach((event: Event) => {
        if (typeof event.location !== "undefined") {
          this.addMarker(event);
        }
      });

      this.map.fitBounds(this.markerCluster.getBounds(), { padding: [15, 15], maxZoom: 18 });
    }

    return events;
  }
}

export { Map as default };
