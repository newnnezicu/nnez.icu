/**
 * 夜间模式
 * - 默认跟随系统 prefers-color-scheme
 * - 用户手动拨动开关后，将选择保存到 localStorage，跨页面持久化
 * - 系统主题变化时，如果用户没有手动设置，则自动跟随
 * - 用户可以随时手动切换覆盖
 */
(function () {
    'use strict';

    var STORAGE_KEY = 'nnez-dark-mode';
    var mq = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');

    function systemIsDark() {
        return mq && mq.matches;
    }

    function applyTheme(dark) {
        document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
        var cb = document.getElementById('dark-mode-checkbox');
        if (cb) cb.checked = dark;
    }

    function getSavedPreference() {
        try {
            return localStorage.getItem(STORAGE_KEY);
        } catch (e) {
            return null;
        }
    }

    function savePreference(dark) {
        try {
            localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light');
        } catch (e) {
            // localStorage 不可用则静默失败
        }
    }

    function init() {
        // 优先读取用户手动设置；没有则跟随系统
        var saved = getSavedPreference();
        if (saved === 'dark' || saved === 'light') {
            applyTheme(saved === 'dark');
        } else {
            applyTheme(systemIsDark());
        }

        var cb = document.getElementById('dark-mode-checkbox');
        if (cb) {
            cb.addEventListener('change', function () {
                // 用户手动切换 → 保存到 localStorage
                applyTheme(cb.checked);
                savePreference(cb.checked);
            });
        }

        // 监听系统主题实时变化
        // 只有在用户没有手动设置过时才自动跟随
        function onSystemChange(e) {
            var saved = getSavedPreference();
            if (!saved) {
                applyTheme(e.matches);
            }
        }

        if (mq && mq.addEventListener) {
            mq.addEventListener('change', onSystemChange);
        } else if (mq && mq.addListener) {
            mq.addListener(onSystemChange);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
