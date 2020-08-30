"use strict";

import Filter from "./Filter";

interface Options {
  filter?: Filter;
  future?: boolean;
  hideCancelled?: boolean;
  limit?: number;
  locales?: string|string[];
  past?: boolean;
}

export { Options as default };
