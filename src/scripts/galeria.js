const galleryItems = window.items;
const galleryCoreApp = window.app;

if (!galleryItems || !galleryCoreApp) {
  console.error(
    'Dependências globais não encontradas: verifique se main.js foi carregado antes de testeGaleria.js.'
  );
}

const galeriaApp = {
  todosOsCortes: [],
  videoAtualId: null,

  obterContainerGrid: function () {
    return document.getElementById('lista-salvos');
  },

  // Gera uma assinatura única para evitar duplicados por conteúdo
  gerarChaveVideo: function (video) {
    const legendas = Array.isArray(video?.legendas)
      ? video.legendas
      : [];
    return [
      video?.urlVideo || '',
      video?.titulo || '',
      JSON.stringify(legendas),
    ].join('|');
  },

  // Remove duplicados da lista
  deduplicarLista: function (lista) {
    const ids = new Set();
    const assinaturas = new Set();
    return (Array.isArray(lista) ? lista : []).filter(
      (video) => {
        if (!video || typeof video !== 'object')
          return false;
        if (video.id) {
          if (ids.has(video.id)) return false;
          ids.add(video.id);
          return true;
        }
        const chave = this.gerarChaveVideo(video);
        if (assinaturas.has(chave)) return false;
        assinaturas.add(chave);
        return true;
      }
    );
  },

  // --- FUNÇÃO DE CONTROLE DO BOTÃO (ID: btn-save-cut) ---
  configurarBotaoSalvar: function (ativo) {
    const btn = document.getElementById('btn-save-cut');

    if (btn) {
      btn.disabled = !ativo;
      btn.style.opacity = ativo ? '1' : '0.5';
      btn.style.cursor = ativo ? 'pointer' : 'not-allowed';
      btn.style.pointerEvents = ativo ? 'auto' : 'none';

      // Feedback visual: remove o brilho se estiver desativado
      btn.style.filter = ativo ? 'none' : 'grayscale(1)';
    }
  },

  salvarVideo: async function () {
    const videoSrcAtual = galleryItems.video.src;

    if (!videoSrcAtual || videoSrcAtual.includes('blob')) {
      alert(
        'Aguarde o processamento do vídeo antes de salvar.'
      );
      return;
    }

    const novoCorte = {
      id: crypto.randomUUID(),
      titulo: `Corte #${Math.floor(Math.random() * 9000) + 1000}`,
      urlVideo: videoSrcAtual,
      legendas: galleryCoreApp.customCaptions,
      status: 'enabled',
      data: new Date().toLocaleDateString('pt-BR'),
    };

    const galeriaLocal = JSON.parse(
      localStorage.getItem('clipmaker_galeria') || '[]'
    );
    galeriaLocal.push(novoCorte);
    localStorage.setItem(
      'clipmaker_galeria',
      JSON.stringify(galeriaLocal)
    );

    // Recarrega as duas fontes e renderiza
    const listaAtualizada =
      await this.carregarTodaGaleria();
    this.renderizarNoGrid(listaAtualizada);

    this.videoAtualId = novoCorte.id;

    // Bloqueia o botão logo após salvar com sucesso
    this.configurarBotaoSalvar(false);
    galleryItems.status.textContent = `✅ Vídeo salvo na galeria! ID: ${novoCorte.id}`;
  },

  carregarTodaGaleria: async function () {
    let fixos = [];
    try {
      const response = await fetch(
        './src/galeria/galeria.json'
      );
      if (response.ok) fixos = await response.json();
    } catch (e) {
      console.warn(
        'Nota: galeria.json fixo não encontrado. Usando LocalStorage.'
      );
    }

    const temporarios = this.deduplicarLista(
      JSON.parse(
        localStorage.getItem('clipmaker_galeria') || '[]'
      )
    );

    // Une as duas fontes na memória do objeto
    this.todosOsCortes = this.deduplicarLista([
      ...fixos,
      ...temporarios,
    ]);
    return this.todosOsCortes;
  },

  renderizarNoGrid: function (lista) {
    const container = this.obterContainerGrid();
    if (!container) return;

    if (!lista || lista.length === 0) {
      container.innerHTML =
        '<p class="empty-msg">Nenhum corte salvo ainda.</p>';
      return;
    }

    container.innerHTML = lista
      .map((video) => {
        const statusAtual =
          video.status === 'disabled'
            ? 'disabled'
            : 'enabled';

        return `
            <div class="cut-card ${statusAtual === 'disabled' ? 'disabled-card' : ''}" id="${video.id}">
                <div class="card-header">
                    <span class="clapper-icon">🎬</span> 
                    <div class="card-info">
                        <strong >${video.titulo}</strong>
                        <small>${video.data || '18/03/2026'}</small>
                    </div>
                </div>
            <div class="card-actions">
              <button class="btn-card ${statusAtual === 'disabled' ? 'is-disabled' : ''}" data-action="assistir" data-id="${video.id}" ${statusAtual === 'disabled' ? 'disabled' : ''}>
                        ▶️ Assistir
                    </button>
              <button class="btn-card btn-delete" data-action="alternar-status" data-id="${video.id}">
                        ${statusAtual === 'enabled' ? '🗑️ Deletar' : '🔄 Restaurar'}
                    </button>
                </div>
            </div>
        `;
      })
      .join('');
  },

  descartarVideo: function () {
    if (confirm('Deseja descartar as alterações atuais?')) {
      if (galleryCoreApp?.resetPlayer) {
        galleryCoreApp.resetPlayer();
      } else {
        galleryItems.video.src = '';
        galleryCoreApp.customCaptions = [];
        if (galleryItems.subtitleDisplay) {
          galleryItems.subtitleDisplay.textContent = '';
        }
        galleryItems.status.textContent =
          '🗑️ Conteúdo descartado.';
      }

      // Libera o botão salvar para um novo upload
      this.configurarBotaoSalvar(true);
      this.videoAtualId = null;
    }
  },

  alternarStatus: async function (id) {
    let galeria = JSON.parse(
      localStorage.getItem('clipmaker_galeria') || '[]'
    );
    const index = galeria.findIndex(
      (v) => String(v.id) === String(id)
    );

    if (index !== -1) {
      const statusAtual =
        galeria[index].status === 'disabled'
          ? 'disabled'
          : 'enabled';

      galeria[index].status =
        statusAtual === 'enabled' ? 'disabled' : 'enabled';
      localStorage.setItem(
        'clipmaker_galeria',
        JSON.stringify(galeria)
      );

      const novoStatus = galeria[index].status;
      if (
        novoStatus === 'disabled' &&
        String(this.videoAtualId) === String(id)
      ) {
        if (galleryCoreApp?.resetPlayer) {
          galleryCoreApp.resetPlayer();
        }
        this.videoAtualId = null;
        this.configurarBotaoSalvar(true);
        galleryItems.status.textContent =
          '🗑️ O vídeo em reprodução foi desativado na galeria.';
      } else if (novoStatus === 'enabled') {
        const mensagemDesativado =
          '🗑️ O vídeo em reprodução foi desativado na galeria.';

        if (
          galleryItems.status?.textContent ===
          mensagemDesativado
        ) {
          galleryItems.status.textContent =
            '✅ Vídeo restaurado na galeria.';
        }
      }
    } else {
      alert(
        'Vídeos fixos (JSON) não podem ser alterados localmente.'
      );
    }

    const lista = await this.carregarTodaGaleria();
    this.renderizarNoGrid(lista);
  },

  reproduzirDaGaleria: function (id) {
    const video = this.todosOsCortes.find(
      (v) => String(v.id) === String(id)
    );

    if (video && video.status !== 'disabled') {
      // ESSENCIAL: Bloqueia o botão salvar porque o vídeo já está na galeria
      this.configurarBotaoSalvar(false);
      this.videoAtualId = id;

      galleryItems.video.src = video.urlVideo;
      galleryCoreApp.customCaptions = Array.isArray(
        video.legendas
      )
        ? video.legendas
        : [];

      galleryItems.video.load();
      galleryCoreApp.initSubtitleSync();

      window.scrollTo({ top: 0, behavior: 'smooth' });
      galleryItems.status.textContent = `▶️ Reproduzindo: ${video.titulo}`;
    } else {
      alert('Este vídeo está desativado.');
    }
  },

  registrarEventosDoGrid: function () {
    const container = this.obterContainerGrid();
    if (!container) return;

    container.addEventListener('click', (event) => {
      const botao = event.target.closest(
        'button[data-action]'
      );
      if (!botao) return;

      const { action, id } = botao.dataset;
      if (!id) return;

      if (action === 'assistir') {
        this.reproduzirDaGaleria(id);
        return;
      }

      if (action === 'alternar-status') {
        this.alternarStatus(id);
      }
    });
  },
};

// Inicialização ao carregar a página
document.addEventListener('DOMContentLoaded', async () => {
  const btnSalvar = document.getElementById('btn-save-cut');
  if (btnSalvar) {
    btnSalvar.addEventListener('click', () => {
      galeriaApp.salvarVideo();
    });
  }

  galeriaApp.registrarEventosDoGrid();
  const listaInicial =
    await galeriaApp.carregarTodaGaleria();
  galeriaApp.renderizarNoGrid(listaInicial);
});

window.galeriaApp = galeriaApp;
