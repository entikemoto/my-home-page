# SESSION_STATE — 20260317_MyHomePage

> 最終更新: 2026-04-13

## 現在フェーズ

**Phase 4: デプロイ・本番化 ✅ 完了**

## 決定済み事項

### 企画方針
- **サイトの位置づけ**: 個人ブランドサイト兼、AI解説記事の検索・蓄積基盤
- **主目的**: note記事内の3本を、HPでは1本ずつ個別に見せて探しやすくする
- **媒体方針**: HPは個別記事の正本、noteは朝便/夜便のまとめ、XとSlackは既存運用維持
- **UIコンセプト**: 人物（医師）が主役の個人ブランドサイト。ニュースサイトではない
- **ブランドタグライン**: "Beyond Medicine. Beyond Imagination."

### 技術スタック（確定）
- Next.js 16.1.7 (App Router) + TypeScript + Tailwind CSS
- フォント: Noto Serif JP（知的・学術的な雰囲気）
- 検索: Pagefind（未実装）
- デプロイ: GitHub + Vercel（自動デプロイ連携済み）

### デザイン（確定）
- アクセントカラー: **amber-700**
- カラー: ホワイト・グレー・ブラック (#0c0c0c)・amber-700
- レイアウト: max-w-7xl（ホームページ・記事一覧）、max-w-3xl（記事本文）

### 人物情報（確定）
- 名前: 池本毅 / 肩書き: 医師 MBA AIビルダー
- note: https://note.com/entikemoto
- X: https://x.com/Ikemoto1966

### 記事データ契約（確定）
- CortexFlow の `HpPublisher` が `content/articles/*.json` に書き出す
- git push → Vercel 自動ビルド（約3分）

## 現在の状態

| 部品 | 状態 |
|------|------|
| ① 記事データ契約 | ✅ 完了 |
| ② 記事取り込み層 | ✅ 完了 |
| ③ 個別記事表示 | ✅ 完了 |
| ④ 一覧・アーカイブ導線 | ✅ 完了 |
| ⑤ ブランドページ群 | ✅ 完了 |
| ⑥ 媒体導線 | ✅ 完了 |
| GitHub push | ✅ 完了（entikemoto/my-home-page） |
| Vercel デプロイ | ✅ 完了（push で自動デプロイ） |
| CortexFlow → HP 自動連携 | ✅ 完了（HpPublisher → git push → Vercel） |
| About ページ原稿 | 🔲 未完了（原稿待ち） |
| カスタムドメイン | 🔲 未完了 |

## 次のアクション（優先順）

1. **カスタムドメイン設定** — 本番URLを確定させる
2. **About ページ原稿** — 医師→AI/テックへの転換点エピソード等をユーザーが執筆
3. **書籍説明文の確定** — Publications ページの仮テキストをユーザー確認後に更新
4. **Slack 招待URL** — 取得できたら `/lab` の CTA に追加
5. **未コミット変更の整理** — `content/articles/note_import.json` / `src/lib/__tests__/articles.test.ts` の変更を確認してコミット。`src/app/articles/20260317_MyHomePage.code-workspace` を `.gitignore` に追加するか検討

## 記事更新フロー（確立済み）

```bash
# CortexFlow が自動実行（note 確認後に実行）
cortexflow publish --auto --company "企業名" --social-only
# → X+Slack+HP（HP: JSON書き出し → git push → Vercel 自動ビルド）
```

## 関連プロジェクト

- `projects/20260220_CortexFlow_for_Medical_Founder` — HP向け記事データ供給元
