/**
`paper-input-place`

Google Places Autocomplete attached to paper-input.

This release is a Polymer 2.0 hybrid element so it will work in 1.x or 2.0 Polymer applications.

  Basic use:

```html
<paper-input-place api-key="your google api key" value="{{tourstop.place}}" 
  label="Pick a place" hide-error></paper-input-place>
```
The `value` property is an object:

```js
{
  "search": "Guggenheim Museum, 5th Avenue, New York, NY, United States",
  "place_id": "ChIJmZ5emqJYwokRuDz79o0coAQ",
  "latLng": {
    "lat": 40.7829796,
    "lng": -73.95897059999999
  }
}
```
Basic use with validation:

```html
<paper-input-place label="Pick a place" api-key="your google api key" value="{{tourstop.place}}"></paper-input-place>
```

### Styling

The following custom properties and mixins are available for styling:

Custom property | Description | Default
----------------|-------------|----------
`--paper-input-place-icon-mixin`          | Mixin applied to all icons        | `{}`
`--paper-input-place-prefix-icon-mixin`   | Mixin applied to the prefix icon  | `{}`
`--paper-input-place-postfix-icon-mixin`  | Mixin applied to the postfix icon | `{}`

See README.MD for more use examples, styling, api and a link to a live demo page.


@demo demo/index.html

@version 1.9.3
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import {
 html,
 PolymerElement
} from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/iron-jsonp-library/iron-jsonp-library.js';
import '@polymer/iron-icon/iron-icon.js';
import './paper-input-place-icons.js';
import { GestureEventListeners } from '@polymer/polymer/lib/mixins/gesture-event-listeners.js';

class PaperInputPlace extends GestureEventListeners(PolymerElement) {

  static get template() {
    return html `
      <style>
      :host {
        display: inline-block;
      }

      iron-icon {
        @apply --paper-input-place-icon-mixin;
      }

      #prefixicon {
        @apply --paper-input-place-prefix-icon-mixin;
      }

      #postfixicon {
        @apply --paper-input-place-postfix-icon-mixin;
      }

      iron-icon[hidden] {
        display: none !important;
      }

      /* paper-input styling */

      input {
        position: relative;
        /* to make a stacking context */
        outline: none;
        box-shadow: none;
        margin: 0;
        padding: 0;
        width: 100%;
        max-width: 100%;
        background: transparent;
        border: none;
        color: var(--paper-input-container-input-color, var(--primary-text-color));
        -webkit-appearance: none;
        text-align: inherit;
        vertical-align: bottom;

        /* Firefox sets a min-width on the input, which can cause layout issues */
        min-width: 0;

        @apply --paper-font-subhead;
        @apply --paper-input-container-input;
      }

      input:disabled {
        @apply --paper-input-container-input-disabled;
      }

      input::-webkit-outer-spin-button,
      input::-webkit-inner-spin-button {
        @apply --paper-input-container-input-webkit-spinner;
      }

      input::-webkit-clear-button {
        @apply --paper-input-container-input-webkit-clear;
      }

      input::-webkit-calendar-picker-indicator {
        @apply --paper-input-container-input-webkit-calendar-picker-indicator;
      }

      input::-webkit-input-placeholder {
        color: var(--paper-input-container-color, var(--secondary-text-color));
      }

      input:-moz-placeholder {
        color: var(--paper-input-container-color, var(--secondary-text-color));
      }

      input::-moz-placeholder {
        color: var(--paper-input-container-color, var(--secondary-text-color));
      }

      input::-ms-clear {
        @apply --paper-input-container-ms-clear;
      }

      input::-ms-reveal {
        @apply --paper-input-container-ms-reveal;
      }

      input:-ms-input-placeholder {
        color: var(--paper-input-container-color, var(--secondary-text-color));
      }

      label {
        pointer-events: none;
      }
    </style>
    <template is="dom-if" if="[[apiKey]]" restamp="true">
      <!-- 
        NOTE: the GoogleWebComponents collection has not been updated
        to support Polymer 2.0 as of 5/31/2017.  There is no estimated
        date at this time.

        For that reason this control is using iron-jsonp-library to load
        the google maps api instead of <google-maps-api>.  The url string 
        is the same as what would have been issued by the <google-maps-api> so
        even if that control is used elsewhere in your 1.x app, the api will
        not be loaded twice.
        -->
      <iron-jsonp-library id="ijpl" library-url="[[_gmapApiUrl]]" notify-event="map-api-load" on-map-api-load="_mapsApiLoaded"></iron-jsonp-library>
    </template>

    <paper-input-container id="container" disabled\$="[[disabled]]" invalid="[[invalid]]">

      <iron-icon id="prefixicon" hidden\$="[[hideIcon]]" icon="papinpplc:place" slot="prefix"></iron-icon>

      <label hidden\$="[[!label]]" aria-hidden="true" for="pipIronInput" slot="label">[[label]]</label>

      <iron-input bind-value="{{_value}}" slot="input" class="input-element" id="locationsearch" invalid="{{invalid}}">
        <input id="nativeInput" disabled\$="[[disabled]]" inputmode="text" placeholder\$="[[placeholder]]" on-change="_onChange">
      </iron-input>

      <iron-icon id="postfixicon" icon="papinpplc:clear" slot="suffix" on-tap="_clearLocation"></iron-icon>

      <template is="dom-if" if="[[errorMessage]]">
        <paper-input-error aria-live="assertive" slot="add-on">[[errorMessage]]</paper-input-error>
      </template>

    </paper-input-container>`;
  }

  static get properties() {
    return {
      /**
       * Required: A Maps API key. To obtain an API key, see developers.google.com/maps/documentation/javascript/tutorial#api_key.
       */
      apiKey: {
        type: String,
        notify: true
      },
      /**
       * Indicates the Google API is loaded and that Autocomplete suggestions and geocoding functions are available
       */
      apiLoaded: {
        type: Boolean,
        notify: true,
        value: false,
        readOnly: true
      },
      /**
       * Whether to hide the error message
       * If true, the control does not validate that the value is complete (lat/lng, search term, place_id)
       * and has been chosen from the places drop down.
       */
      hideError: {
        type: Boolean,
        value: false
      },
      /**
       * Whether to hide the place icon
       * If true, the control does not show the place icon in the input box.
       */
      hideIcon: {
        type: Boolean,
        value: false
      },
      /**
       * true if the control is disabled
       */
      disabled: {
        type: Boolean,
        notify: true,
        value: false
      },
      /** @private */
      _geocoder: {
        type: Object
      },

      /*
       * region bias options
       */

      /**
       * bias search results to a country code  (ISO 3166-1 Alpha-2 country code, case insensitive).
       */
      searchCountryCode: {
        type: String,
        value: ""
      },
      /**
       * bias search results to a bounding rectangle.
       * object properties (all are required):
       * {
       *    east: number,  // East longitude in degrees.
       *    west: number,  // West longitude in degrees.
       *    north: number, // North latitude in degrees.
       *    south: number, // South latitude in degrees.  
       * }
       * 
       */
      searchBounds: {
        type: Object
      },

      /**
       * bias search results by type
       * permitted values: 
       *   address
       *   geocode
       *   establishment
       *   (regions) 
       *   (cities)
       */
      searchType: {
        type: String,
        value: ""
      },
      /**
       * error message to display if place is invalid (and hideError is false).
       * Default value is "Invalid - please select a place".
       */
      errorMessage: {
        type: String,
        value: "Invalid - please select a place",
        notify: true
      },
      /**
       * True if the entered text is not valid - i.e. not a selected place and not previously geocoded
       */
      invalid: {
        type: Boolean,
        notify: true,
        readOnly: true,
        value: false
      },
      /**
       * Internal representation of invalid, True if the entered text is not valid - i.e. not a selected place and not previously geocoded
       */
      _invalid: {
        type: Boolean,
        value: false
      },
      /**
       * Floating label for paper-input
       * @type {String}
       */
      label: {
        type: String,
        notify: true,
        value: ""
      },
      /**
       * Placeholder for paper-input
       * @type {String}
       */
      placeholder: {
        type: String,
        notify: true,
        value: ""
      },
      /**
       * an object - { lat: number, lng: number } - representing the geolocation of the
       * entered / selected place
       */
      latLng: {
        type: Object,
        notify: true,
        readOnly: true,
        value: function () {
          return {
            lat: 0,
            lng: 0
          }
        }
      },
      /**
       * an viewport object
       */
      viewport: {
	type: Object,
	notify: true,
	readOnly: true,
	value: function () {
	  return {};
	}
      },
      /**
       * An object containing the place selected or geocoded:
       * ```
       *   place_id
       *   formatted_address
       *   latLng { lat: lng: }
       *   search
       *   basic:
       *     name
       *     address
       *     city
       *     state
       *     stateCode
       *     postalCode
       *     country
       *     countryCode
       *     phone
       *   placeDetails: additional properties from the google place result
       *```
       */
      place: {
        type: Object,
        notify: true,
        readOnly: true,
        value: function () {
          return {};
        }
      },
      /** @private */
      _places: {
        type: Object
      },
      /**
       * true if the entry is a required field
       */
      required: {
        type: Boolean,
        notify: true,
        value: false
      },
      /** 
       * Sets the desired language for the input and the autocomplete list.
       * Normally, Google Places Autocomplete defaults to the browser default language.
       * This value allows the language to be set to a desired language regardless of the browser default.
       * 
       * For a list of language codes supported see https://developers.google.com/maps/faq#languagesupport
       * 
       * *** the value should not be modified after the element is loaded ***
       */
      language: {
        type: String,
        value: ""
      },
      /** 
       * If true, the element does not load the drawing, geometry or visualization libraries, slightly
       * reducing overall payload size.
       * 
       * Important: Do not use this option if the page contains other elements that make usef
       * of the Google Maps Javascript API (e.g. google-map).  This can cause the maps API to be loaded
       * more than once generating errors.
       *
       * Do not change this value after the element is loaded
       * 
       */
      minimizeApi: {
        type: Boolean,
        value: false
      },
      /**
       * An object representing the initial or returned value of the control.
       * ```
       * Properties:
       *   search:  string - the search string
       *   place_id:  string - the google maps place_id
       *   latLng:  object {lat: number, lng: number} - latitude/Longitude
       *```
       */
      value: {
        type: Object,
        notify: true,
        observer: '_valueChanged'
      },
      /** @private */
      _value: {
        type: String,
        notify: true,
        value: "",
        observer: '_svalChanged'
      },
      /** 
       * @private
       * The url for the google maps api
       */
      _gmapApiUrl: {
        type: String,
        notify: true,
        computed: '_computeUrl(apiKey,language,minimizeApi)'
      },
      /**
        *provides place as a JSON string to enable returning back to Vaadin 10+
        *  name as displayed in panel and lat long
        * ***
      */
      placeJSON: {
        type: String,
	notify: true,
        value: "not set",
	observer: '_placeJSONChanged'
      }      
    };
  }

  static get observers() {
    return [
      '_searchBiasChanged(searchCountryCode,searchBounds,searchBoundsStrict,searchType)'
    ];
  }

  ready() {
    super.ready();
    var apiElement = this.querySelector('iron-jsonp-library');
    if (apiElement && apiElement.libraryLoaded) {
      this._mapsApiLoaded();
    }
  }

  _computeUrl(akey, lang, minApi) {
    return akey ? ("https://maps.googleapis.com/maps/api/js?callback=%%callback%%&v=3.exp&libraries=" +
      (minApi ? "places" : "drawing,geometry,places,visualization") +
      "&key=" + akey + (lang ? "&language=" + lang : "")) : "";
  }

  _mapsApiLoaded() {
    if (!this._geocoder && !this._places && this.$.locationsearch && this.$.nativeInput) {
      this._geocoder = new google.maps.Geocoder();
      this._places = new google.maps.places.Autocomplete(this.$.nativeInput, {});
      google.maps.event.addListener(this._places, 'place_changed', this._onChangePlace.bind(this));
      this._setApiLoaded(true);
      this._searchBiasChanged();
      this.dispatchEvent(new CustomEvent('api-loaded', {
        detail: {
          text: 'Google api is ready'
        }
      }));
    }
  }

  /**
   * observer for changes to search bias
   */
  _searchBiasChanged(searchCountryCode, searchBounds, searchBoundsStrict, searchType) {
    if (this.apiLoaded) {

      if (this.searchBounds &&
        this.searchBounds.hasOwnProperty('east') &&
        this.searchBounds.hasOwnProperty('west') &&
        this.searchBounds.hasOwnProperty('north') &&
        this.searchBounds.hasOwnProperty('south')
      ) {
        this._places.setBounds(this.searchBounds);
      } else {
        this._places.setBounds();
      }
      if (this.searchCountryCode && this.searchCountryCode.length == 2) {
        this._places.setComponentRestrictions({
          country: this.searchCountryCode.toString()
        });
      } else {
        this._places.setComponentRestrictions();
      }
      if (this.searchType && ['address', 'geocode', 'establishment', '(regions)', '(cities)'].includes(this.searchType)) {
        this._places.setTypes([this.searchType.toString()]);
      } else {
        this._places.setTypes([]);
      }
    }
  }

  _valueChanged(newValue, oldValue) {
    // update the search term and the invalid flag if the value is being set for the first time,
    // or if the value has changed and is not the same as the search term
    if (!oldValue || (newValue.search !== oldValue.search || newValue.search !== this._value)) {
      this._value = newValue && newValue.search ? newValue.search : "";
      this._invalid = !newValue || !(newValue.place_id && newValue.latLng && newValue.latLng.lat && newValue.latLng
        .lng);
      if (!this.hideError) {
        this._setInvalid(this.required ? this._invalid : this._invalid && (newValue && newValue.search));
      }
    }
  }

  _svalChanged(newValue, oldValue) {
    // reset the invalid property if the user has typed in the input field

    // if the newValue matches the selected place, which could happen if
    // the user types after selecting a place, then deletes the typing
    if (newValue && this.place && this.place.search && newValue == this.place.search) {
      this.value = {
        place_id: this.place.place_id,
        search: newValue,
        latLng: {
          lat: this.place.latLng.lat,
          lng: this.place.latLng.lng
        }
      };
      this._invalid = false;
      this._setInvalid(false);
      return;
    }
    // if blank and not a required input
    if (!newValue && !this.required) {
      this.value = {
        place_id: "",
        search: "",
        latLng: {
          lat: 0,
          lng: 0
        }
      };
      this._setPlace({});
      this._invalid = true;
      if (!this.hideError) {
        this._setInvalid(false);
      }
      return;
    }
    // if the new _value matches the value.search, which could happen if
    // the value is changed externally (possibly through data binding) which
    // causes _value to be changed triggering this function _svalChanged()
    if (newValue && this.value && this.value.search && newValue == this.value.search) {
      // nothing has really changed, just return
      return;
    }
    // if the existing value is blank, and the new value is not
    if ((!this.value || !this.value.search) && newValue) {
      this.value = {
        place_id: "",
        search: newValue,
        latLng: {
          lat: 0,
          lng: 0
        }
      };
      this._setPlace({});
      this._invalid = true;
      if (!this.hideError) {
        this._setInvalid(true);
      }
      return;
    }
    // otherwise, the value is invalid
    this.value = {
      place_id: "",
      search: newValue,
      latLng: {
        lat: 0,
        lng: 0
      }
    };
    this._setPlace({});
    this._invalid = true;
    if (!this.hideError) {
      this._setInvalid(true);
    }
    return;

  }

  _clearLocation(e) {
    this._value = "";
  }

  /**
   * Geocodes an address
   * @param  {string} address address to be geocoded
   * @param  {object} options Optional - Geocoder Request options
   * @return {Promise<place>}         A promise for a place object or a status on failure
   */
  geocode(address, options) {
    return new Promise((resolve, reject) => {
      if (!this._geocoder) {
        reject('Geocoder not ready.');
      } else {
        var opts = options ? options : {};
        opts.address = address ? address : "";
        this._geocoder.geocode(opts, (results, status) => {
          if (status == google.maps.GeocoderStatus.OK && results && results[0]) {
            var p = this._extractPlaceInfo(results[0], opts.address);
            resolve(p);
          } else {
            reject(status);
          }
        });
      }
    });
  }

  /**
   * Reverse Geocodes a latLng
   * @param  {object} latlng latitude/Longitude {lat: , lng: } to be reverse geocoded
   * @param  {object} options Optional - Geocoder Request options
   * @return {Promise<place>}         A promise for a place object or a status on failure
   */
  reverseGeocode(latlng, options) {
    return new Promise((resolve, reject) => {
      if (!this._geocoder) {
        reject('Geocoder not ready.');
      } else {
        var opts = options ? options : {};
        if (latlng) {
          opts.location = latlng;
        }
        this._geocoder.geocode(opts, (results, status) => {
          if (status == google.maps.GeocoderStatus.OK && results && results[0]) {
            var p = this._extractPlaceInfo(results[0], "");
            resolve(p);
          } else {
            reject(status);
          }
        });
      }
    });
  }

  _onChangePlace(e) {
    var pl = this._places.getPlace();
    if (pl.geometry) {
      var p = this._extractPlaceInfo(pl, this.$.nativeInput.value);
      this._setPlace(p);
      this._invalid = false;
      this._setInvalid(false);
      this._setLatLng({
        lat: p.latLng.lat,
        lng: p.latLng.lng
      });
      this._setViewport(p.viewport);
      this._value = this.$.nativeInput.value;
      this.value = {
        search: this.$.nativeInput.value,
        place_id: p.place_id,
        latLng: {
          lat: p.latLng.lat,
          lng: p.latLng.lng
        }
      };
      this.placeJSON="{\"address\": "+JSON.stringify(p.basic || "")+", \"place\": {\"name\":\""+p.search+"\",\"latLng\": {\"lat\":"+p.latLng.lat+",\"long\":"+p.latLng.lng+"},\"viewport\": {\"northeast\": {\"lat\":"+p.viewport.getNorthEast().lat()+",\"long\":"+p.viewport.getNorthEast().lng()+"},\"southwest\": {\"lat\":"+p.viewport.getSouthWest().lat()+",\"long\":"+p.viewport.getSouthWest().lng()+"}}}}";
      this.dispatchEvent(new CustomEvent('change-complete', {
        detail: {
          text: this.value.search
        }
      }));
      this.placeName=this._value.place_id;
    }
  }

  _placeJSONChanged(event) {
    if (event != 'not set') {
      this.dispatchEvent(new CustomEvent('change-placejson-complete', {
        detail: {
          placeJSON: this.placeJSON
        }
      }));
    }
    this.placeJSON = "not set";
  }

  /**
   * extracts and simplifies a google place result
   * @param  PlaceResult pl google place result
   * @return place
   */
  _extractPlaceInfo(pl, searchTerm) {

    var p = {
      place_id: pl.place_id,
      formatted_address: pl.formatted_address,
      search: searchTerm ? searchTerm : pl.formatted_address,
      latLng: {
        lat: pl.geometry.location.lat(),
        lng: pl.geometry.location.lng()
      },
      viewport: pl.geometry.viewport,
      basic: {
        name: pl.name || "",
        address: "",
        city: "",
        state: "",
        stateCode: "",
        postalCode: "",
        country: "",
        countryCode: "",
        phone: pl.formatted_phone_number || ""
      },
      placeDetails: {
        address_components: [],
        icon: pl.icon,
        international_phone_number: pl.international_phone_number || "",
        permanently_closed: pl.permanently_closed || false,
        types: pl.types ? JSON.parse(JSON.stringify(pl.types)) : [],
        website: pl.website || "",
        url: pl.url || "",
        utc_offset_minutes: pl.utc_offset_minutes
      }
    };
    // extract address components
    var address = {
      street_number: "",
      route: ""
    };
    for (var i = 0; i < pl.address_components.length; i++) {
      p.placeDetails.address_components.push(JSON.parse(JSON.stringify(pl.address_components[i])));
      switch (pl.address_components[i].types[0]) {
        case "locality":
          p.basic["city"] = pl.address_components[i].long_name;
          break;
        case "administrative_area_level_1":
          p.basic["stateCode"] = pl.address_components[i].short_name;
          p.basic["state"] = pl.address_components[i].long_name;
          break;
        case "country":
          p.basic["country"] = pl.address_components[i].long_name;
          p.basic["countryCode"] = pl.address_components[i].short_name;
          break;
        case "postal_code":
          p.basic["postalCode"] = pl.address_components[i].long_name;
          break;
        case "street_number":
          address.street_number = pl.address_components[i].short_name;
          p.basic.address = address.street_number + " " + address.route;
          p.basic.streetNumber = address.street_number;
          break;
        case "route":
          address.route = pl.address_components[i].long_name;
          p.basic.address = address.street_number + " " + address.route;
          p.basic.route = address.route;
          break;
        default:
          address[pl.address_components[i].types[0]] = pl.address_components[i].long_name;
      }
    }

    return p;

  }

  /**
   * Updates the current place, value and latLng with the place provided
   * @param  IpipPlace newPlace the new place
   */
  putPlace(newPlace) {
    if (newPlace && newPlace.place_id && newPlace.latLng) {
      this._setPlace(JSON.parse(JSON.stringify(newPlace)));
      this._setLatLng({
        lat: newPlace.latLng.lat,
        lng: newPlace.latLng.lng
      });
      this._setViewport(newPlace.geometry.viewport);
      this.value = {
        place_id: newPlace.place_id,
        search: newPlace.search,
        latLng: {
          lat: newPlace.latLng.lat,
          lng: newPlace.latLng.lng
        }
      };
      this._value = newPlace.search;
    }
  }

  fillValue(valueToFill)
  {
    //alert("fillvalue:"+valueToFill);
    this.geocode(valueToFill).then(
    function(result) {
      // set the control to this place
      this.putPlace(result);
    }.bind(this),
    function(status) {
      // do something with status - the reason the geocode did not work
      //  alert("The GeoCoding API failed - Status failure:"+status)
    }.bind(this));
  }	

  /**
   * sets the focus to the input field
   */
  focus() {
    this.$.nativeInput.focus();
  }

  _onChange(event) {
    // In the Shadow DOM, the `change` event is not leaked into the
    // ancestor tree, so we must do this manually.
    // See https://w3c.github.io/webcomponents/spec/shadow/#events-that-are-not-leaked-into-ancestor-trees.
    if (this.shadowRoot) {
      this.dispatchEvent(new CustomEvent('input-change', {
        bubbles: true,
        cancelable: event.cancelable,
        detail: {
          text: this.$.nativeInput.value
        }
      }));
    }
  };
  /**
  Fired when the google maps api has loaded.

  The api is now available to provide
  geocoding and place suggestions.

  @event api-loaded
  */
}

window.customElements.define('paper-input-place', PaperInputPlace);
