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
    ? "bg-[#121214] border border-zinc-800 rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.25)]"
    : "bg-white border border-zinc-200 rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.03)]";

  const textPrimary = isDark ? "text-white" : "text-zinc-900";
  const textSecondary = isDark ? "text-zinc-300" : "text-zinc-650";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 pb-4 font-sans text-left relative"
    >
      <div className="flex items-center justify-between pt-4">
        <div>
          <span className="text-[11px] font-semibold tracking-wider text-zinc-550 dark:text-zinc-500 uppercase block mb-1.5 leading-none">
            Today's Milestones
          </span>
          <h1 className={`text-[34px] font-extrabold tracking-tight leading-[1.1] ${textPrimary}`}>
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
          </h1>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95, opacity: 0.85 }}
          onClick={() => setShowAddForm(!showAddForm)}
          className={`w-11 h-11 rounded-full flex items-center justify-center transition-all border shadow-lg cursor-pointer ${
            isDark
              ? "bg-[#18181C] border-[#252529] hover:bg-[#202025] text-zinc-100"
              : "bg-white border-zinc-200 hover:bg-zinc-50 text-zinc-900 shadow-sm"
          }`}
        >
          {showAddForm ? <X size={20} /> : <Plus size={20} />}
        </motion.button>
      </div>

      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <form onSubmit={handleAddSchedule} className={`${isDark ? "bg-[#18181C] border-[#252529]" : "bg-white border-zinc-200"} p-5 rounded-[22px] border space-y-4`}>
              <div className="space-y-1">
                <label className="text-[10px] font-bold tracking-wider text-zinc-500 uppercase block">Milestone Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Google Interview"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className={`w-full h-12 px-3.5 rounded-xl text-sm font-semibold outline-none border transition-all placeholder-zinc-500 ${
                    isDark 
                      ? "bg-zinc-900 border-zinc-800 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20" 
                      : "bg-white border-zinc-300 text-zinc-900 focus:border-blue-500"
                  }`}
                />
              </div>

              <div className="grid grid-cols-1 min-[360px]:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold tracking-wider text-zinc-500 uppercase block">Company</label>
                  <input
                    type="text"
                    placeholder="e.g. Google"
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                    className={`w-full h-12 px-3.5 rounded-xl text-sm font-semibold outline-none border transition-all placeholder-zinc-500 ${
                      isDark 
                        ? "bg-zinc-900 border-zinc-800 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20" 
                        : "bg-white border-zinc-300 text-zinc-900 focus:border-blue-500"
                    }`}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold tracking-wider text-zinc-500 uppercase block">Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    className={`w-full h-12 px-3.5 rounded-xl text-sm font-semibold outline-none border transition-all ${
                      isDark 
                        ? "bg-zinc-900 border-zinc-800 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20" 
                        : "bg-white border-zinc-300 text-zinc-900 focus:border-blue-500"
                    }`}
                  >
                    <option value="Interview">Interview</option>
                    <option value="Online Assessment">OA</option>
                    <option value="Reminder">Reminder</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 min-[360px]:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold tracking-wider text-zinc-500 uppercase block">Time</label>
                  <input
                    type="time"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className={`w-full h-12 px-3.5 rounded-xl text-sm font-semibold outline-none border transition-all ${
                      isDark 
                        ? "bg-zinc-900 border-zinc-800 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20" 
                        : "bg-white border-zinc-300 text-zinc-900 focus:border-blue-500"
                    }`}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold tracking-wider text-zinc-500 uppercase block">Notes</label>
                  <input
                    type="text"
                    placeholder="Review core coding topics"
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    className={`w-full h-12 px-3.5 rounded-xl text-sm font-semibold outline-none border transition-all placeholder-zinc-500 ${
                      isDark 
                        ? "bg-zinc-900 border-zinc-800 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20" 
                        : "bg-white border-zinc-300 text-zinc-900 focus:border-blue-500"
                    }`}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-550 active:scale-98 text-white text-sm font-bold transition-all cursor-pointer shadow-md shadow-blue-600/10"
              >
                Save Milestone
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
            className={`p-6 rounded-[22px] border relative overflow-hidden text-left ${
              isDark 
                ? "bg-[#18181C] border-[#252529] shadow-[0_16px_36px_rgba(0,0,0,0.6)]" 
                : "bg-white border-zinc-200 shadow-md shadow-zinc-200/40"
            }`}
          >
            <div className={`absolute left-0 top-4 bottom-4 w-1 ${getColorStyles(nextEvent.type, false).dot} rounded-r-full`} />

            <div className="pl-3.5 space-y-3.5 font-sans">
              <div className="flex items-center justify-between">
                <span className={`text-[10px] tracking-wider font-sans font-bold uppercase select-none px-2.5 py-0.5 rounded-full border leading-none ${
                  nextEvent.type.toLowerCase().includes("interview") ? (isDark ? "bg-blue-500/[0.08] border-blue-500/[0.18] text-blue-400" : "bg-blue-50 border-blue-200/60 text-blue-700") :
                  nextEvent.type.toLowerCase().includes("assessment") || nextEvent.type.toLowerCase().includes("oa") ? (isDark ? "bg-amber-500/[0.08] border-amber-500/[0.18] text-amber-400" : "bg-amber-50 border-amber-200/60 text-amber-700") :
                  (isDark ? "bg-zinc-800/40 border-zinc-750 text-zinc-450" : "bg-zinc-100 border-zinc-200 text-zinc-600")
                }`}>
                  {nextEvent.type}
                </span>
                <span className="text-[10px] text-zinc-500 font-bold tracking-wider uppercase leading-none">NEXT UP</span>
              </div>

              <div>
                <h3 className={`text-lg font-extrabold tracking-tight leading-snug ${textPrimary}`}>
                  {nextEvent.company && nextEvent.company !== "Personal" ? `${nextEvent.company} • ` : ""}{nextEvent.title}
                </h3>
                <p className="text-xs text-zinc-400 font-bold tracking-wide mt-1.5">
                  Today • {nextEvent.dueTime}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-zinc-800/40">
                <p className="text-xs text-zinc-550 dark:text-zinc-500 italic max-w-[200px] truncate leading-none">
                  {nextEvent.notes ? `"${nextEvent.notes}"` : "Prepare for milestone"}
                </p>
                <button
                  onClick={() => setActivePrepId(activePrepId === nextEvent.id ? null : nextEvent.id)}
                  className={`px-4.5 h-8.5 rounded-full text-xs font-bold text-white transition-all cursor-pointer active:scale-95 flex items-center justify-center ${
                    getColorStyles(nextEvent.type, false).dot.includes("blue")
                      ? "bg-blue-600 hover:bg-blue-500 shadow-sm shadow-blue-500/10"
                      : getColorStyles(nextEvent.type, false).dot.includes("amber") || getColorStyles(nextEvent.type, false).dot.includes("orange")
                      ? "bg-orange-500 hover:bg-orange-600 shadow-sm shadow-orange-500/10"
                      : "bg-purple-600 hover:bg-purple-550 shadow-sm shadow-purple-500/10"
                  }`}
                >
                  {activePrepId === nextEvent.id ? "Close" : "Prepare"}
                </button>
              </div>

              {activePrepId === nextEvent.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="pt-4 space-y-3 border-t border-zinc-800/40"
                >
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 font-mono">
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
                        className="flex items-center space-x-3 cursor-pointer"
                        onClick={() => toggleChecklistTask(nextEvent.id, task)}
                      >
                        <span className={`w-4.5 h-4.5 rounded-[5px] border flex items-center justify-center transition-all text-white shrink-0 ${
                          isChecked ? "bg-blue-500 border-blue-500" : isDark ? "border-zinc-800 bg-zinc-900" : "border-zinc-305 bg-white"
                        }`}>
                          {isChecked && <Check size={11} className="stroke-[3.5]" />}
                        </span>
                        <span className={`text-xs font-semibold leading-none ${isChecked ? "line-through text-zinc-500" : textSecondary}`}>
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

      <div className="space-y-4 text-left">
        <span className="text-[10px] font-bold text-zinc-505 dark:text-zinc-500 uppercase tracking-wider block px-1 leading-none">
          Today's Timeline
        </span>

        <div className="relative">
          {todayEvents.length > 0 && (
            <div className={`absolute left-[80px] top-4.5 bottom-4.5 w-[1px] ${isDark ? "bg-zinc-850" : "bg-zinc-200"}`} />
          )}

          {todayEvents.length === 0 ? (
            <div className={`py-8 text-center text-zinc-500 text-xs p-4 rounded-[16px] border ${
              isDark ? "bg-[#18181C]/40 border-zinc-850" : "bg-white border-zinc-200"
            }`}>
              <span className="text-zinc-505 dark:text-zinc-400 font-bold block mb-1">No Active Milestones</span>
              <span className="text-[11px] text-zinc-500">Your timeline is completely clear for the rest of today.</span>
            </div>
          ) : (
            <div className="space-y-4">
              {todayEvents.map((event) => {
                const styles = getColorStyles(event.type, false);
                return (
                  <div key={event.id} className="flex items-center gap-4 min-h-[32px]">
                    <div className="w-14 text-right shrink-0">
                      <span className="text-xs font-bold font-mono text-zinc-400">
                        {event.dueTime}
                      </span>
                    </div>

                    <div className="relative flex items-center justify-center w-5 h-5 shrink-0 z-10">
                      <button
                        onClick={() => handleToggleEvent(event.id)}
                        className={`w-3.5 h-3.5 rounded-full border border-transparent transition-all ${styles.dot} cursor-pointer hover:scale-125`}
                        title="Complete milestone"
                      />
                    </div>

                    <div className={`flex-1 p-4 rounded-xl border flex items-center justify-between gap-2.5 transition-colors duration-150 ${
                      isDark ? "bg-[#18181C] border-[#252529] hover:border-zinc-700" : "bg-white border-zinc-200/80 hover:border-zinc-300"
                    }`}>
                      <div className="min-w-0">
                        <h4 className={`text-sm font-bold truncate leading-none ${textPrimary}`}>
                          {event.title}
                        </h4>
                        <span className="text-[10px] text-zinc-500 font-semibold block mt-1.5 leading-none">{event.company}</span>
                      </div>
                      <span className={`text-[9.5px] font-extrabold px-1.5 py-0.5 rounded shrink-0 ${styles.text} ${styles.bg} border border-[#27272A]/10`}>
                        {event.type}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3 text-left">
        <span className="text-[10px] font-bold text-zinc-505 dark:text-zinc-500 uppercase tracking-wider block px-1 leading-none">
          Upcoming
        </span>

        <div className={`p-6 rounded-[22px] border divide-y ${
          isDark 
            ? "bg-[#18181C] border-[#252529] shadow-[0_12px_24px_rgba(0,0,0,0.5)] divide-zinc-800/40" 
            : "bg-white border-zinc-200 shadow-sm divide-zinc-100"
        }`}>
          {upcomingEvents.length === 0 ? (
            <div className="py-8 text-center text-zinc-550 text-xs">
              <span className="text-zinc-505 dark:text-zinc-400 font-bold block mb-1">No Upcoming Schedules</span>
              <span className="text-[11px] text-zinc-500">Add an interview or OA to start tracking deadlines.</span>
            </div>
          ) : (
            upcomingEvents.map((item) => {
              const styles = getColorStyles(item.type, false);
              return (
                <div key={item.id} className="py-3 flex items-center justify-between hover:opacity-95 transition-opacity">
                  <div className="flex items-center space-x-3.5 min-w-0 flex-1">
                    <span className={`w-2 h-2 rounded-full ${styles.dot} shrink-0`} />
                    <div className="min-w-0 flex-1 text-left">
                      <h4 className={`text-sm font-extrabold truncate leading-none ${textPrimary}`}>
                        {item.company}
                      </h4>
                      <p className="text-xs text-zinc-400 truncate mt-1.5 font-semibold">
                        {item.title}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-450 bg-zinc-800/30 border border-zinc-850 px-2 py-0.5 rounded-md shrink-0 ml-2 select-none">
                    {item.dueDate}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="space-y-2 text-left">
        <button
          onClick={() => setIsCompletedCollapsed(!isCompletedCollapsed)}
          className="flex items-center justify-between w-full text-[10px] font-bold text-zinc-555 dark:text-zinc-450 uppercase tracking-wider py-1 cursor-pointer focus:outline-none"
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
              <div className={`p-6 rounded-[22px] border divide-y ${
                isDark 
                  ? "bg-[#18181C] border-[#252529] divide-zinc-800/40" 
                  : "bg-white border-zinc-200 divide-zinc-100"
              }`}>
                {completedSchedules.length === 0 ? (
                  <p className="text-xs text-zinc-500 italic p-3 text-center select-none font-semibold">No completed tasks today.</p>
                ) : (
                  completedSchedules.map((item) => (
                    <div key={item.id} className="p-3 flex items-center justify-between opacity-70">
                      <div className="flex items-center space-x-3 min-w-0 flex-1">
                        <button
                          onClick={() => handleToggleEvent(item.id)}
                          className="w-4 h-4 rounded-full bg-[#34C759] flex items-center justify-center shrink-0 cursor-pointer"
                        >
                          <Check size={9} className="text-white stroke-[3.5]" />
                        </button>
                        <div className="min-w-0 flex-1 text-left">
                          <h4 className="text-xs font-bold text-zinc-400 line-through truncate leading-none">
                            {item.title}
                          </h4>
                          <p className="text-[10px] text-zinc-500 mt-1 leading-none truncate font-semibold">
                            {item.company} • {item.type}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] text-zinc-505 dark:text-zinc-500 font-bold uppercase shrink-0 ml-2 select-none">
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
