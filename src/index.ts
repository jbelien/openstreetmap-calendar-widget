"use strict";

import Widget from "./Widget";

export function init (element: HTMLElement): Widget {
  const widget = new Widget(element);

  return widget;
}
