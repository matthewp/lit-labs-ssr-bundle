import 'https://cdn.spooky.click/dom-shim/1.0.0/mod.js?global';
import { LitElementRenderer } from '../lib/mod.js';
import { LitElement, html } from 'https://cdn.skypack.dev/lit@2.0.0-rc.2';
import { assertStringIncludes } from "https://deno.land/std@0.100.0/testing/asserts.ts";

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

function renderAll(el) {
  let out = '';
  for(let chunk of render(el)) {
    out += chunk;
  }
  return out;
}

Deno.test('Can render an element', () => {
  class MyElement extends LitElement {
    render() {
      return html`
        <div id="testing">Hello world</div>
      `;
    }
  }
  customElements.define('my-element', MyElement);

  const el = new MyElement();
  const out = renderAll(el);
  assertStringIncludes(out, '<div id="testing">Hello world</div>');
});