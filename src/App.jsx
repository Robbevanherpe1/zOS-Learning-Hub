import { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronUp,
  PlayCircle,
  Link as LinkIcon,
  Code2,
  BookOpen,
  PenTool,
  CheckCircle,
  Menu,
  X,
  ArrowLeft,
  History,
  Terminal,
  Braces,
  Server,
  Bug,
  GitMerge,
  Moon,
  Sun
} from "lucide-react";
import { toSafeHtmlFromTheory } from "./utils/richText";

const THEME_KEY = "hub-theme";

const courses = [
  {
    title: "Origins and Evolution of PL/I and CICS",
    id: "pl1-cics-history",
    Icon: History,
    blurb: "Timeline, design goals, and why these technologies stuck around on z/OS.",
    iconWrap:
      "border-amber-600/30 bg-amber-100/90 text-amber-900 dark:border-white/[0.12] dark:bg-transparent dark:text-amber-400"
  },
  {
    title: "Environment Setup and ISPF Fundamentals",
    id: "setup-basics",
    Icon: Terminal,
    blurb: "Editors, data sets, and the day-to-day mechanics of working on the mainframe.",
    iconWrap:
      "border-sky-600/30 bg-sky-100/90 text-sky-900 dark:border-white/[0.12] dark:bg-transparent dark:text-sky-400"
  },
  {
    title: "PL/I Core Concepts",
    id: "pl1-core",
    Icon: Braces,
    blurb: "Declarations, control flow, and the language features you will use every day.",
    iconWrap:
      "border-violet-600/30 bg-violet-100/90 text-violet-900 dark:border-white/[0.12] dark:bg-transparent dark:text-violet-400"
  },
  {
    title: "CICS Core Concepts",
    id: "cics-core",
    Icon: Server,
    blurb: "Transactions, regions, and how request-driven workloads behave under CICS.",
    iconWrap:
      "border-emerald-600/30 bg-emerald-100/90 text-emerald-900 dark:border-white/[0.12] dark:bg-transparent dark:text-emerald-400"
  },
  {
    title: "Debugging Basics",
    id: "debugging",
    Icon: Bug,
    blurb: "Readable dumps, common failure modes, and a practical troubleshooting mindset.",
    iconWrap:
      "border-rose-600/30 bg-rose-100/90 text-rose-900 dark:border-white/[0.12] dark:bg-transparent dark:text-rose-400"
  },
  {
    title: "PL/I and CICS Integration Mastery",
    id: "pl1-cics-mastery",
    Icon: GitMerge,
    blurb: "End-to-end patterns that tie PL/I programs to CICS resources and interfaces.",
    iconWrap:
      "border-cyan-600/30 bg-cyan-100/90 text-cyan-900 dark:border-white/[0.12] dark:bg-transparent dark:text-cyan-400"
  }
];

function readInitialDark() {
  if (typeof window === "undefined") return true;
  return localStorage.getItem(THEME_KEY) !== "light";
}

export default function App() {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dark, setDark] = useState(readInitialDark);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem(THEME_KEY, dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => {
    if (selectedCourse) {
      setLoading(true);
      import(`./courses/${selectedCourse.id}/index.json`)
        .then(module => {
          setCourseData(module.default);
          setLoading(false);
        })
        .catch(err => {
          console.error("Failed to load course data:", err);
          setLoading(false);
          // geen json geladen 
          setCourseData({
            id: selectedCourse.id,
            title: selectedCourse.title,
            description: "",
            simple: selectedCourse.id.includes("origins") || selectedCourse.id.includes("evolution"),
            chapters: selectedCourse.id.includes("origins") || selectedCourse.id.includes("evolution")
              ? [{ title: "Overview", parts: ["Theory", "Final Quiz"] }]
              : [
                  { title: "Introduction", parts: ["Theory", "Exercise", "Final Quiz"] },
                  { title: "Core Concepts", parts: ["Theory", "Exercise", "Final Quiz"] },
                  { title: "Advanced Topics", parts: ["Theory", "Exercise", "Final Quiz"] }
                ],
            resources: []
          });
        });
    }
  }, [selectedCourse]);

  return (
    <div className="min-h-dvh flex flex-col bg-app-page text-app transition-colors duration-300">
      <header className="app-header-bar backdrop-blur-xl sticky top-0 z-50 shrink-0 flex justify-between items-center gap-3 px-5 md:px-8 py-3.5 md:py-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="app-header-icon p-2 shrink-0">
            <Code2 size={20} strokeWidth={1.75} aria-hidden />
          </div>
          <div className="leading-tight min-w-0">
            <h1 className="text-[17px] md:text-lg font-semibold tracking-tight text-app-title">
              z/OS Learning Hub
            </h1>
            <p className="text-[11px] text-app-label hidden sm:block">PL/I · CICS</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setDark((d) => !d)}
          className="theme-toggle inline-flex min-h-[40px] min-w-[40px] shrink-0 items-center justify-center p-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--app-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--app-ring-offset)]"
          aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
        >
          {dark ? <Sun size={20} strokeWidth={1.75} aria-hidden /> : <Moon size={20} strokeWidth={1.75} aria-hidden />}
        </button>
      </header>

      {!selectedCourse ? (
        <div className="flex-1 max-w-5xl mx-auto w-full px-4 md:px-8 pb-24 pt-12 md:pt-16">
          <div className="max-w-2xl mb-12 md:mb-14">
            <p className="text-[11px] uppercase tracking-[0.2em] text-app-label mb-5 font-medium">
              Curriculum
            </p>
            <h2 className="text-[1.6rem] sm:text-3xl md:text-[2.05rem] font-semibold tracking-tight text-app-title leading-[1.22] text-balance">
                PL/I and CICS learning with theory, hands on exercises, and quizzes.
            </h2>
            <p className="mt-5 text-[15px] md:text-base text-app-soft leading-relaxed">
              By Robbe Van Herpe.
            </p>
          </div>

          <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-3.5 md:gap-4">
            {courses.map((course) => {
              const CourseIcon = course.Icon;
              return (
                <div
                  key={course.id}
                  onClick={() => setSelectedCourse(course)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelectedCourse(course);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={`Open ${course.title}`}
                  className="group app-card-home p-5 md:p-6 cursor-pointer transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--app-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--app-ring-offset)]"
                >
                  <div className="flex gap-4 md:gap-5">
                    <div
                      className={`shrink-0 w-11 h-11 md:w-12 md:h-12 rounded-lg border flex items-center justify-center ${course.iconWrap}`}
                      aria-hidden
                    >
                      <CourseIcon size={20} strokeWidth={1.75} />
                    </div>
                    <div className="min-w-0 flex-1 pt-0.5">
                      <h2 className="text-[15px] md:text-base font-semibold text-app leading-snug group-hover:text-app-title transition-colors">
                        {course.title}
                      </h2>
                      <p className="mt-2 text-sm text-app-muted leading-relaxed transition-colors">
                        {course.blurb}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
          <CoursePage
            key={`${selectedCourse.id}:${courseData ? "ready" : "loading"}`}
            course={selectedCourse}
            courseData={courseData}
            loading={loading}
            goBack={() => {
              setSelectedCourse(null);
              setCourseData(null);
            }}
          />
        </div>
      )}
    </div>
  );
}

function CoursePage({ course, courseData, loading, goBack }) {
  const initialSelectedPart = courseData?.chapters?.[0]?.parts?.[0] || "Theory";
  const [openChapter, setOpenChapter] = useState(0);
  const [selectedChapter, setSelectedChapter] = useState(0);
  const [selectedPart, setSelectedPart] = useState(initialSelectedPart);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex flex-1 min-h-0 items-center justify-center px-4 bg-app-page">
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-10 w-10 border-2 mx-auto mb-4 border-[color:var(--app-spinner-track)] border-t-[color:var(--app-spinner-top)]"
            aria-hidden
          />
          <p className="text-sm text-app-muted">Loading course…</p>
        </div>
      </div>
    );
  }

  if (!courseData) {
    return (
      <div className="flex flex-1 min-h-0 items-center justify-center px-4 bg-app-page">
        <div className="text-center max-w-sm">
          <p className="text-[color:var(--app-error)] mb-4 text-sm">Could not load this course.</p>
          <button
            type="button"
            onClick={goBack}
            className="app-btn-ghost min-h-[44px] px-5 py-2.5 rounded-lg transition-colors w-full sm:w-auto"
          >
            Back to courses
          </button>
        </div>
      </div>
    );
  }

  const chapters = courseData.chapters || [];

  const handlePartClick = (chapterIndex, part) => {
    setSelectedChapter(chapterIndex);
    setSelectedPart(part);
    setOpenChapter(chapterIndex);
    setMobileNavOpen(false);
  };

  const navActive = "app-nav-active";
  const navInactive = "app-nav-inactive";
  const partActive = "app-part-active";
  const partInactive = "app-part-inactive";

  return (
    <div className="flex flex-1 min-h-0 flex-col md:flex-row overflow-hidden bg-app-page text-app">
      <div className="md:hidden shrink-0 z-40 app-mobile-bar backdrop-blur-xl pt-[env(safe-area-inset-top)]">
        <div className="px-3 sm:px-4 py-2.5 flex items-center gap-2">
          <button
            type="button"
            onClick={goBack}
            className="shrink-0 inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-app-link-soft hover:bg-[color:var(--app-nav-idle-hover-bg)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--app-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--app-ring-offset)]"
            aria-label="Back to courses"
          >
            <ArrowLeft size={22} strokeWidth={1.75} aria-hidden />
          </button>

          <div className="min-w-0 flex-1 text-center px-1">
            <div className="text-[13px] font-semibold text-app truncate leading-tight">
              {courseData.title || course.title}
            </div>
            <div className="text-[11px] text-app-muted truncate mt-0.5">
              {chapters[selectedChapter]?.title}
              <span className="text-app-dot"> · </span>
              {selectedPart}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setMobileNavOpen(v => !v)}
            className="shrink-0 inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg theme-toggle transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--app-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--app-ring-offset)]"
            aria-expanded={mobileNavOpen}
            aria-controls="mobile-course-nav"
            aria-label={mobileNavOpen ? "Close outline" : "Open outline"}
          >
            {mobileNavOpen ? <X size={20} className="text-app" strokeWidth={1.75} /> : <Menu size={20} className="text-app" strokeWidth={1.75} />}
          </button>
        </div>

        {mobileNavOpen && (
          <div
            id="mobile-course-nav"
            className="px-3 sm:px-4 pb-[max(1rem,env(safe-area-inset-bottom))] max-h-[min(62vh,520px)] overflow-y-auto overscroll-contain border-t border-[color:var(--app-mobile-border)]"
          >
            <div className="space-y-1.5 pt-3">
              {chapters.map((chapter, i) => (
                <div key={i} className="app-outline-shell">
                  <button
                    type="button"
                    onClick={() => setOpenChapter(openChapter === i ? null : i)}
                    aria-expanded={openChapter === i}
                    aria-controls={`mobile-chapter-${i}`}
                    className={`w-full flex justify-between items-center gap-2 text-left font-medium min-h-[44px] px-3 py-2.5 rounded-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[color:var(--app-ring)] ${
                      openChapter === i ? `${navActive}` : `${navInactive}`
                    }`}
                  >
                    <span className="text-sm leading-snug">{chapter.title}</span>
                    {openChapter === i ? <ChevronUp size={16} className="shrink-0 opacity-70" /> : <ChevronDown size={16} className="shrink-0 opacity-70" />}
                  </button>
                  {openChapter === i && (
                    <ul id={`mobile-chapter-${i}`} className="px-2 pb-2 space-y-1">
                      {chapter.parts.map((part, j) => {
                        const isActive = selectedChapter === i && selectedPart === part;
                        return (
                          <li key={j}>
                            <button
                              type="button"
                              onClick={() => handlePartClick(i, part)}
                              className={`w-full text-left text-sm min-h-[44px] px-3 py-2.5 rounded-lg font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--app-ring)] ${
                                isActive ? partActive : partInactive
                              }`}
                              aria-current={isActive ? "page" : undefined}
                            >
                              {part}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <aside className="hidden md:flex md:flex-col w-72 lg:w-80 flex-shrink-0 min-h-0 app-sidebar backdrop-blur-xl">
        <div className="p-6 lg:p-7 overflow-y-auto overscroll-contain flex-1 min-h-0">
          <button
            type="button"
            onClick={goBack}
            className="group inline-flex items-center gap-2 text-sm text-app-link-soft mb-6 min-h-[40px] px-1 -ml-1 rounded-lg hover:text-app transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--app-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--app-ring-offset)]"
            aria-label="Back to courses"
          >
            <ArrowLeft size={18} strokeWidth={1.75} className="group-hover:-translate-x-0.5 transition-transform" aria-hidden />
            All courses
          </button>
          <p className="text-[11px] uppercase tracking-[0.18em] text-app-label mb-2">Outline</p>
          <h2 className="text-lg font-semibold text-app-title leading-snug mb-6">
            {courseData.title || course.title}
          </h2>
          <div className="space-y-1.5">
            {chapters.map((chapter, i) => (
              <div key={i} className="app-outline-shell">
                <button
                  type="button"
                  onClick={() => setOpenChapter(openChapter === i ? null : i)}
                  aria-expanded={openChapter === i}
                  aria-controls={`chapter-${i}`}
                  className={`w-full flex justify-between items-center gap-2 text-left font-medium px-3.5 py-2.5 rounded-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[color:var(--app-ring)] ${
                    openChapter === i ? navActive : navInactive
                  }`}
                >
                  <span className="text-[15px] leading-snug">{chapter.title}</span>
                  {openChapter === i ? <ChevronUp size={16} className="shrink-0 opacity-70" /> : <ChevronDown size={16} className="shrink-0 opacity-70" />}
                </button>
                {openChapter === i && (
                  <ul id={`chapter-${i}`} className="px-2 pb-2 space-y-1">
                    {chapter.parts.map((part, j) => {
                      const isActive = selectedChapter === i && selectedPart === part;
                      return (
                        <li key={j}>
                          <button
                            type="button"
                            onClick={() => handlePartClick(i, part)}
                            className={`w-full text-left text-sm px-3 py-2 rounded-lg cursor-pointer font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--app-ring)] ${
                              isActive ? partActive : partInactive
                            }`}
                            aria-current={isActive ? "page" : undefined}
                          >
                            {part}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </aside>

      <main className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-4 py-5 sm:px-6 md:px-10 lg:px-12 md:py-8 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
        <div className="max-w-3xl mx-auto w-full min-w-0">
          <div className="mb-5 md:mb-6">
            <span className="text-[11px] uppercase tracking-[0.16em] text-app-label">
              {chapters[selectedChapter]?.title}
              <span className="text-app-dot"> · </span>
              {selectedPart}
            </span>
          </div>

          <h1 className="text-[1.35rem] sm:text-2xl md:text-[1.75rem] font-semibold tracking-tight mb-6 md:mb-8 text-app-title leading-snug text-balance">
            {chapters[selectedChapter]?.title}: {selectedPart}
          </h1>

          {selectedPart === "Theory" && (
            <TheoryContent chapter={chapters[selectedChapter]} course={courseData} />
          )}

          {selectedPart === "Exercise" && (
            <ExerciseContent chapter={chapters[selectedChapter]} course={courseData} />
          )}

          {(selectedPart === "Final Quiz" || selectedPart === "Quiz") && (
            <QuizContent chapter={chapters[selectedChapter]} course={courseData} />
          )}
        </div>
      </main>
    </div>
  );
}

const isLocalVideo = (videoUrl) => {
  if (!videoUrl) return false;
  const lowerUrl = videoUrl.toLowerCase();
  return lowerUrl.endsWith('.mp4') || lowerUrl.endsWith('.mov') || lowerUrl.endsWith('.webm') || lowerUrl.endsWith('.avi') || lowerUrl.endsWith('.mkv');
};

function VideoPlayer({ videoUrl, title }) {
  if (!videoUrl) return null;

  const isLocal = isLocalVideo(videoUrl);
  
  const getVideoSrc = () => {
    if (isLocal) {
      if (videoUrl.startsWith('/')) {
        return videoUrl;
      }

      return `/videos/${videoUrl}`;
    }
    return videoUrl;
  };

  return (
    <div className="mb-6">
      <div className="relative aspect-video app-video-frame rounded-xl md:rounded-2xl overflow-hidden shadow-lg shadow-black/20 dark:shadow-black/30">
        {isLocal ? (
          <video
            src={getVideoSrc()}
            controls
            className="absolute inset-0 w-full h-full object-cover"
            title={title || "Video"}
            preload="metadata"
          >
            Your browser does not support the video tag.
          </video>
        ) : (
          <iframe
            src={getVideoSrc()}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={title || "Video"}
          />
        )}
      </div>
    </div>
  );
}

function TheoryContent({ chapter, course }) {
  const theoryData = chapter?.theory || {};
  const safeHtml =
    toSafeHtmlFromTheory(theoryData) ||
    `<p>Welcome to the theory section for ${chapter?.title || "this chapter"}.</p>`;
  const keyConcepts = theoryData.keyConcepts || [
    "Understanding the fundamental principles and concepts",
    "Learning the theoretical foundations",
    "Exploring real-world applications and examples"
  ];
  const videoUrl = theoryData.video;

  return (
    <div className="space-y-5 md:space-y-6">
      <div className="app-section-panel p-5 sm:p-6 md:p-7">
        <div className="flex items-start gap-3 mb-5 md:mb-6">
          <div
            className="p-2.5 rounded-lg border shrink-0 border-sky-600/30 bg-sky-100/90 text-sky-800 dark:border-white/[0.12] dark:bg-transparent dark:text-sky-400"
            aria-hidden
          >
            <BookOpen size={20} strokeWidth={1.75} />
          </div>
          <div className="min-w-0 pt-0.5">
            <p className="text-[11px] uppercase tracking-[0.16em] text-app-label mb-1">Theory</p>
            <h2 className="text-lg sm:text-xl font-semibold text-app-title leading-snug">
              {chapter?.title || "Chapter"}
            </h2>
          </div>
        </div>

        {keyConcepts && keyConcepts.length > 0 && (
          <div className="app-inset-panel p-4 sm:p-5 mb-6 md:mb-7">
            <h3 className="text-sm font-semibold mb-3 text-[color:var(--app-heading-secondary)]">Key concepts</h3>
            <ul className="space-y-2.5 text-[15px] leading-relaxed text-[color:var(--app-body-secondary)]">
              {keyConcepts.map((concept, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="text-[color:var(--app-key-bullet)] mt-1.5 shrink-0" aria-hidden>
                    ·
                  </span>
                  <span>{concept}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <VideoPlayer videoUrl={videoUrl} title="Theory video" />

        <div
          className="prose max-w-none prose-p:leading-relaxed prose-headings:tracking-tight"
          dangerouslySetInnerHTML={{ __html: safeHtml }}
        />
      </div>

      {course?.resources && course.resources.length > 0 && (
        <div className="app-section-panel p-5 sm:p-6">
          <h3 className="text-sm font-semibold mb-3 text-[color:var(--app-heading-secondary)]">Resources</h3>
          <ul className="space-y-2">
            {course.resources.map((resource, idx) => (
              <li key={idx}>
                <button
                  type="button"
                  className="w-full flex items-center gap-3 min-h-[48px] px-3 py-2.5 rounded-lg app-inset-panel hover:opacity-90 text-left transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--app-ring)]"
                  onClick={() => resource.url && resource.url !== "#" && window.open(resource.url, "_blank")}
                >
                  <LinkIcon size={18} className="text-app-link-soft shrink-0" aria-hidden />
                  <span className="text-[15px] font-medium text-app-link break-words">{resource.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function ExerciseContent({ chapter }) {
  const exerciseData = chapter?.exercise || {};
  const instructions = exerciseData.instructions || "Write your solution in the code editor below.";
  const hint = exerciseData.hint || "";
  const correctAnswer = exerciseData.answer || `PROC OPTIONS(MAIN);
/* Your code goes here */


ENDPROC;`;
  const videoUrl = exerciseData.video;
  
  const [code, setCode] = useState(`PROC OPTIONS(MAIN);
/* Your code goes here */
/* Write your solution below */


ENDPROC;`);
  const [isChecking, setIsChecking] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [checkResult, setCheckResult] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const normalizeCode = (codeStr) => {
    // comments eruit, anders vergelijkt het voor niets
    return codeStr
      .toUpperCase()
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\/\/.*/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  };

  const handleCheckAnswer = () => {
    setIsChecking(true);
    setIsSubmitted(true);
    
    setTimeout(() => {
      const userCodeNormalized = normalizeCode(code);
      const correctCodeNormalized = normalizeCode(correctAnswer);

      const userKeywords = userCodeNormalized.split(/\s+/).filter(w => w.length > 2);
      const correctKeywords = correctCodeNormalized.split(/\s+/).filter(w => w.length > 2);
      const matchingKeywords = userKeywords.filter(kw => correctKeywords.includes(kw));
      const similarity = correctKeywords.length > 0 
        ? (matchingKeywords.length / correctKeywords.length) * 100 
        : 0;

      const hasProc = userCodeNormalized.includes("PROC");
      const hasEndProc = userCodeNormalized.includes("ENDPROC");
      const hasMain = userCodeNormalized.includes("MAIN");

      const feedback = [];
      if (hasProc) feedback.push({ type: "correct", text: "✓ PROC statement found" });
      else feedback.push({ type: "incorrect", text: "✗ Missing PROC statement" });
      
      if (hasEndProc) feedback.push({ type: "correct", text: "✓ ENDPROC statement found" });
      else feedback.push({ type: "incorrect", text: "✗ Missing ENDPROC statement" });
      
      if (hasMain) feedback.push({ type: "correct", text: "✓ MAIN option found" });
      else feedback.push({ type: "warning", text: "⚠ Consider using OPTIONS(MAIN)" });
      
      const score = Math.round(similarity);
      const passed = score >= 70 && hasProc && hasEndProc;
      
      setCheckResult({
        passed,
        score,
        feedback,
        similarity: Math.round(similarity)
      });
      setIsChecking(false);
    }, 800);
  };

  const handleReset = () => {
    setCode(`PROC OPTIONS(MAIN);
/* Your code goes here */
/* Write your solution below */


ENDPROC;`);
    setIsSubmitted(false);
    setCheckResult(null);
    setShowAnswer(false);
  };

  return (
    <div className="app-section-panel p-5 sm:p-6 md:p-7 space-y-6 md:space-y-7">
      <div className="flex items-start gap-3">
        <div
          className="p-2.5 rounded-lg border shrink-0 border-emerald-600/30 bg-emerald-100/90 text-emerald-900 dark:border-white/[0.12] dark:bg-transparent dark:text-emerald-400"
          aria-hidden
        >
          <PenTool size={20} strokeWidth={1.75} />
        </div>
        <div className="min-w-0 pt-0.5">
          <p className="text-[11px] uppercase tracking-[0.16em] text-app-label mb-1">Exercise</p>
          <h2 className="text-lg sm:text-xl font-semibold text-app-title leading-snug">{chapter.title}</h2>
        </div>
      </div>

      <div className="app-inset-panel p-4 sm:p-5">
        <h3 className="text-sm font-semibold mb-2 text-[color:var(--app-heading-secondary)]">Instructions</h3>
        <p className="text-[15px] text-[color:var(--app-body-secondary)] leading-relaxed">{instructions}</p>
        {hint && (
          <div className="mt-4 p-3 rounded-lg app-inset-panel">
            <p className="text-sm leading-relaxed text-[color:var(--app-body-secondary)]">
              <span className="font-medium text-app-link">Hint · </span>
              {hint}
            </p>
          </div>
        )}
      </div>

      <VideoPlayer videoUrl={videoUrl} title="Exercise video" />

      <div className="app-editor-shell rounded-lg p-4 sm:p-5 overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-app-muted">Editor</h4>
          <span className="text-[11px] text-app-label font-mono">PL/I</span>
        </div>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="app-editor-area w-full min-h-[220px] sm:min-h-[280px] md:min-h-[300px] rounded-lg p-3 sm:p-4 font-mono text-[13px] sm:text-sm resize-y focus:outline-none focus:ring-2 focus:ring-[color:var(--app-ring)] overflow-x-auto"
          placeholder="PL/I code…"
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
        />
      </div>

      {checkResult && (
        <div className="app-inset-panel p-4 sm:p-5">
          <div className="flex items-start gap-3 mb-4">
            {checkResult.passed ? (
              <CheckCircle
                className="shrink-0 mt-0.5 text-[color:var(--app-success-icon)]"
                size={22}
                strokeWidth={1.75}
                aria-hidden
              />
            ) : (
              <span className="text-xl shrink-0 text-[color:var(--app-warn-text)]" aria-hidden>
                ⚠
              </span>
            )}
            <div className="min-w-0">
              <h3
                className={`text-base font-semibold ${
                  checkResult.passed ? "text-[color:var(--app-pass-title)]" : "text-[color:var(--app-warn-title)]"
                }`}
              >
                {checkResult.passed ? "Looks good" : "Needs another pass"}
              </h3>
              <p className="text-sm text-app-muted mt-1">
                Similarity {checkResult.similarity}% · Score {checkResult.score}%
              </p>
            </div>
          </div>
          <div className="space-y-1.5">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-app-muted">Checks</h4>
            {checkResult.feedback.map((item, idx) => (
              <div
                key={idx}
                className={`text-sm leading-snug ${
                  item.type === "correct"
                    ? "text-[color:var(--app-success-text)]"
                    : item.type === "incorrect"
                      ? "text-[color:var(--app-error)]"
                      : "text-[color:var(--app-warn-text)]"
                }`}
              >
                {item.text}
              </div>
            ))}
          </div>
        </div>
      )}

      {isSubmitted && (
        <div>
          <button
            type="button"
            onClick={() => setShowAnswer(!showAnswer)}
            className="app-btn-ghost min-h-[44px] w-full sm:w-auto px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            {showAnswer ? "Hide" : "Show"} reference answer
          </button>
          {showAnswer && (
            <div className="mt-4 app-code-block rounded-lg p-4 overflow-x-auto">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-semibold text-app-muted">Reference</h4>
                <span className="text-[11px] text-app-label font-mono">PL/I</span>
              </div>
              <pre className="text-[13px] sm:text-sm whitespace-pre-wrap font-mono break-words sm:break-normal text-[color:var(--app-code-fg)]">
                {correctAnswer}
              </pre>
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col-reverse sm:flex-row sm:flex-wrap gap-3 pt-1">
        <button
          type="button"
          onClick={handleCheckAnswer}
          disabled={isChecking || code.trim().length < 10}
          className="app-btn-primary min-h-[48px] px-5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-45 disabled:cursor-not-allowed sm:min-w-[160px]"
        >
          {isChecking ? "Checking…" : "Check answer"}
        </button>
        {isSubmitted && (
          <button
            type="button"
            onClick={handleReset}
            className="app-btn-ghost min-h-[48px] px-5 rounded-lg text-sm font-medium transition-colors sm:min-w-[120px]"
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
}

function QuizContent({ chapter }) {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(null);
  
  const quizData = chapter?.quiz || {};
  const questions = quizData.questions || [
    {
      id: 1,
      question: "What is the main purpose of this chapter?",
      options: [
        "To understand basic concepts",
        "To learn advanced techniques",
        "To master the fundamentals",
        "All of the above"
      ],
      correct: 3
    }
  ];

  const handleAnswerSelect = (questionId, answerIndex) => {
    if (!isSubmitted) {
      setSelectedAnswers(prev => ({
        ...prev,
        [questionId]: answerIndex
      }));
    }
  };

  const handleSubmitQuiz = () => {
    setIsSubmitted(true);
    setShowResults(true);

    let correct = 0;
    questions.forEach(q => {
      if (selectedAnswers[q.id] === q.correct) {
        correct++;
      }
    });
    
    const percentage = Math.round((correct / questions.length) * 100);
    setScore(percentage);
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
    setShowResults(false);
    setScore(null);
  };

  const getAnswerStatus = (questionId, optionIndex) => {
    if (!showResults) return null;
    const question = questions.find(q => q.id === questionId);
    const isCorrect = optionIndex === question.correct;
    const isSelected = selectedAnswers[questionId] === optionIndex;
    
    if (isCorrect) return "correct";
    if (isSelected && !isCorrect) return "incorrect";
    return null;
  };

  return (
    <div className="app-section-panel p-5 sm:p-6 md:p-7 space-y-6">
      <div className="flex items-start gap-3">
        <div
          className="p-2.5 rounded-lg border shrink-0 border-violet-600/30 bg-violet-100/90 text-violet-900 dark:border-white/[0.12] dark:bg-transparent dark:text-violet-400"
          aria-hidden
        >
          <CheckCircle size={20} strokeWidth={1.75} />
        </div>
        <div className="min-w-0 pt-0.5">
          <p className="text-[11px] uppercase tracking-[0.16em] text-app-label mb-1">Quiz</p>
          <h2 className="text-lg sm:text-xl font-semibold text-app-title leading-snug">{chapter.title}</h2>
        </div>
      </div>

      <p className="text-[15px] text-app-soft leading-relaxed">
        One answer per question. Submit when you have answered all {questions.length}.
      </p>

      {showResults && score !== null && (
        <div className="app-inset-panel p-4 sm:p-5">
          <div className="flex items-start gap-3 mb-2">
            <CheckCircle
              className={`shrink-0 ${score >= 70 ? "text-[color:var(--app-success-icon)]" : "text-[color:var(--app-warn-text)]"}`}
              size={24}
              strokeWidth={1.75}
              aria-hidden
            />
            <div className="min-w-0">
              <h3
                className={`text-base font-semibold ${
                  score >= 70 ? "text-[color:var(--app-pass-title)]" : "text-[color:var(--app-warn-title)]"
                }`}
              >
                {score >= 70 ? "Passed" : "Review suggested"}
              </h3>
              <p className="text-sm text-[color:var(--app-body-secondary)] mt-1">
                {score}% · {questions.filter(q => selectedAnswers[q.id] === q.correct).length} of {questions.length}{" "}
                correct
              </p>
            </div>
          </div>
          <p className="text-sm text-app-soft leading-relaxed">
            {score >= 70
              ? "Solid grasp of this section — move on or skim the theory again for detail."
              : "Re-read the chapter and try the quiz again when ready."}
          </p>
        </div>
      )}

      <div className="space-y-5">
        {questions.map((q, index) => (
          <div key={q.id} className="app-inset-panel p-4 sm:p-5">
            <h3 className="text-[15px] sm:text-base font-semibold mb-4 text-app leading-snug">
              <span className="font-medium mr-2 text-[color:var(--app-quiz-label)]">{index + 1}.</span>
              {q.question}
            </h3>
            <div className="space-y-2">
              {q.options.map((option, optIndex) => {
                const isSelected = selectedAnswers[q.id] === optIndex;
                const status = getAnswerStatus(q.id, optIndex);

                let buttonClass =
                  "w-full text-left min-h-[48px] px-3 py-3 rounded-lg text-[15px] leading-snug transition-colors border focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--app-ring)] disabled:opacity-100 ";
                if (status === "correct") {
                  buttonClass += "app-quiz-correct";
                } else if (status === "incorrect") {
                  buttonClass += "app-quiz-incorrect";
                } else if (isSelected) {
                  buttonClass += "app-quiz-selected";
                } else {
                  buttonClass += "app-quiz-option";
                }

                return (
                  <button
                    key={optIndex}
                    type="button"
                    onClick={() => handleAnswerSelect(q.id, optIndex)}
                    disabled={isSubmitted}
                    className={buttonClass}
                  >
                    <span className="flex items-start gap-2.5">
                      <span className="font-mono text-xs text-[color:var(--app-quiz-label)] shrink-0 pt-0.5 w-5">
                        {String.fromCharCode(65 + optIndex)}
                      </span>
                      <span className="flex-1 min-w-0">{option}</span>
                      {status === "correct" && (
                        <CheckCircle size={18} className="shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" aria-hidden />
                      )}
                      {status === "incorrect" && (
                        <span className="shrink-0 text-rose-600 dark:text-rose-300" aria-hidden>
                          ✗
                        </span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col-reverse sm:flex-row sm:flex-wrap gap-3 pt-2">
        {!isSubmitted ? (
          <button
            type="button"
            onClick={handleSubmitQuiz}
            disabled={Object.keys(selectedAnswers).length < questions.length}
            className="app-btn-primary min-h-[48px] px-5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-45 disabled:cursor-not-allowed sm:min-w-[180px]"
          >
            Submit quiz
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={handleResetQuiz}
              className="app-btn-primary min-h-[48px] px-5 rounded-lg text-sm font-semibold transition-colors sm:min-w-[140px]"
            >
              Retake
            </button>
            <button
              type="button"
              onClick={() => setShowResults(!showResults)}
              className="app-btn-ghost min-h-[48px] px-5 rounded-lg text-sm font-medium transition-colors sm:min-w-[160px]"
            >
              {showResults ? "Hide breakdown" : "Show breakdown"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
