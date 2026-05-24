# 小さなクリスタルRPG

ブラウザだけで遊べる、ファミコン風の短編2D RPGです。

## 遊び方

- 移動: 矢印キー / WASD
- 調べる: Enter / Space
- メニュー: M
- 音楽: 画面右側の「音楽 ON」ボタン

## ファイル構成

- `index.html`: 画面の土台
- `style.css`: ファミコン風の見た目
- `game.js`: ゲーム本体、マップ、戦闘、セーブ、BGM

## GitHub Pagesで公開する場合

GitHubにpushしたあと、リポジトリの Settings → Pages で以下を選びます。

- Source: Deploy from a branch
- Branch: `main`
- Folder: `/ (root)`

公開URLは通常、以下の形になります。

```text
https://GitHubユーザー名.github.io/リポジトリ名/
```

ローカルで修正したあと `git push` すれば、スマホ側のURLにも反映されます。

