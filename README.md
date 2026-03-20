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

* **Controle de Estado do Botão**: O botão `Salvar na Galeria` (ID: `btn-save-cut`) é desativado automaticamente ao salvar ou reproduzir itens existentes.
* **Gestão de Vídeos Desativados**: O player é resetado ao deletar um vídeo em reprodução, e cards `disabled` bloqueiam a função "Assistir".
* **Deduplicação de Dados**: Motor que impede salvamentos duplicados comparando URLs e assinaturas de conteúdo.

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
* HTML5 & CSS3: Layout responsivo com CSS Grid e foco total em acessibilidade (A11Y).

* JavaScript (Vanilla): Manipulação de DOM, UUID e lógica de persistência híbrida.

* Gemini 2.5 Flash API: IA para análise de conteúdo e quebra de legendas.

* Cloudinary SDK: Gerenciamento e corte de mídia.

Persistência Local: Uso de localStorage para manter a galeria.

## 💡 Reflexão Técnica
Desenvolver o ClipMaker AI foi uma jornada de aprendizado sobre como fundir front-end moderno com APIs de IA. O maior desafio técnico foi a implementação da Persistência Híbrida: garantir que o sistema leia um arquivo JSON fixo e o combine com interações do usuário no localStorage, tratando duplicatas e estados de UI de forma síncrona.

## 🙋‍♂️ Autor:
Ricardo Werner - Desenvolvedor Front-end | Acessibilidade (A11Y) & Inclusão Digital