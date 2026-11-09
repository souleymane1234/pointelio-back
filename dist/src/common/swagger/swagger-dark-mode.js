"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerDarkModeJs = exports.swaggerDarkModeCss = void 0;
exports.swaggerDarkModeCss = `
/* ===== Thème sombre Swagger UI (actif via body.swagger-dark) ===== */
body.swagger-dark { background: #0f141a; }

body.swagger-dark .swagger-ui,
body.swagger-dark .swagger-ui .info .title,
body.swagger-dark .swagger-ui .info li,
body.swagger-dark .swagger-ui .info p,
body.swagger-dark .swagger-ui .info table,
body.swagger-dark .swagger-ui label,
body.swagger-dark .swagger-ui .opblock-tag,
body.swagger-dark .swagger-ui .opblock .opblock-summary-operation-id,
body.swagger-dark .swagger-ui .opblock .opblock-summary-path,
body.swagger-dark .swagger-ui .opblock .opblock-summary-path__deprecated,
body.swagger-dark .swagger-ui .opblock .opblock-summary-description,
body.swagger-dark .swagger-ui .opblock-description-wrapper p,
body.swagger-dark .swagger-ui .opblock-external-docs-wrapper p,
body.swagger-dark .swagger-ui .opblock-title_normal p,
body.swagger-dark .swagger-ui .response-col_status,
body.swagger-dark .swagger-ui .response-col_links,
body.swagger-dark .swagger-ui table thead tr td,
body.swagger-dark .swagger-ui table thead tr th,
body.swagger-dark .swagger-ui .parameter__name,
body.swagger-dark .swagger-ui .parameter__type,
body.swagger-dark .swagger-ui .parameter__in,
body.swagger-dark .swagger-ui .tab li,
body.swagger-dark .swagger-ui .scheme-container .schemes > label,
body.swagger-dark .swagger-ui .model-title,
body.swagger-dark .swagger-ui .model,
body.swagger-dark .swagger-ui section.models h4,
body.swagger-dark .swagger-ui .servers-title,
body.swagger-dark .swagger-ui .btn {
  color: #e6e8eb;
}

body.swagger-dark .swagger-ui { background: #0f141a; }
body.swagger-dark .swagger-ui .scheme-container,
body.swagger-dark .swagger-ui .opblock .opblock-section-header {
  background: #161c24;
  box-shadow: none;
}

body.swagger-dark .swagger-ui .opblock-tag {
  border-bottom-color: #2a323d;
}

body.swagger-dark .swagger-ui .opblock {
  background: #161c24;
  border-color: #2a323d;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.4);
}

body.swagger-dark .swagger-ui .opblock .opblock-section-header > label,
body.swagger-dark .swagger-ui .opblock .opblock-section-header h4 {
  color: #e6e8eb;
}

body.swagger-dark .swagger-ui .opblock-body pre.microlight,
body.swagger-dark .swagger-ui textarea,
body.swagger-dark .swagger-ui input[type="text"],
body.swagger-dark .swagger-ui input[type="password"],
body.swagger-dark .swagger-ui input[type="search"],
body.swagger-dark .swagger-ui input[type="email"],
body.swagger-dark .swagger-ui .parameters-col_description input {
  background: #0b0f14 !important;
  color: #e6e8eb !important;
  border-color: #2a323d;
}

body.swagger-dark .swagger-ui select {
  background: #0b0f14;
  color: #e6e8eb;
  border-color: #2a323d;
}

body.swagger-dark .swagger-ui .model-box,
body.swagger-dark .swagger-ui section.models,
body.swagger-dark .swagger-ui section.models .model-container {
  background: #161c24;
  border-color: #2a323d;
}

body.swagger-dark .swagger-ui table tbody tr td {
  border-color: #2a323d;
  color: #c7ccd1;
}

body.swagger-dark .swagger-ui .topbar { background: #0b0f14; }

body.swagger-dark .swagger-ui .dialog-ux .modal-ux {
  background: #161c24;
  border-color: #2a323d;
}
body.swagger-dark .swagger-ui .dialog-ux .modal-ux-header h3,
body.swagger-dark .swagger-ui .dialog-ux .modal-ux-content h4,
body.swagger-dark .swagger-ui .dialog-ux .modal-ux-content p {
  color: #e6e8eb;
}

body.swagger-dark .swagger-ui svg:not(:root) { fill: #c7ccd1; }
body.swagger-dark .swagger-ui .info a,
body.swagger-dark .swagger-ui .opblock-summary-path a { color: #6cb6ff; }

/* Bouton flottant lampe */
#swagger-theme-toggle {
  position: fixed;
  top: 14px;
  right: 18px;
  z-index: 10000;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: 1px solid rgba(127, 127, 127, 0.35);
  background: #ffffff;
  color: #1b1b1b;
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transition: transform 0.15s ease, background 0.2s ease;
}
#swagger-theme-toggle:hover { transform: scale(1.08); }
body.swagger-dark #swagger-theme-toggle {
  background: #1b222b;
  color: #ffd24d;
  border-color: rgba(255, 255, 255, 0.2);
}
`;
exports.swaggerDarkModeJs = `
(function () {
  var STORAGE_KEY = 'swagger-theme';

  function prefersDark() {
    return window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  function applyTheme(theme) {
    var dark = theme === 'dark';
    document.body.classList.toggle('swagger-dark', dark);
    var btn = document.getElementById('swagger-theme-toggle');
    if (btn) {
      btn.textContent = dark ? '\\uD83D\\uDCA1' : '\\uD83C\\uDF11';
      btn.title = dark ? 'Passer en mode clair' : 'Passer en mode sombre';
      btn.setAttribute('aria-label', btn.title);
    }
  }

  function currentTheme() {
    var stored = null;
    try { stored = localStorage.getItem(STORAGE_KEY); } catch (e) {}
    if (stored === 'dark' || stored === 'light') return stored;
    return prefersDark() ? 'dark' : 'light';
  }

  function init() {
    var btn = document.getElementById('swagger-theme-toggle');
    if (!btn) {
      btn = document.createElement('button');
      btn.id = 'swagger-theme-toggle';
      btn.type = 'button';
      document.body.appendChild(btn);
      btn.addEventListener('click', function () {
        var next = document.body.classList.contains('swagger-dark')
          ? 'light'
          : 'dark';
        try { localStorage.setItem(STORAGE_KEY, next); } catch (e) {}
        applyTheme(next);
      });
    }
    applyTheme(currentTheme());
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
`;
//# sourceMappingURL=swagger-dark-mode.js.map