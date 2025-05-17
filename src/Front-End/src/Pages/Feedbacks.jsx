import React from 'react';
import '../styles/Feedbacks.css';

import feedback1 from '../Pictures/feedback1.jpg';


function Feedbacks() {
  const feedbacksData = [
    {
      id: 1,
      name: "João Silva",
      feedback: "Utilizei o FastPrice para comparar os preços das corridas e encontrei a melhor opção para o meu dia a dia. Recomendo demais!",
      image: feedback1,
      rating: 5 // Avaliação de 5 estrelas
    },
    {
      id: 2,
      name: "Mariana Souza",
      feedback: "Adorei o FastPrice! Me ajudou muito a economizar e encontrar as melhores opções de transporte. Só não dei 5 estrelas porque ainda acho que poderia ter mais opções de personalização.",
      image: feedback1,
      rating: 4 // Avaliação de 4 estrelas
    },
    {
      id: 3,
      name: "Carlos Pereira",
      feedback: "O FastPrice foi útil para comparar os preços, mas não consegui encontrar todas as opções que eu esperava. Acredito que ele pode melhorar na diversidade de opções.",
      image: feedback1,
      rating: 2 // Avaliação de 2 estrelas
    },
    {
      id: 4,
      name: "Fernanda Oliveira",
      feedback: "O FastPrice foi útil para comparar os preços, mas não consegui encontrar todas as opções que eu esperava. Acredito que ele pode melhorar na diversidade de opções.",
      image: feedback1,
      rating: 3 // Avaliação de 3 estrelas
    },
    {
      id: 5,
      name: "Ricardo Mendes",
      feedback: "Sempre busco a melhor relação custo-benefício. Com o FastPrice, encontro as melhores opções em poucos cliques. Incrível!",
      image: feedback1,
      rating: 5 // Avaliação de 4 estrelas
    }
  ];

  // Função para renderizar as estrelas de avaliação
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={`star ${i <= rating ? "filled" : ""}`}>
          &#9733; {/* Símbolo de estrela */}
        </span>
      );
    }
    return stars;
  };

  return (
    <section className="section feedbacks">
      <div className="container">
        <h2 className="section-title">Feedbacks dos Clientes</h2>
        <div className="feedbacks-container">
          {feedbacksData.map((item) => (
            <div key={item.id} className="feedback-card animate__animated animate__fadeInUp">
              <div className="feedback-image">
                <img src={item.image} alt={`Foto de ${item.name}`} />
              </div>
              <p className="feedback-text">"{item.feedback}"</p>
              <h4 className="feedback-name">{item.name}</h4>
              <div className="feedback-rating">
                {renderStars(item.rating)} {/* Exibe as estrelas de acordo com a avaliação */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Feedbacks;

