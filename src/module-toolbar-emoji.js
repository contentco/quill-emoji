import {emojiOne as emojiList} from '../src/emojione.js';
class ToolbarEmoji {
    constructor(quill,options){
        toolbar = quill.getModule('toolbar');
        toolbar.addHandler('emoji', this.checkPalatteExist);
    }

    checkPalatteExist() {
        let elementExists = document.getElementById("emoji-palette");
        if (elementExists) {
            return elementExists.remove();
        }
        let range = quill.getSelection();
        showEmojiPalatte(range);
    }


}
function showEmojiPalatte() {
        let toolbar_emoji_element = document.querySelector('.ql-emoji');
        let emoji_palatte_container = document.createElement('div');
        let toolbar_container = document.querySelector('.ql-toolbar');
        let offsetHeight = toolbar_container.offsetHeight;
        toolbar_emoji_element.appendChild(emoji_palatte_container);
        emoji_palatte_container.id = 'emoji-palette';
        emoji_palatte_container.style.position = 'absolute';
        emoji_palatte_container.style.top = 30 + "px";

        let emojiCollection = emojiList;
        if (emojiCollection.length > 50) { //return only 50
          emojiCollection = emojiCollection.slice(0, 64);
        };

        showEmojiList(emojiCollection,emoji_palatte_container);
}
function showEmojiList(emojiCollection,emoji_palatte_container) {
        emojiCollection.map(function(emoji) {
            let span = document.createElement('span');
            let t = document.createTextNode(emoji.shortname);
            span.appendChild(t);
            span.classList.add('bem');
            span.classList.add('bem-' + emoji.name);
            let output = ' '+emoji.code_decimal+' ';
            span.innerHTML = output + ' ';
            emoji_palatte_container.appendChild(span);

            var customButton = document.querySelector('.bem-' + emoji.name);
            if (customButton) {
                customButton.addEventListener('click', function() {
                    let range = updateRange();
                    quill.insertText(range.index, customButton.innerHTML);
                    quill.setSelection(range.index + 4, 0);
                    range.index = range.index + 4;
                    //new Custom.checkPalatteExist();
                });
            };
        });
    }

function updateRange(){
  let range = quill.getSelection();
  return range;
}

Quill.register('modules/toolbar_emoji', ToolbarEmoji);
