import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { createRecord, listRecords, toJsDate } from "../services/firestoreService";

const defaultTemplates = [
  { id: "t1", title: "Follow-up", body: "Hi {{name}}, just checking in on our previous conversation." },
  { id: "t2", title: "Meeting Reminder", body: "Reminder: our meeting is scheduled for {{date}} at {{time}}." },
];

const MessagesPage = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [clients, setClients] = useState([]);
  const [templates] = useState(defaultTemplates);
  const [form, setForm] = useState({ client_id: "", message_text: "", type: "sent" });

  const loadData = async () => {
    if (!user?.id) return;
    const [messagesData, clientsData] = await Promise.all([
      listRecords("messages", user.id),
      listRecords("clients", user.id),
    ]);
    setMessages(messagesData);
    setClients(clientsData);
  };

  useEffect(() => {
    loadData();
  }, [user?.id]);

  const onSubmit = async (event) => {
    event.preventDefault();
    await createRecord(
      "messages",
      {
        ...form,
        sent_at: new Date().toISOString(),
      },
      user.id
    );
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
              <option key={client.id} value={client.id}>{client.name}</option>
            ))}
          </select>
          <select className="rounded border p-2" onChange={(e) => {
            const selected = templates.find((template) => template.id === e.target.value);
            if (selected) setForm((prev) => ({ ...prev, message_text: selected.body }));
          }}>
            <option value="">Use a template</option>
            {templates.map((template) => (
              <option key={template.id} value={template.id}>{template.title}</option>
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
          <div key={message.id} className="rounded-lg bg-white p-4 shadow-sm">
            <p className="font-medium">
              {clients.find((client) => client.id === message.client_id)?.name || "Unknown client"}
            </p>
            <p>{message.message_text}</p>
            <p className="text-xs text-slate-500">
              {message.type} at {toJsDate(message.sent_at).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MessagesPage;
