const I18N = {
    currentLang: 'zh',
    translations: {
        zh: {
            title: '星际战甲Mod · 紫卡分析',
            template: '模板',
            positive: '正面',
            negative: '负面',
            damage: '伤害',
            mutex_info: '互斥词条：重复攻击/攻击全体 · 抽牌/添加牌 · 负面效果 · 状态牌 · 自身负面效果',
            opt_2p: '2正面',
            opt_2p1n: '2正面 1负面',
            opt_3p: '3正面',
            opt_3p1n: '3正面 1负面',
            no_negative: '无负面',
            placeholder: '数值',
            range_prefix: '范围',
            analyze: '分析数值',
            trend_high: '高',
            trend_low: '低',
            trend_mid: '中',
            no_available: '— 无可用 —',
            stat_Damage: '伤害',
            stat_Repeat: '重复攻击',
            stat_IsTargettingAllEnemies: '攻击全体',
            stat_Draw: '抽牌',
            stat_Add: '添加牌',
            stat_Heal: '治疗',
            stat_TargetVulnerablePower: '易伤',
            stat_TargetWeakPower: '虚弱',
            stat_ColdPower: '冰冻',
            stat_ElectricityPower: '电击',
            stat_HeatPower: '火焰',
            stat_PoisonPower: '毒素',
            stat_SlashPower: '切割',
            stat_DazedCount: '晕眩',
            stat_DebrisCount: '碎屑',
            stat_SlimedCount: '黏液',
            stat_WoundCount: '伤口',
            stat_SelfFrailPower: '自身脆弱',
            stat_SelfVulnerablePower: '自身易伤',
            stat_SelfWeakPower: '自身虚弱'
        },
        en: {
            title: 'Warframe Mod · Riven Analyzer',
            template: 'Template',
            positive: 'Positive',
            negative: 'Negative',
            damage: 'Damage',
            mutex_info: 'Mutex: Repeat/AOE · Draw/Add to Hand · Debuffs · Status Cards · Self Debuffs',
            opt_2p: '2 Positive',
            opt_2p1n: '2 Positive 1 Negative',
            opt_3p: '3 Positive',
            opt_3p1n: '3 Positive 1 Negative',
            no_negative: 'No Negative',
            placeholder: 'Value',
            range_prefix: 'Range',
            analyze: 'Analyze',
            trend_high: 'High',
            trend_low: 'Low',
            trend_mid: 'Mid',
            no_available: '— No Available —',
            stat_Damage: 'Damage',
            stat_Repeat: 'Repeat',
            stat_IsTargettingAllEnemies: 'AOE',
            stat_Draw: 'Draw',
            stat_Add: 'Add to Hand',
            stat_Heal: 'Heal',
            stat_TargetVulnerablePower: 'Vulnerable',
            stat_TargetWeakPower: 'Weak',
            stat_ColdPower: 'Cold',
            stat_ElectricityPower: 'Electricity',
            stat_HeatPower: 'Heat',
            stat_PoisonPower: 'Poison',
            stat_SlashPower: 'Slash',
            stat_DazedCount: 'Dazed',
            stat_DebrisCount: 'Debris',
            stat_SlimedCount: 'Slimed',
            stat_WoundCount: 'Wound',
            stat_SelfFrailPower: 'Self Frail',
            stat_SelfVulnerablePower: 'Self Vulnerable',
            stat_SelfWeakPower: 'Self Weak'
        }
    },

    detectSystemLanguage() {
        const lang = navigator.language || navigator.languages?.[0] || 'en';
        if (lang.startsWith('zh')) {
            return 'zh';
        }
        return 'en';
    },

    get(key) {
        const langData = this.translations[this.currentLang] || this.translations.zh;
        return langData[key] || key;
    },

    getStatName(key) {
        const statKey = 'stat_' + key;
        const name = this.get(statKey);
        if (name !== statKey) return name;
        return DATA.DISPLAY_MAP[key] || key;
    },

    setLang(lang) {
        if (this.translations[lang]) {
            this.currentLang = lang;
            try {
                localStorage.setItem('riven_language', lang);
            } catch (e) {

            }
        }
    },
    
    init() {
        let savedLang = null;
        try {
            savedLang = localStorage.getItem('riven_language');
        } catch (e) {

        }
        
        if (savedLang && this.translations[savedLang]) {
            this.currentLang = savedLang;
            return savedLang;
        }
        
        const detected = this.detectSystemLanguage();
        this.currentLang = detected;
        try {
            localStorage.setItem('riven_language', detected);
        } catch (e) {

        }
        return detected;
    }
};