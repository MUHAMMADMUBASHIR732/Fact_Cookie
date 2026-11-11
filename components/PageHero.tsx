// Dark rounded header band shared by the inner marketing pages.
export function PageHero({ title, text }: { title: string; text: string }) {
  return (
    <section className="px-4 pt-3 sm:px-6">
      <div className="band mx-auto max-w-7xl rounded-[2rem] border border-line px-8 py-14 sm:px-12 sm:py-16">
        <h1 className="slide-in max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
        <p className="slide-in mt-4 max-w-2xl text-lg leading-relaxed text-muted">{text}</p>
      </div>
    </section>
  );
}
