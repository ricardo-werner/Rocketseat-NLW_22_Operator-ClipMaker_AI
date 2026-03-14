// Controle de Tema
const toggleTheme = document.getElementById('theme-toggle');
toggleTheme.addEventListener('click', () => {
  const islight = document.documentElement.classList.toggle('light-theme');
  localStorage.setItem('theme', islight ? 'light' : 'dark');
});


// Acessibilidade
function toggleDislexia() {
  document.body.classList.toggle('dyslexia-mode');
}

function toggleEnhancedVision() {
  const main = document.getElementById('main-content');
  main.style.lineHeight = main.style.lineHeight === '2' ? '1.5' : '2';
  }

// Botão Flutuante
const backBtn = document.getElementById('back-to-top');
window.onscroll = () => {
  if (window.scrollY > 300) backBtn.classList.add('visible');
  else backBtn.classList.remove('visible');
}

backBtn.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });


// CRUD: Simulação de Deleção
document.getElementById('lista-cortes').addEventListener('click', 
  (e) => {
    const btnDelete = e.target.closest('.delete');
    if (btnDelete) {
      const card = btnDelete.closest('.cut-card');
      card.style.opacity = '0';
      setTimeout(() => card.remove(), 500);
    }
  });