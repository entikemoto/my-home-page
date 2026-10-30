---
title: "Androidアプリの開発環境に、ClaudeやCodexも使えるようになった"
publishedAt: "2026-10-30T10:54:20+09:00"
xUrl: "https://x.com/Ikemoto1966/status/2115972372612383190"
noteUrl: "https://note.com/entikemoto/n/nb8bc6eed4555"
tags:
  - "Google"
  - "Android"
  - "コーディングエージェント"
  - "Claude Code"
  - "Codex"
coverImage: "/images/articles/2026-10-30-androidclaudecodex-f05019ad.png"
sourceProject: "ainews-digest"
---

> [Google opens Android development to third-party AI agents and unveils new Gemini APIs（The Decoder）](https://the-decoder.com/google-opens-android-development-to-third-party-ai-agents-and-unveils-new-gemini-apis/)

The Decoder は、2026年10月28日の Android Dev Summit の発表を、3つまとめて伝えています。

1. Android のスマホ用アプリを作る開発環境を、Google 以外の AI にも開いた
2. アプリの機能を、Google 検索と Gemini アプリから使えるようにする
3. Android XR のスマートグラス XREAL AURA（1,099ドル）を出した

この記事は 1 だけを説明します。

### Androidのアプリを作る開発環境

Android のスマホ用アプリは、Android Studio という Google のソフトの中で作ります。コードを書き、パソコンの中の仮想スマホ（エミュレーター）で動かし、動いているときの記録（Logcat）を見て不具合を探します。画面の見た目も、ここで確認します。

### 以前の環境

この Android Studio の中で使えた AI は、Google 自身のものでした。

Claude や Codex で Android のコードを書くことは、Android Studio の外ではできました。ただし、それらは Android Studio の機能としては入っておらず、エミュレーターや Logcat や画面の確認に、Android Studio 経由で直接触れる形にはなっていませんでした。記録を見て原因を探すときは、人が記録をコピーして AI に渡していました。

### 今回 Google が出した環境

2026年10月の Android Dev Summit で、Android Studio の新版 Rabbit 2 が出ました。変わったのは、どの AI をこの中で使えるかです。

Bring Your Own Agent という機能が入りました。共通の接続方式で、40を超えるコーディング用の AI を Android Studio の中で動かせます。配布所から入れて、同時に動かせるものとして名前が出ているのは、Anthropic の Claude Agent、OpenAI の Codex、Google の Antigravity です。これらは、プロジェクトの中身、エミュレーター、Logcat に直接触れます。

AI が入れた変更は乱れやすいので、Change Review が加わりました。保留中の変更を調べ、不具合の報告を作り、どこを変えたかを順に説明します。

文字で操作する画面（ターミナル）向けには、Android CLI が Claude Code、Codex、Antigravity の公式の追加機能になりました。画面の見た目は、エミュレーターを起動せず、ターミナル上のプレビューで確認できます。

新しい部品の使い方は、AI の学習データに入っていないことが多いです。公開前の規約の確認や、折りたたみ端末への対応など、30を超える資料（Android Skills）を、作業中の AI に渡せるようになりました。

使い終わったメモリを残していないかを見つける LeakCanary も、この CLI と、Android Studio の調査用の画面（Profiler）に入りました。

スマホのアプリは、画面を開いているあいだ、写真や画面の情報をメモリという一時置き場に置きます。画面を閉じたら、その分は空けるのが普通です。空け忘れると、閉じた画面の分が置き場に残り続けます。この不具合をメモリリークと呼びます。一度では気づきません。同じ画面を開いて閉じるたびに残りが増え、アプリの動きが遅くなる、しばらく使うと突然閉じる、電池の減りが速くなる、といった形で出ます。短い動作確認では再現しにくいので、作る側が見落とします。

### 開発者にとっての利点

自分の使っている AI を、Android Studio の外に置いたままにしなくてよくなります。Claude や Codex を中に入れ、仮想スマホと動作記録に直接触れさせられます。記録をコピーして渡す手順が減ります。

画面の確認も短くなります。Google の社内試験では、ターミナル上のプレビューを使うと、画面の作業が 77% 速くなり、AI が読み書きする文字量（トークン）は最大で 3 倍少なくなりました。トークンが減ると、その分の待ち時間と費用が減ります。

もう一つの数字は、メモリリークの発見と修正です。Google の別の試験では、同じ Claude Opus 5.5 で、LeakCanary を使える CLI があると、この残りを見つけて直すのがほぼ 2 倍速くなり、トークンは約 25% 減りました。

資料を渡せるようになったので、最新の書き方や公開前の規約を、人が毎回説明し直す量も減ります。

これらの数字は、いずれも Google 自身の試験です。何と比べたかは、元記事には書かれていません。40を超える対応が、名前の挙がった Claude、Codex、Antigravity と同じ水準で動くかも、元記事だけでは分かりません。
