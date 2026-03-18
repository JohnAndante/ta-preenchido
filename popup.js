const DEFAULT_SHORTCUT = { ctrl: true, alt: false, shift: true, key: "F" };

// ─── Estado local ──────────────────────────────────────────────────────────
let currentShortcut = { ...DEFAULT_SHORTCUT };
let capturing = false;

// ─── Helpers ──────────────────────────────────────────────────────────────
function shortcutLabel(s) {
  const parts = [];
  if (s.ctrl)  parts.push("Ctrl");
  if (s.alt)   parts.push("Alt");
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
  document.getElementById("modCtrl").classList.toggle("active",  s.ctrl);
  document.getElementById("modAlt").classList.toggle("active",   s.alt);
  document.getElementById("modShift").classList.toggle("active", s.shift);
  document.getElementById("keyInput").value = s.key.toUpperCase();
  updatePreview("", shortcutLabel(s));
}

// ─── Carregar configurações ────────────────────────────────────────────────
chrome.storage.local.get(["floatVisible", "shortcut"], (data) => {
  // Toggle botão flutuante
  const visible = data.floatVisible !== false; // default true
  document.getElementById("toggleFloat").checked = visible;

  // Atalho
  if (data.shortcut) currentShortcut = data.shortcut;
  renderShortcut(currentShortcut);
});

// ─── Toggle botão flutuante ────────────────────────────────────────────────
document.getElementById("toggleFloat").addEventListener("change", async (e) => {
  const visible = e.target.checked;
  await chrome.storage.local.set({ floatVisible: visible });

  // Notifica a tab ativa
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (v) => { if (window.__mockFillerSetFloat) window.__mockFillerSetFloat(v); },
      args: [visible],
    });
  }
});

// ─── Modificadores ────────────────────────────────────────────────────────
["modCtrl", "modAlt", "modShift"].forEach((id) => {
  document.getElementById(id).addEventListener("click", () => {
    const key = id.replace("mod", "").toLowerCase(); // ctrl / alt / shift
    currentShortcut[key] = !currentShortcut[key];
    renderShortcut(currentShortcut);
  });
});

// ─── Captura de tecla ─────────────────────────────────────────────────────
const keyInput = document.getElementById("keyInput");

keyInput.addEventListener("click", () => {
  capturing = true;
  keyInput.classList.add("capturing");
  keyInput.value = "…";
  updatePreview("", "Pressione uma tecla...");
});

document.addEventListener("keydown", (e) => {
  if (!capturing) return;
  e.preventDefault();

  // Ignora teclas de modificador sozinhas
  if (["Control","Alt","Shift","Meta"].includes(e.key)) return;

  // Aceita letras A-Z e dígitos
  if (!/^[a-zA-Z0-9]$/.test(e.key)) {
    updatePreview(false, "Use apenas letras ou números");
    return;
  }

  capturing = false;
  keyInput.classList.remove("capturing");
  currentShortcut.key = e.key.toUpperCase();
  renderShortcut(currentShortcut);
});

// ─── Salvar atalho ────────────────────────────────────────────────────────
document.getElementById("saveShortcut").addEventListener("click", async () => {
  if (!currentShortcut.ctrl && !currentShortcut.alt && !currentShortcut.shift) {
    updatePreview(false, "Use ao menos um modificador (Ctrl / Alt / Shift)");
    return;
  }
  await chrome.storage.local.set({ shortcut: currentShortcut });

  // Propaga para a tab ativa
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (s) => { if (window.__mockFillerSetShortcut) window.__mockFillerSetShortcut(s); },
      args: [currentShortcut],
    });
  }
  updatePreview(true, "Salvo: " + shortcutLabel(currentShortcut));
});

// ─── Restaurar padrão ─────────────────────────────────────────────────────
document.getElementById("resetShortcut").addEventListener("click", async () => {
  currentShortcut = { ...DEFAULT_SHORTCUT };
  await chrome.storage.local.set({ shortcut: currentShortcut });

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (s) => { if (window.__mockFillerSetShortcut) window.__mockFillerSetShortcut(s); },
      args: [currentShortcut],
    });
  }
  renderShortcut(currentShortcut);
  updatePreview(true, "Restaurado para " + shortcutLabel(currentShortcut));
});

// ─── Preencher formulário ─────────────────────────────────────────────────
document.getElementById("fillBtn").addEventListener("click", async () => {
  const btn    = document.getElementById("fillBtn");
  const status = document.getElementById("status");

  btn.textContent = "Buscando o CEP...";
  btn.disabled = true;

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
      status.innerHTML = raw.filled > 0
        ? `<strong>${raw.filled} campo${raw.filled > 1 ? "s" : ""}</strong> preenchido${raw.filled > 1 ? "s" : ""}!<br><span style="font-size:11px;color:#6c7086">${raw.source.replace(/^[^\w]*/, "")}</span>`
        : "Nenhum campo compatível encontrado.";
    } else {
      status.innerHTML = "Recarregue a página e tente novamente.";
    }
  } catch (e) {
    status.innerHTML = "Não foi possível acessar a página atual.";
  }

  btn.textContent = "Preencher formulário";
  btn.disabled = false;
});

// ─── Options Page ──────────────────────────────────────────────────────────
document.getElementById("optionsBtn")?.addEventListener("click", () => {
  if (chrome.runtime.openOptionsPage) {
    chrome.runtime.openOptionsPage();
  } else {
    window.open(chrome.runtime.getURL("options.html"));
  }
});
