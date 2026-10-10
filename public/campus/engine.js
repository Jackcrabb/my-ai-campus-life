/* Lumen Lab campus engine: original local raster artwork with procedural loading/error fallbacks. */
(() => {
  "use strict";
  const DEFAULT_VIEW_WIDTH = 900,
    H = 500,
    GROUND = 382,
    WALK_SPEED = 170;
  const FLOOR_DEPTH = {back:-10,front:35,center:6,speed:80};
  const COLORS = {
    ink: "#253e43",
    deep: "#214b4c",
    teal: "#387c78",
    mint: "#bcd8c7",
    pale: "#dce8d8",
    cream: "#f5edda",
    wall: "#e7dfc7",
    light: "#fff6dc",
    blue: "#adcdd3",
    coral: "#db7861",
    gold: "#edbf57",
    floor: "#cfbca1",
    line: "#b6a58e",
    brown: "#8c6c54",
  };
  const CHARACTER_ATLASES = [
  {
    "src": "assets/characters/students-boy-queens-college.png",
    "cols": 6,
    "rows": 3,
    "frames": [
      {
        "x": 115,
        "y": 8,
        "w": 100,
        "h": 331,
        "anchorX": 170,
        "baseline": 337
      },
      {
        "x": 351,
        "y": 8,
        "w": 99,
        "h": 331,
        "anchorX": 405,
        "baseline": 337
      },
      {
        "x": 587,
        "y": 8,
        "w": 100,
        "h": 331,
        "anchorX": 642,
        "baseline": 337
      },
      {
        "x": 829,
        "y": 9,
        "w": 99,
        "h": 330,
        "anchorX": 884,
        "baseline": 337
      },
      {
        "x": 1071,
        "y": 9,
        "w": 98,
        "h": 330,
        "anchorX": 1126,
        "baseline": 337
      },
      {
        "x": 1310,
        "y": 10,
        "w": 99,
        "h": 329,
        "anchorX": 1364,
        "baseline": 337
      },
      {
        "x": 97,
        "y": 352,
        "w": 152,
        "h": 314,
        "anchorX": 173,
        "baseline": 664
      },
      {
        "x": 332,
        "y": 352,
        "w": 153,
        "h": 314,
        "anchorX": 408,
        "baseline": 664
      },
      {
        "x": 569,
        "y": 352,
        "w": 158,
        "h": 314,
        "anchorX": 648,
        "baseline": 664
      },
      {
        "x": 809,
        "y": 352,
        "w": 155,
        "h": 314,
        "anchorX": 888,
        "baseline": 664
      },
      {
        "x": 1048,
        "y": 354,
        "w": 159,
        "h": 312,
        "anchorX": 1130,
        "baseline": 664
      },
      {
        "x": 1288,
        "y": 354,
        "w": 159,
        "h": 312,
        "anchorX": 1370,
        "baseline": 664
      },
      {
        "x": 95,
        "y": 679,
        "w": 154,
        "h": 322,
        "anchorX": 174,
        "baseline": 999
      },
      {
        "x": 327,
        "y": 679,
        "w": 159,
        "h": 322,
        "anchorX": 409,
        "baseline": 999
      },
      {
        "x": 565,
        "y": 679,
        "w": 159,
        "h": 323,
        "anchorX": 646,
        "baseline": 1000
      },
      {
        "x": 806,
        "y": 681,
        "w": 157,
        "h": 321,
        "anchorX": 888,
        "baseline": 1000
      },
      {
        "x": 1042,
        "y": 681,
        "w": 161,
        "h": 321,
        "anchorX": 1126,
        "baseline": 1000
      },
      {
        "x": 1283,
        "y": 679,
        "w": 159,
        "h": 322,
        "anchorX": 1362,
        "baseline": 999
      }
    ]
  },
  {
    "src": "assets/characters/students-boy-hkcwcc.png",
    "cols": 6,
    "rows": 3,
    "frames": [
      {
        "x": 111,
        "y": 10,
        "w": 107,
        "h": 342,
        "anchorX": 170,
        "baseline": 350
      },
      {
        "x": 335,
        "y": 10,
        "w": 107,
        "h": 342,
        "anchorX": 394,
        "baseline": 350
      },
      {
        "x": 568,
        "y": 10,
        "w": 107,
        "h": 342,
        "anchorX": 628,
        "baseline": 350
      },
      {
        "x": 846,
        "y": 10,
        "w": 106,
        "h": 342,
        "anchorX": 906,
        "baseline": 350
      },
      {
        "x": 1080,
        "y": 11,
        "w": 106,
        "h": 341,
        "anchorX": 1138,
        "baseline": 350
      },
      {
        "x": 1309,
        "y": 11,
        "w": 106,
        "h": 341,
        "anchorX": 1368,
        "baseline": 350
      },
      {
        "x": 96,
        "y": 357,
        "w": 154,
        "h": 323,
        "anchorX": 170,
        "baseline": 678
      },
      {
        "x": 323,
        "y": 357,
        "w": 155,
        "h": 323,
        "anchorX": 398,
        "baseline": 678
      },
      {
        "x": 552,
        "y": 357,
        "w": 157,
        "h": 323,
        "anchorX": 628,
        "baseline": 678
      },
      {
        "x": 832,
        "y": 357,
        "w": 153,
        "h": 323,
        "anchorX": 906,
        "baseline": 678
      },
      {
        "x": 1061,
        "y": 357,
        "w": 156,
        "h": 323,
        "anchorX": 1139,
        "baseline": 678
      },
      {
        "x": 1293,
        "y": 357,
        "w": 156,
        "h": 323,
        "anchorX": 1370,
        "baseline": 678
      },
      {
        "x": 86,
        "y": 684,
        "w": 168,
        "h": 324,
        "anchorX": 170,
        "baseline": 1006
      },
      {
        "x": 313,
        "y": 684,
        "w": 166,
        "h": 324,
        "anchorX": 396,
        "baseline": 1006
      },
      {
        "x": 544,
        "y": 684,
        "w": 167,
        "h": 324,
        "anchorX": 628,
        "baseline": 1006
      },
      {
        "x": 819,
        "y": 684,
        "w": 167,
        "h": 324,
        "anchorX": 906,
        "baseline": 1006
      },
      {
        "x": 1057,
        "y": 686,
        "w": 166,
        "h": 322,
        "anchorX": 1140,
        "baseline": 1006
      },
      {
        "x": 1285,
        "y": 686,
        "w": 167,
        "h": 322,
        "anchorX": 1368,
        "baseline": 1006
      }
    ]
  },
  {
    "src": "assets/characters/students-girl-hkcwcc.png",
    "cols": 6,
    "rows": 3,
    "frames": [
      {
        "x": 96,
        "y": 30,
        "w": 111,
        "h": 336,
        "anchorX": 150,
        "baseline": 361
      },
      {
        "x": 326,
        "y": 28,
        "w": 113,
        "h": 338,
        "anchorX": 381,
        "baseline": 361
      },
      {
        "x": 561,
        "y": 28,
        "w": 113,
        "h": 338,
        "anchorX": 618,
        "baseline": 361
      },
      {
        "x": 813,
        "y": 22,
        "w": 139,
        "h": 345,
        "anchorX": 890,
        "baseline": 362
      },
      {
        "x": 1066,
        "y": 22,
        "w": 139,
        "h": 344,
        "anchorX": 1146,
        "baseline": 362
      },
      {
        "x": 1325,
        "y": 22,
        "w": 142,
        "h": 344,
        "anchorX": 1406,
        "baseline": 361
      },
      {
        "x": 69,
        "y": 377,
        "w": 155,
        "h": 317,
        "anchorX": 156,
        "baseline": 690
      },
      {
        "x": 305,
        "y": 377,
        "w": 153,
        "h": 317,
        "anchorX": 388,
        "baseline": 690
      },
      {
        "x": 543,
        "y": 377,
        "w": 156,
        "h": 317,
        "anchorX": 626,
        "baseline": 690
      },
      {
        "x": 806,
        "y": 373,
        "w": 166,
        "h": 321,
        "anchorX": 902,
        "baseline": 690
      },
      {
        "x": 1065,
        "y": 375,
        "w": 166,
        "h": 319,
        "anchorX": 1161,
        "baseline": 690
      },
      {
        "x": 1325,
        "y": 375,
        "w": 167,
        "h": 319,
        "anchorX": 1416,
        "baseline": 690
      },
      {
        "x": 56,
        "y": 707,
        "w": 170,
        "h": 300,
        "anchorX": 144,
        "baseline": 1004
      },
      {
        "x": 295,
        "y": 707,
        "w": 173,
        "h": 301,
        "anchorX": 380,
        "baseline": 1005
      },
      {
        "x": 536,
        "y": 706,
        "w": 173,
        "h": 302,
        "anchorX": 620,
        "baseline": 1005
      },
      {
        "x": 806,
        "y": 705,
        "w": 174,
        "h": 303,
        "anchorX": 896,
        "baseline": 1005
      },
      {
        "x": 1063,
        "y": 705,
        "w": 176,
        "h": 303,
        "anchorX": 1154,
        "baseline": 1005
      },
      {
        "x": 1322,
        "y": 705,
        "w": 177,
        "h": 303,
        "anchorX": 1412,
        "baseline": 1005
      }
    ]
  },
  {
    "src": "assets/characters/students-girl-st-joan.png",
    "cols": 6,
    "rows": 3,
    "frames": [
      {
        "x": 96,
        "y": 23,
        "w": 126,
        "h": 356,
        "anchorX": 158,
        "baseline": 376
      },
      {
        "x": 337,
        "y": 21,
        "w": 126,
        "h": 358,
        "anchorX": 399,
        "baseline": 376
      },
      {
        "x": 583,
        "y": 21,
        "w": 125,
        "h": 358,
        "anchorX": 645,
        "baseline": 375
      },
      {
        "x": 821,
        "y": 12,
        "w": 136,
        "h": 368,
        "anchorX": 892,
        "baseline": 376
      },
      {
        "x": 1070,
        "y": 13,
        "w": 139,
        "h": 366,
        "anchorX": 1145,
        "baseline": 375
      },
      {
        "x": 1320,
        "y": 14,
        "w": 140,
        "h": 366,
        "anchorX": 1396,
        "baseline": 375
      },
      {
        "x": 87,
        "y": 390,
        "w": 152,
        "h": 323,
        "anchorX": 158,
        "baseline": 710
      },
      {
        "x": 326,
        "y": 389,
        "w": 159,
        "h": 324,
        "anchorX": 404,
        "baseline": 711
      },
      {
        "x": 568,
        "y": 389,
        "w": 160,
        "h": 324,
        "anchorX": 646,
        "baseline": 710
      },
      {
        "x": 818,
        "y": 380,
        "w": 159,
        "h": 333,
        "anchorX": 898,
        "baseline": 709
      },
      {
        "x": 1071,
        "y": 380,
        "w": 160,
        "h": 333,
        "anchorX": 1151,
        "baseline": 709
      },
      {
        "x": 1322,
        "y": 380,
        "w": 160,
        "h": 333,
        "anchorX": 1404,
        "baseline": 709
      },
      {
        "x": 79,
        "y": 718,
        "w": 159,
        "h": 300,
        "anchorX": 157,
        "baseline": 1015
      },
      {
        "x": 325,
        "y": 718,
        "w": 159,
        "h": 301,
        "anchorX": 400,
        "baseline": 1015
      },
      {
        "x": 565,
        "y": 718,
        "w": 162,
        "h": 301,
        "anchorX": 645,
        "baseline": 1015
      },
      {
        "x": 818,
        "y": 713,
        "w": 160,
        "h": 311,
        "anchorX": 897,
        "baseline": 1016
      },
      {
        "x": 1071,
        "y": 713,
        "w": 164,
        "h": 305,
        "anchorX": 1150,
        "baseline": 1015
      },
      {
        "x": 1323,
        "y": 713,
        "w": 164,
        "h": 305,
        "anchorX": 1401,
        "baseline": 1015
      }
    ]
  },
  {
    "src": "assets/characters/npcs-school-community.png",
    "cols": 10,
    "rows": 2,
    "frames": [
      {
        "x": 24,
        "y": 84,
        "w": 125,
        "h": 428,
        "anchorX": 88,
        "baseline": 510
      },
      {
        "x": 160,
        "y": 55,
        "w": 147,
        "h": 459,
        "anchorX": 235,
        "baseline": 512
      },
      {
        "x": 307,
        "y": 77,
        "w": 149,
        "h": 437,
        "anchorX": 394,
        "baseline": 512
      },
      {
        "x": 478,
        "y": 77,
        "w": 136,
        "h": 435,
        "anchorX": 540,
        "baseline": 510
      },
      {
        "x": 625,
        "y": 69,
        "w": 138,
        "h": 444,
        "anchorX": 692,
        "baseline": 511
      },
      {
        "x": 772,
        "y": 56,
        "w": 150,
        "h": 458,
        "anchorX": 838,
        "baseline": 512
      },
      {
        "x": 937,
        "y": 81,
        "w": 120,
        "h": 432,
        "anchorX": 996,
        "baseline": 511
      },
      {
        "x": 1075,
        "y": 56,
        "w": 154,
        "h": 460,
        "anchorX": 1150,
        "baseline": 514
      },
      {
        "x": 1240,
        "y": 69,
        "w": 142,
        "h": 444,
        "anchorX": 1299,
        "baseline": 511
      },
      {
        "x": 1382,
        "y": 53,
        "w": 143,
        "h": 462,
        "anchorX": 1444,
        "baseline": 513
      },
      {
        "x": 9,
        "y": 554,
        "w": 141,
        "h": 420,
        "anchorX": 88,
        "baseline": 972
      },
      {
        "x": 157,
        "y": 526,
        "w": 150,
        "h": 454,
        "anchorX": 234,
        "baseline": 978
      },
      {
        "x": 307,
        "y": 546,
        "w": 150,
        "h": 434,
        "anchorX": 395,
        "baseline": 978
      },
      {
        "x": 474,
        "y": 544,
        "w": 140,
        "h": 430,
        "anchorX": 544,
        "baseline": 972
      },
      {
        "x": 614,
        "y": 539,
        "w": 151,
        "h": 436,
        "anchorX": 693,
        "baseline": 973
      },
      {
        "x": 770,
        "y": 525,
        "w": 152,
        "h": 452,
        "anchorX": 838,
        "baseline": 975
      },
      {
        "x": 922,
        "y": 551,
        "w": 153,
        "h": 425,
        "anchorX": 998,
        "baseline": 974
      },
      {
        "x": 1075,
        "y": 526,
        "w": 154,
        "h": 452,
        "anchorX": 1150,
        "baseline": 976
      },
      {
        "x": 1229,
        "y": 540,
        "w": 153,
        "h": 436,
        "anchorX": 1300,
        "baseline": 974
      },
      {
        "x": 1382,
        "y": 524,
        "w": 154,
        "h": 452,
        "anchorX": 1445,
        "baseline": 974
      }
    ]
  }
];
  function playerAtlasIndex(avatar) {
    // Legacy loading art; the new wardrobe has four indices within each gender.
    const uniform = Math.max(0, Math.min(3, Number(avatar.uniform) || 0));
    return avatar.gender === 'girl' ? 2 + (uniform % 2) : uniform % 2;
  }
  const MOTION = Object.freeze({
    playerAcceleration: 680, playerDeceleration: 900, depthAcceleration: 360,
    npcSpeed: 150, npcAcceleration: 680, npcDeceleration: 900,
    npcRange: 220, npcRest: 3.8, interactionRange: 76, interactionCooldown: 0.35,
  });
  function approach(value, target, amount) {
    return value < target ? Math.min(target, value + amount) : Math.max(target, value - amount);
  }
  function registeredFrame(look, walking, phase, npc, avatar = {}) {
    // Measured against the 1536 × 512 source panels. Each entrance shares
  // one art anchor for its plaque, doorway hit area and walking destination.
  // Stair pairs on 1F/2F are mounted above the same painted stairwell.
  const ENTRANCE_ART = Object.freeze({
    corridor: { exit: [132, 104, 126], playground: [643, 104, 124], hall: [1096, 103, 126], corridor1: [1420, 76, 126] },
    corridor1: { chinese: [100, 63, 130], english: [790, 64, 132], maths: [1045, 62, 140], corridor: [1295, 64, 116], corridor2: [1430, 64, 116] },
    corridor2: { chemistry: [179, 65, 132], geography: [895, 65, 132], computer: [1213, 65, 130], corridor1: [1370, 61, 105], corridor3: [1480, 61, 102] },
    corridor3: { corridor2: [91, 66, 124], history: [445, 65, 117], art: [963, 65, 121], music: [1304, 65, 115], corridor4: [1471, 65, 110] },
    corridor4: { corridor3: [103, 65, 123], library: [644, 65, 124], rooftop: [956, 65, 124] },
    playground: { corridor: [104, 167, 176] },
    hall: { corridor: [97, 215, 144] },
    chinese: { corridor1: [90, 78, 136] },
    english: { corridor1: [90, 77, 136] },
    maths: { corridor1: [100, 56, 140] },
    chemistry: { corridor2: [106, 94, 142] },
    geography: { corridor2: [106, 79, 142] },
    computer: { corridor2: [85, 78, 137] },
    history: { corridor3: [111, 64, 139] },
    art: { corridor3: [109, 66, 139] },
    music: { corridor3: [100, 65, 140] },
    library: { corridor4: [81, 60, 132] },
    rooftop: { corridor4: [91, 117, 122] },
  });
  // Approved reference mounts plaques in the upper transom above the door leaf.
  // The roof door has no glazed transom, so its plaque mounts on its upper panel.
  const PLAQUE_OFFSETS = Object.freeze({
    corridor:26, corridor1:26, corridor2:18, corridor3:26, corridor4:18,
    playground:12, hall:2, chinese:26, english:30, maths:20, chemistry:14,
    geography:15, computer:27, history:21, art:20, music:15, library:23, rooftop:11,
  });
  for (const [locationId, entrances] of Object.entries(ENTRANCE_ART)) {
    for (const door of LOCATIONS[locationId].doors) {
      const [x, top, width] = entrances[door.id];
      door.x = Math.round(x * 1500 / 1536);
      door.artTop = Math.round(top * 500 / 512);
      door.plaqueTop = Math.round((top + PLAQUE_OFFSETS[locationId]) * 500 / 512);
      door.artWidth = Math.round(width * 1500 / 1536);
      door.plaqueWidth = Math.min(door.artWidth, 148);
      // Keep the physical plaque entirely within the world, not pinned to a viewport.
      door.x = Math.max(door.plaqueWidth / 2 + 6, Math.min(1500 - door.plaqueWidth / 2 - 6, door.x));
    }
  }
  const registry = window.CAMPUS_CHARACTERS;
    if (!registry) return null;
    const character = npc ? registry.npc(look.identityId, avatar) : registry.player(look);
    const atlas = character && registry.atlases[character.atlasId];
    if (!atlas) return null;
    const identity = atlas.identities[npc ? 0 : character.hair] || atlas.identities[0];
    if (!identity) return null;
    const cycle = ((phase % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
    let frameIndex = identity.idle;
    if (npc && look.talking && Number.isInteger(identity.talk)) frameIndex = identity.talk;
    else if (walking && identity.walk.length) frameIndex = identity.walk[Math.floor(cycle / (Math.PI * 2) * identity.walk.length)];
    return { atlas, identity, character, frame: atlas.frames[frameIndex] };
  }
  const RASTER_CACHE = new Map();
  function requestRaster(src, onReady) {
    if (typeof Image === "undefined") return null;
    let entry = RASTER_CACHE.get(src);
    if (!entry) {
      const image = new Image();
      entry = { image, ready: false, failed: false, listeners: new Set() };
      RASTER_CACHE.set(src, entry);
      const done = (success) => {
        entry.ready = success;
        entry.failed = !success;
        const listeners = [...entry.listeners];
        entry.listeners.clear();
        for (const listener of listeners) listener();
      };
      image.onload = () => done(true);
      image.onerror = () => done(false);
      image.src = src;
    }
    if (onReady && !entry.ready && !entry.failed) entry.listeners.add(onReady);
    return entry.ready ? entry.image : null;
  }
  const SKIN_RASTER_CACHE = new Map();
  const SKIN_TARGETS = [[252, 199, 164], [210, 151, 109], [146, 93, 66]];
  function isSkinPixel(r, g, b, alpha) {
    // White/blue fabric, red belts, dark outlines and dark hair are excluded.
    return alpha >= 64 && r >= 155 && r - g >= 9 && r - g <= 105 && g - b >= 8 && g - b <= 90 && b / r < 0.92;
  }
  function skinRaster(image, atlas, tone) {
    const skin = Math.max(0, Math.min(2, Number(tone) || 0));
    if (!skin || !atlas.skinMask) return image;
    const key = atlas.src + ':' + skin;
    if (SKIN_RASTER_CACHE.has(key)) return SKIN_RASTER_CACHE.get(key);
    const canvas = document.createElement('canvas');
    canvas.width = image.naturalWidth; canvas.height = image.naturalHeight;
    const c = canvas.getContext('2d', {willReadFrequently:true});
    if (!c) return image;
    try {
      c.drawImage(image, 0, 0);
      const pixels = c.getImageData(0, 0, canvas.width, canvas.height), values = pixels.data;
      const source = atlas.skinMask.source, target = SKIN_TARGETS[skin];
      const sourceLight = source[0] * .2126 + source[1] * .7152 + source[2] * .0722;
      // Regions do not overlap across frames; a visited mask also guards neck/arm edges.
      const visited = new Uint8Array(canvas.width * canvas.height);
      for (const regions of atlas.skinMask.regions) for (const region of regions || []) {
        const left = Math.max(0, Math.floor(region.x)), top = Math.max(0, Math.floor(region.y));
        const right = Math.min(canvas.width, Math.ceil(region.x + region.w)), bottom = Math.min(canvas.height, Math.ceil(region.y + region.h));
        for (let y = top; y < bottom; y++) for (let x = left; x < right; x++) {
          const pixel = y * canvas.width + x, offset = pixel * 4;
          if (visited[pixel]) continue;
          visited[pixel] = 1;
          const r = values[offset], g = values[offset + 1], b = values[offset + 2];
          if (!isSkinPixel(r, g, b, values[offset + 3])) continue;
          const light = r * .2126 + g * .7152 + b * .0722, delta = light - sourceLight;
          for (let channel = 0; channel < 3; channel++) {
            const detail = values[offset + channel] - source[channel] - delta;
            values[offset + channel] = Math.max(0, Math.min(255, Math.round(target[channel] + delta * .85 + detail * .3)));
          }
        }
      }
      c.putImageData(pixels, 0, 0);
      if (SKIN_RASTER_CACHE.size >= 4) SKIN_RASTER_CACHE.delete(SKIN_RASTER_CACHE.keys().next().value);
      SKIN_RASTER_CACHE.set(key, canvas);
      return canvas;
    } catch {
      // An unavailable pixel buffer or cross-origin image must not break movement.
      return image;
    }
  }
  const CHARACTER_COLORS = {
    outline: "#263b43",
    hair: ["#253138", "#3f4141", "#596059"],
    skin: [
      {
        base: "#eabd98",
        light: "#f7cfaa",
        highlight: "#ffdab4",
        shadow: "#c99070",
        cheek: "#d99f81",
        mouth: "#995c55",
      },
      {
        base: "#c48c66",
        light: "#dca27c",
        highlight: "#e6b28b",
        shadow: "#9d6d50",
        cheek: "#b9785e",
        mouth: "#814c43",
      },
      {
        base: "#986a4f",
        light: "#b78460",
        highlight: "#c6946e",
        shadow: "#73503e",
        cheek: "#9b624d",
        mouth: "#633d35",
      },
    ],
    uniform: [
      {
        base: "#ececdf",
        light: "#fff8e8",
        mid: "#59718a",
        dark: "#344d68",
        shadow: "#253d57",
      },
      {
        base: "#e6e9dc",
        light: "#fff8e8",
        mid: "#697d86",
        dark: "#405c6b",
        shadow: "#bdc9c1",
      },
      {
        base: "#92b9c3",
        light: "#bbd5d2",
        mid: "#75a0ad",
        dark: "#467984",
        shadow: "#608c9b",
      },
      {
        base: "#71a58b",
        light: "#98bd98",
        mid: "#558873",
        dark: "#355f53",
        shadow: "#467761",
      },
    ],
  };
  // Student silhouettes follow the four verified school uniform descriptions.
  // NPC wardrobes remain independent so they match the dialogue portraits.
  const SCHOOL_UNIFORMS = [
    {
      base: "#f0efe2",
      light: "#fffbed",
      mid: "#e6e8db",
      dark: "#e5e3d3",
      shadow: "#bcc7bf",
    },
    {
      base: "#eef0e6",
      light: "#fffbed",
      mid: "#8d9299",
      dark: "#606b78",
      shadow: "#bdc7c3",
    },
    {
      base: "#ececdf",
      light: "#fff8e9",
      mid: "#d6ded2",
      dark: "#e3e7db",
      shadow: "#bdcbbf",
    },
    {
      base: "#adcbd1",
      light: "#d9e5dd",
      mid: "#89b0be",
      dark: "#9dbfc9",
      shadow: "#779fad",
    },
  ];
  const NPC_COSTUMES = {
    pinafore: 0,
    shirt: 1,
    cheongsam: 2,
    sports: 3,
    teacher: 1,
    principal: 1,
    office: 1,
  };
  const CAMPUS_LOCATIONS = {
    corridor: {
      floor: 0,
      label: { zh: "地下走廊", cn: "地下走廊", en: "G · Main corridor" },
      kind: "corridor",
    },
    playground: {
      floor: 0,
      label: { zh: "操場", cn: "操场", en: "Playground" },
      kind: "room",
      subjectId: "playground",
    },
    hall: {
      floor: 0,
      label: { zh: "禮堂", cn: "礼堂", en: "Assembly hall" },
      kind: "room",
      subjectId: "hall",
    },
    corridor1: {
      floor: 1,
      label: { zh: "一樓走廊", cn: "一楼走廊", en: "1F · Languages & maths" },
      kind: "corridor",
    },
    chinese: {
      floor: 1,
      label: { zh: "中文室", cn: "中文室", en: "Chinese room" },
      kind: "room",
      subjectId: "chinese",
    },
    english: {
      floor: 1,
      label: { zh: "英文室", cn: "英文室", en: "English room" },
      kind: "room",
      subjectId: "english",
    },
    maths: {
      floor: 1,
      label: { zh: "數學室", cn: "数学室", en: "Mathematics room" },
      kind: "room",
      subjectId: "maths",
    },
    corridor2: {
      floor: 2,
      label: {
        zh: "二樓走廊",
        cn: "二楼走廊",
        en: "2F · Science & technology",
      },
      kind: "corridor",
    },
    chemistry: {
      floor: 2,
      label: { zh: "化學室", cn: "化学室", en: "Chemistry room" },
      kind: "room",
      subjectId: "chemistry",
    },
    geography: {
      floor: 2,
      label: { zh: "地理室", cn: "地理室", en: "Geography room" },
      kind: "room",
      subjectId: "geography",
    },
    computer: {
      floor: 2,
      label: { zh: "電腦室", cn: "电脑室", en: "Computer lab" },
      kind: "room",
      subjectId: "computer",
    },
    corridor3: {
      floor: 3,
      label: { zh: "三樓走廊", cn: "三楼走廊", en: "3F · Arts & humanities" },
      kind: "corridor",
    },
    history: {
      floor: 3,
      label: { zh: "歷史室", cn: "历史室", en: "History room" },
      kind: "room",
      subjectId: "history",
    },
    art: {
      floor: 3,
      label: { zh: "美術室", cn: "美术室", en: "Art studio" },
      kind: "room",
      subjectId: "art",
    },
    music: {
      floor: 3,
      label: { zh: "音樂室", cn: "音乐室", en: "Music room" },
      kind: "room",
      subjectId: "music",
    },
    corridor4: {
      floor: 4,
      label: {
        zh: "四樓走廊",
        cn: "四楼走廊",
        en: "4F · Reading & reflection",
      },
      kind: "corridor",
    },
    library: {
      floor: 4,
      label: { zh: "圖書館", cn: "图书馆", en: "Library" },
      kind: "room",
      subjectId: "library",
    },
    rooftop: {
      floor: 4,
      label: { zh: "天台花園", cn: "天台花园", en: "Rooftop garden" },
      kind: "room",
      subjectId: "rooftop",
    },
  };
  const FLOOR_IDS = [
    "corridor",
    "corridor1",
    "corridor2",
    "corridor3",
    "corridor4",
  ];
  const FLOOR_PALETTES = [
    { wall: "#e7dfc7", panel: "#b8c9b2", trim: "#376260" },
    { wall: "#eae0cc", panel: "#c8c2a3", trim: "#63755c" },
    { wall: "#e0e5d3", panel: "#adc7c1", trim: "#386c70" },
    { wall: "#ebdfcf", panel: "#c8b4ac", trim: "#755f61" },
    { wall: "#e6e4d1", panel: "#bfcba9", trim: "#61745d" },
  ];
  const MISSION_NPCS = [
    {
      id: "voice",
      name: ["阿澄", "Ching"],
      look: { costume: "pinafore", uniform: 0, hair: 0, skin: 0 },
    },
    {
      id: "privacy",
      name: ["阿朗", "Long"],
      look: { costume: "shirt", uniform: 1, hair: 0, skin: 0 },
    },
    {
      id: "culture",
      name: ["小悠", "Yau"],
      look: { costume: "shirt", uniform: 1, hair: 1, skin: 1, bag: true },
    },
    {
      id: "access",
      name: ["阿晴", "Chun"],
      look: { costume: "sports", uniform: 3, hair: 0, skin: 0 },
    },
    {
      id: "finale",
      name: ["校園導師", "Campus mentor"],
      look: { costume: "shirt", uniform: 1, hair: 0, skin: 1 },
    },
  ];
  const LOCATIONS = {};
  for (const [id, meta] of Object.entries(CAMPUS_LOCATIONS)) {
    if (meta.kind === "corridor") {
      const rooms = Object.entries(CAMPUS_LOCATIONS).filter(
        ([, r]) => r.floor === meta.floor && r.kind === "room",
      );
      const doors = rooms.map(([roomId, room], i) => ({
        id: roomId,
        x: 1040 + i * 365,
        label: room.label,
      }));
      if (meta.floor > 0)
        doors.unshift({
          id: FLOOR_IDS[meta.floor - 1],
          x: 235,
          stairs: "down",
          label: {
            zh: "下樓 " + (meta.floor === 1 ? "G" : meta.floor - 1 + "F"),
            cn: "下楼 " + (meta.floor === 1 ? "G" : meta.floor - 1 + "F"),
            en: "DOWN · " + (meta.floor === 1 ? "G" : meta.floor - 1 + "F"),
          },
        });
      if (meta.floor < 4)
        doors.push({
          id: FLOOR_IDS[meta.floor + 1],
          x: 2120,
          stairs: "up",
          label: {
            zh: "上樓 " + (meta.floor + 1) + "F",
            cn: "上楼 " + (meta.floor + 1) + "F",
            en: "UP · " + (meta.floor + 1) + "F",
          },
        });
      LOCATIONS[id] = {
        ...meta,
        width: 2320,
        label: meta.label,
        npc: { ...MISSION_NPCS[meta.floor], x: 690 },
        doors,
      };
    } else {
      LOCATIONS[id] = {
        ...meta,
        width: 1460,
        label: meta.label,
        npc: {
          id: "subject:" + id,
          x: 680,
          name: { zh: "學科導師", cn: "学科导师", en: "Subject guide" },
          look: {
            costume: id === "playground" ? "sports" : "shirt",
            uniform: 1,
            hair: meta.floor % 2,
            skin: meta.floor % 3,
          },
        },
        doors: [
          {
            id: FLOOR_IDS[meta.floor],
            x: 115,
            label: {
              zh: "返回 " + (meta.floor ? meta.floor + "F" : "G") + " 走廊",
              cn: "返回 " + (meta.floor ? meta.floor + "F" : "G") + " 走廊",
              en:
                "BACK · " + (meta.floor ? meta.floor + "F" : "G") + " CORRIDOR",
            },
          },
        ],
      };
    }
  }
  LOCATIONS.corridor.doors.unshift({
    id: "exit",
    x: 80,
    exit: true,
    label: { zh: "校門・星章出口", cn: "校门・星章出口", en: "SCHOOL GATE" },
  });
  LOCATIONS.corridor.extras = [
    {
      id: "staff:office",
      x: 465,
      name: { zh: "校務職員", cn: "校务职员", en: "School office" },
      look: { costume: "office", hair: 1, skin: 0, adult: true },
    },
  ];
  LOCATIONS.corridor2.extras = [
    {
      id: "staff:vice",
      x: 465,
      name: { zh: "副校長", cn: "副校长", en: "Vice principal" },
      look: {
        costume: "principal",
        hair: 0,
        skin: 1,
        adult: true,
        glasses: true,
      },
    },
  ];
  LOCATIONS.corridor4.npc.look = {
    costume: "teacher",
    hair: 0,
    skin: 1,
    adult: true,
  };
  for (const [roomId, meta] of Object.entries(CAMPUS_LOCATIONS))
    if (meta.kind === "room") {
      const guide = LOCATIONS[roomId].npc;
      guide.look = {
        ...guide.look,
        costume: roomId === "hall" ? "principal" : "teacher",
        adult: true,
        glasses: ["hall", "library", "history"].includes(roomId),
      };
      if (roomId === "hall")
        guide.name = { zh: "校長", cn: "校长", en: "Principal" };
      else if (roomId === "library")
        guide.name = { zh: "圖書館主任", cn: "图书馆主任", en: "Librarian" };
      else if (roomId === "rooftop")
        guide.name = { zh: "生態導師", cn: "生态导师", en: "Eco guide" };
    }
  // Match every panoramic environment to a 1500 × 500 logical world.
  for (const scene of Object.values(LOCATIONS)) {
    const ratio = 1500 / scene.width;
    scene.npc.x = Math.round(scene.npc.x * ratio);
    for (const door of scene.doors) door.x = Math.round(door.x * ratio);
    for (const extra of scene.extras || [])
      extra.x = Math.round(extra.x * ratio);
    scene.width = 1500;
  }
  const registry = window.CAMPUS_CHARACTERS;
  for (const [locationId, scene] of Object.entries(LOCATIONS)) {
    for (const npc of [scene.npc, ...(scene.extras || [])]) {
      const identity = registry?.resolve(npc.id);
      if (identity) {
        npc.characterId = identity.id;
        npc.name = identity.name;
        npc.look = { ...identity.look };
      }
    }
  }
  function createRuntimeScenes() {
    return Object.fromEntries(Object.entries(LOCATIONS).map(([id, scene], sceneIndex) => {
      const actor = (base, offset = 0) => ({ ...base, look: { ...base.look }, homeX: base.x,
        state: 'idle', speed: 0, phase: 0, direction: -1, targetX: base.x, restActivity: base.activity,
        nextChange: 2.4 + (sceneIndex + offset) % 4, turns: 0, depth: offset ? -8 : 0 });
      const ambient = [
        actor({ id: 'ambient-boy-' + id, x: 265, interactive: false, activity: 'walk', look: { gender: 'boy', uniform: sceneIndex % 4, hair: sceneIndex % 2, skin: 0 } }, 1),
        actor({ id: 'ambient-girl-' + id, x: 1240, interactive: false, activity: 'reading', look: { gender: 'girl', uniform: sceneIndex % 4, hair: 1, skin: 0 } }, 2),
      ];
      const teacher = registry?.byId[registry.staffIds[(sceneIndex + 6) % 16]];
      if (teacher && teacher.id !== scene.npc.characterId) ambient.push(actor({ id: 'ambient-staff-' + id, characterId: teacher.id, x: 910, interactive: false, activity: 'chat', look: { ...teacher.look } }, 3));
      return [id, { ...scene, npc: actor(scene.npc), extras: (scene.extras || []).map((item, i) => actor(item, i + 1)), ambient }];
    }));
  }
  window.CAMPUS_LOCATIONS = CAMPUS_LOCATIONS;
  class CampusEngine {
    constructor({
      canvas,
      onInteract = () => {},
      onLocationChange = () => {},
      getAvatar = () => ({ uniform: 0, hair: 0, skin: 0 }),
      getProgress = () => ({}),
      lang = "zh",
    }) {
      if (!canvas || !canvas.getContext)
        throw new Error("CampusEngine requires a canvas.");
      this.canvas = canvas;
      this.ctx = canvas.getContext("2d");
      this.onInteract = onInteract;
      this.onLocationChange = onLocationChange;
      this.getAvatar = getAvatar;
      this.getProgress = getProgress;
      this.lang = lang;
      this.location = "corridor";
      this.scenes = createRuntimeScenes();
      this.velocity = 0;
      this.depthVelocity = 0;
      this.interactionReadyAt = 0;
      this.viewWidth=DEFAULT_VIEW_WIDTH;
      this.depth=FLOOR_DEPTH.center;
      this.inputMode="keyboard";
      this.x = 180;
      this.camera = 0;
      this.direction = 1;
      this.phase = 0;
      this.walking = false;
      this.target = null;
      this.targetDepth=null;
      this.pendingInteraction = null;
      this.keys = new Set();
      this.touchDirection = 0;
      this.touchVertical = 0;
      this.paused = false;
      this.destroyed = false;
      this.lastTime = 0;
      this.frame = 0;
      this.time = 0;
      this.backgrounds = new Map();
      this.talkingId = null;
      this._onAssetReady = () => {
        if (!this.destroyed) this.render();
      };
      requestRaster(CHARACTER_ATLASES[4].src, this._onAssetReady);
      this._artChange = () => { this.render(); this.schedule(); };
      window.addEventListener('campus-art-ready', this._artChange);
      this.spriteBuffer = document.createElement("canvas");
      this.spriteBuffer.width = 48;
      this.spriteBuffer.height = 88;
      this.spriteContext = this.spriteBuffer.getContext("2d");
      this.motionQuery = window.matchMedia
        ? window.matchMedia("(prefers-reduced-motion: reduce)")
        : null;
      this.reducedMotion = Boolean(
        this.motionQuery && this.motionQuery.matches,
      );
      this._motionChange = (e) => {
        this.reducedMotion = e.matches;
        if (this.reducedMotion)
          this.camera = Math.max(
            0,
            Math.min(this.scenes[this.location].width - this.viewWidth, this.x - this.viewWidth * 0.44),
          );
        this.render();
        this.schedule();
      };
      if (this.motionQuery) {
        if (this.motionQuery.addEventListener)
          this.motionQuery.addEventListener("change", this._motionChange);
        else if (this.motionQuery.addListener)
          this.motionQuery.addListener(this._motionChange);
      }
      this.canvas.tabIndex = canvas.tabIndex >= 0 ? canvas.tabIndex : 0;
      this.canvas.style.touchAction = "none";
      this.canvas.style.imageRendering = "pixelated";
      this._keyDown = (e) => this.keyDown(e);
      this._keyUp = (e) => this.keyUp(e);
      this._blur = () => this.clearInput();
      this._pointer = (e) => this.pointer(e);
      canvas.addEventListener("keydown", this._keyDown);
      canvas.addEventListener("keyup", this._keyUp);
      canvas.addEventListener("blur", this._blur);
      canvas.addEventListener("pointerdown", this._pointer);
      this._visibility = () => {
        if (document.hidden) this.clearInput();
      };
      document.addEventListener("visibilitychange", this._visibility);
      this._resize = () => this.resize();
      window.addEventListener("resize", this._resize);
      this.resizeObserver=typeof ResizeObserver==='function'?new ResizeObserver(this._resize):null;
      if(this.resizeObserver)this.resizeObserver.observe(this.canvas);
      this.resize();
      this.schedule();
    }
    static drawAvatar(canvas, avatar = {}, options = {}) {
      if (!canvas || !canvas.getContext) return;
      const ctx = canvas.getContext("2d"),
        w = canvas.width,
        h = canvas.height;
      const token = (canvas._campusAvatarToken || 0) + 1;
      canvas._campusAvatarToken = token;
      const atlas =
        CHARACTER_ATLASES[
          playerAtlasIndex(avatar)
        ];
      const loaded = () => {
        if (canvas._campusAvatarToken === token)
          CampusEngine.drawAvatar(canvas, avatar, options);
      };
      const selected = registeredFrame(avatar, Boolean(options.walking), Number(options.phase) || 0, false);
      const lifeImage = selected && requestRaster(selected.atlas.src, loaded);
      if (lifeImage) {
        const frame = selected.frame;
        const poseIndices = [selected.identity.idle, ...selected.identity.walk];
        const maxWidth = Math.max(...poseIndices.map(index => selected.atlas.frames[index].w));
        const scale = Math.min((h - 16) / selected.identity.standingHeight, (w - 18) / maxWidth);
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, w, h);
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(skinRaster(lifeImage, selected.atlas, avatar.skin), frame.x, frame.y, frame.w, frame.h,
          Math.round(w / 2 + (frame.x - frame.anchorX) * scale),
          Math.round(h - 8 - (frame.baseline - frame.y) * scale),
          Math.round(frame.w * scale), Math.round(frame.h * scale));
        return;
      }
      const img = requestRaster(atlas.src, loaded);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.imageSmoothingEnabled = false;
      if (img) {
        const col =
            (Number(avatar.hair) > 0 ? 3 : 0) +
            Math.max(0, Math.min(2, Number(avatar.skin) || 0)),
          frame = atlas.frames[col];
        const scale = Math.min((h - 12) / frame.h, (w - 14) / frame.w);
        ctx.drawImage(
          img,
          frame.x,
          frame.y,
          frame.w,
          frame.h,
          Math.round(w / 2 - (frame.w * scale) / 2),
          Math.round((h - frame.h * scale) / 2),
          Math.round(frame.w * scale),
          Math.round(frame.h * scale),
        );
      } else {
        const scale = Math.max(1, Math.floor(Math.min(w / 55, h / 85)));
        ctx.save();
        ctx.translate(
          Math.round(w / 2),
          Math.round((h + 72 * scale) / 2) - 5 * scale,
        );
        ctx.scale(scale, scale);
        CampusEngine.prototype.sprite.call(
          CampusEngine.prototype,
          ctx,
          0,
          0,
          avatar,
          false,
          0,
          1,
          false,
        );
        ctx.restore();
      }
    }
    static drawPlayerPreview(canvas, avatar = {}, options = {}) {
      CampusEngine.drawAvatar(canvas, avatar, options);
    }
    setAvatar() {
      this.render();
    }
    isEnglish() {
      return String(this.lang).toLowerCase().startsWith("en");
    }
    word(pair) {
      return Array.isArray(pair)
        ? pair[this.isEnglish() ? 1 : 0]
        : pair[this.lang] || pair.zh || pair.en;
    }
    setLanguage(lang) {
      this.lang = lang;
      this.backgrounds.clear();
      this.render();
    }
    setLocation(location) {
      if (location === "courtyard") location = "playground";
      if (!this.scenes[location] || this.destroyed) return;
      const previous = this.location;
      this.location = location;
      this.clearInput();
      this.depth=FLOOR_DEPTH.center;
      const entry = this.scenes[location].doors.find((d) => d.id === previous);
      this.x = entry
        ? Math.max(
            45,
            Math.min(
              this.scenes[location].width - 45,
              entry.x + (entry.x < 400 ? 105 : -105),
            ),
          )
        : 180;
      this.camera = Math.max(
        0,
        Math.min(this.scenes[location].width - this.viewWidth, this.x - this.viewWidth * 0.44),
      );
      this.phase = 0;
      this.onLocationChange(location);
      this.render();
    }
    setPaused(paused) {
      this.paused = Boolean(paused);
      this.clearInput();
      this.lastTime = 0;
      if (this.paused) {
        cancelAnimationFrame(this.frame);
        this.frame = 0;
        this.render();
      } else this.schedule();
    }
    getState() {
      return { location: this.location, x: Math.round(this.x) };
    }
    move(direction, vertical = 0) {
      if (this.paused || this.destroyed) return;
      const named = { left: [-1, 0], right: [1, 0], up: [0, -1], down: [0, 1] }[direction];
      const x = named ? named[0] : typeof direction === 'object' ? direction?.x : direction;
      const y = named ? named[1] : typeof direction === 'object' ? direction?.y : vertical;
      this.touchDirection = Math.sign(Number(x) || 0);
      this.touchVertical = Math.sign(Number(y) || 0);
      this.target = null;
      this.targetDepth=null;
      this.pendingInteraction = null;
      this.schedule();
    }
    clearInput() {
      this.keys.clear();
      this.touchDirection = 0;
      this.touchVertical = 0;
      this.target = null;
      this.targetDepth=null;
      this.pendingInteraction = null;
      this.walking = false;
      this.velocity = 0;
      this.depthVelocity = 0;
    }
    keyDown(e){
      if(this.paused||this.destroyed||document.activeElement!==this.canvas||e.altKey||e.ctrlKey||e.metaKey)return;
      const key=e.key.toLowerCase(),movement=['arrowleft','arrowright','arrowup','arrowdown','a','d','w','s'];
      if(movement.includes(key)||['e',' ','enter'].includes(key))e.preventDefault();
      this.inputMode='keyboard';
      if(movement.includes(key)){this.keys.add(key);this.target=null;this.targetDepth=null;this.pendingInteraction=null;this.schedule();}
      if(['e',' ','enter'].includes(key)&&!e.repeat)this.interact();
    }
    keyUp(e) {
      this.keys.delete(e.key.toLowerCase());
    }
    pointer(e) {
      if (this.paused || this.destroyed || e.button > 0) return;
      this.canvas.focus({ preventScroll: true });
      this.inputMode="pointer";
      const box = this.canvas.getBoundingClientRect();
      if(box.width<=0||box.height<=0)return;
      const style = window.getComputedStyle
        ? window.getComputedStyle(this.canvas)
        : null;
      const fit = style ? style.objectFit : "fill";
      let localX = e.clientX - box.left,
        localY = e.clientY - box.top,
        drawWidth = box.width,
        drawHeight = box.height;
      if (fit === "cover" || fit === "contain") {
        const scale = (fit === "cover" ? Math.max : Math.min)(
          box.width / this.viewWidth,
          box.height / H,
        );
        drawWidth = this.viewWidth * scale;
        drawHeight = H * scale;
        const position = (style.objectPosition || "50% 50%").split(/\s+/);
        const offset = (value, free) =>
          value === "left" || value === "top"
            ? 0
            : value === "right" || value === "bottom"
              ? free
              : value === "center"
                ? free * 0.5
                : value.endsWith("%")
                  ? free * (parseFloat(value) / 100)
                  : parseFloat(value) || 0;
        localX -= offset(position[0], box.width - drawWidth);
        localY -= offset(position[1] || "50%", box.height - drawHeight);
        if (
          localX < 0 ||
          localY < 0 ||
          localX > drawWidth ||
          localY > drawHeight
        )
          return;
      }
      const px = (localX * this.viewWidth) / drawWidth + this.camera,
        py = (localY * H) / drawHeight;
      const scene = this.scenes[this.location],
        ground = this.groundY();
      // Only a deliberate body hit creates talk intent. Floor/nameplate taps move.
      const selectedNpc = this.npcs().find(
        (n) => Math.abs(px - n.x) < this.characterHeight(n.look) * 0.21 && py > ground - this.characterHeight(n.look) - 6 && py < ground - 8,
      );
      if (selectedNpc) {
        this.walkTo(selectedNpc.x, selectedNpc.id);
        return;
      }
      const door = scene.doors.find(
        (d) => Math.abs(px - d.x) < (d.artWidth || 116) / 2 && py > (d.artTop || ground - 255) - 36 && py < ground - 12,
      );
      if (door) {
        this.walkTo(door.x, "door:" + door.id);
        return;
      }
      if (py > ground - 100) {
        this.target = Math.max(40, Math.min(scene.width - 40, px));
        this.targetDepth=this.clampDepth(py-ground);
        this.keys.clear();this.touchDirection=0;this.touchVertical=0;
        this.pendingInteraction = null;
        this.schedule();
      }
    }
    npcs() {
      const scene = this.scenes[this.location];
      return [scene.npc, ...(scene.extras || [])];
    }
    walkTo(x, interaction) {
      this.target = x;
      this.targetDepth = this.clampDepth(FLOOR_DEPTH.center);
      this.pendingInteraction = interaction;
      this.keys.clear();
      this.touchDirection = 0;
      this.touchVertical = 0;
      const npc = this.npcs().find(item => item.id === interaction);
      if (npc) { npc.state = 'stop'; npc.speed = 0; npc.nextChange = this.time + MOTION.npcRest; }
      if (Math.abs(this.x - x) < MOTION.interactionRange && Math.abs(this.depth - this.targetDepth) < 2) this.finishInteraction();
      else this.schedule();
    }
    finishInteraction() {
      const id = this.pendingInteraction;
      this.clearInput();
      if (!id || this.time < this.interactionReadyAt) return;
      this.interactionReadyAt = this.time + MOTION.interactionCooldown;
      if (id === 'door:exit') this.onInteract('exit');
      else if (id.startsWith('door:')) this.setLocation(id.slice(5));
      else this.onInteract(id);
    }
    interact() {
      if (this.paused || this.destroyed || this.time < this.interactionReadyAt) return;
      const scene = this.scenes[this.location];
      const targets = this.npcs().map(npc => ({ id: npc.id, x: npc.x }));
      targets.push(...scene.doors.map(door => ({ id: 'door:' + door.id, x: door.x })));
      const nearest = targets.filter(target => Math.abs(this.x - target.x) < MOTION.interactionRange)
        .sort((a, b) => Math.abs(this.x - a.x) - Math.abs(this.x - b.x))[0];
      if (nearest) { this.pendingInteraction = nearest.id; this.finishInteraction(); }
    }
    actorCanWalk(actor) {
      const npc = Boolean(actor.look.identityId);
      const selected = registeredFrame(actor.look, true, actor.phase, npc, this.getAvatar() || {});
      // A still image must never glide around the room pretending to walk.
      return Boolean(selected && selected.identity.walk.length >= 2 && requestRaster(selected.atlas.src, this._onAssetReady));
    }
    updateActors(dt) {
      if (this.reducedMotion || dt <= 0) return;
      const scene = this.scenes[this.location];
      for (const actor of [...this.npcs(), ...scene.ambient]) {
        const conversing = this.talkingId && (actor.id === this.talkingId || actor.characterId === window.CAMPUS_CHARACTERS?.resolve(this.talkingId)?.id);
        if (conversing) { actor.state = 'converse'; actor.speed = 0; actor.direction = this.x < actor.x ? -1 : 1; continue; }
        if (actor.state === 'converse') { actor.state = 'stop'; actor.nextChange = this.time + MOTION.npcRest; }
        if (actor.id === this.pendingInteraction) { actor.state = 'stop'; actor.speed = 0; actor.direction = this.x < actor.x ? -1 : 1; continue; }
        const mobile = this.actorCanWalk(actor);
        if (!mobile) { actor.state = 'idle'; actor.speed = 0; continue; }
        if ((actor.state === 'idle' || actor.state === 'stop') && this.time >= actor.nextChange) {
          actor.turns += 1;
          const range = MOTION.npcRange + (actor.interactive === false ? 40 : 0);
          actor.targetX = Math.max(180, Math.min(scene.width - 190, actor.homeX + (actor.turns % 2 ? 1 : -1) * range));
          actor.state = 'walk'; actor.phase = 0;
          if (actor.interactive === false) actor.activity = 'walk';
        }
        if (actor.state === 'walk') {
          const delta = actor.targetX - actor.x;
          const limit = MOTION.npcSpeed;
          const desired = Math.sign(delta) * Math.min(limit, Math.sqrt(2 * MOTION.npcDeceleration * Math.abs(delta)));
          const acceleration = Math.abs(desired) < Math.abs(actor.speed) ? MOTION.npcDeceleration : MOTION.npcAcceleration;
          actor.speed = approach(actor.speed, desired, acceleration * dt);
          let move = actor.speed * dt;
          if (Math.abs(move) > Math.abs(delta)) move = delta;
          actor.x += move;
          if (Math.abs(move) > 0.001) { actor.direction = Math.sign(move); actor.phase += Math.abs(move) * Math.PI * 2 / this.strideDistance(actor.look); }
          if (Math.abs(actor.targetX - actor.x) < 0.5) {
            actor.x = actor.targetX; actor.speed = 0; actor.state = 'stop';
            if (actor.interactive === false) actor.activity = actor.restActivity;
            actor.nextChange = this.time + MOTION.npcRest + actor.turns % 3;
          }
        } else {
          actor.speed = 0;
          if (actor.state === 'stop' && this.time + 0.4 < actor.nextChange) actor.state = 'idle';
        }
      }
    }
    resize(){
      if(this.destroyed)return;
      const box=this.canvas.getBoundingClientRect();
      // World units stay 500 high; the backing bitmap follows the displayed size.
      // A tall phone/desktop viewport must not magnify a fixed 500px raster.
      const density=Math.min(window.devicePixelRatio||1,2);
      const dpr=density*Math.max(1,(box.height||H)/H);
      if(box.width>0&&box.height>0)this.viewWidth=Math.max(200,Math.min(1500,Math.round(box.width/box.height*H)));
      const width=Math.round(this.viewWidth*dpr),height=Math.round(H*dpr);
      if(this.canvas.width!==width)this.canvas.width=width;if(this.canvas.height!==height)this.canvas.height=height;
      this.dpr=dpr;this.ctx.imageSmoothingEnabled=false;
      this.camera=Math.max(0,Math.min(this.scenes[this.location].width-this.viewWidth,this.x-this.viewWidth*.44));
      this.depth=this.clampDepth(this.depth);this.render();
    }
    schedule(){if(!this.frame&&!this.destroyed&&!this.paused)this.frame=requestAnimationFrame(t=>this.tick(t));}
    tick(t) {
      this.frame = 0;
      if (this.destroyed || this.paused) return;
      const dt = this.lastTime ? Math.min(Math.max(0, (t - this.lastTime) / 1000), 0.04) : 0;
      this.lastTime = t;
      this.time += dt;
      this.updateActors(dt);
      let horizontal = Math.sign(this.touchDirection + (this.keys.has('arrowright') || this.keys.has('d') ? 1 : 0) - (this.keys.has('arrowleft') || this.keys.has('a') ? 1 : 0));
      let vertical = Math.sign(this.touchVertical + (this.keys.has('arrowdown') || this.keys.has('s') ? 1 : 0) - (this.keys.has('arrowup') || this.keys.has('w') ? 1 : 0));
      const stopDistance = this.pendingInteraction ? MOTION.interactionRange - 5 : 0;
      if (this.pendingInteraction) {
        const npc = this.npcs().find(item => item.id === this.pendingInteraction);
        if (npc) this.target = npc.x;
      }
      let remainingX = Infinity, remainingDepth = Infinity;
      if (this.target !== null) {
        const delta = this.target - this.x;
        remainingX = Math.max(0, Math.abs(delta) - stopDistance);
        horizontal = remainingX > 0.6 ? Math.sign(delta) : 0;
      }
      if (this.targetDepth !== null) {
        const delta = this.targetDepth - this.depth;
        remainingDepth = Math.abs(delta);
        vertical = remainingDepth > 0.6 ? Math.sign(delta) : 0;
      }
      const diagonal = horizontal && vertical ? Math.SQRT1_2 : 1;
      const maxX = Math.min(WALK_SPEED * diagonal, Math.sqrt(2 * MOTION.playerDeceleration * remainingX));
      const maxDepth = Math.min(FLOOR_DEPTH.speed * diagonal, Math.sqrt(2 * MOTION.depthAcceleration * remainingDepth));
      const desiredX = horizontal * maxX, desiredDepth = vertical * maxDepth;
      this.velocity = approach(this.velocity, desiredX, (horizontal ? MOTION.playerAcceleration : MOTION.playerDeceleration) * dt);
      this.depthVelocity = approach(this.depthVelocity, desiredDepth, MOTION.depthAcceleration * dt);
      let dx = this.velocity * dt, dz = this.depthVelocity * dt;
      if (this.target !== null && Math.abs(dx) > remainingX) dx = Math.sign(dx) * remainingX;
      if (this.targetDepth !== null && Math.abs(dz) > remainingDepth) dz = Math.sign(dz) * remainingDepth;
      const oldX = this.x, oldDepth = this.depth;
      this.x = Math.max(40, Math.min(this.scenes[this.location].width - 40, this.x + dx));
      this.depth = this.clampDepth(this.depth + dz);
      const distance = Math.hypot(this.x - oldX, this.depth - oldDepth);
      this.walking = distance > 0.01;
      if (this.walking) {
        if (Math.abs(this.x - oldX) > 0.01) this.direction = Math.sign(this.x - oldX);
        this.phase += distance * Math.PI * 2 / this.strideDistance(this.getAvatar() || {});
      }
      if (!horizontal && Math.abs(this.velocity) < 1 && this.target !== null && !this.pendingInteraction) this.target = null;
      if (!vertical && Math.abs(this.depthVelocity) < 1 && this.targetDepth !== null && !this.pendingInteraction) this.targetDepth = null;
      if (this.pendingInteraction && !horizontal && !vertical && Math.abs(this.velocity) < 1 && Math.abs(this.depthVelocity) < 1) this.finishInteraction();
      if (this.paused) { this.render(); return; }
      const destination = Math.max(0, Math.min(this.scenes[this.location].width - this.viewWidth, this.x - this.viewWidth * 0.44));
      if (this.reducedMotion) this.camera = destination;
      else this.camera += (destination - this.camera) * (1 - Math.exp(-8 * dt));
      if (Math.abs(destination - this.camera) < 0.1) this.camera = destination;
      this.render();
      if (!this.reducedMotion || this.walking || this.keys.size || this.touchDirection || this.touchVertical || this.target !== null || this.targetDepth !== null) this.schedule();
      else this.lastTime = 0;
    }
    clampDepth(value){return Math.max(FLOOR_DEPTH.back,Math.min(FLOOR_DEPTH.front,H-14-this.groundY(),Number(value)||0));}
    destroy() {
      this.destroyed = true;
      for (const entry of RASTER_CACHE.values())
        entry.listeners.delete(this._onAssetReady);
      cancelAnimationFrame(this.frame);
      this.clearInput();
      this.canvas.removeEventListener("keydown", this._keyDown);
      this.canvas.removeEventListener("keyup", this._keyUp);
      this.canvas.removeEventListener("blur", this._blur);
      this.canvas.removeEventListener("pointerdown", this._pointer);
      window.removeEventListener("resize", this._resize);
      window.removeEventListener('campus-art-ready', this._artChange);
      if(this.resizeObserver)this.resizeObserver.disconnect();
      document.removeEventListener("visibilitychange", this._visibility);
      if (this.motionQuery) {
        if (this.motionQuery.removeEventListener)
          this.motionQuery.removeEventListener("change", this._motionChange);
        else if (this.motionQuery.removeListener)
          this.motionQuery.removeListener(this._motionChange);
      }
      this.backgrounds.clear();
    }
    rect(c, x, y, w, h, color) {
      c.fillStyle = color;
      c.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
    }
    frostPanel(c, x, y, width, height, active = false, radius = 10) {
      c.save();
      c.beginPath();
      if (c.roundRect) c.roundRect(x, y, width, height, radius);
      else {
        c.moveTo(x + radius, y); c.lineTo(x + width - radius, y);
        c.quadraticCurveTo(x + width, y, x + width, y + radius);
        c.lineTo(x + width, y + height - radius);
        c.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        c.lineTo(x + radius, y + height);
        c.quadraticCurveTo(x, y + height, x, y + height - radius);
        c.lineTo(x, y + radius); c.quadraticCurveTo(x, y, x + radius, y);
      }
      c.shadowColor = "rgba(32,52,65,.12)";
      c.shadowBlur = 8;
      c.shadowOffsetY = 2;
      c.fillStyle = active ? "rgba(248,253,255,.94)" : "rgba(246,250,253,.83)";
      c.fill();
      c.shadowBlur = 0; c.shadowOffsetY = 0;
      c.strokeStyle = active ? "rgba(114,156,181,.8)" : "rgba(255,255,255,.85)";
      c.lineWidth = 1;
      c.stroke();
      c.restore();
    }
    text(c, str, x, y, size = 12, color = COLORS.ink, align = "center") {
      c.fillStyle = color;
      c.font = `600 ${size}px "Noto Sans TC", system-ui, sans-serif`;
      c.textAlign = align;
      c.textBaseline = "middle";
      if (this.lang === "cn") {
        const simplified = {
          圖: "图",
          書: "书",
          館: "馆",
          電: "电",
          腦: "脑",
          園: "园",
          學: "学",
          聲: "声",
          讀: "读",
          對: "对",
          話: "话",
          進: "进",
          長: "长",
          輕: "轻",
          觸: "触",
        };
        str = String(str).replace(
          /[圖書館電腦園學聲讀對話進長輕觸]/g,
          (ch) => simplified[ch] || ch,
        );
      }
      c.fillText(str, x, y);
    }
    sign(c, label, x, y, w = 125) {
      this.rect(c, x - w / 2 + 3, y + 3, w, 29, "#c4b99c");
      this.rect(c, x - w / 2, y, w, 27, COLORS.deep);
      this.rect(c, x - w / 2 + 3, y + 3, w - 6, 2, "#66958b");
      this.text(c, label, x, y + 14, 10, "#fff2d1");
    }
    plant(c, x, y, scale = 1) {
      c.save();
      c.translate(Math.round(x), Math.round(y));
      c.scale(scale, scale);
      this.rect(c, -22, -4, 44, 6, "rgba(44,73,50,.15)");
      this.rect(c, -17, -25, 34, 22, "#915e49");
      this.rect(c, -14, -24, 27, 22, "#b77955");
      this.rect(c, -12, -22, 5, 17, "#d49b71");
      this.rect(c, 10, -23, 4, 19, "#9c654b");
      this.rect(c, -19, -28, 38, 6, "#d08a62");
      this.rect(c, -17, -28, 33, 2, "#e4aa77");
      this.rect(c, -15, -29, 30, 3, "#574e37");
      for (const [sx, sy, dx] of [
        [-2, -85, 0],
        [-10, -69, -15],
        [9, -76, 14],
        [-6, -52, -20],
        [8, -55, 21],
      ]) {
        this.rect(c, sx, sy, 3, -sy - 29, "#526f4c");
        this.rect(c, sx + dx - 7, sy + 1, 17, 8, "#426c50");
        this.rect(c, sx + dx - 4, sy - 5, 13, 13, "#59815b");
        this.rect(c, sx + dx - 2, sy - 7, 9, 6, "#729b6a");
        this.rect(c, sx + dx, sy - 4, 4, 5, "#a0b680");
        this.rect(c, sx + dx + 6, sy + 2, 4, 5, "#355d46");
      }
      for (let j = 0; j < 7; j++) {
        const lx = -20 + ((j * 17) % 43),
          ly = -45 - ((j * 11) % 35);
        this.rect(c, lx, ly, 8, 5, j % 2 ? "#618a5d" : "#87a772");
        this.rect(c, lx + 2, ly - 3, 5, 5, j % 2 ? "#799d68" : "#9ab47c");
      }
      c.restore();
    }
    architecturalDetail(c, width) {
      // Baked into the background: deterministic joints and cornice detail, never random noise.
      this.rect(c, 0, 57, width, 3, "#fff3d8");
      this.rect(c, 0, 64, width, 3, "#c9c6aa");
      for (let x = 0; x < width; x += 48) {
        this.rect(c, x, 14, 28, 3, "#456c65");
        this.rect(c, x + 30, 17, 2, 16, "#2d5352");
        this.rect(c, x + 7, 27, 17, 2, "#557b6e");
      }
      for (let x = 12; x < width; x += 72) {
        this.rect(c, x, 281, 51, 2, "#dad2b8");
        this.rect(c, x + 49, 273, 2, 10, "#d2cbb2");
        this.rect(c, x + 12, 309, 30, 2, "#a8bea5");
        this.rect(c, x + 27, 334, 20, 1, "#c5d1b8");
      }
      this.rect(c, 0, 296, width, 2, "#e1dfc4");
      this.rect(c, 0, 367, width, 3, "#456d63");
    }
    ivy(c, x, y, length = 60) {
      for (let i = 0; i < length; i += 9) {
        const sway = ((Math.floor(i / 9) % 3) - 1) * 4;
        this.rect(c, x + sway, y + i, 2, 12, "#53775a");
        this.rect(c, x + sway - 6, y + i + 4, 7, 5, "#76956a");
        this.rect(c, x + sway + 2, y + i + 8, 6, 5, "#91aa77");
        this.rect(c, x + sway - 4, y + i + 4, 3, 2, "#adba88");
      }
    }
    window(c, x, y, w = 176, h = 142) {
      this.rect(c, x - 8, y - 5, w + 16, h + 13, "#c0b99e");
      this.rect(c, x - 10, y + 5, 5, h - 5, "#f4ebce");
      this.rect(c, x + w + 5, y + 5, 5, h - 5, "#b2af95");
      this.rect(c, x - 4, y - 11, w + 8, 8, "#f3e8ca");
      this.rect(c, x + 5, y - 16, w - 10, 5, "#ded5b8");
      this.rect(c, x + 18, y - 20, w - 36, 4, "#ede4c6");
      for (let ax = 13; ax < w; ax += 27)
        this.rect(c, x + ax, y - 11, 2, 6, "#c6bfa3");
      this.rect(c, x + 5, y + 6, w, h, "#cdc3a8");
      this.rect(c, x, y, w, h, COLORS.deep);
      this.rect(c, x + 7, y + 7, w - 14, h - 14, "#b5d3d5");
      this.rect(c, x + 7, y + h * 0.56, w - 14, h * 0.38, "#91b6a8");
      const buildings = [
        [10, 53, 28, 36],
        [41, 37, 35, 52],
        [85, 49, 40, 40],
        [132, 30, 29, 59],
      ];
      for (const [bx, by, bw, bh] of buildings) {
        if (bx + bw < w - 10) {
          this.rect(c, x + bx, y + h - by - bh, bw, bh, "#89afaa");
          for (let q = 0; q < 3; q++)
            this.rect(
              c,
              x + bx + 5 + q * 9,
              y + h - by - bh + 7,
              4,
              5,
              "#c4d9cc",
            );
        }
      }
      for (let bx = 8; bx < w - 18; bx += 23) {
        const by = y + h - 36 - (bx % 19);
        this.rect(c, x + bx, by, 17, 27, "#7eaa93");
        this.rect(c, x + bx - 3, by + 5, 23, 13, "#85b096");
        this.rect(c, x + bx + 2, by - 3, 11, 7, "#a1c09d");
        this.rect(c, x + bx + 3, by + 4, 4, 3, "#b4ccaa");
      }
      this.rect(c, x + 7, y + 7, w - 14, 12, "#d4e6dd");
      this.rect(c, x + w / 2 - 3, y + 5, 6, h - 10, COLORS.deep);
      this.rect(c, x + 6, y + 65, w - 12, 5, COLORS.deep);
      this.rect(c, x + 7, y + 68, w - 14, 2, "#739689");
      this.rect(c, x + w / 2 + 2, y + 7, 2, h - 14, "#d4ded0");
      this.rect(c, x + 8, y + 7, 2, h - 14, "#dce9d5");
      this.rect(c, x + w / 2 - 8, y + 76, 4, 11, "#ccb889");
      this.rect(c, x + w / 2 + 6, y + 76, 4, 11, "#ccb889");
      this.rect(c, x - 4, y + h, w + 8, 10, "#f9f2dc");
      this.rect(c, x - 4, y + h + 10, w + 8, 5, "#b5ae94");
      c.fillStyle = "rgba(255,249,210,.24)";
      c.beginPath();
      c.moveTo(x + 18, y + 8);
      c.lineTo(x + 61, y + 8);
      c.lineTo(x + 31, y + 60);
      c.lineTo(x + 8, y + 60);
      c.closePath();
      c.fill();
    }
    door(c, d) {
      if (d.stairs) {
        this.stairDoor(c, d);
        return;
      }
      const x = d.x - 43;
      this.rect(c, x - 10, 160, 106, 221, "#beb49c");
      this.rect(c, x - 6, 161, 98, 215, COLORS.deep);
      this.rect(c, x, 168, 86, 210, "#43706a");
      this.rect(c, x + 6, 176, 74, 110, "#98b6ae");
      this.rect(c, x + 12, 182, 62, 98, "#bcd4c8");
      for (let i = 0; i < 4; i++)
        this.rect(c, x + 16, 188 + i * 22, 53, 2, "#a0beb3");
      this.rect(c, x + 7, 299, 72, 63, "#315a56");
      this.rect(c, x + 11, 304, 64, 3, "#73978a");
      this.rect(c, x + 70, 303, 4, 18, COLORS.gold);
      this.rect(c, x - 9, 377, 106, 7, "#766f60");
      this.rect(c, x - 13, 156, 112, 5, "#e4d9b9");
      this.rect(c, x - 10, 165, 3, 208, "#f1e6c7");
      this.rect(c, x + 89, 168, 4, 205, "#779181");
      this.rect(c, x + 10, 303, 2, 53, "#527c6d");
      this.rect(c, x + 14, 355, 61, 3, "#213f40");
      this.rect(c, x + 73, 306, 2, 11, "#ffdaa1");
      this.mountedPlaque(c, this.entranceLabel(d), d.x, 120, 140);
      this.rect(c, d.x - 7, 352, 14, 3, "#c4d9c6");
      this.rect(c, d.x - 2, 347, 4, 13, "#c4d9c6");
    }
    notice(c, x, y, w = 170) {
      this.rect(c, x + 5, y + 6, w, 122, "#b7aa8d");
      this.rect(c, x, y, w, 122, "#96775a");
      this.rect(c, x + 6, y + 6, w - 12, 110, "#b6aa81");
      const papers = [
        { x: 12, y: 15, w: 54, h: 67, c: "#f8edd2", accent: "#db7861" },
        { x: 77, y: 16, w: 75, h: 33, c: "#bdd1b7", accent: "#3c7267" },
        { x: 79, y: 58, w: 36, h: 50, c: "#f1c75b", accent: "#877043" },
        { x: 122, y: 58, w: 32, h: 47, c: "#eadfd1", accent: "#7c92a2" },
      ];
      for (const p of papers) {
        this.rect(c, x + p.x + 2, y + p.y + 3, p.w, p.h, "#8b896c");
        this.rect(c, x + p.x, y + p.y, p.w, p.h, p.c);
        this.rect(c, x + p.x + 4, y + p.y + 6, p.w - 8, 4, p.accent);
        for (let l = 0; l < 3; l++)
          this.rect(
            c,
            x + p.x + 5,
            y + p.y + 18 + l * 7,
            p.w - 12 - (l % 2) * 7,
            2,
            "#a6a48a",
          );
        this.rect(c, x + p.x + p.w / 2 - 2, y + p.y - 1, 4, 5, "#ca6e56");
      }
    }
    shelf(c, x, y, w = 150, h = 197) {
      this.rect(c, x + 5, y + 5, w, h, "#b6a98d");
      this.rect(c, x, y, w, h, "#745b46");
      this.rect(c, x + 7, y + 7, w - 14, h - 14, "#9d7c57");
      const bookColors = [
        "#365f62",
        "#b7c8ac",
        "#d38067",
        "#e5c778",
        "#6b9193",
        "#e4e0c9",
      ];
      for (let row = 0; row < 4; row++) {
        let bx = x + 13;
        let idx = 0;
        while (bx < x + w - 18) {
          const bw = 7 + ((idx * 7 + row * 3) % 10),
            bh = 24 + ((idx * 9 + row * 5) % 14);
          const by = y + 45 + row * 46 - bh;
          this.rect(
            c,
            bx,
            by,
            bw,
            bh,
            bookColors[(idx + row) % bookColors.length],
          );
          this.rect(c, bx + 2, by + 4, 2, bh - 8, "rgba(255,255,235,.2)");
          this.rect(c, bx + 1, by + bh - 7, bw - 2, 2, "#ead8ad");
          bx += bw + 3;
          idx++;
        }
        this.rect(c, x + 5, y + 47 + row * 46, w - 10, 6, "#654f3e");
        this.rect(c, x + 7, y + 47 + row * 46, w - 14, 2, "#c1a574");
      }
      this.rect(c, x + 6, y + h, 12, 13, "#654f3e");
      this.rect(c, x + w - 18, y + h, 12, 13, "#654f3e");
    }
    desk(c, x, y, computer = false) {
      this.rect(c, x + 8, y + 11, 9, 55, "#65736c");
      this.rect(c, x + 117, y + 11, 9, 55, "#65736c");
      this.rect(c, x, y, 135, 12, "#bd8e63");
      this.rect(c, x, y, 135, 4, "#e0b784");
      this.rect(c, x + 14, y + 17, 106, 5, "#829084");
      if (computer) {
        this.rect(c, x + 22, y - 71, 79, 57, "#344e52");
        this.rect(c, x + 27, y - 66, 69, 45, "#93c4bd");
        this.rect(c, x + 28, y - 65, 68, 8, "#497f78");
        this.rect(c, x + 35, y - 50, 19, 21, "#d7dfbf");
        for (let j = 0; j < 3; j++)
          this.rect(c, x + 61, y - 49 + j * 7, 26 - j * 3, 3, "#53887c");
        this.rect(c, x + 57, y - 14, 10, 13, "#52665f");
        this.rect(c, x + 43, y - 4, 39, 4, "#344e52");
        this.rect(c, x + 43, y + 4, 53, 3, "#556d68");
      } else {
        this.rect(c, x + 30, y - 9, 44, 9, "#547f7b");
        this.rect(c, x + 32, y - 6, 40, 3, "#eee3c7");
        this.rect(c, x + 39, y - 16, 39, 7, "#d18061");
        this.rect(c, x + 98, y - 20, 16, 20, "#578477");
        this.rect(c, x + 102, y - 28, 3, 13, "#dbb357");
        this.rect(c, x + 108, y - 31, 3, 15, "#cc7558");
      }
    }
    makeBackground() {
      const scene = this.scenes[this.location],
        b = document.createElement("canvas");
      b.width = scene.width;
      b.height = H;
      const c = b.getContext("2d");
      c.imageSmoothingEnabled = false;
      if (scene.kind === "corridor") this.drawCampusCorridor(c, scene);
      else if (this.location === "playground" || this.location === "rooftop")
        this.drawOutdoorRoom(c, scene);
      else this.drawSubjectRoom(c, scene);
      this.drawFloor(c, b.width);
      for (const door of scene.doors) this.door(c, door);
      return b;
    }
    roomShell(c, scene) {
      const p = FLOOR_PALETTES[scene.floor],
        width = scene.width;
      this.rect(c, 0, 0, width, H, p.wall);
      this.rect(c, 0, 0, width, 43, p.trim);
      this.rect(c, 0, 35, width, 9, "#2e504e");
      this.rect(c, 0, 44, width, 12, "#b7bea8");
      this.rect(c, 0, 296, width, 79, p.panel);
      this.rect(c, 0, 294, width, 4, "#75918a");
      this.rect(c, 0, 364, width, 13, "#64877a");
      this.architecturalDetail(c, width);
      for (let x = 43; x < width; x += 300) {
        this.rect(c, x, 43, 120, 5, "#e9dec1");
        this.rect(c, x + 7, 47, 106, 5, "#fffadc");
        this.rect(c, x + 9, 53, 102, 3, "#e0dbc0");
      }
      for (let x = 215; x < width; x += 550) {
        this.rect(c, x, 60, 12, 305, "#d6d1b9");
        this.rect(c, x, 60, 3, 301, "#f2e9d1");
        this.rect(c, x + 10, 60, 3, 305, "#bfc4aa");
        this.rect(c, x - 5, 351, 22, 15, "#acbba5");
      }
      this.sign(c, this.word(scene.label), 510, 65, 310);
    }
    drawCampusCorridor(c, scene) {
      this.roomShell(c, scene);
      for (const x of [315, 825, 1190, 1555, 1880])
        this.window(c, x, 122, x === 315 ? 210 : 168, 142);
      this.notice(c, 535, 139, 176);
      this.plant(c, 793, 375, 0.88);
      this.plant(c, 2265, 375, 0.95);
      this.rect(c, 300, 296, 222, 10, "#ccae7e");
      this.rect(c, 309, 306, 10, 61, "#798571");
      this.rect(c, 501, 306, 10, 61, "#798571");
      this.rect(c, 314, 329, 190, 5, "#94a087");
      for (let xx = 313; xx < 522; xx += 34) {
        this.rect(c, xx, 297, 2, 7, "#a98e62");
        this.rect(c, xx + 4, 297, 25, 2, "#dfc498");
      }
      this.rect(c, 533, 276, 176, 6, "#c5b99a");
      this.text(
        c,
        this.word({
          zh: "觀察・聆聽・再決定",
          cn: "观察・聆听・再决定",
          en: "NOTICE · LISTEN · DECIDE",
        }),
        622,
        291,
        10,
        "#617c6c",
      );
      const floor = scene.floor ? scene.floor + "F" : "G";
      this.rect(c, 40, 64, 109, 47, "#d4c9a9");
      this.rect(c, 44, 68, 101, 39, FLOOR_PALETTES[scene.floor].trim);
      this.text(c, floor, 94, 80, 20, "#f8edcb");
      this.text(
        c,
        this.word({ zh: "明澄書院", cn: "明澄书院", en: "MING CHING" }),
        94,
        99,
        8,
        "#d8dfc1",
      );
      this.ivy(c, 775, 68, 62);
      this.ivy(c, 1877, 68, 49);
      // Baked light shafts, lockers, and floor-specific student work.
      this.rect(c, 173, 268, 48, 97, "#8ca89b");
      this.rect(c, 177, 274, 39, 87, "#b0c1a9");
      for (let row = 0; row < 3; row++) {
        this.rect(c, 179, 278 + row * 28, 35, 1, "#749485");
        this.rect(c, 206, 286 + row * 28, 3, 7, "#587e73");
      }
      this.rect(c, 1940, 279, 83, 77, "#bca784");
      this.rect(c, 1944, 283, 75, 68, "#e4dbbd");
      this.text(
        c,
        this.word({ zh: "樓層地圖", cn: "楼层地图", en: "FLOOR MAP" }),
        1982,
        295,
        9,
        "#486c60",
      );
      for (let q = 0; q < 5; q++) {
        this.rect(
          c,
          1954,
          309 + q * 7,
          48,
          3,
          q === scene.floor ? "#c9775c" : "#b3c2a2",
        );
        this.rect(
          c,
          2007,
          309 + q * 7,
          5,
          3,
          q === scene.floor ? "#c9775c" : "#b3c2a2",
        );
      }
    }
    stairDoor(c, d) {
      const x = d.x - 53;
      this.rect(c, x - 5, 157, 115, 225, "#aaa68d");
      this.rect(c, x, 163, 106, 215, "#345d5a");
      this.rect(c, x + 6, 169, 94, 208, "#96aea1");
      this.rect(c, x + 9, 173, 87, 196, "#bdcabc");
      for (let step = 0; step < 7; step++) {
        const sx =
            d.stairs === "up" ? x + 14 + step * 10 : x + 14 + (6 - step) * 10,
          sy = 346 - step * 19;
        this.rect(c, sx, sy, 18, 8, "#7a9488");
        this.rect(c, sx, sy, 18, 2, "#e7e7cd");
        this.rect(c, sx, sy + 8, 18, 11, "#a6b8a7");
      }
      this.pixelLine(c, x + 17, 307, x + 88, 188, 3, "#41675c");
      this.rect(c, x + 16, 305, 3, 40, "#41675c");
      this.rect(c, x + 86, 188, 3, 47, "#41675c");
      this.rect(c, x - 3, 374, 112, 8, "#746f5d");
      this.mountedPlaque(c, this.entranceLabel(d), d.x, 120, 155);
      this.text(c, d.stairs === "up" ? "↑" : "↓", d.x + 32, 341, 23, "#355b54");
    }
    pixelLine(c, x1, y1, x2, y2, size, color) {
      const steps = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1));
      for (let p = 0; p <= steps; p += Math.max(1, size)) {
        this.rect(
          c,
          x1 + ((x2 - x1) * p) / steps,
          y1 + ((y2 - y1) * p) / steps,
          size,
          size,
          color,
        );
      }
    }
    board(c, x, y, w, h, dark = false) {
      this.rect(c, x + 5, y + 6, w, h, "#b7b398");
      this.rect(c, x, y, w, h, "#9a8060");
      this.rect(c, x + 5, y + 5, w - 10, h - 10, dark ? "#355d52" : "#eeeede");
      this.rect(c, x + 7, y + 7, w - 14, 2, dark ? "#5d7d67" : "#fffae7");
      this.rect(c, x - 3, y + h - 1, w + 6, 7, "#b5996f");
      this.rect(c, x + 15, y + h, 25, 3, "#e0d7b7");
      this.rect(c, x + w - 45, y + h, 22, 4, "#756d56");
    }
    bookPile(c, x, y) {
      for (const [i, color] of ["#7b9a85", "#d28b68", "#b8c3a2"].entries()) {
        this.rect(c, x + i * 3, y - i * 8, 42 - i * 4, 7, color);
        this.rect(c, x + i * 3 + 3, y - i * 8 + 3, 35 - i * 4, 2, "#f0e6c6");
      }
    }
    globe(c, x, y) {
      this.rect(c, x - 19, y + 30, 41, 5, "#7f7257");
      this.rect(c, x - 2, y + 15, 6, 17, "#84775c");
      this.rect(c, x - 20, y - 24, 40, 37, "#759faa");
      this.rect(c, x - 26, y - 15, 52, 20, "#759faa");
      this.rect(c, x - 17, y - 29, 34, 5, "#a9c1bc");
      this.rect(c, x - 11, y - 22, 15, 7, "#bbc698");
      this.rect(c, x - 18, y - 12, 17, 10, "#a7bb86");
      this.rect(c, x - 8, y - 3, 13, 15, "#b8c491");
      this.rect(c, x + 8, y - 13, 12, 11, "#a9bf8d");
      this.pixelLine(c, x - 24, y + 15, x + 26, y - 27, 3, "#b5a27a");
    }
    drawSubjectRoom(c, scene) {
      this.roomShell(c, scene);
      const id = this.location;
      if (id === "hall") {
        this.drawHall(c);
        return;
      }
      this.window(c, 1000, 115, 213, 137);
      this.plant(c, 1330, 374, 0.93);
      this.ivy(c, 1250, 70, 62);
      if (["chinese", "english", "maths"].includes(id)) {
        this.board(c, 295, 121, 570, 142, id === "maths");
        const title =
          id === "chinese"
            ? {
                zh: "語言，讓不同的人被聽見",
                cn: "语言，让不同的人被听见",
                en: "Language makes room for every voice",
              }
            : id === "english"
              ? {
                  zh: "理解語境，尊重聲音",
                  cn: "理解语境，尊重声音",
                  en: "Context matters. Every voice matters.",
                }
              : {
                  zh: "提出問題・檢查推理",
                  cn: "提出问题・检查推理",
                  en: "ASK QUESTIONS · CHECK REASONING",
                };
        this.text(
          c,
          this.word(title),
          580,
          147,
          id === "chinese" ? 16 : 14,
          id === "maths" ? "#dbe3c3" : "#3a6256",
        );
        if (id === "chinese") {
          for (const [i, ch] of ["人", "文", "同", "理"].entries()) {
            this.rect(c, 328 + i * 114, 175, 78, 63, "#f7eed6");
            this.rect(c, 328 + i * 114, 205, 78, 1, "#d9c2a0");
            this.rect(c, 366 + i * 114, 175, 1, 63, "#d9c2a0");
            this.text(c, ch, 367 + i * 114, 207, 32, "#42645c");
          }
          this.bookPile(c, 334, 314);
          this.rect(c, 812, 287, 20, 29, "#9b8363");
          for (let z = 0; z < 4; z++)
            this.rect(c, 815 + z * 4, 271 + z * 2, 2, 22, "#5b5944");
        } else if (id === "english") {
          const cards = [
            ["VOICE", "#ccd7b6"],
            ["CONTEXT", "#e4c993"],
            ["RESPECT", "#b8cfcb"],
          ];
          for (const [i, [word, col]] of cards.entries()) {
            this.rect(c, 333 + i * 171, 177, 145, 48, col);
            this.text(c, word, 405 + i * 171, 201, 17, "#41685e");
            this.rect(c, 353 + i * 171, 234, 100, 2, "#bdc4ad");
          }
        } else {
          this.text(
            c,
            this.word({
              zh: "P(A) = 符合條件的結果數 / 所有可能結果數",
              cn: "P(A) = 符合条件的结果数 / 所有可能结果数",
              en: "P(A) = favourable outcomes / all outcomes",
            }),
            578,
            183,
            16,
            "#ecebd0",
          );
          this.text(c, "2x + 3 = 11          x = 4", 569, 224, 24, "#e6d398");
          this.pixelLine(c, 806, 218, 832, 181, 2, "#97bfa6");
          this.pixelLine(c, 807, 218, 844, 218, 2, "#97bfa6");
        }
        for (const x of [305, 501, 940, 1134]) this.desk(c, x, 318);
        this.bookPile(c, 995, 317);
        this.notice(c, 1245, 134, 160);
      } else if (id === "chemistry") {
        this.board(c, 297, 121, 550, 128, false);
        this.text(
          c,
          this.word({
            zh: "觀察模型・檢查解釋",
            cn: "观察模型・检查解释",
            en: "OBSERVE MODELS · CHECK EXPLANATIONS",
          }),
          574,
          146,
          14,
          "#4b7265",
        );
        const nodes = [
          [392, 194, "#759a9e"],
          [449, 177, "#cc8569"],
          [489, 211, "#e0c58b"],
          [560, 194, "#759a9e"],
          [611, 177, "#cc8569"],
          [653, 211, "#e0c58b"],
        ];
        for (let i = 0; i < nodes.length - 1; i++) {
          this.pixelLine(
            c,
            nodes[i][0],
            nodes[i][1],
            nodes[i + 1][0],
            nodes[i + 1][1],
            3,
            "#789284",
          );
        }
        for (const [x, y, col] of nodes) {
          this.rect(c, x - 10, y - 7, 20, 14, col);
          this.rect(c, x - 7, y - 10, 14, 20, col);
          this.rect(c, x - 5, y - 7, 5, 4, "#e9e1c5");
        }
        for (const x of [310, 530, 920, 1130]) {
          this.desk(c, x, 323);
          this.rect(c, x - 2, 318, 139, 7, "#56736b");
          this.rect(c, x + 20, 281, 33, 36, "#c4d7ca");
          this.rect(c, x + 23, 284, 27, 28, "#e5e9d5");
          this.rect(c, x + 28, 295, 17, 16, "#96bbb5");
          this.rect(c, x + 68, 299, 35, 18, "#ccbca2");
          this.rect(c, x + 77, 284, 18, 16, "#9bb9b5");
          this.rect(c, x + 76, 281, 20, 4, "#5d8c82");
        }
        this.sign(
          c,
          this.word({
            zh: "模型展示・不進行化學實驗",
            cn: "模型展示・不进行化学实验",
            en: "DISPLAY MODELS · NO EXPERIMENTS",
          }),
          1080,
          281,
          295,
        );
      } else if (id === "geography") {
        this.board(c, 292, 116, 598, 153, false);
        this.rect(c, 307, 129, 567, 123, "#abcad0");
        for (const [mx, my, mw, mh] of [
          [347, 147, 91, 38],
          [374, 184, 43, 21],
          [404, 208, 32, 32],
          [519, 145, 75, 31],
          [554, 179, 45, 47],
          [606, 154, 113, 39],
          [685, 195, 38, 18],
          [747, 221, 56, 20],
          [457, 232, 19, 9],
        ]) {
          this.rect(c, mx, my, mw, mh, "#a0b387");
          this.rect(c, mx + 4, my + 3, mw - 8, 4, "#b8c598");
        }
        for (let gy = 146; gy < 247; gy += 25)
          this.rect(c, 310, gy, 560, 1, "rgba(230,238,212,.25)");
        for (let gx = 346; gx < 870; gx += 54)
          this.rect(c, gx, 132, 1, 117, "rgba(230,238,212,.25)");
        this.desk(c, 315, 324);
        this.desk(c, 1048, 324);
        this.globe(c, 375, 282);
        this.globe(c, 1105, 282);
        this.bookPile(c, 795, 322);
        this.text(
          c,
          this.word({
            zh: "每張地圖，都有觀察角度。",
            cn: "每张地图，都有观察角度。",
            en: "Every map has a point of view.",
          }),
          598,
          293,
          13,
          "#627b6b",
        );
      } else if (id === "computer") {
        this.notice(c, 286, 127, 230);
        this.board(c, 576, 127, 276, 112, true);
        this.text(
          c,
          this.word({
            zh: "輸入 → 模型 → 輸出",
            cn: "输入 → 模型 → 输出",
            en: "INPUT → MODEL → OUTPUT",
          }),
          714,
          162,
          12,
          "#d8dfba",
        );
        this.text(
          c,
          this.word({
            zh: "人類仍需核實",
            cn: "人类仍需核实",
            en: "HUMAN REVIEW MATTERS",
          }),
          714,
          204,
          12,
          "#d4bb7d",
        );
        for (const x of [300, 490, 925, 1120]) {
          this.desk(c, x, 323, true);
          this.rect(c, x + 48, 345, 42, 7, "#547c75");
          this.rect(c, x + 54, 328, 31, 18, "#71968a");
          this.rect(c, x + 66, 353, 5, 22, "#526c63");
        }
        this.rect(c, 872, 146, 54, 162, "#446567");
        for (let row = 0; row < 5; row++) {
          this.rect(c, 878, 154 + row * 27, 41, 18, "#2d4d51");
          this.rect(c, 883, 160 + row * 27, 4, 4, "#a8c994");
          this.rect(c, 894, 159 + row * 27, 20, 2, "#608780");
        }
      } else if (id === "history") {
        this.board(c, 292, 124, 595, 131, false);
        this.text(
          c,
          this.word({
            zh: "來源・脈絡・不同觀點",
            cn: "来源・脉络・不同观点",
            en: "SOURCES · CONTEXT · PERSPECTIVES",
          }),
          586,
          149,
          14,
          "#59705f",
        );
        this.rect(c, 326, 192, 522, 3, "#ad8768");
        for (let q = 0; q < 5; q++) {
          const x = 345 + q * 112;
          this.rect(c, x, 183, 5, 20, "#80674e");
          this.rect(c, x - 22, 209, 54, 26, q % 2 ? "#ccbea0" : "#d7caa9");
          this.rect(c, x - 16, 214, 40, 2, "#aa9c80");
          this.rect(c, x - 14, 220, 30, 2, "#aa9c80");
        }
        this.shelf(c, 1044, 160, 164, 195);
        this.desk(c, 318, 324);
        this.bookPile(c, 346, 316);
        this.rect(c, 765, 288, 100, 37, "#aa8b65");
        this.rect(c, 770, 292, 90, 31, "#d3c2a0");
        this.rect(c, 796, 300, 41, 15, "#ede1c1");
        this.text(
          c,
          this.word({ zh: "檔案", cn: "档案", en: "ARCHIVE" }),
          816,
          308,
          9,
          "#7f745b",
        );
      } else if (id === "art") {
        this.notice(c, 291, 116, 274);
        this.board(c, 616, 120, 269, 136, false);
        for (const [x, y, col] of [
          [643, 147, "#bf7d61"],
          [690, 154, "#c4b263"],
          [740, 143, "#6e998d"],
          [789, 159, "#9b9aa0"],
        ]) {
          this.rect(c, x, y, 46, 51, col);
          this.rect(c, x + 6, y + 6, 33, 13, "rgba(249,235,200,.24)");
        }
        for (const x of [350, 967, 1171]) {
          this.pixelLine(c, x, 275, x - 31, 371, 5, "#8e7753");
          this.pixelLine(c, x + 10, 275, x + 37, 371, 5, "#8e7753");
          this.rect(c, x - 39, 272, 87, 66, "#ab8b5e");
          this.rect(c, x - 33, 277, 75, 54, "#f1e6c7");
          this.rect(c, x - 29, 281, 67, 20, "#adc9c4");
          this.rect(c, x - 29, 301, 67, 26, "#b9c5a0");
          this.rect(c, x - 12, 290, 24, 36, "#718c6b");
          this.rect(c, x - 22, 285, 44, 22, "#879e72");
          this.rect(c, x - 44, 337, 98, 7, "#a17b54");
        }
        this.desk(c, 605, 328);
        for (let col = 0; col < 5; col++)
          this.rect(
            c,
            626 + col * 18,
            311,
            11,
            16,
            ["#b66b57", "#b99e5e", "#72967c", "#6f95a0", "#a499a8"][col],
          );
      } else if (id === "music") {
        this.board(c, 288, 119, 595, 126, false);
        for (let row = 0; row < 5; row++)
          this.rect(c, 315, 157 + row * 12, 536, 1, "#88968a");
        for (let n = 0; n < 8; n++) {
          const xx = 348 + n * 62,
            yy = 183 - (n % 3) * 12;
          this.rect(c, xx, yy, 10, 6, "#3d5f59");
          this.rect(c, xx + 8, yy - 26, 3, 30, "#3d5f59");
          if (n % 2) this.rect(c, xx + 9, yy - 27, 14, 3, "#3d5f59");
        }
        this.rect(c, 310, 294, 336, 38, "#3d5450");
        this.rect(c, 321, 301, 314, 27, "#eee7cb");
        for (let key = 0; key < 26; key++) {
          this.rect(c, 323 + key * 12, 302, 1, 25, "#a6aa95");
          if (key % 7 !== 2 && key % 7 !== 6)
            this.rect(c, 329 + key * 12, 302, 7, 16, "#344b47");
        }
        this.rect(c, 328, 332, 10, 41, "#3a514b");
        this.rect(c, 617, 332, 10, 41, "#3a514b");
        for (const x of [1012, 1116]) {
          this.rect(c, x, 294, 50, 49, "#b88059");
          this.rect(c, x - 5, 304, 60, 31, "#c18d62");
          this.rect(c, x + 12, 282, 26, 20, "#d19c6c");
          this.rect(c, x + 21, 228, 9, 81, "#725d47");
          this.rect(c, x + 18, 222, 15, 20, "#755e45");
          this.rect(c, x + 21, 309, 9, 13, "#624f3c");
          this.rect(c, x + 25, 233, 1, 100, "#e7d3a2");
        }
        this.rect(c, 1251, 286, 84, 10, "#e0d7b5");
        this.rect(c, 1254, 296, 78, 51, "#958065");
        for (let rib = 0; rib < 6; rib++)
          this.rect(c, 1258 + rib * 13, 296, 2, 51, "#cfb989");
      } else if (id === "library") {
        for (const x of [285, 480, 884, 1239]) this.shelf(c, x, 146, 156, 208);
        this.window(c, 655, 122, 194, 127);
        this.desk(c, 668, 325);
        this.bookPile(c, 693, 318);
        this.desk(c, 1063, 324);
        this.bookPile(c, 1094, 317);
        this.plant(c, 1183, 374, 0.73);
        this.sign(
          c,
          this.word({
            zh: "多元聲音・共讀世界",
            cn: "多元声音・共读世界",
            en: "MANY VOICES · ONE WORLD",
          }),
          710,
          277,
          290,
        );
      }
    }
    drawHall(c) {
      this.rect(c, 276, 107, 1094, 253, "#796851");
      this.rect(c, 296, 119, 1054, 222, "#bca780");
      this.rect(c, 313, 127, 1020, 183, "#e2d5b6");
      for (const x of [288, 1165]) {
        this.rect(c, x, 113, 183, 221, "#8f5754");
        for (let p = 0; p < 8; p++) {
          this.rect(
            c,
            x + 7 + p * 23,
            116,
            9,
            213,
            p % 2 ? "#ad7264" : "#9c635b",
          );
          this.rect(c, x + 13 + p * 23, 116, 3, 207, "#bd806c");
        }
      }
      this.rect(c, 289, 111, 1045, 25, "#a46559");
      for (let x = 300; x < 1333; x += 45)
        this.rect(c, x, 132, 34, 8, "#ba7c68");
      this.sign(
        c,
        this.word({
          zh: "明澄書院・共同學習",
          cn: "明澄书院・共同学习",
          en: "MING CHING · LEARNING TOGETHER",
        }),
        813,
        163,
        449,
      );
      this.rect(c, 298, 338, 1045, 14, "#aa8e63");
      this.rect(c, 285, 352, 1070, 12, "#c2a575");
      this.rect(c, 276, 364, 1094, 13, "#8d7857");
      this.rect(c, 813, 238, 8, 80, "#536158");
      this.rect(c, 786, 236, 60, 9, "#c7ac7c");
      this.rect(c, 790, 245, 52, 76, "#a48860");
      this.rect(c, 797, 250, 37, 57, "#bc9b6c");
      this.rect(c, 814, 218, 3, 20, "#445954");
      this.rect(c, 807, 216, 14, 4, "#445954");
      this.plant(c, 535, 335, 0.8);
      this.plant(c, 1090, 336, 0.8);
      this.text(
        c,
        this.word({
          zh: "聆聽・表達・尊重",
          cn: "聆听・表达・尊重",
          en: "LISTEN · EXPRESS · RESPECT",
        }),
        820,
        206,
        17,
        "#6c785d",
      );
    }
    drawOutdoorRoom(c, scene) {
      this.drawCourtyard(c, scene.width);
      this.sign(c, this.word(scene.label), 590, 52, 274);
      if (this.location === "playground") {
        this.rect(c, 234, 243, 1190, 128, "#8ca68a");
        this.rect(c, 257, 259, 1138, 104, "#a7b894");
        this.rect(c, 290, 274, 1070, 3, "#eee5c4");
        this.rect(c, 289, 274, 3, 77, "#eee5c4");
        this.rect(c, 1358, 274, 3, 77, "#eee5c4");
        this.rect(c, 290, 350, 1070, 3, "#eee5c4");
        this.rect(c, 817, 274, 3, 79, "#eee5c4");
        this.rect(c, 1120, 156, 9, 154, "#627d72");
        this.rect(c, 1065, 139, 109, 58, "#e8e8d4");
        this.rect(c, 1071, 145, 97, 46, "#c5d5c6");
        this.rect(c, 1095, 156, 41, 27, "#e5e8d1");
        this.rect(c, 1100, 179, 31, 4, "#b87659");
        this.rect(c, 1105, 184, 2, 20, "#e2dfc5");
        this.rect(c, 1125, 184, 2, 20, "#e2dfc5");
        this.rect(c, 1105, 202, 22, 2, "#e2dfc5");
        for (let xx = 250; xx < 1420; xx += 50) {
          this.rect(c, xx, 206, 2, 44, "#6c8b78");
          this.rect(c, xx, 209, 50, 1, "#9bafa0");
          this.rect(c, xx, 230, 50, 1, "#9bafa0");
        }
        this.rect(c, 363, 303, 25, 25, "#b87f54");
        this.rect(c, 367, 298, 17, 35, "#c08a59");
        this.rect(c, 360, 312, 31, 3, "#816443");
        this.rect(c, 374, 299, 2, 33, "#816443");
      } else {
        this.rect(c, 237, 292, 1188, 81, "#c5c2a4");
        this.rect(c, 242, 288, 1180, 7, "#e5dcc0");
        for (let x = 365; x < 1390; x += 270) {
          this.rect(c, x, 320, 184, 50, "#a38862");
          this.rect(c, x + 4, 324, 176, 41, "#bea079");
          for (let slat = 0; slat < 5; slat++)
            this.rect(c, x + 8, 329 + slat * 7, 166, 1, "#8e7858");
          this.rect(c, x - 3, 316, 190, 9, "#c9ad7f");
          this.rect(c, x + 4, 316, 176, 3, "#6e7954");
          for (let plant = 0; plant < 5; plant++) {
            const px = x + 20 + plant * 32;
            this.rect(c, px, 285, 5, 32, "#6f8959");
            this.rect(c, px - 10, 289, 24, 11, "#78966c");
            this.rect(c, px - 4, 281, 15, 10, "#9eaf7e");
            this.rect(c, px + 1, 291, 4, 5, "#c3c890");
          }
        }
        this.rect(c, 790, 102, 15, 215, "#7e8261");
        this.rect(c, 1160, 102, 15, 215, "#7e8261");
        this.rect(c, 773, 93, 420, 13, "#a3a07b");
        for (let beam = 0; beam < 9; beam++)
          this.rect(c, 785 + beam * 48, 82, 12, 25, "#8d9370");
        this.ivy(c, 814, 111, 110);
        this.ivy(c, 1148, 110, 86);
        this.sign(
          c,
          this.word({
            zh: "四樓天台・留一點空間思考",
            cn: "四楼天台・留一点空间思考",
            en: "4F TERRACE · ROOM TO REFLECT",
          }),
          590,
          111,
          389,
        );
      }
    }
    drawFloor(c, width) {
      const courtyard = ["playground", "rooftop"].includes(this.location);
      const variants = courtyard
        ? ["#d4c2a5", "#d0bea0", "#d8c8ac", "#cdbd9f"]
        : ["#d0bfa4", "#ccbba1", "#d5c5aa", "#cbb99e"];
      this.rect(c, 0, GROUND - 2, width, H - GROUND + 2, variants[0]);
      for (let row = 0, y = GROUND + 4; y < H; y += 26, row++) {
        const offset = (row % 2) * 48;
        for (let col = 0, x = -offset; x < width; x += 96, col++) {
          const value = (((col * 13 + row * 7) % 11) + 11) % 11;
          this.rect(c, x + 1, y + 1, 94, 24, variants[value % 4]);
          this.rect(c, x + 2, y + 1, 92, 1, "#e0d0b3");
          this.rect(c, x, y, 1, 26, "#b9a68b");
          this.rect(c, x, y + 25, 96, 1, "#baa88d");
          if (value % 3 === 0) {
            this.rect(c, x + 13 + value * 3, y + 9, 15, 1, "#c2b195");
            this.rect(c, x + 16 + value * 3, y + 10, 6, 1, "#dbccb0");
          }
        }
      }
      this.rect(c, 0, GROUND - 2, width, 5, courtyard ? "#ab9f80" : "#9d9780");
      this.rect(c, 0, GROUND + 3, width, 2, "#ece0be");
      if (!courtyard) {
        c.fillStyle = "rgba(255,248,207,.18)";
        for (let x = 220; x < width; x += 455) {
          c.beginPath();
          c.moveTo(x, GROUND + 10);
          c.lineTo(x + 117, GROUND + 10);
          c.lineTo(x + 59, H);
          c.lineTo(x - 113, H);
          c.closePath();
          c.fill();
          this.rect(c, x - 40, 455, 87, 2, "rgba(245,232,191,.17)");
        }
      }
    }
    drawCourtyard(c, width) {
      this.rect(c, 0, 0, width, 250, "#b8d6d3");
      this.rect(c, 0, 0, width, 80, "#cadfd7");
      this.rect(c, 1015, 31, 44, 44, "#fff0bd");
      this.rect(c, 1007, 39, 60, 28, "#fff0bd");
      const cloud = (x, y) => {
        this.rect(c, x, y, 81, 12, "#e9ebd9");
        this.rect(c, x + 12, y - 11, 53, 11, "#e9ebd9");
      };
      cloud(420, 48);
      cloud(830, 92);
      cloud(1280, 37);
      for (let x = 260; x < width; x += 180) {
        const by = 180 - (x % 130);
        this.rect(c, x, by, 120, 205, "#93b6af");
        for (let wy = by + 13; wy < 270; wy += 26)
          for (let wx = x + 12; wx < x + 108; wx += 25)
            this.rect(c, wx, wy, 12, 14, "#b9d4c8");
      }
      this.rect(c, 0, 268, width, 105, "#849a79");
      this.rect(c, 0, 290, width, 7, "#c1ba9a");
      this.rect(c, 0, 299, width, 66, "#d8cfb2");
      this.rect(c, 0, 356, width, 18, "#a79f83");
      for (let yy = 302; yy < 352; yy += 17) {
        for (let xx = (yy % 2) * 36; xx < width; xx += 72) {
          this.rect(c, xx, yy, 68, 1, "#eee4c6");
          this.rect(c, xx + 68, yy, 2, 16, "#c1b999");
          this.rect(c, xx + 4, yy + 5, 19, 2, "#d0c8aa");
        }
      }
      this.rect(c, 0, 293, width, 2, "#e4dab6");
      for (let x = 250; x < width; x += 210) {
        this.rect(c, x, 210, 7, 84, "#607b69");
        this.rect(c, x - 27, 193, 63, 9, "#729375");
        this.rect(c, x - 45, 201, 101, 26, "#719474");
        this.rect(c, x - 37, 218, 85, 17, "#648767");
        this.rect(c, x - 11, 181, 38, 15, "#8cab80");
        for (let leaf = 0; leaf < 13; leaf++) {
          const lx = x - 41 + ((leaf * 19) % 91),
            ly = 193 + ((leaf * 7) % 29);
          this.rect(c, lx, ly, 10, 5, leaf % 2 ? "#87a674" : "#557e5d");
          this.rect(c, lx + 2, ly - 2, 5, 3, "#9bb581");
        }
        this.rect(c, x + 2, 235, 3, 40, "#789071");
      }
      this.rect(c, 0, 51, 208, 324, "#e4d9bb");
      this.rect(c, 0, 35, 213, 17, "#436b60");
      this.rect(c, 199, 51, 17, 326, "#b7bea0");
      for (const x of [353, 964]) {
        this.rect(c, x, 326, 172, 12, "#977550");
        this.rect(c, x, 346, 172, 9, "#b28a5e");
        this.rect(c, x + 12, 339, 9, 39, "#537263");
        this.rect(c, x + 150, 339, 9, 39, "#537263");
        this.rect(c, x + 5, 304, 162, 9, "#c19865");
        this.rect(c, x + 5, 317, 162, 7, "#b68b5e");
      }
      this.plant(c, 274, 377, 1.1);
      this.plant(c, 1180, 377, 1.25);
      this.rect(c, 551, 322, 9, 56, "#698172");
      this.rect(c, 531, 304, 52, 28, "#668875");
      this.rect(c, 536, 309, 42, 19, "#f4e7c8");
      this.text(
        c,
        this.isEnglish() ? "GROW" : "共成長",
        557,
        319,
        9,
        "#54715c",
      );
      this.rect(c, 1280, 310, 65, 64, "#547d73");
      this.rect(c, 1275, 305, 75, 9, "#325e59");
      this.rect(c, 1288, 320, 48, 6, "#325e59");
      this.rect(c, 609, 367, 252, 9, "#afbb98");
      this.rect(c, 613, 371, 244, 6, "#bdc7a7");
    }
    sprite(
      c,
      x,
      y,
      look = {},
      walking = false,
      phase = 0,
      direction = 1,
      npc = false,
    ) {
      const selection = look.costume?Math.max(0,Math.min(3,Number(look.uniform)||0)):playerAtlasIndex(look);
      const schoolUniform = !Object.prototype.hasOwnProperty.call(
        NPC_COSTUMES,
        look.costume,
      );
      const uniform = schoolUniform
        ? selection < 2 ? 1 : 0
        : NPC_COSTUMES[look.costume];
      const hair = (schoolUniform && look.gender!=="girl") ? 0 : (Number(look.hair)>0||look.longHair?1:0);
      const skin = Math.max(0, Math.min(2, Number(look.skin) || 0));
      const tones = CHARACTER_COLORS.skin[skin],
        fabric = schoolUniform
          ? SCHOOL_UNIFORMS[selection]
          : { ...CHARACTER_COLORS.uniform[uniform], ...(look.coat ? { base: look.coat, mid: look.coat } : {}) };
      const ink = CHARACTER_COLORS.outline,
        locks = CHARACTER_COLORS.hair;
      const stride = walking ? Math.sin(phase) : 0;
      const bob = walking ? Math.round(Math.abs(Math.sin(phase * 2))) : 0;
      const swing = Math.round(stride * 3),
        facing = direction < 0 ? -1 : 1;
      c.save();
      c.translate(Math.round(x) - 16, Math.round(y));
      this.rect(c, -1, 2, 37, 3, "rgba(31,51,49,.12)");
      this.rect(c, 5, 1, 25, 5, "rgba(31,51,49,.12)");
      c.translate(0, -bob);
      // A single tied tail sits behind the shoulder, on the back-facing side.
      if (hair) {
        const tx = facing > 0 ? 0 : 29,
          sway = walking ? Math.round(stride) : 0;
        this.rect(c, tx, -62, 7, 25, locks[0]);
        this.rect(c, tx + sway, -43, 6, 11, locks[0]);
        this.rect(c, tx + 2, -59, 3, 24, locks[1]);
        this.rect(c, tx + 2 + sway, -42, 2, 7, locks[2]);
        this.rect(c, tx + 1, -60, 6, 3, npc ? "#cfaf6b" : "#b76f62");
        this.rect(c, tx + 2, -59, 3, 1, "#eed599");
      }
      if (look.bag) {
        this.rect(c, 1, -38, 9, 24, "#5b493d");
        this.rect(c, 2, -36, 8, 18, "#9a7752");
        this.rect(c, 3, -33, 5, 2, "#cba06e");
        this.rect(c, 3, -23, 5, 6, "#775b43");
      }
      // Each leg and shoe shares a gait offset, so feet never detach from trousers.
      for (const [base, step] of [
        [8, swing],
        [21, -swing],
      ]) {
        const lift = walking && step > 0 ? 1 : 0,
          legX = base + Math.round(step * 0.55),
          shoeX = base + step - 1;
        const trouser = uniform === 1 || uniform === 3;
        this.rect(c, legX, -19, 7, 18 - lift, ink);
        this.rect(
          c,
          legX + 1,
          -18,
          5,
          15 - lift,
          trouser ? fabric.dark : tones.base,
        );
        this.rect(
          c,
          legX + 2,
          -17,
          2,
          12 - lift,
          trouser ? fabric.mid : tones.light,
        );
        if (trouser) {
          this.rect(c, legX + 1, -7 - lift, 5, 2, fabric.shadow);
          this.rect(c, legX + 3, -14, 1, 5, fabric.light);
        } else {
          this.rect(c, legX + 1, -10, 5, 7 - lift, "#e7e8d6");
          this.rect(c, legX + 2, -10, 4, 2, "#fff8e7");
          this.rect(c, legX + 1, -5 - lift, 5, 2, "#bfc9c0");
        }
        const leather =
          schoolUniform && selection === 3 ? "#513e34" : "#3c494a";
        this.rect(c, shoeX, -3 - lift, 10, 4, ink);
        this.rect(c, shoeX + 1, -4 - lift, 7, 3, leather);
        this.rect(c, shoeX + 1, -3 - lift, 4, 1, "#7b8680");
        this.rect(c, shoeX, 1 - lift, 10, 1, "#a1a794");
        if (uniform === 3) {
          this.rect(c, shoeX + 1, -2 - lift, 8, 2, "#e7e2d0");
          this.rect(c, shoeX + 3, -3 - lift, 4, 1, "#faf3de");
        }
      }
      // Shaded shirt body, seams, and sleeve cuffs.
      this.rect(c, 7, -42, 22, 25, ink);
      this.rect(c, 6, -39, 24, 18, ink);
      this.rect(c, 8, -41, 20, 24, fabric.base);
      this.rect(c, 8, -40, 3, 21, fabric.shadow);
      this.rect(c, 12, -39, 10, 18, fabric.light);
      this.rect(c, 25, -39, 3, 21, fabric.mid);
      this.rect(c, 11, -20, 15, 2, fabric.mid);
      this.rect(c, 12, -25, 2, 5, fabric.shadow);
      this.rect(c, 23, -31, 1, 8, fabric.shadow);
      for (const [ax, offset] of [
        [2, swing],
        [29, -swing],
      ]) {
        this.rect(c, ax, -39 + offset, 6, 19, ink);
        this.rect(c, ax + 1, -38 + offset, 4, 10, fabric.base);
        this.rect(c, ax + 1, -36 + offset, 2, 6, fabric.light);
        this.rect(c, ax + 1, -28 + offset, 4, 2, fabric.shadow);
        this.rect(c, ax + 1, -26 + offset, 4, 7, tones.base);
        this.rect(c, ax + 1, -25 + offset, 2, 5, tones.light);
        this.rect(c, ax + 1, -20 + offset, 4, 2, tones.shadow);
      }
      this.rect(c, 14, -45, 8, 6, tones.shadow);
      this.rect(c, 15, -45, 6, 5, tones.base);
      this.rect(c, 11, -41, 6, 4, "#faf4e6");
      this.rect(c, 19, -41, 6, 4, "#e2e6d6");
      this.rect(c, 13, -37, 3, 2, "#d0d6c8");
      this.rect(c, 20, -37, 3, 2, "#c3cfc3");
      if (schoolUniform && (selection === 2 || selection === 3)) {
        this.rect(c, 9, -39, 18, 22, fabric.base);
        this.rect(c, 10, -38, 5, 17, fabric.light);
        this.rect(c, 25, -35, 2, 18, fabric.shadow);
        this.rect(c, 8, -20, 21, 7, fabric.base);
        this.rect(c, 6, -14, 25, 3, fabric.base);
        for (const px of [8, 14, 20, 26]) {
          this.rect(c, px, -17, 1, 6, fabric.shadow);
          this.rect(c, px + 1, -15, 2, 4, fabric.light);
        }
        this.rect(c, 7, -11, 23, 1, fabric.mid);
        if (selection === 2) {
          this.rect(c, 9, -23, 19, 4, "#b53e3a");
          this.rect(c, 10, -23, 17, 1, "#d76956");
          this.rect(c, 17, -23, 4, 4, "#973531");
        } else {
          for (const px of [11, 15, 19, 23, 27]) {
            this.rect(c, px, -36, 1, 13, "#6697a8");
            this.rect(c, px - 2, -20, 1, 9, "#6c9fac");
          }
          this.rect(c, 9, -23, 19, 2, "#80a8b7");
          this.rect(c, 17, -38, 4, 4, "#355e75");
          this.rect(c, 18, -34, 3, 13, "#426f88");
          this.rect(c, 18, -33, 1, 10, "#6d91a5");
        }
        this.rect(c, 11, -41, 6, 4, "#f9f7e5");
        this.rect(c, 20, -41, 6, 4, "#e1e8d8");
      } else if (uniform === 0) {
        this.rect(c, 10, -39, 4, 15, fabric.dark);
        this.rect(c, 23, -39, 4, 15, fabric.dark);
        this.rect(c, 11, -31, 15, 14, fabric.dark);
        this.rect(c, 12, -30, 4, 10, fabric.mid);
        this.rect(c, 25, -30, 2, 12, fabric.shadow);
        this.rect(c, 10, -22, 18, 3, ink);
        this.rect(c, 10, -21, 17, 1, fabric.light);
        this.rect(c, 8, -18, 22, 5, fabric.dark);
        this.rect(c, 6, -13, 26, 5, fabric.dark);
        for (const px of [9, 15, 21, 27]) {
          this.rect(c, px, -17, 2, 9, fabric.shadow);
          this.rect(c, px + 2, -15, 2, 6, fabric.mid);
        }
        this.rect(c, 7, -9, 24, 1, fabric.light);
        this.rect(c, 17, -36, 3, 8, "#a9544c");
        this.rect(c, 15, -38, 7, 3, "#b96759");
        this.rect(c, 23, -29, 3, 4, "#d8ba76");
        this.rect(c, 24, -29, 1, 2, "#f3dda5");
      } else if (uniform === 1) {
        if (schoolUniform) {
          this.rect(c, 16, -41, 5, 5, tones.base);
          this.rect(c, 16, -37, 2, 2, tones.shadow);
          this.rect(c, 17, -34, 1, 11, "#c1ccc0");
          for (const py of [-32, -27, -22])
            this.rect(c, 18, py, 1, 1, "#8eaaa4");
        } else {
          this.rect(c, 17, -38, 4, 4, "#8a433e");
          this.rect(c, 18, -35, 3, 14, "#b66759");
          this.rect(c, 18, -34, 1, 10, "#d08a71");
        }
        this.rect(c, 9, -19, 19, 4, fabric.dark);
        this.rect(c, 9, -19, 19, 2, schoolUniform ? "#313d3d" : "#253d4d");
        this.rect(c, 17, -19, 4, 3, "#8d947e");
        this.rect(c, 18, -18, 2, 1, "#e1d6aa");
        this.rect(c, 23, -34, 4, 5, "#d0d8cd");
        this.rect(c, 23, -34, 4, 1, "#a5b8ae");
        if (!schoolUniform) this.rect(c, 24, -32, 2, 2, "#b99a62");
      } else if (uniform === 2) {
        if (schoolUniform) this.rect(c, 11, -41, 15, 5, fabric.base);
        this.rect(c, 8, -19, 21, 10, fabric.base);
        this.rect(c, 6, -10, 25, 3, fabric.base);
        this.rect(c, 9, -18, 2, 10, fabric.mid);
        this.rect(c, 27, -23, 2, 15, fabric.shadow);
        this.rect(c, 10, -8, 17, 1, fabric.light);
        this.rect(c, 14, -42, 8, 3, fabric.dark);
        this.rect(c, 20, -39, 5, 2, fabric.dark);
        this.rect(c, 24, -37, 2, 17, fabric.dark);
        for (const py of [-37, -32, -27]) {
          this.rect(c, 22, py, 5, 1, "#7992a8");
          this.rect(c, 24, py - 1, 1, 3, "#b1bdc3");
          this.rect(c, 23, py - 1, 1, 1, "#8da4b5");
          this.rect(c, 25, py + 1, 1, 1, "#8da4b5");
        }
        if (!schoolUniform) this.rect(c, 11, -29, 3, 4, "#d6bd81");
      } else {
        this.rect(c, 11, -42, 14, 3, fabric.dark);
        this.rect(c, 16, -39, 4, 17, "#e6e7cf");
        this.rect(c, 17, -38, 1, 14, "#f8f0dc");
        this.rect(c, 10, -19, 18, 6, fabric.dark);
        this.rect(c, 10, -19, 18, 2, "#2b5449");
        this.rect(c, 12, -18, 2, 5, "#8fab86");
        this.rect(c, 24, -36, 3, 4, "#dbce98");
        this.rect(c, 24, -35, 2, 2, "#f2e6b5");
        this.rect(c, 3, -35 + swing, 4, 2, "#dedfc8");
        this.rect(c, 30, -35 - swing, 4, 2, "#dedfc8");
      }
      if (["teacher", "principal", "office"].includes(look.costume)) {
        const jacket =
          look.costume === "principal"
            ? "#344b5f"
            : look.costume === "office"
              ? "#7a777a"
              : "#6a796a";
        this.rect(c, 7, -40, 7, 23, jacket);
        this.rect(c, 22, -40, 7, 23, jacket);
        this.rect(c, 8, -18, 20, 3, jacket);
        this.rect(c, 8, -39, 2, 17, "#939c8d");
        this.rect(c, 24, -37, 3, 19, "#465c55");
        this.rect(c, 12, -39, 3, 5, "#b9c0ac");
        this.rect(c, 21, -39, 3, 5, "#a6b39f");
        this.rect(c, 3, -38 + swing, 4, 12, jacket);
        this.rect(c, 30, -38 - swing, 4, 12, jacket);
        this.rect(c, 3, -27 + swing, 4, 2, "#e1e2cf");
        this.rect(c, 30, -27 - swing, 4, 2, "#e1e2cf");
        this.rect(c, 22, -28, 5, 1, "#c9c8ad");
        this.rect(c, 20, -23, 1, 2, "#b9b492");
      }
      if(schoolUniform&&selection===1){for(const [ax,offset]of [[3,swing],[30,-swing]]){this.rect(c,ax,-28+offset,4,8,fabric.base);this.rect(c,ax,-22+offset,4,2,fabric.shadow);}}
      // Stepped facial silhouette: brows, eye shine, nose and warm cheek shading.
      this.rect(c, 8, -66, 21, 21, ink);
      this.rect(c, 7, -61, 23, 14, ink);
      this.rect(c, 10, -46, 16, 3, ink);
      this.rect(c, 9, -64, 19, 18, tones.base);
      this.rect(c, 11, -46, 14, 2, tones.base);
      this.rect(c, 10, -62, 4, 14, tones.light);
      this.rect(c, 14, -62, 10, 3, tones.highlight);
      this.rect(c, 26, -59, 2, 11, tones.shadow);
      this.rect(c, 7, -56, 3, 6, tones.base);
      this.rect(c, 8, -54, 1, 3, tones.shadow);
      this.rect(c, 28, -55, 3, 5, tones.shadow);
      const eye = facing > 0 ? 17 : 11;
      this.rect(c, eye, -57, 4, 1, locks[1]);
      this.rect(c, eye + 7, -57, 3, 1, locks[1]);
      this.rect(c, eye, -55, 4, 3, "#f6f0d8");
      this.rect(c, eye + 7, -55, 3, 3, "#f6f0d8");
      this.rect(c, eye + (facing > 0 ? 2 : 0), -55, 2, 3, "#304947");
      this.rect(c, eye + 7 + (facing > 0 ? 1 : 0), -55, 2, 3, "#304947");
      this.rect(c, eye + (facing > 0 ? 2 : 0), -55, 1, 1, "#faf7e9");
      this.rect(c, eye + 3, -51, 2, 2, tones.shadow);
      this.rect(c, eye - 1, -50, 3, 1, tones.cheek);
      this.rect(c, eye + 9, -50, 2, 1, tones.cheek);
      this.rect(c, eye + 3, -47, 4, 1, tones.mouth);
      if (look.blink) {
        this.rect(c, eye, -55, 4, 3, tones.base);
        this.rect(c, eye + 7, -55, 3, 3, tones.base);
        this.rect(c, eye, -53, 4, 1, "#4b5146");
        this.rect(c, eye + 7, -53, 3, 1, "#4b5146");
      }
      if (look.glasses) {
        this.rect(c, eye - 1, -56, 6, 1, "#52605a");
        this.rect(c, eye - 1, -52, 6, 1, "#52605a");
        this.rect(c, eye - 1, -55, 1, 3, "#52605a");
        this.rect(c, eye + 4, -55, 1, 3, "#52605a");
        this.rect(c, eye + 6, -56, 6, 1, "#52605a");
        this.rect(c, eye + 6, -52, 6, 1, "#52605a");
        this.rect(c, eye + 6, -55, 1, 3, "#52605a");
        this.rect(c, eye + 11, -55, 1, 3, "#52605a");
        this.rect(c, eye + 4, -54, 3, 1, "#52605a");
      }
      // Both styles share a layered cap; short hair has sideburns, never a bob.
      this.rect(c, 10, -71, 15, 3, locks[0]);
      this.rect(c, 7, -68, 21, 6, locks[0]);
      this.rect(c, 6, -64, 24, 4, locks[0]);
      this.rect(c, 8, -68, 8, 3, locks[1]);
      this.rect(c, 10, -69, 9, 2, locks[2]);
      this.rect(c, 17, -67, 7, 2, locks[1]);
      this.rect(c, 9, -65, 5, 3, locks[2]);
      this.rect(c, 7, -61, 4, 7, locks[0]);
      this.rect(c, 8, -62, 3, 3, locks[1]);
      this.rect(c, 26, -62, 3, 7, locks[0]);
      this.rect(c, 11, -61, 4, 3, locks[0]);
      this.rect(c, 15, -62, 3, 2, locks[1]);
      this.rect(c, 23, -62, 3, 3, locks[0]);
      if (!hair) {
        this.rect(c, 24, -67, 5, 4, locks[0]);
        this.rect(c, 26, -65, 3, 3, locks[1]);
        this.rect(c, 8, -70, 5, 3, locks[0]);
        this.rect(c, 9, -69, 4, 1, locks[2]);
      } else {
        this.rect(c, 9, -64, 3, 4, locks[1]);
        this.rect(c, 12, -63, 3, 2, locks[2]);
      }
      c.restore();
    }
    characterHeight(look = {}) {
      const registry = window.CAMPUS_CHARACTERS;
      const doorHeight = registry?.sceneScale?.[this.location] || 229;
      const identity = registry?.resolve(look.identityId);
      const adult = Boolean(look.adult || identity?.adult);
      const relativeHeight = identity?.heightCm ? identity.heightCm / (adult ? 174 : 168) : 1;
      return doorHeight * (adult ? registry?.proportions?.adultToDoor || 0.89 : registry?.proportions?.studentToDoor || 0.82) * relativeHeight;
    }
    strideDistance(look) {
      return this.characterHeight(look) * (window.CAMPUS_CHARACTERS?.proportions?.strideToHeight || 0.75);
    }
    groundY() {
      const value =
        window.CAMPUS_ART &&
        window.CAMPUS_ART[this.location] &&
        window.CAMPUS_ART[this.location].groundY;
      return Number.isFinite(value)
        ? Math.max(350, Math.min(466, value))
        : GROUND;
    }
    setTalking(id, talking = true) {
      const canonical = window.CAMPUS_CHARACTERS?.resolve(id)?.id;
      this.talkingId = talking ? id : null;
      for (const actor of this.npcs()) {
        if (talking && (actor.id === id || actor.characterId === canonical)) {
          actor.state = 'converse'; actor.speed = 0;
          actor.direction = this.x < actor.x ? -1 : 1;
        } else if (actor.state === 'converse') {
          actor.state = 'stop'; actor.speed = 0; actor.phase = 0;
          actor.nextChange = this.time + MOTION.npcRest;
        }
      }
      this.render();
    }
    refreshArt() {
      this.render();
    }
    drawRasterBackground(c, cam) {
      const art = window.CAMPUS_ART && window.CAMPUS_ART[this.location];
      if (!art || !art.src) return false;
      const img = requestRaster(art.src, this._onAssetReady);
      if (!img) return false;
      const cols = art.cols || 1,
        rows = art.rows || 1,
        sw = img.naturalWidth / cols,
        sh = img.naturalHeight / rows;
      const sx = (art.col || 0) * sw,
        sy = (art.row || 0) * sh,
        scale = H / sh,
        worldWidth = this.scenes[this.location].width;
      const drawnWidth = sw * scale,
        offset = (worldWidth - drawnWidth) / 2;
      c.drawImage(
        img,
        sx,
        sy,
        sw,
        sh,
        Math.round(offset - cam),
        0,
        drawnWidth,
        H,
      );
      return true;
    }
    entranceLabel(door) {
      const roomLabels = {
        chinese: { zh: '中文課室', cn: '中文课室', en: 'Chinese' },
        english: { zh: '英語課室', cn: '英语课室', en: 'English' },
        maths: { zh: '數學課室', cn: '数学课室', en: 'Mathematics' },
      };
      if (roomLabels[door.id]) return this.word(roomLabels[door.id]);
      if (this.scenes[this.location].kind === 'room') {
        const floor = this.scenes[this.location].floor;
        return (floor ? floor + 'F' : 'G') + (this.isEnglish() ? ' · CORRIDOR' : ' · 走廊');
      }
      return this.word(door.label);
    }
    mountedPlaque(c, label, x, top, width) {
      const left = Math.round(x - width / 2), y = Math.round(top), h = 28;
      // Opaque enamel, two-step corners, a brass inset and four fixing pins.
      const step = (px, py, w, height, color) => {
        this.rect(c, px + 4, py, w - 8, height, color);
        this.rect(c, px, py + 4, w, height - 8, color);
        this.rect(c, px + 2, py + 2, w - 4, height - 4, color);
      };
      step(left + 1, y + 3, width, h, 'rgba(34,51,42,.25)');
      step(left, y, width, h, '#153f3c');
      step(left + 2, y + 2, width - 4, h - 4, '#d5b66b');
      step(left + 3, y + 3, width - 6, h - 6, '#fff8e4');
      for (const offset of [6, width - 8]) {
        this.rect(c, left + offset, y + 6, 2, 2, '#b48d43');
        this.rect(c, left + offset, y + h - 8, 2, 2, '#b48d43');
      }
      let size = 10.5;
      const pixelFont = this.lang === 'cn' ? 'Campus Fusion Pixel SC' : 'Campus Fusion Pixel HK';
      c.font = `${size}px "${pixelFont}", monospace`;
      while (size > 7 && c.measureText(label).width > width - 22) {
        size -= .5;
        c.font = `${size}px "${pixelFont}", monospace`;
      }
      c.fillStyle = '#153f3c'; c.textAlign = 'center'; c.textBaseline = 'middle';
      c.fillText(label, Math.round(x), y + h / 2 + .5);
    }
    drawArtEntrances(c, scene, cam, ground) {
      for (const door of scene.doors) {
        const x = door.x - cam, w = door.plaqueWidth || 140;
        if (x + w / 2 < 0 || x - w / 2 > this.viewWidth) continue;
        // A real wall object: camera motion never moves it away from its doorway.
        const top = door.plaqueTop ?? Math.max(8, (door.artTop || ground - 240) + 22);
        this.mountedPlaque(c, this.entranceLabel(door), x, top, w);
        const close = Math.abs(this.x - door.x) < 90;
        this.rect(c, x - 13, ground - 17, 27, 3, close ? '#f3d687' : '#dce3bf');
        this.rect(c, x - 8, ground - 21, 17, 3, close ? '#f3d687' : '#dce3bf');
        this.rect(c, x - 3, ground - 25, 7, 3, close ? '#f3d687' : '#dce3bf');
      }
    }
    drawAtlasCharacter(c, x, y, look, walking, phase, direction, npc) {
      const selected = registeredFrame(look, walking, phase, npc, this.getAvatar() || {});
      if (selected) {
        const img = requestRaster(selected.atlas.src, this._onAssetReady);
        if (img && selected.frame) {
          const { frame, character, atlas, identity } = selected;
          // One identity has ONE scale, including bent knees and talking poses.
          const scale = this.characterHeight(look) / identity.standingHeight;
          const mirror = atlas.facing === 'left' ? direction > 0 : direction < 0;
          c.save(); c.translate(Math.round(x), Math.round(y));
          if (mirror) c.scale(-1, 1);
          c.drawImage(npc ? img : skinRaster(img, atlas, look.skin), frame.x, frame.y, frame.w, frame.h,
            Math.round((frame.x - frame.anchorX) * scale),
            -Math.round((frame.baseline - frame.y) * scale),
            Math.round(frame.w * scale), Math.round(frame.h * scale));
          c.restore();
          return true;
        }
      }
      const character = npc && window.CAMPUS_CHARACTERS?.resolve(look.identityId);
      if (character?.adult) return false; // Never borrow another teacher's body.
      const atlas = CHARACTER_ATLASES[npc ? 4 : playerAtlasIndex(look)];
      const img = requestRaster(atlas.src, this._onAssetReady);
      if (!img) return false;
      const col = npc ? Math.max(0, Math.min(9, look.rasterColumn || 0))
        : (Number(look.hair) > 0 ? 3 : 0) + Math.max(0, Math.min(2, Number(look.skin) || 0));
      let row = 0;
      if (npc) row = look.talking ? 1 : 0;
      else if (walking) row = [1, 0, 2, 0][Math.floor((((phase % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)) / (Math.PI / 2))];
      const frame = atlas.frames[row * atlas.cols + col], standing = atlas.frames[col];
      if (!frame || !standing) return false;
      const height = this.characterHeight(look);
      const scale = height / standing.h, mirror = npc ? direction > 0 : direction < 0;
      c.save(); c.translate(Math.round(x), Math.round(y));
      if (mirror) c.scale(-1, 1);
      c.drawImage(img, frame.x, frame.y, frame.w, frame.h,
        Math.round((frame.x - frame.anchorX) * scale),
        -Math.round((frame.baseline - frame.y) * scale),
        Math.round(frame.w * scale), Math.round(frame.h * scale));
      c.restore();
      return true;
    }
    worldSprite(
      c,
      x,
      y,
      look,
      walking = false,
      phase = 0,
      direction = 1,
      npc = false,
    ) {
      if (
        this.drawAtlasCharacter(c, x, y, look, walking, phase, direction, npc)
      )
        return;
      // Procedural fallback remains available when an asset cannot load.
      const buffer = this.spriteBuffer,
        ctx = this.spriteContext,
        fallbackScale = this.characterHeight(look) / 72;
      ctx.clearRect(0, 0, 48, 88);
      ctx.imageSmoothingEnabled = false;
      this.sprite(ctx, 24, 78, look, walking, phase, direction, npc);
      c.drawImage(
        buffer,
        Math.round(x - 24 * fallbackScale),
        Math.round(y - 78 * fallbackScale),
        Math.round(48 * fallbackScale),
        Math.round(88 * fallbackScale),
      );
    }
    drawAmbient(c, actor, cam, ground) {
      const x = actor.x - cam;
      const height = this.characterHeight(actor.look);
      if (x < -100 || x > this.viewWidth + 100) return;
      const npc = Boolean(actor.look.identityId);
      const look = !npc ? { ...actor.look, uniform: window.CAMPUS_CHARACTERS?.player(this.getAvatar() || {}).uniform ?? 0 } : actor.look;
      this.worldSprite(c, x, ground + actor.depth, look, actor.state === 'walk' && Math.abs(actor.speed) > 0.1, actor.phase, actor.direction, npc);
      if (actor.activity === 'reading') {
        this.rect(c, x - 13, ground + actor.depth - height * 0.55, 25, 16, '#596d8b');
        this.rect(c, x - 10, ground + actor.depth - height * 0.55 + 2, 19, 12, '#f4ecd8');
        this.rect(c, x - 1, ground + actor.depth - height * 0.55 + 2, 1, 12, '#bcae91');
      }
      if (actor.activity === 'chat') {
        this.frostPanel(c, x + 17, ground + actor.depth - height + 12, 29, 18, false, 7);
        this.text(c, '···', x + 32, ground + actor.depth - height + 21, 13, '#617b79');
      }
    }
    render() {
      if (this.destroyed || !this.ctx) return;
      const c = this.ctx;
      c.setTransform(this.dpr || 1, 0, 0, this.dpr || 1, 0, 0);
      c.clearRect(0, 0, this.viewWidth, H);
      c.imageSmoothingEnabled = false;
      const cam = Math.round(this.camera),
        ground = this.groundY(),
        usingArt = this.drawRasterBackground(c, cam);
      if (!usingArt) {
        if (!this.backgrounds.has(this.location))
          this.backgrounds.set(this.location, this.makeBackground());
        c.drawImage(
          this.backgrounds.get(this.location),
          cam,
          0,
          this.viewWidth,
          H,
          0,
          0,
          this.viewWidth,
          H,
        );
      }
      const scene = this.scenes[this.location], progress = this.getProgress() || {}, npcs = this.npcs();
      for (const actor of scene.ambient) this.drawAmbient(c, actor, cam, ground);
      for (const [index, npc] of npcs.entries()) {
        const nx = npc.x - cam;
        if (nx < -100 || nx > this.viewWidth + 100) continue;
        const active = !this.paused && !this.reducedMotion;
        const blink = active && (this.time + (npc.homeX % 5)) % 5.2 < 0.13;
        this.worldSprite(c, nx, ground, { ...npc.look, blink, talking: npc.state === 'converse' },
          npc.state === 'walk' && Math.abs(npc.speed) > 0.1, npc.phase, npc.direction, true);
        const state = progress[npc.id], completed = Boolean(state && (state === true || state.completed || state.done));
        const pulse = active ? Math.round(Math.sin(this.time * 2.5 + index) * 2) : 0;
        const badgeTop = ground - this.characterHeight(npc.look) - 40 + pulse;
        this.frostPanel(c, nx - 13, badgeTop, 26, 25, completed, 9);
        this.text(c, completed ? '✓' : '!', nx, badgeTop + 13, 16, completed ? '#327e69' : '#577086');
      }
      this.worldSprite(
        c,
        this.x - cam,
        ground + this.depth,
        this.getAvatar() || {},
        this.walking,
        this.phase,
        this.direction,
      );
      if (usingArt) this.drawArtEntrances(c, scene, cam, ground);
      if (this.location === "corridor") {
        const gx = scene.doors.find((d) => d.id === "exit").x - cam,
          unlocked = Boolean(progress.exitUnlocked);
        this.frostPanel(c, gx - 40, ground - 171, 81, 27, unlocked);
        this.text(
          c,
          unlocked ? "★ 100 / 100" : "★ 100",
          gx,
          ground - 158,
          11,
          unlocked ? "#327e69" : "#466276",
        );
      }
      const nearNpc = npcs.some((n) => Math.abs(this.x - n.x) < MOTION.interactionRange),
        nearDoor = scene.doors.find((d) => Math.abs(this.x - d.x) < MOTION.interactionRange);
      if (!this.paused && (nearNpc || nearDoor)) {
        const action = nearNpc ? (this.isEnglish() ? 'Talk' : this.lang === 'cn' ? '对话' : '對話')
          : (this.isEnglish() ? 'Enter' : this.lang === 'cn' ? '进入' : '進入');
        const label = this.inputMode === "pointer"
          ? (this.isEnglish() ? "Tap · " : "輕觸 · ") + action
          : "E / Enter · " + action;
        const width = Math.min(this.viewWidth - 18, this.inputMode === "pointer" ? 118 : 174);
        const px = Math.max(width / 2 + 9, Math.min(this.viewWidth - width / 2 - 9, this.x - cam));
        const top = Math.min(H - 34, ground + 37);
        this.frostPanel(c, px - width / 2, top, width, 27, true);
        this.text(c, label, px, top + 14, 10, "#314959");
      }
      const ambient = c.createLinearGradient(0, 0, this.viewWidth, H);
      ambient.addColorStop(0, "rgba(255,234,173,.08)");
      ambient.addColorStop(1, "rgba(43,82,77,.025)");
      c.fillStyle = ambient;
      c.fillRect(0, 0, this.viewWidth, H);
      if (document.activeElement === this.canvas && !this.paused) {
        this.rect(c, 0, H - 3, this.viewWidth, 3, "#a8c4ae");
      }
    }
  }
  window.CampusEngine = CampusEngine;
})();
