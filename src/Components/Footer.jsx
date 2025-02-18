import React from 'react';


function Footer() {
  return (
    <footer className="section-footer">
      <div className="footer-content">
        <div className="footer-contact">
          <h3>Contato</h3>
          <p>Email: contato@fastprice.com.br</p>
          <p>Telefone: (11) 1234-5678</p>
          <p>WhatsApp: (11) 91234-5678</p>
          <p>Endereço: Rua Exemplo, 123, São Paulo, SP</p>
        </div>
        <div className="footer-partners">
          <h4>Patrocínios e Colaboradores</h4>
          <p>FastPrice é apoiado por nossos incríveis parceiros e colaboradores.</p>
          <p>Parceiro 1: Empresa Alpha</p>
          <p>Parceiro 2: Empresa Beta</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
