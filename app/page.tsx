'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Calendar, 
  MapPin, 
  CreditCard, 
  QrCode, 
  Clock, 
  Smartphone, 
  Heart, 
  Sparkles, 
  Leaf, 
  Star, 
  Menu, 
  X,
  CheckCircle2
} from 'lucide-react'
import { PawIcon } from '@/components/ui/paw-icon'

// Testimonial data
const testimonials = [
  {
    name: "Carlos Silva",
    pet: "Thor (Labrador)",
    text: "Meu labrador adora o banho self-service! Ambiente tranquilo e produtos de qualidade. Economizo tempo e dinheiro.",
    rating: 5
  },
  {
    name: "Mariana Costa",
    pet: "Luna (Poodle)",
    text: "Minha poodle ficava muito estressada em pet shops tradicionais. No La'vie Pet ela fica calma e eu fortaleci nosso vínculo.",
    rating: 5
  },
  {
    name: "Rafael Mendes",
    pet: "Max (Golden)",
    text: "Praticidade incrível! Agendei pelo app, recebi o QR code e em 30 minutos meu golden estava limpo e feliz.",
    rating: 5
  }
]

// Stats data
const stats = [
  { value: "98%", label: "Satisfação", icon: <Heart className="w-5 h-5 text-lavie-yellow" /> },
  { value: "30min", label: "Tempo médio", icon: <Clock className="w-5 h-5 text-lavie-yellow" /> },
  { value: "100%", label: "Sustentável", icon: <Leaf className="w-5 h-5 text-lavie-green" /> },
  { value: "24/7", label: "Agendamento", icon: <Calendar className="w-5 h-5 text-lavie-yellow" /> }
]

export default function HomePage() {
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial(prev => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-lavie-white overflow-hidden">
      {/* Header */}
      <header className="bg-lavie-white border-b border-lavie-gray sticky top-0 z-50 backdrop-blur-sm bg-lavie-white/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              {/* Logo */}
              <Link href="/" className="flex items-center space-x-3 group">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-lg">
                  <PawIcon size={24} color="white" variant="filled" />
                </div>
                <div className="font-display">
                  <span className="text-2xl font-bold text-lavie-black">La&apos;vie</span>
                  <span className="text-2xl font-bold text-lavie-yellow ml-1">Pet</span>
                </div>
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <nav className="flex space-x-6 mr-6">
                <Link href="#como-funciona" className="text-lavie-black/80 hover:text-lavie-black font-medium transition-colors">
                  Como Funciona
                </Link>
                <Link href="#valores" className="text-lavie-black/80 hover:text-lavie-black font-medium transition-colors">
                  Valores
                </Link>
                <Link href="#depoimentos" className="text-lavie-black/80 hover:text-lavie-black font-medium transition-colors">
                  Depoimentos
                </Link>
              </nav>
              <div className="flex space-x-4">
                <Button 
                  variant="outline" 
                  className="border-lavie-black text-lavie-black hover:bg-lavie-yellow hover:text-lavie-black font-display font-semibold"
                  asChild
                >
                  <Link href="/login">Entrar</Link>
                </Button>
                <Button 
                  className="bg-lavie-yellow text-lavie-black hover:bg-lavie-black hover:text-lavie-yellow font-display font-semibold"
                  asChild
                >
                  <Link href="/register">Cadastrar</Link>
                </Button>
              </div>
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-lavie-black"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-lavie-gray animate-in slide-in-from-top duration-200">
            <div className="px-4 py-6 space-y-6">
              <nav className="flex flex-col space-y-4">
                <Link 
                  href="#como-funciona" 
                  className="text-lavie-black/80 hover:text-lavie-black font-medium transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Como Funciona
                </Link>
                <Link 
                  href="#valores" 
                  className="text-lavie-black/80 hover:text-lavie-black font-medium transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Valores
                </Link>
                <Link 
                  href="#depoimentos" 
                  className="text-lavie-black/80 hover:text-lavie-black font-medium transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Depoimentos
                </Link>
              </nav>
              <div className="flex flex-col space-y-3">
                <Button 
                  variant="outline" 
                  className="border-lavie-black text-lavie-black hover:bg-lavie-yellow hover:text-lavie-black font-display font-semibold w-full"
                  asChild
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Link href="/login">Entrar</Link>
                </Button>
                <Button 
                  className="bg-lavie-yellow text-lavie-black hover:bg-lavie-black hover:text-lavie-yellow font-display font-semibold w-full"
                  asChild
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Link href="/register">Cadastrar</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative bg-lavie-yellow py-16 md:py-24 overflow-hidden">
        {/* Decorative bubbles */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-lavie-white/30 rounded-full bubble-element"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-lavie-black/20 rounded-full bubble-element" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-lavie-white/40 rounded-full bubble-element" style={{animationDelay: '4s'}}></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Hero content */}
            <div className="lg:w-1/2 text-center lg:text-left">
              <div className="mb-2">
                <span className="inline-block bg-lavie-black text-lavie-yellow px-4 py-1 rounded-full text-sm font-semibold mb-4 animate-pulse">
                  🎉 Primeira unidade em Tambaú/SP
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl font-display font-bold text-lavie-black mb-4 leading-tight">
                É MAIS QUE UM <span className="relative">
                  BANHO
                  <span className="absolute -bottom-2 left-0 w-full h-2 bg-lavie-black/20 rounded-full"></span>
                </span>
              </h1>
              <p className="text-2xl md:text-3xl text-lavie-black/90 mb-8">
                É vínculo, cuidado e respeito à vida.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button 
                  size="lg" 
                  className="bg-lavie-black text-lavie-yellow hover:bg-lavie-white hover:text-lavie-black font-display font-semibold text-lg px-8 py-6 h-auto group transition-all duration-300 hover:scale-105"
                  asChild
                >
                  <Link href="/register">
                    <Calendar className="mr-2 h-6 w-6 group-hover:animate-bounce" />
                    AGENDAR AGORA
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-2 border-lavie-black text-lavie-black hover:bg-lavie-black hover:text-lavie-yellow font-display font-semibold text-lg px-8 py-6 h-auto transition-all duration-300 hover:scale-105"
                  asChild
                >
                  <Link href="/login">
                    Já tenho conta
                  </Link>
                </Button>
              </div>
            </div>
            
            {/* Hero feature card */}
            <div className="lg:w-1/2">
              <div className="bg-lavie-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-xl relative overflow-hidden transform hover:scale-105 transition-transform duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-lavie-yellow/20 rounded-bl-full -mr-10 -mt-10"></div>
                
                <h2 className="text-3xl md:text-4xl font-display font-bold text-lavie-black mb-6 relative z-10">
                  Banho Experience
                </h2>
                <p className="text-lg text-lavie-black/80 mb-6 leading-relaxed">
                  Inovação no cuidado animal com autoatendimento sustentável. 
                  Agende online, pague digital e acesse com QR Code.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-lavie-gray/30 rounded-xl p-4 flex items-center space-x-3 hover:bg-lavie-yellow/20 transition-colors duration-300">
                    <Clock className="w-8 h-8 text-lavie-black/70" />
                    <div>
                      <span className="block font-semibold text-lavie-black">30 minutos</span>
                      <span className="text-sm text-lavie-black/60">Tempo médio</span>
                    </div>
                  </div>
                  <div className="bg-lavie-gray/30 rounded-xl p-4 flex items-center space-x-3 hover:bg-lavie-yellow/20 transition-colors duration-300">
                    <CreditCard className="w-8 h-8 text-lavie-black/70" />
                    <div>
                      <span className="block font-semibold text-lavie-black">R$ 30,00</span>
                      <span className="text-sm text-lavie-black/60">Preço fixo</span>
                    </div>
                  </div>
                  <div className="bg-lavie-gray/30 rounded-xl p-4 flex items-center space-x-3 hover:bg-lavie-yellow/20 transition-colors duration-300">
                    <MapPin className="w-8 h-8 text-lavie-black/70" />
                    <div>
                      <span className="block font-semibold text-lavie-black">São Paulo/SP</span>
                      <span className="text-sm text-lavie-black/60">Localização</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 text-lavie-black/70 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-lavie-green" />
                  <span>Disponível 24/7 • Produtos inclusos • Ambiente privativo</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Stats section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <div className="bg-lavie-black/90 backdrop-blur-sm rounded-2xl p-6 md:p-8 transform hover:scale-105 transition-transform duration-300">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className="flex justify-center mb-2 group-hover:scale-110 transition-transform duration-300">
                    {stat.icon}
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-lavie-white mb-1">{stat.value}</div>
                  <div className="text-sm text-lavie-white/70">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section id="como-funciona" className="py-20 bg-lavie-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-lavie-black mb-6 uppercase tracking-wide">
              Como Funciona
            </h2>
            <p className="text-xl text-lavie-black/70 max-w-3xl mx-auto leading-relaxed">
              Simples, rápido e sem complicações. Em 5 passos você e seu pet terão uma experiência única de banho.
            </p>
          </div>
          
          <div className="grid md:grid-cols-5 gap-6 lg:gap-8">
            {[
              {
                icon: <Smartphone className="h-10 w-10 text-lavie-black group-hover:text-lavie-yellow transition-colors duration-300" />,
                title: "1. ACESSE PELO SEU CELULAR",
                description: "Abra o app La'vie Pet no seu smartphone. Cadastre-se rapidamente e faça login."
              },
              {
                icon: <MapPin className="h-10 w-10 text-lavie-black group-hover:text-lavie-yellow transition-colors duration-300" />,
                title: "2. ESCOLHA O CONTAINER",
                description: "Veja containers disponíveis em Tambaú/SP. Selecione o mais próximo e conveniente."
              },
              {
                icon: <Calendar className="h-10 w-10 text-lavie-black group-hover:text-lavie-yellow transition-colors duration-300" />,
                title: "3. AGENDE SEU HORÁRIO",
                description: "Escolha data e horário que preferir. Disponível 8h às 18h, todos os dias."
              },
              {
                icon: <CreditCard className="h-10 w-10 text-lavie-black group-hover:text-lavie-yellow transition-colors duration-300" />,
                title: "4. PAGUE E RECEBA QR CODE",
                description: "PIX ou cartão - R$ 30,00 fixo. Receba o QR Code de acesso por WhatsApp e email."
              },
              {
                icon: <PawIcon size={40} className="text-lavie-black group-hover:text-lavie-yellow transition-colors duration-300" variant="filled" />,
                title: "5. CHEGUE E LIBERE PELO APP",
                description: "Chegue no local, escaneie o QR Code e aproveite 30 minutos únicos com seu pet."
              }
            ].map((step, index) => (
              <div key={index} className="text-center group">
                <div className="w-20 h-20 bg-lavie-yellow rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-lavie-black transition-colors duration-300 shadow-lg transform group-hover:scale-110">
                  {step.icon}
                </div>
                <div className="bg-lavie-gray/50 rounded-xl p-6 hover:shadow-md transition-all duration-300 h-full flex flex-col group-hover:bg-lavie-yellow/10">
                  <h3 className="text-lg font-display font-bold text-lavie-black mb-3 leading-tight">{step.title}</h3>
                  <p className="text-lavie-black/70 leading-relaxed text-sm">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Produtos inclusos */}
          <div className="mt-16 bg-lavie-yellow/10 rounded-2xl p-8 border-2 border-lavie-yellow/20">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-display font-bold text-lavie-black mb-3">
                🧴 Tudo Incluído no Serviço
              </h3>
              <p className="text-lavie-black/70 text-lg">
                Você não precisa se preocupar com nada. Todos os produtos e equipamentos estão inclusos:
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 text-center">
              {[
                { icon: "🧴", name: "Shampoo\nProfissional" },
                { icon: "💧", name: "Condicionador\nHidratante" },
                { icon: "🪥", name: "Escovas\nEspeciais" },
                { icon: "💨", name: "Secador\nPotente" },
                { icon: "🤍", name: "Toalhas\nLimpas" }
              ].map((item, index) => (
                <div key={index} className="bg-lavie-white rounded-xl p-4 hover:shadow-md transition-all duration-300 border border-lavie-gray/20">
                  <div className="text-3xl mb-2">{item.icon}</div>
                  <p className="text-sm font-semibold text-lavie-black whitespace-pre-line leading-tight">
                    {item.name}
                  </p>
                </div>
              ))}
            </div>
            
            <div className="mt-8 text-center">
              <div className="inline-flex items-center space-x-2 bg-lavie-black rounded-full px-6 py-3">
                <CheckCircle2 className="w-5 h-5 text-lavie-green" />
                <span className="text-lavie-white font-semibold">
                  Produtos 100% biodegradáveis • Ambiente climatizado • Privacidade total
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Valores da Marca */}
      <section id="valores" className="py-20 bg-lavie-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-lavie-yellow mb-6 uppercase tracking-wide">
              Conceito
            </h2>
            <p className="text-xl text-lavie-white/80 max-w-3xl mx-auto leading-relaxed">
              Inovação, conveniência, respeito à vida e consciência ambiental 
              guiam cada experiência La&apos;vie Pet
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Sparkles className="h-6 w-6 text-lavie-black" />,
                title: "INOVAÇÃO",
                color: "bg-lavie-yellow",
                items: [
                  "Agendamento 24/7 pelo app",
                  "Acesso controlado por QR Code",
                  "Container exclusivo por 30 min",
                  "Sem filas ou esperas"
                ]
              },
              {
                icon: <Heart className="h-6 w-6 text-lavie-black" />,
                title: "CUIDADO",
                color: "bg-lavie-yellow",
                items: [
                  "Ambiente limpo e seguro",
                  "Privacidade total para seu pet",
                  "Temperatura controlada",
                  "Fortalecimento do vínculo tutor-pet"
                ]
              },
              {
                icon: <Leaf className="h-6 w-6 text-lavie-white" />,
                title: "SUSTENTÁVEL",
                color: "bg-lavie-green",
                items: [
                  "Produtos 100% biodegradáveis",
                  "Economia de água inteligente",
                  "Preço justo: R$ 30,00 fixo",
                  "Zero desperdício"
                ]
              }
            ].map((value, index) => (
              <div key={index} className="bg-lavie-white rounded-2xl p-8 hover:transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                <div className="flex items-center mb-6">
                  <div className={`w-12 h-12 ${value.color} rounded-full flex items-center justify-center mr-4`}>
                    {value.icon}
                  </div>
                  <h3 className="text-2xl font-display font-bold text-lavie-black">{value.title}</h3>
                </div>
                <ul className="space-y-3 text-lavie-black/80">
                  {value.items.map((item, i) => (
                    <li key={i} className="flex items-start">
                      <span className={`w-2 h-2 ${value.color === 'bg-lavie-green' ? 'bg-lavie-green' : 'bg-lavie-yellow'} rounded-full mt-2 mr-3 flex-shrink-0`}></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="depoimentos" className="py-20 bg-lavie-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-lavie-black mb-6 uppercase tracking-wide">
              O que dizem nossos clientes
            </h2>
            <p className="text-xl text-lavie-black/70 max-w-3xl mx-auto leading-relaxed">
              Experiências reais de tutores que já utilizam o La&apos;vie Pet
            </p>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[480px] h-[480px] rounded-full bg-gradient-to-b from-lavie-yellow/25 via-lavie-yellow/5 to-lavie-yellow/0 opacity-70"></div>
            </div>
            
            <div className="relative">
              <div className="flex justify-center mb-8">
                {testimonials.map((testimonial, index) => (
                  activeTestimonial === index && (
                    <div key={index} className="flex flex-col items-center transform transition-all duration-500">
                      <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-lavie-yellow mb-4 shadow-lg">
                        <div className="w-full h-full bg-gradient-to-br from-lavie-yellow to-lavie-black/20 flex items-center justify-center">
                          <span className="text-2xl font-bold text-lavie-black">
                            {testimonial.name.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div className="flex mb-2">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 text-lavie-yellow fill-lavie-yellow" />
                        ))}
                      </div>
                      <div className="bg-lavie-white shadow-lg rounded-2xl p-8 max-w-2xl text-center mb-4 border border-lavie-gray/20">
                        <p className="text-xl text-lavie-black/80 italic mb-4">"{testimonial.text}"</p>
                        <p className="font-semibold text-lavie-black">{testimonial.name}</p>
                        <p className="text-sm text-lavie-black/60">{testimonial.pet}</p>
                      </div>
                    </div>
                  )
                ))}
              </div>
              
              <div className="flex justify-center space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      activeTestimonial === index ? 'bg-lavie-yellow scale-125' : 'bg-lavie-gray hover:bg-lavie-yellow/50'
                    }`}
                    aria-label={`View testimonial ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Principal */}
      <section className="relative py-24 bg-lavie-yellow overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-30">
          <div className="absolute left-1/2 h-[256px] w-[60%] -translate-x-1/2 scale-[2.5] rounded-[50%] bg-[radial-gradient(ellipse_at_center,_hsla(0,0%,0%,.5)_10%,_hsla(0,0%,0%,0)_60%)] sm:h-[512px]" />
          <div className="absolute left-1/2 h-[128px] w-[40%] -translate-x-1/2 scale-[2] rounded-[50%] bg-[radial-gradient(ellipse_at_center,_hsla(50,100%,50%,.3)_10%,_hsla(0,0%,0%,0)_60%)] sm:h-[256px]" />
        </div>
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-lavie-black mb-8 uppercase tracking-wide">
              Primeira Unidade em São Paulo
            </h2>
            <div className="bg-lavie-black/95 backdrop-blur-sm rounded-2xl p-8 mb-8">
              <p className="text-2xl md:text-3xl text-lavie-yellow font-display font-semibold mb-4">
                &ldquo;Vínculo, cuidado e respeito à vida&rdquo;
              </p>
              <p className="text-xl text-lavie-white/90 mb-6 leading-relaxed">
                Cadastre-se agora e agende o primeiro banho self-service. 
                Experiência revolucionária para você e seu pet.
              </p>
              <div className="flex flex-wrap justify-center gap-6 text-lavie-white/80 mb-6">
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>8h às 18h</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5" />
                  <span>Todos os dias</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CreditCard className="w-5 h-5" />
                  <span>R$ 30,00</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="transform hover:scale-105 transition-transform duration-300">
            <Button 
              size="lg" 
              className="bg-lavie-black text-lavie-yellow hover:bg-lavie-white hover:text-lavie-black font-display font-bold text-xl px-12 py-6 rounded-xl h-auto group"
              asChild
            >
              <Link href="/register">
                <Calendar className="mr-3 h-7 w-7 group-hover:animate-bounce" />
                COMEÇAR AGORA
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-lavie-black text-lavie-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-4 gap-8 mb-12">
            {/* Logo e Tagline */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                  <PawIcon size={28} color="white" variant="filled" />
                </div>
                <div className="font-display">
                  <span className="text-3xl font-bold text-lavie-white">La&apos;vie</span>
                  <span className="text-3xl font-bold text-lavie-yellow ml-1">Pet</span>
                </div>
              </div>
              <p className="text-xl text-lavie-yellow font-display font-semibold mb-4">
                &ldquo;É mais que um banho. É vínculo, cuidado e respeito à vida.&rdquo;
              </p>
              <p className="text-lavie-white/80 leading-relaxed max-w-md">
                Revolucionando o cuidado com pets através da inovação, 
                conveniência e consciência ambiental em Tambaú/SP.
              </p>
            </div>
            
            {/* Contato */}
            <div>
              <h3 className="text-xl font-display font-bold text-lavie-yellow mb-6 uppercase">Contato</h3>
              <div className="space-y-4 text-lavie-white/80">
                <div className="flex items-center space-x-3">
                  <Smartphone className="w-5 h-5 text-lavie-yellow" />
                  <span>(11) 99999-9999</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-lavie-yellow rounded-full flex items-center justify-center">
                    <span className="text-lavie-black text-xs font-bold">@</span>
                  </div>
                  <span>contato@laviepet.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-lavie-yellow" />
                  <span>Tambaú - SP</span>
                </div>
              </div>
            </div>
            
            {/* Funcionalidades */}
            <div>
              <h3 className="text-xl font-display font-bold text-lavie-yellow mb-6 uppercase">Serviços</h3>
              <div className="space-y-3 text-lavie-white/80">
                <div className="flex items-center space-x-3">
                  <QrCode className="w-4 h-4 text-lavie-yellow" />
                  <span>QR Code de Acesso</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Smartphone className="w-4 h-4 text-lavie-yellow" />
                  <span>Agendamento Online</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CreditCard className="w-4 h-4 text-lavie-yellow" />
                  <span>Pagamento Digital</span>
                </div>
                <div className="flex items-center space-x-3">
                  <PawIcon size={16} color="#f59e0b" variant="filled" />
                  <span>Container Self-Service</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-lavie-white/20 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-lavie-white/60 mb-4 md:mb-0">
                &copy; 2024 La&apos;vie Pet. Todos os direitos reservados.
              </p>
              <div className="flex items-center space-x-6 text-lavie-white/60">
                <span className="flex items-center space-x-2">
                  <Leaf className="w-4 h-4 text-lavie-green" />
                  <span>100% Sustentável</span>
                </span>
                <span className="flex items-center space-x-2">
                  <Heart className="w-4 h-4 text-lavie-yellow" />
                  <span>Pet Friendly</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}