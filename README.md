# Pannello Supporto Tecnico L1

Strumento web per la gestione del servizio di Help Desk L1, inventario postazioni hardware e raccolta comandi diagnostici PowerShell per ambienti Windows aziendali.

Demo live: [https://hv94.github.io/it-support-hub/](https://hv94.github.io/it-support-hub/)

---

## Descrizione del progetto

Questo progetto nasce come esercitazione pratica sulle mansioni tipiche di un tecnico di supporto informatico di primo livello (Help Desk L1). 

L'obiettivo è simulare l'operatività quotidiana all'interno di un'infrastruttura aziendale basata su client Windows e dominio Active Directory:
- Presa in carico e gestione dei guasti segnalati dagli utenti dei diversi reparti.
- Monitoraggio delle postazioni di lavoro e dei dispositivi di rete (PC desktop, notebook, stampanti di rete, switch).
- Esecuzione rapida di procedure diagnostiche tramite script PowerShell per sbloccare i disservizi più comuni.

---

## Cosa include l'applicazione

### 1. Gestione Ticket e Richieste di Assistenza
- Coda richieste filtrabile per stato (Aperto, In Lavorazione, In Attesa, Risolto, Chiuso), livello di priorità e categoria del problema (Hardware, Rete LAN/WLAN, Microsoft 365, Account e Permessi, Client Windows).
- Scheda dettagliata con storico degli interventi (Worklog) per annotare le azioni svolte dal tecnico con data e ora.
- Modale per l'apertura rapida di nuove segnalazioni da parte degli utenti.

### 2. Inventario Hardware e Dispositivi (CMDB)
- Registro delle postazioni aziendali (Dell OptiPlex, HP EliteBook, Lenovo ThinkCentre, stampanti Kyocera, switch Cisco).
- Tracciamento di matricole e Service Tag, utente assegnatario, ufficio di appartenenza, indirizzo IP e data di scadenza della garanzia hardware.
- Funzione di esportazione immediata dell'inventario in formato CSV per controlli e inventari periodici.

### 3. Strumenti Diagnostici e Script PowerShell
Raccolta di comandi pronti all'uso per risolvere i problemi più frequenti senza perdere tempo:
- **Reset Spooler di Stampa**: arresto servizio, svuotamento file bloccati in `spool\PRINTERS` e riavvio.
- **Verifica Porte di Rete**: `Test-NetConnection` per verificare se la porta RAW 9100 (stampanti) o 445 (condivisioni SMB) è aperta.
- **Diagnostica IP**: pulizia cache DNS (`ipconfig /flushdns`) e rinnovo del leasing DHCP (`/release` e `/renew`).
- **Verifica Hardware**: estrazione Service Tag della scheda madre tramite WMI (`Win32_BIOS`).
- **Controllo Dischi**: verifica stato salute dell'unità SSD tramite `Get-PhysicalDisk`.
- **Integrità Sistema**: sequenza di ripristino con `DISM /RestoreHealth` e `sfc /scannow`.
- **BitLocker e TPM**: verifica stato crittografia dell'unità di sistema con `manage-bde` e `Get-Tpm`.

### 4. Calcolatore Subnet IPv4
- Strumento rapido per calcolare Network ID, Subnet Mask, Broadcast e range di indirizzi host assegnabili da notazione CIDR (/16 - /29), utile per pianificare l'assegnazione di IP statici a stampanti o apparati.

---

## Note di sviluppo

L'applicazione è sviluppata in **HTML5, CSS3 e JavaScript Vanilla** (nessun framework esterno, caricamento rapido e utilizzabile offline). 

L'applicazione è progettata per riflettere le procedure standard di un ambiente Help Desk aziendale, focalizzandosi sull'esattezza dei comandi sistemistici e delle procedure reali di supporto tecnico.
I dati vengono salvati automaticamente nel `localStorage` del browser, con possibilità di esportare un backup in JSON o ripristinare i dati di prova iniziali.

---

**Autore**: Valentyn Haidukov  
- Portfolio: [https://hv94.github.io/curriculum-vitae/](https://hv94.github.io/curriculum-vitae/)  
- Profilo GitHub: [@HV94](https://github.com/HV94)
