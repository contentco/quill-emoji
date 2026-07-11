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
    const name = node.dataset.name;
    const imageUrl = node.dataset.imageUrl;

    if (imageUrl) {
      return {
        name,
        imageUrl,
        isAnimated: node.dataset.isAnimated === "true",
      }
    }
    return name;
  }

  static buildSpan(value, node) {
    node.setAttribute('data-name', value.name);
    let emojiSpan = document.createElement('span');
    emojiSpan.classList.add(this.emojiClass);
    emojiSpan.classList.add(this.emojiPrefix + value.name);

    if (value.imageUrl) {
      node.setAttribute('data-image-url', value.imageUrl);
      if (value.isAnimated) node.setAttribute('data-is-animated', value.isAnimated);
      let image = document.createElement('img');
      image.src = value.imageUrl;
      image.alt = `:${value.name}:`; // :emoji-name: rather than emoji-name
      image.draggable = false;

      emojiSpan.classList.add(this.imageClass);
      if (value.isAnimated) emojiSpan.classList.add(this.animatedClass);
      emojiSpan.appendChild(image);
    } else {
      // unicode can be '1f1f5-1f1ea',see emoji-list.js.
      emojiSpan.innerText = String.fromCodePoint(...EmojiBlot.parseUnicode(value.unicode));
    }

    node.appendChild(emojiSpan);
  }

  static parseUnicode(string) {
    return string.split('-').map(str => parseInt(str, 16));
  }
}

EmojiBlot.blotName = 'emoji';
EmojiBlot.className = 'ql-emojiblot';
EmojiBlot.tagName = 'span';
EmojiBlot.emojiClass = 'ap';
EmojiBlot.emojiPrefix = 'ap-';
EmojiBlot.imageClass = 'qe-image';
EmojiBlot.animatedClass = 'qe-image-animated';

export default EmojiBlot;