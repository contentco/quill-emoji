import Quill from 'quill';
import emojiMap from "./emoji-map";

const Embed = Quill.import('blots/embed');

class EmojiBlot extends Embed {
  static create(value) {
    let node = super.create();
    if (typeof value === 'object') {
    
      EmojiBlot.buildSpan(value, node);
    } else if (typeof value === "string") {
      const valueObj = emojiMap[value];

      if (valueObj) {
        EmojiBlot.buildSpan(valueObj, node);
      }
    }

    return node;
  }

  static value(node) {
    return node.dataset.name;
  }

  static buildSpan(value, node) {
    node.setAttribute('data-name', value.name);
    let emojiSpan = document.createElement('span');
    emojiSpan.classList.add(this.emojiClass);
    emojiSpan.classList.add(this.emojiPrefix + value.name);
    emojiSpan.innerText = String.fromCodePoint('0x' + value.unicode);
    node.appendChild(emojiSpan);
  }
}

EmojiBlot.blotName = 'emoji';
EmojiBlot.className = 'ql-emojiblot';
EmojiBlot.tagName = 'span';
EmojiBlot.emojiClass = 'ap';
EmojiBlot.emojiPrefix = 'ap-';

export default EmojiBlot;