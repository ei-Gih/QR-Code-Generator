'use client';
// ============================================================
// components/WifiForm.tsx — gera string WIFI: para QR code
// ============================================================

import { useState, useEffect } from 'react';
import type { WifiData, WifiSecurity } from '../types';
import { buildWifiString } from '../lib/utils';

interface WifiFormProps {
  onChange: (content: string) => void;
}

export default function WifiForm({ onChange }: WifiFormProps) {
  const [data, setData] = useState<WifiData>({
    ssid: '',
    password: '',
    security: 'WPA2',
  });

  // Emite o payload sempre que os dados mudam
  useEffect(() => {
    if (!data.ssid.trim()) {
      onChange('');
      return;
    }
    onChange(buildWifiString(data));
  }, [data, onChange]);

  const update = (field: keyof WifiData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => setData((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    <fieldset className="form-fieldset">
      <legend className="sr-only">Dados da rede Wi-Fi</legend>

      <div className="form-group">
        <label htmlFor="wifi-ssid" className="form-label">
          Nome da Rede (SSID)
        </label>
        <input
          id="wifi-ssid"
          className="form-input"
          type="text"
          placeholder="MinhaRedeWifi"
          value={data.ssid}
          onChange={update('ssid')}
          maxLength={32}
          autoComplete="off"
        />
      </div>

      <div className="form-group">
        <label htmlFor="wifi-security" className="form-label">
          Tipo de Segurança
        </label>
        <select
          id="wifi-security"
          className="form-select"
          value={data.security}
          onChange={update('security')}
        >
          <option value="WPA2">WPA2</option>
          <option value="WPA">WPA</option>
          <option value="WEP">WEP</option>
          <option value="nopass">Sem senha</option>
        </select>
      </div>

      {data.security !== 'nopass' && (
        <div className="form-group">
          <label htmlFor="wifi-password" className="form-label">
            Senha
          </label>
          <input
            id="wifi-password"
            className="form-input"
            type="password"
            placeholder="••••••••"
            value={data.password}
            onChange={update('password')}
            autoComplete="new-password"
          />
        </div>
      )}

      <p className="form-hint">
        Escaneie o QR para conectar automaticamente à rede
      </p>
    </fieldset>
  );
}
