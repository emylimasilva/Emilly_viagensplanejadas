// ---------------------------
// CLASSES DE POO
// ---------------------------

class Viagem {
  constructor(destino, data, status) {
    this._destino = destino;
    this._data = data;
    this._status = status;
    this._id = Date.now();
  }

  get destino() {
    return this._destino;
  }

  set destino(valor) {
    this._destino = valor;
  }

  get data() {
    return this._data;
  }

  set data(valor) {
    this._data = valor;
  }

  get status() {
    return this._status;
  }

  set status(valor) {
    this._status = valor;
  }

  exibir() {
    return `
      <h3>Destino: ${this.destino}</h3>
      <p><strong>Data:</strong> ${formatarData(this.data)}</p>
      <p><strong>Status:</strong> ${this.status}</p>
    `;
  }

  salvar() {
    const viagens = JSON.parse(localStorage.getItem('viagens') || '[]');
    viagens.push({
      id: this._id,
      destino: this._destino,
      data: this._data,
      status: this._status,
      tipo: this.constructor.name
    });
    localStorage.setItem('viagens', JSON.stringify(viagens));
  }
}

class ViagemInternacional extends Viagem {
  constructor(destino, data, status) {
    super(destino, data, status);
    this._necessitaPassaporte = true;
  }

  exibir() {
    return super.exibir() + `
      <p><strong>Passaporte necessário:</strong> Sim</p>
    `;
  }
}

// ---------------------------
// LÓGICA DO SITE
// ---------------------------

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

const form = document.getElementById('trip-form');
const lista = document.getElementById('lista-viagens');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const destino = document.getElementById('destino').value;
  const data = document.getElementById('data').value;
  const status = document.getElementById('status').value;

  if (!destino || !data) {
    alert('Preencha todos os campos!');
    return;
  }

  let viagem;

  if (destino !== 'Brasil') {
    viagem = new ViagemInternacional(destino, data, status);
  } else {
    viagem = new Viagem(destino, data, status);
  }

  viagem.salvar();
  form.reset();
  carregarViagens();
});

function carregarViagens() {
  const viagens = JSON.parse(localStorage.getItem('viagens') || '[]');
  lista.innerHTML = '';

  viagens.forEach(v => {
    let viagem;
    if (v.tipo === 'ViagemInternacional') {
      viagem = new ViagemInternacional(v.destino, v.data, v.status);
    } else {
      viagem = new Viagem(v.destino, v.data, v.status);
    }

    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = viagem.exibir();
    lista.appendChild(div);
  });
}

function formatarData(dataStr) {
  const data = new Date(dataStr);
  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const ano = data.getFullYear();
  return `${dia}/${mes}/${ano}`;
}
