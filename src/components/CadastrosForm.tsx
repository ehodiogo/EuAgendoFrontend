import React, { useState, useEffect, useRef } from "react";
import {
  Form, Button, Card, Row, Col, InputGroup, Tab, Tabs, Alert, Badge, Image, Spinner
} from 'react-bootstrap';
import { Funcionario } from "../interfaces/Funcionario.tsx";
import { ServicoCreate } from "../interfaces/Servico.tsx";
import { Locacao } from "../interfaces/Locacao.tsx";
import { EmpresaCreate } from "../interfaces/Empresa.tsx";
import { Empresa } from "../interfaces/Empresa.tsx";
import { useFetch } from "../functions/GetData.tsx";

interface SubmitResponse {
  success: boolean;
  data?: EmpresaCreate;
  deleted?: boolean;
}

const DEFAULT_INITIAL_DATA: EmpresaCreate = {
  nome: "", tipo: "Serviço", endereco: "", bairro: "", cidade: "", pais: "", estado: "", telefone: "", email: "", logo: "",
  horario_abertura_dia_semana: "08:00", horario_fechamento_dia_semana: "18:00",
  horario_abertura_fim_de_semana: "09:00", horario_fechamento_fim_de_semana: "17:00",
  abre_sabado: false, abre_domingo: false, para_almoco: false,
  horario_pausa_inicio: "12:00", horario_pausa_fim: "13:00", is_online: true,
};

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
    <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4h7.764L13 11H3zM10 2a.5.5 0 0 0-.5-.5h-3A.5.5 0 0 0 6 2h4z"/>
  </svg>
);

interface Limites {
  funcionarios_criados: { empresa: string, total_funcionarios: number }[];
  empresas_criadas: number;
  locacoes_criadas: { empresa: string, total_locativos: number }[];

  limite_empresas: number;
  limite_funcionarios: number;
  limite_locacoes: number;
}

const url = import.meta.env.VITE_API_URL;

interface EmpresaFormProps {
  initialData?: Empresa & {
    funcionarios?: Funcionario[];
    servicos?: ServicoCreate[];
    locacoes?: Locacao[]
  };
  onSubmit: (data: SubmitResponse) => void;
}

const withDefaultFuncionario = (f: Partial<Funcionario>): Funcionario => ({
  id: f.id ?? null,
  nome: f.nome ?? "",
  foto: f.foto ?? "",
});

const withDefaultServico = (s: Partial<ServicoCreate>): ServicoCreate => ({
  id: s.id ?? null,
  nome: s.nome ?? "",
  descricao: s.descricao ?? "",
  duracao: s.duracao ?? "",
  preco: s.preco ?? "",
  funcionarios: Array.isArray(s.funcionarios) ? s.funcionarios : [],
  pontos_gerados: s.pontos_gerados ?? 0,
  pontos_resgate: s.pontos_resgate ?? 0,
});

const withDefaultLocacao = (l: Partial<Locacao>): Locacao => ({
  id: l.id ?? null,
  nome: l.nome ?? "",
  descricao: l.descricao ?? "",
  duracao: l.duracao ?? "",
  preco: l.preco ?? "",
  pontos_gerados: l.pontos_gerados ?? 0,
  pontos_resgate: l.pontos_resgate ?? 0,
});

export default function EmpresaForm({ initialData, onSubmit }: EmpresaFormProps) {
  const { data: empresas, loading } = useFetch<Empresa[]>(
    `/api/empresas-usuario/?usuario_token=${localStorage.getItem("access_token")}`
  );

  const [selectedEmpresaId, setSelectedEmpresaId] = useState<number | 'new'>(
    initialData?.id ? initialData.id : 'new'
  );
  const [empresa, setEmpresa] = useState<EmpresaCreate>(initialData ? { ...initialData } : DEFAULT_INITIAL_DATA);
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [servicos, setServicos] = useState<ServicoCreate[]>([]);
  const [locacoes, setLocacoes] = useState<Locacao[]>([]);
  const [activeTab, setActiveTab] = useState('geral');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [funcionarioFiles, setFuncionarioFiles] = useState<(File | null)[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [limites, setLimites] = useState<Limites | null>(null);
  const [loadingLimites, setLoadingLimites] = useState(true);
  const [,  setErroLimites] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const funcionarioFileRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const fetchLimites = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setErroLimites("Token de acesso não encontrado.");
        setLoadingLimites(false);
        return;
      }

      setLoadingLimites(true);
      setErroLimites(null);

      try {
        const token = localStorage.getItem("access_token");
        const endpoint = `${url}/api/empresa-salvar/?usuario_token=${token}`;

        const response = await fetch(endpoint, {
          method: 'GET',
        });

        if (!response.ok) {
          throw new Error("Falha ao buscar limites.");
        }

        const data = await response.json();
        setLimites(data.limites);
      } catch (error) {
        console.error("Erro ao carregar limites:", error);
        setErroLimites("Não foi possível carregar os limites de criação.");
      } finally {
        setLoadingLimites(false);
      }
    };

    fetchLimites();
  }, [url]);

  useEffect(() => {
    if (selectedEmpresaId === 'new') {
      resetForm();
    } else if (empresas) {
      const selected = empresas.find(e => e.id === selectedEmpresaId);
      if (selected) {
        const { funcionarios: apiFuncionarios, servicos: apiServicos, locacoes: apiLocacoes, ...empresaData } = selected;

        setEmpresa({ ...DEFAULT_INITIAL_DATA, ...empresaData });

        setFuncionarios((apiFuncionarios || []).map(withDefaultFuncionario));

        setServicos((apiServicos || []).map(s => {
          const idsFuncionarios = (s.funcionarios || [])
            .map(f => (typeof f === "object" && f.id != null ? f.id : null))
            .filter((id): id is number => id != null);

          const servico: ServicoCreate = {
            id: s.id ?? null,
            nome: s.nome ?? "",
            preco: String(s.preco ?? ""),
            duracao: String(s.duracao ?? ""),
            funcionarios: idsFuncionarios,
            descricao: s.descricao ?? "",
            pontos_gerados: s.pontos_gerados ?? 0,
            pontos_resgate: s.pontos_resgate ?? 0
          };

          return servico;
        }));

        setLocacoes((apiLocacoes || []).map(withDefaultLocacao));

        setLogoFile(null);
        setFuncionarioFiles(new Array(apiFuncionarios?.length || 0).fill(null));
      }
    }
    setActiveTab('geral');
  }, [selectedEmpresaId, empresas]);

  const resetForm = () => {
    setEmpresa(DEFAULT_INITIAL_DATA);
    setFuncionarios([]);
    setServicos([]);
    setLocacoes([]);
    setLogoFile(null);
    setFuncionarioFiles([]);
    setSubmitStatus('idle');
  };

  const handleChangeEmpresa = <K extends keyof EmpresaCreate>(
    field: K,
    value: EmpresaCreate[K]
  ) => {
    setEmpresa(prev => ({ ...prev, [field]: value }));
  };

  const validateFile = (file: File): boolean => {
    const maxSize = 5 * 1024 * 1024;
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (file.size > maxSize) {
      alert(`Arquivo muito grande: ${file.name} (máx. 5MB)`);
      return false;
    }
    if (!validTypes.includes(file.type)) {
      alert(`Tipo inválido: ${file.name} (use JPG, PNG ou WebP)`);
      return false;
    }
    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file && validateFile(file)) {
      setLogoFile(file);
      handleChangeEmpresa("logo", URL.createObjectURL(file));
    } else {
      setLogoFile(null);
      handleChangeEmpresa("logo", "");
    }
  };

  const handleFuncionarioFileChange = (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file && validateFile(file)) {
      const newFiles = [...funcionarioFiles];
      newFiles[idx] = file;
      setFuncionarioFiles(newFiles);
      updateFuncionario(idx, "foto", URL.createObjectURL(file));
    } else {
      const newFiles = [...funcionarioFiles];
      newFiles[idx] = null;
      setFuncionarioFiles(newFiles);
      updateFuncionario(idx, "foto", "");
    }
  };

  const handleDrop = (e: React.DragEvent, idx: number | null = null) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && validateFile(file)) {
      if (idx !== null) {
        const newFiles = [...funcionarioFiles];
        newFiles[idx] = file;
        setFuncionarioFiles(newFiles);
        updateFuncionario(idx, "foto", URL.createObjectURL(file));
      } else {
        setLogoFile(file);
        handleChangeEmpresa("logo", URL.createObjectURL(file));
      }
    }
  };

  const createUpdater = <T,>(
    state: T[],
    setState: React.Dispatch<React.SetStateAction<T[]>>
  ) => (idx: number, field: keyof T, value: T[keyof T]) => {
    const copy = [...state];
    copy[idx] = { ...copy[idx], [field]: value };
    setState(copy);
  };

  const updateFuncionario = createUpdater(funcionarios, setFuncionarios);
  const updateServico = createUpdater(servicos, setServicos);
  const updateLocacao = createUpdater(locacoes, setLocacoes);

  const addFuncionario = () => {
    setFuncionarios([...funcionarios, withDefaultFuncionario({})]);
    setFuncionarioFiles([...funcionarioFiles, null]);
  };

  const removeFuncionario = (idx: number) => {
    const funcionarioRemovido = funcionarios[idx];
    const idRemovido = funcionarioRemovido?.id;

    setFuncionarios(funcionarios.filter((_, i) => i !== idx));
    setFuncionarioFiles(funcionarioFiles.filter((_, i) => i !== idx));

    if (idRemovido != null) {
      setServicos(servicos.map(s => ({
        ...s,
        funcionarios: (s.funcionarios as number[]).filter(id => id !== idRemovido)
      })));
    }
  };

  const addServico = () => setServicos([...servicos, withDefaultServico({})]);
  const addLocacao = () => setLocacoes([...locacoes, withDefaultLocacao({})]);

  const removeServico = (idx: number) => setServicos(servicos.filter((_, i) => i !== idx));
  const removeLocacao = (idx: number) => setLocacoes(locacoes.filter((_, i) => i !== idx));

  const handleDeleteEmpresa = async () => {
    if (!window.confirm(`Tem certeza que deseja EXCLUIR permanentemente a empresa "${empresa.nome}"?`)) return;

    const formData = new FormData();
    formData.append("usuario_token", localStorage.getItem("access_token") || "");
    formData.append("acao", "excluir");
    formData.append("empresa_id", selectedEmpresaId.toString());

    try {
      const response = await fetch(`${url}/api/empresa-salvar/?id=${selectedEmpresaId}`, {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        alert("Empresa excluída com sucesso!");
        onSubmit({ success: true, deleted: true });
        resetForm();
        setSelectedEmpresaId('new');
      } else {
        throw new Error("Falha ao excluir");
      }
    } catch (err) {
      alert("Erro ao excluir empresa.");
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    const formData = new FormData();
    const isNew = selectedEmpresaId === 'new';

    if (logoFile) formData.append("logo", logoFile, logoFile.name);
    else if (empresa.logo && !empresa.logo.startsWith('blob:')) formData.append("logo", empresa.logo);

    Object.entries(empresa).forEach(([key, value]) => {
      if (key === 'logo' && typeof value === 'string' && value.startsWith('blob:')) return;
      formData.append(key, typeof value === 'boolean' ? value.toString() : value);
    });

    const funcionariosData = funcionarios.map((f, idx) => ({
      id: f.id,
      nome: f.nome,
      foto: funcionarioFiles[idx] ? "" : f.foto,
    }));
    formData.append("funcionarios_json", JSON.stringify(funcionariosData));


    funcionarioFiles.forEach((file, idx) => {
      if (file) {
        formData.append(`funcionario_foto_${idx}`, file, file.name);
      } else if (funcionarios[idx]?.foto && !funcionarios[idx].foto.startsWith('blob:')) {
        formData.append(`funcionario_foto_${idx}`, funcionarios[idx].foto);
      }
    });

    if (empresa.tipo === "Serviço") {
      formData.append("servicos_json", JSON.stringify(servicos));
    } else if (empresa.tipo === "Locação") {
      formData.append("locacoes_json", JSON.stringify(locacoes));
    }

    if (!isNew) formData.append("empresa_id", selectedEmpresaId.toString());
    formData.append("acao", isNew ? "cadastrar" : "editar");

    formData.append("usuario_token", localStorage.getItem("access_token") || "");

    try {
      const response = await fetch(`${url}/api/empresa-salvar/`, {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        setSubmitStatus('success');
        onSubmit({ success: true, data: await response.json() });
      } else {
        throw new Error('Falha ao salvar');
      }
    } catch (err) {
      setSubmitStatus('error');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || loadingLimites) return (
    <Alert variant="info" className="text-center">
      <Spinner animation="border" size="sm" /> Carregando empresas...
    </Alert>
  );

  return (
    <Card className="shadow-lg mb-5 border-0 rounded-4" style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <Card.Header as="h3" className="text-white p-4 rounded-top-4" style={{ backgroundColor: '#003087' }}>
        {selectedEmpresaId === 'new' ? 'Novo Cadastro' : `Gerenciamento: ${empresa.nome}`}
      </Card.Header>

      <Card.Body className="p-5">
          {limites && (
            <Card className="mb-4 p-4 border-info shadow-sm" style={{ backgroundColor: '#e9f5ff' }}>
              <h5 className="fw-bolder mb-3 d-flex align-items-center" style={{ color: '#003087' }}>
                📊 Seus Limites de Criação (Plano)
              </h5>

              <Row className="g-4 mb-4 pb-3 border-bottom">

                <Col md={4} className="border-end">
                  <p className="fw-bolder mb-1 text-primary">Empresas</p>
                  <h4 className="fw-bold mb-0">
                    {limites.empresas_criadas} / {limites.limite_empresas}
                  </h4>
                  <small className="text-muted">Criadas / Permitidas</small>
                </Col>
              </Row>

              <Row className="g-3">
                <Col md={6}>
                  <p className="fw-bolder mb-2 text-success">Funcionários por Empresa (Serviço)</p>
                  {limites.funcionarios_criados && limites.funcionarios_criados.length > 0 ? (
                    <ul className="list-unstyled small mb-0 p-2 rounded" style={{ backgroundColor: '#e9ffe9' }}>
                      {limites.funcionarios_criados.map((l, index) => (
                        <li key={index} className="mb-1 d-flex justify-content-between">
                          <span><strong>{l.empresa}:</strong></span>
                          <Badge bg="success" className="ms-1">{l.total_funcionarios}/{limites.limite_funcionarios}</Badge>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="small text-muted mb-0">Nenhuma empresa de serviço encontrada.</p>
                  )}
                </Col>

                <Col md={6}>
                  <p className="fw-bolder mb-2 text-warning">Locações por Empresa (Locação)</p>
                  {limites.locacoes_criadas && limites.locacoes_criadas.length > 0 ? (
                    <ul className="list-unstyled small mb-0 p-2 rounded" style={{ backgroundColor: '#fffbe6' }}>
                      {limites.locacoes_criadas.map((l, index) => (
                        <li key={index} className="mb-1 d-flex justify-content-between">
                          <span><strong>{l.empresa}:</strong></span>
                          <Badge bg="warning" className="ms-1">{l.total_locativos}/{limites.limite_locacoes}</Badge>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="small text-muted mb-0">Nenhuma empresa de locação encontrada.</p>
                  )}
                </Col>
              </Row>
            </Card>
          )}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-5 p-4 rounded-3 shadow-sm" style={{ backgroundColor: '#f0f5f9' }}>
            <Form.Label className="h5 fw-bolder" style={{ color: '#003087' }}>Selecionar Empresa</Form.Label>
            <Form.Select
              value={selectedEmpresaId}
              onChange={(e) => setSelectedEmpresaId(e.target.value === 'new' ? 'new' : parseInt(e.target.value))}
              size="lg"
            >
              <option value="new">-- Nova Empresa --</option>
              {empresas?.map(e => (
                <option key={e.id} value={e.id}>
                  {e.nome} <Badge bg={e.tipo === 'Serviço' ? 'info' : 'warning'}>{e.tipo.toUpperCase()}</Badge>
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Tabs activeKey={activeTab} onSelect={k => setActiveTab(k as string)} className="mb-4 fw-bolder" variant="underline">
            <Tab eventKey="geral" title="1. Dados Gerais">
              <div className="p-4 rounded mt-3 border bg-light">
                <h4 className="mb-4 fw-bold" style={{ color: '#005f99' }}>Informações Essenciais</h4>
                <Row className="mb-3">
                  <Form.Group as={Col} md="6">
                    <Form.Label className="fw-bolder">Nome da Empresa</Form.Label>
                    <Form.Control type="text" placeholder="Nome" value={empresa.nome} onChange={e => handleChangeEmpresa("nome", e.target.value)} required />
                  </Form.Group>
                  <Form.Group as={Col} md="6">
                    <Form.Label className="fw-bolder">Tipo de Negócio</Form.Label>
                    <Form.Select value={empresa.tipo} onChange={e => handleChangeEmpresa("tipo", e.target.value as "Serviço" | "Locação")}>
                      <option value="Serviço">Serviço (Agendamento)</option>
                      <option value="Locação">Locação (Quadras/Espaços)</option>
                    </Form.Select>
                  </Form.Group>
                </Row>

                <h4 className="mb-3 border-top pt-3 fw-bold" style={{ color: '#005f99' }}>Logo e Contato</h4>
                <Row className="mb-4 align-items-center">
                  <Col md={6}>
                    <Form.Label className="fw-bolder">Upload da Logo</Form.Label>
                    <div
                      className="border rounded p-3 text-center"
                      onDrop={e => handleDrop(e)} onDragOver={e => e.preventDefault()}
                      style={{ backgroundColor: '#f8f9fa' }}
                    >
                      <input type="file" accept="image/*" className="form-control" ref={fileInputRef} onChange={handleFileChange} />
                      <Form.Text className="text-muted">Arraste ou selecione (máx. 5MB)</Form.Text>
                    </div>
                  </Col>
                  <Col md={6}>
                    {empresa.logo && (
                      <div className="mt-3 border p-2 text-center rounded bg-white shadow-sm">
                        <Form.Label className="small fw-bolder mb-1">Prévia</Form.Label>
                        <Image src={empresa.logo} roundedCircle width={80} height={80} style={{ objectFit: 'cover' }} />
                      </div>
                    )}
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Form.Group as={Col} md="6">
                    <Form.Label className="fw-bolder">Telefone</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>Telefone</InputGroup.Text>
                      <Form.Control type="tel" placeholder="(00) 00000-0000" value={empresa.telefone} onChange={e => handleChangeEmpresa("telefone", e.target.value)} />
                    </InputGroup>
                  </Form.Group>
                  <Form.Group as={Col} md="6">
                    <Form.Label className="fw-bolder">Email</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>Email</InputGroup.Text>
                      <Form.Control type="email" placeholder="contato@empresa.com" value={empresa.email} onChange={e => handleChangeEmpresa("email", e.target.value)} />
                    </InputGroup>
                  </Form.Group>
                </Row>

                <h4 className="mb-3 border-top pt-3 fw-bold" style={{ color: '#005f99' }}>Localização</h4>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bolder">Endereço Completo</Form.Label>
                  <Form.Control type="text" placeholder="Rua, Número, Complemento" value={empresa.endereco} onChange={e => handleChangeEmpresa("endereco", e.target.value)} />
                </Form.Group>
                <Row>
                  <Form.Group as={Col} md="3">
                    <Form.Label className="fw-bolder">Bairro</Form.Label>
                    <Form.Control type="text" placeholder="Bairro" value={empresa.bairro} onChange={e => handleChangeEmpresa("bairro", e.target.value)} />
                  </Form.Group>
                  <Form.Group as={Col} md="3">
                    <Form.Label className="fw-bolder">Cidade</Form.Label>
                    <Form.Control type="text" placeholder="Cidade" value={empresa.cidade} onChange={e => handleChangeEmpresa("cidade", e.target.value)} />
                  </Form.Group>
                  <Form.Group as={Col} md="3">
                    <Form.Label className="fw-bolder">UF</Form.Label>
                    <Form.Control type="text" placeholder="UF" value={empresa.estado} onChange={e => handleChangeEmpresa("estado", e.target.value)} />
                  </Form.Group>
                  <Form.Group as={Col} md="3">
                    <Form.Label className="fw-bolder">País</Form.Label>
                    <Form.Control type="text" placeholder="País" value={empresa.pais} onChange={e => handleChangeEmpresa("pais", e.target.value)} />
                  </Form.Group>
                </Row>
                <Form.Check
                  type="switch"
                  id="is-online-switch"
                  label="Atendimento virtual/online"
                  checked={empresa.is_online}
                  onChange={e => handleChangeEmpresa("is_online", e.target.checked)}
                  className="mt-4 fw-bolder"
                />
              </div>
            </Tab>

            <Tab eventKey="horarios" title="2. Horários de Operação">
              <div className="p-4 rounded mt-3 border bg-light">
                <h4 className="mb-3 fw-bold" style={{ color: '#005f99' }}>Padrão (Segunda a Sexta)</h4>
                <Row className="mb-4">
                  <Col md="6">
                    <Form.Label className="fw-bolder">Abertura</Form.Label>
                    <Form.Control type="time" value={empresa.horario_abertura_dia_semana} onChange={e => handleChangeEmpresa("horario_abertura_dia_semana", e.target.value)} />
                  </Col>
                  <Col md="6">
                    <Form.Label className="fw-bolder">Fechamento</Form.Label>
                    <Form.Control type="time" value={empresa.horario_fechamento_dia_semana} onChange={e => handleChangeEmpresa("horario_fechamento_dia_semana", e.target.value)} />
                  </Col>
                </Row>

                <h4 className="mb-3 border-top pt-3 fw-bold" style={{ color: '#005f99' }}>Fim de Semana</h4>
                <Row className="mb-4 align-items-center">
                  <Col md="3">
                    <Form.Check type="switch" id="abre-sabado-switch" label="Abre Sábado" checked={empresa.abre_sabado} onChange={e => handleChangeEmpresa("abre_sabado", e.target.checked)} className="fw-bolder" />
                  </Col>
                  <Col md="3">
                    <Form.Check type="switch" id="abre-domingo-switch" label="Abre Domingo" checked={empresa.abre_domingo} onChange={e => handleChangeEmpresa("abre_domingo", e.target.checked)} className="fw-bolder" />
                  </Col>
                  <Col md="3">
                    <Form.Label className="small fw-bolder">Abertura Sáb/Dom</Form.Label>
                    <Form.Control type="time" value={empresa.horario_abertura_fim_de_semana} onChange={e => handleChangeEmpresa("horario_abertura_fim_de_semana", e.target.value)} disabled={!empresa.abre_sabado && !empresa.abre_domingo} />
                  </Col>
                  <Col md="3">
                    <Form.Label className="small fw-bolder">Fechamento Sáb/Dom</Form.Label>
                    <Form.Control type="time" value={empresa.horario_fechamento_fim_de_semana} onChange={e => handleChangeEmpresa("horario_fechamento_fim_de_semana", e.target.value)} disabled={!empresa.abre_sabado && !empresa.abre_domingo} />
                  </Col>
                </Row>

                <h4 className="mb-3 border-top pt-3 fw-bold" style={{ color: '#005f99' }}>Pausa/Almoço</h4>
                <Row className="mb-3">
                  <Col md="12">
                    <Form.Check type="switch" id="para-almoco-switch" label="Possui pausa no meio do dia" checked={empresa.para_almoco} onChange={e => handleChangeEmpresa("para_almoco", e.target.checked)} className="fw-bolder" />
                  </Col>
                  <Col md="6">
                    <Form.Label className="small fw-bolder">Início da Pausa</Form.Label>
                    <Form.Control type="time" value={empresa.horario_pausa_inicio} onChange={e => handleChangeEmpresa("horario_pausa_inicio", e.target.value)} disabled={!empresa.para_almoco} />
                  </Col>
                  <Col md="6">
                    <Form.Label className="small fw-bolder">Fim da Pausa</Form.Label>
                    <Form.Control type="time" value={empresa.horario_pausa_fim} onChange={e => handleChangeEmpresa("horario_pausa_fim", e.target.value)} disabled={!empresa.para_almoco} />
                  </Col>
                </Row>
              </div>
            </Tab>

            {empresa.tipo === "Serviço" && (
              <Tab eventKey="servicos_funcionarios" title="3. Catálogo, Equipe e Fidelidade">
                <Alert variant="info" className="mt-3 fw-bold">
                  Defina sua equipe e associe serviços aos profissionais.
                </Alert>

                <h4 className="mb-3 mt-4 fw-bolder" style={{ color: '#003087' }}>
                  Equipe ({funcionarios.length})
                </h4>
                <div className="p-3 rounded mb-4" style={{ backgroundColor: '#e8f0fe', border: '1px solid #c9dfff' }}>
                  {funcionarios.map((f, idx) => (
                    <Card key={f.id ?? idx} className="mb-3 p-3 border-primary shadow-sm">
                      <Row className="g-3 align-items-center">
                        <Col md={3}>
                          <Form.Label className="fw-bolder small">Foto</Form.Label>
                          <div
                            className="border rounded p-3 text-center"
                            onDrop={e => handleDrop(e, idx)}
                            onDragOver={e => e.preventDefault()}
                            style={{ backgroundColor: '#f8f9fa' }}
                          >
                            <input
                              type="file"
                              accept="image/*"
                              className="form-control form-control-sm"
                              ref={el => funcionarioFileRefs.current[idx] = el}
                              onChange={e => handleFuncionarioFileChange(idx, e)}
                            />
                            {f.foto ? (
                              <div className="mt-2">
                                <Image
                                  src={f.foto}
                                  roundedCircle
                                  width={60}
                                  height={60}
                                  style={{ objectFit: 'cover', border: '2px solid #003087' }}
                                />
                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                  className="d-block mx-auto mt-1"
                                  onClick={() => {
                                    updateFuncionario(idx, "foto", "");
                                    const newFiles = [...funcionarioFiles];
                                    newFiles[idx] = null;
                                    setFuncionarioFiles(newFiles);
                                  }}
                                >
                                  Remover
                                </Button>
                              </div>
                            ) : (
                              <Form.Text className="text-muted small">Arraste ou clique</Form.Text>
                            )}
                          </div>
                        </Col>
                        <Col md={7}>
                          <Form.Label className="fw-bolder small">Nome</Form.Label>
                          <Form.Control
                            placeholder="Nome do profissional"
                            value={f.nome}
                            onChange={e => updateFuncionario(idx, "nome", e.target.value)}
                          />
                        </Col>
                        <Col md={2} className="text-end">
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => {
                              if (window.confirm(`Remover "${f.nome || 'funcionário'}"?`)) {
                                removeFuncionario(idx);
                              }
                            }}
                          >
                            <TrashIcon />
                          </Button>
                        </Col>
                      </Row>
                    </Card>
                  ))}
                  <Button onClick={addFuncionario} variant="primary" size="sm" className="fw-bold">
                    + Adicionar Profissional
                  </Button>
                </div>

                <h4 className="mb-3 mt-5 fw-bolder" style={{ color: '#003087' }}>
                  Catálogo de Serviços ({servicos.length})
                </h4>
                <div className="p-3 rounded" style={{ backgroundColor: '#f9fff7', border: '1px solid #d4edda' }}>
                  {servicos.map((s, idx) => (
                    <Card key={idx} className="mb-4 p-3 border-success shadow-sm">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="fw-bold mb-0">
                          Serviço: {s.nome || "(Novo serviço)"}
                        </h6>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => {
                            if (window.confirm(`Remover serviço "${s.nome || 'sem nome'}"?`)) {
                              removeServico(idx);
                            }
                          }}
                        >
                          <TrashIcon /> Remover
                        </Button>
                      </div>

                      <Row className="g-3 mb-3">
                        <Col md={4}>
                          <Form.Label className="small fw-semibold">Nome</Form.Label>
                          <Form.Control
                            value={s.nome}
                            onChange={e => updateServico(idx, "nome", e.target.value)}
                            placeholder="Ex: Corte Masculino"
                          />
                        </Col>
                        <Col md={4}>
                          <Form.Label className="small fw-semibold">Descrição</Form.Label>
                          <Form.Control
                            value={s.descricao}
                            onChange={e => updateServico(idx, "descricao", e.target.value)}
                            placeholder="Breve descrição"
                          />
                        </Col>
                        <Col md={2}>
                          <Form.Label className="small fw-semibold">Duração</Form.Label>
                          <InputGroup>
                            <Form.Control
                              value={s.duracao}
                              onChange={e => updateServico(idx, "duracao", e.target.value)}
                              placeholder="60"
                            />
                            <InputGroup.Text>min</InputGroup.Text>
                          </InputGroup>
                        </Col>
                        <Col md={2}>
                          <Form.Label className="small fw-semibold">Preço</Form.Label>
                          <InputGroup>
                            <InputGroup.Text>R$</InputGroup.Text>
                            <Form.Control
                              type="number"
                              value={s.preco}
                              onChange={e => updateServico(idx, "preco", e.target.value)}
                              placeholder="0"
                            />
                          </InputGroup>
                        </Col>
                      </Row>

                      <div className="border-top pt-3">
                        <Form.Label className="small fw-bolder text-primary">
                          Profissionais que realizam este serviço
                        </Form.Label>
                        <div className="d-flex flex-wrap gap-2">
                          <span className="text-muted small">O funcionário ainda não cadastrado e salvo não pode ser adicionado ao serviço.</span>
                        </div>
                        <div className="d-flex flex-wrap gap-2">
                          {funcionarios.length === 0 ? (
                              <span className="text-muted small"><strong>Nenhum profissional cadastrado.</strong></span>
                          ) : (
                            funcionarios.map(func => {
                              const funcId = func.id;
                              const funcNome = func.nome?.trim() || "(sem nome)";
                              const isSelected = funcId != null && Array.isArray(s.funcionarios) && s.funcionarios.includes(funcId);

                              return (
                                <Form.Check
                                  key={func.id ?? `new-${idx}`}
                                  type="checkbox"
                                  id={`func-${idx}-${func.id ?? idx}`}
                                  label={
                                    <span className="d-flex align-items-center">
                                      {func.foto && (
                                        <Image
                                          src={func.foto}
                                          roundedCircle
                                          width={24}
                                          height={24}
                                          className="me-1"
                                          style={{ objectFit: "cover" }}
                                        />
                                      )}
                                      <span className="fw-medium">{funcNome}</span>
                                    </span>
                                  }
                                  checked={isSelected}
                                  onChange={() => {
                                    if (funcId == null) return;
                                    const updated = isSelected
                                      ? (s.funcionarios as number[]).filter(id => id !== funcId)
                                      : [...(s.funcionarios as number[]), funcId];
                                    updateServico(idx, "funcionarios", updated);
                                  }}
                                  className="me-3"
                                />
                              );
                            })
                          )}
                        </div>
                      </div>

                      <Row className="g-3 mt-3 pt-3 border-top">
                        <Col md={6}>
                          <Form.Label className="small fw-bolder text-success">Pontos Gerados</Form.Label>
                          <InputGroup>
                            <Form.Control
                              type="number"
                              value={s.pontos_gerados}
                              onChange={e => updateServico(idx, "pontos_gerados", e.target.value)}
                            />
                            <InputGroup.Text>Pontos</InputGroup.Text>
                          </InputGroup>
                        </Col>
                        <Col md={6}>
                          <Form.Label className="small fw-bolder text-success">Pontos para Resgate</Form.Label>
                          <InputGroup>
                            <Form.Control
                              type="number"
                              value={s.pontos_resgate}
                              onChange={e => updateServico(idx, "pontos_resgate", e.target.value)}
                            />
                            <InputGroup.Text>Pontos</InputGroup.Text>
                          </InputGroup>
                        </Col>
                      </Row>
                    </Card>
                  ))}

                  <Button onClick={addServico} variant="success" size="sm" className="fw-bold">
                    + Adicionar Serviço
                  </Button>
                </div>
              </Tab>
            )}

            {empresa.tipo === "Locação" && (
              <Tab eventKey="locacoes" title="3. Catálogo de Quadras/Espaços">
                <Alert variant="warning" className="mt-3 fw-bold">Defina as locações, preço e regras de fidelidade.</Alert>
                <h4 className="mb-3 mt-4 fw-bolder" style={{ color: '#003087' }}>Catálogo de Locações ({locacoes.length})</h4>
                <div className="p-3 rounded" style={{ backgroundColor: '#fffbe8', border: '1px solid #ffeb3b' }}>
                  {locacoes.map((l, idx) => (
                    <Card key={idx} className="mb-4 p-3 border-warning shadow-sm">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="fw-bold mb-0">Locação: {l.nome || "(Nova)"}</h6>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => {
                            if (window.confirm(`Remover locação "${l.nome || 'sem nome'}"?`)) {
                              removeLocacao(idx);
                            }
                          }}
                        >
                          <TrashIcon /> Remover
                        </Button>
                      </div>
                      <Row className="g-3">
                        <Col md={3}>
                          <Form.Label className="small fw-semibold">Nome</Form.Label>
                          <Form.Control value={l.nome} onChange={e => updateLocacao(idx, "nome", e.target.value)} />
                        </Col>
                        <Col md={3}>
                          <Form.Label className="small fw-semibold">Descrição</Form.Label>
                          <Form.Control value={l.descricao} onChange={e => updateLocacao(idx, "descricao", e.target.value)} />
                        </Col>
                        <Col md={2}>
                          <Form.Label className="small fw-semibold">Duração</Form.Label>
                          <Form.Control value={l.duracao} onChange={e => updateLocacao(idx, "duracao", e.target.value)} />
                        </Col>
                        <Col md={2}>
                          <Form.Label className="small fw-semibold">Preço</Form.Label>
                          <InputGroup>
                            <InputGroup.Text>R$</InputGroup.Text>
                            <Form.Control type="number" value={l.preco} onChange={e => updateLocacao(idx, "preco", e.target.value)} />
                          </InputGroup>
                        </Col>
                      </Row>
                      <Row className="g-3 mt-2 pt-2 border-top">
                        <Col md={6}>
                          <Form.Label className="small fw-bolder" style={{ color: '#ff6600' }}>Pontos Gerados</Form.Label>
                          <InputGroup>
                            <Form.Control type="number" value={l.pontos_gerados} onChange={e => updateLocacao(idx, "pontos_gerados", e.target.value)} />
                            <InputGroup.Text>Pontos</InputGroup.Text>
                          </InputGroup>
                        </Col>
                        <Col md={6}>
                          <Form.Label className="small fw-bolder" style={{ color: '#ff6600' }}>Pontos para Resgate</Form.Label>
                          <InputGroup>
                            <Form.Control type="number" value={l.pontos_resgate} onChange={e => updateLocacao(idx, "pontos_resgate", e.target.value)} />
                            <InputGroup.Text>Pontos</InputGroup.Text>
                          </InputGroup>
                        </Col>
                      </Row>
                    </Card>
                  ))}
                  <Button onClick={addLocacao} variant="warning" size="sm" className="mt-3 fw-bold text-white">
                    + Adicionar Locação
                  </Button>
                </div>
              </Tab>
            )}
          </Tabs>

          <div className="text-center mt-5 pt-4 border-top">
            {selectedEmpresaId !== 'new' && (
              <>
                <Button
                  variant="outline-danger"
                  size="lg"
                  onClick={handleDeleteEmpresa}
                  className="me-4 fw-bolder"
                  disabled={isSubmitting}
                >
                  Excluir Empresa
                </Button>
                <Button type="submit" variant="success" size="lg" className="fw-bolder px-5" disabled={isSubmitting}>
                  {isSubmitting ? <Spinner animation="border" size="sm" /> : 'Salvar'}
                </Button>
              </>
            )}
            {selectedEmpresaId === 'new' && (
              <Button type="submit" variant="success" size="lg" className="fw-bolder px-5" disabled={isSubmitting}>
                {isSubmitting ? <Spinner animation="border" size="sm" /> : 'Cadastrar'}
              </Button>
            )}
            {submitStatus === 'success' && <Alert variant="success" className="mt-3">Salvo com sucesso!</Alert>}
            {submitStatus === 'error' && <Alert variant="danger" className="mt-3">Erro ao salvar. Verifique os dados.</Alert>}
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}