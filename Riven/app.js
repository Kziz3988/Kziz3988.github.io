(function() {
    const BASE_VALUES = DATA.BASE_VALUES;
    const WEIGHTS = DATA.WEIGHTS;
    const POSITIVE_POOL = DATA.POSITIVE_POOL;
    const NEGATIVE_POOL = DATA.NEGATIVE_POOL;
    const MUTEX_GROUPS = DATA.MUTEX_GROUPS;

    const statTypeSelect = document.getElementById('statType');
    const positiveSelectors = document.getElementById('positiveSelectors');
    const negativeSelectors = document.getElementById('negativeSelectors');
    const resultContainer = document.getElementById('resultContainer');
    const langSelect = document.getElementById('langSelect');

    function getDisplayName(key) {
        return I18N.getStatName(key);
    }

    function getText(key) {
        return I18N.get(key);
    }

    function updateAllTexts() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            el.textContent = getText(key);
        });
        document.querySelectorAll('#statType option').forEach(opt => {
            const key = opt.dataset.i18n;
            if (key) {
                opt.textContent = getText(key);
            }
        });
        const damageEl = document.querySelector('.fixed-damage');
        if (damageEl) damageEl.textContent = getText('damage');
        const mutexEl = document.querySelector('.mutex-info');
        if (mutexEl) mutexEl.textContent = getText('mutex_info');
        const template = statTypeSelect.value;
        renderResults(template);
        refreshSelects();
    }

    langSelect.addEventListener('change', function() {
        I18N.setLang(this.value);
        updateAllTexts();
    });

    function enforcePositiveInteger(input) {
        input.addEventListener('input', function() {
            let val = this.value;
            val = val.replace(/[^0-9]/g, '');
            if (val === '' || parseInt(val) === 0) {
                this.value = '';
            } else {
                this.value = val;
            }
        });
        input.addEventListener('paste', function(e) {
            const pasted = (e.clipboardData || window.clipboardData).getData('text');
            if (!/^\d+$/.test(pasted)) {
                e.preventDefault();
            }
        });
    }

    function getCountsFromTemplate(template) {
        const map = {
            "2+": { pos: 2, neg: 0 },
            "2+1": { pos: 2, neg: 1 },
            "3+": { pos: 3, neg: 0 },
            "3+1": { pos: 3, neg: 1 }
        };
        return map[template] || { pos: 2, neg: 1 };
    }

    function isMutexWithSelected(key, selectedSet) {
        for (let group of MUTEX_GROUPS) {
            if (group.includes(key)) {
                for (let member of group) {
                    if (member !== key && selectedSet.has(member)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    function refreshSelects() {
        const posSelects = document.querySelectorAll('.pos-select');
        const negSelects = document.querySelectorAll('.neg-select');

        posSelects.forEach((sel, idx) => {
            const otherSelected = new Set();
            posSelects.forEach((s, i) => {
                if (i !== idx && s.value) otherSelected.add(s.value);
            });
            const available = POSITIVE_POOL.filter(key => {
                if (otherSelected.has(key)) return false;
                if (isMutexWithSelected(key, otherSelected)) return false;
                return true;
            });
            const currentVal = sel.value;
            sel.innerHTML = '';
            available.forEach(k => {
                const opt = document.createElement('option');
                opt.value = k;
                opt.textContent = getDisplayName(k);
                sel.appendChild(opt);
            });
            if (available.length === 0) {
                const opt = document.createElement('option');
                opt.value = '';
                opt.textContent = getText('no_available');
                sel.appendChild(opt);
            }
            if (available.includes(currentVal)) sel.value = currentVal;
            else if (available.length > 0) sel.value = available[0];
            else sel.value = '';
        });

        negSelects.forEach((sel, idx) => {
            const otherNeg = new Set();
            negSelects.forEach((s, i) => {
                if (i !== idx && s.value) otherNeg.add(s.value);
            });
            const available = NEGATIVE_POOL.filter(key => {
                if (otherNeg.has(key)) return false;
                if (isMutexWithSelected(key, otherNeg)) return false;
                return true;
            });
            const currentVal = sel.value;
            sel.innerHTML = '';
            available.forEach(k => {
                const opt = document.createElement('option');
                opt.value = k;
                opt.textContent = getDisplayName(k);
                sel.appendChild(opt);
            });
            if (available.length === 0) {
                const opt = document.createElement('option');
                opt.value = '';
                opt.textContent = getText('no_available');
                sel.appendChild(opt);
            }
            if (available.includes(currentVal)) sel.value = currentVal;
            else if (available.length > 0) sel.value = available[0];
            else sel.value = '';
        });
    }

    function renderSelectors(template) {
        const counts = getCountsFromTemplate(template);
        const posCount = counts.pos;
        const negCount = counts.neg;

        positiveSelectors.innerHTML = `<span class="fixed-damage">${getText('damage')}</span>`;
        for (let i = 0; i < posCount - 1; i++) {
            const select = document.createElement('select');
            select.className = 'pos-select';
            select.dataset.index = i;
            positiveSelectors.appendChild(select);
        }

        negativeSelectors.innerHTML = '';
        if (negCount === 0) {
            const noneSpan = document.createElement('span');
            noneSpan.className = 'no-negative';
            noneSpan.textContent = getText('no_negative');
            negativeSelectors.appendChild(noneSpan);
        } else {
            for (let i = 0; i < negCount; i++) {
                const select = document.createElement('select');
                select.className = 'neg-select';
                select.dataset.index = i;
                negativeSelectors.appendChild(select);
            }
        }

        const posSelects = document.querySelectorAll('.pos-select');
        const negSelects = document.querySelectorAll('.neg-select');
        const defaultPos = ['Repeat', 'ColdPower', 'PoisonPower', 'HeatPower'];
        posSelects.forEach((sel, idx) => {
            const val = defaultPos[idx] || POSITIVE_POOL[idx % POSITIVE_POOL.length];
            if (POSITIVE_POOL.includes(val)) sel.value = val;
            else sel.value = POSITIVE_POOL[0] || '';
        });
        const defaultNeg = ['DazedCount', 'SelfFrailPower', 'SelfVulnerablePower'];
        negSelects.forEach((sel, idx) => {
            const val = defaultNeg[idx] || NEGATIVE_POOL[idx % NEGATIVE_POOL.length];
            if (NEGATIVE_POOL.includes(val)) sel.value = val;
            else sel.value = NEGATIVE_POOL[0] || '';
        });

        const allSelects = [...document.querySelectorAll('.pos-select, .neg-select')];
        allSelects.forEach(sel => {
            sel.removeEventListener('change', onSelectChange);
            sel.addEventListener('change', onSelectChange);
        });

        refreshSelects();
        renderResults(template);
    }

    function onSelectChange() {
        refreshSelects();
        renderResults(statTypeSelect.value);
    }

    function getSelectedStats() {
        const posSelects = document.querySelectorAll('.pos-select');
        const negSelects = document.querySelectorAll('.neg-select');
        const positive = ['Damage', ...Array.from(posSelects).map(s => s.value).filter(v => v)];
        const negative = Array.from(negSelects).map(s => s.value).filter(v => v);
        return { positive, negative };
    }

    function computeRangeAndMedian(attrKey, statTypeKey, isBonus) {
        const base = BASE_VALUES[attrKey];
        if (!base) return { min: 0, max: 0, median: 0 };
        const weight = isBonus ? WEIGHTS[statTypeKey].bonus : WEIGHTS[statTypeKey].malus;
        const { mid, min, float } = base;
        if (weight === 0) return { min, max: min, median: min };
        const rawMin = Math.round((mid - float) * weight);
        const rawMax = Math.round((mid + float) * weight);
        const rawMedian = Math.round(mid * weight);
        const finalMin = Math.max(min, rawMin);
        const finalMax = Math.max(min, rawMax);
        const finalMedian = Math.max(min, rawMedian);
        return {
            min: Math.min(finalMin, finalMax),
            max: Math.max(finalMin, finalMax),
            median: finalMedian
        };
    }

    function renderResults(statTypeKey) {
        const { positive, negative } = getSelectedStats();
        const rows = [];
        positive.forEach(attr => {
            const range = computeRangeAndMedian(attr, statTypeKey, true);
            rows.push({ type: 'positive', attr, display: getDisplayName(attr), ...range });
        });
        negative.forEach(attr => {
            const range = computeRangeAndMedian(attr, statTypeKey, false);
            rows.push({ type: 'negative', attr, display: getDisplayName(attr), ...range });
        });

        resultContainer.innerHTML = '';
        if (rows.length === 0) return;

        const wrapper = document.createElement('div');
        wrapper.className = 'stat-grid';

        rows.forEach((row) => {
            const rowDiv = document.createElement('div');
            rowDiv.className = 'stat-row';
            const labelSpan = document.createElement('span');
            labelSpan.className = 'stat-label';
            labelSpan.textContent = row.display;

            const input = document.createElement('input');
            input.type = 'text';
            input.inputMode = 'numeric';
            input.pattern = '[0-9]*';
            input.placeholder = getText('placeholder');
            input.className = row.type === 'positive' ? 'stat-input-pos' : 'stat-input-neg';
            input.dataset.attr = row.attr;
            enforcePositiveInteger(input);

            const rangeSpan = document.createElement('span');
            rangeSpan.className = 'stat-range';
            rangeSpan.textContent = `${getText('range_prefix')} ${row.min} ~ ${row.max}`;

            const trendSpan = document.createElement('span');
            trendSpan.className = 'stat-trend trend-neutral';
            trendSpan.textContent = '—';
            trendSpan.dataset.attr = row.attr;

            rowDiv.appendChild(labelSpan);
            rowDiv.appendChild(input);
            rowDiv.appendChild(rangeSpan);
            rowDiv.appendChild(trendSpan);
            wrapper.appendChild(rowDiv);
        });

        const updateBtn = document.createElement('button');
        updateBtn.textContent = getText('analyze');
        updateBtn.style.cssText = `
            background: #1f2b47; border: none; color: white;
            padding: 8px 28px; border-radius: 40px; font-weight: 500;
            font-size: 1rem; cursor: pointer; transition: 0.15s;
            border: 1px solid #2d3b5c; letter-spacing: 0.3px;
            margin-top: 16px; width: auto;
            height: 38px;
        `;
        updateBtn.onmouseover = () => updateBtn.style.background = '#2b3b60';
        updateBtn.onmouseout = () => updateBtn.style.background = '#1f2b47';
        wrapper.appendChild(updateBtn);

        resultContainer.appendChild(wrapper);

        function updateTrends() {
            const inputs = wrapper.querySelectorAll('.stat-input-pos, .stat-input-neg');
            const trendSpans = wrapper.querySelectorAll('.stat-trend');
            const valueMap = {};
            inputs.forEach(inp => {
                const attr = inp.dataset.attr;
                const val = parseInt(inp.value, 10);
                valueMap[attr] = (isNaN(val) || val < 1) ? null : val;
            });
            trendSpans.forEach(span => {
                const attr = span.dataset.attr;
                const val = valueMap[attr];
                const rowData = rows.find(r => r.attr === attr);
                if (!rowData) return;
                if (val === null) {
                    span.textContent = '—';
                    span.className = 'stat-trend trend-neutral';
                    return;
                }
                const median = rowData.median;
                const diff = val - median;
                const isPositive = rowData.type === 'positive';
                let text, cls;
                if (diff > 0) {
                    text = getText('trend_high');
                    cls = isPositive ? 'trend-pos-high' : 'trend-neg-high';
                } else if (diff < 0) {
                    text = getText('trend_low');
                    cls = isPositive ? 'trend-pos-low' : 'trend-neg-low';
                } else {
                    text = getText('trend_mid');
                    cls = 'trend-neutral';
                }
                span.textContent = text;
                span.className = `stat-trend ${cls}`;
            });
        }

        updateBtn.addEventListener('click', updateTrends);
        wrapper.querySelectorAll('.stat-input-pos, .stat-input-neg').forEach(inp => {
            inp.removeEventListener('keypress', onInputKeypress);
            inp.addEventListener('keypress', onInputKeypress);
        });

        function onInputKeypress(e) {
            if (e.key === 'Enter') updateTrends();
        }
    }

    function onTemplateChange() {
        const template = statTypeSelect.value;
        renderSelectors(template);
    }

    const detectedLang = I18N.init();
    langSelect.value = detectedLang;

    statTypeSelect.addEventListener('change', onTemplateChange);
    window.addEventListener('DOMContentLoaded', () => {
        const initialTemplate = statTypeSelect.value;
        renderSelectors(initialTemplate);
        updateAllTexts();
    });
})();