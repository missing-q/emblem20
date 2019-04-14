/**
 * Extend the basic ActorSheet with some very simple modifications
 */
class SimpleActorSheet extends ActorSheet {

  /**
   * Extend and override the default options used by the 5e Actor Sheet
   */
	static get defaultOptions() {
	  const options = super.defaultOptions;
	  options.classes = options.classes.concat(["worldbuilding", "actor-sheet"]);
	  options.template = "public/systems/simple/templates/actor-sheet.html";
    options.width = 600;
    options.height = 600;
	  return options;
  }

  /* -------------------------------------------- */

  /**
   * Activate event listeners using the prepared sheet HTML
   * @param html {HTML}   The prepared HTML object ready to be rendered into the DOM
   */
	activateListeners(html) {
    super.activateListeners(html);

    // Activate tabs
    html.find('.tabs').each((_, el) => {
      let tabs = $(el),
        initial = this.actor.data.flags["_sheetTab-" + tabs.attr("data-tab-container")];
      new Tabs(tabs, initial, clicked => {
        this.actor.data.flags["_sheetTab-" + clicked.parent().attr("data-tab-container")] = clicked.attr("data-tab");
      });
    });

    // Everything below here is only needed if the sheet is editable
    if (!this.options.editable) return;

    // Activate MCE
	  let editor = html.find(".editor-content");
    createEditor({
      target: editor[0],
      height: this.position.height - 260,
      setup: ed => { this._mce = ed },
      save_onsavecallback: ed => {
        let target = editor.attr("data-edit");
        this.actor.update({[target]: ed.getContent()}, true);
      }
    }).then(ed => {
      this.mce = ed[0];
      this.mce.focus();
    });

    // Update Inventory Item
    html.find('.item-edit').click(ev => {
      let itemId = Number($(ev.currentTarget).parents(".item").attr("data-item-id"));
      console.log(itemId);
      let Item = CONFIG.Item.entityClass;
      const item = new Item(this.actor.items.find(i => i.id === itemId), this.actor);
      item.sheet.render(true);
    });

    // Delete Inventory Item
    html.find('.item-delete').click(ev => {
      let li = $(ev.currentTarget).parents(".item"),
        itemId = Number(li.attr("data-item-id"));
      this.actor.deleteOwnedItem(itemId, true);
      li.slideUp(200, () => this.render(false));
    });
  }
}

CONFIG.Actor.sheetClass = SimpleActorSheet;


/* -------------------------------------------- */


/**
 * Extend the basic ItemSheet with some very simple modifications
 */
class SimpleItemSheet extends ItemSheet {

  /**
   * Extend and override the default options used by the 5e Actor Sheet
   */
	static get defaultOptions() {
	  const options = super.defaultOptions;
	  options.classes = options.classes.concat(["worldbuilding", "item-sheet"]);
	  options.template = "public/systems/simple/templates/item-sheet.html";
	  options.height = 400;
	  return options;
  }

  /* -------------------------------------------- */

  /**
   * Activate event listeners using the prepared sheet HTML
   * @param html {HTML}   The prepared HTML object ready to be rendered into the DOM
   */
	activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.options.editable) return;

    // Activate MCE
	  let editor = html.find(".editor-content");
    createEditor({
      target: editor[0],
      height: this.position.height - 180,
      setup: ed => { this._mce = ed },
      save_onsavecallback: ed => {
        let target = editor.attr("data-edit");
        this.item.update({[target]: ed.getContent()}, true);
      }
    }).then(ed => {
      this.mce = ed[0];
      this.mce.focus();
    });
  }
}

CONFIG.Item.sheetClass = SimpleItemSheet;


/* -------------------------------------------- */
