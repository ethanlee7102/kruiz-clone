
import { useEffect, useMemo, useState } from "react";
import "./shop.css";
import shirt1 from "./assets/shirt1.png";
import shirt2 from "./assets/shirt2.png";
import { heart, heartOutline } from "ionicons/icons";
import { IonIcon } from "@ionic/react";



type Product = { id: string; name: string; priceText?: string; image?: string };

const PER_PAGE = 16;

export default function ShopPage() {
    const [original, setOriginal] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [sort, setSort] = useState<"default" | "az" | "za">("default");
    const [page, setPage] = useState(1);

    const [likes, setLikes] = useState<Set<string>>(() => {
        //local storage for wishlist (backend not implemented if it uses it)
        try { return new Set(JSON.parse(localStorage.getItem("likes") || "[]")); }
        catch { return new Set(); }
    });
    const [modalOpen, setModalOpen] = useState(false);
    const [modalProduct, setModalProduct] = useState<Product | null>(null);
    const [showWishlistOnly, setShowWishlistOnly] = useState(false);

    useEffect(() => {
        localStorage.setItem("likes", JSON.stringify([...likes]));
    }, [likes]);

    const toggleLike = (id: string) => {
        setLikes(prev => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
                const product = original.find(p => p.id === id);
                if (product) {
                    setModalProduct(product);
                    setModalOpen(true);
                }
            }
            return next;
        });
    };



    useEffect(() => {
        (async () => {
            try {
                const res = await fetch("/data/products.json", { cache: "no-store" });
                const data = await res.json();
                setOriginal(data);
            } finally { setLoading(false); }
        })();
    }, []);

    const products = useMemo(() => {
        let base = original;
        if (showWishlistOnly) {
            base = base.filter(p => likes.has(p.id));
        }

        if (sort === "default") return base;
        const copy = [...base];
        copy.sort((a, b) => sort === "az" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name));
        return copy;
    }, [original, sort, showWishlistOnly, likes]);


    const totalPages = Math.max(1, Math.ceil(products.length / PER_PAGE));
    const start = (page - 1) * PER_PAGE;
    const pageItems = products.slice(start, start + PER_PAGE);



    return (
        <main className="kruiz-container">

            <div className="shirt-pic-container">
                <img src={shirt1} className="picture"></img>
                <img src={shirt2} className="picture"></img>
            </div>

            <div className="travel-title">

                <p className="travel">
                    Travel & everyday essentials
                </p>

                <p> Ready for ever day, built for every journey - essentials for you and your pet.</p>
            </div>

            <p className="wishlist-title">{showWishlistOnly ? 'Wishlist' : ''}</p>
            <header className="kruiz-shop-header">
                <p className="kruiz-results">
                    Showing {products.length ? start + 1 : 0}–{Math.min(start + PER_PAGE, products.length)} of {products.length} results
                </p>

                <div className="kruiz-controls">
                    {showWishlistOnly ? (
                        <button
                            className="return-to-shop"
                            onClick={() => { 
                                setShowWishlistOnly(false); 
                                setPage(1); 
                            }}
                            title="Show all products"
                        >
                            Return to shop
                        </button>
                    ) : null}

                    <select
                        className="select-menu"
                        value={sort}
                        onChange={(e) => { setSort(e.target.value as any); setPage(1); }}
                    >
                        <option value="az">Name A→Z</option>
                        <option value="za">Name Z→A</option>
                        <option value="default">Default</option>
                    </select>
                </div>

            </header>


            {loading ? (
                <div className="loading">Loading…</div>
            ) : (
                <ul className="products">
                    {pageItems.map((p) => (

                        <li key={p.id} className="product">
                            <a className="LoopProduct-link">

                                <div className="product-thumb">
                                    <button
                                        className={`wish-btn ${likes.has(p.id) ? "is-liked" : ""}`}

                                        onClick={
                                            (e) => { 
                                                e.preventDefault(); 
                                                e.stopPropagation(); 
                                                toggleLike(p.id); 
                                            }
                                        }
                                        aria-label={likes.has(p.id) ? "Remove from favorites" : "Add to favorites"}
                                    >
                                        <IonIcon icon={likes.has(p.id) ? heart : heartOutline} />
                                    </button>

                                    {p.image ? <img src={p.image} alt={p.name} loading="lazy" /> : <div className="product-thumb-fallback" />}
                                </div>

                                <h2 className="loop-product__title">{p.name}</h2>
                                {p.priceText && <span className="price">{p.priceText}</span>}
                            </a>

                            <div className="button-container">
                                <button className="button add_to_cart_button" onClick={
                                    () => alert(`Added: ${p.name} (this is a placeholder btw!)`)
                                }>
                                    Add+
                                </button>
                                <button className="button quick_view_button" onClick={
                                    () => alert(`Quick View: ${p.name} (this is a placeholder btw!)`)
                                }>
                                    Quick View
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {modalOpen && modalProduct && (
                <div className="modal-backdrop" onClick={() => setModalOpen(false)}>

                    <div
                        className="modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <p>
                            {modalProduct.name} added to wishlist!
                        </p>


                        <div className="modal-options">
                            <button className="modal-wishlist" onClick={() => {
                                setShowWishlistOnly(true);
                                setPage(1);
                                setModalOpen(false);
                                document.querySelector(".products")?.scrollIntoView({ behavior: "smooth" });
                            }}>♡ View Wishlist</button>
                            <button className="modal-dismiss" onClick={() => setModalOpen(false)}>× Close</button>
                        </div>
                    </div>

                </div>
            )}

            <nav className="pagination" aria-label="Product Pagination">
                <ul className="page-numbers">
                    <li>
                        <button className="page-numbers prev" disabled={page <= 1} onClick={
                            () => setPage(p => Math.max(1, p - 1))
                        }>←</button>
                    </li>

                    <li><span className="page-numbers current">{page}</span></li>
                    <li>
                        <button className="page-numbers next" disabled={page >= totalPages} onClick={
                            () => setPage(p => Math.min(totalPages, p + 1))
                        }>→</button>
                    </li>
                </ul>
            </nav>
        </main>
    );
}
