TOP_DIR=.
SRC_DIR=$(TOP_DIR)/slides
TARGET_DIR=$(TOP_DIR)/_build
ASSET_DIR=$(TOP_DIR)/assets
TOOL_DIR=$(TOP_DIR)/tools

ENGINE=$(TOOL_DIR)/engine.js

MARP=marp --engine $(ENGINE) --theme $(ASSET_DIR)/custom.css

run:
	@$(MARP) -s $(SRC_DIR)

build: $(TARGET_DIR) copy-assets
	@$(MARP) -I slides -o _build

build-pdf: build
	@$(MARP) -I slides -o _build --allow-local-files --pdf

copy-assets:
	@rsync -arv $(SRC_DIR)/assets $(TARGET_DIR)

$(TARGET_DIR):
	@mkdir -p $@
