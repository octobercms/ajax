/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/core/controller.js":
/*!********************************!*\
  !*** ./src/core/controller.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Controller": () => (/* binding */ Controller)
/* harmony export */ });
/* harmony import */ var _util_events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../util/events */ "./src/util/events.js");
/* harmony import */ var _request_builder__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./request-builder */ "./src/core/request-builder.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }



var Controller = /*#__PURE__*/function () {
  function Controller() {
    _classCallCheck(this, Controller);

    this.started = false;
    this.documentVisible = true;
  }

  _createClass(Controller, [{
    key: "start",
    value: function start() {
      var _this = this;

      if (!this.started) {
        // Track unload event for request lib
        window.onbeforeunload = this.documentOnBeforeUnload; // First page load

        addEventListener('DOMContentLoaded', function () {
          return _this.render();
        }); // Again, after new scripts load

        addEventListener('page:updated', function () {
          return _this.render();
        }); // Again after AJAX request

        addEventListener('ajax:update-complete', function () {
          return _this.render();
        }); // Watching document visibility

        addEventListener('visibilitychange', function () {
          return _this.documentOnVisibilityChange();
        }); // Submit form

        _util_events__WEBPACK_IMPORTED_MODULE_0__.Events.on(document, 'submit', '[data-request]', this.documentOnSubmit); // Track input

        _util_events__WEBPACK_IMPORTED_MODULE_0__.Events.on(document, 'input', 'input[data-request][data-track-input]', this.documentOnKeyup); // Change select, checkbox, radio, file input

        _util_events__WEBPACK_IMPORTED_MODULE_0__.Events.on(document, 'change', 'select[data-request], input[type=radio][data-request], input[type=checkbox][data-request], input[type=file][data-request]', this.documentOnChange); // Press enter on orphan input

        _util_events__WEBPACK_IMPORTED_MODULE_0__.Events.on(document, 'keydown', 'input[type=text][data-request], input[type=submit][data-request], input[type=password][data-request]', this.documentOnKeydown); // Click submit button or link

        _util_events__WEBPACK_IMPORTED_MODULE_0__.Events.on(document, 'click', 'a[data-request], button[data-request], input[type=button][data-request], input[type=submit][data-request]', this.documentOnClick);
        this.started = true;
      }
    }
  }, {
    key: "stop",
    value: function stop() {
      if (this.started) {
        this.started = false;
      }
    }
  }, {
    key: "render",
    value: function render(event) {
      // Pre render event, used to move nodes around
      _util_events__WEBPACK_IMPORTED_MODULE_0__.Events.dispatch('before-render'); // Render event, used to initialize controls

      _util_events__WEBPACK_IMPORTED_MODULE_0__.Events.dispatch('render'); // Resize event to adjust all measurements

      dispatchEvent(new Event('resize'));
      this.documentOnRender(event);
    }
  }, {
    key: "documentOnVisibilityChange",
    value: function documentOnVisibilityChange(event) {
      this.documentVisible = !document.hidden;

      if (this.documentVisible) {
        this.documentOnRender();
      }
    }
  }, {
    key: "documentOnRender",
    value: function documentOnRender(event) {
      if (!this.documentVisible) {
        return;
      }

      document.querySelectorAll('[data-auto-submit]').forEach(function (el) {
        var interval = el.dataset.autoSubmit || 0;
        el.removeAttribute('data-auto-submit');
        setTimeout(function () {
          _request_builder__WEBPACK_IMPORTED_MODULE_1__.RequestBuilder.fromElement(el);
        }, interval);
      });
    }
  }, {
    key: "documentOnSubmit",
    value: function documentOnSubmit(event) {
      event.preventDefault();
      _request_builder__WEBPACK_IMPORTED_MODULE_1__.RequestBuilder.fromElement(event.target);
    }
  }, {
    key: "documentOnClick",
    value: function documentOnClick(event) {
      event.preventDefault();
      _request_builder__WEBPACK_IMPORTED_MODULE_1__.RequestBuilder.fromElement(event.target);
    }
  }, {
    key: "documentOnChange",
    value: function documentOnChange(event) {
      _request_builder__WEBPACK_IMPORTED_MODULE_1__.RequestBuilder.fromElement(event.target);
    }
  }, {
    key: "documentOnKeyup",
    value: function documentOnKeyup(event) {
      var el = event.target,
          lastValue = el.dataset.ocLastValue;

      if (['email', 'number', 'password', 'search', 'text'].indexOf(el.type) === -1) {
        return;
      }

      if (lastValue !== undefined && lastValue == el.value) {
        return;
      }

      el.dataset.ocLastValue = el.value;

      if (this.dataTrackInputTimer !== undefined) {
        clearTimeout(this.dataTrackInputTimer);
      }

      var interval = el.getAttribute('data-track-input');

      if (!interval) {
        interval = 300;
      }

      var self = this;
      this.dataTrackInputTimer = setTimeout(function () {
        if (self.lastDataTrackInputRequest) {
          self.lastDataTrackInputRequest.abort();
        }

        self.lastDataTrackInputRequest = _request_builder__WEBPACK_IMPORTED_MODULE_1__.RequestBuilder.fromElement(el);
      }, interval);
    }
  }, {
    key: "documentOnKeydown",
    value: function documentOnKeydown(event) {
      if (event.key === 'Enter') {
        event.preventDefault();

        if (this.dataTrackInputTimer !== undefined) {
          clearTimeout(this.dataTrackInputTimer);
        }

        _request_builder__WEBPACK_IMPORTED_MODULE_1__.RequestBuilder.fromElement(event.target);
      }
    }
  }, {
    key: "documentOnBeforeUnload",
    value: function documentOnBeforeUnload(event) {
      window.ocUnloading = true;
    }
  }]);

  return Controller;
}();

/***/ }),

/***/ "./src/core/index.js":
/*!***************************!*\
  !*** ./src/core/index.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _util_events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../util/events */ "./src/util/events.js");
/* harmony import */ var _namespace__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./namespace */ "./src/core/namespace.js");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_namespace__WEBPACK_IMPORTED_MODULE_1__["default"]);

if (!window.oc) {
  window.oc = {};
}

if (!window.oc.AjaxFramework) {
  // Namespace
  window.oc.AjaxFramework = _namespace__WEBPACK_IMPORTED_MODULE_1__["default"]; // Request on element with builder

  window.oc.request = _namespace__WEBPACK_IMPORTED_MODULE_1__["default"].requestElement; // JSON parser

  window.oc.parseJSON = _namespace__WEBPACK_IMPORTED_MODULE_1__["default"].parseJSON; // Form serializer

  window.oc.serializeJSON = _namespace__WEBPACK_IMPORTED_MODULE_1__["default"].serializeJSON; // Selector events

  window.oc.Events = _util_events__WEBPACK_IMPORTED_MODULE_0__.Events; // Boot controller

  if (!isAMD() && !isCommonJS()) {
    _namespace__WEBPACK_IMPORTED_MODULE_1__["default"].start();
  }
}

function isAMD() {
  return typeof define == "function" && __webpack_require__.amdO;
}

function isCommonJS() {
  return (typeof exports === "undefined" ? "undefined" : _typeof(exports)) == "object" && "object" != "undefined";
}

/***/ }),

/***/ "./src/core/migrate.js":
/*!*****************************!*\
  !*** ./src/core/migrate.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Migrate": () => (/* binding */ Migrate)
/* harmony export */ });
/* harmony import */ var _core_request_builder__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core/request-builder */ "./src/core/request-builder.js");
/* harmony import */ var _util_json_parser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../util/json-parser */ "./src/util/json-parser.js");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }



var Migrate = /*#__PURE__*/function () {
  function Migrate() {
    _classCallCheck(this, Migrate);
  }

  _createClass(Migrate, [{
    key: "bind",
    value: function bind() {
      this.bindRequestFunc();
      this.bindRenderFunc();
      this.bindjQueryEvents();
    }
  }, {
    key: "bindRequestFunc",
    value: function bindRequestFunc() {
      var old = $.fn.request;

      $.fn.request = function (handler, option) {
        var options = _typeof(option) === 'object' ? option : {};
        return new _core_request_builder__WEBPACK_IMPORTED_MODULE_0__.RequestBuilder(this.get(0), handler, options);
      };

      $.fn.request.Constructor = _core_request_builder__WEBPACK_IMPORTED_MODULE_0__.RequestBuilder; // Basic function

      $.request = function (handler, option) {
        return $(document).request(handler, option);
      }; // No conflict


      $.fn.request.noConflict = function () {
        $.fn.request = old;
        return this;
      };
    }
  }, {
    key: "bindRenderFunc",
    value: function bindRenderFunc() {
      $.fn.render = function (callback) {
        $(document).on('render', callback);
      };
    }
  }, {
    key: "bindjQueryEvents",
    value: function bindjQueryEvents() {
      // Element
      this.migratejQueryEvent(document, 'ajax:setup', 'ajaxSetup', ['context']);
      this.migratejQueryEvent(document, 'ajax:promise', 'ajaxPromise', ['context']);
      this.migratejQueryEvent(document, 'ajax:fail', 'ajaxFail', ['context', 'data', 'responseCode', 'xhr']);
      this.migratejQueryEvent(document, 'ajax:done', 'ajaxDone', ['context', 'data', 'responseCode', 'xhr']);
      this.migratejQueryEvent(document, 'ajax:always', 'ajaxAlways', ['context', 'data', 'responseCode', 'xhr']);
      this.migratejQueryEvent(document, 'ajax:before-redirect', 'ajaxRedirect'); // Updated Element

      this.migratejQueryEvent(document, 'ajax:update', 'ajaxUpdate', ['context', 'data', 'responseCode', 'xhr']);
      this.migratejQueryEvent(document, 'ajax:before-replace', 'ajaxBeforeReplace'); // Trigger Element

      this.migratejQueryEvent(document, 'ajax:before-request', 'oc.beforeRequest', ['context']);
      this.migratejQueryEvent(document, 'ajax:before-update', 'ajaxBeforeUpdate', ['context', 'data', 'responseCode', 'xhr']);
      this.migratejQueryEvent(document, 'ajax:request-success', 'ajaxSuccess', ['context', 'data', 'responseCode', 'xhr']);
      this.migratejQueryEvent(document, 'ajax:request-complete', 'ajaxComplete', ['context', 'data', 'responseCode', 'xhr']);
      this.migratejQueryEvent(document, 'ajax:request-error', 'ajaxError', ['context', 'message', 'responseCode', 'xhr']);
      this.migratejQueryEvent(document, 'ajax:before-validate', 'ajaxValidation', ['context', 'message', 'fields']); // Window

      this.migratejQueryEvent(window, 'ajax:before-send', 'ajaxBeforeSend', ['context']);
      this.migratejQueryEvent(window, 'ajax:update-complete', 'ajaxUpdateComplete', ['context', 'data', 'responseCode', 'xhr']);
      this.migratejQueryEvent(window, 'ajax:invalid-field', 'ajaxInvalidField', ['element', 'fieldName', 'errorMsg', 'isFirst']);
      this.migratejQueryEvent(window, 'ajax:confirm-message', 'ajaxConfirmMessage', ['message', 'promise']);
      this.migratejQueryEvent(window, 'ajax:error-message', 'ajaxErrorMessage', ['message']); // Data adapter

      this.migratejQueryAttachData(document, 'ajax:setup', 'a[data-request], button[data-request], form[data-request], a[data-handler], button[data-handler]');
    } // Private

  }, {
    key: "migratejQueryEvent",
    value: function migratejQueryEvent(target, jsName, jqName) {
      var detailNames = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
      var self = this;
      $(target).on(jsName, function (ev) {
        self.triggerjQueryEvent(ev.originalEvent, jqName, detailNames);
      });
    }
  }, {
    key: "triggerjQueryEvent",
    value: function triggerjQueryEvent(ev, eventName) {
      var detailNames = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
      var jQueryEvent = $.Event(eventName),
          args = this.buildDetailArgs(ev, detailNames);
      $(ev.target).trigger(jQueryEvent, args);

      if (jQueryEvent.isDefaultPrevented()) {
        ev.preventDefault();
      }
    }
  }, {
    key: "buildDetailArgs",
    value: function buildDetailArgs(ev, detailNames) {
      var args = [];
      detailNames.forEach(function (name) {
        args.push(ev.detail[name]);
      });
      return args;
    } // For instances where data() is populated in the jQ instance

  }, {
    key: "migratejQueryAttachData",
    value: function migratejQueryAttachData(target, eventName, selector) {
      $(target).on(eventName, selector, function (event) {
        var dataObj = $(this).data('request-data');

        if (!dataObj) {
          return;
        }

        var options = event.detail.context.options;

        if (dataObj.constructor === {}.constructor) {
          Object.assign(options.data, dataObj);
        } else if (typeof dataObj === 'string') {
          Object.assign(options.data, _util_json_parser__WEBPACK_IMPORTED_MODULE_1__.JsonParser.paramToObj('request-data', dataObj));
        }
      });
    }
  }]);

  return Migrate;
}();

/***/ }),

/***/ "./src/core/namespace.js":
/*!*******************************!*\
  !*** ./src/core/namespace.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _controller__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./controller */ "./src/core/controller.js");
/* harmony import */ var _migrate__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./migrate */ "./src/core/migrate.js");
/* harmony import */ var _request_builder__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./request-builder */ "./src/core/request-builder.js");
/* harmony import */ var _util_json_parser__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../util/json-parser */ "./src/util/json-parser.js");
/* harmony import */ var _util_form_serializer__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../util/form-serializer */ "./src/util/form-serializer.js");





var controller = new _controller__WEBPACK_IMPORTED_MODULE_0__.Controller();
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  controller: controller,
  parseJSON: _util_json_parser__WEBPACK_IMPORTED_MODULE_3__.JsonParser.parseJSON,
  serializeJSON: _util_form_serializer__WEBPACK_IMPORTED_MODULE_4__.FormSerializer.serializeJSON,
  requestElement: _request_builder__WEBPACK_IMPORTED_MODULE_2__.RequestBuilder.fromElement,
  start: function start() {
    controller.start();

    if (window.jQuery) {
      new _migrate__WEBPACK_IMPORTED_MODULE_1__.Migrate().bind();
    }
  },
  stop: function stop() {
    controller.stop();
  }
});

/***/ }),

/***/ "./src/core/request-builder.js":
/*!*************************************!*\
  !*** ./src/core/request-builder.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RequestBuilder": () => (/* binding */ RequestBuilder)
/* harmony export */ });
/* harmony import */ var _request_namespace__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../request/namespace */ "./src/request/namespace.js");
/* harmony import */ var _util_json_parser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../util/json-parser */ "./src/util/json-parser.js");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }



var RequestBuilder = /*#__PURE__*/function () {
  function RequestBuilder(element, handler, options) {
    _classCallCheck(this, RequestBuilder);

    this.options = options || {};
    this.ogElement = element;
    this.element = this.findElement(element);

    if (!this.element) {
      return _request_namespace__WEBPACK_IMPORTED_MODULE_0__["default"].send(handler, this.options);
    }

    this.assignAsEval('beforeUpdateFunc', 'requestBeforeUpdate');
    this.assignAsEval('afterUpdateFunc', 'requestAfterUpdate');
    this.assignAsEval('successFunc', 'requestSuccess');
    this.assignAsEval('errorFunc', 'requestError');
    this.assignAsEval('completeFunc', 'requestComplete');
    this.assignAsData('progressBar', 'requestProgressBar');
    this.assignAsData('confirm', 'requestConfirm');
    this.assignAsData('redirect', 'requestRedirect');
    this.assignAsData('loading', 'requestLoading');
    this.assignAsData('form', 'requestForm');
    this.assignAsData('url', 'requestUrl');
    this.assignAsData('bulk', 'requestBulk', {
      emptyAsTrue: true
    });
    this.assignAsData('files', 'requestFiles', {
      emptyAsTrue: true
    });
    this.assignAsData('flash', 'requestFlash', {
      emptyAsTrue: true
    });
    this.assignAsData('download', 'requestDownload', {
      emptyAsTrue: true
    });
    this.assignAsData('update', 'requestUpdate', {
      parseJson: true
    });
    this.assignAsData('query', 'requestQuery', {
      parseJson: true
    });
    this.assignAsData('browserTarget', 'browserTarget');
    this.assignAsData('browserValidate', 'browserValidate', {
      emptyAsTrue: true
    });
    this.assignAsMetaData('update', 'ajaxRequestUpdate', {
      parseJson: true,
      mergeValue: true
    });
    this.assignRequestData();

    if (!handler) {
      handler = this.getHandlerName();
    }

    return _request_namespace__WEBPACK_IMPORTED_MODULE_0__["default"].sendElement(this.element, handler, this.options);
  }

  _createClass(RequestBuilder, [{
    key: "findElement",
    value: // Event target may some random node inside the data-request container
    // so it should bubble up but also capture the ogElement in case it is
    // a button that contains data-request-data.
    function findElement(element) {
      if (!element || element === document) {
        return null;
      }

      if (element.matches('[data-request]')) {
        return element;
      }

      var parentEl = element.closest('[data-request]');

      if (parentEl) {
        return parentEl;
      }

      return element;
    }
  }, {
    key: "getHandlerName",
    value: function getHandlerName() {
      if (this.element.dataset.dataRequest) {
        return this.element.dataset.dataRequest;
      }

      return this.element.getAttribute('data-request');
    }
  }, {
    key: "assignAsEval",
    value: function assignAsEval(optionName, name) {
      if (this.options[optionName] !== undefined) {
        return;
      }

      var attrVal;

      if (this.element.dataset[name]) {
        attrVal = this.element.dataset[name];
      } else {
        attrVal = this.element.getAttribute('data-' + normalizeDataKey(name));
      }

      if (!attrVal) {
        return;
      }

      this.options[optionName] = function (element, data) {
        return new Function('data', attrVal).apply(element, [data]);
      };
    }
  }, {
    key: "assignAsData",
    value: function assignAsData(optionName, name) {
      var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
          _ref$parseJson = _ref.parseJson,
          parseJson = _ref$parseJson === void 0 ? false : _ref$parseJson,
          _ref$emptyAsTrue = _ref.emptyAsTrue,
          emptyAsTrue = _ref$emptyAsTrue === void 0 ? false : _ref$emptyAsTrue;

      if (this.options[optionName] !== undefined) {
        return;
      }

      var attrVal;

      if (this.element.dataset[name]) {
        attrVal = this.element.dataset[name];
      } else {
        attrVal = this.element.getAttribute('data-' + normalizeDataKey(name));
      }

      if (attrVal === null) {
        return;
      }

      if (parseJson) {
        this.options[optionName] = _util_json_parser__WEBPACK_IMPORTED_MODULE_1__.JsonParser.paramToObj('data-' + normalizeDataKey(name), attrVal);
      } else {
        this.options[optionName] = this.castAttrToOption(attrVal, emptyAsTrue);
      }
    }
  }, {
    key: "assignAsMetaData",
    value: function assignAsMetaData(optionName, name) {
      var _ref2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
          _ref2$mergeValue = _ref2.mergeValue,
          mergeValue = _ref2$mergeValue === void 0 ? true : _ref2$mergeValue,
          _ref2$parseJson = _ref2.parseJson,
          parseJson = _ref2$parseJson === void 0 ? false : _ref2$parseJson,
          _ref2$emptyAsTrue = _ref2.emptyAsTrue,
          emptyAsTrue = _ref2$emptyAsTrue === void 0 ? false : _ref2$emptyAsTrue;

      var meta = document.documentElement.querySelector('head meta[name="' + normalizeDataKey(name) + '"]');

      if (!meta) {
        return;
      }

      var attrVal = meta.getAttribute('content');

      if (parseJson) {
        attrVal = _util_json_parser__WEBPACK_IMPORTED_MODULE_1__.JsonParser.paramToObj(normalizeDataKey(name), attrVal);
      } else {
        attrVal = this.castAttrToOption(attrVal, emptyAsTrue);
      }

      if (mergeValue) {
        this.options[optionName] = _objectSpread(_objectSpread({}, this.options[optionName] || {}), attrVal);
      } else {
        this.options[optionName] = attrVal;
      }
    }
  }, {
    key: "castAttrToOption",
    value: function castAttrToOption(val, emptyAsTrue) {
      if (emptyAsTrue && val === '') {
        return true;
      }

      if (val === 'true' || val === '1') {
        return true;
      }

      if (val === 'false' || val === '0') {
        return false;
      }

      return val;
    }
  }, {
    key: "assignRequestData",
    value: function assignRequestData() {
      var data = {};

      if (this.options.data) {
        Object.assign(data, this.options.data);
      }

      var attr = this.ogElement.getAttribute('data-request-data');

      if (attr) {
        Object.assign(data, _util_json_parser__WEBPACK_IMPORTED_MODULE_1__.JsonParser.paramToObj('data-request-data', attr));
      }

      elementParents(this.ogElement, '[data-request-data]').reverse().forEach(function (el) {
        Object.assign(data, _util_json_parser__WEBPACK_IMPORTED_MODULE_1__.JsonParser.paramToObj('data-request-data', el.getAttribute('data-request-data')));
      });
      this.options.data = data;
    }
  }], [{
    key: "fromElement",
    value: function fromElement(element, handler, options) {
      if (typeof element === 'string') {
        element = document.querySelector(element);
      }

      return new RequestBuilder(element, handler, options);
    }
  }]);

  return RequestBuilder;
}();

function elementParents(element, selector) {
  var parents = [];

  if (!element.parentNode) {
    return parents;
  }

  var ancestor = element.parentNode.closest(selector);

  while (ancestor) {
    parents.push(ancestor);
    ancestor = ancestor.parentNode.closest(selector);
  }

  return parents;
}

function normalizeDataKey(key) {
  return key.replace(/[A-Z]/g, function (chr) {
    return "-".concat(chr.toLowerCase());
  });
}

/***/ }),

/***/ "./src/extras/attach-loader.js":
/*!*************************************!*\
  !*** ./src/extras/attach-loader.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AttachLoader": () => (/* binding */ AttachLoader)
/* harmony export */ });
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../util */ "./src/util/index.js");
var _templateObject;

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }


var AttachLoader = /*#__PURE__*/function () {
  function AttachLoader() {
    _classCallCheck(this, AttachLoader);

    this.stylesheetElement = this.createStylesheetElement();
  }

  _createClass(AttachLoader, [{
    key: "show",
    value: // Public
    function show(el) {
      this.installStylesheetElement();

      if (isElementInput(el)) {
        var loadEl = document.createElement('span');
        loadEl.className = 'oc-attach-loader is-inline';
        el.parentNode.insertBefore(loadEl, el.nextSibling); // insertAfter
      } else {
        el.classList.add('oc-attach-loader');
        el.disabled = true;
      }
    }
  }, {
    key: "hide",
    value: function hide(el) {
      if (isElementInput(el)) {
        if (el.nextSibling.classList.contains('oc-attach-loader')) {
          el.nextSibling.remove();
        }
      } else {
        el.classList.remove('oc-attach-loader');
        el.disabled = false;
      }
    }
  }, {
    key: "showForm",
    value: function showForm(el) {
      if (el.dataset.attachLoading !== undefined) {
        this.show(el);
      }

      if (el.matches('form')) {
        var self = this;
        el.querySelectorAll('[data-attach-loading]').forEach(function (otherEl) {
          if (!isElementInput(otherEl)) {
            self.show(otherEl);
          }
        });
      }
    }
  }, {
    key: "hideForm",
    value: function hideForm(el) {
      if (el.dataset.attachLoading !== undefined) {
        this.hide(el);
      }

      if (el.matches('form')) {
        var self = this;
        el.querySelectorAll('[data-attach-loading]').forEach(function (otherEl) {
          if (!isElementInput(otherEl)) {
            self.hide(otherEl);
          }
        });
      }
    } // Private

  }, {
    key: "installStylesheetElement",
    value: function installStylesheetElement() {
      if (!AttachLoader.stylesheetReady) {
        document.head.insertBefore(this.stylesheetElement, document.head.firstChild);
        AttachLoader.stylesheetReady = true;
      }
    }
  }, {
    key: "createStylesheetElement",
    value: function createStylesheetElement() {
      var element = document.createElement('style');
      element.textContent = AttachLoader.defaultCSS;
      return element;
    }
  }], [{
    key: "defaultCSS",
    get: function get() {
      return (0,_util__WEBPACK_IMPORTED_MODULE_0__.unindent)(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n        .oc-attach-loader:after {\n            content: '';\n            display: inline-block;\n            vertical-align: middle;\n            margin-left: .4em;\n            height: 1em;\n            width: 1em;\n            animation: oc-rotate-loader 0.8s infinite linear;\n            border: .2em solid currentColor;\n            border-right-color: transparent;\n            border-radius: 50%;\n            opacity: .5;\n        }\n\n        @keyframes oc-rotate-loader {\n            0%    { transform: rotate(0deg); }\n            100%  { transform: rotate(360deg); }\n        }\n    "])));
    }
  }, {
    key: "attachLoader",
    get: function get() {
      return {
        show: function show(el) {
          new AttachLoader().show(resolveElement(el));
        },
        hide: function hide(el) {
          new AttachLoader().hide(resolveElement(el));
        }
      };
    }
  }]);

  return AttachLoader;
}();

_defineProperty(AttachLoader, "stylesheetReady", false);

function isElementInput(el) {
  return ['input', 'select', 'textarea'].includes((el.tagName || '').toLowerCase());
}

function resolveElement(el) {
  if (typeof el === 'string') {
    el = document.querySelector(el);
  }

  if (!el) {
    throw new Error("Invalid element for attach loader.");
  }

  return el;
}

/***/ }),

/***/ "./src/extras/controller.js":
/*!**********************************!*\
  !*** ./src/extras/controller.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Controller": () => (/* binding */ Controller)
/* harmony export */ });
/* harmony import */ var _validator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./validator */ "./src/extras/validator.js");
/* harmony import */ var _attach_loader__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./attach-loader */ "./src/extras/attach-loader.js");
/* harmony import */ var _flash_message__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./flash-message */ "./src/extras/flash-message.js");
/* harmony import */ var _util_events__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../util/events */ "./src/util/events.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }





var Controller = /*#__PURE__*/function () {
  function Controller() {
    _classCallCheck(this, Controller);

    this.started = false; // Progress bar default value

    this.enableProgressBar = function (event) {
      var options = event.detail.context.options;

      if (options.progressBar === null) {
        options.progressBar = true;
      }
    }; // Attach loader


    this.showAttachLoader = function (event) {
      this.attachLoader.showForm(event.target);
    }.bind(this);

    this.hideAttachLoader = function (event) {
      this.attachLoader.hideForm(event.target);
    }.bind(this); // Validator


    this.validatorSubmit = function (event) {
      this.validator.submit(event.target);
    }.bind(this);

    this.validatorValidate = function (event) {
      this.validator.validate(event.target, event.detail.fields, event.detail.message, shouldShowFlashMessage(event.detail.context.options.flash, 'validate'));
    }.bind(this); // Flash message


    this.flashMessageBind = function (event) {
      var options = event.detail.context.options;
      var self = this;

      if (options.flash) {
        options.handleErrorMessage = function (message) {
          if (message && shouldShowFlashMessage(options.flash, 'error') || shouldShowFlashMessage(options.flash, 'validate')) {
            self.flashMessage.show({
              message: message,
              type: 'error'
            });
          }
        };

        options.handleFlashMessage = function (message, type) {
          if (message && shouldShowFlashMessage(options.flash, type)) {
            self.flashMessage.show({
              message: message,
              type: type
            });
          }
        };
      }
    }.bind(this);

    this.flashMessageRender = function (event) {
      this.flashMessage.render();
    }.bind(this); // Browser redirect


    this.handleBrowserRedirect = function (event) {
      if (event.defaultPrevented) {
        return;
      }

      if (oc.useTurbo && oc.useTurbo()) {
        var href = oc.AjaxTurbo.controller.getLastVisitUrl();

        if (href) {
          event.preventDefault();
          oc.visit(href);
        }
      } else {
        var _href = getReferrerFromSameOrigin();

        if (_href) {
          event.preventDefault();
          location.assign(_href);
        }
      }
    };
  }

  _createClass(Controller, [{
    key: "start",
    value: function start() {
      if (!this.started) {
        // Progress bar
        addEventListener('ajax:setup', this.enableProgressBar); // Attach loader

        this.attachLoader = new _attach_loader__WEBPACK_IMPORTED_MODULE_1__.AttachLoader();
        _util_events__WEBPACK_IMPORTED_MODULE_3__.Events.on(document, 'ajax:promise', 'form, [data-attach-loading]', this.showAttachLoader);
        _util_events__WEBPACK_IMPORTED_MODULE_3__.Events.on(document, 'ajax:fail', 'form, [data-attach-loading]', this.hideAttachLoader);
        _util_events__WEBPACK_IMPORTED_MODULE_3__.Events.on(document, 'ajax:done', 'form, [data-attach-loading]', this.hideAttachLoader); // Validator

        this.validator = new _validator__WEBPACK_IMPORTED_MODULE_0__.Validator();
        _util_events__WEBPACK_IMPORTED_MODULE_3__.Events.on(document, 'ajax:before-validate', '[data-request-validate]', this.validatorValidate);
        _util_events__WEBPACK_IMPORTED_MODULE_3__.Events.on(document, 'ajax:promise', '[data-request-validate]', this.validatorSubmit); // Flash message

        this.flashMessage = new _flash_message__WEBPACK_IMPORTED_MODULE_2__.FlashMessage();
        addEventListener('render', this.flashMessageRender);
        addEventListener('ajax:setup', this.flashMessageBind); // Browser redirect

        _util_events__WEBPACK_IMPORTED_MODULE_3__.Events.on(document, 'click', '[data-browser-redirect-back]', this.handleBrowserRedirect);
        _util_events__WEBPACK_IMPORTED_MODULE_3__.Events.on(document, 'ajax:before-redirect', '[data-browser-redirect-back]', this.handleBrowserRedirect);
        this.started = true;
      }
    }
  }, {
    key: "stop",
    value: function stop() {
      if (this.started) {
        // Progress bar
        removeEventListener('ajax:setup', this.enableProgressBar); // Attach loader

        this.attachLoader = null;
        _util_events__WEBPACK_IMPORTED_MODULE_3__.Events.off(document, 'ajax:promise', 'form, [data-attach-loading]', this.showAttachLoader);
        _util_events__WEBPACK_IMPORTED_MODULE_3__.Events.off(document, 'ajax:fail', 'form, [data-attach-loading]', this.hideAttachLoader);
        _util_events__WEBPACK_IMPORTED_MODULE_3__.Events.off(document, 'ajax:done', 'form, [data-attach-loading]', this.hideAttachLoader); // Validator

        this.validator = null;
        _util_events__WEBPACK_IMPORTED_MODULE_3__.Events.off(document, 'ajax:before-validate', '[data-request-validate]', this.validatorValidate);
        _util_events__WEBPACK_IMPORTED_MODULE_3__.Events.off(document, 'ajax:promise', '[data-request-validate]', this.validatorSubmit); // Flash message

        this.flashMessage = null;
        removeEventListener('render', this.flashMessageRender);
        removeEventListener('ajax:setup', this.flashMessageBind); // Browser redirect

        _util_events__WEBPACK_IMPORTED_MODULE_3__.Events.off(document, 'click', '[data-browser-redirect-back]', this.handleBrowserRedirect);
        _util_events__WEBPACK_IMPORTED_MODULE_3__.Events.off(document, 'ajax:before-redirect', '[data-browser-redirect-back]', this.handleBrowserRedirect);
        this.started = false;
      }
    }
  }]);

  return Controller;
}();

function shouldShowFlashMessage(value, type) {
  // Valdiation messages are not included by default
  if (value === true && type !== 'validate') {
    return true;
  }

  if (typeof value !== 'string') {
    return false;
  }

  if (value === '*') {
    return true;
  }

  var result = false;
  value.split(',').forEach(function (validType) {
    if (validType.trim() === type) {
      result = true;
    }
  });
  return result;
}

function getReferrerFromSameOrigin() {
  if (!document.referrer) {
    return null;
  } // Fallback when turbo router isnt activated


  try {
    var referrer = new URL(document.referrer);

    if (referrer.origin !== location.origin) {
      return null;
    }

    var pushReferrer = localStorage.getItem('ocPushStateReferrer');

    if (pushReferrer && pushReferrer.indexOf(referrer.pathname) === 0) {
      return pushReferrer;
    }

    return document.referrer;
  } catch (e) {}
}

/***/ }),

/***/ "./src/extras/flash-message.js":
/*!*************************************!*\
  !*** ./src/extras/flash-message.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "FlashMessage": () => (/* binding */ FlashMessage)
/* harmony export */ });
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../util */ "./src/util/index.js");
var _templateObject;

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }


var FlashMessage = /*#__PURE__*/function () {
  function FlashMessage() {
    _classCallCheck(this, FlashMessage);

    this.stylesheetElement = this.createStylesheetElement();
  }

  _createClass(FlashMessage, [{
    key: "show",
    value: function show() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      this.installStylesheetElement();
      var _options$message = options.message,
          message = _options$message === void 0 ? '' : _options$message,
          _options$type = options.type,
          type = _options$type === void 0 ? 'info' : _options$type,
          _options$target = options.target,
          target = _options$target === void 0 ? null : _options$target,
          _options$interval = options.interval,
          interval = _options$interval === void 0 ? 5 : _options$interval; // Legacy API

      if (options.text) message = options.text;
      if (options["class"]) type = options["class"]; // Idempotence

      if (target) {
        target.removeAttribute('data-control');
      } // Error singles


      if (type === 'error') {
        this.deleteFlashMessages();
      } // Inject element


      var flashElement = this.createFlashElement(message, type);
      document.body.appendChild(flashElement);
      setTimeout(function () {
        flashElement.classList.add('flash-show');
      }, 100); // Events

      flashElement.addEventListener('click', pause);
      flashElement.addEventListener('extras:flash-remove', remove);
      flashElement.querySelector('.flash-close').addEventListener('click', remove); // Timeout

      var timer;

      if (interval && interval !== 0) {
        timer = setTimeout(remove, interval * 1000);
      } // Remove logic


      function remove() {
        clearInterval(timer);
        flashElement.removeEventListener('click', pause);
        flashElement.removeEventListener('extras:flash-remove', remove);
        flashElement.querySelector('.flash-close').removeEventListener('click', remove);
        flashElement.classList.remove('flash-show');
        setTimeout(function () {
          flashElement.remove();
        }, 1000);
      } // Pause logic


      function pause() {
        clearInterval(timer);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var self = this;
      document.querySelectorAll('[data-control=flash-message]').forEach(function (el) {
        self.show(_objectSpread(_objectSpread({}, el.dataset), {}, {
          target: el,
          message: el.innerHTML
        }));
        el.remove();
      });
    }
  }, {
    key: "deleteFlashMessages",
    value: function deleteFlashMessages() {
      document.querySelectorAll('.oc-flash-message').forEach(function (el) {
        el.dispatchEvent(new Event('extras:flash-remove'));
      });
    }
  }, {
    key: "createFlashElement",
    value: function createFlashElement(message, type) {
      var element = document.createElement('div');
      element.className = 'oc-flash-message ' + type;
      element.innerHTML = '<span>' + message + '</span><a class="flash-close"></a>';
      return element;
    } // Private

  }, {
    key: "installStylesheetElement",
    value: function installStylesheetElement() {
      if (!FlashMessage.stylesheetReady) {
        document.head.insertBefore(this.stylesheetElement, document.head.firstChild);
        FlashMessage.stylesheetReady = true;
      }
    }
  }, {
    key: "createStylesheetElement",
    value: function createStylesheetElement() {
      var element = document.createElement('style');
      element.textContent = FlashMessage.defaultCSS;
      return element;
    }
  }], [{
    key: "defaultCSS",
    get: function get() {
      return (0,_util__WEBPACK_IMPORTED_MODULE_0__.unindent)(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n        .oc-flash-message {\n            position: fixed;\n            z-index: 10300;\n            width: 500px;\n            left: 50%;\n            top: 50px;\n            margin-left: -250px;\n            color: #fff;\n            font-size: 1rem;\n            padding: 10px 30px 10px 15px;\n            border-radius: 5px;\n\n            opacity: 0;\n            transition: all 0.5s, width 0s;\n            transform: scale(0.9);\n        }\n        .oc-flash-message.flash-show {\n            opacity: 1;\n            transform: scale(1);\n        }\n        .oc-flash-message.success {\n            background: #86cB43;\n        }\n        .oc-flash-message.error {\n            background: #cc3300;\n        }\n        .oc-flash-message.warning {\n            background: #f0ad4e;\n        }\n        .oc-flash-message.info {\n            background: #5fb6f5;\n        }\n        .oc-flash-message a.flash-close {\n            box-sizing: content-box;\n            width: 1em;\n            height: 1em;\n            padding: .25em .25em;\n            background: transparent url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23FFF'%3e%3cpath d='M.293.293a1 1 0 011.414 0L8 6.586 14.293.293a1 1 0 111.414 1.414L9.414 8l6.293 6.293a1 1 0 01-1.414 1.414L8 9.414l-6.293 6.293a1 1 0 01-1.414-1.414L6.586 8 .293 1.707a1 1 0 010-1.414z'/%3e%3c/svg%3e\") center/1em auto no-repeat;\n            border: 0;\n            border-radius: .25rem;\n            opacity: .5;\n            text-decoration: none;\n            position: absolute;\n            right: .7rem;\n            top: .7rem;\n            cursor: pointer;\n        }\n        .oc-flash-message a.flash-close:hover,\n        .oc-flash-message a.flash-close:focus {\n            opacity: 1;\n        }\n        html[data-turbo-preview] .oc-flash-message {\n            opacity: 0;\n        }\n        @media (max-width: 768px) {\n            .oc-flash-message {\n                left: 1rem;\n                right: 1rem;\n                top: 1rem;\n                margin-left: 0;\n                width: auto;\n            }\n        }\n    "])));
    }
  }, {
    key: "flashMsg",
    value: function flashMsg(options) {
      return new FlashMessage().show(options);
    }
  }]);

  return FlashMessage;
}();

_defineProperty(FlashMessage, "stylesheetReady", false);

/***/ }),

/***/ "./src/extras/index.js":
/*!*****************************!*\
  !*** ./src/extras/index.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _namespace__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./namespace */ "./src/extras/namespace.js");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_namespace__WEBPACK_IMPORTED_MODULE_0__["default"]);

if (!window.oc) {
  window.oc = {};
}

if (!window.oc.AjaxExtras) {
  // Namespace
  window.oc.AjaxExtras = _namespace__WEBPACK_IMPORTED_MODULE_0__["default"]; // Flash messages

  window.oc.flashMsg = _namespace__WEBPACK_IMPORTED_MODULE_0__["default"].flashMsg; // Progress bar

  window.oc.progressBar = _namespace__WEBPACK_IMPORTED_MODULE_0__["default"].progressBar; // Attach loader

  window.oc.attachLoader = _namespace__WEBPACK_IMPORTED_MODULE_0__["default"].attachLoader; // Boot controller

  if (!isAMD() && !isCommonJS()) {
    _namespace__WEBPACK_IMPORTED_MODULE_0__["default"].start();
  }
}

function isAMD() {
  return typeof define == "function" && __webpack_require__.amdO;
}

function isCommonJS() {
  return (typeof exports === "undefined" ? "undefined" : _typeof(exports)) == "object" && "object" != "undefined";
}

/***/ }),

/***/ "./src/extras/migrate.js":
/*!*******************************!*\
  !*** ./src/extras/migrate.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Migrate": () => (/* binding */ Migrate)
/* harmony export */ });
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

var Migrate = /*#__PURE__*/function () {
  function Migrate() {
    _classCallCheck(this, Migrate);
  }

  _createClass(Migrate, [{
    key: "bind",
    value: function bind() {
      if ($.oc === undefined) {
        $.oc = {};
      }

      $.oc.flashMsg = window.oc.flashMsg;
      $.oc.stripeLoadIndicator = window.oc.progressBar;
    }
  }]);

  return Migrate;
}();

/***/ }),

/***/ "./src/extras/namespace.js":
/*!*********************************!*\
  !*** ./src/extras/namespace.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _controller__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./controller */ "./src/extras/controller.js");
/* harmony import */ var _migrate__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./migrate */ "./src/extras/migrate.js");
/* harmony import */ var _flash_message__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./flash-message */ "./src/extras/flash-message.js");
/* harmony import */ var _progress_bar__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./progress-bar */ "./src/extras/progress-bar.js");
/* harmony import */ var _attach_loader__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./attach-loader */ "./src/extras/attach-loader.js");





var controller = new _controller__WEBPACK_IMPORTED_MODULE_0__.Controller();
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  controller: controller,
  flashMsg: _flash_message__WEBPACK_IMPORTED_MODULE_2__.FlashMessage.flashMsg,
  progressBar: _progress_bar__WEBPACK_IMPORTED_MODULE_3__.ProgressBar.progressBar,
  attachLoader: _attach_loader__WEBPACK_IMPORTED_MODULE_4__.AttachLoader.attachLoader,
  start: function start() {
    controller.start();

    if (window.jQuery) {
      new _migrate__WEBPACK_IMPORTED_MODULE_1__.Migrate().bind();
    }
  },
  stop: function stop() {
    controller.stop();
  }
});

/***/ }),

/***/ "./src/extras/progress-bar.js":
/*!************************************!*\
  !*** ./src/extras/progress-bar.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ProgressBar": () => (/* binding */ ProgressBar)
/* harmony export */ });
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../util */ "./src/util/index.js");
var _templateObject;

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }


var ProgressBar = /*#__PURE__*/function () {
  function ProgressBar() {
    var _this = this;

    _classCallCheck(this, ProgressBar);

    this.stylesheetElement = this.createStylesheetElement();
    this.progressElement = this.createProgressElement();
    this.hiding = false;
    this.value = 0;
    this.visible = false;

    this.trickle = function () {
      _this.setValue(_this.value + Math.random() / 100);
    };
  }

  _createClass(ProgressBar, [{
    key: "show",
    value: function show() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (options.cssClass) {
        this.progressElement.classList.add(options.cssClass);
      }

      if (!this.visible) {
        this.visible = true;
        this.installStylesheetElement();
        this.installProgressElement();
        this.startTrickling();
      }
    }
  }, {
    key: "hide",
    value: function hide() {
      var _this2 = this;

      if (this.visible && !this.hiding) {
        this.hiding = true;
        this.fadeProgressElement(function () {
          _this2.uninstallProgressElement();

          _this2.stopTrickling();

          _this2.visible = false;
          _this2.hiding = false;
        });
      }
    }
  }, {
    key: "setValue",
    value: function setValue(value) {
      this.value = value;
      this.refresh();
    } // Private

  }, {
    key: "installStylesheetElement",
    value: function installStylesheetElement() {
      if (!ProgressBar.stylesheetReady) {
        document.head.insertBefore(this.stylesheetElement, document.head.firstChild);
        ProgressBar.stylesheetReady = true;
      }
    }
  }, {
    key: "installProgressElement",
    value: function installProgressElement() {
      this.progressElement.style.width = "0";
      this.progressElement.style.opacity = "1";
      document.documentElement.insertBefore(this.progressElement, document.body);
      this.refresh();
    }
  }, {
    key: "fadeProgressElement",
    value: function fadeProgressElement(callback) {
      this.progressElement.style.opacity = "0";
      setTimeout(callback, ProgressBar.animationDuration * 1.5);
    }
  }, {
    key: "uninstallProgressElement",
    value: function uninstallProgressElement() {
      if (this.progressElement.parentNode) {
        document.documentElement.removeChild(this.progressElement);
      }
    }
  }, {
    key: "startTrickling",
    value: function startTrickling() {
      if (!this.trickleInterval) {
        this.trickleInterval = setInterval(this.trickle, ProgressBar.animationDuration);
      }
    }
  }, {
    key: "stopTrickling",
    value: function stopTrickling() {
      clearInterval(this.trickleInterval);
      delete this.trickleInterval;
    }
  }, {
    key: "refresh",
    value: function refresh() {
      var _this3 = this;

      requestAnimationFrame(function () {
        _this3.progressElement.style.width = "".concat(10 + _this3.value * 90, "%");
      });
    }
  }, {
    key: "createStylesheetElement",
    value: function createStylesheetElement() {
      var element = document.createElement('style');
      element.textContent = ProgressBar.defaultCSS;
      return element;
    }
  }, {
    key: "createProgressElement",
    value: function createProgressElement() {
      var element = document.createElement('div');
      element.className = 'oc-progress-bar';
      return element;
    }
  }], [{
    key: "defaultCSS",
    get: function get() {
      return (0,_util__WEBPACK_IMPORTED_MODULE_0__.unindent)(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n        .oc-progress-bar {\n            position: fixed;\n            display: block;\n            top: 0;\n            left: 0;\n            height: 3px;\n            background: #0076ff;\n            z-index: 9999;\n            transition:\n                width ", "ms ease-out,\n                opacity ", "ms ", "ms ease-in;\n            transform: translate3d(0, 0, 0);\n        }\n    "])), ProgressBar.animationDuration, ProgressBar.animationDuration / 2, ProgressBar.animationDuration / 2);
    }
  }, {
    key: "progressBar",
    get: function get() {
      return {
        show: function show() {
          var instance = getOrCreateInstance();
          instance.setValue(0);
          instance.show();
        },
        hide: function hide() {
          var instance = getOrCreateInstance();
          instance.setValue(100);
          instance.hide();
        }
      };
    }
  }]);

  return ProgressBar;
}();

_defineProperty(ProgressBar, "instance", null);

_defineProperty(ProgressBar, "stylesheetReady", false);

_defineProperty(ProgressBar, "animationDuration", 300);

function getOrCreateInstance() {
  if (!ProgressBar.instance) {
    ProgressBar.instance = new ProgressBar();
  }

  return ProgressBar.instance;
}

/***/ }),

/***/ "./src/extras/validator.js":
/*!*********************************!*\
  !*** ./src/extras/validator.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Validator": () => (/* binding */ Validator)
/* harmony export */ });
/* harmony import */ var _util_events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../util/events */ "./src/util/events.js");
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }


var Validator = /*#__PURE__*/function () {
  function Validator() {
    _classCallCheck(this, Validator);
  }

  _createClass(Validator, [{
    key: "submit",
    value: function submit(el) {
      var form = el.closest('form');

      if (!form) {
        return;
      }

      form.querySelectorAll('[data-validate-for]').forEach(function (el) {
        el.classList.remove('oc-visible');
      });
      form.querySelectorAll('[data-validate-error]').forEach(function (el) {
        el.classList.remove('oc-visible');
      });
    }
  }, {
    key: "validate",
    value: function validate(el, fields, errorMsg, allowDefault) {
      var form = el.closest('form'),
          messages = [];

      if (!form) {
        return;
      }

      for (var fieldName in fields) {
        // Build messages
        var fieldMessages = fields[fieldName];
        messages = [].concat(_toConsumableArray(messages), _toConsumableArray(fieldMessages)); // Display message next to field

        var field = form.querySelector('[data-validate-for="' + fieldName + '"]');

        if (field) {
          if (!field.innerHTML || field.dataset.emptyMode) {
            field.dataset.emptyMode = true;
            field.innerHTML = fieldMessages.join(', ');
          }

          field.classList.add('oc-visible');
        }
      }

      var container = form.querySelector('[data-validate-error]');

      if (container) {
        container.classList.add('oc-visible'); // Messages found inside the container

        var oldMessages = container.querySelectorAll('[data-message]');

        if (oldMessages.length > 0) {
          var clone = oldMessages[0];
          messages.forEach(function (message) {
            var newNode = clone.cloneNode(true);
            newNode.innerHTML = message; // Insert after

            clone.parentNode.insertBefore(newNode, clone.nextSibling);
          });
          oldMessages.forEach(function (el) {
            el.remove();
          });
        } // Just use the container to set the value
        else {
          container.innerHTML = errorMsg;
        }
      } // Flash messages want a pass here


      if (allowDefault) {
        return;
      } // Prevent default error behavior


      _util_events__WEBPACK_IMPORTED_MODULE_0__.Events.one(form, 'ajax:request-error', function (event) {
        event.preventDefault();
      });
    }
  }]);

  return Validator;
}();

/***/ }),

/***/ "./src/observe/application.js":
/*!************************************!*\
  !*** ./src/observe/application.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Application": () => (/* binding */ Application)
/* harmony export */ });
/* harmony import */ var _dispatcher__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dispatcher */ "./src/observe/dispatcher.js");
/* harmony import */ var _container__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./container */ "./src/observe/container.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }



var Application = /*#__PURE__*/function () {
  function Application() {
    _classCallCheck(this, Application);

    this.started = false;
    this.element = document.documentElement;
    this.dispatcher = new _dispatcher__WEBPACK_IMPORTED_MODULE_0__.Dispatcher(this);
    this.container = new _container__WEBPACK_IMPORTED_MODULE_1__.Container(this);
  }

  _createClass(Application, [{
    key: "startAsync",
    value: function startAsync() {
      var _this = this;

      domReady().then(function () {
        _this.start();
      });
    }
  }, {
    key: "start",
    value: function start() {
      if (!this.started) {
        this.started = true;
        this.dispatcher.start();
        this.container.start();
      }
    }
  }, {
    key: "stop",
    value: function stop() {
      if (this.started) {
        this.dispatcher.stop();
        this.container.stop();
        this.started = false;
      }
    }
  }, {
    key: "register",
    value: function register(identifier, controlConstructor) {
      this.load({
        identifier: identifier,
        controlConstructor: controlConstructor
      });
    }
  }, {
    key: "import",
    value: function _import(identifier) {
      var module = this.container.getModuleForIdentifier(identifier);

      if (!module) {
        throw new Error('Control is not registered: ' + identifier);
      }

      return module.controlConstructor;
    }
  }, {
    key: "fetch",
    value: function fetch(element) {
      if (typeof element === 'string') {
        element = document.querySelector(element);
      }

      return element ? this.getControlForElementAndIdentifier(element, element.dataset.control) : null;
    }
  }, {
    key: "fetchAll",
    value: function fetchAll(elements) {
      var _this2 = this;

      if (typeof elements === 'string') {
        elements = document.querySelectorAll(elements);
      }

      var result = [];
      elements.forEach(function (element) {
        var control = _this2.fetch(element);

        if (control) {
          result.push(control);
        }
      });
      return result;
    }
  }, {
    key: "load",
    value: function load(head) {
      var _this3 = this;

      for (var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        rest[_key - 1] = arguments[_key];
      }

      var definitions = Array.isArray(head) ? head : [head].concat(rest);
      definitions.forEach(function (definition) {
        if (definition.controlConstructor.shouldLoad) {
          _this3.container.loadDefinition(definition);
        }
      });
    }
  }, {
    key: "unload",
    value: function unload(head) {
      var _this4 = this;

      for (var _len2 = arguments.length, rest = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        rest[_key2 - 1] = arguments[_key2];
      }

      var identifiers = Array.isArray(head) ? head : [head].concat(rest);
      identifiers.forEach(function (identifier) {
        return _this4.container.unloadIdentifier(identifier);
      });
    } // Controls

  }, {
    key: "controls",
    get: function get() {
      return this.container.contexts.map(function (context) {
        return context.control;
      });
    }
  }, {
    key: "getControlForElementAndIdentifier",
    value: function getControlForElementAndIdentifier(element, identifier) {
      var context = this.container.getContextForElementAndIdentifier(element, identifier);
      return context ? context.control : null;
    } // Error handling

  }, {
    key: "handleError",
    value: function handleError(error, message, detail) {
      var _a;

      console.error("%s\n\n%o\n\n%o", message, error, detail);
      (_a = window.onerror) === null || _a === void 0 ? void 0 : _a.call(window, message, "", 0, 0, error);
    }
  }]);

  return Application;
}();

function domReady() {
  return new Promise(function (resolve) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function () {
        return resolve();
      });
    } else {
      resolve();
    }
  });
}

/***/ }),

/***/ "./src/observe/container.js":
/*!**********************************!*\
  !*** ./src/observe/container.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Container": () => (/* binding */ Container)
/* harmony export */ });
/* harmony import */ var _module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./module */ "./src/observe/module.js");
/* harmony import */ var _scope__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./scope */ "./src/observe/scope.js");
/* harmony import */ var _scope_observer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./scope-observer */ "./src/observe/scope-observer.js");
/* harmony import */ var _util_multimap__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./util/multimap */ "./src/observe/util/multimap.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }





var Container = /*#__PURE__*/function () {
  function Container(application) {
    _classCallCheck(this, Container);

    this.application = application;
    this.scopeObserver = new _scope_observer__WEBPACK_IMPORTED_MODULE_2__.ScopeObserver(this.element, this);
    this.scopesByIdentifier = new _util_multimap__WEBPACK_IMPORTED_MODULE_3__.Multimap();
    this.modulesByIdentifier = new Map();
  }

  _createClass(Container, [{
    key: "element",
    get: function get() {
      return this.application.element;
    }
  }, {
    key: "modules",
    get: function get() {
      return Array.from(this.modulesByIdentifier.values());
    }
  }, {
    key: "contexts",
    get: function get() {
      return this.modules.reduce(function (contexts, module) {
        return contexts.concat(module.contexts);
      }, []);
    }
  }, {
    key: "start",
    value: function start() {
      this.scopeObserver.start();
    }
  }, {
    key: "stop",
    value: function stop() {
      this.scopeObserver.stop();
    }
  }, {
    key: "loadDefinition",
    value: function loadDefinition(definition) {
      this.unloadIdentifier(definition.identifier);
      var module = new _module__WEBPACK_IMPORTED_MODULE_0__.Module(this.application, definition);
      this.connectModule(module);
      var afterLoad = definition.controlConstructor.afterLoad;

      if (afterLoad) {
        afterLoad.call(definition.controlConstructor, definition.identifier, this.application);
      }
    }
  }, {
    key: "unloadIdentifier",
    value: function unloadIdentifier(identifier) {
      var module = this.modulesByIdentifier.get(identifier);

      if (module) {
        this.disconnectModule(module);
      }
    }
  }, {
    key: "getModuleForIdentifier",
    value: function getModuleForIdentifier(identifier) {
      return this.modulesByIdentifier.get(identifier);
    }
  }, {
    key: "getContextForElementAndIdentifier",
    value: function getContextForElementAndIdentifier(element, identifier) {
      var module = this.modulesByIdentifier.get(identifier);

      if (module) {
        return module.contexts.find(function (context) {
          return context.element == element;
        });
      }
    } // Error handler delegate

  }, {
    key: "handleError",
    value: function handleError(error, message, detail) {
      this.application.handleError(error, message, detail);
    } // Scope observer delegate

  }, {
    key: "createScopeForElementAndIdentifier",
    value: function createScopeForElementAndIdentifier(element, identifier) {
      return new _scope__WEBPACK_IMPORTED_MODULE_1__.Scope(element, identifier);
    }
  }, {
    key: "scopeConnected",
    value: function scopeConnected(scope) {
      this.scopesByIdentifier.add(scope.identifier, scope);
      var module = this.modulesByIdentifier.get(scope.identifier);

      if (module) {
        module.connectContextForScope(scope);
      }
    }
  }, {
    key: "scopeDisconnected",
    value: function scopeDisconnected(scope) {
      this.scopesByIdentifier["delete"](scope.identifier, scope);
      var module = this.modulesByIdentifier.get(scope.identifier);

      if (module) {
        module.disconnectContextForScope(scope);
      }
    } // Modules

  }, {
    key: "connectModule",
    value: function connectModule(module) {
      this.modulesByIdentifier.set(module.identifier, module);
      var scopes = this.scopesByIdentifier.getValuesForKey(module.identifier);
      scopes.forEach(function (scope) {
        return module.connectContextForScope(scope);
      });
    }
  }, {
    key: "disconnectModule",
    value: function disconnectModule(module) {
      this.modulesByIdentifier["delete"](module.identifier);
      var scopes = this.scopesByIdentifier.getValuesForKey(module.identifier);
      scopes.forEach(function (scope) {
        return module.disconnectContextForScope(scope);
      });
    }
  }]);

  return Container;
}();

/***/ }),

/***/ "./src/observe/context.js":
/*!********************************!*\
  !*** ./src/observe/context.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Context": () => (/* binding */ Context)
/* harmony export */ });
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

var Context = /*#__PURE__*/function () {
  function Context(module, scope) {
    _classCallCheck(this, Context);

    this.module = module;
    this.scope = scope;
    this.control = new module.controlConstructor(this);

    try {
      this.control.initBefore();
      this.control.init();
      this.control.initAfter();
    } catch (error) {
      this.handleError(error, 'initializing control');
    }
  }

  _createClass(Context, [{
    key: "connect",
    value: function connect() {
      try {
        this.control.connectBefore();
        this.control.connect();
        this.control.connectAfter();
      } catch (error) {
        this.handleError(error, 'connecting control');
      }
    }
  }, {
    key: "refresh",
    value: function refresh() {}
  }, {
    key: "disconnect",
    value: function disconnect() {
      try {
        this.control.disconnectBefore();
        this.control.disconnect();
        this.control.disconnectAfter();
      } catch (error) {
        this.handleError(error, 'disconnecting control');
      }
    }
  }, {
    key: "application",
    get: function get() {
      return this.module.application;
    }
  }, {
    key: "identifier",
    get: function get() {
      return this.module.identifier;
    }
  }, {
    key: "dispatcher",
    get: function get() {
      return this.application.dispatcher;
    }
  }, {
    key: "element",
    get: function get() {
      return this.scope.element;
    }
  }, {
    key: "parentElement",
    get: function get() {
      return this.element.parentElement;
    } // Error handling

  }, {
    key: "handleError",
    value: function handleError(error, message) {
      var detail = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var identifier = this.identifier,
          control = this.control,
          element = this.element;
      detail = Object.assign({
        identifier: identifier,
        control: control,
        element: element
      }, detail);
      this.application.handleError(error, "Error ".concat(message), detail);
    }
  }]);

  return Context;
}();

/***/ }),

/***/ "./src/observe/control-base.js":
/*!*************************************!*\
  !*** ./src/observe/control-base.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ControlBase": () => (/* binding */ ControlBase)
/* harmony export */ });
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var ControlBase = /*#__PURE__*/function () {
  function ControlBase(context) {
    _classCallCheck(this, ControlBase);

    this.context = context;
  }

  _createClass(ControlBase, [{
    key: "application",
    get: function get() {
      return this.context.application;
    }
  }, {
    key: "scope",
    get: function get() {
      return this.context.scope;
    }
  }, {
    key: "element",
    get: function get() {
      return this.scope.element;
    }
  }, {
    key: "config",
    get: function get() {
      return this.scope.element.dataset;
    }
  }, {
    key: "identifier",
    get: function get() {
      return this.scope.identifier;
    }
  }, {
    key: "init",
    value: function init() {// Set up initial control state
    }
  }, {
    key: "connect",
    value: function connect() {// Control is connected to the DOM
    }
  }, {
    key: "disconnect",
    value: function disconnect() {// Control is disconnected from the DOM
    } // Internal events avoid the need to call parent logic

  }, {
    key: "initBefore",
    value: function initBefore() {
      this.proxiedEvents = {};
      this.proxiedMethods = {};
    }
  }, {
    key: "initAfter",
    value: function initAfter() {}
  }, {
    key: "connectBefore",
    value: function connectBefore() {}
  }, {
    key: "connectAfter",
    value: function connectAfter() {}
  }, {
    key: "disconnectBefore",
    value: function disconnectBefore() {}
  }, {
    key: "disconnectAfter",
    value: function disconnectAfter() {
      for (var key in this.proxiedEvents) {
        this.forget.apply(this, _toConsumableArray(this.proxiedEvents[key]));
        delete this.proxiedEvents[key];
      }

      for (var _key in this.proxiedMethods) {
        this.proxiedMethods[_key] = undefined;
      }
    } // Events

  }, {
    key: "listen",
    value: function listen(eventName, targetOrHandler, handlerOrOptions, options) {
      if (typeof targetOrHandler === 'string') {
        oc.Events.on(this.element, eventName, targetOrHandler, this.proxy(handlerOrOptions), options);
      } else if (targetOrHandler instanceof Element) {
        oc.Events.on(targetOrHandler, eventName, this.proxy(handlerOrOptions), options);
      } else {
        oc.Events.on(this.element, eventName, this.proxy(targetOrHandler), handlerOrOptions);
      } // Automatic unbinding


      ControlBase.proxyCounter++;
      this.proxiedEvents[ControlBase.proxyCounter] = arguments;
    }
  }, {
    key: "forget",
    value: function forget(eventName, targetOrHandler, handlerOrOptions, options) {
      if (typeof targetOrHandler === 'string') {
        oc.Events.off(this.element, eventName, targetOrHandler, this.proxy(handlerOrOptions), options);
      } else if (targetOrHandler instanceof Element) {
        oc.Events.off(targetOrHandler, eventName, this.proxy(handlerOrOptions), options);
      } else {
        oc.Events.off(this.element, eventName, this.proxy(targetOrHandler), handlerOrOptions);
      } // Fills JS gap


      var compareArrays = function compareArrays(a, b) {
        if (a.length === b.length) {
          for (var i = 0; i < a.length; i++) {
            if (a[i] === b[i]) {
              return true;
            }
          }
        }

        return false;
      }; // Seeking GC


      for (var key in this.proxiedEvents) {
        if (compareArrays(arguments, this.proxiedEvents[key])) {
          delete this.proxiedEvents[key];
        }
      }
    }
  }, {
    key: "dispatch",
    value: function dispatch(eventName) {
      var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          _ref$target = _ref.target,
          target = _ref$target === void 0 ? this.element : _ref$target,
          _ref$detail = _ref.detail,
          detail = _ref$detail === void 0 ? {} : _ref$detail,
          _ref$prefix = _ref.prefix,
          prefix = _ref$prefix === void 0 ? this.identifier : _ref$prefix,
          _ref$bubbles = _ref.bubbles,
          bubbles = _ref$bubbles === void 0 ? true : _ref$bubbles,
          _ref$cancelable = _ref.cancelable,
          cancelable = _ref$cancelable === void 0 ? true : _ref$cancelable;

      var type = prefix ? "".concat(prefix, ":").concat(eventName) : eventName;
      var event = new CustomEvent(type, {
        detail: detail,
        bubbles: bubbles,
        cancelable: cancelable
      });
      target.dispatchEvent(event);
      return event;
    }
  }, {
    key: "proxy",
    value: function proxy(method) {
      if (method.ocProxyId === undefined) {
        ControlBase.proxyCounter++;
        method.ocProxyId = ControlBase.proxyCounter;
      }

      if (this.proxiedMethods[method.ocProxyId] !== undefined) {
        return this.proxiedMethods[method.ocProxyId];
      }

      this.proxiedMethods[method.ocProxyId] = method.bind(this);
      return this.proxiedMethods[method.ocProxyId];
    }
  }], [{
    key: "shouldLoad",
    get: function get() {
      return true;
    }
  }, {
    key: "afterLoad",
    value: function afterLoad(_identifier, _application) {
      return;
    }
  }]);

  return ControlBase;
}();

_defineProperty(ControlBase, "proxyCounter", 0);



/***/ }),

/***/ "./src/observe/dispatcher.js":
/*!***********************************!*\
  !*** ./src/observe/dispatcher.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Dispatcher": () => (/* binding */ Dispatcher)
/* harmony export */ });
/* harmony import */ var _event_listener__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./event-listener */ "./src/observe/event-listener.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }


var Dispatcher = /*#__PURE__*/function () {
  function Dispatcher(application) {
    _classCallCheck(this, Dispatcher);

    this.application = application;
    this.eventListenerMaps = new Map();
    this.started = false;
  }

  _createClass(Dispatcher, [{
    key: "start",
    value: function start() {
      if (!this.started) {
        this.started = true;
        this.eventListeners.forEach(function (eventListener) {
          return eventListener.connect();
        });
      }
    }
  }, {
    key: "stop",
    value: function stop() {
      if (this.started) {
        this.started = false;
        this.eventListeners.forEach(function (eventListener) {
          return eventListener.disconnect();
        });
      }
    }
  }, {
    key: "eventListeners",
    get: function get() {
      return Array.from(this.eventListenerMaps.values()).reduce(function (listeners, map) {
        return listeners.concat(Array.from(map.values()));
      }, []);
    } // Binding observer delegate

  }, {
    key: "bindingConnected",
    value: function bindingConnected(binding) {
      this.fetchEventListenerForBinding(binding).bindingConnected(binding);
    }
  }, {
    key: "bindingDisconnected",
    value: function bindingDisconnected(binding) {
      var clearEventListeners = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      this.fetchEventListenerForBinding(binding).bindingDisconnected(binding);
      if (clearEventListeners) this.clearEventListenersForBinding(binding);
    } // Error handling

  }, {
    key: "handleError",
    value: function handleError(error, message) {
      var detail = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      this.application.handleError(error, "Error ".concat(message), detail);
    }
  }, {
    key: "clearEventListenersForBinding",
    value: function clearEventListenersForBinding(binding) {
      var eventListener = this.fetchEventListenerForBinding(binding);

      if (!eventListener.hasBindings()) {
        eventListener.disconnect();
        this.removeMappedEventListenerFor(binding);
      }
    }
  }, {
    key: "removeMappedEventListenerFor",
    value: function removeMappedEventListenerFor(binding) {
      var eventTarget = binding.eventTarget,
          eventName = binding.eventName,
          eventOptions = binding.eventOptions;
      var eventListenerMap = this.fetchEventListenerMapForEventTarget(eventTarget);
      var cacheKey = this.cacheKey(eventName, eventOptions);
      eventListenerMap["delete"](cacheKey);

      if (eventListenerMap.size == 0) {
        this.eventListenerMaps["delete"](eventTarget);
      }
    }
  }, {
    key: "fetchEventListenerForBinding",
    value: function fetchEventListenerForBinding(binding) {
      var eventTarget = binding.eventTarget,
          eventName = binding.eventName,
          eventOptions = binding.eventOptions;
      return this.fetchEventListener(eventTarget, eventName, eventOptions);
    }
  }, {
    key: "fetchEventListener",
    value: function fetchEventListener(eventTarget, eventName, eventOptions) {
      var eventListenerMap = this.fetchEventListenerMapForEventTarget(eventTarget);
      var cacheKey = this.cacheKey(eventName, eventOptions);
      var eventListener = eventListenerMap.get(cacheKey);

      if (!eventListener) {
        eventListener = this.createEventListener(eventTarget, eventName, eventOptions);
        eventListenerMap.set(cacheKey, eventListener);
      }

      return eventListener;
    }
  }, {
    key: "createEventListener",
    value: function createEventListener(eventTarget, eventName, eventOptions) {
      var eventListener = new _event_listener__WEBPACK_IMPORTED_MODULE_0__.EventListener(eventTarget, eventName, eventOptions);

      if (this.started) {
        eventListener.connect();
      }

      return eventListener;
    }
  }, {
    key: "fetchEventListenerMapForEventTarget",
    value: function fetchEventListenerMapForEventTarget(eventTarget) {
      var eventListenerMap = this.eventListenerMaps.get(eventTarget);

      if (!eventListenerMap) {
        eventListenerMap = new Map();
        this.eventListenerMaps.set(eventTarget, eventListenerMap);
      }

      return eventListenerMap;
    }
  }, {
    key: "cacheKey",
    value: function cacheKey(eventName, eventOptions) {
      var parts = [eventName];
      Object.keys(eventOptions).sort().forEach(function (key) {
        parts.push("".concat(eventOptions[key] ? "" : "!").concat(key));
      });
      return parts.join(":");
    }
  }]);

  return Dispatcher;
}();

/***/ }),

/***/ "./src/observe/event-listener.js":
/*!***************************************!*\
  !*** ./src/observe/event-listener.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "EventListener": () => (/* binding */ EventListener)
/* harmony export */ });
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

var EventListener = /*#__PURE__*/function () {
  function EventListener(eventTarget, eventName, eventOptions) {
    _classCallCheck(this, EventListener);

    this.eventTarget = eventTarget;
    this.eventName = eventName;
    this.eventOptions = eventOptions;
    this.unorderedBindings = new Set();
  }

  _createClass(EventListener, [{
    key: "connect",
    value: function connect() {
      this.eventTarget.addEventListener(this.eventName, this, this.eventOptions);
    }
  }, {
    key: "disconnect",
    value: function disconnect() {
      this.eventTarget.removeEventListener(this.eventName, this, this.eventOptions);
    } // Binding observer delegate

  }, {
    key: "bindingConnected",
    value: function bindingConnected(binding) {
      this.unorderedBindings.add(binding);
    }
  }, {
    key: "bindingDisconnected",
    value: function bindingDisconnected(binding) {
      this.unorderedBindings["delete"](binding);
    }
  }, {
    key: "handleEvent",
    value: function handleEvent(event) {
      var extendedEvent = extendEvent(event);

      var _iterator = _createForOfIteratorHelper(this.bindings),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var binding = _step.value;

          if (extendedEvent.immediatePropagationStopped) {
            break;
          } else {
            binding.handleEvent(extendedEvent);
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
  }, {
    key: "hasBindings",
    value: function hasBindings() {
      return this.unorderedBindings.size > 0;
    }
  }, {
    key: "bindings",
    get: function get() {
      return Array.from(this.unorderedBindings).sort(function (left, right) {
        var leftIndex = left.index,
            rightIndex = right.index;
        return leftIndex < rightIndex ? -1 : leftIndex > rightIndex ? 1 : 0;
      });
    }
  }]);

  return EventListener;
}();

function extendEvent(event) {
  if ('immediatePropagationStopped' in event) {
    return event;
  } else {
    var _stopImmediatePropagation = event.stopImmediatePropagation;
    return Object.assign(event, {
      immediatePropagationStopped: false,
      stopImmediatePropagation: function stopImmediatePropagation() {
        this.immediatePropagationStopped = true;

        _stopImmediatePropagation.call(this);
      }
    });
  }
}

/***/ }),

/***/ "./src/observe/index.js":
/*!******************************!*\
  !*** ./src/observe/index.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _control_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./control-base */ "./src/observe/control-base.js");
/* harmony import */ var _namespace__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./namespace */ "./src/observe/namespace.js");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_namespace__WEBPACK_IMPORTED_MODULE_1__["default"]);

if (!window.oc) {
  window.oc = {};
}

if (!window.oc.AjaxObserve) {
  // Namespace
  window.oc.AjaxObserve = _namespace__WEBPACK_IMPORTED_MODULE_1__["default"]; // Control API

  window.oc.registerControl = _namespace__WEBPACK_IMPORTED_MODULE_1__["default"].registerControl;
  window.oc.importControl = _namespace__WEBPACK_IMPORTED_MODULE_1__["default"].importControl;
  window.oc.fetchControl = _namespace__WEBPACK_IMPORTED_MODULE_1__["default"].fetchControl;
  window.oc.fetchControls = _namespace__WEBPACK_IMPORTED_MODULE_1__["default"].fetchControls; // Control base class

  window.oc.ControlBase = _control_base__WEBPACK_IMPORTED_MODULE_0__.ControlBase; // Boot controller

  if (!isAMD() && !isCommonJS()) {
    _namespace__WEBPACK_IMPORTED_MODULE_1__["default"].start();
  }
}

function isAMD() {
  return typeof define == "function" && __webpack_require__.amdO;
}

function isCommonJS() {
  return (typeof exports === "undefined" ? "undefined" : _typeof(exports)) == "object" && "object" != "undefined";
}

/***/ }),

/***/ "./src/observe/module.js":
/*!*******************************!*\
  !*** ./src/observe/module.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Module": () => (/* binding */ Module)
/* harmony export */ });
/* harmony import */ var _context__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./context */ "./src/observe/context.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }


var Module = /*#__PURE__*/function () {
  function Module(application, definition) {
    _classCallCheck(this, Module);

    this.application = application;
    this.definition = blessDefinition(definition);
    this.contextsByScope = new WeakMap();
    this.connectedContexts = new Set();
  }

  _createClass(Module, [{
    key: "identifier",
    get: function get() {
      return this.definition.identifier;
    }
  }, {
    key: "controlConstructor",
    get: function get() {
      return this.definition.controlConstructor;
    }
  }, {
    key: "contexts",
    get: function get() {
      return Array.from(this.connectedContexts);
    }
  }, {
    key: "connectContextForScope",
    value: function connectContextForScope(scope) {
      var context = this.fetchContextForScope(scope);
      this.connectedContexts.add(context);
      context.connect();
    }
  }, {
    key: "disconnectContextForScope",
    value: function disconnectContextForScope(scope) {
      var context = this.contextsByScope.get(scope);

      if (context) {
        this.connectedContexts["delete"](context);
        context.disconnect();
      }
    }
  }, {
    key: "fetchContextForScope",
    value: function fetchContextForScope(scope) {
      var context = this.contextsByScope.get(scope);

      if (!context) {
        context = new _context__WEBPACK_IMPORTED_MODULE_0__.Context(this, scope);
        this.contextsByScope.set(scope, context);
      }

      return context;
    }
  }]);

  return Module;
}();

function blessDefinition(definition) {
  return {
    identifier: definition.identifier,
    controlConstructor: definition.controlConstructor
  };
}

/***/ }),

/***/ "./src/observe/mutation/attribute-observer.js":
/*!****************************************************!*\
  !*** ./src/observe/mutation/attribute-observer.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AttributeObserver": () => (/* binding */ AttributeObserver)
/* harmony export */ });
/* harmony import */ var _element_observer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./element-observer */ "./src/observe/mutation/element-observer.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }


var AttributeObserver = /*#__PURE__*/function () {
  function AttributeObserver(element, attributeName, delegate) {
    _classCallCheck(this, AttributeObserver);

    this.delegate = delegate;
    this.attributeName = attributeName;
    this.elementObserver = new _element_observer__WEBPACK_IMPORTED_MODULE_0__.ElementObserver(element, this);
  }

  _createClass(AttributeObserver, [{
    key: "element",
    get: function get() {
      return this.elementObserver.element;
    }
  }, {
    key: "selector",
    get: function get() {
      return "[".concat(this.attributeName, "]");
    }
  }, {
    key: "start",
    value: function start() {
      this.elementObserver.start();
    }
  }, {
    key: "pause",
    value: function pause(callback) {
      this.elementObserver.pause(callback);
    }
  }, {
    key: "stop",
    value: function stop() {
      this.elementObserver.stop();
    }
  }, {
    key: "refresh",
    value: function refresh() {
      this.elementObserver.refresh();
    }
  }, {
    key: "started",
    get: function get() {
      return this.elementObserver.started;
    } // Element observer delegate

  }, {
    key: "matchElement",
    value: function matchElement(element) {
      return element.hasAttribute(this.attributeName);
    }
  }, {
    key: "matchElementsInTree",
    value: function matchElementsInTree(tree) {
      var match = this.matchElement(tree) ? [tree] : [];
      var matches = Array.from(tree.querySelectorAll(this.selector));
      return match.concat(matches);
    }
  }, {
    key: "elementMatched",
    value: function elementMatched(element) {
      if (this.delegate.elementMatchedAttribute) {
        this.delegate.elementMatchedAttribute(element, this.attributeName);
      }
    }
  }, {
    key: "elementUnmatched",
    value: function elementUnmatched(element) {
      if (this.delegate.elementUnmatchedAttribute) {
        this.delegate.elementUnmatchedAttribute(element, this.attributeName);
      }
    }
  }, {
    key: "elementAttributeChanged",
    value: function elementAttributeChanged(element, attributeName) {
      if (this.delegate.elementAttributeValueChanged && this.attributeName == attributeName) {
        this.delegate.elementAttributeValueChanged(element, attributeName);
      }
    }
  }]);

  return AttributeObserver;
}();

/***/ }),

/***/ "./src/observe/mutation/element-observer.js":
/*!**************************************************!*\
  !*** ./src/observe/mutation/element-observer.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ElementObserver": () => (/* binding */ ElementObserver)
/* harmony export */ });
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

var ElementObserver = /*#__PURE__*/function () {
  function ElementObserver(element, delegate) {
    var _this = this;

    _classCallCheck(this, ElementObserver);

    this.mutationObserverInit = {
      attributes: true,
      childList: true,
      subtree: true
    };
    this.element = element;
    this.started = false;
    this.delegate = delegate;
    this.elements = new Set();
    this.mutationObserver = new MutationObserver(function (mutations) {
      return _this.processMutations(mutations);
    });
  }

  _createClass(ElementObserver, [{
    key: "start",
    value: function start() {
      if (!this.started) {
        this.started = true;
        this.mutationObserver.observe(this.element, this.mutationObserverInit);
        this.refresh();
      }
    }
  }, {
    key: "pause",
    value: function pause(callback) {
      if (this.started) {
        this.mutationObserver.disconnect();
        this.started = false;
      }

      callback();

      if (!this.started) {
        this.mutationObserver.observe(this.element, this.mutationObserverInit);
        this.started = true;
      }
    }
  }, {
    key: "stop",
    value: function stop() {
      if (this.started) {
        this.mutationObserver.takeRecords();
        this.mutationObserver.disconnect();
        this.started = false;
      }
    }
  }, {
    key: "refresh",
    value: function refresh() {
      if (this.started) {
        var matches = new Set(this.matchElementsInTree());

        for (var _i = 0, _Array$from = Array.from(this.elements); _i < _Array$from.length; _i++) {
          var element = _Array$from[_i];

          if (!matches.has(element)) {
            this.removeElement(element);
          }
        }

        for (var _i2 = 0, _Array$from2 = Array.from(matches); _i2 < _Array$from2.length; _i2++) {
          var _element = _Array$from2[_i2];
          this.addElement(_element);
        }
      }
    } // Mutation record processing

  }, {
    key: "processMutations",
    value: function processMutations(mutations) {
      if (this.started) {
        var _iterator = _createForOfIteratorHelper(mutations),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var mutation = _step.value;
            this.processMutation(mutation);
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      }
    }
  }, {
    key: "processMutation",
    value: function processMutation(mutation) {
      if (mutation.type == "attributes") {
        this.processAttributeChange(mutation.target, mutation.attributeName);
      } else if (mutation.type == "childList") {
        this.processRemovedNodes(mutation.removedNodes);
        this.processAddedNodes(mutation.addedNodes);
      }
    }
  }, {
    key: "processAttributeChange",
    value: function processAttributeChange(element, attributeName) {
      if (this.elements.has(element)) {
        if (this.delegate.elementAttributeChanged && this.matchElement(element)) {
          this.delegate.elementAttributeChanged(element, attributeName);
        } else {
          this.removeElement(element);
        }
      } else if (this.matchElement(element)) {
        this.addElement(element);
      }
    }
  }, {
    key: "processRemovedNodes",
    value: function processRemovedNodes(nodes) {
      for (var _i3 = 0, _Array$from3 = Array.from(nodes); _i3 < _Array$from3.length; _i3++) {
        var node = _Array$from3[_i3];
        var element = this.elementFromNode(node);

        if (element) {
          this.processTree(element, this.removeElement);
        }
      }
    }
  }, {
    key: "processAddedNodes",
    value: function processAddedNodes(nodes) {
      for (var _i4 = 0, _Array$from4 = Array.from(nodes); _i4 < _Array$from4.length; _i4++) {
        var node = _Array$from4[_i4];
        var element = this.elementFromNode(node);

        if (element && this.elementIsActive(element)) {
          this.processTree(element, this.addElement);
        }
      }
    } // Element matching

  }, {
    key: "matchElement",
    value: function matchElement(element) {
      return this.delegate.matchElement(element);
    }
  }, {
    key: "matchElementsInTree",
    value: function matchElementsInTree() {
      var tree = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.element;
      return this.delegate.matchElementsInTree(tree);
    }
  }, {
    key: "processTree",
    value: function processTree(tree, processor) {
      var _iterator2 = _createForOfIteratorHelper(this.matchElementsInTree(tree)),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var element = _step2.value;
          processor.call(this, element);
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    }
  }, {
    key: "elementFromNode",
    value: function elementFromNode(node) {
      if (node.nodeType == Node.ELEMENT_NODE) {
        return node;
      }
    }
  }, {
    key: "elementIsActive",
    value: function elementIsActive(element) {
      if (element.isConnected != this.element.isConnected) {
        return false;
      } else {
        return this.element.contains(element);
      }
    } // Element tracking

  }, {
    key: "addElement",
    value: function addElement(element) {
      if (!this.elements.has(element)) {
        if (this.elementIsActive(element)) {
          this.elements.add(element);

          if (this.delegate.elementMatched) {
            this.delegate.elementMatched(element);
          }
        }
      }
    }
  }, {
    key: "removeElement",
    value: function removeElement(element) {
      if (this.elements.has(element)) {
        this.elements["delete"](element);

        if (this.delegate.elementUnmatched) {
          this.delegate.elementUnmatched(element);
        }
      }
    }
  }]);

  return ElementObserver;
}();

/***/ }),

/***/ "./src/observe/mutation/index.js":
/*!***************************************!*\
  !*** ./src/observe/mutation/index.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AttributeObserver": () => (/* reexport safe */ _attribute_observer__WEBPACK_IMPORTED_MODULE_0__.AttributeObserver),
/* harmony export */   "ElementObserver": () => (/* reexport safe */ _element_observer__WEBPACK_IMPORTED_MODULE_1__.ElementObserver),
/* harmony export */   "SelectorObserver": () => (/* reexport safe */ _selector_observer__WEBPACK_IMPORTED_MODULE_2__.SelectorObserver),
/* harmony export */   "TokenListObserver": () => (/* reexport safe */ _token_list_observer__WEBPACK_IMPORTED_MODULE_3__.TokenListObserver),
/* harmony export */   "ValueListObserver": () => (/* reexport safe */ _value_list_observer__WEBPACK_IMPORTED_MODULE_4__.ValueListObserver)
/* harmony export */ });
/* harmony import */ var _attribute_observer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./attribute-observer */ "./src/observe/mutation/attribute-observer.js");
/* harmony import */ var _element_observer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./element-observer */ "./src/observe/mutation/element-observer.js");
/* harmony import */ var _selector_observer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./selector-observer */ "./src/observe/mutation/selector-observer.js");
/* harmony import */ var _token_list_observer__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./token-list-observer */ "./src/observe/mutation/token-list-observer.js");
/* harmony import */ var _value_list_observer__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./value-list-observer */ "./src/observe/mutation/value-list-observer.js");






/***/ }),

/***/ "./src/observe/mutation/selector-observer.js":
/*!***************************************************!*\
  !*** ./src/observe/mutation/selector-observer.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SelectorObserver": () => (/* binding */ SelectorObserver)
/* harmony export */ });
/* harmony import */ var _element_observer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./element-observer */ "./src/observe/mutation/element-observer.js");
/* harmony import */ var _util_multimap__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../util/multimap */ "./src/observe/util/multimap.js");
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }



var SelectorObserver = /*#__PURE__*/function () {
  function SelectorObserver(element, selector, delegate, details) {
    _classCallCheck(this, SelectorObserver);

    this._selector = selector;
    this.details = details;
    this.elementObserver = new _element_observer__WEBPACK_IMPORTED_MODULE_0__.ElementObserver(element, this);
    this.delegate = delegate;
    this.matchesByElement = new _util_multimap__WEBPACK_IMPORTED_MODULE_1__.Multimap();
  }

  _createClass(SelectorObserver, [{
    key: "started",
    get: function get() {
      return this.elementObserver.started;
    }
  }, {
    key: "selector",
    get: function get() {
      return this._selector;
    },
    set: function set(selector) {
      this._selector = selector;
      this.refresh();
    }
  }, {
    key: "start",
    value: function start() {
      this.elementObserver.start();
    }
  }, {
    key: "pause",
    value: function pause(callback) {
      this.elementObserver.pause(callback);
    }
  }, {
    key: "stop",
    value: function stop() {
      this.elementObserver.stop();
    }
  }, {
    key: "refresh",
    value: function refresh() {
      this.elementObserver.refresh();
    }
  }, {
    key: "element",
    get: function get() {
      return this.elementObserver.element;
    } // Element observer delegate

  }, {
    key: "matchElement",
    value: function matchElement(element) {
      var selector = this.selector;

      if (selector) {
        var matches = element.matches(selector);

        if (this.delegate.selectorMatchElement) {
          return matches && this.delegate.selectorMatchElement(element, this.details);
        }

        return matches;
      } else {
        return false;
      }
    }
  }, {
    key: "matchElementsInTree",
    value: function matchElementsInTree(tree) {
      var _this = this;

      var selector = this.selector;

      if (selector) {
        var match = this.matchElement(tree) ? [tree] : [];
        var matches = Array.from(tree.querySelectorAll(selector)).filter(function (match) {
          return _this.matchElement(match);
        });
        return match.concat(matches);
      } else {
        return [];
      }
    }
  }, {
    key: "elementMatched",
    value: function elementMatched(element) {
      var selector = this.selector;

      if (selector) {
        this.selectorMatched(element, selector);
      }
    }
  }, {
    key: "elementUnmatched",
    value: function elementUnmatched(element) {
      var selectors = this.matchesByElement.getKeysForValue(element);

      var _iterator = _createForOfIteratorHelper(selectors),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var selector = _step.value;
          this.selectorUnmatched(element, selector);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
  }, {
    key: "elementAttributeChanged",
    value: function elementAttributeChanged(element, _attributeName) {
      var selector = this.selector;

      if (selector) {
        var matches = this.matchElement(element);
        var matchedBefore = this.matchesByElement.has(selector, element);

        if (matches && !matchedBefore) {
          this.selectorMatched(element, selector);
        } else if (!matches && matchedBefore) {
          this.selectorUnmatched(element, selector);
        }
      }
    } // Selector management

  }, {
    key: "selectorMatched",
    value: function selectorMatched(element, selector) {
      this.delegate.selectorMatched(element, selector, this.details);
      this.matchesByElement.add(selector, element);
    }
  }, {
    key: "selectorUnmatched",
    value: function selectorUnmatched(element, selector) {
      this.delegate.selectorUnmatched(element, selector, this.details);
      this.matchesByElement["delete"](selector, element);
    }
  }]);

  return SelectorObserver;
}();

/***/ }),

/***/ "./src/observe/mutation/token-list-observer.js":
/*!*****************************************************!*\
  !*** ./src/observe/mutation/token-list-observer.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TokenListObserver": () => (/* binding */ TokenListObserver)
/* harmony export */ });
/* harmony import */ var _attribute_observer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./attribute-observer */ "./src/observe/mutation/attribute-observer.js");
/* harmony import */ var _util_multimap__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../util/multimap */ "./src/observe/util/multimap.js");
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }



var TokenListObserver = /*#__PURE__*/function () {
  function TokenListObserver(element, attributeName, delegate) {
    _classCallCheck(this, TokenListObserver);

    this.delegate = delegate;
    this.attributeObserver = new _attribute_observer__WEBPACK_IMPORTED_MODULE_0__.AttributeObserver(element, attributeName, this);
    this.tokensByElement = new _util_multimap__WEBPACK_IMPORTED_MODULE_1__.Multimap();
  }

  _createClass(TokenListObserver, [{
    key: "started",
    get: function get() {
      return this.attributeObserver.started;
    }
  }, {
    key: "start",
    value: function start() {
      this.attributeObserver.start();
    }
  }, {
    key: "pause",
    value: function pause(callback) {
      this.attributeObserver.pause(callback);
    }
  }, {
    key: "stop",
    value: function stop() {
      this.attributeObserver.stop();
    }
  }, {
    key: "refresh",
    value: function refresh() {
      this.attributeObserver.refresh();
    }
  }, {
    key: "element",
    get: function get() {
      return this.attributeObserver.element;
    }
  }, {
    key: "attributeName",
    get: function get() {
      return this.attributeObserver.attributeName;
    } // Attribute observer delegate

  }, {
    key: "elementMatchedAttribute",
    value: function elementMatchedAttribute(element) {
      this.tokensMatched(this.readTokensForElement(element));
    }
  }, {
    key: "elementAttributeValueChanged",
    value: function elementAttributeValueChanged(element) {
      var _this$refreshTokensFo = this.refreshTokensForElement(element),
          _this$refreshTokensFo2 = _slicedToArray(_this$refreshTokensFo, 2),
          unmatchedTokens = _this$refreshTokensFo2[0],
          matchedTokens = _this$refreshTokensFo2[1];

      this.tokensUnmatched(unmatchedTokens);
      this.tokensMatched(matchedTokens);
    }
  }, {
    key: "elementUnmatchedAttribute",
    value: function elementUnmatchedAttribute(element) {
      this.tokensUnmatched(this.tokensByElement.getValuesForKey(element));
    }
  }, {
    key: "tokensMatched",
    value: function tokensMatched(tokens) {
      var _this = this;

      tokens.forEach(function (token) {
        return _this.tokenMatched(token);
      });
    }
  }, {
    key: "tokensUnmatched",
    value: function tokensUnmatched(tokens) {
      var _this2 = this;

      tokens.forEach(function (token) {
        return _this2.tokenUnmatched(token);
      });
    }
  }, {
    key: "tokenMatched",
    value: function tokenMatched(token) {
      this.delegate.tokenMatched(token);
      this.tokensByElement.add(token.element, token);
    }
  }, {
    key: "tokenUnmatched",
    value: function tokenUnmatched(token) {
      this.delegate.tokenUnmatched(token);
      this.tokensByElement["delete"](token.element, token);
    }
  }, {
    key: "refreshTokensForElement",
    value: function refreshTokensForElement(element) {
      var previousTokens = this.tokensByElement.getValuesForKey(element);
      var currentTokens = this.readTokensForElement(element);
      var firstDifferingIndex = zip(previousTokens, currentTokens).findIndex(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            previousToken = _ref2[0],
            currentToken = _ref2[1];

        return !tokensAreEqual(previousToken, currentToken);
      });

      if (firstDifferingIndex == -1) {
        return [[], []];
      } else {
        return [previousTokens.slice(firstDifferingIndex), currentTokens.slice(firstDifferingIndex)];
      }
    }
  }, {
    key: "readTokensForElement",
    value: function readTokensForElement(element) {
      var attributeName = this.attributeName;
      var tokenString = element.getAttribute(attributeName) || "";
      return parseTokenString(tokenString, element, attributeName);
    }
  }]);

  return TokenListObserver;
}();

function parseTokenString(tokenString, element, attributeName) {
  return tokenString.trim().split(/\s+/).filter(function (content) {
    return content.length;
  }).map(function (content, index) {
    return {
      element: element,
      attributeName: attributeName,
      content: content,
      index: index
    };
  });
}

function zip(left, right) {
  var length = Math.max(left.length, right.length);
  return Array.from({
    length: length
  }, function (_, index) {
    return [left[index], right[index]];
  });
}

function tokensAreEqual(left, right) {
  return left && right && left.index == right.index && left.content == right.content;
}

/***/ }),

/***/ "./src/observe/mutation/value-list-observer.js":
/*!*****************************************************!*\
  !*** ./src/observe/mutation/value-list-observer.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ValueListObserver": () => (/* binding */ ValueListObserver)
/* harmony export */ });
/* harmony import */ var _token_list_observer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./token-list-observer */ "./src/observe/mutation/token-list-observer.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }


var ValueListObserver = /*#__PURE__*/function () {
  function ValueListObserver(element, attributeName, delegate) {
    _classCallCheck(this, ValueListObserver);

    this.tokenListObserver = new _token_list_observer__WEBPACK_IMPORTED_MODULE_0__.TokenListObserver(element, attributeName, this);
    this.delegate = delegate;
    this.parseResultsByToken = new WeakMap();
    this.valuesByTokenByElement = new WeakMap();
  }

  _createClass(ValueListObserver, [{
    key: "started",
    get: function get() {
      return this.tokenListObserver.started;
    }
  }, {
    key: "start",
    value: function start() {
      this.tokenListObserver.start();
    }
  }, {
    key: "stop",
    value: function stop() {
      this.tokenListObserver.stop();
    }
  }, {
    key: "refresh",
    value: function refresh() {
      this.tokenListObserver.refresh();
    }
  }, {
    key: "element",
    get: function get() {
      return this.tokenListObserver.element;
    }
  }, {
    key: "attributeName",
    get: function get() {
      return this.tokenListObserver.attributeName;
    }
  }, {
    key: "tokenMatched",
    value: function tokenMatched(token) {
      var element = token.element;

      var _this$fetchParseResul = this.fetchParseResultForToken(token),
          value = _this$fetchParseResul.value;

      if (value) {
        this.fetchValuesByTokenForElement(element).set(token, value);
        this.delegate.elementMatchedValue(element, value);
      }
    }
  }, {
    key: "tokenUnmatched",
    value: function tokenUnmatched(token) {
      var element = token.element;

      var _this$fetchParseResul2 = this.fetchParseResultForToken(token),
          value = _this$fetchParseResul2.value;

      if (value) {
        this.fetchValuesByTokenForElement(element)["delete"](token);
        this.delegate.elementUnmatchedValue(element, value);
      }
    }
  }, {
    key: "fetchParseResultForToken",
    value: function fetchParseResultForToken(token) {
      var parseResult = this.parseResultsByToken.get(token);

      if (!parseResult) {
        parseResult = this.parseToken(token);
        this.parseResultsByToken.set(token, parseResult);
      }

      return parseResult;
    }
  }, {
    key: "fetchValuesByTokenForElement",
    value: function fetchValuesByTokenForElement(element) {
      var valuesByToken = this.valuesByTokenByElement.get(element);

      if (!valuesByToken) {
        valuesByToken = new Map();
        this.valuesByTokenByElement.set(element, valuesByToken);
      }

      return valuesByToken;
    }
  }, {
    key: "parseToken",
    value: function parseToken(token) {
      try {
        var value = this.delegate.parseValueForToken(token);
        return {
          value: value
        };
      } catch (error) {
        return {
          error: error
        };
      }
    }
  }]);

  return ValueListObserver;
}();

/***/ }),

/***/ "./src/observe/namespace.js":
/*!**********************************!*\
  !*** ./src/observe/namespace.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _application__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./application */ "./src/observe/application.js");

var application = new _application__WEBPACK_IMPORTED_MODULE_0__.Application();
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  application: application,
  registerControl: function registerControl(id, control) {
    return application.register(id, control);
  },
  importControl: function importControl(id) {
    return application["import"](id);
  },
  fetchControl: function fetchControl(element) {
    return application.fetch(element);
  },
  fetchControls: function fetchControls(elements) {
    return application.fetchAll(elements);
  },
  start: function start() {
    application.startAsync();
  },
  stop: function stop() {
    application.stop();
  }
});

/***/ }),

/***/ "./src/observe/scope-observer.js":
/*!***************************************!*\
  !*** ./src/observe/scope-observer.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ScopeObserver": () => (/* binding */ ScopeObserver)
/* harmony export */ });
/* harmony import */ var _mutation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./mutation */ "./src/observe/mutation/index.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }


var ScopeObserver = /*#__PURE__*/function () {
  function ScopeObserver(element, delegate) {
    _classCallCheck(this, ScopeObserver);

    this.element = element;
    this.delegate = delegate;
    this.valueListObserver = new _mutation__WEBPACK_IMPORTED_MODULE_0__.ValueListObserver(this.element, this.controlAttribute, this);
    this.scopesByIdentifierByElement = new WeakMap();
    this.scopeReferenceCounts = new WeakMap();
  }

  _createClass(ScopeObserver, [{
    key: "start",
    value: function start() {
      this.valueListObserver.start();
    }
  }, {
    key: "stop",
    value: function stop() {
      this.valueListObserver.stop();
    }
  }, {
    key: "controlAttribute",
    get: function get() {
      return 'data-control';
    } // Value observer delegate

  }, {
    key: "parseValueForToken",
    value: function parseValueForToken(token) {
      var element = token.element,
          identifier = token.content;
      var scopesByIdentifier = this.fetchScopesByIdentifierForElement(element);
      var scope = scopesByIdentifier.get(identifier);

      if (!scope) {
        scope = this.delegate.createScopeForElementAndIdentifier(element, identifier);
        scopesByIdentifier.set(identifier, scope);
      }

      return scope;
    }
  }, {
    key: "elementMatchedValue",
    value: function elementMatchedValue(element, value) {
      var referenceCount = (this.scopeReferenceCounts.get(value) || 0) + 1;
      this.scopeReferenceCounts.set(value, referenceCount);

      if (referenceCount == 1) {
        this.delegate.scopeConnected(value);
      }
    }
  }, {
    key: "elementUnmatchedValue",
    value: function elementUnmatchedValue(element, value) {
      var referenceCount = this.scopeReferenceCounts.get(value);

      if (referenceCount) {
        this.scopeReferenceCounts.set(value, referenceCount - 1);

        if (referenceCount == 1) {
          this.delegate.scopeDisconnected(value);
        }
      }
    }
  }, {
    key: "fetchScopesByIdentifierForElement",
    value: function fetchScopesByIdentifierForElement(element) {
      var scopesByIdentifier = this.scopesByIdentifierByElement.get(element);

      if (!scopesByIdentifier) {
        scopesByIdentifier = new Map();
        this.scopesByIdentifierByElement.set(element, scopesByIdentifier);
      }

      return scopesByIdentifier;
    }
  }]);

  return ScopeObserver;
}();

/***/ }),

/***/ "./src/observe/scope.js":
/*!******************************!*\
  !*** ./src/observe/scope.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Scope": () => (/* binding */ Scope)
/* harmony export */ });
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

var Scope = /*#__PURE__*/function () {
  function Scope(element, identifier) {
    var _this = this;

    _classCallCheck(this, Scope);

    this.element = element;
    this.identifier = identifier;

    this.containsElement = function (element) {
      return element.closest(_this.controlSelector) === _this.element;
    };
  }

  _createClass(Scope, [{
    key: "findElement",
    value: function findElement(selector) {
      return this.element.matches(selector) ? this.element : this.queryElements(selector).find(this.containsElement);
    }
  }, {
    key: "findAllElements",
    value: function findAllElements(selector) {
      return [].concat(_toConsumableArray(this.element.matches(selector) ? [this.element] : []), _toConsumableArray(this.queryElements(selector).filter(this.containsElement)));
    }
  }, {
    key: "queryElements",
    value: function queryElements(selector) {
      return Array.from(this.element.querySelectorAll(selector));
    }
  }, {
    key: "controlSelector",
    get: function get() {
      return attributeValueContainsToken('data-control', this.identifier);
    }
  }, {
    key: "isDocumentScope",
    get: function get() {
      return this.element === document.documentElement;
    }
  }, {
    key: "documentScope",
    get: function get() {
      return this.isDocumentScope ? this : new Scope(document.documentElement, this.identifier);
    }
  }]);

  return Scope;
}();

function attributeValueContainsToken(attributeName, token) {
  return "[".concat(attributeName, "~=\"").concat(token, "\"]");
}

/***/ }),

/***/ "./src/observe/util/multimap.js":
/*!**************************************!*\
  !*** ./src/observe/util/multimap.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Multimap": () => (/* binding */ Multimap)
/* harmony export */ });
/* harmony import */ var _set_operations__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./set-operations */ "./src/observe/util/set-operations.js");
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }


var Multimap = /*#__PURE__*/function () {
  function Multimap() {
    _classCallCheck(this, Multimap);

    this.valuesByKey = new Map();
  }

  _createClass(Multimap, [{
    key: "keys",
    get: function get() {
      return Array.from(this.valuesByKey.keys());
    }
  }, {
    key: "values",
    get: function get() {
      var sets = Array.from(this.valuesByKey.values());
      return sets.reduce(function (values, set) {
        return values.concat(Array.from(set));
      }, React.createElement(V, null), [] > []);
    }
  }, {
    key: "size",
    get: function get() {
      var sets = Array.from(this.valuesByKey.values());
      return sets.reduce(function (size, set) {
        return size + set.size;
      }, 0);
    }
  }, {
    key: "add",
    value: function add(key, value) {
      (0,_set_operations__WEBPACK_IMPORTED_MODULE_0__.add)(this.valuesByKey, key, value);
    }
  }, {
    key: "delete",
    value: function _delete(key, value) {
      (0,_set_operations__WEBPACK_IMPORTED_MODULE_0__.del)(this.valuesByKey, key, value);
    }
  }, {
    key: "has",
    value: function has(key, value) {
      var values = this.valuesByKey.get(key);
      return values != null && values.has(value);
    }
  }, {
    key: "hasKey",
    value: function hasKey(key) {
      return this.valuesByKey.has(key);
    }
  }, {
    key: "hasValue",
    value: function hasValue(value) {
      var sets = Array.from(this.valuesByKey.values());
      return sets.some(function (set) {
        return set.has(value);
      });
    }
  }, {
    key: "getValuesForKey",
    value: function getValuesForKey(key) {
      var values = this.valuesByKey.get(key);
      return values ? Array.from(values) : [];
    }
  }, {
    key: "getKeysForValue",
    value: function getKeysForValue(value) {
      return Array.from(this.valuesByKey).filter(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            _key = _ref2[0],
            values = _ref2[1];

        return values.has(value);
      }).map(function (_ref3) {
        var _ref4 = _slicedToArray(_ref3, 2),
            key = _ref4[0],
            _values = _ref4[1];

        return key;
      });
    }
  }]);

  return Multimap;
}();

/***/ }),

/***/ "./src/observe/util/set-operations.js":
/*!********************************************!*\
  !*** ./src/observe/util/set-operations.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "add": () => (/* binding */ add),
/* harmony export */   "del": () => (/* binding */ del),
/* harmony export */   "fetch": () => (/* binding */ fetch),
/* harmony export */   "prune": () => (/* binding */ prune)
/* harmony export */ });
function add(map, key, value) {
  fetch(map, key).add(value);
}
function del(map, key, value) {
  fetch(map, key)["delete"](value);
  prune(map, key);
}
function fetch(map, key) {
  var values = map.get(key);

  if (!values) {
    values = new Set();
    map.set(key, values);
  }

  return values;
}
function prune(map, key) {
  var values = map.get(key);

  if (values != null && values.size == 0) {
    map["delete"](key);
  }
}

/***/ }),

/***/ "./src/request/actions.js":
/*!********************************!*\
  !*** ./src/request/actions.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Actions": () => (/* binding */ Actions),
/* harmony export */   "ActionsUpdateMode": () => (/* binding */ ActionsUpdateMode)
/* harmony export */ });
/* harmony import */ var _asset_manager__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./asset-manager */ "./src/request/asset-manager.js");
/* harmony import */ var _util_http_request__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../util/http-request */ "./src/util/http-request.js");
/* harmony import */ var _util_deferred__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../util/deferred */ "./src/util/deferred.js");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }




var ActionsUpdateMode = {
  replaceWith: 'replace',
  prepend: 'prepend',
  append: 'append',
  update: 'update'
};
var Actions = /*#__PURE__*/function () {
  function Actions(delegate, context, options) {
    _classCallCheck(this, Actions);

    this.el = delegate.el;
    this.delegate = delegate;
    this.context = context;
    this.options = options; // Allow override to call parent logic

    this.context.start = this.start.bind(this);
    this.context.success = this.success.bind(this);
    this.context.error = this.error.bind(this);
    this.context.complete = this.complete.bind(this);
  } // Options can override all public methods in this class


  _createClass(Actions, [{
    key: "invoke",
    value: function invoke(method, args) {
      if (this.options[method]) {
        return this.options[method].apply(this.context, args);
      } // beforeUpdate and afterUpdate are not part of context
      // since they have no base logic and won't exist here


      if (this[method]) {
        return this[method].apply(this, _toConsumableArray(args));
      }
    } // Options can also specify a non-interference "func" method, typically
    // used by eval-based data attributes that takes minimal arguments

  }, {
    key: "invokeFunc",
    value: function invokeFunc(method, data) {
      if (this.options[method]) {
        return this.options[method](this.el, data);
      }
    } // Public

  }, {
    key: "start",
    value: function start(xhr) {
      this.invoke('markAsUpdating', [true]);
    }
  }, {
    key: "success",
    value: function success(data, responseCode, xhr) {
      var _this = this;

      var updatePromise = new _util_deferred__WEBPACK_IMPORTED_MODULE_2__.Deferred(); // Halt here if beforeUpdate() or data-request-before-update returns false

      if (this.invoke('beforeUpdate', [data, responseCode, xhr]) === false) {
        return updatePromise;
      } // Halt here if the error function returns false


      if (this.invokeFunc('beforeUpdateFunc', data) === false) {
        return updatePromise;
      } // Trigger 'ajaxBeforeUpdate' on the form, halt if event.preventDefault() is called


      if (!this.delegate.applicationAllowsUpdate(data, responseCode, xhr)) {
        return updatePromise;
      }

      if (this.delegate.options.download && data instanceof Blob) {
        if (this.invoke('handleFileDownload', [data, xhr])) {
          return updatePromise;
        }
      }

      if (this.delegate.options.flash && data['X_OCTOBER_FLASH_MESSAGES']) {
        for (var type in data['X_OCTOBER_FLASH_MESSAGES']) {
          this.invoke('handleFlashMessage', [data['X_OCTOBER_FLASH_MESSAGES'][type], type]);
        }
      } // Browser event has halted the process


      if (data['X_OCTOBER_DISPATCHES'] && this.invoke('handleBrowserEvents', [data['X_OCTOBER_DISPATCHES']])) {
        return updatePromise;
      } // Proceed with the update process


      updatePromise = this.invoke('handleUpdateResponse', [data, responseCode, xhr]);
      updatePromise.done(function () {
        _this.delegate.notifyApplicationRequestSuccess(data, responseCode, xhr);

        _this.invokeFunc('successFunc', data);
      });
      return updatePromise;
    }
  }, {
    key: "error",
    value: function error(data, responseCode, xhr) {
      var _this2 = this;

      var errorMsg,
          updatePromise = new _util_deferred__WEBPACK_IMPORTED_MODULE_2__.Deferred();

      if (window.ocUnloading !== undefined && window.ocUnloading || responseCode == _util_http_request__WEBPACK_IMPORTED_MODULE_1__.SystemStatusCode.userAborted) {
        return updatePromise;
      } // Disable redirects


      this.delegate.toggleRedirect(false); // Error 406 is a "smart error" that returns response object that is
      // processed in the same fashion as a successful response. The response
      // may also dispatch events which can halt the process

      if (responseCode == 406 && data) {
        if (data['X_OCTOBER_DISPATCHES'] && this.invoke('handleBrowserEvents', [data['X_OCTOBER_DISPATCHES']])) {
          return updatePromise;
        }

        errorMsg = data['X_OCTOBER_ERROR_MESSAGE'];
        updatePromise = this.invoke('handleUpdateResponse', [data, responseCode, xhr]);
      } // Standard error with standard response text
      else {
        errorMsg = data;
        updatePromise.resolve();
      }

      updatePromise.done(function () {
        // Capture the error message on the node
        if (_this2.el !== document) {
          _this2.el.setAttribute('data-error-message', errorMsg);
        } // Trigger 'ajaxError' on the form, halt if event.preventDefault() is called


        if (!_this2.delegate.applicationAllowsError(data, responseCode, xhr)) {
          return;
        } // Halt here if the error function returns false


        if (_this2.invokeFunc('errorFunc', data) === false) {
          return;
        }

        _this2.invoke('handleErrorMessage', [errorMsg]);
      });
      return updatePromise;
    }
  }, {
    key: "complete",
    value: function complete(data, responseCode, xhr) {
      this.delegate.notifyApplicationRequestComplete(data, responseCode, xhr);
      this.invokeFunc('completeFunc', data);
      this.invoke('markAsUpdating', [false]);
    } // Custom function, requests confirmation from the user

  }, {
    key: "handleConfirmMessage",
    value: function handleConfirmMessage(message) {
      var _this3 = this;

      var promise = new _util_deferred__WEBPACK_IMPORTED_MODULE_2__.Deferred();
      promise.done(function () {
        _this3.delegate.sendInternal();
      });
      var event = this.delegate.notifyApplicationConfirmMessage(message, promise);

      if (event.defaultPrevented) {
        return false;
      }

      if (message) {
        return confirm(message);
      }
    } // Custom function, display a flash message to the user

  }, {
    key: "handleFlashMessage",
    value: function handleFlashMessage(message, type) {} // Custom function, display an error message to the user

  }, {
    key: "handleErrorMessage",
    value: function handleErrorMessage(message) {
      var event = this.delegate.notifyApplicationErrorMessage(message);

      if (event.defaultPrevented) {
        return;
      }

      if (message) {
        alert(message);
      }
    } // Custom function, focus fields with errors

  }, {
    key: "handleValidationMessage",
    value: function handleValidationMessage(message, fields) {
      this.delegate.notifyApplicationBeforeValidate(message, fields);

      if (!this.delegate.formEl) {
        return;
      }

      var isFirstInvalidField = true;

      for (var fieldName in fields) {
        var fieldCheck,
            fieldNameOptions = []; // field1[field2][field3]

        fieldCheck = fieldName.replace(/\.(\w+)/g, '[$1]');
        fieldNameOptions.push('[name="' + fieldCheck + '"]:not([disabled])');
        fieldNameOptions.push('[name="' + fieldCheck + '[]"]:not([disabled])'); // [field1][field2][field3]

        fieldCheck = ('.' + fieldName).replace(/\.(\w+)/g, '[$1]');
        fieldNameOptions.push('[name$="' + fieldCheck + '"]:not([disabled])');
        fieldNameOptions.push('[name$="' + fieldCheck + '[]"]:not([disabled])'); // field.0 → field[]

        var fieldEmpty = fieldName.replace(/\.[0-9]+$/g, '');

        if (fieldName !== fieldEmpty) {
          fieldCheck = fieldEmpty.replace(/\.(\w+)/g, '[$1]');
          fieldNameOptions.push('[name="' + fieldCheck + '[]"]:not([disabled])');
          fieldCheck = ('.' + fieldEmpty).replace(/\.(\w+)/g, '[$1]');
          fieldNameOptions.push('[name$="' + fieldCheck + '[]"]:not([disabled])');
        }

        var fieldElement = this.delegate.formEl.querySelector(fieldNameOptions.join(', '));

        if (fieldElement) {
          var event = this.delegate.notifyApplicationFieldInvalid(fieldElement, fieldName, fields[fieldName], isFirstInvalidField);

          if (isFirstInvalidField) {
            if (!event.defaultPrevented) {
              fieldElement.focus();
            }

            isFirstInvalidField = false;
          }
        }
      }
    } // Custom function, handle a browser event coming from the server

  }, {
    key: "handleBrowserEvents",
    value: function handleBrowserEvents(events) {
      var _this4 = this;

      if (!events || !events.length) {
        return false;
      }

      var defaultPrevented = false;
      events.forEach(function (dispatched) {
        var event = _this4.delegate.notifyApplicationCustomEvent(dispatched.event, _objectSpread(_objectSpread({}, dispatched.data || {}), {}, {
          context: _this4.context
        }));

        if (event.defaultPrevented) {
          defaultPrevented = true;
        }
      });
      return defaultPrevented;
    } // Custom function, redirect the browser to another location

  }, {
    key: "handleRedirectResponse",
    value: function handleRedirectResponse(href) {
      var event = this.delegate.notifyApplicationBeforeRedirect();

      if (event.defaultPrevented) {
        return;
      }

      if (oc.useTurbo && oc.useTurbo()) {
        oc.visit(href);
      } else {
        location.assign(href);
      }
    } // Mark known elements as being updated

  }, {
    key: "markAsUpdating",
    value: function markAsUpdating(isUpdating) {
      var updateOptions = this.options.update || {};

      for (var partial in updateOptions) {
        var selector = updateOptions[partial];
        var selectedEl = [];

        if (updateOptions['_self'] && partial == this.options.partial && this.delegate.partialEl) {
          selector = updateOptions['_self'];
          selectedEl = [this.delegate.partialEl];
        } else {
          selectedEl = resolveSelectorResponse(selector, '[data-ajax-partial="' + partial + '"]');
        }

        selectedEl.forEach(function (el) {
          if (isUpdating) {
            el.setAttribute('data-ajax-updating', '');
          } else {
            el.removeAttribute('data-ajax-updating');
          }
        });
      }
    } // Custom function, handle any application specific response values
    // Using a promissory object here in case injected assets need time to load

  }, {
    key: "handleUpdateResponse",
    value: function handleUpdateResponse(data, responseCode, xhr) {
      var _this5 = this;

      var updateOptions = this.options.update || {},
          updatePromise = new _util_deferred__WEBPACK_IMPORTED_MODULE_2__.Deferred(); // Update partials and finish request

      updatePromise.done(function () {
        var _loop = function _loop() {
          // If a partial has been supplied on the client side that matches the server supplied key, look up
          // it's selector and use that. If not, we assume it is an explicit selector reference.
          var selector = updateOptions[partial] || partial;
          var selectedEl = []; // If the update options has a _self, values like true and '^' will resolve to the partial element,
          // these values are also used to make AJAX partial handlers available without performing an update

          if (updateOptions['_self'] && partial == _this5.options.partial && _this5.delegate.partialEl) {
            selector = updateOptions['_self'];
            selectedEl = [_this5.delegate.partialEl];
          } else {
            selectedEl = resolveSelectorResponse(selector, '[data-ajax-partial="' + partial + '"]');
          }

          selectedEl.forEach(function (el) {
            var updateMode = getSelectorUpdateMode(selector, el); // Replace With

            if (updateMode === ActionsUpdateMode.replaceWith) {
              var parentNode = el.parentNode;
              el.insertAdjacentHTML('afterEnd', data[partial]);
              parentNode.removeChild(el);
              runScriptsOnFragment(parentNode, data[partial]);
            } // Append
            else if (updateMode === ActionsUpdateMode.append) {
              el.insertAdjacentHTML('beforeEnd', data[partial]);
              runScriptsOnFragment(el, data[partial]);
            } // Prepend
            else if (updateMode === ActionsUpdateMode.prepend) {
              el.insertAdjacentHTML('afterBegin', data[partial]);
              runScriptsOnFragment(el, data[partial]);
            } // Insert
            else {
              _this5.delegate.notifyApplicationBeforeReplace(el);

              el.innerHTML = data[partial];
              runScriptsOnElement(el);
            }

            _this5.delegate.notifyApplicationAjaxUpdate(el, data, responseCode, xhr);
          });
        };

        for (var partial in data) {
          _loop();
        } // Wait for update method to finish rendering from partial updates


        setTimeout(function () {
          _this5.delegate.notifyApplicationUpdateComplete(data, responseCode, xhr);

          _this5.invoke('afterUpdate', [data, responseCode, xhr]);

          _this5.invokeFunc('afterUpdateFunc', data);
        }, 0);
      }); // Handle redirect

      if (data['X_OCTOBER_REDIRECT']) {
        this.delegate.toggleRedirect(data['X_OCTOBER_REDIRECT']);
      }

      if (this.delegate.isRedirect) {
        this.invoke('handleRedirectResponse', [this.delegate.options.redirect]);
      } // Handle validation


      if (data['X_OCTOBER_ERROR_FIELDS']) {
        this.invoke('handleValidationMessage', [data['X_OCTOBER_ERROR_MESSAGE'], data['X_OCTOBER_ERROR_FIELDS']]);
      } // Handle asset injection


      if (data['X_OCTOBER_ASSETS']) {
        _asset_manager__WEBPACK_IMPORTED_MODULE_0__.AssetManager.load(data['X_OCTOBER_ASSETS'], function () {
          return updatePromise.resolve();
        });
      } else {
        updatePromise.resolve();
      }

      return updatePromise;
    } // Custom function, download a file response from the server

  }, {
    key: "handleFileDownload",
    value: function handleFileDownload(data, xhr) {
      if (this.options.browserTarget) {
        window.open(window.URL.createObjectURL(data), this.options.browserTarget);
        return true;
      }

      var fileName = typeof this.options.download === 'string' ? this.options.download : getFilenameFromHttpResponse(xhr);

      if (fileName) {
        var anchor = document.createElement('a');
        anchor.href = window.URL.createObjectURL(data);
        anchor.download = fileName;
        anchor.target = '_blank';
        anchor.click();
        window.URL.revokeObjectURL(anchor.href);
        return true;
      }
    } // Custom function, adds query data to the current URL

  }, {
    key: "applyQueryToUrl",
    value: function applyQueryToUrl(queryData) {
      var searchParams = new URLSearchParams(window.location.search);

      var _loop2 = function _loop2() {
        var key = _Object$keys[_i];
        var value = queryData[key];

        if (Array.isArray(value)) {
          searchParams["delete"](key);
          searchParams["delete"]("".concat(key, "[]"));
          value.forEach(function (val) {
            return searchParams.append("".concat(key, "[]"), val);
          });
        } else if (value === null) {
          searchParams["delete"](key);
          searchParams["delete"]("".concat(key, "[]"));
        } else {
          searchParams.set(key, value);
        }
      };

      for (var _i = 0, _Object$keys = Object.keys(queryData); _i < _Object$keys.length; _i++) {
        _loop2();
      }

      var newUrl = window.location.pathname,
          queryStr = searchParams.toString();

      if (queryStr) {
        newUrl += '?' + searchParams.toString().replaceAll('%5B%5D=', '[]=');
      }

      if (oc.useTurbo && oc.useTurbo()) {
        oc.visit(newUrl, {
          action: 'swap',
          scroll: false
        });
      } else {
        history.replaceState(null, '', newUrl); // Tracking referrer since document.referrer will not update

        localStorage.setItem('ocPushStateReferrer', newUrl);
      }
    }
  }]);

  return Actions;
}();

function resolveSelectorResponse(selector, partialSelector) {
  // Look for AJAX partial selectors
  if (selector === true) {
    return document.querySelectorAll(partialSelector);
  } // Selector is DOM element


  if (typeof selector !== 'string') {
    return [selector];
  } // Invalid selector


  if (['#', '.', '@', '^', '!', '='].indexOf(selector.charAt(0)) === -1) {
    return [];
  } // Append, prepend, replace with or custom selector


  if (['@', '^', '!', '='].indexOf(selector.charAt(0)) !== -1) {
    selector = selector.substring(1);
  } // Empty selector remains


  if (!selector) {
    selector = partialSelector;
  }

  return document.querySelectorAll(selector);
}

function getSelectorUpdateMode(selector, el) {
  // Look at selector prefix
  if (typeof selector === 'string') {
    if (selector.charAt(0) === '!') {
      return ActionsUpdateMode.replaceWith;
    }

    if (selector.charAt(0) === '@') {
      return ActionsUpdateMode.append;
    }

    if (selector.charAt(0) === '^') {
      return ActionsUpdateMode.prepend;
    }
  } // Look at element dataset


  if (el.dataset.ajaxUpdateMode !== undefined) {
    return el.dataset.ajaxUpdateMode;
  } // Default mode


  return ActionsUpdateMode.update;
} // Replaces blocked scripts with fresh nodes


function runScriptsOnElement(el) {
  Array.from(el.querySelectorAll('script')).forEach(function (oldScript) {
    var newScript = document.createElement('script');
    Array.from(oldScript.attributes).forEach(function (attr) {
      return newScript.setAttribute(attr.name, attr.value);
    });
    newScript.appendChild(document.createTextNode(oldScript.innerHTML));
    oldScript.parentNode.replaceChild(newScript, oldScript);
  });
} // Runs scripts on a fragment inside a container


function runScriptsOnFragment(container, html) {
  var div = document.createElement('div');
  div.innerHTML = html;
  Array.from(div.querySelectorAll('script')).forEach(function (oldScript) {
    var newScript = document.createElement('script');
    Array.from(oldScript.attributes).forEach(function (attr) {
      return newScript.setAttribute(attr.name, attr.value);
    });
    newScript.appendChild(document.createTextNode(oldScript.innerHTML));
    container.appendChild(newScript);
    container.removeChild(newScript);
  });
}

function getFilenameFromHttpResponse(xhr) {
  var contentDisposition = xhr.getResponseHeader('Content-Disposition');

  if (!contentDisposition) {
    return null;
  }

  var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/g;
  var match = null;
  var tmpMatch = null;

  while ((tmpMatch = filenameRegex.exec(contentDisposition)) !== null) {
    match = tmpMatch;
  }

  if (match !== null && match[1]) {
    // Decide ASCII or UTF-8 file name
    return /filename[^;*=\n]*\*=[^']*''/.exec(match[0]) === null ? match[1].replace(/['"]/g, '') : decodeURIComponent(match[1].substring(match[1].indexOf("''") + 2));
  }

  return null;
}

/***/ }),

/***/ "./src/request/asset-manager.js":
/*!**************************************!*\
  !*** ./src/request/asset-manager.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AssetManager": () => (/* binding */ AssetManager)
/* harmony export */ });
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

var AssetManager = /*#__PURE__*/function () {
  function AssetManager() {
    _classCallCheck(this, AssetManager);
  }

  _createClass(AssetManager, [{
    key: "loadCollection",
    value: function loadCollection(collection, callback) {
      var self = this,
          jsList = collection.js ? collection.js : [],
          cssList = collection.css ? collection.css : [],
          imgList = collection.img ? collection.img : [];
      jsList = assGrep(jsList, function (item) {
        return !document.querySelector('head script[src="' + item + '"]');
      });
      cssList = assGrep(cssList, function (item) {
        return !document.querySelector('head link[href="' + item + '"]');
      });
      var cssCounter = 0,
          jsLoaded = false,
          imgLoaded = false;

      if (jsList.length === 0 && cssList.length === 0 && imgList.length === 0) {
        callback && callback();
        return;
      }

      this.loadJavaScript(jsList, function () {
        jsLoaded = true;
        checkLoaded();
      });
      cssList.forEach(function (source) {
        self.loadStyleSheet(source, function () {
          cssCounter++;
          checkLoaded();
        });
      });
      this.loadImage(imgList, function () {
        imgLoaded = true;
        checkLoaded();
      });

      function checkLoaded() {
        if (!imgLoaded) {
          return false;
        }

        if (!jsLoaded) {
          return false;
        }

        if (cssCounter < cssList.length) {
          return false;
        }

        callback && callback();
      }
    } // Loads StyleSheet files

  }, {
    key: "loadStyleSheet",
    value: function loadStyleSheet(source, callback) {
      var cssElement = document.createElement('link');
      cssElement.setAttribute('rel', 'stylesheet');
      cssElement.setAttribute('type', 'text/css');
      cssElement.setAttribute('href', source);
      cssElement.addEventListener('load', callback, false);

      if (typeof cssElement != 'undefined') {
        document.getElementsByTagName('head')[0].appendChild(cssElement);
      }

      return cssElement;
    } // Loads JavaScript files in sequence

  }, {
    key: "loadJavaScript",
    value: function loadJavaScript(sources, callback) {
      if (sources.length <= 0) {
        return callback();
      }

      var self = this,
          source = sources.shift(),
          jsElement = document.createElement('script');
      jsElement.setAttribute('type', 'text/javascript');
      jsElement.setAttribute('src', source);
      jsElement.addEventListener('load', function () {
        self.loadJavaScript(sources, callback);
      }, false);

      if (typeof jsElement != 'undefined') {
        document.getElementsByTagName('head')[0].appendChild(jsElement);
      }
    } // Loads Image files

  }, {
    key: "loadImage",
    value: function loadImage(sources, callback) {
      if (sources.length <= 0) {
        return callback();
      }

      var loaded = 0;
      sources.forEach(function (source) {
        var img = new Image();

        img.onload = function () {
          if (++loaded == sources.length && callback) {
            callback();
          }
        };

        img.src = source;
      });
    }
  }], [{
    key: "load",
    value: function load(collection, callback) {
      return new AssetManager().loadCollection(collection, callback);
    }
  }]);

  return AssetManager;
}();

function assGrep(items, callback) {
  var filtered = [],
      len = items.length,
      i = 0;

  for (i; i < len; i++) {
    if (callback(items[i])) {
      filtered.push(items[i]);
    }
  }

  return filtered;
}

/***/ }),

/***/ "./src/request/data.js":
/*!*****************************!*\
  !*** ./src/request/data.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Data": () => (/* binding */ Data)
/* harmony export */ });
/* harmony import */ var _util_form_serializer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../util/form-serializer */ "./src/util/form-serializer.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }


var Data = /*#__PURE__*/function () {
  function Data(userData, targetEl, formEl) {
    _classCallCheck(this, Data);

    this.userData = userData || {};
    this.targetEl = targetEl;
    this.formEl = formEl;
  } // Public


  _createClass(Data, [{
    key: "getRequestData",
    value: function getRequestData() {
      var requestData; // Serialize form

      if (this.formEl) {
        requestData = new FormData(this.formEl);
      } else {
        requestData = new FormData();
      } // Add single input data


      this.appendSingleInputElement(requestData);
      return requestData;
    }
  }, {
    key: "getAsFormData",
    value: function getAsFormData() {
      return this.appendJsonToFormData(this.getRequestData(), this.userData);
    }
  }, {
    key: "getAsQueryString",
    value: function getAsQueryString() {
      return this.convertFormDataToQuery(this.getAsFormData());
    }
  }, {
    key: "getAsJsonData",
    value: function getAsJsonData() {
      return JSON.stringify(this.convertFormDataToJson(this.getAsFormData()));
    } // Private

  }, {
    key: "appendSingleInputElement",
    value: function appendSingleInputElement(requestData) {
      // Has a form, no target element, or not a singular input
      if (this.formEl || !this.targetEl || !isElementInput(this.targetEl)) {
        return;
      } // No name or supplied by user data already


      var inputName = this.targetEl.name;

      if (!inputName || this.userData[inputName] !== undefined) {
        return;
      } // Include files, if they are any


      if (this.targetEl.type === 'file') {
        this.targetEl.files.forEach(function (value) {
          requestData.append(inputName, value);
        });
      } else {
        requestData.append(inputName, this.targetEl.value);
      }
    }
  }, {
    key: "appendJsonToFormData",
    value: function appendJsonToFormData(formData, useJson, parentKey) {
      var self = this;

      for (var key in useJson) {
        var fieldKey = key;

        if (parentKey) {
          fieldKey = parentKey + '[' + key + ']';
        }

        var value = useJson[key]; // Object

        if (value && value.constructor === {}.constructor) {
          this.appendJsonToFormData(formData, value, fieldKey);
        } // Array
        else if (value && value.constructor === [].constructor) {
          value.forEach(function (v, i) {
            if (v.constructor === {}.constructor || v.constructor === [].constructor) {
              self.appendJsonToFormData(formData, v, fieldKey + '[' + i + ']');
            } else {
              formData.append(fieldKey + '[]', self.castJsonToFormData(v));
            }
          });
        } // Mixed
        else {
          formData.append(fieldKey, this.castJsonToFormData(value));
        }
      }

      return formData;
    }
  }, {
    key: "convertFormDataToQuery",
    value: function convertFormDataToQuery(formData) {
      // Process to a flat object with array values
      var flatData = this.formDataToArray(formData); // Process HTML names to a query string

      return Object.keys(flatData).map(function (key) {
        if (key.endsWith('[]')) {
          return flatData[key].map(function (val) {
            return encodeURIComponent(key) + '=' + encodeURIComponent(val);
          }).join('&');
        } else {
          return encodeURIComponent(key) + '=' + encodeURIComponent(flatData[key]);
        }
      }).join('&');
    }
  }, {
    key: "convertFormDataToJson",
    value: function convertFormDataToJson(formData) {
      // Process to a flat object with array values
      var flatData = this.formDataToArray(formData); // Process HTML names to a nested object

      var jsonData = {};

      for (var key in flatData) {
        _util_form_serializer__WEBPACK_IMPORTED_MODULE_0__.FormSerializer.assignToObj(jsonData, key, flatData[key]);
      }

      return jsonData;
    }
  }, {
    key: "formDataToArray",
    value: function formDataToArray(formData) {
      return Object.fromEntries(Array.from(formData.keys()).map(function (key) {
        return [key, key.endsWith('[]') ? formData.getAll(key) : formData.getAll(key).pop()];
      }));
    }
  }, {
    key: "castJsonToFormData",
    value: function castJsonToFormData(val) {
      if (val === null) {
        return '';
      }

      if (val === true) {
        return '1';
      }

      if (val === false) {
        return '0';
      }

      return val;
    }
  }]);

  return Data;
}();

function isElementInput(el) {
  return ['input', 'select', 'textarea'].includes((el.tagName || '').toLowerCase());
}

/***/ }),

/***/ "./src/request/index.js":
/*!******************************!*\
  !*** ./src/request/index.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _asset_manager__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./asset-manager */ "./src/request/asset-manager.js");
/* harmony import */ var _namespace__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./namespace */ "./src/request/namespace.js");


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_namespace__WEBPACK_IMPORTED_MODULE_1__["default"]);

if (!window.oc) {
  window.oc = {};
}

if (!window.oc.AjaxRequest) {
  // Namespace
  window.oc.AjaxRequest = _namespace__WEBPACK_IMPORTED_MODULE_1__["default"]; // Asset manager

  window.oc.AssetManager = _asset_manager__WEBPACK_IMPORTED_MODULE_0__.AssetManager; // Request without element

  window.oc.ajax = _namespace__WEBPACK_IMPORTED_MODULE_1__["default"].send; // Request on element (framework can override)

  if (!window.oc.request) {
    window.oc.request = _namespace__WEBPACK_IMPORTED_MODULE_1__["default"].sendElement;
  }
}

/***/ }),

/***/ "./src/request/namespace.js":
/*!**********************************!*\
  !*** ./src/request/namespace.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _request__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./request */ "./src/request/request.js");

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_request__WEBPACK_IMPORTED_MODULE_0__.Request);

/***/ }),

/***/ "./src/request/options.js":
/*!********************************!*\
  !*** ./src/request/options.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Options": () => (/* binding */ Options)
/* harmony export */ });
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

var Options = /*#__PURE__*/function () {
  function Options(handler, options) {
    _classCallCheck(this, Options);

    if (!handler) {
      throw new Error('The request handler name is not specified.');
    }

    if (!handler.match(/^(?:\w+\:{2})?on*/)) {
      throw new Error('Invalid handler name. The correct handler name format is: "onEvent".');
    }

    if (typeof FormData === 'undefined') {
      throw new Error('The browser does not support the FormData interface.');
    }

    this.options = options;
    this.handler = handler;
  }

  _createClass(Options, [{
    key: "getRequestOptions",
    value: // Public
    function getRequestOptions() {
      return {
        method: 'POST',
        url: this.options.url ? this.options.url : window.location.href,
        headers: this.buildHeaders(),
        responseType: this.options.download === false ? '' : 'blob'
      };
    } // Private

  }, {
    key: "buildHeaders",
    value: function buildHeaders() {
      var handler = this.handler,
          options = this.options;
      var headers = {
        'X-Requested-With': 'XMLHttpRequest',
        'X-OCTOBER-REQUEST-HANDLER': handler
      };

      if (!options.files) {
        headers['Content-Type'] = options.bulk ? 'application/json' : 'application/x-www-form-urlencoded';
      }

      if (options.flash) {
        headers['X-OCTOBER-REQUEST-FLASH'] = 1;
      }

      if (options.partial) {
        headers['X-OCTOBER-REQUEST-PARTIAL'] = options.partial;
      }

      var partials = this.extractPartials(options.update, options.partial);

      if (partials) {
        headers['X-OCTOBER-REQUEST-PARTIALS'] = partials;
      }

      var xsrfToken = this.getXSRFToken();

      if (xsrfToken) {
        headers['X-XSRF-TOKEN'] = xsrfToken;
      }

      var csrfToken = this.getCSRFToken();

      if (csrfToken) {
        headers['X-CSRF-TOKEN'] = csrfToken;
      }

      if (options.headers && options.headers.constructor === {}.constructor) {
        Object.assign(headers, options.headers);
      }

      return headers;
    }
  }, {
    key: "extractPartials",
    value: function extractPartials() {
      var update = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var selfPartial = arguments.length > 1 ? arguments[1] : undefined;
      var result = [];

      if (update) {
        if (_typeof(update) !== 'object') {
          throw new Error('Invalid update value. The correct format is an object ({...})');
        }

        for (var partial in update) {
          if (partial === '_self' && selfPartial) {
            result.push(selfPartial);
          } else {
            result.push(partial);
          }
        }
      }

      return result.join('&');
    }
  }, {
    key: "getCSRFToken",
    value: function getCSRFToken() {
      var tag = document.querySelector('meta[name="csrf-token"]');
      return tag ? tag.getAttribute('content') : null;
    }
  }, {
    key: "getXSRFToken",
    value: function getXSRFToken() {
      var cookieValue = null;

      if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');

        for (var i = 0; i < cookies.length; i++) {
          var cookie = cookies[i].replace(/^([\s]*)|([\s]*)$/g, '');

          if (cookie.substring(0, 11) == 'XSRF-TOKEN' + '=') {
            cookieValue = decodeURIComponent(cookie.substring(11));
            break;
          }
        }
      }

      return cookieValue;
    }
  }], [{
    key: "fetch",
    value: function fetch(handler, options) {
      return new this(handler, options).getRequestOptions();
    }
  }]);

  return Options;
}();

/***/ }),

/***/ "./src/request/request.js":
/*!********************************!*\
  !*** ./src/request/request.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Request": () => (/* binding */ Request)
/* harmony export */ });
/* harmony import */ var _options__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./options */ "./src/request/options.js");
/* harmony import */ var _actions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./actions */ "./src/request/actions.js");
/* harmony import */ var _data__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./data */ "./src/request/data.js");
/* harmony import */ var _util_http_request__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../util/http-request */ "./src/util/http-request.js");
/* harmony import */ var _util_deferred__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../util/deferred */ "./src/util/deferred.js");
/* harmony import */ var _extras_progress_bar__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../extras/progress-bar */ "./src/extras/progress-bar.js");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../util */ "./src/util/index.js");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }








var Request = /*#__PURE__*/function () {
  function Request(element, handler, options) {
    var _this = this;

    _classCallCheck(this, Request);

    this.el = element;
    this.handler = handler;
    this.options = _objectSpread(_objectSpread({}, this.constructor.DEFAULTS), options || {});
    this.context = {
      el: element,
      handler: handler,
      options: this.options
    };
    this.progressBar = new _extras_progress_bar__WEBPACK_IMPORTED_MODULE_5__.ProgressBar();

    this.showProgressBar = function () {
      _this.progressBar.show({
        cssClass: 'is-ajax'
      });
    };
  }

  _createClass(Request, [{
    key: "start",
    value: function start() {
      // Setup
      this.notifyApplicationAjaxSetup();
      this.initOtherElements();
      this.preprocessOptions(); // Prepare actions

      this.actions = new _actions__WEBPACK_IMPORTED_MODULE_1__.Actions(this, this.context, this.options);

      if (!this.validateClientSideForm() || !this.applicationAllowsRequest()) {
        return;
      } // Prepare data


      var dataObj = new _data__WEBPACK_IMPORTED_MODULE_2__.Data(this.options.data, this.el, this.formEl);
      var data;

      if (this.options.files) {
        data = dataObj.getAsFormData();
      } else if (this.options.bulk) {
        data = dataObj.getAsJsonData();
      } else {
        data = dataObj.getAsQueryString();
      } // Prepare query


      if (this.options.query) {
        this.actions.invoke('applyQueryToUrl', [this.options.query]);
      } // Prepare request


      var _Options$fetch = _options__WEBPACK_IMPORTED_MODULE_0__.Options.fetch(this.handler, this.options),
          url = _Options$fetch.url,
          headers = _Options$fetch.headers,
          method = _Options$fetch.method,
          responseType = _Options$fetch.responseType;

      this.request = new _util_http_request__WEBPACK_IMPORTED_MODULE_3__.HttpRequest(this, url, {
        method: method,
        headers: headers,
        responseType: responseType,
        data: data,
        trackAbort: true
      });
      this.promise = new _util_deferred__WEBPACK_IMPORTED_MODULE_4__.Deferred({
        delegate: this.request
      });
      this.isRedirect = this.options.redirect && this.options.redirect.length > 0; // Confirm before sending

      if (this.options.confirm && !this.actions.invoke('handleConfirmMessage', [this.options.confirm])) {
        return;
      } // Send request


      this.sendInternal();
      return this.options.async ? this.wrapInAsyncPromise(this.promise) : this.promise;
    }
  }, {
    key: "sendInternal",
    value: function sendInternal() {
      var self = this;
      this.notifyApplicationBeforeSend();
      this.notifyApplicationAjaxPromise();
      this.promise.fail(function (data, responseCode, xhr) {
        if (!self.isRedirect) {
          self.notifyApplicationAjaxFail(data, responseCode, xhr);
        }
      }).done(function (data, responseCode, xhr) {
        if (!self.isRedirect) {
          self.notifyApplicationAjaxDone(data, responseCode, xhr);
        }
      }).always(function (data, responseCode, xhr) {
        self.notifyApplicationAjaxAlways(data, responseCode, xhr);
      });
      this.request.send();
    }
  }, {
    key: "toggleRedirect",
    value: function toggleRedirect(redirectUrl) {
      if (!redirectUrl) {
        this.options.redirect = null;
        this.isRedirect = false;
      } else {
        this.options.redirect = redirectUrl;
        this.isRedirect = true;
      }
    }
  }, {
    key: "applicationAllowsRequest",
    value: function applicationAllowsRequest() {
      var event = this.notifyApplicationBeforeRequest();
      return !event.defaultPrevented;
    }
  }, {
    key: "applicationAllowsUpdate",
    value: function applicationAllowsUpdate(data, responseCode, xhr) {
      var event = this.notifyApplicationBeforeUpdate(data, responseCode, xhr);
      return !event.defaultPrevented;
    }
  }, {
    key: "applicationAllowsError",
    value: function applicationAllowsError(message, responseCode, xhr) {
      var event = this.notifyApplicationRequestError(message, responseCode, xhr);
      return !event.defaultPrevented;
    } // Application events

  }, {
    key: "notifyApplicationAjaxSetup",
    value: function notifyApplicationAjaxSetup() {
      return (0,_util__WEBPACK_IMPORTED_MODULE_6__.dispatch)('ajax:setup', {
        target: this.el,
        detail: {
          context: this.context
        }
      });
    }
  }, {
    key: "notifyApplicationAjaxPromise",
    value: function notifyApplicationAjaxPromise() {
      return (0,_util__WEBPACK_IMPORTED_MODULE_6__.dispatch)('ajax:promise', {
        target: this.el,
        detail: {
          context: this.context
        }
      });
    }
  }, {
    key: "notifyApplicationAjaxFail",
    value: function notifyApplicationAjaxFail(data, responseCode, xhr) {
      return (0,_util__WEBPACK_IMPORTED_MODULE_6__.dispatch)('ajax:fail', {
        target: this.el,
        detail: {
          context: this.context,
          data: data,
          responseCode: responseCode,
          xhr: xhr
        }
      });
    }
  }, {
    key: "notifyApplicationAjaxDone",
    value: function notifyApplicationAjaxDone(data, responseCode, xhr) {
      return (0,_util__WEBPACK_IMPORTED_MODULE_6__.dispatch)('ajax:done', {
        target: this.el,
        detail: {
          context: this.context,
          data: data,
          responseCode: responseCode,
          xhr: xhr
        }
      });
    }
  }, {
    key: "notifyApplicationAjaxAlways",
    value: function notifyApplicationAjaxAlways(data, responseCode, xhr) {
      return (0,_util__WEBPACK_IMPORTED_MODULE_6__.dispatch)('ajax:always', {
        target: this.el,
        detail: {
          context: this.context,
          data: data,
          responseCode: responseCode,
          xhr: xhr
        }
      });
    }
  }, {
    key: "notifyApplicationAjaxUpdate",
    value: function notifyApplicationAjaxUpdate(target, data, responseCode, xhr) {
      return (0,_util__WEBPACK_IMPORTED_MODULE_6__.dispatch)('ajax:update', {
        target: target,
        detail: {
          context: this.context,
          data: data,
          responseCode: responseCode,
          xhr: xhr
        }
      });
    }
  }, {
    key: "notifyApplicationBeforeRedirect",
    value: function notifyApplicationBeforeRedirect() {
      return (0,_util__WEBPACK_IMPORTED_MODULE_6__.dispatch)('ajax:before-redirect', {
        target: this.el
      });
    }
  }, {
    key: "notifyApplicationBeforeRequest",
    value: function notifyApplicationBeforeRequest() {
      return (0,_util__WEBPACK_IMPORTED_MODULE_6__.dispatch)('ajax:before-request', {
        target: this.triggerEl,
        detail: {
          context: this.context
        }
      });
    }
  }, {
    key: "notifyApplicationBeforeUpdate",
    value: function notifyApplicationBeforeUpdate(data, responseCode, xhr) {
      return (0,_util__WEBPACK_IMPORTED_MODULE_6__.dispatch)('ajax:before-update', {
        target: this.triggerEl,
        detail: {
          context: this.context,
          data: data,
          responseCode: responseCode,
          xhr: xhr
        }
      });
    }
  }, {
    key: "notifyApplicationRequestSuccess",
    value: function notifyApplicationRequestSuccess(data, responseCode, xhr) {
      return (0,_util__WEBPACK_IMPORTED_MODULE_6__.dispatch)('ajax:request-success', {
        target: this.triggerEl,
        detail: {
          context: this.context,
          data: data,
          responseCode: responseCode,
          xhr: xhr
        }
      });
    }
  }, {
    key: "notifyApplicationRequestError",
    value: function notifyApplicationRequestError(message, responseCode, xhr) {
      return (0,_util__WEBPACK_IMPORTED_MODULE_6__.dispatch)('ajax:request-error', {
        target: this.triggerEl,
        detail: {
          context: this.context,
          message: message,
          responseCode: responseCode,
          xhr: xhr
        }
      });
    }
  }, {
    key: "notifyApplicationRequestComplete",
    value: function notifyApplicationRequestComplete(data, responseCode, xhr) {
      return (0,_util__WEBPACK_IMPORTED_MODULE_6__.dispatch)('ajax:request-complete', {
        target: this.triggerEl,
        detail: {
          context: this.context,
          data: data,
          responseCode: responseCode,
          xhr: xhr
        }
      });
    }
  }, {
    key: "notifyApplicationBeforeValidate",
    value: function notifyApplicationBeforeValidate(message, fields) {
      return (0,_util__WEBPACK_IMPORTED_MODULE_6__.dispatch)('ajax:before-validate', {
        target: this.triggerEl,
        detail: {
          context: this.context,
          message: message,
          fields: fields
        }
      });
    }
  }, {
    key: "notifyApplicationBeforeReplace",
    value: function notifyApplicationBeforeReplace(target) {
      return (0,_util__WEBPACK_IMPORTED_MODULE_6__.dispatch)('ajax:before-replace', {
        target: target
      });
    } // Window-based events

  }, {
    key: "notifyApplicationBeforeSend",
    value: function notifyApplicationBeforeSend() {
      return (0,_util__WEBPACK_IMPORTED_MODULE_6__.dispatch)('ajax:before-send', {
        target: window,
        detail: {
          context: this.context
        }
      });
    }
  }, {
    key: "notifyApplicationUpdateComplete",
    value: function notifyApplicationUpdateComplete(data, responseCode, xhr) {
      return (0,_util__WEBPACK_IMPORTED_MODULE_6__.dispatch)('ajax:update-complete', {
        target: window,
        detail: {
          context: this.context,
          data: data,
          responseCode: responseCode,
          xhr: xhr
        }
      });
    }
  }, {
    key: "notifyApplicationFieldInvalid",
    value: function notifyApplicationFieldInvalid(element, fieldName, errorMsg, isFirst) {
      return (0,_util__WEBPACK_IMPORTED_MODULE_6__.dispatch)('ajax:invalid-field', {
        target: window,
        detail: {
          element: element,
          fieldName: fieldName,
          errorMsg: errorMsg,
          isFirst: isFirst
        }
      });
    }
  }, {
    key: "notifyApplicationConfirmMessage",
    value: function notifyApplicationConfirmMessage(message, promise) {
      return (0,_util__WEBPACK_IMPORTED_MODULE_6__.dispatch)('ajax:confirm-message', {
        target: window,
        detail: {
          message: message,
          promise: promise
        }
      });
    }
  }, {
    key: "notifyApplicationErrorMessage",
    value: function notifyApplicationErrorMessage(message) {
      return (0,_util__WEBPACK_IMPORTED_MODULE_6__.dispatch)('ajax:error-message', {
        target: window,
        detail: {
          message: message
        }
      });
    }
  }, {
    key: "notifyApplicationCustomEvent",
    value: function notifyApplicationCustomEvent(name, data) {
      return (0,_util__WEBPACK_IMPORTED_MODULE_6__.dispatch)(name, {
        target: this.el,
        detail: data
      });
    } // HTTP request delegate

  }, {
    key: "requestStarted",
    value: function requestStarted() {
      this.markAsProgress(true);
      this.toggleLoadingElement(true);

      if (this.options.progressBar) {
        this.showProgressBarAfterDelay();
      }

      this.actions.invoke('start', [this.request.xhr]);
    }
  }, {
    key: "requestProgressed",
    value: function requestProgressed(progress) {
      this.promise.notify(progress);
    }
  }, {
    key: "requestCompletedWithResponse",
    value: function requestCompletedWithResponse(response, statusCode) {
      this.actions.invoke('success', [response, statusCode, this.request.xhr]);
      this.actions.invoke('complete', [response, statusCode, this.request.xhr]);
      this.promise.resolve(response, statusCode, this.request.xhr);
    }
  }, {
    key: "requestFailedWithStatusCode",
    value: function requestFailedWithStatusCode(statusCode, response) {
      this.actions.invoke('error', [response, statusCode, this.request.xhr]);
      this.actions.invoke('complete', [response, statusCode, this.request.xhr]);
      this.promise.reject(response, statusCode, this.request.xhr);
    }
  }, {
    key: "requestFinished",
    value: function requestFinished() {
      this.markAsProgress(false);
      this.toggleLoadingElement(false);

      if (this.options.progressBar) {
        this.hideProgressBar();
      }
    } // Private

  }, {
    key: "initOtherElements",
    value: function initOtherElements() {
      if (typeof this.options.form === 'string') {
        this.formEl = document.querySelector(this.options.form);
      } else if (this.options.form) {
        this.formEl = this.options.form;
      } else {
        this.formEl = this.el && this.el !== document ? this.el.closest('form') : null;
      }

      this.triggerEl = this.formEl ? this.formEl : this.el;
      this.partialEl = this.el && this.el !== document ? this.el.closest('[data-ajax-partial]') : null;
      this.loadingEl = typeof this.options.loading === 'string' ? document.querySelector(this.options.loading) : this.options.loading;
    }
  }, {
    key: "preprocessOptions",
    value: function preprocessOptions() {
      // Partial mode
      if (this.options.partial === undefined && this.partialEl && this.partialEl.dataset.ajaxPartial !== undefined) {
        this.options.partial = this.partialEl.dataset.ajaxPartial || true;
      }
    }
  }, {
    key: "validateClientSideForm",
    value: function validateClientSideForm() {
      if (this.options.browserValidate && typeof document.createElement('input').reportValidity === 'function' && this.formEl && !this.formEl.checkValidity()) {
        this.formEl.reportValidity();
        return false;
      }

      return true;
    }
  }, {
    key: "toggleLoadingElement",
    value: function toggleLoadingElement(isLoading) {
      if (!this.loadingEl) {
        return;
      }

      if (typeof this.loadingEl.show !== 'function' || typeof this.loadingEl.hide !== 'function') {
        this.loadingEl.style.display = isLoading ? 'block' : 'none';
        return;
      }

      if (isLoading) {
        this.loadingEl.show();
      } else {
        this.loadingEl.hide();
      }
    }
  }, {
    key: "showProgressBarAfterDelay",
    value: function showProgressBarAfterDelay() {
      this.progressBar.setValue(0);
      this.progressBarTimeout = window.setTimeout(this.showProgressBar, this.options.progressBarDelay);
    }
  }, {
    key: "hideProgressBar",
    value: function hideProgressBar() {
      this.progressBar.setValue(100);
      this.progressBar.hide();

      if (this.progressBarTimeout != null) {
        window.clearTimeout(this.progressBarTimeout);
        delete this.progressBarTimeout;
      }
    }
  }, {
    key: "markAsProgress",
    value: function markAsProgress(isLoading) {
      if (isLoading) {
        document.documentElement.setAttribute('data-ajax-progress', '');

        if (this.formEl) {
          this.formEl.setAttribute('data-ajax-progress', this.handler);
        }
      } else {
        document.documentElement.removeAttribute('data-ajax-progress');

        if (this.formEl) {
          this.formEl.removeAttribute('data-ajax-progress');
        }
      }
    }
  }, {
    key: "wrapInAsyncPromise",
    value: function wrapInAsyncPromise(requestPromise) {
      return new Promise(function (resolve, reject, onCancel) {
        requestPromise.fail(function (data) {
          reject(data);
        }).done(function (data) {
          resolve(data);
        });
        onCancel(function () {
          requestPromise.abort();
        });
      });
    }
  }], [{
    key: "DEFAULTS",
    get: function get() {
      return {
        handler: null,
        update: {},
        files: false,
        bulk: false,
        download: false,
        browserValidate: false,
        browserTarget: null,
        progressBarDelay: 500,
        progressBar: null
      };
    }
  }, {
    key: "send",
    value: function send(handler, options) {
      return new Request(document, handler, options).start();
    }
  }, {
    key: "sendElement",
    value: function sendElement(element, handler, options) {
      if (typeof element === 'string') {
        element = document.querySelector(element);
      }

      return new Request(element, handler, options).start();
    }
  }]);

  return Request;
}();

/***/ }),

/***/ "./src/util/deferred.js":
/*!******************************!*\
  !*** ./src/util/deferred.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Deferred": () => (/* binding */ Deferred),
/* harmony export */   "DeferredState": () => (/* binding */ DeferredState)
/* harmony export */ });
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

var DeferredState = {
  pending: 'pending',
  rejected: 'rejected',
  resolved: 'resolved'
};
var Deferred = /*#__PURE__*/function () {
  function Deferred(options) {
    _classCallCheck(this, Deferred);

    this.options = options || {};
    this.stateStr = DeferredState.pending;
    this.successFuncs = [];
    this.failureFuncs = [];
    this.progressFuncs = [];
    this.resolveArgs = [];
    this.rejectArgs = [];
    this.progressArgs = [];
    this.isProgressNotified = false;
  } // Public


  _createClass(Deferred, [{
    key: "resolve",
    value: function resolve() {
      if (this.stateStr === DeferredState.pending) {
        this.resolveArgs = arguments;
        this.callFunction.call(this, this.successFuncs, this.resolveArgs);
        this.stateStr = DeferredState.resolved;
      }

      return this;
    }
  }, {
    key: "reject",
    value: function reject() {
      if (this.stateStr === DeferredState.pending) {
        this.rejectArgs = arguments;
        this.callFunction.call(this, this.failureFuncs, this.rejectArgs);
        this.stateStr = DeferredState.rejected;
      }

      return this;
    }
  }, {
    key: "notify",
    value: function notify() {
      if (this.stateStr === DeferredState.pending) {
        this.progressArgs = arguments;
        this.callFunction.call(this, this.progressFuncs, this.progressArgs);
        this.isProgressNotified = true;
      }

      return this;
    }
  }, {
    key: "abort",
    value: function abort() {
      this.options.delegate && this.options.delegate.abort();
    }
  }, {
    key: "done",
    value: function done() {
      var argumentsArray = Array.prototype.slice.call(arguments);
      this.successFuncs = this.successFuncs.concat(argumentsArray);

      if (this.stateStr === DeferredState.resolved) {
        this.callFunction.call(this, argumentsArray, this.resolveArgs);
      }

      return this;
    }
  }, {
    key: "fail",
    value: function fail() {
      var argumentsArray = Array.prototype.slice.call(arguments);
      this.failureFuncs = this.failureFuncs.concat(argumentsArray);

      if (this.stateStr === DeferredState.rejected) {
        this.callFunction.call(this, argumentsArray, this.rejectArgs);
      }

      return this;
    }
  }, {
    key: "progress",
    value: function progress() {
      var argumentsArray = Array.prototype.slice.call(arguments);
      this.progressFuncs = this.progressFuncs.concat(argumentsArray);

      if (this.stateStr === DeferredState.pending && this.isProgressNotified) {
        this.callFunction.call(this, argumentsArray, this.progressArgs);
      }

      return this;
    }
  }, {
    key: "always",
    value: function always() {
      var argumentsArray = Array.prototype.slice.call(arguments);
      this.successFuncs = this.successFuncs.concat(argumentsArray);
      this.failureFuncs = this.failureFuncs.concat(argumentsArray);

      if (this.stateStr !== DeferredState.pending) {
        this.callFunction.call(this, argumentsArray, this.resolveArgs || this.rejectArgs);
      }

      return this;
    }
  }, {
    key: "then",
    value: function then() {
      var tempArgs = [];

      for (var index in arguments) {
        var itemToPush;

        if (Array.isArray(arguments[index])) {
          itemToPush = arguments[index];
        } else {
          itemToPush = [arguments[index]];
        }

        tempArgs.push(itemToPush);
      }

      this.done.apply(this, tempArgs[0]);
      this.fail.apply(this, tempArgs[1]);
      this.progress.apply(this, tempArgs[2]);
      return this;
    }
  }, {
    key: "promise",
    value: function promise() {
      var protectedNames = ['resolve', 'reject', 'promise', 'notify'];
      var result = {};

      for (var key in this) {
        if (protectedNames.indexOf(key) === -1) {
          result[key] = this[key];
        }
      }

      return result;
    }
  }, {
    key: "state",
    value: function state() {
      if (arguments.length > 0) {
        stateStr = arguments[0];
      }

      return stateStr;
    } // Private

  }, {
    key: "callFunction",
    value: function callFunction(functionDefinitionArray, functionArgumentArray, options) {
      options = options || {};
      var scope = options.scope || this;

      for (var index in functionDefinitionArray) {
        var item = functionDefinitionArray[index];

        if (typeof item === 'function') {
          item.apply(scope, functionArgumentArray);
        }
      }
    }
  }]);

  return Deferred;
}();

/***/ }),

/***/ "./src/util/events.js":
/*!****************************!*\
  !*** ./src/util/events.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Events": () => (/* binding */ Events)
/* harmony export */ });
/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index */ "./src/util/index.js");
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }


/**
 * Constants
 */

var namespaceRegex = /[^.]*(?=\..*)\.|.*/;
var stripNameRegex = /\..*/;
var stripUidRegex = /::\d+$/;
var eventRegistry = {}; // Events storage

var uidEvent = 1;
var customEvents = {
  mouseenter: 'mouseover',
  mouseleave: 'mouseout'
};
var nativeEvents = new Set(['click', 'dblclick', 'mouseup', 'mousedown', 'contextmenu', 'mousewheel', 'DOMMouseScroll', 'mouseover', 'mouseout', 'mousemove', 'selectstart', 'selectend', 'keydown', 'keypress', 'keyup', 'orientationchange', 'touchstart', 'touchmove', 'touchend', 'touchcancel', 'pointerdown', 'pointermove', 'pointerup', 'pointerleave', 'pointercancel', 'gesturestart', 'gesturechange', 'gestureend', 'focus', 'blur', 'change', 'reset', 'select', 'submit', 'focusin', 'focusout', 'load', 'unload', 'beforeunload', 'resize', 'move', 'DOMContentLoaded', 'readystatechange', 'error', 'abort', 'scroll']);
var Events = /*#__PURE__*/function () {
  function Events() {
    _classCallCheck(this, Events);
  }

  _createClass(Events, null, [{
    key: "on",
    value: function on(element, event, handler, delegationFunction, options) {
      addHandler(element, event, handler, delegationFunction, options, false);
    }
  }, {
    key: "one",
    value: function one(element, event, handler, delegationFunction, options) {
      addHandler(element, event, handler, delegationFunction, options, true);
    }
  }, {
    key: "off",
    value: function off(element, originalTypeEvent, handler, delegationFunction, options) {
      if (typeof originalTypeEvent !== 'string' || !element) {
        return;
      }

      var _normalizeParameters = normalizeParameters(originalTypeEvent, handler, delegationFunction, options),
          _normalizeParameters2 = _slicedToArray(_normalizeParameters, 4),
          isDelegated = _normalizeParameters2[0],
          callable = _normalizeParameters2[1],
          typeEvent = _normalizeParameters2[2],
          opts = _normalizeParameters2[3];

      var inNamespace = typeEvent !== originalTypeEvent;
      var events = getElementEvents(element);
      var storeElementEvent = events[typeEvent] || {};
      var isNamespace = originalTypeEvent.startsWith('.');

      if (typeof callable !== 'undefined') {
        // Simplest case: handler is passed, remove that listener ONLY.
        if (!storeElementEvent) {
          return;
        }

        removeHandler(element, events, typeEvent, callable, isDelegated ? handler : null, opts);
        return;
      }

      if (isNamespace) {
        for (var _i2 = 0, _Object$keys = Object.keys(events); _i2 < _Object$keys.length; _i2++) {
          var elementEvent = _Object$keys[_i2];
          removeNamespacedHandlers(element, events, elementEvent, originalTypeEvent.slice(1));
        }
      }

      for (var _i3 = 0, _Object$keys2 = Object.keys(storeElementEvent); _i3 < _Object$keys2.length; _i3++) {
        var keyHandlers = _Object$keys2[_i3];
        var handlerKey = keyHandlers.replace(stripUidRegex, '');

        if (!inNamespace || originalTypeEvent.includes(handlerKey)) {
          var event = storeElementEvent[keyHandlers];
          removeHandler(element, events, typeEvent, event.callable, event.delegationSelector, opts);
        }
      }
    }
  }, {
    key: "dispatch",
    value: function dispatch(eventName) {
      var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          _ref$target = _ref.target,
          target = _ref$target === void 0 ? document : _ref$target,
          _ref$detail = _ref.detail,
          detail = _ref$detail === void 0 ? {} : _ref$detail,
          _ref$bubbles = _ref.bubbles,
          bubbles = _ref$bubbles === void 0 ? true : _ref$bubbles,
          _ref$cancelable = _ref.cancelable,
          cancelable = _ref$cancelable === void 0 ? true : _ref$cancelable;

      return (0,_index__WEBPACK_IMPORTED_MODULE_0__.dispatch)(eventName, {
        target: target,
        detail: detail,
        bubbles: bubbles,
        cancelable: cancelable
      });
    }
  }]);

  return Events;
}();
/**
 * Private methods
 */

function makeEventUid(element, uid) {
  return uid && "".concat(uid, "::").concat(uidEvent++) || element.uidEvent || uidEvent++;
}

function getElementEvents(element) {
  var uid = makeEventUid(element);
  element.uidEvent = uid;
  eventRegistry[uid] = eventRegistry[uid] || {};
  return eventRegistry[uid];
}

function findHandler(events, callable) {
  var delegationSelector = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  return Object.values(events).find(function (event) {
    return event.callable === callable && event.delegationSelector === delegationSelector;
  });
}

function normalizeParameters(originalTypeEvent, handler, delegationFunction, options) {
  var isDelegated = typeof handler === 'string';
  var callable = isDelegated ? delegationFunction : handler;
  var opts = isDelegated ? options : delegationFunction;
  var typeEvent = getTypeEvent(originalTypeEvent);

  if (!nativeEvents.has(typeEvent)) {
    typeEvent = originalTypeEvent;
  }

  return [isDelegated, callable, typeEvent, opts];
}

function addHandler(element, originalTypeEvent, handler, delegationFunction, options, oneOff) {
  if (typeof originalTypeEvent !== 'string' || !element) {
    return;
  }

  var _normalizeParameters3 = normalizeParameters(originalTypeEvent, handler, delegationFunction, options),
      _normalizeParameters4 = _slicedToArray(_normalizeParameters3, 4),
      isDelegated = _normalizeParameters4[0],
      callable = _normalizeParameters4[1],
      typeEvent = _normalizeParameters4[2],
      opts = _normalizeParameters4[3]; // in case of mouseenter or mouseleave wrap the handler within a function that checks for its DOM position
  // this prevents the handler from being dispatched the same way as mouseover or mouseout does


  if (originalTypeEvent in customEvents) {
    var wrapFunction = function wrapFunction(fn) {
      return function (event) {
        if (!event.relatedTarget || event.relatedTarget !== event.delegateTarget && !event.delegateTarget.contains(event.relatedTarget)) {
          return fn.call(this, event);
        }
      };
    };

    callable = wrapFunction(callable);
  }

  var events = getElementEvents(element);
  var handlers = events[typeEvent] || (events[typeEvent] = {});
  var previousFunction = findHandler(handlers, callable, isDelegated ? handler : null);

  if (previousFunction) {
    previousFunction.oneOff = previousFunction.oneOff && oneOff;
    return;
  }

  var uid = makeEventUid(callable, originalTypeEvent.replace(namespaceRegex, ''));
  var fn = isDelegated ? internalDelegationHandler(element, handler, callable) : internalHandler(element, callable);
  fn.delegationSelector = isDelegated ? handler : null;
  fn.callable = callable;
  fn.oneOff = oneOff;
  fn.uidEvent = uid;
  handlers[uid] = fn;
  element.addEventListener(typeEvent, fn, opts);
}

function removeHandler(element, events, typeEvent, handler, delegationSelector, options) {
  var fn = findHandler(events[typeEvent], handler, delegationSelector);

  if (!fn) {
    return;
  }

  element.removeEventListener(typeEvent, fn, options);
  delete events[typeEvent][fn.uidEvent];
}

function internalHandler(element, fn) {
  return function handler(event) {
    event.delegateTarget = element;

    if (handler.oneOff) {
      Events.off(element, event.type, fn);
    }

    return fn.apply(element, [event]);
  };
}

function internalDelegationHandler(element, selector, fn) {
  return function handler(event) {
    var domElements = element.querySelectorAll(selector);

    for (var target = event.target; target && target !== this; target = target.parentNode) {
      var _iterator = _createForOfIteratorHelper(domElements),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var domElement = _step.value;

          if (domElement !== target) {
            continue;
          }

          event.delegateTarget = target;

          if (handler.oneOff) {
            Events.off(element, event.type, selector, fn);
          }

          return fn.apply(target, [event]);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
  };
}

function removeNamespacedHandlers(element, events, typeEvent, namespace) {
  var storeElementEvent = events[typeEvent] || {};

  for (var _i4 = 0, _Object$keys3 = Object.keys(storeElementEvent); _i4 < _Object$keys3.length; _i4++) {
    var handlerKey = _Object$keys3[_i4];

    if (handlerKey.includes(namespace)) {
      var event = storeElementEvent[handlerKey];
      removeHandler(element, events, typeEvent, event.callable, event.delegationSelector);
    }
  }
} // Allow to get the native events from namespaced events ('click.bs.button' --> 'click')


function getTypeEvent(event) {
  event = event.replace(stripNameRegex, '');
  return customEvents[event] || event;
}

/***/ }),

/***/ "./src/util/form-serializer.js":
/*!*************************************!*\
  !*** ./src/util/form-serializer.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "FormSerializer": () => (/* binding */ FormSerializer)
/* harmony export */ });
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

// FormSerializer serializes input elements to JSON
var FormSerializer = /*#__PURE__*/function () {
  function FormSerializer() {
    _classCallCheck(this, FormSerializer);
  }

  _createClass(FormSerializer, [{
    key: "parseContainer",
    value: // Private
    function parseContainer(element) {
      var _this = this;

      var jsonData = {};
      element.querySelectorAll('input, textarea, select').forEach(function (field) {
        if (!field.name || field.disabled || ['file', 'reset', 'submit', 'button'].indexOf(field.type) > -1) {
          return;
        }

        if (['checkbox', 'radio'].indexOf(field.type) > -1 && !field.checked) {
          return;
        }

        if (field.type === 'select-multiple') {
          var arr = [];
          Array.from(field.options).forEach(function (option) {
            if (option.selected) {
              arr.push({
                name: field.name,
                value: option.value
              });
            }
          });

          _this.assignObjectInternal(jsonData, field.name, arr);

          return;
        }

        _this.assignObjectInternal(jsonData, field.name, field.value);
      });
      return jsonData;
    }
  }, {
    key: "assignObjectInternal",
    value: function assignObjectInternal(obj, fieldName, fieldValue) {
      this.assignObjectNested(obj, this.nameToArray(fieldName), fieldValue);
    }
  }, {
    key: "assignObjectNested",
    value: function assignObjectNested(obj, fieldArr, fieldValue) {
      var currentTarget = obj,
          lastIndex = fieldArr.length - 1;
      fieldArr.forEach(function (prop, index) {
        if (currentTarget[prop] === undefined) {
          currentTarget[prop] = {};
        }

        if (index === lastIndex) {
          currentTarget[prop] = fieldValue;
        }

        currentTarget = currentTarget[prop];
      });
    }
  }, {
    key: "nameToArray",
    value: function nameToArray(fieldName) {
      var expression = /([^\]\[]+)/g,
          elements = [],
          searchResult;

      while (searchResult = expression.exec(fieldName)) {
        elements.push(searchResult[0]);
      }

      return elements;
    }
  }], [{
    key: "assignToObj",
    value: // Public
    function assignToObj(obj, name, value) {
      new FormSerializer().assignObjectInternal(obj, name, value);
    }
  }, {
    key: "serializeJSON",
    value: function serializeJSON(element) {
      return new FormSerializer().parseContainer(element);
    }
  }]);

  return FormSerializer;
}();

/***/ }),

/***/ "./src/util/http-request.js":
/*!**********************************!*\
  !*** ./src/util/http-request.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HttpRequest": () => (/* binding */ HttpRequest),
/* harmony export */   "SystemStatusCode": () => (/* binding */ SystemStatusCode)
/* harmony export */ });
/* harmony import */ var _events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./events */ "./src/util/events.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }


var SystemStatusCode = {
  networkFailure: 0,
  timeoutFailure: -1,
  contentTypeMismatch: -2,
  userAborted: -3
};
var HttpRequest = /*#__PURE__*/function () {
  function HttpRequest(delegate, url, options) {
    var _this = this;

    _classCallCheck(this, HttpRequest);

    this.failed = false;
    this.progress = 0;
    this.sent = false;
    this.delegate = delegate;
    this.url = url;
    this.options = options;
    this.headers = options.headers || {};
    this.method = options.method || 'GET';
    this.responseType = options.responseType || '';
    this.data = options.data;
    this.timeout = options.timeout || 0; // XMLHttpRequest events

    this.requestProgressed = function (event) {
      if (event.lengthComputable) {
        _this.setProgress(event.loaded / event.total);
      }
    };

    this.requestLoaded = function () {
      _this.endRequest(function (xhr) {
        _this.processResponseData(xhr, function (xhr, data) {
          var contentType = xhr.getResponseHeader('Content-Type');
          var responseData = contentTypeIsJSON(contentType) ? JSON.parse(data) : data;

          if (_this.options.htmlOnly && !contentTypeIsHTML(contentType)) {
            _this.failed = true;

            _this.delegate.requestFailedWithStatusCode(SystemStatusCode.contentTypeMismatch);

            return;
          }

          if (xhr.status >= 200 && xhr.status < 300) {
            _this.delegate.requestCompletedWithResponse(responseData, xhr.status, contentResponseIsRedirect(xhr, _this.url));
          } else {
            _this.failed = true;

            _this.delegate.requestFailedWithStatusCode(xhr.status, responseData);
          }
        });
      });
    };

    this.requestFailed = function () {
      _this.endRequest(function () {
        _this.failed = true;

        _this.delegate.requestFailedWithStatusCode(SystemStatusCode.networkFailure);
      });
    };

    this.requestTimedOut = function () {
      _this.endRequest(function () {
        _this.failed = true;

        _this.delegate.requestFailedWithStatusCode(SystemStatusCode.timeoutFailure);
      });
    };

    this.requestCanceled = function () {
      if (_this.options.trackAbort) {
        _this.endRequest(function () {
          _this.failed = true;

          _this.delegate.requestFailedWithStatusCode(SystemStatusCode.userAborted);
        });
      } else {
        _this.endRequest();
      }
    };

    this.createXHR();
  }

  _createClass(HttpRequest, [{
    key: "send",
    value: function send() {
      if (this.xhr && !this.sent) {
        this.notifyApplicationBeforeRequestStart();
        this.setProgress(0);
        this.xhr.send(this.data || null);
        this.sent = true;
        this.delegate.requestStarted();
      }
    }
  }, {
    key: "abort",
    value: function abort() {
      if (this.xhr && this.sent) {
        this.xhr.abort();
      }
    } // Application events

  }, {
    key: "notifyApplicationBeforeRequestStart",
    value: function notifyApplicationBeforeRequestStart() {
      _events__WEBPACK_IMPORTED_MODULE_0__.Events.dispatch('ajax:request-start', {
        detail: {
          url: this.url,
          xhr: this.xhr
        },
        cancelable: false
      });
    }
  }, {
    key: "notifyApplicationAfterRequestEnd",
    value: function notifyApplicationAfterRequestEnd() {
      _events__WEBPACK_IMPORTED_MODULE_0__.Events.dispatch('ajax:request-end', {
        detail: {
          url: this.url,
          xhr: this.xhr
        },
        cancelable: false
      });
    } // Private

  }, {
    key: "createXHR",
    value: function createXHR() {
      var xhr = this.xhr = new XMLHttpRequest();
      xhr.open(this.method, this.url, true);
      xhr.responseType = this.responseType;
      xhr.onprogress = this.requestProgressed;
      xhr.onload = this.requestLoaded;
      xhr.onerror = this.requestFailed;
      xhr.ontimeout = this.requestTimedOut;
      xhr.onabort = this.requestCanceled;

      if (this.timeout) {
        xhr.timeout = this.timeout * 1000;
      }

      for (var i in this.headers) {
        xhr.setRequestHeader(i, this.headers[i]);
      }

      return xhr;
    }
  }, {
    key: "endRequest",
    value: function endRequest() {
      var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};

      if (this.xhr) {
        this.notifyApplicationAfterRequestEnd();
        callback(this.xhr);
        this.destroy();
      }
    }
  }, {
    key: "setProgress",
    value: function setProgress(progress) {
      this.progress = progress;
      this.delegate.requestProgressed(progress);
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this.setProgress(1);
      this.delegate.requestFinished();
    }
  }, {
    key: "processResponseData",
    value: function processResponseData(xhr, callback) {
      if (this.responseType !== 'blob') {
        callback(xhr, xhr.responseText);
        return;
      } // Confirm response is a download


      var contentDisposition = xhr.getResponseHeader('Content-Disposition') || '';

      if (contentDisposition.indexOf('attachment') === 0 || contentDisposition.indexOf('inline') === 0) {
        callback(xhr, xhr.response);
        return;
      } // Convert blob to text


      var reader = new FileReader();
      reader.addEventListener('load', function () {
        callback(xhr, reader.result);
      });
      reader.readAsText(xhr.response);
    }
  }]);

  return HttpRequest;
}();

function contentResponseIsRedirect(xhr, url) {
  if (xhr.getResponseHeader('X-OCTOBER-LOCATION')) {
    return xhr.getResponseHeader('X-OCTOBER-LOCATION');
  }

  var anchorMatch = url.match(/^(.*)#/),
      wantUrl = anchorMatch ? anchorMatch[1] : url;
  return wantUrl !== xhr.responseURL ? xhr.responseURL : null;
}

function contentTypeIsHTML(contentType) {
  return (contentType || '').match(/^text\/html|^application\/xhtml\+xml/);
}

function contentTypeIsJSON(contentType) {
  return (contentType || '').includes('application/json');
}

/***/ }),

/***/ "./src/util/index.js":
/*!***************************!*\
  !*** ./src/util/index.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "array": () => (/* binding */ array),
/* harmony export */   "defer": () => (/* binding */ defer),
/* harmony export */   "dispatch": () => (/* binding */ dispatch),
/* harmony export */   "unindent": () => (/* binding */ unindent),
/* harmony export */   "uuid": () => (/* binding */ uuid)
/* harmony export */ });
function dispatch(eventName) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$target = _ref.target,
      target = _ref$target === void 0 ? document : _ref$target,
      _ref$detail = _ref.detail,
      detail = _ref$detail === void 0 ? {} : _ref$detail,
      _ref$bubbles = _ref.bubbles,
      bubbles = _ref$bubbles === void 0 ? true : _ref$bubbles,
      _ref$cancelable = _ref.cancelable,
      cancelable = _ref$cancelable === void 0 ? true : _ref$cancelable;

  var event = new CustomEvent(eventName, {
    detail: detail,
    bubbles: bubbles,
    cancelable: cancelable
  });
  target.dispatchEvent(event);
  return event;
}
function defer(callback) {
  setTimeout(callback, 1);
}
function unindent(strings) {
  for (var _len = arguments.length, values = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    values[_key - 1] = arguments[_key];
  }

  var lines = trimLeft(interpolate(strings, values)).split("\n");
  var match = lines[0].match(/^\s+/);
  var indent = match ? match[0].length : 0;
  return lines.map(function (line) {
    return line.slice(indent);
  }).join("\n");
}

function trimLeft(string) {
  return string.replace(/^\n/, "");
}

function interpolate(strings, values) {
  return strings.reduce(function (result, string, i) {
    var value = values[i] == undefined ? "" : values[i];
    return result + string + value;
  }, "");
}

function array(values) {
  return Array.prototype.slice.call(values);
}
function uuid() {
  return Array.apply(null, {
    length: 36
  }).map(function (_, i) {
    if (i == 8 || i == 13 || i == 18 || i == 23) {
      return "-";
    } else if (i == 14) {
      return "4";
    } else if (i == 19) {
      return (Math.floor(Math.random() * 4) + 8).toString(16);
    } else {
      return Math.floor(Math.random() * 15).toString(16);
    }
  }).join("");
}

/***/ }),

/***/ "./src/util/json-parser.js":
/*!*********************************!*\
  !*** ./src/util/json-parser.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "JsonParser": () => (/* binding */ JsonParser)
/* harmony export */ });
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

// JsonParser serializes JS-syntax to JSON without using eval
var JsonParser = /*#__PURE__*/function () {
  function JsonParser() {
    _classCallCheck(this, JsonParser);
  }

  _createClass(JsonParser, [{
    key: "parseString",
    value: // Private
    function parseString(str) {
      str = str.trim();

      if (!str.length) {
        throw new Error("Broken JSON object.");
      }

      var result = "";
      /*
       * the mistake ','
       */

      while (str && str[0] === ",") {
        str = str.substr(1);
      }
      /*
       * string
       */


      if (str[0] === "\"" || str[0] === "'") {
        if (str[str.length - 1] !== str[0]) {
          throw new Error("Invalid string JSON object.");
        }

        var body = "\"";

        for (var i = 1; i < str.length; i++) {
          if (str[i] === "\\") {
            if (str[i + 1] === "'") {
              body += str[i + 1];
            } else {
              body += str[i];
              body += str[i + 1];
            }

            i++;
          } else if (str[i] === str[0]) {
            body += "\"";
            return body;
          } else if (str[i] === "\"") {
            body += "\\\"";
          } else body += str[i];
        }

        throw new Error("Invalid string JSON object.");
      }
      /*
       * boolean
       */


      if (str === "true" || str === "false") {
        return str;
      }
      /*
       * null
       */


      if (str === "null") {
        return "null";
      }
      /*
       * number
       */


      var num = parseFloat(str);

      if (!isNaN(num)) {
        return num.toString();
      }
      /*
       * object
       */


      if (str[0] === "{") {
        var type = "needKey";
        var result = "{";

        for (var i = 1; i < str.length; i++) {
          if (this.isBlankChar(str[i])) {
            continue;
          } else if (type === "needKey" && (str[i] === "\"" || str[i] === "'")) {
            var key = this.parseKey(str, i + 1, str[i]);
            result += "\"" + key + "\"";
            i += key.length;
            i += 1;
            type = "afterKey";
          } else if (type === "needKey" && this.canBeKeyHead(str[i])) {
            var key = this.parseKey(str, i);
            result += "\"";
            result += key;
            result += "\"";
            i += key.length - 1;
            type = "afterKey";
          } else if (type === "afterKey" && str[i] === ":") {
            result += ":";
            type = ":";
          } else if (type === ":") {
            var body = this.getBody(str, i);
            i = i + body.originLength - 1;
            result += this.parseString(body.body);
            type = "afterBody";
          } else if (type === "afterBody" || type === "needKey") {
            var last = i;

            while (str[last] === "," || this.isBlankChar(str[last])) {
              last++;
            }

            if (str[last] === "}" && last === str.length - 1) {
              while (result[result.length - 1] === ",") {
                result = result.substr(0, result.length - 1);
              }

              result += "}";
              return result;
            } else if (last !== i && result !== "{") {
              result += ",";
              type = "needKey";
              i = last - 1;
            }
          }
        }

        throw new Error("Broken JSON object near " + result);
      }
      /*
       * array
       */


      if (str[0] === "[") {
        var result = "[";
        var type = "needBody";

        for (var i = 1; i < str.length; i++) {
          if (" " === str[i] || "\n" === str[i] || "\t" === str[i]) {
            continue;
          } else if (type === "needBody") {
            if (str[i] === ",") {
              result += "null,";
              continue;
            }

            if (str[i] === "]" && i === str.length - 1) {
              if (result[result.length - 1] === ",") result = result.substr(0, result.length - 1);
              result += "]";
              return result;
            }

            var body = this.getBody(str, i);
            i = i + body.originLength - 1;
            result += this.parseString(body.body);
            type = "afterBody";
          } else if (type === "afterBody") {
            if (str[i] === ",") {
              result += ",";
              type = "needBody"; // deal with mistake ","

              while (str[i + 1] === "," || this.isBlankChar(str[i + 1])) {
                if (str[i + 1] === ",") result += "null,";
                i++;
              }
            } else if (str[i] === "]" && i === str.length - 1) {
              result += "]";
              return result;
            }
          }
        }

        throw new Error("Broken JSON array near " + result);
      }
    }
  }, {
    key: "parseKey",
    value: function parseKey(str, pos, quote) {
      var key = "";

      for (var i = pos; i < str.length; i++) {
        if (quote && quote === str[i]) {
          return key;
        } else if (!quote && (str[i] === " " || str[i] === ":")) {
          return key;
        }

        key += str[i];

        if (str[i] === "\\" && i + 1 < str.length) {
          key += str[i + 1];
          i++;
        }
      }

      throw new Error("Broken JSON syntax near " + key);
    }
  }, {
    key: "getBody",
    value: function getBody(str, pos) {
      // parse string body
      if (str[pos] === "\"" || str[pos] === "'") {
        var body = str[pos];

        for (var i = pos + 1; i < str.length; i++) {
          if (str[i] === "\\") {
            body += str[i];
            if (i + 1 < str.length) body += str[i + 1];
            i++;
          } else if (str[i] === str[pos]) {
            body += str[pos];
            return {
              originLength: body.length,
              body: body
            };
          } else body += str[i];
        }

        throw new Error("Broken JSON string body near " + body);
      } // parse true / false


      if (str[pos] === "t") {
        if (str.indexOf("true", pos) === pos) {
          return {
            originLength: "true".length,
            body: "true"
          };
        }

        throw new Error("Broken JSON boolean body near " + str.substr(0, pos + 10));
      }

      if (str[pos] === "f") {
        if (str.indexOf("f", pos) === pos) {
          return {
            originLength: "false".length,
            body: "false"
          };
        }

        throw new Error("Broken JSON boolean body near " + str.substr(0, pos + 10));
      } // parse null


      if (str[pos] === "n") {
        if (str.indexOf("null", pos) === pos) {
          return {
            originLength: "null".length,
            body: "null"
          };
        }

        throw new Error("Broken JSON boolean body near " + str.substr(0, pos + 10));
      } // parse number


      if (str[pos] === "-" || str[pos] === "+" || str[pos] === "." || str[pos] >= "0" && str[pos] <= "9") {
        var body = "";

        for (var i = pos; i < str.length; i++) {
          if (str[i] === "-" || str[i] === "+" || str[i] === "." || str[i] >= "0" && str[i] <= "9") {
            body += str[i];
          } else {
            return {
              originLength: body.length,
              body: body
            };
          }
        }

        throw new Error("Broken JSON number body near " + body);
      } // parse object


      if (str[pos] === "{" || str[pos] === "[") {
        var stack = [str[pos]];
        var body = str[pos];

        for (var i = pos + 1; i < str.length; i++) {
          body += str[i];

          if (str[i] === "\\") {
            if (i + 1 < str.length) body += str[i + 1];
            i++;
          } else if (str[i] === "\"") {
            if (stack[stack.length - 1] === "\"") {
              stack.pop();
            } else if (stack[stack.length - 1] !== "'") {
              stack.push(str[i]);
            }
          } else if (str[i] === "'") {
            if (stack[stack.length - 1] === "'") {
              stack.pop();
            } else if (stack[stack.length - 1] !== "\"") {
              stack.push(str[i]);
            }
          } else if (stack[stack.length - 1] !== "\"" && stack[stack.length - 1] !== "'") {
            if (str[i] === "{") {
              stack.push("{");
            } else if (str[i] === "}") {
              if (stack[stack.length - 1] === "{") {
                stack.pop();
              } else {
                throw new Error("Broken JSON " + (str[pos] === "{" ? "object" : "array") + " body near " + body);
              }
            } else if (str[i] === "[") {
              stack.push("[");
            } else if (str[i] === "]") {
              if (stack[stack.length - 1] === "[") {
                stack.pop();
              } else {
                throw new Error("Broken JSON " + (str[pos] === "{" ? "object" : "array") + " body near " + body);
              }
            }
          }

          if (!stack.length) {
            return {
              originLength: i - pos,
              body: body
            };
          }
        }

        throw new Error("Broken JSON " + (str[pos] === "{" ? "object" : "array") + " body near " + body);
      }

      throw new Error("Broken JSON body near " + str.substr(pos - 5 >= 0 ? pos - 5 : 0, 50));
    }
  }, {
    key: "canBeKeyHead",
    value: function canBeKeyHead(ch) {
      if (ch[0] === "\\") return false;
      if (ch[0] >= 'a' && ch[0] <= 'z' || ch[0] >= 'A' && ch[0] <= 'Z' || ch[0] === '_') return true;
      if (ch[0] >= '0' && ch[0] <= '9') return true;
      if (ch[0] === '$') return true;
      if (ch.charCodeAt(0) > 255) return true;
      return false;
    }
  }, {
    key: "isBlankChar",
    value: function isBlankChar(ch) {
      return ch === " " || ch === "\n" || ch === "\t";
    }
  }], [{
    key: "paramToObj",
    value: // Public
    function paramToObj(name, value) {
      if (value === undefined) {
        value = '';
      }

      if (_typeof(value) === 'object') {
        return value;
      }

      if (value.charAt(0) !== '{') {
        value = "{" + value + "}";
      }

      try {
        return this.parseJSON(value);
      } catch (e) {
        throw new Error('Error parsing the ' + name + ' attribute value. ' + e);
      }
    }
  }, {
    key: "parseJSON",
    value: function parseJSON(json) {
      return JSON.parse(new JsonParser().parseString(json));
    }
  }]);

  return JsonParser;
}();

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/amd options */
/******/ 	(() => {
/******/ 		__webpack_require__.amdO = {};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*********************************!*\
  !*** ./src/framework-extras.js ***!
  \*********************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _request__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./request */ "./src/request/index.js");
/* harmony import */ var _core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./core */ "./src/core/index.js");
/* harmony import */ var _extras__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./extras */ "./src/extras/index.js");
/* harmony import */ var _observe__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./observe */ "./src/observe/index.js");
/**
 * --------------------------------------------------------------------------
 * October CMS: Frontend JavaScript Framework
 * https://octobercms.com
 * --------------------------------------------------------------------------
 * Copyright 2013-2023 Alexey Bobkov, Samuel Georges
 * --------------------------------------------------------------------------
 */




})();

/******/ })()
;