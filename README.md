# Claude Code Starter Kit

Claude Code の導入を検討しているチームや個人に向けたスターターキットです。
Skills、カスタムコマンド、サブエージェント、エージェントチームなど、Claude Code の主要機能をすぐに導入・使用できるテンプレートとサンプルを提供します。

## 目次

- [前提条件](#前提条件)
- [セットアップ](#セットアップ)
- [リポジトリ構成](#リポジトリ構成)
- [主要機能](#主要機能)
  - [CLAUDE.md（プロジェクト指示書）](#claudemdプロジェクト指示書)
  - [Custom Commands（カスタムコマンド）](#custom-commandsカスタムコマンド)
  - [Skills（スキル）](#skillsスキル)
  - [Sub-agents（サブエージェント）](#sub-agentsサブエージェント)
  - [Agent Teams（エージェントチーム）](#agent-teamsエージェントチーム)
  - [Hooks（フック）](#hooksフック)
  - [MCP Servers](#mcp-servers)
  - [Settings（設定）](#settings設定)
  - [Keybindings（キーバインド）](#keybindingsキーバインド)
- [カスタマイズガイド](#カスタマイズガイド)
- [参考リンク](#参考リンク)

## 前提条件

- [Claude Code CLI](https://docs.anthropic.com/en/docs/claude-code) がインストール済みであること
- Node.js 18 以上
- Git

```bash
# Claude Code のインストール
npm install -g @anthropic-ai/claude-code

# インストール確認
claude --version
```

## セットアップ

```bash
# リポジトリのクローン
git clone https://github.com/sas-dx/claude-code-starter-kit.git
cd claude-code-starter-kit

# Claude Code の起動
claude
```

起動後、CLAUDE.md が自動的に読み込まれ、プロジェクト固有の指示が適用されます。

## リポジトリ構成（暫定）

> **Note:** 以下は想定構成です。各ファイルは今後順次作成・更新していきます。

```
claude-code-starter-kit/
├── README.md                        # 本ファイル
├── .claude/
│   ├── CLAUDE.md                    # プロジェクト指示書（メイン）
│   ├── README.md                    # .claude ディレクトリガイド（CLAUDE.md の書き方）
│   ├── settings.json                # プロジェクト設定（チーム共有）
│   ├── settings.local.json          # ローカル設定（gitignore対象）
│   ├── commands/                    # カスタムコマンド（/コマンド名 で呼び出し）
│   │   ├── README.md               # カスタムコマンドガイド
│   │   ├── code-review.md          # /code-review - 包括的コードレビュー
│   │   ├── dev-issue.md            # /dev-issue - Issue ベース実装〜PR 作成
│   │   ├── dev-issue-team.md       # /dev-issue-team - Agent Teams 並列実装
│   │   ├── fix-pr-review.md        # /fix-pr-review - レビュー指摘対応
│   │   └── resolve-conflict.md     # /resolve-conflict - コンフリクト解消
│   ├── agents/                      # サブエージェント定義
│   │   ├── README.md               # サブエージェントガイド
│   │   ├── code-reviewer.md         # コード品質レビュー担当
│   │   ├── security-reviewer.md     # セキュリティレビュー担当
│   │   ├── pr-fix-implementer.md    # PR レビュー指摘修正担当
│   │   ├── conflict-resolver.md     # コンフリクト解消担当
│   │   └── rules-coder.md          # ルール準拠コーダー
│   ├── skills/                      # スキル定義
│   │   ├── README.md               # スキルガイド
│   │   ├── gen-doc/
│   │   │   └── SKILL.md            # /gen-doc - ドキュメント自動生成
│   │   ├── pr-summary/
│   │   │   └── SKILL.md            # /pr-summary - PR 要約（fork 実行）
│   │   ├── explain-code/
│   │   │   └── SKILL.md            # /explain-code - コード図解解説
│   │   └── fix-issue/
│   │       └── SKILL.md            # /fix-issue - Issue 実装〜PR 作成
│   ├── mcp/                         # MCP 関連ドキュメント
│   │   └── README.md               # MCP 設定ガイド
│   ├── rules/                       # プロジェクトルール定義
│   │   ├── README.md               # ルールガイド
│   │   ├── git-workflow.md         # Git ワークフロー（常時適用）
│   │   ├── coding-standards.md     # コーディング規約（常時適用）
│   │   ├── testing.md              # テストルール（テストファイル操作時のみ適用）
│   │   ├── security.md             # セキュリティルール（常時適用）
│   │   └── review-process.md       # コードレビュールール（常時適用）
│   └── hooks/                       # フックスクリプト
│       └── protect-files.sh         # ファイル保護スクリプト
├── .mcp.json                        # MCP サーバー設定（チーム共有）
└── .gitignore
```

## 主要機能

---

### CLAUDE.md（プロジェクト指示書）

セッション開始時に自動で読み込まれる永続的な指示書です。Claude Code にとっての「業務マニュアル」であり、毎回プロジェクトの説明をしなくても、ルール通りに動いてくれるようになります。

> 詳細なガイド（なぜ必要か、書き方のコツ 7選）は [.claude/README.md](.claude/README.md) を参照してください。

**なぜ必要か：**
- **毎回の説明が不要** - セッションごとに「このプロジェクトは...」と説明しなくて済む
- **チーム全員が同じルール** - リポジトリにコミットすれば全員共通のルールで Claude を使える
- **AI の暴走を防止** - 「やってはいけないこと」を明記して危険な操作を防ぐ
- **知見の蓄積** - プロジェクトの暗黙知が形式知化される

**本リポジトリの CLAUDE.md に含まれる AI 運用ルール：**

| ルール | 内容 |
|-------|------|
| 確認の原則 | ファイル操作前にユーザー承認を取る |
| 忠実の原則 | 独断で迂回・別アプローチをしない |
| 従属の原則 | 決定権は常にユーザーにある |
| 日本語の原則 | 回答・コミット・PR は日本語 |
| 最新化の原則 | 作業前に `git pull` する |
| 委譲の原則 | 専門作業はサブエージェントに委譲 |
| 安全の原則 | DB 削除・初期化コマンドを実行しない |
| 最小テストの原則 | 影響範囲のテストのみ実行 |

**書き方のコツ（抜粋）：**
- **具体的に書く** - 「きれいなコード」ではなく「インデント2スペース、キャメルケース」
- **コマンドはコピペで実行できる形で** - `npm test -- --coverage`
- **やってはいけないことを明記** - AI は「常識」を持たない
- **200行以内** - 長すぎると注意力が分散。詳細は `.claude/rules/` に分割
- **`/init` で自動生成してカスタマイズ** - ゼロから書くより効率的

**配置場所：**

| 配置場所 | スコープ | 用途 |
|---------|---------|------|
| `./CLAUDE.md` | プロジェクト | プロジェクト固有の指示（チーム共有） |
| `./.claude/CLAUDE.md` | プロジェクト | 同上（`.claude/` 配下にまとめたい場合） |
| `~/.claude/CLAUDE.md` | ユーザー | 全プロジェクト共通の個人設定 |

**パス別ルール（`.claude/rules/`）：**

特定のファイルパスに対してのみ適用されるルールを定義できます。

```markdown
---
paths:
  - "src/api/**/*.ts"
---

# API 開発ルール
- 入力バリデーションを必ず含める
- 標準エラーレスポンス形式を使用する
```

---

### Custom Commands（カスタムコマンド）

よく行う作業を `/コマンド名` の一言で実行できる仕組みです。毎回同じ指示を手打ちする手間をなくし、チーム全体で作業品質を統一できます。

> 詳細なガイド・コマンドの作り方は [.claude/commands/README.md](.claude/commands/README.md) を参照してください。

**メリット：**
- **作業品質が安定** - 誰がいつ使っても同じ観点でレビュー・実装が行われる
- **時間を大幅に節約** - 数分かかる指示が `/コマンド名` の1秒で完了
- **チームの知見が蓄積** - ベテランの暗黙知がコマンドとして形式知化される
- **ミスが減る** - git pull 忘れ、Issue 連携忘れなどをコマンドが防止

**ディレクトリ構成：**

```
.claude/commands/
└── コマンド名.md    → /コマンド名 で呼び出し可能
```

**本リポジトリで提供しているコマンド：**

| コマンド | 用途 |
|---------|------|
| `/code-review` | コード品質・セキュリティの包括的レビュー |
| `/dev-issue` | Issue ベースの実装〜PR 作成まで一括実行 |
| `/dev-issue-team` | Agent Teams による Issue の並列実装 |
| `/fix-pr-review` | PR レビュー指摘の分析・修正・完了報告 |
| `/resolve-conflict` | Git マージコンフリクトの分析・解決 |

**作成例：**

```markdown
$ARGUMENTS で指定された対象のドキュメントを生成してください。

## あなたのタスク

1. 対象ファイルを読み取る
2. 関数・クラスの一覧を抽出
3. 各関数の説明を日本語で記述
4. マークダウン形式で出力
```

`$ARGUMENTS` でユーザーからの引数を受け取れます。上記を `.claude/commands/gen-doc.md` として保存すると `/gen-doc src/utils.ts` で実行できます。

---

### Skills（スキル）

Claude Code に新しい能力を追加する仕組みです。`/skill-name` で直接呼び出すことも、会話の流れに応じて Claude が自動的に使うこともできます。カスタムコマンドの上位互換であり、テンプレートやスクリプトの同梱、サブエージェントでの隔離実行、ツール制限などが可能です。

> 詳細なガイド・スキルの作り方は [.claude/skills/README.md](.claude/skills/README.md) を参照してください。

**本リポジトリで提供しているスキル：**

| スキル | 呼び出し | 自動呼び出し | 説明 |
|-------|---------|------------|------|
| `gen-doc` | `/gen-doc <パス>` | 不可 | ソースコードからドキュメント自動生成 |
| `pr-summary` | `/pr-summary [PR番号]` | 不可 | PR の差分を分析してサマリー作成（`context: fork`） |
| `explain-code` | `/explain-code [パス]` | 可 | コードの仕組みを図解と例え話で解説 |
| `fix-issue` | `/fix-issue <Issue番号>` | 不可 | GitHub Issue に基づいて実装〜PR 作成 |

**ディレクトリ構成：**

```
.claude/skills/
└── skill-name/
    ├── SKILL.md           # メイン指示ファイル（必須）
    ├── template.md        # テンプレート（任意）
    ├── examples/
    │   └── sample.md      # サンプル出力（任意）
    └── scripts/
        └── helper.sh      # ヘルパースクリプト（任意）
```

**主なフロントマターフィールド：**

| フィールド | 説明 |
|-----------|------|
| `name` | スキル名（`/name` で呼び出し） |
| `description` | Claude が自動呼び出しの判断に使う説明文 |
| `argument-hint` | 引数のヒント表示（`[issue-number]` 等） |
| `disable-model-invocation` | `true` で Claude の自動呼び出しを禁止 |
| `allowed-tools` | スキル実行中に許可するツール |
| `context` | `fork` でサブエージェントとして隔離実行 |
| `agent` | `context: fork` 時のエージェント種別 |

---

### Sub-agents（サブエージェント）

特定のタスクに特化した AI アシスタントを定義します。隔離されたコンテキストで、独自のシステムプロンプトとツール制限を持って自律的に動作します。

> 詳細なガイド・エージェントの作り方は [.claude/agents/README.md](.claude/agents/README.md) を参照してください。

**本リポジトリで提供しているエージェント：**

| エージェント | 役割 |
|------------|------|
| `code-reviewer` | コード品質の包括的レビュー（ロジック、規約、テスト、パフォーマンス） |
| `security-reviewer` | セキュリティ脆弱性の検出と対策提案 |
| `pr-fix-implementer` | PR レビュー指摘の修正実装と完了報告 |
| `conflict-resolver` | Git コンフリクトの分析・解決 |
| `rules-coder` | プロジェクトルール準拠の TDD 実装 |

**ディレクトリ構成：**

```
.claude/agents/         # プロジェクトレベル（チーム共有）
├── code-reviewer.md
├── security-reviewer.md
└── ...

~/.claude/agents/       # ユーザーレベル（全プロジェクト共通）
└── my-agent.md
```

**エージェント定義ファイルのフォーマット：**

```yaml
---
name: code-reviewer
description: コードレビューの依頼があった場合に使用
tools: Read, Grep, Glob, Bash
disallowedTools: Write, Edit
model: sonnet
permissionMode: default
maxTurns: 10
---

あなたは経験豊富なコードレビュアーです。
以下の観点でコードをレビューしてください:

1. バグの可能性
2. セキュリティリスク
3. パフォーマンス問題
4. 可読性と保守性
```

**主なフロントマターフィールド：**

| フィールド | 説明 |
|-----------|------|
| `name` | エージェント名（必須） |
| `description` | Claude がこのエージェントに委譲する判断基準（必須） |
| `tools` | 許可するツール（省略時は全ツール継承） |
| `disallowedTools` | 禁止するツール |
| `model` | 使用モデル（sonnet, opus, haiku, inherit） |
| `permissionMode` | 権限モード（default, acceptEdits, dontAsk, plan） |
| `skills` | プリロードするスキル |
| `mcpServers` | 利用可能な MCP サーバー |
| `maxTurns` | 最大ターン数 |
| `background` | バックグラウンド実行（true/false） |
| `isolation` | `worktree` で隔離された git worktree で実行 |
| `memory` | 永続メモリのスコープ（user, project, local） |
| `hooks` | ライフサイクルフック |

---

### Agent Teams（エージェントチーム）

> **Warning:** Agent Teams は実験的機能であり、デフォルトで無効です。Claude Code v2.1.32 以降が必要です。

複数の Claude Code インスタンスが並列で協調作業を行う機能です。1つのセッションがチームリードとなり、独立したチームメイトに作業を分配・調整します。サブエージェントとは異なり、チームメイト同士が直接メッセージをやり取りでき、共有タスクリストを通じて自律的に協調します。

**サブエージェントとの比較：**

|                    | Sub-agents                               | Agent Teams                                  |
| :----------------- | :--------------------------------------- | :------------------------------------------- |
| **コンテキスト**    | 独自のコンテキスト。結果は呼び出し元に返却 | 独自のコンテキスト。完全に独立                   |
| **コミュニケーション** | メインエージェントへの結果報告のみ         | チームメイト同士が直接メッセージをやり取り        |
| **コーディネーション** | メインエージェントが全作業を管理           | 共有タスクリストによる自己調整                    |
| **適したケース**    | 結果だけが必要な集中タスク                 | 議論・協調が必要な複雑な作業                     |
| **トークンコスト**  | 低い（結果がメインに要約される）            | 高い（各チームメイトが独立した Claude インスタンス） |

**有効化：**

`settings.json` に以下を追加：

```json
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"
  }
}
```

**活用シーン：**

- **リサーチ・レビュー** - 複数のチームメイトが問題の異なる側面を同時に調査し、発見を共有・議論
- **新規モジュール・機能** - 各チームメイトが別々のモジュールを担当し、干渉なく並行開発
- **競合仮説によるデバッグ** - 複数の仮説を並列でテストし、互いの理論に反証を試みる
- **レイヤー横断の変更** - フロントエンド・バックエンド・テストを各チームメイトが担当

**チームの起動：**

自然言語でチーム構成を指示します：

```text
CLI ツールの設計を複数の観点から検討してください。エージェントチームを作成して:
- UX 担当のチームメイト
- 技術アーキテクチャ担当のチームメイト
- 反対意見を出す役割のチームメイト
```

**表示モード：**

| モード | 説明 | 要件 |
|-------|------|------|
| `auto`（デフォルト） | tmux セッション内なら分割ペイン、それ以外はインプロセス | なし |
| `in-process` | 全チームメイトがメインターミナル内で動作。`Shift+Down` で切り替え | なし |
| `tmux` | 各チームメイトが独自のペインで表示。tmux または iTerm2 が必要 | tmux / iTerm2 |

```json
{
  "teammateMode": "in-process"
}
```

CLI フラグでも指定可能：

```bash
claude --teammate-mode in-process
```

**チームメイトとの対話：**

- **インプロセスモード**: `Shift+Down` でチームメイト間を移動、直接メッセージを送信。`Enter` でセッション表示、`Escape` で割り込み、`Ctrl+T` でタスクリスト表示
- **分割ペインモード**: チームメイトのペインをクリックして直接対話

**タスク管理：**

共有タスクリストでチーム全体の作業を調整します。タスクには pending / in progress / completed の3つの状態があり、タスク間の依存関係も設定可能です。

- **リードが割り当て** - 特定のタスクを特定のチームメイトに割り振り
- **自己クレーム** - タスク完了後、チームメイトが次の未割り当て・未ブロックタスクを自動取得

**プラン承認の要求：**

チームメイトに実装前のプラン承認を義務付けられます：

```text
認証モジュールのリファクタリング用のアーキテクトチームメイトを起動してください。
変更を加える前にプラン承認を必須にしてください。
```

リードがプランを審査し、承認または差し戻しフィードバックを行います。

**品質ゲートの強制（Hooks）：**

| フックイベント | タイミング | 用途 |
|--------------|----------|------|
| `TeammateIdle` | チームメイトがアイドルになる直前 | exit 2 でフィードバックを送り作業を継続させる |
| `TaskCompleted` | タスクが完了マークされる時 | exit 2 で完了を阻止しフィードバックを返す |

**ベストプラクティス：**

- チームサイズは **3〜5名** を推奨。トークンコストとコーディネーションのバランスが最適
- チームメイト1名あたり **5〜6タスク** が適切な粒度
- 同一ファイルの並行編集は避ける（上書きの原因になる）
- 初めて使う場合は、コードを書かないタスク（PRレビュー、調査）から始める
- リードが自分で実装を始めた場合は「チームメイトの完了を待ってください」と指示する

**制限事項：**

- `/resume` でインプロセスチームメイトは復元されない
- セッションあたり1チームのみ
- チームメイトは自身のチームを作成できない（ネスト不可）
- リードの変更や移譲は不可
- 権限はスポーン時にリードの設定を継承（個別設定はスポーン後に変更可能）
- 分割ペインモードは VS Code 統合ターミナル、Windows Terminal、Ghostty では非対応

---

### Hooks（フック）

Claude Code のライフサイクルの特定のポイントで実行される確定的なシェルコマンドです。ルールの強制、アクションの検証、ワークフローの自動化に使用します。

**フックタイプ：**

| タイプ | 説明 |
|-------|------|
| `command` | シェルスクリプトを実行 |
| `http` | HTTP エンドポイントに POST |
| `prompt` | 単発の LLM 評価呼び出し |
| `agent` | マルチターンのエージェント検証 |

**主要なフックイベント：**

| イベント | タイミング |
|---------|----------|
| `SessionStart` | セッション開始・再開時 |
| `PreToolUse` | ツール実行前（ブロック可能） |
| `PostToolUse` | ツール正常実行後 |
| `UserPromptSubmit` | プロンプト送信時 |
| `Stop` | Claude の応答完了時 |
| `SubagentStart` / `SubagentStop` | サブエージェントのライフサイクル |
| `SessionEnd` | セッション終了時 |

**設定場所：**

```
~/.claude/settings.json        # グローバル（全プロジェクト）
.claude/settings.json          # プロジェクトレベル
.claude/settings.local.json    # ローカル（共有しない）
```

**設定例（保護ファイルへの編集をブロック）：**

`.claude/settings.json`:
```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash .claude/hooks/protect-files.sh"
          }
        ]
      }
    ]
  }
}
```

`.claude/hooks/protect-files.sh`:
```bash
#!/bin/bash
INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

if [[ "$FILE_PATH" == *".env"* ]] || [[ "$FILE_PATH" == *".git/"* ]]; then
  echo "Blocked: Protected file" >&2
  exit 2  # exit 2 でアクションをブロック
fi
exit 0    # exit 0 で許可
```

**終了コードの意味：**

| 終了コード | 動作 |
|-----------|------|
| `0` | アクションを許可（stdout でコンテキスト注入可能） |
| `2` | アクションをブロック（stderr がフィードバックとして Claude に送信） |

---

### MCP Servers

Model Context Protocol (MCP) を通じて、外部ツール・データベース・API・サービスへのアクセスを提供します。

> 詳細なセットアップ手順・トラブルシューティングは [.claude/mcp/README.md](.claude/mcp/README.md) を参照してください。

**本プロジェクトの導入済み MCP サーバー：**

| サーバー | 用途 | 前提条件 |
|---------|------|---------|
| [Serena](https://github.com/oraios/serena) | セマンティックコード解析・シンボルレベル編集・コードナビゲーション | `uv` パッケージマネージャー |
| [Context7](https://github.com/upstash/context7) | 最新ライブラリドキュメントのリアルタイム取得・バージョン固有のコード例提供 | Node.js / npm |

**設定ファイル（`.mcp.json`）：**

本プロジェクトではプロジェクトルートの `.mcp.json` にチーム共有設定を定義しています。

```json
{
  "mcpServers": {
    "serena": {
      "type": "stdio",
      "command": "/path/to/uvx",
      "args": [
        "--from", "git+https://github.com/oraios/serena",
        "serena", "start-mcp-server",
        "--context", "ide-assistant",
        "--project", "."
      ]
    },
    "context7": {
      "type": "stdio",
      "command": "npx",
      "args": ["--yes", "@upstash/context7-mcp"]
    }
  }
}
```

> **Note:** Serena の `command` は `uvx` の絶対パスを指定する必要があります。
> 環境に応じて `which uvx` で確認し、パスを書き換えてください。

**接続確認：**

```bash
claude mcp list
```

**設定スコープ：**

| スコープ | ファイル | 共有 |
|---------|---------|------|
| `local`（デフォルト） | `~/.claude.json` | 個人のみ |
| `project` | `.mcp.json` | チーム共有（バージョン管理対象） |
| `user` | `~/.claude.json` | 個人・全プロジェクト共通 |

**サーバーの追加：**

```bash
# HTTP サーバー（リモート推奨）
claude mcp add --transport http --scope project <name> <url>

# stdio サーバー（ローカル、サブプロセスとして実行）
claude mcp add --transport stdio --scope project <name> -- <command> <args...>
```

---

### Settings（設定）

Claude Code の動作、権限、フック、環境変数を設定するファイルです。

**設定ファイルと優先度：**

```
優先度: 高 → 低
1. /etc/claude-code/settings.json       # 管理者ポリシー（組織全体）
2. ~/.claude/settings.json              # ユーザーレベル（全プロジェクト）
3. .claude/settings.json                # プロジェクトレベル（チーム共有）
4. .claude/settings.local.json          # ローカル（gitignore対象）
```

**設定例（`.claude/settings.json`）：**

```json
{
  "permissions": {
    "allow": ["Bash", "Read", "Edit", "Write", "Glob", "Grep"],
    "deny": ["Bash(rm -rf *)"]
  },
  "hooks": {
    "PreToolUse": []
  },
  "env": {
    "NODE_ENV": "development"
  }
}
```

**主な設定項目：**

| 項目 | 説明 |
|-----|------|
| `permissions.allow` / `deny` | ツールのアクセス制御 |
| `hooks` | ライフサイクルフック設定 |
| `env` | 環境変数 |
| `disallowedTools` | 使用禁止ツール |
| `sandbox.enabled` | ファイルシステムのサンドボックス化 |

---

### Keybindings（キーバインド）

Claude Code のキーボードショートカットをカスタマイズできます。

**設定ファイル：** `~/.claude/keybindings.json`

`/keybindings` コマンドで設定ファイルを開けます。

```json
{
  "bindings": [
    {
      "context": "Chat",
      "bindings": {
        "ctrl+j": "chat:submit",
        "ctrl+u": "chat:undo",
        "ctrl+g": "chat:externalEditor"
      }
    }
  ]
}
```

**主なコンテキスト：**

| コンテキスト | 適用範囲 |
|------------|---------|
| `Global` | すべての画面 |
| `Chat` | メイン入力エリア |
| `Autocomplete` | 自動補完メニュー |
| `Confirmation` | 権限ダイアログ |
| `Transcript` | トランスクリプトビューア |

**主なアクション：**

| アクション | 説明 |
|-----------|------|
| `chat:submit` | メッセージ送信 |
| `chat:cancel` | 入力キャンセル |
| `chat:externalEditor` | 外部エディタで開く |
| `app:exit` | Claude Code を終了 |

---

## カスタマイズガイド

### 1. プロジェクトに合わせた CLAUDE.md の作成

```bash
# 自動生成
claude /init

# または手動で作成
# CLAUDE.md にプロジェクト固有の指示を記述
```

### 2. チーム共通スキルの追加

`.claude/skills/` 配下に SKILL.md を作成し、チームで共有したいワークフローを定義します。

### 3. サブエージェントのカスタマイズ

`.claude/agents/` 配下のエージェント定義ファイルを編集し、プロジェクトの要件に合わせて調整します。

### 4. フックによるガードレールの設定

`.claude/settings.json` にフックを追加し、危険な操作のブロックや品質チェックを自動化します。

### 5. MCP サーバーの追加

チームで使用する外部サービスとの連携を `.mcp.json` に定義します。

## 参考リンク

| リソース | URL |
|---------|-----|
| Claude Code 公式ドキュメント | https://docs.anthropic.com/en/docs/claude-code |
| Claude Code ウェブドキュメント | https://code.claude.com/docs/en/ |
| Claude Code GitHub | https://github.com/anthropics/claude-code |
| MCP (Model Context Protocol) | https://modelcontextprotocol.io/ |

## ライセンス

MIT License
