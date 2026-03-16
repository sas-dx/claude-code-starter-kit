---
name: fix-issue
description: GitHub Issue の内容を読み取り、実装を行う。
argument-hint: <Issue番号>
disable-model-invocation: true
---

GitHub Issue $ARGUMENTS に基づいて修正・実装を行ってください。

## 手順

1. `gh issue view $ARGUMENTS` で Issue の内容を取得・解析する
2. 関連するコードベースの既存実装を調査する
3. CLAUDE.md や .claude/rules/ のプロジェクトルールを確認する
4. メインブランチで `git pull` してソースを最新化する
5. `feature/#$ARGUMENTS-概要` または `fix/#$ARGUMENTS-概要` のブランチを作成する
6. TDD でテストを先に書き、実装する
7. 影響範囲のテストを実行して通ることを確認する
8. 日本語のコミットメッセージでコミットする
9. リモートにプッシュする
10. `gh pr create` で日本語の PR を作成し、`Closes #$ARGUMENTS` で Issue を連携する

## 完了報告

実装・更新されたファイルパスと内容を日本語で要約して報告する。
