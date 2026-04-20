import { useEffect, useState } from "react";
import api from "../services/api";

const MessagesPage = () => {
  const [messages, setMessages] = useState([]);
  const [clients, setClients] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [form, setForm] = useState({ client_id: "", message_text: "", type: "sent" });

  const loadData = async () => {
    const [messagesRes, clientsRes, templatesRes] = await Promise.all([
      api.get("/messages"),
      api.get("/clients"),
      api.get("/messages/templates"),
    ]);
    setMessages(messagesRes.data);
    setClients(clientsRes.data);
    setTemplates(templatesRes.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    await api.post("/messages", form);
    setForm({ client_id: "", message_text: "", type: "sent" });
    loadData();
  };

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-semibold">Communication Center</h2>
      <form onSubmit={onSubmit} className="rounded-lg bg-white p-4 shadow-sm">
        <div className="grid gap-2">
          <select className="rounded border p-2" value={form.client_id} onChange={(e) => setForm({ ...form, client_id: e.target.value })} required>
            <option value="">Select client</option>
            {clients.map((client) => (
              <option key={client._id} value={client._id}>{client.name}</option>
            ))}
          </select>
          <select className="rounded border p-2" onChange={(e) => {
            const selected = templates.find((template) => template._id === e.target.value);
            if (selected) setForm((prev) => ({ ...prev, message_text: selected.body }));
          }}>
            <option value="">Use a template</option>
            {templates.map((template) => (
              <option key={template._id} value={template._id}>{template.title}</option>
            ))}
          </select>
          <textarea className="rounded border p-2" placeholder="Message text" value={form.message_text} onChange={(e) => setForm({ ...form, message_text: e.target.value })} required />
          <select className="rounded border p-2" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
            <option value="sent">Sent</option>
            <option value="received">Received</option>
          </select>
          <button className="rounded bg-indigo-600 px-3 py-2 text-white">Log Message</button>
        </div>
      </form>
      <div className="space-y-2">
        {messages.map((message) => (
          <div key={message._id} className="rounded-lg bg-white p-4 shadow-sm">
            <p className="font-medium">{message.client_id?.name || "Unknown client"}</p>
            <p>{message.message_text}</p>
            <p className="text-xs text-slate-500">
              {message.type} at {new Date(message.sent_at).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MessagesPage;
