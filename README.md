# Quill Emoji Selector
Module extension for [Quill.js](https://github.com/quilljs/quill) that handles emojis in the toolbar.

## Installation

```sh
bower install quill-emoji
```

## Usage
### Webpack/ES6

```javascript
const toolbarOptions = {
                        container: [
                            ['bold', 'italic', 'underline', 'strike'],
                            ['emoji'],   
                        ],
                        handlers: {'emoji': function() {}}
                        }
const quill = new Quill(editor, {
    // ...
    modules: {
        // ...
        toolbar: toolbarOptions,
        toolbar_emoji: true,
    }
});
```

## Contributing

Please check out our [contributing guidelines](CONTRIBUTING.md).
