import { Assertions, Keyboard, Keys } from '@ephox/agar';
import { pRender, remove } from '../alien/Loader';
import { SugarElement } from '@ephox/sugar';
import { describe, it, afterEach, before, context, after } from '@ephox/bedrock-client';
import { cleanupGlobalHugeRTE } from '../alien/TestHelper';
import { HugeRTE } from '../alien/Types';

/* Based on code from TinyMCE, MODIFIED */
/* See LEGAL.txt for the original license information */
const loadScript = (url: string, success: () => void, failure: (err: Error) => void): void => {
  const script = document.createElement('script');
  script.src = url;

  const onLoad = () => {
    script.removeEventListener('load', onLoad);
    script.removeEventListener('error', onError);
    success();
  };

  const onError = () => {
    script.removeEventListener('error', onError);
    script.removeEventListener('load', onLoad);
    failure(new Error(`Failed to load script: ${url}`));
  };

  script.addEventListener('load', onLoad);
  script.addEventListener('error', onError);
  document.body.appendChild(script);
};

const getHugeRTE = (): HugeRTE | undefined => (globalThis as any).hugerte as HugeRTE | undefined;

const setHugeRTEBaseUrl = (hugerte: any, baseUrl: string): void => {
  const prefix = document.location.protocol + '//' + document.location.host;
  hugerte.baseURL = baseUrl.indexOf('://') === -1 ? prefix + baseUrl : baseUrl;
  hugerte.baseURI = new hugerte.util.URI(hugerte.baseURL);
};

const updateHugeRTEUrls = (packageName: string): void => {
  const hugerte = getHugeRTE();
  if (hugerte) {
    setHugeRTEBaseUrl(hugerte, `/project/node_modules/${packageName}`);
  }
};

const versionToPackageName = (version: string) => version === 'latest' ? 'hugerte' : `hugerte-${version}`;

const unload = (): void => {
  const hugerte = getHugeRTE();
  if (hugerte) {
    hugerte.remove();
  }
  cleanupGlobalHugeRTE();
};

const load = (version: string, success: () => void, failure: (err: Error) => void): void => {
  const packageName = versionToPackageName(version);

  unload();
  loadScript(`/project/node_modules/${packageName}/hugerte.min.js`, () => {
    updateHugeRTEUrls(versionToPackageName(version));
    success();
  }, failure);
};

const pLoadVersion = (version: string): Promise<void> =>
  new Promise((resolve, reject) => {
    load(version, resolve, reject);
  });
/* End of code based on Apache-licensed code. */

describe('Editor Component Initialization Tests', () => {
  // eslint-disable-next-line @typescript-eslint/require-await
  const pFakeType = async (str: string, vmContext: any) => {
    vmContext.editor.getBody().innerHTML = '<p>' + str + '</p>';
    Keyboard.keystroke(Keys.space(), {}, SugarElement.fromDom(vmContext.editor.getBody()) as SugarElement<Node>);
  };

  [ '1' ].forEach((version) => {
    context(`Version: ${version}`, () => {

      before(async () => {
        await pLoadVersion(version);
      });

      after(() => {
        cleanupGlobalHugeRTE();
      });

      afterEach(() => {
        remove();
      });

      it('should not be inline by default', async () => {
        const vmContext = await pRender({}, `
          <editor
            :init="init"
          ></editor>`);
        Assertions.assertEq('Editor should not be inline', false, vmContext.editor.inline);
      });

      it('should be inline with inline attribute in template', async () => {
        const vmContext = await pRender({}, `
          <editor
            :init="init"
            :inline="true"
          ></editor>`);
        Assertions.assertEq('Editor should be inline', true, vmContext.editor.inline);
      });

      it('should be inline with inline option in init', async () => {
        const vmContext = await pRender({ init: { inline: true }});
        Assertions.assertEq('Editor should be inline', true, vmContext.editor.inline);
      });

      it('should handle one-way binding with output-format="text"', async () => {
        const vmContext = await pRender({
          content: undefined,
        }, `
          <editor
            :init="init"
            @update:modelValue="content=$event"
            output-format="text"
          ></editor>
        `);
        await pFakeType('A', vmContext);
        Assertions.assertEq('Content emitted should be of format="text"', 'A', vmContext.vm.content);
      });

      it('should handle one-way binding with output-format="html"', async () => {
        const vmContext = await pRender({
          content: undefined,
        }, `
          <editor
            :init="init"
            @update:modelValue="content=$event"
            output-format="html"
          ></editor>
        `);
        await pFakeType('A', vmContext);
        Assertions.assertEq('Content emitted should be of format="html"', '<p>A</p>', vmContext.vm.content);
      });
    });
  });
});
