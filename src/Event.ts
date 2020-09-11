"use strict";

interface Event {
    cancelled?: boolean;
    name: string;
    url: string;

    date: {
        human: string;
        // eslint-disable-next-line camelcase
        whole_day: boolean;
        start: string;
        end?: string;
    };

    location?: {
        coords: [number, number]|null;
        detailed: string|null;
        short: string|null;
        venue?: string;
    };
}

export { Event as default };
