import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { createRecord, listRecords, toJsDate } from "../services/firestoreService";

const CalendarPage = () => {
  const { user } = useAuth();
  const [meetings, setMeetings] = useState([]);
  const [posts, setPosts] = useState([]);
  const [meetingForm, setMeetingForm] = useState({
    title: "",
    date: "",
    time: "",
    participants: "",
    notes: "",
  });

  const loadData = async () => {
    if (!user?.id) return;
    const [meetingData, postData] = await Promise.all([
      listRecords("meetings", user.id, "date", "asc"),
      listRecords("contentPosts", user.id, "scheduled_date", "asc"),
    ]);
    setMeetings(meetingData);
    setPosts(postData);
  };

  useEffect(() => {
    loadData();
  }, [user?.id]);

  const onSubmit = async (event) => {
    event.preventDefault();
    await createRecord(
      "meetings",
      {
      ...meetingForm,
      participants: meetingForm.participants
        .split(",")
        .map((name) => name.trim())
        .filter(Boolean),
      },
      user.id
    );
    setMeetingForm({ title: "", date: "", time: "", participants: "", notes: "" });
    loadData();
  };

  const timeline = useMemo(() => {
    const meetingEvents = meetings.map((meeting) => ({
      id: meeting.id,
      type: "Meeting",
      title: meeting.title,
      date: meeting.date,
      details: `${meeting.time} | ${meeting.participants.join(", ")}`,
    }));
    const contentEvents = posts.map((post) => ({
      id: post.id,
      type: "Content",
      title: post.title,
      date: post.scheduled_date,
      details: post.platform,
    }));
    return [...meetingEvents, ...contentEvents].sort(
      (a, b) => toJsDate(a.date).getTime() - toJsDate(b.date).getTime()
    );
  }, [meetings, posts]);

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-semibold">Calendar & Meetings</h2>
      <form onSubmit={onSubmit} className="rounded-lg bg-white p-4 shadow-sm">
        <h3 className="mb-2 font-semibold">Schedule Meeting</h3>
        <div className="grid gap-2 md:grid-cols-2">
          <input className="rounded border p-2" placeholder="Title" value={meetingForm.title} onChange={(e) => setMeetingForm({ ...meetingForm, title: e.target.value })} required />
          <input className="rounded border p-2" type="date" value={meetingForm.date} onChange={(e) => setMeetingForm({ ...meetingForm, date: e.target.value })} required />
          <input className="rounded border p-2" type="time" value={meetingForm.time} onChange={(e) => setMeetingForm({ ...meetingForm, time: e.target.value })} required />
          <input className="rounded border p-2" placeholder="Participants (comma separated)" value={meetingForm.participants} onChange={(e) => setMeetingForm({ ...meetingForm, participants: e.target.value })} />
          <textarea className="rounded border p-2 md:col-span-2" placeholder="Notes" value={meetingForm.notes} onChange={(e) => setMeetingForm({ ...meetingForm, notes: e.target.value })} />
          <button className="rounded bg-indigo-600 px-3 py-2 text-white md:col-span-2">Add Meeting</button>
        </div>
      </form>
      <div className="rounded-lg bg-white p-4 shadow-sm">
        <h3 className="mb-3 font-semibold">Calendar-style Timeline</h3>
        <div className="space-y-2">
          {timeline.map((item) => (
            <div key={`${item.type}-${item.id}`} className="rounded border p-3">
              <p className="text-xs uppercase text-slate-500">{item.type}</p>
              <p className="font-semibold">{item.title}</p>
              <p className="text-sm text-slate-600">
                {toJsDate(item.date).toLocaleDateString()} - {item.details}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CalendarPage;
