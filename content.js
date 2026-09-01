(() => {
  // ─── DADOS ESTÁTICOS ──────────────────────────────────────────────────────

  const DATA = {
    nomes: ["Ana Beatriz", "Carlos Eduardo", "Fernanda Lima", "João Pedro", "Mariana Costa",
      "Rafael Souza", "Juliana Oliveira", "Lucas Mendes", "Patrícia Santos", "Diego Ferreira",
      "Camila Rocha", "Bruno Alves", "Vanessa Nunes", "Thiago Carvalho", "Letícia Martins"],
    sobrenomes: ["Silva", "Santos", "Oliveira", "Souza", "Rodrigues", "Ferreira", "Alves",
      "Pereira", "Lima", "Gomes", "Costa", "Ribeiro", "Martins", "Carvalho", "Almeida"],
    ruas: ["Rua das Flores", "Avenida Brasil", "Rua São João", "Rua XV de Novembro",
      "Avenida Paulista", "Rua das Acácias", "Rua Dom Pedro", "Avenida Getúlio Vargas",
      "Rua Sete de Setembro", "Avenida das Américas"],
    bairros: ["Centro", "Jardim América", "Vila Nova", "Santa Cruz", "Boa Vista",
      "Jardim Paulista", "Vila Mariana", "Ipanema", "Copacabana", "Moema"],
    cidades: ["São Paulo", "Rio de Janeiro", "Curitiba", "Belo Horizonte", "Porto Alegre",
      "Fortaleza", "Salvador", "Recife", "Manaus", "Goiânia"],
    estados: [
      { nome: "São Paulo", uf: "SP" }, { nome: "Rio de Janeiro", uf: "RJ" },
      { nome: "Paraná", uf: "PR" }, { nome: "Minas Gerais", uf: "MG" },
      { nome: "Rio Grande do Sul", uf: "RS" }, { nome: "Bahia", uf: "BA" },
      { nome: "Amazonas", uf: "AM" }, { nome: "Pará", uf: "PA" },
      { nome: "Mato Grosso", uf: "MT" }, { nome: "Mato Grosso do Sul", uf: "MS" },
      { nome: "Rondônia", uf: "RO" }, { nome: "Roraima", uf: "RR" },
      { nome: "Acre", uf: "AC" }, { nome: "Amapá", uf: "AP" },
      { nome: "Tocantins", uf: "TO" }, { nome: "Piauí", uf: "PI" },
      { nome: "Maranhão", uf: "MA" }, { nome: "Ceará", uf: "CE" },
      { nome: "Rio Grande do Norte", uf: "RN" }, { nome: "Paraíba", uf: "PB" },
      { nome: "Pernambuco", uf: "PE" }, { nome: "Alagoas", uf: "AL" },
      { nome: "Sergipe", uf: "SE" }, { nome: "Espírito Santo", uf: "ES" },
      { nome: "Distrito Federal", uf: "DF" }, { nome: "Goiás", uf: "GO" },
      { nome: "Santa Catarina", uf: "SC" }, { nome: "Rio Grande do Sul", uf: "RS" },
      { nome: "Rio Grande do Sul", uf: "RS" }, { nome: "Rio Grande do Sul", uf: "RS" },
    ],
    ddds: ["11", "21", "41", "31", "51", "85", "71", "81", "92", "62", "48", "27", "98", "83", "84"],
    dominios: ["gmail.com", "hotmail.com", "yahoo.com.br", "outlook.com", "teste.com.br"],
    empresaSufixos: ["Tecnologia", "Soluções", "Sistemas", "Consultoria", "Comércio", "Serviços", "Digital", "Logística"],
    empresaTipos: ["LTDA", "ME", "EPP", "S.A."],
    bandeiras: [
      { nome: "Visa", prefixes: ["4539", "4556", "4916", "4532", "4929"], length: 16, auto: true },
      { nome: "Mastercard", prefixes: ["51", "52", "53", "54", "55"], length: 16, auto: true },
      { nome: "Amex", prefixes: ["34", "37"], length: 15, auto: false },
      { nome: "Diners Club", prefixes: ["300", "301", "302", "303", "304", "305", "36", "38"], length: 14, auto: false },
    ],
  };

  const CEPS_REAIS = [
    "01310100", "01001000", "04538133",
    "22250040", "20040020", "22071060",
    "80010010", "80250210", "87013190",
    "85851010", "30130110", "30140071",
    "90010000", "90470340", "40020010",
    "60135210", "60175047", "50010010",
    "69010060", "74110010",
  ];

  const LOCALIDADES = [
    { cidade: "São Paulo", estado: "SP" },
    { cidade: "Rio de Janeiro", estado: "RJ" },
    { cidade: "Curitiba", estado: "PR" },
    { cidade: "Belo Horizonte", estado: "MG" },
    { cidade: "Porto Alegre", estado: "RS" },
    { cidade: "Fortaleza", estado: "CE" },
    { cidade: "Salvador", estado: "BA" },
    { cidade: "Recife", estado: "PE" },
    { cidade: "Manaus", estado: "AM" },
    { cidade: "Goiânia", estado: "GO" },
  ];

  // ─── ESTADO DAS CONFIGURAÇÕES ─────────────────────────────────────────────

  let SETTINGS = {
    floatVisible: true,
    shortcut: { ctrl: true, alt: false, shift: true, key: "F" },
    customCategories: [],
    useBrasilAPI: true
  };

  let lastContextMenuEditable = null;

  chrome.storage.local.get(["floatVisible", "shortcut", "customCategories", "useBrasilAPI"], (data) => {
    if (data.floatVisible !== undefined) SETTINGS.floatVisible = data.floatVisible;
    if (data.useBrasilAPI !== undefined) SETTINGS.useBrasilAPI = data.useBrasilAPI;
    if (data.shortcut) SETTINGS.shortcut = data.shortcut;
    if (data.customCategories) SETTINGS.customCategories = data.customCategories;
    applyFloatVisibility();
  });

  chrome.storage.onChanged.addListener((changes) => {
    if (changes.floatVisible) { SETTINGS.floatVisible = changes.floatVisible.newValue; applyFloatVisibility(); }
    if (changes.useBrasilAPI) SETTINGS.useBrasilAPI = changes.useBrasilAPI.newValue;
    if (changes.shortcut) SETTINGS.shortcut = changes.shortcut.newValue;
    if (changes.customCategories) Object.assign(SETTINGS, { customCategories: changes.customCategories.newValue });
  });

  // ─── HELPERS ──────────────────────────────────────────────────────────────

  function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
  function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function onlyDigits(s) { return (s || "").replace(/\D/g, ""); }
  function stripAccents(s) { return (s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, ""); }
  function slugify(s) { return stripAccents(s).toLowerCase().replace(/[^a-z0-9]+/g, "").slice(0, 28); }
  function normalizeSearchText(s) {
    return stripAccents(s || "")
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/[_\-.\/]+/g, " ")
      .replace(/\s+/g, " ")
      .toLowerCase();
  }

  // ─── GERADORES ────────────────────────────────────────────────────────────

  function gerarNome() { return rand(DATA.nomes) + " " + rand(DATA.sobrenomes); }

  function gerarEmail(nome) {
    const n = (nome || gerarNome()).toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, ".").replace(/[^a-z.]/g, "");
    return n + randInt(1, 99) + "@" + rand(DATA.dominios);
  }

  function gerarEmailEmpresa(dominio, prefixo) {
    return (prefixo || rand(["contato", "comercial", "atendimento"])) + "@" + dominio;
  }

  // Gera os dígitos do celular uma só vez, retorna objeto com todas as variantes
  function gerarCelularVariants() {
    const ddd = rand(DATA.ddds);
    const part1 = "9" + randInt(1000, 9999);
    const part2 = String(randInt(1000, 9999));
    const digits = ddd + part1 + part2; // 11 dígitos
    return [
      "(" + ddd + ") " + part1 + "-" + part2,       // (85) 91234-5678
      ddd + part1 + part2,                          // 85912345678 — só dígitos
      "+55 (" + ddd + ") " + part1 + "-" + part2,   // +55 (85) 91234-5678
      "+55" + ddd + part1 + part2,                  // +5585912345678
      ddd + " " + part1 + "-" + part2,              // 85 91234-5678
      "55" + ddd + part1 + part2,                   // 5585912345678
    ];
  }

  function gerarCPFVariants() {
    const n = Array.from({ length: 9 }, () => randInt(0, 9));
    let s1 = 0, s2 = 0;
    for (let i = 0; i < 9; i++) s1 += n[i] * (10 - i);
    let d1 = (s1 * 10) % 11; if (d1 >= 10) d1 = 0; n.push(d1);
    for (let i = 0; i < 10; i++) s2 += n[i] * (11 - i);
    let d2 = (s2 * 10) % 11; if (d2 >= 10) d2 = 0; n.push(d2);
    const fmt = n.slice(0, 3).join("") + "." + n.slice(3, 6).join("") + "." + n.slice(6, 9).join("") + "-" + n[9] + n[10];
    const raw = n.join("");
    return [fmt, raw]; // 000.000.000-00 | 00000000000
  }

  function gerarCNPJVariants() {
    const n = [randInt(0, 9), randInt(0, 9), randInt(0, 9), randInt(0, 9),
    randInt(0, 9), randInt(0, 9), randInt(0, 9), randInt(0, 9), 0, 0, 0, 1];
    const calc = (arr, len) => {
      const w = len === 12 ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2] : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
      const r = arr.slice(0, len).reduce((a, v, i) => a + v * w[i], 0) % 11;
      return r < 2 ? 0 : 11 - r;
    };
    n.push(calc(n, 12)); n.push(calc(n, 13));
    const fmt = n.slice(0, 2).join("") + "." + n.slice(2, 5).join("") + "." + n.slice(5, 8).join("") + "/" + n.slice(8, 12).join("") + "-" + n[12] + n[13];
    const raw = n.join("");
    return [fmt, raw];
  }

  function gerarCEPVariants(cepStr) {
    // cepStr já vem do buscarCepReal ou do fallback — ex: "01310-100"
    const raw = onlyDigits(cepStr);
    return [
      cepStr, // 01310-100
      raw,    // 01310100
    ];
  }

  // Gera variantes de data para diferentes formatos encontrados em formulários
  function gerarDataVariants() {
    const year = new Date().getFullYear() - randInt(18, 60);
    const month = String(randInt(1, 12)).padStart(2, "0");
    const day = String(randInt(1, 28)).padStart(2, "0");
    const yy = String(year).slice(2);
    return [
      day + "/" + month + "/" + year,   // DD/MM/YYYY  — padrão BR
      year + "-" + month + "-" + day,   // YYYY-MM-DD  — ISO / input[type=date]
      month + "/" + day + "/" + year,   // MM/DD/YYYY  — padrão US
      day + "-" + month + "-" + year,   // DD-MM-YYYY
      day + "/" + month + "/" + yy,     // DD/MM/YY
      day + "." + month + "." + year,   // DD.MM.YYYY
    ];
  }

  function gerarCartaoVariants(titular) {
    const b = rand(DATA.bandeiras.filter(b => b.auto !== false));
    let base = rand(b.prefixes);
    const isValidLuhn = (s) => {
      const d = s.split("").map(Number);
      let sum = 0;
      let shouldDouble = false;
      for (let i = d.length - 1; i >= 0; i--) {
        let digit = d[i];
        if (shouldDouble) {
          digit *= 2;
          if (digit > 9) digit -= 9;
        }
        sum += digit;
        shouldDouble = !shouldDouble;
      }
      return sum % 10 === 0;
    };
    while (base.length < b.length - 1) base += randInt(0, 9);
    const checkDigit = Array.from({ length: 10 }, (_, i) => String(i)).find(d => isValidLuhn(base + d));
    const num = base + (checkDigit || "0");
    const g = b.length === 15
      ? [num.slice(0, 4), num.slice(4, 10), num.slice(10)]
      : [num.slice(0, 4), num.slice(4, 8), num.slice(8, 12), num.slice(12)];
    const spaced = g.join(" ");
    const dashed = g.join("-");
    const raw = num;
    const mm = String(randInt(1, 12)).padStart(2, "0");
    const yyyy = String(randInt(26, 30));
    const yy = yyyy.slice(2);
    const cvv = String(randInt(b.length === 15 ? 1000 : 100, b.length === 15 ? 9999 : 999));
    const nome = (titular || gerarNome()).toUpperCase();
    return {
      numero: [spaced, raw, dashed], // variantes do número
      validade: [mm + "/" + yyyy, mm + "/" + yy, mm + yy, mm + "-" + yy], // variantes da validade
      cvv: [cvv],
      nome: [nome],
      bandeira: b.nome,
    };
  }

  function gerarPessoaContext() {
    const nome = gerarNome();
    const partes = nome.split(" ");
    const primeiroNome = partes[0];
    const sobrenome = partes.slice(1).join(" ");
    const telefoneVariants = gerarCelularVariants();
    return {
      nome: nome,
      primeiroNome: primeiroNome,
      sobrenome: sobrenome,
      email: gerarEmail(nome),
      telefone: telefoneVariants[0],
      telefoneVariants: telefoneVariants,
      cpfVariants: gerarCPFVariants(),
      nascimentoVariants: gerarDataVariants(),
    };
  }

  function gerarEmpresaContext(pessoa) {
    const marca = pessoa.sobrenome.split(" ")[0] || rand(DATA.sobrenomes);
    const segmento = rand(DATA.empresaSufixos);
    const nomeFantasia = marca + " " + segmento;
    const razaoSocial = nomeFantasia + " " + rand(DATA.empresaTipos);
    const dominio = slugify(nomeFantasia) + ".com.br";
    const telefoneVariants = gerarCelularVariants();
    return {
      razaoSocial: razaoSocial,
      nomeFantasia: nomeFantasia,
      dominio: dominio,
      email: gerarEmailEmpresa(dominio),
      telefone: telefoneVariants[0],
      telefoneVariants: telefoneVariants,
      cnpjVariants: gerarCNPJVariants(),
      responsavel: pessoa.nome,
      cargo: rand(["Analista de Sistemas", "Gerente Comercial", "Coordenador Administrativo", "Diretor de Operações", "Representante Legal"]),
    };
  }

  async function gerarEnderecoContext(hasCepField) {
    if (hasCepField && SETTINGS.useBrasilAPI) {
      showToast("Buscando CEP...", 3000);
      return await buscarCepReal();
    }

    const localidade = rand(LOCALIDADES);
    return {
      cep: randInt(10000, 99999) + "-" + randInt(100, 999),
      logradouro: rand(DATA.ruas), bairro: rand(DATA.bairros),
      cidade: localidade.cidade, estado: localidade.estado, fromApi: false,
    };
  }

  function gerarPagamentoContext(pessoa) {
    return gerarCartaoVariants(pessoa.nome);
  }

  function getCardNumberValue(ctx, type) {
    return type === "number" ? ctx.cartao.numero[1] : ctx.cartao.numero[0];
  }

  function formatAddressBlock(endereco, numero) {
    return [
      "CEP: " + endereco.cep,
      "Logradouro: " + endereco.logradouro,
      "Número: " + numero,
      "Bairro: " + endereco.bairro,
      "Cidade: " + endereco.cidade,
      "Estado: " + endereco.estado,
    ].join("\n");
  }

  function formatCardBlock(cartao) {
    return [
      "Bandeira: " + cartao.bandeira,
      "Número: " + cartao.numero[0],
      "Validade: " + cartao.validade[0],
      "CVV: " + cartao.cvv[0],
      "Titular: " + cartao.nome[0],
    ].join("\n");
  }

  // ─── CEP REAL via BrasilAPI ───────────────────────────────────────────────

  async function buscarCepReal() {
    const cep = CEPS_REAIS[randInt(0, CEPS_REAIS.length - 1)];
    try {
      const res = await fetch("https://brasilapi.com.br/api/cep/v2/" + cep, {
        signal: AbortSignal.timeout(5000),
      });
      const d = await res.json();
      return {
        cep: d.cep || "", logradouro: d.street || "",
        bairro: d.neighborhood || "", cidade: d.city || "", estado: d.state || "",
        fromApi: true,
      };
    } catch (e) {
      const localidade = rand(LOCALIDADES);
      return {
        cep: randInt(10000, 99999) + "-" + randInt(100, 999),
        logradouro: rand(DATA.ruas), bairro: rand(DATA.bairros),
        cidade: localidade.cidade, estado: localidade.estado,
        fromApi: false,
      };
    }
  }

  // ─── DETECÇÃO DE CAMPOS ───────────────────────────────────────────────────

  function getLabelText(label) {
    if (!label) return "";
    const clone = label.cloneNode(true);
    clone.querySelectorAll("input, textarea, select, option, button").forEach(node => node.remove());
    return clone.textContent || "";
  }

  function getFieldInfo(el) {
    const attrs = [el.name, el.id, el.placeholder,
    el.getAttribute("aria-label"), el.getAttribute("data-testid"),
    el.getAttribute("autocomplete"), el.getAttribute("pattern"),
    ].filter(Boolean).join(" ");
    let lbl = "";
    try {
      if (el.id) {
        const l = document.querySelector('label[for="' + CSS.escape(el.id) + '"]');
        if (l) lbl = getLabelText(l);
      }
    } catch (_) { }
    const pl = el.closest("label");
    if (pl) lbl += " " + getLabelText(pl);

    let text = attrs + " " + lbl;
    
    // Proteção: Remove domínios de e-mails de exemplo nos placeholders para não disparar 'empresa'
    text = text.replace(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/gi, " email ");
    text = text.replace(/https?:\/\/[a-z0-9.-]+/gi, " url ");
    
    return normalizeSearchText(text);
  }

  function match(info) {
    const normalizedInfo = normalizeSearchText(info);
    for (let i = 1; i < arguments.length; i++) {
       const term = normalizeSearchText(arguments[i]).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // escapa regex
       // Expressão regular avançada: procura o termo como palavra inteira,
       // respeitando acentos brasileiros e camelCase/snake_case delimitadores usuais.
       const regex = new RegExp('(^|[^a-z0-9])' + term + '([^a-z0-9]|$)', 'i');
       if (regex.test(normalizedInfo)) return true;
    }
    return false;
  }

  function detectFormContext(fields) {
    const text = fields.map(getFieldInfo).join(" ");
    const score = {
      pessoa: 0,
      empresa: 0,
      pagamento: 0,
      endereco: 0,
    };

    if (match(text, "cpf", "pessoa fisica", "pessoa física", "nascimento", "sobrenome", "firstname", "first name", "lastname", "last name")) score.pessoa += 3;
    if (match(text, "cnpj", "razao social", "razão social", "nome fantasia", "empresa", "company", "organizacao", "organization", "inscricao estadual", "inscrição estadual")) score.empresa += 4;
    if (match(text, "cartao", "cartão", "card", "cvv", "cvc", "validade", "expiry", "vencimento", "titular")) score.pagamento += 4;
    if (match(text, "cep", "zipcode", "postal", "logradouro", "endereco", "endereço", "bairro", "cidade", "municipio", "município")) score.endereco += 3;

    let principal = "pessoa";
    if (score.empresa > score.pessoa) principal = "empresa";
    if (score.pagamento > Math.max(score.empresa, score.pessoa)) principal = "pagamento";

    return {
      principal: principal,
      hasPessoa: score.pessoa > 0,
      hasEmpresa: score.empresa > 0,
      hasPagamento: score.pagamento > 0,
      hasEndereco: score.endereco > 0,
      score: score,
    };
  }

  function fieldLooksCompany(info) {
    return match(info, "empresa", "company", "organizacao", "organization", "razao social", "razão social", "nome fantasia", "cnpj", "inscricao estadual", "inscrição estadual", "corporate", "business");
  }

  function fieldLooksPersonOwner(info) {
    return match(info, "responsavel", "responsável", "representante", "titular", "solicitante", "owner", "person", "pessoa");
  }

  function pickEmailForField(info, ctx) {
    if (match(info, "login", "username", "usuario", "usuário")) return ctx.pessoa.email;
    if (ctx.form.principal === "empresa" && match(info, "contato", "comercial", "atendimento", "financeiro")) return ctx.empresa.email;
    if (fieldLooksCompany(info)) return ctx.empresa.email;
    return ctx.pessoa.email;
  }

  function pickPhoneForField(info, ctx) {
    if (ctx.form.principal === "empresa" && match(info, "contato", "comercial", "atendimento", "financeiro")) return ctx.empresa.telefone;
    if (fieldLooksCompany(info)) return ctx.empresa.telefone;
    return ctx.pessoa.telefone;
  }

  function pickCargoForField(info, ctx) {
    if (match(info, "cargo", "profissao", "profissão", "occupation", "position")) return ctx.empresa.cargo;
    if (ctx.form.principal === "empresa" && match(info, "role", "title")) return ctx.empresa.cargo;
    return null;
  }

  // ─── DISPATCH ─────────────────────────────────────────────────────────────

  function dispatchEvents(el, value) {
    if (el.type === "checkbox" || el.type === "radio") {
      const p = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "checked");
      const setter = p ? p.set : undefined;
      if (setter) setter.call(el, value); else el.checked = value;
      el.dispatchEvent(new Event("input", { bubbles: true }));
      el.dispatchEvent(new Event("change", { bubbles: true }));
      return;
    }
    const proto = el.tagName === "SELECT" ? window.HTMLSelectElement.prototype
      : el.tagName === "TEXTAREA" ? window.HTMLTextAreaElement.prototype
        : window.HTMLInputElement.prototype;
    const setter = Object.getOwnPropertyDescriptor(proto, "value") &&
      Object.getOwnPropertyDescriptor(proto, "value").set;
    if (setter) setter.call(el, value); else el.value = value;
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.dispatchEvent(new Event("change", { bubbles: true }));
    el.dispatchEvent(new Event("blur", { bubbles: true }));
    el.dispatchEvent(new Event("focusout", { bubbles: true }));
  }

  function dispatchEditableEvents(el) {
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.dispatchEvent(new Event("change", { bubbles: true }));
    el.dispatchEvent(new Event("blur", { bubbles: true }));
    el.dispatchEvent(new Event("focusout", { bubbles: true }));
  }

  function isEditableElement(el) {
    if (!el || el.nodeType !== Node.ELEMENT_NODE) return false;
    if (el.isContentEditable) return true;
    if (el.tagName === "TEXTAREA") return !el.disabled && !el.readOnly;
    if (el.tagName !== "INPUT") return false;

    const type = (el.type || "text").toLowerCase();
    const textTypes = [
      "text", "search", "url", "tel", "email", "password", "number",
      "date", "datetime-local", "month", "time", "week"
    ];
    return textTypes.includes(type) && !el.disabled && !el.readOnly;
  }

  function getEditableRoot(el) {
    if (!isEditableElement(el)) return null;
    if (!el.isContentEditable || el.tagName === "INPUT" || el.tagName === "TEXTAREA") return el;

    let root = el;
    while (root.parentElement && root.parentElement.isContentEditable) {
      root = root.parentElement;
    }
    return root;
  }

  function getEditableFromEvent(event) {
    const path = typeof event.composedPath === "function" ? event.composedPath() : [];
    for (const node of path) {
      const root = getEditableRoot(node);
      if (root) return root;
      if (node && node.nodeType === Node.ELEMENT_NODE) {
        const editableParent = node.closest && node.closest("[contenteditable=''], [contenteditable='true'], [contenteditable='plaintext-only']");
        const parentRoot = getEditableRoot(editableParent);
        if (parentRoot) return parentRoot;
      }
    }

    const target = event.target;
    const targetRoot = getEditableRoot(target);
    if (targetRoot) return targetRoot;
    const closest = target && target.closest
      ? target.closest("input, textarea, [contenteditable=''], [contenteditable='true'], [contenteditable='plaintext-only']")
      : null;
    return getEditableRoot(closest);
  }

  function getCurrentEditable() {
    const lastRoot = getEditableRoot(lastContextMenuEditable);
    if (lastRoot && document.contains(lastRoot)) {
      return lastRoot;
    }

    const activeRoot = getEditableRoot(document.activeElement);
    if (activeRoot) return activeRoot;
    return null;
  }

  function fillSingleEditable(el, value) {
    if (!el || value === null || value === undefined) return false;

    try {
      el.focus({ preventScroll: true });
    } catch (_) {
      el.focus();
    }

    if (el.isContentEditable) {
      el.textContent = String(value);
      dispatchEditableEvents(el);
      return true;
    }

    dispatchEvents(el, String(value));
    return true;
  }

  function isVisible(el) {
    const r = el.getBoundingClientRect(), s = window.getComputedStyle(el);
    return r.width > 0 && r.height > 0
      && s.display !== "none" && s.visibility !== "hidden" && s.opacity !== "0";
  }

  function detectLocalFormContext(el, allFields, fallbackForm) {
    const container = el.closest("form, fieldset, [role='form'], section, .card");
    if (!container) return fallbackForm;

    const localFields = allFields.filter(field => container.contains(field));
    if (localFields.length <= 1) return fallbackForm;
    return detectFormContext(localFields);
  }

  // ─── DETECÇÃO DE ERRO NO CAMPO ────────────────────────────────────────────
  // Suporta: Ant Design, Bootstrap, Material UI, Chakra, Tailwind/custom, HTML5

  function fieldHasError(el) {
    // 1. HTML5 nativo
    if (el.validity && !el.validity.valid) return true;

    // 2. aria-invalid
    if (el.getAttribute("aria-invalid") === "true") return true;

    // 3. Classes de erro no próprio input
    const inputErrorClasses = [
      "is-invalid",               // Bootstrap
      "ant-input-status-error",   // Ant Design
      "error", "input-error",
      "field-error", "has-error",
      "ng-invalid",               // Angular
      "v-input--error",           // Vuetify
    ];
    if (inputErrorClasses.some(c => el.classList.contains(c))) return true;

    // 4. Sobe na árvore até 6 níveis procurando container com erro
    const containerErrorClasses = [
      "ant-form-item-has-error",  // Ant Design
      "has-error",                // Bootstrap 3
      "is-invalid",
      "form-group--error",
      "chakra-form-control[data-invalid]",
      "Mui-error",                // Material UI
      "field--error",
      "input-group--error",
      "invalid",
    ];
    let node = el.parentElement;
    for (let i = 0; i < 6; i++) {
      if (!node) break;
      if (containerErrorClasses.some(c => node.classList && node.classList.contains(c))) return true;
      // data-invalid attr (Chakra UI, Radix)
      if (node.hasAttribute("data-invalid") || node.getAttribute("aria-invalid") === "true") return true;
      node = node.parentElement;
    }

    // 5. Mensagem de erro adjacente visível
    const errorSelectors = [
      ".ant-form-item-explain-error",
      ".invalid-feedback",        // Bootstrap
      ".field-error-message",
      ".error-message",
      ".form-error",
      "[role='alert']",
      ".MuiFormHelperText-root.Mui-error",
      ".chakra-form__error-message",
      ".v-messages__message",
    ];
    // Sobe até o form-item container e procura dentro dele
    let container = el.parentElement;
    for (let i = 0; i < 6; i++) {
      if (!container) break;
      for (const sel of errorSelectors) {
        try {
          const errEl = container.querySelector(sel);
          if (errEl && errEl.textContent.trim().length > 0) {
            const style = window.getComputedStyle(errEl);
            if (style.display !== "none" && style.visibility !== "hidden") return true;
          }
        } catch (_) { }
      }
      container = container.parentElement;
    }

    return false;
  }

  // ─── MAPA DE VARIANTES POR CAMPO ─────────────────────────────────────────
  // Cada entrada: { key: fieldKey, variants: [v1, v2, ...] }
  // Ao detectar erro após o fill primário, tentamos as próximas variantes em sequência.

  function buildVariantMap(ctx) {
    return {
      // ── Telefone/celular ──
      telefone: ctx.pessoa.telefoneVariants,
      telefone_empresa: ctx.empresa.telefoneVariants,

      // ── CPF ──
      cpf: ctx.pessoa.cpfVariants,

      // ── CNPJ ──
      cnpj: ctx.empresa.cnpjVariants,

      // ── CEP ──
      cep: ctx.cepVariants,

      // ── Data ──
      data: ctx.pessoa.nascimentoVariants,

      // ── Cartão número ──
      cartao_numero: ctx.cartao.numero,
      cartao_validade: ctx.cartao.validade,
      cartao_cvv: ctx.cartao.cvv,
      cartao_nome: ctx.cartao.nome,

      // ── E-mail (variante sem ponto no local part) ──
      email: [
        ctx.pessoa.email,
        ctx.pessoa.email.replace(/\./g, "_"),
        ctx.pessoa.email.split("@")[0].replace(/\d+$/, "") + "@" + ctx.pessoa.email.split("@")[1],
      ],

      email_empresa: [
        ctx.empresa.email,
        gerarEmailEmpresa(ctx.empresa.dominio, "financeiro"),
        gerarEmailEmpresa(ctx.empresa.dominio, "suporte"),
      ],

      // ── Número/endereço ──
      numero: [ctx.numero, "s/n", "SN"],
    };
  }

  function getOptionText(option) {
    return normalizeSearchText([
      option.value,
      option.textContent,
      option.label,
      option.getAttribute("data-value"),
      option.getAttribute("data-testid"),
    ].filter(Boolean).join(" "));
  }

  function getOptionParts(option) {
    return {
      value: normalizeSearchText(option.value || "").trim(),
      text: normalizeSearchText(option.textContent || "").trim(),
      label: normalizeSearchText(option.label || "").trim(),
      all: getOptionText(option).trim(),
    };
  }

  function getTextTokens(text) {
    return normalizeSearchText(text).split(/[^a-z0-9]+/).filter(Boolean);
  }

  function isPlaceholderOption(option) {
    if (!option || option.disabled) return true;
    const value = String(option.value || "").trim();
    const text = normalizeSearchText(option.textContent || option.label || "").trim();
    const cleanText = text.replace(/[^a-z0-9]+/g, " ").trim();
    if (value === "") return true;
    return /^(selecione|selecionar|escolha|choose|select|placeholder|opcao|opção)(\s|$)/.test(cleanText)
      || cleanText === ""
      || cleanText === "-";
  }

  function pickSelectOption(select, candidates) {
    if (!select || select.tagName !== "SELECT") return null;
    const options = Array.from(select.options).filter(option => !isPlaceholderOption(option));
    if (options.length === 0) return null;

    const normalizedCandidates = (candidates || [])
      .filter(Boolean)
      .map(candidate => normalizeSearchText(String(candidate)))
      .filter(Boolean);

    for (const candidate of normalizedCandidates) {
      const exact = options.find(option => {
        const parts = getOptionParts(option);
        return parts.value === candidate || parts.text === candidate || parts.label === candidate;
      });
      if (exact) return exact;
    }

    for (const candidate of normalizedCandidates) {
      const candidateTokens = getTextTokens(candidate);
      const token = options.find(option => {
        const parts = getOptionParts(option);
        const tokens = getTextTokens(parts.all);
        if (candidateTokens.length > 1) {
          return candidateTokens.every(candidateToken => tokens.includes(candidateToken));
        }
        return candidateTokens.some(candidateToken => tokens.includes(candidateToken));
      });
      if (token) return token;
    }

    for (const candidate of normalizedCandidates) {
      if (candidate.length <= 3) continue;
      const term = candidate.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp("(^|[^a-z0-9])" + term + "([^a-z0-9]|$)", "i");
      const word = options.find(option => regex.test(getOptionText(option)));
      if (word) return word;
    }

    for (const candidate of normalizedCandidates) {
      if (candidate.length <= 3) continue;
      const contained = options.find(option => {
        const text = getOptionText(option);
        return text.indexOf(candidate) !== -1 || (text.length > 3 && candidate.indexOf(text) !== -1);
      });
      if (contained) return contained;
    }

    return null;
  }

  function pickSafeFallbackSelectOption(select) {
    const options = Array.from(select.options).filter(option => !isPlaceholderOption(option));
    if (options.length === 0) return null;
    return options[randInt(0, options.length - 1)];
  }

  function getStateName(uf) {
    const found = DATA.estados.find(estado => estado.uf === uf);
    return found ? found.nome : uf;
  }

  function pickSelectValue(el, info, ctx, customMatch) {
    let option = null;

    if (customMatch) {
      option = pickSelectOption(el, customMatch.values);
      if (option) return option.value;
    }

    if (match(info, "tipo pessoa", "tipo_pessoa", "tipopessoa", "person type", "tipo cliente", "perfil")) {
      if (ctx.form.principal === "empresa") {
        option = pickSelectOption(el, ["pj", "pessoa juridica", "pessoa jurídica", "juridica", "jurídica", "empresa", "cnpj"]);
      } else {
        option = pickSelectOption(el, ["pf", "pessoa fisica", "pessoa física", "fisica", "física", "cpf"]);
      }
      if (option) return option.value;
    }

    if (match(info, "tipo documento", "tipo_documento", "document type", "documento", "doc type")) {
      option = pickSelectOption(el, ctx.form.principal === "empresa" ? ["cnpj", "pessoa juridica", "pessoa jurídica"] : ["cpf", "pessoa fisica", "pessoa física"]);
      if (option) return option.value;
    }

    if (match(info, "card_brand", "card brand", "cardbrand", "bandeira", "bandeira cartao", "bandeira cartão")) {
      option = pickSelectOption(el, [ctx.cartao.bandeira, ctx.cartao.bandeira.toLowerCase(), ctx.cartao.bandeira.replace(/\s+/g, "")]);
      if (option) return option.value;
    }

    if (match(info, "estado civil", "civil status", "marital", "marital status")) {
      option = pickSelectOption(el, ["solteiro", "solteira", "single", "casado", "casada", "married"]);
      if (option) return option.value;
    }

    if (pickCargoForField(info, ctx)) {
      option = pickSelectOption(el, [ctx.empresa.cargo, "analista", "gerente", "coordenador", "diretor", "representante"]);
      if (option) return option.value;
    }

    if (match(info, "estado", "state", "uf")) {
      option = pickSelectOption(el, [ctx.end.estado, getStateName(ctx.end.estado), ctx.end.cidade]);
      if (option) return option.value;
    }

    if (match(info, "cidade", "city", "municipio", "município")) {
      option = pickSelectOption(el, [ctx.end.cidade]);
      if (option) return option.value;
    }

    if (match(info, "pais", "país", "country")) {
      option = pickSelectOption(el, ["br", "bra", "brasil", "brazil", "brasil/brazil"]);
      if (option) return option.value;
    }

    if (match(info, "empresa", "company", "organizacao", "organization")) {
      option = pickSelectOption(el, [ctx.empresa.nomeFantasia, ctx.empresa.razaoSocial, "empresa", "juridica", "jurídica"]);
      if (option) return option.value;
    }

    option = pickSafeFallbackSelectOption(el);
    return option ? option.value : null;
  }

  // ─── PREENCHIMENTO PRINCIPAL ──────────────────────────────────────────────

  async function fillForms() {
    const sel = [
      "input:not([type=hidden]):not([type=submit]):not([type=button])",
      ":not([type=reset])",
      ":not([disabled]):not([readonly])",
      ", textarea:not([disabled]):not([readonly])",
      ", select:not([disabled])",
    ].join("");

    const fields = Array.from(document.querySelectorAll(sel)).filter(isVisible);
    const form = detectFormContext(fields);

    // Só consulta a BrasilAPI se houver campo de CEP/endereço visível
    const hasCepField = fields.some(function (el) {
      return match(getFieldInfo(el), "cep", "zipcode", "zip_code", "postal", "logradouro", "endereco", "endereço", "bairro", "street");
    });

    const pessoa = gerarPessoaContext();
    const empresa = gerarEmpresaContext(pessoa);
    const end = await gerarEnderecoContext(hasCepField);
    const cartao = gerarPagamentoContext(pessoa);
    const numero = String(randInt(1, 999));
    const cepVariants = gerarCEPVariants(end.cep);

    const ctx = { pessoa, empresa, end, cartao, numero, cepVariants, form };
    const variantMap = buildVariantMap(ctx);

    // Guarda: el → { fieldKey, variantIndex }  para o retry
    const filledFields = [];
    let filled = 0;
    const radiosPicked = new Set();

    fields.forEach(function (el) {
      const info = getFieldInfo(el);
      const type = (el.type || "").toLowerCase();
      let v = null;
      let fieldKey = null;

      // ── Classificação e valor primário ──
      let customMatch = null;
      for (const cat of SETTINGS.customCategories || []) {
        // Categorias padrão antigas usam valores soltos e podem quebrar o contexto
        // coerente recém-gerado (ex.: firstName/lastName recebendo nome completo
        // de uma lista estática enquanto o e-mail vem de outra pessoa). Mantemos
        // override apenas para categorias realmente criadas pelo usuário.
        if (String(cat.id || "").indexOf("default_") === 0) continue;
        if (cat.identifiers.some(id => match(info, id.toLowerCase()))) {
          customMatch = cat;
          break;
        }
      }

      if (el.tagName === "SELECT") {
        const selectCtx = { ...ctx, form: detectLocalFormContext(el, fields, form) };
        v = pickSelectValue(el, info, selectCtx, customMatch);
        if (customMatch) {
          fieldKey = "custom_" + customMatch.id;
          variantMap[fieldKey] = Array.from(el.options)
            .filter(option => !isPlaceholderOption(option))
            .map(option => option.value);
        }
      }
      else if (customMatch) {
        const randomValues = [...customMatch.values].sort(() => Math.random() - 0.5);
        v = randomValues[0];
        fieldKey = "custom_" + customMatch.id;
        variantMap[fieldKey] = randomValues;
      }
      else if (match(info, "card_number", "cardnumber", "card number", "numero_cartao", "card-number", "numero cartao", "número cartão", "pan")) { v = getCardNumberValue(ctx, type); fieldKey = "cartao_numero"; }
      else if (match(info, "card_name", "card name", "cardholder", "card holder", "card holder name", "titular cartao", "titular cartão", "nome_cartao", "nome cartao", "nome cartão") || (ctx.form.hasPagamento && match(info, "titular"))) { v = ctx.cartao.nome[0]; fieldKey = "cartao_nome"; }
      else if (match(info, "expiry", "validade cartao", "validade cartão", "expiracao", "expiração", "exp_date", "vencimento cartao", "vencimento cartão") || (ctx.form.hasPagamento && match(info, "validade", "vencimento"))) { v = ctx.cartao.validade[0]; fieldKey = "cartao_validade"; }
      else if (match(info, "cvv", "cvc", "csc", "security_code", "cod_seguranca", "codigo seguranca", "código segurança")) { v = ctx.cartao.cvv[0]; fieldKey = "cartao_cvv"; }
      else if (match(info, "card_brand", "card brand", "cardbrand", "bandeira", "bandeira cartao", "bandeira cartão")) { v = ctx.cartao.bandeira; }
      else if (match(info, "cnpj")) { v = ctx.empresa.cnpjVariants[0]; fieldKey = "cnpj"; }
      else if (match(info, "cpf")) { v = ctx.pessoa.cpfVariants[0]; fieldKey = "cpf"; }
      else if (type === "email") {
        v = pickEmailForField(info, ctx);
        fieldKey = v === ctx.empresa.email ? "email_empresa" : "email";
      }
      else if (type === "tel") {
        v = pickPhoneForField(info, ctx);
        fieldKey = v === ctx.empresa.telefone ? "telefone_empresa" : "telefone";
      }
      else if (type === "date") { v = ctx.pessoa.nascimentoVariants[1]; /* ISO para input date */ }
      else if (type === "number") {
        v = match(info, "idade", "age") ? String(randInt(18, 60))
          : match(info, "cep", "zip") ? onlyDigits(end.cep)
            : String(randInt(1, 100));
      }
      else if (match(info, "razao social", "razão social", "legal_name")) v = ctx.empresa.razaoSocial;
      else if (match(info, "nome fantasia", "fantasy_name", "trade_name")) v = ctx.empresa.nomeFantasia;
      else if (match(info, "dominio", "domínio", "domain")) v = ctx.empresa.dominio;
      else if (match(info, "site", "website", "url") && fieldLooksCompany(info)) v = "https://" + ctx.empresa.dominio;
      else if (match(info, "responsavel", "responsável", "representante", "representante legal")) v = ctx.empresa.responsavel;
      else if (pickCargoForField(info, ctx)) v = pickCargoForField(info, ctx);
      else if (match(info, "empresa", "company", "organizacao", "organization") && match(info, "nome", "name")) v = ctx.empresa.nomeFantasia;
      else if (match(info, "firstname", "first name", "primeiro", "given", "given name", "nome_proprio", "nome proprio")) v = ctx.pessoa.primeiroNome;
      else if (match(info, "lastname", "last name", "surname", "sobrenome", "family", "family name")) v = ctx.pessoa.sobrenome;
      else if (match(info, "fullname", "full name", "nome_completo", "full_name", "nome completo")) v = fieldLooksPersonOwner(info) || ctx.form.principal !== "empresa" ? ctx.pessoa.nome : ctx.empresa.nomeFantasia;
      else if (match(info, "nome", "name") && !match(info, "user", "login", "username")) v = fieldLooksCompany(info) && !fieldLooksPersonOwner(info) ? ctx.empresa.nomeFantasia : ctx.pessoa.nome;
      else if (match(info, "username", "usuario", "login") && !match(info, "email")) v = ctx.pessoa.email.split("@")[0];
      else if (match(info, "email", "e-mail", "mail")) {
        v = pickEmailForField(info, ctx);
        fieldKey = v === ctx.empresa.email ? "email_empresa" : "email";
      }
      else if (match(info, "fone", "phone", "celular", "whatsapp", "telefone", "tel", "mobile")) {
        v = pickPhoneForField(info, ctx);
        fieldKey = v === ctx.empresa.telefone ? "telefone_empresa" : "telefone";
      }
      else if (match(info, "rg", "identidade")) v = String(randInt(10000000, 99999999));
      else if (match(info, "cep", "zipcode", "zip_code", "postal")) { v = ctx.cepVariants[0]; fieldKey = "cep"; }
      else if (match(info, "bairro", "district", "neighborhood")) v = end.bairro;
      else if (match(info, "numero", "número", "number") && match(info, "endereco", "endereço", "address", "logradouro", "rua", "street")) { v = numero; fieldKey = "numero"; }
      else if (match(info, "logradouro", "endereco", "endereço", "address", "rua", "street")) v = end.logradouro;
      else if (match(info, "cidade", "city", "municipio", "município")) v = end.cidade;
      else if (match(info, "complemento", "complement", "apto", "apt")) v = "Apto " + randInt(1, 200);
      else if (match(info, "numero", "número") && !match(info, "phone", "tel", "cpf", "cartao", "card")) { v = numero; fieldKey = "numero"; }
      else if (match(info, "estado", "state", "uf")) v = end.estado;
      else if (match(info, "pais", "país", "country")) {
        v = "Brasil";
      }
      else if (match(info, "nascimento", "birth", "dob", "data_nasc")) { v = ctx.pessoa.nascimentoVariants[0]; fieldKey = "data"; }
      else if (type === "password") v = "Teste@1234";
      else if (type === "checkbox") {
        if (match(info, "term", "aceit", "agree", "concord", "accept", "li ", "read ", "policy", "privacy")) {
          v = true;
        } else {
          v = Math.random() > 0.5;
        }
      }
      else if (type === "radio") {
        if (el.name) {
          if (!radiosPicked.has(el.name)) {
            const group = Array.from(document.querySelectorAll(`input[type="radio"][name="${CSS.escape(el.name)}"]`)).filter(isVisible);
            if (group.length > 0) {
              const picked = group[randInt(0, group.length - 1)];
              if (el === picked) { v = true; radiosPicked.add(el.name); } else { v = false; }
            } else { v = true; radiosPicked.add(el.name); }
          } else { v = false; }
        } else {
          v = Math.random() > 0.5;
        }
      }
      else if (el.tagName === "TEXTAREA" && match(info, "obs", "observ", "mensagem", "message", "descri", "nota", "comment"))
        v = "Dados de teste gerados automaticamente pelo MockFiller.";

      if (v !== null && v !== "") {
        dispatchEvents(el, v);
        filled++;
        if (fieldKey) filledFields.push({ el, fieldKey, variantIndex: 0 });
      }
    });

    // ─── RETRY: aguarda framework validar, depois tenta variantes ────────────
    if (filledFields.length > 0) {
      await sleep(320); // tempo para React/Vue/Angular rodar validação

      let retries = 0;
      const MAX_ROUNDS = 4;

      while (retries < MAX_ROUNDS) {
        const errored = filledFields.filter(function (f) {
          return isVisible(f.el) && fieldHasError(f.el);
        });
        if (errored.length === 0) break;

        let anyTried = false;
        errored.forEach(function (f) {
          const variants = variantMap[f.fieldKey];
          if (!variants) return;
          const nextIdx = f.variantIndex + 1;
          if (nextIdx >= variants.length) return; // esgotou variantes
          f.variantIndex = nextIdx;
          dispatchEvents(f.el, variants[nextIdx]);
          anyTried = true;
        });

        if (!anyTried) break; // nenhuma variante nova disponível
        await sleep(320);
        retries++;
      }
    }

    const source = end.fromApi
      ? "CEP real (" + end.cidade + "/" + end.estado + ")"
      : "CEP local (API indisponível)";
    return { filled: filled, source: source };
  }

  // ─── BOTÃO FLUTUANTE ──────────────────────────────────────────────────────

  async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return;
    }

    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.cssText = "position:fixed;left:-9999px;top:-9999px;opacity:0;";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
  }

  async function generateFloatingActionData(dataType) {
    const pessoa = gerarPessoaContext();
    const empresa = gerarEmpresaContext(pessoa);

    switch (dataType) {
      case "cpf": return { label: "CPF", value: pessoa.cpfVariants[0] };
      case "cnpj": return { label: "CNPJ", value: empresa.cnpjVariants[0] };
      case "nome": return { label: "Nome", value: pessoa.nome };
      case "empresa": return { label: "Empresa", value: empresa.nomeFantasia };
      case "endereco": {
        const endereco = await gerarEnderecoContext(true);
        return { label: "Endereço", value: formatAddressBlock(endereco, String(randInt(1, 999))) };
      }
      case "cartao": return { label: "Cartão", value: formatCardBlock(gerarPagamentoContext(pessoa)) };
      default: return null;
    }
  }

  async function fillFromFloatingPanel(button) {
    const original = button.textContent;
    button.textContent = "Preenchendo...";
    button.disabled = true;
    try {
      const r = await fillForms();
      showToast(r.filled > 0
        ? "Tá preenchido! " + r.filled + " campo" + (r.filled > 1 ? "s" : "") + "!\n" + r.source
        : "Nada compatível pra preencher aqui.");
    } finally {
      button.textContent = original;
      button.disabled = false;
    }
  }

  async function copyFloatingAction(dataType, button) {
    const original = button.textContent;
    button.textContent = "...";
    button.disabled = true;

    try {
      const data = await generateFloatingActionData(dataType);
      if (!data) {
        button.textContent = original;
        button.disabled = false;
        return;
      }
      await copyText(data.value);
      button.textContent = "Copiado";
      showToast(data.label + " copiado.", 1800);
      setTimeout(() => { button.textContent = original; button.disabled = false; }, 900);
    } catch (error) {
      showToast("Não foi possível copiar: " + error.message);
      button.textContent = original;
      button.disabled = false;
    }
  }

  function createFloatingPanel() {
    if (document.getElementById("__mockfiller_panel")) return;

    const panel = document.createElement("div");
    panel.id = "__mockfiller_panel";
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-modal", "false");
    panel.setAttribute("aria-label", "Painel de ações rápidas do Tá Preenchido");
    panel.tabIndex = -1;
    panel.style.cssText = [
      "position:fixed", "right:24px", "bottom:84px", "width:280px", "max-width:calc(100vw - 32px)",
      "display:none", "padding:14px", "border-radius:16px", "background:rgba(30,30,46,0.98)",
      "border:1px solid rgba(205,214,244,0.14)", "box-shadow:0 18px 50px rgba(0,0,0,0.35)",
      "z-index:2147483647", "font-family:system-ui,-apple-system,BlinkMacSystemFont,sans-serif",
      "color:#cdd6f4", "box-sizing:border-box",
    ].join(";");

    panel.innerHTML = [
      '<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:12px;">',
      '<div><div style="font-size:14px;font-weight:800;color:#cdd6f4;">Tá Preenchido</div>',
      '<div style="font-size:11px;color:#a6adc8;margin-top:2px;">Dados rápidos na página</div></div>',
      '<button id="__mockfiller_panel_close" aria-label="Fechar painel de ações rápidas" style="border:1px solid #313244;background:#181825;color:#cdd6f4;border-radius:8px;padding:6px 8px;cursor:pointer;font-size:11px;font-weight:700;line-height:1;">Fechar</button>',
      '</div>',
      '<button id="__mockfiller_fill_action" style="width:100%;border:0;background:#89b4fa;color:#11111b;border-radius:10px;padding:10px 12px;font-size:13px;font-weight:800;cursor:pointer;margin-bottom:12px;">Preencher formulário</button>',
      '<div style="font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:#6c7086;font-weight:800;margin-bottom:8px;">Copiar dado</div>',
      '<div id="__mockfiller_action_grid" style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;">',
      '<button data-mockfiller-copy="cpf">CPF</button>',
      '<button data-mockfiller-copy="cnpj">CNPJ</button>',
      '<button data-mockfiller-copy="nome">Nome</button>',
      '<button data-mockfiller-copy="empresa">Empresa</button>',
      '<button data-mockfiller-copy="endereco">Endereço</button>',
      '<button data-mockfiller-copy="cartao">Cartão</button>',
      '</div>',
    ].join("");

    panel.querySelectorAll("button[data-mockfiller-copy]").forEach((button) => {
      button.style.cssText = "border:1px solid #313244;background:#181825;color:#cdd6f4;border-radius:10px;padding:9px 8px;font-size:12px;font-weight:700;cursor:pointer;min-height:36px;";
      button.addEventListener("click", () => copyFloatingAction(button.dataset.mockfillerCopy, button));
    });

    panel.querySelector("#__mockfiller_fill_action").addEventListener("click", (event) => {
      fillFromFloatingPanel(event.currentTarget);
    });
    panel.querySelector("#__mockfiller_panel_close").addEventListener("click", () => closeFloatingPanel(true));
    panel.addEventListener("click", event => event.stopPropagation());

    document.body.appendChild(panel);
  }

  function isFloatingPanelOpen() {
    const panel = document.getElementById("__mockfiller_panel");
    return !!panel && panel.style.display !== "none";
  }

  function openFloatingPanel() {
    createFloatingPanel();
    const panel = document.getElementById("__mockfiller_panel");
    const btn = document.getElementById("__mockfiller_btn");
    if (!panel || !SETTINGS.floatVisible) return;
    panel.style.display = "block";
    panel.style.opacity = "1";
    panel.style.pointerEvents = "auto";
    if (btn) btn.setAttribute("aria-expanded", "true");
    const primaryAction = panel.querySelector("#__mockfiller_fill_action");
    if (primaryAction) primaryAction.focus({ preventScroll: true });
  }

  function closeFloatingPanel(restoreFocus) {
    const panel = document.getElementById("__mockfiller_panel");
    if (!panel) return;
    panel.style.display = "none";
    const btn = document.getElementById("__mockfiller_btn");
    if (btn) {
      btn.setAttribute("aria-expanded", "false");
      if (restoreFocus) btn.focus({ preventScroll: true });
    }
  }

  function toggleFloatingPanel() {
    if (isFloatingPanelOpen()) closeFloatingPanel();
    else openFloatingPanel();
  }

  function createFloatingButton() {
    if (document.getElementById("__mockfiller_btn")) return;
    createFloatingPanel();

    const btn = document.createElement("div");
    btn.id = "__mockfiller_btn";
    btn.innerHTML = "🧪";
    btn.title = "Tá Preenchido – Ações rápidas. Shift+clique preenche direto.";
    btn.setAttribute("role", "button");
    btn.setAttribute("aria-label", "Abrir painel de ações rápidas do Tá Preenchido");
    btn.setAttribute("aria-controls", "__mockfiller_panel");
    btn.setAttribute("aria-expanded", "false");
    btn.tabIndex = 0;
    btn.style.cssText = [
      "position:fixed", "bottom:24px", "right:24px", "width:48px", "height:48px",
      "background:#89b4fa",
      "color:#11111b", "font-size:22px", "border-radius:50%",
      "display:flex", "align-items:center", "justify-content:center",
      "cursor:pointer", "z-index:2147483647", "font-weight:bold",
      "box-shadow:0 4px 16px rgba(137,180,250,0.5)",
      "transition:transform 0.15s ease,box-shadow 0.15s ease,opacity 0.2s ease",
      "user-select:none",
    ].join(";");

    btn.addEventListener("mouseenter", () => { btn.style.transform = "scale(1.12)"; btn.style.boxShadow = "0 6px 24px rgba(137,180,250,0.7)"; });
    btn.addEventListener("mouseleave", () => { btn.style.transform = "scale(1)"; btn.style.boxShadow = "0 4px 16px rgba(137,180,250,0.5)"; });
    btn.addEventListener("click", async (event) => {
      event.stopPropagation();
      if (event.shiftKey) {
        btn.innerHTML = "…"; btn.style.pointerEvents = "none";
        try {
          const r = await fillForms();
          showToast(r.filled > 0
            ? "Tá preenchido! " + r.filled + " campo" + (r.filled > 1 ? "s" : "") + "!\n" + r.source
            : "Nada compatível pra preencher aqui.");
        } finally {
          btn.innerHTML = "🧪"; btn.style.pointerEvents = "auto";
        }
        return;
      }

      toggleFloatingPanel();
    });
    btn.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggleFloatingPanel();
      }
    });

    document.body.appendChild(btn);
    applyFloatVisibility();
  }

  function applyFloatVisibility() {
    const btn = document.getElementById("__mockfiller_btn");
    const panel = document.getElementById("__mockfiller_panel");
    if (btn) {
      btn.style.display = SETTINGS.floatVisible ? "flex" : "none";
      btn.style.opacity = SETTINGS.floatVisible ? "1" : "0";
      btn.style.transform = SETTINGS.floatVisible ? "scale(1)" : "scale(0.8) translateY(10px)";
      btn.style.pointerEvents = SETTINGS.floatVisible ? "auto" : "none";
      btn.setAttribute("aria-hidden", SETTINGS.floatVisible ? "false" : "true");
      btn.tabIndex = SETTINGS.floatVisible ? 0 : -1;
    }
    if (panel && !SETTINGS.floatVisible) closeFloatingPanel();
  }

  // ─── TOAST ────────────────────────────────────────────────────────────────

  function showToast(msg, duration) {
    if (duration === undefined) duration = 3200;
    const old = document.getElementById("__mockfiller_toast");
    if (old) old.remove();
    const t = document.createElement("div");
    t.id = "__mockfiller_toast";
    t.innerHTML = msg.replace(/\n/g, "<br>");
    t.style.cssText = [
      "position:fixed", "bottom:" + (isFloatingPanelOpen() ? "384px" : "84px"), "right:24px",
      "background:#1e1e2e", "color:#cdd6f4",
      "padding:10px 18px", "border-radius:10px",
      "font-family:system-ui,sans-serif", "font-size:13px", "font-weight:500",
      "line-height:1.6", "z-index:2147483647",
      "box-shadow:0 4px 20px rgba(0,0,0,0.3)",
      "opacity:1", "transition:opacity 0.4s ease",
    ].join(";");
    document.body.appendChild(t);
    if (duration > 0) {
      setTimeout(() => { t.style.opacity = "0"; }, duration);
      setTimeout(() => t.remove(), duration + 500);
    }
  }

  // ─── API PÚBLICA ──────────────────────────────────────────────────────────

  window.__mockFillerFill = async function (returnResult) {
    try {
      const r = await fillForms();
      if (returnResult) return r;
      showToast(r.filled > 0
        ? "Tá preenchido! " + r.filled + " campo" + (r.filled > 1 ? "s" : "") + "!\n" + r.source
        : "Nada compatível pra preencher aqui.");
    } catch (e) {
      if (returnResult) return { filled: -1, source: "" };
      showToast("Erro: " + e.message);
    }
  };

  window.__mockFillerSetFloat = function (visible) {
    SETTINGS.floatVisible = visible;
    applyFloatVisibility();
  };

  window.__mockFillerSetShortcut = function (shortcut) {
    SETTINGS.shortcut = shortcut;
  };

  async function generateContextMenuValue(dataType) {
    const pessoa = gerarPessoaContext();
    const empresa = gerarEmpresaContext(pessoa);

    switch (dataType) {
      case "nome":
        return pessoa.nome;
      case "email":
        return pessoa.email;
      case "telefone":
        return pessoa.telefone;
      case "cpf":
        return pessoa.cpfVariants[0];
      case "cnpj":
        return empresa.cnpjVariants[0];
      case "cep": {
        const endereco = await gerarEnderecoContext(true);
        return gerarCEPVariants(endereco.cep)[0];
      }
      case "empresa":
        return empresa.nomeFantasia;
      case "cartao":
        return gerarPagamentoContext(pessoa).numero[0];
      default:
        return null;
    }
  }

  document.addEventListener("contextmenu", function (event) {
    const editable = getEditableFromEvent(event);
    if (isEditableElement(editable)) lastContextMenuEditable = editable;
  }, true);

  document.addEventListener("click", function (event) {
    const panel = document.getElementById("__mockfiller_panel");
    const btn = document.getElementById("__mockfiller_btn");
    if (!panel || !isFloatingPanelOpen()) return;
    if (panel.contains(event.target) || btn?.contains(event.target)) return;
    closeFloatingPanel(false);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closeFloatingPanel(true);
  });

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (!message || message.action !== "fillContextMenuField") return false;

    (async () => {
      const el = getCurrentEditable();
      if (!el) {
        showToast("Escolha um campo editável primeiro.");
        sendResponse({ ok: false, error: "NO_EDITABLE_FIELD" });
        return;
      }

      const value = await generateContextMenuValue(message.dataType);
      if (!value) {
        sendResponse({ ok: false, error: "UNKNOWN_DATA_TYPE" });
        return;
      }

      fillSingleEditable(el, value);
      showToast("Tá preenchido!");
      sendResponse({ ok: true });
    })().catch((error) => {
      showToast("Erro: " + error.message);
      sendResponse({ ok: false, error: error.message });
    });

    return true;
  });

  // ─── ATALHO DE TECLADO ────────────────────────────────────────────────────

  document.addEventListener("keydown", function (e) {
    const s = SETTINGS.shortcut;
    const ctrlOk = s.ctrl ? (e.ctrlKey || e.metaKey) : (!e.ctrlKey && !e.metaKey);
    const altOk = s.alt ? e.altKey : !e.altKey;
    const shiftOk = s.shift ? e.shiftKey : !e.shiftKey;
    const keyOk = e.key.toUpperCase() === s.key.toUpperCase();
    if (ctrlOk && altOk && shiftOk && keyOk) {
      e.preventDefault();
      window.__mockFillerFill();
    }
  });

  // ─── INICIALIZAÇÃO ────────────────────────────────────────────────────────

  createFloatingButton();

  const observer = new MutationObserver(() => {
    if (!document.getElementById("__mockfiller_btn")) createFloatingButton();
  });
  observer.observe(document.body, { childList: true, subtree: false });

})();
