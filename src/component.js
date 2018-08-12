export class Component extends HTMLElement {
    constructor() {
        super();
        this.boundPropertiesToElements = {};
        this.eventListeners = [];
    }

    static convertCamelCaseToKebab(string) {
        return string.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    }

    attachTemplate(template, style) {
        style = style ? '<style>' + style + '</style>' : '';

        const shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.innerHTML = style + template;
    }

    _addEventListener(query, eventType, callback, isShadowRoot) {
        const root = isShadowRoot ? this.shadowRoot : this;

        const handler = event => {
            const target = event.target;
            const element = target.closest(query);

            if (!element) return;

            if (!root.contains(element)) return;

            callback = callback.bind(this);

            callback(event, element);
        };

        const eventListener = {
            type: eventType,
            handler: handler,
            isShadowRoot: isShadowRoot
        };

        this.eventListeners.push(eventListener);

        root.addEventListener(eventListener.type, eventListener.handler);
    }

    _removeEventListeners(isShadowRoot) {
        const root = isShadowRoot ? this.shadowRoot : this;

        this.eventListeners
            .filter(eventListener => eventListener.isShadowRoot === isShadowRoot)
            .map(eventListener => root.removeEventListener(eventListener.type, eventListener.handler));
    }

    addLightEventListener(query, eventType, callback) {
        this._addEventListener(query, eventType, callback, false);
    }

    removeLightEventListeners() {
        this._removeEventListeners(false);
    }

    addShadowEventListener(query, eventType, callback) {
        this._addEventListener(query, eventType, callback, true);
    }

    removeShadowEventListeners() {
        this._removeEventListeners(true);
    }

    bindPropertiesToElements(names) {
        names.map(name => {
            const selector = '[data-bind-' + Component.convertCamelCaseToKebab(name) + ']';

            Object.defineProperty(this, name, {
                get: () => this.boundPropertiesToElements[name],
                set: (value)  => {
                    this.boundPropertiesToElements[name] = value;
                    const elements = Array.from(this.shadowRoot.querySelectorAll(selector));
                    elements.map(element => element.innerText = value);
                }
            });
        });
    }

    bindPropertiesToAttributes(names) {
        names.map(name => {
            const attributeName = Component.convertCamelCaseToKebab(name);

            Object.defineProperty(this, name, {
                get: () => {
                    let value = this.getAttribute(attributeName);
                    return value === String(Number(value)) ? +value : value;
                },
                set: (value) => value ? this.setAttribute(attributeName, value) : this.removeAttribute(attributeName)
            });
        });
    }
}