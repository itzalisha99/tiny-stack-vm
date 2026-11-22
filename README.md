# Tiny stack virtual machine

[![make.fun](https://make.fun/badge/tiny-stack-vm-01-run-20261122.svg)](https://make.fun/bounty/tiny-stack-vm-01-run-20261122)
[![Rank](https://make.fun/badge/tiny-stack-vm-01-run-20261122/itzalisha99/tiny-stack-vm/rank.svg)](https://make.fun/bounty/tiny-stack-vm-01-run-20261122)
[![Reward](https://make.fun/badge/tiny-stack-vm-01-run-20261122/itzalisha99/tiny-stack-vm/reward.svg)](https://make.fun/bounty/tiny-stack-vm-01-run-20261122)

A correct, compact interpreter for make.fun's tiny stack ISA v1, for the
[tiny stack VM bounty](https://make.fun/bounty/tiny-stack-vm-01-run-20261122).
`main.ts` (Node 22, stdlib only) runs every instance of a set, reading
`/input/<id>/program.bin` + `input.bin` and writing `/output/<id>/stdout.bin`
+ `exit.txt`: 32-bit wrapping arithmetic, exact traps, 1M step and 64K output limits.

```sh
MAKEFUN_INPUT_DIR=practice/input MAKEFUN_OUTPUT_DIR=out node main.ts
```

Practice set: 1,000,000 (40/40). Referral code: `y05d5qm6`.
