import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, Plus, X, ChevronDown, ChevronRight } from "lucide-react";
import { useAuth } from "../../providers/auth.provider";
import { DeadlineService } from "../../services/deadline.service";

interface DeadlinesScreenProps {
  deadlines: any[];
  setDeadlines: React.Dispatch<React.SetStateAction<any[]>>;
  applications: any[];
  setSelectedApp: (app: any) => void;
  setCurrentScreen: (screen: string) => void;
  simulateDatabaseFailure: boolean;
  isDark: boolean;
  themeCardClass: string;
  themeInputBg: string;
  themeBorderClass: string;
  showToast: (message: string, type: "success" | "warning" | "error" | "info") => void;
}

export const DeadlinesScreen: React.FC<DeadlinesScreenProps> = ({
  deadlines,
  setDeadlines,
  simulateDatabaseFailure,
  isDark,
  showToast
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [isCompletedCollapsed, setIsCompletedCollapsed] = useState(true);
  const [activePrepId, setActivePrepId] = useState<string | null>(null);

  const [prepChecklists, setPrepChecklists] = useState<Record<string, string[]>>(() => {
    try {
      const saved = localStorage.getItem("schedules_prep_checklist_simple");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem("schedules_prep_checklist_simple", JSON.stringify(prepChecklists));
  }, [prepChecklists]);

  const [newTitle, setNewTitle] = useState("");
  const [newCompany, setNewCompany] = useState("");
  const [newType, setNewType] = useState("Interview");
  const [newTime, setNewTime] = useState("10:00");
  const [newNotes, setNewNotes] = useState("");

  const auth = useAuth();
  const deadlineService = React.useMemo(() => new DeadlineService(), []);

  const handleToggleEvent = async (id: string) => {
    if (simulateDatabaseFailure) {
      showToast("Outage Simulator active. Request aborted.", "error");
      return;
    }

    const current = deadlines.find((d) => d.id === id);
    if (!current) return;

    const nextCompleted = !current.completed;
    setDeadlines((prev) =>
      prev.map((dl) => (dl.id === id ? { ...dl, completed: nextCompleted, updatedAt: new Date().toISOString() } : dl))
    );
    showToast(nextCompleted ? "Milestone completed!" : "Milestone reopened", "success");

    if (auth.user) {
      const res = await deadlineService.markCompleted(id, nextCompleted);
      if (res.error) {
        setDeadlines((prev) =>
          prev.map((dl) => (dl.id === id ? { ...dl, completed: !nextCompleted } : dl))
        );
        showToast(`Update failed: ${res.error}`, "error");
      }
    }
  };

  const handleAddSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      showToast("Please enter a title", "warning");
      return;
    }

    const tempId = `dl_${Date.now()}`;
    const newEvent = {
      id: tempId,
      title: newTitle.trim(),
      company: newCompany.trim() || "Personal",
      type: newType,
      dueDate: new Date().toISOString().split("T")[0],
      dueTime: newTime || "12:00",
      priority: "High",
      notes: newNotes.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setDeadlines((prev) => [newEvent, ...prev]);
    showToast(`Added: ${newTitle}`, "success");
    setNewTitle("");
    setNewCompany("");
    setNewNotes("");
    setShowAddForm(false);

    if (auth.user) {
      const res = await deadlineService.createDeadline(auth.user.id, {
        title: newEvent.title,
        deadline_type: newEvent.type,
        due_date: newEvent.dueDate,
        due_time: newEvent.dueTime,
        priority: newEvent.priority,
        notes: newEvent.notes,
        is_completed: false,
      });

      if (res.error) {
        setDeadlines((prev) => prev.filter((d) => d.id !== tempId));
        showToast(`Failed to persist deadline: ${res.error}`, "error");
        return;
      }

      if (res.deadline) {
        setDeadlines((prev) =>
          prev.map((d) => (d.id === tempId ? { ...d, id: res.deadline!.id } : d))
        );
      }
    }
  };



  const getColorStyles = (type: string, isCompleted: boolean) => {
    if (isCompleted) {
      return isDark ? {
        text: "text-[#30D158]",
        bg: "bg-[#30D158]/15",
        dot: "bg-[#30D158]"
      } : {
        text: "text-[#1C692E]",
        bg: "bg-[#248A3D]/10",
        dot: "bg-[#248A3D]"
      };
    }

    const t = type.toLowerCase();
    if (t.includes("interview")) {
      return isDark ? {
        text: "text-[#409CFF]",
        bg: "bg-[#409CFF]/15",
        dot: "bg-[#409CFF]"
      } : {
        text: "text-[#0055D4]",
        bg: "bg-[#007AFF]/10",
        dot: "bg-[#007AFF]"
      };
    } else if (t.includes("assessment") || t.includes("oa")) {
      return isDark ? {
        text: "text-[#FF9F0A]",
        bg: "bg-[#FF9F0A]/15",
        dot: "bg-[#FF9F0A]"
      } : {
        text: "text-[#A35200]",
        bg: "bg-[#FF9500]/10",
        dot: "bg-[#FF9500]"
      };
    } else if (t.includes("reminder") || t.includes("note") || t.includes("review")) {
      return isDark ? {
        text: "text-[#BF5AF2]",
        bg: "bg-[#BF5AF2]/15",
        dot: "bg-[#BF5AF2]"
      } : {
        text: "text-[#7A1FA2]",
        bg: "bg-[#AF52DE]/10",
        dot: "bg-[#AF52DE]"
      };
    } else {
      return isDark ? {
        text: "text-zinc-200",
        bg: "bg-zinc-800",
        dot: "bg-zinc-400"
      } : {
        text: "text-zinc-800",
        bg: "bg-zinc-100",
        dot: "bg-zinc-600"
      };
    }
  };

  const activeSchedules = deadlines.filter(d => !d.completed);
  const completedSchedules = deadlines.filter(d => d.completed);

  const todayEvents = activeSchedules
    .filter(d => d.dueDate === "2026-07-20")
    .sort((a, b) => a.dueTime.localeCompare(b.dueTime));

  const nextEvent = [...activeSchedules]
    .sort((a, b) => {
      const dateCompare = a.dueDate.localeCompare(b.dueDate);
      if (dateCompare !== 0) return dateCompare;
      return a.dueTime.localeCompare(b.dueTime);
    })[0];

  const upcomingEvents = activeSchedules
    .filter(d => d.dueDate > "2026-07-20")
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  const toggleChecklistTask = (eventId: string, task: string) => {
    const list = prepChecklists[eventId] || [];
    const updated = list.includes(task) ? list.filter(t => t !== task) : [...list, task];
    setPrepChecklists({ ...prepChecklists, [eventId]: updated });
  };

  const cardClass = isDark
    ? "bg-[#1C1C1E] border border-white/[0.06] rounded-[24px]"
    : "bg-white border border-zinc-200/60 rounded-[24px] shadow-[0_4px_24px_rgba(0,0,0,0.02)]";

  const textPrimary = isDark ? "text-white" : "text-zinc-900";
  const textSecondary = isDark ? "text-zinc-300" : "text-zinc-600";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 pb-20 font-sans text-left max-w-lg mx-auto px-2.5 relative"
    >
      <div className="flex items-center justify-between pt-2">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-450 block leading-none">
            Today's Schedule
          </span>
          <h1 className={`text-lg font-bold mt-1.5 tracking-tight ${textPrimary}`}>
            Monday, July 20
          </h1>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all border ${
            isDark
              ? "bg-[#1C1C1E] border-white/[0.08] hover:bg-zinc-800 text-zinc-200"
              : "bg-white border-zinc-250 hover:bg-zinc-50 text-zinc-800"
          } cursor-pointer`}
        >
          {showAddForm ? <X size={14} /> : <Plus size={14} />}
        </button>
      </div>

      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <form onSubmit={handleAddSchedule} className={`${cardClass} p-5 space-y-3.5`}>
              <div className="space-y-1">
                <label className="text-[9px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Milestone Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Google Interview"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className={`w-full h-9 px-3 rounded-lg text-xs outline-none border transition-all placeholder-zinc-400 dark:placeholder-zinc-550 ${
                    isDark 
                      ? "bg-zinc-900 border-white/[0.08] text-white focus:border-zinc-700" 
                      : "bg-white border-zinc-300 text-zinc-900 focus:border-zinc-400"
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Company</label>
                  <input
                    type="text"
                    placeholder="e.g. Google"
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                    className={`w-full h-9 px-3 rounded-lg text-xs outline-none border transition-all placeholder-zinc-400 dark:placeholder-zinc-550 ${
                      isDark 
                        ? "bg-zinc-900 border-white/[0.08] text-white focus:border-zinc-700" 
                        : "bg-white border-zinc-300 text-zinc-900 focus:border-zinc-400"
                    }`}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    className={`w-full h-9 px-2 rounded-lg text-xs outline-none border transition-all ${
                      isDark 
                        ? "bg-zinc-900 border-white/[0.08] text-white focus:border-zinc-700" 
                        : "bg-white border-zinc-300 text-zinc-900 focus:border-zinc-400"
                    }`}
                  >
                    <option value="Interview">Interview</option>
                    <option value="Online Assessment">OA</option>
                    <option value="Reminder">Reminder</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Time</label>
                  <input
                    type="time"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className={`w-full h-9 px-3 rounded-lg text-xs outline-none border transition-all ${
                      isDark 
                        ? "bg-zinc-900 border-white/[0.08] text-white focus:border-zinc-700" 
                        : "bg-white border-zinc-300 text-zinc-900 focus:border-zinc-400"
                    }`}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Notes</label>
                  <input
                    type="text"
                    placeholder="Review core coding topics"
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    className={`w-full h-9 px-3 rounded-lg text-xs outline-none border transition-all placeholder-zinc-400 dark:placeholder-zinc-550 ${
                      isDark 
                        ? "bg-zinc-900 border-white/[0.08] text-white focus:border-zinc-700" 
                        : "bg-white border-zinc-300 text-zinc-900 focus:border-zinc-400"
                    }`}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full h-9 rounded-lg bg-zinc-900 hover:bg-black text-white dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-950 text-xs font-bold transition-all cursor-pointer shadow-sm"
              >
                Save
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="popLayout">
        {nextEvent && (
          <motion.div
            key={nextEvent.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`${cardClass} p-5 relative overflow-hidden`}
          >
            <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${getColorStyles(nextEvent.type, false).dot}`} />

            <div className="pl-2 space-y-3">
              <div className="flex items-center justify-between">
                <span className={`text-[9.5px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${getColorStyles(nextEvent.type, false).text} ${getColorStyles(nextEvent.type, false).bg}`}>
                  {nextEvent.type}
                </span>
                <span className={`text-[10px] font-bold ${textSecondary}`}>Next up</span>
              </div>

              <div>
                <h3 className={`text-base font-bold tracking-tight ${textPrimary}`}>
                  {nextEvent.company && nextEvent.company !== "Personal" ? `${nextEvent.company} • ` : ""}{nextEvent.title}
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-300 mt-1 font-medium">
                  Today • {nextEvent.dueTime}
                </p>
              </div>

              <div className="flex items-center justify-between pt-1.5 border-t border-zinc-100/10 dark:border-white/[0.04]">
                <p className="text-[10px] text-zinc-500 dark:text-zinc-400 italic max-w-[200px] truncate leading-none">
                  {nextEvent.notes ? `"${nextEvent.notes}"` : "Prepare for milestone"}
                </p>
                <button
                  onClick={() => setActivePrepId(activePrepId === nextEvent.id ? null : nextEvent.id)}
                  className={`px-3.5 py-1.5 rounded-full text-[10.5px] font-bold text-white transition-colors cursor-pointer ${
                    getColorStyles(nextEvent.type, false).dot === "bg-[#409CFF]" || getColorStyles(nextEvent.type, false).dot === "bg-[#007AFF]"
                      ? "bg-[#007AFF] hover:bg-blue-600"
                      : getColorStyles(nextEvent.type, false).dot === "bg-[#FF9F0A]" || getColorStyles(nextEvent.type, false).dot === "bg-[#FF9500]"
                      ? "bg-[#FF9500] hover:bg-orange-600"
                      : "bg-[#AF52DE] hover:bg-purple-600"
                  }`}
                >
                  {activePrepId === nextEvent.id ? "Close" : "Prepare"}
                </button>
              </div>

              {activePrepId === nextEvent.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="pt-3.5 space-y-2 border-t border-zinc-100/10 dark:border-white/[0.04]"
                >
                  <p className="text-[9.5px] font-bold uppercase tracking-widest text-zinc-400 block mb-1">
                    Quick Steps
                  </p>
                  {[
                    "Review core concepts & resume projects",
                    "Verify webcam & audio connections",
                    "Formulate questions for the interviewer"
                  ].map((task, idx) => {
                    const list = prepChecklists[nextEvent.id] || [];
                    const isChecked = list.includes(task);
                    return (
                      <div
                        key={idx}
                        className="flex items-center space-x-2.5 cursor-pointer"
                        onClick={() => toggleChecklistTask(nextEvent.id, task)}
                      >
                        <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-all text-white ${
                          isChecked ? "bg-blue-500 border-blue-500" : isDark ? "border-zinc-700 bg-zinc-900" : "border-zinc-300 bg-white"
                        }`}>
                          {isChecked && <Check size={8} className="stroke-[3.5]" />}
                        </span>
                        <span className={`text-[11px] font-medium leading-none ${isChecked ? "line-through text-zinc-500" : textSecondary}`}>
                          {task}
                        </span>
                      </div>
                    );
                  })}
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-405 uppercase tracking-widest font-sans block">
          Today's Timeline
        </span>

        <div className="relative">
          {todayEvents.length > 0 && (
            <div className={`absolute left-[72px] top-3 bottom-3 w-[1px] ${isDark ? "bg-zinc-800" : "bg-zinc-200"}`} />
          )}

          {todayEvents.length === 0 ? (
            <p className="text-[11px] text-zinc-500 italic py-2 pl-2">No other milestones scheduled today.</p>
          ) : (
            <div className="space-y-4">
              {todayEvents.map((event) => {
                const styles = getColorStyles(event.type, false);
                return (
                  <div key={event.id} className="flex items-center gap-4 min-h-[28px]">
                    <div className="w-12 text-right shrink-0">
                      <span className="text-[11px] font-bold font-mono text-zinc-500 dark:text-zinc-400">
                        {event.dueTime}
                      </span>
                    </div>

                    <div className="relative flex items-center justify-center w-4 h-4 shrink-0 z-10">
                      <button
                        onClick={() => handleToggleEvent(event.id)}
                        className={`w-2.5 h-2.5 rounded-full border border-transparent transition-all ${styles.dot} cursor-pointer hover:scale-125`}
                        title="Complete milestone"
                      />
                    </div>

                    <div className="flex-1 min-w-0 flex items-center justify-between gap-2.5">
                      <span className={`text-[12.5px] font-semibold truncate ${textPrimary}`}>
                        {event.title}
                      </span>
                      <span className={`text-[8.5px] font-bold px-1.5 py-0.5 rounded shrink-0 ${styles.text} ${styles.bg}`}>
                        {event.company}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-405 uppercase tracking-widest font-sans block">
          Upcoming
        </span>

        <div className={`${cardClass} p-2 divide-y ${isDark ? "divide-white/[0.06]" : "divide-zinc-100"}`}>
          {upcomingEvents.length === 0 ? (
            <div className="p-4 text-center">
              <p className="text-[11px] text-zinc-500 font-medium">No upcoming milestone events scheduled.</p>
            </div>
          ) : (
            upcomingEvents.map((item) => {
              const styles = getColorStyles(item.type, false);
              return (
                <div key={item.id} className="p-3 flex items-center justify-between hover:opacity-90 transition-opacity">
                  <div className="flex items-center space-x-3 min-w-0">
                    <span className={`w-2 h-2 rounded-full ${styles.dot} shrink-0`} />
                    <div className="min-w-0">
                      <h4 className={`text-[11.5px] font-bold truncate ${textPrimary}`}>
                        {item.company}
                      </h4>
                      <p className="text-[10px] text-zinc-500 dark:text-zinc-300 truncate font-medium">
                        {item.title}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10.5px] font-bold text-zinc-500 dark:text-zinc-300 font-sans shrink-0 ml-2">
                    {item.dueDate}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="space-y-2">
        <button
          onClick={() => setIsCompletedCollapsed(!isCompletedCollapsed)}
          className="flex items-center justify-between w-full text-[10px] font-bold text-zinc-500 dark:text-zinc-405 uppercase tracking-widest font-sans py-1 cursor-pointer focus:outline-none"
        >
          <span>Completed Today ({completedSchedules.length})</span>
          {isCompletedCollapsed ? <ChevronRight size={13} /> : <ChevronDown size={13} />}
        </button>

        <AnimatePresence>
          {!isCompletedCollapsed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className={`${cardClass} p-2 divide-y ${isDark ? "divide-white/[0.06]" : "divide-zinc-100"}`}>
                {completedSchedules.length === 0 ? (
                  <p className="text-[10.5px] text-zinc-500 italic p-3 text-center">No completed tasks today.</p>
                ) : (
                  completedSchedules.map((item) => (
                    <div key={item.id} className="p-3 flex items-center justify-between opacity-70">
                      <div className="flex items-center space-x-3 min-w-0">
                        <button
                          onClick={() => handleToggleEvent(item.id)}
                          className="w-4 h-4 rounded-full bg-[#34C759] flex items-center justify-center shrink-0 cursor-pointer"
                        >
                          <Check size={9} className="text-white stroke-[3.5]" />
                        </button>
                        <div className="min-w-0">
                          <h4 className="text-[11.5px] font-bold text-zinc-500 dark:text-zinc-400 line-through truncate">
                            {item.title}
                          </h4>
                          <p className="text-[9.5px] text-zinc-500 dark:text-zinc-300 truncate">
                            {item.company} • {item.type}
                          </p>
                        </div>
                      </div>
                      <span className="text-[9px] text-zinc-500 dark:text-zinc-300 font-bold uppercase shrink-0 ml-2">
                        Done
                      </span>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
