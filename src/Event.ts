"use strict";

class Event {
    name: string;
    url: string;
    date: {
        human: string;
        whole_day: boolean;
        start: string;
        end?: string;
    };

    location: {
        short: string|null;
        detailed: string|null;
    }
}

export { Event as default };
