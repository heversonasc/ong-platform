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
        if (!errorMessageSpan) return true; 

        if (input.validity.valid) {
            hideError(input);
            return true;
        } else {
            let message = input.validationMessage;

            
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

        
        if (cpfInput) cpfInput.addEventListener("input", () => FormMasks.aplicarMascaraCPF(cpfInput));
        if (telefoneInput) telefoneInput.addEventListener("input", () => FormMasks.aplicarMascaraTelefone(telefoneInput));
        if (cepInput) cepInput.addEventListener("input", () => FormMasks.aplicarMascaraCEP(cepInput));

        const inputsToValidate = [
            nomeInput, emailInput, telefoneInput, nascimentoInput, cpfInput,
            cepInput, enderecoInput, cidadeInput, estadoInput, perfilSelect
        ].filter(Boolean); 

        inputsToValidate.forEach(input => {
            input.addEventListener('blur', () => validateInput(input));
            input.addEventListener('input', () => {
               
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



const SPA = (function() {
    const mainContentArea = document.querySelector('main.container'); 
    const navLinks = document.querySelectorAll('nav .main-menu a');
    const headerElement = document.querySelector('header');
    const footerElement = document.querySelector('footer');

  
    const routes = {
        '/': 'index.html',
        '/index.html': 'index.html',
        '/projetos.html': 'projetos.html',
        '/cadastro.html': 'cadastro.html'
    };

 
    async function loadContent(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const html = await response.text();


            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const newMain = doc.querySelector('main.container');

            if (newMain) {
                
                mainContentArea.innerHTML = '';
                
                Array.from(newMain.children).forEach(child => {
                    mainContentArea.appendChild(child.cloneNode(true));
                });
                
                document.title = doc.querySelector('title').textContent;

                
                if (url.includes('cadastro.html')) {
                    FormValidation.setupForm("formCadastro");
                }
              
                window.scrollTo(0, 0);

                
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

    
    function handleNavLinkClick(event) {
        event.preventDefault(); 

        const targetUrl = event.target.getAttribute('href');
        const path = new URL(targetUrl, window.location.origin).pathname;

        
        if (routes[path]) {
            
            history.pushState({ path: path }, '', targetUrl);
            loadContent(targetUrl);
        } else if (event.target.tagName === 'A' && targetUrl.startsWith('http')) {
            
            window.location.href = targetUrl;
        }
        
        const nav = document.querySelector('nav');
        const hamburger = document.querySelector('.hamburger');
        if (nav.classList.contains('open')) {
            nav.classList.remove('open');
            hamburger.setAttribute('aria-expanded', false);
            document.body.classList.remove('no-scroll');
        }
    }


    function init() {

        navLinks.forEach(link => {
            link.addEventListener('click', handleNavLinkClick);
        });

       
        const heroButton = document.querySelector('.hero .btn-primary');
        if (heroButton) {
            heroButton.addEventListener('click', handleNavLinkClick);
        }

 
        const initialPath = window.location.pathname;
        if (routes[initialPath]) {
            
            if (initialPath.includes('cadastro.html')) {
                FormValidation.setupForm("formCadastro");
            }
        } else {
            
            history.replaceState({ path: '/index.html' }, '', 'index.html');
        }

        
        window.addEventListener('popstate', (event) => {
            if (event.state && event.state.path) {
                loadContent(routes[event.state.path]);
            } else {
               
                loadContent(routes['/index.html']);
            }
        });
    }

    return {
        init: init
    };
})();


document.addEventListener("DOMContentLoaded", function() {
    Navigation.init();
    SPA.init();
  
    FormValidation.setupForm("formCadastro"); 
});