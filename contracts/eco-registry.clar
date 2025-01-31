;; EcoDex Product Registry Contract

;; Data structures
(define-map products 
  { product-id: uint }
  {
    name: (string-ascii 64),
    manufacturer: principal,
    category: (string-ascii 32),
    sustainability-score: uint,
    verified: bool
  }
)

(define-map product-metrics
  { product-id: uint }
  {
    carbon-footprint: uint,
    recycled-materials: uint,
    renewable-energy: uint
  }
)

;; Constants
(define-data-var next-product-id uint u0)
(define-constant contract-owner tx-sender)
(define-constant err-not-authorized (err u100))
(define-constant err-invalid-score (err u101))

;; Public functions
(define-public (register-product 
  (name (string-ascii 64))
  (category (string-ascii 32))
  (sustainability-score uint)
)
  (let ((product-id (var-get next-product-id)))
    ;; Only allow scores between 0-100
    (if (> sustainability-score u100)
      err-invalid-score
      (begin
        (map-set products
          {product-id: product-id}
          {
            name: name,
            manufacturer: tx-sender,
            category: category,
            sustainability-score: sustainability-score,
            verified: false
          }
        )
        (var-set next-product-id (+ product-id u1))
        (ok product-id)
      )
    )
  )
)

(define-public (update-metrics
  (product-id uint)
  (carbon uint)
  (recycled uint) 
  (renewable uint)
)
  (let ((product (unwrap! (get-product product-id) err-not-authorized)))
    (if (is-eq tx-sender (get manufacturer product))
      (begin 
        (map-set product-metrics
          {product-id: product-id}
          {
            carbon-footprint: carbon,
            recycled-materials: recycled,
            renewable-energy: renewable
          }
        )
        (ok true)
      )
      err-not-authorized
    )
  )
)

;; Read only functions
(define-read-only (get-product (product-id uint))
  (map-get? products {product-id: product-id})
)

(define-read-only (get-metrics (product-id uint))
  (map-get? product-metrics {product-id: product-id})
)
