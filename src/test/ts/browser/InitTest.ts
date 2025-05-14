import { Assertions, Keyboard, Keys } from '@ephox/agar';
import { pRender as pRender3, remove, type Context } from '../alien/Loader';
import { pRender as pRender2, remove as remove2 } from '../alien/Vue2Loader';
import { SugarElement } from '@ephox/sugar';
import { describe, it, afterEach, before, context, after } from '@ephox/bedrock-client';
import { cleanupGlobalHugeRTE, pLoadVersion } from '@hugerte/framework-integration-shared';

const pRender = (vueVersion: string) => {
  switch (vueVersion) {
    case '2':
      return pRender2;
    case '3':
      return pRender3;
    default:
      throw new Error('Unsupported Vue version: ' + vueVersion);
  }
};

let vmContext: Context;

describe('Editor Component Initialization Tests', () => {
  const pFakeType = async (str: string) => {
    vmContext.editor.getBody().innerHTML = '<p>' + str + '</p>';
    Keyboard.keystroke(Keys.space(), {}, SugarElement.fromDom(vmContext.editor.getBody()) as SugarElement<Node>);
  };

  [[ '1', '2' ], [ '1', '3' ]].forEach(([ editorVersion, vueVersion ]) => {
    context(`Editor Version: ${editorVersion}, Vue Version: ${vueVersion}`, () => {

      before(async () => {
        await pLoadVersion(editorVersion);
      });

      after(() => {
        cleanupGlobalHugeRTE();
      });

      afterEach(() => {
        switch (vueVersion) {
          case '2':
            remove2(vmContext);
            break;
          case '3':
            remove();
            break;
          default:
            throw new Error('Unsupported Vue version: ' + vueVersion);
        }
      });

      it('should not be inline by default', async () => {
        vmContext = await pRender(vueVersion)({}, `
          <editor
            :init="init"
          ></editor>`);
        Assertions.assertEq('Editor should not be inline', false, vmContext.editor.inline);
      });

      it('should be inline with inline attribute in template', async () => {
        vmContext = await pRender(vueVersion)({}, `
          <editor
            :init="init"
            :inline="true"
          ></editor>`);
        Assertions.assertEq('Editor should be inline', true, vmContext.editor.inline);
      });

      it('should be inline with inline option in init', async () => {
        vmContext = await pRender(vueVersion)({ init: { inline: true }});
        Assertions.assertEq('Editor should be inline', true, vmContext.editor.inline);
      });

      it('should handle one-way binding with output-format="text"', async () => {
        vmContext = await pRender(vueVersion)({
          content: undefined,
        }, `
          <editor
            :init="init"
            ${vueVersion === '2' ? 'v-on:input' : /* vue3*/ '@update:modelValue'}="content = $event"
            output-format="text"
          ></editor>
        `);
        await pFakeType('A');
        Assertions.assertEq('Content emitted should be of format="text"', 'A', vmContext.vm.content);
      });

      it('should handle one-way binding with output-format="html"', async () => {
        vmContext = await pRender(vueVersion)({
          content: undefined,
        }, `
          <editor
            :init="init"
            ${vueVersion === '2' ? 'v-on:input' : /* vue3*/ '@update:modelValue'}="content = $event"
            output-format="html"
          ></editor>
        `);
        await pFakeType('A');
        Assertions.assertEq('Content emitted should be of format="html"', '<p>A</p>', vmContext.vm.content);
      });
    });
  });
});
