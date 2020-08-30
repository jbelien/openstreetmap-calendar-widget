# OpenStreetMap Calendar Widget

Widget to embed [OpenStreetMap Calendar](https://osmcal.org/) events in your application/website.

## Usage

```html
<script
  src="https://unpkg.com/@jbelien/openstreetmap-calendar-widget@0.3.0/dist/osmcal.js"
  integrity="sha512-IjhLdVdt4WC+plIvDmYyggwPwT6ILBGXYqfCIN+APNdUc9FTnRMpZnQPB0C9ElrN8YHie/UqhiJ4xtPyh+HTHA=="
  crossorigin=""
></script>
```

## Events list

```js
const widget = new OSMCal.WidgetList(document.getElementById("osmcal"));
widget.display();
```

### Filter

#### Country (`in`)

**Using `data-in` attribute:**

```html
<div id="osmcal" data-in="Belgium"></div>
```

```js
const widget = new OSMCal.WidgetList(document.getElementById("osmcal"));
widget.display();
```

**Using JavaScript:**

```js
const widget = new OSMCal.WidgetList(document.getElementById("osmcal"), {
  filter: { in: "Belgium" },
});
widget.display();
```

### Options

#### Locale(s)

**Using `data-locales` attribute:**

```html
<div id="osmcal" data-locales="fr"></div>
```

```js
const widget = new OSMCal.WidgetList(document.getElementById("osmcal"));
widget.display();
```

**Using JavaScript:**

```js
const widget = new OSMCal.WidgetList(document.getElementById("osmcal"), {
  locales: "fr",
});
widget.display();
```

#### Limit

**Using `data-limit` attribute:**

```html
<div id="osmcal" data-in="5"></div>
```

```js
const widget = new OSMCal.WidgetList(document.getElementById("osmcal"));
widget.display();
```

**Using JavaScript:**

```js
const widget = new OSMCal.WidgetList(document.getElementById("osmcal"), {
  limit: 5,
});
widget.display();
```

#### Past events

By default, only future events are displayed. If you want to display past events, here is how to do it.

```js
const widget = new OSMCal.WidgetList(document.getElementById("osmcal"), {
  past: true,
});
widget.display();
```

### Classes

Following classes are available for customization:

| Class                            | Element | Description                                    |
| -------------------------------- | ------- | ---------------------------------------------- |
| `.osmcal-list__list`             | `ul`    | List of events                                 |
| `.osmcal-list__event`            | `li`    | Event list item (containing the template)      |
| `.osmcal-list__event--cancelled` | `li`    | Cancelled event list item                      |
| `.osmcal-list__event__name`      | `div`   | Event name (default template)                  |
| `.osmcal-list__event__details`   | `div`   | Event datetime and location (default template) |

## Events calendar

```js
const widget = new OSMCal.WidgetCalendar(document.getElementById("osmcal"));
widget.display();
```

All parameters described for WidgetList are also available for WidgetCalendar (filter, limit, past, locales, ...).

### Options

#### Position

**Using `data-position` attribute:**

```html
<div id="osmcal" data-position="bottom"></div>
```

```js
const widget = new OSMCal.WidgetList(document.getElementById("osmcal"));
widget.display();
```

**Using JavaScript:**

```js
const widget = new OSMCal.WidgetList(document.getElementById("osmcal"), {
  position: "bottom",
});
widget.display();
```

### Classes

Following classes are available for customization:

| Class                                | Element | Description                                    |
| ------------------------------------ | ------- | ---------------------------------------------- |
| `.osmcal-calendar__btn-previous`     | `div`   | Button to switch to previous month             |
| `.osmcal-calendar__btn-next`         | `div`   | Button to switch to next month                 |
| `.osmcal-calendar__month`            | `div`   | Element containing month and year              |
| `.osmcal-calendar__table`            | `tbody` | Element containing dates                       |
| `.osmcal-calendar__date`             | `td`    | Table cell containing date                     |
| `.osmcal-calendar__date--today`      | `td`    | Table cell containing today's date             |
| `.osmcal-calendar__date--has-event`  | `td`    | Table cell containing date with event(s)       |
| `.osmcal-calendar__list`             | `ul`    | List of events                                 |
| `.osmcal-calendar__event`            | `li`    | Event list item (containing the template)      |
| `.osmcal-calendar__event--cancelled` | `li`    | Cancelled event list item                      |
| `.osmcal-calendar__event__name`      | `div`   | Event name (default template)                  |
| `.osmcal-calendar__event__details`   | `div`   | Event datetime and location (default template) |

## Events map

```js
const widget = new OSMCal.WidgetMap(document.getElementById("osmcal"));
widget.display();
```

All parameters described for WidgetList are also available for WidgetMap (filter, limit, past, locales, ...).

### Classes

Following classes are available for customization:

| Class                           | Element | Description                                    |
| ------------------------------- | ------- | ---------------------------------------------- |
| `.osmcal-map__event`            | `div`   | Event item (containing the template)           |
| `.osmcal-map__event--cancelled` | `li`    | Cancelled event list item                      |
| `.osmcal-map__event__name`      | `div`   | Event name (default template)                  |
| `.osmcal-map__event__details`   | `div`   | Event datetime and location (default template) |
