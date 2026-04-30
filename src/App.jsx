import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, PlayCircle, Link as LinkIcon, Code2, BookOpen, PenTool, CheckCircle } from "lucide-react";

const courseIds = [
  { title: "Origins and Evolution of PL/I and CICS", id: "pl1-cics-history" },
  { title: "Environment Setup and ISPF Fundamentals", id: "setup-basics" },
  { title: "PL/I Core Concepts", id: "pl1-core" },
  { title: "CICS Core Concepts", id: "cics-core" },
  { title: "Debugging Basics", id: "debugging" },
  { title: "PL/I and CICS Integration Mastery", id: "pl1-cics-mastery" }
];

export default function App() {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

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
          // Fallback to basic course structure
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
    <div className="min-h-screen bg-[radial-gradient(900px_520px_at_20%_-10%,rgba(90,140,255,0.14),transparent_55%),linear-gradient(180deg,#0e1117_0%,#0b0f14_55%,#090c11_100%)] text-[#eef3fb] transition-colors duration-500">
      <header className="flex justify-between items-center px-6 md:px-8 py-4 md:py-5 border-b border-white/10 bg-[#0b0f14]/70 backdrop-blur-xl shadow-sm sticky top-0 z-50">
      <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[linear-gradient(135deg,#5b8cff_0%,#23d6c6_55%,#ffd08a_120%)] shadow-md shadow-black/30 hover:shadow-lg hover:shadow-black/40 transition-shadow duration-200">
            <Code2 className="text-white" size={22} />
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[#eef3fb]">
             z/OS Learning Hub
          </h1>
        </div>
      </header>

      {!selectedCourse ? (
        <div className="max-w-7xl mx-auto py-12 md:py-20 px-4 md:px-6">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-4 md:mb-6 leading-tight">
              <span className="text-[#eef3fb]">
                Learn PL/I and CICS
              </span>
            </h2>
            <p className="text-lg md:text-xl text-[#a7b2c6] font-medium">By Robbe Van Herpe</p>
          </div>
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {courseIds.map((course) => (
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
                aria-label={`Open ${course.title} course`}
                className="group relative p-6 md:p-8 bg-white/[0.06] backdrop-blur-xl rounded-2xl md:rounded-3xl border border-white/10 shadow-lg hover:shadow-xl hover:shadow-black/40 transition-all duration-300 cursor-pointer overflow-hidden hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-[#5b8cff] focus:ring-offset-2 focus:ring-offset-[#0b0f14] animate-fade-in"
              >
                <div className="absolute inset-0 bg-[radial-gradient(650px_350px_at_15%_10%,rgba(91,140,255,0.18),transparent_55%),radial-gradient(650px_350px_at_85%_15%,rgba(35,214,198,0.14),transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-[linear-gradient(135deg,#5b8cff_0%,#23d6c6_100%)] mb-4 flex items-center justify-center shadow-md shadow-black/30 group-hover:scale-110 transition-transform duration-300">
                    <Code2 className="text-white" size={18} />
                  </div>
                  <h2 className="text-lg md:text-xl font-bold mb-2 md:mb-3 text-[#eef3fb] group-hover:text-[#b6cdfa] transition-colors duration-300">
                    {course.title}
                  </h2>
                  <p className="text-sm text-[#a7b2c6] group-hover:text-[#c4cede] transition-colors">
                    Click to explore this course.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
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
      )}
    </div>
  );
}

function CoursePage({ course, courseData, loading, goBack }) {
  const initialSelectedPart = courseData?.chapters?.[0]?.parts?.[0] || "Theory";
  const [openChapter, setOpenChapter] = useState(0);
  const [selectedChapter, setSelectedChapter] = useState(0);
  const [selectedPart, setSelectedPart] = useState(initialSelectedPart);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6be6da] mx-auto mb-4"></div>
          <p className="text-[#a7b2c6]">Loading course...</p>
        </div>
      </div>
    );
  }

  if (!courseData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-[#ffb4b4] mb-4">Failed to load course data</p>
          <button
            onClick={goBack}
            className="px-4 py-2 bg-white/[0.06] text-[#e7edf6] rounded-lg hover:bg-white/[0.09] border border-white/10 transition-colors"
          >
            Go Back
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
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[radial-gradient(900px_520px_at_20%_-10%,rgba(90,140,255,0.14),transparent_55%),linear-gradient(180deg,#0e1117_0%,#0b0f14_55%,#090c11_100%)]">
      <aside className="w-64 md:w-72 lg:w-80 bg-[#0b0f14]/70 backdrop-blur-xl shadow-xl p-6 md:p-8 flex-shrink-0 h-screen sticky top-0 overflow-y-auto border-r border-white/10">
        <button
          onClick={goBack}
          className="group flex items-center gap-2 text-sm text-[#b6cdfa] mb-6 md:mb-8 font-semibold hover:text-[#e7edf6] transition-colors focus:outline-none focus:ring-2 focus:ring-[#5b8cff] focus:ring-offset-2 focus:ring-offset-[#0b0f14] rounded-lg px-2 py-1"
          aria-label="Go back to courses"
        >
          <ChevronDown size={16} className="rotate-90 group-hover:-translate-x-1 transition-transform" />
          Back to Courses
        </button>
        <h2 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 text-[#eef3fb] leading-tight">
          {courseData.title || course.title}
        </h2>
        <div className="space-y-2">
          {chapters.map((chapter, i) => (
            <div key={i} className="mb-2">
          <button
                onClick={() => setOpenChapter(openChapter === i ? null : i)}
                aria-expanded={openChapter === i}
                aria-controls={`chapter-${i}`}
                className={`w-full flex justify-between items-center text-left font-semibold px-3 md:px-4 py-2.5 md:py-3 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#5b8cff] focus:ring-offset-2 focus:ring-offset-[#0b0f14] ${
                  openChapter === i
                    ? "bg-white/[0.07] text-[#e7edf6] shadow-sm border border-white/10"
                    : "text-[#c4cede] hover:bg-white/[0.05] hover:text-[#e7edf6]"
                }`}
              >
                <span className="text-sm md:text-base">{chapter.title}</span>
                {openChapter === i ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
              {openChapter === i && (
                <ul id={`chapter-${i}`} className="mt-2 md:mt-3 ml-2 md:ml-4 space-y-1.5 md:space-y-2">
                  {chapter.parts.map((part, j) => {
                    const isActive = selectedChapter === i && selectedPart === part;
                    return (
                      <li
                        key={j}
                        onClick={() => handlePartClick(i, part)}
                        className={`text-xs md:text-sm px-3 md:px-4 py-1.5 md:py-2 rounded-lg cursor-pointer transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-[#5b8cff] focus:ring-offset-2 focus:ring-offset-[#0b0f14] ${
                          isActive
                            ? "bg-[linear-gradient(135deg,rgba(91,140,255,0.95)_0%,rgba(35,214,198,0.9)_100%)] text-[#081018] shadow-md"
                            : "text-[#a7b2c6] hover:bg-white/[0.06] hover:text-[#e7edf6]"
                        }`}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            handlePartClick(i, part);
                          }
                        }}
                        aria-label={`${chapter.title} - ${part}`}
                      >
                        {part}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          ))}
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-10 lg:p-12 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <span className="text-sm text-[#a7b2c6] font-medium">
              {chapters[selectedChapter]?.title} / {selectedPart}
            </span>
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 md:mb-6 text-[#eef3fb]">
            {chapters[selectedChapter]?.title}: {selectedPart}
          </h1>

          {/* Content based on selected part */}
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
      <div className="relative aspect-video bg-[radial-gradient(700px_280px_at_30%_20%,rgba(91,140,255,0.20),transparent_60%),radial-gradient(600px_260px_at_80%_40%,rgba(35,214,198,0.14),transparent_62%),linear-gradient(180deg,rgba(255,255,255,0.07)_0%,rgba(255,255,255,0.03)_100%)] rounded-2xl md:rounded-3xl overflow-hidden shadow-xl border border-white/10">
        {isLocal ? (
          <video
            src={getVideoSrc()}
            controls
            className="absolute inset-0 w-full h-full"
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
  const content = theoryData.content || `Welcome to the theory section for ${chapter?.title || "this chapter"}.`;
  const keyConcepts = theoryData.keyConcepts || [
    "Understanding the fundamental principles and concepts",
    "Learning the theoretical foundations",
    "Exploring real-world applications and examples"
  ];
  const videoUrl = theoryData.video;

  return (
    <div className="space-y-6">
      <div className="bg-white/[0.06] backdrop-blur-xl rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-lg border border-white/10">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-[linear-gradient(135deg,#5b8cff_0%,#23d6c6_100%)] shadow-md shadow-black/30">
            <BookOpen className="text-white" size={24} />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#eef3fb]">
            Theory: {chapter?.title || "Chapter"}
          </h2>
        </div>
  
        {/* Key Concepts FIRST */}
        {keyConcepts && keyConcepts.length > 0 && (
          <div className="bg-white/[0.05] rounded-xl p-6 mb-8 border border-white/10">
            <h3 className="text-xl font-semibold mb-3 text-[#eef3fb]">Key Concepts</h3>
            <ul className="space-y-2 text-[#eef3fb]">
              {keyConcepts.map((concept, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[#6be6da] mt-1">•</span>
                  <span>{concept}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
  
        {/* Video and theory content below */}
        <VideoPlayer videoUrl={videoUrl} title="Theory Video" />
  
        <div
          className="prose prose-lg prose-invert max-w-none text-[#eef3fb]"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
  
      {course?.resources && course.resources.length > 0 && (
        <div className="bg-white/[0.06] backdrop-blur-xl rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-lg border border-white/10">
          <h3 className="text-xl font-bold mb-4 text-[#eef3fb]">Resources</h3>
          <ul className="space-y-3">
            {course.resources.map((resource, idx) => (
              <li
                key={idx}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.07] cursor-pointer transition-all duration-200 border border-white/10"
                onClick={() => resource.url && resource.url !== "#" && window.open(resource.url, "_blank")}
              >
                <LinkIcon size={18} className="text-[#b6cdfa]" />
                <span className="text-base font-semibold text-[#b6cdfa]">{resource.label}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}  

// Exercise Content Component
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
    return codeStr
      .toUpperCase()
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
      .replace(/\/\/.*/g, '') // Remove single-line comments
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
  };

  const handleCheckAnswer = () => {
    setIsChecking(true);
    setIsSubmitted(true);
    
    setTimeout(() => {
      const userCodeNormalized = normalizeCode(code);
      const correctCodeNormalized = normalizeCode(correctAnswer);
      
      // Calculate similarity
      const userKeywords = userCodeNormalized.split(/\s+/).filter(w => w.length > 2);
      const correctKeywords = correctCodeNormalized.split(/\s+/).filter(w => w.length > 2);
      const matchingKeywords = userKeywords.filter(kw => correctKeywords.includes(kw));
      const similarity = correctKeywords.length > 0 
        ? (matchingKeywords.length / correctKeywords.length) * 100 
        : 0;
      
      // Check for key elements
      const hasProc = userCodeNormalized.includes("PROC");
      const hasEndProc = userCodeNormalized.includes("ENDPROC");
      const hasMain = userCodeNormalized.includes("MAIN");
      
      // Detailed feedback
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
    <div className="space-y-6">
      <div className="bg-white/[0.06] backdrop-blur-xl rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-lg border border-white/10">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-[linear-gradient(135deg,#35d07f_0%,#23d6c6_100%)] shadow-md shadow-black/30">
            <PenTool className="text-white" size={24} />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#eef3fb]">
            Exercise: {chapter.title}
          </h2>
        </div>
        
        <div className="prose prose-lg prose-invert max-w-none text-[#eef3fb]">
          <p className="text-[#eef3fb] leading-relaxed mb-4">
            Now it's time to put your knowledge into practice! Complete the exercises below to reinforce what 
            you've learned in the theory section.
          </p>
          
          <div className="bg-white/[0.05] rounded-xl p-6 mb-6 border border-white/10">
            <h3 className="text-xl font-semibold mb-3 text-[#eef3fb]">Exercise Instructions</h3>
            <p className="text-[#eef3fb] mb-4 leading-relaxed">{instructions}</p>
            {hint && (
              <div className="mt-4 p-3 bg-white/[0.05] rounded-lg border border-white/10">
                <p className="text-sm text-[#eef3fb]">
                  <strong>Hint:</strong> {hint}
                </p>
              </div>
            )}
          </div>

          <VideoPlayer videoUrl={videoUrl} title="Exercise Video" />

          <div className="bg-[#070a0f] rounded-xl p-6 mb-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold text-[#a7b2c6]">Code Editor</h4>
              <span className="text-xs text-[#7f8aa3]">PL/I</span>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full bg-[#0a0f16] rounded-lg p-4 font-mono text-sm text-[#d4dcec] resize-none focus:outline-none focus:ring-2 focus:ring-[#35d07f] min-h-[300px]"
              placeholder="Write your PL/I code here..."
              spellCheck={false}
            />
          </div>

          {checkResult && (
            <div className={`rounded-xl p-6 mb-6 border ${
              checkResult.passed
                ? "bg-white/[0.06] border-white/10"
                : "bg-white/[0.06] border-white/10"
            }`}>
              <div className="flex items-center gap-3 mb-4">
                {checkResult.passed ? (
                  <CheckCircle className="text-[#35d07f]" size={24} />
                ) : (
                  <span className="text-[#ffd08a] text-2xl">⚠</span>
                )}
                <div>
                  <h3 className={`text-xl font-semibold ${
                    checkResult.passed ? "text-[#c9f2dd]" : "text-[#ffe1b3]"
                  }`}>
                    {checkResult.passed ? "Great Job!" : "Review Needed"}
                  </h3>
                  <p className="text-sm font-semibold text-[#a7b2c6]">
                    Similarity: {checkResult.similarity}% | Score: {checkResult.score}%
                  </p>
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <h4 className="text-sm font-semibold text-[#c4cede]">Feedback:</h4>
                {checkResult.feedback.map((item, idx) => (
                  <div key={idx} className={`text-sm ${
                    item.type === "correct" 
                      ? "text-[#c9f2dd]" 
                      : item.type === "incorrect"
                      ? "text-[#ffb4b4]"
                      : "text-[#ffe1b3]"
                  }`}>
                    {item.text}
                  </div>
                ))}
              </div>
            </div>
          )}

          {isSubmitted && (
            <div className="mb-6">
              <button
                onClick={() => setShowAnswer(!showAnswer)}
                className="px-4 py-2 bg-white/[0.06] text-[#c4cede] rounded-lg font-medium hover:bg-white/[0.09] transition-all duration-200 text-sm border border-white/10"
              >
                {showAnswer ? "Hide" : "Show"} Correct Answer
              </button>
              
              {showAnswer && (
                <div className="mt-4 bg-[#070a0f] rounded-xl p-6 border border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-semibold text-[#a7b2c6]">Correct Answer</h4>
                    <span className="text-xs text-[#7f8aa3]">PL/I</span>
                  </div>
                  <pre className="text-sm text-[#d4dcec] whitespace-pre-wrap font-mono overflow-x-auto">
                    {correctAnswer}
                  </pre>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-4">
            <button
              onClick={handleCheckAnswer}
              disabled={isChecking || code.trim().length < 10}
              className="px-6 py-3 bg-[linear-gradient(135deg,#35d07f_0%,#23d6c6_100%)] text-[#081018] rounded-xl font-semibold hover:shadow-lg hover:shadow-black/40 hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isChecking ? "Checking..." : "Check Answer"}
            </button>
            {isSubmitted && (
              <button
                onClick={handleReset}
                className="px-6 py-3 bg-white/[0.06] text-[#c4cede] rounded-xl font-semibold hover:bg-white/[0.09] transition-all duration-200 border border-white/10"
              >
                Try Again
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Quiz Content Component
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
    
    // Calculate score
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
    <div className="space-y-6">
      <div className="bg-white/[0.06] backdrop-blur-xl rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-lg border border-white/10">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-[linear-gradient(135deg,#a78bfa_0%,#fb7185_100%)] shadow-md shadow-black/30">
            <CheckCircle className="text-white" size={24} />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#eef3fb]">
            Final Quiz: {chapter.title}
          </h2>
        </div>
        
        <div className="prose prose-lg prose-invert max-w-none text-[#eef3fb]">
          <p className="text-[#eef3fb] leading-relaxed mb-6">
            Test your understanding of <strong>{chapter.title}</strong> by completing this quiz. 
            Select the best answer for each question.
          </p>

          {showResults && score !== null && (
            <div className={`rounded-xl p-6 mb-6 border ${
              score >= 70
                ? "bg-white/[0.06] border-white/10"
                : "bg-white/[0.06] border-white/10"
            }`}>
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle className={score >= 70 ? "text-[#35d07f]" : "text-[#ffd08a]"} size={32} />
                <div>
                  <h3 className={`text-2xl font-bold ${
                    score >= 70 ? "text-[#c9f2dd]" : "text-[#ffe1b3]"
                  }`}>
                    Quiz Results
                  </h3>
                  <p className="text-lg font-semibold text-[#eef3fb]">
                    Score: {score}% ({questions.filter(q => selectedAnswers[q.id] === q.correct).length} out of {questions.length} correct)
                  </p>
                </div>
              </div>
              <p className="text-[#eef3fb]">
                {score >= 70 
                  ? "Great job! You have a good understanding of this chapter."
                  : "Keep studying! Review the material and try again."}
              </p>
            </div>
          )}
          
          <div className="space-y-6">
            {questions.map((q, index) => (
              <div key={q.id} className="bg-white/[0.05] rounded-xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold mb-4 text-[#eef3fb]">
                  Question {index + 1}: {q.question}
                </h3>
                <div className="space-y-2">
                  {q.options.map((option, optIndex) => {
                    const isSelected = selectedAnswers[q.id] === optIndex;
                    const status = getAnswerStatus(q.id, optIndex);
                    
                    let buttonClass = "w-full text-left p-3 rounded-lg transition-all duration-200 ";
                    if (status === "correct") {
                      buttonClass += "bg-[linear-gradient(135deg,#35d07f_0%,#23d6c6_100%)] text-[#081018] shadow-md border border-white/10";
                    } else if (status === "incorrect") {
                      buttonClass += "bg-[linear-gradient(135deg,#fb7185_0%,#ffd08a_115%)] text-[#081018] shadow-md border border-white/10";
                    } else if (isSelected) {
                      buttonClass += "bg-[linear-gradient(135deg,#a78bfa_0%,#fb7185_100%)] text-[#081018] shadow-md border border-white/10";
                    } else {
                      buttonClass += "bg-white/[0.05] text-[#c4cede] hover:bg-white/[0.08] border border-white/10";
                    }
                    
                    return (
                      <button
                        key={optIndex}
                        onClick={() => handleAnswerSelect(q.id, optIndex)}
                        disabled={isSubmitted}
                        className={buttonClass}
                      >
                        <span className="flex items-center gap-2">
                          {String.fromCharCode(65 + optIndex)}. {option}
                          {status === "correct" && <CheckCircle size={18} />}
                          {status === "incorrect" && <span className="text-lg">✗</span>}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex gap-4">
            {!isSubmitted ? (
              <button
                onClick={handleSubmitQuiz}
                disabled={Object.keys(selectedAnswers).length < questions.length}
                className="px-6 py-3 bg-[linear-gradient(135deg,#a78bfa_0%,#fb7185_100%)] text-[#081018] rounded-xl font-semibold hover:shadow-lg hover:shadow-black/40 hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                Submit Quiz
              </button>
            ) : (
              <>
                <button
                  onClick={handleResetQuiz}
                  className="px-6 py-3 bg-[linear-gradient(135deg,#a78bfa_0%,#fb7185_100%)] text-[#081018] rounded-xl font-semibold hover:shadow-lg hover:shadow-black/40 hover:scale-105 transition-all duration-200"
                >
                  Retake Quiz
                </button>
      <button
                  onClick={() => setShowResults(!showResults)}
                  className="px-6 py-3 bg-white/[0.06] text-[#c4cede] rounded-xl font-semibold hover:bg-white/[0.09] transition-all duration-200 border border-white/10"
      >
                  {showResults ? "Hide Results" : "Show Results"}
      </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
