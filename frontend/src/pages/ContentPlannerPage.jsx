import { useEffect, useState } from "react";
import api from "../services/api";

const ContentPlannerPage = () => {
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState({
    title: "",
    platform: "LinkedIn",
    content: "",
    scheduled_date: "",
    status: "scheduled",
  });

  const loadPosts = async () => {
    const { data } = await api.get("/content");
    setPosts(data);
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    await api.post("/content", form);
    setForm({ title: "", platform: "LinkedIn", content: "", scheduled_date: "", status: "scheduled" });
    loadPosts();
  };

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-semibold">Content Planner</h2>
      <form onSubmit={onSubmit} className="rounded-lg bg-white p-4 shadow-sm">
        <div className="grid gap-2">
          <input className="rounded border p-2" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <input className="rounded border p-2" placeholder="Platform" value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })} required />
          <textarea className="rounded border p-2" placeholder="Post content" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required />
          <input className="rounded border p-2" type="date" value={form.scheduled_date} onChange={(e) => setForm({ ...form, scheduled_date: e.target.value })} required />
          <button className="rounded bg-indigo-600 px-3 py-2 text-white">Schedule Post</button>
        </div>
      </form>
      <div className="grid gap-3 md:grid-cols-2">
        {posts.map((post) => (
          <div key={post._id} className="rounded-lg bg-white p-4 shadow-sm">
            <p className="font-semibold">{post.title}</p>
            <p className="text-sm text-slate-600">{post.platform}</p>
            <p className="mt-2 text-sm">{post.content}</p>
            <p className="mt-1 text-xs text-slate-500">
              {new Date(post.scheduled_date).toLocaleDateString()} - {post.status}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ContentPlannerPage;
