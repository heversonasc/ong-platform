// === Funções de Máscara ===
function aplicarMascaraCPF(cpf) {
  cpf.value = cpf.value
    .replace(/\D/g, "")              // Remove tudo que não for número
    .replace(/(\d{3})(\d)/, "$1.$2") // Coloca o primeiro ponto
    .replace(/(\d{3})(\d)/, "$1.$2") // Segundo ponto
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2"); // Traço
}

function aplicarMascaraTelefone(tel) {
  tel.value = tel.value
    .replace(/\D/g, "")
    .replace(/^(\d{2})(\d)/g, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2");
}

function aplicarMascaraCEP(cep) {
  cep.value = cep.value
    .replace(/\D/g, "")
    .replace(/^(\d{5})(\d)/, "$1-$2");
}

// === Função de Validação ===
function validarFormulario(event) {
  event.preventDefault(); // Evita o envio automático

  const nome = document.getElementById("nome");
  const email = document.getElementById("email");
  const cpf = document.getElementById("cpf");
  const telefone = document.getElementById("telefone");
  const cep = document.getElementById("cep");
  const mensagem = document.getElementById("mensagem");

  // Validação simples
  if (!nome.value.trim() || !email.value.trim() || !cpf.value.trim()) {
    alert("Por favor, preencha os campos obrigatórios: Nome, E-mail e CPF.");
    return false;
  }

  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regexEmail.test(email.value)) {
    alert("Por favor, insira um e-mail válido.");
    return false;
  }

  if (cpf.value.replace(/\D/g, "").length !== 11) {
    alert("O CPF deve conter 11 dígitos.");
    return false;
  }

  if (telefone.value && telefone.value.replace(/\D/g, "").length < 10) {
    alert("Telefone incompleto.");
    return false;
  }

  if (cep.value && cep.value.replace(/\D/g, "").length !== 8) {
    alert("CEP inválido.");
    return false;
  }

  // Se passou em todas as validações
  alert("Formulário enviado com sucesso! 🎉");
  document.getElementById("formCadastro").reset();
  return true;
}

// === Inicialização ===
document.addEventListener("DOMContentLoaded", function () {
  const cpf = document.getElementById("cpf");
  const telefone = document.getElementById("telefone");
  const cep = document.getElementById("cep");
  const form = document.getElementById("formCadastro");

  if (cpf) cpf.addEventListener("input", () => aplicarMascaraCPF(cpf));
  if (telefone) telefone.addEventListener("input", () => aplicarMascaraTelefone(telefone));
  if (cep) cep.addEventListener("input", () => aplicarMascaraCEP(cep));

  if (form) form.addEventListener("submit", validarFormulario);
});
