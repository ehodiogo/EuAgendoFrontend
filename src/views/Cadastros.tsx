import { useState } from "react";
import Navbar from "../components/Navbar.tsx";
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Alert from 'react-bootstrap/Alert';
import {Button} from "react-bootstrap";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import EmpresaForm from "../components/CadastrosForm.tsx";
import { EmpresaCreate } from "../interfaces/Empresa.tsx";

interface SubmitResponse {
  success: boolean;
  data?: EmpresaCreate;
  deleted?: boolean;
}

const CheckCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" viewBox="0 0 16 16" className="me-2">
    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022l-3.477 4.542-1.777-1.777a.75.75 0 0 0-1.06 1.06l2.48 2.48a.75.75 0 0 0 1.137-.089l4.086-5.467a.75.75 0 0 0-.022-1.08z"/>
  </svg>
);


export default function Cadastros() {
  const [empresaSalva, setEmpresaSalva] = useState<EmpresaCreate | null>(null);

  const handleSubmit = (data: SubmitResponse) => {
    if (data.success && data.data) {
        setEmpresaSalva(data.data);
    } else if (data.success && data.deleted) {
        setEmpresaSalva(null);
    } else {
        setEmpresaSalva(null);
    }
  };

  return (
    <>
        <Navbar />
    <Container className="my-5">

      {empresaSalva && (
        <Card className="mb-5 border-success shadow-lg rounded-4">
          <Card.Header as="h3" className="bg-success text-white p-4 rounded-top-4 d-flex align-items-center">
            <CheckCircleIcon />
            {empresaSalva ? 'Atualização Concluída!' : 'Cadastro Realizado com Sucesso!'}
          </Card.Header>
          <Card.Body className="p-4">
            <Alert variant="success" className="d-flex align-items-center p-3">
              <span className="h5 fw-bold mb-0 text-success">
                  🎉 A empresa <strong>{empresaSalva.nome}</strong> ({empresaSalva.tipo}) foi salva.
              </span>
            </Alert>

            <Row className="mt-4 align-items-center border-top pt-3">
                <Col md={2} className="text-center">
                    {empresaSalva.logo ? (
                        <Image
                            src={empresaSalva.logo}
                            roundedCircle
                            width={100}
                            height={100}
                            style={{ objectFit: 'cover', border: '3px solid #198754' }}
                            alt="Logo da Empresa"
                        />
                    ) : (
                        <div className="bg-light p-4 rounded-circle border text-muted small fw-bold">Sem Logo</div>
                    )}
                </Col>
                <Col md={10}>
                    <h5 className="fw-bolder" style={{ color: '#0f5132' }}>Detalhes Rápidos:</h5>
                    <p className="mb-1">
                        <strong>Local:</strong> {empresaSalva.cidade} / {empresaSalva.estado}
                    </p>
                    <p className="mb-1">
                        <strong>Contato:</strong> {empresaSalva.telefone} | {empresaSalva.email}
                    </p>
                </Col>
            </Row>

            <div className="text-end mt-4">
                <Button
                    variant="outline-success"
                    onClick={() => setEmpresaSalva(null)}
                >
                    Entendido
                </Button>
            </div>
          </Card.Body>
        </Card>
      )}
      <EmpresaForm onSubmit={handleSubmit} />

    </Container>
    </>
  );
}