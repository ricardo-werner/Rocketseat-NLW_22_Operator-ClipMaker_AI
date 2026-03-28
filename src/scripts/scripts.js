const ACCESSIBILITY_STORAGE_KEYS = {
  theme: 'clipmaker.theme',
  dyslexia: 'clipmaker.dyslexia',
  vision: 'clipmaker.vision',
};

const VISION_LEVELS = ['100', '110', '125'];

function applyTheme(isLightTheme) {
  document.documentElement.classList.toggle(
    'light-theme',
    isLightTheme
  );

  const themeToggle =
    document.getElementById('theme-toggle');
  const themeIcon =
    themeToggle?.querySelector('.icon') || null;
  const themeLabel = document.getElementById(
    'theme-toggle-label'
  );

  if (themeToggle) {
    themeToggle.setAttribute(
      'aria-pressed',
      String(isLightTheme)
    );
    themeToggle.setAttribute(
      'aria-label',
      isLightTheme
        ? 'Tema claro ativado. Clique para mudar para o tema escuro'
        : 'Tema escuro ativado. Clique para mudar para o tema claro'
    );
  }

  if (themeIcon) {
    themeIcon.setAttribute(
      'data-lucide',
      isLightTheme ? 'sun' : 'moon'
    );
  }

  if (themeLabel) {
    themeLabel.textContent = isLightTheme
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

  const dislexiaToggle = document.getElementById(
    'dislexia-toggle'
  );
  const dislexiaLabel = document.getElementById(
    'dislexia-toggle-label'
  );

  if (dislexiaToggle) {
    dislexiaToggle.setAttribute(
      'aria-pressed',
      String(isEnabled)
    );
    dislexiaToggle.setAttribute(
      'aria-label',
      isEnabled
        ? 'Dislexia ativada. Clique para desativar o modo de leitura para dislexia'
        : 'Dislexia desativada. Clique para ativar o modo de leitura para dislexia'
    );
  }

  if (dislexiaLabel) {
    dislexiaLabel.textContent = isEnabled
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

  const visionToggle =
    document.getElementById('vision-toggle');
  const visionLabel = document.getElementById(
    'vision-toggle-label'
  );

  if (visionToggle) {
    const isEnhanced = level !== '100';
    visionToggle.setAttribute(
      'aria-pressed',
      String(isEnhanced)
    );
    visionToggle.setAttribute(
      'aria-label',
      `Escala de fonte atual ${level}%. Clique para alternar para o próximo nível`
    );
  }

  if (visionLabel) {
    visionLabel.textContent = `Fonte: ${level}%`;
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
  const themeToggle =
    document.getElementById('theme-toggle');
  const dislexiaToggle = document.getElementById(
    'dislexia-toggle'
  );
  const visionToggle =
    document.getElementById('vision-toggle');

  if (themeToggle) {
    const savedTheme =
      localStorage.getItem(
        ACCESSIBILITY_STORAGE_KEYS.theme
      ) || localStorage.getItem('theme');
    const isLightTheme = savedTheme === 'light';

    applyTheme(isLightTheme);
    localStorage.setItem(
      ACCESSIBILITY_STORAGE_KEYS.theme,
      isLightTheme ? 'light' : 'dark'
    );

    themeToggle.addEventListener('click', () => {
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

  if (dislexiaToggle) {
    const isDyslexiaEnabled =
      localStorage.getItem(
        ACCESSIBILITY_STORAGE_KEYS.dyslexia
      ) === 'true';

    applyDyslexiaMode(isDyslexiaEnabled);

    dislexiaToggle.addEventListener('click', () => {
      const isEnabled =
        !document.body.classList.contains('dyslexia-mode');

      applyDyslexiaMode(isEnabled);
      localStorage.setItem(
        ACCESSIBILITY_STORAGE_KEYS.dyslexia,
        String(isEnabled)
      );
    });
  }

  if (visionToggle) {
    let currentLevel = getSavedVisionLevel();
    applyVisionLevel(currentLevel);

    visionToggle.addEventListener('click', () => {
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
}

document.addEventListener(
  'DOMContentLoaded',
  initializeAccessibilityToggles
);

// Botão Flutuante
const backBtn = document.getElementById('back-to-top');
if (backBtn) {
  window.onscroll = () => {
    if (window.scrollY > 300)
      backBtn.classList.add('visible');
    else backBtn.classList.remove('visible');
  };

  backBtn.onclick = () =>
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// CRUD: Simulação de Deleção
const listaCortes =
  document.getElementById('lista-cortes') ||
  document.getElementById('lista-salvos') ||
  document.getElementById('meus-cortes-container');

if (listaCortes) {
  listaCortes.addEventListener('click', (e) => {
    const btnDelete = e.target.closest('.delete');
    if (btnDelete) {
      const card = btnDelete.closest('.cut-card');
      if (!card) return;

      card.style.opacity = '0';
      setTimeout(() => card.remove(), 500);
    }
  });
}
