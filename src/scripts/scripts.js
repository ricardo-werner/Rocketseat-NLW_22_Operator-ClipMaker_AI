const ACCESSIBILITY_STORAGE_KEYS = {
  theme: 'clipmaker.theme',
  dyslexia: 'clipmaker.dyslexia',
  vision: 'clipmaker.vision',
};

const VISION_LEVELS = ['100', '110', '125'];

const LOGO_PATHS = {
  light: './src/images/Clipmaker_logo_light.png',
  dark: './src/images/Clipmaker_logo_night.png',
  fallback: {
    light: './src/images/Clipmaker_logo_light.svg',
    dark: './src/images/Clipmaker_logo_night.svg',
  },
};

// 2. CACHING DE DOM (Buscamos os elementos apenas uma vez e reutilizamos as referências)
const DOM = {
  appLogo: document.getElementById('app-logo'),
  themeToggle: document.getElementById('theme-toggle'),
  themeIcon:
    document
      .getElementById('theme-toggle')
      ?.querySelector('.icon') || null,
  themeLabel: document.getElementById('theme-toggle-label'),
  dislexiaToggle: document.getElementById(
    'dislexia-toggle'
  ),
  dislexiaLabel: document.getElementById(
    'dislexia-toggle-label'
  ),
  visionToggle: document.getElementById('vision-toggle'),
  visionLabel: document.getElementById(
    'vision-toggle-label'
  ),
  backBtn: document.getElementById('back-to-top'),
  listaCortes:
    document.getElementById('lista-cortes') ||
    document.getElementById('lista-salvos') ||
    document.getElementById('meus-cortes-container'),
};

// FUNÇÕES MAIS LIMPAS (Focadas apenas em aplicar a lógica)

function applyTheme(isLightTheme) {
  document.documentElement.classList.toggle(
    'light-theme',
    isLightTheme
  );

  if (DOM.appLogo) {
    DOM.appLogo.onerror = () => {
      DOM.appLogo.onerror = null;
      DOM.appLogo.setAttribute(
        'src',
        isLightTheme
          ? LOGO_PATHS.fallback.light
          : LOGO_PATHS.fallback.dark
      );
    };

    DOM.appLogo.setAttribute(
      'src',
      isLightTheme ? LOGO_PATHS.light : LOGO_PATHS.dark
    );
  }

  if (DOM.themeToggle) {
    DOM.themeToggle.setAttribute(
      'aria-pressed',
      String(isLightTheme)
    );
    DOM.themeToggle.setAttribute(
      'aria-label',
      isLightTheme
        ? 'Tema claro ativado. Clique para mudar para o tema escuro'
        : 'Tema escuro ativado. Clique para mudar para o tema claro'
    );
  }

  //Simplificando a busca do ícone para evitar múltiplas buscas

  if (DOM.themeIcon) {
    DOM.themeIcon.setAttribute(
      'data-lucide',
      isLightTheme ? 'sun' : 'moon'
    );
  }

  if (DOM.themeLabel) {
    DOM.themeLabel.textContent = isLightTheme
      ? 'Tema: Claro'
      : 'Tema: Escuro';
  }

  if (window.lucide?.createIcons) {
    window.lucide.createIcons();
  }
}

function applyDyslexiaMode(isEnabled) {
  document.body.classList.toggle(
    'dyslexia-mode',
    isEnabled
  );

  if (DOM.dislexiaToggle) {
    DOM.dislexiaToggle.setAttribute(
      'aria-pressed',
      String(isEnabled)
    );
    DOM.dislexiaToggle.setAttribute(
      'aria-label',
      isEnabled
        ? 'Dislexia ativada. Clique para desativar o modo de leitura para dislexia'
        : 'Dislexia desativada. Clique para ativar o modo de leitura para dislexia'
    );
  }

  if (DOM.dislexiaLabel) {
    DOM.dislexiaLabel.textContent = isEnabled
      ? 'Dislexia: ON'
      : 'Dislexia: OFF';
  }
}

function applyVisionLevel(level) {
  VISION_LEVELS.forEach((visionLevel) => {
    document.body.classList.remove(
      `enhanced-vision-${visionLevel}`
    );
  });

  if (level !== '100') {
    document.body.classList.add(`enhanced-vision-${level}`);
  }

  if (DOM.visionToggle) {
    const isEnhanced = level !== '100';
    DOM.visionToggle.setAttribute(
      'aria-pressed',
      String(isEnhanced)
    );
    DOM.visionToggle.setAttribute(
      'aria-label',
      `Escala de fonte atual ${level}%. Clique para alternar para o próximo nível`
    );
  }

  if (DOM.visionLabel) {
    DOM.visionLabel.textContent = `Fonte: ${level}%`;
  }
}

function getSavedVisionLevel() {
  const savedLevel = localStorage.getItem(
    ACCESSIBILITY_STORAGE_KEYS.vision
  );

  if (!savedLevel || !VISION_LEVELS.includes(savedLevel)) {
    return '100';
  }

  return savedLevel;
}

function initializeAccessibilityToggles() {
  //Inicialização do Tema(Limpa, com apenas uma chave no LocalStorage)
  if (DOM.themeToggle) {
    const savedTheme = localStorage.getItem(
      ACCESSIBILITY_STORAGE_KEYS.theme
    );
    //Definindo o tema claro como padrão caso a chave não exista ou seja inválida
    const isLightTheme = savedTheme !== 'dark';

    applyTheme(isLightTheme);

    DOM.themeToggle.addEventListener('click', () => {
      const isLightThemeEnabled =
        !document.documentElement.classList.contains(
          'light-theme'
        );

      applyTheme(isLightThemeEnabled);
      localStorage.setItem(
        ACCESSIBILITY_STORAGE_KEYS.theme,
        isLightThemeEnabled ? 'light' : 'dark'
      );
      localStorage.setItem(
        'theme',
        isLightThemeEnabled ? 'light' : 'dark'
      );
    });
  }

  if (DOM.dislexiaToggle) {
    const isDyslexiaEnabled =
      localStorage.getItem(
        ACCESSIBILITY_STORAGE_KEYS.dyslexia
      ) === 'true';

    applyDyslexiaMode(isDyslexiaEnabled);

    DOM.dislexiaToggle.addEventListener('click', () => {
      const isEnabled =
        !document.body.classList.contains('dyslexia-mode');

      applyDyslexiaMode(isEnabled);
      localStorage.setItem(
        ACCESSIBILITY_STORAGE_KEYS.dyslexia,
        String(isEnabled)
      );
    });
  }

  if (DOM.visionToggle) {
    let currentLevel = getSavedVisionLevel();
    applyVisionLevel(currentLevel);

    DOM.visionToggle.addEventListener('click', () => {
      const currentIndex =
        VISION_LEVELS.indexOf(currentLevel);
      const nextLevel =
        VISION_LEVELS[
          (currentIndex + 1) % VISION_LEVELS.length
        ];

      currentLevel = nextLevel;
      applyVisionLevel(currentLevel);
      localStorage.setItem(
        ACCESSIBILITY_STORAGE_KEYS.vision,
        currentLevel
      );
    });
  }

  // Botão Flutuante de Voltar ao Topo
  if (DOM.backBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300)
        DOM.backBtn.classList.add('visible');
      else DOM.backBtn.classList.remove('visible');
    });

    DOM.backBtn.addEventListener('click', () =>
      window.scrollTo({ top: 0, behavior: 'smooth' })
    );
  }

  // CRUD: Simulação de Deleção

  if (DOM.listaCortes) {
    DOM.listaCortes.addEventListener('click', (e) => {
      const btnDelete = e.target.closest('.delete');
      if (btnDelete) {
        const card = btnDelete.closest('.cut-card');
        if (!card) return;

        card.style.opacity = '0';
        setTimeout(() => card.remove(), 500);
      }
    });
  }
}

document.addEventListener(
  'DOMContentLoaded',
  initializeAccessibilityToggles
);
