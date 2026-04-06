# LAST_SESSION

> 保存日時: 2026-04-06 16:45

## 作業したプロジェクト
- `projects/20260317_MyHomePage` — ホームページに Essays プレビューセクション追加・デプロイ

## 完了した作業
- ホームページ（`src/app/page.tsx`）に Essays プレビューセクションを追加
  - 解説記事セクションの直後に最新 Essays 2件を表示
  - Essays が0件のときは自動非表示
  - 各カードに「note ↗」リンク、「すべて見る →」リンク付き
- Vercel にデプロイ済み（最新: cb871ce）

## 未完了・次のアクション
1. **Dev Log の実記録追加**（サンプル1件のみ。5件以上になったらホームページに追加検討）
2. **Talks の実記録追加**（サンプル2件のみ。実績が増えたらホームページに追加検討）
3. **Essays 投稿の継続**（Obsidian ファイルを渡すだけで投稿できる手順が確立済み）
4. **Vercel キャッシュ問題の最終確認**
   - 削除済み URL（/essays/2026-04-06-why-i-update-dev-environment-daily）
   - コードは削除済み・デプロイ済み。`Cmd+Shift+R` でハードリフレッシュを試す
5. **モバイル表示確認**（ナビゲーション項目が7つに増えたため）

## メモ
- Essays プレビューは「コンテンツが育ったら追加」方針で設計。Dev Log・Talks は5件以上になってから追加
- Essays 投稿フロー確立：Obsidian ファイル → 渡す → 公開日・note URL・執筆方法を確認 → デプロイ
- `source` フィールド（ai-assisted / human-written）は型に残すが UI には表示しない
- CortexFlow 2.0 との essay 連携は未実装（現状は手動フロー）
- ナビゲーション：Articles / Essays / Dev Log / Talks / Publications / Lab / About の7項目
