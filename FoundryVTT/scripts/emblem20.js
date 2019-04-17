/**
 * Extend the basic ActorSheet with some very simple modifications
 */
class EmblemActorSheet extends ActorSheet {

  /**
   * Extend and override the default options used by the 5e Actor Sheet
   */
  static get defaultOptions() {
    const options = super.defaultOptions;
    options.classes = options.classes.concat(["worldbuilding", "actor-sheet"]);
    options.template = "public/systems/emblem20/templates/actor-sheet.html";
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
      setup: ed => {
        this._mce = ed
      },
      save_onsavecallback: ed => {
        let target = editor.attr("data-edit");
        this.actor.update({
          [target]: ed.getContent()
        }, true);
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

CONFIG.Actor.sheetClass = EmblemActorSheet;

/**
 * Extend the base Actor class to implement additional logic specialized for D&D5e.
 */
class ActorEmblem20 extends Actor {

  /**
   * Augment the basic actor data with additional dynamic data.
   */
  prepareData(actorData) {
    actorData = super.prepareData(actorData);
    const data = actorData.data;

    // Prepare Character data
    this._prepareCharacterData(data);

    /*
    // Ability modifiers and saves
    for (let abl of Object.values(data.abilities)) {
      abl.mod = Math.floor((abl.value - 10) / 2);
      abl.save = abl.mod + ((abl.proficient || 0) * data.attributes.prof.value);
    }

    // Skill modifiers
    for (let skl of Object.values(data.skills)) {
      skl.value = parseFloat(skl.value || 0);
      skl.mod = data.abilities[skl.ability].mod + Math.floor(skl.value * data.attributes.prof.value);
    }

    // Attributes
    data.attributes.init.mod = data.abilities.dex.mod + (data.attributes.init.value || 0);
    data.attributes.ac.min = 10 + data.abilities.dex.mod;

    // Spell DC
    let spellAbl = data.attributes.spellcasting.value || "int";
    data.attributes.spelldc.value = 8 + data.attributes.prof.value + data.abilities[spellAbl].mod;

    // Return the prepared Actor data
    return actorData;
		*/
  }

  /* -------------------------------------------- */

  /**
   * Prepare Character type specific data
   */
  _prepareCharacterData(data) {

    // Level, experience, and proficiency
    /*
    data.details.level.value = parseInt(data.details.level.value);
    data.details.xp.max = this.getLevelExp(data.details.level.value || 1);
    let prior = this.getLevelExp(data.details.level.value - 1 || 0),
          req = data.details.xp.max - prior;
    data.details.xp.pct = Math.min(Math.round((data.details.xp.value -prior) * 100 / req), 99.5);
    data.attributes.prof.value = Math.floor((data.details.level.value + 7) / 4);
		*/
  }


  /* -------------------------------------------- */


  /**
   * Override and extend the basic :class:`ItemSheet` implementation
   */
  class Item5eSheet extends ItemSheet {
    constructor(item, options) {
      super(item, options);
      this.mce = null;
    }

    /* -------------------------------------------- */

    /**
     * Use a type-specific template for each different item type
     */
    get template() {
      let type = this.item.type;
      return `public/systems/dnd5e/templates/items/item-${type}-sheet.html`;
    }

    /* -------------------------------------------- */

    /**
     * Prepare item sheet data
     * Start with the base item data and extending with additional properties for rendering.
     */
    getData() {
      const data = super.getData();
      data['abilities'] = game.system.template.actor.data.abilities;
      data['damageTypes'] = CONFIG.damageTypes;
      let types = (this.item.type === "equipment") ? "armorTypes" : this.item.type + "Types";
      data[types] = CONFIG[types];

      // Spell-specific data
      if (this.item.type === "spell") {
        data["spellSchools"] = CONFIG.spellSchools;
        data["spellLevels"] = CONFIG.spellLevels;
      }

      // Tool-specific data
      else if (this.item.type === "tool") {
        data["proficiencies"] = CONFIG.proficiencyLevels;
      }
      return data;
    }

    /* -------------------------------------------- */

    /**
     * Activate listeners for interactive item sheet events
     */
    activateListeners(html) {
      super.activateListeners(html);

      // Activate tabs
      new Tabs(html.find(".tabs"));
    }
  }

  // Activate global listeners
  Hooks.on('renderChatLog', (log, html, data) => Item5e.chatListeners(html));

  // Override CONFIG
  CONFIG.Item.sheetClass = Item5eSheet;

  // Standard D&D Damage Types
  CONFIG.damageTypes = {
    "acid": "Acid",
    "bludgeoning": "Bludgeoning",
    "cold": "Cold",
    "fire": "Fire",
    "force": "Force",
    "lightning": "Lightning",
    "necrotic": "Necrotic",
    "piercing": "Piercing",
    "poison": "Poison",
    "psychic": "Psychic",
    "radiant": "Radiant",
    "slashing": "Slashing",
    "thunder": "Thunder",
    "healing": "Healing"
  };

  // Weapon Types
  CONFIG.weaponTypes = {
    "simpleM": "Simple Melee",
    "simpleR": "Simple Ranged",
    "martialM": "Martial Melee",
    "martialR": "Martial Ranged",
    "natural": "Natural",
    "improv": "Improvised",
    "ammo": "Ammunition"
  };

  // Weapon Properties
  CONFIG.weaponProperties = {
    "thr": "Thrown",
    "amm": "Ammunition",
    "fir": "Firearm",
    "rel": "Reload",
    "two": "Two-Handed",
    "fin": "Finesse",
    "lgt": "Light",
    "ver": "Versatile",
    "hvy": "Heavy",
    "rch": "Reach"
  };

  // Equipment Types
  CONFIG.armorTypes = {
    "clothing": "Clothing",
    "light": "Light Armor",
    "medium": "Medium Armor",
    "heavy": "Heavy Armor",
    "bonus": "Magical Bonus",
    "natural": "Natural Armor",
    "shield": "Shield"
  };

  // Consumable Types
  CONFIG.consumableTypes = {
    "potion": "Potion",
    "scroll": "Scroll",
    "wand": "Wand",
    "rod": "Rod",
    "trinket": "Trinket"
  };

  // Spell Types
  CONFIG.spellTypes = {
    "attack": "Spell Attack",
    "save": "Saving Throw",
    "heal": "Healing",
    "utility": "Utility"
  };

  // Spell Schools
  CONFIG.spellSchools = {
    "abj": "Abjuration",
    "con": "Conjuration",
    "div": "Divination",
    "enc": "Enchantment",
    "evo": "Evocation",
    "ill": "Illusion",
    "nec": "Necromancy",
    "trs": "Transmutation",
  };

  // Spell Levels
  CONFIG.spellLevels = {
    0: "Cantrip",
    1: "1st Level",
    2: "2nd Level",
    3: "3rd Level",
    4: "4th Level",
    5: "5th Level",
    6: "6th Level",
    7: "7th Level",
    8: "8th Level",
    9: "9th Level"
  };

  // Feat Types
  CONFIG.featTypes = {
    "passive": "Passive Ability",
    "attack": "Ability Attack",
    "ability": "Generic Action"
  };
}


CONFIG.Item.sheetClass = SimpleItemSheet;


/* -------------------------------------------- */
