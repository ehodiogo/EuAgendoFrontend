import React from 'react';
import { FaFilter, FaTimes, FaGlobe, FaCity, FaMap, FaHome, FaBuilding, FaBroom } from 'react-icons/fa';

interface FilterModalProps {
    show: boolean;
    onClose: () => void;
    onApply: () => void;
    onClear: () => void;
    cidade: string;
    setCidade: React.Dispatch<React.SetStateAction<string>>;
    estado: string;
    setEstado: React.Dispatch<React.SetStateAction<string>>;
    bairro: string;
    setBairro: React.Dispatch<React.SetStateAction<string>>;
    pais: string;
    setPais: React.Dispatch<React.SetStateAction<string>>;
    tipoEmpresa: string;
    setTipoEmpresa: React.Dispatch<React.SetStateAction<string>>;
    tiposDisponiveis: string[];
    estados: string[];
}

const FilterModal: React.FC<FilterModalProps> = ({
    show, onClose, onApply, onClear,
    cidade, setCidade, estado, setEstado, bairro, setBairro, pais, setPais,
    tipoEmpresa, setTipoEmpresa, tiposDisponiveis, estados
}) => {
    if (!show) {
        return null;
    }

    const handleClearAndClose = () => {
        onClear();
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button className="btn-close" onClick={onClose} aria-label="Fechar">
                    <FaTimes />
                </button>
                <h3><FaFilter /> Filtros Avançados</h3>

                <form onSubmit={(e) => { e.preventDefault(); onApply(); }}>

                    <div className="form-group">
                        <label htmlFor="tipoEmpresa"><FaBuilding className="me-2" /> Tipo de Empresa</label>
                        <select
                            id="tipoEmpresa"
                            className="form-select"
                            value={tipoEmpresa}
                            onChange={(e) => setTipoEmpresa(e.target.value)}
                        >
                            <option value="">Todos os Tipos</option>
                            {tiposDisponiveis.map(tipo => (
                                <option key={tipo} value={tipo}>{tipo}</option>
                            ))}
                        </select>
                    </div>
                    {/* FIM DO NOVO CAMPO */}

                    <div className="row">
                        <div className="col-md-6 form-group">
                            <label htmlFor="estado"><FaMap className="me-2" /> Estado</label>
                            <select
                                id="estado"
                                className="form-select"
                                value={estado}
                                onChange={(e) => setEstado(e.target.value)}
                            >
                                <option value="">Todos os Estados</option>
                                {estados.map(est => (
                                    <option key={est} value={est}>{est}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-6 form-group">
                            <label htmlFor="cidade"><FaCity className="me-2" /> Cidade</label>
                            <input
                                type="text"
                                id="cidade"
                                className="form-control"
                                placeholder="Ex: São Paulo"
                                value={cidade}
                                onChange={(e) => setCidade(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6 form-group">
                            <label htmlFor="bairro"><FaHome className="me-2" /> Bairro</label>
                            <input
                                type="text"
                                id="bairro"
                                className="form-control"
                                placeholder="Ex: Centro"
                                value={bairro}
                                onChange={(e) => setBairro(e.target.value)}
                            />
                        </div>
                        <div className="col-md-6 form-group">
                            <label htmlFor="pais"><FaGlobe className="me-2" /> País</label>
                            <input
                                type="text"
                                id="pais"
                                className="form-control"
                                placeholder="Ex: Brasil"
                                value={pais}
                                onChange={(e) => setPais(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="d-grid gap-2 mt-4">
                        <button type="submit" className="btn btn-primary">
                            <FaFilter /> Aplicar Filtros
                        </button>
                        <button type="button" className="btn btn-warning" onClick={handleClearAndClose}>
                            <FaBroom /> Limpar Filtros
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FilterModal;