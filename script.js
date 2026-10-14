
 // PERSONALIZE AQUI: troque os textos, nomes e a data do relacionamento.
const CONFIG = {
  nome1: 'Maria Clara',
  nome2: 'Victor Hugo',
  inicio: '2023-12-14T00:00:00',
  legendaDaData: 'desde o dia em que tudo começou',
  motivos: [
    'Porque seu sorriso deixa meus dias mais leves.',
    'Porque posso ser eu mesma perto de você.',
    'Porque até os momentos simples ficam especiais.',
    'Porque você me faz rir quando eu menos espero.',
    'Porque gosto de descobrir o mundo ao seu lado.',
    'Porque seu carinho mora nos detalhes.',
    'Porque você é você — e isso já é tão bonito.'
  ]
};

const pages = [...document.querySelectorAll('.page')];
const prevButton = document.getElementById('prevButton');
const nextButton = document.getElementById('nextButton');
const pageIndicator = document.getElementById('pageIndicator');
const music = document.getElementById('backgroundMusic');
const musicButton = document.getElementById('musicButton');

let currentPage = 0;
let reasonIndex = 0;

// Preenche nomes e textos personalizados.
document.getElementById('coverNames').textContent =
  `${CONFIG.nome1} & ${CONFIG.nome2}`;

document.getElementById('coverDate').textContent =
  CONFIG.legendaDaData;

// Navegação das páginas.
function showPage(index, animate = true) {
  index = Math.max(0, Math.min(pages.length - 1, index));

  if (index === currentPage && !animate) return;

  const oldPage = pages[currentPage];
  const newPage = pages[index];

  if (!newPage) return;

  if (oldPage && oldPage !== newPage) {
    oldPage.classList.remove('turning');
    oldPage.hidden = true;
  }

  newPage.hidden = false;

  if (animate && oldPage !== newPage) {
    newPage.classList.add('turning');
    requestAnimationFrame(() =>
      requestAnimationFrame(() => newPage.classList.remove('turning'))
    );
  }

  currentPage = index;
  prevButton.disabled = index === 0;
  nextButton.disabled = index === pages.length - 1;

  pageIndicator.textContent =
    index === 0 ? 'capa · 0/7' : `página · ${index}/7`;

  nextButton.textContent =
    index === pages.length - 1 ? 'fim ♡' : 'próxima →';
}

nextButton.addEventListener('click', () =>
  showPage(currentPage + 1)
);

prevButton.addEventListener('click', () =>
  showPage(currentPage - 1)
);

document.querySelector('[data-next]').addEventListener('click', () =>
  showPage(1)
);

document.addEventListener('keydown', event => {
  if (event.key === 'ArrowRight') showPage(currentPage + 1);
  if (event.key === 'ArrowLeft') showPage(currentPage - 1);
});

// Contador desde a data definida em CONFIG.inicio.
function updateCounter() {
  const start = new Date(CONFIG.inicio).getTime();
  const now = Date.now();
  const diff = Math.max(0, now - start);
  const totalSeconds = Math.floor(diff / 1000);

  document.getElementById('days').textContent =
    Math.floor(totalSeconds / 86400).toLocaleString('pt-BR');

  document.getElementById('hours').textContent =
    String(Math.floor((totalSeconds % 86400) / 3600)).padStart(2, '0');

  document.getElementById('minutes').textContent =
    String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');

  document.getElementById('seconds').textContent =
    String(totalSeconds % 60).padStart(2, '0');
}

updateCounter();
setInterval(updateCounter, 1000);

// Pote de motivos.
document.getElementById('reasonButton').addEventListener('click', () => {
  const reason = CONFIG.motivos[reasonIndex % CONFIG.motivos.length];

  document.getElementById('reasonText').textContent = `“${reason}”`;
  reasonIndex++;
});

// Abre e fecha a cartinha.
const letterButton = document.getElementById('letterButton');
const letterContent = document.getElementById('letterContent');

letterButton.addEventListener('click', () => {
  const opening = letterContent.hidden;
  letterContent.hidden = !opening;

  letterButton.setAttribute('aria-expanded', String(opening));

  letterButton.querySelector('span:last-child').textContent =
    opening ? 'fechar cartinha' : 'toque para abrir';
});

// Surpresa final.
document.getElementById('surpriseButton').addEventListener('click', event => {
  const message = document.getElementById('surpriseMessage');

  message.hidden = !message.hidden;

  event.currentTarget.textContent =
    message.hidden ? 'abrir minha surpresa ♡' : 'guardar surpresa ♡';
});

// Música: começa somente após o toque da pessoa.
musicButton.addEventListener('click', async () => {
  if (music.paused) {
    try {
      musicButton.disabled = true;
      await music.play();

      musicButton.textContent = '♫ Pausar música';
      musicButton.classList.add('playing');
      musicButton.setAttribute('aria-pressed', 'true');
    } catch (error) {
      console.error('Erro ao reproduzir a música:', error);
      musicButton.textContent = '♫ Não foi possível tocar';
      musicButton.setAttribute('aria-pressed', 'false');
    } finally {
      musicButton.disabled = false;
    }
  } else {
    music.pause();
    musicButton.textContent = '♫ Escuta a nossa música';
    musicButton.classList.remove('playing');
    musicButton.setAttribute('aria-pressed', 'false');
  }
});

// Mantém o botão sincronizado caso o áudio termine ou seja pausado.
music.addEventListener('ended', () => {
  musicButton.textContent = '♫ Escuta a nossa música';
  musicButton.classList.remove('playing');
  musicButton.setAttribute('aria-pressed', 'false');
});
