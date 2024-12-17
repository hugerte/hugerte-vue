import { Assertions } from '@ephox/agar';
import { beforeEach, context, describe, it } from '@ephox/bedrock-client';
import { pRender, remove } from '../alien/Loader';
import { cleanupGlobalHugeRTE } from '../alien/TestHelper';

describe('LoadHugeRTETest', () => {

  const AssertHugeRTEVersion = (version: '1') => {
    Assertions.assertEq(`Loaded version of HugeRTE should be ${version}`, version, (globalThis as any).hugerte.majorVersion);
  };

  context('LoadHugeRTETest', () => {

    beforeEach(() => {
      remove();
      cleanupGlobalHugeRTE();
    });

    it('Should be able to load local version of HugeRTE 1 using the hugerteScriptSrc prop', async () => {
      await pRender({}, `
        <editor
          :init="init"
          hugerte-script-src="/project/node_modules/hugerte/hugerte.min.js"
        ></editor>
      `);

      AssertHugeRTEVersion('1');
    });

    it('Should be able to load HugeRTE 1 from jsDelivr CDN', async () => {
      await pRender({}, `
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
