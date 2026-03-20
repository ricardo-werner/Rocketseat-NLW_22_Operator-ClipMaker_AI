// 1. CONFIGURAÇÃO GLOBAL
const config = {
  cloudName: 'di1ndqzsc',
  uploadPreset: 'upload_nlw22',
};

const IS_DEV_MODE = true; // MANTENHA TRUE para não gastar cota

// 2. DADOS SIMULADOS (MOCK)
const MOCK_DATA = {
  cut: 'so_21.3,eo_60.2',
  subtitles: [
    {
      start: 0.0,
      end: 2.2,
      text: 'Pilotos apontaram que várias disputas',
    },
    {
      start: 2.2,
      end: 5.0,
      text: 'definidas pelo nível de bateria',
    },
    {
      start: 5.0,
      end: 6.8,
      text: 'disponível em cada carro.',
    },
    {
      start: 6.8,
      end: 8.8,
      text: 'Max Verstappen da Red Bull e',
    },
    {
      start: 8.8,
      end: 10.4,
      text: 'Charles Leclerc da Ferrari',
    },
  ],
};

// 3. SELEÇÃO DE ELEMENTOS DO DOM
const items = {
  apiKey: document.getElementById('apiKey'),
  button: document.getElementById('uploadWidget'),
  status: document.getElementById('status'),
  video: document.getElementById('video'),
  subtitleDisplay: document.getElementById(
    'subtitleDisplay'
  ),
  btnSalvar: document.getElementById('btn-save-cut'),
  btnDescartar: document.getElementById('btn-discard-cut'),
};

// 4. MOTOR DO APP (LÓGICA)
const app = {
  public_id: 'video_mock_123',
  customCaptions: [],

  async processVideo() {
    // Simulação de tempo de espera para testar seus status de UX
    items.status.textContent =
      '⏳ [MOCK] Aguardando transcrição...';
    await new Promise((r) => setTimeout(r, 1500));

    items.status.textContent =
      '🤖 [MOCK] IA analisando engajamento...';
    await new Promise((r) => setTimeout(r, 1500));

    this.customCaptions = MOCK_DATA.subtitles;
    return MOCK_DATA.cut;
  },

  initSubtitleSync() {
    items.video.ontimeupdate = () => {
      const currentTime = items.video.currentTime;
      const active = this.customCaptions.find(
        (cap) =>
          currentTime >= cap.start && currentTime <= cap.end
      );

      if (!items.subtitleDisplay) return;

      if (
        items.subtitleDisplay.textContent !==
        (active ? active.text : '')
      ) {
        items.subtitleDisplay.textContent = active
          ? active.text
          : '';
      }
    };
  },

  resetPlayer() {
    if (items.video) {
      items.video.pause();
      items.video.src = '';
      items.video.load();
    }

    if (items.subtitleDisplay) {
      items.subtitleDisplay.textContent = '';
    }
    this.customCaptions = [];

    items.button.disabled = false;
    items.button.style.opacity = '1';
    items.status.textContent =
      'Clipe descartado. Player pronto para novo teste.';
  },
};

// Exposição global para integração com testeGaleria.js
window.config = config;
window.IS_DEV_MODE = IS_DEV_MODE;
window.items = items;
window.app = app;

// 5. EVENTO DO BOTÃO UPLOAD (SUBSTITUI O WIDGET REAL)
if (items.button) {
  items.button.addEventListener('click', async () => {
    // Validação visual de A11Y
    if (!items.apiKey.value) {
      alert(
        'Por favor, insira qualquer texto na chave (Modo Mock).'
      );
      items.apiKey.focus();
      return;
    }

    // Estética do botão durante o processamento
    items.button.disabled = true;
    items.button.style.opacity = '0.5';

    const viralMoment = await app.processVideo();

    if (viralMoment) {
      // Usamos um vídeo público para o player não ficar vazio
      const videoURL =
        'https://res.cloudinary.com/demo/video/upload/dog.mp4';

      items.status.textContent =
        '✅ Sucesso! Renderizando clipe...';
      items.video.src = videoURL;
      items.video.load();
      app.initSubtitleSync();

      setTimeout(() => {
        items.status.textContent =
          'Pronto para novo teste.';
        items.button.disabled = false;
        items.button.style.opacity = '1';
      }, 3000);
    }
  });
}

// 6. EVENTO DO BOTÃO DESCARTAR
if (items.btnDescartar) {
  items.btnDescartar.addEventListener('click', () => {
    if (window.galeriaApp?.descartarVideo) {
      window.galeriaApp.descartarVideo();
      return;
    }

    app.resetPlayer();
  });
}
