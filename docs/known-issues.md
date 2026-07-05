# 既知の問題

## ローカル `next build` が静的生成 8/N で永久停止する（2026-07-05 発見・未解決）

- **症状**: この Mac 上で `next build`（Next.js 16.1.7 / Turbopack）を実行すると、アプリのルート数が 17 以上のとき「Generating static pages (8/N)」で止まり、ワーカー1つが CPU 99% で回り続ける
- **切り分け済みの事実**（計11回のビルド検証）:
  - 16 ルートでは成功する
  - 17 ルート目は**内容不問**（`<main>stub</main>` だけのページでも、ルート名を変えても再現）
  - `.next` キャッシュ削除・`experimental.cpus: 4` でも変化なし
  - **Vercel（Linux）では同一コードが正常にビルドされる** → ローカル環境固有
- **運用上の対処**: ローカルでのフルビルド検証はできない。検証は `npm run test` + `npx tsc --noEmit` + **PR の Vercel プレビュービルド**で行う
- **恒久対処の候補**: Next.js のバージョン更新時に再確認（Turbopack の静的生成ワーカーの既知バグの可能性）

## 過去の障害記録: 本番デプロイが 2026-06-24〜07-05 の間サイレントに失敗していた（解決済み）

- 原因: `content/articles/AI_Daily_Digest_2026-06-24_deep_dive_articles.json` の `edition: null`（バリデーションが build error で停止）
- 影響: 6/24 以降の push が全てデプロイ失敗し、サイトが更新されない状態だった。ローカルの articles テスト12件失敗も同一原因
- 修正: PR #1（2026-07-05）で `edition: "standalone"` に修正
- **再発防止メモ**: deep_dive 記事の生成側（CortexFlow 2.0 の deep-dive 出力 → HP 取り込み）が edition を設定していない可能性。次に deep_dive 記事を追加するときに生成側を確認すること
