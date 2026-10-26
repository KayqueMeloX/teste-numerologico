import { createFileRoute } from "@tanstack/react-router";
import React, { useState, useEffect, useRef } from "react";
import { challengeIcons, civilStatusIcons } from "@/data/challenge-icons";

export const Route = createFileRoute("/")({
  component: TesteNumerologico,
});

const VTURB_ACCOUNT_ID = "0a246cdd-c6bd-48cb-b2bf-d2a8c03c2dd5";

const VIDEO_MAP_P1: Record<string, string> = {
  H_20_S: "6a8ddf0c8a289dc3ec39c27a",
  H_20_C: "6a8dded77acb975e9f20777f",
  H_30_S: "6a8ddf3b8a289dc3ec39c348",
  H_30_C: "6a8ddf4aa174b8508e5c51a6",
  H_40_S: "6a8ddc763a633a4e675274be",
  H_40_C: "6a8ddef631552ce9b670c595",
  H_50_S: "6a8ddc4e0926c935d2f61d10",
  H_50_C: "6a8ddc5b288cd993d346a2fd",
  H_60_S: "6a8ddec5d5cdae2c958db60d",
  H_60_C: "6a8ddee67dfab8208b748de0",
  M_20_S: "6a8dde0cffc004c1d7a60aef",
  M_20_C: "6a8ddc87b7f86bb6308f93eb",
  M_30_S: "6a8dddfbb7f86bb6308f9899",
  M_30_C: "6a8ddc694f6c9b43d0ecba64",
  M_40_S: "6a8ddf59288cd993d346ab86",
  M_40_C: "6a8ddeb90db8ff81b1ef24a0",
  M_50_S: "6a8ddf6a288cd993d346aba8",
  M_50_C: "6a8ddc9bb7f86bb6308f9501",
  M_60_S: "6a8ddf2ce6c295a47b8f869d",
  M_60_C: "6a95a793d5992a6252188982",
};

const VIDEO_MAP_P2: Record<string, string> = {
  dinheiro: "ab-6abed2fd584a247615bffad9",
  felicidade: "6a8df4bc655329ca2a976877",
  saude: "ab-6abed43d33fce89fba95b5d3",
  h_casado: "6a8df35f0d360e5354befd86",
  h_solteiro: "6a8df3a04f8274c280d51ffa",
  m_casada: "6a8df1a0e05af68d185dd5d2",
  m_solteira: "6a8df07946d6ec1c24018e9b",
};

const MONTHS = [
  { name: "Janeiro", number: "01", days: 31 },
  { name: "Fevereiro", number: "02", days: 29 },
  { name: "Março", number: "03", days: 31 },
  { name: "Abril", number: "04", days: 30 },
  { name: "Maio", number: "05", days: 31 },
  { name: "Junho", number: "06", days: 30 },
  { name: "Julho", number: "07", days: 31 },
  { name: "Agosto", number: "08", days: 31 },
  { name: "Setembro", number: "09", days: 30 },
  { name: "Outubro", number: "10", days: 31 },
  { name: "Novembro", number: "11", days: 30 },
  { name: "Dezembro", number: "12", days: 31 },
];

const DECADES = [1940, 1950, 1960, 1970, 1980, 1990, 2000, 2010];

const CIVIL_STATUSES = [
  { id: "casado", label: "Casado(a)", icon: civilStatusIcons.casado },
  { id: "namorando", label: "Namorando", icon: civilStatusIcons.namorando },
  { id: "noivo", label: "Noivo(a)", icon: civilStatusIcons.noivo },
  { id: "solteiro", label: "Solteiro(a)", icon: civilStatusIcons.solteiro },
  { id: "separado", label: "Separado(a)", icon: civilStatusIcons.separado },
  { id: "viuvo", label: "Viúvo(a)", icon: civilStatusIcons.viuvo },
];

const CHALLENGES = [
  { id: "amor", label: "Vida Amorosa", icon: challengeIcons.amor },
  { id: "financas", label: "Finanças", icon: challengeIcons.financas },
  { id: "saude", label: "Saúde", icon: challengeIcons.saude },
  { id: "felicidade", label: "Felicidade", icon: challengeIcons.felicidade },
];

function calculateNumerologyNumber(val: string | number): number {
  let str = String(val).replace(/\D/g, "");
  let sum = str.split("").reduce((acc, digit) => acc + (parseInt(digit, 10) || 0), 0);
  while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
    sum = String(sum).split("").reduce((acc, digit) => acc + (parseInt(digit, 10) || 0), 0);
  }
  return sum;
}

export function TesteNumerologico() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [genderValue, setGenderValue] = useState<"feminino" | "masculino" | null>(null);
  const [monthValue, setMonthValue] = useState<string | null>(null);
  const [monthNameValue, setMonthNameValue] = useState<string | null>(null);
  const [monthDays, setMonthDays] = useState<number>(31);
  const [dayValue, setDayValue] = useState<number | null>(null);
  const [decadeValue, setDecadeValue] = useState<number | null>(null);
  const [yearValue, setYearValue] = useState<number | null>(null);
  const [civilStatusValue, setCivilStatusValue] = useState<string | null>(null);
  const [desafioValue, setDesafioValue] = useState<string | null>(null);
  const [firstName, setFirstName] = useState<string>("");
  const [firstNameError, setFirstNameError] = useState<string>("");
  const [emailValue, setEmailValue] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");

  // Numerology calculation results
  const [animationDayNumerology, setAnimationDayNumerology] = useState<number>(0);
  const [animationMonthNumerology, setAnimationMonthNumerology] = useState<number>(0);
  const [animationYearNumerology, setAnimationYearNumerology] = useState<number>(0);
  const [destinyNumber, setDestinyNumber] = useState<number>(0);

  // Flow & VSL states
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [backgroundVSL, setBackgroundVSL] = useState<boolean>(false);
  const [showP1Video, setShowP1Video] = useState<boolean>(false);
  const [currentVideoIdP1, setCurrentVideoIdP1] = useState<string>("");
  const [showEmailModal, setShowEmailModal] = useState<boolean>(false);
  const [showP2Video, setShowP2Video] = useState<boolean>(false);
  const [currentVideoIdP2, setCurrentVideoIdP2] = useState<string>("");
  const [partePitch, setPartePitch] = useState<boolean>(false);

  // Legal modal state
  const [activeLegalModal, setActiveLegalModal] = useState<"termos" | "privacidade" | "contato" | null>(null);

  const videoP1ContainerRef = useRef<HTMLDivElement>(null);
  const videoP2ContainerRef = useRef<HTMLDivElement>(null);
  const pitchContainerRef = useRef<HTMLDivElement>(null);

  const progressPercentage = Math.min((currentStep / 8) * 100, 100);

  // Scroll to top on step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentStep, showP1Video, showEmailModal, showP2Video, partePitch]);

  // Step 1: Gender selection
  const handleSelectGender = (gender: "feminino" | "masculino") => {
    setGenderValue(gender);
    setTimeout(() => {
      setCurrentStep(2);
    }, 300);
  };

  // Step 2: Month selection
  const handleSelectMonth = (month: typeof MONTHS[0]) => {
    setMonthValue(month.number);
    setMonthNameValue(month.name);
    setMonthDays(month.days);
    const num = calculateNumerologyNumber(month.number);
    setAnimationMonthNumerology(num);
    setCurrentStep(3);
  };

  // Step 3: Day selection
  const handleSelectDay = (day: number) => {
    setDayValue(day);
    const num = calculateNumerologyNumber(day);
    setAnimationDayNumerology(num);
    setCurrentStep(4);
  };

  // Step 4: Decade selection
  const handleSelectDecade = (decade: number) => {
    setDecadeValue(decade);
    setCurrentStep(5);
  };

  // Step 5: Year selection -> Calculate Numerology Destiny Number
  const handleSelectYear = (year: number) => {
    setYearValue(year);
    const yearNum = calculateNumerologyNumber(year);
    setAnimationYearNumerology(yearNum);

    const totalBefore = animationDayNumerology + animationMonthNumerology + yearNum;
    const officialDestiny = calculateNumerologyNumber(totalBefore);
    setDestinyNumber(officialDestiny);

    // Show step 5.5 (calculating screen)
    setIsCalculating(true);
    setTimeout(() => {
      setIsCalculating(false);
      setCurrentStep(6);
    }, 2500);
  };

  // Step 6: Civil status selection
  const handleSelectCivilStatus = (status: string) => {
    setCivilStatusValue(status);
    setTimeout(() => {
      setCurrentStep(7);
    }, 250);
  };

  // Step 7: Challenge selection
  const handleSelectDesafio = (desafio: string) => {
    setDesafioValue(desafio);
    setTimeout(() => {
      setCurrentStep(8);
    }, 250);
  };

  // Step 8: Name submission -> Transition to Personalized Video P1
  const handleNameSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = firstName.trim();
    if (!trimmed) {
      setFirstNameError("*Por favor, digite seu primeiro nome.");
      return;
    }
    if (/[0-9]/.test(trimmed)) {
      setFirstNameError("*Apenas letras são permitidas!");
      return;
    }
    if (/\s+/.test(trimmed)) {
      setFirstNameError("*Apenas o primeiro nome!");
      return;
    }

    setFirstNameError("");
    setBackgroundVSL(true);

    // Calculate user age & video key
    const currentYear = new Date().getFullYear();
    const userAge = yearValue ? currentYear - yearValue : 25;
    let ageGroup = "20";
    if (userAge >= 60) ageGroup = "60";
    else if (userAge >= 50) ageGroup = "50";
    else if (userAge >= 40) ageGroup = "40";
    else if (userAge >= 30) ageGroup = "30";
    else if (userAge >= 20) ageGroup = "20";

    const genderLetter = genderValue === "masculino" ? "H" : "M";
    const statusLetter =
      civilStatusValue === "casado" ||
      civilStatusValue === "namorando" ||
      civilStatusValue === "noivo"
        ? "C"
        : "S";

    const keyP1 = `${genderLetter}_${ageGroup}_${statusLetter}`;
    const videoIdP1 = VIDEO_MAP_P1[keyP1] || VIDEO_MAP_P1["H_20_S"];
    setCurrentVideoIdP1(videoIdP1);

    setCurrentStep(9); // Quiz completed
    setShowP1Video(true);
  };

  // Mount VTurb P1 script & player
  useEffect(() => {
    if (!showP1Video || !currentVideoIdP1 || !videoP1ContainerRef.current) return;

    videoP1ContainerRef.current.innerHTML = "";
    const playerEl = document.createElement("vturb-smartplayer");
    playerEl.setAttribute("id", `vid-${currentVideoIdP1}`);
    playerEl.style.cssText = "display: block; margin: 0 auto; width: 100%; max-width: 400px;";

    const placeholder = document.createElement("div");
    placeholder.style.cssText =
      "position: relative; width: 100%; padding: 177.77777777777777% 0 0; z-index: 0; background-color: black;";
    playerEl.appendChild(placeholder);
    videoP1ContainerRef.current.appendChild(playerEl);

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = `https://scripts.converteai.net/${VTURB_ACCOUNT_ID}/players/${currentVideoIdP1}/v4/player.js`;
    script.async = true;
    script.setAttribute("data-vturb-p1", "true");
    document.head.appendChild(script);

    // Listen for video end
    const handleEnd = () => {
      setShowEmailModal(true);
    };

    window.addEventListener("message", (evt) => {
      try {
        const data = typeof evt.data === "string" ? JSON.parse(evt.data) : evt.data;
        if (
          data?.type === "vturb:video-ended" ||
          data?.type === "video-ended" ||
          data?.event === "ended"
        ) {
          handleEnd();
        }
      } catch {}
    });

    return () => {
      script.remove();
    };
  }, [showP1Video, currentVideoIdP1]);

  // Email validation and submission -> Starts P2
  const handleValidateEmail = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailValue.trim())) {
      setEmailError("Formato de email inválido.");
      return;
    }

    setEmailError("");
    setShowEmailModal(false);
    setShowP1Video(false);

    // Determine P2 Video
    let keyP2 = "dinheiro";
    if (desafioValue === "financas") keyP2 = "dinheiro";
    else if (desafioValue === "felicidade") keyP2 = "felicidade";
    else if (desafioValue === "saude") keyP2 = "saude";
    else if (desafioValue === "amor") {
      const g = genderValue === "masculino" ? "h" : "m";
      const isCasado =
        civilStatusValue === "casado" ||
        civilStatusValue === "namorando" ||
        civilStatusValue === "noivo";
      if (g === "m" && isCasado) keyP2 = "m_casada";
      else if (g === "m" && !isCasado) keyP2 = "m_solteira";
      else if (g === "h" && isCasado) keyP2 = "h_casado";
      else if (g === "h" && !isCasado) keyP2 = "h_solteiro";
    }

    const videoIdP2 = VIDEO_MAP_P2[keyP2] || VIDEO_MAP_P2["dinheiro"];
    setCurrentVideoIdP2(videoIdP2);
    setShowP2Video(true);

    // Track lead
    try {
      fetch(
        `https://add-lead-getresponse-br.mahilaluz.workers.dev?email=${encodeURIComponent(
          emailValue
        )}&name=${encodeURIComponent(firstName)}&tagId=V7vw5`,
        { method: "POST", mode: "no-cors" }
      );
    } catch {}
  };

  // Mount VTurb P2 player
  useEffect(() => {
    if (!showP2Video || !currentVideoIdP2 || !videoP2ContainerRef.current) return;

    videoP2ContainerRef.current.innerHTML = "";
    const isAb = currentVideoIdP2.startsWith("ab-");
    const playerEl = document.createElement("vturb-smartplayer");
    if (isAb) {
      playerEl.id = currentVideoIdP2;
    } else {
      playerEl.id = `vid-${currentVideoIdP2}`;
    }
    playerEl.style.cssText = "display: block; margin: 0 auto; width: 100%; max-width: 400px;";

    const placeholder = document.createElement("div");
    placeholder.style.cssText =
      "position: relative; width: 100%; padding: 177.77777777777777% 0 0; z-index: 0; background-color: black;";
    playerEl.appendChild(placeholder);
    videoP2ContainerRef.current.appendChild(playerEl);

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = isAb
      ? `https://scripts.converteai.net/${VTURB_ACCOUNT_ID}/players/${currentVideoIdP2}/player.js`
      : `https://scripts.converteai.net/${VTURB_ACCOUNT_ID}/players/${currentVideoIdP2}/v4/player.js`;
    script.async = true;
    script.setAttribute("data-vturb-p2", "true");
    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, [showP2Video, currentVideoIdP2]);

  // Activate final Pitch / checkout VSL
  const handleShowPitch = () => {
    setPartePitch(true);
    setShowP2Video(false);

    const script = document.createElement("script");
    script.src = `https://scripts.converteai.net/${VTURB_ACCOUNT_ID}/players/691b1f1bf65a4dcdb5b35980/v4/player.js`;
    script.async = true;
    document.head.appendChild(script);
  };

  return (
    <div
      className="page-wrapper min-h-screen text-slate-900"
      id="page-wrapper"
      style={{
        backgroundColor: backgroundVSL ? "#0b0416" : "#fcfbf8",
        backgroundImage: backgroundVSL ? "url('/img/bg.22378cd4.png')" : "none",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center top",
      }}
    >
      {/* Top Progress Bar */}
      {currentStep <= 8 && (
        <div className="progress-bar-top" style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "8px", zIndex: 1000, backgroundColor: "#e2e8f0" }}>
          <div
            className="progress-bar-fill"
            style={{
              height: "100%",
              width: `${progressPercentage}%`,
              backgroundColor: "#7c3aed",
              transition: "width 0.4s ease",
            }}
          />
        </div>
      )}

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Section 1: Quiz steps */}
        {currentStep <= 8 && (
          <div className="ga4983248 eh90427">
            {/* Step 1: Gender */}
            {currentStep === 1 && (
              <div className="quiz-container text-center">
                <h2 className="main-title text-2xl md:text-3xl font-bold mb-6 text-gray-900 leading-snug">
                  Em apenas 30 segundos, identifique o número que rege sua vibração e veja como alinhar sua energia com a{" "}
                  <span className="highlight-text bg-amber-200 px-2 py-0.5 rounded text-amber-950">prosperidade</span>!
                </h2>

                <div className="alert-box bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8 flex items-center justify-center gap-3 text-amber-800 text-sm max-w-xl mx-auto shadow-sm">
                  <span className="text-xl">⚠️</span>
                  <p className="m-0 font-medium">Atenção: Se tudo começar a fluir depois do teste, você me deve um MBWAY de 5,00€!</p>
                </div>

                <p className="selection-prompt text-lg font-medium text-gray-700 mb-6">
                  Selecione seu gênero para iniciar o teste:
                </p>

                <div className="gender-cards flex flex-row justify-center gap-6 mb-10 flex-wrap">
                  {/* Feminino */}
                  <button
                    type="button"
                    onClick={() => handleSelectGender("feminino")}
                    className="gender-card group relative w-56 h-80 rounded-2xl overflow-hidden shadow-lg border-2 border-transparent hover:border-purple-600 hover:scale-105 transition-all duration-300 bg-white"
                  >
                    <div
                      className="card-image w-full h-64 bg-cover bg-center"
                      style={{ backgroundImage: "url('/img/female.a214dfbb.png')" }}
                    />
                    <div className="card-footer bg-purple-700 text-white font-semibold py-3 flex items-center justify-center gap-2 text-lg">
                      <span>&gt;</span> Mulher
                    </div>
                  </button>

                  {/* Masculino */}
                  <button
                    type="button"
                    onClick={() => handleSelectGender("masculino")}
                    className="gender-card group relative w-56 h-80 rounded-2xl overflow-hidden shadow-lg border-2 border-transparent hover:border-purple-600 hover:scale-105 transition-all duration-300 bg-white"
                  >
                    <div
                      className="card-image w-full h-64 bg-cover bg-center"
                      style={{ backgroundImage: "url('/img/masculine.b27a3766.png')" }}
                    />
                    <div className="card-footer bg-purple-700 text-white font-semibold py-3 flex items-center justify-center gap-2 text-lg">
                      <span>&gt;</span> Homem
                    </div>
                  </button>
                </div>

                <div className="privacy-section text-center text-sm text-gray-500 space-y-2 mt-8">
                  <p className="flex items-center justify-center gap-2">
                    <span>🔒</span>
                    <strong>Privacidade Garantida:</strong> Suas respostas são 100% anônimas e confidenciais.
                  </p>
                  <p className="text-xs text-gray-400">
                    Mais de 47.328 pessoas já descobriram seus bloqueios através deste teste.
                  </p>
                </div>
              </div>
            )}

            {/* Step 2: Month */}
            {currentStep === 2 && (
              <div className="text-center max-w-xl mx-auto">
                <h2 className="main-title text-2xl font-bold mb-6 text-gray-900">
                  Clique no mês em que você nasceu:
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
                  {MONTHS.map((m) => (
                    <button
                      key={m.number}
                      type="button"
                      onClick={() => handleSelectMonth(m)}
                      className="month-item py-3 px-4 bg-white hover:bg-purple-600 hover:text-white border border-purple-200 rounded-xl font-medium shadow-sm transition-all text-gray-800 text-base"
                    >
                      {m.name}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="btn-voltar text-purple-700 hover:text-purple-900 font-semibold text-sm underline cursor-pointer"
                >
                  &lt; Voltar
                </button>
              </div>
            )}

            {/* Step 3: Day */}
            {currentStep === 3 && (
              <div className="text-center max-w-xl mx-auto">
                <h2 className="main-title text-2xl font-bold mb-6 text-gray-900">
                  Informe o Dia do seu Nascimento:
                </h2>
                <div className="grid grid-cols-5 sm:grid-cols-7 gap-2 mb-8">
                  {Array.from({ length: monthDays }, (_, i) => i + 1).map((day) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => handleSelectDay(day)}
                      className="py-3 px-2 bg-white hover:bg-purple-600 hover:text-white border border-purple-200 rounded-xl font-bold shadow-sm transition-all text-gray-800 text-sm"
                    >
                      {day}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="btn-voltar text-purple-700 hover:text-purple-900 font-semibold text-sm underline cursor-pointer"
                >
                  &lt; Voltar
                </button>
              </div>
            )}

            {/* Step 4: Decade */}
            {currentStep === 4 && (
              <div className="text-center max-w-xl mx-auto">
                <h2 className="main-title text-2xl font-bold mb-6 text-gray-900">
                  Em qual Década você nasceu?
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                  {DECADES.map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => handleSelectDecade(d)}
                      className="py-4 px-3 bg-white hover:bg-purple-600 hover:text-white border border-purple-200 rounded-xl font-bold shadow-sm transition-all text-gray-800 text-base"
                    >
                      {d}s
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="btn-voltar text-purple-700 hover:text-purple-900 font-semibold text-sm underline cursor-pointer"
                >
                  &lt; Voltar
                </button>
              </div>
            )}

            {/* Step 5: Year */}
            {currentStep === 5 && (
              <div className="text-center max-w-xl mx-auto">
                <h2 className="main-title text-2xl font-bold mb-6 text-gray-900">
                  Em que Ano você nasceu?
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
                  {decadeValue &&
                    Array.from({ length: 10 }, (_, i) => decadeValue + i).map((yr) => (
                      <button
                        key={yr}
                        type="button"
                        onClick={() => handleSelectYear(yr)}
                        className="py-3 px-2 bg-white hover:bg-purple-600 hover:text-white border border-purple-200 rounded-xl font-bold shadow-sm transition-all text-gray-800 text-sm"
                      >
                        {yr}
                      </button>
                    ))}
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="btn-voltar text-purple-700 hover:text-purple-900 font-semibold text-sm underline cursor-pointer"
                >
                  &lt; Voltar
                </button>
              </div>
            )}

            {/* Calculating Screen (Step 5.5) */}
            {isCalculating && (
              <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex flex-col items-center justify-center text-white px-4">
                <div className="max-w-md text-center space-y-4">
                  <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <h3 className="text-2xl font-bold">Montando a sua leitura...</h3>
                  <p className="text-purple-200 text-sm">
                    Calculando seu Número de Destino através dos seus ciclos de nascimento...
                  </p>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-6">
                    <div className="bg-purple-500 h-full animate-[progress-forward_2.5s_ease-in-out_forwards]" />
                  </div>
                </div>
              </div>
            )}

            {/* Step 6: Civil Status */}
            {currentStep === 6 && (
              <div className="text-center max-w-2xl mx-auto">
                <h2 className="main-title text-2xl font-bold mb-8 text-gray-900">
                  Qual é o seu Estado Civil?
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
                  {CIVIL_STATUSES.map((cs) => (
                    <button
                      key={cs.id}
                      type="button"
                      onClick={() => handleSelectCivilStatus(cs.id)}
                      className="botao-civil flex flex-col items-center justify-center p-5 rounded-2xl shadow-md transition-all transform hover:scale-105 hover:brightness-110 cursor-pointer"
                      style={{
                        backgroundColor: "#9d82c6",
                        border: "2px solid #5b21b6",
                        minHeight: "135px",
                        width: "100%",
                      }}
                    >
                      <img
                        src={cs.icon}
                        alt={cs.label}
                        className="w-12 h-12 mb-2 object-contain"
                      />
                      <span className="text-white font-bold text-base tracking-wide">
                        {cs.label}
                      </span>
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentStep(5)}
                  className="btn-voltar text-purple-700 hover:text-purple-900 font-semibold text-sm underline cursor-pointer"
                >
                  &lt; Voltar
                </button>
              </div>
            )}

            {/* Step 7: Greatest Challenge */}
            {currentStep === 7 && (
              <div className="text-center max-w-2xl mx-auto">
                <h2 className="main-title text-2xl font-bold mb-8 text-gray-900">
                  Qual o maior desafio da sua vida nesse momento?
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  {CHALLENGES.map((ch) => (
                    <button
                      key={ch.id}
                      type="button"
                      onClick={() => handleSelectDesafio(ch.id)}
                      className="botao-desafio flex flex-col items-center justify-center p-6 rounded-2xl shadow-md transition-all transform hover:scale-105 hover:brightness-110 cursor-pointer"
                      style={{
                        backgroundColor: "#9d82c6",
                        border: "2px solid #5b21b6",
                        minHeight: "140px",
                        width: "100%",
                      }}
                    >
                      <img
                        src={ch.icon}
                        alt={ch.label}
                        className="w-12 h-12 mb-3 object-contain"
                      />
                      <span className="text-white font-bold text-lg tracking-wide">
                        {ch.label}
                      </span>
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentStep(6)}
                  className="btn-voltar text-purple-700 hover:text-purple-900 font-semibold text-sm underline cursor-pointer"
                >
                  &lt; Voltar
                </button>
              </div>
            )}

            {/* Step 8: First Name */}
            {currentStep === 8 && (
              <div className="text-center max-w-md mx-auto">
                <h2 className="main-title text-2xl font-bold mb-6 text-gray-900">
                  Qual é o seu Primeiro Nome?
                </h2>
                <form onSubmit={handleNameSubmit} className="space-y-4 mb-8">
                  <div className="text-left">
                    <input
                      type="text"
                      placeholder="Digite seu Primeiro Nome"
                      value={firstName}
                      onChange={(e) => {
                        setFirstName(e.target.value);
                        setFirstNameError("");
                      }}
                      className="w-full px-4 py-3 border border-purple-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-gray-800 text-lg shadow-sm"
                    />
                    {firstNameError && (
                      <p className="text-red-500 text-xs mt-1 font-medium">{firstNameError}</p>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="w-full py-4 px-6 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all text-lg cursor-pointer transform hover:-translate-y-0.5"
                  >
                    Clique Aqui Para Continuar!
                  </button>
                </form>
                <button
                  type="button"
                  onClick={() => setCurrentStep(7)}
                  className="btn-voltar text-purple-700 hover:text-purple-900 font-semibold text-sm underline cursor-pointer"
                >
                  &lt; Voltar
                </button>
              </div>
            )}
          </div>
        )}

        {/* Section 2: Video P1 */}
        {showP1Video && (
          <div className="video-p1-section text-center text-white space-y-6">
            <h3 className="text-xl md:text-2xl font-bold text-amber-300">
              {firstName ? `${firstName}, sua` : "Sua"} Leitura Numerológica Personalizada
            </h3>
            {destinyNumber > 0 && (
              <p className="text-purple-200 text-sm">
                Seu Número de Destino oficial é <span className="text-amber-400 font-bold text-lg">{destinyNumber}</span>
              </p>
            )}

            <div ref={videoP1ContainerRef} className="personalized-video-container mx-auto" />

            <div className="mt-4">
              <button
                type="button"
                onClick={() => setShowEmailModal(true)}
                className="py-3 px-8 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-lg transition-all text-base animate-pulse cursor-pointer"
              >
                Continuar Leitura &gt;
              </button>
            </div>
          </div>
        )}

        {/* Section 3: Email Opt-in Modal */}
        {showEmailModal && (
          <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-[#4682B4] rounded-2xl p-6 sm:p-8 max-w-lg w-full text-white text-center shadow-2xl border border-sky-300/30">
              <p className="text-lg md:text-xl font-medium mb-6">
                Digite o seu <b>e-mail</b> para receber o restante da sua <b>leitura personalizada...</b>
              </p>

              <form onSubmit={handleValidateEmail} className="space-y-4">
                <div className="text-left">
                  <input
                    type="email"
                    placeholder="Digite seu Email"
                    value={emailValue}
                    onChange={(e) => {
                      setEmailValue(e.target.value);
                      setEmailError("");
                    }}
                    className="w-full px-4 py-3 rounded-xl text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 text-base"
                  />
                  {emailError && (
                    <p className="text-amber-200 text-xs mt-1 font-medium">{emailError}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-4 px-6 bg-[#19a10b] hover:bg-green-600 text-white font-bold text-xl rounded-xl shadow-lg transition-all animate-pulse cursor-pointer"
                >
                  Clique para continuar
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Section 4: Video P2 */}
        {showP2Video && (
          <div className="video-p2-section text-center text-white space-y-6">
            <h3 className="text-xl md:text-2xl font-bold text-amber-300">
              Segunda Parte: A Revelação Sobre Seu Desafio
            </h3>

            <div ref={videoP2ContainerRef} className="personalized-video-container-p2 mx-auto" />

            <div className="mt-6">
              <button
                type="button"
                onClick={handleShowPitch}
                className="py-4 px-8 bg-[#19a10b] hover:bg-green-600 text-white font-extrabold text-xl rounded-2xl shadow-2xl transition-all animate-bounce cursor-pointer"
              >
                Quero fazer o Ritual Numerológico
              </button>
            </div>
          </div>
        )}

        {/* Section 5: Pitch Offer */}
        {partePitch && (
          <div className="pitch-section text-center text-white space-y-6">
            <div ref={pitchContainerRef} className="w-full flex justify-center">
              <div
                dangerouslySetInnerHTML={{
                  __html: `<vturb-smartplayer id="vid-691b1f1bf65a4dcdb5b35980" style="display: block; margin: 0 auto; width: 100%; max-width: 400px;"></vturb-smartplayer>`,
                }}
              />
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="footer-disclaimer mt-16 pt-8 border-t border-gray-200/40 text-center text-xs text-gray-500 space-y-4">
          <p className="disclaimer-text max-w-xl mx-auto leading-relaxed">
            <strong className="text-gray-700">Aviso Legal:</strong> Este site não faz parte do Facebook ou do Meta.
            Além disso, NÃO somos endossados pelo Facebook de nenhuma maneira. FACEBOOK é uma marca registrada da Meta Platforms, Inc.
          </p>
          <p className="results-disclaimer max-w-xl mx-auto leading-relaxed">
            Os resultados podem variar de pessoa para pessoa. Este conteúdo é apenas para fins de entretenimento e não substitui aconselhamento profissional financeiro, psicológico ou de saúde.
          </p>
          <div className="footer-links flex items-center justify-center gap-3 text-purple-700 font-medium">
            <button
              type="button"
              onClick={() => setActiveLegalModal("termos")}
              className="hover:underline cursor-pointer"
            >
              Termos de Uso
            </button>
            <span className="text-gray-300">|</span>
            <button
              type="button"
              onClick={() => setActiveLegalModal("privacidade")}
              className="hover:underline cursor-pointer"
            >
              Política de Privacidade
            </button>
            <span className="text-gray-300">|</span>
            <button
              type="button"
              onClick={() => setActiveLegalModal("contato")}
              className="hover:underline cursor-pointer"
            >
              Contato
            </button>
          </div>
        </footer>
      </div>

      {/* Legal Modals */}
      {activeLegalModal && (
        <div className="fixed inset-0 bg-slate-950/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 md:p-8 text-gray-800 shadow-2xl relative text-left">
            <button
              type="button"
              onClick={() => setActiveLegalModal(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-bold text-2xl w-8 h-8 flex items-center justify-center cursor-pointer"
            >
              ✕
            </button>

            {activeLegalModal === "termos" && (
              <div>
                <h2 className="text-2xl font-bold mb-4 text-purple-900">Termos de Uso</h2>
                <div className="space-y-3 text-sm leading-relaxed text-gray-700">
                  <p>
                    Bem-vindo ao Teste Numerológico. Ao utilizar este site e os serviços fornecidos, você concorda em cumprir e vincular-se aos seguintes Termos de Uso.
                  </p>
                  <h3 className="font-bold text-gray-900 mt-4">1. Uso do Conteúdo</h3>
                  <p>
                    O conteúdo fornecido é destinado para fins de entretenimento e autoconhecimento. Não garantimos resultados específicos decorrentes do uso das leituras e orientações.
                  </p>
                  <h3 className="font-bold text-gray-900 mt-4">2. Propriedade Intelectual</h3>
                  <p>
                    Todos os direitos de propriedade intelectual relativos ao conteúdo e design desta página são reservados.
                  </p>
                </div>
              </div>
            )}

            {activeLegalModal === "privacidade" && (
              <div>
                <h2 className="text-2xl font-bold mb-4 text-purple-900">Política de Privacidade</h2>
                <div className="space-y-3 text-sm leading-relaxed text-gray-700">
                  <p>
                    A sua privacidade é de suma importância para nós. Esta política explica como coletamos, usamos e protegemos suas informações pessoais.
                  </p>
                  <h3 className="font-bold text-gray-900 mt-4">1. Coleta de Informações</h3>
                  <p>
                    Coletamos dados fornecidos voluntariamente durante a interação com o quiz, como data de nascimento, primeiro nome e e-mail.
                  </p>
                  <h3 className="font-bold text-gray-900 mt-4">2. Uso dos Dados</h3>
                  <p>
                    Os dados são utilizados para personalizar sua experiência, gerar as leituras e enviar comunicações informativas caso autorizado.
                  </p>
                </div>
              </div>
            )}

            {activeLegalModal === "contato" && (
              <div>
                <h2 className="text-2xl font-bold mb-4 text-purple-900">Contato</h2>
                <div className="space-y-3 text-sm leading-relaxed text-gray-700">
                  <p>
                    Precisa de ajuda ou tem alguma dúvida sobre seu teste ou leitura?
                  </p>
                  <p className="bg-purple-50 p-4 rounded-xl border border-purple-200">
                    Envie um e-mail com o seu <b>Nome Completo</b> e sua dúvida para o nosso suporte:
                    <br />
                    <span className="text-purple-700 font-semibold">contato@mahilaluz.com</span>
                  </p>
                </div>
              </div>
            )}

            <div className="mt-6 text-right">
              <button
                type="button"
                onClick={() => setActiveLegalModal(null)}
                className="py-2 px-6 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-xl text-sm transition-colors cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
