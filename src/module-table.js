let Container = Quill.import('blots/container');
let Scroll = Quill.import('blots/scroll');
let Inline = Quill.import('blots/inline');
let Block = Quill.import('blots/block');
let Delta = Quill.import('delta');
let Parchment = Quill.import('parchment');
let BlockEmbed = Quill.import('blots/block/embed');
let TextBlot = Quill.import('blots/text');

// CONTAINER TAG

export class ContainBlot extends Container {
  static create(value) {
    let tagName = 'contain';
    let node = super.create(tagName);
    return node;
  }

  insertBefore(blot, ref) {
    if (blot.statics.blotName == this.statics.blotName) {
      super.insertBefore(blot.children.head, ref);
    } else {
      super.insertBefore(blot, ref);
    }
  }

  static formats(domNode) {
    return domNode.tagName;
  }

  formats() {
    // We don't inherit from FormatBlot
    return { [this.statics.blotName]: this.statics.formats(this.domNode) }
  }

  replace(target) {
    if (target.statics.blotName !== this.statics.blotName) {
      let item = Parchment.create(this.statics.defaultChild);
      target.moveChildren(item);
      this.appendChild(item);
    }
    if (target.parent == null) return;
    super.replace(target)
  }
}

ContainBlot.blotName = 'contain';
ContainBlot.tagName = 'contain';
ContainBlot.scope = Parchment.Scope.BLOCK_BLOT;
ContainBlot.defaultChild = 'block';
ContainBlot.allowedChildren = [Block, BlockEmbed, Container];
Quill.register(ContainBlot);

// CONTAINER TR

export class TableRow extends Container {
  static create(value) {
    let tagName = 'tr';
    let node = super.create(tagName);
    node.setAttribute('row_id', value);
    return node;
  }

  optimize() {
    super.optimize();
    let next = this.next;
    if (next != null && next.prev === this &&
        next.statics.blotName === this.statics.blotName &&
        next.domNode.tagName === this.domNode.tagName &&
        next.domNode.getAttribute('row_id') === this.domNode.getAttribute('row_id')) {
      next.moveChildren(this);
      next.remove();
    }
  }
}

TableRow.blotName = 'tr';
TableRow.tagName = 'tr';
TableRow.scope = Parchment.Scope.BLOCK_BLOT;
TableRow.defaultChild = 'td';
Quill.register(TableRow);

// CONTAINER TABLE
export class TableTrick {
  static random_id() {
    return Math.random().toString(36).slice(2)
  }
  static find_td(what) {
    let leaf = quill.getLeaf(quill.getSelection()['index']);
    let blot = leaf[0];
    for(;blot!=null && blot.statics.blotName!=what;) {
      blot=blot.parent;
    }
    return blot; // return TD or NULL
  }
  static append_col() {
    let td = TableTrick.find_td('td')
    if(td) {
      let table = td.parent.parent;
      let table_id = table.domNode.getAttribute('table_id')
      td.parent.parent.children.forEach(function(tr) {
        let row_id = tr.domNode.getAttribute('row_id')
        let cell_id = TableTrick.random_id();
        let td = Parchment.create('td', table_id+'|'+row_id+'|'+cell_id);
        tr.appendChild(td);
      });
    }
  }
  static append_row() {
    let td = TableTrick.find_td('td')
    if(td) {
      let col_count = td.parent.children.length;
      let table = td.parent.parent;
      let new_row = td.parent.clone()
      let table_id = table.domNode.getAttribute('table_id')
      let row_id = TableTrick.random_id();
      new_row.domNode.setAttribute('row_id', row_id)
      for (var i = col_count - 1; i >= 0; i--) {
        let cell_id = TableTrick.random_id();
        let td = Parchment.create('td', table_id+'|'+row_id+'|'+cell_id);
        new_row.appendChild(td);
      };
      table.appendChild(new_row);
    }
  }

}

class Table extends Container {
  static create(value) {
    // special adding commands - belongs somewhere else out of constructor
    if(value == 'append-row') {
      let blot = TableTrick.append_row();
      return blot;
    } else if(value == 'append-col') {
      let blot = TableTrick.append_col();
      return blot;
    } else if(value.includes('newtable_')) {
      let node = null;
      let sizes = value.split('_');
      let row_count = Number.parseInt(sizes[1])
      let col_count = Number.parseInt(sizes[2])
      let table_id = TableTrick.random_id();
      let table = Parchment.create('table', table_id);
      for (var ri = 0; ri < row_count; ri++) {
        let row_id = TableTrick.random_id();
        let tr = Parchment.create('tr', row_id);
        table.appendChild(tr);
        for (var ci = 0; ci < col_count; ci++) {
          let cell_id = TableTrick.random_id();
          value = table_id+'|'+row_id+'|'+cell_id;
          let td = Parchment.create('td', value);
          tr.appendChild(td);
          let p = Parchment.create('block');
          td.appendChild(p);
          let br = Parchment.create('break');
          p.appendChild(br);
          node = p;
        }
      }
      let leaf = quill.getLeaf(quill.getSelection()['index']);
      let blot = leaf[0];
      let top_branch = null;
      for(;blot!=null && !(blot instanceof Container || blot instanceof Scroll);) {
        top_branch = blot
        blot=blot.parent;
      }
      blot.insertBefore(table, top_branch);
      return node;
    } else {
      // normal table
      let tagName = 'table';
      let node = super.create(tagName);
      node.setAttribute('table_id', value);
      return node;
    }
  }

  optimize() {
    super.optimize();
    let next = this.next;
    if (next != null && next.prev === this &&
        next.statics.blotName === this.statics.blotName &&
        next.domNode.tagName === this.domNode.tagName &&
        next.domNode.getAttribute('table_id') === this.domNode.getAttribute('table_id')) {
      next.moveChildren(this);
      next.remove();
    }
  }

}

Table.blotName = 'table';
Table.tagName = 'table';
Table.scope = Parchment.Scope.BLOCK_BLOT;
Table.defaultChild = 'tr';
Table.allowedChildren = [TableRow];
Quill.register(Table);

// CONTAINER TD

class TableCell extends ContainBlot {
  static create(value) {
    let tagName = 'td';
    let node = super.create(tagName);
    let ids = value.split('|')
    node.setAttribute('table_id', ids[0]);
    node.setAttribute('row_id', ids[1]);
    node.setAttribute('cell_id', ids[2]);
    return node;
  }

  format() {
    this.getAttribute('id');
  }

  formats() {
    // We don't inherit from FormatBlot
    return { [this.statics.blotName]:
      this.domNode.getAttribute('table_id') + '|' +
      this.domNode.getAttribute('row_id') + '|' +
      this.domNode.getAttribute('cell_id') }
  }

  optimize() {
    super.optimize();

    // Add parent TR and TABLE when missing
    let parent = this.parent;
    if (parent != null && parent.statics.blotName != 'tr') {
      // we will mark td position, put in table and replace mark
      let mark = Parchment.create('block');
      this.parent.insertBefore(mark, this.next);
      let table = Parchment.create('table', this.domNode.getAttribute('table_id'));
      let tr = Parchment.create('tr', this.domNode.getAttribute('row_id'));
      table.appendChild(tr);
      tr.appendChild(this);
      table.replace(mark)
    }

    // merge same TD id
    let next = this.next;
    if (next != null && next.prev === this &&
        next.statics.blotName === this.statics.blotName &&
        next.domNode.tagName === this.domNode.tagName &&
        next.domNode.getAttribute('cell_id') === this.domNode.getAttribute('cell_id')) {
      next.moveChildren(this);
      next.remove();
    }
  }
}

TableCell.blotName = 'td';
TableCell.tagName = 'td';
TableCell.scope = Parchment.Scope.BLOCK_BLOT;
TableCell.defaultChild = 'block';
TableCell.allowedChildren = [Block, BlockEmbed, Container];
Quill.register(TableCell);
TableRow.allowedChildren = [TableCell];

Container.order = [
  'list', 'contain',   // Must be lower
  'td', 'tr', 'table' // Must be higher
];

Quill.debug('debug');
