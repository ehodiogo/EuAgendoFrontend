import React from 'react';
import { FaFilter, FaTimes } from 'react-icons/fa';

interface FilterModalProps {
  show: boolean;
  onClose: () => void;
  onApply: () => void;
  onClear: () => void;
  cidade: string;
  setCidade: (value: string) => void;
  estado: string;
  setEstado: (value: string) => void;
  bairro: string;
  setBairro: (value: string) => void;
  pais: string;
  setPais: (value: string) => void;
  estados: string[];
}

const FilterModal: React.FC<FilterModalProps> = ({
  show,
  onClose,
  onApply,
  onClear,
  cidade,
  setCidade,
  estado,
  setEstado,
  bairro,
  setBairro,
  pais,
  setPais,
  estados,
}) => {
  if (!show) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="btn-close" onClick={onClose} aria-label="Fechar">
          <FaTimes />
        </button>
        <h3>
          <FaFilter /> Filtros de Pesquisa
        </h3>

        <div className="form-group">
          <label htmlFor="cidade">Cidade</label>
          <input
            type="text"
            className="form-control"
            id="cidade"
            placeholder="Digite a cidade..."
            value={cidade}
            onChange={(e) => setCidade(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="estado">Estado</label>
          <select
            className="form-select"
            id="estado"
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
          >
            <option value="">Selecione o estado...</option>
            {estados.map((est) => (
              <option key={est} value={est}>{est}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="bairro">Bairro</label>
          <input
            type="text"
            className="form-control"
            id="bairro"
            placeholder="Digite o bairro..."
            value={bairro}
            onChange={(e) => setBairro(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="pais">País</label>
          <input
            type="text"
            className="form-control"
            id="pais"
            placeholder="Digite o país..."
            value={pais}
            onChange={(e) => setPais(e.target.value)}
          />
        </div>

        <div className="d-flex justify-content-between mt-4">
          <button className="btn btn-warning" onClick={onClear}>
            Limpar Filtros
          </button>
          <button className="btn btn-primary" onClick={onApply}>
            Aplicar Filtros
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;