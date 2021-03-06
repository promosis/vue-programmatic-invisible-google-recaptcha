//
//
//
//
//
//
//
//
//

var script = {
    name: 'vue-programmatic-invisible-google-recaptcha',
    props: {
        sitekey: {
            type: String,
            required: true
        },
        elementId: {
            type: String,
            required: true
        },
        showBadgeMobile: {
            type: Boolean,
            default: true
        },
        showBadgeDesktop: {
            type: Boolean,
            default: true
        },
        badgePosition: {
            type: String
        }
    },
    data: function data () {
        return {
            gAssignedId: null,
            captchaReady: false,
            checkInterval: null,
            checkIntervalRunCount: 0
        }
    },
    computed: {
        styleClassObject: function () {
            return {
                'g-recaptcha--left': (this.badgePosition === 'left'),
                'g-recaptcha--mobile-hidden': (!this.showBadgeMobile),
                'g-recaptcha--desktop-hidden': (!this.showBadgeDesktop)
            }
        }
    },
    methods: {
        execute: function execute () {
            window.grecaptcha.execute(this.gAssignedId);
        },
        reset: function reset () {
            window.grecaptcha.reset(this.gAssignedId);
        },
        callback: function callback (recaptchaToken) {
            // Emit an event called recaptchaCallback with the recaptchaToken as payload
            this.$emit('recaptcha-callback', recaptchaToken);

            // Reset the recaptcha widget so you can execute it again
            this.reset();
        },
        render: function render () {
            var this$1 = this;

            this.gAssignedId = window.grecaptcha.render(this.elementId, {
                sitekey: this.sitekey,
                size: 'invisible',
                // the callback executed when the user solve the recaptcha
                'callback': function (recaptchaToken) {
                    this$1.callback(recaptchaToken);
                },
                'expired-callback': function () {
                    this$1.reset();
                }
            });
        },
        init: function init() {
            var this$1 = this;

            // render the recaptcha widget when the component is mounted
            // we'll watch the captchaReady value in order to
            this.checkInterval = setInterval(function () {
                this$1.checkIntervalRunCount++;
                if (window.grecaptcha && window.grecaptcha.hasOwnProperty('render')){
                    this$1.captchaReady = true;
                }
            }, 1000);
        }
    },
    watch: {
        captchaReady: function(data) {
            if (data) {
                clearInterval(this.checkInterval);
                this.render();
            }
        }
    },
    mounted: function mounted () {
        // Initialize the recaptcha
        this.init();
    }
};

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier
/* server only */
, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
  if (typeof shadowMode !== 'boolean') {
    createInjectorSSR = createInjector;
    createInjector = shadowMode;
    shadowMode = false;
  } // Vue.extend constructor export interop.


  var options = typeof script === 'function' ? script.options : script; // render functions

  if (template && template.render) {
    options.render = template.render;
    options.staticRenderFns = template.staticRenderFns;
    options._compiled = true; // functional template

    if (isFunctionalTemplate) {
      options.functional = true;
    }
  } // scopedId


  if (scopeId) {
    options._scopeId = scopeId;
  }

  var hook;

  if (moduleIdentifier) {
    // server build
    hook = function hook(context) {
      // 2.3 injection
      context = context || // cached call
      this.$vnode && this.$vnode.ssrContext || // stateful
      this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext; // functional
      // 2.2 with runInNewContext: true

      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__;
      } // inject component styles


      if (style) {
        style.call(this, createInjectorSSR(context));
      } // register component module identifier for async chunk inference


      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier);
      }
    }; // used by ssr in case component is cached and beforeCreate
    // never gets called


    options._ssrRegister = hook;
  } else if (style) {
    hook = shadowMode ? function () {
      style.call(this, createInjectorShadow(this.$root.$options.shadowRoot));
    } : function (context) {
      style.call(this, createInjector(context));
    };
  }

  if (hook) {
    if (options.functional) {
      // register for functional component in vue file
      var originalRender = options.render;

      options.render = function renderWithStyleInjection(h, context) {
        hook.call(context);
        return originalRender(h, context);
      };
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate;
      options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
    }
  }

  return script;
}

var normalizeComponent_1 = normalizeComponent;

var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
function createInjector(context) {
  return function (id, style) {
    return addStyle(id, style);
  };
}
var HEAD = document.head || document.getElementsByTagName('head')[0];
var styles = {};

function addStyle(id, css) {
  var group = isOldIE ? css.media || 'default' : id;
  var style = styles[group] || (styles[group] = {
    ids: new Set(),
    styles: []
  });

  if (!style.ids.has(id)) {
    style.ids.add(id);
    var code = css.source;

    if (css.map) {
      // https://developer.chrome.com/devtools/docs/javascript-debugging
      // this makes source maps inside style tags work properly in Chrome
      code += '\n/*# sourceURL=' + css.map.sources[0] + ' */'; // http://stackoverflow.com/a/26603875

      code += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) + ' */';
    }

    if (!style.element) {
      style.element = document.createElement('style');
      style.element.type = 'text/css';
      if (css.media) { style.element.setAttribute('media', css.media); }
      HEAD.appendChild(style.element);
    }

    if ('styleSheet' in style.element) {
      style.styles.push(code);
      style.element.styleSheet.cssText = style.styles.filter(Boolean).join('\n');
    } else {
      var index = style.ids.size - 1;
      var textNode = document.createTextNode(code);
      var nodes = style.element.childNodes;
      if (nodes[index]) { style.element.removeChild(nodes[index]); }
      if (nodes.length) { style.element.insertBefore(textNode, nodes[index]); }else { style.element.appendChild(textNode); }
    }
  }
}

var browser = createInjector;

/* script */
var __vue_script__ = script;

/* template */
var __vue_render__ = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", {
    staticClass: "g-recaptcha",
    class: _vm.styleClassObject,
    attrs: { id: _vm.elementId, "data-sitekey": _vm.sitekey }
  })
};
var __vue_staticRenderFns__ = [];
__vue_render__._withStripped = true;

  /* style */
  var __vue_inject_styles__ = function (inject) {
    if (!inject) { return }
    inject("data-v-517be0b4_0", { source: ".grecaptcha-badge {\n  z-index: 1000;\n}\n.g-recaptcha--left .grecaptcha-badge {\n  width: 70px !important;\n  overflow: hidden;\n  transition: all 0.2s ease !important;\n  left: 0px;\n}\n.g-recaptcha--left .grecaptcha-badge:hover {\n  width: 256px !important;\n}\n@media (max-width: 992px) {\n.g-recaptcha--mobile-hidden .grecaptcha-badge {\n    display: none;\n}\n}\n@media (min-width: 992px) {\n.g-recaptcha--desktop-hidden .grecaptcha-badge {\n    display: none;\n}\n}\n\n/*# sourceMappingURL=vue-programmatic-invisible-google-recaptcha.vue.map */", map: {"version":3,"sources":["/Users/promosis/Documents/Code/vue-programmatic-invisible-google-recaptcha/src/vue-programmatic-invisible-google-recaptcha.vue","vue-programmatic-invisible-google-recaptcha.vue"],"names":[],"mappings":"AA6GA;EACA,aAAA;AAAA;AAIA;EAEA,sBAAA;EACA,gBAAA;EACA,oCAAA;EACA,SAAA;AAAA;AALA;EASA,uBAAA;AAAA;AAOA;AAFA;IAGA,aAAA;AAAA;AAEA;AAMA;AAFA;IAGA,aAAA;AAAA;AAEA;;AC1HA,0EAA0E","file":"vue-programmatic-invisible-google-recaptcha.vue","sourcesContent":["<template>\n    <div\n        :id=\"elementId\"\n        class=\"g-recaptcha\"\n        :class=\"styleClassObject\"\n        :data-sitekey=\"sitekey\"\n    ></div>\n</template>\n\n<script>\nexport default {\n    name: 'vue-programmatic-invisible-google-recaptcha',\n    props: {\n        sitekey: {\n            type: String,\n            required: true\n        },\n        elementId: {\n            type: String,\n            required: true\n        },\n        showBadgeMobile: {\n            type: Boolean,\n            default: true\n        },\n        showBadgeDesktop: {\n            type: Boolean,\n            default: true\n        },\n        badgePosition: {\n            type: String\n        }\n    },\n    data () {\n        return {\n            gAssignedId: null,\n            captchaReady: false,\n            checkInterval: null,\n            checkIntervalRunCount: 0\n        }\n    },\n    computed: {\n        styleClassObject: function () {\n            return {\n                'g-recaptcha--left': (this.badgePosition === 'left'),\n                'g-recaptcha--mobile-hidden': (!this.showBadgeMobile),\n                'g-recaptcha--desktop-hidden': (!this.showBadgeDesktop)\n            }\n        }\n    },\n    methods: {\n        execute () {\n            window.grecaptcha.execute(this.gAssignedId)\n        },\n        reset () {\n            window.grecaptcha.reset(this.gAssignedId)\n        },\n        callback (recaptchaToken) {\n            // Emit an event called recaptchaCallback with the recaptchaToken as payload\n            this.$emit('recaptcha-callback', recaptchaToken)\n\n            // Reset the recaptcha widget so you can execute it again\n            this.reset()\n        },\n        render () {\n            this.gAssignedId = window.grecaptcha.render(this.elementId, {\n                sitekey: this.sitekey,\n                size: 'invisible',\n                // the callback executed when the user solve the recaptcha\n                'callback': (recaptchaToken) => {\n                    this.callback(recaptchaToken)\n                },\n                'expired-callback': () => {\n                    this.reset()\n                }\n            })\n        },\n        init() {\n            // render the recaptcha widget when the component is mounted\n            // we'll watch the captchaReady value in order to\n            this.checkInterval = setInterval(() => {\n                this.checkIntervalRunCount++\n                if (window.grecaptcha && window.grecaptcha.hasOwnProperty('render')){\n                    this.captchaReady = true\n                }\n            }, 1000)\n        }\n    },\n    watch: {\n        captchaReady: function(data) {\n            if (data) {\n                clearInterval(this.checkInterval)\n                this.render()\n            }\n        }\n    },\n    mounted () {\n        // Initialize the recaptcha\n        this.init()\n    }\n}\n</script>\n\n<style lang=\"scss\">\n    // Can't set the scoped tag here because there are elements\n    // that are loaded from Google. :(\n\n    // Need to set some basic styles on the\n    // .grecaptcha-badge class\n    .grecaptcha-badge {\n        z-index: 1000;\n    }\n\n    // For left styled .grecaptcha-badge\n    .g-recaptcha--left {\n        .grecaptcha-badge {\n            width: 70px !important;\n            overflow: hidden;\n            transition: all 0.2s ease !important;\n            left: 0px;\n        }\n\n        .grecaptcha-badge:hover {\n            width: 256px !important;\n        }\n    }\n\n    // For hidden mobile option\n    .g-recaptcha--mobile-hidden {\n        .grecaptcha-badge {\n            @media (max-width: 992px) {\n                display: none;\n            }\n        }\n    }\n\n    // For hidden desktop option\n    .g-recaptcha--desktop-hidden {\n        .grecaptcha-badge {\n            @media (min-width: 992px) {\n                display: none;\n            }\n        }\n    }\n</style>",".grecaptcha-badge {\n  z-index: 1000; }\n\n.g-recaptcha--left .grecaptcha-badge {\n  width: 70px !important;\n  overflow: hidden;\n  transition: all 0.2s ease !important;\n  left: 0px; }\n\n.g-recaptcha--left .grecaptcha-badge:hover {\n  width: 256px !important; }\n\n@media (max-width: 992px) {\n  .g-recaptcha--mobile-hidden .grecaptcha-badge {\n    display: none; } }\n\n@media (min-width: 992px) {\n  .g-recaptcha--desktop-hidden .grecaptcha-badge {\n    display: none; } }\n\n/*# sourceMappingURL=vue-programmatic-invisible-google-recaptcha.vue.map */"]}, media: undefined });

  };
  /* scoped */
  var __vue_scope_id__ = undefined;
  /* module identifier */
  var __vue_module_identifier__ = undefined;
  /* functional template */
  var __vue_is_functional_template__ = false;
  /* style inject SSR */
  

  
  var component = normalizeComponent_1(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    browser,
    undefined
  );

// Import vue component

// install function executed by Vue.use()
function install(Vue) {
	if (install.installed) { return; }
	install.installed = true;
	Vue.component('VueProgrammaticInvisibleGoogleRecaptcha', component);
}

// Create module definition for Vue.use()
var plugin = {
	install: install,
};

// To auto-install when vue is found
var GlobalVue = null;
if (typeof window !== 'undefined') {
	GlobalVue = window.Vue;
} else if (typeof global !== 'undefined') {
	GlobalVue = global.Vue;
}
if (GlobalVue) {
	GlobalVue.use(plugin);
}

// It's possible to expose named exports when writing components that can
// also be used as directives, etc. - eg. import { RollupDemoDirective } from 'rollup-demo';
// export const RollupDemoDirective = component;

export default component;
export { install };
