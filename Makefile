TOP_DIR=.
SRC_DIR=$(TOP_DIR)/slides
TARGET_DIR=$(TOP_DIR)/_build
ASSET_DIR=$(TOP_DIR)/assets
TOOL_DIR=$(TOP_DIR)/tools
CLI_DIR=$(TOOL_DIR)/cli

ENGINE=$(CLI_DIR)/engine.js

MARP=marp --engine $(ENGINE) --theme $(ASSET_DIR)/custom.css --html true

init: install dep
	@echo "Initializing the repo..."

travis-init:
	@echo "Initialize software required for travis (normally ubuntu software)"


install:
	@echo "Install software required for this repo..."
	@npm install -g @marp-team/marp-cli

dep:
	@echo "Install dependencies required for this repo..."
	@npm install

travis: build

travis-deploy: release
	@echo "Deploy the software by travis"

run:
	@$(MARP) -s $(SRC_DIR)

build: $(TARGET_DIR) copy-assets
	@$(MARP) -I slides -o _build

build-pdf: build
	@$(MARP) -I slides -o _build --allow-local-files --pdf

copy-assets:
	@rsync -arv $(SRC_DIR)/assets $(TARGET_DIR)

gen-audios: # must pass CHAPTER=xxx
	@tools/cli/tts.js -i resources/_meta/$(CHAPTER).json

gen-slides:
	@mkdir -p /tmp/tongjian/slides
	@tools/cli/generator.js -i resources/_meta -o /tmp/tongjian

gen-meta:
	@mkdir -p /tmp/tongjian/_meta
	@tools/cli/normalizer.js -i resources/_src -o /tmp/tongjian/_meta
$(TARGET_DIR):
	@mkdir -p $@
