# Quill Emoji Selector
Module extension for [Quill.js](https://github.com/quilljs/quill) that handles emojis in the toolbar. Through this extension, you can add emojis through the toolbar at the top, or by typing the emoji code.

![Screenshot](/demo/screenshot.png)

To add an emoji via emoji code, type ``:`` followed by the first few letters, and an autocomplete menu will appear. You can then select or ``tab`` to the preferred emoji.




#### This module is still in active development

## Installation

```sh
bower install quill-emoji
npm install quill-emoji
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
