import React from 'react';
import devryan from '../Pictures/Ryan.jpg';
import devkaua from '../Pictures/Kaua.jpg';
import devkaue from '../Pictures/kaue.jpg';
import devfilipi from '../Pictures/filipi.jpg';
import linkedinIcon from '../Pictures/linkedin.png'; 
import fecap from '../Pictures/fecapicon.gif'; 
import khipo from '../Pictures/khipo.jpg'; 

function Footer() {
  return (
    <footer className="footer-seção">
      <div className="footer-main">
        {/* Equipes */}
        <div className="footer-teams">
          {/* Equipe Front-end */}
          <div className="team">
            <h4>Equipe Front-end</h4>
            <div className="team-members">
              <div className="member">
                <img src={devryan} alt="Ryan" className="team-image" />
                <p className="member-role">Idealização, prototipagem e criação do layout e suas ferramentas.</p>
                <a href="https://www.linkedin.com/in/ryan-oliveira-2b54092a1/" target="_blank" rel="noopener noreferrer" className="linkedin-button">
                  <img src={linkedinIcon} alt="LinkedIn" className="linkedin-icon" /> Ryan Oliveira
                </a>
              </div>

              <div className="member">
                <img src={devkaua} alt="Kaua" className="team-image" />
                <p className="member-role">Prototipagem, resolução de problemas e solução de funcionalidades.</p>
                <a href="https://www.linkedin.com/in/kau%C3%A3-silva-rocha-0a2b0a1a5/" target="_blank" rel="noopener noreferrer" className="linkedin-button">
                  <img src={linkedinIcon} alt="LinkedIn" className="linkedin-icon" /> Kaua Silva
                </a>
              </div>
            </div>
          </div>

          {/* Equipe Back-end */}
          <div className="team">
            <h4>Equipe Back-end</h4>
            <div className="team-members">
              <div className="member">
                <img src={devkaue} alt="Kaue" className="team-image" />
                <p className="member-role">Contribuinte para crianção e estilização da aba de Feedbacks</p>
                <a href="https://www.linkedin.com/in/kauedantas10/" target="_blank" rel="noopener noreferrer" className="linkedin-button">
                  <img src={linkedinIcon} alt="LinkedIn" className="linkedin-icon" /> Kaue Dantas
                </a>
              </div>

              <div className="member">
                <img src={devfilipi} alt="Filipi" className="team-image" />
                <p className="member-role">Back-end com Manipulação e limpeza de dados para processos</p>
                <a href="https://www.linkedin.com/in/filipi-pires-219331211/" target="_blank" rel="noopener noreferrer" className="linkedin-button">
                  <img src={linkedinIcon} alt="LinkedIn" className="linkedin-icon" /> Filipi Souza
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Patrocínios e Colaboradores */}
        <div className="footer-partners">
          <h4>Patrocínios e Colaboradores</h4>
          <p>FastPrice foi desenvolvido e é apoiado por nossos incríveis parceiros e colaboradores.</p>

          <div className="partner">
            <img src={fecap} alt="FECAP" className="partner-image" />
            <p>FECAP: Fundação Escola de Comércio Álvares Penteado</p>
          </div>

          <div className="partner">
            <img src={khipo} alt="KHIPO" className="partner-image" />
            <p>KHIPO: Desenvolvemos soluções para grandes empresas</p>
          </div>
          <h3>Contato</h3>
        <p>Email: ryandoliveira@hotmail.com</p>
        <p>WhatsApp: (11) 96555-0474</p>
        <p>Instagram: @euryan3</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;