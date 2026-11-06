import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="bg-black px-6 py-4 text-white flex flex-col items-center gap-4">
      <h1 className="text-2xl font-bold text-amber-100">
        Your ledger starts with today's numbers.
      </h1>

      <Link
        to="/ledger"
        className="rounded-lg bg-blue-500 px-4 py-2 font-semibold hover:bg-blue-600"
      >
        Start ledger →
      </Link>
    </div>
  );
};

export default Footer;