# Fast Price - O Comparador de Preços de Transporte

![Fast Price Banner](https://github.com/ryandoliveira/FastPricecompany/blob/main/src/Pictures/mockuporiginal.png)

O **Fast Price** é uma aplicação web inovadora que revoluciona a forma como você escolhe seu transporte. Nosso sistema compara, em tempo real, os preços das principais plataformas de transporte – **Uber, 99 e InDrive** – para oferecer a melhor opção para seu trajeto. Além disso, o Fast Price integra informações meteorológicas e condições de trânsito em um mapa interativo, garantindo que você esteja sempre informado sobre o cenário atual e possa planejar sua viagem com segurança.

---

## Funcionalidades e Fluxo de Funcionamento

**1. Comparação de Preços:**  
- **Multi-Plataforma:** O sistema coleta e compara os preços das corridas disponíveis em tempo real nas plataformas **Uber, 99 e InDrive**.  
- **Sugestão Econômica:** Após a comparação, o Fast Price sugere a opção de menor custo, ajudando o usuário a economizar.

**2. Integração com Dados Meteorológicos:**  
- **Clima Atualizado:** O sistema integra dados climáticos que informam se o dia está **ensolarado, chuvoso ou com tempestades**.  
- **Impacto no Transporte:** Essas informações podem influenciar na estimativa de tempo da viagem e no conforto do usuário.

**3. Mapa Interativo de Trânsito:**  
- **Visualização em Tempo Real:** Utilizando a tecnologia do Leaflet.js, o sistema exibe um mapa interativo que mostra as condições de trânsito ao longo do trajeto.  
- **Rotas Coloridas:**  
  - **Verde:** Indica que o trânsito está fluido.  
  - **Amarelo:** Sinaliza tráfego moderado.  
  - **Vermelho:** Mostra áreas com congestionamento.  
- **Navegação Simplificada:** O usuário pode visualizar rapidamente os pontos críticos do percurso e se planejar melhor.

**4. Feedback de Clientes:**  
- **Avaliações Reais:** Os usuários podem deixar suas opiniões e avaliações sobre cada plataforma de transporte.  
- **Comunidade Colaborativa:** Esse recurso ajuda a construir uma base de dados confiável, permitindo que novos usuários façam escolhas mais informadas.

---

## Tecnologias Utilizadas

- **[React.js](https://reactjs.org/):** Para a construção de uma interface dinâmica e responsiva.
- **[Leaflet.js](https://leafletjs.com/):** Para a criação de mapas interativos e visualização de trânsito.
- **APIs de Transporte:** Para obtenção de preços em tempo real das plataformas.
- **APIs de Clima:** Para fornecer dados meteorológicos atualizados.
- **APIs de Trânsito:** Para consultar informações de fluxo e congestionamento.

---

## Instalação e Execução

Para rodar o projeto localmente, siga os passos abaixo:

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/ryandoliveira/FastPricecompany/tree/main
2. **Clone o repositório:**
    ```bash
    cd fast-price
3. **Clone o repositório:**
   ```bash
   npm install
 3. **Clone o repositório:**
   ```bash  
   npm start


##   Instalação e Execução  Tecnologias Utilizadas

Acesse a aplicação: Abra o seu navegador e acesse http://localhost:3000


Estrutura do Projeto
O projeto está organizado da seguinte forma:

fast-price/
├── public/                 # Arquivos públicos e index.html
├── src/                    # Código-fonte da aplicação
│   ├── Components/         # Componentes reutilizáveis (ex.: ImputForm.jsx, TransportCard.jsx)
│   ├── Pages/              # Páginas do site (ex.: Home.jsx, Traffic.jsx)
│   ├── styles/             # Arquivos CSS personalizados
│   └── App.js              # Componente principal da aplicação
├── package.json            # Configurações do projeto e dependências
└── README.md               # Documentação do projeto


Contato
Se você tiver dúvidas ou precisar de mais informações, entre em contato:

Email: ryandoliveira@hotmail.com
GitHub: (https://github.com/ryandoliveira)

Desenvolvido com ❤️ pelo time Fast Price.
