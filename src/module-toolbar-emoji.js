import {emojiOne as emojiList} from '../src/emojione.js';
import Fuse from '../node_modules/fuse.js';

class ToolbarEmoji {
    constructor(quill){
        this.quill = quill;
        this.toolbar = quill.getModule('toolbar');
        if (typeof this.toolbar != 'undefined')
            this.toolbar.addHandler('emoji', this.checkPalatteExist);
    }

    checkPalatteExist() {
        let quill = this.quill;
        fn_checkDialogOpen(quill);
        this.quill.on('text-change', function(delta, oldDelta, source) {
            if (source == 'user') {
                fn_close();
                fn_updateRange(quill);
            }
        });
    }  
}

function fn_close(){
    let ele_emoji_plate = document.getElementById('emoji-palette');
    if (ele_emoji_plate) {ele_emoji_plate.remove()};
}

function fn_checkDialogOpen(quill){
    let elementExists = document.getElementById("emoji-palette");
    if (elementExists) {
        elementExists.remove();
    }
    else{
        fn_showEmojiPalatte(quill);
    }
}

function fn_updateRange(quill){
    let range = quill.getSelection();
    return range;
}

function fn_showEmojiPalatte(quill) {
    let ele_emoji_area = document.createElement('div');
    let toolbar_container = document.querySelector('.ql-toolbar');
    let range = quill.getSelection();
    const atSignBounds = quill.getBounds(range.index);

    quill.container.appendChild(ele_emoji_area);

    ele_emoji_area.id = 'emoji-palette';
    ele_emoji_area.style.top = atSignBounds.top + atSignBounds.height + "px",
    ele_emoji_area.style.left = atSignBounds.left + "px";

    let tabToolbar = document.createElement('div');
    tabToolbar.id="tab-toolbar";
    ele_emoji_area.appendChild(tabToolbar);

    //panel
    let panel = document.createElement('div');
    panel.id="tab-panel";
    ele_emoji_area.appendChild(panel);

    var emojiType = [
                        {'type':'people','icon_code_decimal':'&#128523;'},
                        {'type':'nature','icon_code_decimal':'&#128051;'},
                        {'type':'food','icon_code_decimal':'&#127826;'},
                        {'type':'symbols','icon_code_decimal':'&#10084;'},
                        {'type':'activity','icon_code_decimal':'&#127943;'},
                        {'type':'objects','icon_code_decimal':'&#127881;'},
                        {'type':'flags','icon_code_decimal':'&#127480;&#127468;'}
                    ];

    let tabElementHolder = document.createElement('ul');
    tabToolbar.appendChild(tabElementHolder);

    emojiType.map(function(emojiType) {
        //add tab bar
        let tabElement = document.createElement('li');
        tabElement.classList.add('tab');
        tabElement.classList.add('filter-'+emojiType.type);
        let tabValue = emojiType.icon_code_decimal;
        tabElement.innerHTML = tabValue;
        tabElement.dataset.filter = emojiType.type;
        tabElementHolder.appendChild(tabElement);
        
        let emojiFilter = document.querySelector('.filter-'+emojiType.type);
        emojiFilter.addEventListener('click',function(){ 
            let tab = document.querySelector('.active');
            if (tab) {
                tab.classList.remove('active');
            };
            emojiFilter.classList.toggle('active');
            fn_updateEmojiContainer(emojiFilter,panel,quill);
        })
    });
    fn_emojiPanelInit(panel,quill);
}

function fn_emojiPanelInit(panel,quill){
    fn_emojiElementsToPanel('people',panel,quill);
    document.querySelector('.filter-people').classList.add('active');
}

function fn_emojiElementsToPanel(type,panel,quill){
    let fuseOptions = {
                    shouldSort: true,
                    matchAllTokens: true,
                    threshold: 0.3,
                    location: 0,
                    distance: 100,
                    maxPatternLength: 32,
                    minMatchCharLength: 3,
                    keys: [
                        "category"
                    ]
                };
    let fuse = new Fuse(emojiList, fuseOptions);
    let result = fuse.search(type);
    result.sort(function (a, b) {
      return a.emoji_order - b.emoji_order;
    });
    
    quill.focus();
    let range = fn_updateRange(quill);

    result.map(function(emoji) {
        let span = document.createElement('span');
        let t = document.createTextNode(emoji.shortname);
        span.appendChild(t);
        span.classList.add('bem');
        span.classList.add('bem-' + emoji.name);
        let output = ''+emoji.code_decimal+'';
        span.innerHTML = output + ' ';
        panel.appendChild(span);
        
        let customButton = document.querySelector('.bem-' + emoji.name);
        if (customButton) {
            customButton.addEventListener('click', function() {
                quill.insertText(range.index, customButton.innerHTML);
                quill.setSelection(range.index + customButton.innerHTML.length, 0);
                range.index = range.index + customButton.innerHTML.length;
            });
        };
    });
}

function fn_updateEmojiContainer(emojiFilter,panel,quill){ 
    while (panel.firstChild) {
        panel.removeChild(panel.firstChild);
    }
    let type = emojiFilter.dataset.filter;
    fn_emojiElementsToPanel(type,panel,quill);
}

Quill.register('modules/toolbar_emoji', ToolbarEmoji);
export { ToolbarEmoji as toolbarEmoji};
