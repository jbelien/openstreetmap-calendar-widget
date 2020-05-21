"use strict";

import Options from "../../Options";

export type Position = "bottom" | "left" | "right" | "top";

interface OptionsCalendar extends Options {
    locales?: string|string[];
    position?: Position;
}

export { OptionsCalendar as default };
