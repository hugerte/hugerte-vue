import { Assertions } from '@ephox/agar';
import { afterEach, context, describe, it } from '@ephox/bedrock-client';
import { pRender as pRender3, remove, type Context } from '../alien/Loader';
import { pRender as pRender2, remove as remove2 } from '../alien/Vue2Loader';
import { cleanupGlobalHugeRTE } from '@hugerte/framework-integration-shared';

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

describe('LoadHugeRTETest', () => {

  const AssertHugeRTEVersion = (version: '1') => {
    Assertions.assertEq(`Loaded version of HugeRTE should be ${version}`, version, (globalThis as any).hugerte.majorVersion);
  };

  [ '2', '3' ].forEach((vueVersion) => {
    context(`Vue version: ${vueVersion}`, () => {

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
        cleanupGlobalHugeRTE();
      });

      it('Should be able to load local version of HugeRTE 1 using the hugerteScriptSrc prop', async () => {
        vmContext = await pRender(vueVersion)({}, `
          <editor
            :init="init"
            hugerte-script-src="/project/node_modules/hugerte/hugerte.min.js"
          ></editor>
        `);

        AssertHugeRTEVersion('1');
      });

      it('Should be able to load HugeRTE 1 from jsDelivr CDN', async () => {
        vmContext = await pRender(vueVersion)({}, `
          <editor
            :init="init"
            cdn-version="1"
          ></editor>
        `);

        AssertHugeRTEVersion('1');
        Assertions.assertEq(
          'HugeRTE 1 should have been loaded from jsDelivr CDN',
          // TODO: the hugerte.min.js part seems to get stripped
          `https://cdn.jsdelivr.net/npm/hugerte@1`,
          (globalThis as any).hugerte.baseURI.source
        );
      });

    });
  });
});
