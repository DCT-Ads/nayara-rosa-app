# Design System — Nayara Rosa App Oficial

## Direção de arte
Inspirado no dark mode minimalista de apps de streaming (referência: Radio Ava): fundo quase preto, cards chumbo, radius 16–24px, chips pill, accent rosa→dourado, mini player com play circular em gradiente.

## Cores
| Token | Valor | Uso |
|-------|-------|-----|
| `--bg` | `#121212` | Fundo principal |
| `--bg-soft` | `#1A1A1A` | Superfícies secundárias |
| `--card` | `#1E1E1E` | Cards |
| `--card-elevated` | `#2A2A2A` | Cards elevados / hover |
| `--accent-pink` | `#E91E8C` | Accent início |
| `--accent-orange` | `#F5A623` | Accent fim |
| `--accent-gold` | `#D4A574` | Espiritualidade / Altar |
| `--text` | `#FFFFFF` | Títulos |
| `--text-secondary` | `#B8B8B8` | Legendas |
| `--text-muted` | `#7A7A7A` | Meta / hints |

**Gradiente de ação:** `linear-gradient(135deg, #E91E8C → #F06292 → #F5A623)`

## Tipografia
- **Display:** Syne (títulos bold)
- **Body:** DM Sans (UI, legendas leves)

## Radius
- sm 12 · md 16 · lg 20 · xl 24 · pill 999

## Componentes reutilizáveis
- `btn-primary` / `btn-ghost` / `btn-play` / `btn-icon`
- `card` / `card-media` (foto + overlay gradiente)
- `chip` (pills de filtro)
- `avatar` circular com borda
- `progress-track` / `progress-fill`
- `mini-player` + `bottom-nav` (4 abas)
- `calendar` mensal com indicadores
- `timeline` com scroll reveal (Altar → Trajetória)

## Navegação (4 abas)
Home · Agenda Geral · Altar Virtual · Player de Mídia

## Fluxo
Login → Home (banner + lançamentos + mini player)  
Agenda → detalhe do evento → alerta 24h / adicionar calendário  
Altar → Pedidos | Missões + Trajetória (reveal)  
Player → lista filtrada → player expandido  
Sininho → Central de notificações  
Login `*admin*` → Dashboard admin

## Fotos oficiais (mapa)
Ver `public/images/README.md` — substituir placeholders pelos arquivos enviados por Roberta.

## iOS / Android
Protótipo web mobile-first em frame 390×844. Safe areas via `env(safe-area-inset-*)`. Em produção nativa: manter tokens, tab bar nativa e push (24h pré-evento).
