# eval: MyHomePage — 台帳方式

- 作成日: 2026-08-08（分業型移行・第9号と同時に台帳化）

| シナリオID | 種別 | 合格基準(機械的 pass/fail) | 直近の実測 |
|-----------|------|---------------------------|-----------|
| EV-001 | typical | `npm run build` が exit 0（新locationでビルド可能） | **pass（2026-09-11・ローカル 17/17 を 3 秒で完走）**。旧記載「環境変数不足で停滞」は誤診で、真因は essays パーサの無限ループ（`# ` 見出し行を消費できない。EV-003 参照）。Vercel 本番は 2026-08-07〜09-10 に 4 回連続失敗していた |
| EV-002 | typical | /dev-log スキル経由の日誌追加が新パスの content/ に着地する | 次回 /dev-log 実行時に確認 |
| EV-003 | known-failure | エッセイ本文に `# 見出し`（H1）や `####` がある | パーサが必ず 1 行進み、見出しとして描画する。`src/lib/__tests__/essay-markdown.test.ts`（4 件）が緑・`next build --debug-build-paths "app/essays/**"` が 150 秒以内に完走 | pass（2026-09-11。修正前はテスト赤・essays ビルドが 150 秒で打ち切り、修正後 3 秒） |
| EV-004 | typical | Markdown 記事（post 形式・`docs/specs/article-markdown-format.md`）が旧 JSON 記事と混在して読める。X/note URL・タグ・カバー・要約の既定値、同日複数記事、x-links.json による過去記事の X 補完、契約違反の検出 | `npx vitest run src/lib/__tests__/articles-markdown.test.ts` が exit 0（10 件） | pass（2026-10-24 新設。配信装置からの実書き込み 1 本を clone 上で読めることも同日確認） |
| EV-005 | known-failure | `.env.local` の `HP_ARTICLES_DIR` が存在しないパスを指している | 黙って 0 件にせず、設定ミスとしてビルドを止める | `npx vitest run src/lib/__tests__/articles-env.test.ts` が exit 0 | fail: 2026-10-24 実測（移設前の vault パスが残り、ローカルだけ記事 0 件・記事ページ全 404。Vercel には .env.local が無いので本番は無傷） |
| EV-006 | typical | 認知の土台: sitemap・robots・RSS・記事ごとの OGP 画像 | `npm run build` 後に `next start` し、`/sitemap.xml` `/robots.txt` `/feed.xml` が 200、`/articles/<id>/opengraph-image` が `image/png` で 200 | pass（2026-10-24 ローカル実測。sitemap 1,664→タグを 2 件以上に絞って縮小、feed 50 件、OG 画像 75KB/0.47 秒） |
