
ifneq ($(CI), true)
LOCAL_ARG = --local --verbose --diagnostics
endif

build:
	rm index.d.ts || true
	rm types/beta.d.ts || true
	rm types/full.d.ts || true
	./node_modules/.bin/api-extractor run $(LOCAL_ARG) --typescript-compiler-folder ./node_modules/typescript
	./node_modules/.bin/ts-node build.ts

test:
	./node_modules/.bin/tsc -p test/tsconfig.json

.PHONY: build test