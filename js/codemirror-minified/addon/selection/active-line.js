!function(e){"object"==typeof exports&&"object"==typeof module?e(require("../../lib/codemirror")):"function"==typeof define&&define.amd?define(["../../lib/codemirror"],e):e(CodeMirror)}(function(r){"use strict";var s="CodeMirror-activeline",c="CodeMirror-activeline-background",l="CodeMirror-activeline-gutter";function f(e){for(var t=0;t<e.state.activeLines.length;t++)e.removeLineClass(e.state.activeLines[t],"wrap",s),e.removeLineClass(e.state.activeLines[t],"background",c),e.removeLineClass(e.state.activeLines[t],"gutter",l)}function o(t,e){for(var n=[],i=0;i<e.length;i++){var r=e[i],o=t.getOption("styleActiveLine");if("object"==typeof o&&o.nonEmpty?r.anchor.line==r.head.line:r.empty()){var a=t.getLineHandleVisualStart(r.head.line);n[n.length-1]!=a&&n.push(a)}}(function(e,t){if(e.length!=t.length)return!1;for(var n=0;n<e.length;n++)if(e[n]!=t[n])return!1;return!0})(t.state.activeLines,n)||t.operation(function(){f(t);for(var e=0;e<n.length;e++)t.addLineClass(n[e],"wrap",s),t.addLineClass(n[e],"background",c),t.addLineClass(n[e],"gutter",l);t.state.activeLines=n})}function a(e,t){o(e,t.ranges)}r.defineOption("styleActiveLine",!1,function(e,t,n){var i=n!=r.Init&&n;t!=i&&(i&&(e.off("beforeSelectionChange",a),f(e),delete e.state.activeLines),t&&(e.state.activeLines=[],o(e,e.listSelections()),e.on("beforeSelectionChange",a)))})});