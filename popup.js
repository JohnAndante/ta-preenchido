// ─── Dados e geradores rápidos ─────────────────────────────────────────────

const DATA = {
  nomes: ["Ana Beatriz", "Carlos Eduardo", "Fernanda Lima", "João Pedro", "Mariana Costa",
    "Rafael Souza", "Juliana Oliveira", "Lucas Mendes", "Patrícia Santos", "Diego Ferreira",
    "Camila Rocha", "Bruno Alves", "Vanessa Nunes", "Thiago Carvalho", "Letícia Martins"],
  sobrenomes: ["Silva", "Santos", "Oliveira", "Souza", "Rodrigues", "Ferreira", "Alves",
    "Pereira", "Lima", "Gomes", "Costa", "Ribeiro", "Martins", "Carvalho", "Almeida"],
  ruas: ["Rua das Flores", "Avenida Brasil", "Rua São João", "Rua XV de Novembro",
    "Avenida Paulista", "Rua das Acácias", "Rua Dom Pedro", "Avenida Getúlio Vargas"],
  bairros: ["Centro", "Jardim América", "Vila Nova", "Santa Cruz", "Boa Vista", "Vila Mariana"],
  cidades: ["São Paulo", "Rio de Janeiro", "Curitiba", "Belo Horizonte", "Porto Alegre", "Fortaleza"],
  estados: ["SP", "RJ", "PR", "MG", "RS", "CE", "BA", "PE"],
  ddds: ["11", "21", "41", "31", "51", "85", "71", "81", "92", "62"],
  dominios: ["gmail.com", "hotmail.com", "outlook.com", "teste.com.br"],
  empresaSufixos: ["Tecnologia", "Soluções", "Sistemas", "Consultoria", "Comércio", "Serviços", "Digital"],
  bandeiras: [
    { nome: "Visa", prefixes: ["4539", "4556", "4916", "4532", "4929"], length: 16 },
    { nome: "Mastercard", prefixes: ["51", "52", "53", "54", "55"], length: 16 },
  ],
};

const QUICK_ACTIONS = [
  { id: "cpf", label: "CPF", icon: "ID" },
  { id: "cnpj", label: "CNPJ", icon: "PJ" },
  { id: "nome", label: "Nome", icon: "Aa" },
  { id: "email", label: "E-mail", icon: "@" },
  { id: "telefone", label: "Telefone", icon: "☎" },
  { id: "empresa", label: "Empresa", icon: "◆" },
  { id: "endereco", label: "Endereço", icon: "⌖" },
  { id: "cartao-numero", label: "Nº cartão", icon: "#" },
  { id: "cartao", label: "Cartão completo", icon: "▣" },
];

const DEFAULT_QUICK_ACTIONS = QUICK_ACTIONS.map(action => action.id);
let enabledQuickActions = [...DEFAULT_QUICK_ACTIONS];

function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function onlyDigits(s) { return (s || "").replace(/\D/g, ""); }
function stripAccents(s) { return (s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, ""); }

function gerarNome() {
  return rand(DATA.nomes) + " " + rand(DATA.sobrenomes);
}

function gerarEmail(nome) {
  const n = stripAccents(nome || gerarNome()).toLowerCase()
    .replace(/\s+/g, ".")
    .replace(/[^a-z.]/g, "");
  return n + randInt(1, 99) + "@" + rand(DATA.dominios);
}

function gerarTelefone() {
  const ddd = rand(DATA.ddds);
  return "(" + ddd + ") 9" + randInt(1000, 9999) + "-" + randInt(1000, 9999);
}

function gerarCPF() {
  const n = Array.from({ length: 9 }, () => randInt(0, 9));
  let s1 = 0, s2 = 0;
  for (let i = 0; i < 9; i++) s1 += n[i] * (10 - i);
  let d1 = (s1 * 10) % 11; if (d1 >= 10) d1 = 0; n.push(d1);
  for (let i = 0; i < 10; i++) s2 += n[i] * (11 - i);
  let d2 = (s2 * 10) % 11; if (d2 >= 10) d2 = 0; n.push(d2);
  return n.slice(0, 3).join("") + "." + n.slice(3, 6).join("") + "." + n.slice(6, 9).join("") + "-" + n[9] + n[10];
}

function gerarCNPJ() {
  const n = [randInt(0, 9), randInt(0, 9), randInt(0, 9), randInt(0, 9),
    randInt(0, 9), randInt(0, 9), randInt(0, 9), randInt(0, 9), 0, 0, 0, 1];
  const calc = (arr, len) => {
    const w = len === 12 ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2] : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const r = arr.slice(0, len).reduce((a, v, i) => a + v * w[i], 0) % 11;
    return r < 2 ? 0 : 11 - r;
  };
  n.push(calc(n, 12)); n.push(calc(n, 13));
  return n.slice(0, 2).join("") + "." + n.slice(2, 5).join("") + "." + n.slice(5, 8).join("") + "/" + n.slice(8, 12).join("") + "-" + n[12] + n[13];
}

function slugify(s) {
  return stripAccents(s).toLowerCase().replace(/[^a-z0-9]+/g, "").slice(0, 28);
}

function gerarEmpresa(nomeBase) {
  const sobrenome = (nomeBase || gerarNome()).split(" ").slice(-1)[0];
  const nomeFantasia = sobrenome + " " + rand(DATA.empresaSufixos);
  const dominio = slugify(nomeFantasia) + ".com.br";
  return {
    label: "Empresa",
    copiedLabel: "Dados da empresa",
    value: nomeFantasia,
    copy: [
      "Empresa: " + nomeFantasia,
      "Razão social: " + nomeFantasia + " LTDA",
      "CNPJ: " + gerarCNPJ(),
      "E-mail: contato@" + dominio,
      "Telefone: " + gerarTelefone(),
    ].join("\n"),
  };
}

function gerarEndereco() {
  const rua = rand(DATA.ruas);
  const numero = randInt(10, 999);
  const bairro = rand(DATA.bairros);
  const cidade = rand(DATA.cidades);
  const estado = rand(DATA.estados);
  const cep = randInt(10000, 99999) + "-" + randInt(100, 999);
  return {
    label: "Endereço",
    copiedLabel: "Endereço completo",
    value: rua + ", " + numero,
    copy: [
      "CEP: " + cep,
      "Logradouro: " + rua,
      "Número: " + numero,
      "Bairro: " + bairro,
      "Cidade: " + cidade,
      "Estado: " + estado,
    ].join("\n"),
  };
}

function isValidLuhn(s) {
  const digits = onlyDigits(s);
  let sum = 0;
  let shouldDouble = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = Number(digits[i]);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
}

function gerarCartao(nomeBase) {
  const bandeira = rand(DATA.bandeiras);
  let base = rand(bandeira.prefixes);
  while (base.length < bandeira.length - 1) base += randInt(0, 9);
  const checkDigit = Array.from({ length: 10 }, (_, i) => String(i)).find(d => isValidLuhn(base + d));
  const numero = base + (checkDigit || "0");
  const grupos = [numero.slice(0, 4), numero.slice(4, 8), numero.slice(8, 12), numero.slice(12)];
  const validade = String(randInt(1, 12)).padStart(2, "0") + "/" + String(randInt(27, 31));
  const cvv = String(randInt(100, 999));
  const titular = (nomeBase || gerarNome()).toUpperCase();
  return {
    label: "Cartão",
    value: grupos.join(" "),
    number: grupos.join(" "),
    copy: [
      "Bandeira: " + bandeira.nome,
      "Número: " + grupos.join(" "),
      "Validade: " + validade,
      "CVV: " + cvv,
      "Titular: " + titular,
    ].join("\n"),
  };
}

function gerarDadoRapido(type) {
  const nome = gerarNome();
  if (type === "cpf") return { label: "CPF", value: gerarCPF() };
  if (type === "cnpj") return { label: "CNPJ", value: gerarCNPJ() };
  if (type === "nome") return { label: "Nome", value: nome };
  if (type === "email") return { label: "E-mail", value: gerarEmail(nome) };
  if (type === "telefone") return { label: "Telefone", value: gerarTelefone() };
  if (type === "empresa") return gerarEmpresa(nome);
  if (type === "endereco") return gerarEndereco();
  if (type === "cartao-numero") {
    const cartao = gerarCartao(nome);
    return { label: "Número do cartão", value: cartao.number };
  }
  if (type === "cartao") return gerarCartao(nome);
  return null;
}

function setStatus(html, kind) {
  const status = document.getElementById("status");
  if (!status) return;
  status.className = "status" + (kind ? " " + kind : "");
  status.innerHTML = html;
}

function escapeHtml(s) {
  return String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

async function copyText(text) {
  await navigator.clipboard.writeText(text);
}

function getQuickAction(id) {
  return QUICK_ACTIONS.find(action => action.id === id);
}

function renderQuickGrid() {
  const quickGrid = document.getElementById("quickGrid");
  if (!quickGrid) return;

  const actions = enabledQuickActions.map(getQuickAction).filter(Boolean);
  if (actions.length === 0) {
    quickGrid.className = "quick-grid empty";
    quickGrid.textContent = "Nenhum atalho ativo.";
    return;
  }

  quickGrid.className = "quick-grid";
  quickGrid.textContent = "";
  actions.forEach((action) => {
    const btn = document.createElement("button");
    btn.className = "quick-btn";
    btn.dataset.generate = action.id;

    const icon = document.createElement("span");
    icon.className = "quick-icon";
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = action.icon;

    btn.appendChild(icon);
    btn.append(action.label);
    quickGrid.appendChild(btn);
  });
}

// ─── Carregar configurações ────────────────────────────────────────────────
chrome.storage.local.get(["floatVisible", "quickActions"], (data) => {
  // Toggle botão flutuante
  const visible = data.floatVisible !== false; // default true
  const toggleFloat = document.getElementById("toggleFloat");
  if (toggleFloat) toggleFloat.checked = visible;

  if (Array.isArray(data.quickActions)) {
    enabledQuickActions = data.quickActions.filter(id => getQuickAction(id));
  }
  renderQuickGrid();
});

// ─── Toggle botão flutuante ────────────────────────────────────────────────
const toggleFloat = document.getElementById("toggleFloat");
if (toggleFloat) {
  toggleFloat.addEventListener("change", async (e) => {
    const visible = e.target.checked;
    await chrome.storage.local.set({ floatVisible: visible });

    // Notifica a tab ativa, se possível
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab) {
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: (v) => { if (window.__mockFillerSetFloat) window.__mockFillerSetFloat(v); },
          args: [visible],
        });
      }
    } catch (err) {
      // Ignora erro call on restricted pages like chrome:// ou Web Store
    }
  });
}

// ─── Preencher formulário ─────────────────────────────────────────────────
const fillBtn = document.getElementById("fillBtn");
if (fillBtn) {
  fillBtn.addEventListener("click", async () => {
    fillBtn.textContent = "Preenchendo...";
    fillBtn.disabled = true;

    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: async () => {
          if (!window.__mockFillerFill) return { filled: -1, source: "" };
          return await window.__mockFillerFill(true); // true = retorna resultado
        },
      });

      // __mockFillerFill é async — o scripting retorna uma Promise, aguarda
      const raw = results?.[0]?.result;
      if (raw && raw.filled >= 0) {
        setStatus(raw.filled > 0
          ? `<strong>${raw.filled} campo${raw.filled > 1 ? "s" : ""}</strong> preenchido${raw.filled > 1 ? "s" : ""}!<br><span class="muted">${escapeHtml(raw.source.replace(/^[^\w]*/, ""))}</span>`
          : "Nenhum campo compatível encontrado.", raw.filled > 0 ? "success" : "");
      } else {
        setStatus("Recarregue a página e tente novamente.", "error");
      }
    } catch (e) {
      setStatus("Não foi possível acessar a página atual.", "error");
    }

    fillBtn.textContent = "Preencher formulário";
    fillBtn.disabled = false;
  });
}

// ─── Gerador rápido ────────────────────────────────────────────────────────
const quickGrid = document.getElementById("quickGrid");
if (quickGrid) {
  quickGrid.addEventListener("click", async (event) => {
    const btn = event.target.closest("button[data-generate]");
    if (!btn) return;

    const original = btn.innerHTML;
    const data = gerarDadoRapido(btn.dataset.generate);
    if (!data) return;

    const textToCopy = data.copy || data.value;
    try {
      await copyText(textToCopy);
      btn.classList.add("copied");
      btn.innerHTML = '<span class="quick-icon" aria-hidden="true">✓</span>Copiado';
      setTimeout(() => {
        btn.classList.remove("copied");
        btn.innerHTML = original;
      }, 1200);
    } catch (e) {
      setStatus("Não foi possível copiar. Tente novamente.", "error");
    }
  });
}

// ─── Options Page ──────────────────────────────────────────────────────────
const optionsBtn = document.getElementById("optionsBtn");
if (optionsBtn) {
  optionsBtn.addEventListener("click", () => {
    if (chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage();
    } else {
      window.open(chrome.runtime.getURL("options.html"));
    }
  });
}
