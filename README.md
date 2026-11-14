# IT Support Hub — Enterprise Service Desk & Asset CMDB

[![GitHub Pages](https://img.shields.io/badge/Demo%20Live-GitHub%20Pages-blue.svg)](https://hv94.github.io/it-support-hub)
[![Role Focus](https://img.shields.io/badge/Target-IT%20Support%20L1%20%2F%20Sysadmin-1e40af.svg)](#)
[![OS Architecture](https://img.shields.io/badge/Environment-Windows%20Enterprise%20%26%20Active%20Directory-0078d4.svg)](#)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

Console interna web-based per tecnici di **Help Desk L1** e **Junior IT Specialist**, progettata per la gestione completa del ciclo di vita dei ticket di assistenza, il censimento hardware (CMDB) e l'esecuzione rapida di procedure diagnostiche PowerShell in ambienti aziendali Microsoft Windows / Active Directory.

---

## 🖥️ Live Demo

L'applicazione è navigabile e collaudata direttamente via browser su GitHub Pages:  
👉 **[https://hv94.github.io/it-support-hub](https://hv94.github.io/it-support-hub)**

---

## 🎯 Obiettivi e Scenario d'Uso Aziendale

Nelle infrastrutture IT aziendali (uffici centrali, filiali, reparti contabili e commerciali), la rapidità di risoluzione del supporto di primo livello (L1) e la precisione dell'inventario hardware sono fondamentali.

**IT Support Hub** fornisce un'unica interfaccia operativa e sobria che integra:
1. **Smistamento e Gestione Richieste (Incident & Service Request)** secondo criteri di priorità e SLA.
2. **Censimento Hardware e Dispositivi (CMDB)** con tracciamento matricole (Service Tag), leasing DHCP/IP statici e scadenze garanzia.
3. **Toolkit Diagnostico del Tecnico**, contenente script PowerShell aziendali per lo sblocco immediato dei disservizi client più frequenti (stampanti, DNS, crash di sistema, BitLocker).
4. **Calcolatore Subnet IPv4**, per pianificare assegnazioni statiche di stampanti, centralini VoIP e switch periferici.

---

## 🚀 Funzionalità Principali

### 1. 🎫 Ticket Desk & Worklog Interventi
- Visualizzazione tabellare con filtri dinamici per **Stato** (*Aperto, In Lavorazione, In Attesa, Risolto, Chiuso*), **Priorità** (*Critica/Bloccante, Alta, Media, Bassa*) e **Categoria** (*Hardware, Rete LAN/WLAN, Microsoft 365, Account & AD, Client Windows*).
- Apertura guidata nuovi ticket con associazione all'asset hardware interessato.
- Scheda dettagliata con **Storico Interventi (Worklog)** con data, ora e operatore per garantire la tracciabilità delle procedure eseguite.

### 2. 🖥️ Inventario Asset Hardware (CMDB)
- Censimento dettagliato delle postazioni di lavoro (*Dell OptiPlex, HP EliteBook, Lenovo ThinkCentre, stampanti multifunzione Kyocera, switch Cisco Catalyst*).
- Tracciamento matricole (Service Tag / Serial Number), utente assegnatario, ufficio e stato operativo (*In Uso, Scorta Magazzino, In Riparazione, Dismesso*).
- Monitoraggio visivo stato garanzia hardware (attiva / scaduta).
- **Esportazione istantanea in formato CSV** con codifica UTF-8 BOM per audit inventariali e gestione cespiti aziendali.

### 3. 🧰 Technician Toolkit (PowerShell Enterprise)
Libreria interattiva di comandi diagnostici e di ripristino per client Windows 11 Enterprise:
- **Reset Coda di Stampa**: arresto servizio Spooler, rimozione file orfani in `spool\PRINTERS` e riavvio automatico.
- **Test Porte TCP con `Test-NetConnection`**: verifica rapida connettività su porta RAW 9100, SMB 445 e RDP 3389.
- **Diagnostica IP & DNS**: `ipconfig /flushdns`, rilascio/rinnovo leasing DHCP e reset catalogo Winsock.
- **Ispezione WMI/CIM**: rilevamento istantaneo di Service Tag hardware e versione BIOS (`Win32_BIOS`).
- **Controllo Integrità Disco S.M.A.R.T.**: analisi stato salute NVMe/SSD con `Get-PhysicalDisk`.
- **Ripristino Integrità Sistema**: sequenza sicura `DISM /RestoreHealth` + `sfc /scannow`.
- **Stato Crittografia BitLocker & TPM**: verifica protezione volume di sistema con `manage-bde` e `Get-Tpm`.
- **Audit Errori Critici (Registro Eventi)**: estrazione errori di sistema nelle ultime 24 ore con `Get-WinEvent`.
- *Funzionalità di copia rapida negli appunti e simulatore di output console integrato.*

### 4. 🌐 Calcolatore Subnet IPv4
- Calcolo automatico istantaneo di Network ID, Subnet Mask decimale, Broadcast Address e Range di indirizzi host assegnabili da notazione CIDR (/16 - /29).

### 5. 💾 Persistenza e Sicurezza Dati
- Salvataggio automatico dello stato applicativo nel `localStorage` del browser.
- Funzione di **Esportazione Backup Completo in formato JSON**.
- Funzione di **Ripristino Dati Demo di Fabbrica** in caso di test o riconfigurazione.

---

## 🛠️ Stack Tecnologico

- **Frontend**: HTML5 Semantico, CSS3 Moderno (Custom Properties, Flexbox, CSS Grid), Vanilla JavaScript (ES6+ Modulare).
- **Design Philosophy**: Interfaccia aziendale sobria, ad alto contrasto, priva di animazioni superflue o gradienti sgargianti, ottimizzata per turni operativi prolungati su monitor standard e portatili aziendali.
- **Nessuna dipendenza esterna**: zero framework pesanti, caricamento istantaneo a 60 FPS, accessibile offline.

---

## 📂 Struttura del Repository

```
it-support-hub/
├── index.html       # Markup semantico dell'applicazione e modali
├── style.css        # Sistema di design enterprise e layout responsive
├── app.js           # Motore logico (stato, filtri, ticket, asset, toolkit)
├── README.md        # Documentazione tecnica e manuale d'uso
└── LICENSE          # Licenza open-source MIT
```

---

## 👨‍💻 Autore

**Valentyn Haidukov**  
*IT Support Specialist / Junior Sysadmin*  
- **Portfolio Online**: [https://hv94.github.io/curriculum-vitae](https://hv94.github.io/curriculum-vitae)  
- **GitHub**: [@HV94](https://github.com/HV94)
