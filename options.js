// options.js

const DEFAULT_CATEGORIES = [
  {
    id: "default_nome",
    name: "Nome Completo",
    identifiers: ["fullname", "nome_completo", "full_name", "nome completo", "name", "nome"],
    values: ["Ana Beatriz Silva", "Carlos Eduardo Santos", "Fernanda Lima", "João Pedro Oliveira", "Mariana Costa"]
  },
  {
    id: "default_primeiro_nome",
    name: "Primeiro Nome",
    identifiers: ["firstname", "primeiro", "given", "nome_proprio"],
    values: ["Ana", "Carlos", "Fernanda", "João", "Mariana", "Rafael", "Juliana", "Lucas"]
  },
  {
    id: "default_sobrenome",
    name: "Sobrenome",
    identifiers: ["lastname", "surname", "sobrenome", "family"],
    values: ["Silva", "Santos", "Oliveira", "Souza", "Rodrigues", "Ferreira", "Alves", "Pereira"]
  },
  {
    id: "default_empresa",
    name: "Empresa",
    identifiers: ["company", "empresa", "organizacao", "organization"],
    values: ["Acme Corp", "TechNova", "Global Industries", "Initech", "Stark Industries"]
  },
  {
    id: "default_cargo",
    name: "Cargo / Profissão",
    identifiers: ["role", "position", "title", "cargo", "profissao", "occupation"],
    values: ["Desenvolvedor Software", "Gerente de Projetos", "Analista de Dados", "Designer UI/UX", "Tech Lead"]
  },
  {
    id: "default_desc",
    name: "Descrição / Observação",
    identifiers: ["obs", "observ", "mensagem", "message", "descri", "nota", "comment"],
    values: ["Dados de teste gerados automaticamente.", "Mensagem de teste para validação de layout.", "Lorem ipsum dolor sit amet."]
  }
];

const DEFAULT_SHORTCUT = { ctrl: true, alt: false, shift: true, key: "F" };
let currentShortcut = { ...DEFAULT_SHORTCUT };
let capturing = false;

let categories = [];

function parseCSV(str) {
  return str.split(",").map(s => s.trim()).filter(Boolean);
}

// ─── LÓGICA DE ATALHOS ───────────────────────────────────────────
function shortcutLabel(s) {
  const parts = [];
  if (s.ctrl) parts.push("Ctrl");
  if (s.alt) parts.push("Alt");
  if (s.shift) parts.push("Shift");
  parts.push(s.key.toUpperCase());
  return parts.join(" + ");
}

function updatePreview(ok, msg) {
  const el = document.getElementById("shortcutPreview");
  el.textContent = msg;
  el.className = "shortcut-preview " + (ok === true ? "ok" : ok === false ? "err" : "");
}

function renderShortcut(s) {
  document.getElementById("modCtrl").classList.toggle("active", s.ctrl);
  document.getElementById("modAlt").classList.toggle("active", s.alt);
  document.getElementById("modShift").classList.toggle("active", s.shift);
  document.getElementById("keyInput").value = s.key.toUpperCase();
  updatePreview("", shortcutLabel(s));
}

["modCtrl", "modAlt", "modShift"].forEach((id) => {
  document.getElementById("modCtrl")?.parentElement?.parentElement?.addEventListener("click", (e) => {
    if(!e.target.classList.contains("mod-btn")) return;
    const key = e.target.id.replace("mod", "").toLowerCase();
    currentShortcut[key] = !currentShortcut[key];
    renderShortcut(currentShortcut);
  });
});

const keyInput = document.getElementById("keyInput");
if(keyInput) {
  keyInput.addEventListener("click", () => {
    capturing = true;
    keyInput.classList.add("capturing");
    keyInput.value = "…";
    updatePreview("", "Pressione uma tecla...");
  });

  document.addEventListener("keydown", (e) => {
    if (!capturing) return;
    e.preventDefault();
    if (["Control", "Alt", "Shift", "Meta"].includes(e.key)) return;
    if (!/^[a-zA-Z0-9]$/.test(e.key)) {
      updatePreview(false, "Use apenas letras ou números");
      return;
    }
    capturing = false;
    keyInput.classList.remove("capturing");
    currentShortcut.key = e.key.toUpperCase();
    renderShortcut(currentShortcut);
  });
}

const saveShortcutBtn = document.getElementById("saveShortcut");
if(saveShortcutBtn) {
  saveShortcutBtn.addEventListener("click", async () => {
    if (!currentShortcut.ctrl && !currentShortcut.alt && !currentShortcut.shift) {
      updatePreview(false, "Use ao menos um modificador (Ctrl / Alt / Shift)");
      return;
    }
    await chrome.storage.local.set({ shortcut: currentShortcut });
    updatePreview(true, "Salvo: " + shortcutLabel(currentShortcut));
  });

  document.getElementById("resetShortcut").addEventListener("click", async () => {
    currentShortcut = { ...DEFAULT_SHORTCUT };
    await chrome.storage.local.set({ shortcut: currentShortcut });
    renderShortcut(currentShortcut);
    updatePreview(true, "Restaurado para " + shortcutLabel(currentShortcut));
  });
}

function loadData() {
  chrome.storage.local.get(["customCategories", "shortcut"], (data) => {
    categories = data.customCategories || [];
    renderList();

    if (data.shortcut) currentShortcut = data.shortcut;
    if (document.getElementById("modCtrl")) {
      renderShortcut(currentShortcut);
    }
  });
}

function saveCategories() {
  chrome.storage.local.set({ customCategories: categories }, () => {
    renderList();
    toggleForm(false);
  });
}

function renderList() {
  const listEl = document.getElementById("categoryList");
  listEl.innerHTML = "";

  if (categories.length === 0) {
    listEl.innerHTML = '<p style="font-size:12px;color:#a6adc8;">Nenhuma categoria customizada criada.</p>';
    return;
  }

  categories.forEach((cat) => {
    const el = document.createElement("div");
    el.className = "category-item";
    el.innerHTML = `
      <div>
        <h3>${cat.name}</h3>
        <p>Gatilhos: ${cat.identifiers.join(", ")}</p>
      </div>
      <div style="display:flex;gap:8px;">
        <button class="btn edit-btn" style="padding:6px 12px;" data-id="${cat.id}">Editar</button>
        <button class="btn btn-danger delete-btn" style="padding:6px 12px;" data-id="${cat.id}">Excluir</button>
      </div>
    `;
    listEl.appendChild(el);
  });
}

document.getElementById("categoryList").addEventListener("click", (e) => {
  const editBtn = e.target.closest(".edit-btn");
  if (editBtn) editCategory(editBtn.dataset.id);

  const deleteBtn = e.target.closest(".delete-btn");
  if (deleteBtn) deleteCategory(deleteBtn.dataset.id);
});

function toggleForm(show) {
  document.getElementById("addCategoryForm").classList.toggle("active", show);
  document.getElementById("listSection").style.display = show ? "none" : "block";
  if (!show) clearForm();
}

function clearForm() {
  document.getElementById("catId").value = "";
  document.getElementById("catName").value = "";
  document.getElementById("catIdentifiers").value = "";
  document.getElementById("catValues").value = "";
  document.getElementById("formTitle").textContent = "Nova Categoria";
}

document.getElementById("showAddBtn").addEventListener("click", () => {
  toggleForm(true);
});

document.getElementById("restoreBtn").addEventListener("click", () => {
  if (confirm("Isso apagará todas as suas modificações atuais e voltará para as categorias iniciais da extensão! Deseja continuar?")) {
    categories = JSON.parse(JSON.stringify(DEFAULT_CATEGORIES));
    saveCategories();
  }
});

document.getElementById("cancelBtn").addEventListener("click", () => {
  toggleForm(false);
});

document.getElementById("saveBtn").addEventListener("click", () => {
  const idAttr = document.getElementById("catId").value;
  const name = document.getElementById("catName").value;
  const identifiers = parseCSV(document.getElementById("catIdentifiers").value);
  const values = parseCSV(document.getElementById("catValues").value);

  if (!name || identifiers.length === 0 || values.length === 0) {
    alert("Preencha todos os campos corretamente (use vírgulas para separar palavras).");
    return;
  }

  const cat = {
    id: idAttr || Date.now().toString(),
    name,
    identifiers,
    values
  };

  if (idAttr) {
    const idx = categories.findIndex(c => c.id === idAttr);
    if (idx !== -1) categories[idx] = cat;
  } else {
    categories.push(cat);
  }

  saveCategories();
});

function editCategory(id) {
  const cat = categories.find(c => c.id === id);
  if (!cat) return;
  document.getElementById("catId").value = cat.id;
  document.getElementById("catName").value = cat.name;
  document.getElementById("catIdentifiers").value = cat.identifiers.join(", ");
  document.getElementById("catValues").value = cat.values.join(", ");
  document.getElementById("formTitle").textContent = "Editar Categoria";
  toggleForm(true);
};

function deleteCategory(id) {
  if (confirm("Deseja realmente excluir esta categoria?")) {
    categories = categories.filter(c => c.id !== id);
    saveCategories();
  }
};

loadData();
