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
  focoCardIndex: 0,
  acaoSelecionadaPorCard: new Map(),

  obterContainerGrid: function () {
    return document.getElementById('lista-salvos');
  },

  obterCardsNavegaveis: function () {
    const container = this.obterContainerGrid();
    if (!container) return [];

    return Array.from(
      container.querySelectorAll('.cut-card')
    );
  },

  obterAcoesDisponiveisDoCard: function (card) {
    if (!card) return [];

    return Array.from(
      card.querySelectorAll('.btn-card[data-action]')
    ).filter((botao) => !botao.disabled);
  },

  aplicarSelecaoAcaoNoCard: function (card, index = 0) {
    if (!card) return;

    const botoesDisponiveis =
      this.obterAcoesDisponiveisDoCard(card);
    const cardId = card.dataset.cardId || card.id;

    Array.from(
      card.querySelectorAll('.btn-card[data-action]')
    ).forEach((botao) => {
      botao.classList.remove('is-key-selected');
    });

    if (!botoesDisponiveis.length) {
      card.dataset.selectedActionIndex = '0';
      return;
    }

    const indexNormalizado = Math.min(
      Math.max(index, 0),
      botoesDisponiveis.length - 1
    );

    const botaoSelecionado =
      botoesDisponiveis[indexNormalizado];
    botaoSelecionado.classList.add('is-key-selected');

    card.dataset.selectedActionIndex = String(
      indexNormalizado
    );

    if (cardId) {
      this.acaoSelecionadaPorCard.set(
        cardId,
        indexNormalizado
      );
    }
  },

  atualizarRovingTabIndex: function (preferCardId = null) {
    const cards = this.obterCardsNavegaveis();

    if (!cards.length) {
      this.focoCardIndex = 0;
      return;
    }

    let indiceAtivo = this.focoCardIndex;

    if (preferCardId) {
      const indicePreferido = cards.findIndex(
        (card) =>
          String(card.dataset.cardId || card.id) ===
          String(preferCardId)
      );

      if (indicePreferido >= 0) {
        indiceAtivo = indicePreferido;
      }
    }

    indiceAtivo = Math.max(
      0,
      Math.min(indiceAtivo, cards.length - 1)
    );

    cards.forEach((card, index) => {
      card.tabIndex = index === indiceAtivo ? 0 : -1;

      const cardId = card.dataset.cardId || card.id;
      const indiceSalvo = cardId
        ? this.acaoSelecionadaPorCard.get(cardId)
        : 0;

      this.aplicarSelecaoAcaoNoCard(
        card,
        Number.isInteger(indiceSalvo) ? indiceSalvo : 0
      );
    });

    this.focoCardIndex = indiceAtivo;
  },

  focarCardPorIndice: function (indice) {
    const cards = this.obterCardsNavegaveis();
    if (!cards.length) return;

    const indiceNormalizado = Math.max(
      0,
      Math.min(indice, cards.length - 1)
    );

    cards.forEach((card, index) => {
      card.tabIndex = index === indiceNormalizado ? 0 : -1;
    });

    this.focoCardIndex = indiceNormalizado;
    cards[indiceNormalizado].focus();
  },

  focarCardPorId: function (cardId) {
    if (!cardId) return false;

    const cards = this.obterCardsNavegaveis();
    const indice = cards.findIndex(
      (card) =>
        String(card.dataset.cardId || card.id) ===
        String(cardId)
    );

    if (indice < 0) return false;

    this.focarCardPorIndice(indice);
    return true;
  },

  moverSelecaoAcaoNoCard: function (card, direcao) {
    const botoesDisponiveis =
      this.obterAcoesDisponiveisDoCard(card);
    if (!botoesDisponiveis.length) return;

    const total = botoesDisponiveis.length;
    const atual = Number(
      card.dataset.selectedActionIndex || '0'
    );
    const proximo = (atual + direcao + total) % total;

    this.aplicarSelecaoAcaoNoCard(card, proximo);
  },

  ativarAcaoSelecionadaDoCard: function (card) {
    const botoesDisponiveis =
      this.obterAcoesDisponiveisDoCard(card);

    if (!botoesDisponiveis.length) return;

    const indiceSelecionado = Number(
      card.dataset.selectedActionIndex || '0'
    );

    const botaoSelecionado =
      botoesDisponiveis[
        Math.max(
          0,
          Math.min(
            indiceSelecionado,
            botoesDisponiveis.length - 1
          )
        )
      ];

    botaoSelecionado?.click();
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
    this.focarCardPorId(novoCorte.id);

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

    container.setAttribute('role', 'list');
    container.setAttribute(
      'aria-label',
      'Lista de cortes salvos. Use TAB para navegar entre os cards e setas para escolher ações no card atual.'
    );

    if (!lista || lista.length === 0) {
      container.innerHTML =
        '<p class="empty-msg">Nenhum corte salvo ainda.</p>';
      this.focoCardIndex = 0;
      return;
    }

    container.innerHTML = lista
      .map((video, index) => {
        const statusAtual =
          video.status === 'disabled'
            ? 'disabled'
            : 'enabled';

        const cardId = String(video.id || index);
        const titulo = video.titulo || 'Corte sem título';
        const data = video.data || '18/03/2026';
        const statusDescricao =
          statusAtual === 'enabled'
            ? 'ativo'
            : 'desativado';

        return `
            <div
              class="cut-card ${statusAtual === 'disabled' ? 'disabled-card' : ''}"
              id="${cardId}"
              data-card-id="${cardId}"
              data-card-index="${index}"
              role="listitem"
              tabindex="-1"
              aria-label="Corte ${titulo}. Data ${data}. Status ${statusDescricao}."
            >
                <div class="card-header">
                    <span class="clapper-icon">🎬</span> 
                    <div class="card-info">
                        <strong >${titulo}</strong>
                        <small>${data}</small>
                    </div>
                </div>
            <div class="card-actions">
              <button class="btn-card ${statusAtual === 'disabled' ? 'is-disabled' : ''}" data-action="assistir" data-id="${cardId}" tabindex="-1" ${statusAtual === 'disabled' ? 'disabled' : ''}>
                        ▶️ Assistir
                    </button>
              <button class="btn-card btn-delete" data-action="alternar-status" data-id="${cardId}" tabindex="-1">
                        ${statusAtual === 'enabled' ? '🗑️ Deletar' : '🔄 Restaurar'}
                    </button>
                </div>
            </div>
        `;
      })
      .join('');

    this.atualizarRovingTabIndex(this.videoAtualId);
  },

  descartarVideo: function () {
    if (confirm('Deseja descartar as alterações atuais?')) {
      if (this.videoAtualId) {
        this.alternarStatus(this.videoAtualId, {
          skipConfirm: true,
        });
        return;
      }

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

  alternarStatus: async function (id, options = {}) {
    const { skipConfirm = false } = options;

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

      if (statusAtual === 'enabled' && !skipConfirm) {
        const confirmou = confirm(
          'Deseja deletar (desativar) este vídeo da galeria?'
        );

        if (!confirmou) return;
      }

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
    this.focarCardPorId(id);
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

      const card = botao.closest('.cut-card');
      if (card) {
        const botoesDisponiveis =
          this.obterAcoesDisponiveisDoCard(card);
        const indiceAcao = botoesDisponiveis.indexOf(botao);

        if (indiceAcao >= 0) {
          this.aplicarSelecaoAcaoNoCard(card, indiceAcao);
        }
      }

      if (action === 'assistir') {
        this.reproduzirDaGaleria(id);
        return;
      }

      if (action === 'alternar-status') {
        this.alternarStatus(id);
      }
    });
  },

  registrarEventosTecladoDoGrid: function () {
    const container = this.obterContainerGrid();
    if (!container) return;

    container.addEventListener('focusin', (event) => {
      const card = event.target.closest('.cut-card');
      if (!card) return;

      const cards = this.obterCardsNavegaveis();
      const indice = cards.indexOf(card);

      if (indice >= 0) {
        this.focoCardIndex = indice;
        cards.forEach((item, itemIndex) => {
          item.tabIndex = itemIndex === indice ? 0 : -1;
        });
      }
    });

    container.addEventListener('keydown', (event) => {
      const card = event.target.closest('.cut-card');
      if (!card) return;

      const cards = this.obterCardsNavegaveis();
      const indiceAtual = cards.indexOf(card);

      if (indiceAtual < 0) return;

      if (event.key === 'ArrowRight') {
        event.preventDefault();
        this.moverSelecaoAcaoNoCard(card, 1);
        return;
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        this.moverSelecaoAcaoNoCard(card, -1);
        return;
      }

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        this.focarCardPorIndice(indiceAtual + 1);
        return;
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault();
        this.focarCardPorIndice(indiceAtual - 1);
        return;
      }

      if (event.key === 'Home') {
        event.preventDefault();
        this.focarCardPorIndice(0);
        return;
      }

      if (event.key === 'End') {
        event.preventDefault();
        this.focarCardPorIndice(cards.length - 1);
        return;
      }

      if (
        event.key === 'Enter' ||
        event.key === ' ' ||
        event.code === 'Space'
      ) {
        event.preventDefault();
        this.ativarAcaoSelecionadaDoCard(card);
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
  galeriaApp.registrarEventosTecladoDoGrid();
  const listaInicial =
    await galeriaApp.carregarTodaGaleria();
  galeriaApp.renderizarNoGrid(listaInicial);
});

window.galeriaApp = galeriaApp;
