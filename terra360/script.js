// Guarda referências aos elementos HTML usados pelo JavaScript.
const formulario = document.getElementById("formulario");
const campoPais = document.getElementById("pais");
const resultado = document.getElementById("resultado");
const listaPaises = document.getElementById("lista-paises");

const elGlobo = document.getElementById("globo");
const btnZoomMais = document.getElementById("btn-zoom-mais");
const btnZoomMenos = document.getElementById("btn-zoom-menos");
const btnVistaGeral = document.getElementById("btn-vista-geral");
const btnGirar = document.getElementById("btn-girar");

// Mensagem útil para confirmar no console que o arquivo foi carregado.
console.log("JavaScript do Terra360 carregado!");

// Nomes das capitais em português (as demais usam o nome do mapa)
// Capitais em português para mostrar uma cidade de referência em alguns países.
const CIDADES_PT = {
    BRA: "Brasília",
    PRT: "Lisboa",
    USA: "Washington",
    JPN: "Tóquio",
    FRA: "Paris",
    ARG: "Buenos Aires",
    ITA: "Roma",
    CAN: "Ottawa",
    DEU: "Berlim",
    AUS: "Canberra"
};

// Apelidos comuns na pesquisa
// Permite pesquisar usando abreviações ou nomes alternativos comuns.
const APELIDOS = {
    "eua": "USA",
    "estados unidos da america": "USA"
};

// Cores usadas para representar países normais, destacados e selecionados.
const COR_PADRAO = "rgba(255, 255, 255, 0.04)";
const COR_HOVER = "rgba(102, 184, 255, 0.45)";
const COR_SELECIONADO = "rgba(102, 184, 255, 0.75)";

// Variáveis que guardam o estado atual do globo e das consultas.
let globo = null;
let paises = [];
let indice = [];
let paisHover = null;
let paisSelecionado = null;
let contadorConsulta = 0;

// Remove acentos, símbolos e diferença entre maiúsculas/minúsculas
// Padroniza o texto para facilitar a comparação de nomes de países.
function normalizar(texto) {
    return String(texto)
        .toLocaleLowerCase("pt-BR")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, " ")
        .trim();
}

// Mantém um valor dentro de um intervalo permitido.
function limitar(valor, minimo, maximo) {
    return Math.min(maximo, Math.max(minimo, valor));
}

// Retorna a capital conhecida ou a cidade indicada nos dados do país.
function nomeCidade(propriedades) {
    if (CIDADES_PT[propriedades.id]) {
        return CIDADES_PT[propriedades.id];
    }

    if (propriedades.cidade) {
        return propriedades.cidade.replace(/\s+/g, " ").trim();
    }

    return null;
}

// Prepara os nomes dos países para que a pesquisa seja mais rápida.
function montarIndice() {
    indice = paises.map(function (pais) {
        const p = pais.properties;

        const chaves = [p.nome, p.nomeEn, p.nomeLongo].map(normalizar);

        return {
            pais: pais,
            chaves: Array.from(new Set(chaves))
        };
    });

    const nomesOrdenados = paises
        .map(function (pais) { return pais.properties.nome; })
        .sort(function (a, b) { return a.localeCompare(b, "pt-BR"); });

    listaPaises.innerHTML = "";

    nomesOrdenados.forEach(function (nome) {
        const opcao = document.createElement("option");
        opcao.value = nome;
        listaPaises.appendChild(opcao);
    });
}

// Procura um país pelo nome completo, começo do nome ou parte do nome.
function buscarPais(texto) {
    const consulta = normalizar(texto);

    if (!consulta) {
        return null;
    }

    // Apelidos (ex.: EUA)
    if (APELIDOS[consulta]) {
        const porId = paises.find(function (pais) {
            return pais.properties.id === APELIDOS[consulta];
        });

        if (porId) {
            return porId;
        }
    }

    // 1) Nome exato
    let achado = indice.find(function (item) {
        return item.chaves.includes(consulta);
    });

    // 2) Começa com o texto digitado
    if (!achado && consulta.length >= 3) {
        achado = indice.find(function (item) {
            return item.chaves.some(function (chave) {
                return chave.startsWith(consulta);
            });
        });
    }

    // 3) Contém o texto digitado
    if (!achado && consulta.length >= 4) {
        achado = indice.find(function (item) {
            return item.chaves.some(function (chave) {
                return chave.includes(consulta);
            });
        });
    }

    return achado ? achado.pais : null;
}

// Define a cor do país de acordo com sua seleção ou passagem do mouse.
function corDoPais(pais) {
    if (pais === paisSelecionado) return COR_SELECIONADO;
    if (pais === paisHover) return COR_HOVER;
    return COR_PADRAO;
}

// Dá mais destaque visual aos países selecionados ou apontados.
function alturaDoPais(pais) {
    if (pais === paisSelecionado) return 0.035;
    if (pais === paisHover) return 0.02;
    return 0.004;
}

// Atualiza as cores e alturas dos países desenhados no globo.
function atualizarEstilos() {
    if (!globo) return;

    // Funções novas a cada chamada, para o globo redesenhar os países
    globo
        .polygonCapColor(function (pais) { return corDoPais(pais); })
        .polygonAltitude(function (pais) { return alturaDoPais(pais); });
}

// Ajusta o tamanho do globo ao espaço disponível na página.
function ajustarTamanhoDoGlobo() {
    if (!globo) return;

    globo
        .width(elGlobo.clientWidth)
        .height(elGlobo.clientHeight);
}

// Liga ou desliga a rotação automática e atualiza o botão correspondente.
function definirRotacao(ativa) {
    if (!globo) return;

    globo.controls().autoRotate = ativa;

    btnGirar.textContent = ativa ? "❚❚" : "▶";
    btnGirar.title = ativa ? "Pausar rotação" : "Retomar rotação";
    btnGirar.setAttribute("aria-label", btnGirar.title);
    btnGirar.setAttribute("aria-pressed", String(ativa));
}

// Aproxima ou afasta a câmera sem ultrapassar os limites definidos.
function zoom(fator) {
    if (!globo) return;

    const visao = globo.pointOfView();

    globo.pointOfView({
        lat: visao.lat,
        lng: visao.lng,
        altitude: limitar(visao.altitude * fator, 0.08, 4)
    }, 500);
}

// Retorna a câmera para uma visão ampla do planeta.
function vistaGeral() {
    if (!globo) return;

    const visao = globo.pointOfView();

    paisSelecionado = null;
    atualizarEstilos();

    globo.pointOfView({
        lat: visao.lat,
        lng: visao.lng,
        altitude: 2.2
    }, 1200);

    definirRotacao(true);
}

// Cria o globo 3D, define sua aparência e configura as interações.
function iniciarGlobo() {
    globo = Globe()(elGlobo)
        .backgroundColor("rgba(0, 0, 0, 0)")
        .globeImageUrl("img/earth-blue-marble.jpg")
        .bumpImageUrl("img/earth-topology.png")
        .showAtmosphere(true)
        .atmosphereColor("#66b8ff")
        .atmosphereAltitude(0.2)
        .polygonSideColor(function () { return "rgba(102, 184, 255, 0.15)"; })
        .polygonStrokeColor(function () { return "rgba(255, 255, 255, 0.35)"; })
        .polygonsTransitionDuration(250)
        .polygonLabel(function (pais) {
            return '<div class="rotulo-globo">' + pais.properties.nome + "</div>";
        })
        .onPolygonHover(function (pais) {
            paisHover = pais || null;
            elGlobo.style.cursor = pais ? "pointer" : "";
            atualizarEstilos();
        })
        .onPolygonClick(function (pais) {
            if (pais) {
                selecionarPais(pais);
            }
        });

    ajustarTamanhoDoGlobo();

    // Posição inicial e rotação automática
    globo.pointOfView({ lat: -10, lng: -50, altitude: 2.2 });

    const controles = globo.controls();
    controles.autoRotateSpeed = 0.8;
    controles.enableZoom = true;
    definirRotacao(true);

    atualizarEstilos();

    if (typeof ResizeObserver !== "undefined") {
        new ResizeObserver(ajustarTamanhoDoGlobo).observe(elGlobo);
    } else {
        window.addEventListener("resize", ajustarTamanhoDoGlobo);
    }
}

// Seleciona um país, centraliza a visualização e consulta seu clima.
function selecionarPais(pais) {
    const p = pais.properties;

    paisSelecionado = pais;
    campoPais.value = p.nome;

    atualizarEstilos();

    // Para a rotação e aproxima o globo do país
    definirRotacao(false);

    globo.pointOfView({
        lat: p.lat,
        lng: p.lng,
        altitude: p.alt
    }, 1600);

    consultarClima(pais);

    // Em telas pequenas, leva o usuário até o resultado
    if (window.matchMedia("(max-width: 900px)").matches) {
        resultado.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
}

// Consulta o clima do país selecionado e mostra os dados recebidos.
async function consultarClima(pais) {
    const p = pais.properties;
    const cidade = nomeCidade(p);

    // Evita que uma resposta antiga sobrescreva uma consulta mais nova
    const numeroDaConsulta = ++contadorConsulta;

    resultado.innerHTML = `
        <h2>${p.nome}</h2>
        <p>Consultando os dados meteorológicos...</p>
    `;

    // Tenta buscar os dados meteorológicos no arquivo PHP.
    try {

        const parametros = new URLSearchParams({
            latitude: p.cLat,
            longitude: p.cLng
        });

        const resposta = await fetch(
            `consulta.php?${parametros.toString()}`
        );

        const dados = await resposta.json();

        if (numeroDaConsulta !== contadorConsulta) {
            return;
        }

        if (!resposta.ok || dados.erro) {
            throw new Error(
                dados.erro || "Erro ao consultar o clima."
            );
        }

        const referencia = cidade
            ? cidade
            : "ponto central do território";

        resultado.innerHTML = `
            <h2>${p.nome}</h2>

            <p>
                Localização de referência: ${referencia}
            </p>

            <p class="temperatura">
                ${dados.temperatura ?? "Indisponível"} °C
            </p>

            <p>
                Sensação térmica:
                ${dados.sensacao_termica ?? "Indisponível"} °C
            </p>

            <p>
                Umidade:
                ${dados.umidade ?? "Indisponível"}%
            </p>

            <p>
                Precipitação:
                ${dados.precipitacao ?? "Indisponível"} mm
            </p>

            <p>
                Horário dos dados:
                ${dados.horario ?? "Indisponível"}
            </p>

            <p>
                Fuso horário:
                ${dados.fuso_horario ?? "Indisponível"}
            </p>
        `;

        console.log("Dados meteorológicos recebidos:", dados);

    // Trata falhas de rede, da API ou da resposta do servidor.
    } catch (erro) {

        if (numeroDaConsulta !== contadorConsulta) {
            return;
        }

        console.error("Erro na consulta:", erro);

        resultado.innerHTML = `
            <h2>Erro na consulta</h2>
            <p>Não foi possível consultar o clima de ${p.nome}.</p>
            <p>${erro.message}</p>
            <p>Verifique se o Apache está funcionando no XAMPP.</p>
        `;
    }
}

// Confere se os elementos essenciais existem antes de registrar os eventos.
if (!formulario || !campoPais || !resultado || !elGlobo) {
    console.error(
        "Erro: não foi possível encontrar os elementos da página (formulário, campo de país, resultado ou globo)."
    );

    if (resultado) {
        resultado.textContent =
            "Erro ao carregar a página. Verifique os elementos HTML.";
    }
} else {

    // Executa a pesquisa quando o formulário é enviado.
    formulario.addEventListener("submit", function (evento) {

        // Impede que a página recarregue ao clicar no botão
        evento.preventDefault();

        console.log("Consulta iniciada!");

        if (paises.length === 0) {
            resultado.innerHTML = `
                <h2>Carregando mapa</h2>
                <p>Aguarde um instante e tente novamente.</p>
            `;

            return;
        }

        const pais = buscarPais(campoPais.value);

        if (!pais) {
            resultado.innerHTML = `
                <h2>País não encontrado</h2>
                <p>Confira o nome digitado ou escolha um país da lista
                que aparece ao digitar. Você também pode clicar
                diretamente no globo.</p>
            `;

            return;
        }

        selecionarPais(pais);
    });

    // Botões para aproximar, afastar, voltar à vista geral e pausar a rotação.
    btnZoomMais.addEventListener("click", function () { zoom(0.65); });
    btnZoomMenos.addEventListener("click", function () { zoom(1 / 0.65); });
    btnVistaGeral.addEventListener("click", vistaGeral);

    btnGirar.addEventListener("click", function () {
        if (!globo) return;

        definirRotacao(!globo.controls().autoRotate);
    });

    if (typeof Globe === "undefined") {
        console.error("Erro: a biblioteca do globo (libs/globe.gl.min.js) não foi carregada.");

        elGlobo.innerHTML =
            '<p class="globo-dica" style="top:50%;bottom:auto">Não foi possível carregar o globo 3D.</p>';
    } else {
        iniciarGlobo();

        // Carrega os dados geográficos usados para desenhar os países.
        fetch("data/paises.geojson")
            .then(function (resposta) {
                if (!resposta.ok) {
                    throw new Error("Mapa não encontrado (data/paises.geojson).");
                }

                return resposta.json();
            })
            .then(function (geojson) {
                paises = geojson.features;

                montarIndice();

                globo.polygonsData(paises);

                console.log("Países carregados:", paises.length);
            })
            .catch(function (erro) {
                console.error("Erro ao carregar o mapa:", erro);

                resultado.innerHTML = `
                    <h2>Erro ao carregar o mapa</h2>
                    <p>${erro.message}</p>
                    <p>Abra o site pelo endereço http://localhost/ e
                    confirme se a pasta <strong>data</strong> está junto
                    do index.php.</p>
                `;
            });
    }
}
