# 🌎 Terra360 — Globo Interativo e Clima Global

O **Terra360** é um projeto web que combina um globo terrestre interativo com informações meteorológicas em tempo real. A aplicação permite explorar o planeta, pesquisar países e consultar dados climáticos de uma localização de referência.

## 💡 Sobre o projeto

O desenvolvimento começou com a criação de um globo terrestre 3D interativo, com identificação e seleção de países. Enquanto trabalhava nessa funcionalidade, surgiu a ideia de expandir o projeto e torná-lo ainda mais útil.

A oportunidade veio a partir de um trabalho escolar que tinha como requisito desenvolver um site utilizando uma API. Em vez de começar um projeto totalmente novo, decidi aproveitar o Terra360 que já estava desenvolvendo e implementar uma API meteorológica, integrando a consulta do clima à experiência de exploração do globo.

Assim, o projeto evoluiu de um globo interativo para uma aplicação que une visualização geográfica e consulta de dados climáticos.

## ✨ Funcionalidades

- 🌍 **Globo terrestre 3D:** visualização interativa do planeta.
- 🔎 **Pesquisa de países:** busca por nome, com sugestões durante a digitação.
- 🖱️ **Seleção interativa:** clique em um país no globo para selecioná-lo e consultar o clima.
- 🌡️ **Informações meteorológicas:** temperatura atual, sensação térmica, umidade relativa do ar e precipitação.
- 🕒 **Informações de horário:** exibição do horário dos dados e do fuso horário correspondente.
- 🎮 **Controles do globo:** rotação automática, zoom e visualização geral.
- 📱 **Layout responsivo:** adaptação da interface para diferentes tamanhos de tela.

## 🛠️ Tecnologias utilizadas

- **HTML5:** estrutura da aplicação.
- **CSS3:** estilização, layout e responsividade.
- **JavaScript:** interatividade, pesquisa de países, manipulação do globo e comunicação com o servidor.
- **PHP:** processamento das coordenadas, consulta à API meteorológica e envio dos resultados ao navegador.
- **Globe.gl:** criação e interação com o globo terrestre 3D.
- **Open-Meteo API:** fornecimento dos dados meteorológicos.
- **GeoJSON:** dados geográficos utilizados para identificar e representar os países.

## ⚙️ Como o site funciona

1. O usuário pesquisa um país ou seleciona diretamente uma região no globo.
2. O JavaScript identifica o país selecionado e obtém as coordenadas da localização de referência.
3. Essas coordenadas são enviadas ao arquivo `consulta.php`.
4. O PHP valida a latitude e a longitude e realiza uma requisição à API Open-Meteo.
5. A resposta é processada e organizada em formato JSON.
6. O JavaScript recebe os dados e atualiza a interface com as informações meteorológicas.

O projeto também possui verificações para coordenadas inválidas, falhas na comunicação com a API e respostas inesperadas do servidor.

**Observação:** os dados meteorológicos são consultados para as coordenadas de referência associadas ao país selecionado, não representam necessariamente todas as regiões de seu território.

## 🚀 Como executar o projeto

### Pré-requisitos

- XAMPP com Apache e PHP.
- Navegador atualizado.
- Arquivos do projeto, incluindo as pastas de dados geográficos, imagens e bibliotecas.

### Instalação

1. Baixe ou clone este repositório.
2. Coloque a pasta do projeto no diretório `htdocs` do XAMPP.
3. Inicie o Apache pelo painel do XAMPP.
4. Confira se as pastas `data`, `img` e `libs` estão presentes e mantêm a estrutura esperada pelo código.
5. Abra o navegador e acesse `http://localhost/NOME-DA-PASTA/`, substituindo `NOME-DA-PASTA` pelo nome da pasta do projeto.

A aplicação utiliza a API pública Open-Meteo para consultar os dados meteorológicos. A consulta depende de uma conexão com a internet.

## 🎯 Objetivo e aprendizado

O Terra360 representa minha experiência prática com desenvolvimento web, integração entre tecnologias de front-end e back-end, consumo de APIs e manipulação de dados geográficos.

O projeto também surgiu da tentativa de aproveitar algo que eu já estava construindo para resolver um novo desafio escolar, ampliando suas funcionalidades em vez de desenvolver uma aplicação separada.

Continuo aprofundando meus conhecimentos em programação e buscando novas possibilidades para evoluir o projeto.

---

**Desenvolvido por Gustavo Ferroni**  
Projeto pessoal e acadêmico de desenvolvimento web.
