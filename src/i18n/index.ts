"use strict";

import { messages as en } from "./en";
import { messages as fr } from "./fr";
import { messages as nl } from "./nl";

export const messages = { en, fr, nl };

export function getMessages (locale: string): Record<string, string> {
  return typeof messages[locale] !== "undefined"
    ? messages[locale]
    : messages.en;
}
