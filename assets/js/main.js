const Navigation = (function () {
  const hamburger = document.querySelector(".hamburger");
  const nav = document.querySelector("nav");
  const body = document.body;

  function init() {
    if (hamburger && nav) {
      hamburger.addEventListener("click", toggleMenu);
      document.addEventListener("click", closeMenuOnClickOutside);
      window.addEventListener("resize", handleResize);
    }
  }

  function toggleMenu() {
    const isExpanded = hamburger.getAttribute("aria-expanded") === "true" || false;
    hamburger.setAttribute("aria-expanded", !isExpanded);
    nav.classList.toggle("open");
    body.classList.toggle("no-scroll", nav.classList.contains("open"));
  }

  function closeMenuOnClickOutside(event) {
    const isClickInsideNav = nav.contains(event.target);
    const isClickOnHamburger = hamburger.contains(event.target);
    const themeSwitcher = document.getElementById("theme-toggle-btn");
    const isClickOnThemeSwitcher =
      themeSwitcher && themeSwitcher.contains(event.target);
    const isNavOpen = nav.classList.contains("open");

    if (
      isNavOpen &&
      !isClickInsideNav &&
      !isClickOnHamburger &&
      !isClickOnThemeSwitcher
    ) {
      nav.classList.remove("open");
      hamburger.setAttribute("aria-expanded", false);
      body.classList.remove("no-scroll");
    }
  }

  function handleResize() {
    if (window.innerWidth > 768 && nav.classList.contains("open")) {
      nav.classList.remove("open");
      hamburger.setAttribute("aria-expanded", false);
      body.classList.remove("no-scroll");
    }
  }

  return {
    init: init,
  };
})();

const FormMasks = (function () {
  function aplicarMascaraCPF(input) {
    input.value = input.value
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }

  function aplicarMascaraTelefone(input) {
    input.value = input.value
      .replace(/\D/g, "")
      .replace(/^(\d{2})(\d)/g, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2");
  }

  function aplicarMascaraCEP(input) {
    input.value = input.value
      .replace(/\D/g, "")
      .replace(/^(\d{5})(\d)/, "$1-$2");
  }

  return {
    aplicarMascaraCPF: aplicarMascaraCPF,
    aplicarMascaraTelefone: aplicarMascaraTelefone,
    aplicarMascaraCEP: aplicarMascaraCEP,
  };
})();

const FormValidation = (function () {
  function showError(input, message) {
    const errorSpan = document.getElementById(input.id + "-error");
    if (errorSpan) {
      errorSpan.textContent = message;
      errorSpan.style.display = "block";
      input.classList.add("is-invalid");
      input.classList.remove("is-valid");
    }
  }

  function hideError(input) {
    const errorSpan = document.getElementById(input.id + "-error");
    if (errorSpan) {
      errorSpan.textContent = "";
      errorSpan.style.display = "none";
      input.classList.remove("is-invalid");
      input.classList.add("is-valid");
    }
  }

  function validateInput(input) {
    if (!input) return true;
    const errorMessageSpan = document.getElementById(input.id + "-error");
    if (!errorMessageSpan) return true;

    if (input.validity.valid) {
      hideError(input);
      return true;
    } else {
      let message = input.validationMessage;

      if (
        input.id === "telefone" &&
        input.value.length > 0 &&
        !input.validity.patternMismatch
      ) {
        if (input.value.replace(/\D/g, "").length < 10) {
          message = "Telefone incompleto. Ex: (XX) XXXXX-XXXX";
        }
      } else if (
        input.id === "cpf" &&
        input.value.length > 0 &&
        !input.validity.patternMismatch
      ) {
        if (input.value.replace(/\D/g, "").length < 11) {
          message = "CPF incompleto. Ex: XXX.XXX.XXX-XX";
        }
      } else if (
        input.id === "cep" &&
        input.value.length > 0 &&
        !input.validity.patternMismatch
      ) {
        if (input.value.replace(/\D/g, "").length < 8) {
          message = "CEP incompleto. Ex: XXXXX-XXX";
        }
      } else if (input.id === "nascimento" && input.validity.rangeOverflow) {
        message = "Você deve ter 18 anos ou mais para se cadastrar.";
      } else if (input.id === "perfil" && input.value === "") {
        message = "Por favor, selecione seu interesse.";
      } else if (input.validity.valueMissing) {
        message = "Este campo é obrigatório.";
      } else if (input.validity.typeMismatch && input.type === "email") {
        message = "Por favor, insira um e-mail válido.";
      } else if (input.validity.tooShort) {
        message = `Mínimo de ${input.minLength} caracteres.`;
      }

      showError(input, message);
      return false;
    }
  }

  function setupForm(formId) {
    const formCadastro = document.getElementById(formId);
    if (!formCadastro) return;

    const nomeInput = document.getElementById("nome");
    const emailInput = document.getElementById("email");
    const telefoneInput = document.getElementById("telefone");
    const nascimentoInput = document.getElementById("nascimento");
    const cpfInput = document.getElementById("cpf");
    const cepInput = document.getElementById("cep");
    const enderecoInput = document.getElementById("endereco");
    const cidadeInput = document.getElementById("cidade");
    const estadoInput = document.getElementById("estado");
    const perfilSelect = document.getElementById("perfil");

    if (cpfInput)
      cpfInput.addEventListener("input", () =>
        FormMasks.aplicarMascaraCPF(cpfInput)
      );
    if (telefoneInput)
      telefoneInput.addEventListener("input", () =>
        FormMasks.aplicarMascaraTelefone(telefoneInput)
      );
    if (cepInput)
      cepInput.addEventListener("input", () =>
        FormMasks.aplicarMascaraCEP(cepInput)
      );

    const inputsToValidate = [
      nomeInput,
      emailInput,
      telefoneInput,
      nascimentoInput,
      cpfInput,
      cepInput,
      enderecoInput,
      cidadeInput,
      estadoInput,
      perfilSelect,
    ].filter(Boolean);

    inputsToValidate.forEach((input) => {
      input.addEventListener("blur", () => validateInput(input));
      input.addEventListener("input", () => {
        if (input.classList.contains("is-invalid")) {
          validateInput(input);
        }
      });
    });

    if (perfilSelect) {
      perfilSelect.addEventListener("change", () => validateInput(perfilSelect));
    }

    formCadastro.addEventListener("submit", function (event) {
      event.preventDefault();
      let formIsValid = true;

      inputsToValidate.forEach((input) => {
        if (!validateInput(input)) {
          formIsValid = false;
        }
      });

      if (formIsValid) {
        alert("Formulário enviado com sucesso! 🎉");
        formCadastro.reset();
        inputsToValidate.forEach((input) => {
          input.classList.remove("is-valid", "is-invalid");
          hideError(input);
        });
        document.body.classList.remove("no-scroll");
      } else {
        const firstInvalid = document.querySelector(".is-invalid");
        if (firstInvalid) {
          firstInvalid.focus();
        }
        alert("Por favor, corrija os erros no formulário.");
      }
    });
  }

  return {
    setupForm: setupForm,
  };
})();

const ThemeSwitcher = (function () {
  const themeToggleBtnId = "theme-toggle-btn";
  const body = document.body;
  const THEME_KEY = "websiteTheme";
  const THEMES = ["light", "dark"];
  let currentThemeIndex = 0;

  function init() {
    createThemeToggleButton();

    const savedTheme = localStorage.getItem(THEME_KEY);

    if (savedTheme && THEMES.includes(savedTheme)) {
      currentThemeIndex = THEMES.indexOf(savedTheme);
      applyTheme(savedTheme);
    } else {
      currentThemeIndex = 0;
      applyTheme(THEMES[currentThemeIndex]);
    }

    const themeToggleBtn = document.getElementById(themeToggleBtnId);
    if (themeToggleBtn) {
      themeToggleBtn.addEventListener("click", toggleTheme);
    }
  }

  function createThemeToggleButton() {
    const headerContent = document.querySelector(".header-content");
    if (!headerContent) {
      console.error(
        "Elemento .header-content não encontrado. O ThemeSwitcher não pode ser inicializado."
      );
      return;
    }

    let themeToggleBtn = document.getElementById(themeToggleBtnId);
    if (!themeToggleBtn) {
      themeToggleBtn = document.createElement("button");
      themeToggleBtn.id = themeToggleBtnId;
      themeToggleBtn.classList.add("theme-switcher");
      themeToggleBtn.setAttribute(
        "aria-label",
        "Alternar tema (claro, escuro)"
      );
      themeToggleBtn.setAttribute("aria-live", "polite");

      const logoGroup = headerContent.querySelector(".logo-group");
      const hamburger = headerContent.querySelector(".hamburger");

      if (hamburger) {
        headerContent.insertBefore(themeToggleBtn, hamburger);
      } else if (logoGroup) {
        headerContent.appendChild(themeToggleBtn);
      } else {
        headerContent.appendChild(themeToggleBtn);
      }
    }
  }

  function applyTheme(themeName) {
    body.classList.remove("theme-light", "theme-dark", "theme-high-contrast");

    if (themeName !== "light") {
      body.classList.add(`theme-${themeName}`);
    }
    localStorage.setItem(THEME_KEY, themeName);
    updateThemeToggleButton(themeName);
  }

  function toggleTheme() {
    currentThemeIndex = (currentThemeIndex + 1) % THEMES.length;
    const newTheme = THEMES[currentThemeIndex];
    applyTheme(newTheme);

    console.log(`Tema alterado para: ${getThemeLabel(newTheme)}`);
  }

  function updateThemeToggleButton(currentTheme) {
    const themeToggleBtn = document.getElementById(themeToggleBtnId);
    if (!themeToggleBtn) return;

    let iconSrc = "";
    let altText = "";
    let label = "";
    let filterStyle = "none";

    if (currentTheme === "light") {
      iconSrc = "assets/images/icon-light.svg";
      altText = "Ícone de Sol para Tema Claro";
      label = "Tema atual: Claro. Clique para alternar para Escuro.";
      filterStyle = "none";
    } else {
      iconSrc = "assets/images/icon-contrast.svg";
      altText = "Ícone de Tema Escuro";
      label = "Tema atual: Escuro. Clique para alternar para Claro.";
      filterStyle = "invert(1)";
    }

    themeToggleBtn.setAttribute("aria-label", label);

    let img = themeToggleBtn.querySelector("img");
    if (!img) {
      themeToggleBtn.innerHTML = `<img src="${iconSrc}" alt="${altText}" style="filter: ${filterStyle};">`;
    } else {
      if (img.getAttribute("src") !== iconSrc) {
        img.setAttribute("src", iconSrc);
      }
      img.setAttribute("alt", altText);
      img.style.filter = filterStyle;
    }
  }

  function getThemeLabel(theme) {
    switch (theme) {
      case "light":
        return "Claro";
      case "dark":
        return "Escuro";
      default:
        return "Desconhecido";
    }
  }

  return {
    init: init,
  };
})();

const SPA = (function () {
  const mainContentArea = document.querySelector("main.container");
  const navLinks = document.querySelectorAll("nav .main-menu a");

  const routes = {
    "/": "index.html",
    "/index.html": "index.html",
    "/projetos.html": "projetos.html",
    "/cadastro.html": "cadastro.html",
  };

  async function loadContent(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const html = await response.text();

      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const newMain = doc.querySelector("main.container");

      if (newMain) {
        mainContentArea.innerHTML = "";
        Array.from(newMain.children).forEach((child) => {
          mainContentArea.appendChild(child.cloneNode(true));
        });
        document.title = doc.querySelector("title").textContent;

        if (url.includes("cadastro.html")) {
          FormValidation.setupForm("formCadastro");
        }
        window.scrollTo(0, 0);

        if (url.includes("index.html")) {
          const heroButton = mainContentArea.querySelector(".hero .btn-primary");
          if (heroButton) {
            heroButton.addEventListener("click", handleNavLinkClick);
          }
        }
      } else {
        mainContentArea.innerHTML =
          '<div class="alert alert-error">Conteúdo não encontrado.</div>';
      }
    } catch (error) {
      console.error("Erro ao carregar o conteúdo da página:", error);
      mainContentArea.innerHTML =
        '<div class="alert alert-error">Erro ao carregar a página. Tente novamente.</div>';
    }
  }

  function handleNavLinkClick(event) {
    const targetUrl = event.currentTarget.getAttribute("href");
    const path = new URL(targetUrl, window.location.origin).pathname;

    if (routes[path]) {
      event.preventDefault();
      history.pushState({ path: path }, "", targetUrl);
      loadContent(targetUrl);
    } else if (
      event.currentTarget.tagName === "A" &&
      (targetUrl.startsWith("http") ||
        targetUrl.startsWith("mailto:") ||
        targetUrl.startsWith("tel:"))
    ) {
      return;
    }

    const nav = document.querySelector("nav");
    const hamburger = document.querySelector(".hamburger");
    if (nav.classList.contains("open")) {
      nav.classList.remove("open");
      hamburger.setAttribute("aria-expanded", false);
      document.body.classList.remove("no-scroll");
    }
  }

  function init() {
    navLinks.forEach((link) => {
      link.addEventListener("click", handleNavLinkClick);
    });

    const heroButton = document.querySelector(".hero .btn-primary");
    if (heroButton) {
      heroButton.addEventListener("click", handleNavLinkClick);
    }

    const initialPath = window.location.pathname.endsWith("/")
      ? "/"
      : window.location.pathname.substring(
          window.location.pathname.lastIndexOf("/")
        );

    if (routes[initialPath]) {
      if (initialPath.includes("cadastro.html")) {
        FormValidation.setupForm("formCadastro");
      }
    } else {
      history.replaceState({ path: "/index.html" }, "", "index.html");
      loadContent(routes["/index.html"]);
    }

    window.addEventListener("popstate", (event) => {
      if (event.state && event.state.path) {
        loadContent(routes[event.state.path]);
      } else {
        loadContent(routes[window.location.pathname] || routes["/index.html"]);
      }
    });
  }

  return {
    init: init,
  };
})();

document.addEventListener("DOMContentLoaded", function () {
  Navigation.init();
  SPA.init();
  ThemeSwitcher.init();

  if (window.location.pathname.includes("cadastro.html")) {
    FormValidation.setupForm("formCadastro");
  }
});