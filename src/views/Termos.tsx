import Navbar from "../components/Navbar";
import { FaBookOpen, FaShieldHalved } from "react-icons/fa6"; // Ícones Fa6 para destaque

function Termos() {
  return (
    <div>
      <style>{`
        /* Paleta de Cores Consistente */
        :root {
          --primary-blue: #003087;
          --accent-blue: #0056b3;
          --dark-gray: #212529;
          --light-gray-text: #495057;
          --white: #ffffff;
          --light-gray-bg: #f5f7fa;
          --shadow-color: rgba(0, 0, 0, 0.05);
        }
        
        /* Estilos de Fundo e Layout Principal */
        .termos-page-bg {
            background-color: var(--light-gray-bg);
            padding-bottom: 5rem;
        }

        /* Container Principal e Tipografia */
        .termos-container {
            max-width: 960px;
            background-color: var(--white);
            border-radius: 16px;
            box-shadow: 0 10px 30px var(--shadow-color);
            padding: 3rem;
            margin-top: 3rem !important;
        }

        /* Título Principal */
        .termos-container h1 {
          color: var(--primary-blue) !important;
          font-weight: 800;
          font-size: 2.75rem;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
        }
        .termos-container h1 svg {
            color: var(--accent-blue);
        }

        .termos-container .lead {
          color: var(--light-gray-text) !important;
          font-size: 1.15rem;
          max-width: 700px;
          margin: 0 auto 3rem;
        }

        /* Títulos de Seção */
        .termos-container h4 {
          color: var(--dark-gray);
          font-weight: 700;
          font-size: 1.75rem;
          margin-top: 2rem;
          margin-bottom: 1.5rem;
          border-left: 5px solid var(--primary-blue);
          padding-left: 1rem;
          line-height: 1.4;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        /* Parágrafos e Corpo de Texto */
        .termos-container p {
          color: var(--dark-gray) !important;
          line-height: 1.7;
          font-size: 1rem;
          margin-bottom: 1.5rem;
        }

        /* Lista de Detalhes (Ul/Li) */
        .termos-details-list {
          list-style: none;
          padding-left: 0;
        }
        .termos-details-list li {
          color: var(--light-gray-text) !important;
          line-height: 1.7;
          margin-bottom: 1rem;
          padding-left: 1.5rem;
          position: relative;
          font-size: 1rem;
          border-left: 2px solid #e0e7ff;
        }
        .termos-details-list li strong {
          color: var(--dark-gray);
          font-weight: 700;
          margin-right: 0.25rem;
        }
        .termos-details-list li::before {
            content: "•";
            color: var(--accent-blue);
            font-size: 1.5rem;
            position: absolute;
            left: -10px;
            top: -5px;
            font-weight: 900;
            line-height: 1;
        }

        /* Responsividade */
        @media (max-width: 768px) {
          .termos-container {
            padding: 2rem 1rem;
            margin-top: 1rem !important;
          }
          .termos-container h1 {
            font-size: 2rem;
            text-align: left;
            justify-content: flex-start;
          }
          .termos-container h4 {
            font-size: 1.5rem;
            padding-left: 0.75rem;
          }
          .termos-container .lead {
             font-size: 1.05rem;
             margin-bottom: 2rem;
          }
        }
      `}</style>
      <div className="termos-page-bg">
        <Navbar />
        <div className="container mt-5 termos-container">
          <section className="text-center mb-5">
            <h1 className="display-3">
              <FaBookOpen /> Termos de Uso
            </h1>
            <p className="lead text-muted">
              Leia atentamente nossos Termos de Uso e Política de Privacidade.
            </p>
          </section>

          {/* --- Termos de Uso --- */}
          <section className="mb-5">
            <h4 className="text-primary">
              <FaShieldHalved /> Condições Gerais
            </h4>
            <p className="text-muted">
              Ao acessar e utilizar nossa plataforma, você concorda com os
              seguintes termos e condições, que regem a sua relação com o serviço
              <strong>VemAgendar</strong>.
            </p>
            <ul className="termos-details-list">
              <li>
                <strong>Licença de uso:</strong> O acesso ao serviço é concedido
                com base em uma licença limitada, pessoal, intransferível e não
                exclusiva, sujeita ao cumprimento das obrigações de pagamento.
              </li>
              <li>
                <strong>Responsabilidade do Usuário:</strong> Você se compromete
                a utilizar os serviços de forma ética, legal e responsável,
                garantindo que não infringirá direitos de terceiros ou as leis
                vigentes.
              </li>
              <li>
                <strong>Propriedade Intelectual:</strong> Todos os direitos
                sobre o conteúdo da plataforma, incluindo <strong>software</strong>, textos,
                imagens e marcas (ex: logotipos), são de propriedade exclusiva
                do <strong>VemAgendar</strong>.
              </li>
              <li>
                <strong>Modificação de Serviços:</strong> Reservamo-nos o
                direito de modificar, suspender ou descontinuar qualquer
                funcionalidade ou serviço a qualquer momento, mediante aviso
                prévio.
              </li>
              <li>
                <strong>Isenção de Responsabilidade:</strong> Não nos
                responsabilizamos por danos diretos, indiretos ou incidentais
                que possam ocorrer decorrentes do uso (ou incapacidade de uso)
                da plataforma.
              </li>
              <li>
                <strong>Alterações nos Termos:</strong> Estes termos de uso
                podem ser atualizados periodicamente. Manteremos você informado
                sobre quaisquer mudanças substanciais por meio da plataforma ou
                e-mail.
              </li>
              <li>
                <strong>Cancelamento:</strong> Você pode rescindir seu uso da
                plataforma a qualquer momento, contudo, isso não anula o
                cumprimento das obrigações financeiras e legais adquiridas
                durante o período de vigência.
              </li>
            </ul>
          </section>

          {/* --- Política de Privacidade --- */}
          <section className="mb-5">
            <h4 className="text-primary">
              <FaShieldHalved /> Política de Privacidade e Dados
            </h4>
            <p className="text-muted">
              A proteção da sua privacidade e de seus dados é nossa prioridade.
              Esta política detalha como suas informações são coletadas,
              tratadas e protegidas.
            </p>
            <ul className="termos-details-list">
              <li>
                <strong>Informações Coletadas:</strong> Coletamos dados
                pessoais fornecidos no cadastro (nome, e-mail), informações de
                pagamento, dados de navegação e dados inseridos por você para
                o uso do serviço (agendamentos, clientes, funcionários).
              </li>
              <li>
                <strong>Uso das Informações:</strong> Utilizamos suas
                informações estritamente para fornecer, manter, proteger e
                melhorar os serviços oferecidos, para comunicação relevante e
                para fins de análise e segurança.
              </li>
              <li>
                <strong>Compartilhamento:</strong> Suas informações são confidenciais.
                Não as compartilhamos com terceiros, exceto para cumprimento
                legal, com seu consentimento explícito, ou em transações
                corporativas que envolvam a transferência de ativos da empresa.
              </li>
              <li>
                <strong>Segurança:</strong> Empregamos protocolos de segurança
                avançados (criptografia, firewalls, controles de acesso) para
                proteger suas informações contra acesso, alteração, divulgação
                ou destruição não autorizados.
              </li>
              <li>
                <strong>Cookies e Rastreamento:</strong> Utilizamos *cookies* e
                tecnologias similares para melhorar a funcionalidade, analisar o
                tráfego, personalizar conteúdo e medir a eficácia de nossas
                campanhas.
              </li>
              <li>
                <strong>Direitos do Usuário:</strong> Conforme a legislação
                aplicável, você tem o direito de acessar, retificar, solicitar a
                exclusão (direito ao esquecimento) ou se opor ao tratamento de
                suas informações pessoais.
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Termos;