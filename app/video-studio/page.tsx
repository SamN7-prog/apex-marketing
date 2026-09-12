"use client";

import { useEffect, useState } from "react";
import {
  ArrowRight,
  Check,
  Film,
  ImagePlus,
  Sparkles,
  Upload,
  WandSparkles,
  X,
} from "lucide-react";
import Sidebar from "../components/Sidebar";

type VideoMode = "clips" | "hybrid" | "original";

type VideoCampaign = {
  businessName: string;
  industry: string;
  targetAudience: string;
  facebookAd?: {
    primaryText: string;
    headline: string;
    description: string;
    cta: string;
  };
  googleAd?: {
    headlines: string[];
    descriptions: string[];
    keywords: string[];
    cta: string;
  };
  source?: string;
};

type UploadedFile = {
  id: string;
  name: string;
  type: string;
  url: string;
};

export default function VideoStudioPage() {
  const [campaign, setCampaign] =
    useState<VideoCampaign | null>(null);

  const [mode, setMode] = useState<VideoMode | null>(null);

  const [files, setFiles] = useState<UploadedFile[]>([]);

  const [goal, setGoal] = useState(
    "Generate more customers"
  );

  const [platform, setPlatform] = useState("Instagram");

  const [length, setLength] = useState("20 seconds");

  const [tone, setTone] = useState("Professional");

  const [loading, setLoading] = useState(false);

  const [generated, setGenerated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(
        "apexVideoCampaign"
      );

      if (saved) {
        const parsed = JSON.parse(saved);

        setCampaign(parsed);

        /*
         * Remove this if you want the campaign to remain
         * available every time the page is opened.
         *
         * For now, we keep it so the user can see the
         * campaign information while working.
         */
      }
    } catch (error) {
      console.error(
        "Failed to load video campaign:",
        error
      );
    }
  }, []);

  function handleFiles(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const selectedFiles = Array.from(
      event.target.files || []
    );

    const newFiles: UploadedFile[] =
      selectedFiles.map((file) => ({
        id: `${file.name}-${Date.now()}-${Math.random()}`,
        name: file.name,
        type: file.type,
        url: URL.createObjectURL(file),
      }));

    setFiles((current) => [
      ...current,
      ...newFiles,
    ]);
  }

  function removeFile(id: string) {
    setFiles((current) =>
      current.filter((file) => file.id !== id)
    );
  }

  async function generateVideoConcept() {
    setLoading(true);

    /*
     * This currently creates the production plan.
     *
     * Later we will connect this step to the actual
     * video-generation provider.
     */

    await new Promise((resolve) =>
      setTimeout(resolve, 1200)
    );

    setGenerated(true);
    setLoading(false);
  }

  function resetStudio() {
    setMode(null);
    setGenerated(false);
    setFiles([]);
  }

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />

      <main className="flex-1 p-8">
        <div className="mx-auto max-w-7xl">

          {/* HEADER */}

          <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-indigo-950 to-blue-800 p-10 text-white shadow-xl">

            <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />

            <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />

            <div className="relative">

              <div className="flex items-center gap-3 text-sm font-bold uppercase tracking-[0.25em] text-blue-300">

                <Film size={18} />

                Apex Creative Studio

              </div>

              <h1 className="mt-4 text-5xl font-black">
                Video Studio
              </h1>

              <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">
                Create marketing videos using your own footage,
                Apex AI, or a combination of both.
              </p>

            </div>

          </section>

          {/* EXISTING CAMPAIGN */}

          {campaign && (
            <section className="mt-8 rounded-3xl border border-blue-100 bg-white p-7 shadow-sm">

              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                <div>

                  <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-blue-600">

                    <Sparkles size={16} />

                    Campaign Loaded

                  </div>

                  <h2 className="mt-2 text-2xl font-black text-slate-900">
                    {campaign.businessName}
                  </h2>

                  <p className="mt-1 text-slate-500">
                    {campaign.industry}
                    {campaign.targetAudience
                      ? ` • ${campaign.targetAudience}`
                      : ""}
                  </p>

                </div>

                <div className="rounded-2xl bg-blue-50 px-5 py-4">

                  <p className="text-xs font-bold uppercase tracking-wide text-blue-400">
                    Source
                  </p>

                  <p className="mt-1 font-bold text-blue-700">
                    {campaign.source ===
                    "ads-generator"
                      ? "AI Ad Generator"
                      : "Apex Marketing"}
                  </p>

                </div>

              </div>

              {campaign.facebookAd && (
                <div className="mt-6 rounded-2xl bg-slate-50 p-5">

                  <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                    Ad Headline
                  </p>

                  <p className="mt-2 text-xl font-black text-slate-900">
                    {campaign.facebookAd.headline}
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {campaign.facebookAd.primaryText}
                  </p>

                </div>
              )}

            </section>
          )}

          {/* CHOOSE CREATION METHOD */}

          {!mode && (
            <section className="mt-8">

              <div className="mb-6">

                <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
                  Choose Your Workflow
                </p>

                <h2 className="mt-2 text-3xl font-black text-slate-900">
                  How do you want to create your video?
                </h2>

                <p className="mt-2 text-slate-500">
                  You stay in control. Apex handles as much or
                  as little of the creative work as you want.
                </p>

              </div>

              <div className="grid gap-6 lg:grid-cols-3">

                {/* MY CLIPS */}

                <button
                  onClick={() => setMode("clips")}
                  className="group rounded-3xl border border-slate-200 bg-white p-8 text-left shadow-sm transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl"
                >

                  <div className="flex items-center justify-between">

                    <div className="rounded-2xl bg-blue-50 p-4 text-blue-600">
                      <Upload size={28} />
                    </div>

                    <ArrowRight
                      size={22}
                      className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-600"
                    />

                  </div>

                  <h3 className="mt-7 text-2xl font-black text-slate-900">
                    Use My Clips
                  </h3>

                  <p className="mt-3 leading-7 text-slate-500">
                    Upload your own videos and photos. Apex
                    will help organize them into an effective
                    marketing concept.
                  </p>

                  <div className="mt-6 flex flex-wrap gap-2">

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                      Your footage
                    </span>

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                      Your brand
                    </span>

                  </div>

                </button>

                {/* HYBRID */}

                <button
                  onClick={() => setMode("hybrid")}
                  className="group relative overflow-hidden rounded-3xl border border-indigo-200 bg-gradient-to-br from-indigo-950 to-blue-800 p-8 text-left text-white shadow-xl transition hover:-translate-y-1 hover:shadow-2xl"
                >

                  <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-blue-400/20 blur-3xl" />

                  <div className="relative">

                    <div className="flex items-center justify-between">

                      <div className="rounded-2xl bg-white/10 p-4">
                        <WandSparkles size={28} />
                      </div>

                      <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-wide">
                        Recommended
                      </span>

                    </div>

                    <h3 className="mt-7 text-2xl font-black">
                      Apex + My Clips
                    </h3>

                    <p className="mt-3 leading-7 text-blue-100">
                      Give Apex your footage and let AI help
                      with the hook, structure, captions, CTA,
                      and creative direction.
                    </p>

                    <div className="mt-6 flex flex-wrap gap-2">

                      <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold">
                        Your footage
                      </span>

                      <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold">
                        AI optimization
                      </span>

                    </div>

                  </div>

                </button>

                {/* ORIGINAL */}

                <button
                  onClick={() => setMode("original")}
                  className="group rounded-3xl border border-slate-200 bg-white p-8 text-left shadow-sm transition hover:-translate-y-1 hover:border-violet-300 hover:shadow-xl"
                >

                  <div className="flex items-center justify-between">

                    <div className="rounded-2xl bg-violet-50 p-4 text-violet-600">
                      <Sparkles size={28} />
                    </div>

                    <ArrowRight
                      size={22}
                      className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-violet-600"
                    />

                  </div>

                  <h3 className="mt-7 text-2xl font-black text-slate-900">
                    Fully Original
                  </h3>

                  <p className="mt-3 leading-7 text-slate-500">
                    Start from an idea and let Apex create the
                    complete creative concept from scratch.
                  </p>

                  <div className="mt-6 flex flex-wrap gap-2">

                    <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-bold text-violet-600">
                      AI concept
                    </span>

                    <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-bold text-violet-600">
                      Original creative
                    </span>

                  </div>

                </button>

              </div>

            </section>
          )}

          {/* CREATION WORKSPACE */}

          {mode && (
            <section className="mt-8">

              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>

                  <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
                    Creative Workspace
                  </p>

                  <h2 className="mt-2 text-3xl font-black text-slate-900">
                    Build Your Video
                  </h2>

                </div>

                <button
                  onClick={resetStudio}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 font-bold text-slate-600 transition hover:border-red-200 hover:text-red-600"
                >
                  <X size={18} />
                  Change Method
                </button>

              </div>

              <div className="grid gap-8 lg:grid-cols-3">

                {/* SETTINGS */}

                <div className="rounded-3xl bg-white p-7 shadow-sm lg:col-span-1">

                  <h3 className="text-xl font-black text-slate-900">
                    Campaign Settings
                  </h3>

                  <div className="mt-6 space-y-5">

                    <div>

                      <label className="mb-2 block text-sm font-bold text-slate-600">
                        Campaign Goal
                      </label>

                      <input
                        value={goal}
                        onChange={(e) =>
                          setGoal(e.target.value)
                        }
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-900 outline-none focus:border-blue-500 focus:bg-white"
                      />

                    </div>

                    <div>

                      <label className="mb-2 block text-sm font-bold text-slate-600">
                        Platform
                      </label>

                      <select
                        value={platform}
                        onChange={(e) =>
                          setPlatform(e.target.value)
                        }
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-900 outline-none focus:border-blue-500 focus:bg-white"
                      >
                        <option>Instagram</option>
                        <option>TikTok</option>
                        <option>Facebook</option>
                        <option>YouTube Shorts</option>
                      </select>

                    </div>

                    <div>

                      <label className="mb-2 block text-sm font-bold text-slate-600">
                        Video Length
                      </label>

                      <select
                        value={length}
                        onChange={(e) =>
                          setLength(e.target.value)
                        }
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-900 outline-none focus:border-blue-500 focus:bg-white"
                      >
                        <option>15 seconds</option>
                        <option>20 seconds</option>
                        <option>30 seconds</option>
                        <option>45 seconds</option>
                        <option>60 seconds</option>
                      </select>

                    </div>

                    <div>

                      <label className="mb-2 block text-sm font-bold text-slate-600">
                        Tone
                      </label>

                      <select
                        value={tone}
                        onChange={(e) =>
                          setTone(e.target.value)
                        }
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-900 outline-none focus:border-blue-500 focus:bg-white"
                      >
                        <option>Professional</option>
                        <option>Energetic</option>
                        <option>Friendly</option>
                        <option>Luxury</option>
                        <option>Bold</option>
                      </select>

                    </div>

                  </div>

                </div>

                {/* MAIN CREATIVE AREA */}

                <div className="rounded-3xl bg-white p-7 shadow-sm lg:col-span-2">

                  <div className="flex items-center gap-3">

                    <div className="rounded-2xl bg-blue-50 p-3">
                      {mode === "clips" ? (
                        <Upload
                          className="text-blue-600"
                          size={24}
                        />
                      ) : mode === "hybrid" ? (
                        <WandSparkles
                          className="text-indigo-600"
                          size={24}
                        />
                      ) : (
                        <Sparkles
                          className="text-violet-600"
                          size={24}
                        />
                      )}
                    </div>

                    <div>

                      <h3 className="text-2xl font-black text-slate-900">
                        {mode === "clips"
                          ? "Your Footage"
                          : mode === "hybrid"
                          ? "Your Footage + Apex AI"
                          : "Apex Original"}
                      </h3>

                      <p className="text-sm text-slate-500">
                        {mode === "clips"
                          ? "Upload the clips you want to use."
                          : mode === "hybrid"
                          ? "Upload footage and Apex will help shape the creative."
                          : "Apex will build the creative concept from your campaign."}
                      </p>

                    </div>

                  </div>

                  {/* UPLOAD */}

                  {mode !== "original" && (
                    <label className="mt-7 flex min-h-64 cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 p-8 text-center transition hover:border-blue-400 hover:bg-blue-50">

                      <div className="rounded-2xl bg-white p-4 shadow-sm">
                        <ImagePlus
                          size={32}
                          className="text-blue-600"
                        />
                      </div>

                      <h4 className="mt-4 text-lg font-black text-slate-900">
                        Upload clips or photos
                      </h4>

                      <p className="mt-2 max-w-md text-sm text-slate-500">
                        Add your own footage and Apex will use
                        it as part of the creative workflow.
                      </p>

                      <span className="mt-5 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white">
                        Choose Files
                      </span>

                      <input
                        type="file"
                        accept="video/*,image/*"
                        multiple
                        onChange={handleFiles}
                        className="hidden"
                      />

                    </label>
                  )}

                  {/* ORIGINAL PREVIEW */}

                  {mode === "original" && (
                    <div className="mt-7 flex min-h-64 flex-col items-center justify-center rounded-3xl bg-gradient-to-br from-violet-950 to-blue-950 p-8 text-center text-white">

                      <Sparkles size={42} />

                      <h4 className="mt-5 text-2xl font-black">
                        Apex will create the concept
                      </h4>

                      <p className="mt-2 max-w-lg text-sm leading-6 text-blue-100">
                        Your business information, campaign goal,
                        platform, length, and tone will guide the
                        creative.
                      </p>

                    </div>
                  )}

                  {/* FILES */}

                  {files.length > 0 && (
                    <div className="mt-6">

                      <div className="mb-3 flex items-center justify-between">

                        <h4 className="font-black text-slate-900">
                          Selected Media
                        </h4>

                        <span className="text-sm font-semibold text-slate-400">
                          {files.length} file
                          {files.length === 1
                            ? ""
                            : "s"}
                        </span>

                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">

                        {files.map((file) => (
                          <div
                            key={file.id}
                            className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3"
                          >

                            {file.type.startsWith(
                              "image/"
                            ) ? (
                              <img
                                src={file.url}
                                alt={file.name}
                                className="h-16 w-16 rounded-xl object-cover"
                              />
                            ) : (
                              <video
                                src={file.url}
                                className="h-16 w-16 rounded-xl object-cover"
                              />
                            )}

                            <div className="min-w-0 flex-1">

                              <p className="truncate text-sm font-bold text-slate-900">
                                {file.name}
                              </p>

                              <p className="mt-1 text-xs text-slate-400">
                                {file.type.startsWith(
                                  "video/"
                                )
                                  ? "Video"
                                  : "Image"}
                              </p>

                            </div>

                            <button
                              onClick={() =>
                                removeFile(file.id)
                              }
                              className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
                            >
                              <X size={17} />
                            </button>

                          </div>
                        ))}

                      </div>

                    </div>
                  )}

                  {/* GENERATE */}

                  <button
                    onClick={generateVideoConcept}
                    disabled={
                      loading ||
                      (mode !== "original" &&
                        files.length === 0)
                    }
                    className="mt-7 flex w-full items-center justify-center gap-3 rounded-2xl bg-blue-600 px-6 py-4 text-lg font-black text-white shadow-lg transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >

                    {loading ? (
                      <>
                        <Sparkles
                          size={21}
                          className="animate-pulse"
                        />
                        Apex is building your concept...
                      </>
                    ) : (
                      <>
                        <WandSparkles size={21} />
                        Generate Video Concept
                        <ArrowRight size={20} />
                      </>
                    )}

                  </button>

                  {/* GENERATED STATE */}

                  {generated && (
                    <div className="mt-7 rounded-3xl border border-green-200 bg-green-50 p-6">

                      <div className="flex items-start gap-4">

                        <div className="rounded-2xl bg-green-100 p-3">
                          <Check
                            size={24}
                            className="text-green-600"
                          />
                        </div>

                        <div>

                          <h4 className="text-xl font-black text-green-900">
                            Creative Plan Ready
                          </h4>

                          <p className="mt-2 leading-7 text-green-800">
                            Apex has prepared the creative
                            direction for your{" "}
                            <strong>
                              {length}
                            </strong>{" "}
                            {platform} video.
                          </p>

                          <div className="mt-4 grid gap-3 sm:grid-cols-2">

                            <div className="rounded-xl bg-white p-4">

                              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                                Goal
                              </p>

                              <p className="mt-1 font-bold text-slate-900">
                                {goal}
                              </p>

                            </div>

                            <div className="rounded-xl bg-white p-4">

                              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                                Tone
                              </p>

                              <p className="mt-1 font-bold text-slate-900">
                                {tone}
                              </p>

                            </div>

                          </div>

                        </div>

                      </div>

                    </div>
                  )}

                </div>

              </div>

            </section>
          )}

          {/* APPROVAL MESSAGE */}

          <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">

            <div className="flex flex-col gap-5 md:flex-row md:items-center">

              <div className="rounded-2xl bg-amber-50 p-4">
                🔐
              </div>

              <div className="flex-1">

                <h3 className="text-lg font-black text-slate-900">
                  You stay in control
                </h3>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Apex will never publish or remove content
                  without your permission. Approval controls will
                  be required before publishing.
                </p>

              </div>

            </div>

          </section>

        </div>
      </main>
    </div>
  );
}