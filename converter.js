        import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js';

export class ImageConverter extends LitElement {
  static styles = css`
    :host { display: block; font-family: 'Open Sans', sans-serif; color: #e8ebff; background: linear-gradient(120deg, #252b40 0%, #0f1530 60%, #121934 100%); min-height: 100vh; padding: 24px; }
    .app { width: min(1400px, 100%); }
    .card { background: radial-gradient(100% 140% at 0% 0%, #0e1530 0%, #0f1735 40%, #10183a 100%); border: 1px solid rgba(255,255,255,.06); border-radius: 16px; padding: 18px; box-shadow: 0 10px 30px rgba(0,0,0,.35), inset 0 1px 0 rgba(255,255,255,.04); }
    .drop { border: 2px dashed rgba(122,162,255,.35); border-radius: 10px; padding: 22px; text-align: center; color: #7f8ab6; min-height: 140px; display: grid; place-items: center; }
    .drop.dragover { border-color: #7aa2ff; background: rgba(122,162,255,.06); color: #e8ebff; }
    .controls { display: grid; gap: 12px; }
    button { cursor: pointer; border: none; border-radius: 12px; padding: 10px 14px; background: linear-gradient(135deg, #7aa2ff 0%, #9d7aff 100%); color: white; font-weight: 600; }
    .previews { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    @media (max-width: 900px) { .previews { grid-template-columns: 1fr; } }
  `;

  static properties = {
    originalFile: { type: Object },
    outputBlob: { type: Object },
    outputName: { type: String }
  };

  constructor() {
    super();
    this.originalFile = null;
    this.outputBlob = null;
    this.outputName = 'output';
  }

  render() {
    return html`
      <div class="app">
        <header>
          <h1>Image Converter & Compressor</h1>
        </header>

        <div class="grid">
          <section class="card">
            <div id="drop" class="drop" @click="${() => this.shadowRoot.getElementById('file').click()}">
              <div>
                <div style="font-size:1.05rem; font-weight:700; color:#cdd6ff;">Drop image here or click to choose</div>
                <div style="color:#7f8ab6;">JPG • PNG • WEBP • AVIF • GIF (first frame)</div>
              </div>
              <input id="file" type="file" accept="image/*" style="display:none" @change="${this.loadFile}" />
            </div>
            <div class="previews">
              <div class="preview" ?hidden="${!this.originalFile}">
                <header><strong>Original</strong></header>
                <div class="body"><img id="origImg" alt="Original preview" /></div>
              </div>
              <div class="preview" ?hidden="${!this.outputBlob}">
                <header><strong>Output</strong></header>
                <div class="body"><img id="outImg" alt="Output preview" /></div>
              </div>
            </div>
          </section>

          <aside class="card controls">
            <label>Output format
              <select id="format">
                <option value="image/webp">WEBP</option>
                <option value="image/jpeg">JPEG</option>
                <option value="image/avif">AVIF</option>
                <option value="image/png">PNG</option>
              </select>
            </label>
            <label>Quality
              <input id="quality" type="range" min="1" max="100" value="80" />
            </label>
            <label>Target size (KB)
              <input id="targetKB" type="number" min="1" placeholder="Optional e.g. 300" />
            </label>
            <div class="btns">
              <button @click="${this.convert}">Convert / Compress</button>
              <button @click="${this.download}" ?disabled="${!this.outputBlob}">Download</button>
              <button @click="${this.clear}">Clear</button>
            </div>
          </aside>
        </div>
      </div>
    `;
  }

  loadFile(e) {
    const f = e.target.files[0];
    if (!f) return;
    this.originalFile = f;
    this.outputName = f.name.replace(/\.[^.]+$/, '') || 'image';
    const origImg = this.shadowRoot.getElementById('origImg');
    origImg.src = URL.createObjectURL(f);
  }

  convert() {
    // Conversion logic here (reuse your canvas + toBlob code)
  }

  download() {
    if (!this.outputBlob) return;
    const a = document.createElement('a');
    const ext = this.outputBlob.type.split('/')[1] || 'img';
    a.href = URL.createObjectURL(this.outputBlob);
    a.download = `${this.outputName}.${ext}`;
    a.click();
  }

  clear() {
    this.originalFile = null;
    this.outputBlob = null;
    const origImg = this.shadowRoot.getElementById('origImg');
    const outImg = this.shadowRoot.getElementById('outImg');
    origImg.src = '';
    outImg.src = '';
  }
}

customElements.define('image-converter', ImageConverter);
