# Nayara Rosa — App & Site Oficial

Site e aplicativo oficial da cantora **Nayara Rosa** (mesmo código): streaming dark mode + Altar Virtual.

## Como funciona

| Modo | Como usar |
|------|-----------|
| **Site** | Abra no navegador (desktop ou celular) |
| **App (PWA)** | No celular: Instalar / Adicionar à tela inicial — abre em tela cheia como app |

## Desenvolvimento

```bash
npm install
npm run db:setup
npm run dev
```

- Site/app: http://localhost:5173  
- API: http://localhost:3001  

No desktop, o site mostra um painel lateral + preview do celular. No mobile (ou app instalado), ocupa a tela toda.

## Produção (site + API juntos)

```bash
npm run build
npm start
```

Abra http://localhost:3001 — o Express serve o site (PWA) e a API.

## Admin

Login: `admin@NayaraRosa`  
Agenda e Trajetória editáveis; usuários comuns só visualizam.

## Telas

| Rota | Tela |
|------|------|
| `/login` | Login |
| `/home` | Home + banners |
| `/agenda` | Calendário |
| `/altar` | Pedidos + Missões + Trajetória |
| `/player` | Músicas e vídeos |
| `/notifications` | Notificações |
| `/admin` | Dashboard |

## Design system

Ver [DESIGN.md](./DESIGN.md).
