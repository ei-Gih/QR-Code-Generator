"use client";
import {QRCodeCanvas} from 'qrcode.react';
import { FaUpload } from "react-icons/fa";

export default function Home() {
  return (
    <main className="container">
      <section className="title-container">
        <h1>Gere e customize QR Codes <span>dinâmicos</span></h1>

        <img src="/arrow.svg" alt="detail" className="arrow-detail" />
      </section>

      <section className="qr-code-container">
        <div className="qr-code">
          <div className="link-input">
            <label htmlFor="link">Digite Seu Link</label>
            <input type="text" id="link" placeholder="https://example.com" />
          </div>
          <div className="qr-code-preview">
            <p>Preview do QR Code</p>
            <QRCodeCanvas
                value={"https://picturesofpeoplescanningqrcodes.tumblr.com/"}
                title={"Title for my QR Code"}
                size={128}
                bgColor={"#ffffff"}
                fgColor={"#000000"}
                imageSettings={{
                  src: "https://static.zpao.com/favicon.png",
                  x: undefined,
                  y: undefined,
                  height: 24,
                  width: 24,
                  opacity: 1,
                  excavate: true,
                }}
              />
          </div>
        </div>
        <div className="qr-code-customization">
          <div className="customization-container">
            <h3>Cores</h3>
            <div className="input-container">
              <div className="input-box">
                <label htmlFor="fgColor">Cor Principal</label>
                <input type="color"className='input-color' id="fgColor"/>
              </div>
              <div className="input-box">
                <label htmlFor="bgColor">Cor de Fundo</label>
                <input type="color" className='input-color' id="bgColor"/>
              </div>
            </div>
          </div>
          <div className="customization-container">
            <h3>Logo</h3>
            <div className="input-container">
              <div className="input-box">
                <label htmlFor="logo">Insira sua logo</label>
                <input type="file" className='input-file' id="logo" accept="image/*"/>
                <button className='input-file-button'><FaUpload />Escolher arquivo</button>
              </div>
              <div className="input-box">
                <label htmlFor="logoSize">Tamanho da logo</label>
                <select name="logoSize" id="logoSize">
                  <option value="24">24px x 24px</option>
                  <option value="38">38px x 38px</option>
                  <option value="50">50px x 50px</option>
                </select>
              </div>
            </div>
          </div>
          <button className="download-button">Baixar QR Code</button>
        </div>
      </section>
    </main>
  );
}
