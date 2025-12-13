"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ScrollToTop } from "@/components/scroll-to-top"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, MapPin, MessageCircle, Clock3 } from "lucide-react"

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      topic: formData.get("topic") as string,
      message: formData.get("message") as string,
    }

    try {
      // Мұнда API-ға жіберуге болады, қазір localStorage-ға сақтаймыз
      const messages = JSON.parse(localStorage.getItem("contact_messages") || "[]")
      messages.push({
        ...data,
        id: Date.now().toString(),
        date: new Date().toISOString(),
      })
      localStorage.setItem("contact_messages", JSON.stringify(messages))

      alert("Хабарлама сәтті жіберілді! Біз сізбен жақын арада байланысамыз.")
      e.currentTarget.reset()
    } catch (error) {
      console.error("Хабарлама жіберу қатесі:", error)
      alert("Хабарлама жіберу кезінде қате орын алды. Қайталап көріңіз.")
    } finally {
      setIsSubmitting(false)
    }
  }
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 via-background to-background text-foreground">
      <Header />

      <main className="mx-auto w-full max-w-5xl px-4 py-16 space-y-12">
        <header className="space-y-4 text-center">
          <p className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-sm text-primary">
            <MessageCircle className="h-4 w-4" />
            Байланыста болайық
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-balance">Бізбен байланыс</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-pretty">
            MediaCatalog командасы әр ұсынысты тыңдап, сұрақтарға жауап беруге дайын. Қандай да бір идеяңыз немесе
            серіктестік жоспарыңыз болса, бізге хабарласыңыз.
          </p>
        </header>

        <section className="grid gap-8 md:grid-cols-[1.1fr_1fr]">
          <div className="space-y-6 rounded-2xl border border-white/10 bg-white/5 p-8 shadow-lg backdrop-blur">
            <h2 className="text-2xl font-semibold">Тікелей байланыстар</h2>
            <p className="text-muted-foreground">
              Біз жұмыс күндері 09:00–19:00 аралығында онлайнбыз. Жауап беру уақыты әдетте 24 сағаттан аспайды.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-4 rounded-xl border border-primary/20 bg-primary/10 p-4">
                <Mail className="h-5 w-5 text-primary" />
                <div>
                  <h3 className="font-medium">Email</h3>
                  <p className="text-sm text-muted-foreground">hello@mediacatalog.app</p>
                </div>
              </div>
              <div className="flex items-start gap-4 rounded-xl border border-secondary/20 bg-secondary/10 p-4">
                <Phone className="h-5 w-5 text-secondary" />
                <div>
                  <h3 className="font-medium">Телефон</h3>
                  <p className="text-sm text-muted-foreground">+7 (700) 123-45-67</p>
                </div>
              </div>
              <div className="flex items-start gap-4 rounded-xl border border-accent/20 bg-accent/10 p-4">
                <MapPin className="h-5 w-5 text-accent" />
                <div>
                  <h3 className="font-medium">Офис</h3>
                  <p className="text-sm text-muted-foreground">Алматы, Қонаев көшесі 15, 3-қабат</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-background/60 p-4 text-sm text-muted-foreground space-y-2">
              <div className="flex items-center gap-2">
                <Clock3 className="h-4 w-4 text-primary" />
                <span className="font-medium text-foreground">Қолдау көрсету уақыты</span>
              </div>
              <ul className="space-y-1 pl-4 list-disc marker:text-primary">
                <li>Дүйсенбі–Жұма: 09:00–19:00</li>
                <li>Сенбі: 10:00–17:00 (чат арқылы)</li>
                <li>Жексенбі: демалыс күні</li>
              </ul>
            </div>
          </div>

          <div className="space-y-6 rounded-2xl border border-white/10 bg-white/5 p-8 shadow-lg backdrop-blur">
            <h2 className="text-2xl font-semibold">Хабарлама қалдырыңыз</h2>
            <p className="text-muted-foreground text-sm">
              Сұрағыңызды, ұсынысыңызды немесе пікіріңізді жазыңыз. Ең қысқа мерзімде жауап береміз.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-muted-foreground">
                  Атыңыз
                </label>
                <Input id="name" name="name" placeholder="Атыңыз" required />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-muted-foreground">
                  Email
                </label>
                <Input id="email" name="email" type="email" placeholder="you@example.com" required />
              </div>
              <div className="space-y-2">
                <label htmlFor="topic" className="text-sm font-medium text-muted-foreground">
                  Тақырып
                </label>
                <Input id="topic" name="topic" placeholder="Хабарлама тақырыбы" />
              </div>
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-muted-foreground">
                  Хабарлама
                </label>
                <Textarea id="message" name="message" placeholder="Мәтінді осында жазыңыз..." className="min-h-[140px]" required />
              </div>
              <Button type="submit" className="w-full gap-2 text-base" disabled={isSubmitting}>
                {isSubmitting ? "Жіберілуде..." : "Хабарламаны жіберу"}
              </Button>
            </form>
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur">
          <h2 className="text-xl font-semibold mb-3">Жиі қойылатын сұрақтар</h2>
          <div className="grid gap-6 md:grid-cols-2 text-sm text-muted-foreground">
            <div className="space-y-2">
              <p className="font-medium text-foreground">Контентті қосу үшін не қажет?</p>
              <p>
                Егер платформаңыз немесе шығарылымыңыз болса, бізге қысқаша презентация мен байланыс деректеріңізді
                жіберіңіз. Қамқоршылар командасы 1-2 күн ішінде жауап береді.
              </p>
            </div>
            <div className="space-y-2">
              <p className="font-medium text-foreground">Қолдау қызметіне қалай жүгінемін?</p>
              <p>
                Электронды поштамызға хабарлама жіберіңіз немесе Telegram арнасында сұрақ қойыңыз. Чатта жауап беру
                уақыты әдетте бірнеше сағаттың ішінде.
              </p>
            </div>
            <div className="space-y-2">
              <p className="font-medium text-foreground">Платформа қандай тілдерді қолдайды?</p>
              <p>
                Қазіргі уақытта Kazakh және Russian интерфейстері қолжетімді. Жаңа тілдер бойынша ұсыныстарыңызды
                қуана қабылдаймыз.
              </p>
            </div>
            <div className="space-y-2">
              <p className="font-medium text-foreground">API-ге қол жеткізе аламын ба?</p>
              <p>
                Иә, біз серіктестерге арналған API ұсынамыз. Қол жеткізу үшін командаңыз туралы қысқаша ақпарат пен
                мақсаттарыңызды жіберіңіз.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <ScrollToTop />
    </div>
  )
}

