# bar-calendar

Christmas cocktail advent calendar ("Wilkes Family Advent Calendar"). Static React 18 + Vite 5 SPA, no backend.

## Commands (pnpm)
- `pnpm dev` — local dev server
- `pnpm build` — outputs static site to `dist/` (built with `--base=./`, so it works from any subpath)
- `pnpm preview` — serve the built `dist/`

## Deploy
Manual (no CI). Live at https://bw.codexwilkes.com/advent/, served by lighttpd on the internal web server `10.0.1.6`, reached through the gateway `pi.codexwilkes.com`.
`pnpm run deploy` runs `scripts/deploy.sh`, which builds and then does `scp -o ProxyJump=pi.codexwilkes.com -r dist/* brennan@10.0.1.6:/data/www/bw.codexwilkes.com/advent/`. Use `pnpm run deploy`, not `pnpm deploy`, which is a built-in pnpm command. The script only runs when the hostname is `haleiwa`, the only machine with SSH access.
- Gateway SSH details are in `~/.ssh/config` (`pi.codexwilkes.com`, port 22222, key `id_ed25519_shared`).
- scp never deletes old hashed files from `advent/assets/`, so earlier builds' bundles pile up there. They're harmless.
- Don't run a deploy unless asked.

## Layout
- `src/recipes.js` — the 24 drinks: `{sort, name, id (YouTube video id), ingredients: [{n, oz, annotation?}]}`. Sorted by `sort` = calendar day. `oz: 0` means "to taste / garnish".
- `src/App.jsx` — grid of tiles, recipe popup (native `<dialog>` + react-player v3), aggregated shopping list of total oz per ingredient.
- `src/confetti.*`, `src/curtain.*` — effects.
- `christmas-bar-calendar.txt` — source notes: candidate drinks + YouTube links, grouped by channel.

## Gotchas
- Unlock logic uses the visitor's local date: tiles open only in December (`getMonth() === 11`). Day N is already open on day N+1, and today's tile opens on click (fires confetti). To test outside December, use the commented `// const isOpen = true;` line in `App.jsx`.
- The `rand` array in `App.jsx` sets per-tile styling (`b0`/`b1`) and has 24 entries, one per day.
- Fresh-produce ingredients get "(Dec X, Y)" date hints from a hard-coded regex in `App.jsx`. Update that regex when adding a new produce item.
- Year "2024" is hard-coded in the title text.
