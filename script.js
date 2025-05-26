const loginScreen = document.getElementById('login-screen');
const mainScreen = document.getElementById('main-screen');
const welcome = document.getElementById('welcome');
const usernameInput = document.getElementById('username');

function entrar() {
  const nome = usernameInput.value.trim();
  if (nome === '') {
    alert('Digite seu nome para continuar!');
    return;
  }
  welcome.textContent = `Bem-vindo, ${nome}!`;
  loginScreen.style.display = 'none';
  mainScreen.style.display = 'block';
  carregarViagens();
}

// Elementos
const form = document.getElementById('trip-form');
const lista = document.getElementById('lista-viagens');

// Cadastrar viagem
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const destino = document.getElementById('destino').value;
  const data = document.getElementById('data').value;
  const status = document.getElementById('status').value;

  if (destino === '' || data === '') {
    alert('Preencha todos os campos!');
    return;
  }

  const viagens = JSON.parse(localStorage.getItem('viagens') || '[]');

  const viagem = {
    id: Date.now(),
    destino,
    data,
    status
  };

  viagens.push(viagem);
  localStorage.setItem('viagens', JSON.stringify(viagens));

  form.reset();
  carregarViagens();
});

// Carregar viagens
function carregarViagens() {
  const viagens = JSON.parse(localStorage.getItem('viagens') || '[]');
  lista.innerHTML = '';

  viagens.forEach(v => {
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `
      <h3>Destino: ${v.destino}</h3>
      <p><strong>Data:</strong> ${formatarData(v.data)}</p>
      <p><strong>Status:</strong> ${v.status}</p>
    `;
    lista.appendChild(div);
  });
}

// Formatar data
function formatarData(dataStr) {
  const data = new Date(dataStr);
  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const ano = data.getFullYear();
  return `${dia}/${mes}/${ano}`;
}
