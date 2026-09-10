# learnings — MyHomePage（2026-08-08 新設）

- 2026-08-08 **分業型移行の第9号**。コード側 `~/Development/my-home-page` ＋文書側 vault。
  参照付替え: `/dev-log` スキル2箇所・CompanyAnalysis の `.env`（CORTEXFLOW_HP_REPO_DIR）。
  launchd・bws なし。WIP 37件（6〜7月の記事・日誌・実績文書）を2段で保全コミット。
  `src/app/articles/` に誤置された .code-workspace 2件は判断保留のため未追跡のまま存置。

## 手戻り・修正の記録

### EV-001 ローカルビルド停滞（環境変数不足）→ ローカル環境依存に特定済み

**2026-07-05 発見。現状: Vercel リモートビルドで判定に切り替え（ローカルフルビルド検証は不可）**

- **根因**: `npm run build`（Next.js 16.1.7 / Turbopack）が、17ルート以上で「Generating static pages (8/N)」で永久停止する
- **切り分け結果**（計11回の検証）:
  - 16 ルートまでは正常に完了
  - 17 ルート目で停止（内容・ルート名問わず再現）
  - `.next` キャッシュ削除・`experimental.cpus: 4` での対処失敗
  - **Vercel（Linux）では同一コードが正常にビルド** → ローカル環境固有の問題
- **対処**: ローカルでのフルビルド検証を中止。代替案として `npm run test` + `npx tsc --noEmit` + PR の Vercel プレビュービルドで検証フロー
- **恒久対処候補**: Next.js バージョン更新時に Turbopack 静的生成ワーカーの既知バグを再確認。環境変数（メモリ上限等）の調査も視野。

### 本番デプロイ・サイレント失敗（2026-06-24〜07-05 間）→ 修正済み（PR #1）

- **根因**: `content/articles/AI_Daily_Digest_2026-06-24_deep_dive_articles.json` の `edition: null` でバリデーション fail → ビルド error で止止
- **影響**: 6/24 以降の全 push がデプロイ失敗。本番サイト 12 日間未更新。ローカルテスト 12 件失敗（同一原因）
- **修正**: PR #1（2026-07-05）で `edition: "standalone"` に修正・本番デプロイ完了
- **再発防止**: CortexFlow 2.0 の deep_dive 出力側が edition を設定していない可能性を把握。次回 deep_dive 追加時に生成側確認

## known-failure eval への昇格（dev-loop 5段）

- EV-001: ローカルビルド停滞 → 17ルート以上での再現テスト eval を新規作成予定

## 2026-09-11 Vercel 本番ビルドが 8/7 から 4 回連続で失敗していた（誰も気づかず 5 週間）
- **現象**: GitHub の deployment status が 8/7・8/17・9/10 とも failure。サイトは 7/30 のビルドのまま配信されていた
- **原因**: `content/essays/2026-05-10-dx-article-list.md` の 1 行目 `# DX記事一覧`。essays ページの `bodyToBlocks` が `## `・`### ` 以外の `#` 行を消費できず while ループが止まらない（CPU 100% のワーカーが 1 つ残る）。8/7 の「未追跡エッセイの保全」コミットで本文が入り発症
- **誤診**: EV-001 に「環境変数不足で停滞」と書いて保留にしていた。ローカルで再現していたのに原因を環境のせいにして本番（Vercel）で確認する、と先送りした結果、本番も同じ理由で落ち続けた
- **対処**: パーサを `src/lib/essay-markdown.ts` に移設し、見出しは `#` の個数で判定・どの分岐にも当てはまらない行は段落として必ず 1 行進める。テスト 4 件（修正前赤）
- **教訓**: ①「ローカルで止まる」を環境差のせいにする前に `next build --debug-build-paths` でページ群を二分探索する（今回 5 回のビルドで特定）②デプロイ失敗は GitHub の deployment status を見れば分かる（`gh api repos/<o>/<r>/deployments`）。push 後に success を確認するまで「反映した」と言わない
