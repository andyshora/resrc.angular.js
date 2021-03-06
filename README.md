## ReSRC.it Angular Directive

An AngularJS Directive by [@andyshora](https://twitter.com/andyshora), for serving responsive images via [ReSRC.it](http://www.resrc.it/)


### Scenario: we have a bunch of images with fluid width containers.
---
### Wouldn't it be great if...

*   **The browser always requested the optimum-sized image**, looking at the width of the container before any image requests are made.
*   Retina support is detected before any images are requested, and **retina images are loaded** where possible.
*   As the viewport is resized, the **images get replaced with bigger ones** suited to the new container width.

### Oh yer, well that totally happens!

---

##Prerequisites
*   Sign up to [ReSRC.it](http://www.resrc.it/). Go for the free trial option.
*	Add the domain where your images are to [your ReSRC.it account](https://my.resrc.it/domains.aspx).

---

## Example

Some simple CSS to size the image containers.
```css
.small {
    width: 25%;
}
.medium {
    width: 50%;
}
```


Specifying the angular directive is so simple, it almost looks like just including a normal img element!

- The *resrcit* class turns the element into a responsive image component
- The *data-src* attribute references the largest possible version of the image. This is what the ReSRC.it servers retrieve and serve up at smaller sizes.

```html
<div class="small">
  <img class="resrcit" data-src="http://s3.stackey.com/dog.jpg">
</div>
<div class="medium">
  <img class="resrcit" data-src="http://s3.stackey.com/dog.jpg">
</div>
```

## Result

![](http://s3.stackey.com/demo.png)

##Here's a [live demo on JSBin](http://jsbin.com/waqek/2)

---

## Usage Instructions

####1. Include Angular (obviously) and the directive
```html
<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.2.21/angular.js"></script>
<script src="path/to/resrc.angular.js"></script>
```

####2. Initialise the dependencies via the provider, passing in config (optional)

```javascript
angular.module('myApp', ['ReSRC'])
    .config(function(responsiveImageProvider) {

      // init with config
      responsiveImageProvider.init({
        trial: true
      });

    });

})();
```
####3. Include CSS (transitions optional)
This is to ensure the images fill the container, and they fade in nicely on load.
```css
.resrc-wrap > img {
  width: 100%;
  opacity: 0;
  -moz-transition: opacity .5s;
  -o-transition: opacity .5s;
  -ms-transition: opacity .5s;
  -webkit-transition: opacity .5s;
  transition: opacity .5s;
}
.resrc-wrap--loaded > img {
  opacity: 1;
}
```
####4. Declare images
Remember to specify the *resrcit* class, and the *data-src* attribute referencing the large image.
```html
<img class="resrcit" data-src="http://s3.stackey.com/dog.jpg">
```
---

## Global Config Options
For use in Step 2 above, passed in as JSON.

| Parameter | Values | Description |
|---|----|-----|
| resrcOnLoad	| True or False (Default: True) | Resize images automatically once the page has fully loaded |
| resrcOnResize |	True or False (Default: True) |	Resize images automatically on browser resize and rotation |
| resrcOnPinch |	True or False(Default: False) |	Resize images automatically when images are pinch zoomed (currently only supported on iOS mobile devices) |
| server |	Default: "app.resrc.it" |	ReSRC server address |
| trial | True of False (Default: False) | Set to True if you're in trial mode. This sets server to trial.resrc.it |
| ssl |	True or False(Default: false) | Generates https:// requests |
| resrcClass |	Default: "resrc" |	The class name that identifies which elements to ReSRC |


---

## Directive Options
Set declaratively on img tag.

| Parameter | Type | Description |
|---|----|-----|
| data-src | string | The full size image source. This must be added in [your ReSRC.it account](https://my.resrc.it/domains.aspx) |
| dpi | string | dpi override |
| server | string | server path - should not need changing |
| alt | string | alt text for image |
| placeholder | string | placeholder image to be displayed until image has loaded. e.g. spinner |
| on-image-load | function | callback function executed on image load |

---
### Check out the [index.html](https://github.com/andyshora/resrc.angular.js/blob/master/index.html) file in this repo for a working demo, or if you're short on time, here's a [live demo on JSBin](http://jsbin.com/waqek/2).
