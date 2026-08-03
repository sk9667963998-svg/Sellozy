import React, { useState, useMemo, useEffect } from "react";

// ⚠️ Apna WhatsApp number yaha daalein (91 + 10 digit, bina + ke)
const WHATSAPP_NUMBER = "919899822788";
import {
  Smartphone,
  IndianRupee,
  Truck,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Circle,
  ScanLine,
  Wallet,
  MapPin,
  Phone,
  User,
  Home,
  Sparkles,
  Hash,
  Signal,
} from "lucide-react";

// ---------------------------------------------------------------------------
// DATA — mock catalogue & pricing rules (swap for a real API later)
// ---------------------------------------------------------------------------

const BRANDS = [
  { id: "apple", name: "Apple" },
  { id: "samsung", name: "Samsung" },
  { id: "oneplus", name: "OnePlus" },
  { id: "xiaomi", name: "Xiaomi" },
  { id: "vivo", name: "Vivo" },
  { id: "oppo", name: "Oppo" },
];

// Each model now has one or more RAM/storage "variants". Base price is per variant.
const MODELS = {
  apple: [
    { id: "iphone14", name: "iPhone 14", variants: [{ id: "128", label: "128GB", base: 38000 }, { id: "256", label: "256GB", base: 43000 }] },
    { id: "iphone13", name: "iPhone 13", variants: [{ id: "128", label: "128GB", base: 28000 }, { id: "256", label: "256GB", base: 32000 }] },
    { id: "iphone12", name: "iPhone 12", variants: [{ id: "64", label: "64GB", base: 20000 }, { id: "128", label: "128GB", base: 22500 }] },
    { id: "iphone11", name: "iPhone 11", variants: [{ id: "64", label: "64GB", base: 14500 }] },
  ],
  samsung: [
    { id: "s23", name: "Galaxy S23", variants: [{ id: "256", label: "256GB", base: 32000 }] },
    { id: "s21", name: "Galaxy S21", variants: [{ id: "128", label: "8GB/128GB", base: 16000 }] },
    { id: "m34", name: "Galaxy M34", variants: [{ id: "6-128", label: "6GB/128GB", base: 9500 }, { id: "8-128", label: "8GB/128GB", base: 10200 }] },
  ],
  oneplus: [
    { id: "op11", name: "OnePlus 11", variants: [{ id: "256", label: "16GB/256GB", base: 22000 }] },
    { id: "opnce3", name: "OnePlus Nord CE 3", variants: [{ id: "8-128", label: "8GB/128GB", base: 12000 }] },
  ],
  xiaomi: [
    {
      id: "rn7",
      name: "Redmi Note 7",
      variants: [
        { id: "3-32", label: "3GB/32GB", base: 4000 },
        { id: "4-64", label: "4GB/64GB", base: 4800 },
        { id: "6-64", label: "6GB/64GB", base: 5400 },
      ],
    },
    { id: "rn12", name: "Redmi Note 12", variants: [{ id: "4-64", label: "4GB/64GB", base: 7000 }, { id: "6-128", label: "6GB/128GB", base: 8200 }] },
    { id: "mi13", name: "Xiaomi 13", variants: [{ id: "256", label: "8GB/256GB", base: 24000 }] },
  ],
  vivo: [{ id: "v27", name: "Vivo V27", variants: [{ id: "8-128", label: "8GB/128GB", base: 11000 }] }],
  oppo: [{ id: "reno8", name: "Oppo Reno 8", variants: [{ id: "8-128", label: "8GB/128GB", base: 13000 }] }],
};

const QUESTIONS = [
  {
    id: "screen",
    label: "Screen ka condition kaisa hai?",
    icon: ScanLine,
    options: [
      { id: "perfect", label: "Bilkul sahi, koi scratch nahi", pct: 0 },
      { id: "minor", label: "Halke scratch hain", pct: -8 },
      { id: "cracked", label: "Crack ya damage hai", pct: -30 },
    ],
  },
  {
    id: "body",
    label: "Body/back panel ka haal?",
    icon: Smartphone,
    options: [
      { id: "new", label: "Naye jaisa", pct: 0 },
      { id: "worn", label: "Scratch/halka dent", pct: -10 },
      { id: "damaged", label: "Bada dent ya toota hua", pct: -20 },
    ],
  },
  {
    id: "battery",
    label: "Battery ka haal kaisa hai?",
    icon: Wallet,
    options: [
      { id: "noissue", label: "Koi issue nahi", pct: 0 },
      { id: "lowbackup", label: "Low back-up (jaldi khatam hoti hai)", pct: -10 },
      { id: "faulty", label: "Battery faulty hai", pct: -20 },
    ],
  },
  {
    id: "frontcam",
    label: "Front camera thik hai?",
    icon: ScanLine,
    options: [
      { id: "ok", label: "Thik hai", pct: 0 },
      { id: "notok", label: "Thik nahi hai", pct: -12 },
    ],
  },
  {
    id: "backcam",
    label: "Back camera thik hai?",
    icon: ScanLine,
    options: [
      { id: "ok", label: "Thik hai", pct: 0 },
      { id: "notok", label: "Thik nahi hai", pct: -15 },
    ],
  },
  {
    id: "camglass",
    label: "Camera ka glass toota hua hai?",
    icon: Smartphone,
    options: [
      { id: "no", label: "Nahi, sahi hai", pct: 0 },
      { id: "yes", label: "Haan, broken hai", pct: -6 },
    ],
  },
  {
    id: "speaker",
    label: "Speaker thik hai?",
    icon: CheckCircle2,
    options: [
      { id: "ok", label: "Thik hai", pct: 0 },
      { id: "notok", label: "Thik nahi hai", pct: -8 },
    ],
  },
  {
    id: "chargingjack",
    label: "Charging jack thik hai?",
    icon: Wallet,
    options: [
      { id: "ok", label: "Thik hai", pct: 0 },
      { id: "notok", label: "Thik nahi hai", pct: -10 },
    ],
  },
  {
    id: "bluetooth",
    label: "Bluetooth thik hai?",
    icon: CheckCircle2,
    options: [
      { id: "ok", label: "Thik hai", pct: 0 },
      { id: "notok", label: "Thik nahi hai", pct: -5 },
    ],
  },
  {
    id: "wifi",
    label: "WiFi working hai?",
    icon: CheckCircle2,
    options: [
      { id: "ok", label: "Thik hai", pct: 0 },
      { id: "notok", label: "Thik nahi hai", pct: -8 },
    ],
  },
  {
    id: "fingerprint",
    label: "Fingerprint sensor working hai?",
    icon: ShieldCheck,
    options: [
      { id: "ok", label: "Working hai", pct: 0 },
      { id: "notok", label: "Working nahi hai", pct: -6 },
    ],
  },
  {
    id: "facelock",
    label: "Face unlock ka status?",
    icon: ShieldCheck,
    options: [
      { id: "working", label: "Working hai", pct: 0 },
      { id: "notpresent", label: "Phone mein feature hi nahi hai", pct: 0 },
      { id: "notworking", label: "Hai lekin working nahi hai", pct: -5 },
    ],
  },
  {
    id: "accessories",
    label: "Box aur charger hai aapke paas?",
    icon: ShieldCheck,
    options: [
      { id: "full", label: "Box + charger dono hain", pct: 3 },
      { id: "phoneonly", label: "Sirf phone hai", pct: 0 },
    ],
  },
];

const STEPS = ["brand", "model", "variant", "condition", "quote", "pickup", "done"];

// ---------------------------------------------------------------------------

export default function PhoneCashApp() {
  const [step, setStep] = useState(0);
  const [brand, setBrand] = useState(null);
  const [model, setModel] = useState(null);
  const [variant, setVariant] = useState(null);
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [pickup, setPickup] = useState({
    name: "",
    phone: "",
    pin: "",
    address: "",
    imei1: "",
    imei2: "",
    sim1: "",
    sim2: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [showLeads, setShowLeads] = useState(false);
  const [leads, setLeads] = useState([]);
  const [leadsLoading, setLeadsLoading] = useState(false);

  const stepName = STEPS[step];

  const finalPrice = useMemo(() => {
    if (!variant) return 0;
    let pct = 0;
    QUESTIONS.forEach((q) => {
      const chosen = answers[q.id];
      if (chosen) {
        const opt = q.options.find((o) => o.id === chosen);
        if (opt) pct += opt.pct;
      }
    });
    const price = variant.base * (1 + pct / 100);
    return Math.max(Math.round(price / 50) * 50, Math.round(variant.base * 0.15));
  }, [answers, variant]);

  const goto = (i) => setStep(i);

  const selectBrand = (b) => {
    setBrand(b);
    setModel(null);
    setVariant(null);
    setAnswers({});
    setQIndex(0);
    goto(1);
  };

  const selectModel = (m) => {
    setModel(m);
    setAnswers({});
    setQIndex(0);
    if (m.variants.length === 1) {
      setVariant(m.variants[0]);
      goto(3);
    } else {
      setVariant(null);
      goto(2);
    }
  };

  const selectVariant = (v) => {
    setVariant(v);
    setAnswers({});
    setQIndex(0);
    goto(3);
  };

  const answerQuestion = (qId, optId) => {
    const next = { ...answers, [qId]: optId };
    setAnswers(next);
    if (qIndex < QUESTIONS.length - 1) {
      setQIndex(qIndex + 1);
    } else {
      goto(4);
    }
  };

  async function saveLead(lead) {
    try {
      let existingLeads = [];
      try {
        const result = await window.storage.get("leads-list", true);
        if (result && result.value) existingLeads = JSON.parse(result.value);
      } catch (e) {
        existingLeads = [];
      }
      existingLeads.push(lead);
      await window.storage.set("leads-list", JSON.stringify(existingLeads), true);
    } catch (e) {
      console.error("Lead save failed:", e);
    }
  }

  async function loadLeads() {
    setLeadsLoading(true);
    try {
      const result = await window.storage.get("leads-list", true);
      setLeads(result && result.value ? JSON.parse(result.value) : []);
    } catch (e) {
      setLeads([]);
    }
    setLeadsLoading(false);
  }

  const openLeads = () => {
    setShowLeads(true);
    loadLeads();
  };

  const confirmPickup = async () => {
    if (!pickupValid) return;
    setSubmitting(true);
    const lead = {
      time: new Date().toLocaleString("en-IN"),
      brand: brand?.name,
      model: model?.name,
      variant: variant?.label,
      price: finalPrice,
      name: pickup.name,
      phone: pickup.phone,
      pin: pickup.pin,
      address: pickup.address,
      imei1: pickup.imei1,
      imei2: pickup.imei2,
      sim1: pickup.sim1,
      sim2: pickup.sim2,
    };
    await saveLead(lead);
    const msg = encodeURIComponent(
      `Naya Lead - Sellozy\n` +
      `Phone: ${lead.brand} ${lead.model} (${lead.variant})\n` +
      `Offer: Rs ${lead.price.toLocaleString("en-IN")}\n` +
      `Naam: ${lead.name}\n` +
      `Mobile: ${lead.phone}\n` +
      `Pincode: ${lead.pin}\n` +
      `Address: ${lead.address}\n` +
      `IMEI 1: ${lead.imei1}\n` +
      `IMEI 2: ${lead.imei2 || "N/A"}\n` +
      `SIM1 network: ${lead.sim1}\n` +
      `SIM2 network: ${lead.sim2 || "N/A"}`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
    setSubmitting(false);
    goto(6);
  };

  const restart = () => {
    setStep(0);
    setBrand(null);
    setModel(null);
    setVariant(null);
    setQIndex(0);
    setAnswers({});
    setPickup({ name: "", phone: "", pin: "", address: "", imei1: "", imei2: "", sim1: "", sim2: "" });
  };

  const pickupValid =
    pickup.name.trim().length > 1 &&
    /^[6-9]\d{9}$/.test(pickup.phone.trim()) &&
    /^\d{6}$/.test(pickup.pin.trim()) &&
    pickup.address.trim().length > 5 &&
    /^\d{15}$/.test(pickup.imei1.trim()) &&
    pickup.sim1 !== "";

  return (
    <div className="min-h-screen w-full bg-[#0B1420] text-[#F2EFE6]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        .font-display { font-family: 'Fraunces', serif; }
        .font-body { font-family: 'Inter', sans-serif; }
        .font-mono { font-family: 'IBM Plex Mono', monospace; }
        .receipt-edge {
          background-image: radial-gradient(circle, #0B1420 3px, transparent 3.5px);
          background-size: 14px 8px;
          background-position: -3px 0;
        }
      `}</style>

      {/* NAV */}
      <header className="border-b border-[#22314A] px-5 py-4 md:px-10 flex items-center justify-between font-body">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-[#C9A54D] flex items-center justify-center">
            <IndianRupee size={18} className="text-[#0B1420]" strokeWidth={2.5} />
          </div>
          <span className="font-display text-lg tracking-tight">Sellozy</span>
        </div>
        <span className="text-xs text-[#8A97AC] hidden sm:block">Sell Your Old Phone, Now</span>
      </header>

      {/* HERO / FLOW */}
      <main className="px-5 md:px-10 py-10 md:py-16 max-w-5xl mx-auto">
        {step === 0 && (
          <div className="mb-10">
            <p className="font-mono text-xs text-[#C9A54D] tracking-widest mb-3">INSTANT VALUATION</p>
            <h1 className="font-display text-4xl md:text-5xl leading-tight mb-3 max-w-2xl">
              Sell Your Old Phone, Now.
            </h1>
            <p className="font-body text-[#8A97AC] max-w-xl mb-1">
              Purana phone, turant cash — ghar baithe pickup ke saath.
            </p>
            <p className="font-body text-[#8A97AC] max-w-xl">
              Brand chuniye, phone ka haal batayiye — turant price milega, jaisa ek receipt par chhapa ho.
            </p>
          </div>
        )}

        <div className="grid md:grid-cols-5 gap-8">
          {/* LEFT: step indicator */}
          <div className="md:col-span-2 font-body">
            <ol className="space-y-4">
              {["Brand", "Model", "Storage", "Condition", "Quote", "Pickup"].map((label, i) => {
                const active = step === i;
                const done = step > i;
                return (
                  <li key={label} className="flex items-center gap-3">
                    {done ? (
                      <CheckCircle2 size={18} className="text-[#5FD3B0]" />
                    ) : active ? (
                      <span className="font-mono text-xs w-[18px] h-[18px] rounded-full border border-[#C9A54D] text-[#C9A54D] flex items-center justify-center">
                        {i + 1}
                      </span>
                    ) : (
                      <Circle size={18} className="text-[#3A4A63]" />
                    )}
                    <span className={active ? "text-[#F2EFE6]" : done ? "text-[#8A97AC]" : "text-[#3A4A63]"}>
                      {label}
                    </span>
                  </li>
                );
              })}
            </ol>

            {model && step >= 3 && (
              <div className="mt-8 p-4 rounded-lg bg-[#131F30] border border-[#22314A]">
                <p className="text-xs text-[#8A97AC] font-mono mb-1">SELECTED</p>
                <p className="font-body text-sm">{brand.name} — {model.name}{variant ? ` (${variant.label})` : ""}</p>
              </div>
            )}
          </div>

          {/* RIGHT: interactive card */}
          <div className="md:col-span-3">
            <div className="rounded-xl bg-[#131F30] border border-[#22314A] p-6 md:p-8 min-h-[380px] flex flex-col">
              {stepName === "brand" && (
                <div className="font-body">
                  <h2 className="font-display text-2xl mb-6">Brand chuniye</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {BRANDS.map((b) => (
                      <button
                        key={b.id}
                        onClick={() => selectBrand(b)}
                        className="px-4 py-4 rounded-lg border border-[#22314A] bg-[#0B1420] hover:border-[#C9A54D] hover:text-[#C9A54D] transition-colors text-sm font-medium"
                      >
                        {b.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {stepName === "model" && brand && (
                <div className="font-body">
                  <button onClick={() => goto(0)} className="flex items-center gap-1 text-xs text-[#8A97AC] mb-5 hover:text-[#C9A54D]">
                    <ChevronLeft size={14} /> Brand badlein
                  </button>
                  <h2 className="font-display text-2xl mb-6">{brand.name} — model chuniye</h2>
                  <div className="space-y-2">
                    {MODELS[brand.id].map((m) => (
                      <button
                        key={m.id}
                        onClick={() => selectModel(m)}
                        className="w-full flex items-center justify-between px-4 py-3 rounded-lg border border-[#22314A] bg-[#0B1420] hover:border-[#C9A54D] transition-colors text-left"
                      >
                        <span className="text-sm">{m.name}</span>
                        <span className="font-mono text-xs text-[#8A97AC]">
                          {m.variants.length > 1 ? `${m.variants.length} storage options` : `up to ₹${m.variants[0].base.toLocaleString("en-IN")}`}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {stepName === "variant" && model && (
                <div className="font-body">
                  <button onClick={() => goto(1)} className="flex items-center gap-1 text-xs text-[#8A97AC] mb-5 hover:text-[#C9A54D]">
                    <ChevronLeft size={14} /> Model badlein
                  </button>
                  <h2 className="font-display text-2xl mb-6">RAM / Storage chuniye</h2>
                  <div className="space-y-2">
                    {model.variants.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => selectVariant(v)}
                        className="w-full flex items-center justify-between px-4 py-3 rounded-lg border border-[#22314A] bg-[#0B1420] hover:border-[#C9A54D] transition-colors text-left"
                      >
                        <span className="text-sm">{v.label}</span>
                        <span className="font-mono text-xs text-[#8A97AC]">up to ₹{v.base.toLocaleString("en-IN")}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {stepName === "condition" && (
                <div className="font-body flex-1 flex flex-col">
                  <button onClick={() => goto(2)} className="flex items-center gap-1 text-xs text-[#8A97AC] mb-5 hover:text-[#C9A54D]">
                    <ChevronLeft size={14} /> Storage badlein
                  </button>
                  <p className="font-mono text-xs text-[#C9A54D] mb-1">
                    SAWAAL {qIndex + 1} / {QUESTIONS.length}
                  </p>
                  {(() => {
                    const q = QUESTIONS[qIndex];
                    const Icon = q.icon;
                    return (
                      <>
                        <div className="flex items-center gap-2 mb-6">
                          <Icon size={20} className="text-[#C9A54D]" />
                          <h2 className="font-display text-xl">{q.label}</h2>
                        </div>
                        <div className="space-y-2">
                          {q.options.map((o) => (
                            <button
                              key={o.id}
                              onClick={() => answerQuestion(q.id, o.id)}
                              className="w-full flex items-center justify-between px-4 py-3 rounded-lg border border-[#22314A] bg-[#0B1420] hover:border-[#C9A54D] transition-colors text-left text-sm"
                            >
                              {o.label}
                              <ChevronRight size={16} className="text-[#3A4A63]" />
                            </button>
                          ))}
                        </div>
                      </>
                    );
                  })()}
                  <div className="mt-auto pt-6 flex gap-1.5">
                    {QUESTIONS.map((_, i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full ${i <= qIndex ? "bg-[#C9A54D]" : "bg-[#22314A]"}`}
                      />
                    ))}
                  </div>
                </div>
              )}

              {stepName === "quote" && model && variant && (
                <div className="font-body">
                  <div className="mx-auto max-w-xs">
                    <div className="bg-[#F2EFE6] text-[#0B1420] rounded-t-md px-6 pt-6 pb-4">
                      <p className="font-mono text-[10px] tracking-widest text-center text-[#0B1420]/60 mb-2">
                        SELLOZY · QUOTE RECEIPT
                      </p>
                      <p className="font-display text-center text-base mb-1">{brand.name} {model.name}</p>
                      <p className="font-mono text-center text-[11px] text-[#0B1420]/60 mb-4">{variant.label}</p>
                      <div className="border-t border-dashed border-[#0B1420]/30 my-3" />
                      <div className="font-mono text-xs space-y-1.5">
                        <div className="flex justify-between"><span>Base value</span><span>₹{variant.base.toLocaleString("en-IN")}</span></div>
                        {QUESTIONS.map((q) => {
                          const chosen = answers[q.id];
                          const opt = q.options.find((o) => o.id === chosen);
                          if (!opt || opt.pct === 0) return null;
                          return (
                            <div className="flex justify-between" key={q.id}>
                              <span>{q.label.split(" ")[0]} adj.</span>
                              <span>{opt.pct > 0 ? "+" : ""}{opt.pct}%</span>
                            </div>
                          );
                        })}
                      </div>
                      <div className="border-t border-dashed border-[#0B1420]/30 my-3" />
                      <p className="font-mono text-[10px] tracking-widest text-center mb-1">FINAL OFFER</p>
                      <p className="font-display text-4xl text-center mb-2">₹{finalPrice.toLocaleString("en-IN")}</p>
                    </div>
                    <div className="h-3 receipt-edge bg-[#F2EFE6]" />
                  </div>
                  <div className="flex gap-3 mt-8 justify-center">
                    <button
                      onClick={() => { setQIndex(0); setAnswers({}); goto(3); }}
                      className="px-4 py-2.5 rounded-lg border border-[#22314A] text-sm hover:border-[#C9A54D]"
                    >
                      Dobara check karein
                    </button>
                    <button
                      onClick={() => goto(5)}
                      className="px-5 py-2.5 rounded-lg bg-[#C9A54D] text-[#0B1420] text-sm font-semibold hover:bg-[#dbb862] flex items-center gap-1.5"
                    >
                      Offer accept, pickup book karein <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {stepName === "pickup" && (
                <div className="font-body">
                  <button onClick={() => goto(4)} className="flex items-center gap-1 text-xs text-[#8A97AC] mb-5 hover:text-[#C9A54D]">
                    <ChevronLeft size={14} /> Quote par wapas
                  </button>
                  <h2 className="font-display text-2xl mb-1">Pickup details bhariye</h2>
                  <p className="text-xs text-[#8A97AC] mb-6">Hum aapke diye pate par phone lene aayenge.</p>
                  <div className="space-y-3">
                    <FieldInput icon={User} placeholder="Poora naam" value={pickup.name} onChange={(v) => setPickup({ ...pickup, name: v })} />
                    <FieldInput icon={Phone} placeholder="Mobile number (10 digit)" value={pickup.phone} onChange={(v) => setPickup({ ...pickup, phone: v.replace(/\D/g, "").slice(0, 10) })} />
                    <FieldInput icon={MapPin} placeholder="Pin code (6 digit)" value={pickup.pin} onChange={(v) => setPickup({ ...pickup, pin: v.replace(/\D/g, "").slice(0, 6) })} />
                    <FieldInput icon={Home} placeholder="Poora address" value={pickup.address} onChange={(v) => setPickup({ ...pickup, address: v })} />
                    <FieldInput icon={Hash} placeholder="IMEI number 1 (15 digit) — *.#06# dabakar dekhein" value={pickup.imei1} onChange={(v) => setPickup({ ...pickup, imei1: v.replace(/\D/g, "").slice(0, 15) })} />
                    <FieldInput icon={Hash} placeholder="IMEI number 2 (agar dual SIM hai)" value={pickup.imei2} onChange={(v) => setPickup({ ...pickup, imei2: v.replace(/\D/g, "").slice(0, 15) })} />

                    <div>
                      <p className="flex items-center gap-1.5 text-xs text-[#8A97AC] mb-2"><Signal size={13} /> SIM 1 network</p>
                      <div className="flex gap-2">
                        {["Working", "Not working"].map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setPickup({ ...pickup, sim1: opt })}
                            className={`flex-1 py-2 rounded-lg border text-xs ${pickup.sim1 === opt ? "border-[#C9A54D] text-[#C9A54D]" : "border-[#22314A] text-[#8A97AC]"}`}
                          >
                            {opt === "Working" ? "Thik hai" : "Thik nahi hai"}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="flex items-center gap-1.5 text-xs text-[#8A97AC] mb-2"><Signal size={13} /> SIM 2 network</p>
                      <div className="flex gap-2">
                        {["Working", "Not working", "No SIM 2"].map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setPickup({ ...pickup, sim2: opt })}
                            className={`flex-1 py-2 rounded-lg border text-xs ${pickup.sim2 === opt ? "border-[#C9A54D] text-[#C9A54D]" : "border-[#22314A] text-[#8A97AC]"}`}
                          >
                            {opt === "Working" ? "Thik hai" : opt === "Not working" ? "Thik nahi" : "SIM 2 nahi hai"}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <button
                    disabled={!pickupValid || submitting}
                    onClick={confirmPickup}
                    className={`mt-6 w-full py-3 rounded-lg text-sm font-semibold flex items-center justify-center gap-1.5 ${
                      pickupValid && !submitting ? "bg-[#C9A54D] text-[#0B1420] hover:bg-[#dbb862]" : "bg-[#22314A] text-[#5A6B85] cursor-not-allowed"
                    }`}
                  >
                    {submitting ? "Bhej rahe hain..." : <>Pickup confirm karein <Truck size={16} /></>}
                  </button>
                </div>
              )}

              {stepName === "done" && (
                <div className="font-body flex flex-col items-center justify-center flex-1 text-center py-6">
                  <Sparkles size={32} className="text-[#5FD3B0] mb-4" />
                  <h2 className="font-display text-2xl mb-2">Booking confirm ho gayi!</h2>
                  <p className="text-sm text-[#8A97AC] mb-1">
                    {pickup.name}, aapka <span className="text-[#F2EFE6]">₹{finalPrice.toLocaleString("en-IN")}</span> ka offer lock ho gaya hai.
                  </p>
                  <p className="text-xs text-[#8A97AC] mb-6">
                    Hum {pickup.pin} pincode par 24–48 ghante mein pickup ke liye call karenge.
                  </p>
                  <button onClick={restart} className="px-5 py-2.5 rounded-lg border border-[#22314A] text-sm hover:border-[#C9A54D]">
                    Ek aur phone sell karein
                  </button>
                </div>
              )}
            </div>

            {/* trust strip */}
            <div className="grid grid-cols-3 gap-3 mt-4 text-center">
              {[
                { icon: ShieldCheck, label: "Verified pricing" },
                { icon: Truck, label: "Free doorstep pickup" },
                { icon: Wallet, label: "Turant payment" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-1.5 py-3 text-[#8A97AC]">
                  <Icon size={16} className="text-[#C9A54D]" />
                  <span className="text-[10px] font-body">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-[#22314A] px-5 md:px-10 py-6 flex flex-col items-center gap-2 text-center text-[10px] text-[#3A4A63] font-mono">
        <button onClick={openLeads} className="text-[#8A97AC] hover:text-[#C9A54D] underline underline-offset-2">
          Saare leads dekhein
        </button>
        <span>PROTOTYPE — pricing engine demo, no real payment processed</span>
      </footer>

      {showLeads && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50" onClick={() => setShowLeads(false)}>
          <div
            className="bg-[#131F30] border border-[#22314A] rounded-xl max-w-lg w-full max-h-[80vh] overflow-y-auto p-6 font-body"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-xl">Leads ({leads.length})</h3>
              <button onClick={() => setShowLeads(false)} className="text-[#8A97AC] hover:text-[#C9A54D] text-sm">
                Band karein
              </button>
            </div>
            {leadsLoading && <p className="text-sm text-[#8A97AC]">Load ho raha hai...</p>}
            {!leadsLoading && leads.length === 0 && (
              <p className="text-sm text-[#8A97AC]">Abhi tak koi lead nahi aayi.</p>
            )}
            <div className="space-y-3">
              {leads.slice().reverse().map((l, i) => (
                <div key={i} className="p-3 rounded-lg bg-[#0B1420] border border-[#22314A] text-sm">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">{l.name}</span>
                    <span className="font-mono text-[#C9A54D]">₹{l.price?.toLocaleString("en-IN")}</span>
                  </div>
                  <p className="text-xs text-[#8A97AC]">{l.brand} {l.model} — {l.variant}</p>
                  <p className="text-xs text-[#8A97AC]">📞 {l.phone} · 📍 {l.pin}</p>
                  <p className="text-xs text-[#8A97AC]">{l.address}</p>
                  <p className="text-xs text-[#8A97AC]">IMEI1: {l.imei1} {l.imei2 ? `· IMEI2: ${l.imei2}` : ""}</p>
                  <p className="text-xs text-[#8A97AC]">SIM1: {l.sim1} {l.sim2 ? `· SIM2: ${l.sim2}` : ""}</p>
                  <p className="text-[10px] text-[#3A4A63] font-mono mt-1">{l.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FieldInput({ icon: Icon, placeholder, value, onChange }) {
  return (
    <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg border border-[#22314A] bg-[#0B1420] focus-within:border-[#C9A54D]">
      <Icon size={15} className="text-[#5A6B85] shrink-0" />
      <input
        className="bg-transparent outline-none text-sm w-full placeholder:text-[#5A6B85] font-body"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
