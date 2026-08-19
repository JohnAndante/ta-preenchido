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
    values: ["Ana", "Beatriz", "Carlos", "Eduardo", "Fernanda", "João", "Pedro", "Mariana", "Rafael", "Juliana", "Lucas"]
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
    values: ["Acme Corp", "TechNova", "Global Industries", "Initech", "Stark Industries", "Refinaria do Sul", "Olaria do José", "Medicamentos Camargo"]
  },
  {
    id: "default_cargo",
    name: "Cargo / Profissão",
    identifiers: ["role", "position", "title", "cargo", "profissao", "occupation"],
    values: ["Desenvolvedor Software", "Gerente de Projetos", "Analista de Dados", "Designer UI/UX", "Tech Lead", "Pedreiro", "Encanador", "Eletricista", "Pintor", "Carpinteiro", "Ajudante Geral"]
  },
  {
    id: "default_desc",
    name: "Descrição / Observação",
    identifiers: ["obs", "observ", "mensagem", "message", "descri", "nota", "comment"],
    values: ["Dados de teste gerados automaticamente.", "Mensagem de teste para validação de layout.", "Lorem ipsum dolor sit amet.", "Teste de preenchimento de formulário.", "O rato roeu a roupa do rei de roma."]
  }
];

const CONTEXT_MENU_ROOT_ID = "ta-preenchido-root";
const CONTEXT_MENU_ITEMS = [
  { id: "ta-preenchido-nome", title: "Nome", dataType: "nome" },
  { id: "ta-preenchido-email", title: "E-mail", dataType: "email" },
  { id: "ta-preenchido-telefone", title: "Telefone", dataType: "telefone" },
  { id: "ta-preenchido-cpf", title: "CPF", dataType: "cpf" },
  { id: "ta-preenchido-cnpj", title: "CNPJ", dataType: "cnpj" },
  { id: "ta-preenchido-cep", title: "CEP", dataType: "cep" },
  { id: "ta-preenchido-empresa", title: "Empresa", dataType: "empresa" },
  { id: "ta-preenchido-cartao", title: "Cartão", dataType: "cartao" }
];
const DEFAULT_CONTEXT_MENU_ACTIONS = CONTEXT_MENU_ITEMS.map(item => item.dataType);

function createContextMenus(enabledActions) {
  const activeActions = Array.isArray(enabledActions)
    ? enabledActions.filter(action => DEFAULT_CONTEXT_MENU_ACTIONS.includes(action))
    : DEFAULT_CONTEXT_MENU_ACTIONS;

  chrome.contextMenus.removeAll(() => {
    if (activeActions.length === 0) return;

    chrome.contextMenus.create({
      id: CONTEXT_MENU_ROOT_ID,
      title: "Tá Preenchido",
      contexts: ["editable"]
    });

    CONTEXT_MENU_ITEMS.filter(item => activeActions.includes(item.dataType)).forEach((item) => {
      chrome.contextMenus.create({
        id: item.id,
        parentId: CONTEXT_MENU_ROOT_ID,
        title: item.title,
        contexts: ["editable"]
      });
    });
  });
}

function refreshContextMenus() {
  chrome.storage.local.get(["contextMenuActions"], (data) => {
    createContextMenus(data.contextMenuActions);
  });
}

chrome.runtime.onInstalled.addListener(() => {
  refreshContextMenus();

  chrome.storage.local.get(["customCategories"], (data) => {
    if (!data.customCategories || data.customCategories.length === 0) {
      chrome.storage.local.set({ customCategories: DEFAULT_CATEGORIES });
    }
  });
});

chrome.commands.onCommand.addListener((command) => {
  if (command === "fill-mock-data") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          func: () => {
            if (window.__mockFillerFill) window.__mockFillerFill();
          }
        });
      }
    });
  }
});

chrome.runtime.onStartup.addListener(() => {
  refreshContextMenus();
});

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === "local" && changes.contextMenuActions) {
    createContextMenus(changes.contextMenuActions.newValue);
  }
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  const item = CONTEXT_MENU_ITEMS.find((entry) => entry.id === info.menuItemId);
  if (!item || !tab || !tab.id) return;

  const message = { action: "fillContextMenuField", dataType: item.dataType };
  const callback = () => {
    // Algumas páginas restritas não aceitam content scripts. Silencia o erro esperado.
    void chrome.runtime.lastError;
  };

  if (Number.isInteger(info.frameId)) {
    chrome.tabs.sendMessage(tab.id, message, { frameId: info.frameId }, callback);
  } else {
    chrome.tabs.sendMessage(tab.id, message, callback);
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "fillFromPopup") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          func: () => {
            if (window.__mockFillerFill) window.__mockFillerFill();
          }
        });
      }
    });
  }
});
