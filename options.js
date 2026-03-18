// options.js

let categories = [];

function parseCSV(str) {
  return str.split(",").map(s => s.trim()).filter(Boolean);
}

function loadCategories() {
  chrome.storage.local.get(["customCategories"], (data) => {
    categories = data.customCategories || [];
    renderList();
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
        <button class="btn" style="padding:6px 12px;" onclick="editCategory('${cat.id}')">Editar</button>
        <button class="btn btn-danger" style="padding:6px 12px;" onclick="deleteCategory('${cat.id}')">Excluir</button>
      </div>
    `;
    listEl.appendChild(el);
  });
}

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

window.editCategory = function(id) {
  const cat = categories.find(c => c.id === id);
  if (!cat) return;
  document.getElementById("catId").value = cat.id;
  document.getElementById("catName").value = cat.name;
  document.getElementById("catIdentifiers").value = cat.identifiers.join(", ");
  document.getElementById("catValues").value = cat.values.join(", ");
  document.getElementById("formTitle").textContent = "Editar Categoria";
  toggleForm(true);
};

window.deleteCategory = function(id) {
  if (confirm("Deseja realmente excluir esta categoria?")) {
    categories = categories.filter(c => c.id !== id);
    saveCategories();
  }
};

loadCategories();
