<template>
  <editor inline :init="hugeRTEOptions" :tag-name="tagName" :initial-value="'My header is here dear friend'"></editor>
</template>

<script>
import Editor from "/@/main/ts/index";

export default {
  name: "App",
  data(){
    return {
      tagName: 'h1',
      hugeRTEOptions: {
        menubar: false,
        plugins: [
            'link',
            'lists',
            'autolink'
        ],
        toolbar: [
            'bold italic underline fontselect fontsizeselect link' +
            ' unlink forecolor backcolor selectTags'
        ],
        fontsize_formats: '10px 12px 14px 16px 18px 20px 22px 24px 26px 28px 30px 32px',
        setup: (editor) => {
            editor.ui.registry.addMenuButton('selectTags', {
                  text: this.tagName.toString().toLocaleUpperCase(),
                fetch: (callback) => {
                  let tags = ['h1', 'h2', 'h3'];
                  let items = [];

                  //Tag changing
                  tags.forEach((tag) => {
                      items.push({
                          type: 'menuitem',
                          text: tag.toString().toLocaleUpperCase(),
                        onAction: () => {
                          this.tagName = tag;

                          }
                      })
                  });
                callback(items);
                }
            });
        }
      }
    }
  },
  components: {
    editor: Editor
  }
};
</script>