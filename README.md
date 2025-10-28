# 🌳 Projeto ONG Esperança Viva
Um site institucional estático e responsivo para uma ONG fictícia, focado na apresentação de projetos e na captação de novos voluntários através de um formulário com validação.

<img width="1000" height="935" alt="Image" src="https://github.com/user-attachments/assets/4aa05fac-d3ca-4a99-a4ec-09125df4538d" />


# 💡 Sobre o Projeto
- O ONG Esperança Viva é um projeto front-end que simula o site institucional de uma organização não governamental. O objetivo foi criar uma interface amigável, acolhedora e responsiva que permita à organização divulgar suas causas e recrutar novos membros (voluntários ou apoiadores).

# O site é composto por três páginas principais:
- Início (index.html): A landing page com uma seção "hero" e destaque para os projetos recentes.
- Projetos (projetos.html): Uma galeria com todos os projetos ativos da ONG, utilizando um layout de cards.
- Cadastro (cadastro.html): A página mais importante para a captação, contendo um formulário completo para registro de novos interessados.

# ✨ Funcionalidades
- O projeto vai além de um simples site estático, implementando interatividade com JavaScript:
- Site Multi-página: Navegação clara entre Início, Projetos e Cadastro.
- Design Responsivo: Totalmente adaptável a desktops, tablets e celulares, utilizando Media Queries.
- Layout Moderno: Uso de CSS Grid e Flexbox para criar um layout fluido e alinhado, especialmente na seção de cards de projetos.

# Formulário de Cadastro Avançado (main.js):
- Máscaras de Entrada: Aplicação automática de máscaras para CPF, Telefone e CEP enquanto o usuário digita, melhorando a usabilidade.
- Validação de Campos: O formulário não é enviado sem que os campos obrigatórios (Nome, E-mail, CPF) estejam preenchidos.
- Validação de Formato: Verifica se o E-mail está em um formato válido e se CPF, Telefone e CEP têm a quantidade correta de dígitos.

# 🛠️ Tecnologias Utilizadas
- Este projeto foi construído utilizando as seguintes tecnologias:
- HTML5: Para a estrutura semântica do site.
- CSS3: Para estilização, utilizando conceitos como Flexbox, Grid Layout e Media Queries para responsividade.
- JavaScript (ES6+): Para a manipulação do DOM, criação das máscaras de input (com Regex) e validação do formulário.

# 🚀 Como Executar
- Por ser um projeto estático (HTML, CSS, JS puros), não há necessidade de instalação de dependências ou build.
- Clone este repositório:
- Navegue até a pasta do projeto:
- Abra o arquivo index.html no seu navegador preferido. (Você pode fazer isso clicando duas vezes no arquivo ou usando uma extensão como o Live Server no VS Code).

# 🎨 Design
O design foi pensado para transmitir confiança, serenidade e esperança. A paleta de cores principal, extraída do style.css, é:

- Cor Primária (Verde): #007b83
- Cor Secundária (Verde Escuro): #005b60 (Usado no header/footer)
- Cor de Fundo (Hero): #eaf7f7
- Cor de Destaque (Hover): #ffd700

Feito com ❤️ para praticar e demonstrar habilidades front-end.

