/**
 * ==============================================================================
 * PANNELLO SUPPORTO IT & HELP DESK L1
 * Sviluppato da Valentyn Haidukov (Help Desk L1 & Supporto Tecnico IT - L. 68/99)
 * ==============================================================================
 * Codice sorgente JavaScript Vanilla chiaro, moderno, interattivo e senza fronzoli.
 * ==============================================================================
 */

// 1. DATASET PREDEFINITO TICKET ASSISTENZA
const DEFAULT_TICKETS = [
  {
    id: "TICK-101",
    user: "Elena Moretti",
    department: "Amministrazione & Contabilità",
    category: "Hardware & Periferiche",
    subject: "Stampante di rete Kyocera bloccata su coda di stampa",
    asset: "PRN-KYO-ADM01 (192.168.1.200)",
    priority: "Alta",
    status: "In Lavorazione",
    date: "24/11/2026 09:15",
    description: "I documenti inviati in stampa rimangono bloccati in coda su 3 postazioni contabili. La stampante è accesa ma non rilascia i fogli.",
    worklog: [
      { tech: "Valentyn Haidukov", date: "24/11/2026 09:25", text: "Verificata connettività IP (Ping <1ms). Rilevata coda di stampa di Windows corrotta." },
      { tech: "Valentyn Haidukov", date: "24/11/2026 09:40", text: "Eseguito script PowerShell per arresto servizio Spooler, pulizia cartella spool\\PRINTERS e riavvio servizio." }
    ]
  },
  {
    id: "TICK-102",
    user: "Roberto De Angelis",
    department: "Ufficio Commerciale",
    category: "Microsoft 365 & Mail",
    subject: "Outlook 365 richiede continuamente la password di posta",
    asset: "W11-COMM-04 (HP EliteBook)",
    priority: "Media",
    status: "Aperto",
    date: "24/11/2026 10:05",
    description: "Ogni volta che l'utente avvia Outlook compare una finestra di popup che richiede di reinserire le credenziali dell'account Microsoft 365.",
    worklog: [
      { tech: "Valentyn Haidukov", date: "24/11/2026 10:15", text: "Ticket aperto. Pianificata pulizia delle credenziali memorizzate in Windows Credential Manager." }
    ]
  },
  {
    id: "TICK-103",
    user: "Chiara Fontana",
    department: "Ufficio Risorse Umane",
    category: "Software & Client Windows",
    subject: "Schermata Blu periodica BSOD (DRIVER_IRQL_NOT_LESS_OR_EQUAL)",
    asset: "W11-HR-02 (Dell OptiPlex 7090)",
    priority: "Critica",
    status: "Aperto",
    date: "23/11/2026 16:40",
    description: "Durante l'elaborazione dei prospetti Excel la workstation si riavvia improvvisamente mostrando schermata blu di errore.",
    worklog: [
      { tech: "Valentyn Haidukov", date: "23/11/2026 17:05", text: "Analisi minidump: conflitto driver di rete Realtek. Pianificato aggiornamento driver certificato." }
    ]
  },
  {
    id: "TICK-104",
    user: "Marco Santoro",
    department: "Magazzino & Logistica",
    category: "Account & Permessi",
    subject: "Account Active Directory bloccato dopo 3 password errate",
    asset: "W11-LOG-01 (Lenovo ThinkCentre)",
    priority: "Bassa",
    status: "Risolto",
    date: "23/11/2026 14:10",
    description: "Utente rientrato dalle ferie non ricordava la password aggiornata prima della scadenza trimestrale.",
    worklog: [
      { tech: "Valentyn Haidukov", date: "23/11/2026 14:15", text: "Verificato stato utente in Active Directory. Eseguito sblocco account e impostata password provvisoria con cambio obbligatorio." }
    ]
  },
  {
    id: "TICK-105",
    user: "Simona Valenti",
    department: "Direzione Generale",
    category: "Rete LAN & Connettività",
    subject: "Laptop aziendale non riceve indirizzo IP in Wi-Fi (IP APIPA 169.254.x.x)",
    asset: "W11-DIR-01 (Dell XPS 13)",
    priority: "Alta",
    status: "Risolto",
    date: "22/11/2026 11:30",
    description: "Il portatile si collega alla rete wireless ma non naviga e non accede alle cartelle condivise di rete.",
    worklog: [
      { tech: "Valentyn Haidukov", date: "22/11/2026 11:45", text: "Eseguito ipconfig /release e ipconfig /renew da prompt dei comandi. Rilasciato correttamente IP 192.168.1.115." }
    ]
  }
];

// 2. DATASET PREDEFINITO ASSET & POSTAZIONI (CMDB)
const DEFAULT_ASSETS = [
  {
    id: "AST-001",
    hostname: "W11-HR-02",
    type: "PC Desktop",
    icon: "🖥️",
    model: "Dell OptiPlex 7090 Micro",
    serial: "7XG81P3",
    user: "Chiara Fontana",
    department: "Ufficio Risorse Umane",
    location: "Sede Centrale - Piano 1",
    ip: "192.168.1.102",
    status: "In Uso",
    specs: "Intel Core i5-11500, 16GB RAM DDR4, SSD 512GB NVMe, Windows 11 Pro 64-bit"
  },
  {
    id: "AST-002",
    hostname: "W11-COMM-04",
    type: "Laptop / Notebook",
    icon: "💻",
    model: "HP EliteBook 840 G9",
    serial: "5CD23910KL",
    user: "Roberto De Angelis",
    department: "Ufficio Commerciale",
    location: "Ufficio Vendite & Smart Working",
    ip: "192.168.1.108",
    status: "In Uso",
    specs: "Intel Core i7-1260P, 32GB RAM DDR5, SSD 1TB NVMe, Schermo 14\" IPS, Windows 11 Pro"
  },
  {
    id: "AST-003",
    hostname: "W11-STK-01",
    type: "Laptop / Notebook",
    icon: "📦",
    model: "Lenovo ThinkPad T14 Gen 3",
    serial: "PF3Z98AA",
    user: "Magazzino IT (Scorta muletto)",
    department: "Supporto Informatico",
    location: "Armadio Laboratorio IT",
    ip: "DHCP Dinamico",
    status: "Scorta Magazzino",
    specs: "AMD Ryzen 5 Pro 6650U, 16GB RAM, SSD 512GB, Configurato e pronto per nuova assunzione"
  },
  {
    id: "AST-004",
    hostname: "PRN-KYO-ADM01",
    type: "Stampante Multifunzione",
    icon: "🖨️",
    model: "Kyocera TASKalfa 3253ci",
    serial: "Q8A1904512",
    user: "Condivisa Ufficio Contabilità",
    department: "Amministrazione",
    location: "Corridoio Amministrazione",
    ip: "192.168.1.200 (Statico)",
    status: "In Riparazione",
    specs: "Multifunzione Laser Colore A3/A4, Scheda di Rete Gigabit, Porta RAW 9100"
  },
  {
    id: "AST-005",
    hostname: "SW-CISCO-FL1",
    type: "Apparato di Rete",
    icon: "🌐",
    model: "Cisco Catalyst 1000 24P PoE+",
    serial: "FOC241908LK",
    user: "Infrastruttura Rete LAN",
    department: "Sistemi & Rete",
    location: "Armadio Rack CED - Piano 1",
    ip: "192.168.1.2",
    status: "In Uso",
    specs: "Switch gestito Layer 2, 24 porte Gigabit Ethernet PoE+, 4 porte SFP fibra"
  }
];

// 3. STATO APPLICAZIONE (con persistenza localStorage)
let tickets = loadData("it_tickets_v2", DEFAULT_TICKETS);
let assets = loadData("it_assets_v2", DEFAULT_ASSETS);
let currentFilterStatus = "all";
let activeTicketId = null;

function loadData(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : JSON.parse(JSON.stringify(fallback));
  } catch (e) {
    return JSON.parse(JSON.stringify(fallback));
  }
}

function saveData() {
  try {
    localStorage.setItem("it_tickets_v2", JSON.stringify(tickets));
    localStorage.setItem("it_assets_v2", JSON.stringify(assets));
  } catch (e) {
    console.error("Errore salvataggio localStorage:", e);
  }
}

// 4. INIZIALIZZAZIONE
document.addEventListener("DOMContentLoaded", () => {
  setupTabs();
  setupSearch();
  renderAll();
});

// GESTIONE SCHEDE TABS
function setupTabs() {
  document.querySelectorAll(".nav-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".nav-tab").forEach(t => t.classList.remove("active"));
      document.querySelectorAll(".app-section").forEach(s => s.classList.remove("active"));

      tab.classList.add("active");
      const targetSection = document.getElementById(`section-${tab.dataset.tab}`);
      if (targetSection) targetSection.classList.add("active");
    });
  });

  // Tasti apertura modali
  document.getElementById("btn-open-new-ticket")?.addEventListener("click", () => openModal("modal-new-ticket"));
  document.getElementById("btn-open-new-asset")?.addEventListener("click", () => openModal("modal-new-asset"));
  document.getElementById("btn-export-backup")?.addEventListener("click", exportBackupJSON);

  // Supporto URL hash (es. #assets o #tools)
  const initialHash = window.location.hash.replace("#", "");
  if (initialHash && ["tickets", "assets", "tools"].includes(initialHash)) {
    const tabEl = document.getElementById(`tab-btn-${initialHash}`);
    if (tabEl) tabEl.click();
  }
}

// GESTIONE RICERCA VELOCE
function setupSearch() {
  const input = document.getElementById("ticket-search-input");
  const clearBtn = document.getElementById("btn-clear-search");
  
  if (input) {
    input.addEventListener("input", (e) => {
      const val = e.target.value.trim();
      if (clearBtn) clearBtn.classList.toggle("hidden", val === "");
      renderTicketTable();
    });
  }
}

function clearSearch() {
  const input = document.getElementById("ticket-search-input");
  const clearBtn = document.getElementById("btn-clear-search");
  if (input) input.value = "";
  if (clearBtn) clearBtn.classList.add("hidden");
  renderTicketTable();
}

// 5. RENDERING PRINCIPALE
function renderAll() {
  renderKPIs();
  renderTicketTable();
  renderAssetsGrid();
}

// CALCOLO & RENDERING KPI
function renderKPIs() {
  const total = tickets.length;
  const open = tickets.filter(t => t.status === "Aperto").length;
  const inProgress = tickets.filter(t => t.status === "In Lavorazione").length;
  const resolved = tickets.filter(t => t.status === "Risolto" || t.status === "Chiuso").length;

  document.getElementById("kpi-val-all").textContent = total;
  document.getElementById("kpi-val-open").textContent = open;
  document.getElementById("kpi-val-progress").textContent = inProgress;
  document.getElementById("kpi-val-resolved").textContent = resolved;

  // Badge nella barra di navigazione
  const navBadge = document.getElementById("badge-open-tickets");
  if (navBadge) navBadge.textContent = open + inProgress;

  const countAssets = document.getElementById("count-total-assets");
  if (countAssets) countAssets.textContent = `(${assets.length})`;
}

// FILTRO STATO VIA KPI CARDS
function setFilterStatus(status) {
  currentFilterStatus = status;

  // Evidenzia la KPI Card attiva
  document.querySelectorAll(".kpi-card").forEach(c => c.classList.remove("active"));
  if (status === "all") document.getElementById("kpi-filter-all")?.classList.add("active");
  else if (status === "Aperto") document.getElementById("kpi-filter-open")?.classList.add("active");
  else if (status === "In Lavorazione") document.getElementById("kpi-filter-progress")?.classList.add("active");
  else if (status === "Risolto") document.getElementById("kpi-filter-resolved")?.classList.add("active");

  renderTicketTable();
}

// RENDERING TABELLA TICKET
function renderTicketTable() {
  const tbody = document.getElementById("tickets-tbody");
  if (!tbody) return;

  const searchQuery = (document.getElementById("ticket-search-input")?.value || "").toLowerCase();
  const catFilter = document.getElementById("select-category-filter")?.value || "all";
  const prioFilter = document.getElementById("select-priority-filter")?.value || "all";

  const filtrati = tickets.filter(t => {
    // Filtro per stato da KPI card
    const matchStatus = currentFilterStatus === "all" || 
      (currentFilterStatus === "Risolto" ? (t.status === "Risolto" || t.status === "Chiuso") : t.status === currentFilterStatus);

    // Filtro per categoria e priorità
    const matchCat = catFilter === "all" || t.category === catFilter;
    const matchPrio = prioFilter === "all" || t.priority === prioFilter;

    // Filtro per testo cercato
    const matchSearch = !searchQuery || 
      t.id.toLowerCase().includes(searchQuery) ||
      t.user.toLowerCase().includes(searchQuery) ||
      t.department.toLowerCase().includes(searchQuery) ||
      t.subject.toLowerCase().includes(searchQuery) ||
      t.asset.toLowerCase().includes(searchQuery);

    return matchStatus && matchCat && matchPrio && matchSearch;
  });

  // Aggiorna contatore
  const countLabel = document.getElementById("tickets-count-label");
  if (countLabel) countLabel.textContent = `${filtrati.length} segnalazioni trovate`;

  if (filtrati.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; padding: 2.5rem; color: #64748b;">
          <div style="font-size: 2rem; margin-bottom: 0.5rem;">🔍</div>
          <strong>Nessun ticket corrisponde ai filtri selezionati.</strong>
          <div style="font-size: 0.85rem; margin-top: 0.35rem;">Prova a modificare i termini di ricerca o rimuovere i filtri.</div>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtrati.map(t => {
    const isResolved = t.status === "Risolto" || t.status === "Chiuso";
    const isOpening = t.status === "Aperto";

    // Badge grafici
    let prioClass = "badge-prio-media";
    if (t.priority === "Critica") prioClass = "badge-prio-critica";
    else if (t.priority === "Alta") prioClass = "badge-prio-alta";
    else if (t.priority === "Bassa") prioClass = "badge-prio-bassa";

    let statusClass = "badge-status-aperto";
    if (t.status === "In Lavorazione") statusClass = "badge-status-lavorazione";
    else if (t.status === "In Attesa") statusClass = "badge-status-attesa";
    else if (t.status === "Risolto") statusClass = "badge-status-risolto";
    else if (t.status === "Chiuso") statusClass = "badge-status-chiuso";

    return `
      <tr onclick="openTicketDetailModal('${t.id}')" title="Clicca per aprire la scheda dettagli e lavorare sul ticket">
        <td>
          <span class="ticket-id-badge">#${t.id}</span>
          <div style="font-size: 0.72rem; color: #94a3b8; margin-top: 3px;">${t.date.split(" ")[0]}</div>
        </td>
        <td>
          <strong style="color: #0f172a;">${t.user}</strong>
          <div style="font-size: 0.78rem; color: #64748b;">${t.department}</div>
        </td>
        <td>
          <div style="font-weight: 700; color: #1e293b; margin-bottom: 2px;">${t.subject}</div>
          <div style="font-size: 0.78rem; color: #64748b;">
            <span style="color: #2563eb; font-weight: 600;">${t.category}</span> &bull; <span>${t.asset}</span>
          </div>
        </td>
        <td>
          <span class="badge ${prioClass}">${t.priority}</span>
        </td>
        <td>
          <span class="badge ${statusClass}">
            ${t.status === 'Risolto' ? '✓ ' : ''}${t.status}
          </span>
        </td>
        <td>
          <div class="action-buttons-cell">
            <button class="btn btn-secondary btn-sm" onclick="event.stopPropagation(); openTicketDetailModal('${t.id}')" title="Apri scheda dettagli">
              🔍 Dettagli
            </button>
            ${!isResolved ? `
              <button class="btn btn-success btn-sm" onclick="event.stopPropagation(); quickResolveTicket('${t.id}')" title="Segna come risolto">
                ✓ Risolvi
              </button>
            ` : ''}
            ${isOpening ? `
              <button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); quickTakeTicket('${t.id}')" title="Prendi in carico">
                ⚙️ Prendi
              </button>
            ` : ''}
          </div>
        </td>
      </tr>
    `;
  }).join("");
}

// RENDERING GRIGLIA ASSET (CMDB)
function renderAssetsGrid() {
  const container = document.getElementById("assets-grid-container");
  if (!container) return;

  container.innerHTML = assets.map(a => {
    let statusBadge = `<span class="badge badge-status-risolto">🟢 In Uso</span>`;
    if (a.status === "Scorta Magazzino") {
      statusBadge = `<span class="badge badge-status-lavorazione">🔵 Scorta Magazzino</span>`;
    } else if (a.status === "In Riparazione") {
      statusBadge = `<span class="badge badge-prio-alta">🟡 In Riparazione</span>`;
    }

    return `
      <div class="asset-card">
        <div class="asset-card-top">
          <div class="asset-icon-box">${a.icon || '💻'}</div>
          ${statusBadge}
        </div>
        <div class="asset-hostname">${a.hostname}</div>
        <div class="asset-model">${a.model}</div>

        <div class="asset-details-list">
          <div>Tipologia: <strong>${a.type}</strong></div>
          <div>Utente: <strong>${a.user}</strong></div>
          <div>Reparto: <strong>${a.department}</strong></div>
          <div>Indirizzo IP: <code style="background: #f1f5f9; padding: 2px 5px; border-radius: 4px;">${a.ip}</code></div>
          <div>Matricola: <span style="font-family: monospace;">${a.serial}</span></div>
        </div>

        <div class="asset-card-footer" style="display: flex; flex-direction: column; gap: 0.45rem;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.45rem;">
            <button class="btn btn-secondary btn-sm" onclick="runPingModal('${a.id}')" title="Esegui test connettività di rete ICMP">
              📶 Ping Test
            </button>
            <button class="btn btn-secondary btn-sm" onclick="openRemoteAssistModal('${a.id}')" title="Avvia sessione remota Quick Assist">
              🖥️ Remoto
            </button>
          </div>
          <button class="btn btn-secondary btn-sm" style="width: 100%;" onclick="openAssetDetailModal('${a.id}')">
            🔍 Scheda Tecnica & Specifiche
          </button>
        </div>
      </div>
    `;
  }).join("");
}

// 6. AZIONI RAPIDE TICKET (CLICCABILI DALLA TABELLA)
function quickResolveTicket(id) {
  const t = tickets.find(x => x.id === id);
  if (!t) return;

  t.status = "Risolto";
  t.worklog.push({
    tech: "Valentyn Haidukov",
    date: new Date().toLocaleDateString("it-IT") + " " + new Date().toLocaleTimeString("it-IT").slice(0, 5),
    text: "Intervento completato con successo. Ticket contrassegnato come Risolto dall'operatore."
  });

  saveData();
  renderAll();
  showToast(`Ticket #${t.id} contrassegnato come RISOLTO!`, "success");
}

function quickTakeTicket(id) {
  const t = tickets.find(x => x.id === id);
  if (!t) return;

  t.status = "In Lavorazione";
  t.worklog.push({
    tech: "Valentyn Haidukov",
    date: new Date().toLocaleDateString("it-IT") + " " + new Date().toLocaleTimeString("it-IT").slice(0, 5),
    text: "Richiesta presa in carico dall'operatore Help Desk L1."
  });

  saveData();
  renderAll();
  showToast(`Ticket #${t.id} preso in carico!`, "info");
}

// 7. GESTIONE MODALE DETTAGLIO TICKET
function openTicketDetailModal(id) {
  const t = tickets.find(x => x.id === id);
  if (!t) return;
  activeTicketId = t.id;

  document.getElementById("modal-ticket-id").textContent = `#${t.id}`;
  document.getElementById("modal-ticket-title").textContent = t.subject;
  document.getElementById("modal-ticket-user").textContent = t.user;
  document.getElementById("modal-ticket-dept").textContent = t.department;
  document.getElementById("modal-ticket-asset").textContent = t.asset;
  document.getElementById("modal-ticket-priority").textContent = t.priority;
  document.getElementById("modal-ticket-desc").textContent = t.description;

  const statusSelect = document.getElementById("modal-ticket-new-status");
  if (statusSelect) statusSelect.value = t.status;

  renderWorklog(t);
  openModal("modal-ticket-detail");
}

function renderWorklog(t) {
  const container = document.getElementById("modal-ticket-worklog");
  if (!container) return;

  container.innerHTML = t.worklog.map(w => `
    <div class="worklog-item">
      <div class="worklog-meta">${w.tech} &bull; ${w.date}</div>
      <div style="color: #1e293b; margin-top: 2px;">${w.text}</div>
    </div>
  `).join("");
}

function saveTicketStatus() {
  if (!activeTicketId) return;
  const t = tickets.find(x => x.id === activeTicketId);
  const newStatus = document.getElementById("modal-ticket-new-status").value;

  if (t && newStatus) {
    const oldStatus = t.status;
    t.status = newStatus;
    t.worklog.push({
      tech: "Valentyn Haidukov",
      date: new Date().toLocaleDateString("it-IT") + " " + new Date().toLocaleTimeString("it-IT").slice(0, 5),
      text: `Stato aggiornato da '${oldStatus}' a '${newStatus}'.`
    });

    saveData();
    renderAll();
    renderWorklog(t);
    showToast(`Stato del ticket aggiornato a: ${newStatus}`, "success");
  }
}

function quickResolveActiveTicket() {
  if (!activeTicketId) return;
  quickResolveTicket(activeTicketId);
  closeModal("modal-ticket-detail");
}

function addNoteToActiveTicket() {
  if (!activeTicketId) return;
  const input = document.getElementById("input-new-note");
  const text = input.value.trim();
  if (!text) return;

  const t = tickets.find(x => x.id === activeTicketId);
  if (t) {
    t.worklog.push({
      tech: "Valentyn Haidukov",
      date: new Date().toLocaleDateString("it-IT") + " " + new Date().toLocaleTimeString("it-IT").slice(0, 5),
      text: text
    });
    input.value = "";
    saveData();
    renderWorklog(t);
    showToast("Nota tecnica aggiunta allo storico!", "success");
  }
}

// 8. CREAZIONE NUOVO TICKET
function handleCreateTicket(e) {
  e.preventDefault();

  const newTicket = {
    id: "TICK-" + (100 + tickets.length + 1),
    user: document.getElementById("new-ticket-user").value.trim(),
    department: document.getElementById("new-ticket-dept").value.trim(),
    category: document.getElementById("new-ticket-category").value,
    priority: document.getElementById("new-ticket-priority").value,
    subject: document.getElementById("new-ticket-subject").value.trim(),
    asset: document.getElementById("new-ticket-asset").value.trim() || "Postazione standard",
    description: document.getElementById("new-ticket-desc").value.trim(),
    status: "Aperto",
    date: new Date().toLocaleDateString("it-IT") + " " + new Date().toLocaleTimeString("it-IT").slice(0, 5),
    worklog: [
      {
        tech: "Valentyn Haidukov",
        date: new Date().toLocaleDateString("it-IT") + " " + new Date().toLocaleTimeString("it-IT").slice(0, 5),
        text: "Nuova richiesta registrata nel sistema Help Desk."
      }
    ]
  };

  tickets.unshift(newTicket);
  saveData();
  closeModal("modal-new-ticket");
  document.getElementById("form-create-ticket").reset();
  renderAll();
  showToast(`Nuovo Ticket #${newTicket.id} registrato con successo!`, "success");
}

// 9. MODALE SCHEDA ASSET
function openAssetDetailModal(id) {
  const a = assets.find(x => x.id === id);
  if (!a) return;

  document.getElementById("modal-asset-id").textContent = a.id;
  document.getElementById("modal-asset-title").textContent = a.hostname;
  document.getElementById("modal-asset-icon").textContent = a.icon || "💻";
  document.getElementById("modal-asset-model").textContent = a.model;
  document.getElementById("modal-asset-type").textContent = a.type;
  document.getElementById("modal-asset-hostname").textContent = a.hostname;
  document.getElementById("modal-asset-ip").textContent = a.ip;
  document.getElementById("modal-asset-serial").textContent = a.serial;
  document.getElementById("modal-asset-user").textContent = a.user;
  document.getElementById("modal-asset-loc").textContent = `${a.department} (${a.location})`;
  document.getElementById("modal-asset-status").textContent = a.status;
  document.getElementById("modal-asset-specs").textContent = a.specs;

  openModal("modal-asset-detail");
}

// 10. SIMULATORE STRUMENTI RAPIDI HELP DESK
function runToolSimulation(toolType) {
  const outputBox = document.getElementById(`tool-output-${toolType}`);
  if (!outputBox) return;

  outputBox.classList.remove("hidden");
  outputBox.style.background = "#fffbeb";
  outputBox.style.borderColor = "#fcd34d";
  outputBox.style.color = "#92400e";
  outputBox.innerHTML = `<strong>⏳ Esecuzione in corso...</strong> Attendere il completamento della procedura`;

  setTimeout(() => {
    outputBox.style.background = "#ecfdf5";
    outputBox.style.borderColor = "#a7f3d0";
    outputBox.style.color = "#065f46";

    if (toolType === "spooler") {
      outputBox.innerHTML = `
        <strong>✓ PROCEDURA COMPLETATA CON SUCCESSO!</strong><br>
        1. Servizio Spooler arrestato.<br>
        2. Eliminati 3 file .SPL e .SHD corrotti nella cartella C:\\Windows\\System32\\spool\\PRINTERS.<br>
        3. Servizio Spooler riavviato e pronto a stampare.
      `;
      showToast("Spooler di stampa ripristinato con successo!", "success");
    } else if (toolType === "dns") {
      outputBox.innerHTML = `
        <strong>✓ RISOLUZIONE RETE RIUSCITA!</strong><br>
        1. Cache DNS locale del resolver svuotata con successo.<br>
        2. Indirizzo IP rilasciato e rinnovato da server DHCP aziendale.<br>
        3. Nuovo indirizzo IPv4 assegnato: <strong>192.168.1.115 /24</strong> (Gateway: 192.168.1.1).
      `;
      showToast("Cache DNS e connessione IP rinnovate!", "success");
    } else if (toolType === "ad") {
      outputBox.innerHTML = `
        <strong>✓ ACCOUNT SBLOCCATO CON SUCCESSO!</strong><br>
        1. Flag lockout azzerato in Active Directory.<br>
        2. Password provvisoria generata: <code>Temp#2026!Login</code>.<br>
        3. Impostato obbligo di cambio password al primo accesso utente.
      `;
      showToast("Account utente sbloccato correttamente!", "success");
    } else if (toolType === "port") {
      outputBox.innerHTML = `
        <strong>✓ TEST CONNESSIONE SOCKET POSITIVO!</strong><br>
        Host: 192.168.1.200 (Kyocera TASKalfa)<br>
        Porta RAW: 9100 TCP &bull; Stato: <strong>APERTA / LISTENING</strong> (Latenza: 1.2ms).
      `;
      showToast("Porta di rete raggiungibile e attiva!", "success");
    }
  }, 700);
}

function copyToolCode(toolType) {
  const codes = {
    spooler: "Stop-Service Spooler -Force; Remove-Item C:\\Windows\\System32\\spool\\PRINTERS\\* -Force; Start-Service Spooler",
    dns: "ipconfig /flushdns ; ipconfig /release ; ipconfig /renew",
    ad: "Unlock-ADAccount -Identity \"utente.cognome\" ; Set-ADAccountPassword -Identity \"utente.cognome\" -Reset",
    port: "Test-NetConnection -ComputerName 192.168.1.200 -Port 9100"
  };

  if (codes[toolType]) {
    navigator.clipboard.writeText(codes[toolType]);
    showToast("Comando PowerShell copiato negli appunti!", "info");
  }
}

// 11. MODALI & UTILITY
function openModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove("hidden");
}

function closeModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add("hidden");
}

function exportBackupJSON() {
  const backup = {
    exportDate: new Date().toISOString(),
    candidate: "Valentyn Haidukov",
    role: "Help Desk L1 & IT Support",
    tickets: tickets,
    assets: assets
  };

  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Backup_HelpDesk_Valentyn_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast("Backup JSON esportato correttamente!", "info");
}

function showToast(msg, type = "info") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span>${type === 'success' ? '✓' : 'ℹ'}</span> <span>${msg}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// 12. SIMULATORE AVANZATO PING ICMP (INVENTARIO DISPOSITIVI)
let activePingAssetId = null;
let activeRemoteAssetId = null;

function runPingModal(assetId) {
  const a = assets.find(x => x.id === assetId);
  if (!a) return;
  activePingAssetId = assetId;

  const targetHost = a.ip.includes(" ") ? a.ip.split(" ")[0] : (a.ip === "DHCP Dinamico" ? "192.168.1.150" : a.ip);
  document.getElementById("modal-ping-host").textContent = `PING: ${a.hostname} (${targetHost})`;
  const term = document.getElementById("ping-terminal-output");
  const indicator = document.getElementById("ping-status-indicator");
  indicator.textContent = "⏳ Esecuzione test ICMP in corso...";
  indicator.style.color = "#d97706";

  term.innerHTML = `<div style="color: #cbd5e1; margin-bottom: 0.5rem;">PS C:\\SupportoIT> ping -n 4 ${targetHost}</div><div style="color: #94a3b8; margin-bottom: 0.5rem;">Esecuzione Ping verso [${a.hostname}] con IP ${targetHost} (32 byte di dati):</div>`;
  openModal("modal-ping-test");

  const replies = [
    { seq: 1, bytes: 32, ms: (Math.random() * 0.8 + 0.6).toFixed(1), ttl: 128 },
    { seq: 2, bytes: 32, ms: (Math.random() * 0.8 + 0.6).toFixed(1), ttl: 128 },
    { seq: 3, bytes: 32, ms: (Math.random() * 0.8 + 0.6).toFixed(1), ttl: 128 },
    { seq: 4, bytes: 32, ms: (Math.random() * 0.8 + 0.6).toFixed(1), ttl: 128 },
  ];

  replies.forEach((r, idx) => {
    setTimeout(() => {
      const line = document.createElement("div");
      line.style.color = "#38bdf8";
      line.textContent = `Risposta da ${targetHost}: byte=${r.bytes} tempo=${r.ms}ms TTL=${r.ttl}`;
      term.appendChild(line);

      if (idx === 3) {
        setTimeout(() => {
          const stats = document.createElement("div");
          stats.style.marginTop = "0.75rem";
          stats.style.paddingTop = "0.5rem";
          stats.style.borderTop = "1px solid #334155";
          stats.style.color = "#4ade80";
          stats.innerHTML = `
            <strong>Statistiche Ping per ${targetHost}:</strong><br>
            Pacchetti: Trasmessi = 4, Ricevuti = 4, Persi = 0 (0% persi)<br>
            Tempi andata/ritorno: Minimo = 0.6ms, Massimo = 1.4ms, Medio = 0.9ms
          `;
          term.appendChild(stats);
          indicator.textContent = "✓ HOST ONLINE & RAGGIUNGIBILE (0% perdita pacchetti)";
          indicator.style.color = "#10b981";
        }, 250);
      }
    }, (idx + 1) * 300);
  });
}

function repeatActivePing() {
  if (activePingAssetId) {
    runPingModal(activePingAssetId);
  }
}

// 13. SIMULATORE ASSISTENZA REMOTA (RDP / QUICK ASSIST)
function openRemoteAssistModal(assetId) {
  const a = assets.find(x => x.id === assetId);
  if (!a) return;
  activeRemoteAssetId = assetId;

  document.getElementById("remote-assist-title").textContent = `Sessione Assistenza Remota - ${a.hostname}`;
  document.getElementById("remote-assist-subtitle").textContent = `${a.model} • Utente: ${a.user} • IP: ${a.ip}`;

  const connectingBox = document.getElementById("remote-assist-connecting");
  const connectedBox = document.getElementById("remote-assist-connected");
  const resultBox = document.getElementById("remote-action-result");

  connectingBox.classList.remove("hidden");
  connectedBox.classList.add("hidden");
  resultBox.classList.add("hidden");
  resultBox.textContent = "";

  openModal("modal-remote-assist");

  setTimeout(() => {
    connectingBox.classList.add("hidden");
    connectedBox.classList.remove("hidden");
    document.getElementById("remote-cpu-load").textContent = `${Math.floor(Math.random() * 20 + 8)}%`;
    document.getElementById("remote-ram-load").textContent = `${(Math.random() * 4 + 4.5).toFixed(1)} / 16 GB`;
    document.getElementById("remote-uptime").textContent = `${Math.floor(Math.random() * 5 + 1)}g ${Math.floor(Math.random() * 20 + 1)}h`;
    showToast(`Sessione remota connessa con successo a ${a.hostname}!`, "success");
  }, 800);
}

function runRemoteAction(action) {
  const resultBox = document.getElementById("remote-action-result");
  resultBox.classList.remove("hidden");
  resultBox.style.color = "#fcd34d";
  resultBox.textContent = "⏳ Esecuzione comando sulla postazione remota in corso...";

  setTimeout(() => {
    resultBox.style.color = "#4ade80";
    if (action === "gpupdate") {
      resultBox.innerHTML = `<strong>PS C:\\WINDOWS\\system32> gpupdate /force</strong><br>Aggiornamento criteri utente e computer in corso...<br>✓ Criteri di Gruppo (GPO) aggiornati con successo senza errori.`;
      showToast("Criteri di Gruppo GPO aggiornati sul client!", "success");
    } else if (action === "spooler") {
      resultBox.innerHTML = `<strong>PS C:\\WINDOWS\\system32> Restart-Service Spooler -Force</strong><br>Servizio Spooler arrestato.<br>✓ Servizio Spooler riavviato e code pulite.`;
      showToast("Spooler di stampa riavviato sulla postazione!", "success");
    } else if (action === "eventvwr") {
      resultBox.innerHTML = `<strong>PS C:\\WINDOWS\\system32> Get-EventLog -LogName System -Newest 10</strong><br>Event ID 1074: Arresto regolare del sistema.<br>Event ID 7036: Servizio Windows Update avviato.<br>✓ Nessun errore critico rilevato nei registri.`;
      showToast("Registri eventi verificati: nessun errore critico!", "info");
    } else if (action === "sfc") {
      resultBox.innerHTML = `<strong>PS C:\\WINDOWS\\system32> sfc /scannow</strong><br>Verifica del file system di Windows completata al 100%.<br>✓ Protezione risorse di Windows: nessuna violazione di integrità trovata.`;
      showToast("Scansione sfc completata con successo!", "success");
    }
  }, 500);
}

function disconnectRemoteAssist() {
  closeModal("modal-remote-assist");
  showToast("Sessione di assistenza remota terminata.", "info");
}

// Invia nota con tasto Invio
document.getElementById("input-new-note")?.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    addNoteToActiveTicket();
  }
});
