"use strict";

/*
  小さなクリスタルRPG
  ------------------------------------------------------------
  まず動く完成版にするため、画像素材なしで「文字と色のタイル」で作っています。
  後から拡張しやすいように、マップ、敵、商品、装備はデータとしてまとめています。
*/

const SAVE_KEY = "small_crystal_rpg_save_v1";
const MAP_W = 16;
const MAP_H = 11;

const TILE = {
  ".": { name: "草原", className: "grass", mark: "" },
  "#": { name: "木", className: "tree", mark: "♣", block: true },
  "~": { name: "水", className: "water", mark: "≈", block: true },
  "f": { name: "床", className: "floor", mark: "" },
  "w": { name: "壁", className: "wall", mark: "▓", block: true },
  "=": { name: "道", className: "road", mark: "" },
  ",": { name: "平原", className: "field", mark: "" },
  "^": { name: "山", className: "mountain", mark: "▲", block: true },
  "V": { name: "村", className: "gate", mark: "村" },
  "D": { name: "洞窟", className: "dungeon", mark: "洞" },
  "F": { name: "森", className: "forest", mark: "森" },
  "K": { name: "城", className: "castle", mark: "城" },
  "B": { name: "魔王", className: "boss", mark: "魔" },
  "S": { name: "武器屋", className: "shop", mark: "武" },
  "I": { name: "宿屋", className: "inn", mark: "宿" },
  "T": { name: "道具屋", className: "shop", mark: "道" },
  "N": { name: "村人", className: "npc", mark: "人" },
  "C": { name: "宝箱", className: "chest", mark: "箱" },
  "E": { name: "出口", className: "exit", mark: "出" }
};

const MAPS = {
  village: {
    name: "はじまりの村",
    bgmName: "静かな村",
    start: { x: 8, y: 8 },
    rows: [
      "################",
      "#....N.....S...#",
      "#..............#",
      "#....####......#",
      "#....#..#..I...#",
      "#....#..#......#",
      "#...........T..#",
      "#..............#",
      "#.......E......#",
      "#..............#",
      "################"
    ],
    exits: {
      "7,8": { to: "field", x: 2, y: 5 },
      "8,8": { to: "field", x: 2, y: 5 }
    },
    encounters: []
  },
  field: {
    name: "風のフィールド",
    bgmName: "冒険の野",
    rows: [
      "^^^^^^^^^^^^^^^^",
      "^,,,,,,,,,,,,,,^",
      "^,V,,,#,,,,,,,,^",
      "^,,,,###,,,D,,,^",
      "^,,,,,#,,,,,,F,^",
      "^,,,,,,,,,,,,,,^",
      "^,,,,,~~~~,,,,,^",
      "^,,,,,~~~~,,,,,^",
      "^,,,,,,,,,,,,,,^",
      "^,,,,,,,,,,,,,,^",
      "^^^^^^^^^^^^^^^^"
    ],
    exits: {
      "2,2": { to: "village", x: 8, y: 8 },
      "11,3": { to: "dungeon", x: 2, y: 8 },
      "13,4": { to: "forest", x: 1, y: 5, requiredFlag: "foundCrest", message: "森の入口は不思議な霧に包まれている。洞窟の紋章が必要だ。" }
    },
    encounters: ["slime", "wolf"]
  },
  dungeon: {
    name: "古い洞窟",
    bgmName: "洞窟の闇",
    rows: [
      "wwwwwwwwwwwwwwww",
      "wffffffffffffffw",
      "wffwwwwfffwwfffw",
      "wffwfffffffwffEw",
      "wffwfffffffwfffw",
      "wffwwwffwwwwfffw",
      "wffffffCfffffffw",
      "wffwwwwwwwwwwffw",
      "wEfffffffffffffw",
      "wffffffffffffffw",
      "wwwwwwwwwwwwwwww"
    ],
    exits: {
      "1,8": { to: "field", x: 10, y: 4 },
      "14,3": { to: "forest", x: 1, y: 5, requiredFlag: "foundCrest", message: "紋章がないと、この奥の扉は開かない。" }
    },
    encounters: ["bat", "skeleton"]
  },
  forest: {
    name: "迷いの森",
    bgmName: "深い森",
    rows: [
      "################",
      "#,,,,,#,,,,,,K,#",
      "#,#####,####,#,#",
      "#,,,,,,,,,,#,#,#",
      "###,######,#,#,#",
      "#E,,#,,,,,,,#,,#",
      "#,#,#,######,,##",
      "#,#,,,,,,#,,,,,#",
      "#,######,#,V,#,#",
      "#,,,,,,,,,,,,,,#",
      "################"
    ],
    exits: {
      "1,5": { to: "field", x: 13, y: 5 },
      "11,8": { to: "forestVillage", x: 8, y: 8 },
      "13,1": { to: "castle", x: 2, y: 8 }
    },
    encounters: ["wolf", "forestSpider", "mushroom"]
  },
  forestVillage: {
    name: "森の隠れ里",
    bgmName: "木漏れ日の里",
    rows: [
      "################",
      "#....N.....S...#",
      "#..............#",
      "#..####........#",
      "#..#..#....I...#",
      "#..#..#........#",
      "#..........T...#",
      "#..............#",
      "#.......E......#",
      "#..............#",
      "################"
    ],
    exits: {
      "7,8": { to: "forest", x: 12, y: 9 },
      "8,8": { to: "forest", x: 12, y: 9 }
    },
    encounters: []
  },
  castle: {
    name: "魔王の城",
    bgmName: "決戦の城",
    rows: [
      "wwwwwwwwwwwwwwww",
      "wffffffffffffffw",
      "wffwwwwwwwwwwffw",
      "wffwffffffffffBw",
      "wffwffwwwwwwfffw",
      "wffffffCfffffffw",
      "wffwwwwwwwwffwfw",
      "wffffffffffffwfw",
      "wEfffffffffffffw",
      "wffffffffffffffw",
      "wwwwwwwwwwwwwwww"
    ],
    exits: {
      "1,8": { to: "forest", x: 13, y: 2 }
    },
    encounters: ["skeleton", "darkMage", "armorKnight"]
  }
};

const ENEMIES = {
  slime: { name: "スライム", hp: 14, atk: 4, def: 1, exp: 6, gold: 5, sprite: "slime" },
  wolf: { name: "ウルフ", hp: 20, atk: 6, def: 2, exp: 10, gold: 9, sprite: "wolf" },
  bat: { name: "おおこうもり", hp: 24, atk: 8, def: 3, exp: 14, gold: 13, sprite: "bat" },
  skeleton: { name: "スケルトン", hp: 32, atk: 10, def: 4, exp: 22, gold: 22, sprite: "skeleton" },
  forestSpider: { name: "森グモ", hp: 34, atk: 10, def: 4, exp: 24, gold: 20, sprite: "bat" },
  mushroom: { name: "まどわしキノコ", hp: 38, atk: 11, def: 5, exp: 28, gold: 26, sprite: "slime" },
  darkMage: { name: "闇の魔導士", hp: 48, atk: 14, def: 5, exp: 42, gold: 38, sprite: "bat" },
  armorKnight: { name: "よろい騎士", hp: 58, atk: 15, def: 8, exp: 52, gold: 45, sprite: "skeleton" },
  boss: { name: "魔王ガルド", hp: 95, atk: 17, def: 8, exp: 120, gold: 180, boss: true, sprite: "boss" }
};

const WEAPONS = {
  stick: { name: "木のつえ", atk: 2, price: 0 },
  bronzeSword: { name: "銅の剣", atk: 6, price: 45 },
  ironSword: { name: "鉄の剣", atk: 11, price: 95 }
};

const ARMORS = {
  cloth: { name: "旅人の服", def: 1, price: 0 },
  leather: { name: "革のよろい", def: 4, price: 40 },
  chainmail: { name: "くさりかたびら", def: 8, price: 90 }
};

const ITEMS = {
  herb: { name: "やくそう", price: 12, heal: 25 },
  potion: { name: "ポーション", price: 30, heal: 55 }
};

const SHOP_GOODS = {
  weapon: [
    { type: "weapon", id: "bronzeSword" },
    { type: "weapon", id: "ironSword" },
    { type: "armor", id: "leather" },
    { type: "armor", id: "chainmail" }
  ],
  item: [
    { type: "item", id: "herb" },
    { type: "item", id: "potion" }
  ]
};

const state = {
  mapId: "village",
  player: {
    x: 8,
    y: 8,
    lv: 1,
    hp: 30,
    maxHp: 30,
    exp: 0,
    gold: 20,
    weapon: "stick",
    armor: "cloth",
    inventory: { herb: 2, potion: 0 },
    weapons: ["stick"],
    armors: ["cloth"]
  },
  flags: {
    openedDungeonChest: false,
    foundCrest: false,
    openedCastleChest: false,
    defeatedBoss: false
  },
  mode: "map",
  battle: null,
  message: "ようこそ。矢印キーで移動、Enterで調べる。",
  saveState: "未セーブ"
};

const audio = {
  enabled: false,
  context: null,
  filePlayer: null,
  fileTheme: "",
  timer: null,
  step: 0,
  theme: "",
  nextNoteTime: 0
};

const AUDIO_TRACKS = {
  village: "assets/bgm/village.m4a"
};

const NOTE_FREQ = {
  C3: 130.81, D3: 146.83, Eb3: 155.56, E3: 164.81, F3: 174.61, G3: 196.00, Ab3: 207.65, A3: 220.00, Bb3: 233.08, B3: 246.94,
  C4: 261.63, D4: 293.66, Eb4: 311.13, E4: 329.63, F4: 349.23, G4: 392.00, Ab4: 415.30, A4: 440.00, Bb4: 466.16, B4: 493.88,
  C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.00, B5: 987.77
};

const SONGS = {
  village: makeSong(118,
    repeatPattern(["E4", "G4", "A4", "B4", "A4", "G4", "E4", "-", "D4", "E4", "G4", "A4", "G4", "E4", "D4", "-", "C4", "D4", "E4", "G4", "A4", "G4", "E4", "D4", "E4", "G4", "A4", "B4", "A4", "G4", "E4", "-"], 8),
    repeatPattern(["C3", "-", "G3", "-", "A3", "-", "E3", "-", "F3", "-", "C3", "-", "G3", "-", "G3", "-"], 16),
    repeatPattern(["C4", "E4", "G4", "E4", "A3", "C4", "E4", "C4", "F3", "A3", "C4", "A3", "G3", "B3", "D4", "B3"], 16)
  ),
  field: makeSong(146,
    repeatPattern(["C4", "E4", "G4", "C5", "B4", "G4", "A4", "-", "G4", "E4", "F4", "A4", "G4", "E4", "D4", "-", "E4", "G4", "A4", "C5", "D5", "C5", "A4", "G4", "E4", "G4", "C5", "B4", "A4", "G4", "E4", "-"], 8),
    repeatPattern(["C3", "-", "C3", "G3", "A3", "-", "A3", "E3", "F3", "-", "F3", "C3", "G3", "-", "G3", "D3"], 16),
    repeatPattern(["C4", "G4", "E4", "G4", "A3", "E4", "C4", "E4", "F3", "C4", "A3", "C4", "G3", "D4", "B3", "D4"], 16)
  ),
  dungeon: makeSong(108,
    repeatPattern(["E4", "-", "F4", "E4", "D4", "-", "C4", "-", "B3", "C4", "D4", "-", "C4", "-", "B3", "-", "A3", "-", "C4", "D4", "E4", "-", "D4", "C4", "B3", "-", "G3", "-", "A3", "-", "-", "-"], 8),
    repeatPattern(["A3", "-", "A3", "-", "F3", "-", "F3", "-", "G3", "-", "G3", "-", "E3", "-", "E3", "-"], 16),
    repeatPattern(["A3", "C4", "E4", "C4", "F3", "A3", "C4", "A3", "G3", "B3", "D4", "B3", "E3", "G3", "B3", "G3"], 16)
  ),
  forest: makeSong(126,
    repeatPattern(["A4", "G4", "E4", "-", "G4", "A4", "C5", "-", "B4", "A4", "G4", "E4", "D4", "-", "E4", "-", "F4", "G4", "A4", "-", "C5", "B4", "A4", "G4", "E4", "G4", "A4", "C5", "B4", "G4", "A4", "-"], 8),
    repeatPattern(["A3", "-", "E3", "-", "F3", "-", "C3", "-", "G3", "-", "D3", "-", "E3", "-", "E3", "-"], 16),
    repeatPattern(["A3", "C4", "E4", "C4", "F3", "A3", "C4", "A3", "G3", "B3", "D4", "B3", "E3", "G3", "B3", "G3"], 16)
  ),
  forestVillage: makeSong(120,
    repeatPattern(["G4", "A4", "B4", "D5", "C5", "B4", "A4", "-", "G4", "E4", "G4", "A4", "B4", "A4", "G4", "-", "E4", "G4", "A4", "B4", "D5", "B4", "A4", "G4", "E4", "G4", "A4", "G4", "E4", "D4", "C4", "-"], 8),
    repeatPattern(["C3", "-", "G3", "-", "E3", "-", "G3", "-", "F3", "-", "C3", "-", "G3", "-", "G3", "-"], 16),
    repeatPattern(["C4", "E4", "G4", "E4", "E3", "G3", "B3", "G3", "F3", "A3", "C4", "A3", "G3", "B3", "D4", "B3"], 16)
  ),
  castle: makeSong(132,
    repeatPattern(["C4", "-", "D4", "Eb4", "D4", "C4", "B3", "-", "C4", "G4", "F4", "Eb4", "D4", "-", "C4", "-", "G3", "C4", "D4", "Eb4", "F4", "Eb4", "D4", "C4", "B3", "D4", "F4", "G4", "F4", "D4", "C4", "-"], 8),
    repeatPattern(["C3", "-", "C3", "-", "G3", "-", "G3", "-", "Ab3", "-", "Ab3", "-", "G3", "-", "G3", "-"], 16),
    repeatPattern(["C4", "G4", "Eb4", "G4", "G3", "D4", "B3", "D4", "Ab3", "C4", "Eb4", "C4", "G3", "B3", "D4", "B3"], 16)
  ),
  battle: makeSong(164,
    repeatPattern(["E4", "G4", "A4", "B4", "C5", "B4", "A4", "G4", "E4", "G4", "A4", "C5", "B4", "A4", "G4", "E4"], 16),
    repeatPattern(["E3", "E3", "B3", "E3", "C3", "C3", "G3", "C3", "D3", "D3", "A3", "D3", "B3", "B3", "F3", "B3"], 16),
    repeatPattern(["E4", "B4", "G4", "B4", "C4", "G4", "E4", "G4", "D4", "A4", "F4", "A4", "B3", "F4", "D4", "F4"], 16)
  ),
  boss: makeSong(150,
    repeatPattern(["C4", "D4", "Eb4", "G4", "F4", "Eb4", "D4", "C4", "B3", "C4", "D4", "F4", "Eb4", "D4", "C4", "-"], 16),
    repeatPattern(["C3", "C3", "G3", "C3", "Ab3", "Ab3", "Eb3", "Ab3", "Bb3", "Bb3", "F3", "Bb3", "G3", "G3", "D3", "G3"], 16),
    repeatPattern(["C4", "G4", "Eb4", "G4", "Ab3", "Eb4", "C4", "Eb4", "Bb3", "F4", "D4", "F4", "G3", "D4", "B3", "D4"], 16)
  ),
  ending: makeSong(112,
    repeatPattern(["C4", "E4", "G4", "C5", "D5", "C5", "B4", "G4", "A4", "C5", "E5", "D5", "C5", "A4", "G4", "-", "E4", "G4", "C5", "E5", "D5", "C5", "B4", "G4", "A4", "B4", "C5", "D5", "C5", "G4", "E4", "-"], 8),
    repeatPattern(["C3", "-", "G3", "-", "A3", "-", "E3", "-", "F3", "-", "C3", "-", "G3", "-", "G3", "-"], 16),
    repeatPattern(["C4", "E4", "G4", "E4", "A3", "C4", "E4", "C4", "F3", "A3", "C4", "A3", "G3", "B3", "D4", "B3"], 16)
  )
};

const els = {
  map: document.getElementById("map"),
  areaName: document.getElementById("areaName"),
  saveState: document.getElementById("saveState"),
  lv: document.getElementById("lv"),
  hp: document.getElementById("hp"),
  maxHp: document.getElementById("maxHp"),
  exp: document.getElementById("exp"),
  gold: document.getElementById("gold"),
  message: document.getElementById("message"),
  modal: document.getElementById("modal"),
  modalTitle: document.getElementById("modalTitle"),
  modalBody: document.getElementById("modalBody"),
  modalActions: document.getElementById("modalActions")
};

function getMap() {
  return MAPS[state.mapId];
}

function tileAt(x, y) {
  const row = getMap().rows[y];
  if (!row) return TILE.w;
  return TILE[row[x]] || TILE.w;
}

function charAt(x, y) {
  const row = getMap().rows[y] || "";
  return row[x] || "w";
}

function setMessage(text) {
  state.message = text;
  els.message.textContent = text;
}

function playerAtk() {
  return 4 + state.player.lv * 2 + WEAPONS[state.player.weapon].atk;
}

function playerDef() {
  return state.player.lv + ARMORS[state.player.armor].def;
}

function expToNext() {
  return state.player.lv * 25;
}

function render() {
  const map = getMap();
  updateMusicTheme();
  els.areaName.textContent = map.name;
  els.saveState.textContent = state.saveState;
  els.lv.textContent = state.player.lv;
  els.hp.textContent = state.player.hp;
  els.maxHp.textContent = state.player.maxHp;
  els.exp.textContent = state.player.exp;
  els.gold.textContent = state.player.gold;
  els.message.textContent = state.message;

  els.map.innerHTML = "";
  for (let y = 0; y < MAP_H; y++) {
    for (let x = 0; x < MAP_W; x++) {
      const tile = tileAt(x, y);
      const cell = document.createElement("div");
      cell.className = `tile ${tile.className}`;
      cell.textContent = tile.mark;
      if (state.player.x === x && state.player.y === y) {
        cell.classList.add("player");
      }
      els.map.appendChild(cell);
    }
  }
}

function canMoveTo(x, y) {
  if (x < 0 || x >= MAP_W || y < 0 || y >= MAP_H) return false;
  return !tileAt(x, y).block;
}

function movePlayer(dx, dy) {
  if (state.mode !== "map") return;
  const nx = state.player.x + dx;
  const ny = state.player.y + dy;
  if (!canMoveTo(nx, ny)) {
    setMessage("ここは通れない。");
    return;
  }

  const exit = getMap().exits[`${nx},${ny}`];
  if (exit) {
    if (exit.requiredFlag && !state.flags[exit.requiredFlag]) {
      setMessage(exit.message || "まだ先へは進めない。");
      render();
      return;
    }
    state.player.x = nx;
    state.player.y = ny;
    changeMap(exit.to, exit.x, exit.y);
    return;
  }

  state.player.x = nx;
  state.player.y = ny;
  const ch = charAt(nx, ny);
  if (ch === "B") {
    startBattle("boss");
    return;
  }

  maybeEncounter();
  render();
}

function changeMap(mapId, x, y) {
  state.mapId = mapId;
  state.player.x = x;
  state.player.y = y;
  setMessage(`${getMap().name}に来た。`);
  render();
}

function maybeEncounter() {
  const encounters = getMap().encounters;
  if (!encounters.length) {
    setMessage(`${tileAt(state.player.x, state.player.y).name}を歩いている。`);
    return;
  }
  if (Math.random() < 0.16) {
    const id = encounters[Math.floor(Math.random() * encounters.length)];
    startBattle(id);
    return;
  }
  setMessage("あたりを警戒しながら進む。");
}

function inspectTile() {
  if (state.mode !== "map") return;
  const ch = charAt(state.player.x, state.player.y);
  if (ch === "N") {
    talkToNpc();
  } else if (ch === "S") {
    openShop("weapon");
  } else if (ch === "T") {
    openShop("item");
  } else if (ch === "I") {
    openInn();
  } else if (ch === "C") {
    openChest();
  } else if (ch === "B") {
    startBattle("boss");
  } else {
    setMessage(`${tileAt(state.player.x, state.player.y).name}だ。`);
  }
  render();
}

function openChest() {
  if (state.mapId === "castle") {
    if (state.flags.openedCastleChest) {
      setMessage("宝箱は空っぽだ。");
      return;
    }
    state.flags.openedCastleChest = true;
    state.player.inventory.potion += 2;
    setMessage("城の宝箱からポーションを2個見つけた。ラスボス戦に備えよう。");
    return;
  }

  if (state.flags.openedDungeonChest) {
    setMessage("宝箱は空っぽだ。");
    return;
  }
  state.flags.openedDungeonChest = true;
  state.flags.foundCrest = true;
  state.player.gold += 50;
  state.player.inventory.potion += 1;
  setMessage("宝箱を開けた。森へ入るための紋章、50G、ポーションを手に入れた。");
}

function talkToNpc() {
  if (state.mapId === "village") {
    if (state.flags.foundCrest) {
      setMessage("村人「紋章を見つけたのか。東の森を抜ければ、魔王の城へ近づけるはずだ。」");
    } else {
      setMessage("村人「洞窟に森の霧を晴らす紋章があるらしい。装備とやくそうを忘れるなよ。」");
    }
    return;
  }

  if (state.mapId === "forestVillage") {
    setMessage("里人「魔王の城は森の北にある。城の中の宝箱も忘れずに探すといい。」");
    return;
  }

  setMessage("旅人「道は続いている。焦らず準備して進もう。」");
}

function openInn() {
  openModal("宿屋", `<p>宿屋「10Gで全回復できます。」</p><p>所持金: ${state.player.gold}G</p>`, [
    { label: "泊まる", action: () => {
      if (state.player.gold < 10) {
        setMessage("ゴールドが足りない。");
      } else {
        state.player.gold -= 10;
        state.player.hp = state.player.maxHp;
        setMessage("ぐっすり眠って全回復した。");
      }
      closeModal();
      render();
    } },
    { label: "やめる", action: closeModal }
  ]);
}

function openShop(kind) {
  const title = kind === "weapon" ? "武器屋" : "道具屋";
  const goods = SHOP_GOODS[kind];
  const list = goods.map((good, index) => {
    const data = getGoodData(good);
    const owned = good.type === "weapon" && state.player.weapons.includes(good.id)
      || good.type === "armor" && state.player.armors.includes(good.id);
    const note = owned ? " / 所持済み" : "";
    return `<div class="item-row">${index + 1}. ${data.name} ${data.price}G${note}</div>`;
  }).join("");

  openModal(title, `<p>所持金: ${state.player.gold}G</p><div class="list">${list}</div>`, [
    ...goods.map((good) => {
      const data = getGoodData(good);
      return { label: `${data.name}`, action: () => buyGood(good) };
    }),
    { label: "閉じる", action: closeModal }
  ]);
}

function getGoodData(good) {
  if (good.type === "weapon") return WEAPONS[good.id];
  if (good.type === "armor") return ARMORS[good.id];
  return ITEMS[good.id];
}

function buyGood(good) {
  const data = getGoodData(good);
  if (state.player.gold < data.price) {
    setMessage("ゴールドが足りない。");
    closeModal();
    render();
    return;
  }

  if (good.type === "weapon") {
    if (state.player.weapons.includes(good.id)) {
      setMessage("それはもう持っている。");
    } else {
      state.player.gold -= data.price;
      state.player.weapons.push(good.id);
      state.player.weapon = good.id;
      setMessage(`${data.name}を買って装備した。`);
    }
  } else if (good.type === "armor") {
    if (state.player.armors.includes(good.id)) {
      setMessage("それはもう持っている。");
    } else {
      state.player.gold -= data.price;
      state.player.armors.push(good.id);
      state.player.armor = good.id;
      setMessage(`${data.name}を買って装備した。`);
    }
  } else {
    state.player.gold -= data.price;
    state.player.inventory[good.id] += 1;
    setMessage(`${data.name}を買った。`);
  }
  closeModal();
  render();
}

function openMenu() {
  const p = state.player;
  const itemText = Object.keys(ITEMS)
    .map((id) => `${ITEMS[id].name}: ${p.inventory[id]}`)
    .join("<br>");

  openModal("メニュー", `
    <p>LV ${p.lv} / HP ${p.hp}/${p.maxHp} / EXP ${p.exp}/${expToNext()} / ${p.gold}G</p>
    <p>攻撃力: ${playerAtk()} / 守備力: ${playerDef()}</p>
    <p>武器: ${WEAPONS[p.weapon].name}<br>防具: ${ARMORS[p.armor].name}</p>
    <p>${itemText}</p>
  `, [
    { label: "アイテム", action: openItemMenu },
    { label: "装備変更", action: openEquipMenu },
    { label: "セーブ", action: () => { saveGame(); closeModal(); } },
    { label: "閉じる", action: closeModal }
  ]);
}

function openItemMenu() {
  const actions = Object.keys(ITEMS).map((id) => ({
    label: `${ITEMS[id].name} x${state.player.inventory[id]}`,
    action: () => useItem(id)
  }));
  actions.push({ label: "戻る", action: openMenu });
  openModal("アイテム", "<p>使うアイテムを選んでください。</p>", actions);
}

function useItem(id) {
  if (state.player.inventory[id] <= 0) {
    setMessage(`${ITEMS[id].name}を持っていない。`);
    closeModal();
    render();
    return;
  }
  if (state.player.hp >= state.player.maxHp) {
    setMessage("HPはすでに満タンだ。");
    closeModal();
    render();
    return;
  }
  state.player.inventory[id] -= 1;
  state.player.hp = Math.min(state.player.maxHp, state.player.hp + ITEMS[id].heal);
  setMessage(`${ITEMS[id].name}でHPが回復した。`);
  closeModal();
  render();
}

function openEquipMenu() {
  const actions = [];
  state.player.weapons.forEach((id) => {
    actions.push({ label: `武器: ${WEAPONS[id].name}`, action: () => equip("weapon", id) });
  });
  state.player.armors.forEach((id) => {
    actions.push({ label: `防具: ${ARMORS[id].name}`, action: () => equip("armor", id) });
  });
  actions.push({ label: "戻る", action: openMenu });
  openModal("装備変更", "<p>変更する装備を選んでください。</p>", actions);
}

function equip(kind, id) {
  state.player[kind] = id;
  const name = kind === "weapon" ? WEAPONS[id].name : ARMORS[id].name;
  setMessage(`${name}を装備した。`);
  closeModal();
  render();
}

function startBattle(enemyId) {
  const source = ENEMIES[enemyId];
  state.mode = "battle";
  state.battle = {
    enemyId,
    enemy: { ...source },
    turn: 1
  };
  setMessage(`${source.name}が現れた。`);
  render();
  openBattleModal();
}

function openBattleModal() {
  const b = state.battle;
  if (!b) return;
  openModal("戦闘", `
    <div class="battle-scene">
      <div class="battle-side">
        <div class="sprite hero-sprite" aria-label="勇者"></div>
        <div>勇者 HP ${state.player.hp}/${state.player.maxHp}</div>
      </div>
      <div class="battle-side">
        <div class="sprite monster-sprite monster-${b.enemy.sprite}" aria-label="${b.enemy.name}"></div>
        <div>${b.enemy.name} HP ${Math.max(0, b.enemy.hp)}</div>
      </div>
    </div>
  `, [
    { label: "攻撃", action: playerAttack },
    { label: "やくそう", action: () => battleUseItem("herb") },
    { label: "ポーション", action: () => battleUseItem("potion") },
    { label: "逃げる", action: tryRun }
  ]);
}

function playerAttack() {
  const b = state.battle;
  const damage = Math.max(1, playerAtk() - b.enemy.def + rand(-2, 3));
  b.enemy.hp -= damage;
  if (b.enemy.hp <= 0) {
    winBattle(`${b.enemy.name}に${damage}ダメージ。`);
    return;
  }
  enemyTurn(`${b.enemy.name}に${damage}ダメージ。`);
}

function battleUseItem(id) {
  if (state.player.inventory[id] <= 0) {
    setMessage(`${ITEMS[id].name}を持っていない。`);
    openBattleModal();
    return;
  }
  state.player.inventory[id] -= 1;
  state.player.hp = Math.min(state.player.maxHp, state.player.hp + ITEMS[id].heal);
  enemyTurn(`${ITEMS[id].name}で回復した。`);
}

function enemyTurn(prefix) {
  const b = state.battle;
  const damage = Math.max(1, b.enemy.atk - playerDef() + rand(-1, 3));
  state.player.hp -= damage;
  if (state.player.hp <= 0) {
    loseBattle(`${prefix} ${b.enemy.name}の攻撃で${damage}ダメージ。`);
    return;
  }
  setMessage(`${prefix} ${b.enemy.name}の攻撃で${damage}ダメージ。`);
  render();
  openBattleModal();
}

function tryRun() {
  if (state.battle.enemy.boss) {
    setMessage("魔王からは逃げられない。");
    openBattleModal();
    return;
  }
  if (Math.random() < 0.55) {
    state.mode = "map";
    state.battle = null;
    setMessage("うまく逃げ切った。");
    closeModal();
    render();
  } else {
    enemyTurn("逃げられなかった。");
  }
}

function winBattle(prefix) {
  const enemy = state.battle.enemy;
  state.player.exp += enemy.exp;
  state.player.gold += enemy.gold;
  state.mode = "map";
  state.battle = null;
  const leveled = applyLevelUps();

  if (enemy.boss) {
    state.flags.defeatedBoss = true;
    closeModal();
    showEnding();
    return;
  }

  setMessage(`${prefix} 勝利。${enemy.exp}EXPと${enemy.gold}Gを得た。${leveled}`);
  closeModal();
  render();
}

function loseBattle(prefix) {
  state.player.hp = Math.max(1, Math.floor(state.player.maxHp / 2));
  state.mapId = "village";
  state.player.x = 8;
  state.player.y = 8;
  state.mode = "map";
  state.battle = null;
  setMessage(`${prefix} 倒れて村に運ばれた。HPが半分回復した。`);
  closeModal();
  render();
}

function applyLevelUps() {
  const messages = [];
  while (state.player.exp >= expToNext() && state.player.lv < 9) {
    state.player.exp -= expToNext();
    state.player.lv += 1;
    state.player.maxHp += 8;
    state.player.hp = state.player.maxHp;
    messages.push(` LV${state.player.lv}に上がった。`);
  }
  return messages.join("");
}

function showEnding() {
  state.mode = "ending";
  updateMusicTheme();
  openModal("エンディング", `
    <div class="ending">
      <h2>魔王は倒れた</h2>
      <p>村に朝日が戻り、クリスタルは静かに輝いた。</p>
      <p>小さな冒険はここで完結です。</p>
      <p>次は町、仲間、魔法、クエストを追加できます。</p>
    </div>
  `, [
    { label: "セーブ", action: saveGame },
    { label: "閉じる", action: () => { closeModal(); render(); } }
  ]);
}

function saveGame() {
  const data = JSON.stringify({
    mapId: state.mapId,
    player: state.player,
    flags: state.flags,
    message: state.message
  });
  localStorage.setItem(SAVE_KEY, data);
  state.saveState = "セーブ済み";
  setMessage("セーブしました。");
  render();
}

function loadGame() {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) {
    setMessage("セーブデータがありません。");
    render();
    return;
  }
  try {
    const data = JSON.parse(raw);
    state.mapId = data.mapId || "village";
    state.player = { ...state.player, ...data.player };
    state.flags = { ...state.flags, ...data.flags };
    state.mode = "map";
    state.battle = null;
    state.saveState = "ロード済み";
    setMessage("ロードしました。");
  } catch (error) {
    setMessage("ロードに失敗しました。セーブデータが壊れている可能性があります。");
  }
  render();
}

function newGame() {
  localStorage.removeItem(SAVE_KEY);
  location.reload();
}

function openModal(title, bodyHtml, actions) {
  els.modalTitle.textContent = title;
  els.modalBody.innerHTML = bodyHtml;
  els.modalActions.innerHTML = "";
  actions.forEach((item) => {
    const button = document.createElement("button");
    button.textContent = item.label;
    button.addEventListener("click", item.action);
    els.modalActions.appendChild(button);
  });
  els.modal.classList.remove("hidden");
}

function closeModal() {
  els.modal.classList.add("hidden");
}

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function toggleSound() {
  audio.enabled = !audio.enabled;
  document.getElementById("btnSound").textContent = audio.enabled ? "音楽 OFF" : "音楽 ON";

  if (audio.enabled) {
    startAudio();
    setMessage("音楽をONにしました。");
  } else {
    stopAudio();
    setMessage("音楽をOFFにしました。");
  }
  render();
}

function startAudio() {
  if (!audio.context && typeof window.AudioContext !== "undefined" || !audio.context && typeof window.webkitAudioContext !== "undefined") {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    audio.context = new AudioContextClass();
  }

  if (audio.context && audio.context.state === "suspended") {
    audio.context.resume();
  }
  updateMusicTheme(true);
}

function stopAudio() {
  stopSynthMusic();
  stopFileMusic();
}

function currentThemeName() {
  if (state.mode === "ending") return "ending";
  if (state.mode === "battle" && state.battle?.enemy.boss) return "boss";
  if (state.mode === "battle") return "battle";
  return state.mapId;
}

function updateMusicTheme(force = false) {
  if (!audio.enabled) return;
  const nextTheme = currentThemeName();
  const fileSrc = AUDIO_TRACKS[nextTheme];

  if (fileSrc) {
    stopSynthMusic();
    playFileMusic(nextTheme, fileSrc, force);
    return;
  }

  stopFileMusic();
  if (!audio.context) {
    setMessage("このブラウザでは内蔵BGM機能が使えません。");
    audio.enabled = false;
    document.getElementById("btnSound").textContent = "音楽 ON";
    return;
  }

  if (!force && audio.theme === nextTheme && audio.timer) return;

  stopSynthMusic();
  audio.theme = nextTheme;
  audio.step = 0;
  audio.nextNoteTime = audio.context.currentTime + 0.05;
  audio.timer = setInterval(scheduleMusic, 70);
  scheduleMusic();
}

function stopSynthMusic() {
  if (audio.timer) {
    clearInterval(audio.timer);
    audio.timer = null;
  }
}

function playFileMusic(theme, src, force = false) {
  if (!force && audio.fileTheme === theme && audio.filePlayer && !audio.filePlayer.paused) return;

  stopFileMusic();
  audio.theme = theme;
  audio.fileTheme = theme;

  if (typeof Audio === "undefined") return;
  audio.filePlayer = new Audio(src);
  audio.filePlayer.loop = true;
  audio.filePlayer.volume = 0.65;

  const playResult = audio.filePlayer.play();
  if (playResult && typeof playResult.catch === "function") {
    playResult.catch(() => {
      setMessage("音楽を再生できませんでした。音楽ONをもう一度押してください。");
    });
  }
}

function stopFileMusic() {
  if (!audio.filePlayer) return;
  audio.filePlayer.pause();
  audio.filePlayer.currentTime = 0;
  audio.filePlayer = null;
  audio.fileTheme = "";
}

function scheduleMusic() {
  if (!audio.enabled || !audio.context) return;
  const song = SONGS[audio.theme] || SONGS.village;
  const lookAhead = audio.context.currentTime + 0.25;

  while (audio.nextNoteTime < lookAhead) {
    playSongStep(song, audio.step, audio.nextNoteTime);
    audio.nextNoteTime += song.stepSeconds;
    audio.step = (audio.step + 1) % song.length;
  }
}

function playSongStep(song, step, time) {
  playTone(song.lead[step], time, song.stepSeconds * 0.88, "square", 0.035);
  playTone(song.bass[step], time, song.stepSeconds * 0.72, "triangle", 0.026);
  playTone(song.arp[step], time, song.stepSeconds * 0.45, "square", 0.012);

  if (step % 8 === 0 || step % 8 === 4) {
    playNoise(time, song.stepSeconds * 0.22, step % 8 === 0 ? 0.022 : 0.012);
  }
}

function playTone(noteName, startTime, duration, waveType, volume) {
  if (!noteName || noteName === "-") return;
  const freq = NOTE_FREQ[noteName];
  if (!freq) return;

  const osc = audio.context.createOscillator();
  const gain = audio.context.createGain();
  osc.type = waveType;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.0001, startTime);
  gain.gain.exponentialRampToValueAtTime(volume, startTime + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
  osc.connect(gain);
  gain.connect(audio.context.destination);
  osc.start(startTime);
  osc.stop(startTime + duration + 0.02);
}

function playNoise(startTime, duration, volume) {
  const sampleRate = audio.context.sampleRate;
  const buffer = audio.context.createBuffer(1, Math.floor(sampleRate * duration), sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
  }

  const source = audio.context.createBufferSource();
  const gain = audio.context.createGain();
  source.buffer = buffer;
  gain.gain.setValueAtTime(volume, startTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
  source.connect(gain);
  gain.connect(audio.context.destination);
  source.start(startTime);
  source.stop(startTime + duration);
}

function makeSong(bpm, lead, bass, arp) {
  const length = Math.max(lead.length, bass.length, arp.length);
  return {
    bpm,
    length,
    stepSeconds: 60 / bpm / 2,
    lead: fillPattern(lead, length),
    bass: fillPattern(bass, length),
    arp: fillPattern(arp, length)
  };
}

function repeatPattern(pattern, count) {
  const result = [];
  for (let i = 0; i < count; i++) {
    result.push(...pattern);
  }
  return result;
}

function fillPattern(pattern, length) {
  const result = [];
  for (let i = 0; i < length; i++) {
    result.push(pattern[i % pattern.length]);
  }
  return result;
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModal();
    return;
  }
  if (!els.modal.classList.contains("hidden")) return;

  const key = event.key.toLowerCase();
  if (key === "arrowup" || key === "w") movePlayer(0, -1);
  if (key === "arrowdown" || key === "s") movePlayer(0, 1);
  if (key === "arrowleft" || key === "a") movePlayer(-1, 0);
  if (key === "arrowright" || key === "d") movePlayer(1, 0);
  if (key === "enter" || key === " ") inspectTile();
  if (key === "m") openMenu();
});

document.getElementById("btnTalk").addEventListener("click", inspectTile);
document.getElementById("btnMenu").addEventListener("click", openMenu);
document.getElementById("btnSound").addEventListener("click", toggleSound);
document.getElementById("btnSave").addEventListener("click", saveGame);
document.getElementById("btnLoad").addEventListener("click", loadGame);
document.getElementById("btnNew").addEventListener("click", newGame);

document.querySelectorAll("[data-move]").forEach((button) => {
  const move = () => {
    const direction = button.dataset.move;
    if (direction === "up") movePlayer(0, -1);
    if (direction === "down") movePlayer(0, 1);
    if (direction === "left") movePlayer(-1, 0);
    if (direction === "right") movePlayer(1, 0);
  };

  button.addEventListener("click", move);
  button.addEventListener("touchstart", (event) => {
    event.preventDefault();
    move();
  }, { passive: false });
});

render();

