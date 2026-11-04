# NØUS Motion — Especificação técnica

**Versão:** 0.1.0 (protótipo)  
**Pacote planejado:** `@nous/motion`  
**Stack:** React, TypeScript, CSS e SVG  
**Status:** código inicial enviado ao GitHub; build, testes e publicação ainda não verificados.

## 1. Objetivo

Microbiblioteca reutilizável de motion design e microinterações para produtos NØUS (PØP9, Fast Bar, PØLE e futuros sistemas). Os clientes poderão escolher templates, personalizar cores, velocidade e identidade visual e aplicar animações na interface sem programar.

Prioridades: baixo peso, execução rápida no navegador, acessibilidade, isolamento entre clientes e baixo custo operacional. Nenhuma IA é necessária durante a reprodução.

## 2. Estado real do repositório

Arquivos iniciais:
- `src/loader.tsx`: componente `NousLoader`.
- `src/button.tsx`: componente `NousButton`.
- `src/transition.tsx`: componente `NousTransition`.
- `src/style.css`: estilos e keyframes.
- `src/index.ts`: exportações de componentes.
- `package.json` e `tsconfig.json`: configuração inicial.

**Importante:** o protótipo ainda não tem galeria, editor, persistência, testes automatizados, build empacotado pronto para publicação nem integração com Grok. Algumas variantes de botão compartilham o mesmo efeito; não são dez implementações visuais independentes. Os controles de estado e parâmetros ainda são limitados.

## 3. API atual (protótipo)

### NousLoader

```tsx
import { NousLoader } from "./src";

<NousLoader
  template="orbit"
  state="loading"
  primaryColor="#ff6b00"
  size={48}
  speed={1}
  label="Carregando"
/>;
```

**Templates declarados:** `orbit`, `pulse`, `dots`, `wave`, `progress`, `logo`.

**Estados declarados:** `idle`, `loading`, `progress`, `success`, `error`.

**Propriedades:** `template`, `state`, `primaryColor`, `size`, `speed`, `progress`, `logo`, `label`. `progress` deve receber porcentagem real de 0 a 100, e não progresso fictício.

### NousButton

```tsx
import { NousButton } from "./src";
<NousButton variant="glow" onClick={() => {}}>Confirmar</NousButton>;
```

Variantes declaradas: `pulse`, `ripple`, `glow`, `magnetic`, `scale`, `slide`, `success`, `loading`, `notification`, `alert`. Aceita propriedades nativas de `button`, além de `variant`, `color` e `loading`. Várias variantes ainda são aproximações visuais.

### NousTransition

```tsx
import { NousTransition } from "./src";
<NousTransition type="fade" duration={250}><p>Conteúdo</p></NousTransition>;
```

Tipos: `fade`, `slide`, `scale`, `collapse`. Atualmente anima a entrada do conteúdo montado; não implementa orquestração completa de saída/desmontagem.

## 4. Arquitetura-alvo

```text
@nous/motion
├── core/           # tipos, registry, tokens, validação de presets
├── loader/         # indicadores de carregamento
├── button/         # microinterações de botões
├── transition/     # transições de interface
├── editor/         # galeria, customizador, pré-visualização
├── storage/        # interface abstrata de persistência
└── ai/             # adaptador opcional futuro (não embarcado no runtime)
```

Cada componente deve poder ser importado isoladamente. O editor deve ser carregado sob demanda. React deve ser peer dependency. O build deverá oferecer exportações por subpath e tree-shaking, com CSS controlado explicitamente.

## 5. Personalização planejada

Um preset será um objeto JSON versionado, com identificador, componente, template e parâmetros validados. Exemplo de **formato proposto, ainda não implementado**:

```json
{
  "id": "bar-loader-primary",
  "version": 1,
  "component": "loader",
  "template": "orbit",
  "parameters": {
    "primaryColor": "#ff6b00",
    "size": 48,
    "speed": 1
  }
}
```

O editor deverá oferecer seleção de template, prévia em tempo real, cor, tamanho, velocidade e salvamento. Configurações de marca podem ser herdadas do tema da aplicação consumidora. Nunca executar código JavaScript fornecido por presets.

## 6. Persistência e multitenancy

O núcleo não deve depender do Supabase. Definir `MotionStorageAdapter` com operações de leitura e gravação de presets. O sistema hospedeiro será responsável por autenticação, autorização, tenant ID e isolamento de dados (incluindo RLS quando usar Supabase). Nenhum preset de um tenant deve ficar acessível a outro.

## 7. Desempenho

- Preferir CSS e SVG para efeitos simples.
- Animar prioritariamente `transform` e `opacity`.
- Evitar cálculos por frame em JavaScript quando CSS for suficiente.
- Não executar chamadas de IA durante animações.
- Carregar galeria/editor somente quando necessário.
- Respeitar `prefers-reduced-motion`.
- Medir tamanho gzip real do núcleo e o custo de cada importação.
- **Meta inicial, não resultado medido:** até 30 KB gzip para o núcleo mínimo, excluindo React e o editor.
- Não bloquear cliques, navegação nem ações críticas com animações decorativas.

## 8. Acessibilidade e segurança

Manter `button` nativo, foco visível, teclado e estado `disabled`. Usar rótulos apropriados em indicadores de carregamento; evitar anúncios repetitivos em leitores de tela. Estado de sucesso/erro não pode depender apenas da cor. Validar URLs de imagens, configurações e parâmetros antes de persistir ou renderizar. O editor não pode executar código arbitrário de usuários.

## 9. Integração futura com Grok

Fase opcional: o usuário envia um logotipo e descreve um movimento. Um serviço backend chama um modelo multimodal, obtém **parâmetros estruturados**, valida contra o esquema de presets e exibe uma prévia. Não enviar chaves de API ao navegador. Para movimentos complexos de objetos em logos rasterizadas, poderá ser necessária segmentação vetorial ou uma ferramenta de geração separada; análise de imagem por si só não garante animação fiel.

## 10. Roadmap e critérios de aceite

1. **Validar o protótipo:** instalar dependências, executar TypeScript, build e corrigir erros; registrar resultados.
2. **Completar componentes:** comportamentos realmente distintos para os templates; estados consistentes; testes unitários e de acessibilidade.
3. **Empacotar:** exports por subpath, CSS distribuível, tree-shaking e documentação de instalação.
4. **Galeria/editor:** listar templates, editar parâmetros, visualizar e gerar presets JSON.
5. **Persistência:** contrato de adapter, exemplo local e integração de exemplo com Supabase sem acoplamento.
6. **Qualidade:** testes, medição de bundle, responsividade, redução de movimento, verificação em mobile.
7. **Expansão:** drag-and-drop, logo motion, Rive/Lottie opcionais e Grok opcional.

**Critério para integração em produção:** build e testes passando, API estável, isolamento de tenants demonstrado, medição de desempenho e revisão de acessibilidade.

## 11. Instruções para Codex

Comece lendo este documento e o README. Inspecione o código real antes de alterar a arquitetura. Execute `npm install`, `npm run check` e `npm run build`; registre falhas. Não afirme que funcionalidades planejadas já existem. Implemente incrementalmente, com testes e commits pequenos. Não altere PØP9, Fast Bar ou PØLE sem autorização explícita.
