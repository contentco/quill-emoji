import Fuse from '../node_modules/fuse.js';
import {emojiOne as emojiList} from '../src/emojione.js';
const e = (tag, attrs, ...children) => {
    const elem = document.createElement(tag);
    Object.keys(attrs).forEach(key => elem[key] = attrs[key]);
    children.forEach(child => {
        if (typeof child === "string")
            child = document.createTextNode(child);
        elem.appendChild(child);
    });
    return elem;
};
const Inline = Quill.import('blots/inline');
class EmojiBlot extends Inline {
    static create(unicode) {
        const node = super.create();
        node.dataset.unicode = unicode;
        return node;
    }
    static formats(node) {
        return node.dataset.unicode;
    }
    format(name, value) {
        if (name === "emoji" && value) {
            this.domNode.dataset.unicode = value;
        } else {
            super.format(name, value);
        }
    }

    formats() {
        const formats = super.formats();
        formats['emoji'] = EmojiBlot.formats(this.domNode);
        return formats;
    }
} 

EmojiBlot.blotName = "emoji";
EmojiBlot.tagName = "SPAN";
EmojiBlot.className = "emoji";

Quill.register({
    'formats/emoji': EmojiBlot
});

class ShortNameEmoji {
    constructor(quill, props) {
        this.fuseOptions = {
            shouldSort: true,
            threshold: 0.1,
            location: 0,
            distance: 100,
            maxPatternLength: 32,
            minMatchCharLength: 3,
            keys: [
                "shortname"
            ]
        };
        this.emojiList  = emojiList;
        this.fuse       = new Fuse(this.emojiList, this.fuseOptions);
        
        this.quill      = quill;
        this.onClose    = props.onClose;
        this.onOpen     = props.onOpen;
        this.container  = document.createElement('ul');
        this.container.classList.add('emoji_completions');
        this.quill.container.appendChild(this.container);
        this.container.style.position   = "absolute";
        this.container.style.display    = "none";

        this.onSelectionChange  = this.maybeUnfocus.bind(this);
        this.onTextChange       = this.update.bind(this);

        this.open           = false;
        this.atIndex        = null;
        this.focusedButton  = null;

        quill.keyboard.addBinding({
            // TODO: Once Quill supports using event.key (#1091) use that instead of shift-2
            key: 186,  // 2
            shiftKey: true,
        }, this.onAtKey.bind(this));

        quill.keyboard.addBinding({
            key: 39,  // ArrowRight
            collapsed: true,
            format: ["emoji"]
        }, this.handleArrow.bind(this));

        quill.keyboard.addBinding({
            key: 40,  // ArrowRight
            collapsed: true,
            format: ["emoji"]
        }, this.handleArrow.bind(this));
        // TODO: Add keybindings for Enter (13) and Tab (9) directly on the quill editor
    }

    onAtKey(range, context) {
        if (this.open) return true;
        if (range.length > 0) 
            this.quill.deleteText(range.index, range.length, Quill.sources.USER);
        
        this.quill.insertText(range.index, ":", "emoji", Quill.sources.USER);
        const atSignBounds = this.quill.getBounds(range.index);
        this.quill.setSelection(range.index + 1, Quill.sources.SILENT);
        
        this.atIndex = range.index;
        this.container.style.left = atSignBounds.left + "px";
        this.container.style.top = atSignBounds.top + atSignBounds.height + "px",
        this.open = true;

        this.quill.on('text-change', this.onTextChange);
        this.quill.once('selection-change', this.onSelectionChange);
        this.update();
        this.onOpen && this.onOpen();
    }

    handleArrow() {
        if (!this.open) return true;
        this.buttons[0].focus();
    }

    update() {
        const sel = this.quill.getSelection().index;
        //Using: fuse.js
        this.query = this.quill.getText(this.atIndex);
        this.query = this.query.trim();
 
        //this.query = ':smile:';
        let emojis = this.fuse.search(this.query);
        emojis.sort(function (a, b) {
          return a.emoji_order - b.emoji_order;
        });
        
        if (this.query.length < 3 || emojis.length == 0){
            this.container.style.display = "none";
            return;
        }
        if (emojis.length > 50) { //return only 50
            emojis = emojis.slice(0, 40);
        };
        this.renderCompletions(emojis);
    }

    maybeUnfocus() {
      if (this.container.querySelector("*:focus")) return;
      this.close(null);
    }

    renderCompletions(emojis) {
        while (this.container.firstChild) this.container.removeChild(this.container.firstChild);
        const buttons = Array(emojis.length);
        this.buttons = buttons;
        
        const handler = (i, emoji) => event => {
            if (event.key === "ArrowRight" || event.keyCode === 39) {
                event.preventDefault();
                buttons[Math.min(buttons.length - 1, i + 1)].focus();
            } else if (event.key === "ArrowLeft" || event.keyCode === 37) {
                event.preventDefault();
                buttons[Math.max(0, i - 1)].focus();
            } 
            else if (event.key === "ArrowDown" || event.keyCode === 40) {
                event.preventDefault();
                buttons[Math.min(buttons.length - 1, i + 1)].focus();
            }
            else if (event.key === "ArrowUp" || event.keyCode === 38) {
                event.preventDefault();
                buttons[Math.max(0, i - 1)].focus();
            } 
            else if (event.key === "Enter" || event.keyCode === 13
                       || event.key === " " || event.keyCode === 32
                       || event.key === "Tab" || event.keyCode === 9) {
                event.preventDefault();
                this.close(emoji);
            }    
        };

        emojis.forEach((emoji, i) => {
            const li =  e('li', {},
                        e('button', {type: "button"},
                        e("span", {className: "ico", innerHTML: emoji.code_decimal }),
                        e('span', {className: "matched"}, this.query),
                        e('span', {className: "unmatched"}, emoji.shortname.slice(this.query.length))
                        ));
            this.container.appendChild(li);
            buttons[i] = li.firstChild;
            // Events will be GC-ed with button on each re-render:
            buttons[i].addEventListener('keydown', handler(i, emoji));
            buttons[i].addEventListener("mousedown", () => this.close(emoji));
            buttons[i].addEventListener("focus", () => this.focusedButton = i);
            buttons[i].addEventListener("unfocus", () => this.focusedButton = null);
        });
        this.container.style.display = "block";
    }

    close(value) {
        this.container.style.display = "none";
        while (this.container.firstChild) this.container.removeChild(this.container.firstChild);
        this.quill.off('selection-change', this.onSelectionChange);
        this.quill.off('text-change', this.onTextChange);
        if (value) {
            const {name, unicode, shortname,code_decimal} = value;
            let emoji_icon_html = e("span", {className: "ico", innerHTML: ' '+code_decimal+' ' });
            let emoji_icon = emoji_icon_html.innerHTML;
            this.quill.deleteText(this.atIndex, this.query.length + 1, Quill.sources.USER);
            this.quill.insertText(this.atIndex, emoji_icon, "emoji", unicode, Quill.sources.USER);
            this.quill.insertText(this.atIndex + emoji_icon.length, " ", 'emoji', false, Quill.sources.USER);
            this.quill.setSelection(this.atIndex + emoji_icon.length, 0, Quill.sources.SILENT);
        }
        this.quill.focus();
        this.open = false;
        this.onClose && this.onClose(value);
    }
}
Quill.register('modules/short_name_emoji', ShortNameEmoji);
export { ShortNameEmoji as shortNameEmoji};
