#!/bin/bash

# Create brain directory structure
mkdir -p docs/brain/decisions
mkdir -p docs/brain/patterns
mkdir -p docs/brain/errors
mkdir -p docs/brain/fixes
mkdir -p docs/brain/learnings
mkdir -p docs/brain/chains
mkdir -p docs/brain/sessions
mkdir -p docs/phases
mkdir -p docs/research
mkdir -p resources/workbooks
mkdir -p resources/transcripts
mkdir -p resources/examples
mkdir -p prompts/system
mkdir -p prompts/synthesio
mkdir -p prompts/ghostwrite
mkdir -p prompts/ghostwrite/agents
mkdir -p prompts/templates

# Create brain index
cat > docs/brain/_index.md << 'EOF'
# 🧠 Brain Index

> Auto-updated list of all notes

## Decisions
<!-- DECISIONS_START -->
<!-- DECISIONS_END -->

## Patterns
<!-- PATTERNS_START -->
<!-- PATTERNS_END -->

## Errors
<!-- ERRORS_START -->
<!-- ERRORS_END -->

## Fixes
<!-- FIXES_START -->
<!-- FIXES_END -->

## Learnings
<!-- LEARNINGS_START -->
<!-- LEARNINGS_END -->

## Chains
<!-- CHAINS_START -->
<!-- CHAINS_END -->

## Sessions
<!-- SESSIONS_START -->
<!-- SESSIONS_END -->
EOF

echo "✅ Brain structure initialized"