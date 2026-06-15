'use client';
// ============================================================
// components/PixForm.tsx — gera payload EMV PIX válido
// ============================================================

import { useState, useEffect } from 'react';
import type { PixData } from '../types';
import { buildPixPayload } from '../lib/utils';

interface PixFormProps {
  onChange: (content: string) => void;
}

export default function PixForm({ onChange }: PixFormProps) {
  const [data, setData] = useState<PixData>({
    name: '',
    city: '',
    key: '',
    value: '',
    description: '',
  });

  const [error, setError] = useState('');

  useEffect(() => {
    const { name, city, key } = data;
    if (!name.trim() || !city.trim() || !key.trim()) {
      onChange('');
      setError('');
      return;
    }
    try {
      const payload = buildPixPayload(data);
      setError('');
      onChange(payload);
    } catch (e) {
      setError('Dados inválidos. Verifique a chave PIX.');
      onChange('');
    }
  }, [data, onChange]);

  const update =
    (field: keyof PixData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setData((prev) => ({ ...prev, [field]: e.target.value }));
    };

  return (
    <fieldset className="form-fieldset">
      <legend className="sr-only">Dados para geração de QR PIX</legend>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="pix-name" className="form-label">
            Nome do Recebedor <span aria-hidden="true">*</span>
          </label>
          <input
            id="pix-name"
            className="form-input"
            type="text"
            placeholder="João Silva"
            value={data.name}
            onChange={update('name')}
            maxLength={25}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="pix-city" className="form-label">
            Cidade <span aria-hidden="true">*</span>
          </label>
          <input
            id="pix-city"
            className="form-input"
            type="text"
            placeholder="São Paulo"
            value={data.city}
            onChange={update('city')}
            maxLength={15}
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="pix-key" className="form-label">
          Chave PIX <span aria-hidden="true">*</span>
        </label>
        <input
          id="pix-key"
          className="form-input"
          type="text"
          placeholder="email@exemplo.com, CPF, telefone ou aleatória"
          value={data.key}
          onChange={update('key')}
          required
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="pix-value" className="form-label">
            Valor (R$)
          </label>
          <input
            id="pix-value"
            className="form-input"
            type="number"
            placeholder="0,00"
            min="0"
            step="0.01"
            value={data.value}
            onChange={update('value')}
          />
        </div>

        <div className="form-group">
          <label htmlFor="pix-desc" className="form-label">
            Descrição
          </label>
          <input
            id="pix-desc"
            className="form-input"
            type="text"
            placeholder="Pagamento de..."
            value={data.description}
            onChange={update('description')}
            maxLength={72}
          />
        </div>
      </div>

      {error && (
        <p className="form-error" role="alert">
          ⚠ {error}
        </p>
      )}

      <p className="form-hint">
        Campos marcados com * são obrigatórios. O QR PIX gerado é compatível com
        todos os apps bancários brasileiros.
      </p>
    </fieldset>
  );
}
