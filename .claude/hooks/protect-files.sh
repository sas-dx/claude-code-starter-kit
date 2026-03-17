#!/bin/bash
# 保護対象ファイルへの編集をブロックするフックスクリプト
# 設定例（.claude/settings.json）:
# {
#   "hooks": {
#     "PreToolUse": [
#       {
#         "matcher": "Edit|Write",
#         "hooks": [
#           {
#             "type": "command",
#             "command": "./.claude/hooks/protect-files.sh"
#           }
#         ]
#       }
#     ]
#   }
# }

set -e

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# 保護対象パターン（プロジェクトに合わせてカスタマイズ）
PROTECTED_PATTERNS=(
  ".env"
  ".git/"
  "package-lock.json"
  "yarn.lock"
)

for pattern in "${PROTECTED_PATTERNS[@]}"; do
  if [[ "$FILE_PATH" == *"$pattern"* ]]; then
    echo "保護対象ファイルへの変更はブロックされました: $FILE_PATH" >&2
    exit 2
  fi
done

exit 0
