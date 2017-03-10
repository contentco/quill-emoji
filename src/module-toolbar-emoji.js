Quill.register('modules/toolbar_emoji', function(quill, options) {
    const toolbar = quill.getModule('toolbar');
    const isToolbar = toolbar !== undefined;
    if (isToolbar) {
        toolbar.addHandler('emoji', checkPalatteExist);
    };

    function checkPalatteExist() {
        let elementExists = document.getElementById("emoji-palette");
        if (elementExists) {
            return elementExists.remove();
        }
        let range = quill.getSelection();
        showEmojiPalatte(range);
    }

    function showEmojiPalatte() {
        toolbar_emoji_element = document.querySelector('.ql-emoji');
        emoji_palatte_container = document.createElement('div');
        toolbar_container = document.querySelector('.ql-toolbar');
        offsetHeight = toolbar_container.offsetHeight;
        toolbar_emoji_element.appendChild(emoji_palatte_container);
        emoji_palatte_container.id = 'emoji-palette';
        emoji_palatte_container.style.position = 'absolute';
        emoji_palatte_container.style.top = 30 + "px";

        emojiCollection = emojiOne;
        if (emojiCollection.length > 50) { //return only 50
          emojiCollection = emojiCollection.slice(0, 64);
        };

        showEmojiList(emojiCollection);
    }

    function showEmojiList(emojiCollection) {
        emojiCollection.map(function(emoji) {
            let span = document.createElement('span');
            let t = document.createTextNode(emoji.shortname);
            span.appendChild(t);
            span.classList.add('bem');
            span.classList.add('bem-' + emoji.name);
            let output = '&#x'+emoji.unicode+';';
            span.innerHTML = output + ' ';
            emoji_palatte_container.appendChild(span);

            var customButton = document.querySelector('.bem-' + emoji.name);
            if (customButton) {
                customButton.addEventListener('click', function() {
                        updateRange();
                        quill.insertText(range.index, customButton.innerHTML);
                        quill.setSelection(range.index + 4, 0);
                        range.index = range.index + 4;
                        checkPalatteExist();
                });
            };
        });
    }

    function updateRange(){
      range = quill.getSelection();
      return range;
    }
});