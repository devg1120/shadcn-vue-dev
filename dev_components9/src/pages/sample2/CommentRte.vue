
<script setup lang="ts">
import { defineExpose, ref, computed, useTemplateRef, onMounted } from 'vue'

import { Quill, QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import '@vueup/vue-quill/dist/vue-quill.bubble.css';

//import  quillEmoji from "quill-emoji";
//import 'quill-emoji/dist/quill-emoji.css';

//Quill.register("modules/emoji", quillEmoji);


    const model = defineModel()

    const qeditor  = useTemplateRef('qeditor')


    //受け取るデータの型を定義
    interface Props {
      placeholder?: string|null;
    }
    //withDefaults: propsのデフォルト値を定義
    const props = withDefaults(defineProps<Props>(), {
      placeholder: null
    });

const showCommentEmojiPicker = ref(false)

let S = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
let N = 8;
let ID = Array.from(crypto.getRandomValues(new Uint8Array(N))).map((n)=>S[n%S.length]).join('');
console.log(ID);

let editor_id = "q-editor-" + ID;
let editor_sid = "#" + editor_id;
let toolbar_id = "my-toolbar-" + ID;
let toolbar_sid = "#" + toolbar_id;




//const qeditor  = ref();
let isFocus = ref(false);

const handleMouseEnter = () => {
  console.log('focus in', editor_id);
  isFocus.value = true;
  console.log(qeditor.value.getToolbar());
  let ele = qeditor.value.getToolbar();
  ele.style.display = "inline-block"
};
const handleMouseLeave = () => {
  console.log('focus out', editor_id);
  isFocus.value = false;
  let ele = qeditor.value.getToolbar();
  ele.style.display = "none"
};

//const classObject = computed(() => (  isFocus ? "toolbar-show" : "toolbar-hidden"));
const classObject = computed(() => {
   if (isFocus.value) {
      return "toolbar-show" ;
   } else {
      return "toolbar-hidden";
   }
});

let toolbar_option_all =  [
  ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
  ['blockquote', 'code-block'],
  ['link', 'image', 'video', 'formula'],

  [{ 'header': 1 }, { 'header': 2 }],               // custom button values
  [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'list': 'check' }],
  [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
  [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
  [{ 'direction': 'rtl' }],                         // text direction

  [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

  [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
  [{ 'font': [] }],
  [{ 'align': [] }],

  ['clean']
];

let toolbar_option =  [
  ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
  ['blockquote', 'code-block'],
 // ['link', 'image', 'video', 'formula'],
  ['link', 'image', 'video' ],

 // [{ 'header': 1 }, { 'header': 2 }],               // custom button values
  [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'list': 'check' }],
  [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
  [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
 // [{ 'direction': 'rtl' }],                         // text direction

  [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
 // [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

  [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
  [{ 'font': [] }],
  [{ 'align': [] }],

  ['clean']
];

let options = {
  //debug: 'info',
  debug: 'none',
  modules: {
    //toolbar: ['bold', 'italic', 'underline']
    toolbar: toolbar_option,
  },
  
  //placeholder: 'Compose an epic...',
  placeholder: props.placeholder,
  readOnly: false,
  theme: 'snow'
}
 
let options2 = {
          theme: 'snow',
          modules: {
            "emoji-toolbar": true,
            "emoji-shortname": true,
	    "emoji-textarea": true,

            toolbar: {
              container: [
	      ['emoji'],
  ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
  ['blockquote', 'code-block'],
 // ['link', 'image', 'video', 'formula'],
  ['link', 'image', 'video' ],

 // [{ 'header': 1 }, { 'header': 2 }],               // custom button values
  [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'list': 'check' }],
  [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
  [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
 // [{ 'direction': 'rtl' }],                         // text direction

  [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
 // [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

  [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
  [{ 'font': [] }],
  [{ 'align': [] }],

  ['clean']

              ],
  handlers: {'emoji': function() { console.log("emoji")}}

            },
	    }
    };




function call() {
  console.log("conponent call...OK");

}
function content_reset() {
  console.log("content_reset call...OK");
  //let qe = quilleditor.getEditor();
  qeditor.value.setHTML("");

}

const comment_insertEmoji = (event: CustomEvent) => {
  // Get the emoji from the event detail
  const emoji = event.detail.unicode
  console.log("Emoji", emoji);
  //console.log("comment_rte", comment_rte.value);
  //comment_rte.value.insert_emoji(emoji);
  insert_emoji(emoji);

  showCommentEmojiPicker.value = false
}

function insert_emoji(emoji) {
  console.log("insert emoji call...OK",emoji);
  //let qe = qeditor.value.getEditor();
  //qeditor.value.setHTML("");
  let quill = qeditor.value.getQuill()
  let selection = quill.getSelection( );
  //quill.insertText(range.anchorOffset,emoji);
  if (selection != null) {
      quill.insertText(selection.index,emoji);
  } else {
      quill.insertText(0,emoji);
  }

}
/*
    const call = () => {
      console.log("conponent call...OK");
    }
*/

defineExpose({
    call,
    content_reset,
    insert_emoji,
});

</script>

<template>
	<!--
  <QuillEditor theme="snow"   toolbar="full" />
        //v-model="props.model"
	content="ptops.model"
	v-model:content="model"

	-->

  <QuillEditor 
	ref="qeditor"
	:options="options"
	v-model:content="model"
	contentType="html"
	/>

              <emoji-picker v-if="showCommentEmojiPicker" class="comment-emoji-picker" @emoji-click="comment_insertEmoji"></emoji-picker>
              <button class="emoji-button" @click="showCommentEmojiPicker = !showCommentEmojiPicker">😊</button>



</template>
<style scoped>

.emoji-button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 20px;
  padding: 4px 8px;
  display: flex;
  align-items: center;
}
</style>

