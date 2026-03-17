---
name: scaffold-feature
description: Claude Code の機能ディレクトリ（commands, agents, skills, rules, hooks, mcp 等）のスキャフォールドを生成する。ディレクトリ作成、サンプルファイル配置、README.md 生成を一括で行う。
argument-hint: <機能名> [オプション]
disable-model-invocation: true
---

$ARGUMENTS で指定された Claude Code の機能ディレクトリを `.claude/` 配下にスキャフォールド（雛形生成）してください。

## 対応する機能タイプ

以下のタイプを認識し、適切なディレクトリ構成とサンプルを生成します。

### `command <コマンド名>`
`.claude/commands/<コマンド名>.md` を作成する。
- `$ARGUMENTS` を使った引数受け取りのサンプル
- 使用方法セクション

### `agent <エージェント名>`
`.claude/agents/<エージェント名>.md` を作成する。
- YAML フロントマター（name, description, model）
- 基本方針、ワークフロー、出力フォーマットのテンプレート

### `skill <スキル名>`
`.claude/skills/<スキル名>/SKILL.md` を作成する。
- YAML フロントマター（name, description, argument-hint）
- 手順、出力フォーマットのテンプレート

### `rule <ルール名>`
`.claude/rules/<ルール名>.md` を作成する。
- パス別ルールが必要か確認し、必要なら `paths` フロントマターを含める
- 簡潔な箇条書き形式

### `hook <フック名>`
`.claude/hooks/<フック名>.sh` を作成する。
- `jq` で stdin を解析するテンプレート
- 終了コード 0（許可）/ 2（ブロック）のサンプル
- 実行権限を付与する（`chmod +x`）

### `mcp <サーバー名>`
`.mcp.json` にサーバー設定を追加する（既存設定がある場合はマージ）。
- stdio / http のどちらかを確認
- `.claude/mcp/README.md` にサーバー情報を追記

## 共通ルール

1. 既にファイルが存在する場合は上書きせず、ユーザーに確認する
2. 作成するファイルには日本語でコメント・説明を記述する
3. 本リポジトリの既存ファイル（同ディレクトリの README.md や他のサンプル）のフォーマットに合わせる
4. 作成完了後、作成したファイル一覧と次にやるべきこと（内容のカスタマイズ等）を報告する

## 使用例

```
/scaffold-feature command deploy
/scaffold-feature agent test-runner
/scaffold-feature skill generate-migration
/scaffold-feature rule api-design
/scaffold-feature hook block-dangerous-commands
/scaffold-feature mcp github
```

## 複数同時生成

スペース区切りで複数指定も可能：

```
/scaffold-feature command deploy agent deployer skill deploy-check
```
