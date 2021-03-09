/**
 * a small SVG sanitizer to prevent XSS attacks
 * @param file
 * @constructor
 */
SvgXSSDetector = function(file) {
	var _this = this;

	var readAsText = function(svg, callback) {
		if (!isFile(svg)) {
			callback(svg.toString("utf-8"));
		} else {
			var fileReader = new FileReader();
			fileReader.onload = function() {
				callback(fileReader.result);
			};
			fileReader.readAsText(svg);
		}
	};

	var isFile = function(obj) {
		return obj.size !== undefined;
	};

	var sanitizeSVG = function(svg) {
		if (isFile(svg) && svg.type !== "image/svg+xml") {
			//Gelen dosya svg degil ise.
			$(_this).trigger(SvgXSSDetector.EVENT_SVG_XSS_DETECTOR_CLEAN);
			return false;
		}

		function checkSecurity(svgText) {
			try {
				if (!svgText) {
					$(_this).trigger(SvgXSSDetector.EVENT_SVG_XSS_DETECTOR_CLEAN);
					return false;
				}

				var div = window.document.createElement("div");
				div.innerHTML = svgText;

				var svgEl = div.firstElementChild;

				//SVG icerisindeki tum elementlerden array olusturur.
				var svgAllAttributes = Array.from(svgEl.children).map(function(child) {
					return child.attributes;
				});
				svgAllAttributes.push(svgEl.attributes);

				var attributes = [];
				//SVG elementlerinin attribute lerinin isminden bir array olusturur.
				svgAllAttributes.map(function(attr) {
					for (var index = 0; index < attr.length; index++) {
						attributes.push(attr[index].name);
					}
				});

				//attribute ler arasinda on ile baslayan herhangir attr varsa svg xss injection olabilir.
				var hasScriptAttr = !!attributes.find(function(attr) {
					return attr.startsWith("on");
				});

				//script tag i varsa xss injection olabilir.
				var scripts = svgEl.getElementsByTagName("script");

				if (scripts.length === 0 && !hasScriptAttr) {
					$(_this).trigger(SvgXSSDetector.EVENT_SVG_XSS_DETECTOR_CLEAN);
				} else {
					$(_this).trigger(SvgXSSDetector.EVENT_SVG_XSS_DETECTOR_DIRTY);
				}
			} catch (e) {
				//Herhangi bir javascript hatasinda svg guvenilir kabul edilir.
				$(_this).trigger(SvgXSSDetector.EVENT_SVG_XSS_DETECTOR_CLEAN);
			}
		}

		readAsText(svg, checkSecurity);
	};

	function init() {
		sanitizeSVG(file);
	}

	init();
};

SvgXSSDetector.EVENT_SVG_XSS_DETECTOR_CLEAN = "event-svg-xss-detector-clean";
SvgXSSDetector.EVENT_SVG_XSS_DETECTOR_DIRTY = "event-svg-xss-detector-dirty";
