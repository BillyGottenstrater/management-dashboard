"use strict";

/* jshint ignore:start */



/* jshint ignore:end */

define('hoa/adapters/application', ['exports', 'ember-data'], function (exports, _emberData) {
    exports['default'] = _emberData['default'].RESTAdapter.extend({
        pathForType: function pathForType(type) {
            return type.camelize();
        }
    });
});
define('hoa/app', ['exports', 'ember', 'hoa/resolver', 'ember-load-initializers', 'hoa/config/environment'], function (exports, _ember, _hoaResolver, _emberLoadInitializers, _hoaConfigEnvironment) {

  var App = undefined;

  _ember['default'].MODEL_FACTORY_INJECTIONS = true;

  App = _ember['default'].Application.extend({
    modulePrefix: _hoaConfigEnvironment['default'].modulePrefix,
    podModulePrefix: _hoaConfigEnvironment['default'].podModulePrefix,
    Resolver: _hoaResolver['default']
  });

  (0, _emberLoadInitializers['default'])(App, _hoaConfigEnvironment['default'].modulePrefix);

  exports['default'] = App;
});
define('hoa/authenticators/oauth2', ['exports', 'ember-simple-auth/authenticators/oauth2-password-grant', 'hoa/config/environment'], function (exports, _emberSimpleAuthAuthenticatorsOauth2PasswordGrant, _hoaConfigEnvironment) {
  exports['default'] = _emberSimpleAuthAuthenticatorsOauth2PasswordGrant['default'].extend({
    serverTokenEndpoint: _hoaConfigEnvironment['default'].apiHost + '/token',
    serverTokenRevocationEndpoint: _hoaConfigEnvironment['default'].apiHost + '/revoke'
  });
});
define('hoa/authorizers/application', ['exports', 'ember-simple-auth/authorizers/oauth2-bearer'], function (exports, _emberSimpleAuthAuthorizersOauth2Bearer) {
  exports['default'] = _emberSimpleAuthAuthorizersOauth2Bearer['default'].extend();
});
define('hoa/components/c3-chart', ['exports', 'ember-c3/components/c3-chart'], function (exports, _emberC3ComponentsC3Chart) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberC3ComponentsC3Chart['default'];
    }
  });
});
define('hoa/components/login-form', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Component.extend({
        actions: {
            login: function login() {
                var _this = this;

                var _getProperties = this.getProperties('identification', 'password');

                var identification = _getProperties.identification;
                var password = _getProperties.password;

                this.get('session').authenticate('authenticator:oauth2', identification, password)['catch'](function (reason) {
                    _this.set('errorMessage', reason.error);
                });
            },

            authenticateWithFacebook: function authenticateWithFacebook() {
                this.get('session').authenticate('authenticator:torii', 'facebook');
            }
        }
    });
});
define('hoa/components/opened-vs-resolved', ['exports', 'ember', 'moment'], function (exports, _ember, _moment) {
    exports['default'] = _ember['default'].Component.extend({
        activeKeys: [],
        'switch': false,
        model: [],
        axis: null,
        data: null
    });
});
define('hoa/controllers/index', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Controller.extend({
        activeKey: _ember['default'].computed('_projectKey', '_subTypeKey', '_metricsKey', function () {
            if (!this.get('_projectKey') || !this.get('_metricsKey')) {
                return null;
            }
            return this.get('_projectKey') + this.get('_subTypeKey') + this.get('_metricsKey');
        }),
        percentToggle: false,
        _projectKey: '',
        _subTypeKey: '',
        _metricsKey: '',
        storedMetrics: [],
        axis: {
            x: {
                type: 'timeseries',
                tick: {
                    format: '%Y-%m-%d'
                }
            },
            y: {
                show: false
            },
            y2: {
                show: false,
                tick: {
                    format: d3.format('%')
                }
            }
        },
        dates: _ember['default'].computed('model.data.[]', 'activeKeys.[]', function () {
            return ['x'].concat(this.get('model.data').map(function (datapoint) {
                return moment(datapoint.date).format('YYYY-MM-DD');
            }));
        }),
        data: _ember['default'].computed('storedMetrics.[]', 'storedMetrics', function () {
            var _this = this;

            var data = {
                x: 'x',
                columns: [],
                axes: {}
            };
            if (_ember['default'].isEmpty(this.get('storedMetrics'))) {
                return data;
            }
            data.columns.push(this.get('dates'));
            this.get('axis.y2.show', false);
            this.get('axis.y.show', false);
            this.get('storedMetrics').forEach(function (key) {
                var parentKey = undefined;
                if (key.indexOf('%') > -1) {
                    parentKey = key.replace(/([a-zA-Z]*)\.total/, 'total');
                    parentKey = parentKey.replace('%', '');
                }
                var object = [key].concat(_this.get('model.data').map(function (datapoint) {
                    var data = _ember['default'].get(datapoint, key = key.replace('%', ''));
                    if (parentKey) {
                        return data / _ember['default'].get(datapoint, parentKey);
                    }
                    return data;
                }));
                data.columns.push(object);
                if (parentKey) {
                    data.axes[key] = 'y2';
                    _this.set('axis.y2.show', true);
                } else {
                    _this.set('axis.y.show', true);
                }
            });

            this.toggleProperty('switch');
            return data;
        }),
        session: _ember['default'].inject.service('session'),
        projects: _ember['default'].computed('model.data.[]', function () {
            return [{ 'label': 'UUX', value: 'Q2.UUX' }];
        }),
        subType: _ember['default'].computed('model.data.[]', function () {
            return [{ 'label': 'Resolved', value: 'Resolved' }, { 'label': 'Field', value: 'Resolved.field' }, { 'label': 'Triaged', value: 'Resolved.triaged' }];
        }),
        metrics: _ember['default'].computed('model.data.[]', function () {
            return [{ 'label': 'total', value: 'total' }, { 'label': 'configuration', value: 'configuration.total' }, { 'label': 'as designed', value: 'asDesigned.total' }, { 'label': 'cannot reproduce', value: 'cannotReproduce.total' }, { 'label': 'won\'t fix', value: 'wontFix.total' }, { 'label': 'fixed', value: 'fixed.total' }, { 'label': 'p1', value: 'P1.total' }, { 'label': 'p2', value: 'P2.total' }, { 'label': 'p3', value: 'P3.total' }, { 'label': 'p4', value: 'P4.total' }];
        }),
        actions: {
            togglePercent: function togglePercent() {
                this.toggleProperty('percentToggle');
            },
            clear: function clear() {
                this.set('storedMetrics', []);
            },
            add_metric: function add_metric() {
                var key = this.get('activeKey');
                if (this.get('percentToggle')) {
                    key = '%' + this.get('activeKey');
                }
                this.get('storedMetrics').pushObject(key);
            },
            projectChange: function projectChange(value) {
                this.set('_projectKey', value);
            },
            metricChange: function metricChange(value) {
                this.set('_metricsKey', '.' + value);
            },
            subTypeChange: function subTypeChange(value) {
                if (value) {
                    this.set('_subTypeKey', '.' + value);
                    return;
                }
                this.set('_subTypeKey', '');
            }
        }
    });
});
define('hoa/helpers/app-version', ['exports', 'ember', 'hoa/config/environment', 'ember-cli-app-version/utils/regexp'], function (exports, _ember, _hoaConfigEnvironment, _emberCliAppVersionUtilsRegexp) {
  exports.appVersion = appVersion;
  var version = _hoaConfigEnvironment['default'].APP.version;

  function appVersion(_) {
    var hash = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    if (hash.hideSha) {
      return version.match(_emberCliAppVersionUtilsRegexp.versionRegExp)[0];
    }

    if (hash.hideVersion) {
      return version.match(_emberCliAppVersionUtilsRegexp.shaRegExp)[0];
    }

    return version;
  }

  exports['default'] = _ember['default'].Helper.helper(appVersion);
});
define('hoa/helpers/href-to', ['exports', 'ember-href-to/helpers/href-to'], function (exports, _emberHrefToHelpersHrefTo) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberHrefToHelpersHrefTo['default'];
    }
  });
  Object.defineProperty(exports, 'hrefTo', {
    enumerable: true,
    get: function get() {
      return _emberHrefToHelpersHrefTo.hrefTo;
    }
  });
});
define('hoa/helpers/is-after', ['exports', 'ember', 'hoa/config/environment', 'ember-moment/helpers/is-after'], function (exports, _ember, _hoaConfigEnvironment, _emberMomentHelpersIsAfter) {
  exports['default'] = _emberMomentHelpersIsAfter['default'].extend({
    globalAllowEmpty: !!_ember['default'].get(_hoaConfigEnvironment['default'], 'moment.allowEmpty')
  });
});
define('hoa/helpers/is-before', ['exports', 'ember', 'hoa/config/environment', 'ember-moment/helpers/is-before'], function (exports, _ember, _hoaConfigEnvironment, _emberMomentHelpersIsBefore) {
  exports['default'] = _emberMomentHelpersIsBefore['default'].extend({
    globalAllowEmpty: !!_ember['default'].get(_hoaConfigEnvironment['default'], 'moment.allowEmpty')
  });
});
define('hoa/helpers/is-between', ['exports', 'ember', 'hoa/config/environment', 'ember-moment/helpers/is-between'], function (exports, _ember, _hoaConfigEnvironment, _emberMomentHelpersIsBetween) {
  exports['default'] = _emberMomentHelpersIsBetween['default'].extend({
    globalAllowEmpty: !!_ember['default'].get(_hoaConfigEnvironment['default'], 'moment.allowEmpty')
  });
});
define('hoa/helpers/is-same-or-after', ['exports', 'ember', 'hoa/config/environment', 'ember-moment/helpers/is-same-or-after'], function (exports, _ember, _hoaConfigEnvironment, _emberMomentHelpersIsSameOrAfter) {
  exports['default'] = _emberMomentHelpersIsSameOrAfter['default'].extend({
    globalAllowEmpty: !!_ember['default'].get(_hoaConfigEnvironment['default'], 'moment.allowEmpty')
  });
});
define('hoa/helpers/is-same-or-before', ['exports', 'ember', 'hoa/config/environment', 'ember-moment/helpers/is-same-or-before'], function (exports, _ember, _hoaConfigEnvironment, _emberMomentHelpersIsSameOrBefore) {
  exports['default'] = _emberMomentHelpersIsSameOrBefore['default'].extend({
    globalAllowEmpty: !!_ember['default'].get(_hoaConfigEnvironment['default'], 'moment.allowEmpty')
  });
});
define('hoa/helpers/is-same', ['exports', 'ember', 'hoa/config/environment', 'ember-moment/helpers/is-same'], function (exports, _ember, _hoaConfigEnvironment, _emberMomentHelpersIsSame) {
  exports['default'] = _emberMomentHelpersIsSame['default'].extend({
    globalAllowEmpty: !!_ember['default'].get(_hoaConfigEnvironment['default'], 'moment.allowEmpty')
  });
});
define('hoa/helpers/moment-add', ['exports', 'ember', 'hoa/config/environment', 'ember-moment/helpers/moment-add'], function (exports, _ember, _hoaConfigEnvironment, _emberMomentHelpersMomentAdd) {
  exports['default'] = _emberMomentHelpersMomentAdd['default'].extend({
    globalAllowEmpty: !!_ember['default'].get(_hoaConfigEnvironment['default'], 'moment.allowEmpty')
  });
});
define('hoa/helpers/moment-calendar', ['exports', 'ember', 'hoa/config/environment', 'ember-moment/helpers/moment-calendar'], function (exports, _ember, _hoaConfigEnvironment, _emberMomentHelpersMomentCalendar) {
  exports['default'] = _emberMomentHelpersMomentCalendar['default'].extend({
    globalAllowEmpty: !!_ember['default'].get(_hoaConfigEnvironment['default'], 'moment.allowEmpty')
  });
});
define('hoa/helpers/moment-duration', ['exports', 'ember-moment/helpers/moment-duration'], function (exports, _emberMomentHelpersMomentDuration) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberMomentHelpersMomentDuration['default'];
    }
  });
});
define('hoa/helpers/moment-format', ['exports', 'ember', 'hoa/config/environment', 'ember-moment/helpers/moment-format'], function (exports, _ember, _hoaConfigEnvironment, _emberMomentHelpersMomentFormat) {
  exports['default'] = _emberMomentHelpersMomentFormat['default'].extend({
    globalAllowEmpty: !!_ember['default'].get(_hoaConfigEnvironment['default'], 'moment.allowEmpty')
  });
});
define('hoa/helpers/moment-from-now', ['exports', 'ember', 'hoa/config/environment', 'ember-moment/helpers/moment-from-now'], function (exports, _ember, _hoaConfigEnvironment, _emberMomentHelpersMomentFromNow) {
  exports['default'] = _emberMomentHelpersMomentFromNow['default'].extend({
    globalAllowEmpty: !!_ember['default'].get(_hoaConfigEnvironment['default'], 'moment.allowEmpty')
  });
});
define('hoa/helpers/moment-from', ['exports', 'ember', 'hoa/config/environment', 'ember-moment/helpers/moment-from'], function (exports, _ember, _hoaConfigEnvironment, _emberMomentHelpersMomentFrom) {
  exports['default'] = _emberMomentHelpersMomentFrom['default'].extend({
    globalAllowEmpty: !!_ember['default'].get(_hoaConfigEnvironment['default'], 'moment.allowEmpty')
  });
});
define('hoa/helpers/moment-subtract', ['exports', 'ember', 'hoa/config/environment', 'ember-moment/helpers/moment-subtract'], function (exports, _ember, _hoaConfigEnvironment, _emberMomentHelpersMomentSubtract) {
  exports['default'] = _emberMomentHelpersMomentSubtract['default'].extend({
    globalAllowEmpty: !!_ember['default'].get(_hoaConfigEnvironment['default'], 'moment.allowEmpty')
  });
});
define('hoa/helpers/moment-to-date', ['exports', 'ember', 'hoa/config/environment', 'ember-moment/helpers/moment-to-date'], function (exports, _ember, _hoaConfigEnvironment, _emberMomentHelpersMomentToDate) {
  exports['default'] = _emberMomentHelpersMomentToDate['default'].extend({
    globalAllowEmpty: !!_ember['default'].get(_hoaConfigEnvironment['default'], 'moment.allowEmpty')
  });
});
define('hoa/helpers/moment-to-now', ['exports', 'ember', 'hoa/config/environment', 'ember-moment/helpers/moment-to-now'], function (exports, _ember, _hoaConfigEnvironment, _emberMomentHelpersMomentToNow) {
  exports['default'] = _emberMomentHelpersMomentToNow['default'].extend({
    globalAllowEmpty: !!_ember['default'].get(_hoaConfigEnvironment['default'], 'moment.allowEmpty')
  });
});
define('hoa/helpers/moment-to', ['exports', 'ember', 'hoa/config/environment', 'ember-moment/helpers/moment-to'], function (exports, _ember, _hoaConfigEnvironment, _emberMomentHelpersMomentTo) {
  exports['default'] = _emberMomentHelpersMomentTo['default'].extend({
    globalAllowEmpty: !!_ember['default'].get(_hoaConfigEnvironment['default'], 'moment.allowEmpty')
  });
});
define('hoa/helpers/moment-unix', ['exports', 'ember-moment/helpers/unix'], function (exports, _emberMomentHelpersUnix) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberMomentHelpersUnix['default'];
    }
  });
  Object.defineProperty(exports, 'unix', {
    enumerable: true,
    get: function get() {
      return _emberMomentHelpersUnix.unix;
    }
  });
});
define('hoa/helpers/moment', ['exports', 'ember-moment/helpers/moment'], function (exports, _emberMomentHelpersMoment) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberMomentHelpersMoment['default'];
    }
  });
});
define('hoa/helpers/now', ['exports', 'ember-moment/helpers/now'], function (exports, _emberMomentHelpersNow) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberMomentHelpersNow['default'];
    }
  });
});
define('hoa/helpers/pluralize', ['exports', 'ember-inflector/lib/helpers/pluralize'], function (exports, _emberInflectorLibHelpersPluralize) {
  exports['default'] = _emberInflectorLibHelpersPluralize['default'];
});
define('hoa/helpers/singularize', ['exports', 'ember-inflector/lib/helpers/singularize'], function (exports, _emberInflectorLibHelpersSingularize) {
  exports['default'] = _emberInflectorLibHelpersSingularize['default'];
});
define('hoa/helpers/unix', ['exports', 'ember-moment/helpers/unix'], function (exports, _emberMomentHelpersUnix) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberMomentHelpersUnix['default'];
    }
  });
  Object.defineProperty(exports, 'unix', {
    enumerable: true,
    get: function get() {
      return _emberMomentHelpersUnix.unix;
    }
  });
});
define('hoa/initializers/app-version', ['exports', 'ember-cli-app-version/initializer-factory', 'hoa/config/environment'], function (exports, _emberCliAppVersionInitializerFactory, _hoaConfigEnvironment) {
  var _config$APP = _hoaConfigEnvironment['default'].APP;
  var name = _config$APP.name;
  var version = _config$APP.version;
  exports['default'] = {
    name: 'App Version',
    initialize: (0, _emberCliAppVersionInitializerFactory['default'])(name, version)
  };
});
define('hoa/initializers/container-debug-adapter', ['exports', 'ember-resolver/container-debug-adapter'], function (exports, _emberResolverContainerDebugAdapter) {
  exports['default'] = {
    name: 'container-debug-adapter',

    initialize: function initialize() {
      var app = arguments[1] || arguments[0];

      app.register('container-debug-adapter:main', _emberResolverContainerDebugAdapter['default']);
      app.inject('container-debug-adapter:main', 'namespace', 'application:main');
    }
  };
});
define('hoa/initializers/data-adapter', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `data-adapter` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'data-adapter',
    before: 'store',
    initialize: function initialize() {}
  };
});
define('hoa/initializers/ember-data', ['exports', 'ember-data/setup-container', 'ember-data/-private/core'], function (exports, _emberDataSetupContainer, _emberDataPrivateCore) {

  /*
  
    This code initializes Ember-Data onto an Ember application.
  
    If an Ember.js developer defines a subclass of DS.Store on their application,
    as `App.StoreService` (or via a module system that resolves to `service:store`)
    this code will automatically instantiate it and make it available on the
    router.
  
    Additionally, after an application's controllers have been injected, they will
    each have the store made available to them.
  
    For example, imagine an Ember.js application with the following classes:
  
    App.StoreService = DS.Store.extend({
      adapter: 'custom'
    });
  
    App.PostsController = Ember.Controller.extend({
      // ...
    });
  
    When the application is initialized, `App.ApplicationStore` will automatically be
    instantiated, and the instance of `App.PostsController` will have its `store`
    property set to that instance.
  
    Note that this code will only be run if the `ember-application` package is
    loaded. If Ember Data is being used in an environment other than a
    typical application (e.g., node.js where only `ember-runtime` is available),
    this code will be ignored.
  */

  exports['default'] = {
    name: 'ember-data',
    initialize: _emberDataSetupContainer['default']
  };
});
define('hoa/initializers/ember-simple-auth', ['exports', 'ember', 'hoa/config/environment', 'ember-simple-auth/configuration', 'ember-simple-auth/initializers/setup-session', 'ember-simple-auth/initializers/setup-session-service'], function (exports, _ember, _hoaConfigEnvironment, _emberSimpleAuthConfiguration, _emberSimpleAuthInitializersSetupSession, _emberSimpleAuthInitializersSetupSessionService) {
  exports['default'] = {
    name: 'ember-simple-auth',
    initialize: function initialize(registry) {
      var config = _hoaConfigEnvironment['default']['ember-simple-auth'] || {};
      config.baseURL = _hoaConfigEnvironment['default'].rootURL || _hoaConfigEnvironment['default'].baseURL;
      _emberSimpleAuthConfiguration['default'].load(config);

      (0, _emberSimpleAuthInitializersSetupSession['default'])(registry);
      (0, _emberSimpleAuthInitializersSetupSessionService['default'])(registry);
    }
  };
});
define('hoa/initializers/export-application-global', ['exports', 'ember', 'hoa/config/environment'], function (exports, _ember, _hoaConfigEnvironment) {
  exports.initialize = initialize;

  function initialize() {
    var application = arguments[1] || arguments[0];
    if (_hoaConfigEnvironment['default'].exportApplicationGlobal !== false) {
      var theGlobal;
      if (typeof window !== 'undefined') {
        theGlobal = window;
      } else if (typeof global !== 'undefined') {
        theGlobal = global;
      } else if (typeof self !== 'undefined') {
        theGlobal = self;
      } else {
        // no reasonable global, just bail
        return;
      }

      var value = _hoaConfigEnvironment['default'].exportApplicationGlobal;
      var globalName;

      if (typeof value === 'string') {
        globalName = value;
      } else {
        globalName = _ember['default'].String.classify(_hoaConfigEnvironment['default'].modulePrefix);
      }

      if (!theGlobal[globalName]) {
        theGlobal[globalName] = application;

        application.reopen({
          willDestroy: function willDestroy() {
            this._super.apply(this, arguments);
            delete theGlobal[globalName];
          }
        });
      }
    }
  }

  exports['default'] = {
    name: 'export-application-global',

    initialize: initialize
  };
});
define('hoa/initializers/injectStore', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `injectStore` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'injectStore',
    before: 'store',
    initialize: function initialize() {}
  };
});
define('hoa/initializers/store', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `store` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'store',
    after: 'ember-data',
    initialize: function initialize() {}
  };
});
define('hoa/initializers/transforms', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `transforms` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'transforms',
    before: 'store',
    initialize: function initialize() {}
  };
});
define('hoa/instance-initializers/browser/ember-href-to', ['exports', 'ember', 'ember-href-to/href-to'], function (exports, _ember, _emberHrefToHrefTo) {
  exports['default'] = {
    name: 'ember-href-to',
    initialize: function initialize(applicationInstance) {
      var $body = _ember['default'].$(document.body);
      $body.off('click.href-to', 'a');

      $body.on('click.href-to', 'a', function (e) {
        var hrefTo = new _emberHrefToHrefTo['default'](applicationInstance, e);
        hrefTo.maybeHandle();

        return true;
      });
    }
  };
});
define("hoa/instance-initializers/ember-data", ["exports", "ember-data/-private/instance-initializers/initialize-store-service"], function (exports, _emberDataPrivateInstanceInitializersInitializeStoreService) {
  exports["default"] = {
    name: "ember-data",
    initialize: _emberDataPrivateInstanceInitializersInitializeStoreService["default"]
  };
});
define('hoa/instance-initializers/ember-simple-auth', ['exports', 'ember-simple-auth/instance-initializers/setup-session-restoration'], function (exports, _emberSimpleAuthInstanceInitializersSetupSessionRestoration) {
  exports['default'] = {
    name: 'ember-simple-auth',
    initialize: function initialize(instance) {
      (0, _emberSimpleAuthInstanceInitializersSetupSessionRestoration['default'])(instance);
    }
  };
});
define('hoa/models/retail-kpi', ['exports', 'ember-data'], function (exports, _emberData) {
    exports['default'] = _emberData['default'].Model.extend({
        // bugsOpened: DS.attr('number', { defaultValue: 1024 }),
        // bugsResolved: {
        //     total: DS.attr('number', { defaultValue: 808 }),
        //     configuration: DS.attr('number', { defaultValue: 81 }),
        //     cannotReproduce: DS.attr('number', { defaultValue: 65 }),
        //     duplicate: DS.attr('number', { defaultValue: 105 }),
        //     asDesigned: DS.attr('number', { defaultValue: 39 }),
        //     wontFix: DS.attr('number', { defaultValue: 68 }),
        //     fixed: DS.attr('number', { defaultValue: 439 }),
        //     nintyPercent: DS.attr('number', { defaultValue: 90 }),
        //     eightyPercent: DS.attr('number', { defaultValue: 50 }),
        //     seventyPercent: DS.attr('number', { defaultValue: 32 }),
        //     fiftyPercent: DS.attr('number', { defaultValue: 12 }),
        //     field: {
        //         total: DS.attr('number', { defaultValue: 417 }),
        //         P1: {
        //             avgDays: DS.attr('number', { defaultValue: 11.1 }),
        //             total: DS.attr('number', { defaultValue: 21 }),
        //             configuration: DS.attr('number', { defaultValue: 81 }),
        //             cannotReproduce: DS.attr('number', { defaultValue: 65 }),
        //             duplicate: DS.attr('number', { defaultValue: 105 }),
        //             asDesigned: DS.attr('number', { defaultValue: 39 }),
        //             wontFix: DS.attr('number', { defaultValue: 68 }),
        //             fixed: DS.attr('number', { defaultValue: 439 })
        //         },
        //         P2: {
        //             avgDays: DS.attr('number', { defaultValue: 15 }),
        //             total: DS.attr('number', { defaultValue: 21 }),
        //             configuration: DS.attr('number', { defaultValue: 81 }),
        //             cannotReproduce: DS.attr('number', { defaultValue: 65 }),
        //             duplicate: DS.attr('number', { defaultValue: 105 }),
        //             asDesigned: DS.attr('number', { defaultValue: 39 }),
        //             wontFix: DS.attr('number', { defaultValue: 68 }),
        //             fixed: DS.attr('number', { defaultValue: 439 })
        //         },
        //         P3: {
        //             avgDays: DS.attr('number', { defaultValue: 40 }),
        //             total: DS.attr('number', { defaultValue: 21 }),
        //             configuration: DS.attr('number', { defaultValue: 81 }),
        //             cannotReproduce: DS.attr('number', { defaultValue: 65 }),
        //             duplicate: DS.attr('number', { defaultValue: 105 }),
        //             asDesigned: DS.attr('number', { defaultValue: 39 }),
        //             wontFix: DS.attr('number', { defaultValue: 68 }),
        //             fixed: DS.attr('number', { defaultValue: 439 })
        //         },
        //         P4: {
        //             avgDays: DS.attr('number', { defaultValue: 31 }),
        //             total: DS.attr('number', { defaultValue: 21 }),
        //             configuration: DS.attr('number', { defaultValue: 81 }),
        //             cannotReproduce: DS.attr('number', { defaultValue: 65 }),
        //             duplicate: DS.attr('number', { defaultValue: 105 }),
        //             asDesigned: DS.attr('number', { defaultValue: 39 }),
        //             wontFix: DS.attr('number', { defaultValue: 68 }),
        //             fixed: DS.attr('number', { defaultValue: 439 })
        //         }
        //     },
        //     triaged: {
        //         total: DS.attr('number', { defaultValue: 261 }),
        //         P1: {
        //             avgDays: DS.attr('number', { defaultValue: 22.1 }),
        //             total: DS.attr('number', { defaultValue: 22 }),
        //             configuration: DS.attr('number', { defaultValue: 81 }),
        //             cannotReproduce: DS.attr('number', { defaultValue: 65 }),
        //             duplicate: DS.attr('number', { defaultValue: 105 }),
        //             asDesigned: DS.attr('number', { defaultValue: 39 }),
        //             wontFix: DS.attr('number', { defaultValue: 68 }),
        //             fixed: DS.attr('number', { defaultValue: 12 })
        //         },
        //         P2: {
        //             avgDays: DS.attr('number', { defaultValue: 15 }),
        //             total: DS.attr('number', { defaultValue: 50 }),
        //             configuration: DS.attr('number', { defaultValue: 81 }),
        //             cannotReproduce: DS.attr('number', { defaultValue: 65 }),
        //             duplicate: DS.attr('number', { defaultValue: 105 }),
        //             asDesigned: DS.attr('number', { defaultValue: 39 }),
        //             wontFix: DS.attr('number', { defaultValue: 68 }),
        //             fixed: DS.attr('number', { defaultValue: 26 })
        //         },
        //         P3: {
        //             avgDays: DS.attr('number', { defaultValue: 161 }),
        //             total: DS.attr('number', { defaultValue: 21 }),
        //             configuration: DS.attr('number', { defaultValue: 81 }),
        //             cannotReproduce: DS.attr('number', { defaultValue: 65 }),
        //             duplicate: DS.attr('number', { defaultValue: 105 }),
        //             asDesigned: DS.attr('number', { defaultValue: 39 }),
        //             wontFix: DS.attr('number', { defaultValue: 68 }),
        //             fixed: DS.attr('number', { defaultValue: 106 })
        //         },
        //         P4: {
        //             avgDays: DS.attr('number', { defaultValue: 31 }),
        //             total: DS.attr('number', { defaultValue: 28 }),
        //             configuration: DS.attr('number', { defaultValue: 81 }),
        //             cannotReproduce: DS.attr('number', { defaultValue: 65 }),
        //             duplicate: DS.attr('number', { defaultValue: 105 }),
        //             asDesigned: DS.attr('number', { defaultValue: 39 }),
        //             wontFix: DS.attr('number', { defaultValue: 68 }),
        //             fixed: DS.attr('number', { defaultValue: 14 })
        //         }
        //     }
        // }
    });
});
define('hoa/models/retail-kpis', ['exports', 'ember-data'], function (exports, _emberData) {
    exports['default'] = _emberData['default'].Model.extend({
        datapoints: _emberData['default'].hasMany('retail-kpi')
    });
});
define('hoa/models/user', ['exports', 'ember-data'], function (exports, _emberData) {
    exports['default'] = _emberData['default'].Model.extend({
        username: _emberData['default'].attr('string'),
        password: _emberData['default'].attr('string'),
        first_name: _emberData['default'].attr('string'),
        last_name: _emberData['default'].attr('string'),
        email: _emberData['default'].attr('string'),
        picture: _emberData['default'].attr('string'),
        is_moderator: _emberData['default'].attr('boolean'),
        status: _emberData['default'].attr('string'),
        user_status: _emberData['default'].belongsTo('user-status'),
        last_activity: _emberData['default'].attr('date'),
        facebookId: _emberData['default'].attr('string')
    });
});
define('hoa/resolver', ['exports', 'ember-resolver'], function (exports, _emberResolver) {
  exports['default'] = _emberResolver['default'];
});
define('hoa/router', ['exports', 'ember', 'hoa/config/environment'], function (exports, _ember, _hoaConfigEnvironment) {

  var Router = _ember['default'].Router.extend({
    location: _hoaConfigEnvironment['default'].locationType,
    rootURL: _hoaConfigEnvironment['default'].rootURL
  });

  Router.map(function () {
    this.route('forum');
  });

  exports['default'] = Router;
});
define('hoa/routes/application', ['exports', 'ember'], function (exports, _ember) {

  // Ensure the application route exists for ember-simple-auth's `setup-session-restoration` initializer
  exports['default'] = _ember['default'].Route.extend();
});
define('hoa/routes/index', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Route.extend({
        ajax: _ember['default'].inject.service(),
        model: function model() {
            return this.get('ajax').request('/retailKpis');
        }
    });
});
define('hoa/services/ajax', ['exports', 'ember', 'ember-ajax/services/ajax'], function (exports, _ember, _emberAjaxServicesAjax) {
  exports['default'] = _emberAjaxServicesAjax['default'].extend({
    host: 'http://localhost:8001/manager_dashboard_api'
  });
});
define('hoa/services/cookies', ['exports', 'ember-cookies/services/cookies'], function (exports, _emberCookiesServicesCookies) {
  exports['default'] = _emberCookiesServicesCookies['default'];
});
define('hoa/services/moment', ['exports', 'ember', 'hoa/config/environment', 'ember-moment/services/moment'], function (exports, _ember, _hoaConfigEnvironment, _emberMomentServicesMoment) {
  exports['default'] = _emberMomentServicesMoment['default'].extend({
    defaultFormat: _ember['default'].get(_hoaConfigEnvironment['default'], 'moment.outputFormat')
  });
});
define('hoa/services/session-user', ['exports', 'ember'], function (exports, _ember) {
  var service = _ember['default'].inject.service;
  var RSVP = _ember['default'].RSVP;
  var Service = _ember['default'].Service;
  var isEmpty = _ember['default'].isEmpty;
  exports['default'] = Service.extend({
    session: service('session'),
    store: service(),

    loadCurrentUser: function loadCurrentUser() {
      var _this = this;

      return new RSVP.Promise(function (resolve, reject) {
        var accountId = _this.get('session.data.authenticated.account_id');
        if (!isEmpty(accountId)) {
          _this.get('store').find('account', accountId).then(function (account) {
            _this.set('account', account);
            resolve();
          }, reject);
        } else {
          resolve();
        }
      });
    }
  });
});
define('hoa/services/session', ['exports', 'ember-simple-auth/services/session'], function (exports, _emberSimpleAuthServicesSession) {
  exports['default'] = _emberSimpleAuthServicesSession['default'];
});
define('hoa/session-stores/application', ['exports', 'ember-simple-auth/session-stores/adaptive'], function (exports, _emberSimpleAuthSessionStoresAdaptive) {
  exports['default'] = _emberSimpleAuthSessionStoresAdaptive['default'].extend();
});
define("hoa/templates/application", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "36rHyY5C", "block": "{\"statements\":[[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"demo-layout mdl-layout mdl-js-layout mdl-layout--fixed-drawer mdl-layout--fixed-header\"],[\"flush-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"header\",[]],[\"static-attr\",\"class\",\"demo-header mdl-layout__header mdl-color--grey-100 mdl-color-text--grey-600\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"mdl-layout__header-row\"],[\"flush-element\"],[\"text\",\"\\n          \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"mdl-layout-title\"],[\"flush-element\"],[\"text\",\"Home\"],[\"close-element\"],[\"text\",\"\\n          \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"mdl-layout-spacer\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n          \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"mdl-textfield mdl-js-textfield mdl-textfield--expandable\"],[\"flush-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"label\",[]],[\"static-attr\",\"class\",\"mdl-button mdl-js-button mdl-button--icon\"],[\"static-attr\",\"for\",\"search\"],[\"flush-element\"],[\"text\",\"\\n              \"],[\"open-element\",\"i\",[]],[\"static-attr\",\"class\",\"material-icons\"],[\"flush-element\"],[\"text\",\"search\"],[\"close-element\"],[\"text\",\"\\n            \"],[\"close-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"mdl-textfield__expandable-holder\"],[\"flush-element\"],[\"text\",\"\\n              \"],[\"open-element\",\"input\",[]],[\"static-attr\",\"class\",\"mdl-textfield__input\"],[\"static-attr\",\"type\",\"text\"],[\"static-attr\",\"id\",\"search\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n              \"],[\"open-element\",\"label\",[]],[\"static-attr\",\"class\",\"mdl-textfield__label\"],[\"static-attr\",\"for\",\"search\"],[\"flush-element\"],[\"text\",\"Enter your query...\"],[\"close-element\"],[\"text\",\"\\n            \"],[\"close-element\"],[\"text\",\"\\n          \"],[\"close-element\"],[\"text\",\"\\n          \"],[\"open-element\",\"button\",[]],[\"static-attr\",\"class\",\"mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon\"],[\"static-attr\",\"id\",\"hdrbtn\"],[\"flush-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"i\",[]],[\"static-attr\",\"class\",\"material-icons\"],[\"flush-element\"],[\"text\",\"more_vert\"],[\"close-element\"],[\"text\",\"\\n          \"],[\"close-element\"],[\"text\",\"\\n          \"],[\"open-element\",\"ul\",[]],[\"static-attr\",\"class\",\"mdl-menu mdl-js-menu mdl-js-ripple-effect mdl-menu--bottom-right\"],[\"static-attr\",\"for\",\"hdrbtn\"],[\"flush-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"li\",[]],[\"static-attr\",\"class\",\"mdl-menu__item\"],[\"flush-element\"],[\"text\",\"About\"],[\"close-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"li\",[]],[\"static-attr\",\"class\",\"mdl-menu__item\"],[\"flush-element\"],[\"text\",\"Contact\"],[\"close-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"li\",[]],[\"static-attr\",\"class\",\"mdl-menu__item\"],[\"flush-element\"],[\"text\",\"Legal information\"],[\"close-element\"],[\"text\",\"\\n          \"],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"demo-drawer mdl-layout__drawer mdl-color--blue-grey-900 mdl-color-text--blue-grey-50\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"header\",[]],[\"static-attr\",\"class\",\"demo-drawer-header\"],[\"flush-element\"],[\"text\",\"\\n          \"],[\"open-element\",\"img\",[]],[\"static-attr\",\"src\",\"images/user.jpg\"],[\"static-attr\",\"class\",\"demo-avatar\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n          \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"demo-avatar-dropdown\"],[\"flush-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"text\",\"hello@example.com\"],[\"close-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"mdl-layout-spacer\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"button\",[]],[\"static-attr\",\"id\",\"accbtn\"],[\"static-attr\",\"class\",\"mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon\"],[\"flush-element\"],[\"text\",\"\\n              \"],[\"open-element\",\"i\",[]],[\"static-attr\",\"class\",\"material-icons\"],[\"static-attr\",\"role\",\"presentation\"],[\"flush-element\"],[\"text\",\"arrow_drop_down\"],[\"close-element\"],[\"text\",\"\\n              \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"visuallyhidden\"],[\"flush-element\"],[\"text\",\"Accounts\"],[\"close-element\"],[\"text\",\"\\n            \"],[\"close-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"ul\",[]],[\"static-attr\",\"class\",\"mdl-menu mdl-menu--bottom-right mdl-js-menu mdl-js-ripple-effect\"],[\"static-attr\",\"for\",\"accbtn\"],[\"flush-element\"],[\"text\",\"\\n              \"],[\"open-element\",\"li\",[]],[\"static-attr\",\"class\",\"mdl-menu__item\"],[\"flush-element\"],[\"text\",\"hello@example.com\"],[\"close-element\"],[\"text\",\"\\n              \"],[\"open-element\",\"li\",[]],[\"static-attr\",\"class\",\"mdl-menu__item\"],[\"flush-element\"],[\"text\",\"info@example.com\"],[\"close-element\"],[\"text\",\"\\n              \"],[\"open-element\",\"li\",[]],[\"static-attr\",\"class\",\"mdl-menu__item\"],[\"flush-element\"],[\"open-element\",\"i\",[]],[\"static-attr\",\"class\",\"material-icons\"],[\"flush-element\"],[\"text\",\"add\"],[\"close-element\"],[\"text\",\"Add another account...\"],[\"close-element\"],[\"text\",\"\\n            \"],[\"close-element\"],[\"text\",\"\\n          \"],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"nav\",[]],[\"static-attr\",\"class\",\"demo-navigation mdl-navigation mdl-color--blue-grey-800\"],[\"flush-element\"],[\"text\",\"\\n          \"],[\"open-element\",\"a\",[]],[\"static-attr\",\"class\",\"mdl-navigation__link\"],[\"dynamic-attr\",\"href\",[\"concat\",[[\"helper\",[\"href-to\"],[\"index\"],null]]]],[\"flush-element\"],[\"open-element\",\"i\",[]],[\"static-attr\",\"class\",\"mdl-color-text--blue-grey-400 material-icons\"],[\"static-attr\",\"role\",\"presentation\"],[\"flush-element\"],[\"text\",\"home\"],[\"close-element\"],[\"text\",\"Home\"],[\"close-element\"],[\"text\",\"\\n          \"],[\"open-element\",\"a\",[]],[\"static-attr\",\"class\",\"mdl-navigation__link\"],[\"dynamic-attr\",\"href\",[\"concat\",[[\"helper\",[\"href-to\"],[\"forum\"],null]]]],[\"flush-element\"],[\"open-element\",\"i\",[]],[\"static-attr\",\"class\",\"mdl-color-text--blue-grey-400 material-icons\"],[\"static-attr\",\"role\",\"presentation\"],[\"flush-element\"],[\"text\",\"forum\"],[\"close-element\"],[\"text\",\"Forums\"],[\"close-element\"],[\"text\",\"\\n          \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"mdl-layout-spacer\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n          \"],[\"open-element\",\"a\",[]],[\"static-attr\",\"class\",\"mdl-navigation__link\"],[\"static-attr\",\"href\",\"\"],[\"flush-element\"],[\"open-element\",\"i\",[]],[\"static-attr\",\"class\",\"mdl-color-text--blue-grey-400 material-icons\"],[\"static-attr\",\"role\",\"presentation\"],[\"flush-element\"],[\"text\",\"help_outline\"],[\"close-element\"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"visuallyhidden\"],[\"flush-element\"],[\"text\",\"Help\"],[\"close-element\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"main\",[]],[\"static-attr\",\"class\",\"mdl-layout__content mdl-color--grey-100\"],[\"flush-element\"],[\"text\",\"\\n              \"],[\"append\",[\"unknown\",[\"outlet\"]],false],[\"text\",\"\\n      \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "hoa/templates/application.hbs" } });
});
define("hoa/templates/components/login-form", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "M5JYeTgI", "block": "{\"statements\":[[\"text\",\"\\t\"],[\"open-element\",\"form\",[]],[\"modifier\",[\"action\"],[[\"get\",[null]],\"login\"]],[\"flush-element\"],[\"text\",\"\\n\\t  \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"mdl-textfield mdl-js-textfield mdl-cell mdl-cell--12-col\"],[\"flush-element\"],[\"text\",\"\\n\\t    \"],[\"append\",[\"helper\",[\"input\"],null,[[\"class\",\"id\"],[\"mdl-textfield__input\",\"username\"]]],false],[\"text\",\"\\n\\t    \"],[\"open-element\",\"label\",[]],[\"static-attr\",\"class\",\"mdl-textfield__label\"],[\"static-attr\",\"for\",\"username\"],[\"flush-element\"],[\"text\",\"Username\"],[\"close-element\"],[\"text\",\"\\n\\t  \"],[\"close-element\"],[\"text\",\"\\n\\t  \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"mdl-textfield mdl-js-textfield mdl-cell mdl-cell--12-col\"],[\"flush-element\"],[\"text\",\"\\n\\t    \"],[\"append\",[\"helper\",[\"input\"],null,[[\"class\",\"type\",\"id\"],[\"mdl-textfield__input\",\"password\",\"password\"]]],false],[\"text\",\"\\n\\t    \"],[\"open-element\",\"label\",[]],[\"static-attr\",\"class\",\"mdl-textfield__label\"],[\"static-attr\",\"for\",\"password\"],[\"flush-element\"],[\"text\",\"Password\"],[\"close-element\"],[\"text\",\"\\n\\t  \"],[\"close-element\"],[\"text\",\"\\n\\t  \"],[\"open-element\",\"button\",[]],[\"static-attr\",\"class\",\"mdl-button mdl-js-button mdl-js-ripple-effect\"],[\"flush-element\"],[\"text\",\"Login\"],[\"close-element\"],[\"text\",\"\\n\\t\"],[\"close-element\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "hoa/templates/components/login-form.hbs" } });
});
define("hoa/templates/index", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "QdcwbTYG", "block": "{\"statements\":[[\"open-element\",\"label\",[]],[\"flush-element\"],[\"text\",\"Project:\"],[\"close-element\"],[\"text\",\"\\n\"],[\"open-element\",\"select\",[]],[\"dynamic-attr\",\"onchange\",[\"helper\",[\"action\"],[[\"get\",[null]],\"projectChange\"],[[\"value\"],[\"target.value\"]]],null],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"option\",[]],[\"flush-element\"],[\"text\",\"Choose a Project\"],[\"close-element\"],[\"text\",\"\\n\"],[\"block\",[\"each\"],[[\"get\",[\"projects\"]]],null,2],[\"close-element\"],[\"text\",\"\\n\"],[\"open-element\",\"label\",[]],[\"flush-element\"],[\"text\",\"Sub-type:\"],[\"close-element\"],[\"text\",\"\\n\"],[\"open-element\",\"select\",[]],[\"dynamic-attr\",\"onchange\",[\"helper\",[\"action\"],[[\"get\",[null]],\"subTypeChange\"],[[\"value\"],[\"target.value\"]]],null],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"option\",[]],[\"static-attr\",\"value\",\"\"],[\"flush-element\"],[\"text\",\"Choose a SubType\"],[\"close-element\"],[\"text\",\"\\n\"],[\"block\",[\"each\"],[[\"get\",[\"subType\"]]],null,1],[\"close-element\"],[\"text\",\"\\n\"],[\"open-element\",\"label\",[]],[\"flush-element\"],[\"text\",\"Metric:\"],[\"close-element\"],[\"text\",\"\\n\"],[\"open-element\",\"select\",[]],[\"dynamic-attr\",\"onchange\",[\"helper\",[\"action\"],[[\"get\",[null]],\"metricChange\"],[[\"value\"],[\"target.value\"]]],null],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"option\",[]],[\"flush-element\"],[\"text\",\"Choose a Metric\"],[\"close-element\"],[\"text\",\"\\n\"],[\"block\",[\"each\"],[[\"get\",[\"metrics\"]]],null,0],[\"close-element\"],[\"text\",\"\\n\"],[\"open-element\",\"input\",[]],[\"static-attr\",\"type\",\"checkbox\"],[\"static-attr\",\"name\",\"percent\"],[\"dynamic-attr\",\"value\",[\"unknown\",[\"percentToggle\"]],null],[\"dynamic-attr\",\"onclick\",[\"helper\",[\"action\"],[[\"get\",[null]],\"togglePercent\"],null],null],[\"flush-element\"],[\"close-element\"],[\"text\",\"%\"],[\"open-element\",\"br\",[]],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\"],[\"open-element\",\"button\",[]],[\"modifier\",[\"action\"],[[\"get\",[null]],\"add_metric\"]],[\"flush-element\"],[\"text\",\"Add\"],[\"close-element\"],[\"open-element\",\"button\",[]],[\"modifier\",[\"action\"],[[\"get\",[null]],\"clear\"]],[\"flush-element\"],[\"text\",\"Clear\"],[\"close-element\"],[\"text\",\"\\n\"],[\"append\",[\"helper\",[\"c3-chart\"],null,[[\"data\",\"axis\"],[[\"get\",[\"data\"]],[\"get\",[\"axis\"]]]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"        \"],[\"open-element\",\"option\",[]],[\"dynamic-attr\",\"value\",[\"unknown\",[\"option\",\"value\"]],null],[\"flush-element\"],[\"append\",[\"unknown\",[\"option\",\"label\"]],false],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[\"option\"]},{\"statements\":[[\"text\",\"        \"],[\"open-element\",\"option\",[]],[\"dynamic-attr\",\"value\",[\"unknown\",[\"option\",\"value\"]],null],[\"flush-element\"],[\"append\",[\"unknown\",[\"option\",\"label\"]],false],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[\"option\"]},{\"statements\":[[\"text\",\"        \"],[\"open-element\",\"option\",[]],[\"dynamic-attr\",\"value\",[\"unknown\",[\"option\",\"value\"]],null],[\"flush-element\"],[\"append\",[\"unknown\",[\"option\",\"label\"]],false],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[\"option\"]}],\"hasPartials\":false}", "meta": { "moduleName": "hoa/templates/index.hbs" } });
});
/* jshint ignore:start */



/* jshint ignore:end */

/* jshint ignore:start */

define('hoa/config/environment', ['ember'], function(Ember) {
  var prefix = 'hoa';
/* jshint ignore:start */

try {
  var metaName = prefix + '/config/environment';
  var rawConfig = document.querySelector('meta[name="' + metaName + '"]').getAttribute('content');
  var config = JSON.parse(unescape(rawConfig));

  var exports = { 'default': config };

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

/* jshint ignore:end */

});

/* jshint ignore:end */

/* jshint ignore:start */

if (!runningTests) {
  require("hoa/app")["default"].create({"name":"hoa","version":"0.0.0+2d6ebeeb"});
}

/* jshint ignore:end */
//# sourceMappingURL=hoa.map
