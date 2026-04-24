import { wishlistSeed } from "../lib/mock-data";

export function WishlistPage() {
  return (
    <main className="container" style={{ padding: "2rem 0" }}>
      <div className="section-heading" style={{ marginBottom: "1rem" }}>
        <div>
          <h1 className="page-title" style={{ margin: 0 }}>
            Wishlist
          </h1>
          <p className="muted">
            Saved spots live here until they graduate into a route.
          </p>
        </div>
      </div>

      <div className="card-grid">
        {wishlistSeed.map((item) => (
          <article className="list-card" key={item.id}>
            <div className="row-between">
              <strong>
                {item.emoji} {item.name}
              </strong>
              <span className="pill">{item.region}</span>
            </div>
            <p className="muted">{item.address}</p>
            <p>{item.note}</p>
            <div className="summary-row">
              <button type="button" className="button">
                Add to new itinerary
              </button>
              <button type="button" className="ghost-button">
                Add to existing
              </button>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
