import Editor from 'src/main/ts/components/Vue2Editor';

// @ts-expect-error No types for the runtime compiler...or where are they?? TODO
import Vue from 'vue2/dist/vue.esm.js';

export interface Context {
  editor: any;
  vm: any;
}

const getRoot = () => document.querySelector('#root') ?? (() => {
  const root = document.createElement('div');
  root.id = 'root';
  document.body.appendChild(root);
  return root;
})();

// eslint-disable-next-line max-len
const pRender = (data: Record<string, any> = {}, template: string = `<editor :init="init"></editor>`): Promise<Context> => new Promise((resolve) => {
  const root = getRoot();
  const mountPoint = document.createElement('div');
  root.appendChild(mountPoint);

  const originalInit = data.init || {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const originalSetup = originalInit.setup || (() => {});

  const vm = new Vue({
    components: {
      editor: Editor
    },
    /* eslint-disable-next-line */
    template,
    data: () => ({
      ...data,
      outputFormat: 'text',
      init: {
        ...originalInit,
        setup: (editor: any) => {
          originalSetup(editor);
          editor.on('SkinLoaded', () => {
            setTimeout(() => {
              resolve({ editor, vm });
            }, 0);
          });
        }
      }
    }),
  });

  vm.$mount(mountPoint);
});

const remove = (context: Context) => {
  context.vm.$destroy();
  getRoot().remove();
};

export { pRender, remove, getRoot };
