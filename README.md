# ClipMaker AI - Rocketseat NLW-22 (Operator)

Este projeto foi desenvolvido durante a trilha iniciante do evento **Rocketseat NLW-22 (2026)**. O desafio proposto foi criar uma aplicação de "Cortes de Vídeo" assistida por IA, capaz de analisar um vídeo, sugerir trechos com potencial viral e renderizar o corte diretamente na tela com legendas dinâmicas e acessíveis.

---

## 📜 Sobre o Projeto

O **ClipMaker AI** automatiza o processo de "trimming" (corte) e legendagem. A aplicação utiliza Inteligência Artificial para identificar o momento de maior impacto em um vídeo, promovendo não apenas o engajamento, mas também a inclusão digital através de legendas automáticas e acessíveis.

### 🧠 Fluxo de Funcionamento:

1. **Upload**: Processamento de vídeo via Cloudinary.
2. **Transcrição**: Geração de texto assistida por IA.
3. **Análise IA**: O modelo **Gemini 2.5 Flash** define o trecho estratégico para o corte.
4. **Persistência Híbrida**: Galeria que une dados estáticos (`galeria.json`) e dinâmicos (`localStorage`).

---

### 🚀 Melhorias e Correções Recentes (Fluxo de Galeria)

Refatoração profunda na lógica de persistência e interface para garantir um comportamento consistente:

- **Controle de Estado do Botão**: O botão `Salvar na Galeria` (ID: `btn-save-cut`) é desativado automaticamente ao salvar ou reproduzir itens existentes.
- **Gestão de Vídeos Desativados**: O player é resetado ao deletar um vídeo em reprodução, e cards `disabled` bloqueiam a função "Assistir".
- **Deduplicação de Dados**: Motor que impede salvamentos duplicados comparando URLs e assinaturas de conteúdo.

### ✅ Entrega Atual (Reescrita Consolidada do Header/Topbar — CSS Moderno + A11Y) — 2026-03-29

Correção estrutural completa do Header para eliminar regressões visuais e tornar o topo da interface mais compacto, responsivo e consistente entre tema claro/escuro:

- **Geometria Limpa com Flexbox**: `header-content` consolidado com `display: flex`, `justify-content: space-between` e `align-items: center`, removendo excesso de altura vertical.
- **Header Compacto e Moderno**: redução de padding vertical e altura efetiva do topo para recuperar espaço útil em telas como `1366x768`.
- **Logo Responsivo sem Quebra de Layout**: imagem passa a respeitar limites do container (`height` relativa + `max-height` + `width: auto`), sem ditar a altura do Header.
- **Navegação Refinada (ul/li/a)**: remoção do visual rígido, aplicação de `border-radius` nos links e ajuste de `gap`, `padding` e tipografia para aparência mais leve e contemporânea.
- **Foco Duplo AAA no Tema Claro (Header)**: reforço explícito de `:focus-visible` com `outline: 3px solid #ff8700` e `box-shadow: 0 0 0 6px #0f172a` no escopo do Header, preservando acessibilidade por teclado.
- **Consistência Gulf/GT40**: manutenção da linguagem visual via tokens existentes do projeto para hover/active/focus nos dois temas.

### ✅ Entrega Atual (Ajuste de Layout Final — Header + Aside Fixo md→2XL) — 2026-03-29

Refino de estabilidade visual para manter a leitura da interface mais consistente durante a rolagem:

- **Header com Mais Respiro Visual**: aumento de padding interno e reforço de bordas arredondadas para reduzir aspecto “quebrado” no topo.
- **Aside Fixo no Intervalo `md -> 2XL`**: menu lateral passa a permanecer fixo durante toda a rolagem do conteúdo principal, sem deslocamento no final da página.
- **Compensação Estrutural da Main**: ajuste de layout para reservar a largura do aside fixo e evitar sobreposição do conteúdo principal nesse intervalo de breakpoints.
- **Calibração Fina por Breakpoint (`md`, `lg`, `xl`)**: offset vertical do aside ajustado por faixa de largura para casar visualmente com a altura do header e manter estabilidade durante toda a rolagem.

### ✅ Entrega Atual (Refino Visual no Tema Claro — Bordas + Foco + Micro-foco) — 2026-03-29

Ajuste estético e de acessibilidade aplicado para deixar o modo claro mais elegante e com estados de teclado inequivocamente visíveis:

- **Bordas Suaves nos Blocos Principais**: arredondamento consistente no `header`, área de vídeo e cards da galeria para reduzir a sensação de layout rígido.
- **Foco Duplo Estrito no Light Theme**: reforço global de `:focus-visible` com `outline` Papaya + anel externo escuro (`box-shadow`) para máxima percepção visual em navegação por teclado.
- **Proteção contra Conflito de Estilos de Foco**: regra no escopo de `html.light-theme` com prioridade para preservar acessibilidade mesmo diante de estilos locais concorrentes.
- **Micro-foco da Galeria com Alto Contraste**: `.is-key-selected` no tema claro passou a usar fundo Teal escuro, texto branco e contorno destacado, deixando explícito qual ação interna do card está ativa.
- **Consistência em Estado Desativado**: variação visual equivalente para cards desabilitados, mantendo legibilidade e previsibilidade durante navegação por setas.
- **Auditoria de Consistência Pós-Entrega**: removido resquício de borda exagerada em regra legada de card e reforçada a prioridade do micro-foco no modo claro para evitar perda visual por sobrescrita de CSS.

### ✅ Última Entrega (A11Y no Aside) — 2026-03-28

Implementação completa dos três toggles de acessibilidade do `aside`, com foco em feedback visível, leitura assistiva e persistência:

- **Tema Dia/Noite com Ícone Dinâmico**: alternância visual imediata e ícone coerente com o estado atual (☀️ claro / 🌙 escuro).
- **Dislexia com Estado Explícito**: label textual atualizado em tempo real para `Dislexia: ON/OFF`.
- **Baixa Visão com Níveis de Escala**: ciclo único `100% → 110% → 125% → 100%`, exibindo o nível no próprio botão (`Fonte: X%`).
- **Persistência das Preferências**: estados salvos em `localStorage` para manter a experiência após reload.
- **Aprimoramento A11Y**: uso de `aria-pressed` e atualização de `aria-label` para melhor interpretação por leitores de tela.

### ✅ Entrega Atual (Navegação por Teclado nos Cards) — 2026-03-28

Implementação da navegação híbrida na galeria para melhorar a experiência de teclado em listas de cortes:

- **Tab Card-a-Card**: o foco principal percorre os cards individualmente (em vez de passar por todos os botões internos de uma vez).
- **Setas para Ações Internas**: no card focado, `←/→` alternam entre ações disponíveis (`Reproduzir`, `Deletar` ou `Restaurar`).
- **Ativação por Teclado**: `Enter` e `Espaço` executam a ação interna selecionada.
- **Navegação Vertical da Lista**: `↑/↓`, `Home` e `End` movem o foco entre cards com previsibilidade.
- **Ignora Cards Deletados no Roving**: a navegação por setas/tabindex agora percorre apenas cards ativos, excluindo itens com status desativado (`.disabled-card`).
- **Fallback para Lista Vazia**: se não houver cards, o fluxo padrão de foco da página continua sem erros.
- **Feedback Visual de Teclado**: destaque explícito para card focado e ação selecionada por setas.

### ✅ Entrega Atual (Refino WCAG no Modo Dia) — 2026-03-28

Ajuste visual completo para o tema claro, preservando integralmente o tema escuro:

- **Paleta Clara Coerente e Moderna**: reestruturação dos tokens de cor do modo dia para superfícies, textos e bordas com contraste mais forte.
- **Contraste de Conteúdo**: melhoria de legibilidade em textos secundários, cards, ações da galeria e áreas de formulário.
- **Consistência em Componentes**: cards e áreas de ação da galeria agora seguem os tokens do tema claro em vez de cores fixas escuras.
- **Foco de Teclado em Papaya**: bordas de foco padronizadas na cor Papaya no fluxo de navegação por teclado (inclusive aside e cards).
- **Correções de Estilo**: pequenos ajustes de consistência e sintaxe CSS para manter previsibilidade visual no tema claro.

### ✅ Entrega Atual (Refinamento Final Clean Code + WCAG 2.2) — 2026-03-29

Fechamento técnico com foco em robustez de acessibilidade e previsibilidade de navegação por teclado:

- **Focus Ring WCAG 2.2 no Tema Claro**: `:focus-visible` com borda dupla (outline Papaya + anel externo escuro) para reforçar contraste em superfícies claras.
- **ARIA Live no Status de Operações**: região dinâmica de status configurada com `role="status"`, `aria-live="polite"` e `aria-atomic="true"` para anúncios consistentes em leitor de tela.
- **Roving Tabindex Pós-Render Blindado**: ajuste para garantir que somente um card receba `tabindex="0"` após re-renderizações (salvar/atualizar), com demais cards em `-1`.
- **Estratégia de Modularização ES6 (Roadmap)**: separação planejada em `a11y.js` e `gallery.js`, com composição em `main.js`, mantendo camada de compatibilidade para escopo global durante migração incremental.

### ✅ Entrega Atual (Calibragem WCAG no Tema Claro — AA + AAA) — 2026-03-29

Refino específico para `html.light-theme`, preservando o tema escuro e priorizando contraste real em componentes interativos e tipografia:

- **Paleta Ajustada com Base na Identidade Visual**: tons claros foram recalibrados para garantir legibilidade sem perder coerência estética.
- **Texto/Links com Contraste Forte**: `--primary-color` no tema claro ajustado para `#092b2b`, elevando contraste em fundos brancos.
- **Foco de Teclado Mais Robusto**: `--focus-color` atualizado para `#fc510b`, mantendo foco perceptível em superfícies claras.
- **CTA Principal Mais Legível**: `--btn-primary` alterado para gradiente escuro (`#0f3d3d` → `#092b2b`) com texto branco.
- **Bordas de Controles Reforçadas**: `--border-color` escurecido para melhorar distinção visual de inputs, cards e botões.
- **Aside com Melhor Leitura no Tema Claro**: títulos `h3` sem opacidade reduzida (`opacity: 1`) para evitar perda de contraste.
- **Pente Fino Pré-Testes de Usuário**: cores semânticas de sucesso/erro no modo claro ajustadas para tons mais escuros (`#14532d` e `#912018`) elevando contraste em botões e estados de ação.

Resultado: conformidade orientada a **AA obrigatório** com aplicação de **AAA onde viável** no modo claro.

### ✅ Entrega Atual (Refatoração Light Theme — UI/UX + WCAG 2.2) — 2026-03-29

Refatoração visual e de acessibilidade aplicada exclusivamente em `html.light-theme`, mantendo compatibilidade com a arquitetura atual baseada em classes e atributos ARIA:

- **Acessibilidade Crítica em Botões Ativos do Aside**: estado ativo baseado em `button[aria-pressed="true"]` com fundo Papaya e texto/ícones em `#0f172a` para contraste adequado.
- **Foco Duplo WCAG 2.2 (AAA em superfícies claras)**: padrão global no modo claro com `outline: 3px solid #ff8700` + `box-shadow: 0 0 0 6px #0f172a` para elementos focáveis.
- **Harmonização Header + Aside**: bordas suavizadas (`border-radius: 12px`) no topo e no título do menu lateral, com ajuste fino de peso e espaçamento tipográfico no tema claro.
- **Full Light Theming no Main**: containers de conteúdo principal, preview/player e galeria alinhados ao fundo Gelo (`#f0f4f8`) sem blocos escuros incoerentes.
- **Cards com Elevação Suave**: cards da galeria em branco puro (`#ffffff`) com sombra leve `0 4px 6px -1px rgba(0, 0, 0, 0.05)`.
- **Input da API Key no Light**: campo com fundo claro, borda sutil (`#cbd5e1`) e texto escuro para leitura confortável e consistência visual.

### ✅ Entrega Atual (Correção de Sticky Responsivo no Aside) — 2026-03-29

Ajuste de layout para manter o menu lateral previsível no scroll e evitar deslocamento visual em breakpoints menores:

- **`md` até desktop**: `aside` com comportamento sticky estável (`position: sticky`) e rolagem interna quando necessário.
- **Mobile**: `aside` deixa de usar sticky (`position: static`) e o layout passa a empilhar (`aside` acima do conteúdo principal), evitando efeito de “subir” indevido.
- **Robustez em container flex**: refinado alinhamento do `aside` para manter fixação correta durante a rolagem da página.
- **Ajuste fino por breakpoint (`md` → `2xl`)**: offsets e altura máxima do sticky calibrados progressivamente para reduzir gaps e manter o topo visualmente consistente em diferentes larguras de tela.
- **Sticky imediato no desktop (`md+`)**: offset do `aside` alinhado à altura real do header para eliminar o movimento vertical antes de “grudar” no início da rolagem.

---

### 🧩 Exibição do Projeto e Conceitos A11Y

Abaixo, imagens que detalham a interface e os pilares de acessibilidade implementados:

#### 🖼️ Tela Inicial e Navegação via Teclado

<p align="center">
  <img width="480" src="./src/to_readme/tela_inicial.PNG" alt="Tela inicial do projeto" />
  <img width="480" src="./src/to_readme/tela_inicial_tab.PNG" alt="Navegação via tecla TAB" />
</p>

#### 🖼️ Inclusão e Pilares da Acessibilidade

<p align="center">
  <img width="480" src="./src/to_readme/tela_vlibras.PNG" alt="Modal VLibras" />
  <img width="480" src="./src/to_readme/tela_4_pilares.PNG" alt="Os 4 Pilares da Acessibilidade" />
</p>

#### 🖼️ Testes de Contraste e Validação

<p align="center">
  <img width="480" src="./src/to_readme/tela_pratica_hight.PNG" alt="Desafio do Contraste" />
  <img width="480" src="./src/to_readme/tela_pratica_e.PNG" alt="Validação com erro" />
  <img width="480" src="./src/to_readme/tela_pratica_s.PNG" alt="Validação com sucesso" />
</p>

---

### 📦 Como Executar o Projeto

1. **Clone o repositório:**

```bash
git clone [https://github.com/ricardo-werner/ClipMaker_AI.git](https://github.com/ricardo-werner/ClipMaker_AI.git)
```

### Abra o projeto no VS Code.

Se você usa o VS Code com a extensão Live Server, clique em "GO LIVE" no canto inferior direito para iniciar um servidor local. Caso contrário, abra o arquivo index.html diretamente do seu navegador.

### Ative o Go Live:

<p align="center">
<img width="240" src="./src/to_readme/GoLive.jpg" alt="Ativando o Go Live">
<img width="240" src="./src/to_readme/GoLiveOn.jpg" alt="Go Live ativado">
</p>

### Visualize o resultado:

<p align="center">
<img width="480" src="./src/to_readme/resultadoWeb.PNG" alt="Resultado na Web">
</p>

## 🛠 Tecnologias Utilizadas

- HTML5 & CSS3: Layout responsivo com CSS Grid e foco total em acessibilidade (A11Y).

- JavaScript (Vanilla): Manipulação de DOM, UUID e lógica de persistência híbrida.

- Gemini 2.5 Flash API: IA para análise de conteúdo e quebra de legendas.

- Cloudinary SDK: Gerenciamento e corte de mídia.

Persistência Local: Uso de localStorage para manter a galeria.

## 💡 Reflexão Técnica

Desenvolver o ClipMaker AI foi uma jornada de aprendizado sobre como fundir front-end moderno com APIs de IA. O maior desafio técnico foi a implementação da Persistência Híbrida: garantir que o sistema leia um arquivo JSON fixo e o combine com interações do usuário no localStorage, tratando duplicatas e estados de UI de forma síncrona.

## 🙋‍♂️ Autor:

Ricardo Werner - Desenvolvedor Front-end | Acessibilidade (A11Y) & Inclusão Digital
