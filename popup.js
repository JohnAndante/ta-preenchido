// ─── Carregar configurações ────────────────────────────────────────────────
chrome.storage.local.get(["floatVisible"], (data) => {
  // Toggle botão flutuante
  const visible = data.floatVisible !== false; // default true
  const toggleFloat = document.getElementById("toggleFloat");
  if(toggleFloat) toggleFloat.checked = visible;
});

// ─── Toggle botão flutuante ────────────────────────────────────────────────
const toggleFloat = document.getElementById("toggleFloat");
if (toggleFloat) {
  toggleFloat.addEventListener("change", async (e) => {
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
}

// ─── Preencher formulário ─────────────────────────────────────────────────
const fillBtn = document.getElementById("fillBtn");
if (fillBtn) {
  fillBtn.addEventListener("click", async () => {
    const status = document.getElementById("status");

    fillBtn.textContent = "Buscando o CEP...";
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
        status.innerHTML = raw.filled > 0
          ? `<strong>${raw.filled} campo${raw.filled > 1 ? "s" : ""}</strong> preenchido${raw.filled > 1 ? "s" : ""}!<br><span style="font-size:11px;color:#6c7086">${raw.source.replace(/^[^\w]*/, "")}</span>`
          : "Nenhum campo compatível encontrado.";
      } else {
        status.innerHTML = "Recarregue a página e tente novamente.";
      }
    } catch (e) {
      status.innerHTML = "Não foi possível acessar a página atual.";
    }

    fillBtn.textContent = "Preencher formulário";
    fillBtn.disabled = false;
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

