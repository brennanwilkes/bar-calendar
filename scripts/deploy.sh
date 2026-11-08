#!/usr/bin/env bash
# Build and upload to https://bw.codexwilkes.com/advent/
# Only works from haleiwa (the machine with SSH access to the gateway).
set -euo pipefail

if [ "$(hostname)" != "haleiwa" ]; then
	echo "deploy: refusing to run on '$(hostname)'; only haleiwa has SSH access to pi.codexwilkes.com" >&2
	exit 1
fi

cd "$(dirname "$0")/.."
pnpm build
scp -o ProxyJump=pi.codexwilkes.com -r dist/* brennan@10.0.1.6:/data/www/bw.codexwilkes.com/advent/
echo "Deployed to https://bw.codexwilkes.com/advent/"
