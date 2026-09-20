# Checkout / lead propagation contract
At the server boundary that creates checkout or accepts a qualified lead, accept only the six normalized attribution keys. Never accept arbitrary browser metadata into provider metadata.
For Stripe-capable products, attach compact source identifiers to Checkout Session metadata so a verified fulfillment/webhook handler can emit `purchase_completed` using the same source record. Do not put PII into creator-network attribution properties.
For lead-gen, generate/retain a server-side lead ID in the product system; emit only the non-PII session/lead correlation token plus source attribution to the collector. The product system remains authority for lead contents.
For Gumroad A Player Mode, do not claim purchase attribution until an actual supported return/webhook or transaction reconciliation seam is implemented and proven.
