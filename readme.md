# lit-labs-ssr-bundle

This a bundle containing the contents of `@lit-labs/ssr`. This bundle is made to work in non-Node environments such as Web Workers, Service Workers, and Deno.

## Usage

Rendering Lit elements outside the browser needs a DOM shim. We'll use [dom-shim](https://github.com/matthewp/dom-shim) in these examples.

```js
import 'https://cdn.spooky.click/dom-shim/1.2.0/mod.js?global';
```

This bundle exports `LitElementRenderer` which can be used to render elements created with LitElement. This is relatively low-level code and gives you complete control over serialization.

A full example is below:

```js
import 'https://cdn.spooky.click/dom-shim/1.2.0/mod.js?global';
import { LitElementRenderer } from 'https://cdn.spooky.click/lit-labs-ssr-bundle/1.0.2/mod.js';
import { LitElement, html } from 'https://cdn.skypack.dev/lit@2.0.0-rc.2';

class MyElement extends LitElement {
  render() {
    return html`
      <div id="testing">Hello world</div>
    `;
  }
}
customElements.define('my-element', MyElement);

function * render(el) {
  const instance = new LitElementRenderer(el.localName);
  yield `<${el.localName}`;
  yield `>`;
  yield* instance.renderAttributes();
  const shadowContents = instance.renderShadow({});
  if (shadowContents !== undefined) {
    yield '<template shadowroot="open">';
    yield* shadowContents;
    yield '</template>';
  }
  yield el.innerHTML;
  yield `</${el.localName}>`;
}

const el = new MyElement();
for(let chunk of render(el)) {
  console.log(chunk);
}
```