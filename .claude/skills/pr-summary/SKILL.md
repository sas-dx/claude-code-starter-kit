---
name: pr-summary
description: プルリクエストの変更内容を要約する。差分、コメント、変更ファイルを取得して構造化されたサマリーを作成する。
argument-hint: [PR番号]
context: fork
agent: Explore
disable-model-invocation: true
allowed-tools: Bash(gh *)
---

## PR コンテキスト

- PR の差分: !`gh pr diff $ARGUMENTS`
- PR のコメント: !`gh pr view $ARGUMENTS --comments`
- 変更ファイル一覧: !`gh pr diff $ARGUMENTS --name-only`

## タスク

上記の PR 情報を分析し、以下のフォーマットで日本語の要約を作成してください。

### 出力フォーマット

```markdown
# PR サマリー

## 変更の概要
[この PR が何をするのか、なぜ必要なのかを2〜3文で説明]

## 変更ファイル
| ファイル | 変更種別 | 概要 |
|---------|---------|------|
| path/to/file | 追加/修正/削除 | 変更内容の要約 |

## 主な変更点
- [変更点1]
- [変更点2]

## 影響範囲
[この変更が影響する機能やモジュール]

## レビュー時の注目ポイント
- [レビュアーが特に確認すべき点]
```
