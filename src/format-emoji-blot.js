import Quill from 'quill';

const Embed = Quill.import('blots/embed');

class EmojiBlot extends Embed {
  static create(value) {
    let node = super.create();
    if (typeof value === 'object') {
      node.setAttribute('data-name', value.name);
      let emojiSpan = document.createElement('span');
      emojiSpan.classList.add(this.emojiClass);
      emojiSpan.classList.add(this.emojiPrefix + value.name);
      emojiSpan.innerText = String.fromCodePoint('0x' + value.unicode);
      node.appendChild(emojiSpan);
    }
    return node;
  }

  static value(node) {
    return node.contentText;
  }
}

EmojiBlot.blotName = 'emoji';
EmojiBlot.className = 'ql-emojiblot';
EmojiBlot.tagName = 'span';
EmojiBlot.emojiClass = 'ap';
EmojiBlot.emojiPrefix = 'ap-';

export default EmojiBlot;