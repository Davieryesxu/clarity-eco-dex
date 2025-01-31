import {
  Clarinet,
  Tx,
  Chain,
  Account,
  types
} from 'https://deno.land/x/clarinet@v1.0.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
  name: "Can register new product",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get("deployer")!;
    
    let block = chain.mineBlock([
      Tx.contractCall("eco-registry", "register-product", 
        [types.ascii("Eco Bottle"), types.ascii("Container"), types.uint(80)],
        deployer.address
      )
    ]);
    
    assertEquals(block.receipts.length, 1);
    assertEquals(block.height, 2);
    assertEquals(block.receipts[0].result, "(ok u0)");

    // Verify product details including timestamp
    let product = chain.callReadOnlyFn("eco-registry", "get-product", [types.uint(0)], deployer.address);
    assertEquals(product.result.includes("creation-time"), true);
  }
});

Clarinet.test({
  name: "Can update product metrics",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get("deployer")!;
    
    let block = chain.mineBlock([
      Tx.contractCall("eco-registry", "update-metrics",
        [types.uint(0), types.uint(50), types.uint(75), types.uint(90)],
        deployer.address
      )
    ]);

    assertEquals(block.receipts.length, 1);
    assertEquals(block.receipts[0].result, "(ok true)");
  }
});

Clarinet.test({
  name: "Can get products by manufacturer",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get("deployer")!;
    
    // Register multiple products
    chain.mineBlock([
      Tx.contractCall("eco-registry", "register-product",
        [types.ascii("Product 1"), types.ascii("Category 1"), types.uint(80)],
        deployer.address
      ),
      Tx.contractCall("eco-registry", "register-product", 
        [types.ascii("Product 2"), types.ascii("Category 2"), types.uint(90)],  
        deployer.address
      )
    ]);

    let products = chain.callReadOnlyFn(
      "eco-registry",
      "get-products-by-manufacturer",
      [types.principal(deployer.address)],
      deployer.address
    );
    
    assertEquals(products.result.includes("Product 1"), true);
    assertEquals(products.result.includes("Product 2"), true);
  }
});
