// A sample statement on the login page. Only decoration: it shows what the app does
// (every payment gets a score and a status, and suspicious ones get a reason).

const rows = [
  { time: '09:41:12', what: 'Grocery', city: 'Pune', amount: '₹1,240', score: '0', status: 'Clean' },
  { time: '09:41:47', what: 'Electronics', city: 'Pune', amount: '₹18,900', score: '25', status: 'Clean' },
  {
    time: '09:42:03',
    what: 'Travel',
    city: 'Mumbai',
    amount: '₹32,000',
    score: '65',
    status: 'Suspicious',
    reason: 'Two cities and four devices were used within 40 minutes, which is unusual for one account.',
  },
  { time: '09:42:09', what: 'Fuel', city: 'Pune', amount: '₹800', score: 'Scoring', status: 'Pending' },
];

const stampStyle = {
  Clean: 'border-mint bg-mint/10 text-mint -rotate-3',
  Suspicious: 'border-coral bg-coral/10 text-coral -rotate-6 stamp-in',
  Pending: 'border-dashed border-amber bg-amber/10 text-amber',
};

export default function Ledger() {
  return (
    <div className="glass w-full max-w-2xl overflow-hidden">
      <div className="border-b border-white/15 px-5 py-5">
        <p className="font-display text-xl font-semibold">Statement</p>
        <p className="text-sm text-white/70">Each payment is scored a few seconds after it arrives.</p>
      </div>

      <div className="hidden grid-cols-[4.5rem_1fr_5.5rem_3.5rem_7rem] gap-x-4 border-b border-white/15 px-5 py-2.5 text-xs text-white/65 sm:grid">
        <span>Time</span>
        <span>Payment</span>
        <span className="text-right">Amount</span>
        <span className="text-right">Score</span>
        <span className="text-right">Status</span>
      </div>

      <ol>
        {rows.map((r) => (
          <li
            key={r.time}
            className="grid grid-cols-[1fr_auto_auto] items-center gap-x-4 gap-y-1 border-b border-white/10 px-5 py-4 last:border-b-0 sm:grid-cols-[4.5rem_1fr_5.5rem_3.5rem_7rem]"
          >
            <span className="hidden text-sm tabular-nums text-white/65 sm:block">{r.time}</span>

            <span>
              <span className="block font-medium">{r.what}</span>
              <span className="block text-sm text-white/65">{r.city}</span>
            </span>

            <span className="text-right tabular-nums">{r.amount}</span>

            <span className={`hidden text-right tabular-nums sm:block ${r.status === 'Pending' ? 'text-sm text-amber' : ''}`}>
              {r.score}
            </span>

            <span className="flex justify-end">
              <span
                className={`inline-block rounded-md border-2 px-2 py-0.5 font-display text-sm font-semibold ${stampStyle[r.status]}`}
              >
                {r.status}
              </span>
            </span>

            {r.reason && (
              <p className="col-span-full mt-2 border-l-2 border-coral pl-3 text-sm text-white/75">{r.reason}</p>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
