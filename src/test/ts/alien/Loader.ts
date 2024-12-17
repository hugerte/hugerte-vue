import Editor from 'src/main/ts/index';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { createApp } from 'vue/dist/vue.esm-bundler.js'; // Use runtime compiler

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
const pRender = (data: Record<string, any> = {}, template: string = `<editor :init="init"></editor>`): Promise<Record<string, any>> => new Promise((resolve) => {
  const root = getRoot();
  const mountPoint = document.createElement('div');
  root.appendChild(mountPoint);

  const originalInit = data.init || {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const originalSetup = originalInit.setup || (() => {});

  const vm = createApp({
    template,
    components: {
      Editor
    },
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
  }).mount(mountPoint);
});

const remove = () => {
  getRoot().remove();
};

export { pRender, remove, getRoot };
