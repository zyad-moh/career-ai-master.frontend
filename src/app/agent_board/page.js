"use client";

import { useState } from "react";
import { interviewApi } from "@/lib/agent_api";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();

  const [form, setForm] = useState({
    subject: "",
    body: "",
    from_email: "",
    candidate_email: "",
  });

  const [loading, setLoading] = useState(false);

  const createInterview = async () => {
    try {
      setLoading(true);

      const data =
        await interviewApi.triggerInterview(form);

      router.push(
        `/interviews/${data.interview_id}`
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8">
        Interview Agent Dashboard
      </h1>

      <div className="bg-slate-900 rounded-xl p-6 space-y-4">
        <input
          className="w-full p-3 rounded bg-slate-800"
          placeholder="Subject"
          value={form.subject}
          onChange={(e) =>
            setForm({
              ...form,
              subject: e.target.value,
            })
          }
        />

        <textarea
          rows={8}
          className="w-full p-3 rounded bg-slate-800"
          placeholder="Email Body"
          value={form.body}
          onChange={(e) =>
            setForm({
              ...form,
              body: e.target.value,
            })
          }
        />

        <input
          className="w-full p-3 rounded bg-slate-800"
          placeholder="From Email"
          value={form.from_email}
          onChange={(e) =>
            setForm({
              ...form,
              from_email: e.target.value,
            })
          }
        />

        <input
          className="w-full p-3 rounded bg-slate-800"
          placeholder="Candidate Email"
          value={form.candidate_email}
          onChange={(e) =>
            setForm({
              ...form,
              candidate_email: e.target.value,
            })
          }
        />

        <button
          onClick={createInterview}
          disabled={loading}
          className="px-6 py-3 rounded bg-cyan-500"
        >
          {loading
            ? "Creating..."
            : "Create Interview"}
        </button>
      </div>
    </div>
  );
}