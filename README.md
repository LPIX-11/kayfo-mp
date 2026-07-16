# Kayfo Play — Mini-Program POC

A proof-of-concept TCMPP mini-app that embeds **[kayfo.games](https://www.kayfo.games)**
H5 games as a mini-program, using **[Afro Kick Tournament](https://play.kayfo.games/Kayfo/20250913_afrokicktournament/)**
as the test title. Built on top of `../tcmpp-boilerplate`.

**Verdict: integration is easy and viable.** A Kayfo game drops straight into a
mini-program `web-view` with zero changes to the game build. The only real work
for a full production integration is bridging *rewarded ads* to the mini-app's
native ad SDK (see [The one seam](#the-one-seam-rewarded-ads)).

---

## What the POC does

| Page | Route | Role |
|------|-------|------|
| Home | `pages/index/index` | Branded Kayfo game portal; lists games from a catalog, "Play now" launches one. |
| Game | `pages/game/index` | Hosts the selected game in a full-screen `<web-view>` with a native nav bar (back button), error state, and message-bridge plumbing. |

Flow: **Home → tap "Play now" → `navigateTo(/pages/game/index?id=…)` → web-view loads the PlayCanvas build.**

Key files:
- `utils/games.js` — the game catalog + `buildGameUrl()` (add games here).
- `utils/config.js` — `KAYFO_PLAY_HOST` and the `KAYFO_WEBVIEW_DOMAINS` allow-list.
- `pages/game/index.js` — web-view host + `bindmessage` bridge seam (documented inline).

---

## Recon findings (why it's easy)

Pulled from the live game build at `play.kayfo.games/Kayfo/20250913_afrokicktournament/`:

1. **Engine:** PlayCanvas (WebGL) — `playcanvas-stable.min.js` + `__settings__.js` /
   `__start__.js` / `__loading__.js`. Fully self-contained, static-hosted on **Amazon S3**.
2. **Embeddable as-is:** the game sends **no `X-Frame-Options` and no CSP**, so it
   renders inside a `web-view` (or iframe) without modification.
3. **It already expects a native webview host.** The page probes
   `window.flutter_inappwebview.callHandler(fn, placementId)` to request a rewarded
   ad and exposes `window.rewardReceived(...)` / `window.rewardedAdFailed(...)` for
   the host to call back. Kayfo already ships these games inside native wrappers —
   a mini-program `web-view` is just another host.
4. **Ads today:** rewarded ads go through Google AdSense `adBreak` (`adsbygoogle.js`)
   *inside* the web-view. That works in the POC but bypasses the mini-app's own ad
   inventory/revenue.

---

## The one seam: rewarded ads

A mini-app **cannot inject JS into a web-view** (there is no `evaluateJavascript`
like Flutter's InAppWebView). Communication is limited to:

- **web-view → mini-app:** `wx.miniProgram.postMessage({ data })` → delivered to the
  page's `bindmessage` handler (`onMessage` in `pages/game/index.js`).
- **mini-app → web-view:** only by reloading `src` with query params (no live push).

So to route rewarded ads through the mini-app's native ad SDK, the **game build**
needs to include the mini-program JSSDK and replace the `flutter_inappwebview`
bridge with `wx.miniProgram.postMessage({ type: 'ad:reward-request', placementId })`.
The mini-app shows its native rewarded ad, then continues the game (e.g. by reloading
with a `?reward=<placementId>` param that the build reads on boot).

For this POC we leave the AdSense path in place and just **log** any incoming
messages — the plumbing (`onMessage`) is ready for the real handler.

---

## Run it

1. Install [TCMPP Developer Tools](https://cloud.tencent.com/product/tcmpp).
2. Open this `kayfoo/` folder as the project.
3. It compiles and renders automatically — tap **Play now** to launch the game.

> DevTools already runs with `project.config.json → setting.urlCheck: false`, so the
> web-view loads without domain configuration.

### Before a production build
Add every host the game touches to the mini-app's **business-domain allow-list**
(业务域名). The list is centralized in `utils/config.js → KAYFO_WEBVIEW_DOMAINS`:

- `https://play.kayfo.games`, `https://www.kayfo.games`
- `https://pagead2.googlesyndication.com`, `https://googleads.g.doubleclick.net`
  (only if you keep the in-web-view AdSense ads)

---

## Known constraints

- A `web-view` occupies the **entire page** — no native mini-app UI can overlay it.
  That's why the game page uses the **native** navigation bar (page-level
  `navigationStyle: "default"`) for a reliable back button, while the rest of the app
  uses the boilerplate's custom nav bar.
- The game requires network; there is no offline mode (assets stream from S3).
- `bindmessage` delivery timing is platform-dependent (WeChat flushes on
  navigate-back / share / destroy; TCMPP may differ) — fine for reward hand-offs,
  not for high-frequency telemetry.

---

*Built on the TCMPP Boilerplate — see `docs/` for the underlying framework
(EventBus, HTTP client, components, etc.).*
