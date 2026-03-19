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

chrome.runtime.onInstalled.addListener(() => {
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
