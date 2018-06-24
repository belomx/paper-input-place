import {
    html,
    PolymerElement
} from '@polymer/polymer/polymer-element.js';

/**
 * `demo-show-object`
 *
 */
class DemoShowObject extends PolymerElement {
    static get template() {
        return html `
      <style>
      :host {
        display: inline-block;
      }
    </style>
    <style>
      /*!
       * Agate by Taufik Nurrohman <https://github.com/tovic>
       * ----------------------------------------------------
       *
       * #ade5fc
       * #a2fca2
       * #c6b4f0
       * #d36363
       * #fcc28c
       * #fc9b9b
       * #ffa
       * #fff
       * #333
       * #62c8f3
       * #888
       *
       */
      .hljs {
        display: block;
        overflow-x: auto;
        padding: 0.5em;
        background: #333;
        color: white;
      }
      .hljs-name,
      .hljs-strong {
        font-weight: bold;
      }
      .hljs-code,
      .hljs-emphasis {
        font-style: italic;
      }
      .hljs-tag {
        color: #62c8f3;
      }
      .hljs-variable,
      .hljs-template-variable,
      .hljs-selector-id,
      .hljs-selector-class {
        color: #ade5fc;
      }
      .hljs-string,
      .hljs-bullet {
        color: #a2fca2;
      }
      .hljs-type,
      .hljs-title,
      .hljs-section,
      .hljs-attribute,
      .hljs-quote,
      .hljs-built_in,
      .hljs-builtin-name {
        color: #ffa;
      }
      .hljs-number,
      .hljs-symbol,
      .hljs-bullet {
        color: #d36363;
      }
      .hljs-keyword,
      .hljs-selector-tag,
      .hljs-literal {
        color: #fcc28c;
      }
      .hljs-comment,
      .hljs-deletion,
      .hljs-code {
        color: #888;
      }
      .hljs-regexp,
      .hljs-link {
        color: #c6b4f0;
      }
      .hljs-meta {
        color: #fc9b9b;
      }
      .hljs-deletion {
        background-color: #fc9b9b;
        color: #333;
      }
      .hljs-addition {
        background-color: #a2fca2;
        color: #333;
      }
      .hljs a {
        color: inherit;
      }
      .hljs a:focus,
      .hljs a:hover {
        color: inherit;
        text-decoration: underline;
      }
    </style>
    <pre><code id="codearea" class="hljs json">
    </code></pre>
    `;
    }
    static get properties() {
        return {
            showObject: {
                type: Object,
                notify: true,
                observer: "_objChanged"
            },
            displayObj: {
                type: String,
                notify: true,
                value: ""
            }
        };
    }

    _objChanged(newValue, oldValue) {
        var src = newValue && newValue !== {} ? hljs.highlight('json', this._formatJson(JSON.stringify(newValue))).value : "";
        this.$.codearea.innerHTML = src.replace(/span class="hljs/g, 'span class="demo-show-object hljs');
    }

    _realTypeOf(indent, v) {
        if (typeof (v) == "object") {
            if (v === null) return "null";
            if (v.constructor == (new Array).constructor) return "array";
            if (v.constructor == (new Date).constructor) return "date";
            if (v.constructor == (new RegExp).constructor) return "regex";
            return "object";
        }
        return typeof (v);
    }

    _repeat(s, count) {
        return new Array(count + 1).join(s);
    }

    _formatJson(json) {
        var i = 0,
            il = 0,
            tab = "  ",
            newJson = "",
            indentLevel = 0,
            inString = false,
            currentChar = null;

        for (i = 0, il = json.length; i < il; i += 1) {
            currentChar = json.charAt(i);

            switch (currentChar) {
                case '{':
                case '[':
                    if (!inString) {
                        newJson += currentChar + "\n" + this._repeat(tab, indentLevel + 1);
                        indentLevel += 1;
                    } else {
                        newJson += currentChar;
                    }
                    break;
                case '}':
                case ']':
                    if (!inString) {
                        indentLevel -= 1;
                        newJson += "\n" + this._repeat(tab, indentLevel) + currentChar;
                    } else {
                        newJson += currentChar;
                    }
                    break;
                case ',':
                    if (!inString) {
                        newJson += ",\n" + this._repeat(tab, indentLevel);
                    } else {
                        newJson += currentChar;
                    }
                    break;
                case ':':
                    if (!inString) {
                        newJson += ": ";
                    } else {
                        newJson += currentChar;
                    }
                    break;
                case ' ':
                case "\n":
                case "\t":
                    if (inString) {
                        newJson += currentChar;
                    }
                    break;
                case '"':
                    if (i > 0 && json.charAt(i - 1) !== '\\') {
                        inString = !inString;
                    }
                    newJson += currentChar;
                    break;
                default:
                    newJson += currentChar;
                    break;
            }
        }

        return newJson;
    }
}

window.customElements.define('demo-show-object', DemoShowObject);