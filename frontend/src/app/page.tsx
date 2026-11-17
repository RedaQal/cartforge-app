import { Suspense } from "react";

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
};

async function ProductList() {
  const res = await fetch(`${process.env.CATALOG_API_URL}/api/products`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Catalog service returned ${res.status}`);
  }
  const products: Product[] = await res.json();

  return (
    <ul style={{ listStyle: "none", padding: 0 }}>
      {products.map((p) => (
        <li key={p.id} style={{ padding: "12px 0", borderBottom: "1px solid #ddd" }}>
          <strong>{p.name}</strong>: ${p.price} ({p.stock} in stock)
          <br />
          <small>{p.description}</small>
        </li>
      ))}
    </ul>
  );
}

export default function Home() {
  return (
    <main style={{ padding: 24, maxWidth: 800, margin: "0 auto" }}>
      <h1>CartForge</h1>
      <Suspense fallback={<p>Loading products…</p>}>
        <ProductList />
      </Suspense>
    </main>
  );
}