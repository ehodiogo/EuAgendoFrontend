import Navbar from "../components/Navbar";

function Termos() {
  return (
    <div>
      <Navbar />
      <div className="container mt-5">
        <section className="text-center mb-5">
          <h1 className="display-3 text-primary">
            Termos de Uso e Políticas de Privacidade
          </h1>
          <p className="lead text-muted">
            Antes de utilizar nossos serviços, leia atentamente nossos Termos de
            Uso e Política de Privacidade.
          </p>
        </section>

        <section className="mb-5">
          <h4 className="text-primary">Termos de Uso</h4>
          <p className="text-muted">
            Ao acessar e utilizar nossa plataforma, você concorda com os
            seguintes termos:
          </p>
          <ul className="text-muted">
            <li>
              <strong>Licença de uso:</strong> O acesso ao serviço é concedido
              com base em uma licença limitada, pessoal, intransferível e não
              exclusiva.
            </li>
            <li>
              <strong>Responsabilidade do Usuário:</strong> O usuário se
              compromete a utilizar os serviços de forma ética e responsável,
              não infringindo direitos de terceiros.
            </li>
            <li>
              <strong>Propriedade intelectual:</strong> Todos os direitos sobre
              o conteúdo da plataforma, incluindo, mas não limitado a, textos,
              imagens, logotipos, e software, são de propriedade exclusiva da
              empresa.
            </li>
            <li>
              <strong>Modificação de serviços:</strong> A empresa se reserva o
              direito de modificar, suspender ou descontinuar qualquer
              funcionalidade ou serviço a qualquer momento.
            </li>
            <li>
              <strong>Isenção de responsabilidade:</strong> A empresa não se
              responsabiliza por danos diretos ou indiretos que possam ocorrer
              durante o uso da plataforma.
            </li>
            <li>
              <strong>Alterações nos Termos:</strong> A empresa pode atualizar
              os termos de uso periodicamente, e você será notificado sempre que
              isso ocorrer.
            </li>
            <li>
              <strong>Cancelamento:</strong> Você pode cancelar seu uso da
              plataforma a qualquer momento, mas isso não isenta o cumprimento
              das obrigações adquiridas durante o uso.
            </li>
          </ul>
        </section>

        <section className="mb-5">
          <h4 className="text-primary">Política de Privacidade</h4>
          <p className="text-muted">
            A proteção da sua privacidade é fundamental para nós. Esta política
            explica como coletamos, usamos e protegemos suas informações
            pessoais.
          </p>
          <ul className="text-muted">
            <li>
              <strong>Informações coletadas:</strong> Coletamos informações
              pessoais como nome, e-mail, telefone, e dados de navegação. Essas
              informações são coletadas quando você se registra, utiliza nossos
              serviços ou interage com a plataforma.
            </li>
            <li>
              <strong>Uso das informações:</strong> Utilizamos suas informações
              para fornecer os serviços solicitados, melhorar a experiência do
              usuário, enviar comunicações sobre novos serviços e promoções e
              para fins de análise de dados.
            </li>
            <li>
              <strong>Compartilhamento de informações:</strong> Não
              compartilhamos suas informações pessoais com terceiros, exceto
              quando necessário para cumprir com a legislação aplicável ou em
              caso de vendas de ativos da empresa.
            </li>
            <li>
              <strong>Segurança das informações:</strong> Implementamos medidas
              de segurança físicas, eletrônicas e administrativas para proteger
              suas informações pessoais contra acesso não autorizado ou
              divulgação.
            </li>
            <li>
              <strong>Cookies:</strong> Usamos cookies para melhorar a
              experiência do usuário, analisar o tráfego da plataforma e
              personalizar o conteúdo.
            </li>
            <li>
              <strong>Alterações na Política de Privacidade:</strong> A qualquer
              momento, a empresa poderá atualizar esta política. Quaisquer
              mudanças serão notificadas ao usuário por meio da plataforma.
            </li>
            <li>
              <strong>Direitos do Usuário:</strong> Você tem o direito de
              acessar, corrigir ou excluir suas informações pessoais, bem como
              de se opor ao tratamento dessas informações.
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}

export default Termos;
