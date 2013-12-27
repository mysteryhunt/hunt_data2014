;; Solution for SKI Trees in Scheme

;; This is implements SKI calculus as lambdas.

;; Church numeral is applied to a successor function and zero.
;; The resulting value is the value of the Church numeral.


;; SKI combinators
(define s (lambda (x) (lambda (y) (lambda (z) ((x z) (y z))))))
(define k (lambda (x) (lambda (y) x)))
(define i (lambda (x) x))

;; successor function
(define succ (lambda (n) (+ n 1)))

;; resort trees
(define canyons
  ((s (((i (i s)) (k s)) k)) ((s (((i s) (k s)) k)) i)))
(define okemo
  ((s ((s (k s)) k)) ((s ((s (k s)) (i k))) ((((k k) i) i) (i i)))))
(define panorama
  (((i s) (((i s) (k s)) k)) (((i s) ((s (k s)) k)) ((s ((s (k s)) k)) i))))
(define steamboat
  (((s i) (i i)) ((s ((s (k s)) k)) ((k (i (i (i (i i))))) (s (k i))))))
(define sugarloaf
  ((s ((s (k s)) k)) (((s i) i) ((s ((s (k (i s))) (i k))) (i i)))))
(define sunvalley
  ((((s i) ((i k) ((i s) (i ((s (k s)) k))))) (i i)) (i i)))
(define telluride
  ((((s ((i i) (i (k s)))) k) ((s ((s (k s)) (i (i (i k))))) (k i))) i))
(define tremblant
  (((s ((s (k s)) k)) ((s ((s (k s)) k)) i)) ((s ((s (k s)) k)) i)))
(define vail
  ((s ((s (k s)) k)) (((k i) i) (i (i (i ((s (i ((s (k s)) k))) i)))))))
(define watervillevalley
  (((s i) (k (((i s) ((s (k s)) k)) i))) (((i s) i) i)))
(define whistlerblackcomb
  (((s ((((k s) k) i) i)) (i i)) ((i (i i)) ((((k s) i) ((s (k s)) k)) i))))

(define resorts (list
		 canyons okemo panorama steamboat
                 sugarloaf sunvalley telluride tremblant
		 vail watervillevalley whistlerblackcomb))

;; for each resort, apply expression to successor and 0 and display result
(let loop ((lst resorts))
  (if (null? lst)
      'done
      (begin (display (((car lst) succ) 0))
	     (newline)
	     (loop (cdr lst)))))
