# NØUS Motion — Especificação técnica

**Versão:** 0.1.0  
**Pacote:** `@nous/motion` (privado, ainda não publicado em registro)  
**Stack:** React (peer ≥ 18), TypeScript, CSS e SVG; build Vite em modo biblioteca  
**Status:** implementação 0.1 no `main` (PR #1). TypeScript, 67 testes e build passam localmente; CI configurado em `.github/workflows/ci.yml` (confirme o resultado na aba Actions). Não integrado a nenhum produto.

> Esta versão substitui a especificação do protótipo. Tudo marcado como **implementado** foi conferido no código do `main`; o que está em **planejado** ainda não existe.

## 1. Objetivo

Microbiblioteca reutilizável de motion design e microinterações para produtos NØUS (PØP9, Fast Bar, PØLE e futuros sistemas). Os clientes poderão escolher templates, personalizar cores, velocidade e identidade visual e aplicar animações na interface sem programar.

Prioridades: baixo peso, execução rápida no navegador, acessibilidade, isolamento entre clientes e baixo custo operacional. Nenhuma IA é necessária durante a reprodução.

## 2. Estado real do repositório

```text
src/
├── index.ts                 # núcleo + 3 componentes + hooks (sem o editor)
├── loader.ts  button.ts  transition.ts  editor.ts   # entradas por subpath
├── core/                    # types, tokens, accessibility, validate, registry,
│                            # presets, ai, memory-adapter
├── components/
│   ├── loader/              # NousLoader + loader.templates.ts + loader.css
│   ├── button/              # NousButton + button.templates.ts + button.css
│   └── transitions/         # NousTransition + transition.templates.ts + transition.css
├── editor/                  # MotionEditor, MotionGallery, MotionCustomizer, MotionPreview
├── hooks/                   # useReducedMotion, useMotionPreset
└── styles/variables.css
examples/react-demo/         # demo (pnpm demo)
tests/                       # 5 arquivos, 67 testes (Vitest + Testing Library, jsdom)
scripts/measure-size.mjs     # gzip por entrada
```

| Item | Estado |
|---|---|
| 3 componentes com todos os templates | **Implementado** (6 loader, 10 botão com efeitos distintos, 4 transição) |
| Exports por subpath + `.d.ts` + `style.css` | **Implementado** |
| Presets JSON validados | **Implementado** |
| `MotionStorageAdapter` + adaptador em memória | **Implementado** (interface; sem `localStorage` nem Supabase) |
| Galeria, customizador e preview | **Implementado** (entrada `@nous/motion/editor`) |
| Gancho de IA (`MotionSuggester`) | **Implementado só o contrato**; nenhum provedor |
| Salvar no navegador, pausa, importar/exportar JSON no editor | Planejado |
| Testes automatizados em navegador real | Planejado (hoje: verificação manual no Chromium a 375 px) |
| Publicação em registro npm | Planejado |

## 3. API atual

Instalação de estilo, uma vez no app: `import "@nous/motion/style.css";`

### NousLoader — `@nous/motion/loader`

```tsx
<NousLoader template="orbit" primaryColor="#FF6B00" size={48} speed={1.2} state="loading" />
```

- `template`: `orbit` · `pulse` · `dots` · `wave` · `progress` · `logo`
- `state`: `idle` (estático) · `loading` · `progress` · `success` · `error`
- Demais props: `primaryColor`, `secondaryColor`, `size` (px), `speed`, `duration` (s por ciclo, dividido por `speed`), `intensity`, `direction` (`normal`/`reverse`), `repeat` (0 = infinito), `logo` (URL https ou `data:image`), `label`, `progress`, `reducedMotion`, `className`.
- `progress` é **valor real** (0–100). Em `state="progress"` sem valor, a barra fica indeterminada e sem `aria-valuenow`; nada é simulado.
- Sucesso e erro usam ícone (✓/✕) **e** texto.

### NousButton — `@nous/motion/button`

```tsx
<NousButton template="ripple" variant="solid" primaryColor="#FF6B00" onClick={salvar}>Salvar</NousButton>
```

- `template` (efeito): `pulse` · `ripple` · `glow` · `magnetic` · `scale` · `slide` · `success` · `loading` · `notification` · `alert`
- `variant` (aparência): `solid` · `outline` · `ghost`
- Demais props: `primaryColor`, `secondaryColor`, `size` (`sm`/`md`/`lg`), `radius`, `speed`, `intensity`, `shadow`, `loading`, `state` (`idle`/`loading`/`success`/`error`), `badge`, `reducedMotion` + todas as props nativas de `<button>`.
- `<button>` nativo, `type="button"` por padrão. Em `loading`: `aria-busy`, clique ignorado, **foco mantido** (não usa `disabled`). `disabled` nativo continua funcionando.
- Efeitos de hover só com `(hover: hover) and (pointer: fine)`.

### NousTransition — `@nous/motion/transition`

```tsx
<NousTransition show={aberto} template="slide" direction="up" duration={0.3}>…</NousTransition>
```

- `template`: `fade` · `slide` · `scale` · `collapse`
- Props: `show`, `duration` e `delay` (**segundos**), `direction`, `intensity`, `easing` (`linear`, `ease`, `ease-in`, `ease-out`, `ease-in-out`, `standard`), `unmountOnExit` (padrão `true`), `reducedMotion`, `className`.
- Entrada **e saída**; desmonta após `duration + delay`. `collapse` anima altura (única exceção à regra transform/opacity).

### Mudanças em relação ao protótipo

| Protótipo | 0.1 |
|---|---|
| `NousButton variant="ripple" color=…` | `template="ripple"` + `variant="solid"` + `primaryColor` |
| `NousButton loading` → `disabled` | `loading` → `aria-busy`, mantém foco |
| `NousTransition type duration={250}` (ms) | `template`, `show`, `duration={0.25}` (s) |
| `NousLoader state="idle"` não renderiza | renderiza estático |
| CSS importado pelo JS | `@nous/motion/style.css` explícito |

## 4. Arquitetura

- **Núcleo sem React** (`src/core`): tipos, esquemas de parâmetros (`*.templates.ts`), validação, registry, presets, contrato de IA e de armazenamento.
- **Componentes** importáveis isoladamente; cada entrada só puxa o necessário.
- **Editor** fora do núcleo: `import("@nous/motion/editor")` sob demanda.
- **CSS:** um `style.css` único (inclui o do editor). Separar por componente é evolução possível.

## 5. Presets

```json
{ "id": "bar-loader-primary", "version": 1, "component": "loader", "template": "orbit",
  "parameters": { "primaryColor": "#ff6b00", "size": 48, "speed": 1 } }
```

`validatePreset` / `parsePresetJson` (**implementado**) recusam: `version` ≠ 1, componente ou template inexistente, id fora de `[a-zA-Z0-9_.-]`, parâmetro desconhecido, cor fora de hex/`rgb()`/`hsl()`/`var(--x)`/nome, URL que não seja `https:`, caminho relativo ou `data:image`, números fora de faixa e enum inválido. O resultado é um objeto **novo**, só com campos conhecidos. `useMotionPreset` valida antes de aplicar. Nenhum preset executa código.

## 6. Persistência e multitenancy

`MotionStorageAdapter` (`list`, `get`, `save`, `remove`) é só a interface; `createMemoryAdapter()` serve para testes e demo, uma instância por escopo. O núcleo não depende do Supabase nem conhece tenant: o sistema hospedeiro implementa o adaptador com autenticação, autorização, tenant ID e RLS. Nenhum preset de um tenant deve ficar acessível a outro.

## 7. Desempenho

- CSS para efeitos; `transform`/`opacity` (exceto `collapse`). Sem rede durante animações.
- Meta: até 30 KB gzip para o núcleo mínimo, sem React e sem o editor. **Meta, não garantia.**
- Medição atual (`pnpm size`, soma dos arquivos que cada entrada carrega, gzip nível 9):

| Entrada | JS | CSS único |
|---|---|---|
| núcleo (`index`) | 8,10 KB | 2,45 KB |
| loader | 2,69 KB | 2,45 KB |
| button | 2,63 KB | 2,45 KB |
| transition | 1,73 KB | 2,45 KB |
| editor | 9,11 KB | 2,45 KB |

Esse método superestima o custo real, porque não aplica tree-shaking do consumidor. Medir com um app mínimo por subpath (esbuild + minificação) está no roadmap.

## 8. Acessibilidade e segurança

**Implementado:** `button` nativo, foco visível, teclado; `role="status"` / `role="progressbar"` nos loaders; sucesso/erro não dependem só de cor; `prefers-reduced-motion` respeitado (`reducedMotion="system|always|never"`), mantendo rótulos e valores; logos com `alt=""`; prévias da galeria inertes (`inert` + `aria-hidden`) para não aninhar botões.

**Ainda não verificado:** uso com leitor de tela real, Safari, Firefox e aparelhos físicos.

## 9. Integração futura com Grok

Fase opcional: o usuário envia um logotipo e descreve um movimento. Um serviço backend chama um modelo multimodal, obtém **parâmetros estruturados**, valida contra o esquema de presets e exibe uma prévia. Não enviar chaves de API ao navegador. O contrato já existe (`MotionSuggester` + `acceptSuggestion`, que passa pelo mesmo validador). Para movimentos complexos de objetos em logos rasterizadas, poderá ser necessária segmentação vetorial; análise de imagem por si só não garante animação fiel.

## 10. Roadmap e critérios de aceite

1. ~~Validar o protótipo~~ — substituído pela 0.1.
2. ~~Completar componentes~~ — feito (efeitos distintos, estados, testes).
3. ~~Empacotar~~ — feito (subpaths, `.d.ts`, `style.css`).
4. ~~Galeria/editor básicos~~ — feito.
5. **Editor:** salvar no navegador (`localStorage`, chave por escopo), pausar prévia, importar/exportar JSON.
6. **Qualidade:** testes em navegador real (Playwright) em 390, 768 e 1360 px; medição de tamanho por app mínimo; `npm pack --dry-run` no CI.
7. **Persistência:** exemplo de adaptador Supabase no app consumidor (fora deste pacote).
8. **Expansão:** drag-and-drop, logo motion, Rive/Lottie opcionais, Grok opcional.

**Critério para integração em produção:** CI verde, API estável, isolamento de tenants demonstrado no app consumidor, revisão de acessibilidade e teste em aparelho real.

## 11. Instruções para agentes (Codex, Claude Code)

- Parta do `main` atual (`pnpm install`, `pnpm typecheck`, `pnpm test`, `pnpm build`, `pnpm size`). **Não** recrie a biblioteca a partir do protótipo.
- Trabalho já feito fora do repositório deve ser trazido como PRs pequenos sobre o `main`, sem substituir a base.
- Não afirme que itens "Planejado" existem. Atualize a seção 2 quando algo mudar de estado.
- Testes e medições reais em cada PR; nunca simular progresso; presets nunca executam código.
- Não altere PØP9, Fast Bar ou PØLE sem autorização explícita.
