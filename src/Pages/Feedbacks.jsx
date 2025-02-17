// src/pages/Feedbacks.jsx
import React from 'react';
import '../styles/Feedbacks.css';

function Feedbacks() {
  const feedbacksData = [
    {
      id: 1,
      name: "João Silva",
      feedback: "Utilizei o FastPrice para comparar os preços das corridas e encontrei a melhor opção para o meu dia a dia. Recomendo demais!",
      image: "/pictures/feedback1.jpg"  // Certifique-se de que as imagens estejam em public/pictures ou ajuste o caminho
    },
    {
      id: 2,
      name: "Mariana Souza",
      feedback: "Com o FastPrice, consegui economizar e viajar com muito conforto. O site é super intuitivo e os resultados são precisos!",
      image: "/pictures/feedback2.jpg"
    },
    {
      id: 3,
      name: "Carlos Pereira",
      feedback: "Fiquei impressionado com a facilidade de encontrar a opção mais barata. Agora, planejo todas as minhas viagens com o FastPrice!",
      image: "/pictures/feedback3.jpg"
    },
    {
      id: 4,
      name: "Fernanda Oliveira",
      feedback: "O FastPrice mudou a forma como escolho meus transportes. Rápido, simples e eficiente – não vivo sem!",
      image: "/pictures/feedback4.jpg"
    },
    {
      id: 5,
      name: "Ricardo Mendes",
      feedback: "Sempre busco a melhor relação custo-benefício. Com o FastPrice, encontro as melhores opções em poucos cliques. Incrível!",
      image: "/pictures/feedback5.jpg"
    }
  ];

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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Feedbacks;
