/**
 * Custom module for quilljs to allow user to change url format and inline images format when copy and paste from their file system into the editor
 * @see https://quilljs.com/blog/building-a-custom-module/
 * extend from author https://github.com/schneidmaster
 */
export class LinkImport {

	constructor(quill, options = {}) {
		// save the quill reference
		this.quill = quill;
		// bind handlers to this instance
		this.handlePaste = this.handlePaste.bind(this);
		this.quill.root.addEventListener('paste', this.handlePaste, false);
	}

	handlePaste(evt) {
		if (evt.clipboardData && evt.clipboardData.items && evt.clipboardData.items.length) {
			this.quill.clipboard.addMatcher(Node.TEXT_NODE, function(node, delta) {
				var regex = /https?:\/\/[^\s]+/g;
				if(typeof(node.data) !== 'string') return;
				  	var matches = node.data.match(regex);
				  	if(matches && matches.length > 0) {
					    var ops = [];
					    var str = node.data;
					    matches.forEach(function(match) {
					      	var split = str.split(match);
					      	var beforeLink = split.shift();
					      	ops.push({ insert: beforeLink });
					      	ops.push({ insert: match, attributes: { link: match } });
					      	str = split.join(match);
					    });
					    ops.push({ insert: str });
					    delta.ops = ops;
				  	}
				  	return delta;
			});	
		}
	}
}
Quill.register('modules/linkImport', LinkImport);
