import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#f3f3f3] text-[#1e2330]">
      <header className="border-b border-[#e5e5e5] bg-[#fafafa]">
        <nav aria-label="Primary" className="mx-auto max-w-[1600px] px-6">
          <ul className="flex min-h-[68px] flex-wrap items-center justify-center gap-x-10 gap-y-2 text-[15px] font-semibold uppercase tracking-[0.16em] text-[#8d939f]">
            <li><Link href="#">Ristorante</Link></li>
            <li><Link href="#">Prenota Ora</Link></li>
            <li><Link href="#">Shop</Link></li>
            <li><Link href="#">Cibi e Vini</Link></li>
            <li><Link href="#">Produttori</Link></li>
            <li><Link href="#">Eventi</Link></li>
            <li><Link href="#">Contatti</Link></li>
          </ul>
        </nav>
      </header>

      <section className="mx-auto grid max-w-[1600px] md:grid-cols-2">
        <div className="min-h-[650px]">
          <img
            src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1400&q=80"
            alt="Pagina del menù degustazione su tavolo del ristorante"
            className="h-full w-full object-cover"
          />
        </div>
        <article className="flex min-h-[650px] items-center bg-[#f1f1f1] px-8 py-14 sm:px-14 md:px-16 lg:px-20">
          <div className="max-w-[520px] space-y-10">
            <h1 className="text-4xl font-semibold uppercase tracking-[0.08em] text-[#1d2533] sm:text-5xl">
              Menù Degustazione
            </h1>
            <div className="space-y-7 text-[33px] leading-[1.65] text-[#1f2532] sm:text-[34px]">
              <p>
                Il nostro <strong className="font-semibold">menù degustazione</strong> da 5 portate consigliate da noi. Fatevi coccolare!
              </p>
              <p>
                I piatti scelti dovranno essere <strong className="font-semibold">uguali</strong> per tutti i componenti del tavolo.
              </p>
            </div>
            <ul className="space-y-2 text-[34px] leading-[1.45] text-[#1f2532]">
              <li><strong className="font-semibold">Degustazione 5 portate</strong> (no bevande) €70</li>
              <li><strong className="font-semibold">Abbinamento vini 3 calici</strong> €25</li>
              <li><strong className="font-semibold">Abbinamento vini 5 calici</strong> €45</li>
            </ul>
          </div>
        </article>
      </section>

      <footer className="bg-[#232429] py-10 text-center text-xl text-[#8f9094] sm:text-2xl">
        <p>
          BONCELLI 1 SRL - Via Pisacane 24, 20129 Milano MI - P IVA 06221220962 Privacy Policy - Cookie Policy
        </p>
      </footer>
    </main>
  );
}
