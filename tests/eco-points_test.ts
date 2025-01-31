import {
  Clarinet,
  Tx,
  Chain,
  Account,
  types
} from 'https://deno.land/x/clarinet@v1.0.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
  name: "Can mint tokens as owner",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get("deployer")!;
    const wallet1 = accounts.get("wallet_1")!;

    let block = chain.mineBlock([
      Tx.contractCall("eco-points", "mint",
        [types.uint(100), types.principal(wallet1.address)],
        deployer.address
      )
    ]);

    assertEquals(block.receipts.length, 1);
    assertEquals(block.receipts[0].result, "(ok true)");
  }
});

Clarinet.test({
  name: "Can transfer tokens between users",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const wallet1 = accounts.get("wallet_1")!;
    const wallet2 = accounts.get("wallet_2")!;

    let block = chain.mineBlock([
      Tx.contractCall("eco-points", "transfer",
        [types.uint(50), types.principal(wallet2.address)],
        wallet1.address
      )
    ]);

    assertEquals(block.receipts.length, 1);
    assertEquals(block.receipts[0].result, "(ok true)");
  }
});
