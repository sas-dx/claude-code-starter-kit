# Settings（設定）ガイド

## Settings とは

Settings は、Claude Code の**動作・権限・フック・環境変数を制御する設定ファイル**です。

### 身近な例えで理解する

スマホの「設定」アプリで例えると：

- **通知設定** = どのツールの実行を許可/拒否するか（permissions）
- **アクセシビリティ** = 環境変数やモデルの設定（env, model）
- **セキュリティ** = 実行前チェックの設定（hooks）
- **ペアレンタルコントロール** = 管理者が組織全体に強制する設定（managed policy）

スマホと同じで、細かく設定するほど自分に合った使い方ができます。

## なぜ Settings を理解する必要があるのか

### 1. チームで共通の権限設定ができる

「`Bash` コマンドは許可するけど `rm -rf *` は拒否する」のようなルールを設定ファイルに書けば、チーム全員が同じ安全設定で Claude を使えます。

### 2. Hooks の設定場所になる

Hooks（フック）は settings.json に定義します。Settings を理解していないと、Hooks を設定できません。

### 3. 環境ごとに設定を分けられる

チーム共有の設定（`.claude/settings.json`）と、個人のローカル設定（`.claude/settings.local.json`）を分離できます。API キーなど個人固有の設定をリポジトリにコミットしてしまう事故を防げます。

## 設定ファイルの種類と優先度

```
優先度: 高 → 低
1. /etc/claude-code/settings.json       # 管理者ポリシー（組織全体に強制）
2. ~/.claude/settings.json              # ユーザーレベル（全プロジェクト共通）
3. .claude/settings.json                # プロジェクトレベル（チーム共有）
4. .claude/settings.local.json          # ローカル（gitignore 対象）
```

| ファイル | 共有 | 用途 |
|---------|------|------|
| `/etc/claude-code/settings.json` | 組織全体 | セキュリティポリシーの強制 |
| `~/.claude/settings.json` | 個人（全プロジェクト） | 個人の共通設定 |
| `.claude/settings.json` | チーム（リポジトリにコミット） | プロジェクト共通の設定 |
| `.claude/settings.local.json` | 個人（gitignore） | 個人の API キー等 |

## 設定サンプル

本ディレクトリの `sample-settings.json` に主要な設定項目のサンプルがあります。これはあくまでも**設定内容の参考例**であり、このファイルを直接使用するものではありません。実際の設定は `.claude/settings.json` または `~/.claude/settings.json` に記述してください。

## 主な設定項目

| 項目 | 説明 | 例 |
|-----|------|-----|
| `permissions.allow` | 許可するツール | `["Bash", "Read", "Edit"]` |
| `permissions.deny` | 拒否するツール/パターン | `["Bash(rm -rf *)"]` |
| `env` | 環境変数 | `{"NODE_ENV": "development"}` |
| `hooks` | ライフサイクルフック | Hooks ガイド参照 |
| `disallowedTools` | 使用禁止ツール | `["Agent(Explore)"]` |
| `sandbox.enabled` | サンドボックス化 | `true` / `false` |

## 設定の確認方法

```bash
# セッション内で現在の設定を確認
/config

# 権限設定を確認
/permissions
```
