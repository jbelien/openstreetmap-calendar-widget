"use strict";

import Filter from "./Filter";

interface Options {
  filter?: Filter;
  future?: boolean;
  limit?: number;
  past?: boolean;
}

export { Options as default };
