/**
 * 夜间模式切换逻辑
 * 使用 localStorage 记住用户偏好
 * 支持跟随系统偏好（prefers-color-scheme）作为默认值
 */
(function () {
    'use strict';

    var STORAGE_KEY = 'nnez-theme';
    var DARK = 'dark';
    var LIGHT = 'light';

    // 获取当前应使用的主题
    function getPreferredTheme() {
        var saved = localStorage.getItem(STORAGE_KEY);
        if (saved) return saved;
        // 跟随系统偏好
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return DARK;
        }
        return LIGHT;
    }

    // 应用主题到 html 元素
    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        var btn = document.getElementById('dark-mode-toggle');
        if (!btn) return;
        var icon = btn.querySelector('i');
        if (!icon) return;
        if (theme === DARK) {
            icon.className = 'fas fa-sun';
            btn.setAttribute('title', '切换到日间模式');
        } else {
            icon.className = 'fas fa-moon';
            btn.setAttribute('title', '切换到夜间模式');
        }
    }

    // 切换主题
    function toggleTheme() {
        var current = document.documentElement.getAttribute('data-theme') || LIGHT;
        var next = current === DARK ? LIGHT : DARK;
        localStorage.setItem(STORAGE_KEY, next);
        applyTheme(next);
    }

    // 在 DOM 加载完毕后绑定按钮事件
    function init() {
        applyTheme(getPreferredTheme());
        var btn = document.getElementById('dark-mode-toggle');
        if (btn) {
            btn.addEventListener('click', toggleTheme);
        }
    }

    // 立即应用主题（防止白屏闪烁）
    document.documentElement.setAttribute('data-theme', getPreferredTheme());

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // 监听系统主题变化（仅当用户没有手动设置时生效）
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
            if (!localStorage.getItem(STORAGE_KEY)) {
                applyTheme(e.matches ? DARK : LIGHT);
            }
        });
    }
})();
