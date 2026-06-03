/**
 * 夜间模式 - 完全跟随系统 prefers-color-scheme
 * 用户也可以手动拨动开关覆盖，但刷新后重新跟随系统
 * （去掉 localStorage 持久化，确保系统联动）
 */
(function () {
    'use strict';

    var mq = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');

    function isDark() {
        return mq && mq.matches;
    }

    function applyTheme(dark) {
        document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
        var cb = document.getElementById('dark-mode-checkbox');
        if (cb) cb.checked = dark;
    }

    function init() {
        // 跟随系统初始状态
        applyTheme(isDark());

        var cb = document.getElementById('dark-mode-checkbox');
        if (cb) {
            cb.addEventListener('change', function () {
                // 手动切换（本次页面有效，刷新后重新跟随系统）
                applyTheme(cb.checked);
            });
        }

        // 监听系统主题实时变化
        if (mq && mq.addEventListener) {
            mq.addEventListener('change', function (e) {
                applyTheme(e.matches);
            });
        } else if (mq && mq.addListener) {
            // 兼容旧版浏览器
            mq.addListener(function (e) {
                applyTheme(e.matches);
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
