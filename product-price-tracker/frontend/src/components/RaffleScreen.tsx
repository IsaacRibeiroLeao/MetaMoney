import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { getVendas, selectRandomName } from '../services/api';
// Removed unused Venda import

interface RaffleScreenProps {
  onClose: () => void;
}

const RaffleScreen: React.FC<RaffleScreenProps> = ({ onClose }) => {
  // Remove the unused vendas state
  const [eligibleNames, setEligibleNames] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [winner, setWinner] = useState<string | null>(null);
  const [selecting, setSelecting] = useState(false);
  const [animatingName, setAnimatingName] = useState<string>('');
  const [isAnimating, setIsAnimating] = useState(false);

  // Não precisamos mais de uma lista de combos específicos, pois vamos considerar
  // todos os pratos marcados como participantes do sorteio

  // Usar useCallback para fetchVendas para evitar recriações desnecessárias
  const fetchVendas = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getVendas();
      
      // Extract customer names from eligible vendas
      const names: string[] = [];
      data.forEach(venda => {
        // Verificar se a venda inclui um nome de cliente (formato: "nome_do_prato - nome_do_cliente")
        if (venda.name.includes(' - ')) {
          const parts = venda.name.split(' - ');
          if (parts.length > 1) {
            const customerName = parts[1].trim();
            if (customerName) {
              names.push(customerName);
            }
          }
        }
      });
      
      setEligibleNames(names);
      setError(null);
    } catch (err) {
      console.error('Error fetching vendas:', err);
      setError('Falha ao carregar os dados. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, []); // Sem dependências agora
  
  useEffect(() => {
    fetchVendas();
  }, [fetchVendas]);



  const handleSelectWinner = async () => {
    if (eligibleNames.length === 0) {
      setError('Não há participantes elegíveis para o sorteio.');
      return;
    }

    try {
      setSelecting(true);
      setIsAnimating(true);
      
      // Start the animation
      const animationDuration = 3000; // 3 seconds
      const intervalTime = 100; // Change name every 100ms
      const startTime = Date.now();
      
      // Get the winner from the API first
      const response = await selectRandomName(eligibleNames);
      const winnerName = response.selected_name;
      
      // Animation interval
      const animationInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        
        if (elapsed >= animationDuration) {
          // Animation complete, show the winner
          clearInterval(animationInterval);
          setAnimatingName('');
          setIsAnimating(false);
          setWinner(winnerName);
          setSelecting(false);
        } else {
          // During animation, cycle through names randomly
          // As we get closer to the end, show the winner more frequently
          const progress = elapsed / animationDuration;
          const randomIndex = Math.floor(Math.random() * eligibleNames.length);
          
          // Increase probability of showing the winner as we get closer to the end
          if (Math.random() < progress * progress && progress > 0.5) {
            setAnimatingName(winnerName);
          } else {
            setAnimatingName(eligibleNames[randomIndex]);
          }
        }
      }, intervalTime);
      
      setError(null);
    } catch (err) {
      console.error('Error selecting winner:', err);
      setError('Falha ao selecionar o vencedor. Tente novamente.');
      setIsAnimating(false);
      setSelecting(false);
    }
  };

  // Add CSS styles for animations
  const raffleStyles = `
    @keyframes winner-pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); }
    }
    
    @keyframes confetti-fall {
      0% { transform: translateY(-100px) rotate(0deg); opacity: 1; }
      100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
    }
    
    .confetti-animation {
      position: relative;
      height: 100px;
      margin: 20px 0;
    }
    
    .confetti-piece {
      position: absolute;
      width: 10px;
      height: 30px;
      background: linear-gradient(to bottom, #ffcc00, #ff6699, #3399ff);
      top: 0;
      opacity: 0;
      border-radius: 0 0 5px 5px;
    }
    
    .confetti-piece:nth-child(1) {
      left: 10%;
      animation: confetti-fall 4s ease-in-out 0.1s infinite;
      background: #ffcc00;
    }
    
    .confetti-piece:nth-child(2) {
      left: 30%;
      animation: confetti-fall 3.5s ease-in-out 0.5s infinite;
      background: #ff6699;
    }
    
    .confetti-piece:nth-child(3) {
      left: 50%;
      animation: confetti-fall 3s ease-in-out 0.2s infinite;
      background: #3399ff;
    }
    
    .confetti-piece:nth-child(4) {
      left: 70%;
      animation: confetti-fall 4.5s ease-in-out 0.7s infinite;
      background: #88ff66;
    }
    
    .confetti-piece:nth-child(5) {
      left: 90%;
      animation: confetti-fall 3.2s ease-in-out 0.3s infinite;
      background: #ff9933;
    }
    
    .confetti-piece:nth-child(6) {
      left: 20%;
      animation: confetti-fall 3.8s ease-in-out 0.6s infinite;
      background: #cc66ff;
    }
    
    .spinning-names {
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    /* Mobile responsiveness */
    @media (max-width: 576px) {
      .modal-dialog {
        margin: 0.5rem;
        max-width: calc(100% - 1rem);
      }
      
      .winner-name {
        font-size: 1.75rem !important;
      }
      
      .display-4 {
        font-size: 1.75rem;
      }
      
      .display-5 {
        font-size: 1.5rem;
      }
      
      .participant-list {
        max-height: 200px !important;
      }
    }
  `;

  return (
    <div className="raffle-screen">
      <style>{raffleStyles}</style>
      <div className="modal fade show" style={{ display: 'block' }} tabIndex={-1}>
        <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title d-flex align-items-center">
                <i className="bi bi-trophy me-2"></i>
                <span>Sorteio</span>
              </h5>
              <button 
                type="button" 
                className="btn-close btn-close-white" 
                onClick={onClose}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {loading ? (
                <div className="text-center my-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Carregando...</span>
                  </div>
                  <p className="mt-2">Carregando participantes...</p>
                </div>
              ) : error && !winner ? (
                <div className="alert alert-danger">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  {error}
                </div>
              ) : (
                <>
                  {isAnimating ? (
                    <div className="animation-container text-center my-5">
                      <div className="spinning-names mb-4">
                        <div className="display-4 text-primary text-center px-2" 
                             style={{
                               transition: 'all 0.1s ease-in-out',
                               transform: `scale(${Math.random() * 0.4 + 0.8})`,
                               opacity: Math.random() * 0.5 + 0.5,
                               wordBreak: 'break-word'
                             }}>
                          {animatingName}
                        </div>
                      </div>
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Selecionando...</span>
                      </div>
                      <p className="mt-3">Selecionando o vencedor...</p>
                    </div>
                  ) : winner ? (
                    <div className="winner-announcement text-center my-4">
                      <div className="display-4 mb-3 text-success">
                        <i className="bi bi-award me-2"></i>
                        Parabéns!
                      </div>
                      <div className="winner-name display-5 mb-4 px-2" 
                           style={{
                             animation: 'winner-pulse 2s infinite',
                             color: '#198754',
                             textShadow: '0 0 10px rgba(25, 135, 84, 0.3)',
                             wordBreak: 'break-word'
                           }}>
                        {winner}
                      </div>
                      <div className="confetti-animation">
                        {/* Confetti effect */}
                        <div className="confetti-piece"></div>
                        <div className="confetti-piece"></div>
                        <div className="confetti-piece"></div>
                        <div className="confetti-piece"></div>
                        <div className="confetti-piece"></div>
                        <div className="confetti-piece"></div>
                      </div>
                      <button 
                        className="btn btn-outline-primary mt-3"
                        onClick={() => setWinner(null)}
                      >
                        <i className="bi bi-arrow-repeat me-2"></i>
                        Realizar Novo Sorteio
                      </button>
                    </div>
                  ) : (
                    <>
                      <h6 className="mb-3">Participantes Elegíveis ({eligibleNames.length})</h6>
                      {eligibleNames.length > 0 ? (
                        <div className="participant-list mb-4" style={{maxHeight: '300px', overflowY: 'auto'}}>
                          <div className="list-group">
                            {eligibleNames.map((name, index) => (
                              <div key={index} className="list-group-item d-flex align-items-center">
                                <i className="bi bi-person-fill me-2 flex-shrink-0"></i>
                                <span style={{ wordBreak: 'break-word' }}>{name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="alert alert-warning">
                          <i className="bi bi-info-circle-fill me-2"></i>
                          Não há participantes elegíveis para o sorteio. Adicione vendas com pratos que participam do sorteio e inclua o nome do cliente.
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
            <div className="modal-footer">
              {!winner && !isAnimating && !loading && (
                <button 
                  className="btn btn-primary" 
                  onClick={handleSelectWinner}
                  disabled={selecting || eligibleNames.length === 0}
                >
                  {selecting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Selecionando...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-shuffle me-2"></i>
                      Realizar Sorteio
                    </>
                  )}
                </button>
              )}
              <button 
                className="btn btn-secondary" 
                onClick={onClose}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </div>
  );
};

export default RaffleScreen;
