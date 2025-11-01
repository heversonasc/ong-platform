// assets/js/main.js

// --- Módulo de Navegação e Menu Hambúrguer ---
const Navigation = (function() {
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('nav');
    const body = document.body;

    function init() {
        if (hamburger && nav) {
            hamburger.addEventListener('click', toggleMenu);
            document.addEventListener('click', closeMenuOnClickOutside);
            window.addEventListener('resize', handleResize);
        }
    }

    function toggleMenu() {
        const isExpanded = hamburger.getAttribute('aria-expanded') === 'true' || false;
        hamburger.setAttribute('aria-expanded', !isExpanded);
        nav.classList.toggle('open');
        body.classList.toggle('no-scroll', nav.classList.contains('open'));
    }

    function closeMenuOnClickOutside(event) {
        const isClickInsideNav = nav.contains(event.target);
        const isClickOnHamburger = hamburger.contains(event.target);
        const isNavOpen = nav.classList.contains('open');

        if (isNavOpen && !isClickInsideNav && !isClickOnHamburger) {
            nav.classList.remove('open');
            hamburger.setAttribute('aria-expanded', false);
            body.classList.remove('no-scroll');
        }
    }

    function handleResize() {
        if (window.innerWidth > 768 && nav.classList.contains('open')) {
            nav.classList.remove('open');
            hamburger.setAttribute('aria-expanded', false);
            body.classList.remove('no-scroll');
        }
    }

    return {
        init: init
    };
})();


// --- Módulo de Máscaras de Formulário ---
const FormMasks = (function() {
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
        aplicarMascaraCEP: aplicarMascaraCEP
    };
})();


// --- Módulo de Validação de Formulário ---
const FormValidation = (function() {

    function showError(input, message) {
        const errorSpan = document.getElementById(input.id + '-error');
        if (errorSpan) {
            errorSpan.textContent = message;
            errorSpan.style.display = 'block';
            input.classList.add('is-invalid');
            input.classList.remove('is-valid');
        }
    }

    function hideError(input) {
        const errorSpan = document.getElementById(input.id + '-error');
        if (errorSpan) {
            errorSpan.textContent = '';
            errorSpan.style.display = 'none';
            input.classList.remove('is-invalid');
            input.classList.add('is-valid');
        }
    }

    function validateInput(input) {
        if (!input) return true;
        const errorMessageSpan = document.getElementById(input.id + '-error');
        if (!errorMessageSpan) return true; // No error span, no validation needed via this system

        if (input.validity.valid) {
            hideError(input);
            return true;
        } else {
            let message = input.validationMessage;

            // Custom messages for specific input types/conditions
            if (input.id === 'telefone' && input.value.length > 0 && !input.validity.patternMismatch) {
                if (input.value.replace(/\D/g, "").length < 10) {
                    message = "Telefone incompleto. Ex: (XX) XXXXX-XXXX";
                }
            } else if (input.id === 'cpf' && input.value.length > 0 && !input.validity.patternMismatch) {
                if (input.value.replace(/\D/g, "").length < 11) {
                    message = "CPF incompleto. Ex: XXX.XXX.XXX-XX";
                }
            } else if (input.id === 'cep' && input.value.length > 0 && !input.validity.patternMismatch) {
                if (input.value.replace(/\D/g, "").length < 8) {
                    message = "CEP incompleto. Ex: XXXXX-XXX";
                }
            } else if (input.id === 'nascimento' && input.validity.rangeOverflow) {
                message = "Você deve ter 18 anos ou mais para se cadastrar.";
            } else if (input.id === 'perfil' && input.value === '') {
                message = "Por favor, selecione seu interesse.";
            } else if (input.validity.valueMissing) {
                message = "Este campo é obrigatório.";
            } else if (input.validity.typeMismatch && input.type === 'email') {
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

        // Apply masks
        if (cpfInput) cpfInput.addEventListener("input", () => FormMasks.aplicarMascaraCPF(cpfInput));
        if (telefoneInput) telefoneInput.addEventListener("input", () => FormMasks.aplicarMascaraTelefone(telefoneInput));
        if (cepInput) cepInput.addEventListener("input", () => FormMasks.aplicarMascaraCEP(cepInput));

        const inputsToValidate = [
            nomeInput, emailInput, telefoneInput, nascimentoInput, cpfInput,
            cepInput, enderecoInput, cidadeInput, estadoInput, perfilSelect
        ].filter(Boolean); // Filter out nulls if an element doesn't exist

        inputsToValidate.forEach(input => {
            input.addEventListener('blur', () => validateInput(input));
            input.addEventListener('input', () => {
                // Re-validate instantly if already marked as invalid
                if (input.classList.contains('is-invalid')) {
                    validateInput(input);
                }
            });
        });

        if (perfilSelect) {
            perfilSelect.addEventListener('change', () => validateInput(perfilSelect));
        }

        formCadastro.addEventListener("submit", function(event) {
            event.preventDefault();
            let formIsValid = true;

            inputsToValidate.forEach(input => {
                if (!validateInput(input)) {
                    formIsValid = false;
                }
            });

            if (formIsValid) {
                alert("Formulário enviado com sucesso! 🎉");
                formCadastro.reset();
                inputsToValidate.forEach(input => {
                    input.classList.remove('is-valid', 'is-invalid');
                    hideError(input);
                });
                document.body.classList.remove('no-scroll');
            } else {
                const firstInvalid = document.querySelector('.is-invalid');
                if (firstInvalid) {
                    firstInvalid.focus();
                }
                alert("Por favor, corrija os erros no formulário.");
            }
        });
    }

    return {
        setupForm: setupForm
    };
})();


// --- Módulo SPA (Single Page Application) e Templating ---
const SPA = (function() {
    const mainContentArea = document.querySelector('main.container'); // Onde o conteúdo das páginas será carregado
    const navLinks = document.querySelectorAll('nav .main-menu a');
    const headerElement = document.querySelector('header');
    const footerElement = document.querySelector('footer');

    // Mapeamento de rotas para URLs de arquivos HTML
    const routes = {
        '/': 'index.html',
        '/index.html': 'index.html',
        '/projetos.html': 'projetos.html',
        '/cadastro.html': 'cadastro.html'
    };

    // Função para carregar conteúdo via fetch e simular um template
    async function loadContent(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const html = await response.text();

            // Usamos DOMParser para extrair apenas a seção <main> da página carregada
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const newMain = doc.querySelector('main.container');

            if (newMain) {
                // Clear existing main content
                mainContentArea.innerHTML = '';
                // Append content from the loaded page's main section
                // We append children directly to preserve any event listeners that might be needed
                Array.from(newMain.children).forEach(child => {
                    mainContentArea.appendChild(child.cloneNode(true));
                });
                // Update the page title
                document.title = doc.querySelector('title').textContent;

                // Após carregar o conteúdo, é crucial reinicializar qualquer script associado
                // para garantir que as máscaras e validações funcionem no novo formulário.
                if (url.includes('cadastro.html')) {
                    FormValidation.setupForm("formCadastro");
                }
                // Scroll to top of the page
                window.scrollTo(0, 0);

                // Re-bind hero button if on index page
                if (url.includes('index.html')) {
                    const heroButton = mainContentArea.querySelector('.hero .btn-primary');
                    if (heroButton) {
                        heroButton.addEventListener('click', handleNavLinkClick);
                    }
                }
            } else {
                mainContentArea.innerHTML = '<div class="alert alert-error">Conteúdo não encontrado.</div>';
            }
        } catch (error) {
            console.error('Erro ao carregar o conteúdo da página:', error);
            mainContentArea.innerHTML = '<div class="alert alert-error">Erro ao carregar a página. Tente novamente.</div>';
        }
    }

    // Manipulador de clique para links de navegação
    function handleNavLinkClick(event) {
        event.preventDefault(); // Impede o comportamento padrão do link

        const targetUrl = event.target.getAttribute('href');
        const path = new URL(targetUrl, window.location.origin).pathname;

        // Verifica se a URL está nas rotas configuradas
        if (routes[path]) {
            // Atualiza a URL no navegador sem recarregar a página
            history.pushState({ path: path }, '', targetUrl);
            loadContent(targetUrl);
        } else if (event.target.tagName === 'A' && targetUrl.startsWith('http')) {
            // Permite links externos
            window.location.href = targetUrl;
        }
        // Fecha o menu hambúrguer se estiver aberto
        const nav = document.querySelector('nav');
        const hamburger = document.querySelector('.hamburger');
        if (nav.classList.contains('open')) {
            nav.classList.remove('open');
            hamburger.setAttribute('aria-expanded', false);
            document.body.classList.remove('no-scroll');
        }
    }

    // Inicializa o módulo SPA
    function init() {
        // Adiciona event listeners para os links de navegação
        navLinks.forEach(link => {
            link.addEventListener('click', handleNavLinkClick);
        });

        // Adiciona listener para o botão "Quero Participar!" na página inicial
        const heroButton = document.querySelector('.hero .btn-primary');
        if (heroButton) {
            heroButton.addEventListener('click', handleNavLinkClick);
        }

        // Carrega o conteúdo da página inicial quando a aplicação é carregada
        // ou a página é acessada diretamente via URL
        const initialPath = window.location.pathname;
        if (routes[initialPath]) {
            // O conteúdo já está no HTML inicial, então apenas reconfigura o form se for cadastro.html
            if (initialPath.includes('cadastro.html')) {
                FormValidation.setupForm("formCadastro");
            }
        } else {
            // Fallback para index.html se a rota inicial não for encontrada ou for '/'
            history.replaceState({ path: '/index.html' }, '', 'index.html');
        }

        // Gerencia a navegação do histórico do navegador (botões Voltar/Avançar)
        window.addEventListener('popstate', (event) => {
            if (event.state && event.state.path) {
                loadContent(routes[event.state.path]);
            } else {
                // Se não houver estado, provavelmente a página inicial
                loadContent(routes['/index.html']);
            }
        });
    }

    return {
        init: init
    };
})();


// --- Inicialização de todos os módulos quando o DOM estiver pronto ---
document.addEventListener("DOMContentLoaded", function() {
    Navigation.init();
    SPA.init();
    // O setup do formulário é chamado dentro do SPA.loadContent quando a página de cadastro é carregada.
    // Se a página de cadastro for a inicial, ele também será chamado.
    FormValidation.setupForm("formCadastro"); // Para garantir que funcione se cadastro.html for aberto diretamente
});