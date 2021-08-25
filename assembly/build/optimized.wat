(module
 (type $i32_i32_=>_i32 (func (param i32 i32) (result i32)))
 (memory $0 0)
 (export "init" (func $../client/src/components/Memory/wasm/index/init))
 (export "memory" (memory $0))
 (func $../client/src/components/Memory/wasm/index/init (param $0 i32) (param $1 i32) (result i32)
  local.get $0
  local.get $1
  i32.add
 )
)
