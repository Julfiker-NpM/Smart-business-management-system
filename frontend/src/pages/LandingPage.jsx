import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
        <h1 className="text-lg font-semibold">Smart Business Management</h1>
        <Link
          to="/login"
          className="rounded border border-slate-600 px-4 py-2 text-sm hover:bg-slate-800"
        >
          Login
        </Link>
      </header>

      <main className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-16 md:grid-cols-2 md:py-24">
        <section>
          <p className="mb-3 text-sm uppercase tracking-wider text-indigo-300">All-in-one platform</p>
          <h2 className="text-4xl font-bold leading-tight md:text-5xl">
            Run CRM, tasks, communication, and content from one dashboard.
          </h2>
          <p className="mt-5 text-slate-300">
            Manage leads, follow-ups, meetings, and social content planning without jumping between
            tools.
          </p>
          <div className="mt-8 flex gap-3">
            <Link
              to="/login"
              className="rounded bg-indigo-600 px-5 py-3 text-sm font-medium hover:bg-indigo-500"
            >
              Get Started
            </Link>
            <a href="#features" className="rounded border border-slate-600 px-5 py-3 text-sm hover:bg-slate-800">
              Learn More
            </a>
          </div>
        </section>

        <section className="rounded-2xl bg-slate-900 p-6">
          <h3 className="mb-4 text-xl font-semibold">What you get</h3>
          <ul className="space-y-3 text-sm text-slate-300">
            <li>CRM pipeline with lead follow-up automation</li>
            <li>Task + meeting tracking with timeline view</li>
            <li>Message logging with quick templates</li>
            <li>Content planner for social scheduling</li>
            <li>Business stats dashboard in one place</li>
          </ul>
        </section>
      </main>

      <section id="features" className="mx-auto w-full max-w-6xl px-6 pb-20">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { title: "CRM", desc: "Track clients and move leads through a clear pipeline." },
            { title: "Execution", desc: "Create tasks and meetings so nothing is missed." },
            { title: "Growth", desc: "Plan content and keep customer communication organized." },
          ].map((item) => (
            <article key={item.title} className="rounded-xl border border-slate-800 bg-slate-900 p-5">
              <h4 className="font-semibold">{item.title}</h4>
              <p className="mt-2 text-sm text-slate-300">{item.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <footer className="border-t border-slate-800 px-6 py-6 text-center text-xs text-slate-400">
        <p>All rights reserved. Md Julfikar Hasan.</p>
        <p className="mt-1">Built by Md Julfikar Hasan.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
