'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SPLIT = ',',
    PREFIX = 'multi-watch:';

var Handler = function () {
    function Handler(option) {
        _classCallCheck(this, Handler);

        var attrs = option.attrs,
            handler = option.handler,
            context = option.context;

        this.attrs = attrs;
        this.handler = handler;
        this.change = {};
        this.context = context;
    }

    _createClass(Handler, [{
        key: 'check',
        value: function check(key, value) {
            var _this = this;

            this.change[key] = value;
            var result = true;
            this.attrs.forEach(function (attr) {
                if (!_this.change.hasOwnProperty(attr)) {
                    result = false;
                }
            });
            if (result) {
                var changingState = this.change;
                this.change = {};
                this.handle(changingState);
            }
        }
    }, {
        key: 'handle',
        value: function handle(changingState) {
            typeof this.handler == 'function' && this.handler.call(this.context, changingState);
        }
    }]);

    return Handler;
}();

var Emitter = function () {
    function Emitter(option) {
        _classCallCheck(this, Emitter);

        var key = option.key,
            events = option.events,
            context = option.context;

        this.key = key;
        this.events = events;
        this.context = context;
    }

    _createClass(Emitter, [{
        key: 'emit',
        value: function emit() {
            var _this2 = this;

            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            this.events.forEach(function (event) {
                var _context;

                (_context = _this2.context).$emit.apply(_context, [PREFIX + event, _this2.key].concat(args));
            });
        }
    }]);

    return Emitter;
}();

function setListeners(context, option) {
    var events = {};
    Object.keys(option).forEach(function (key) {
        key += '';
        var attrs = key.split(SPLIT);
        attrs.forEach(function (attr) {
            if (!Array.isArray(events[attr])) {
                events[attr] = [];
            }
            events[attr].push(key);
        });
        var handler = new Handler({
            attrs: attrs,
            context: context,
            handler: option[key]
        });
        context.$on(PREFIX + key, handler.check.bind(handler));
    });
    Object.keys(events).forEach(function (key) {
        var emitter = new Emitter({
            key: key,
            context: context,
            events: events[key]
        });
        context.$watch(key, emitter.emit.bind(emitter));
    });
}
exports.default = {
    install: function install(Vue) {
        Vue.mixin({
            created: function created() {
                var option = this.$options.multiWatch;
                if (!option) {
                    return;
                }
                setListeners(this, option);
            }
        });
    }
};