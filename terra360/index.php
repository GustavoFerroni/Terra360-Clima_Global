<!DOCTYPE html>
<html lang="pt-BR">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>TERRA 360 | Clima Global</title>

    <link rel="stylesheet" href="style.css">
</head>

<body>

    <!-- Cabeçalho com o nome do projeto. -->

    <header>
        <h2 class="logo">TERRA360<span>.</span></h2>
        <p>CLIMA GLOBAL</p>
    </header>

    <!-- Área principal: informações e pesquisa à esquerda, globo à direita. -->
    <main class="layout">

        <div class="coluna-texto">

            <!-- Apresentação e explicação rápida do Terra360. -->
            <section class="introducao">
                <p class="subtitulo">EXPLORE O NOSSO PLANETA</p>

                <h1>
                    O mundo em<br>
                    <span>tempo real.</span>
                </h1>

                <p class="descricao">
                    Pesquise um país ou clique nele no globo
                    para descobrir a temperatura atual da sua
                    localização de referência.
                </p>
            </section>

            <!-- Formulário de pesquisa e espaço onde o clima será exibido. -->
            <section class="consulta">

                <form id="formulario" autocomplete="off">

                    <label for="pais">Pesquisar país</label>

                    <div class="campo-pesquisa">

                        <input
                            type="text"
                            id="pais"
                            list="lista-paises"
                            placeholder="Ex.: Brasil"
                            required
                        >

                        <!-- O JavaScript preenche esta lista com os países disponíveis. -->
                        <datalist id="lista-paises"></datalist>

                        <button type="submit">
                            CONSULTAR
                        </button>

                    </div>

                </form>
                
                <div id="resultado" class="resultado">

                    <p class="mensagem-inicial">
                        A temperatura aparecerá aqui.
                    </p>

                </div>

            </section>

        </div>

        <!-- Globo interativo e seus controles de navegação. -->
        <section class="globo-area">

            <div id="globo"></div>

            <div class="globo-controles">
                <button type="button" id="btn-zoom-mais" title="Aproximar" aria-label="Aproximar">+</button>
                <button type="button" id="btn-zoom-menos" title="Afastar" aria-label="Afastar">−</button>
                <button type="button" id="btn-vista-geral" title="Vista geral do planeta" aria-label="Vista geral do planeta">⌖</button>
                <button type="button" id="btn-girar" title="Pausar rotação" aria-label="Pausar rotação" aria-pressed="true">❚❚</button>
            </div>

            <p class="globo-dica">
                Arraste para girar · role para dar zoom · clique em um país
            </p>

        </section>

    </main>

    <!-- Créditos e identificação do projeto. -->
    <footer>
        <p>TERRA360 © 2026</p>
        <p>DADOS METEOROLÓGICOS: OPEN-METEO</p>
        <p>DESENVOLVIDO POR: GUSTAVO FERRONI
    </footer>

    <!-- Carrega a biblioteca do globo. -->
    <script src="libs/globe.gl.min.js" defer></script>
    <script src="script.js" defer></script>

</body>

</html>
