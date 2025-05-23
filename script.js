const form = document.getElementById('trip-form');
const lista = document.getElementById('lista-viagens');
const search = document.getElementById('search');

const modal = document.getElementById('modal');
const modalDestino = document.getElementById('modal-destino');
const btnConfirmar = document.getElementById('btn-confirmar');
const btnCancelar = document.getElementById('btn-cancelar');
const mensagemAgradecimento = document.getElementById('mensagem-agradecimento');

let viagens = JSON.parse(localStorage.getItem('viagens')) || [];
let viagemSelecionadaId = null;

const valoresViagens = {
  "Alemanha": 6200,
  "Argentina": 3000,
  "Austrália": 8000,
  "Brasil": 2000,
  "Canadá": 7500,
  "China": 8000,
  "Disney": 9000,
  "Emirados Árabes": 12000,
  "Espanha": 5500,
  "Estados Unidos": 6000,
  "França": 5000,
  "Grécia": 4500,
  "Hollywood": 6500,
  "Índia": 2500,
  "Itália": 4500,
  "Japão": 7000,
  "Las Vegas": 7000,
  "México": 3000,
  "Portugal": 4000,
  "Reino Unido": 6500,
  "Suíça": 10000,
  "Tailândia": 4000
};

// Envio do formulário
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const destino = document.getElementById('destino').value.trim();
  const data = document.getElementById('data').value;
  const status = document.getElementById('status').value;

  if (!destino || !data) {
    alert('Por favor, preencha todos os campos!');
    return;
  }

  const novaViagem = {
    id: Date.now(),
    destino,
    data,
    status,
    valor: valoresViagens[destino] || 0
  };

  viagens.push(novaViagem);
  salvarEAtualizar();
  form.reset();
});

// Campo de busca
search.addEventListener('input', () => {
  renderizarViagens();
});

// Renderiza as viagens cadastradas
function renderizarViagens() {
  lista.innerHTML = '';
  const termoBusca = search.value.trim().toLowerCase();

  const viagensFiltradas = viagens
    .filter(v => v.destino.toLowerCase().includes(termoBusca))
    .filter(v => new Date(v.data) >= new Date())
    .sort((a, b) => new Date(a.data) - new Date(b.data));

  if (viagensFiltradas.length === 0) {
    lista.innerHTML = '<p style="text-align:center; color:#666;">Nenhuma viagem encontrada.</p>';
    return;
  }

  viagensFiltradas.forEach(viagem => {
    const div = document.createElement('div');
    div.className = 'card';
    div.style.padding = '1rem';
    div.style.marginBottom = '1rem';
    div.style.background = '#fff';
    div.style.borderRadius = '12px';
    div.style.boxShadow = '0 4px 10px rgba(0,0,0,0.07)';
    div.style.cursor = 'pointer';

    div.innerHTML = `
      <h3>${viagem.destino}</h3>
      <p>Data: ${formatarData(viagem.data)}</p>
      <p>Status: ${viagem.status}</p>
      <p>Valor: R$ ${viagem.valor.toFixed(2)}</p>
    `;

    // Clique para confirmar
    div.addEventListener('click', () => {
      if (viagem.status === 'planejada') {
        viagemSelecionadaId = viagem.id;
        modalDestino.textContent = viagem.destino;
        mensagemAgradecimento.style.display = 'none';
        btnConfirmar.style.display = 'inline-block';
        btnCancelar.style.display = 'inline-block';
        modal.style.display = 'flex';
      }
    });

    lista.appendChild(div);
  });
}

// Confirmação da viagem
btnConfirmar.addEventListener('click', () => {
  const viagem = viagens.find(v => v.id === viagemSelecionadaId);
  if (viagem) {
    viagem.status = 'confirmada';
    salvarEAtualizar();
    btnConfirmar.style.display = 'none';
    btnCancelar.style.display = 'none';
    mensagemAgradecimento.textContent = `Obrigado por confirmar sua viagem para ${viagem.destino}!`;
    mensagemAgradecimento.style.display = 'block';

    setTimeout(() => {
      modal.style.display = 'none';
      mensagemAgradecimento.style.display = 'none';
    }, 2500);
  }
});

// Cancelamento da confirmação
btnCancelar.addEventListener('click', () => {
  modal.style.display = 'none';
});

// Salva e atualiza no localStorage
function salvarEAtualizar() {
  localStorage.setItem('viagens', JSON.stringify(viagens));
  renderizarViagens();
}

// Formata a data no formato BR
function formatarData(dataStr) {
  const data = new Date(dataStr);
  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const ano = data.getFullYear();
  return `${dia}/${mes}/${ano}`;
}

// Inicializa a tela
renderizarViagens();
