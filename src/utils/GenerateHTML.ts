import { writeFileSync } from 'node:fs'
import { Plugins, type ProcessType, type RefacoParcours } from '../types.js'

type IProps = {
    data: RefacoParcours[]
    process: ProcessType
}

const GenerateHTML = async ({ data, process }: IProps): Promise<void> => {
    if (!process.plugins.includes(Plugins.HTML)) return

    let html = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <title>Parcours</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: 'Segoe UI', Arial, sans-serif;
          background: #f5f7fa;
          margin: 0;
          padding: 0;
        }
        h1 {
          text-align: center;
          color: #2c3e50;
          margin-top: 1em;
        }
        .steps {
          max-width: 900px;
          margin: 2em auto;
          padding: 1em;
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 4px 16px rgba(44,62,80,0.08);
        }
        .step {
          margin-bottom: 2em;
        }
        .step-name {
          font-size: 1.3em;
          font-weight: bold;
          color: #2980b9;
          margin-bottom: 0.5em;
        }
        .parcours-list {
          display: flex;
          flex-wrap: wrap;
          gap: 2em;
          justify-content: flex-start;
        }
        .parcours-item {
          background: #ecf0f1;
          border-radius: 12px;
          box-shadow: 0 2px 12px rgba(44,62,80,0.10);
          padding: 2em 1.5em;
          width: 380px;
          min-height: 260px;
          transition: transform 0.2s, box-shadow 0.2s;
          cursor: pointer;
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 0.7em;
        }
        .parcours-item:hover {
          transform: translateY(-6px) scale(1.03);
          box-shadow: 0 8px 32px rgba(44,62,80,0.16);
        }
        .parcours-item strong {
          color: #34495e;
          font-size: 1.1em;
          margin-bottom: 0.2em;
        }
        .parcours-item span, .parcours-item .field {
          display: block;
          color: #7f8c8d;
          margin-bottom: 0.3em;
          font-size: 1em;
          word-break: break-word;
        }
        .parcours-item img {
          width: 100%;
          max-height: 180px;
          object-fit: contain;
          border-radius: 8px;
          margin-top: 0.5em;
          transition: box-shadow 0.2s;
          background: #fff;
          border: 1px solid #d0d7de;
          padding: 0.2em;
        }
        .parcours-item img:hover {
          box-shadow: 0 2px 16px rgba(41,128,185,0.18);
        }
        .parcours-item img:hover {
          box-shadow: 0 2px 12px rgba(41,128,185,0.25);
        }
        @media (max-width: 900px) {
          .parcours-list { flex-direction: column; gap: 1.5em; }
          .parcours-item { width: 100%; }
        }
        /* Modal styles */
        .modal {
            display: none;
            position: fixed;
            z-index: 1000;
            left: 0; top: 0;
            width: 100vw; height: 100vh;
            background: rgba(44,62,80,0.85);
            justify-content: center;
            align-items: center;
        }
        .modal-content {
            background: transparent;
            padding: 0;
            border-radius: 0;
            box-shadow: none;
            max-width: 98vw;
            max-height: 98vh;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        .modal-content img {
            max-width: 90vw;
            max-height: 90vh;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(44,62,80,0.28);
            background: #fff;
            padding: 0.5em;
        }
        .close-btn {
            margin-top: 1em;
            padding: 0.5em 1.2em;
            background: #2980b9;
            color: #fff;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 1em;
            box-shadow: 0 2px 8px rgba(44,62,80,0.12);
        }
        @media (max-width: 600px) {
          .parcours-list { flex-direction: column; }
          .parcours-item { width: 100%; }
        }
      </style>
    </head>
    <body>
      <h1>Liste des parcours</h1>
      <div class="steps">
  `

    for (const step of data) {
        if (!step.parcours.length) continue
        html += `
      <div class="step">
        <div class="step-name">${step.stepName}</div>
        <div class="parcours-list">
    `
        for (const parcours of step.parcours) {
            html += `
        <div class="parcours-item" id="${parcours.index}">
            <strong>${parcours.stepName}</strong>
            <span class="field">URL : ${parcours.currentUrl}</span>
            <span class="field">Previous URL : ${parcours.previousUrl}</span>
            <img src="../../${parcours.screenPath}" alt="Capture d'écran" onclick="openModal('../../${parcours.screenPath}')"/>
        </div>
        `
        }
        html += `
        </div>
      </div>
    `
    }

    // Ajout du modal et du JS
    html += `
      </div>
      <div class="modal" id="imgModal">
        <div class="modal-content">
          <img id="modalImg" src="" alt="Aperçu" />
          <button class="close-btn" onclick="closeModal()">Fermer</button>
        </div>
      </div>
      <script>
        function openModal(imgSrc) {
          document.getElementById('modalImg').src = imgSrc;
          document.getElementById('imgModal').style.display = 'flex';
        }
        function closeModal() {
          document.getElementById('imgModal').style.display = 'none';
          document.getElementById('modalImg').src = '';
        }
        // Fermer le modal en cliquant en dehors
        document.getElementById('imgModal').addEventListener('click', function(e) {
          if (e.target === this) closeModal();
        });
      </script>
    </body>
    </html>
  `

    await writeFileSync(`./output/${process.name}/html.html`, html)
    console.log('HTML created !')
}

export default GenerateHTML
