const Footer = () => {
  return (
    <div className="flex flex-col items-center gap-5 bg-black px-6 py-10 text-center text-white sm:py-12">
      <h1 className="max-w-xs text-xl font-bold leading-snug text-amber-100 sm:max-w-sm sm:text-2xl md:max-w-md md:text-3xl">
        Your ledger starts with today's numbers.
      </h1>
      <button className="rounded-lg bg-blue-500 px-5 py-2.5 font-semibold transition hover:bg-blue-600">
        Start ledger →
      </button>
    </div>
  );
};

export default Footer;