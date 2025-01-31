;; EcoDex Points Token Contract

(define-fungible-token eco-points)

;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-insufficient-funds (err u101))

;; Public functions
(define-public (mint (amount uint) (recipient principal))
  (if (is-eq tx-sender contract-owner)
    (ft-mint? eco-points amount recipient)
    err-owner-only
  )
)

(define-public (transfer (amount uint) (recipient principal))
  (ft-transfer? eco-points amount tx-sender recipient)
)

;; Read only functions  
(define-read-only (get-balance (account principal))
  (ok (ft-get-balance eco-points account))
)
