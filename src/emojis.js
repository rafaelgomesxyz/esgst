const EMOJIS = [
  {
    "emoji": "¯\\\\\\_(ツ)_/¯",
    "entity": "&#xAF&#x5C&#x5C&#x5C&#x5F&#x28&#x30C4&#x29&#x5F&#x2F&#xAF",
    "name": ""
  },
  {
    "emoji": "( ͡° ͜ʖ ͡°)",
    "entity": "&#x28&#x20&#x361&#xB0&#x20&#x35C&#x296&#x20&#x361&#xB0&#x29",
    "name": ""
  },
  {
    "emoji": "( ͡⊙ ͜ʖ ͡⊙)",
    "entity": "&#x28&#x20&#x361&#x2299&#x20&#x35C&#x296&#x20&#x361&#x2299&#x29",
    "name": ""
  },
  {
    "emoji": "(ノಠ益ಠ)ノ",
    "entity": "&#x28&#x30CE&#xCA0&#x76CA&#xCA0&#x29&#x30CE",
    "name": ""
  },
  {
    "emoji": "(╯°□°）╯︵ ┻━┻",
    "entity": "&#x28&#x256F&#xB0&#x25A1&#xB0&#xFF09&#x256F&#xFE35&#x20&#x253B&#x2501&#x253B",
    "name": ""
  },
  {
    "emoji": "┬─┬ノ( º _ ºノ)",
    "entity": "&#x252C&#x2500&#x252C&#x30CE&#x28&#x20&#xBA&#x20&#x5F&#x20&#xBA&#x30CE&#x29",
    "name": ""
  },
  {
    "emoji": "ლ(ಠ益ಠლ)",
    "entity": "&#x10DA&#x28&#xCA0&#x76CA&#xCA0&#x10DA&#x29",
    "name": ""
  },
  {
    "emoji": "(◕‿-)✌",
    "entity": "&#x28&#x25D5&#x203F&#x2D&#x29&#x270C",
    "name": ""
  },
  {
    "emoji": "(｡◕‿◕｡)",
    "entity": "&#x28&#xFF61&#x25D5&#x203F&#x25D5&#xFF61&#x29",
    "name": ""
  },
  {
    "emoji": "(◑‿◐)",
    "entity": "&#x28&#x25D1&#x203F&#x25D0&#x29",
    "name": ""
  },
  {
    "emoji": "◔_◔",
    "entity": "&#x25D4&#x5F&#x25D4",
    "name": ""
  },
  {
    "emoji": "(•‿•)",
    "entity": "&#x28&#x2022&#x203F&#x2022&#x29",
    "name": ""
  },
  {
    "emoji": "(ಠ_ಠ)",
    "entity": "&#x28&#xCA0&#x5F&#xCA0&#x29",
    "name": ""
  },
  {
    "emoji": "(¬､¬)",
    "entity": "&#x28&#xAC&#xFF64&#xAC&#x29",
    "name": ""
  },
  {
    "emoji": "(─‿‿─)",
    "entity": "&#x28&#x2500&#x203F&#x203F&#x2500&#x29",
    "name": ""
  },
  {
    "emoji": "(ಥ﹏ಥ)",
    "entity": "&#x28&#xCA5&#xFE4F&#xCA5&#x29",
    "name": ""
  },
  {
    "emoji": "(ಥ‸ಥ)",
    "entity": "&#x28&#xCA5&#x2038&#xCA5&#x29",
    "name": ""
  },
  {
    "emoji": "(⌐■_■)",
    "entity": "&#x28&#x2310&#x25A0&#x5F&#x25A0&#x29",
    "name": ""
  },
  {
    "emoji": "(▰˘◡˘▰)",
    "entity": "&#x28&#x25B0&#x2D8&#x25E1&#x2D8&#x25B0&#x29",
    "name": ""
  },
  {
    "emoji": "乁( ◔ ౪◔)ㄏ",
    "entity": "&#x4E41&#x28&#x20&#x25D4&#x20&#xC6A&#x25D4&#x29&#x310F",
    "name": ""
  },
  {
    "emoji": "(ง ͠° ͟ʖ ͡°)ง",
    "entity": "&#x28&#xE07&#x20&#x360&#xB0&#x20&#x35F&#x296&#x20&#x361&#xB0&#x29&#xE07",
    "name": ""
  },
  {
    "emoji": "ζ༼Ɵ͆ل͜Ɵ͆༽ᶘ",
    "entity": "&#x3B6&#xF3C&#x19F&#x346&#x644&#x35C&#x19F&#x346&#xF3D&#x1D98",
    "name": ""
  },
  {
    "emoji": "ʕ•ᴥ•ʔ",
    "entity": "&#x295&#x2022&#x1D25&#x2022&#x294",
    "name": ""
  },
  {
    "emoji": "( ͝° ͜ʖ͡°)",
    "entity": "&#x28&#x20&#x35D&#xB0&#x20&#x35C&#x296&#x361&#xB0&#x29",
    "name": ""
  },
  {
    "emoji": "(/ﾟДﾟ)/",
    "entity": "&#x28&#x2F&#xFF9F&#x414&#xFF9F&#x29&#x2F",
    "name": ""
  },
  {
    "emoji": "୧༼ಠ益ಠ༽୨",
    "entity": "&#xB67&#xF3C&#xCA0&#x76CA&#xCA0&#xF3D&#xB68",
    "name": ""
  },
  {
    "emoji": "(ง •̀_•́)ง",
    "entity": "&#x28&#xE07&#x20&#x2022&#x300&#x5F&#x2022&#x301&#x29&#xE07",
    "name": ""
  },
  {
    "emoji": "😀",
    "entity": "&#x1F600",
    "name": "Grinning Face"
  },
  {
    "emoji": "😃",
    "entity": "&#x1F603",
    "name": "Grinning Face With Big Eyes"
  },
  {
    "emoji": "😄",
    "entity": "&#x1F604",
    "name": "Grinning Face With Smiling Eyes"
  },
  {
    "emoji": "😁",
    "entity": "&#x1F601",
    "name": "Beaming Face With Smiling Eyes"
  },
  {
    "emoji": "😆",
    "entity": "&#x1F606",
    "name": "Grinning Squinting Face"
  },
  {
    "emoji": "😅",
    "entity": "&#x1F605",
    "name": "Grinning Face With Sweat"
  },
  {
    "emoji": "🤣",
    "entity": "&#x1F923",
    "name": "Rolling On The Floor Laughing"
  },
  {
    "emoji": "😂",
    "entity": "&#x1F602",
    "name": "Face With Tears Of Joy"
  },
  {
    "emoji": "🙂",
    "entity": "&#x1F642",
    "name": "Slightly Smiling Face"
  },
  {
    "emoji": "🙃",
    "entity": "&#x1F643",
    "name": "Upside-down Face"
  },
  {
    "emoji": "😉",
    "entity": "&#x1F609",
    "name": "Winking Face"
  },
  {
    "emoji": "😊",
    "entity": "&#x1F60A",
    "name": "Smiling Face With Smiling Eyes"
  },
  {
    "emoji": "😇",
    "entity": "&#x1F607",
    "name": "Smiling Face With Halo"
  },
  {
    "emoji": "🥰",
    "entity": "&#x1F970",
    "name": "Smiling Face With Hearts"
  },
  {
    "emoji": "😍",
    "entity": "&#x1F60D",
    "name": "Smiling Face With Heart-eyes"
  },
  {
    "emoji": "🤩",
    "entity": "&#x1F929",
    "name": "Star-struck"
  },
  {
    "emoji": "😘",
    "entity": "&#x1F618",
    "name": "Face Blowing A Kiss"
  },
  {
    "emoji": "😗",
    "entity": "&#x1F617",
    "name": "Kissing Face"
  },
  {
    "emoji": "☺",
    "entity": "&#x263A",
    "name": "Smiling Face"
  },
  {
    "emoji": "😚",
    "entity": "&#x1F61A",
    "name": "Kissing Face With Closed Eyes"
  },
  {
    "emoji": "😙",
    "entity": "&#x1F619",
    "name": "Kissing Face With Smiling Eyes"
  },
  {
    "emoji": "😋",
    "entity": "&#x1F60B",
    "name": "Face Savoring Food"
  },
  {
    "emoji": "😛",
    "entity": "&#x1F61B",
    "name": "Face With Tongue"
  },
  {
    "emoji": "😜",
    "entity": "&#x1F61C",
    "name": "Winking Face With Tongue"
  },
  {
    "emoji": "🤪",
    "entity": "&#x1F92A",
    "name": "Zany Face"
  },
  {
    "emoji": "😝",
    "entity": "&#x1F61D",
    "name": "Squinting Face With Tongue"
  },
  {
    "emoji": "🤑",
    "entity": "&#x1F911",
    "name": "Money-mouth Face"
  },
  {
    "emoji": "🤗",
    "entity": "&#x1F917",
    "name": "Hugging Face"
  },
  {
    "emoji": "🤭",
    "entity": "&#x1F92D",
    "name": "Face With Hand Over Mouth"
  },
  {
    "emoji": "🤫",
    "entity": "&#x1F92B",
    "name": "Shushing Face"
  },
  {
    "emoji": "🤔",
    "entity": "&#x1F914",
    "name": "Thinking Face"
  },
  {
    "emoji": "🤐",
    "entity": "&#x1F910",
    "name": "Zipper-mouth Face"
  },
  {
    "emoji": "🤨",
    "entity": "&#x1F928",
    "name": "Face With Raised Eyebrow"
  },
  {
    "emoji": "😐",
    "entity": "&#x1F610",
    "name": "Neutral Face"
  },
  {
    "emoji": "😑",
    "entity": "&#x1F611",
    "name": "Expressionless Face"
  },
  {
    "emoji": "😶",
    "entity": "&#x1F636",
    "name": "Face Without Mouth"
  },
  {
    "emoji": "😏",
    "entity": "&#x1F60F",
    "name": "Smirking Face"
  },
  {
    "emoji": "😒",
    "entity": "&#x1F612",
    "name": "Unamused Face"
  },
  {
    "emoji": "🙄",
    "entity": "&#x1F644",
    "name": "Face With Rolling Eyes"
  },
  {
    "emoji": "😬",
    "entity": "&#x1F62C",
    "name": "Grimacing Face"
  },
  {
    "emoji": "🤥",
    "entity": "&#x1F925",
    "name": "Lying Face"
  },
  {
    "emoji": "😌",
    "entity": "&#x1F60C",
    "name": "Relieved Face"
  },
  {
    "emoji": "😔",
    "entity": "&#x1F614",
    "name": "Pensive Face"
  },
  {
    "emoji": "😪",
    "entity": "&#x1F62A",
    "name": "Sleepy Face"
  },
  {
    "emoji": "🤤",
    "entity": "&#x1F924",
    "name": "Drooling Face"
  },
  {
    "emoji": "😴",
    "entity": "&#x1F634",
    "name": "Sleeping Face"
  },
  {
    "emoji": "😷",
    "entity": "&#x1F637",
    "name": "Face With Medical Mask"
  },
  {
    "emoji": "🤒",
    "entity": "&#x1F912",
    "name": "Face With Thermometer"
  },
  {
    "emoji": "🤕",
    "entity": "&#x1F915",
    "name": "Face With Head-bandage"
  },
  {
    "emoji": "🤢",
    "entity": "&#x1F922",
    "name": "Nauseated Face"
  },
  {
    "emoji": "🤮",
    "entity": "&#x1F92E",
    "name": "Face Vomiting"
  },
  {
    "emoji": "🤧",
    "entity": "&#x1F927",
    "name": "Sneezing Face"
  },
  {
    "emoji": "🥵",
    "entity": "&#x1F975",
    "name": "Hot Face"
  },
  {
    "emoji": "🥶",
    "entity": "&#x1F976",
    "name": "Cold Face"
  },
  {
    "emoji": "🥴",
    "entity": "&#x1F974",
    "name": "Woozy Face"
  },
  {
    "emoji": "😵",
    "entity": "&#x1F635",
    "name": "Dizzy Face"
  },
  {
    "emoji": "🤯",
    "entity": "&#x1F92F",
    "name": "Exploding Head"
  },
  {
    "emoji": "🤠",
    "entity": "&#x1F920",
    "name": "Cowboy Hat Face"
  },
  {
    "emoji": "🥳",
    "entity": "&#x1F973",
    "name": "Partying Face"
  },
  {
    "emoji": "😎",
    "entity": "&#x1F60E",
    "name": "Smiling Face With Sunglasses"
  },
  {
    "emoji": "🤓",
    "entity": "&#x1F913",
    "name": "Nerd Face"
  },
  {
    "emoji": "🧐",
    "entity": "&#x1F9D0",
    "name": "Face With Monocle"
  },
  {
    "emoji": "😕",
    "entity": "&#x1F615",
    "name": "Confused Face"
  },
  {
    "emoji": "😟",
    "entity": "&#x1F61F",
    "name": "Worried Face"
  },
  {
    "emoji": "🙁",
    "entity": "&#x1F641",
    "name": "Slightly Frowning Face"
  },
  {
    "emoji": "☹",
    "entity": "&#x2639",
    "name": "Frowning Face"
  },
  {
    "emoji": "😮",
    "entity": "&#x1F62E",
    "name": "Face With Open Mouth"
  },
  {
    "emoji": "😯",
    "entity": "&#x1F62F",
    "name": "Hushed Face"
  },
  {
    "emoji": "😲",
    "entity": "&#x1F632",
    "name": "Astonished Face"
  },
  {
    "emoji": "😳",
    "entity": "&#x1F633",
    "name": "Flushed Face"
  },
  {
    "emoji": "🥺",
    "entity": "&#x1F97A",
    "name": "Pleading Face"
  },
  {
    "emoji": "😦",
    "entity": "&#x1F626",
    "name": "Frowning Face With Open Mouth"
  },
  {
    "emoji": "😧",
    "entity": "&#x1F627",
    "name": "Anguished Face"
  },
  {
    "emoji": "😨",
    "entity": "&#x1F628",
    "name": "Fearful Face"
  },
  {
    "emoji": "😰",
    "entity": "&#x1F630",
    "name": "Anxious Face With Sweat"
  },
  {
    "emoji": "😥",
    "entity": "&#x1F625",
    "name": "Sad But Relieved Face"
  },
  {
    "emoji": "😢",
    "entity": "&#x1F622",
    "name": "Crying Face"
  },
  {
    "emoji": "😭",
    "entity": "&#x1F62D",
    "name": "Loudly Crying Face"
  },
  {
    "emoji": "😱",
    "entity": "&#x1F631",
    "name": "Face Screaming In Fear"
  },
  {
    "emoji": "😖",
    "entity": "&#x1F616",
    "name": "Confounded Face"
  },
  {
    "emoji": "😣",
    "entity": "&#x1F623",
    "name": "Persevering Face"
  },
  {
    "emoji": "😞",
    "entity": "&#x1F61E",
    "name": "Disappointed Face"
  },
  {
    "emoji": "😓",
    "entity": "&#x1F613",
    "name": "Downcast Face With Sweat"
  },
  {
    "emoji": "😩",
    "entity": "&#x1F629",
    "name": "Weary Face"
  },
  {
    "emoji": "😫",
    "entity": "&#x1F62B",
    "name": "Tired Face"
  },
  {
    "emoji": "🥱",
    "entity": "&#x1F971",
    "name": "⊛ Yawning Face"
  },
  {
    "emoji": "😤",
    "entity": "&#x1F624",
    "name": "Face With Steam From Nose"
  },
  {
    "emoji": "😡",
    "entity": "&#x1F621",
    "name": "Pouting Face"
  },
  {
    "emoji": "😠",
    "entity": "&#x1F620",
    "name": "Angry Face"
  },
  {
    "emoji": "🤬",
    "entity": "&#x1F92C",
    "name": "Face With Symbols On Mouth"
  },
  {
    "emoji": "😈",
    "entity": "&#x1F608",
    "name": "Smiling Face With Horns"
  },
  {
    "emoji": "👿",
    "entity": "&#x1F47F",
    "name": "Angry Face With Horns"
  },
  {
    "emoji": "💀",
    "entity": "&#x1F480",
    "name": "Skull"
  },
  {
    "emoji": "☠",
    "entity": "&#x2620",
    "name": "Skull And Crossbones"
  },
  {
    "emoji": "💩",
    "entity": "&#x1F4A9",
    "name": "Pile Of Poo"
  },
  {
    "emoji": "🤡",
    "entity": "&#x1F921",
    "name": "Clown Face"
  },
  {
    "emoji": "👹",
    "entity": "&#x1F479",
    "name": "Ogre"
  },
  {
    "emoji": "👺",
    "entity": "&#x1F47A",
    "name": "Goblin"
  },
  {
    "emoji": "👻",
    "entity": "&#x1F47B",
    "name": "Ghost"
  },
  {
    "emoji": "👽",
    "entity": "&#x1F47D",
    "name": "Alien"
  },
  {
    "emoji": "👾",
    "entity": "&#x1F47E",
    "name": "Alien Monster"
  },
  {
    "emoji": "🤖",
    "entity": "&#x1F916",
    "name": "Robot"
  },
  {
    "emoji": "😺",
    "entity": "&#x1F63A",
    "name": "Grinning Cat"
  },
  {
    "emoji": "😸",
    "entity": "&#x1F638",
    "name": "Grinning Cat With Smiling Eyes"
  },
  {
    "emoji": "😹",
    "entity": "&#x1F639",
    "name": "Cat With Tears Of Joy"
  },
  {
    "emoji": "😻",
    "entity": "&#x1F63B",
    "name": "Smiling Cat With Heart-eyes"
  },
  {
    "emoji": "😼",
    "entity": "&#x1F63C",
    "name": "Cat With Wry Smile"
  },
  {
    "emoji": "😽",
    "entity": "&#x1F63D",
    "name": "Kissing Cat"
  },
  {
    "emoji": "🙀",
    "entity": "&#x1F640",
    "name": "Weary Cat"
  },
  {
    "emoji": "😿",
    "entity": "&#x1F63F",
    "name": "Crying Cat"
  },
  {
    "emoji": "😾",
    "entity": "&#x1F63E",
    "name": "Pouting Cat"
  },
  {
    "emoji": "🙈",
    "entity": "&#x1F648",
    "name": "See-no-evil Monkey"
  },
  {
    "emoji": "🙉",
    "entity": "&#x1F649",
    "name": "Hear-no-evil Monkey"
  },
  {
    "emoji": "🙊",
    "entity": "&#x1F64A",
    "name": "Speak-no-evil Monkey"
  },
  {
    "emoji": "💋",
    "entity": "&#x1F48B",
    "name": "Kiss Mark"
  },
  {
    "emoji": "💌",
    "entity": "&#x1F48C",
    "name": "Love Letter"
  },
  {
    "emoji": "💘",
    "entity": "&#x1F498",
    "name": "Heart With Arrow"
  },
  {
    "emoji": "💝",
    "entity": "&#x1F49D",
    "name": "Heart With Ribbon"
  },
  {
    "emoji": "💖",
    "entity": "&#x1F496",
    "name": "Sparkling Heart"
  },
  {
    "emoji": "💗",
    "entity": "&#x1F497",
    "name": "Growing Heart"
  },
  {
    "emoji": "💓",
    "entity": "&#x1F493",
    "name": "Beating Heart"
  },
  {
    "emoji": "💞",
    "entity": "&#x1F49E",
    "name": "Revolving Hearts"
  },
  {
    "emoji": "💕",
    "entity": "&#x1F495",
    "name": "Two Hearts"
  },
  {
    "emoji": "💟",
    "entity": "&#x1F49F",
    "name": "Heart Decoration"
  },
  {
    "emoji": "❣",
    "entity": "&#x2763",
    "name": "Heart Exclamation"
  },
  {
    "emoji": "💔",
    "entity": "&#x1F494",
    "name": "Broken Heart"
  },
  {
    "emoji": "❤",
    "entity": "&#x2764",
    "name": "Red Heart"
  },
  {
    "emoji": "🧡",
    "entity": "&#x1F9E1",
    "name": "Orange Heart"
  },
  {
    "emoji": "💛",
    "entity": "&#x1F49B",
    "name": "Yellow Heart"
  },
  {
    "emoji": "💚",
    "entity": "&#x1F49A",
    "name": "Green Heart"
  },
  {
    "emoji": "💙",
    "entity": "&#x1F499",
    "name": "Blue Heart"
  },
  {
    "emoji": "💜",
    "entity": "&#x1F49C",
    "name": "Purple Heart"
  },
  {
    "emoji": "🤎",
    "entity": "&#x1F90E",
    "name": "⊛ Brown Heart"
  },
  {
    "emoji": "🖤",
    "entity": "&#x1F5A4",
    "name": "Black Heart"
  },
  {
    "emoji": "🤍",
    "entity": "&#x1F90D",
    "name": "⊛ White Heart"
  },
  {
    "emoji": "💯",
    "entity": "&#x1F4AF",
    "name": "Hundred Points"
  },
  {
    "emoji": "💢",
    "entity": "&#x1F4A2",
    "name": "Anger Symbol"
  },
  {
    "emoji": "💥",
    "entity": "&#x1F4A5",
    "name": "Collision"
  },
  {
    "emoji": "💫",
    "entity": "&#x1F4AB",
    "name": "Dizzy"
  },
  {
    "emoji": "💦",
    "entity": "&#x1F4A6",
    "name": "Sweat Droplets"
  },
  {
    "emoji": "💨",
    "entity": "&#x1F4A8",
    "name": "Dashing Away"
  },
  {
    "emoji": "🕳",
    "entity": "&#x1F573",
    "name": "Hole"
  },
  {
    "emoji": "💣",
    "entity": "&#x1F4A3",
    "name": "Bomb"
  },
  {
    "emoji": "💬",
    "entity": "&#x1F4AC",
    "name": "Speech Balloon"
  },
  {
    "emoji": "👁️‍🗨️",
    "entity": "&#x1F441&#xFE0F&#x200D&#x1F5E8&#xFE0F",
    "name": "Eye In Speech Bubble"
  },
  {
    "emoji": "🗨",
    "entity": "&#x1F5E8",
    "name": "Left Speech Bubble"
  },
  {
    "emoji": "🗯",
    "entity": "&#x1F5EF",
    "name": "Right Anger Bubble"
  },
  {
    "emoji": "💭",
    "entity": "&#x1F4AD",
    "name": "Thought Balloon"
  },
  {
    "emoji": "💤",
    "entity": "&#x1F4A4",
    "name": "Zzz"
  },
  {
    "emoji": "👋",
    "entity": "&#x1F44B",
    "name": "Waving Hand"
  },
  {
    "emoji": "🤚",
    "entity": "&#x1F91A",
    "name": "Raised Back Of Hand"
  },
  {
    "emoji": "🖐",
    "entity": "&#x1F590",
    "name": "Hand With Fingers Splayed"
  },
  {
    "emoji": "✋",
    "entity": "&#x270B",
    "name": "Raised Hand"
  },
  {
    "emoji": "🖖",
    "entity": "&#x1F596",
    "name": "Vulcan Salute"
  },
  {
    "emoji": "👌",
    "entity": "&#x1F44C",
    "name": "OK Hand"
  },
  {
    "emoji": "🤏",
    "entity": "&#x1F90F",
    "name": "⊛ Pinching Hand"
  },
  {
    "emoji": "✌",
    "entity": "&#x270C",
    "name": "Victory Hand"
  },
  {
    "emoji": "🤞",
    "entity": "&#x1F91E",
    "name": "Crossed Fingers"
  },
  {
    "emoji": "🤟",
    "entity": "&#x1F91F",
    "name": "Love-you Gesture"
  },
  {
    "emoji": "🤘",
    "entity": "&#x1F918",
    "name": "Sign Of The Horns"
  },
  {
    "emoji": "🤙",
    "entity": "&#x1F919",
    "name": "Call Me Hand"
  },
  {
    "emoji": "👈",
    "entity": "&#x1F448",
    "name": "Backhand Index Pointing Left"
  },
  {
    "emoji": "👉",
    "entity": "&#x1F449",
    "name": "Backhand Index Pointing Right"
  },
  {
    "emoji": "👆",
    "entity": "&#x1F446",
    "name": "Backhand Index Pointing Up"
  },
  {
    "emoji": "🖕",
    "entity": "&#x1F595",
    "name": "Middle Finger"
  },
  {
    "emoji": "👇",
    "entity": "&#x1F447",
    "name": "Backhand Index Pointing Down"
  },
  {
    "emoji": "☝",
    "entity": "&#x261D",
    "name": "Index Pointing Up"
  },
  {
    "emoji": "👍",
    "entity": "&#x1F44D",
    "name": "Thumbs Up"
  },
  {
    "emoji": "👎",
    "entity": "&#x1F44E",
    "name": "Thumbs Down"
  },
  {
    "emoji": "✊",
    "entity": "&#x270A",
    "name": "Raised Fist"
  },
  {
    "emoji": "👊",
    "entity": "&#x1F44A",
    "name": "Oncoming Fist"
  },
  {
    "emoji": "🤛",
    "entity": "&#x1F91B",
    "name": "Left-facing Fist"
  },
  {
    "emoji": "🤜",
    "entity": "&#x1F91C",
    "name": "Right-facing Fist"
  },
  {
    "emoji": "👏",
    "entity": "&#x1F44F",
    "name": "Clapping Hands"
  },
  {
    "emoji": "🙌",
    "entity": "&#x1F64C",
    "name": "Raising Hands"
  },
  {
    "emoji": "👐",
    "entity": "&#x1F450",
    "name": "Open Hands"
  },
  {
    "emoji": "🤲",
    "entity": "&#x1F932",
    "name": "Palms Up Together"
  },
  {
    "emoji": "🤝",
    "entity": "&#x1F91D",
    "name": "Handshake"
  },
  {
    "emoji": "🙏",
    "entity": "&#x1F64F",
    "name": "Folded Hands"
  },
  {
    "emoji": "✍",
    "entity": "&#x270D",
    "name": "Writing Hand"
  },
  {
    "emoji": "💅",
    "entity": "&#x1F485",
    "name": "Nail Polish"
  },
  {
    "emoji": "🤳",
    "entity": "&#x1F933",
    "name": "Selfie"
  },
  {
    "emoji": "💪",
    "entity": "&#x1F4AA",
    "name": "Flexed Biceps"
  },
  {
    "emoji": "🦾",
    "entity": "&#x1F9BE",
    "name": "⊛ Mechanical Arm"
  },
  {
    "emoji": "🦿",
    "entity": "&#x1F9BF",
    "name": "⊛ Mechanical Leg"
  },
  {
    "emoji": "🦵",
    "entity": "&#x1F9B5",
    "name": "Leg"
  },
  {
    "emoji": "🦶",
    "entity": "&#x1F9B6",
    "name": "Foot"
  },
  {
    "emoji": "👂",
    "entity": "&#x1F442",
    "name": "Ear"
  },
  {
    "emoji": "🦻",
    "entity": "&#x1F9BB",
    "name": "⊛ Ear With Hearing Aid"
  },
  {
    "emoji": "👃",
    "entity": "&#x1F443",
    "name": "Nose"
  },
  {
    "emoji": "🧠",
    "entity": "&#x1F9E0",
    "name": "Brain"
  },
  {
    "emoji": "🦷",
    "entity": "&#x1F9B7",
    "name": "Tooth"
  },
  {
    "emoji": "🦴",
    "entity": "&#x1F9B4",
    "name": "Bone"
  },
  {
    "emoji": "👀",
    "entity": "&#x1F440",
    "name": "Eyes"
  },
  {
    "emoji": "👁",
    "entity": "&#x1F441",
    "name": "Eye"
  },
  {
    "emoji": "👅",
    "entity": "&#x1F445",
    "name": "Tongue"
  },
  {
    "emoji": "👄",
    "entity": "&#x1F444",
    "name": "Mouth"
  },
  {
    "emoji": "👶",
    "entity": "&#x1F476",
    "name": "Baby"
  },
  {
    "emoji": "🧒",
    "entity": "&#x1F9D2",
    "name": "Child"
  },
  {
    "emoji": "👦",
    "entity": "&#x1F466",
    "name": "Boy"
  },
  {
    "emoji": "👧",
    "entity": "&#x1F467",
    "name": "Girl"
  },
  {
    "emoji": "🧑",
    "entity": "&#x1F9D1",
    "name": "Person"
  },
  {
    "emoji": "👱",
    "entity": "&#x1F471",
    "name": "Person: Blond Hair"
  },
  {
    "emoji": "👨",
    "entity": "&#x1F468",
    "name": "Man"
  },
  {
    "emoji": "🧔",
    "entity": "&#x1F9D4",
    "name": "Man: Beard"
  },
  {
    "emoji": "👱‍♂️",
    "entity": "&#x1F471&#x200D&#x2642&#xFE0F",
    "name": "Man: Blond Hair"
  },
  {
    "emoji": "👨‍🦰",
    "entity": "&#x1F468&#x200D&#x1F9B0",
    "name": "Man: Red Hair"
  },
  {
    "emoji": "👨‍🦱",
    "entity": "&#x1F468&#x200D&#x1F9B1",
    "name": "Man: Curly Hair"
  },
  {
    "emoji": "👨‍🦳",
    "entity": "&#x1F468&#x200D&#x1F9B3",
    "name": "Man: White Hair"
  },
  {
    "emoji": "👨‍🦲",
    "entity": "&#x1F468&#x200D&#x1F9B2",
    "name": "Man: Bald"
  },
  {
    "emoji": "👩",
    "entity": "&#x1F469",
    "name": "Woman"
  },
  {
    "emoji": "👱‍♀️",
    "entity": "&#x1F471&#x200D&#x2640&#xFE0F",
    "name": "Woman: Blond Hair"
  },
  {
    "emoji": "👩‍🦰",
    "entity": "&#x1F469&#x200D&#x1F9B0",
    "name": "Woman: Red Hair"
  },
  {
    "emoji": "👩‍🦱",
    "entity": "&#x1F469&#x200D&#x1F9B1",
    "name": "Woman: Curly Hair"
  },
  {
    "emoji": "👩‍🦳",
    "entity": "&#x1F469&#x200D&#x1F9B3",
    "name": "Woman: White Hair"
  },
  {
    "emoji": "👩‍🦲",
    "entity": "&#x1F469&#x200D&#x1F9B2",
    "name": "Woman: Bald"
  },
  {
    "emoji": "🧓",
    "entity": "&#x1F9D3",
    "name": "Older Person"
  },
  {
    "emoji": "👴",
    "entity": "&#x1F474",
    "name": "Old Man"
  },
  {
    "emoji": "👵",
    "entity": "&#x1F475",
    "name": "Old Woman"
  },
  {
    "emoji": "🙍",
    "entity": "&#x1F64D",
    "name": "Person Frowning"
  },
  {
    "emoji": "🙍‍♂️",
    "entity": "&#x1F64D&#x200D&#x2642&#xFE0F",
    "name": "Man Frowning"
  },
  {
    "emoji": "🙍‍♀️",
    "entity": "&#x1F64D&#x200D&#x2640&#xFE0F",
    "name": "Woman Frowning"
  },
  {
    "emoji": "🙎",
    "entity": "&#x1F64E",
    "name": "Person Pouting"
  },
  {
    "emoji": "🙎‍♂️",
    "entity": "&#x1F64E&#x200D&#x2642&#xFE0F",
    "name": "Man Pouting"
  },
  {
    "emoji": "🙎‍♀️",
    "entity": "&#x1F64E&#x200D&#x2640&#xFE0F",
    "name": "Woman Pouting"
  },
  {
    "emoji": "🙅",
    "entity": "&#x1F645",
    "name": "Person Gesturing NO"
  },
  {
    "emoji": "🙅‍♂️",
    "entity": "&#x1F645&#x200D&#x2642&#xFE0F",
    "name": "Man Gesturing NO"
  },
  {
    "emoji": "🙅‍♀️",
    "entity": "&#x1F645&#x200D&#x2640&#xFE0F",
    "name": "Woman Gesturing NO"
  },
  {
    "emoji": "🙆",
    "entity": "&#x1F646",
    "name": "Person Gesturing OK"
  },
  {
    "emoji": "🙆‍♂️",
    "entity": "&#x1F646&#x200D&#x2642&#xFE0F",
    "name": "Man Gesturing OK"
  },
  {
    "emoji": "🙆‍♀️",
    "entity": "&#x1F646&#x200D&#x2640&#xFE0F",
    "name": "Woman Gesturing OK"
  },
  {
    "emoji": "💁",
    "entity": "&#x1F481",
    "name": "Person Tipping Hand"
  },
  {
    "emoji": "💁‍♂️",
    "entity": "&#x1F481&#x200D&#x2642&#xFE0F",
    "name": "Man Tipping Hand"
  },
  {
    "emoji": "💁‍♀️",
    "entity": "&#x1F481&#x200D&#x2640&#xFE0F",
    "name": "Woman Tipping Hand"
  },
  {
    "emoji": "🙋",
    "entity": "&#x1F64B",
    "name": "Person Raising Hand"
  },
  {
    "emoji": "🙋‍♂️",
    "entity": "&#x1F64B&#x200D&#x2642&#xFE0F",
    "name": "Man Raising Hand"
  },
  {
    "emoji": "🙋‍♀️",
    "entity": "&#x1F64B&#x200D&#x2640&#xFE0F",
    "name": "Woman Raising Hand"
  },
  {
    "emoji": "🧏",
    "entity": "&#x1F9CF",
    "name": "⊛ Deaf Person"
  },
  {
    "emoji": "🧏‍♂️",
    "entity": "&#x1F9CF&#x200D&#x2642&#xFE0F",
    "name": "⊛ Deaf Man"
  },
  {
    "emoji": "🧏‍♀️",
    "entity": "&#x1F9CF&#x200D&#x2640&#xFE0F",
    "name": "⊛ Deaf Woman"
  },
  {
    "emoji": "🙇",
    "entity": "&#x1F647",
    "name": "Person Bowing"
  },
  {
    "emoji": "🙇‍♂️",
    "entity": "&#x1F647&#x200D&#x2642&#xFE0F",
    "name": "Man Bowing"
  },
  {
    "emoji": "🙇‍♀️",
    "entity": "&#x1F647&#x200D&#x2640&#xFE0F",
    "name": "Woman Bowing"
  },
  {
    "emoji": "🤦",
    "entity": "&#x1F926",
    "name": "Person Facepalming"
  },
  {
    "emoji": "🤦‍♂️",
    "entity": "&#x1F926&#x200D&#x2642&#xFE0F",
    "name": "Man Facepalming"
  },
  {
    "emoji": "🤦‍♀️",
    "entity": "&#x1F926&#x200D&#x2640&#xFE0F",
    "name": "Woman Facepalming"
  },
  {
    "emoji": "🤷",
    "entity": "&#x1F937",
    "name": "Person Shrugging"
  },
  {
    "emoji": "🤷‍♂️",
    "entity": "&#x1F937&#x200D&#x2642&#xFE0F",
    "name": "Man Shrugging"
  },
  {
    "emoji": "🤷‍♀️",
    "entity": "&#x1F937&#x200D&#x2640&#xFE0F",
    "name": "Woman Shrugging"
  },
  {
    "emoji": "👨‍⚕️",
    "entity": "&#x1F468&#x200D&#x2695&#xFE0F",
    "name": "Man Health Worker"
  },
  {
    "emoji": "👩‍⚕️",
    "entity": "&#x1F469&#x200D&#x2695&#xFE0F",
    "name": "Woman Health Worker"
  },
  {
    "emoji": "👨‍🎓",
    "entity": "&#x1F468&#x200D&#x1F393",
    "name": "Man Student"
  },
  {
    "emoji": "👩‍🎓",
    "entity": "&#x1F469&#x200D&#x1F393",
    "name": "Woman Student"
  },
  {
    "emoji": "👨‍🏫",
    "entity": "&#x1F468&#x200D&#x1F3EB",
    "name": "Man Teacher"
  },
  {
    "emoji": "👩‍🏫",
    "entity": "&#x1F469&#x200D&#x1F3EB",
    "name": "Woman Teacher"
  },
  {
    "emoji": "👨‍⚖️",
    "entity": "&#x1F468&#x200D&#x2696&#xFE0F",
    "name": "Man Judge"
  },
  {
    "emoji": "👩‍⚖️",
    "entity": "&#x1F469&#x200D&#x2696&#xFE0F",
    "name": "Woman Judge"
  },
  {
    "emoji": "👨‍🌾",
    "entity": "&#x1F468&#x200D&#x1F33E",
    "name": "Man Farmer"
  },
  {
    "emoji": "👩‍🌾",
    "entity": "&#x1F469&#x200D&#x1F33E",
    "name": "Woman Farmer"
  },
  {
    "emoji": "👨‍🍳",
    "entity": "&#x1F468&#x200D&#x1F373",
    "name": "Man Cook"
  },
  {
    "emoji": "👩‍🍳",
    "entity": "&#x1F469&#x200D&#x1F373",
    "name": "Woman Cook"
  },
  {
    "emoji": "👨‍🔧",
    "entity": "&#x1F468&#x200D&#x1F527",
    "name": "Man Mechanic"
  },
  {
    "emoji": "👩‍🔧",
    "entity": "&#x1F469&#x200D&#x1F527",
    "name": "Woman Mechanic"
  },
  {
    "emoji": "👨‍🏭",
    "entity": "&#x1F468&#x200D&#x1F3ED",
    "name": "Man Factory Worker"
  },
  {
    "emoji": "👩‍🏭",
    "entity": "&#x1F469&#x200D&#x1F3ED",
    "name": "Woman Factory Worker"
  },
  {
    "emoji": "👨‍💼",
    "entity": "&#x1F468&#x200D&#x1F4BC",
    "name": "Man Office Worker"
  },
  {
    "emoji": "👩‍💼",
    "entity": "&#x1F469&#x200D&#x1F4BC",
    "name": "Woman Office Worker"
  },
  {
    "emoji": "👨‍🔬",
    "entity": "&#x1F468&#x200D&#x1F52C",
    "name": "Man Scientist"
  },
  {
    "emoji": "👩‍🔬",
    "entity": "&#x1F469&#x200D&#x1F52C",
    "name": "Woman Scientist"
  },
  {
    "emoji": "👨‍💻",
    "entity": "&#x1F468&#x200D&#x1F4BB",
    "name": "Man Technologist"
  },
  {
    "emoji": "👩‍💻",
    "entity": "&#x1F469&#x200D&#x1F4BB",
    "name": "Woman Technologist"
  },
  {
    "emoji": "👨‍🎤",
    "entity": "&#x1F468&#x200D&#x1F3A4",
    "name": "Man Singer"
  },
  {
    "emoji": "👩‍🎤",
    "entity": "&#x1F469&#x200D&#x1F3A4",
    "name": "Woman Singer"
  },
  {
    "emoji": "👨‍🎨",
    "entity": "&#x1F468&#x200D&#x1F3A8",
    "name": "Man Artist"
  },
  {
    "emoji": "👩‍🎨",
    "entity": "&#x1F469&#x200D&#x1F3A8",
    "name": "Woman Artist"
  },
  {
    "emoji": "👨‍✈️",
    "entity": "&#x1F468&#x200D&#x2708&#xFE0F",
    "name": "Man Pilot"
  },
  {
    "emoji": "👩‍✈️",
    "entity": "&#x1F469&#x200D&#x2708&#xFE0F",
    "name": "Woman Pilot"
  },
  {
    "emoji": "👨‍🚀",
    "entity": "&#x1F468&#x200D&#x1F680",
    "name": "Man Astronaut"
  },
  {
    "emoji": "👩‍🚀",
    "entity": "&#x1F469&#x200D&#x1F680",
    "name": "Woman Astronaut"
  },
  {
    "emoji": "👨‍🚒",
    "entity": "&#x1F468&#x200D&#x1F692",
    "name": "Man Firefighter"
  },
  {
    "emoji": "👩‍🚒",
    "entity": "&#x1F469&#x200D&#x1F692",
    "name": "Woman Firefighter"
  },
  {
    "emoji": "👮",
    "entity": "&#x1F46E",
    "name": "Police Officer"
  },
  {
    "emoji": "👮‍♂️",
    "entity": "&#x1F46E&#x200D&#x2642&#xFE0F",
    "name": "Man Police Officer"
  },
  {
    "emoji": "👮‍♀️",
    "entity": "&#x1F46E&#x200D&#x2640&#xFE0F",
    "name": "Woman Police Officer"
  },
  {
    "emoji": "🕵",
    "entity": "&#x1F575",
    "name": "Detective"
  },
  {
    "emoji": "🕵️‍♂️",
    "entity": "&#x1F575&#xFE0F&#x200D&#x2642&#xFE0F",
    "name": "Man Detective"
  },
  {
    "emoji": "🕵️‍♀️",
    "entity": "&#x1F575&#xFE0F&#x200D&#x2640&#xFE0F",
    "name": "Woman Detective"
  },
  {
    "emoji": "💂",
    "entity": "&#x1F482",
    "name": "Guard"
  },
  {
    "emoji": "💂‍♂️",
    "entity": "&#x1F482&#x200D&#x2642&#xFE0F",
    "name": "Man Guard"
  },
  {
    "emoji": "💂‍♀️",
    "entity": "&#x1F482&#x200D&#x2640&#xFE0F",
    "name": "Woman Guard"
  },
  {
    "emoji": "👷",
    "entity": "&#x1F477",
    "name": "Construction Worker"
  },
  {
    "emoji": "👷‍♂️",
    "entity": "&#x1F477&#x200D&#x2642&#xFE0F",
    "name": "Man Construction Worker"
  },
  {
    "emoji": "👷‍♀️",
    "entity": "&#x1F477&#x200D&#x2640&#xFE0F",
    "name": "Woman Construction Worker"
  },
  {
    "emoji": "🤴",
    "entity": "&#x1F934",
    "name": "Prince"
  },
  {
    "emoji": "👸",
    "entity": "&#x1F478",
    "name": "Princess"
  },
  {
    "emoji": "👳",
    "entity": "&#x1F473",
    "name": "Person Wearing Turban"
  },
  {
    "emoji": "👳‍♂️",
    "entity": "&#x1F473&#x200D&#x2642&#xFE0F",
    "name": "Man Wearing Turban"
  },
  {
    "emoji": "👳‍♀️",
    "entity": "&#x1F473&#x200D&#x2640&#xFE0F",
    "name": "Woman Wearing Turban"
  },
  {
    "emoji": "👲",
    "entity": "&#x1F472",
    "name": "Man With Chinese Cap"
  },
  {
    "emoji": "🧕",
    "entity": "&#x1F9D5",
    "name": "Woman With Headscarf"
  },
  {
    "emoji": "🤵",
    "entity": "&#x1F935",
    "name": "Man In Tuxedo"
  },
  {
    "emoji": "👰",
    "entity": "&#x1F470",
    "name": "Bride With Veil"
  },
  {
    "emoji": "🤰",
    "entity": "&#x1F930",
    "name": "Pregnant Woman"
  },
  {
    "emoji": "🤱",
    "entity": "&#x1F931",
    "name": "Breast-feeding"
  },
  {
    "emoji": "👼",
    "entity": "&#x1F47C",
    "name": "Baby Angel"
  },
  {
    "emoji": "🎅",
    "entity": "&#x1F385",
    "name": "Santa Claus"
  },
  {
    "emoji": "🤶",
    "entity": "&#x1F936",
    "name": "Mrs. Claus"
  },
  {
    "emoji": "🦸",
    "entity": "&#x1F9B8",
    "name": "Superhero"
  },
  {
    "emoji": "🦸‍♂️",
    "entity": "&#x1F9B8&#x200D&#x2642&#xFE0F",
    "name": "Man Superhero"
  },
  {
    "emoji": "🦸‍♀️",
    "entity": "&#x1F9B8&#x200D&#x2640&#xFE0F",
    "name": "Woman Superhero"
  },
  {
    "emoji": "🦹",
    "entity": "&#x1F9B9",
    "name": "Supervillain"
  },
  {
    "emoji": "🦹‍♂️",
    "entity": "&#x1F9B9&#x200D&#x2642&#xFE0F",
    "name": "Man Supervillain"
  },
  {
    "emoji": "🦹‍♀️",
    "entity": "&#x1F9B9&#x200D&#x2640&#xFE0F",
    "name": "Woman Supervillain"
  },
  {
    "emoji": "🧙",
    "entity": "&#x1F9D9",
    "name": "Mage"
  },
  {
    "emoji": "🧙‍♂️",
    "entity": "&#x1F9D9&#x200D&#x2642&#xFE0F",
    "name": "Man Mage"
  },
  {
    "emoji": "🧙‍♀️",
    "entity": "&#x1F9D9&#x200D&#x2640&#xFE0F",
    "name": "Woman Mage"
  },
  {
    "emoji": "🧚",
    "entity": "&#x1F9DA",
    "name": "Fairy"
  },
  {
    "emoji": "🧚‍♂️",
    "entity": "&#x1F9DA&#x200D&#x2642&#xFE0F",
    "name": "Man Fairy"
  },
  {
    "emoji": "🧚‍♀️",
    "entity": "&#x1F9DA&#x200D&#x2640&#xFE0F",
    "name": "Woman Fairy"
  },
  {
    "emoji": "🧛",
    "entity": "&#x1F9DB",
    "name": "Vampire"
  },
  {
    "emoji": "🧛‍♂️",
    "entity": "&#x1F9DB&#x200D&#x2642&#xFE0F",
    "name": "Man Vampire"
  },
  {
    "emoji": "🧛‍♀️",
    "entity": "&#x1F9DB&#x200D&#x2640&#xFE0F",
    "name": "Woman Vampire"
  },
  {
    "emoji": "🧜",
    "entity": "&#x1F9DC",
    "name": "Merperson"
  },
  {
    "emoji": "🧜‍♂️",
    "entity": "&#x1F9DC&#x200D&#x2642&#xFE0F",
    "name": "Merman"
  },
  {
    "emoji": "🧜‍♀️",
    "entity": "&#x1F9DC&#x200D&#x2640&#xFE0F",
    "name": "Mermaid"
  },
  {
    "emoji": "🧝",
    "entity": "&#x1F9DD",
    "name": "Elf"
  },
  {
    "emoji": "🧝‍♂️",
    "entity": "&#x1F9DD&#x200D&#x2642&#xFE0F",
    "name": "Man Elf"
  },
  {
    "emoji": "🧝‍♀️",
    "entity": "&#x1F9DD&#x200D&#x2640&#xFE0F",
    "name": "Woman Elf"
  },
  {
    "emoji": "🧞",
    "entity": "&#x1F9DE",
    "name": "Genie"
  },
  {
    "emoji": "🧞‍♂️",
    "entity": "&#x1F9DE&#x200D&#x2642&#xFE0F",
    "name": "Man Genie"
  },
  {
    "emoji": "🧞‍♀️",
    "entity": "&#x1F9DE&#x200D&#x2640&#xFE0F",
    "name": "Woman Genie"
  },
  {
    "emoji": "🧟",
    "entity": "&#x1F9DF",
    "name": "Zombie"
  },
  {
    "emoji": "🧟‍♂️",
    "entity": "&#x1F9DF&#x200D&#x2642&#xFE0F",
    "name": "Man Zombie"
  },
  {
    "emoji": "🧟‍♀️",
    "entity": "&#x1F9DF&#x200D&#x2640&#xFE0F",
    "name": "Woman Zombie"
  },
  {
    "emoji": "💆",
    "entity": "&#x1F486",
    "name": "Person Getting Massage"
  },
  {
    "emoji": "💆‍♂️",
    "entity": "&#x1F486&#x200D&#x2642&#xFE0F",
    "name": "Man Getting Massage"
  },
  {
    "emoji": "💆‍♀️",
    "entity": "&#x1F486&#x200D&#x2640&#xFE0F",
    "name": "Woman Getting Massage"
  },
  {
    "emoji": "💇",
    "entity": "&#x1F487",
    "name": "Person Getting Haircut"
  },
  {
    "emoji": "💇‍♂️",
    "entity": "&#x1F487&#x200D&#x2642&#xFE0F",
    "name": "Man Getting Haircut"
  },
  {
    "emoji": "💇‍♀️",
    "entity": "&#x1F487&#x200D&#x2640&#xFE0F",
    "name": "Woman Getting Haircut"
  },
  {
    "emoji": "🚶",
    "entity": "&#x1F6B6",
    "name": "Person Walking"
  },
  {
    "emoji": "🚶‍♂️",
    "entity": "&#x1F6B6&#x200D&#x2642&#xFE0F",
    "name": "Man Walking"
  },
  {
    "emoji": "🚶‍♀️",
    "entity": "&#x1F6B6&#x200D&#x2640&#xFE0F",
    "name": "Woman Walking"
  },
  {
    "emoji": "🧍",
    "entity": "&#x1F9CD",
    "name": "⊛ Person Standing"
  },
  {
    "emoji": "🧍‍♂️",
    "entity": "&#x1F9CD&#x200D&#x2642&#xFE0F",
    "name": "⊛ Man Standing"
  },
  {
    "emoji": "🧍‍♀️",
    "entity": "&#x1F9CD&#x200D&#x2640&#xFE0F",
    "name": "⊛ Woman Standing"
  },
  {
    "emoji": "🧎",
    "entity": "&#x1F9CE",
    "name": "⊛ Person Kneeling"
  },
  {
    "emoji": "🧎‍♂️",
    "entity": "&#x1F9CE&#x200D&#x2642&#xFE0F",
    "name": "⊛ Man Kneeling"
  },
  {
    "emoji": "🧎‍♀️",
    "entity": "&#x1F9CE&#x200D&#x2640&#xFE0F",
    "name": "⊛ Woman Kneeling"
  },
  {
    "emoji": "👨‍🦯",
    "entity": "&#x1F468&#x200D&#x1F9AF",
    "name": "⊛ Man With Probing Cane"
  },
  {
    "emoji": "👩‍🦯",
    "entity": "&#x1F469&#x200D&#x1F9AF",
    "name": "⊛ Woman With Probing Cane"
  },
  {
    "emoji": "👨‍🦼",
    "entity": "&#x1F468&#x200D&#x1F9BC",
    "name": "⊛ Man In Motorized Wheelchair"
  },
  {
    "emoji": "👩‍🦼",
    "entity": "&#x1F469&#x200D&#x1F9BC",
    "name": "⊛ Woman In Motorized Wheelchair"
  },
  {
    "emoji": "👨‍🦽",
    "entity": "&#x1F468&#x200D&#x1F9BD",
    "name": "⊛ Man In Manual Wheelchair"
  },
  {
    "emoji": "👩‍🦽",
    "entity": "&#x1F469&#x200D&#x1F9BD",
    "name": "⊛ Woman In Manual Wheelchair"
  },
  {
    "emoji": "🏃",
    "entity": "&#x1F3C3",
    "name": "Person Running"
  },
  {
    "emoji": "🏃‍♂️",
    "entity": "&#x1F3C3&#x200D&#x2642&#xFE0F",
    "name": "Man Running"
  },
  {
    "emoji": "🏃‍♀️",
    "entity": "&#x1F3C3&#x200D&#x2640&#xFE0F",
    "name": "Woman Running"
  },
  {
    "emoji": "💃",
    "entity": "&#x1F483",
    "name": "Woman Dancing"
  },
  {
    "emoji": "🕺",
    "entity": "&#x1F57A",
    "name": "Man Dancing"
  },
  {
    "emoji": "🕴",
    "entity": "&#x1F574",
    "name": "Man In Suit Levitating"
  },
  {
    "emoji": "👯",
    "entity": "&#x1F46F",
    "name": "People With Bunny Ears"
  },
  {
    "emoji": "👯‍♂️",
    "entity": "&#x1F46F&#x200D&#x2642&#xFE0F",
    "name": "Men With Bunny Ears"
  },
  {
    "emoji": "👯‍♀️",
    "entity": "&#x1F46F&#x200D&#x2640&#xFE0F",
    "name": "Women With Bunny Ears"
  },
  {
    "emoji": "🧖",
    "entity": "&#x1F9D6",
    "name": "Person In Steamy Room"
  },
  {
    "emoji": "🧖‍♂️",
    "entity": "&#x1F9D6&#x200D&#x2642&#xFE0F",
    "name": "Man In Steamy Room"
  },
  {
    "emoji": "🧖‍♀️",
    "entity": "&#x1F9D6&#x200D&#x2640&#xFE0F",
    "name": "Woman In Steamy Room"
  },
  {
    "emoji": "🧗",
    "entity": "&#x1F9D7",
    "name": "Person Climbing"
  },
  {
    "emoji": "🧗‍♂️",
    "entity": "&#x1F9D7&#x200D&#x2642&#xFE0F",
    "name": "Man Climbing"
  },
  {
    "emoji": "🧗‍♀️",
    "entity": "&#x1F9D7&#x200D&#x2640&#xFE0F",
    "name": "Woman Climbing"
  },
  {
    "emoji": "🤺",
    "entity": "&#x1F93A",
    "name": "Person Fencing"
  },
  {
    "emoji": "🏇",
    "entity": "&#x1F3C7",
    "name": "Horse Racing"
  },
  {
    "emoji": "⛷",
    "entity": "&#x26F7",
    "name": "Skier"
  },
  {
    "emoji": "🏂",
    "entity": "&#x1F3C2",
    "name": "Snowboarder"
  },
  {
    "emoji": "🏌",
    "entity": "&#x1F3CC",
    "name": "Person Golfing"
  },
  {
    "emoji": "🏌️‍♂️",
    "entity": "&#x1F3CC&#xFE0F&#x200D&#x2642&#xFE0F",
    "name": "Man Golfing"
  },
  {
    "emoji": "🏌️‍♀️",
    "entity": "&#x1F3CC&#xFE0F&#x200D&#x2640&#xFE0F",
    "name": "Woman Golfing"
  },
  {
    "emoji": "🏄",
    "entity": "&#x1F3C4",
    "name": "Person Surfing"
  },
  {
    "emoji": "🏄‍♂️",
    "entity": "&#x1F3C4&#x200D&#x2642&#xFE0F",
    "name": "Man Surfing"
  },
  {
    "emoji": "🏄‍♀️",
    "entity": "&#x1F3C4&#x200D&#x2640&#xFE0F",
    "name": "Woman Surfing"
  },
  {
    "emoji": "🚣",
    "entity": "&#x1F6A3",
    "name": "Person Rowing Boat"
  },
  {
    "emoji": "🚣‍♂️",
    "entity": "&#x1F6A3&#x200D&#x2642&#xFE0F",
    "name": "Man Rowing Boat"
  },
  {
    "emoji": "🚣‍♀️",
    "entity": "&#x1F6A3&#x200D&#x2640&#xFE0F",
    "name": "Woman Rowing Boat"
  },
  {
    "emoji": "🏊",
    "entity": "&#x1F3CA",
    "name": "Person Swimming"
  },
  {
    "emoji": "🏊‍♂️",
    "entity": "&#x1F3CA&#x200D&#x2642&#xFE0F",
    "name": "Man Swimming"
  },
  {
    "emoji": "🏊‍♀️",
    "entity": "&#x1F3CA&#x200D&#x2640&#xFE0F",
    "name": "Woman Swimming"
  },
  {
    "emoji": "⛹",
    "entity": "&#x26F9",
    "name": "Person Bouncing Ball"
  },
  {
    "emoji": "⛹️‍♂️",
    "entity": "&#x26F9&#xFE0F&#x200D&#x2642&#xFE0F",
    "name": "Man Bouncing Ball"
  },
  {
    "emoji": "⛹️‍♀️",
    "entity": "&#x26F9&#xFE0F&#x200D&#x2640&#xFE0F",
    "name": "Woman Bouncing Ball"
  },
  {
    "emoji": "🏋",
    "entity": "&#x1F3CB",
    "name": "Person Lifting Weights"
  },
  {
    "emoji": "🏋️‍♂️",
    "entity": "&#x1F3CB&#xFE0F&#x200D&#x2642&#xFE0F",
    "name": "Man Lifting Weights"
  },
  {
    "emoji": "🏋️‍♀️",
    "entity": "&#x1F3CB&#xFE0F&#x200D&#x2640&#xFE0F",
    "name": "Woman Lifting Weights"
  },
  {
    "emoji": "🚴",
    "entity": "&#x1F6B4",
    "name": "Person Biking"
  },
  {
    "emoji": "🚴‍♂️",
    "entity": "&#x1F6B4&#x200D&#x2642&#xFE0F",
    "name": "Man Biking"
  },
  {
    "emoji": "🚴‍♀️",
    "entity": "&#x1F6B4&#x200D&#x2640&#xFE0F",
    "name": "Woman Biking"
  },
  {
    "emoji": "🚵",
    "entity": "&#x1F6B5",
    "name": "Person Mountain Biking"
  },
  {
    "emoji": "🚵‍♂️",
    "entity": "&#x1F6B5&#x200D&#x2642&#xFE0F",
    "name": "Man Mountain Biking"
  },
  {
    "emoji": "🚵‍♀️",
    "entity": "&#x1F6B5&#x200D&#x2640&#xFE0F",
    "name": "Woman Mountain Biking"
  },
  {
    "emoji": "🤸",
    "entity": "&#x1F938",
    "name": "Person Cartwheeling"
  },
  {
    "emoji": "🤸‍♂️",
    "entity": "&#x1F938&#x200D&#x2642&#xFE0F",
    "name": "Man Cartwheeling"
  },
  {
    "emoji": "🤸‍♀️",
    "entity": "&#x1F938&#x200D&#x2640&#xFE0F",
    "name": "Woman Cartwheeling"
  },
  {
    "emoji": "🤼",
    "entity": "&#x1F93C",
    "name": "People Wrestling"
  },
  {
    "emoji": "🤼‍♂️",
    "entity": "&#x1F93C&#x200D&#x2642&#xFE0F",
    "name": "Men Wrestling"
  },
  {
    "emoji": "🤼‍♀️",
    "entity": "&#x1F93C&#x200D&#x2640&#xFE0F",
    "name": "Women Wrestling"
  },
  {
    "emoji": "🤽",
    "entity": "&#x1F93D",
    "name": "Person Playing Water Polo"
  },
  {
    "emoji": "🤽‍♂️",
    "entity": "&#x1F93D&#x200D&#x2642&#xFE0F",
    "name": "Man Playing Water Polo"
  },
  {
    "emoji": "🤽‍♀️",
    "entity": "&#x1F93D&#x200D&#x2640&#xFE0F",
    "name": "Woman Playing Water Polo"
  },
  {
    "emoji": "🤾",
    "entity": "&#x1F93E",
    "name": "Person Playing Handball"
  },
  {
    "emoji": "🤾‍♂️",
    "entity": "&#x1F93E&#x200D&#x2642&#xFE0F",
    "name": "Man Playing Handball"
  },
  {
    "emoji": "🤾‍♀️",
    "entity": "&#x1F93E&#x200D&#x2640&#xFE0F",
    "name": "Woman Playing Handball"
  },
  {
    "emoji": "🤹",
    "entity": "&#x1F939",
    "name": "Person Juggling"
  },
  {
    "emoji": "🤹‍♂️",
    "entity": "&#x1F939&#x200D&#x2642&#xFE0F",
    "name": "Man Juggling"
  },
  {
    "emoji": "🤹‍♀️",
    "entity": "&#x1F939&#x200D&#x2640&#xFE0F",
    "name": "Woman Juggling"
  },
  {
    "emoji": "🧘",
    "entity": "&#x1F9D8",
    "name": "Person In Lotus Position"
  },
  {
    "emoji": "🧘‍♂️",
    "entity": "&#x1F9D8&#x200D&#x2642&#xFE0F",
    "name": "Man In Lotus Position"
  },
  {
    "emoji": "🧘‍♀️",
    "entity": "&#x1F9D8&#x200D&#x2640&#xFE0F",
    "name": "Woman In Lotus Position"
  },
  {
    "emoji": "🛀",
    "entity": "&#x1F6C0",
    "name": "Person Taking Bath"
  },
  {
    "emoji": "🛌",
    "entity": "&#x1F6CC",
    "name": "Person In Bed"
  },
  {
    "emoji": "🧑‍🤝‍🧑",
    "entity": "&#x1F9D1&#x200D&#x1F91D&#x200D&#x1F9D1",
    "name": "⊛ People Holding Hands"
  },
  {
    "emoji": "👭",
    "entity": "&#x1F46D",
    "name": "Women Holding Hands"
  },
  {
    "emoji": "👫",
    "entity": "&#x1F46B",
    "name": "Woman And Man Holding Hands"
  },
  {
    "emoji": "👬",
    "entity": "&#x1F46C",
    "name": "Men Holding Hands"
  },
  {
    "emoji": "💏",
    "entity": "&#x1F48F",
    "name": "Kiss"
  },
  {
    "emoji": "👩‍❤️‍💋‍👨",
    "entity": "&#x1F469&#x200D&#x2764&#xFE0F&#x200D&#x1F48B&#x200D&#x1F468",
    "name": "Kiss: Woman, Man"
  },
  {
    "emoji": "👨‍❤️‍💋‍👨",
    "entity": "&#x1F468&#x200D&#x2764&#xFE0F&#x200D&#x1F48B&#x200D&#x1F468",
    "name": "Kiss: Man, Man"
  },
  {
    "emoji": "👩‍❤️‍💋‍👩",
    "entity": "&#x1F469&#x200D&#x2764&#xFE0F&#x200D&#x1F48B&#x200D&#x1F469",
    "name": "Kiss: Woman, Woman"
  },
  {
    "emoji": "💑",
    "entity": "&#x1F491",
    "name": "Couple With Heart"
  },
  {
    "emoji": "👩‍❤️‍👨",
    "entity": "&#x1F469&#x200D&#x2764&#xFE0F&#x200D&#x1F468",
    "name": "Couple With Heart: Woman, Man"
  },
  {
    "emoji": "👨‍❤️‍👨",
    "entity": "&#x1F468&#x200D&#x2764&#xFE0F&#x200D&#x1F468",
    "name": "Couple With Heart: Man, Man"
  },
  {
    "emoji": "👩‍❤️‍👩",
    "entity": "&#x1F469&#x200D&#x2764&#xFE0F&#x200D&#x1F469",
    "name": "Couple With Heart: Woman, Woman"
  },
  {
    "emoji": "👪",
    "entity": "&#x1F46A",
    "name": "Family"
  },
  {
    "emoji": "👨‍👩‍👦",
    "entity": "&#x1F468&#x200D&#x1F469&#x200D&#x1F466",
    "name": "Family: Man, Woman, Boy"
  },
  {
    "emoji": "👨‍👩‍👧",
    "entity": "&#x1F468&#x200D&#x1F469&#x200D&#x1F467",
    "name": "Family: Man, Woman, Girl"
  },
  {
    "emoji": "👨‍👩‍👧‍👦",
    "entity": "&#x1F468&#x200D&#x1F469&#x200D&#x1F467&#x200D&#x1F466",
    "name": "Family: Man, Woman, Girl, Boy"
  },
  {
    "emoji": "👨‍👩‍👦‍👦",
    "entity": "&#x1F468&#x200D&#x1F469&#x200D&#x1F466&#x200D&#x1F466",
    "name": "Family: Man, Woman, Boy, Boy"
  },
  {
    "emoji": "👨‍👩‍👧‍👧",
    "entity": "&#x1F468&#x200D&#x1F469&#x200D&#x1F467&#x200D&#x1F467",
    "name": "Family: Man, Woman, Girl, Girl"
  },
  {
    "emoji": "👨‍👨‍👦",
    "entity": "&#x1F468&#x200D&#x1F468&#x200D&#x1F466",
    "name": "Family: Man, Man, Boy"
  },
  {
    "emoji": "👨‍👨‍👧",
    "entity": "&#x1F468&#x200D&#x1F468&#x200D&#x1F467",
    "name": "Family: Man, Man, Girl"
  },
  {
    "emoji": "👨‍👨‍👧‍👦",
    "entity": "&#x1F468&#x200D&#x1F468&#x200D&#x1F467&#x200D&#x1F466",
    "name": "Family: Man, Man, Girl, Boy"
  },
  {
    "emoji": "👨‍👨‍👦‍👦",
    "entity": "&#x1F468&#x200D&#x1F468&#x200D&#x1F466&#x200D&#x1F466",
    "name": "Family: Man, Man, Boy, Boy"
  },
  {
    "emoji": "👨‍👨‍👧‍👧",
    "entity": "&#x1F468&#x200D&#x1F468&#x200D&#x1F467&#x200D&#x1F467",
    "name": "Family: Man, Man, Girl, Girl"
  },
  {
    "emoji": "👩‍👩‍👦",
    "entity": "&#x1F469&#x200D&#x1F469&#x200D&#x1F466",
    "name": "Family: Woman, Woman, Boy"
  },
  {
    "emoji": "👩‍👩‍👧",
    "entity": "&#x1F469&#x200D&#x1F469&#x200D&#x1F467",
    "name": "Family: Woman, Woman, Girl"
  },
  {
    "emoji": "👩‍👩‍👧‍👦",
    "entity": "&#x1F469&#x200D&#x1F469&#x200D&#x1F467&#x200D&#x1F466",
    "name": "Family: Woman, Woman, Girl, Boy"
  },
  {
    "emoji": "👩‍👩‍👦‍👦",
    "entity": "&#x1F469&#x200D&#x1F469&#x200D&#x1F466&#x200D&#x1F466",
    "name": "Family: Woman, Woman, Boy, Boy"
  },
  {
    "emoji": "👩‍👩‍👧‍👧",
    "entity": "&#x1F469&#x200D&#x1F469&#x200D&#x1F467&#x200D&#x1F467",
    "name": "Family: Woman, Woman, Girl, Girl"
  },
  {
    "emoji": "👨‍👦",
    "entity": "&#x1F468&#x200D&#x1F466",
    "name": "Family: Man, Boy"
  },
  {
    "emoji": "👨‍👦‍👦",
    "entity": "&#x1F468&#x200D&#x1F466&#x200D&#x1F466",
    "name": "Family: Man, Boy, Boy"
  },
  {
    "emoji": "👨‍👧",
    "entity": "&#x1F468&#x200D&#x1F467",
    "name": "Family: Man, Girl"
  },
  {
    "emoji": "👨‍👧‍👦",
    "entity": "&#x1F468&#x200D&#x1F467&#x200D&#x1F466",
    "name": "Family: Man, Girl, Boy"
  },
  {
    "emoji": "👨‍👧‍👧",
    "entity": "&#x1F468&#x200D&#x1F467&#x200D&#x1F467",
    "name": "Family: Man, Girl, Girl"
  },
  {
    "emoji": "👩‍👦",
    "entity": "&#x1F469&#x200D&#x1F466",
    "name": "Family: Woman, Boy"
  },
  {
    "emoji": "👩‍👦‍👦",
    "entity": "&#x1F469&#x200D&#x1F466&#x200D&#x1F466",
    "name": "Family: Woman, Boy, Boy"
  },
  {
    "emoji": "👩‍👧",
    "entity": "&#x1F469&#x200D&#x1F467",
    "name": "Family: Woman, Girl"
  },
  {
    "emoji": "👩‍👧‍👦",
    "entity": "&#x1F469&#x200D&#x1F467&#x200D&#x1F466",
    "name": "Family: Woman, Girl, Boy"
  },
  {
    "emoji": "👩‍👧‍👧",
    "entity": "&#x1F469&#x200D&#x1F467&#x200D&#x1F467",
    "name": "Family: Woman, Girl, Girl"
  },
  {
    "emoji": "🗣",
    "entity": "&#x1F5E3",
    "name": "Speaking Head"
  },
  {
    "emoji": "👤",
    "entity": "&#x1F464",
    "name": "Bust In Silhouette"
  },
  {
    "emoji": "👥",
    "entity": "&#x1F465",
    "name": "Busts In Silhouette"
  },
  {
    "emoji": "👣",
    "entity": "&#x1F463",
    "name": "Footprints"
  },
  {
    "emoji": "🦰",
    "entity": "&#x1F9B0",
    "name": "Red Hair"
  },
  {
    "emoji": "🦱",
    "entity": "&#x1F9B1",
    "name": "Curly Hair"
  },
  {
    "emoji": "🦳",
    "entity": "&#x1F9B3",
    "name": "White Hair"
  },
  {
    "emoji": "🦲",
    "entity": "&#x1F9B2",
    "name": "Bald"
  },
  {
    "emoji": "🐵",
    "entity": "&#x1F435",
    "name": "Monkey Face"
  },
  {
    "emoji": "🐒",
    "entity": "&#x1F412",
    "name": "Monkey"
  },
  {
    "emoji": "🦍",
    "entity": "&#x1F98D",
    "name": "Gorilla"
  },
  {
    "emoji": "🦧",
    "entity": "&#x1F9A7",
    "name": "⊛ Orangutan"
  },
  {
    "emoji": "🐶",
    "entity": "&#x1F436",
    "name": "Dog Face"
  },
  {
    "emoji": "🐕",
    "entity": "&#x1F415",
    "name": "Dog"
  },
  {
    "emoji": "🦮",
    "entity": "&#x1F9AE",
    "name": "⊛ Guide Dog"
  },
  {
    "emoji": "🐕‍🦺",
    "entity": "&#x1F415&#x200D&#x1F9BA",
    "name": "⊛ Service Dog"
  },
  {
    "emoji": "🐩",
    "entity": "&#x1F429",
    "name": "Poodle"
  },
  {
    "emoji": "🐺",
    "entity": "&#x1F43A",
    "name": "Wolf"
  },
  {
    "emoji": "🦊",
    "entity": "&#x1F98A",
    "name": "Fox"
  },
  {
    "emoji": "🦝",
    "entity": "&#x1F99D",
    "name": "Raccoon"
  },
  {
    "emoji": "🐱",
    "entity": "&#x1F431",
    "name": "Cat Face"
  },
  {
    "emoji": "🐈",
    "entity": "&#x1F408",
    "name": "Cat"
  },
  {
    "emoji": "🦁",
    "entity": "&#x1F981",
    "name": "Lion"
  },
  {
    "emoji": "🐯",
    "entity": "&#x1F42F",
    "name": "Tiger Face"
  },
  {
    "emoji": "🐅",
    "entity": "&#x1F405",
    "name": "Tiger"
  },
  {
    "emoji": "🐆",
    "entity": "&#x1F406",
    "name": "Leopard"
  },
  {
    "emoji": "🐴",
    "entity": "&#x1F434",
    "name": "Horse Face"
  },
  {
    "emoji": "🐎",
    "entity": "&#x1F40E",
    "name": "Horse"
  },
  {
    "emoji": "🦄",
    "entity": "&#x1F984",
    "name": "Unicorn"
  },
  {
    "emoji": "🦓",
    "entity": "&#x1F993",
    "name": "Zebra"
  },
  {
    "emoji": "🦌",
    "entity": "&#x1F98C",
    "name": "Deer"
  },
  {
    "emoji": "🐮",
    "entity": "&#x1F42E",
    "name": "Cow Face"
  },
  {
    "emoji": "🐂",
    "entity": "&#x1F402",
    "name": "Ox"
  },
  {
    "emoji": "🐃",
    "entity": "&#x1F403",
    "name": "Water Buffalo"
  },
  {
    "emoji": "🐄",
    "entity": "&#x1F404",
    "name": "Cow"
  },
  {
    "emoji": "🐷",
    "entity": "&#x1F437",
    "name": "Pig Face"
  },
  {
    "emoji": "🐖",
    "entity": "&#x1F416",
    "name": "Pig"
  },
  {
    "emoji": "🐗",
    "entity": "&#x1F417",
    "name": "Boar"
  },
  {
    "emoji": "🐽",
    "entity": "&#x1F43D",
    "name": "Pig Nose"
  },
  {
    "emoji": "🐏",
    "entity": "&#x1F40F",
    "name": "Ram"
  },
  {
    "emoji": "🐑",
    "entity": "&#x1F411",
    "name": "Ewe"
  },
  {
    "emoji": "🐐",
    "entity": "&#x1F410",
    "name": "Goat"
  },
  {
    "emoji": "🐪",
    "entity": "&#x1F42A",
    "name": "Camel"
  },
  {
    "emoji": "🐫",
    "entity": "&#x1F42B",
    "name": "Two-hump Camel"
  },
  {
    "emoji": "🦙",
    "entity": "&#x1F999",
    "name": "Llama"
  },
  {
    "emoji": "🦒",
    "entity": "&#x1F992",
    "name": "Giraffe"
  },
  {
    "emoji": "🐘",
    "entity": "&#x1F418",
    "name": "Elephant"
  },
  {
    "emoji": "🦏",
    "entity": "&#x1F98F",
    "name": "Rhinoceros"
  },
  {
    "emoji": "🦛",
    "entity": "&#x1F99B",
    "name": "Hippopotamus"
  },
  {
    "emoji": "🐭",
    "entity": "&#x1F42D",
    "name": "Mouse Face"
  },
  {
    "emoji": "🐁",
    "entity": "&#x1F401",
    "name": "Mouse"
  },
  {
    "emoji": "🐀",
    "entity": "&#x1F400",
    "name": "Rat"
  },
  {
    "emoji": "🐹",
    "entity": "&#x1F439",
    "name": "Hamster"
  },
  {
    "emoji": "🐰",
    "entity": "&#x1F430",
    "name": "Rabbit Face"
  },
  {
    "emoji": "🐇",
    "entity": "&#x1F407",
    "name": "Rabbit"
  },
  {
    "emoji": "🐿",
    "entity": "&#x1F43F",
    "name": "Chipmunk"
  },
  {
    "emoji": "🦔",
    "entity": "&#x1F994",
    "name": "Hedgehog"
  },
  {
    "emoji": "🦇",
    "entity": "&#x1F987",
    "name": "Bat"
  },
  {
    "emoji": "🐻",
    "entity": "&#x1F43B",
    "name": "Bear"
  },
  {
    "emoji": "🐨",
    "entity": "&#x1F428",
    "name": "Koala"
  },
  {
    "emoji": "🐼",
    "entity": "&#x1F43C",
    "name": "Panda"
  },
  {
    "emoji": "🦥",
    "entity": "&#x1F9A5",
    "name": "⊛ Sloth"
  },
  {
    "emoji": "🦦",
    "entity": "&#x1F9A6",
    "name": "⊛ Otter"
  },
  {
    "emoji": "🦨",
    "entity": "&#x1F9A8",
    "name": "⊛ Skunk"
  },
  {
    "emoji": "🦘",
    "entity": "&#x1F998",
    "name": "Kangaroo"
  },
  {
    "emoji": "🦡",
    "entity": "&#x1F9A1",
    "name": "Badger"
  },
  {
    "emoji": "🐾",
    "entity": "&#x1F43E",
    "name": "Paw Prints"
  },
  {
    "emoji": "🦃",
    "entity": "&#x1F983",
    "name": "Turkey"
  },
  {
    "emoji": "🐔",
    "entity": "&#x1F414",
    "name": "Chicken"
  },
  {
    "emoji": "🐓",
    "entity": "&#x1F413",
    "name": "Rooster"
  },
  {
    "emoji": "🐣",
    "entity": "&#x1F423",
    "name": "Hatching Chick"
  },
  {
    "emoji": "🐤",
    "entity": "&#x1F424",
    "name": "Baby Chick"
  },
  {
    "emoji": "🐥",
    "entity": "&#x1F425",
    "name": "Front-facing Baby Chick"
  },
  {
    "emoji": "🐦",
    "entity": "&#x1F426",
    "name": "Bird"
  },
  {
    "emoji": "🐧",
    "entity": "&#x1F427",
    "name": "Penguin"
  },
  {
    "emoji": "🕊",
    "entity": "&#x1F54A",
    "name": "Dove"
  },
  {
    "emoji": "🦅",
    "entity": "&#x1F985",
    "name": "Eagle"
  },
  {
    "emoji": "🦆",
    "entity": "&#x1F986",
    "name": "Duck"
  },
  {
    "emoji": "🦢",
    "entity": "&#x1F9A2",
    "name": "Swan"
  },
  {
    "emoji": "🦉",
    "entity": "&#x1F989",
    "name": "Owl"
  },
  {
    "emoji": "🦩",
    "entity": "&#x1F9A9",
    "name": "⊛ Flamingo"
  },
  {
    "emoji": "🦚",
    "entity": "&#x1F99A",
    "name": "Peacock"
  },
  {
    "emoji": "🦜",
    "entity": "&#x1F99C",
    "name": "Parrot"
  },
  {
    "emoji": "🐸",
    "entity": "&#x1F438",
    "name": "Frog"
  },
  {
    "emoji": "🐊",
    "entity": "&#x1F40A",
    "name": "Crocodile"
  },
  {
    "emoji": "🐢",
    "entity": "&#x1F422",
    "name": "Turtle"
  },
  {
    "emoji": "🦎",
    "entity": "&#x1F98E",
    "name": "Lizard"
  },
  {
    "emoji": "🐍",
    "entity": "&#x1F40D",
    "name": "Snake"
  },
  {
    "emoji": "🐲",
    "entity": "&#x1F432",
    "name": "Dragon Face"
  },
  {
    "emoji": "🐉",
    "entity": "&#x1F409",
    "name": "Dragon"
  },
  {
    "emoji": "🦕",
    "entity": "&#x1F995",
    "name": "Sauropod"
  },
  {
    "emoji": "🦖",
    "entity": "&#x1F996",
    "name": "T-Rex"
  },
  {
    "emoji": "🐳",
    "entity": "&#x1F433",
    "name": "Spouting Whale"
  },
  {
    "emoji": "🐋",
    "entity": "&#x1F40B",
    "name": "Whale"
  },
  {
    "emoji": "🐬",
    "entity": "&#x1F42C",
    "name": "Dolphin"
  },
  {
    "emoji": "🐟",
    "entity": "&#x1F41F",
    "name": "Fish"
  },
  {
    "emoji": "🐠",
    "entity": "&#x1F420",
    "name": "Tropical Fish"
  },
  {
    "emoji": "🐡",
    "entity": "&#x1F421",
    "name": "Blowfish"
  },
  {
    "emoji": "🦈",
    "entity": "&#x1F988",
    "name": "Shark"
  },
  {
    "emoji": "🐙",
    "entity": "&#x1F419",
    "name": "Octopus"
  },
  {
    "emoji": "🐚",
    "entity": "&#x1F41A",
    "name": "Spiral Shell"
  },
  {
    "emoji": "🐌",
    "entity": "&#x1F40C",
    "name": "Snail"
  },
  {
    "emoji": "🦋",
    "entity": "&#x1F98B",
    "name": "Butterfly"
  },
  {
    "emoji": "🐛",
    "entity": "&#x1F41B",
    "name": "Bug"
  },
  {
    "emoji": "🐜",
    "entity": "&#x1F41C",
    "name": "Ant"
  },
  {
    "emoji": "🐝",
    "entity": "&#x1F41D",
    "name": "Honeybee"
  },
  {
    "emoji": "🐞",
    "entity": "&#x1F41E",
    "name": "Lady Beetle"
  },
  {
    "emoji": "🦗",
    "entity": "&#x1F997",
    "name": "Cricket"
  },
  {
    "emoji": "🕷",
    "entity": "&#x1F577",
    "name": "Spider"
  },
  {
    "emoji": "🕸",
    "entity": "&#x1F578",
    "name": "Spider Web"
  },
  {
    "emoji": "🦂",
    "entity": "&#x1F982",
    "name": "Scorpion"
  },
  {
    "emoji": "🦟",
    "entity": "&#x1F99F",
    "name": "Mosquito"
  },
  {
    "emoji": "🦠",
    "entity": "&#x1F9A0",
    "name": "Microbe"
  },
  {
    "emoji": "💐",
    "entity": "&#x1F490",
    "name": "Bouquet"
  },
  {
    "emoji": "🌸",
    "entity": "&#x1F338",
    "name": "Cherry Blossom"
  },
  {
    "emoji": "💮",
    "entity": "&#x1F4AE",
    "name": "White Flower"
  },
  {
    "emoji": "🏵",
    "entity": "&#x1F3F5",
    "name": "Rosette"
  },
  {
    "emoji": "🌹",
    "entity": "&#x1F339",
    "name": "Rose"
  },
  {
    "emoji": "🥀",
    "entity": "&#x1F940",
    "name": "Wilted Flower"
  },
  {
    "emoji": "🌺",
    "entity": "&#x1F33A",
    "name": "Hibiscus"
  },
  {
    "emoji": "🌻",
    "entity": "&#x1F33B",
    "name": "Sunflower"
  },
  {
    "emoji": "🌼",
    "entity": "&#x1F33C",
    "name": "Blossom"
  },
  {
    "emoji": "🌷",
    "entity": "&#x1F337",
    "name": "Tulip"
  },
  {
    "emoji": "🌱",
    "entity": "&#x1F331",
    "name": "Seedling"
  },
  {
    "emoji": "🌲",
    "entity": "&#x1F332",
    "name": "Evergreen Tree"
  },
  {
    "emoji": "🌳",
    "entity": "&#x1F333",
    "name": "Deciduous Tree"
  },
  {
    "emoji": "🌴",
    "entity": "&#x1F334",
    "name": "Palm Tree"
  },
  {
    "emoji": "🌵",
    "entity": "&#x1F335",
    "name": "Cactus"
  },
  {
    "emoji": "🌾",
    "entity": "&#x1F33E",
    "name": "Sheaf Of Rice"
  },
  {
    "emoji": "🌿",
    "entity": "&#x1F33F",
    "name": "Herb"
  },
  {
    "emoji": "☘",
    "entity": "&#x2618",
    "name": "Shamrock"
  },
  {
    "emoji": "🍀",
    "entity": "&#x1F340",
    "name": "Four Leaf Clover"
  },
  {
    "emoji": "🍁",
    "entity": "&#x1F341",
    "name": "Maple Leaf"
  },
  {
    "emoji": "🍂",
    "entity": "&#x1F342",
    "name": "Fallen Leaf"
  },
  {
    "emoji": "🍃",
    "entity": "&#x1F343",
    "name": "Leaf Fluttering In Wind"
  },
  {
    "emoji": "🍇",
    "entity": "&#x1F347",
    "name": "Grapes"
  },
  {
    "emoji": "🍈",
    "entity": "&#x1F348",
    "name": "Melon"
  },
  {
    "emoji": "🍉",
    "entity": "&#x1F349",
    "name": "Watermelon"
  },
  {
    "emoji": "🍊",
    "entity": "&#x1F34A",
    "name": "Tangerine"
  },
  {
    "emoji": "🍋",
    "entity": "&#x1F34B",
    "name": "Lemon"
  },
  {
    "emoji": "🍌",
    "entity": "&#x1F34C",
    "name": "Banana"
  },
  {
    "emoji": "🍍",
    "entity": "&#x1F34D",
    "name": "Pineapple"
  },
  {
    "emoji": "🥭",
    "entity": "&#x1F96D",
    "name": "Mango"
  },
  {
    "emoji": "🍎",
    "entity": "&#x1F34E",
    "name": "Red Apple"
  },
  {
    "emoji": "🍏",
    "entity": "&#x1F34F",
    "name": "Green Apple"
  },
  {
    "emoji": "🍐",
    "entity": "&#x1F350",
    "name": "Pear"
  },
  {
    "emoji": "🍑",
    "entity": "&#x1F351",
    "name": "Peach"
  },
  {
    "emoji": "🍒",
    "entity": "&#x1F352",
    "name": "Cherries"
  },
  {
    "emoji": "🍓",
    "entity": "&#x1F353",
    "name": "Strawberry"
  },
  {
    "emoji": "🥝",
    "entity": "&#x1F95D",
    "name": "Kiwi Fruit"
  },
  {
    "emoji": "🍅",
    "entity": "&#x1F345",
    "name": "Tomato"
  },
  {
    "emoji": "🥥",
    "entity": "&#x1F965",
    "name": "Coconut"
  },
  {
    "emoji": "🥑",
    "entity": "&#x1F951",
    "name": "Avocado"
  },
  {
    "emoji": "🍆",
    "entity": "&#x1F346",
    "name": "Eggplant"
  },
  {
    "emoji": "🥔",
    "entity": "&#x1F954",
    "name": "Potato"
  },
  {
    "emoji": "🥕",
    "entity": "&#x1F955",
    "name": "Carrot"
  },
  {
    "emoji": "🌽",
    "entity": "&#x1F33D",
    "name": "Ear Of Corn"
  },
  {
    "emoji": "🌶",
    "entity": "&#x1F336",
    "name": "Hot Pepper"
  },
  {
    "emoji": "🥒",
    "entity": "&#x1F952",
    "name": "Cucumber"
  },
  {
    "emoji": "🥬",
    "entity": "&#x1F96C",
    "name": "Leafy Green"
  },
  {
    "emoji": "🥦",
    "entity": "&#x1F966",
    "name": "Broccoli"
  },
  {
    "emoji": "🧄",
    "entity": "&#x1F9C4",
    "name": "⊛ Garlic"
  },
  {
    "emoji": "🧅",
    "entity": "&#x1F9C5",
    "name": "⊛ Onion"
  },
  {
    "emoji": "🍄",
    "entity": "&#x1F344",
    "name": "Mushroom"
  },
  {
    "emoji": "🥜",
    "entity": "&#x1F95C",
    "name": "Peanuts"
  },
  {
    "emoji": "🌰",
    "entity": "&#x1F330",
    "name": "Chestnut"
  },
  {
    "emoji": "🍞",
    "entity": "&#x1F35E",
    "name": "Bread"
  },
  {
    "emoji": "🥐",
    "entity": "&#x1F950",
    "name": "Croissant"
  },
  {
    "emoji": "🥖",
    "entity": "&#x1F956",
    "name": "Baguette Bread"
  },
  {
    "emoji": "🥨",
    "entity": "&#x1F968",
    "name": "Pretzel"
  },
  {
    "emoji": "🥯",
    "entity": "&#x1F96F",
    "name": "Bagel"
  },
  {
    "emoji": "🥞",
    "entity": "&#x1F95E",
    "name": "Pancakes"
  },
  {
    "emoji": "🧇",
    "entity": "&#x1F9C7",
    "name": "⊛ Waffle"
  },
  {
    "emoji": "🧀",
    "entity": "&#x1F9C0",
    "name": "Cheese Wedge"
  },
  {
    "emoji": "🍖",
    "entity": "&#x1F356",
    "name": "Meat On Bone"
  },
  {
    "emoji": "🍗",
    "entity": "&#x1F357",
    "name": "Poultry Leg"
  },
  {
    "emoji": "🥩",
    "entity": "&#x1F969",
    "name": "Cut Of Meat"
  },
  {
    "emoji": "🥓",
    "entity": "&#x1F953",
    "name": "Bacon"
  },
  {
    "emoji": "🍔",
    "entity": "&#x1F354",
    "name": "Hamburger"
  },
  {
    "emoji": "🍟",
    "entity": "&#x1F35F",
    "name": "French Fries"
  },
  {
    "emoji": "🍕",
    "entity": "&#x1F355",
    "name": "Pizza"
  },
  {
    "emoji": "🌭",
    "entity": "&#x1F32D",
    "name": "Hot Dog"
  },
  {
    "emoji": "🥪",
    "entity": "&#x1F96A",
    "name": "Sandwich"
  },
  {
    "emoji": "🌮",
    "entity": "&#x1F32E",
    "name": "Taco"
  },
  {
    "emoji": "🌯",
    "entity": "&#x1F32F",
    "name": "Burrito"
  },
  {
    "emoji": "🥙",
    "entity": "&#x1F959",
    "name": "Stuffed Flatbread"
  },
  {
    "emoji": "🧆",
    "entity": "&#x1F9C6",
    "name": "⊛ Falafel"
  },
  {
    "emoji": "🥚",
    "entity": "&#x1F95A",
    "name": "Egg"
  },
  {
    "emoji": "🍳",
    "entity": "&#x1F373",
    "name": "Cooking"
  },
  {
    "emoji": "🥘",
    "entity": "&#x1F958",
    "name": "Shallow Pan Of Food"
  },
  {
    "emoji": "🍲",
    "entity": "&#x1F372",
    "name": "Pot Of Food"
  },
  {
    "emoji": "🥣",
    "entity": "&#x1F963",
    "name": "Bowl With Spoon"
  },
  {
    "emoji": "🥗",
    "entity": "&#x1F957",
    "name": "Green Salad"
  },
  {
    "emoji": "🍿",
    "entity": "&#x1F37F",
    "name": "Popcorn"
  },
  {
    "emoji": "🧈",
    "entity": "&#x1F9C8",
    "name": "⊛ Butter"
  },
  {
    "emoji": "🧂",
    "entity": "&#x1F9C2",
    "name": "Salt"
  },
  {
    "emoji": "🥫",
    "entity": "&#x1F96B",
    "name": "Canned Food"
  },
  {
    "emoji": "🍱",
    "entity": "&#x1F371",
    "name": "Bento Box"
  },
  {
    "emoji": "🍘",
    "entity": "&#x1F358",
    "name": "Rice Cracker"
  },
  {
    "emoji": "🍙",
    "entity": "&#x1F359",
    "name": "Rice Ball"
  },
  {
    "emoji": "🍚",
    "entity": "&#x1F35A",
    "name": "Cooked Rice"
  },
  {
    "emoji": "🍛",
    "entity": "&#x1F35B",
    "name": "Curry Rice"
  },
  {
    "emoji": "🍜",
    "entity": "&#x1F35C",
    "name": "Steaming Bowl"
  },
  {
    "emoji": "🍝",
    "entity": "&#x1F35D",
    "name": "Spaghetti"
  },
  {
    "emoji": "🍠",
    "entity": "&#x1F360",
    "name": "Roasted Sweet Potato"
  },
  {
    "emoji": "🍢",
    "entity": "&#x1F362",
    "name": "Oden"
  },
  {
    "emoji": "🍣",
    "entity": "&#x1F363",
    "name": "Sushi"
  },
  {
    "emoji": "🍤",
    "entity": "&#x1F364",
    "name": "Fried Shrimp"
  },
  {
    "emoji": "🍥",
    "entity": "&#x1F365",
    "name": "Fish Cake With Swirl"
  },
  {
    "emoji": "🥮",
    "entity": "&#x1F96E",
    "name": "Moon Cake"
  },
  {
    "emoji": "🍡",
    "entity": "&#x1F361",
    "name": "Dango"
  },
  {
    "emoji": "🥟",
    "entity": "&#x1F95F",
    "name": "Dumpling"
  },
  {
    "emoji": "🥠",
    "entity": "&#x1F960",
    "name": "Fortune Cookie"
  },
  {
    "emoji": "🥡",
    "entity": "&#x1F961",
    "name": "Takeout Box"
  },
  {
    "emoji": "🦀",
    "entity": "&#x1F980",
    "name": "Crab"
  },
  {
    "emoji": "🦞",
    "entity": "&#x1F99E",
    "name": "Lobster"
  },
  {
    "emoji": "🦐",
    "entity": "&#x1F990",
    "name": "Shrimp"
  },
  {
    "emoji": "🦑",
    "entity": "&#x1F991",
    "name": "Squid"
  },
  {
    "emoji": "🦪",
    "entity": "&#x1F9AA",
    "name": "⊛ Oyster"
  },
  {
    "emoji": "🍦",
    "entity": "&#x1F366",
    "name": "Soft Ice Cream"
  },
  {
    "emoji": "🍧",
    "entity": "&#x1F367",
    "name": "Shaved Ice"
  },
  {
    "emoji": "🍨",
    "entity": "&#x1F368",
    "name": "Ice Cream"
  },
  {
    "emoji": "🍩",
    "entity": "&#x1F369",
    "name": "Doughnut"
  },
  {
    "emoji": "🍪",
    "entity": "&#x1F36A",
    "name": "Cookie"
  },
  {
    "emoji": "🎂",
    "entity": "&#x1F382",
    "name": "Birthday Cake"
  },
  {
    "emoji": "🍰",
    "entity": "&#x1F370",
    "name": "Shortcake"
  },
  {
    "emoji": "🧁",
    "entity": "&#x1F9C1",
    "name": "Cupcake"
  },
  {
    "emoji": "🥧",
    "entity": "&#x1F967",
    "name": "Pie"
  },
  {
    "emoji": "🍫",
    "entity": "&#x1F36B",
    "name": "Chocolate Bar"
  },
  {
    "emoji": "🍬",
    "entity": "&#x1F36C",
    "name": "Candy"
  },
  {
    "emoji": "🍭",
    "entity": "&#x1F36D",
    "name": "Lollipop"
  },
  {
    "emoji": "🍮",
    "entity": "&#x1F36E",
    "name": "Custard"
  },
  {
    "emoji": "🍯",
    "entity": "&#x1F36F",
    "name": "Honey Pot"
  },
  {
    "emoji": "🍼",
    "entity": "&#x1F37C",
    "name": "Baby Bottle"
  },
  {
    "emoji": "🥛",
    "entity": "&#x1F95B",
    "name": "Glass Of Milk"
  },
  {
    "emoji": "☕",
    "entity": "&#x2615",
    "name": "Hot Beverage"
  },
  {
    "emoji": "🍵",
    "entity": "&#x1F375",
    "name": "Teacup Without Handle"
  },
  {
    "emoji": "🍶",
    "entity": "&#x1F376",
    "name": "Sake"
  },
  {
    "emoji": "🍾",
    "entity": "&#x1F37E",
    "name": "Bottle With Popping Cork"
  },
  {
    "emoji": "🍷",
    "entity": "&#x1F377",
    "name": "Wine Glass"
  },
  {
    "emoji": "🍸",
    "entity": "&#x1F378",
    "name": "Cocktail Glass"
  },
  {
    "emoji": "🍹",
    "entity": "&#x1F379",
    "name": "Tropical Drink"
  },
  {
    "emoji": "🍺",
    "entity": "&#x1F37A",
    "name": "Beer Mug"
  },
  {
    "emoji": "🍻",
    "entity": "&#x1F37B",
    "name": "Clinking Beer Mugs"
  },
  {
    "emoji": "🥂",
    "entity": "&#x1F942",
    "name": "Clinking Glasses"
  },
  {
    "emoji": "🥃",
    "entity": "&#x1F943",
    "name": "Tumbler Glass"
  },
  {
    "emoji": "🥤",
    "entity": "&#x1F964",
    "name": "Cup With Straw"
  },
  {
    "emoji": "🧃",
    "entity": "&#x1F9C3",
    "name": "⊛ Beverage Box"
  },
  {
    "emoji": "🧉",
    "entity": "&#x1F9C9",
    "name": "⊛ Mate"
  },
  {
    "emoji": "🧊",
    "entity": "&#x1F9CA",
    "name": "⊛ Ice Cube"
  },
  {
    "emoji": "🥢",
    "entity": "&#x1F962",
    "name": "Chopsticks"
  },
  {
    "emoji": "🍽",
    "entity": "&#x1F37D",
    "name": "Fork And Knife With Plate"
  },
  {
    "emoji": "🍴",
    "entity": "&#x1F374",
    "name": "Fork And Knife"
  },
  {
    "emoji": "🥄",
    "entity": "&#x1F944",
    "name": "Spoon"
  },
  {
    "emoji": "🔪",
    "entity": "&#x1F52A",
    "name": "Kitchen Knife"
  },
  {
    "emoji": "🏺",
    "entity": "&#x1F3FA",
    "name": "Amphora"
  },
  {
    "emoji": "🌍",
    "entity": "&#x1F30D",
    "name": "Globe Showing Europe-Africa"
  },
  {
    "emoji": "🌎",
    "entity": "&#x1F30E",
    "name": "Globe Showing Americas"
  },
  {
    "emoji": "🌏",
    "entity": "&#x1F30F",
    "name": "Globe Showing Asia-Australia"
  },
  {
    "emoji": "🌐",
    "entity": "&#x1F310",
    "name": "Globe With Meridians"
  },
  {
    "emoji": "🗺",
    "entity": "&#x1F5FA",
    "name": "World Map"
  },
  {
    "emoji": "🗾",
    "entity": "&#x1F5FE",
    "name": "Map Of Japan"
  },
  {
    "emoji": "🧭",
    "entity": "&#x1F9ED",
    "name": "Compass"
  },
  {
    "emoji": "🏔",
    "entity": "&#x1F3D4",
    "name": "Snow-capped Mountain"
  },
  {
    "emoji": "⛰",
    "entity": "&#x26F0",
    "name": "Mountain"
  },
  {
    "emoji": "🌋",
    "entity": "&#x1F30B",
    "name": "Volcano"
  },
  {
    "emoji": "🗻",
    "entity": "&#x1F5FB",
    "name": "Mount Fuji"
  },
  {
    "emoji": "🏕",
    "entity": "&#x1F3D5",
    "name": "Camping"
  },
  {
    "emoji": "🏖",
    "entity": "&#x1F3D6",
    "name": "Beach With Umbrella"
  },
  {
    "emoji": "🏜",
    "entity": "&#x1F3DC",
    "name": "Desert"
  },
  {
    "emoji": "🏝",
    "entity": "&#x1F3DD",
    "name": "Desert Island"
  },
  {
    "emoji": "🏞",
    "entity": "&#x1F3DE",
    "name": "National Park"
  },
  {
    "emoji": "🏟",
    "entity": "&#x1F3DF",
    "name": "Stadium"
  },
  {
    "emoji": "🏛",
    "entity": "&#x1F3DB",
    "name": "Classical Building"
  },
  {
    "emoji": "🏗",
    "entity": "&#x1F3D7",
    "name": "Building Construction"
  },
  {
    "emoji": "🧱",
    "entity": "&#x1F9F1",
    "name": "Brick"
  },
  {
    "emoji": "🏘",
    "entity": "&#x1F3D8",
    "name": "Houses"
  },
  {
    "emoji": "🏚",
    "entity": "&#x1F3DA",
    "name": "Derelict House"
  },
  {
    "emoji": "🏠",
    "entity": "&#x1F3E0",
    "name": "House"
  },
  {
    "emoji": "🏡",
    "entity": "&#x1F3E1",
    "name": "House With Garden"
  },
  {
    "emoji": "🏢",
    "entity": "&#x1F3E2",
    "name": "Office Building"
  },
  {
    "emoji": "🏣",
    "entity": "&#x1F3E3",
    "name": "Japanese Post Office"
  },
  {
    "emoji": "🏤",
    "entity": "&#x1F3E4",
    "name": "Post Office"
  },
  {
    "emoji": "🏥",
    "entity": "&#x1F3E5",
    "name": "Hospital"
  },
  {
    "emoji": "🏦",
    "entity": "&#x1F3E6",
    "name": "Bank"
  },
  {
    "emoji": "🏨",
    "entity": "&#x1F3E8",
    "name": "Hotel"
  },
  {
    "emoji": "🏩",
    "entity": "&#x1F3E9",
    "name": "Love Hotel"
  },
  {
    "emoji": "🏪",
    "entity": "&#x1F3EA",
    "name": "Convenience Store"
  },
  {
    "emoji": "🏫",
    "entity": "&#x1F3EB",
    "name": "School"
  },
  {
    "emoji": "🏬",
    "entity": "&#x1F3EC",
    "name": "Department Store"
  },
  {
    "emoji": "🏭",
    "entity": "&#x1F3ED",
    "name": "Factory"
  },
  {
    "emoji": "🏯",
    "entity": "&#x1F3EF",
    "name": "Japanese Castle"
  },
  {
    "emoji": "🏰",
    "entity": "&#x1F3F0",
    "name": "Castle"
  },
  {
    "emoji": "💒",
    "entity": "&#x1F492",
    "name": "Wedding"
  },
  {
    "emoji": "🗼",
    "entity": "&#x1F5FC",
    "name": "Tokyo Tower"
  },
  {
    "emoji": "🗽",
    "entity": "&#x1F5FD",
    "name": "Statue Of Liberty"
  },
  {
    "emoji": "⛪",
    "entity": "&#x26EA",
    "name": "Church"
  },
  {
    "emoji": "🕌",
    "entity": "&#x1F54C",
    "name": "Mosque"
  },
  {
    "emoji": "🛕",
    "entity": "&#x1F6D5",
    "name": "⊛ Hindu Temple"
  },
  {
    "emoji": "🕍",
    "entity": "&#x1F54D",
    "name": "Synagogue"
  },
  {
    "emoji": "⛩",
    "entity": "&#x26E9",
    "name": "Shinto Shrine"
  },
  {
    "emoji": "🕋",
    "entity": "&#x1F54B",
    "name": "Kaaba"
  },
  {
    "emoji": "⛲",
    "entity": "&#x26F2",
    "name": "Fountain"
  },
  {
    "emoji": "⛺",
    "entity": "&#x26FA",
    "name": "Tent"
  },
  {
    "emoji": "🌁",
    "entity": "&#x1F301",
    "name": "Foggy"
  },
  {
    "emoji": "🌃",
    "entity": "&#x1F303",
    "name": "Night With Stars"
  },
  {
    "emoji": "🏙",
    "entity": "&#x1F3D9",
    "name": "Cityscape"
  },
  {
    "emoji": "🌄",
    "entity": "&#x1F304",
    "name": "Sunrise Over Mountains"
  },
  {
    "emoji": "🌅",
    "entity": "&#x1F305",
    "name": "Sunrise"
  },
  {
    "emoji": "🌆",
    "entity": "&#x1F306",
    "name": "Cityscape At Dusk"
  },
  {
    "emoji": "🌇",
    "entity": "&#x1F307",
    "name": "Sunset"
  },
  {
    "emoji": "🌉",
    "entity": "&#x1F309",
    "name": "Bridge At Night"
  },
  {
    "emoji": "♨",
    "entity": "&#x2668",
    "name": "Hot Springs"
  },
  {
    "emoji": "🎠",
    "entity": "&#x1F3A0",
    "name": "Carousel Horse"
  },
  {
    "emoji": "🎡",
    "entity": "&#x1F3A1",
    "name": "Ferris Wheel"
  },
  {
    "emoji": "🎢",
    "entity": "&#x1F3A2",
    "name": "Roller Coaster"
  },
  {
    "emoji": "💈",
    "entity": "&#x1F488",
    "name": "Barber Pole"
  },
  {
    "emoji": "🎪",
    "entity": "&#x1F3AA",
    "name": "Circus Tent"
  },
  {
    "emoji": "🚂",
    "entity": "&#x1F682",
    "name": "Locomotive"
  },
  {
    "emoji": "🚃",
    "entity": "&#x1F683",
    "name": "Railway Car"
  },
  {
    "emoji": "🚄",
    "entity": "&#x1F684",
    "name": "High-speed Train"
  },
  {
    "emoji": "🚅",
    "entity": "&#x1F685",
    "name": "Bullet Train"
  },
  {
    "emoji": "🚆",
    "entity": "&#x1F686",
    "name": "Train"
  },
  {
    "emoji": "🚇",
    "entity": "&#x1F687",
    "name": "Metro"
  },
  {
    "emoji": "🚈",
    "entity": "&#x1F688",
    "name": "Light Rail"
  },
  {
    "emoji": "🚉",
    "entity": "&#x1F689",
    "name": "Station"
  },
  {
    "emoji": "🚊",
    "entity": "&#x1F68A",
    "name": "Tram"
  },
  {
    "emoji": "🚝",
    "entity": "&#x1F69D",
    "name": "Monorail"
  },
  {
    "emoji": "🚞",
    "entity": "&#x1F69E",
    "name": "Mountain Railway"
  },
  {
    "emoji": "🚋",
    "entity": "&#x1F68B",
    "name": "Tram Car"
  },
  {
    "emoji": "🚌",
    "entity": "&#x1F68C",
    "name": "Bus"
  },
  {
    "emoji": "🚍",
    "entity": "&#x1F68D",
    "name": "Oncoming Bus"
  },
  {
    "emoji": "🚎",
    "entity": "&#x1F68E",
    "name": "Trolleybus"
  },
  {
    "emoji": "🚐",
    "entity": "&#x1F690",
    "name": "Minibus"
  },
  {
    "emoji": "🚑",
    "entity": "&#x1F691",
    "name": "Ambulance"
  },
  {
    "emoji": "🚒",
    "entity": "&#x1F692",
    "name": "Fire Engine"
  },
  {
    "emoji": "🚓",
    "entity": "&#x1F693",
    "name": "Police Car"
  },
  {
    "emoji": "🚔",
    "entity": "&#x1F694",
    "name": "Oncoming Police Car"
  },
  {
    "emoji": "🚕",
    "entity": "&#x1F695",
    "name": "Taxi"
  },
  {
    "emoji": "🚖",
    "entity": "&#x1F696",
    "name": "Oncoming Taxi"
  },
  {
    "emoji": "🚗",
    "entity": "&#x1F697",
    "name": "Automobile"
  },
  {
    "emoji": "🚘",
    "entity": "&#x1F698",
    "name": "Oncoming Automobile"
  },
  {
    "emoji": "🚙",
    "entity": "&#x1F699",
    "name": "Sport Utility Vehicle"
  },
  {
    "emoji": "🚚",
    "entity": "&#x1F69A",
    "name": "Delivery Truck"
  },
  {
    "emoji": "🚛",
    "entity": "&#x1F69B",
    "name": "Articulated Lorry"
  },
  {
    "emoji": "🚜",
    "entity": "&#x1F69C",
    "name": "Tractor"
  },
  {
    "emoji": "🏎",
    "entity": "&#x1F3CE",
    "name": "Racing Car"
  },
  {
    "emoji": "🏍",
    "entity": "&#x1F3CD",
    "name": "Motorcycle"
  },
  {
    "emoji": "🛵",
    "entity": "&#x1F6F5",
    "name": "Motor Scooter"
  },
  {
    "emoji": "🦽",
    "entity": "&#x1F9BD",
    "name": "⊛ Manual Wheelchair"
  },
  {
    "emoji": "🦼",
    "entity": "&#x1F9BC",
    "name": "⊛ Motorized Wheelchair"
  },
  {
    "emoji": "🛺",
    "entity": "&#x1F6FA",
    "name": "⊛ Auto Rickshaw"
  },
  {
    "emoji": "🚲",
    "entity": "&#x1F6B2",
    "name": "Bicycle"
  },
  {
    "emoji": "🛴",
    "entity": "&#x1F6F4",
    "name": "Kick Scooter"
  },
  {
    "emoji": "🛹",
    "entity": "&#x1F6F9",
    "name": "Skateboard"
  },
  {
    "emoji": "🚏",
    "entity": "&#x1F68F",
    "name": "Bus Stop"
  },
  {
    "emoji": "🛣",
    "entity": "&#x1F6E3",
    "name": "Motorway"
  },
  {
    "emoji": "🛤",
    "entity": "&#x1F6E4",
    "name": "Railway Track"
  },
  {
    "emoji": "🛢",
    "entity": "&#x1F6E2",
    "name": "Oil Drum"
  },
  {
    "emoji": "⛽",
    "entity": "&#x26FD",
    "name": "Fuel Pump"
  },
  {
    "emoji": "🚨",
    "entity": "&#x1F6A8",
    "name": "Police Car Light"
  },
  {
    "emoji": "🚥",
    "entity": "&#x1F6A5",
    "name": "Horizontal Traffic Light"
  },
  {
    "emoji": "🚦",
    "entity": "&#x1F6A6",
    "name": "Vertical Traffic Light"
  },
  {
    "emoji": "🛑",
    "entity": "&#x1F6D1",
    "name": "Stop Sign"
  },
  {
    "emoji": "🚧",
    "entity": "&#x1F6A7",
    "name": "Construction"
  },
  {
    "emoji": "⚓",
    "entity": "&#x2693",
    "name": "Anchor"
  },
  {
    "emoji": "⛵",
    "entity": "&#x26F5",
    "name": "Sailboat"
  },
  {
    "emoji": "🛶",
    "entity": "&#x1F6F6",
    "name": "Canoe"
  },
  {
    "emoji": "🚤",
    "entity": "&#x1F6A4",
    "name": "Speedboat"
  },
  {
    "emoji": "🛳",
    "entity": "&#x1F6F3",
    "name": "Passenger Ship"
  },
  {
    "emoji": "⛴",
    "entity": "&#x26F4",
    "name": "Ferry"
  },
  {
    "emoji": "🛥",
    "entity": "&#x1F6E5",
    "name": "Motor Boat"
  },
  {
    "emoji": "🚢",
    "entity": "&#x1F6A2",
    "name": "Ship"
  },
  {
    "emoji": "✈",
    "entity": "&#x2708",
    "name": "Airplane"
  },
  {
    "emoji": "🛩",
    "entity": "&#x1F6E9",
    "name": "Small Airplane"
  },
  {
    "emoji": "🛫",
    "entity": "&#x1F6EB",
    "name": "Airplane Departure"
  },
  {
    "emoji": "🛬",
    "entity": "&#x1F6EC",
    "name": "Airplane Arrival"
  },
  {
    "emoji": "🪂",
    "entity": "&#x1FA82",
    "name": "⊛ Parachute"
  },
  {
    "emoji": "💺",
    "entity": "&#x1F4BA",
    "name": "Seat"
  },
  {
    "emoji": "🚁",
    "entity": "&#x1F681",
    "name": "Helicopter"
  },
  {
    "emoji": "🚟",
    "entity": "&#x1F69F",
    "name": "Suspension Railway"
  },
  {
    "emoji": "🚠",
    "entity": "&#x1F6A0",
    "name": "Mountain Cableway"
  },
  {
    "emoji": "🚡",
    "entity": "&#x1F6A1",
    "name": "Aerial Tramway"
  },
  {
    "emoji": "🛰",
    "entity": "&#x1F6F0",
    "name": "Satellite"
  },
  {
    "emoji": "🚀",
    "entity": "&#x1F680",
    "name": "Rocket"
  },
  {
    "emoji": "🛸",
    "entity": "&#x1F6F8",
    "name": "Flying Saucer"
  },
  {
    "emoji": "🛎",
    "entity": "&#x1F6CE",
    "name": "Bellhop Bell"
  },
  {
    "emoji": "🧳",
    "entity": "&#x1F9F3",
    "name": "Luggage"
  },
  {
    "emoji": "⌛",
    "entity": "&#x231B",
    "name": "Hourglass Done"
  },
  {
    "emoji": "⏳",
    "entity": "&#x23F3",
    "name": "Hourglass Not Done"
  },
  {
    "emoji": "⌚",
    "entity": "&#x231A",
    "name": "Watch"
  },
  {
    "emoji": "⏰",
    "entity": "&#x23F0",
    "name": "Alarm Clock"
  },
  {
    "emoji": "⏱",
    "entity": "&#x23F1",
    "name": "Stopwatch"
  },
  {
    "emoji": "⏲",
    "entity": "&#x23F2",
    "name": "Timer Clock"
  },
  {
    "emoji": "🕰",
    "entity": "&#x1F570",
    "name": "Mantelpiece Clock"
  },
  {
    "emoji": "🕛",
    "entity": "&#x1F55B",
    "name": "Twelve O’clock"
  },
  {
    "emoji": "🕧",
    "entity": "&#x1F567",
    "name": "Twelve-thirty"
  },
  {
    "emoji": "🕐",
    "entity": "&#x1F550",
    "name": "One O’clock"
  },
  {
    "emoji": "🕜",
    "entity": "&#x1F55C",
    "name": "One-thirty"
  },
  {
    "emoji": "🕑",
    "entity": "&#x1F551",
    "name": "Two O’clock"
  },
  {
    "emoji": "🕝",
    "entity": "&#x1F55D",
    "name": "Two-thirty"
  },
  {
    "emoji": "🕒",
    "entity": "&#x1F552",
    "name": "Three O’clock"
  },
  {
    "emoji": "🕞",
    "entity": "&#x1F55E",
    "name": "Three-thirty"
  },
  {
    "emoji": "🕓",
    "entity": "&#x1F553",
    "name": "Four O’clock"
  },
  {
    "emoji": "🕟",
    "entity": "&#x1F55F",
    "name": "Four-thirty"
  },
  {
    "emoji": "🕔",
    "entity": "&#x1F554",
    "name": "Five O’clock"
  },
  {
    "emoji": "🕠",
    "entity": "&#x1F560",
    "name": "Five-thirty"
  },
  {
    "emoji": "🕕",
    "entity": "&#x1F555",
    "name": "Six O’clock"
  },
  {
    "emoji": "🕡",
    "entity": "&#x1F561",
    "name": "Six-thirty"
  },
  {
    "emoji": "🕖",
    "entity": "&#x1F556",
    "name": "Seven O’clock"
  },
  {
    "emoji": "🕢",
    "entity": "&#x1F562",
    "name": "Seven-thirty"
  },
  {
    "emoji": "🕗",
    "entity": "&#x1F557",
    "name": "Eight O’clock"
  },
  {
    "emoji": "🕣",
    "entity": "&#x1F563",
    "name": "Eight-thirty"
  },
  {
    "emoji": "🕘",
    "entity": "&#x1F558",
    "name": "Nine O’clock"
  },
  {
    "emoji": "🕤",
    "entity": "&#x1F564",
    "name": "Nine-thirty"
  },
  {
    "emoji": "🕙",
    "entity": "&#x1F559",
    "name": "Ten O’clock"
  },
  {
    "emoji": "🕥",
    "entity": "&#x1F565",
    "name": "Ten-thirty"
  },
  {
    "emoji": "🕚",
    "entity": "&#x1F55A",
    "name": "Eleven O’clock"
  },
  {
    "emoji": "🕦",
    "entity": "&#x1F566",
    "name": "Eleven-thirty"
  },
  {
    "emoji": "🌑",
    "entity": "&#x1F311",
    "name": "New Moon"
  },
  {
    "emoji": "🌒",
    "entity": "&#x1F312",
    "name": "Waxing Crescent Moon"
  },
  {
    "emoji": "🌓",
    "entity": "&#x1F313",
    "name": "First Quarter Moon"
  },
  {
    "emoji": "🌔",
    "entity": "&#x1F314",
    "name": "Waxing Gibbous Moon"
  },
  {
    "emoji": "🌕",
    "entity": "&#x1F315",
    "name": "Full Moon"
  },
  {
    "emoji": "🌖",
    "entity": "&#x1F316",
    "name": "Waning Gibbous Moon"
  },
  {
    "emoji": "🌗",
    "entity": "&#x1F317",
    "name": "Last Quarter Moon"
  },
  {
    "emoji": "🌘",
    "entity": "&#x1F318",
    "name": "Waning Crescent Moon"
  },
  {
    "emoji": "🌙",
    "entity": "&#x1F319",
    "name": "Crescent Moon"
  },
  {
    "emoji": "🌚",
    "entity": "&#x1F31A",
    "name": "New Moon Face"
  },
  {
    "emoji": "🌛",
    "entity": "&#x1F31B",
    "name": "First Quarter Moon Face"
  },
  {
    "emoji": "🌜",
    "entity": "&#x1F31C",
    "name": "Last Quarter Moon Face"
  },
  {
    "emoji": "🌡",
    "entity": "&#x1F321",
    "name": "Thermometer"
  },
  {
    "emoji": "☀",
    "entity": "&#x2600",
    "name": "Sun"
  },
  {
    "emoji": "🌝",
    "entity": "&#x1F31D",
    "name": "Full Moon Face"
  },
  {
    "emoji": "🌞",
    "entity": "&#x1F31E",
    "name": "Sun With Face"
  },
  {
    "emoji": "🪐",
    "entity": "&#x1FA90",
    "name": "⊛ Ringed Planet"
  },
  {
    "emoji": "⭐",
    "entity": "&#x2B50",
    "name": "Star"
  },
  {
    "emoji": "🌟",
    "entity": "&#x1F31F",
    "name": "Glowing Star"
  },
  {
    "emoji": "🌠",
    "entity": "&#x1F320",
    "name": "Shooting Star"
  },
  {
    "emoji": "🌌",
    "entity": "&#x1F30C",
    "name": "Milky Way"
  },
  {
    "emoji": "☁",
    "entity": "&#x2601",
    "name": "Cloud"
  },
  {
    "emoji": "⛅",
    "entity": "&#x26C5",
    "name": "Sun Behind Cloud"
  },
  {
    "emoji": "⛈",
    "entity": "&#x26C8",
    "name": "Cloud With Lightning And Rain"
  },
  {
    "emoji": "🌤",
    "entity": "&#x1F324",
    "name": "Sun Behind Small Cloud"
  },
  {
    "emoji": "🌥",
    "entity": "&#x1F325",
    "name": "Sun Behind Large Cloud"
  },
  {
    "emoji": "🌦",
    "entity": "&#x1F326",
    "name": "Sun Behind Rain Cloud"
  },
  {
    "emoji": "🌧",
    "entity": "&#x1F327",
    "name": "Cloud With Rain"
  },
  {
    "emoji": "🌨",
    "entity": "&#x1F328",
    "name": "Cloud With Snow"
  },
  {
    "emoji": "🌩",
    "entity": "&#x1F329",
    "name": "Cloud With Lightning"
  },
  {
    "emoji": "🌪",
    "entity": "&#x1F32A",
    "name": "Tornado"
  },
  {
    "emoji": "🌫",
    "entity": "&#x1F32B",
    "name": "Fog"
  },
  {
    "emoji": "🌬",
    "entity": "&#x1F32C",
    "name": "Wind Face"
  },
  {
    "emoji": "🌀",
    "entity": "&#x1F300",
    "name": "Cyclone"
  },
  {
    "emoji": "🌈",
    "entity": "&#x1F308",
    "name": "Rainbow"
  },
  {
    "emoji": "🌂",
    "entity": "&#x1F302",
    "name": "Closed Umbrella"
  },
  {
    "emoji": "☂",
    "entity": "&#x2602",
    "name": "Umbrella"
  },
  {
    "emoji": "☔",
    "entity": "&#x2614",
    "name": "Umbrella With Rain Drops"
  },
  {
    "emoji": "⛱",
    "entity": "&#x26F1",
    "name": "Umbrella On Ground"
  },
  {
    "emoji": "⚡",
    "entity": "&#x26A1",
    "name": "High Voltage"
  },
  {
    "emoji": "❄",
    "entity": "&#x2744",
    "name": "Snowflake"
  },
  {
    "emoji": "☃",
    "entity": "&#x2603",
    "name": "Snowman"
  },
  {
    "emoji": "⛄",
    "entity": "&#x26C4",
    "name": "Snowman Without Snow"
  },
  {
    "emoji": "☄",
    "entity": "&#x2604",
    "name": "Comet"
  },
  {
    "emoji": "🔥",
    "entity": "&#x1F525",
    "name": "Fire"
  },
  {
    "emoji": "💧",
    "entity": "&#x1F4A7",
    "name": "Droplet"
  },
  {
    "emoji": "🌊",
    "entity": "&#x1F30A",
    "name": "Water Wave"
  },
  {
    "emoji": "🎃",
    "entity": "&#x1F383",
    "name": "Jack-o-lantern"
  },
  {
    "emoji": "🎄",
    "entity": "&#x1F384",
    "name": "Christmas Tree"
  },
  {
    "emoji": "🎆",
    "entity": "&#x1F386",
    "name": "Fireworks"
  },
  {
    "emoji": "🎇",
    "entity": "&#x1F387",
    "name": "Sparkler"
  },
  {
    "emoji": "🧨",
    "entity": "&#x1F9E8",
    "name": "Firecracker"
  },
  {
    "emoji": "✨",
    "entity": "&#x2728",
    "name": "Sparkles"
  },
  {
    "emoji": "🎈",
    "entity": "&#x1F388",
    "name": "Balloon"
  },
  {
    "emoji": "🎉",
    "entity": "&#x1F389",
    "name": "Party Popper"
  },
  {
    "emoji": "🎊",
    "entity": "&#x1F38A",
    "name": "Confetti Ball"
  },
  {
    "emoji": "🎋",
    "entity": "&#x1F38B",
    "name": "Tanabata Tree"
  },
  {
    "emoji": "🎍",
    "entity": "&#x1F38D",
    "name": "Pine Decoration"
  },
  {
    "emoji": "🎎",
    "entity": "&#x1F38E",
    "name": "Japanese Dolls"
  },
  {
    "emoji": "🎏",
    "entity": "&#x1F38F",
    "name": "Carp Streamer"
  },
  {
    "emoji": "🎐",
    "entity": "&#x1F390",
    "name": "Wind Chime"
  },
  {
    "emoji": "🎑",
    "entity": "&#x1F391",
    "name": "Moon Viewing Ceremony"
  },
  {
    "emoji": "🧧",
    "entity": "&#x1F9E7",
    "name": "Red Envelope"
  },
  {
    "emoji": "🎀",
    "entity": "&#x1F380",
    "name": "Ribbon"
  },
  {
    "emoji": "🎁",
    "entity": "&#x1F381",
    "name": "Wrapped Gift"
  },
  {
    "emoji": "🎗",
    "entity": "&#x1F397",
    "name": "Reminder Ribbon"
  },
  {
    "emoji": "🎟",
    "entity": "&#x1F39F",
    "name": "Admission Tickets"
  },
  {
    "emoji": "🎫",
    "entity": "&#x1F3AB",
    "name": "Ticket"
  },
  {
    "emoji": "🎖",
    "entity": "&#x1F396",
    "name": "Military Medal"
  },
  {
    "emoji": "🏆",
    "entity": "&#x1F3C6",
    "name": "Trophy"
  },
  {
    "emoji": "🏅",
    "entity": "&#x1F3C5",
    "name": "Sports Medal"
  },
  {
    "emoji": "🥇",
    "entity": "&#x1F947",
    "name": "1st Place Medal"
  },
  {
    "emoji": "🥈",
    "entity": "&#x1F948",
    "name": "2nd Place Medal"
  },
  {
    "emoji": "🥉",
    "entity": "&#x1F949",
    "name": "3rd Place Medal"
  },
  {
    "emoji": "⚽",
    "entity": "&#x26BD",
    "name": "Soccer Ball"
  },
  {
    "emoji": "⚾",
    "entity": "&#x26BE",
    "name": "Baseball"
  },
  {
    "emoji": "🥎",
    "entity": "&#x1F94E",
    "name": "Softball"
  },
  {
    "emoji": "🏀",
    "entity": "&#x1F3C0",
    "name": "Basketball"
  },
  {
    "emoji": "🏐",
    "entity": "&#x1F3D0",
    "name": "Volleyball"
  },
  {
    "emoji": "🏈",
    "entity": "&#x1F3C8",
    "name": "American Football"
  },
  {
    "emoji": "🏉",
    "entity": "&#x1F3C9",
    "name": "Rugby Football"
  },
  {
    "emoji": "🎾",
    "entity": "&#x1F3BE",
    "name": "Tennis"
  },
  {
    "emoji": "🥏",
    "entity": "&#x1F94F",
    "name": "Flying Disc"
  },
  {
    "emoji": "🎳",
    "entity": "&#x1F3B3",
    "name": "Bowling"
  },
  {
    "emoji": "🏏",
    "entity": "&#x1F3CF",
    "name": "Cricket Game"
  },
  {
    "emoji": "🏑",
    "entity": "&#x1F3D1",
    "name": "Field Hockey"
  },
  {
    "emoji": "🏒",
    "entity": "&#x1F3D2",
    "name": "Ice Hockey"
  },
  {
    "emoji": "🥍",
    "entity": "&#x1F94D",
    "name": "Lacrosse"
  },
  {
    "emoji": "🏓",
    "entity": "&#x1F3D3",
    "name": "Ping Pong"
  },
  {
    "emoji": "🏸",
    "entity": "&#x1F3F8",
    "name": "Badminton"
  },
  {
    "emoji": "🥊",
    "entity": "&#x1F94A",
    "name": "Boxing Glove"
  },
  {
    "emoji": "🥋",
    "entity": "&#x1F94B",
    "name": "Martial Arts Uniform"
  },
  {
    "emoji": "🥅",
    "entity": "&#x1F945",
    "name": "Goal Net"
  },
  {
    "emoji": "⛳",
    "entity": "&#x26F3",
    "name": "Flag In Hole"
  },
  {
    "emoji": "⛸",
    "entity": "&#x26F8",
    "name": "Ice Skate"
  },
  {
    "emoji": "🎣",
    "entity": "&#x1F3A3",
    "name": "Fishing Pole"
  },
  {
    "emoji": "🤿",
    "entity": "&#x1F93F",
    "name": "⊛ Diving Mask"
  },
  {
    "emoji": "🎽",
    "entity": "&#x1F3BD",
    "name": "Running Shirt"
  },
  {
    "emoji": "🎿",
    "entity": "&#x1F3BF",
    "name": "Skis"
  },
  {
    "emoji": "🛷",
    "entity": "&#x1F6F7",
    "name": "Sled"
  },
  {
    "emoji": "🥌",
    "entity": "&#x1F94C",
    "name": "Curling Stone"
  },
  {
    "emoji": "🎯",
    "entity": "&#x1F3AF",
    "name": "Direct Hit"
  },
  {
    "emoji": "🪀",
    "entity": "&#x1FA80",
    "name": "⊛ Yo-yo"
  },
  {
    "emoji": "🪁",
    "entity": "&#x1FA81",
    "name": "⊛ Kite"
  },
  {
    "emoji": "🎱",
    "entity": "&#x1F3B1",
    "name": "Pool 8 Ball"
  },
  {
    "emoji": "🔮",
    "entity": "&#x1F52E",
    "name": "Crystal Ball"
  },
  {
    "emoji": "🧿",
    "entity": "&#x1F9FF",
    "name": "Nazar Amulet"
  },
  {
    "emoji": "🎮",
    "entity": "&#x1F3AE",
    "name": "Video Game"
  },
  {
    "emoji": "🕹",
    "entity": "&#x1F579",
    "name": "Joystick"
  },
  {
    "emoji": "🎰",
    "entity": "&#x1F3B0",
    "name": "Slot Machine"
  },
  {
    "emoji": "🎲",
    "entity": "&#x1F3B2",
    "name": "Game Die"
  },
  {
    "emoji": "🧩",
    "entity": "&#x1F9E9",
    "name": "Puzzle Piece"
  },
  {
    "emoji": "🧸",
    "entity": "&#x1F9F8",
    "name": "Teddy Bear"
  },
  {
    "emoji": "♠",
    "entity": "&#x2660",
    "name": "Spade Suit"
  },
  {
    "emoji": "♥",
    "entity": "&#x2665",
    "name": "Heart Suit"
  },
  {
    "emoji": "♦",
    "entity": "&#x2666",
    "name": "Diamond Suit"
  },
  {
    "emoji": "♣",
    "entity": "&#x2663",
    "name": "Club Suit"
  },
  {
    "emoji": "♟",
    "entity": "&#x265F",
    "name": "Chess Pawn"
  },
  {
    "emoji": "🃏",
    "entity": "&#x1F0CF",
    "name": "Joker"
  },
  {
    "emoji": "🀄",
    "entity": "&#x1F004",
    "name": "Mahjong Red Dragon"
  },
  {
    "emoji": "🎴",
    "entity": "&#x1F3B4",
    "name": "Flower Playing Cards"
  },
  {
    "emoji": "🎭",
    "entity": "&#x1F3AD",
    "name": "Performing Arts"
  },
  {
    "emoji": "🖼",
    "entity": "&#x1F5BC",
    "name": "Framed Picture"
  },
  {
    "emoji": "🎨",
    "entity": "&#x1F3A8",
    "name": "Artist Palette"
  },
  {
    "emoji": "🧵",
    "entity": "&#x1F9F5",
    "name": "Thread"
  },
  {
    "emoji": "🧶",
    "entity": "&#x1F9F6",
    "name": "Yarn"
  },
  {
    "emoji": "👓",
    "entity": "&#x1F453",
    "name": "Glasses"
  },
  {
    "emoji": "🕶",
    "entity": "&#x1F576",
    "name": "Sunglasses"
  },
  {
    "emoji": "🥽",
    "entity": "&#x1F97D",
    "name": "Goggles"
  },
  {
    "emoji": "🥼",
    "entity": "&#x1F97C",
    "name": "Lab Coat"
  },
  {
    "emoji": "🦺",
    "entity": "&#x1F9BA",
    "name": "⊛ Safety Vest"
  },
  {
    "emoji": "👔",
    "entity": "&#x1F454",
    "name": "Necktie"
  },
  {
    "emoji": "👕",
    "entity": "&#x1F455",
    "name": "T-shirt"
  },
  {
    "emoji": "👖",
    "entity": "&#x1F456",
    "name": "Jeans"
  },
  {
    "emoji": "🧣",
    "entity": "&#x1F9E3",
    "name": "Scarf"
  },
  {
    "emoji": "🧤",
    "entity": "&#x1F9E4",
    "name": "Gloves"
  },
  {
    "emoji": "🧥",
    "entity": "&#x1F9E5",
    "name": "Coat"
  },
  {
    "emoji": "🧦",
    "entity": "&#x1F9E6",
    "name": "Socks"
  },
  {
    "emoji": "👗",
    "entity": "&#x1F457",
    "name": "Dress"
  },
  {
    "emoji": "👘",
    "entity": "&#x1F458",
    "name": "Kimono"
  },
  {
    "emoji": "🥻",
    "entity": "&#x1F97B",
    "name": "⊛ Sari"
  },
  {
    "emoji": "🩱",
    "entity": "&#x1FA71",
    "name": "⊛ One-piece Swimsuit"
  },
  {
    "emoji": "🩲",
    "entity": "&#x1FA72",
    "name": "⊛ Briefs"
  },
  {
    "emoji": "🩳",
    "entity": "&#x1FA73",
    "name": "⊛ Shorts"
  },
  {
    "emoji": "👙",
    "entity": "&#x1F459",
    "name": "Bikini"
  },
  {
    "emoji": "👚",
    "entity": "&#x1F45A",
    "name": "Woman’s Clothes"
  },
  {
    "emoji": "👛",
    "entity": "&#x1F45B",
    "name": "Purse"
  },
  {
    "emoji": "👜",
    "entity": "&#x1F45C",
    "name": "Handbag"
  },
  {
    "emoji": "👝",
    "entity": "&#x1F45D",
    "name": "Clutch Bag"
  },
  {
    "emoji": "🛍",
    "entity": "&#x1F6CD",
    "name": "Shopping Bags"
  },
  {
    "emoji": "🎒",
    "entity": "&#x1F392",
    "name": "Backpack"
  },
  {
    "emoji": "👞",
    "entity": "&#x1F45E",
    "name": "Man’s Shoe"
  },
  {
    "emoji": "👟",
    "entity": "&#x1F45F",
    "name": "Running Shoe"
  },
  {
    "emoji": "🥾",
    "entity": "&#x1F97E",
    "name": "Hiking Boot"
  },
  {
    "emoji": "🥿",
    "entity": "&#x1F97F",
    "name": "Flat Shoe"
  },
  {
    "emoji": "👠",
    "entity": "&#x1F460",
    "name": "High-heeled Shoe"
  },
  {
    "emoji": "👡",
    "entity": "&#x1F461",
    "name": "Woman’s Sandal"
  },
  {
    "emoji": "🩰",
    "entity": "&#x1FA70",
    "name": "⊛ Ballet Shoes"
  },
  {
    "emoji": "👢",
    "entity": "&#x1F462",
    "name": "Woman’s Boot"
  },
  {
    "emoji": "👑",
    "entity": "&#x1F451",
    "name": "Crown"
  },
  {
    "emoji": "👒",
    "entity": "&#x1F452",
    "name": "Woman’s Hat"
  },
  {
    "emoji": "🎩",
    "entity": "&#x1F3A9",
    "name": "Top Hat"
  },
  {
    "emoji": "🎓",
    "entity": "&#x1F393",
    "name": "Graduation Cap"
  },
  {
    "emoji": "🧢",
    "entity": "&#x1F9E2",
    "name": "Billed Cap"
  },
  {
    "emoji": "⛑",
    "entity": "&#x26D1",
    "name": "Rescue Worker’s Helmet"
  },
  {
    "emoji": "📿",
    "entity": "&#x1F4FF",
    "name": "Prayer Beads"
  },
  {
    "emoji": "💄",
    "entity": "&#x1F484",
    "name": "Lipstick"
  },
  {
    "emoji": "💍",
    "entity": "&#x1F48D",
    "name": "Ring"
  },
  {
    "emoji": "💎",
    "entity": "&#x1F48E",
    "name": "Gem Stone"
  },
  {
    "emoji": "🔇",
    "entity": "&#x1F507",
    "name": "Muted Speaker"
  },
  {
    "emoji": "🔈",
    "entity": "&#x1F508",
    "name": "Speaker Low Volume"
  },
  {
    "emoji": "🔉",
    "entity": "&#x1F509",
    "name": "Speaker Medium Volume"
  },
  {
    "emoji": "🔊",
    "entity": "&#x1F50A",
    "name": "Speaker High Volume"
  },
  {
    "emoji": "📢",
    "entity": "&#x1F4E2",
    "name": "Loudspeaker"
  },
  {
    "emoji": "📣",
    "entity": "&#x1F4E3",
    "name": "Megaphone"
  },
  {
    "emoji": "📯",
    "entity": "&#x1F4EF",
    "name": "Postal Horn"
  },
  {
    "emoji": "🔔",
    "entity": "&#x1F514",
    "name": "Bell"
  },
  {
    "emoji": "🔕",
    "entity": "&#x1F515",
    "name": "Bell With Slash"
  },
  {
    "emoji": "🎼",
    "entity": "&#x1F3BC",
    "name": "Musical Score"
  },
  {
    "emoji": "🎵",
    "entity": "&#x1F3B5",
    "name": "Musical Note"
  },
  {
    "emoji": "🎶",
    "entity": "&#x1F3B6",
    "name": "Musical Notes"
  },
  {
    "emoji": "🎙",
    "entity": "&#x1F399",
    "name": "Studio Microphone"
  },
  {
    "emoji": "🎚",
    "entity": "&#x1F39A",
    "name": "Level Slider"
  },
  {
    "emoji": "🎛",
    "entity": "&#x1F39B",
    "name": "Control Knobs"
  },
  {
    "emoji": "🎤",
    "entity": "&#x1F3A4",
    "name": "Microphone"
  },
  {
    "emoji": "🎧",
    "entity": "&#x1F3A7",
    "name": "Headphone"
  },
  {
    "emoji": "📻",
    "entity": "&#x1F4FB",
    "name": "Radio"
  },
  {
    "emoji": "🎷",
    "entity": "&#x1F3B7",
    "name": "Saxophone"
  },
  {
    "emoji": "🎸",
    "entity": "&#x1F3B8",
    "name": "Guitar"
  },
  {
    "emoji": "🎹",
    "entity": "&#x1F3B9",
    "name": "Musical Keyboard"
  },
  {
    "emoji": "🎺",
    "entity": "&#x1F3BA",
    "name": "Trumpet"
  },
  {
    "emoji": "🎻",
    "entity": "&#x1F3BB",
    "name": "Violin"
  },
  {
    "emoji": "🪕",
    "entity": "&#x1FA95",
    "name": "⊛ Banjo"
  },
  {
    "emoji": "🥁",
    "entity": "&#x1F941",
    "name": "Drum"
  },
  {
    "emoji": "📱",
    "entity": "&#x1F4F1",
    "name": "Mobile Phone"
  },
  {
    "emoji": "📲",
    "entity": "&#x1F4F2",
    "name": "Mobile Phone With Arrow"
  },
  {
    "emoji": "☎",
    "entity": "&#x260E",
    "name": "Telephone"
  },
  {
    "emoji": "📞",
    "entity": "&#x1F4DE",
    "name": "Telephone Receiver"
  },
  {
    "emoji": "📟",
    "entity": "&#x1F4DF",
    "name": "Pager"
  },
  {
    "emoji": "📠",
    "entity": "&#x1F4E0",
    "name": "Fax Machine"
  },
  {
    "emoji": "🔋",
    "entity": "&#x1F50B",
    "name": "Battery"
  },
  {
    "emoji": "🔌",
    "entity": "&#x1F50C",
    "name": "Electric Plug"
  },
  {
    "emoji": "💻",
    "entity": "&#x1F4BB",
    "name": "Laptop Computer"
  },
  {
    "emoji": "🖥",
    "entity": "&#x1F5A5",
    "name": "Desktop Computer"
  },
  {
    "emoji": "🖨",
    "entity": "&#x1F5A8",
    "name": "Printer"
  },
  {
    "emoji": "⌨",
    "entity": "&#x2328",
    "name": "Keyboard"
  },
  {
    "emoji": "🖱",
    "entity": "&#x1F5B1",
    "name": "Computer Mouse"
  },
  {
    "emoji": "🖲",
    "entity": "&#x1F5B2",
    "name": "Trackball"
  },
  {
    "emoji": "💽",
    "entity": "&#x1F4BD",
    "name": "Computer Disk"
  },
  {
    "emoji": "💾",
    "entity": "&#x1F4BE",
    "name": "Floppy Disk"
  },
  {
    "emoji": "💿",
    "entity": "&#x1F4BF",
    "name": "Optical Disk"
  },
  {
    "emoji": "📀",
    "entity": "&#x1F4C0",
    "name": "Dvd"
  },
  {
    "emoji": "🧮",
    "entity": "&#x1F9EE",
    "name": "Abacus"
  },
  {
    "emoji": "🎥",
    "entity": "&#x1F3A5",
    "name": "Movie Camera"
  },
  {
    "emoji": "🎞",
    "entity": "&#x1F39E",
    "name": "Film Frames"
  },
  {
    "emoji": "📽",
    "entity": "&#x1F4FD",
    "name": "Film Projector"
  },
  {
    "emoji": "🎬",
    "entity": "&#x1F3AC",
    "name": "Clapper Board"
  },
  {
    "emoji": "📺",
    "entity": "&#x1F4FA",
    "name": "Television"
  },
  {
    "emoji": "📷",
    "entity": "&#x1F4F7",
    "name": "Camera"
  },
  {
    "emoji": "📸",
    "entity": "&#x1F4F8",
    "name": "Camera With Flash"
  },
  {
    "emoji": "📹",
    "entity": "&#x1F4F9",
    "name": "Video Camera"
  },
  {
    "emoji": "📼",
    "entity": "&#x1F4FC",
    "name": "Videocassette"
  },
  {
    "emoji": "🔍",
    "entity": "&#x1F50D",
    "name": "Magnifying Glass Tilted Left"
  },
  {
    "emoji": "🔎",
    "entity": "&#x1F50E",
    "name": "Magnifying Glass Tilted Right"
  },
  {
    "emoji": "🕯",
    "entity": "&#x1F56F",
    "name": "Candle"
  },
  {
    "emoji": "💡",
    "entity": "&#x1F4A1",
    "name": "Light Bulb"
  },
  {
    "emoji": "🔦",
    "entity": "&#x1F526",
    "name": "Flashlight"
  },
  {
    "emoji": "🏮",
    "entity": "&#x1F3EE",
    "name": "Red Paper Lantern"
  },
  {
    "emoji": "🪔",
    "entity": "&#x1FA94",
    "name": "⊛ Diya Lamp"
  },
  {
    "emoji": "📔",
    "entity": "&#x1F4D4",
    "name": "Notebook With Decorative Cover"
  },
  {
    "emoji": "📕",
    "entity": "&#x1F4D5",
    "name": "Closed Book"
  },
  {
    "emoji": "📖",
    "entity": "&#x1F4D6",
    "name": "Open Book"
  },
  {
    "emoji": "📗",
    "entity": "&#x1F4D7",
    "name": "Green Book"
  },
  {
    "emoji": "📘",
    "entity": "&#x1F4D8",
    "name": "Blue Book"
  },
  {
    "emoji": "📙",
    "entity": "&#x1F4D9",
    "name": "Orange Book"
  },
  {
    "emoji": "📚",
    "entity": "&#x1F4DA",
    "name": "Books"
  },
  {
    "emoji": "📓",
    "entity": "&#x1F4D3",
    "name": "Notebook"
  },
  {
    "emoji": "📒",
    "entity": "&#x1F4D2",
    "name": "Ledger"
  },
  {
    "emoji": "📃",
    "entity": "&#x1F4C3",
    "name": "Page With Curl"
  },
  {
    "emoji": "📜",
    "entity": "&#x1F4DC",
    "name": "Scroll"
  },
  {
    "emoji": "📄",
    "entity": "&#x1F4C4",
    "name": "Page Facing Up"
  },
  {
    "emoji": "📰",
    "entity": "&#x1F4F0",
    "name": "Newspaper"
  },
  {
    "emoji": "🗞",
    "entity": "&#x1F5DE",
    "name": "Rolled-up Newspaper"
  },
  {
    "emoji": "📑",
    "entity": "&#x1F4D1",
    "name": "Bookmark Tabs"
  },
  {
    "emoji": "🔖",
    "entity": "&#x1F516",
    "name": "Bookmark"
  },
  {
    "emoji": "🏷",
    "entity": "&#x1F3F7",
    "name": "Label"
  },
  {
    "emoji": "💰",
    "entity": "&#x1F4B0",
    "name": "Money Bag"
  },
  {
    "emoji": "💴",
    "entity": "&#x1F4B4",
    "name": "Yen Banknote"
  },
  {
    "emoji": "💵",
    "entity": "&#x1F4B5",
    "name": "Dollar Banknote"
  },
  {
    "emoji": "💶",
    "entity": "&#x1F4B6",
    "name": "Euro Banknote"
  },
  {
    "emoji": "💷",
    "entity": "&#x1F4B7",
    "name": "Pound Banknote"
  },
  {
    "emoji": "💸",
    "entity": "&#x1F4B8",
    "name": "Money With Wings"
  },
  {
    "emoji": "💳",
    "entity": "&#x1F4B3",
    "name": "Credit Card"
  },
  {
    "emoji": "🧾",
    "entity": "&#x1F9FE",
    "name": "Receipt"
  },
  {
    "emoji": "💹",
    "entity": "&#x1F4B9",
    "name": "Chart Increasing With Yen"
  },
  {
    "emoji": "💱",
    "entity": "&#x1F4B1",
    "name": "Currency Exchange"
  },
  {
    "emoji": "💲",
    "entity": "&#x1F4B2",
    "name": "Heavy Dollar Sign"
  },
  {
    "emoji": "✉",
    "entity": "&#x2709",
    "name": "Envelope"
  },
  {
    "emoji": "📧",
    "entity": "&#x1F4E7",
    "name": "E-mail"
  },
  {
    "emoji": "📨",
    "entity": "&#x1F4E8",
    "name": "Incoming Envelope"
  },
  {
    "emoji": "📩",
    "entity": "&#x1F4E9",
    "name": "Envelope With Arrow"
  },
  {
    "emoji": "📤",
    "entity": "&#x1F4E4",
    "name": "Outbox Tray"
  },
  {
    "emoji": "📥",
    "entity": "&#x1F4E5",
    "name": "Inbox Tray"
  },
  {
    "emoji": "📦",
    "entity": "&#x1F4E6",
    "name": "Package"
  },
  {
    "emoji": "📫",
    "entity": "&#x1F4EB",
    "name": "Closed Mailbox With Raised Flag"
  },
  {
    "emoji": "📪",
    "entity": "&#x1F4EA",
    "name": "Closed Mailbox With Lowered Flag"
  },
  {
    "emoji": "📬",
    "entity": "&#x1F4EC",
    "name": "Open Mailbox With Raised Flag"
  },
  {
    "emoji": "📭",
    "entity": "&#x1F4ED",
    "name": "Open Mailbox With Lowered Flag"
  },
  {
    "emoji": "📮",
    "entity": "&#x1F4EE",
    "name": "Postbox"
  },
  {
    "emoji": "🗳",
    "entity": "&#x1F5F3",
    "name": "Ballot Box With Ballot"
  },
  {
    "emoji": "✏",
    "entity": "&#x270F",
    "name": "Pencil"
  },
  {
    "emoji": "✒",
    "entity": "&#x2712",
    "name": "Black Nib"
  },
  {
    "emoji": "🖋",
    "entity": "&#x1F58B",
    "name": "Fountain Pen"
  },
  {
    "emoji": "🖊",
    "entity": "&#x1F58A",
    "name": "Pen"
  },
  {
    "emoji": "🖌",
    "entity": "&#x1F58C",
    "name": "Paintbrush"
  },
  {
    "emoji": "🖍",
    "entity": "&#x1F58D",
    "name": "Crayon"
  },
  {
    "emoji": "📝",
    "entity": "&#x1F4DD",
    "name": "Memo"
  },
  {
    "emoji": "💼",
    "entity": "&#x1F4BC",
    "name": "Briefcase"
  },
  {
    "emoji": "📁",
    "entity": "&#x1F4C1",
    "name": "File Folder"
  },
  {
    "emoji": "📂",
    "entity": "&#x1F4C2",
    "name": "Open File Folder"
  },
  {
    "emoji": "🗂",
    "entity": "&#x1F5C2",
    "name": "Card Index Dividers"
  },
  {
    "emoji": "📅",
    "entity": "&#x1F4C5",
    "name": "Calendar"
  },
  {
    "emoji": "📆",
    "entity": "&#x1F4C6",
    "name": "Tear-off Calendar"
  },
  {
    "emoji": "🗒",
    "entity": "&#x1F5D2",
    "name": "Spiral Notepad"
  },
  {
    "emoji": "🗓",
    "entity": "&#x1F5D3",
    "name": "Spiral Calendar"
  },
  {
    "emoji": "📇",
    "entity": "&#x1F4C7",
    "name": "Card Index"
  },
  {
    "emoji": "📈",
    "entity": "&#x1F4C8",
    "name": "Chart Increasing"
  },
  {
    "emoji": "📉",
    "entity": "&#x1F4C9",
    "name": "Chart Decreasing"
  },
  {
    "emoji": "📊",
    "entity": "&#x1F4CA",
    "name": "Bar Chart"
  },
  {
    "emoji": "📋",
    "entity": "&#x1F4CB",
    "name": "Clipboard"
  },
  {
    "emoji": "📌",
    "entity": "&#x1F4CC",
    "name": "Pushpin"
  },
  {
    "emoji": "📍",
    "entity": "&#x1F4CD",
    "name": "Round Pushpin"
  },
  {
    "emoji": "📎",
    "entity": "&#x1F4CE",
    "name": "Paperclip"
  },
  {
    "emoji": "🖇",
    "entity": "&#x1F587",
    "name": "Linked Paperclips"
  },
  {
    "emoji": "📏",
    "entity": "&#x1F4CF",
    "name": "Straight Ruler"
  },
  {
    "emoji": "📐",
    "entity": "&#x1F4D0",
    "name": "Triangular Ruler"
  },
  {
    "emoji": "✂",
    "entity": "&#x2702",
    "name": "Scissors"
  },
  {
    "emoji": "🗃",
    "entity": "&#x1F5C3",
    "name": "Card File Box"
  },
  {
    "emoji": "🗄",
    "entity": "&#x1F5C4",
    "name": "File Cabinet"
  },
  {
    "emoji": "🗑",
    "entity": "&#x1F5D1",
    "name": "Wastebasket"
  },
  {
    "emoji": "🔒",
    "entity": "&#x1F512",
    "name": "Locked"
  },
  {
    "emoji": "🔓",
    "entity": "&#x1F513",
    "name": "Unlocked"
  },
  {
    "emoji": "🔏",
    "entity": "&#x1F50F",
    "name": "Locked With Pen"
  },
  {
    "emoji": "🔐",
    "entity": "&#x1F510",
    "name": "Locked With Key"
  },
  {
    "emoji": "🔑",
    "entity": "&#x1F511",
    "name": "Key"
  },
  {
    "emoji": "🗝",
    "entity": "&#x1F5DD",
    "name": "Old Key"
  },
  {
    "emoji": "🔨",
    "entity": "&#x1F528",
    "name": "Hammer"
  },
  {
    "emoji": "🪓",
    "entity": "&#x1FA93",
    "name": "⊛ Axe"
  },
  {
    "emoji": "⛏",
    "entity": "&#x26CF",
    "name": "Pick"
  },
  {
    "emoji": "⚒",
    "entity": "&#x2692",
    "name": "Hammer And Pick"
  },
  {
    "emoji": "🛠",
    "entity": "&#x1F6E0",
    "name": "Hammer And Wrench"
  },
  {
    "emoji": "🗡",
    "entity": "&#x1F5E1",
    "name": "Dagger"
  },
  {
    "emoji": "⚔",
    "entity": "&#x2694",
    "name": "Crossed Swords"
  },
  {
    "emoji": "🔫",
    "entity": "&#x1F52B",
    "name": "Pistol"
  },
  {
    "emoji": "🏹",
    "entity": "&#x1F3F9",
    "name": "Bow And Arrow"
  },
  {
    "emoji": "🛡",
    "entity": "&#x1F6E1",
    "name": "Shield"
  },
  {
    "emoji": "🔧",
    "entity": "&#x1F527",
    "name": "Wrench"
  },
  {
    "emoji": "🔩",
    "entity": "&#x1F529",
    "name": "Nut And Bolt"
  },
  {
    "emoji": "⚙",
    "entity": "&#x2699",
    "name": "Gear"
  },
  {
    "emoji": "🗜",
    "entity": "&#x1F5DC",
    "name": "Clamp"
  },
  {
    "emoji": "⚖",
    "entity": "&#x2696",
    "name": "Balance Scale"
  },
  {
    "emoji": "🦯",
    "entity": "&#x1F9AF",
    "name": "⊛ Probing Cane"
  },
  {
    "emoji": "🔗",
    "entity": "&#x1F517",
    "name": "Link"
  },
  {
    "emoji": "⛓",
    "entity": "&#x26D3",
    "name": "Chains"
  },
  {
    "emoji": "🧰",
    "entity": "&#x1F9F0",
    "name": "Toolbox"
  },
  {
    "emoji": "🧲",
    "entity": "&#x1F9F2",
    "name": "Magnet"
  },
  {
    "emoji": "⚗",
    "entity": "&#x2697",
    "name": "Alembic"
  },
  {
    "emoji": "🧪",
    "entity": "&#x1F9EA",
    "name": "Test Tube"
  },
  {
    "emoji": "🧫",
    "entity": "&#x1F9EB",
    "name": "Petri Dish"
  },
  {
    "emoji": "🧬",
    "entity": "&#x1F9EC",
    "name": "Dna"
  },
  {
    "emoji": "🔬",
    "entity": "&#x1F52C",
    "name": "Microscope"
  },
  {
    "emoji": "🔭",
    "entity": "&#x1F52D",
    "name": "Telescope"
  },
  {
    "emoji": "📡",
    "entity": "&#x1F4E1",
    "name": "Satellite Antenna"
  },
  {
    "emoji": "💉",
    "entity": "&#x1F489",
    "name": "Syringe"
  },
  {
    "emoji": "🩸",
    "entity": "&#x1FA78",
    "name": "⊛ Drop Of Blood"
  },
  {
    "emoji": "💊",
    "entity": "&#x1F48A",
    "name": "Pill"
  },
  {
    "emoji": "🩹",
    "entity": "&#x1FA79",
    "name": "⊛ Adhesive Bandage"
  },
  {
    "emoji": "🩺",
    "entity": "&#x1FA7A",
    "name": "⊛ Stethoscope"
  },
  {
    "emoji": "🚪",
    "entity": "&#x1F6AA",
    "name": "Door"
  },
  {
    "emoji": "🛏",
    "entity": "&#x1F6CF",
    "name": "Bed"
  },
  {
    "emoji": "🛋",
    "entity": "&#x1F6CB",
    "name": "Couch And Lamp"
  },
  {
    "emoji": "🪑",
    "entity": "&#x1FA91",
    "name": "⊛ Chair"
  },
  {
    "emoji": "🚽",
    "entity": "&#x1F6BD",
    "name": "Toilet"
  },
  {
    "emoji": "🚿",
    "entity": "&#x1F6BF",
    "name": "Shower"
  },
  {
    "emoji": "🛁",
    "entity": "&#x1F6C1",
    "name": "Bathtub"
  },
  {
    "emoji": "🪒",
    "entity": "&#x1FA92",
    "name": "⊛ Razor"
  },
  {
    "emoji": "🧴",
    "entity": "&#x1F9F4",
    "name": "Lotion Bottle"
  },
  {
    "emoji": "🧷",
    "entity": "&#x1F9F7",
    "name": "Safety Pin"
  },
  {
    "emoji": "🧹",
    "entity": "&#x1F9F9",
    "name": "Broom"
  },
  {
    "emoji": "🧺",
    "entity": "&#x1F9FA",
    "name": "Basket"
  },
  {
    "emoji": "🧻",
    "entity": "&#x1F9FB",
    "name": "Roll Of Paper"
  },
  {
    "emoji": "🧼",
    "entity": "&#x1F9FC",
    "name": "Soap"
  },
  {
    "emoji": "🧽",
    "entity": "&#x1F9FD",
    "name": "Sponge"
  },
  {
    "emoji": "🧯",
    "entity": "&#x1F9EF",
    "name": "Fire Extinguisher"
  },
  {
    "emoji": "🛒",
    "entity": "&#x1F6D2",
    "name": "Shopping Cart"
  },
  {
    "emoji": "🚬",
    "entity": "&#x1F6AC",
    "name": "Cigarette"
  },
  {
    "emoji": "⚰",
    "entity": "&#x26B0",
    "name": "Coffin"
  },
  {
    "emoji": "⚱",
    "entity": "&#x26B1",
    "name": "Funeral Urn"
  },
  {
    "emoji": "🗿",
    "entity": "&#x1F5FF",
    "name": "Moai"
  },
  {
    "emoji": "🏧",
    "entity": "&#x1F3E7",
    "name": "ATM Sign"
  },
  {
    "emoji": "🚮",
    "entity": "&#x1F6AE",
    "name": "Litter In Bin Sign"
  },
  {
    "emoji": "🚰",
    "entity": "&#x1F6B0",
    "name": "Potable Water"
  },
  {
    "emoji": "♿",
    "entity": "&#x267F",
    "name": "Wheelchair Symbol"
  },
  {
    "emoji": "🚹",
    "entity": "&#x1F6B9",
    "name": "Men’s Room"
  },
  {
    "emoji": "🚺",
    "entity": "&#x1F6BA",
    "name": "Women’s Room"
  },
  {
    "emoji": "🚻",
    "entity": "&#x1F6BB",
    "name": "Restroom"
  },
  {
    "emoji": "🚼",
    "entity": "&#x1F6BC",
    "name": "Baby Symbol"
  },
  {
    "emoji": "🚾",
    "entity": "&#x1F6BE",
    "name": "Water Closet"
  },
  {
    "emoji": "🛂",
    "entity": "&#x1F6C2",
    "name": "Passport Control"
  },
  {
    "emoji": "🛃",
    "entity": "&#x1F6C3",
    "name": "Customs"
  },
  {
    "emoji": "🛄",
    "entity": "&#x1F6C4",
    "name": "Baggage Claim"
  },
  {
    "emoji": "🛅",
    "entity": "&#x1F6C5",
    "name": "Left Luggage"
  },
  {
    "emoji": "⚠",
    "entity": "&#x26A0",
    "name": "Warning"
  },
  {
    "emoji": "🚸",
    "entity": "&#x1F6B8",
    "name": "Children Crossing"
  },
  {
    "emoji": "⛔",
    "entity": "&#x26D4",
    "name": "No Entry"
  },
  {
    "emoji": "🚫",
    "entity": "&#x1F6AB",
    "name": "Prohibited"
  },
  {
    "emoji": "🚳",
    "entity": "&#x1F6B3",
    "name": "No Bicycles"
  },
  {
    "emoji": "🚭",
    "entity": "&#x1F6AD",
    "name": "No Smoking"
  },
  {
    "emoji": "🚯",
    "entity": "&#x1F6AF",
    "name": "No Littering"
  },
  {
    "emoji": "🚱",
    "entity": "&#x1F6B1",
    "name": "Non-potable Water"
  },
  {
    "emoji": "🚷",
    "entity": "&#x1F6B7",
    "name": "No Pedestrians"
  },
  {
    "emoji": "📵",
    "entity": "&#x1F4F5",
    "name": "No Mobile Phones"
  },
  {
    "emoji": "🔞",
    "entity": "&#x1F51E",
    "name": "No One Under Eighteen"
  },
  {
    "emoji": "☢",
    "entity": "&#x2622",
    "name": "Radioactive"
  },
  {
    "emoji": "☣",
    "entity": "&#x2623",
    "name": "Biohazard"
  },
  {
    "emoji": "⬆",
    "entity": "&#x2B06",
    "name": "Up Arrow"
  },
  {
    "emoji": "↗",
    "entity": "&#x2197",
    "name": "Up-right Arrow"
  },
  {
    "emoji": "➡",
    "entity": "&#x27A1",
    "name": "Right Arrow"
  },
  {
    "emoji": "↘",
    "entity": "&#x2198",
    "name": "Down-right Arrow"
  },
  {
    "emoji": "⬇",
    "entity": "&#x2B07",
    "name": "Down Arrow"
  },
  {
    "emoji": "↙",
    "entity": "&#x2199",
    "name": "Down-left Arrow"
  },
  {
    "emoji": "⬅",
    "entity": "&#x2B05",
    "name": "Left Arrow"
  },
  {
    "emoji": "↖",
    "entity": "&#x2196",
    "name": "Up-left Arrow"
  },
  {
    "emoji": "↕",
    "entity": "&#x2195",
    "name": "Up-down Arrow"
  },
  {
    "emoji": "↔",
    "entity": "&#x2194",
    "name": "Left-right Arrow"
  },
  {
    "emoji": "↩",
    "entity": "&#x21A9",
    "name": "Right Arrow Curving Left"
  },
  {
    "emoji": "↪",
    "entity": "&#x21AA",
    "name": "Left Arrow Curving Right"
  },
  {
    "emoji": "⤴",
    "entity": "&#x2934",
    "name": "Right Arrow Curving Up"
  },
  {
    "emoji": "⤵",
    "entity": "&#x2935",
    "name": "Right Arrow Curving Down"
  },
  {
    "emoji": "🔃",
    "entity": "&#x1F503",
    "name": "Clockwise Vertical Arrows"
  },
  {
    "emoji": "🔄",
    "entity": "&#x1F504",
    "name": "Counterclockwise Arrows Button"
  },
  {
    "emoji": "🔙",
    "entity": "&#x1F519",
    "name": "BACK Arrow"
  },
  {
    "emoji": "🔚",
    "entity": "&#x1F51A",
    "name": "END Arrow"
  },
  {
    "emoji": "🔛",
    "entity": "&#x1F51B",
    "name": "ON! Arrow"
  },
  {
    "emoji": "🔜",
    "entity": "&#x1F51C",
    "name": "SOON Arrow"
  },
  {
    "emoji": "🔝",
    "entity": "&#x1F51D",
    "name": "TOP Arrow"
  },
  {
    "emoji": "🛐",
    "entity": "&#x1F6D0",
    "name": "Place Of Worship"
  },
  {
    "emoji": "⚛",
    "entity": "&#x269B",
    "name": "Atom Symbol"
  },
  {
    "emoji": "🕉",
    "entity": "&#x1F549",
    "name": "Om"
  },
  {
    "emoji": "✡",
    "entity": "&#x2721",
    "name": "Star Of David"
  },
  {
    "emoji": "☸",
    "entity": "&#x2638",
    "name": "Wheel Of Dharma"
  },
  {
    "emoji": "☯",
    "entity": "&#x262F",
    "name": "Yin Yang"
  },
  {
    "emoji": "✝",
    "entity": "&#x271D",
    "name": "Latin Cross"
  },
  {
    "emoji": "☦",
    "entity": "&#x2626",
    "name": "Orthodox Cross"
  },
  {
    "emoji": "☪",
    "entity": "&#x262A",
    "name": "Star And Crescent"
  },
  {
    "emoji": "☮",
    "entity": "&#x262E",
    "name": "Peace Symbol"
  },
  {
    "emoji": "🕎",
    "entity": "&#x1F54E",
    "name": "Menorah"
  },
  {
    "emoji": "🔯",
    "entity": "&#x1F52F",
    "name": "Dotted Six-pointed Star"
  },
  {
    "emoji": "♈",
    "entity": "&#x2648",
    "name": "Aries"
  },
  {
    "emoji": "♉",
    "entity": "&#x2649",
    "name": "Taurus"
  },
  {
    "emoji": "♊",
    "entity": "&#x264A",
    "name": "Gemini"
  },
  {
    "emoji": "♋",
    "entity": "&#x264B",
    "name": "Cancer"
  },
  {
    "emoji": "♌",
    "entity": "&#x264C",
    "name": "Leo"
  },
  {
    "emoji": "♍",
    "entity": "&#x264D",
    "name": "Virgo"
  },
  {
    "emoji": "♎",
    "entity": "&#x264E",
    "name": "Libra"
  },
  {
    "emoji": "♏",
    "entity": "&#x264F",
    "name": "Scorpio"
  },
  {
    "emoji": "♐",
    "entity": "&#x2650",
    "name": "Sagittarius"
  },
  {
    "emoji": "♑",
    "entity": "&#x2651",
    "name": "Capricorn"
  },
  {
    "emoji": "♒",
    "entity": "&#x2652",
    "name": "Aquarius"
  },
  {
    "emoji": "♓",
    "entity": "&#x2653",
    "name": "Pisces"
  },
  {
    "emoji": "⛎",
    "entity": "&#x26CE",
    "name": "Ophiuchus"
  },
  {
    "emoji": "🔀",
    "entity": "&#x1F500",
    "name": "Shuffle Tracks Button"
  },
  {
    "emoji": "🔁",
    "entity": "&#x1F501",
    "name": "Repeat Button"
  },
  {
    "emoji": "🔂",
    "entity": "&#x1F502",
    "name": "Repeat Single Button"
  },
  {
    "emoji": "▶",
    "entity": "&#x25B6",
    "name": "Play Button"
  },
  {
    "emoji": "⏩",
    "entity": "&#x23E9",
    "name": "Fast-forward Button"
  },
  {
    "emoji": "⏭",
    "entity": "&#x23ED",
    "name": "Next Track Button"
  },
  {
    "emoji": "⏯",
    "entity": "&#x23EF",
    "name": "Play Or Pause Button"
  },
  {
    "emoji": "◀",
    "entity": "&#x25C0",
    "name": "Reverse Button"
  },
  {
    "emoji": "⏪",
    "entity": "&#x23EA",
    "name": "Fast Reverse Button"
  },
  {
    "emoji": "⏮",
    "entity": "&#x23EE",
    "name": "Last Track Button"
  },
  {
    "emoji": "🔼",
    "entity": "&#x1F53C",
    "name": "Upwards Button"
  },
  {
    "emoji": "⏫",
    "entity": "&#x23EB",
    "name": "Fast Up Button"
  },
  {
    "emoji": "🔽",
    "entity": "&#x1F53D",
    "name": "Downwards Button"
  },
  {
    "emoji": "⏬",
    "entity": "&#x23EC",
    "name": "Fast Down Button"
  },
  {
    "emoji": "⏸",
    "entity": "&#x23F8",
    "name": "Pause Button"
  },
  {
    "emoji": "⏹",
    "entity": "&#x23F9",
    "name": "Stop Button"
  },
  {
    "emoji": "⏺",
    "entity": "&#x23FA",
    "name": "Record Button"
  },
  {
    "emoji": "⏏",
    "entity": "&#x23CF",
    "name": "Eject Button"
  },
  {
    "emoji": "🎦",
    "entity": "&#x1F3A6",
    "name": "Cinema"
  },
  {
    "emoji": "🔅",
    "entity": "&#x1F505",
    "name": "Dim Button"
  },
  {
    "emoji": "🔆",
    "entity": "&#x1F506",
    "name": "Bright Button"
  },
  {
    "emoji": "📶",
    "entity": "&#x1F4F6",
    "name": "Antenna Bars"
  },
  {
    "emoji": "📳",
    "entity": "&#x1F4F3",
    "name": "Vibration Mode"
  },
  {
    "emoji": "📴",
    "entity": "&#x1F4F4",
    "name": "Mobile Phone Off"
  },
  {
    "emoji": "♀",
    "entity": "&#x2640",
    "name": "Female Sign"
  },
  {
    "emoji": "♂",
    "entity": "&#x2642",
    "name": "Male Sign"
  },
  {
    "emoji": "⚕",
    "entity": "&#x2695",
    "name": "Medical Symbol"
  },
  {
    "emoji": "♾",
    "entity": "&#x267E",
    "name": "Infinity"
  },
  {
    "emoji": "♻",
    "entity": "&#x267B",
    "name": "Recycling Symbol"
  },
  {
    "emoji": "⚜",
    "entity": "&#x269C",
    "name": "Fleur-de-lis"
  },
  {
    "emoji": "🔱",
    "entity": "&#x1F531",
    "name": "Trident Emblem"
  },
  {
    "emoji": "📛",
    "entity": "&#x1F4DB",
    "name": "Name Badge"
  },
  {
    "emoji": "🔰",
    "entity": "&#x1F530",
    "name": "Japanese Symbol For Beginner"
  },
  {
    "emoji": "⭕",
    "entity": "&#x2B55",
    "name": "Hollow Red Circle"
  },
  {
    "emoji": "✅",
    "entity": "&#x2705",
    "name": "Check Mark Button"
  },
  {
    "emoji": "☑",
    "entity": "&#x2611",
    "name": "Check Box With Check"
  },
  {
    "emoji": "✔",
    "entity": "&#x2714",
    "name": "Check Mark"
  },
  {
    "emoji": "✖",
    "entity": "&#x2716",
    "name": "Multiplication Sign"
  },
  {
    "emoji": "❌",
    "entity": "&#x274C",
    "name": "Cross Mark"
  },
  {
    "emoji": "❎",
    "entity": "&#x274E",
    "name": "Cross Mark Button"
  },
  {
    "emoji": "➕",
    "entity": "&#x2795",
    "name": "Plus Sign"
  },
  {
    "emoji": "➖",
    "entity": "&#x2796",
    "name": "Minus Sign"
  },
  {
    "emoji": "➗",
    "entity": "&#x2797",
    "name": "Division Sign"
  },
  {
    "emoji": "➰",
    "entity": "&#x27B0",
    "name": "Curly Loop"
  },
  {
    "emoji": "➿",
    "entity": "&#x27BF",
    "name": "Double Curly Loop"
  },
  {
    "emoji": "〽",
    "entity": "&#x303D",
    "name": "Part Alternation Mark"
  },
  {
    "emoji": "✳",
    "entity": "&#x2733",
    "name": "Eight-spoked Asterisk"
  },
  {
    "emoji": "✴",
    "entity": "&#x2734",
    "name": "Eight-pointed Star"
  },
  {
    "emoji": "❇",
    "entity": "&#x2747",
    "name": "Sparkle"
  },
  {
    "emoji": "‼",
    "entity": "&#x203C",
    "name": "Double Exclamation Mark"
  },
  {
    "emoji": "⁉",
    "entity": "&#x2049",
    "name": "Exclamation Question Mark"
  },
  {
    "emoji": "❓",
    "entity": "&#x2753",
    "name": "Question Mark"
  },
  {
    "emoji": "❔",
    "entity": "&#x2754",
    "name": "White Question Mark"
  },
  {
    "emoji": "❕",
    "entity": "&#x2755",
    "name": "White Exclamation Mark"
  },
  {
    "emoji": "❗",
    "entity": "&#x2757",
    "name": "Exclamation Mark"
  },
  {
    "emoji": "〰",
    "entity": "&#x3030",
    "name": "Wavy Dash"
  },
  {
    "emoji": "©",
    "entity": "&#x00A9",
    "name": "Copyright"
  },
  {
    "emoji": "®",
    "entity": "&#x00AE",
    "name": "Registered"
  },
  {
    "emoji": "™",
    "entity": "&#x2122",
    "name": "Trade Mark"
  },
  {
    "emoji": "#️⃣",
    "entity": "&#x0023&#xFE0F&#x20E3",
    "name": "Keycap: #"
  },
  {
    "emoji": "*️⃣",
    "entity": "&#x002A&#xFE0F&#x20E3",
    "name": "Keycap: *"
  },
  {
    "emoji": "0️⃣",
    "entity": "&#x0030&#xFE0F&#x20E3",
    "name": "Keycap: 0"
  },
  {
    "emoji": "1️⃣",
    "entity": "&#x0031&#xFE0F&#x20E3",
    "name": "Keycap: 1"
  },
  {
    "emoji": "2️⃣",
    "entity": "&#x0032&#xFE0F&#x20E3",
    "name": "Keycap: 2"
  },
  {
    "emoji": "3️⃣",
    "entity": "&#x0033&#xFE0F&#x20E3",
    "name": "Keycap: 3"
  },
  {
    "emoji": "4️⃣",
    "entity": "&#x0034&#xFE0F&#x20E3",
    "name": "Keycap: 4"
  },
  {
    "emoji": "5️⃣",
    "entity": "&#x0035&#xFE0F&#x20E3",
    "name": "Keycap: 5"
  },
  {
    "emoji": "6️⃣",
    "entity": "&#x0036&#xFE0F&#x20E3",
    "name": "Keycap: 6"
  },
  {
    "emoji": "7️⃣",
    "entity": "&#x0037&#xFE0F&#x20E3",
    "name": "Keycap: 7"
  },
  {
    "emoji": "8️⃣",
    "entity": "&#x0038&#xFE0F&#x20E3",
    "name": "Keycap: 8"
  },
  {
    "emoji": "9️⃣",
    "entity": "&#x0039&#xFE0F&#x20E3",
    "name": "Keycap: 9"
  },
  {
    "emoji": "🔟",
    "entity": "&#x1F51F",
    "name": "Keycap: 10"
  },
  {
    "emoji": "🔠",
    "entity": "&#x1F520",
    "name": "Input Latin Uppercase"
  },
  {
    "emoji": "🔡",
    "entity": "&#x1F521",
    "name": "Input Latin Lowercase"
  },
  {
    "emoji": "🔢",
    "entity": "&#x1F522",
    "name": "Input Numbers"
  },
  {
    "emoji": "🔣",
    "entity": "&#x1F523",
    "name": "Input Symbols"
  },
  {
    "emoji": "🔤",
    "entity": "&#x1F524",
    "name": "Input Latin Letters"
  },
  {
    "emoji": "🅰",
    "entity": "&#x1F170",
    "name": "A Button (blood Type)"
  },
  {
    "emoji": "🆎",
    "entity": "&#x1F18E",
    "name": "AB Button (blood Type)"
  },
  {
    "emoji": "🅱",
    "entity": "&#x1F171",
    "name": "B Button (blood Type)"
  },
  {
    "emoji": "🆑",
    "entity": "&#x1F191",
    "name": "CL Button"
  },
  {
    "emoji": "🆒",
    "entity": "&#x1F192",
    "name": "COOL Button"
  },
  {
    "emoji": "🆓",
    "entity": "&#x1F193",
    "name": "FREE Button"
  },
  {
    "emoji": "ℹ",
    "entity": "&#x2139",
    "name": "Information"
  },
  {
    "emoji": "🆔",
    "entity": "&#x1F194",
    "name": "ID Button"
  },
  {
    "emoji": "Ⓜ",
    "entity": "&#x24C2",
    "name": "Circled M"
  },
  {
    "emoji": "🆕",
    "entity": "&#x1F195",
    "name": "NEW Button"
  },
  {
    "emoji": "🆖",
    "entity": "&#x1F196",
    "name": "NG Button"
  },
  {
    "emoji": "🅾",
    "entity": "&#x1F17E",
    "name": "O Button (blood Type)"
  },
  {
    "emoji": "🆗",
    "entity": "&#x1F197",
    "name": "OK Button"
  },
  {
    "emoji": "🅿",
    "entity": "&#x1F17F",
    "name": "P Button"
  },
  {
    "emoji": "🆘",
    "entity": "&#x1F198",
    "name": "SOS Button"
  },
  {
    "emoji": "🆙",
    "entity": "&#x1F199",
    "name": "UP! Button"
  },
  {
    "emoji": "🆚",
    "entity": "&#x1F19A",
    "name": "VS Button"
  },
  {
    "emoji": "🈁",
    "entity": "&#x1F201",
    "name": "Japanese “here” Button"
  },
  {
    "emoji": "🈂",
    "entity": "&#x1F202",
    "name": "Japanese “service Charge” Button"
  },
  {
    "emoji": "🈷",
    "entity": "&#x1F237",
    "name": "Japanese “monthly Amount” Button"
  },
  {
    "emoji": "🈶",
    "entity": "&#x1F236",
    "name": "Japanese “not Free Of Charge” Button"
  },
  {
    "emoji": "🈯",
    "entity": "&#x1F22F",
    "name": "Japanese “reserved” Button"
  },
  {
    "emoji": "🉐",
    "entity": "&#x1F250",
    "name": "Japanese “bargain” Button"
  },
  {
    "emoji": "🈹",
    "entity": "&#x1F239",
    "name": "Japanese “discount” Button"
  },
  {
    "emoji": "🈚",
    "entity": "&#x1F21A",
    "name": "Japanese “free Of Charge” Button"
  },
  {
    "emoji": "🈲",
    "entity": "&#x1F232",
    "name": "Japanese “prohibited” Button"
  },
  {
    "emoji": "🉑",
    "entity": "&#x1F251",
    "name": "Japanese “acceptable” Button"
  },
  {
    "emoji": "🈸",
    "entity": "&#x1F238",
    "name": "Japanese “application” Button"
  },
  {
    "emoji": "🈴",
    "entity": "&#x1F234",
    "name": "Japanese “passing Grade” Button"
  },
  {
    "emoji": "🈳",
    "entity": "&#x1F233",
    "name": "Japanese “vacancy” Button"
  },
  {
    "emoji": "㊗",
    "entity": "&#x3297",
    "name": "Japanese “congratulations” Button"
  },
  {
    "emoji": "㊙",
    "entity": "&#x3299",
    "name": "Japanese “secret” Button"
  },
  {
    "emoji": "🈺",
    "entity": "&#x1F23A",
    "name": "Japanese “open For Business” Button"
  },
  {
    "emoji": "🈵",
    "entity": "&#x1F235",
    "name": "Japanese “no Vacancy” Button"
  },
  {
    "emoji": "🔴",
    "entity": "&#x1F534",
    "name": "Red Circle"
  },
  {
    "emoji": "🟠",
    "entity": "&#x1F7E0",
    "name": "⊛ Orange Circle"
  },
  {
    "emoji": "🟡",
    "entity": "&#x1F7E1",
    "name": "⊛ Yellow Circle"
  },
  {
    "emoji": "🟢",
    "entity": "&#x1F7E2",
    "name": "⊛ Green Circle"
  },
  {
    "emoji": "🔵",
    "entity": "&#x1F535",
    "name": "Blue Circle"
  },
  {
    "emoji": "🟣",
    "entity": "&#x1F7E3",
    "name": "⊛ Purple Circle"
  },
  {
    "emoji": "🟤",
    "entity": "&#x1F7E4",
    "name": "⊛ Brown Circle"
  },
  {
    "emoji": "⚫",
    "entity": "&#x26AB",
    "name": "Black Circle"
  },
  {
    "emoji": "⚪",
    "entity": "&#x26AA",
    "name": "White Circle"
  },
  {
    "emoji": "🟥",
    "entity": "&#x1F7E5",
    "name": "⊛ Red Square"
  },
  {
    "emoji": "🟧",
    "entity": "&#x1F7E7",
    "name": "⊛ Orange Square"
  },
  {
    "emoji": "🟨",
    "entity": "&#x1F7E8",
    "name": "⊛ Yellow Square"
  },
  {
    "emoji": "🟩",
    "entity": "&#x1F7E9",
    "name": "⊛ Green Square"
  },
  {
    "emoji": "🟦",
    "entity": "&#x1F7E6",
    "name": "⊛ Blue Square"
  },
  {
    "emoji": "🟪",
    "entity": "&#x1F7EA",
    "name": "⊛ Purple Square"
  },
  {
    "emoji": "🟫",
    "entity": "&#x1F7EB",
    "name": "⊛ Brown Square"
  },
  {
    "emoji": "⬛",
    "entity": "&#x2B1B",
    "name": "Black Large Square"
  },
  {
    "emoji": "⬜",
    "entity": "&#x2B1C",
    "name": "White Large Square"
  },
  {
    "emoji": "◼",
    "entity": "&#x25FC",
    "name": "Black Medium Square"
  },
  {
    "emoji": "◻",
    "entity": "&#x25FB",
    "name": "White Medium Square"
  },
  {
    "emoji": "◾",
    "entity": "&#x25FE",
    "name": "Black Medium-small Square"
  },
  {
    "emoji": "◽",
    "entity": "&#x25FD",
    "name": "White Medium-small Square"
  },
  {
    "emoji": "▪",
    "entity": "&#x25AA",
    "name": "Black Small Square"
  },
  {
    "emoji": "▫",
    "entity": "&#x25AB",
    "name": "White Small Square"
  },
  {
    "emoji": "🔶",
    "entity": "&#x1F536",
    "name": "Large Orange Diamond"
  },
  {
    "emoji": "🔷",
    "entity": "&#x1F537",
    "name": "Large Blue Diamond"
  },
  {
    "emoji": "🔸",
    "entity": "&#x1F538",
    "name": "Small Orange Diamond"
  },
  {
    "emoji": "🔹",
    "entity": "&#x1F539",
    "name": "Small Blue Diamond"
  },
  {
    "emoji": "🔺",
    "entity": "&#x1F53A",
    "name": "Red Triangle Pointed Up"
  },
  {
    "emoji": "🔻",
    "entity": "&#x1F53B",
    "name": "Red Triangle Pointed Down"
  },
  {
    "emoji": "💠",
    "entity": "&#x1F4A0",
    "name": "Diamond With A Dot"
  },
  {
    "emoji": "🔘",
    "entity": "&#x1F518",
    "name": "Radio Button"
  },
  {
    "emoji": "🔳",
    "entity": "&#x1F533",
    "name": "White Square Button"
  },
  {
    "emoji": "🔲",
    "entity": "&#x1F532",
    "name": "Black Square Button"
  },
  {
    "emoji": "🏁",
    "entity": "&#x1F3C1",
    "name": "Chequered Flag"
  },
  {
    "emoji": "🚩",
    "entity": "&#x1F6A9",
    "name": "Triangular Flag"
  },
  {
    "emoji": "🎌",
    "entity": "&#x1F38C",
    "name": "Crossed Flags"
  },
  {
    "emoji": "🏴",
    "entity": "&#x1F3F4",
    "name": "Black Flag"
  },
  {
    "emoji": "🏳",
    "entity": "&#x1F3F3",
    "name": "White Flag"
  },
  {
    "emoji": "🏳️‍🌈",
    "entity": "&#x1F3F3&#xFE0F&#x200D&#x1F308",
    "name": "Rainbow Flag"
  },
  {
    "emoji": "🏴‍☠️",
    "entity": "&#x1F3F4&#x200D&#x2620&#xFE0F",
    "name": "Pirate Flag"
  },
  {
    "emoji": "🇦🇨",
    "entity": "&#x1F1E6&#x1F1E8",
    "name": "Flag: Ascension Island"
  },
  {
    "emoji": "🇦🇩",
    "entity": "&#x1F1E6&#x1F1E9",
    "name": "Flag: Andorra"
  },
  {
    "emoji": "🇦🇪",
    "entity": "&#x1F1E6&#x1F1EA",
    "name": "Flag: United Arab Emirates"
  },
  {
    "emoji": "🇦🇫",
    "entity": "&#x1F1E6&#x1F1EB",
    "name": "Flag: Afghanistan"
  },
  {
    "emoji": "🇦🇬",
    "entity": "&#x1F1E6&#x1F1EC",
    "name": "Flag: Antigua &amp; Barbuda"
  },
  {
    "emoji": "🇦🇮",
    "entity": "&#x1F1E6&#x1F1EE",
    "name": "Flag: Anguilla"
  },
  {
    "emoji": "🇦🇱",
    "entity": "&#x1F1E6&#x1F1F1",
    "name": "Flag: Albania"
  },
  {
    "emoji": "🇦🇲",
    "entity": "&#x1F1E6&#x1F1F2",
    "name": "Flag: Armenia"
  },
  {
    "emoji": "🇦🇴",
    "entity": "&#x1F1E6&#x1F1F4",
    "name": "Flag: Angola"
  },
  {
    "emoji": "🇦🇶",
    "entity": "&#x1F1E6&#x1F1F6",
    "name": "Flag: Antarctica"
  },
  {
    "emoji": "🇦🇷",
    "entity": "&#x1F1E6&#x1F1F7",
    "name": "Flag: Argentina"
  },
  {
    "emoji": "🇦🇸",
    "entity": "&#x1F1E6&#x1F1F8",
    "name": "Flag: American Samoa"
  },
  {
    "emoji": "🇦🇹",
    "entity": "&#x1F1E6&#x1F1F9",
    "name": "Flag: Austria"
  },
  {
    "emoji": "🇦🇺",
    "entity": "&#x1F1E6&#x1F1FA",
    "name": "Flag: Australia"
  },
  {
    "emoji": "🇦🇼",
    "entity": "&#x1F1E6&#x1F1FC",
    "name": "Flag: Aruba"
  },
  {
    "emoji": "🇦🇽",
    "entity": "&#x1F1E6&#x1F1FD",
    "name": "Flag: Åland Islands"
  },
  {
    "emoji": "🇦🇿",
    "entity": "&#x1F1E6&#x1F1FF",
    "name": "Flag: Azerbaijan"
  },
  {
    "emoji": "🇧🇦",
    "entity": "&#x1F1E7&#x1F1E6",
    "name": "Flag: Bosnia &amp; Herzegovina"
  },
  {
    "emoji": "🇧🇧",
    "entity": "&#x1F1E7&#x1F1E7",
    "name": "Flag: Barbados"
  },
  {
    "emoji": "🇧🇩",
    "entity": "&#x1F1E7&#x1F1E9",
    "name": "Flag: Bangladesh"
  },
  {
    "emoji": "🇧🇪",
    "entity": "&#x1F1E7&#x1F1EA",
    "name": "Flag: Belgium"
  },
  {
    "emoji": "🇧🇫",
    "entity": "&#x1F1E7&#x1F1EB",
    "name": "Flag: Burkina Faso"
  },
  {
    "emoji": "🇧🇬",
    "entity": "&#x1F1E7&#x1F1EC",
    "name": "Flag: Bulgaria"
  },
  {
    "emoji": "🇧🇭",
    "entity": "&#x1F1E7&#x1F1ED",
    "name": "Flag: Bahrain"
  },
  {
    "emoji": "🇧🇮",
    "entity": "&#x1F1E7&#x1F1EE",
    "name": "Flag: Burundi"
  },
  {
    "emoji": "🇧🇯",
    "entity": "&#x1F1E7&#x1F1EF",
    "name": "Flag: Benin"
  },
  {
    "emoji": "🇧🇱",
    "entity": "&#x1F1E7&#x1F1F1",
    "name": "Flag: St. Barthélemy"
  },
  {
    "emoji": "🇧🇲",
    "entity": "&#x1F1E7&#x1F1F2",
    "name": "Flag: Bermuda"
  },
  {
    "emoji": "🇧🇳",
    "entity": "&#x1F1E7&#x1F1F3",
    "name": "Flag: Brunei"
  },
  {
    "emoji": "🇧🇴",
    "entity": "&#x1F1E7&#x1F1F4",
    "name": "Flag: Bolivia"
  },
  {
    "emoji": "🇧🇶",
    "entity": "&#x1F1E7&#x1F1F6",
    "name": "Flag: Caribbean Netherlands"
  },
  {
    "emoji": "🇧🇷",
    "entity": "&#x1F1E7&#x1F1F7",
    "name": "Flag: Brazil"
  },
  {
    "emoji": "🇧🇸",
    "entity": "&#x1F1E7&#x1F1F8",
    "name": "Flag: Bahamas"
  },
  {
    "emoji": "🇧🇹",
    "entity": "&#x1F1E7&#x1F1F9",
    "name": "Flag: Bhutan"
  },
  {
    "emoji": "🇧🇻",
    "entity": "&#x1F1E7&#x1F1FB",
    "name": "Flag: Bouvet Island"
  },
  {
    "emoji": "🇧🇼",
    "entity": "&#x1F1E7&#x1F1FC",
    "name": "Flag: Botswana"
  },
  {
    "emoji": "🇧🇾",
    "entity": "&#x1F1E7&#x1F1FE",
    "name": "Flag: Belarus"
  },
  {
    "emoji": "🇧🇿",
    "entity": "&#x1F1E7&#x1F1FF",
    "name": "Flag: Belize"
  },
  {
    "emoji": "🇨🇦",
    "entity": "&#x1F1E8&#x1F1E6",
    "name": "Flag: Canada"
  },
  {
    "emoji": "🇨🇨",
    "entity": "&#x1F1E8&#x1F1E8",
    "name": "Flag: Cocos (Keeling) Islands"
  },
  {
    "emoji": "🇨🇩",
    "entity": "&#x1F1E8&#x1F1E9",
    "name": "Flag: Congo - Kinshasa"
  },
  {
    "emoji": "🇨🇫",
    "entity": "&#x1F1E8&#x1F1EB",
    "name": "Flag: Central African Republic"
  },
  {
    "emoji": "🇨🇬",
    "entity": "&#x1F1E8&#x1F1EC",
    "name": "Flag: Congo - Brazzaville"
  },
  {
    "emoji": "🇨🇭",
    "entity": "&#x1F1E8&#x1F1ED",
    "name": "Flag: Switzerland"
  },
  {
    "emoji": "🇨🇮",
    "entity": "&#x1F1E8&#x1F1EE",
    "name": "Flag: Côte D’Ivoire"
  },
  {
    "emoji": "🇨🇰",
    "entity": "&#x1F1E8&#x1F1F0",
    "name": "Flag: Cook Islands"
  },
  {
    "emoji": "🇨🇱",
    "entity": "&#x1F1E8&#x1F1F1",
    "name": "Flag: Chile"
  },
  {
    "emoji": "🇨🇲",
    "entity": "&#x1F1E8&#x1F1F2",
    "name": "Flag: Cameroon"
  },
  {
    "emoji": "🇨🇳",
    "entity": "&#x1F1E8&#x1F1F3",
    "name": "Flag: China"
  },
  {
    "emoji": "🇨🇴",
    "entity": "&#x1F1E8&#x1F1F4",
    "name": "Flag: Colombia"
  },
  {
    "emoji": "🇨🇵",
    "entity": "&#x1F1E8&#x1F1F5",
    "name": "Flag: Clipperton Island"
  },
  {
    "emoji": "🇨🇷",
    "entity": "&#x1F1E8&#x1F1F7",
    "name": "Flag: Costa Rica"
  },
  {
    "emoji": "🇨🇺",
    "entity": "&#x1F1E8&#x1F1FA",
    "name": "Flag: Cuba"
  },
  {
    "emoji": "🇨🇻",
    "entity": "&#x1F1E8&#x1F1FB",
    "name": "Flag: Cape Verde"
  },
  {
    "emoji": "🇨🇼",
    "entity": "&#x1F1E8&#x1F1FC",
    "name": "Flag: Curaçao"
  },
  {
    "emoji": "🇨🇽",
    "entity": "&#x1F1E8&#x1F1FD",
    "name": "Flag: Christmas Island"
  },
  {
    "emoji": "🇨🇾",
    "entity": "&#x1F1E8&#x1F1FE",
    "name": "Flag: Cyprus"
  },
  {
    "emoji": "🇨🇿",
    "entity": "&#x1F1E8&#x1F1FF",
    "name": "Flag: Czechia"
  },
  {
    "emoji": "🇩🇪",
    "entity": "&#x1F1E9&#x1F1EA",
    "name": "Flag: Germany"
  },
  {
    "emoji": "🇩🇬",
    "entity": "&#x1F1E9&#x1F1EC",
    "name": "Flag: Diego Garcia"
  },
  {
    "emoji": "🇩🇯",
    "entity": "&#x1F1E9&#x1F1EF",
    "name": "Flag: Djibouti"
  },
  {
    "emoji": "🇩🇰",
    "entity": "&#x1F1E9&#x1F1F0",
    "name": "Flag: Denmark"
  },
  {
    "emoji": "🇩🇲",
    "entity": "&#x1F1E9&#x1F1F2",
    "name": "Flag: Dominica"
  },
  {
    "emoji": "🇩🇴",
    "entity": "&#x1F1E9&#x1F1F4",
    "name": "Flag: Dominican Republic"
  },
  {
    "emoji": "🇩🇿",
    "entity": "&#x1F1E9&#x1F1FF",
    "name": "Flag: Algeria"
  },
  {
    "emoji": "🇪🇦",
    "entity": "&#x1F1EA&#x1F1E6",
    "name": "Flag: Ceuta &amp; Melilla"
  },
  {
    "emoji": "🇪🇨",
    "entity": "&#x1F1EA&#x1F1E8",
    "name": "Flag: Ecuador"
  },
  {
    "emoji": "🇪🇪",
    "entity": "&#x1F1EA&#x1F1EA",
    "name": "Flag: Estonia"
  },
  {
    "emoji": "🇪🇬",
    "entity": "&#x1F1EA&#x1F1EC",
    "name": "Flag: Egypt"
  },
  {
    "emoji": "🇪🇭",
    "entity": "&#x1F1EA&#x1F1ED",
    "name": "Flag: Western Sahara"
  },
  {
    "emoji": "🇪🇷",
    "entity": "&#x1F1EA&#x1F1F7",
    "name": "Flag: Eritrea"
  },
  {
    "emoji": "🇪🇸",
    "entity": "&#x1F1EA&#x1F1F8",
    "name": "Flag: Spain"
  },
  {
    "emoji": "🇪🇹",
    "entity": "&#x1F1EA&#x1F1F9",
    "name": "Flag: Ethiopia"
  },
  {
    "emoji": "🇪🇺",
    "entity": "&#x1F1EA&#x1F1FA",
    "name": "Flag: European Union"
  },
  {
    "emoji": "🇫🇮",
    "entity": "&#x1F1EB&#x1F1EE",
    "name": "Flag: Finland"
  },
  {
    "emoji": "🇫🇯",
    "entity": "&#x1F1EB&#x1F1EF",
    "name": "Flag: Fiji"
  },
  {
    "emoji": "🇫🇰",
    "entity": "&#x1F1EB&#x1F1F0",
    "name": "Flag: Falkland Islands"
  },
  {
    "emoji": "🇫🇲",
    "entity": "&#x1F1EB&#x1F1F2",
    "name": "Flag: Micronesia"
  },
  {
    "emoji": "🇫🇴",
    "entity": "&#x1F1EB&#x1F1F4",
    "name": "Flag: Faroe Islands"
  },
  {
    "emoji": "🇫🇷",
    "entity": "&#x1F1EB&#x1F1F7",
    "name": "Flag: France"
  },
  {
    "emoji": "🇬🇦",
    "entity": "&#x1F1EC&#x1F1E6",
    "name": "Flag: Gabon"
  },
  {
    "emoji": "🇬🇧",
    "entity": "&#x1F1EC&#x1F1E7",
    "name": "Flag: United Kingdom"
  },
  {
    "emoji": "🇬🇩",
    "entity": "&#x1F1EC&#x1F1E9",
    "name": "Flag: Grenada"
  },
  {
    "emoji": "🇬🇪",
    "entity": "&#x1F1EC&#x1F1EA",
    "name": "Flag: Georgia"
  },
  {
    "emoji": "🇬🇫",
    "entity": "&#x1F1EC&#x1F1EB",
    "name": "Flag: French Guiana"
  },
  {
    "emoji": "🇬🇬",
    "entity": "&#x1F1EC&#x1F1EC",
    "name": "Flag: Guernsey"
  },
  {
    "emoji": "🇬🇭",
    "entity": "&#x1F1EC&#x1F1ED",
    "name": "Flag: Ghana"
  },
  {
    "emoji": "🇬🇮",
    "entity": "&#x1F1EC&#x1F1EE",
    "name": "Flag: Gibraltar"
  },
  {
    "emoji": "🇬🇱",
    "entity": "&#x1F1EC&#x1F1F1",
    "name": "Flag: Greenland"
  },
  {
    "emoji": "🇬🇲",
    "entity": "&#x1F1EC&#x1F1F2",
    "name": "Flag: Gambia"
  },
  {
    "emoji": "🇬🇳",
    "entity": "&#x1F1EC&#x1F1F3",
    "name": "Flag: Guinea"
  },
  {
    "emoji": "🇬🇵",
    "entity": "&#x1F1EC&#x1F1F5",
    "name": "Flag: Guadeloupe"
  },
  {
    "emoji": "🇬🇶",
    "entity": "&#x1F1EC&#x1F1F6",
    "name": "Flag: Equatorial Guinea"
  },
  {
    "emoji": "🇬🇷",
    "entity": "&#x1F1EC&#x1F1F7",
    "name": "Flag: Greece"
  },
  {
    "emoji": "🇬🇸",
    "entity": "&#x1F1EC&#x1F1F8",
    "name": "Flag: South Georgia &amp; South Sandwich Islands"
  },
  {
    "emoji": "🇬🇹",
    "entity": "&#x1F1EC&#x1F1F9",
    "name": "Flag: Guatemala"
  },
  {
    "emoji": "🇬🇺",
    "entity": "&#x1F1EC&#x1F1FA",
    "name": "Flag: Guam"
  },
  {
    "emoji": "🇬🇼",
    "entity": "&#x1F1EC&#x1F1FC",
    "name": "Flag: Guinea-Bissau"
  },
  {
    "emoji": "🇬🇾",
    "entity": "&#x1F1EC&#x1F1FE",
    "name": "Flag: Guyana"
  },
  {
    "emoji": "🇭🇰",
    "entity": "&#x1F1ED&#x1F1F0",
    "name": "Flag: Hong Kong SAR China"
  },
  {
    "emoji": "🇭🇲",
    "entity": "&#x1F1ED&#x1F1F2",
    "name": "Flag: Heard &amp; McDonald Islands"
  },
  {
    "emoji": "🇭🇳",
    "entity": "&#x1F1ED&#x1F1F3",
    "name": "Flag: Honduras"
  },
  {
    "emoji": "🇭🇷",
    "entity": "&#x1F1ED&#x1F1F7",
    "name": "Flag: Croatia"
  },
  {
    "emoji": "🇭🇹",
    "entity": "&#x1F1ED&#x1F1F9",
    "name": "Flag: Haiti"
  },
  {
    "emoji": "🇭🇺",
    "entity": "&#x1F1ED&#x1F1FA",
    "name": "Flag: Hungary"
  },
  {
    "emoji": "🇮🇨",
    "entity": "&#x1F1EE&#x1F1E8",
    "name": "Flag: Canary Islands"
  },
  {
    "emoji": "🇮🇩",
    "entity": "&#x1F1EE&#x1F1E9",
    "name": "Flag: Indonesia"
  },
  {
    "emoji": "🇮🇪",
    "entity": "&#x1F1EE&#x1F1EA",
    "name": "Flag: Ireland"
  },
  {
    "emoji": "🇮🇱",
    "entity": "&#x1F1EE&#x1F1F1",
    "name": "Flag: Israel"
  },
  {
    "emoji": "🇮🇲",
    "entity": "&#x1F1EE&#x1F1F2",
    "name": "Flag: Isle Of Man"
  },
  {
    "emoji": "🇮🇳",
    "entity": "&#x1F1EE&#x1F1F3",
    "name": "Flag: India"
  },
  {
    "emoji": "🇮🇴",
    "entity": "&#x1F1EE&#x1F1F4",
    "name": "Flag: British Indian Ocean Territory"
  },
  {
    "emoji": "🇮🇶",
    "entity": "&#x1F1EE&#x1F1F6",
    "name": "Flag: Iraq"
  },
  {
    "emoji": "🇮🇷",
    "entity": "&#x1F1EE&#x1F1F7",
    "name": "Flag: Iran"
  },
  {
    "emoji": "🇮🇸",
    "entity": "&#x1F1EE&#x1F1F8",
    "name": "Flag: Iceland"
  },
  {
    "emoji": "🇮🇹",
    "entity": "&#x1F1EE&#x1F1F9",
    "name": "Flag: Italy"
  },
  {
    "emoji": "🇯🇪",
    "entity": "&#x1F1EF&#x1F1EA",
    "name": "Flag: Jersey"
  },
  {
    "emoji": "🇯🇲",
    "entity": "&#x1F1EF&#x1F1F2",
    "name": "Flag: Jamaica"
  },
  {
    "emoji": "🇯🇴",
    "entity": "&#x1F1EF&#x1F1F4",
    "name": "Flag: Jordan"
  },
  {
    "emoji": "🇯🇵",
    "entity": "&#x1F1EF&#x1F1F5",
    "name": "Flag: Japan"
  },
  {
    "emoji": "🇰🇪",
    "entity": "&#x1F1F0&#x1F1EA",
    "name": "Flag: Kenya"
  },
  {
    "emoji": "🇰🇬",
    "entity": "&#x1F1F0&#x1F1EC",
    "name": "Flag: Kyrgyzstan"
  },
  {
    "emoji": "🇰🇭",
    "entity": "&#x1F1F0&#x1F1ED",
    "name": "Flag: Cambodia"
  },
  {
    "emoji": "🇰🇮",
    "entity": "&#x1F1F0&#x1F1EE",
    "name": "Flag: Kiribati"
  },
  {
    "emoji": "🇰🇲",
    "entity": "&#x1F1F0&#x1F1F2",
    "name": "Flag: Comoros"
  },
  {
    "emoji": "🇰🇳",
    "entity": "&#x1F1F0&#x1F1F3",
    "name": "Flag: St. Kitts &amp; Nevis"
  },
  {
    "emoji": "🇰🇵",
    "entity": "&#x1F1F0&#x1F1F5",
    "name": "Flag: North Korea"
  },
  {
    "emoji": "🇰🇷",
    "entity": "&#x1F1F0&#x1F1F7",
    "name": "Flag: South Korea"
  },
  {
    "emoji": "🇰🇼",
    "entity": "&#x1F1F0&#x1F1FC",
    "name": "Flag: Kuwait"
  },
  {
    "emoji": "🇰🇾",
    "entity": "&#x1F1F0&#x1F1FE",
    "name": "Flag: Cayman Islands"
  },
  {
    "emoji": "🇰🇿",
    "entity": "&#x1F1F0&#x1F1FF",
    "name": "Flag: Kazakhstan"
  },
  {
    "emoji": "🇱🇦",
    "entity": "&#x1F1F1&#x1F1E6",
    "name": "Flag: Laos"
  },
  {
    "emoji": "🇱🇧",
    "entity": "&#x1F1F1&#x1F1E7",
    "name": "Flag: Lebanon"
  },
  {
    "emoji": "🇱🇨",
    "entity": "&#x1F1F1&#x1F1E8",
    "name": "Flag: St. Lucia"
  },
  {
    "emoji": "🇱🇮",
    "entity": "&#x1F1F1&#x1F1EE",
    "name": "Flag: Liechtenstein"
  },
  {
    "emoji": "🇱🇰",
    "entity": "&#x1F1F1&#x1F1F0",
    "name": "Flag: Sri Lanka"
  },
  {
    "emoji": "🇱🇷",
    "entity": "&#x1F1F1&#x1F1F7",
    "name": "Flag: Liberia"
  },
  {
    "emoji": "🇱🇸",
    "entity": "&#x1F1F1&#x1F1F8",
    "name": "Flag: Lesotho"
  },
  {
    "emoji": "🇱🇹",
    "entity": "&#x1F1F1&#x1F1F9",
    "name": "Flag: Lithuania"
  },
  {
    "emoji": "🇱🇺",
    "entity": "&#x1F1F1&#x1F1FA",
    "name": "Flag: Luxembourg"
  },
  {
    "emoji": "🇱🇻",
    "entity": "&#x1F1F1&#x1F1FB",
    "name": "Flag: Latvia"
  },
  {
    "emoji": "🇱🇾",
    "entity": "&#x1F1F1&#x1F1FE",
    "name": "Flag: Libya"
  },
  {
    "emoji": "🇲🇦",
    "entity": "&#x1F1F2&#x1F1E6",
    "name": "Flag: Morocco"
  },
  {
    "emoji": "🇲🇨",
    "entity": "&#x1F1F2&#x1F1E8",
    "name": "Flag: Monaco"
  },
  {
    "emoji": "🇲🇩",
    "entity": "&#x1F1F2&#x1F1E9",
    "name": "Flag: Moldova"
  },
  {
    "emoji": "🇲🇪",
    "entity": "&#x1F1F2&#x1F1EA",
    "name": "Flag: Montenegro"
  },
  {
    "emoji": "🇲🇫",
    "entity": "&#x1F1F2&#x1F1EB",
    "name": "Flag: St. Martin"
  },
  {
    "emoji": "🇲🇬",
    "entity": "&#x1F1F2&#x1F1EC",
    "name": "Flag: Madagascar"
  },
  {
    "emoji": "🇲🇭",
    "entity": "&#x1F1F2&#x1F1ED",
    "name": "Flag: Marshall Islands"
  },
  {
    "emoji": "🇲🇰",
    "entity": "&#x1F1F2&#x1F1F0",
    "name": "Flag: Macedonia"
  },
  {
    "emoji": "🇲🇱",
    "entity": "&#x1F1F2&#x1F1F1",
    "name": "Flag: Mali"
  },
  {
    "emoji": "🇲🇲",
    "entity": "&#x1F1F2&#x1F1F2",
    "name": "Flag: Myanmar (Burma)"
  },
  {
    "emoji": "🇲🇳",
    "entity": "&#x1F1F2&#x1F1F3",
    "name": "Flag: Mongolia"
  },
  {
    "emoji": "🇲🇴",
    "entity": "&#x1F1F2&#x1F1F4",
    "name": "Flag: Macao SAR China"
  },
  {
    "emoji": "🇲🇵",
    "entity": "&#x1F1F2&#x1F1F5",
    "name": "Flag: Northern Mariana Islands"
  },
  {
    "emoji": "🇲🇶",
    "entity": "&#x1F1F2&#x1F1F6",
    "name": "Flag: Martinique"
  },
  {
    "emoji": "🇲🇷",
    "entity": "&#x1F1F2&#x1F1F7",
    "name": "Flag: Mauritania"
  },
  {
    "emoji": "🇲🇸",
    "entity": "&#x1F1F2&#x1F1F8",
    "name": "Flag: Montserrat"
  },
  {
    "emoji": "🇲🇹",
    "entity": "&#x1F1F2&#x1F1F9",
    "name": "Flag: Malta"
  },
  {
    "emoji": "🇲🇺",
    "entity": "&#x1F1F2&#x1F1FA",
    "name": "Flag: Mauritius"
  },
  {
    "emoji": "🇲🇻",
    "entity": "&#x1F1F2&#x1F1FB",
    "name": "Flag: Maldives"
  },
  {
    "emoji": "🇲🇼",
    "entity": "&#x1F1F2&#x1F1FC",
    "name": "Flag: Malawi"
  },
  {
    "emoji": "🇲🇽",
    "entity": "&#x1F1F2&#x1F1FD",
    "name": "Flag: Mexico"
  },
  {
    "emoji": "🇲🇾",
    "entity": "&#x1F1F2&#x1F1FE",
    "name": "Flag: Malaysia"
  },
  {
    "emoji": "🇲🇿",
    "entity": "&#x1F1F2&#x1F1FF",
    "name": "Flag: Mozambique"
  },
  {
    "emoji": "🇳🇦",
    "entity": "&#x1F1F3&#x1F1E6",
    "name": "Flag: Namibia"
  },
  {
    "emoji": "🇳🇨",
    "entity": "&#x1F1F3&#x1F1E8",
    "name": "Flag: New Caledonia"
  },
  {
    "emoji": "🇳🇪",
    "entity": "&#x1F1F3&#x1F1EA",
    "name": "Flag: Niger"
  },
  {
    "emoji": "🇳🇫",
    "entity": "&#x1F1F3&#x1F1EB",
    "name": "Flag: Norfolk Island"
  },
  {
    "emoji": "🇳🇬",
    "entity": "&#x1F1F3&#x1F1EC",
    "name": "Flag: Nigeria"
  },
  {
    "emoji": "🇳🇮",
    "entity": "&#x1F1F3&#x1F1EE",
    "name": "Flag: Nicaragua"
  },
  {
    "emoji": "🇳🇱",
    "entity": "&#x1F1F3&#x1F1F1",
    "name": "Flag: Netherlands"
  },
  {
    "emoji": "🇳🇴",
    "entity": "&#x1F1F3&#x1F1F4",
    "name": "Flag: Norway"
  },
  {
    "emoji": "🇳🇵",
    "entity": "&#x1F1F3&#x1F1F5",
    "name": "Flag: Nepal"
  },
  {
    "emoji": "🇳🇷",
    "entity": "&#x1F1F3&#x1F1F7",
    "name": "Flag: Nauru"
  },
  {
    "emoji": "🇳🇺",
    "entity": "&#x1F1F3&#x1F1FA",
    "name": "Flag: Niue"
  },
  {
    "emoji": "🇳🇿",
    "entity": "&#x1F1F3&#x1F1FF",
    "name": "Flag: New Zealand"
  },
  {
    "emoji": "🇴🇲",
    "entity": "&#x1F1F4&#x1F1F2",
    "name": "Flag: Oman"
  },
  {
    "emoji": "🇵🇦",
    "entity": "&#x1F1F5&#x1F1E6",
    "name": "Flag: Panama"
  },
  {
    "emoji": "🇵🇪",
    "entity": "&#x1F1F5&#x1F1EA",
    "name": "Flag: Peru"
  },
  {
    "emoji": "🇵🇫",
    "entity": "&#x1F1F5&#x1F1EB",
    "name": "Flag: French Polynesia"
  },
  {
    "emoji": "🇵🇬",
    "entity": "&#x1F1F5&#x1F1EC",
    "name": "Flag: Papua New Guinea"
  },
  {
    "emoji": "🇵🇭",
    "entity": "&#x1F1F5&#x1F1ED",
    "name": "Flag: Philippines"
  },
  {
    "emoji": "🇵🇰",
    "entity": "&#x1F1F5&#x1F1F0",
    "name": "Flag: Pakistan"
  },
  {
    "emoji": "🇵🇱",
    "entity": "&#x1F1F5&#x1F1F1",
    "name": "Flag: Poland"
  },
  {
    "emoji": "🇵🇲",
    "entity": "&#x1F1F5&#x1F1F2",
    "name": "Flag: St. Pierre &amp; Miquelon"
  },
  {
    "emoji": "🇵🇳",
    "entity": "&#x1F1F5&#x1F1F3",
    "name": "Flag: Pitcairn Islands"
  },
  {
    "emoji": "🇵🇷",
    "entity": "&#x1F1F5&#x1F1F7",
    "name": "Flag: Puerto Rico"
  },
  {
    "emoji": "🇵🇸",
    "entity": "&#x1F1F5&#x1F1F8",
    "name": "Flag: Palestinian Territories"
  },
  {
    "emoji": "🇵🇹",
    "entity": "&#x1F1F5&#x1F1F9",
    "name": "Flag: Portugal"
  },
  {
    "emoji": "🇵🇼",
    "entity": "&#x1F1F5&#x1F1FC",
    "name": "Flag: Palau"
  },
  {
    "emoji": "🇵🇾",
    "entity": "&#x1F1F5&#x1F1FE",
    "name": "Flag: Paraguay"
  },
  {
    "emoji": "🇶🇦",
    "entity": "&#x1F1F6&#x1F1E6",
    "name": "Flag: Qatar"
  },
  {
    "emoji": "🇷🇪",
    "entity": "&#x1F1F7&#x1F1EA",
    "name": "Flag: Réunion"
  },
  {
    "emoji": "🇷🇴",
    "entity": "&#x1F1F7&#x1F1F4",
    "name": "Flag: Romania"
  },
  {
    "emoji": "🇷🇸",
    "entity": "&#x1F1F7&#x1F1F8",
    "name": "Flag: Serbia"
  },
  {
    "emoji": "🇷🇺",
    "entity": "&#x1F1F7&#x1F1FA",
    "name": "Flag: Russia"
  },
  {
    "emoji": "🇷🇼",
    "entity": "&#x1F1F7&#x1F1FC",
    "name": "Flag: Rwanda"
  },
  {
    "emoji": "🇸🇦",
    "entity": "&#x1F1F8&#x1F1E6",
    "name": "Flag: Saudi Arabia"
  },
  {
    "emoji": "🇸🇧",
    "entity": "&#x1F1F8&#x1F1E7",
    "name": "Flag: Solomon Islands"
  },
  {
    "emoji": "🇸🇨",
    "entity": "&#x1F1F8&#x1F1E8",
    "name": "Flag: Seychelles"
  },
  {
    "emoji": "🇸🇩",
    "entity": "&#x1F1F8&#x1F1E9",
    "name": "Flag: Sudan"
  },
  {
    "emoji": "🇸🇪",
    "entity": "&#x1F1F8&#x1F1EA",
    "name": "Flag: Sweden"
  },
  {
    "emoji": "🇸🇬",
    "entity": "&#x1F1F8&#x1F1EC",
    "name": "Flag: Singapore"
  },
  {
    "emoji": "🇸🇭",
    "entity": "&#x1F1F8&#x1F1ED",
    "name": "Flag: St. Helena"
  },
  {
    "emoji": "🇸🇮",
    "entity": "&#x1F1F8&#x1F1EE",
    "name": "Flag: Slovenia"
  },
  {
    "emoji": "🇸🇯",
    "entity": "&#x1F1F8&#x1F1EF",
    "name": "Flag: Svalbard &amp; Jan Mayen"
  },
  {
    "emoji": "🇸🇰",
    "entity": "&#x1F1F8&#x1F1F0",
    "name": "Flag: Slovakia"
  },
  {
    "emoji": "🇸🇱",
    "entity": "&#x1F1F8&#x1F1F1",
    "name": "Flag: Sierra Leone"
  },
  {
    "emoji": "🇸🇲",
    "entity": "&#x1F1F8&#x1F1F2",
    "name": "Flag: San Marino"
  },
  {
    "emoji": "🇸🇳",
    "entity": "&#x1F1F8&#x1F1F3",
    "name": "Flag: Senegal"
  },
  {
    "emoji": "🇸🇴",
    "entity": "&#x1F1F8&#x1F1F4",
    "name": "Flag: Somalia"
  },
  {
    "emoji": "🇸🇷",
    "entity": "&#x1F1F8&#x1F1F7",
    "name": "Flag: Suriname"
  },
  {
    "emoji": "🇸🇸",
    "entity": "&#x1F1F8&#x1F1F8",
    "name": "Flag: South Sudan"
  },
  {
    "emoji": "🇸🇹",
    "entity": "&#x1F1F8&#x1F1F9",
    "name": "Flag: São Tomé &amp; Príncipe"
  },
  {
    "emoji": "🇸🇻",
    "entity": "&#x1F1F8&#x1F1FB",
    "name": "Flag: El Salvador"
  },
  {
    "emoji": "🇸🇽",
    "entity": "&#x1F1F8&#x1F1FD",
    "name": "Flag: Sint Maarten"
  },
  {
    "emoji": "🇸🇾",
    "entity": "&#x1F1F8&#x1F1FE",
    "name": "Flag: Syria"
  },
  {
    "emoji": "🇸🇿",
    "entity": "&#x1F1F8&#x1F1FF",
    "name": "Flag: Eswatini"
  },
  {
    "emoji": "🇹🇦",
    "entity": "&#x1F1F9&#x1F1E6",
    "name": "Flag: Tristan Da Cunha"
  },
  {
    "emoji": "🇹🇨",
    "entity": "&#x1F1F9&#x1F1E8",
    "name": "Flag: Turks &amp; Caicos Islands"
  },
  {
    "emoji": "🇹🇩",
    "entity": "&#x1F1F9&#x1F1E9",
    "name": "Flag: Chad"
  },
  {
    "emoji": "🇹🇫",
    "entity": "&#x1F1F9&#x1F1EB",
    "name": "Flag: French Southern Territories"
  },
  {
    "emoji": "🇹🇬",
    "entity": "&#x1F1F9&#x1F1EC",
    "name": "Flag: Togo"
  },
  {
    "emoji": "🇹🇭",
    "entity": "&#x1F1F9&#x1F1ED",
    "name": "Flag: Thailand"
  },
  {
    "emoji": "🇹🇯",
    "entity": "&#x1F1F9&#x1F1EF",
    "name": "Flag: Tajikistan"
  },
  {
    "emoji": "🇹🇰",
    "entity": "&#x1F1F9&#x1F1F0",
    "name": "Flag: Tokelau"
  },
  {
    "emoji": "🇹🇱",
    "entity": "&#x1F1F9&#x1F1F1",
    "name": "Flag: Timor-Leste"
  },
  {
    "emoji": "🇹🇲",
    "entity": "&#x1F1F9&#x1F1F2",
    "name": "Flag: Turkmenistan"
  },
  {
    "emoji": "🇹🇳",
    "entity": "&#x1F1F9&#x1F1F3",
    "name": "Flag: Tunisia"
  },
  {
    "emoji": "🇹🇴",
    "entity": "&#x1F1F9&#x1F1F4",
    "name": "Flag: Tonga"
  },
  {
    "emoji": "🇹🇷",
    "entity": "&#x1F1F9&#x1F1F7",
    "name": "Flag: Turkey"
  },
  {
    "emoji": "🇹🇹",
    "entity": "&#x1F1F9&#x1F1F9",
    "name": "Flag: Trinidad &amp; Tobago"
  },
  {
    "emoji": "🇹🇻",
    "entity": "&#x1F1F9&#x1F1FB",
    "name": "Flag: Tuvalu"
  },
  {
    "emoji": "🇹🇼",
    "entity": "&#x1F1F9&#x1F1FC",
    "name": "Flag: Taiwan"
  },
  {
    "emoji": "🇹🇿",
    "entity": "&#x1F1F9&#x1F1FF",
    "name": "Flag: Tanzania"
  },
  {
    "emoji": "🇺🇦",
    "entity": "&#x1F1FA&#x1F1E6",
    "name": "Flag: Ukraine"
  },
  {
    "emoji": "🇺🇬",
    "entity": "&#x1F1FA&#x1F1EC",
    "name": "Flag: Uganda"
  },
  {
    "emoji": "🇺🇲",
    "entity": "&#x1F1FA&#x1F1F2",
    "name": "Flag: U.S. Outlying Islands"
  },
  {
    "emoji": "🇺🇳",
    "entity": "&#x1F1FA&#x1F1F3",
    "name": "Flag: United Nations"
  },
  {
    "emoji": "🇺🇸",
    "entity": "&#x1F1FA&#x1F1F8",
    "name": "Flag: United States"
  },
  {
    "emoji": "🇺🇾",
    "entity": "&#x1F1FA&#x1F1FE",
    "name": "Flag: Uruguay"
  },
  {
    "emoji": "🇺🇿",
    "entity": "&#x1F1FA&#x1F1FF",
    "name": "Flag: Uzbekistan"
  },
  {
    "emoji": "🇻🇦",
    "entity": "&#x1F1FB&#x1F1E6",
    "name": "Flag: Vatican City"
  },
  {
    "emoji": "🇻🇨",
    "entity": "&#x1F1FB&#x1F1E8",
    "name": "Flag: St. Vincent &amp; Grenadines"
  },
  {
    "emoji": "🇻🇪",
    "entity": "&#x1F1FB&#x1F1EA",
    "name": "Flag: Venezuela"
  },
  {
    "emoji": "🇻🇬",
    "entity": "&#x1F1FB&#x1F1EC",
    "name": "Flag: British Virgin Islands"
  },
  {
    "emoji": "🇻🇮",
    "entity": "&#x1F1FB&#x1F1EE",
    "name": "Flag: U.S. Virgin Islands"
  },
  {
    "emoji": "🇻🇳",
    "entity": "&#x1F1FB&#x1F1F3",
    "name": "Flag: Vietnam"
  },
  {
    "emoji": "🇻🇺",
    "entity": "&#x1F1FB&#x1F1FA",
    "name": "Flag: Vanuatu"
  },
  {
    "emoji": "🇼🇫",
    "entity": "&#x1F1FC&#x1F1EB",
    "name": "Flag: Wallis &amp; Futuna"
  },
  {
    "emoji": "🇼🇸",
    "entity": "&#x1F1FC&#x1F1F8",
    "name": "Flag: Samoa"
  },
  {
    "emoji": "🇽🇰",
    "entity": "&#x1F1FD&#x1F1F0",
    "name": "Flag: Kosovo"
  },
  {
    "emoji": "🇾🇪",
    "entity": "&#x1F1FE&#x1F1EA",
    "name": "Flag: Yemen"
  },
  {
    "emoji": "🇾🇹",
    "entity": "&#x1F1FE&#x1F1F9",
    "name": "Flag: Mayotte"
  },
  {
    "emoji": "🇿🇦",
    "entity": "&#x1F1FF&#x1F1E6",
    "name": "Flag: South Africa"
  },
  {
    "emoji": "🇿🇲",
    "entity": "&#x1F1FF&#x1F1F2",
    "name": "Flag: Zambia"
  },
  {
    "emoji": "🇿🇼",
    "entity": "&#x1F1FF&#x1F1FC",
    "name": "Flag: Zimbabwe"
  },
  {
    "emoji": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    "entity": "&#x1F3F4&#xE0067&#xE0062&#xE0065&#xE006E&#xE0067&#xE007F",
    "name": "Flag: England"
  },
  {
    "emoji": "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
    "entity": "&#x1F3F4&#xE0067&#xE0062&#xE0073&#xE0063&#xE0074&#xE007F",
    "name": "Flag: Scotland"
  },
  {
    "emoji": "🏴󠁧󠁢󠁷󠁬󠁳󠁿",
    "entity": "&#x1F3F4&#xE0067&#xE0062&#xE0077&#xE006C&#xE0073&#xE007F",
    "name": "Flag: Wales"
  }
];

export { EMOJIS };