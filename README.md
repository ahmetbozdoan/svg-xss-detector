# svg-xss-detector
TR: XSS saldırılarını önlemek için küçük bir SVG dezenfektanı

EN: a small SVG sanitizer to prevent XSS attacks

## Why

TR: 3. Kişilerden tarafından yüklenen svg'ler güvensizdir. İçerisinde XSS saldırı kodları bulunabilir.
Küçük bir js dosyasıyla bu saldırıların önüne geçebilirsiniz.

EN: Bad actors can put script tags in SVG files.
These script tags are not run when the svg is inside an `<img>`,
but if the SVG file is opened directly ("Open image in...") they will run under the image's domain,
which means that bad actor could steal domain-specific context (cookies, local storage, etc.)

## Usage on Client

```js
// file input onSubmit handler
const onSubmit = async (e) => {
    var file = e.currentTarget.files[0]
    var svgXSSDetector = new SvgXSSDetector(file);
  
    $(svgXSSDetector)
        .on(SvgXSSDetector.EVENT_SVG_XSS_DETECTOR_CLEAN, function(){
            alert('clean!')				
        })
        .on(SvgXSSDetector.EVENT_SVG_XSS_DETECTOR_DIRTY, function(){
            alert('hello hacker!')					
        });
}
```

```html
// in JSX
<script src="svgXSSDetector.js" type="text/javascript" ></script>

<input type='file' onSubmit={onSubmit}/>
```

## License

MIT
