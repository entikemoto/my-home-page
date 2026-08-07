# eval: MyHomePage — 台帳方式

- 作成日: 2026-08-08（分業型移行・第9号と同時に台帳化）

| シナリオID | 種別 | 合格基準(機械的 pass/fail) | 直近の実測 |
|-----------|------|---------------------------|-----------|
| EV-001 | typical | `npm run build` が exit 0（新locationでビルド可能） | 保留（compile 段階は成功=BUILD_ID生成。静的生成がローカル環境変数不足で停滞したため中断。本番ビルドは Vercel リモート=環境変数あり。次回 push 起点のVercelビルド成功をもって pass とする） |
| EV-002 | typical | /dev-log スキル経由の日誌追加が新パスの content/ に着地する | 次回 /dev-log 実行時に確認 |
