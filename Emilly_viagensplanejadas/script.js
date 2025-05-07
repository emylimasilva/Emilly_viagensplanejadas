document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("viagem-form");
    const viagensContainer = document.getElementById("viagens-container");
  
    const fetchViagens = async () => {
      try {
        const response = await fetch('http://localhost:3000/viagens');
        const viagens = await response.json();
        renderViagens(viagens);
      } catch (error) {
        console.error('Erro ao carregar viagens:', error);
      }
    };
  
    const renderViagens = (viagens) => {
      viagensContainer.innerHTML = '';
      
      viagens.forEach(viagem => {
        const card = document.createElement('div');
        card.className = `viagem-card ${viagem.status}`;
        card.innerHTML = `
          <strong>Destino:</strong> ${viagem.destino}<br>
          <strong>Data:</strong> ${new Date(viagem.data).toLocaleDateString()}<br>
          <strong>Status:</strong> ${viagem.status}<br>
          ${viagem.status !== 'confirmada' ? `<button data-id="${viagem._id}">Confirmar</button>` : ''}
        `;
        if (viagem.status !== 'confirmada') {
          card.querySelector('button').addEventListener('click', async (e) => {
            const id = e.target.getAttribute('data-id');
            await confirmarViagem(id);
          });
        }
        viagensContainer.appendChild(card);
      });
    };
  
    const confirmarViagem = async (id) => {
      try {
        const response = await fetch(`http://localhost:3000/viagens/${id}`, {
          method: 'PUT',
          body: JSON.stringify({ status: 'confirmada' }),
          headers: { 'Content-Type': 'application/json' },
        });
        const viagem = await response.json();
        alert(`Viagem para ${viagem.destino} confirmada!`);
        fetchViagens();
      } catch (error) {
        console.error('Erro ao confirmar viagem:', error);
      }
    };
  
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
  
      const destino = document.getElementById('destino').value.trim();
      const data = document.getElementById('data').value;
      const status = document.getElementById('status').value;
  
      if (!destino || !data) return;
  
      try {
        const response = await fetch('http://localhost:3000/viagens', {
          method: 'POST',
          body: JSON.stringify({ destino, data, status }),
          headers: { 'Content-Type': 'application/json' },
        });
        const viagem = await response.json();
        alert(`Viagem para ${viagem.destino} cadastrada com sucesso!`);
        fetchViagens();
        form.reset();
      } catch (error) {
        console.error('Erro ao cadastrar viagem:', error);
      }
    });
  
    fetchViagens();
  });
  