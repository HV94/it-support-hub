/**
 * ==============================================================================
 * IT SUPPORT HUB - PANNELLO ASSISTENZA & SERVICE DESK L1
 * Sviluppato da Valentyn Haidukov (IT Support Specialist - L. 68/99)
 * ==============================================================================
 * Codice sorgente JavaScript Vanilla pulito, trasparente e ben commentato.
 * Funzionalità principali:
 * - Coda ticket di supporto con filtro per stato, priorità e categoria
 * - Dettaglio ticket con cronologia interventi (Worklog) e aggiornamento stato
 * - Inventario hardware aziendale (CMDB postazioni e apparati di rete)
 * - Calcolatore Subnet IPv4 (Network ID, Maschera, Broadcast, Host utilizzabili)
 * - Toolkit PowerShell con script di ripristino spooler, DNS e diagnostica client
 * - Persistenza locale dei dati in localStorage ed esportazione backup JSON
 * ==============================================================================
 */

// ------------------------------------------------------------------------------
// 1. DATASET INIZIALE TICKET & INVENTARIO ASSET (Simulazione ambiente Help Desk)
// ------------------------------------------------------------------------------
const DEFAULT_TICKETS = [
  {
    id: "TICK-101",
    user: "Elena Moretti",
    department: "Amministrazione & Contabilità",
    category: "Hardware & Periferiche",
    subject: "Stampante di rete Kyocera TASKalfa non risponde su porta RAW 9100",
    asset: "PRN-KYO-ADM01 (192.168.1.200)",
    priority: "Alta",
    status: "In Lavorazione",
    date: "2026-11-23 09:15",
    description: "I documenti inviati in stampa rimangono bloccati in coda su 3 postazioni Windows 11. Connessione socket socket porta 9100 fallita.",
    worklog: [
      { tech: "Valentyn Haidukov", date: "2026-11-23 09:25", text: "Ping positivo (<1ms). Coda di stampa locale corrotta." },
      { tech: "Valentyn Haidukov", date: "2026-11-23 09:40", text: "Eseguito script PowerShell per arresto servizio Spooler, pulizia cartella spool\\PRINTERS e riavvio." }
    ]
  },
  {
    id: "TICK-102",
    user: "Roberto De Angelis",
    department: "Ufficio Commerciale",
    category: "Microsoft 365 & Mail",
    subject: "Outlook 365 richiede continuamente inserimento credenziali Entra ID",
    asset: "W11-COMM-04 (HP EliteBook 840)",
    priority: "Media",
    status: "Aperto",
    date: "2026-11-23 10:02",
    description: "All'avvio di Outlook compare popup continuo di richiesta password per l'account aziendale M365.",
    worklog: [
      { tech: "Valentyn Haidukov", date: "2026-11-23 10:15", text: "Pianificata rimozione token di sessione corrotto nel Windows Credential Manager." }
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
    status: "In Attesa",
    date: "2026-11-22 16:40",
    description: "Durante l'elaborazione dei prospetti la workstation si è riavviata con schermata blu.",
    worklog: [
      { tech: "Valentyn Haidukov", date: "2026-11-22 17:05", text: "Minidump punta al driver di rete Realtek. Eseguito DISM /RestoreHealth e SFC /scannow." }
    ]
  },
  {
    id: "TICK-104",
    user: "Marco Santoro",
    department: "Magazzino & Logistica",
    category: "Account & Permessi",
    subject: "Account Active Directory bloccato dopo 3 tentativi errati di password",
    asset: "W11-LOG-01 (Lenovo ThinkCentre M70q)",
    priority: "Bassa",
    status: "Risolto",
    date: "2026-11-22 14:10",
    description: "Utente rientrato dalle ferie non ricorda la nuova password impostata prima della scadenza.",
    worklog: [
      { tech: "Valentyn Haidukov", date: "2026-11-22 14:15", text: "Verificato stato account in AD. Eseguito sblocco utente e reset password temporanea con flag cambio obbligatorio al primo accesso." }
    ]
  },
  {
    id: "TICK-105",
    user: "Simona Valenti",
    department: "Direzione Generale",
    category: "Rete LAN & Connettività",
    subject: "Laptop aziendale non ottiene indirizzo IP valido in Wi-Fi (IP APIPA 169.254.x.x)",
    asset: "W11-DIR-01 (Dell XPS 13)",
    priority: "Alta",
    status: "Chiuso",
    date: "2026-11-21 11:30",
    description: "Il portatile si collega all'SSID aziendale ma non naviga e non raggiunge i file server.",
    worklog: [
      { tech: "Valentyn Haidukov", date: "2026-11-21 11:45", text: "Eseguito ipconfig /release e ipconfig /renew. Connessione ripristinata con IP 192.168.1.115." }
    ]
  }
];

const DEFAULT_ASSETS = [
  {
    id: "AST-001",
    hostname: "W11-HR-02",
    type: "Desktop PC",
    model: "Dell OptiPlex 7090 Micro",
    serial: "7XG81P3",
    user: "Chiara Fontana",
    department: "Risorse Umane",
    location: "Sede Centrale - Piano 1",
    ip: "192.168.1.102",
    status: "In Uso",
    warranty: "2027-09-15",
    specs: "Intel Core i5-11500, 16GB DDR4, SSD 512GB NVMe, Windows 11 Pro 64-bit"
  },
  {
    id: "AST-002",
    hostname: "W11-COMM-04",
    type: "Notebook",
    model: "HP EliteBook 840 G9",
    serial: "5CD23910KL",
    user: "Roberto De Angelis",
    department: "Commerciale",
    location: "Postazione Remota / Ufficio Est",
    ip: "192.168.1.108",
    status: "In Uso",
    warranty: "2027-03-30",
    specs: "Intel Core i7-1260P, 32GB DDR5, SSD 1TB NVMe, Wi-Fi 6E, Win 11 Pro"
  },
  {
    id: "AST-003",
    hostname: "W11-STK-01",
    type: "Notebook",
    model: "Lenovo ThinkPad T14 Gen 3",
    serial: "PF3Z98AA",
    user: "Magazzino IT (Scorta)",
    department: "IT & Sistemi",
    location: "Armadio Rack - Laboratorio",
    ip: "DHCP",
    status: "Scorta Magazzino",
    warranty: "2026-12-31",
    specs: "AMD Ryzen 5 Pro 6650U, 16GB LPDDR5, SSD 512GB, Pronto per deploy"
  },
  {
    id: "AST-004",
    hostname: "PRN-KYO-ADM01",
    type: "Stampante di Rete",
    model: "Kyocera TASKalfa 3253ci",
    serial: "Q8A1904512",
    user: "Condivisa Ufficio Contabilità",
    department: "Amministrazione",
    location: "Corridoio Amministrazione",
    ip: "192.168.1.200",
    status: "In Riparazione",
    warranty: "2028-01-20",
    specs: "Multifunzione laser A3/A4 colore, Porta RAW 9100, IP Statico"
  },
  {
    id: "AST-005",
    hostname: "SW-CISCO-FL1",
    type: "Dispositivo di Rete",
    model: "Cisco Catalyst 1000 24P PoE+",
    serial: "FOC241908LK",
    user: "Infrastruttura Rete LAN",
    department: "IT & Sistemi",
    location: "Rack CED - Piano 1",
    ip: "192.168.1.2",
    status: "In Uso",
    warranty: "2029-06-10",
    specs: "Switch Layer 2 gestito, 24 porte Gigabit PoE+, 4 uplink SFP"
  }
];

const TOOLKIT_ITEMS = [
  {
    id: "tool-spooler",
    title: "Reset Coda e Servizio Spooler di Stampa",
    category: "Hardware & Stampanti",
    desc: "Arresta lo Spooler Windows, elimina i file di stampa corrotti (.SPL e .SHD) nella cartella di sistema e riavvia il servizio.",
    code: `Stop-Service -Name Spooler -Force\nRemove-Item -Path "C:\\Windows\\System32\\spool\\PRINTERS\\*" -Force -Recurse\nStart-Service -Name Spooler`,
    output: `Servizio Spooler arrestato.\nFile di coda eliminati con successo.\nServizio Spooler riavviato e operativo.`
  },
  {
    id: "tool-dns",
    title: "Svuotamento Cache DNS e Rinnovo DHCP",
    category: "Rete & Connettività",
    desc: "Cancella le voci DNS locali e richiede una nuova concessione IP al server DHCP aziendale.",
    code: `ipconfig /flushdns\nipconfig /release\nipconfig /renew`,
    output: `Configurazione IP di Windows\n\nCache del resolver DNS svuotata.\nIndirizzo IPv4 rinnovato con successo: 192.168.1.112 /24.`
  },
  {
    id: "tool-port-test",
    title: "Test Connessione Socket TCP su Porte di Servizio",
    category: "Rete & Diagnostica",
    desc: "Verifica se una porta socket remota (es. porta RAW 9100 o SMB 445) risponde senza bisogno di Telnet.",
    code: `Test-NetConnection -ComputerName 192.168.1.200 -Port 9100`,
    output: `ComputerName     : 192.168.1.200\nRemoteAddress    : 192.168.1.200\nRemotePort       : 9100\nTcpTestSucceeded : True`
  },
  {
    id: "tool-sfc",
    title: "Riparazione File di Sistema (DISM + SFC)",
    category: "Manutenzione Windows",
    desc: "Ripristina l'archivio componenti di Windows Online e analizza i binari protetti correggendo file corrotti.",
    code: `DISM /Online /Cleanup-Image /RestoreHealth\nsfc /scannow`,
    output: `Operazione di ripristino completata al 100%.\nProtezione risorse di Windows: file danneggiati ripristinati con successo.`
  }
];

// ------------------------------------------------------------------------------
// 2. STATO APPLICAZIONE (Caricamento & Salvataggio localStorage)
// ------------------------------------------------------------------------------
let tickets = caricaDati("it_tickets", DEFAULT_TICKETS);
let assets = caricaDati("it_assets", DEFAULT_ASSETS);
let currentView = "dashboard";
let activeTicketId = null;
let activeAssetId = null;

function caricaDati(key, fallback) {
  try {
    const salvati = localStorage.getItem(key);
    return salvati ? JSON.parse(salvati) : fallback;
  } catch (e) {
    return fallback;
  }
}

function salvaDati() {
  try {
    localStorage.setItem("it_tickets", JSON.stringify(tickets));
    localStorage.setItem("it_assets", JSON.stringify(assets));
  } catch (e) {
    console.error("Errore salvataggio localStorage:", e);
  }
}

// ------------------------------------------------------------------------------
// 3. INIZIALIZZAZIONE & EVENT LISTENERS
// ------------------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  setupNavigation();
  setupFilterListeners();
  setupModalListeners();
  setupSubnetCalculator();
  renderAll();
});

function setupNavigation() {
  document.querySelectorAll(".sidebar-nav .nav-item[data-view]").forEach(item => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      switchView(item.dataset.view);
    });
  });

  const btnGotoTickets = document.getElementById("btn-goto-tickets");
  if (btnGotoTickets) btnGotoTickets.addEventListener("click", () => switchView("tickets"));

  const btnQuickNewTicket = document.getElementById("btn-quick-new-ticket");
  const btnCreateTicket = document.getElementById("btn-create-ticket-modal");
  if (btnQuickNewTicket) btnQuickNewTicket.addEventListener("click", () => openModal("modal-ticket"));
  if (btnCreateTicket) btnCreateTicket.addEventListener("click", () => openModal("modal-ticket"));

  const btnQuickNewAsset = document.getElementById("btn-quick-new-asset");
  const btnCreateAsset = document.getElementById("btn-create-asset-modal");
  if (btnQuickNewAsset) btnQuickNewAsset.addEventListener("click", () => openModal("modal-asset"));
  if (btnCreateAsset) btnCreateAsset.addEventListener("click", () => openModal("modal-asset"));

  // Tasti rapidi dashboard
  const btnSpooler = document.getElementById("btn-quick-spooler");
  const btnFlush = document.getElementById("btn-quick-flushdns");
  const btnCalc = document.getElementById("btn-quick-calc");

  if (btnSpooler) btnSpooler.addEventListener("click", () => {
    switchView("toolkit");
    showToast("Aperto script PowerShell per reset Spooler di stampa", "info");
  });
  if (btnFlush) btnFlush.addEventListener("click", () => {
    switchView("toolkit");
    showToast("Aperto script flushdns e rinnovo DHCP", "info");
  });
  if (btnCalc) btnCalc.addEventListener("click", () => {
    switchView("toolkit");
    const ipInput = document.getElementById("subnet-ip");
    if (ipInput) ipInput.focus();
  });

  // Esportazione Dati & Reset Demo
  const btnExport = document.getElementById("btn-export-data");
  if (btnExport) {
    btnExport.addEventListener("click", (e) => {
      e.preventDefault();
      const backup = { tickets, assets, exportDate: new Date().toISOString() };
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `IT_Support_Backup_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast("Backup JSON esportato con successo!", "success");
    });
  }

  const btnReset = document.getElementById("btn-reset-demo");
  if (btnReset) {
    btnReset.addEventListener("click", (e) => {
      e.preventDefault();
      if (confirm("Ripristinare tutti i ticket e gli asset ai dati demo iniziali?")) {
        tickets = JSON.parse(JSON.stringify(DEFAULT_TICKETS));
        assets = JSON.parse(JSON.stringify(DEFAULT_ASSETS));
        salvaDati();
        renderAll();
        showToast("Dati demo ripristinati correttamente.", "info");
      }
    });
  }
}

function switchView(viewName) {
  currentView = viewName;
  document.querySelectorAll(".sidebar-nav .nav-item").forEach(item => {
    if (item.dataset.view) {
      item.classList.toggle("active", item.dataset.view === viewName);
    }
  });

  document.querySelectorAll(".view-section").forEach(sec => {
    sec.classList.remove("active");
  });

  const activeSec = document.getElementById(`view-${viewName}`);
  if (activeSec) activeSec.classList.add("active");

  const titles = {
    dashboard: "Pannello Assistenza & Ticket",
    tickets: "Coda Richieste di Assistenza IT",
    assets: "Inventario Postazioni & Asset (CMDB)",
    toolkit: "Strumenti Diagnostica & Script PowerShell"
  };
  const pageTitle = document.getElementById("page-title");
  if (pageTitle && titles[viewName]) pageTitle.textContent = titles[viewName];

  renderAll();
}

function setupFilterListeners() {
  const globalSearch = document.getElementById("global-search-input");
  if (globalSearch) {
    globalSearch.addEventListener("input", (e) => {
      const q = e.target.value.trim().toLowerCase();
      if (q) {
        if (currentView === "dashboard") switchView("tickets");
        const ticketSearch = document.getElementById("filter-ticket-search");
        if (ticketSearch) ticketSearch.value = q;
        renderTickets();
      }
    });
  }

  ["filter-ticket-search", "filter-ticket-status", "filter-ticket-priority", "filter-ticket-category"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("input", renderTickets);
  });

  ["filter-asset-search", "filter-asset-type", "filter-asset-status"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("input", renderAssets);
  });
}

function setupModalListeners() {
  document.querySelectorAll("[data-close]").forEach(btn => {
    btn.addEventListener("click", () => closeModal(btn.dataset.close));
  });

  // Chiusura cliccando l'overlay
  document.querySelectorAll(".modal-overlay").forEach(overlay => {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeModal(overlay.id);
    });
  });

  // Form Creazione Ticket
  const formTicket = document.getElementById("form-ticket");
  if (formTicket) {
    formTicket.addEventListener("submit", (e) => {
      e.preventDefault();
      const newTicket = {
        id: "TICK-" + (100 + tickets.length + 1),
        user: document.getElementById("ticket-user").value,
        department: document.getElementById("ticket-dept").value,
        category: document.getElementById("ticket-category").value,
        subject: document.getElementById("ticket-subject").value,
        asset: document.getElementById("ticket-asset").value || "N/A",
        priority: document.getElementById("ticket-priority").value,
        status: "Aperto",
        date: new Date().toISOString().slice(0, 16).replace("T", " "),
        description: document.getElementById("ticket-desc").value,
        worklog: [{ tech: "Valentyn Haidukov", date: new Date().toISOString().slice(0, 16).replace("T", " "), text: "Ticket aperto e preso in carico." }]
      };

      tickets.unshift(newTicket);
      salvaDati();
      closeModal("modal-ticket");
      formTicket.reset();
      renderAll();
      showToast(`Ticket #${newTicket.id} registrato con successo!`, "success");
    });
  }

  // Modifica Stato Ticket nel Dettaglio
  const btnSaveStatus = document.getElementById("btn-save-ticket-status");
  if (btnSaveStatus) {
    btnSaveStatus.addEventListener("click", () => {
      if (!activeTicketId) return;
      const t = tickets.find(x => x.id === activeTicketId);
      const newStatus = document.getElementById("detail-change-status").value;
      if (t && newStatus) {
        t.status = newStatus;
        t.worklog.push({ tech: "Valentyn Haidukov", date: new Date().toISOString().slice(0, 16).replace("T", " "), text: `Stato ticket aggiornato a: ${newStatus}` });
        salvaDati();
        renderAll();
        openTicketDetail(t.id);
        showToast(`Stato ticket aggiornato a ${newStatus}`, "success");
      }
    });
  }

  // Aggiunta Nota / Worklog
  const btnAddNote = document.getElementById("btn-add-ticket-note");
  if (btnAddNote) {
    btnAddNote.addEventListener("click", () => {
      if (!activeTicketId) return;
      const t = tickets.find(x => x.id === activeTicketId);
      const noteInput = document.getElementById("detail-add-note");
      const noteText = noteInput ? noteInput.value.trim() : "";
      if (t && noteText) {
        t.worklog.push({ tech: "Valentyn Haidukov", date: new Date().toISOString().slice(0, 16).replace("T", " "), text: noteText });
        noteInput.value = "";
        salvaDati();
        renderAll();
        openTicketDetail(t.id);
        showToast("Nuova nota registrata nel worklog", "info");
      }
    });
  }

  // Form Creazione Asset
  const formAsset = document.getElementById("form-asset");
  if (formAsset) {
    formAsset.addEventListener("submit", (e) => {
      e.preventDefault();
      const newAsset = {
        id: "AST-" + String(assets.length + 1).padStart(3, "0"),
        hostname: document.getElementById("asset-hostname").value,
        type: document.getElementById("asset-type").value,
        model: document.getElementById("asset-model").value,
        serial: document.getElementById("asset-serial").value,
        user: document.getElementById("asset-user").value || "Non assegnato",
        department: "Generale",
        location: document.getElementById("asset-location").value,
        ip: document.getElementById("asset-ip").value || "DHCP",
        status: document.getElementById("asset-status").value,
        warranty: document.getElementById("asset-warranty-date").value,
        specs: document.getElementById("asset-specs").value || "Configurazione standard"
      };

      assets.push(newAsset);
      salvaDati();
      closeModal("modal-asset");
      formAsset.reset();
      renderAll();
      showToast(`Asset #${newAsset.id} (${newAsset.hostname}) censito correttamente!`, "success");
    });
  }
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add("active");
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove("active");
}

// ------------------------------------------------------------------------------
// 4. RENDERING GRAFICO (Dashboard, Tabelle Ticket & Asset, Toolkit)
// ------------------------------------------------------------------------------
function renderAll() {
  renderKPIs();
  if (currentView === "dashboard") renderDashboard();
  else if (currentView === "tickets") renderTickets();
  else if (currentView === "assets") renderAssets();
  else if (currentView === "toolkit") renderToolkit();
}

function renderKPIs() {
  const openCount = tickets.filter(t => t.status === "Aperto" || t.status === "In Lavorazione").length;
  const criticalCount = tickets.filter(t => t.priority === "Critica" && t.status !== "Chiuso" && t.status !== "Risolto").length;
  const totalAssets = assets.length;
  const stockAssets = assets.filter(a => a.status === "Scorta Magazzino").length;

  const kpiOpen = document.getElementById("kpi-open-tickets");
  const kpiCritical = document.getElementById("kpi-critical-tickets");
  const kpiAssets = document.getElementById("kpi-total-assets");
  const kpiStock = document.getElementById("kpi-stock-assets");
  const sidebarCount = document.getElementById("sidebar-open-tickets-count");

  if (kpiOpen) kpiOpen.textContent = openCount;
  if (kpiCritical) kpiCritical.textContent = criticalCount;
  if (kpiAssets) kpiAssets.textContent = totalAssets;
  if (kpiStock) kpiStock.textContent = stockAssets;
  if (sidebarCount) sidebarCount.textContent = openCount;
}

function renderDashboard() {
  const tbody = document.getElementById("dashboard-tickets-tbody");
  if (!tbody) return;

  const recenti = [...tickets].slice(0, 5);
  tbody.innerHTML = recenti.map(t => `
    <tr style="cursor: pointer;" onclick="openTicketDetail('${t.id}')">
      <td><code>${t.id}</code></td>
      <td><strong>${t.user}</strong></td>
      <td>${t.subject}</td>
      <td>${getBadge(t.priority)}</td>
      <td>${getBadge(t.status)}</td>
    </tr>
  `).join("");
}

function renderTickets() {
  const tbody = document.getElementById("tickets-tbody");
  if (!tbody) return;

  const q = (document.getElementById("filter-ticket-search")?.value || "").toLowerCase();
  const fStatus = document.getElementById("filter-ticket-status")?.value || "all";
  const fPriority = document.getElementById("filter-ticket-priority")?.value || "all";
  const fCategory = document.getElementById("filter-ticket-category")?.value || "all";

  const filtrati = tickets.filter(t => {
    const matchQ = !q || t.id.toLowerCase().includes(q) || t.user.toLowerCase().includes(q) || t.subject.toLowerCase().includes(q) || t.asset.toLowerCase().includes(q);
    const matchStatus = (fStatus === "all" || t.status === fStatus);
    const matchPriority = (fPriority === "all" || t.priority === fPriority);
    const matchCategory = (fCategory === "all" || t.category === fCategory);
    return matchQ && matchStatus && matchPriority && matchCategory;
  });

  tbody.innerHTML = filtrati.map(t => `
    <tr style="cursor: pointer;" onclick="openTicketDetail('${t.id}')">
      <td><code>${t.id}</code></td>
      <td><strong>${t.user}</strong><div style="font-size: 0.72rem; color: #64748b;">${t.department}</div></td>
      <td><div style="font-weight: 600;">${t.subject}</div><div style="font-size: 0.72rem; color: #64748b;">${t.category} &bull; ${t.asset}</div></td>
      <td>${getBadge(t.priority)}</td>
      <td>${getBadge(t.status)}</td>
      <td style="font-size: 0.75rem; color: #64748b;">${t.date}</td>
    </tr>
  `).join("");
}

function renderAssets() {
  const tbody = document.getElementById("assets-tbody");
  if (!tbody) return;

  const q = (document.getElementById("filter-asset-search")?.value || "").toLowerCase();
  const fType = document.getElementById("filter-asset-type")?.value || "all";
  const fStatus = document.getElementById("filter-asset-status")?.value || "all";

  const filtrati = assets.filter(a => {
    const matchQ = !q || a.hostname.toLowerCase().includes(q) || a.model.toLowerCase().includes(q) || a.serial.toLowerCase().includes(q) || a.user.toLowerCase().includes(q);
    const matchType = (fType === "all" || a.type === fType);
    const matchStatus = (fStatus === "all" || a.status === fStatus);
    return matchQ && matchType && matchStatus;
  });

  tbody.innerHTML = filtrati.map(a => `
    <tr style="cursor: pointer;" onclick="openAssetDetail('${a.id}')">
      <td><code>${a.hostname}</code></td>
      <td><strong>${a.model}</strong><div style="font-size: 0.72rem; color: #64748b;">${a.type}</div></td>
      <td><code>${a.serial}</code></td>
      <td>${a.user}</td>
      <td>${getBadge(a.status)}</td>
      <td><code>${a.ip}</code></td>
    </tr>
  `).join("");
}

function renderToolkit() {
  const container = document.getElementById("toolkit-scripts-list");
  if (!container) return;

  container.innerHTML = TOOLKIT_ITEMS.map(item => `
    <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.25rem; margin-bottom: 1rem;">
      <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.5rem;">
        <h4 style="margin: 0; font-size: 1rem; color: #0f172a;">${item.title}</h4>
        <span style="font-size: 0.72rem; background: #e0f2fe; color: #0284c7; padding: 2px 8px; border-radius: 4px; font-weight: 700;">${item.category}</span>
      </div>
      <p style="font-size: 0.85rem; color: #475569; margin-bottom: 0.75rem;">${item.desc}</p>
      
      <div style="background: #0f172a; color: #38bdf8; padding: 0.85rem; border-radius: 6px; font-family: monospace; font-size: 0.82rem; position: relative;">
        <button onclick="copiaScript('${item.id}')" style="position: absolute; top: 8px; right: 8px; background: rgba(255,255,255,0.15); color: #fff; border: none; padding: 3px 8px; border-radius: 4px; font-size: 0.72rem; cursor: pointer;">📋 Copia</button>
        <pre style="margin: 0; white-space: pre-wrap;" id="code-${item.id}">${item.code}</pre>
      </div>
    </div>
  `).join("");
}

function copiaScript(id) {
  const el = document.getElementById(`code-${id}`);
  if (el) {
    navigator.clipboard.writeText(el.textContent);
    showToast("Comando copiato negli appunti!", "success");
  }
}

// ------------------------------------------------------------------------------
// 5. MODALI DETTAGLIO TICKET & ASSET
// ------------------------------------------------------------------------------
function openTicketDetail(id) {
  const t = tickets.find(x => x.id === id);
  if (!t) return;
  activeTicketId = t.id;

  const titleEl = document.getElementById("detail-ticket-title");
  const prioEl = document.getElementById("detail-ticket-priority-badge");
  const statusEl = document.getElementById("detail-ticket-status-badge");
  const catEl = document.getElementById("detail-ticket-cat-badge");
  const userEl = document.getElementById("detail-ticket-user");
  const deptEl = document.getElementById("detail-ticket-dept");
  const assetEl = document.getElementById("detail-ticket-asset");
  const descEl = document.getElementById("detail-ticket-desc");
  const changeSelect = document.getElementById("detail-change-status");
  const timelineEl = document.getElementById("detail-ticket-timeline");

  if (titleEl) titleEl.textContent = `Ticket #${t.id}: ${t.subject}`;
  if (prioEl) prioEl.innerHTML = getBadge(t.priority);
  if (statusEl) statusEl.innerHTML = getBadge(t.status);
  if (catEl) catEl.textContent = t.category;
  if (userEl) userEl.textContent = t.user;
  if (deptEl) deptEl.textContent = t.department;
  if (assetEl) assetEl.textContent = t.asset;
  if (descEl) descEl.textContent = t.description;
  if (changeSelect) changeSelect.value = t.status;

  if (timelineEl) {
    timelineEl.innerHTML = t.worklog.map(w => `
      <div style="border-left: 2px solid #38bdf8; padding-left: 0.85rem; margin-bottom: 0.85rem;">
        <div style="font-size: 0.75rem; color: #64748b; font-weight: 600;">${w.tech} &bull; ${w.date}</div>
        <div style="font-size: 0.85rem; color: #1e293b; margin-top: 0.2rem;">${w.text}</div>
      </div>
    `).join("");
  }

  openModal("modal-ticket-detail");
}

function openAssetDetail(id) {
  const a = assets.find(x => x.id === id);
  if (!a) return;
  activeAssetId = a.id;

  const titleEl = document.getElementById("detail-asset-title");
  const hostEl = document.getElementById("detail-asset-host");
  const typeEl = document.getElementById("detail-asset-type");
  const modelEl = document.getElementById("detail-asset-model");
  const serialEl = document.getElementById("detail-asset-serial");
  const userEl = document.getElementById("detail-asset-user");
  const locEl = document.getElementById("detail-asset-loc");
  const ipEl = document.getElementById("detail-asset-ip");
  const warrantyEl = document.getElementById("detail-asset-warranty");
  const specsEl = document.getElementById("detail-asset-specs");

  if (titleEl) titleEl.textContent = `Scheda Tecnica Asset #${a.id} (${a.hostname})`;
  if (hostEl) hostEl.textContent = a.hostname;
  if (typeEl) typeEl.textContent = a.type;
  if (modelEl) modelEl.textContent = a.model;
  if (serialEl) serialEl.textContent = a.serial;
  if (userEl) userEl.textContent = a.user;
  if (locEl) locEl.textContent = a.location;
  if (ipEl) ipEl.textContent = a.ip;
  if (warrantyEl) warrantyEl.textContent = a.warranty;
  if (specsEl) specsEl.textContent = a.specs;

  openModal("modal-asset-detail");
}

// ------------------------------------------------------------------------------
// 6. CALCOLATORE SUBNET IPV4
// ------------------------------------------------------------------------------
function setupSubnetCalculator() {
  const btn = document.getElementById("btn-calc-subnet");
  if (btn) btn.addEventListener("click", calcolaSubnet);
}

function calcolaSubnet() {
  const ipInput = document.getElementById("subnet-ip");
  const cidrSelect = document.getElementById("subnet-cidr");
  if (!ipInput || !cidrSelect) return;

  const ipStr = ipInput.value.trim() || "192.168.1.0";
  const cidr = parseInt(cidrSelect.value, 10) || 24;

  const parts = ipStr.split(".").map(x => parseInt(x, 10));
  if (parts.length !== 4 || parts.some(n => isNaN(n) || n < 0 || n > 255)) {
    showToast("Indirizzo IP non valido. Inserire formato es. 192.168.1.0", "error");
    return;
  }

  const maskInt = ~((1 << (32 - cidr)) - 1) >>> 0;
  const ipInt = ((parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3]) >>> 0;
  const netInt = (ipInt & maskInt) >>> 0;
  const broadInt = (netInt | ~maskInt) >>> 0;

  const intToIp = (val) => `${(val >>> 24) & 255}.${(val >>> 16) & 255}.${(val >>> 8) & 255}.${val & 255}`;
  const totalHosts = Math.pow(2, 32 - cidr);
  const usableHosts = Math.max(0, totalHosts - 2);

  const resNet = document.getElementById("sub-res-network");
  const resMask = document.getElementById("sub-res-mask");
  const resRange = document.getElementById("sub-res-range");
  const resBroad = document.getElementById("sub-res-broadcast");
  const resHosts = document.getElementById("sub-res-hosts");

  if (resNet) resNet.textContent = `${intToIp(netInt)} /${cidr}`;
  if (resMask) resMask.textContent = intToIp(maskInt);
  if (resRange) resRange.textContent = `${intToIp(netInt + 1)} - ${intToIp(broadInt - 1)}`;
  if (resBroad) resBroad.textContent = intToIp(broadInt);
  if (resHosts) resHosts.textContent = `${usableHosts} indirizzi assegnabili`;

  showToast(`Calcolata subnet /${cidr} con successo!`, "success");
}

// ------------------------------------------------------------------------------
// 7. HELPER BADGE & TOAST NOTIFICHE
// ------------------------------------------------------------------------------
function getBadge(val) {
  let bg = "#f1f5f9";
  let col = "#475569";

  switch (val) {
    case "Aperto": bg = "#fee2e2"; col = "#dc2626"; break;
    case "In Lavorazione": bg = "#fef3c7"; col = "#d97706"; break;
    case "In Attesa": bg = "#f3e8ff"; col = "#9333ea"; break;
    case "Risolto": case "Chiuso": bg = "#dcfce7"; col = "#16a34a"; break;
    case "Critica": bg = "#fee2e2"; col = "#b91c1c"; break;
    case "Alta": bg = "#ffedd5"; col = "#c2410c"; break;
    case "Media": bg = "#fef3c7"; col = "#b45309"; break;
    case "Bassa": bg = "#f0fdf4"; col = "#15803d"; break;
    case "In Uso": bg = "#dcfce7"; col = "#15803d"; break;
    case "Scorta Magazzino": bg = "#e0f2fe"; col = "#0284c7"; break;
    case "In Riparazione": bg = "#fee2e2"; col = "#b91c1c"; break;
  }
  return `<span style="background:${bg}; color:${col}; font-weight:700; padding:2px 8px; border-radius:6px; font-size:0.75rem;">${val}</span>`;
}

function showToast(msg, type = "info") {
  const container = document.getElementById("toast-container");
  if (!container) return;
  const t = document.createElement("div");
  t.style.cssText = "background: #0f172a; color: #fff; padding: 10px 16px; border-radius: 8px; margin-top: 8px; font-size: 0.85rem; box-shadow: 0 4px 12px rgba(0,0,0,0.15); display: flex; align-items: center; gap: 8px; border-left: 4px solid #38bdf8;";
  if (type === "success") t.style.borderLeftColor = "#22c55e";
  if (type === "error") t.style.borderLeftColor = "#ef4444";
  t.textContent = msg;
  container.appendChild(t);
  setTimeout(() => {
    t.style.opacity = "0";
    t.style.transition = "opacity 0.3s ease";
    setTimeout(() => t.remove(), 300);
  }, 3000);
}
