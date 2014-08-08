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

### Result

![](http://s3.stackey.com/demo.png)


