# OpenStreetMap Calendar Widget

Widget to embed [OpenStreetMap Calendar](https://osmcal.org/) events in your application/website.

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

### Limit

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

### Past events

By default, only future events are displayed. If you want to display past events, here is how to do it.

```js
const widget = new OSMCal.WidgetList(document.getElementById("osmcal"), {
  past: true,
});
widget.display();
```

## Events map

```js
const widget = new OSMCal.WidgetMap(document.getElementById("osmcal"));
widget.display();
```

All parameters described for WidgetList are also available for WidgetMap (filter, limit, past, ...).
