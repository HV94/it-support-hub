/**
 * IT Support Hub - Enterprise Service Desk & Asset CMDB
 * Autore: Valentyn Haidukov (IT Support Specialist L1)
 * Logica client-side con persistenza localStorage, filtri e toolkit PowerShell
 */

// =============================================================================
// DATI DI DEFAULT (DEMO DATA REALISTICI AMBIENTE ENTERPRISE WINDOWS)
// =============================================================================

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
    description: "Da stamattina tutti i documenti inviati in stampa rimangono bloccati in coda 'Errore - In stampa'. Riavviata la stampante dal display frontale ma i client Windows 11 continuano a fallire la connessione socket sulla porta 9100.",
    worklog: [
      {
        tech: "Valentyn Haidukov",
        date: "2026-11-23 09:25",
        text: "Eseguito ping verso 192.168.1.200 con esito positivo (<1ms). Test-NetConnection su porta 9100 fallito (porta chiusa o blocco driver). Coda di stampa locale corrotta su 3 postazioni contabili."
      },
      {
        tech: "Valentyn Haidukov",
        date: "2026-11-23 09:40",
        text: "Eseguito script PowerShell per arresto servizio Spooler, pulizia dei file .SPL/.SHD nella cartella spool\\PRINTERS e riavvio servizio. In attesa di verifica stampa prova con l'utente."
      }
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
    description: "All'avvio del client desktop di Outlook compare popup continuo di richiesta password per l'account aziendale M365. L'accesso via portale web (portal.office.com) funziona regolarmente.",
    worklog: [
      {
        tech: "Valentyn Haidukov",
        date: "2026-11-23 10:15",
        text: "Ticket assegnato. Problema tipico di Modern Authentication o token di sessione corrotto nel Windows Credential Manager. Pianificato intervento in Desktop Remoto."
      }
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
    description: "Durante l'elaborazione dei prospetti presenze mensili la workstation si è riavviata improvvisamente con schermata blu. Riavviando, il sistema ha impiegato 10 minuti per ripristinare il file system.",
    worklog: [
      {
        tech: "Valentyn Haidukov",
        date: "2026-11-22 17:05",
        text: "Analizzato il file minidump in C:\\Windows\\Minidump. Il codice di bugcheck punta al driver di rete Realtek PCIe GbE (rt640x64.sys). Eseguito DISM /RestoreHealth e SFC /scannow (rilevati e riparati file corrotti)."
      },
      {
        tech: "Valentyn Haidukov",
        date: "2026-11-22 17:30",
        text: "Scaricato pacchetto driver certificato Dell Command | Update. In attesa di finestra di manutenzione concordata con l'utente per riavvio finale."
      }
    ]
  },
  {
    id: "TICK-104",
    user: "Simone Ferri",
    department: "Marketing & Comunicazione",
    category: "Rete & Connettività",
    subject: "Postazione grafica disconnessa da share di rete (Unità Z: Fileserver)",
    asset: "W11-MKT-01 (Dell Precision 3650)",
    priority: "Media",
    status: "Risolto",
    date: "2026-11-21 11:20",
    description: "L'unità di rete mappata Z: su fileserver.corp.local non è raggiungibile. Errore Windows: 'Impossibile trovare il percorso di rete (0x80070035)'.",
    worklog: [
      {
        tech: "Valentyn Haidukov",
        date: "2026-11-21 11:40",
        text: "Verificato stato scheda di rete: il client aveva un indirizzo APIPA (169.254.x.x) a causa di un cavo patch RJ45 difettoso sulla presa a muro. Sostituito cavo con patch Cat 6, eseguito ipconfig /renew. Leasing DHCP ripristinato e share Z: accessibile."
      }
    ]
  },
  {
    id: "TICK-105",
    user: "Giulia Marini",
    department: "Direzione Generale",
    category: "Account & Active Directory",
    subject: "Onboarding nuovo consulente: creazione utente e permessi cartelle riservate",
    asset: "W11-DIR-02 (Lenovo ThinkPad X1)",
    priority: "Alta",
    status: "Chiuso",
    date: "2026-11-20 14:00",
    description: "Richiesta abilitazione utente temporaneo per consulente esterno con accesso a M365 Business Standard e cartella Documenti_DG.",
    worklog: [
      {
        tech: "Valentyn Haidukov",
        date: "2026-11-20 15:15",
        text: "Creato account su Active Directory Domain Services (OU Consulenti_Esterni) con scadenza a 90 giorni. Sincronizzato su Entra ID tramite Azure AD Connect. Abilitata policy MFA e verificate ACL di cartella."
      }
    ]
  }
];

const DEFAULT_ASSETS = [
  {
    id: "AST-001",
    hostname: "W11-FIN-01",
    type: "Desktop PC",
    model: "Dell OptiPlex 7090",
    serial: "7XG81P3",
    user: "Marco Rossi",
    location: "Amministrazione - Sede",
    ip: "192.168.1.110",
    status: "In Uso",
    warrantyDate: "2027-10-15",
    specs: "Intel Core i7-11700 / 16GB RAM DDR4 / 512GB NVMe / Windows 11 Pro Enterprise"
  },
  {
    id: "AST-002",
    hostname: "W11-COMM-04",
    type: "Laptop",
    model: "HP EliteBook 840 G8",
    serial: "5CG1248K9Z",
    user: "Roberto De Angelis",
    location: "Vendite / Smart Working",
    ip: "192.168.1.115",
    status: "In Uso",
    warrantyDate: "2026-08-30",
    specs: "Intel Core i5-1145G7 vPro / 16GB RAM / 512GB NVMe / Windows 11 Enterprise"
  },
  {
    id: "AST-003",
    hostname: "W11-HR-02",
    type: "Desktop PC",
    model: "Dell OptiPlex 7090",
    serial: "3HG99Q2",
    user: "Chiara Fontana",
    location: "Ufficio HR - Piano 1",
    ip: "192.168.1.118",
    status: "In Riparazione",
    warrantyDate: "2027-11-20",
    specs: "Intel Core i5-11500 / 16GB RAM / 256GB NVMe / Windows 11 Pro"
  },
  {
    id: "AST-004",
    hostname: "PRN-KYO-ADM01",
    type: "Stampante di Rete",
    model: "Kyocera TASKalfa 3253ci",
    serial: "KY-9928103",
    user: "Reparto Contabilità",
    location: "Corridoio Amministrazione",
    ip: "192.168.1.200",
    status: "In Uso",
    warrantyDate: "2028-03-10",
    specs: "Multifunzione Laser Colori A3/A4 / Scheda Gigabit Ethernet / Modulo Duplex & OCR"
  },
  {
    id: "AST-005",
    hostname: "W11-STK-01",
    type: "Desktop PC",
    model: "Lenovo ThinkCentre M70q Tiny",
    serial: "MJ087YTW",
    user: "Magazzino Scorta",
    location: "Stanza IT / Armadio Rack",
    ip: "Non assegnato (DHCP)",
    status: "Scorta Magazzino",
    warrantyDate: "2027-12-31",
    specs: "Intel Core i5-10400T / 16GB RAM / 256GB NVMe / Immagine Gold Windows 11 Pro"
  },
  {
    id: "AST-006",
    hostname: "SW-CORE-01",
    type: "Apparato di Rete",
    model: "Cisco Catalyst 2960-X (24G)",
    serial: "FOC2133U091",
    user: "Infrastruttura Rete",
    location: "CED - Rack 42U",
    ip: "192.168.1.2",
    status: "In Uso",
    warrantyDate: "2025-04-10",
    specs: "24 Porte PoE+ 10/100/1000 / 4 Porte SFP Uplink / VLAN 10 (Dati), 20 (VoIP)"
  },
  {
    id: "AST-007",
    hostname: "W11-MKT-01",
    type: "Desktop PC",
    model: "Dell Precision 3650 Tower",
    serial: "8L09KP2",
    user: "Simone Ferri",
    location: "Marketing - Ufficio 3",
    ip: "192.168.1.125",
    status: "In Uso",
    warrantyDate: "2027-05-18",
    specs: "Intel Core i7-11700K / 32GB RAM / 1TB NVMe + 2TB HDD / NVIDIA T1000 / Win 11 Pro"
  },
  {
    id: "AST-008",
    hostname: "W11-STK-02",
    type: "Laptop",
    model: "Lenovo ThinkPad L14 Gen 2",
    serial: "PF391XLM",
    user: "Magazzino Scorta",
    location: "Stanza IT - Cassaforte",
    ip: "Non assegnato",
    status: "Scorta Magazzino",
    warrantyDate: "2028-01-15",
    specs: "AMD Ryzen 5 PRO 5650U / 16GB RAM / 512GB NVMe / BitLocker Attivo / Win 11 Enterprise"
  }
];

const POWERSHELL_TOOLS = [
  {
    id: "tool-spooler",
    title: "Reset Coda di Stampa & Servizio Spooler",
    category: "Hardware & Periferiche",
    desc: "Arresta forzatamente il servizio Spooler di Windows, svuota i file di coda bloccati (.SPL/.SHD) e riavvia il servizio per sbloccare la stampante.",
    code: `Stop-Service Spooler -Force
Remove-Item -Path "$env:SystemRoot\\System32\\spool\\PRINTERS\\*" -Force -Recurse
Start-Service Spooler
Get-Service Spooler | Select-Object Name, Status, StartType`,
    output: `Status   Name    StartType
------   ----    ---------
Running  Spooler Automatic`
  },
  {
    id: "tool-tcp-test",
    title: "Verifica Porta TCP & Connettività Host (Test-NetConnection)",
    category: "Rete & Connettività",
    desc: "Testa se una porta specifica (es. 445 per share SMB, 3389 per RDP o 9100 per stampanti) è aperta e raggiungibile sul firewall dell'host remoto.",
    code: `# Esempio verifica share SMB o stampante di rete
$HostName = "192.168.1.200"
$Port = 9100
Test-NetConnection -ComputerName $HostName -Port $Port -InformationLevel Detailed`,
    output: `ComputerName            : 192.168.1.200
RemoteAddress           : 192.168.1.200
RemotePort              : 9100
NameResolutionSucceeded : True
PingSucceeded           : True
PingReplyDetails        : RoundTripTime=0.84ms
TcpTestSucceeded        : True`
  },
  {
    id: "tool-net-reset",
    title: "Flush Cache DNS & Reset Stack TCP/IP",
    category: "Rete & Connettività",
    desc: "Svuota la cache DNS locale del client, rilascia e rinnova il leasing DHCP dal server e ripristina il catalogo Winsock.",
    code: `ipconfig /flushdns
ipconfig /release
ipconfig /renew
netsh winsock reset`,
    output: `Configurazione IP di Windows
Cache del resolver DNS svuotata.

Adattatore Ethernet Ethernet 1:
   Suffisso DNS specifico per connessione: corp.local
   Indirizzo IPv4. . . . . . . . . . . . : 192.168.1.115
   Subnet mask . . . . . . . . . . . . . : 255.255.255.0
   Gateway predefinito . . . . . . . . . : 192.168.1.1`
  },
  {
    id: "tool-bios-sn",
    title: "Estrazione Matricola / Service Tag e Versione BIOS",
    category: "Audit & Hardware",
    desc: "Interroga WMI/CIM per rilevare istantaneamente il numero seriale del produttore (Dell Service Tag, seriale Lenovo/HP) e la versione BIOS.",
    code: `Get-CimInstance Win32_BIOS | Select-Object Manufacturer, SMBIOSBIOSVersion, SerialNumber, ReleaseDate`,
    output: `Manufacturer       : Dell Inc.
SMBIOSBIOSVersion  : 2.15.1
SerialNumber       : 7XG81P3
ReleaseDate        : 14/09/2024 02:00:00`
  },
  {
    id: "tool-smart-disk",
    title: "Controllo Salute SSD/Disco Fisico (S.M.A.R.T.)",
    category: "Audit & Hardware",
    desc: "Verifica lo stato operativo e la salute dell'unità di memorizzazione fisica rilevata dal sottosistema Storage di Windows.",
    code: `Get-PhysicalDisk | Select-Object DeviceId, FriendlyName, MediaType, HealthStatus, OperationalStatus, @{N="Size(GB)";E={[math]::Round($_.Size / 1GB, 2)}}`,
    output: `DeviceId FriendlyName         MediaType HealthStatus OperationalStatus Size(GB)
-------- ------------         --------- ------------ ----------------- --------
0        KIOXIA NVMe 512GB SSD SSD       Healthy      OK                476.94`
  },
  {
    id: "tool-dism-sfc",
    title: "Riparazione File di Sistema Windows (DISM + SFC)",
    category: "Client Windows",
    desc: "Esegue il controllo dell'archivio componenti di Windows Online con ripristino dell'immagine e verifica l'integrità di tutti i binari di sistema protetti.",
    code: `# Riparazione archivio componenti e file protetti
DISM /Online /Cleanup-Image /RestoreHealth
sfc /scannow`,
    output: `[==========================100.0%==========================] Operazione di ripristino completata.
Archivio dei componenti riparato correttamente.

Avvio dell'analisi del sistema.
Protezione risorse di Windows: file danneggiati rilevati e ripristinati con successo.`
  },
  {
    id: "tool-bitlocker",
    title: "Verifica Stato Crittografia BitLocker & Modulo TPM",
    category: "Sicurezza & Client",
    desc: "Verifica se l'unità C: di sistema è protetta da crittografia hardware TPM e controlla lo stato della cifratura XTS-AES.",
    code: `manage-bde -status C:
Get-Tpm | Select-Object TpmPresent, TpmReady, ManufacturerVersion`,
    output: `Volume C: [OSDisk]
    Stato conversione:       Completamente crittografato
    Percentuale crittografata: 100,0%
    Metodo di crittografia:  XTS-AES 256
    Stato protezione:        Protezione attivata
    Protezioni con chiave:   TPM, Password numerica

TpmPresent TpmReady ManufacturerVersion
---------- -------- -------------------
True       True     2.0`
  },
  {
    id: "tool-event-log",
    title: "Estrazione Errori Critici dal Registro Eventi (Ultime 24h)",
    category: "Diagnostica & Eventi",
    desc: "Estrae gli eventi di livello Errore o Critico dal registro System di Windows nelle ultime 24 ore per diagnosticare crash o problemi hardware.",
    code: `Get-WinEvent -FilterHashtable @{LogName='System'; Level=1,2; StartTime=(Get-Date).AddDays(-1)} -MaxEvents 15 | Select-Object TimeCreated, Id, ProviderName, Message | Format-Table -Wrap`,
    output: `TimeCreated          Id ProviderName           Message
-----------          -- ------------           -------
23/11/2026 08:45:12 7000 Service Control Mgr   Il servizio Servizio Google Update non è stato avviato.
22/11/2026 16:38:04 1001 BugCheck              Il computer è stato riavviato da un controllo errori (0x000000d1).`
  }
];

// =============================================================================
// STATO APPLICATIVO
// =============================================================================

class AppState {
  constructor() {
    this.tickets = this.loadData("it_tickets", DEFAULT_TICKETS);
    this.assets = this.loadData("it_assets", DEFAULT_ASSETS);
    this.currentView = "dashboard";
    this.activeTicketId = null;
    this.activeAssetId = null;
  }

  loadData(key, fallback) {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : fallback;
    } catch (e) {
      console.warn(`Errore caricamento dati per ${key}`, e);
      return fallback;
    }
  }

  saveData() {
    try {
      localStorage.setItem("it_tickets", JSON.stringify(this.tickets));
      localStorage.setItem("it_assets", JSON.stringify(this.assets));
    } catch (e) {
      console.error("Errore salvataggio localStorage", e);
    }
  }

  resetToDefault() {
    this.tickets = JSON.parse(JSON.stringify(DEFAULT_TICKETS));
    this.assets = JSON.parse(JSON.stringify(DEFAULT_ASSETS));
    this.saveData();
  }
}

const state = new AppState();

// =============================================================================
// UTILITÀ HELPER
// =============================================================================

function showToast(message, type = "info") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = "toast";
  
  let iconSvg = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10" stroke-width="2"/><line x1="12" y1="8" x2="12" y2="12" stroke-width="2"/><line x1="12" y1="16" x2="12.01" y2="16" stroke-width="2"/></svg>`;
  if (type === "success") {
    iconSvg = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke-width="2"/><polyline points="22 4 12 14.01 9 11.01" stroke-width="2"/></svg>`;
  }

  toast.innerHTML = `${iconSvg}<span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px)";
    toast.style.transition = "all 0.25s ease";
    setTimeout(() => toast.remove(), 250);
  }, 3200);
}

function getBadgeHtml(type, value) {
  let cls = "";
  if (type === "status") {
    switch (value) {
      case "Aperto": cls = "badge-open"; break;
      case "In Lavorazione": cls = "badge-inprogress"; break;
      case "In Attesa": cls = "badge-priority-high"; break;
      case "Risolto": cls = "badge-resolved"; break;
      case "Chiuso": cls = "badge-closed"; break;
      default: cls = "badge-closed";
    }
  } else if (type === "priority") {
    switch (value) {
      case "Critica": cls = "badge-priority-critical"; break;
      case "Alta": cls = "badge-priority-high"; break;
      case "Media": cls = "badge-priority-medium"; break;
      case "Bassa": cls = "badge-priority-low"; break;
      default: cls = "badge-priority-low";
    }
  } else if (type === "asset-status") {
    switch (value) {
      case "In Uso": cls = "badge-asset-active"; break;
      case "Scorta Magazzino": cls = "badge-asset-stock"; break;
      case "In Riparazione": cls = "badge-asset-maintenance"; break;
      case "Dismesso": cls = "badge-asset-retired"; break;
      default: cls = "badge-asset-stock";
    }
  }
  return `<span class="badge ${cls}">${value}</span>`;
}

function isWarrantyActive(dateString) {
  if (!dateString) return false;
  const target = new Date(dateString);
  const now = new Date();
  return target >= now;
}

// =============================================================================
// RENDERING DELLE VISTE
// =============================================================================

function switchView(viewName) {
  state.currentView = viewName;

  // Gestione classi sidebar
  document.querySelectorAll(".sidebar-nav .nav-item").forEach(item => {
    if (item.dataset.view) {
      item.classList.toggle("active", item.dataset.view === viewName);
    }
  });

  // Gestione sezioni visibili
  document.querySelectorAll(".view-section").forEach(sec => {
    sec.classList.remove("active");
  });

  const activeSec = document.getElementById(`view-${viewName}`);
  if (activeSec) {
    activeSec.classList.add("active");
  }

  // Aggiorna titolo pagina
  const titleEl = document.getElementById("page-title");
  if (titleEl) {
    switch (viewName) {
      case "dashboard": titleEl.textContent = "Pannello Assistenza & Ticket"; break;
      case "tickets": titleEl.textContent = "Registro Richieste di Assistenza"; break;
      case "assets": titleEl.textContent = "Registro Postazioni & Hardware"; break;
      case "toolkit": titleEl.textContent = "Comandi Diagnostici PowerShell"; break;
    }
  }

  // Renderizza la vista corrente
  renderAll();
}

function renderKPIs() {
  const openCount = state.tickets.filter(t => t.status !== "Risolto" && t.status !== "Chiuso").length;
  const criticalCount = state.tickets.filter(t => (t.priority === "Critica" || t.priority === "Alta") && t.status !== "Chiuso" && t.status !== "Risolto").length;
  const totalAssets = state.assets.length;
  const stockAssets = state.assets.filter(a => a.status === "Scorta Magazzino").length;
  const inUseAssets = state.assets.filter(a => a.status === "In Uso").length;

  document.getElementById("kpi-open-tickets").textContent = openCount;
  document.getElementById("kpi-critical-tickets").textContent = criticalCount;
  document.getElementById("kpi-total-assets").textContent = totalAssets;
  document.getElementById("kpi-stock-assets").textContent = stockAssets;
  document.getElementById("kpi-active-assets-sub").textContent = `${inUseAssets} postazioni attive in azienda`;
  document.getElementById("sidebar-open-tickets-count").textContent = openCount;
}

function renderDashboard() {
  renderKPIs();

  // Tabella ticket prioritari (ultimi aperti o in lavorazione)
  const tbody = document.getElementById("dashboard-tickets-tbody");
  if (!tbody) return;

  const urgentTickets = state.tickets
    .filter(t => t.status !== "Chiuso")
    .sort((a, b) => {
      const pWeights = { Critica: 4, Alta: 3, Media: 2, Bassa: 1 };
      return (pWeights[b.priority] || 0) - (pWeights[a.priority] || 0);
    })
    .slice(0, 5);

  if (urgentTickets.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 20px;">Nessun ticket in attesa. Tutti gli interventi sono stati completati.</td></tr>`;
    return;
  }

  tbody.innerHTML = urgentTickets.map(t => `
    <tr>
      <td style="font-family: var(--font-mono); font-weight: 600;">${t.id}</td>
      <td>
        <div style="font-weight: 600;">${t.user}</div>
        <div style="font-size: 11px; color: var(--text-muted);">${t.department}</div>
      </td>
      <td>
        <div style="font-weight: 500; max-width: 320px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${t.subject}</div>
        <div style="font-size: 11px; color: var(--text-muted);">${t.category}</div>
      </td>
      <td>${getBadgeHtml("priority", t.priority)}</td>
      <td>${getBadgeHtml("status", t.status)}</td>
      <td>
        <button class="btn btn-secondary btn-sm" onclick="openTicketDetail('${t.id}')">Gestisci</button>
      </td>
    </tr>
  `).join("");

  // Asset Breakdown
  const breakdownEl = document.getElementById("dashboard-asset-breakdown");
  if (breakdownEl) {
    const types = ["Desktop PC", "Laptop", "Monitor", "Stampante di Rete", "Apparato di Rete"];
    const total = state.assets.length || 1;

    breakdownEl.innerHTML = types.map(tp => {
      const cnt = state.assets.filter(a => a.type === tp).length;
      const pct = Math.round((cnt / total) * 100);
      return `
        <div style="margin-bottom: 12px;">
          <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 4px;">
            <span style="font-weight: 600; color: #334155;">${tp}</span>
            <span style="font-family: var(--font-mono); color: var(--text-muted);">${cnt} unità (${pct}%)</span>
          </div>
          <div style="width: 100%; height: 6px; background-color: #e2e8f0; border-radius: 3px; overflow: hidden;">
            <div style="width: ${pct}%; height: 100%; background-color: var(--primary); border-radius: 3px;"></div>
          </div>
        </div>
      `;
    }).join("");
  }
}

function renderTickets() {
  const tbody = document.getElementById("tickets-tbody");
  if (!tbody) return;

  const searchVal = (document.getElementById("filter-ticket-search")?.value || "").toLowerCase().trim();
  const statusFilter = document.getElementById("filter-ticket-status")?.value || "all";
  const priorityFilter = document.getElementById("filter-ticket-priority")?.value || "all";
  const catFilter = document.getElementById("filter-ticket-category")?.value || "all";

  const filtered = state.tickets.filter(t => {
    if (statusFilter !== "all" && t.status !== statusFilter) return false;
    if (priorityFilter !== "all" && t.priority !== priorityFilter) return false;
    if (catFilter !== "all" && t.category !== catFilter) return false;

    if (searchVal) {
      const match = (
        t.id.toLowerCase().includes(searchVal) ||
        t.user.toLowerCase().includes(searchVal) ||
        t.department.toLowerCase().includes(searchVal) ||
        t.subject.toLowerCase().includes(searchVal) ||
        t.description.toLowerCase().includes(searchVal) ||
        (t.asset && t.asset.toLowerCase().includes(searchVal))
      );
      if (!match) return false;
    }
    return true;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9" style="text-align: center; color: var(--text-muted); padding: 30px;">Nessun ticket corrispondente ai filtri impostati.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(t => `
    <tr>
      <td style="font-family: var(--font-mono); font-weight: 600;">${t.id}</td>
      <td style="font-size: 12px; color: var(--text-muted); white-space: nowrap;">${t.date}</td>
      <td>
        <div style="font-weight: 600;">${t.user}</div>
        <div style="font-size: 11px; color: var(--text-muted);">${t.department}</div>
      </td>
      <td style="font-size: 12px;">${t.category}</td>
      <td style="font-weight: 500;">
        <div>${t.subject}</div>
      </td>
      <td style="font-size: 12px; font-family: var(--font-mono); color: #475569;">${t.asset || "Nessuno"}</td>
      <td>${getBadgeHtml("priority", t.priority)}</td>
      <td>${getBadgeHtml("status", t.status)}</td>
      <td style="text-align: right;">
        <button class="btn btn-secondary btn-sm" onclick="openTicketDetail('${t.id}')">Dettaglio</button>
      </td>
    </tr>
  `).join("");
}

function renderAssets() {
  const tbody = document.getElementById("assets-tbody");
  if (!tbody) return;

  const searchVal = (document.getElementById("filter-asset-search")?.value || "").toLowerCase().trim();
  const typeFilter = document.getElementById("filter-asset-type")?.value || "all";
  const statusFilter = document.getElementById("filter-asset-status")?.value || "all";
  const warrantyFilter = document.getElementById("filter-asset-warranty")?.value || "all";

  const filtered = state.assets.filter(a => {
    if (typeFilter !== "all" && a.type !== typeFilter) return false;
    if (statusFilter !== "all" && a.status !== statusFilter) return false;

    if (warrantyFilter !== "all") {
      const active = isWarrantyActive(a.warrantyDate);
      if (warrantyFilter === "active" && !active) return false;
      if (warrantyFilter === "expired" && active) return false;
    }

    if (searchVal) {
      const match = (
        a.id.toLowerCase().includes(searchVal) ||
        a.hostname.toLowerCase().includes(searchVal) ||
        a.model.toLowerCase().includes(searchVal) ||
        a.serial.toLowerCase().includes(searchVal) ||
        a.user.toLowerCase().includes(searchVal) ||
        a.location.toLowerCase().includes(searchVal) ||
        (a.ip && a.ip.toLowerCase().includes(searchVal))
      );
      if (!match) return false;
    }
    return true;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="11" style="text-align: center; color: var(--text-muted); padding: 30px;">Nessun asset corrispondente ai criteri selezionati.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(a => {
    const active = isWarrantyActive(a.warrantyDate);
    const warBadge = active 
      ? `<span class="badge" style="background-color: #dcfce7; color: #166534;">Attiva (${a.warrantyDate})</span>`
      : `<span class="badge" style="background-color: #fee2e2; color: #991b1b;">Scaduta (${a.warrantyDate})</span>`;

    return `
      <tr>
        <td style="font-family: var(--font-mono); font-weight: 600;">${a.id}</td>
        <td style="font-weight: 600; color: #0284c7;">${a.hostname}</td>
        <td>${a.type}</td>
        <td>${a.model}</td>
        <td style="font-family: var(--font-mono); font-weight: 600;">${a.serial}</td>
        <td>${a.user}</td>
        <td style="font-size: 12px; color: var(--text-muted);">${a.location}</td>
        <td style="font-family: var(--font-mono); font-size: 12px;">${a.ip || "-"}</td>
        <td>${warBadge}</td>
        <td>${getBadgeHtml("asset-status", a.status)}</td>
        <td style="text-align: right;">
          <button class="btn btn-secondary btn-sm" onclick="openAssetDetail('${a.id}')">Scheda</button>
        </td>
      </tr>
    `;
  }).join("");
}

function renderToolkit() {
  const container = document.getElementById("toolkit-grid");
  if (!container) return;

  container.innerHTML = POWERSHELL_TOOLS.map(t => `
    <div class="tool-card" id="${t.id}">
      <div class="tool-card-header">
        <div class="tool-card-title">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2563eb">
            <polyline points="4 17 10 11 4 5" stroke-width="2"/>
            <line x1="12" y1="19" x2="20" y2="19" stroke-width="2"/>
          </svg>
          <span>${t.title}</span>
        </div>
        <span class="tool-card-category">${t.category}</span>
      </div>
      <div class="tool-card-body">
        <p class="tool-desc">${t.desc}</p>
        <div class="code-box">
          <code>${escapeHtml(t.code)}</code>
        </div>
        <div class="tool-actions">
          <button class="btn btn-primary btn-sm" onclick="copyToolCode('${t.id}')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="9" y="9" width="13" height="13" rx="2" stroke-width="2"/>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke-width="2"/>
            </svg>
            <span>Copia PowerShell</span>
          </button>
          <button class="btn btn-secondary btn-sm" onclick="toggleSimOutput('${t.id}')">
            <span>Simula Output Console</span>
          </button>
        </div>
        <div class="sim-output-box" id="sim-${t.id}">
          <div style="color: #94a3b8; margin-bottom: 4px; font-size: 10px; border-bottom: 1px solid #334155; padding-bottom: 2px;">
            PS C:\\Windows\\system32> [Simulazione Ambiente Windows 11 Enterprise]
          </div>
          <pre style="margin: 0; font-family: inherit; font-size: inherit; white-space: pre-wrap;">${escapeHtml(t.output)}</pre>
        </div>
      </div>
    </div>
  `).join("");
}

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function renderAll() {
  renderKPIs();
  if (state.currentView === "dashboard") renderDashboard();
  if (state.currentView === "tickets") renderTickets();
  if (state.currentView === "assets") renderAssets();
  if (state.currentView === "toolkit") renderToolkit();
}

// =============================================================================
// MODALI & DETTAGLI INTERATTIVI
// =============================================================================

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add("open");
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove("open");
}

// Dettaglio Ticket
window.openTicketDetail = function(ticketId) {
  const ticket = state.tickets.find(t => t.id === ticketId);
  if (!ticket) return;

  state.activeTicketId = ticketId;
  document.getElementById("detail-ticket-title").textContent = `Dettaglio Intervento ${ticket.id} - ${ticket.subject}`;
  document.getElementById("detail-ticket-date").textContent = `Registrato: ${ticket.date}`;
  document.getElementById("detail-ticket-user").textContent = ticket.user;
  document.getElementById("detail-ticket-dept").textContent = ticket.department;
  document.getElementById("detail-ticket-asset").textContent = ticket.asset || "Nessun asset collegato";
  document.getElementById("detail-ticket-desc").textContent = ticket.description;

  document.getElementById("detail-ticket-priority-badge").className = "badge";
  document.getElementById("detail-ticket-priority-badge").outerHTML = `<span id="detail-ticket-priority-badge">${getBadgeHtml("priority", ticket.priority)}</span>`;

  document.getElementById("detail-ticket-status-badge").className = "badge";
  document.getElementById("detail-ticket-status-badge").outerHTML = `<span id="detail-ticket-status-badge">${getBadgeHtml("status", ticket.status)}</span>`;

  document.getElementById("detail-ticket-cat-badge").textContent = ticket.category;
  document.getElementById("detail-change-status").value = ticket.status;

  // Timeline interventi
  const timeline = document.getElementById("detail-ticket-timeline");
  if (ticket.worklog && ticket.worklog.length > 0) {
    timeline.innerHTML = ticket.worklog.map(item => `
      <div class="timeline-item">
        <div class="timeline-header">
          <span class="timeline-author">${item.tech}</span>
          <span>${item.date}</span>
        </div>
        <div class="timeline-body">${item.text}</div>
      </div>
    `).join("");
  } else {
    timeline.innerHTML = `<div style="font-size: 12px; color: var(--text-muted); font-style: italic;">Nessun intervento ancora registrato per questo ticket.</div>`;
  }

  document.getElementById("detail-add-note").value = "";
  openModal("modal-ticket-detail");
};

// Dettaglio Asset
window.openAssetDetail = function(assetId) {
  const asset = state.assets.find(a => a.id === assetId);
  if (!asset) return;

  state.activeAssetId = assetId;
  document.getElementById("detail-asset-title").textContent = `Scheda Asset ${asset.id} - ${asset.hostname}`;
  document.getElementById("detail-asset-host").textContent = asset.hostname;
  document.getElementById("detail-asset-type").textContent = asset.type;
  document.getElementById("detail-asset-model").textContent = asset.model;
  document.getElementById("detail-asset-serial").textContent = asset.serial;
  document.getElementById("detail-asset-user").textContent = asset.user;
  document.getElementById("detail-asset-loc").textContent = asset.location;
  document.getElementById("detail-asset-ip").textContent = asset.ip || "Assegnazione dinamica DHCP";
  document.getElementById("detail-asset-warranty").textContent = asset.warrantyDate;
  document.getElementById("detail-asset-specs").textContent = asset.specs || "Configurazione hardware standard";

  const active = isWarrantyActive(asset.warrantyDate);
  const warBadge = active 
    ? `<span class="badge" style="background-color: #dcfce7; color: #166534;">Garanzia Attiva (${asset.warrantyDate})</span>`
    : `<span class="badge" style="background-color: #fee2e2; color: #991b1b;">Garanzia Scaduta (${asset.warrantyDate})</span>`;

  document.getElementById("detail-asset-status-badge").outerHTML = `<span id="detail-asset-status-badge">${getBadgeHtml("asset-status", asset.status)}</span>`;
  document.getElementById("detail-asset-warranty-badge").outerHTML = `<span id="detail-asset-warranty-badge">${warBadge}</span>`;

  openModal("modal-asset-detail");
};

// Toolkit Copia & Toggle
window.copyToolCode = function(toolId) {
  const tool = POWERSHELL_TOOLS.find(t => t.id === toolId);
  if (!tool) return;

  navigator.clipboard.writeText(tool.code).then(() => {
    showToast(`Comando PowerShell copiato negli appunti!`, "success");
  }).catch(() => {
    showToast("Errore durante la copia automatica negli appunti", "danger");
  });
};

window.toggleSimOutput = function(toolId) {
  const box = document.getElementById(`sim-${toolId}`);
  if (box) {
    box.classList.toggle("visible");
  }
};

// =============================================================================
// CALCOLATORE SUBNET IPV4
// =============================================================================

function calculateSubnet() {
  const ipInput = document.getElementById("calc-ip")?.value.trim() || "192.168.1.1";
  const cidr = parseInt(document.getElementById("calc-cidr")?.value || "24", 10);

  const ipParts = ipInput.split(".").map(Number);
  if (ipParts.length !== 4 || ipParts.some(p => isNaN(p) || p < 0 || p > 255)) {
    return; // Formato IP non valido
  }

  const ipNum = (ipParts[0] << 24) | (ipParts[1] << 16) | (ipParts[2] << 8) | ipParts[3];
  const maskNum = cidr === 0 ? 0 : (~0 << (32 - cidr)) >>> 0;
  const netNum = (ipNum & maskNum) >>> 0;
  const bcastNum = (netNum | (~maskNum >>> 0)) >>> 0;

  function numToIp(num) {
    return [
      (num >>> 24) & 255,
      (num >>> 16) & 255,
      (num >>> 8) & 255,
      num & 255
    ].join(".");
  }

  const netIp = numToIp(netNum);
  const maskIp = numToIp(maskNum);
  const bcastIp = numToIp(bcastNum);

  let hostMin = numToIp(netNum + 1);
  let hostMax = numToIp(bcastNum - 1);
  if (cidr >= 31) {
    hostMin = netIp;
    hostMax = bcastIp;
  }

  document.getElementById("res-network").textContent = netIp;
  document.getElementById("res-mask").textContent = maskIp;
  document.getElementById("res-broadcast").textContent = bcastIp;
  document.getElementById("res-range").textContent = `${hostMin} - ${hostMax}`;
}

// =============================================================================
// GESTIONE EVENTI & INIZIALIZZAZIONE
// =============================================================================

document.addEventListener("DOMContentLoaded", () => {
  // Setup navigazione sidebar
  document.querySelectorAll(".sidebar-nav .nav-item").forEach(item => {
    item.addEventListener("click", () => {
      if (item.dataset.view) {
        switchView(item.dataset.view);
      }
    });
  });

  // Filtri ticket
  ["filter-ticket-search", "filter-ticket-status", "filter-ticket-priority", "filter-ticket-category"].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener("input", renderTickets);
      el.addEventListener("change", renderTickets);
    }
  });

  // Filtri asset
  ["filter-asset-search", "filter-asset-type", "filter-asset-status", "filter-asset-warranty"].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener("input", renderAssets);
      el.addEventListener("change", renderAssets);
    }
  });

  // Ricerca globale nel top header
  const globalSearch = document.getElementById("global-search-input");
  if (globalSearch) {
    globalSearch.addEventListener("input", (e) => {
      const q = e.target.value.toLowerCase().trim();
      if (!q) {
        renderAll();
        return;
      }
      // Se l'utente digita una ricerca globale, sincronizza i campi di ricerca della vista corrente
      if (state.currentView === "tickets") {
        const f = document.getElementById("filter-ticket-search");
        if (f) { f.value = q; renderTickets(); }
      } else if (state.currentView === "assets") {
        const f = document.getElementById("filter-asset-search");
        if (f) { f.value = q; renderAssets(); }
      } else {
        // Se è in dashboard, sposta su ticket desk o filtra
        switchView("tickets");
        const f = document.getElementById("filter-ticket-search");
        if (f) { f.value = q; renderTickets(); }
      }
    });
  }

  // Pulsanti rapidi header
  document.getElementById("btn-quick-new-ticket")?.addEventListener("click", () => openModal("modal-ticket"));
  document.getElementById("btn-create-ticket-modal")?.addEventListener("click", () => openModal("modal-ticket"));
  document.getElementById("btn-quick-new-asset")?.addEventListener("click", () => openModal("modal-asset"));
  document.getElementById("btn-create-asset-modal")?.addEventListener("click", () => openModal("modal-asset"));
  document.getElementById("btn-goto-tickets")?.addEventListener("click", () => switchView("tickets"));

  // Scorciatoie Toolkit in Dashboard
  document.getElementById("btn-quick-spooler")?.addEventListener("click", () => {
    switchView("toolkit");
    setTimeout(() => {
      const el = document.getElementById("tool-spooler");
      el?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  });
  document.getElementById("btn-quick-flushdns")?.addEventListener("click", () => {
    switchView("toolkit");
    setTimeout(() => {
      const el = document.getElementById("tool-net-reset");
      el?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  });
  document.getElementById("btn-quick-calc")?.addEventListener("click", () => {
    switchView("toolkit");
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Chiusura modali su click backdrop e pulsanti [data-close]
  document.querySelectorAll("[data-close]").forEach(btn => {
    btn.addEventListener("click", () => closeModal(btn.dataset.close));
  });

  document.querySelectorAll(".modal-overlay").forEach(overlay => {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        overlay.classList.remove("open");
      }
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      document.querySelectorAll(".modal-overlay.open").forEach(m => m.classList.remove("open"));
    }
  });

  // Form Creazione Nuovo Ticket
  const formTicket = document.getElementById("form-ticket");
  if (formTicket) {
    formTicket.addEventListener("submit", (e) => {
      e.preventDefault();
      const nextNum = state.tickets.length + 101;
      const newId = `TICK-${nextNum}`;

      const now = new Date();
      const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

      const newTicket = {
        id: newId,
        user: document.getElementById("ticket-user").value.trim(),
        department: document.getElementById("ticket-dept").value.trim(),
        category: document.getElementById("ticket-cat").value,
        priority: document.getElementById("ticket-priority").value,
        asset: document.getElementById("ticket-asset").value.trim() || "Nessun asset specificato",
        subject: document.getElementById("ticket-subject").value.trim(),
        description: document.getElementById("ticket-desc").value.trim(),
        status: "Aperto",
        date: dateStr,
        worklog: [
          {
            tech: "Valentyn Haidukov",
            date: dateStr,
            text: "Ticket creato e preso in carico in coda di supporto L1."
          }
        ]
      };

      state.tickets.unshift(newTicket);
      state.saveData();
      formTicket.reset();
      closeModal("modal-ticket");
      showToast(`Ticket ${newId} registrato con successo!`, "success");
      renderAll();
    });
  }

  // Form Creazione Nuovo Asset
  const formAsset = document.getElementById("form-asset");
  if (formAsset) {
    formAsset.addEventListener("submit", (e) => {
      e.preventDefault();
      const nextNum = String(state.assets.length + 1).padStart(3, '0');
      const newId = `AST-${nextNum}`;

      const newAsset = {
        id: newId,
        hostname: document.getElementById("asset-hostname").value.trim().toUpperCase(),
        type: document.getElementById("asset-type").value,
        model: document.getElementById("asset-model").value.trim(),
        serial: document.getElementById("asset-serial").value.trim().toUpperCase(),
        user: document.getElementById("asset-user").value.trim() || "Magazzino Scorta",
        location: document.getElementById("asset-location").value.trim(),
        ip: document.getElementById("asset-ip").value.trim() || "DHCP Dinamico",
        status: document.getElementById("asset-status").value,
        warrantyDate: document.getElementById("asset-warranty-date").value,
        specs: document.getElementById("asset-specs").value.trim() || "Specifiche hardware standard"
      };

      state.assets.unshift(newAsset);
      state.saveData();
      formAsset.reset();
      closeModal("modal-asset");
      showToast(`Asset ${newId} (${newAsset.hostname}) registrato nel CMDB!`, "success");
      renderAll();
    });
  }

  // Salvataggio Modifiche Ticket nel Dettaglio (Cambio Stato & Aggiunta Nota)
  document.getElementById("btn-save-ticket-status")?.addEventListener("click", () => {
    if (!state.activeTicketId) return;
    const ticket = state.tickets.find(t => t.id === state.activeTicketId);
    if (!ticket) return;

    const newStatus = document.getElementById("detail-change-status").value;
    ticket.status = newStatus;
    state.saveData();
    showToast(`Stato ticket aggiornato a '${newStatus}'`, "success");
    openTicketDetail(ticket.id);
    renderAll();
  });

  document.getElementById("btn-add-ticket-note")?.addEventListener("click", () => {
    if (!state.activeTicketId) return;
    const ticket = state.tickets.find(t => t.id === state.activeTicketId);
    if (!ticket) return;

    const noteText = document.getElementById("detail-add-note")?.value.trim();
    if (!noteText) {
      showToast("Inserisci del testo per registrare la nota tecnica", "danger");
      return;
    }

    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    if (!ticket.worklog) ticket.worklog = [];
    ticket.worklog.push({
      tech: "Valentyn Haidukov",
      date: dateStr,
      text: noteText
    });

    state.saveData();
    showToast("Nota tecnica aggiunta allo storico!", "success");
    openTicketDetail(ticket.id);
  });

  // Calcolatore Subnet
  document.getElementById("calc-ip")?.addEventListener("input", calculateSubnet);
  document.getElementById("calc-cidr")?.addEventListener("change", calculateSubnet);
  calculateSubnet();

  // Esportazione CSV Asset
  document.getElementById("btn-export-assets-csv")?.addEventListener("click", () => {
    const headers = ["ID", "Hostname", "Tipo", "Modello", "Matricola_SN", "Utente", "Ufficio", "IP", "Stato", "Scadenza_Garanzia", "Specifiche"];
    const rows = state.assets.map(a => [
      a.id,
      a.hostname,
      a.type,
      `"${a.model}"`,
      a.serial,
      `"${a.user}"`,
      `"${a.location}"`,
      a.ip,
      a.status,
      a.warrantyDate,
      `"${(a.specs || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = "\uFEFF" + [headers.join(";"), ...rows.map(r => r.join(";"))].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Inventario_Asset_IT_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("File CSV inventario scaricato con successo!", "success");
  });

  // Esportazione Backup JSON
  document.getElementById("btn-export-data")?.addEventListener("click", () => {
    const backupData = {
      exportDate: new Date().toISOString(),
      technician: "Valentyn Haidukov",
      tickets: state.tickets,
      assets: state.assets
    };
    const jsonStr = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Backup_IT_Support_Hub_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Backup JSON esportato correttamente!", "success");
  });

  // Reset Dati Demo
  document.getElementById("btn-reset-demo")?.addEventListener("click", () => {
    if (confirm("Vuoi ripristinare tutti i dati dimostrativi di fabbrica (ticket ed asset)?")) {
      state.resetToDefault();
      renderAll();
      showToast("Dati dimostrativi ripristinati con successo!", "success");
    }
  });

  // Avvio iniziale
  renderAll();
});
