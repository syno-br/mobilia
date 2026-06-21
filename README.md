# Mobil.IA — Landing Page

Mostre antes de vender. Landing page B2B para lojas de móveis e decoração.

## Estrutura

```
mobilia-projeto/
├── index.html          # marcação da página (todas as seções)
├── assets/
│   ├── styles.css      # todo o CSS (tokens da marca no topo, em :root)
│   ├── app.js          # todo o JavaScript (GSAP: hero, scroll, demo do catálogo, timeline)
│   ├── logo-color.png  # logo colorida (sobre fundo claro)
│   ├── logo-white.png  # logo branca (sobre fundo escuro)
│   ├── icon-blue.png   # ícone do sofá, azul
│   └── icon-white.png  # ícone do sofá, branco
└── README.md
```

## Como abrir

Abra `index.html` direto no navegador, ou rode um servidor local:

```bash
# Python
python3 -m http.server 8000
# depois acesse http://localhost:8000

# ou, no VS Code: extensão "Live Server" → botão "Go Live"
```

## Dependências externas (via CDN, precisam de internet)

- **Google Fonts**: Plus Jakarta Sans, Inter, JetBrains Mono
- **GSAP 3.12.5**: ScrollTrigger e MotionPathPlugin (cdnjs)
- **Imagens e vídeos (Higgsfield)**: fotos do ambiente, packshots, combinações do
  catálogo e o vídeo do hero estão hospedados no CDN do Higgsfield
  (`d8j0ntlcm91z4.cloudfront.net/...`). As URLs estão em `index.html` (fotos,
  preload, vídeo) e em `assets/app.js` (mapa `SIM_MAP` com as 15 combinações,
  e as imagens do hero/`data-sim`).

> Para deixar 100% offline: baixe esses arquivos do CDN para `assets/img/` e
> troque as URLs `https://d8j0ntlcm91z4.cloudfront.net/...` pelos caminhos locais.

## Onde mexer

- **Cores e fontes da marca**: `assets/styles.css`, bloco `:root` no topo
  (`--blue:#185FA5`, `--ink:#2C2C2A`, `--off:#F1EFE8`, etc.).
- **Textos**: direto no `index.html`.
- **Demo do catálogo (15 combinações)**: objeto `SIM_MAP` em `assets/app.js`.
- **Animações (hero, timeline, scan, antes/depois)**: `assets/app.js`.

## Notas

- Tudo em português do Brasil, sem travessões.
- Responsivo e com suporte a `prefers-reduced-motion`.
