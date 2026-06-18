const DATA = {
    BASE_VALUES: {
        "Damage": { mid: 8, min: 1, float: 2.5 },
        "Repeat": { mid: 2, min: 2, float: 0.5 },
        "IsTargettingAllEnemies": { mid: 1, min: 1, float: 0 },
        "Draw": { mid: 2, min: 1, float: 1 },
        "Add": { mid: 2, min: 1, float: 1 },
        "Heal": { mid: 2, min: 1, float: 0.5 },
        "TargetVulnerablePower": { mid: 2, min: 1, float: 1 },
        "TargetWeakPower": { mid: 2, min: 1, float: 1 },
        "ColdPower": { mid: 5, min: 1, float: 2 },
        "ElectricityPower": { mid: 2, min: 1, float: 1 },
        "HeatPower": { mid: 3, min: 1, float: 1.5 },
        "PoisonPower": { mid: 3, min: 1, float: 1.5 },
        "SlashPower": { mid: 3, min: 1, float: 1.5 },
        "DazedCount": { mid: 1, min: 1, float: 0 },
        "DebrisCount": { mid: 1, min: 1, float: 0 },
        "SlimedCount": { mid: 1, min: 1, float: 0 },
        "WoundCount": { mid: 1, min: 1, float: 0 },
        "SelfFrailPower": { mid: 3, min: 1, float: 1.5 },
        "SelfVulnerablePower": { mid: 3, min: 1, float: 1.5 },
        "SelfWeakPower": { mid: 3, min: 1, float: 1.5 }
    },
    WEIGHTS: {
        "2+": { bonus: 1, malus: 0 },
        "2+1": { bonus: 1.25, malus: 0.75 },
        "3+": { bonus: 0.5, malus: 0 },
        "3+1": { bonus: 0.75, malus: 1 }
    },
    POSITIVE_POOL: [
        "Repeat", "IsTargettingAllEnemies", "Draw", "Add", "Heal",
        "TargetVulnerablePower", "TargetWeakPower", "ColdPower", "ElectricityPower",
        "HeatPower", "PoisonPower", "SlashPower"
    ],
    NEGATIVE_POOL: [
        "DazedCount", "DebrisCount", "SlimedCount", "WoundCount",
        "SelfFrailPower", "SelfVulnerablePower", "SelfWeakPower"
    ],
    MUTEX_GROUPS: [
        ["Repeat", "IsTargettingAllEnemies"],
        ["Draw", "Add"],
        ["TargetVulnerablePower", "TargetWeakPower", "ColdPower", 
         "ElectricityPower", "HeatPower", "PoisonPower", "SlashPower"],
        ["DazedCount", "DebrisCount", "SlimedCount", "WoundCount"],
        ["SelfFrailPower", "SelfVulnerablePower", "SelfWeakPower"]
    ],
    DISPLAY_MAP: {
        "Damage": "伤害",
        "Repeat": "重复攻击",
        "IsTargettingAllEnemies": "攻击全体",
        "Draw": "抽牌",
        "Add": "添加牌",
        "Heal": "治疗",
        "TargetVulnerablePower": "易伤",
        "TargetWeakPower": "虚弱",
        "ColdPower": "冰冻",
        "ElectricityPower": "电击",
        "HeatPower": "火焰",
        "PoisonPower": "毒素",
        "SlashPower": "切割",
        "DazedCount": "晕眩",
        "DebrisCount": "碎屑",
        "SlimedCount": "黏液",
        "WoundCount": "伤口",
        "SelfFrailPower": "自身脆弱",
        "SelfVulnerablePower": "自身易伤",
        "SelfWeakPower": "自身虚弱"
    }
};