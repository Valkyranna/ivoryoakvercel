'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Fuse from 'fuse.js'
import nlp from 'compromise'

interface Message {
  role: 'bot' | 'user'
  text: string
  options?: string[]
}

interface FAQ {
  q: string
  a: string
  keywords: string[]
}

const faqs: FAQ[] = [
  {
    q: 'What services do you offer?',
    a: 'We offer three main services:\n\n• **Recurring Cleaning** — weekly, bi-weekly, or monthly\n• **Deep Cleaning** — top-to-bottom thorough clean\n• **Move-In / Move-Out** — full interior for fresh starts\n\nEach can be customized to your needs.',
    keywords: ['service', 'offer', 'cleaning', 'what do you do', 'types'],
  },
  {
    q: 'How much does it cost?',
    a: 'Our pricing:\n\n• **Fresh Start** (one-time deep clean) — from $189\n• **Sweet as Tea** (bi-weekly) — $129/visit\n• **Front Porch** (weekly) — $109/visit\n\nMove-in/move-out starts at $249. Final price depends on your home size.',
    keywords: ['price', 'cost', 'how much', 'rate', 'pricing', 'expensive', 'cheap', 'afford'],
  },
  {
    q: 'Do you bring your own supplies?',
    a: 'Yes! We bring everything — cleaning products, equipment, and supplies. You don\'t need to provide anything. We use eco-friendly products that are safe for kids and pets.',
    keywords: ['supplies', 'products', 'equipment', 'bring', 'provide', 'eco', 'green', 'safe'],
  },
  {
    q: 'Do I need to be home?',
    a: 'Not at all! Many of our clients give us a key or garage code. We\'re fully bonded and insured, so your home is in safe hands. We\'ll lock up when we\'re done.',
    keywords: ['home', 'be there', 'present', 'key', 'lock', 'leave', 'gone', 'away'],
  },
  {
    q: 'What areas do you serve?',
    a: 'We serve the greater Cincinnati area — Hyde Park, Oakley, Mason, Anderson Township, Montgomery, Kenwood, and surrounding neighborhoods within about 25 miles of downtown.',
    keywords: ['area', 'location', 'serve', 'where', 'cincinnati', 'neighborhood', 'zip'],
  },
  {
    q: 'How do I book?',
    a: 'You can book right here! Just type **"book a cleaning"** and I\'ll walk you through it. Or scroll up to the booking form on this page. We confirm within 2 hours.',
    keywords: ['book', 'schedule', 'appointment', 'reserve', 'sign up', 'how to book'],
  },
  {
    q: 'What\'s your cancellation policy?',
    a: 'We ask for at least 24 hours notice for cancellations or rescheduling. Same-day cancellations may incur a small fee. Life happens — just give us a heads up!',
    keywords: ['cancel', 'reschedule', 'change', 'policy', 'notice', 'refund'],
  },
  {
    q: 'Are you insured?',
    a: 'Yes! We\'re fully bonded and insured. Every member of our team is background-checked. Your home and belongings are protected while we\'re there.',
    keywords: ['insurance', 'insured', 'bonded', 'background', 'check', 'trust', 'safe', 'reliable'],
  },
  {
    q: 'Do you clean with pets in the home?',
    a: 'Absolutely! We love furry friends. Just let us know about your pets when you book so we can plan accordingly. We use pet-safe products.',
    keywords: ['pet', 'dog', 'cat', 'animal', 'furry', 'safe'],
  },
  {
    q: 'How long does a cleaning take?',
    a: 'It depends on your home size and service type. A standard recurring clean takes 1.5–3 hours. Deep cleans can take 3–5 hours. We\'ll give you a time estimate when you book.',
    keywords: ['time', 'long', 'duration', 'hours', 'how long', 'finish'],
  },
]

const fuse = new Fuse(faqs, {
  keys: ['q', 'keywords'],
  threshold: 0.4,
  includeScore: true,
})

const greetings = ['hi', 'hello', 'hey', 'howdy', 'good morning', 'good afternoon', 'good evening', 'yo', 'sup']

const bookingKeywords = ['book', 'schedule', 'appointment', 'reserve', 'sign up', 'get started', 'want to book', 'need a clean']

type BookingState = null | 'service' | 'size' | 'address' | 'date' | 'name' | 'phone' | 'email' | 'confirm'

const CHAT_STORAGE_KEY = 'ivoryoak-chat'
const CHAT_EXPIRY_MS = 2 * 60 * 60 * 1000 // 2 hours

export default function ChatBot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>(() => {
    // Load from localStorage if not expired
    try {
      const saved = localStorage.getItem(CHAT_STORAGE_KEY)
      if (saved) {
        const { messages: savedMsgs, timestamp } = JSON.parse(saved)
        if (Date.now() - timestamp < CHAT_EXPIRY_MS && savedMsgs.length > 0) {
          return savedMsgs
        }
        localStorage.removeItem(CHAT_STORAGE_KEY)
      }
    } catch { /* ignore */ }
    return [{
      role: 'bot',
      text: "Hey there! I'm the Ivory & Oak assistant. Ask me anything about our cleaning services, pricing, or type **\"book a cleaning\"** to get started.",
    }]
  })
  const [input, setInput] = useState('')
  const [booking, setBooking] = useState<BookingState>(null)
  const [bookingData, setBookingData] = useState<Record<string, string>>({})
  const [userName, setUserName] = useState('')
  const [typing, setTyping] = useState(false)
  const [recentTopics, setRecentTopics] = useState<string[]>([])
  const listRef = useRef<HTMLDivElement>(null)

  // Save to localStorage on message change
  useEffect(() => {
    try {
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify({
        messages,
        timestamp: Date.now(),
      }))
    } catch { /* ignore */ }
  }, [messages])

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }, [messages, typing])

  const addBotMessage = useCallback((text: string, options?: string[]) => {
    setTyping(true)
    const delay = Math.min(300 + text.length * 4, 800)
    setTimeout(() => {
      setTyping(false)
      setMessages(prev => [...prev, { role: 'bot', text, options }])
    }, delay)
  }, [])

  // NLP helpers using Compromise.js
  const extractName = useCallback((text: string): string | null => {
    const doc = nlp(text)
    const people = doc.people().out('array')
    if (people.length > 0) return people.join(' ')

    // Only try fallback if the message starts with a name introduction pattern
    const nameMatch = text.match(/^(?:my name is|i'm|i am|it's|its|call me|this is|name's)\s+(.+?)(?:\s+(?:and|but|so|i|need|want|looking|please|here))/i)
    if (nameMatch && nameMatch[1]) {
      const candidate = nameMatch[1].trim()
      if (candidate.split(' ').length <= 3 && !/\d/.test(candidate) && candidate.length < 30) {
        return candidate
      }
    }

    const hiNameMatch = text.match(/^(?:hi|hello|hey|howdy)\s+(?:my name is|i'm|i am|this is)\s+(\w+)/i)
    if (hiNameMatch && hiNameMatch[1]) return hiNameMatch[1]

    return null
  }, [])

  const parseDate = useCallback((text: string): string => {
    const lower = text.toLowerCase().trim()
    if (lower === 'today') {
      return new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
    }
    if (lower === 'tomorrow') {
      const d = new Date()
      d.setDate(d.getDate() + 1)
      return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
    }
    const dayMatch = lower.match(/next\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday)/)
    if (dayMatch) {
      const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
      const targetDay = days.indexOf(dayMatch[1]!)
      const today = new Date()
      const currentDay = today.getDay()
      let diff = targetDay - currentDay
      if (diff <= 0) diff += 7
      const target = new Date()
      target.setDate(today.getDate() + diff)
      return target.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
    }
    const monthMatch = lower.match(/(january|february|march|april|may|june|july|august|september|october|november|december)\s+(\d{1,2})/i)
      || lower.match(/(\d{1,2})(st|nd|rd|th)?\s+of\s+(january|february|march|april|may|june|july|august|september|october|november|december)/i)
    if (monthMatch) return text.trim()
    const slashMatch = lower.match(/(\d{1,2})\/(\d{1,2})/)
    if (slashMatch) {
      const month = parseInt(slashMatch[1]!)
      const day = parseInt(slashMatch[2]!)
      const d = new Date(new Date().getFullYear(), month - 1, day)
      return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
    }
    return text.trim()
  }, [])

  // Detect negation - "I don't want X" or "no X please"
  const hasNegation = useCallback((text: string, keyword: string): boolean => {
    const doc = nlp(text)
    const negated = doc.match(`!${keyword}`).not(`(don't|do not|not|no|never) ${keyword}`)
    return doc.match(`(don't|do not|not|no|never) ${keyword}`).found
  }, [])

  // Extract home size from possessives and room counts
  const inferHomeSize = useCallback((text: string): string | null => {
    const doc = nlp(text)
    const num = (doc.numbers().get() as number[])[0]
    const lower = text.toLowerCase()

    // "X bedroom(s)" pattern
    const bedroomMatch = lower.match(/(\d+|one|two|three|four|five|six|seven|eight)\s*(bedroom|bed|br)/i)
    if (bedroomMatch) {
      const countMap: Record<string, string> = { one: '1', two: '2', three: '3', four: '4', five: '5', six: '6', seven: '7', eight: '8' }
      const count = countMap[bedroomMatch[1]!.toLowerCase()] || bedroomMatch[1]
      if (count === '1') return 'Studio / 1 BR'
      if (count === '2' || count === '3') return '2–3 Bedrooms'
      if (count === '4' || count === '5') return '4–5 Bedrooms'
      if (parseInt(count!) >= 6) return '6+ Bedrooms'
    }

    // Possessive property types
    if (doc.match('(my|our|the) (studio|apartment|flat)').found) return 'Studio / 1 BR'
    if (doc.match('(my|our|the) (house|home|condo|condominium)').found) {
      if (doc.match('(big|large|huge|spacious)').found) return '4–5 Bedrooms'
      if (doc.match('(small|tiny|cozy|little)').found) return 'Studio / 1 BR'
      return '2–3 Bedrooms' // default for house
    }
    if (doc.match('(my|our|the) (office|business|store|shop|building|commercial)').found) return 'Commercial / Office'

    return null
  }, [])

  // Extract service modifiers from adjectives
  const extractServiceModifier = useCallback((text: string): string | null => {
    const doc = nlp(text)
    const adjectives = doc.adjectives().out('array') as string[]
    const cleaningNouns = doc.match('(clean|cleaning|service)').out('array')

    if (cleaningNouns.length > 0 && adjectives.length > 0) {
      const modifier = adjectives.find((a: string) =>
        ['deep', 'thorough', 'quick', 'basic', 'standard', 'full', 'complete', 'regular', 'weekly', 'monthly'].includes(a.toLowerCase())
      )
      return modifier || null
    }
    return null
  }, [])

  // Normalize text using compromise - expand contractions, fix plurals
  const normalizeText = useCallback((text: string): string => {
    const doc = nlp(text)
    doc.contractions().expand()
    return doc.text()
  }, [])

  // Better sentiment detection using compromise
  const detectSentiment = useCallback((text: string): 'frustrated' | 'neutral' | 'positive' => {
    const doc = nlp(text)

    // Negative sentiment
    const negative = doc.match('(terrible|awful|hate|angry|upset|waste|horrible|worst|ridiculous|unacceptable|disappointed|annoyed|frustrated|bad|poor|slow|late|dirty|unprofessional|rude)').found
    if (negative) return 'frustrated'

    // Positive sentiment
    const positive = doc.match('(great|amazing|wonderful|excellent|love|perfect|best|fantastic|awesome|happy|pleased|thank|thanks|appreciate)').found
    if (positive) return 'positive'

    return 'neutral'
  }, [])

  const parseNumber = useCallback((text: string): string => {
    const doc = nlp(text)
    doc.numbers().toNumber()
    return doc.text()
  }, [])

  const handleBookingFlow = useCallback((input: string) => {
    const data = { ...bookingData }

    switch (booking) {
      case 'service':
        data.service = input
        setBookingData(data)
        // Skip size if already inferred
        if (data.size) {
          if (data.address) {
            setBooking('date')
            addBotMessage(`Great — ${data.service} for a ${data.size.toLowerCase()}. When would you like us to come? (e.g., "next Tuesday", "March 30th")`)
          } else {
            setBooking('address')
            addBotMessage(`Great — ${data.service} for a ${data.size.toLowerCase()}. What's your address?`)
          }
        } else {
          setBooking('size')
          addBotMessage('Got it! What\'s the size of your home or space?', ['Studio / 1 BR', '2–3 Bedrooms', '4–5 Bedrooms', '6+ Bedrooms', 'Commercial / Office'])
        }
        break
      case 'size':
        data.size = input
        setBookingData(data)
        // Skip address if already provided
        if (data.address) {
          setBooking('date')
          addBotMessage(`Great, I've got your address. When would you like us to come? (e.g., "next Tuesday", "March 30th")`)
        } else {
          setBooking('address')
          addBotMessage('What\'s your address? Just start typing and I\'ll find it.')
        }
        break
      case 'address':
        data.address = input
        setBookingData(data)
        setBooking('date')
        addBotMessage('When would you like us to come? (e.g., "next Tuesday", "March 30th")')
        break
      case 'date':
        data.date = parseDate(input)
        setBookingData(data)
        // Skip name if already provided
        if (data.name) {
          setBooking('phone')
          addBotMessage(`Got it — ${data.date}. What's your phone number, ${data.name}?`)
        } else {
          setBooking('name')
          addBotMessage(`Got it — ${data.date}. What's your name?`)
        }
        break
      case 'name':
        const nameResult = extractName(input)
        data.name = nameResult || input.split(' ')[0] || input
        setUserName(data.name)
        setBookingData(data)
        setBooking('phone')
        addBotMessage(`Nice to meet you, ${data.name}! What's your phone number?`)
        break
      case 'phone':
        data.phone = input
        setBookingData(data)
        setBooking('email')
        addBotMessage('Last thing — your email address?')
        break
      case 'email':
        data.email = input
        setBookingData(data)
        setBooking('confirm')
        addBotMessage(
          `Here's what I've got:\n\n**Name:** ${data.name}\n**Phone:** ${data.phone}\n**Email:** ${data.email}\n**Service:** ${data.service}\n**Home Size:** ${data.size}\n**Address:** ${data.address}\n**Preferred Date:** ${data.date}\n\nDoes this look right?`,
          ['Yes, submit my booking', 'No, start over']
        )
        break
      case 'confirm':
        if (input.toLowerCase().includes('yes') || input.toLowerCase().includes('submit')) {
          setBooking(null)
          setBookingData({})
          addBotMessage("You're all set! We'll reach out within 2 hours to confirm. Thanks for choosing Ivory & Oak! 🌻")
        } else {
          setBooking('service')
          setBookingData({})
          addBotMessage('No problem! Let\'s start fresh. What service are you interested in?', ['Recurring Cleaning', 'Deep Cleaning', 'Move-In / Move-Out'])
        }
        break
    }
  }, [booking, bookingData, addBotMessage])

  const handleSend = useCallback((text: string) => {
    if (!text.trim()) return
    setInput('')
    setMessages(prev => [...prev, { role: 'user', text: text.trim() }])

    // If in booking flow, handle that first
    if (booking) {
      // Address search step - query Ohio addresses
      if (booking === 'address') {
        // If the input looks like a full Nominatim address (from clicking a result), accept it directly
        if (text.includes(',') && text.split(',').length >= 3) {
          handleBookingFlow(text.trim())
          return
        }
        setTyping(true)
        fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(text.trim())}&limit=4&viewbox=-84.82,41.98,-80.52,38.40&bounded=1`,
          { headers: { 'Accept-Language': 'en' } }
        )
          .then(r => r.json())
          .then(results => {
            setTyping(false)
            if (results.length > 0) {
              const options = results.map((r: { display_name: string }) => r.display_name)
              addBotMessage('I found these — pick one, or type your full address:', options)
            } else {
              // No results, accept what they typed
              handleBookingFlow(text.trim())
            }
          })
          .catch(() => {
            setTyping(false)
            handleBookingFlow(text.trim())
          })
        return
      }
      handleBookingFlow(text.trim())
      return
    }

    const lower = text.toLowerCase().trim()

    // Normalize text using compromise (expand contractions)
    const normalized = normalizeText(text)
    const doc = nlp(normalized)

    // Sentiment detection using compromise
    const sentiment = detectSentiment(normalized)
    if (sentiment === 'frustrated') {
      addBotMessage("I'm sorry to hear that. I want to make this right. Let me connect you with our team directly — you can call us at **(513) 555-CLEAN** or I can help you book right now.")
      return
    }
    if (sentiment === 'positive') {
      // Will continue processing but respond warmly
    }

    // Check for booking intent FIRST (even if there's a greeting)
    const hasBookingIntent = bookingKeywords.some(k => lower.includes(k))
    const hasDesireVerb = doc.match('#Verb').match('(want|need|looking|interested|schedule|get|have|wish)').found
    const hasCleaningWord = doc.match('(clean|cleaning|house|home|maid|service|tidy|scrub|wash)').found
    const hasAddress = lower.match(/\d+\s+\w+.*(rd|road|st|street|ave|avenue|dr|drive|ln|lane|blvd|ct|court|way|pl|place)/i)

    if (hasBookingIntent || (hasDesireVerb && hasCleaningWord)) {
      // Extract name if present, or use stored name
      const extractedName = extractName(text) || userName
      const preData: Record<string, string> = {}
      if (extractedName) {
        preData.name = extractedName
        setUserName(extractedName)
      }
      // If there's an address embedded, use the full message as the address
      if (hasAddress) {
        preData.address = text.trim()
      }
      // Try to infer home size from possessives
      const size = inferHomeSize(text)
      if (size) preData.size = size
      setBookingData(preData)
      setBooking('service')

      if (preData.name) {
        addBotMessage(`Hey ${preData.name}! Let's get you booked. What service are you interested in?`, ['Recurring Cleaning', 'Deep Cleaning', 'Move-In / Move-Out'])
      } else {
        addBotMessage("Let's get you booked! What service are you interested in?", ['Recurring Cleaning', 'Deep Cleaning', 'Move-In / Move-Out'])
      }
      return
    }

    // Check for greeting (only after booking intent check)
    if (greetings.some(g => lower === g || lower.startsWith(g + ' ') || lower.startsWith(g + '!'))) {
      // Extract name from greeting if present (e.g., "Hi my name is Alex")
      const nameInGreeting = extractName(text)
      if (nameInGreeting && nameInGreeting.toLowerCase() !== lower.replace(/^(hi|hello|hey|howdy)\s*/i, '').trim().toLowerCase()) {
        setUserName(nameInGreeting)
        addBotMessage(`Hey ${nameInGreeting}! How can I help you today? You can ask me about our services, pricing, or type **"book a cleaning"** to schedule one.`)
      } else {
        addBotMessage("Hey! How can I help you today? You can ask me about our services, pricing, or type **\"book a cleaning\"** to schedule one.")
      }
      return
    }

    // Check for standalone address (just an address with no other context)
    if (hasAddress && text.split(' ').length > 3) {
      const preData: Record<string, string> = { address: text.trim() }
      const size = inferHomeSize(text)
      if (size) preData.size = size
      setBookingData(preData)
      if (userName) {
        setBooking('service')
        addBotMessage(`I see your address${size ? ` and that it's a ${size.toLowerCase()}` : ''}, ${userName}! What service are you interested in?`, ['Recurring Cleaning', 'Deep Cleaning', 'Move-In / Move-Out'])
      } else {
        setBooking('service')
        addBotMessage(`I see your address${size ? ` and that it's a ${size.toLowerCase()}` : ''}! What service are you interested in?`, ['Recurring Cleaning', 'Deep Cleaning', 'Move-In / Move-Out'])
      }
      return
    }

    // Check for pricing with rich response
    if (lower.includes('price') || lower.includes('cost') || lower.includes('how much') || lower.includes('rate')) {
      const result = fuse.search('pricing cost')
      if (result.length > 0) {
        setRecentTopics(prev => [...prev.slice(-3), 'pricing'])
        addBotMessage(result[0]!.item.a + '\n\n[View full pricing ↓](#pricing)')
        // Scroll to pricing after a delay
        setTimeout(() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' }), 2000)
        return
      }
    }

    // Context-aware follow-up — "what about deep cleaning?" after discussing services
    if (lower.match(/^(what about|how about|and|what's|whats)/)) {
      const followUp = lower.replace(/^(what about|how about|and|what's|whats)\s*/i, '').trim()
      if (followUp) {
        // Search the follow-up as if it were a full question
        const followResults = fuse.search(followUp)
        if (followResults.length > 0 && followResults[0]!.score! < 0.5) {
          setRecentTopics(prev => [...prev.slice(-3), followUp])
          addBotMessage(followResults[0]!.item.a)
          return
        }
      }
    }

    // Fuzzy search FAQs
    const results = fuse.search(lower)
    if (results.length > 0 && results[0]!.score! < 0.5) {
      // Track topic for context
      setRecentTopics(prev => [...prev.slice(-3), results[0]!.item.q])
      addBotMessage(results[0]!.item.a)
    } else {
      // Handoff to human
      addBotMessage(
        "I'm not sure about that one. Would you like to talk to a real person?",
        ['Call (513) 555-CLEAN', 'Email us', 'Book a cleaning', 'Services & pricing']
      )
    }
  }, [booking, handleBookingFlow, addBotMessage])

  const handleOptionClick = (option: string) => {
    // Handle handoff options
    if (option === 'Call (513) 555-CLEAN') {
      setMessages(prev => [...prev, { role: 'user', text: option }])
      addBotMessage("Calling now! If your phone doesn't open the dialer, save our number: **(513) 555-CLEAN**. We're available Mon–Sat, 8am–6pm.")
      window.location.href = 'tel:5135552532'
      return
    }
    if (option === 'Email us') {
      setMessages(prev => [...prev, { role: 'user', text: option }])
      addBotMessage("You can email us at **hello@ivoryandoakcleaning.com** — we typically respond within a few hours.")
      return
    }
    // Handle page navigation options
    if (option === 'Services & pricing') {
      setMessages(prev => [...prev, { role: 'user', text: option }])
      addBotMessage("You can find our services and pricing further up on this page. Scroll up or I can answer specific questions here!")
      document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })
      return
    }
    handleSend(option)
  }

  return (
    <>
      {/* Chat toggle button */}
      <button
        onClick={() => setOpen(!open)}
        style={s.toggle}
        aria-label="Chat"
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        )}
      </button>

      {/* Chat panel */}
      <div className="chat-panel" style={{
        ...s.panel,
        opacity: open ? 1 : 0,
        transform: open ? 'translateY(0) scale(1)' : 'translateY(16px) scale(0.95)',
        pointerEvents: open ? 'all' : 'none',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}>
          <div style={s.header}>
            <div style={s.headerInfo}>
              <div style={s.headerDot} />
              <div>
                <div style={s.headerName}>Ivory & Oak</div>
                <div style={s.headerStatus}>Online — typically replies instantly</div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} style={s.closeBtn}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8C8279" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          <div style={s.messages} ref={listRef}>
            {messages.map((msg, i) => (
              <div key={i} className="chat-msg-enter" style={msg.role === 'user' ? s.userMsgWrap : s.botMsgWrap}>
                <div style={msg.role === 'user' ? s.userMsg : s.botMsg}>
                  {msg.text.split('\n').map((line, j) => (
                    <div key={j} style={s.msgLine} dangerouslySetInnerHTML={{
                      __html: line
                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        .replace(/\[(.*?)\]\((#.*?)\)/g, '<a href="$2" style="color:#C8A84E;text-decoration:underline;font-weight:600;">$1</a>')
                    }} />
                  ))}
                </div>
                {msg.options && (
                  <div style={s.options}>
                    {msg.options.map((opt, j) => (
                      <button key={j} style={s.optionBtn} onClick={() => handleOptionClick(opt)}>
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {typing && (
              <div style={s.botMsgWrap}>
                <div style={{ ...s.botMsg, ...s.typing }}>
                  <span style={s.typingDot} />
                  <span style={{ ...s.typingDot, animationDelay: '0.2s' }} />
                  <span style={{ ...s.typingDot, animationDelay: '0.4s' }} />
                </div>
              </div>
            )}
          </div>

          <form onSubmit={e => { e.preventDefault(); handleSend(input) }} style={s.inputArea}>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Type your question..."
              style={s.chatInput}
            />
            <button type="submit" style={s.sendBtn}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </form>
        </div>

      <style>{`
        @keyframes typingBounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-4px); }
        }
        @keyframes messageIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .chat-msg-enter {
          animation: messageIn 0.25s ease forwards;
        }
        @media (max-width: 768px) {
          .chat-panel {
            width: 100vw !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 76px !important;
            height: calc(100dvh - 76px) !important;
            max-height: none !important;
            border-radius: 0 !important;
            border-left: none !important;
            border-right: none !important;
            border-bottom: none !important;
          }
          .chat-msg-enter {
            animation-duration: 0.2s !important;
          }
          .chat-panel input[type="text"] {
            font-size: 16px !important;
            padding: 12px 14px !important;
          }
        }
      `}</style>
    </>
  )
}

const s: Record<string, React.CSSProperties> = {
  toggle: {
    position: 'fixed', bottom: 24, right: 24, width: 52, height: 52,
    background: '#C8A84E', borderRadius: '50%', border: 'none',
    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 4px 16px rgba(200,168,78,0.4)', zIndex: 950,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  panel: {
    position: 'fixed', bottom: 88, right: 24, width: 380, height: 500,
    background: '#FFFFFF', borderRadius: 12, border: '1px solid #EAE2D6',
    boxShadow: '0 12px 40px rgba(0,0,0,0.12)', zIndex: 950,
    display: 'flex', flexDirection: 'column', overflow: 'hidden',
  },
  header: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '14px 16px', borderBottom: '1px solid #EAE2D6',
    background: '#FAF7F2',
  },
  headerInfo: {
    display: 'flex', alignItems: 'center', gap: 10,
  },
  headerDot: {
    width: 8, height: 8, borderRadius: '50%', background: '#5A7A5A',
  },
  headerName: {
    fontFamily: "'Playfair Display', Georgia, serif", fontSize: '0.95rem',
    fontWeight: 600, color: '#3E2E20',
  },
  headerStatus: {
    fontFamily: "'DM Sans', sans-serif", fontSize: '0.68rem', color: '#8C8279',
  },
  closeBtn: {
    background: 'none', border: 'none', cursor: 'pointer', padding: 4,
  },
  messages: {
    flex: 1, overflowY: 'auto', padding: '16px',
    display: 'flex', flexDirection: 'column', gap: 12,
  },
  botMsgWrap: {
    display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
    maxWidth: '85%',
  },
  userMsgWrap: {
    display: 'flex', flexDirection: 'column', alignItems: 'flex-end',
    maxWidth: '85%', alignSelf: 'flex-end',
  },
  botMsg: {
    padding: '10px 14px', background: '#F3EDE4', borderRadius: '12px 12px 12px 4px',
    fontFamily: "'DM Sans', sans-serif", fontSize: '0.82rem', color: '#3E2E20',
    lineHeight: 1.6,
  },
  userMsg: {
    padding: '10px 14px', background: '#6B5744', borderRadius: '12px 12px 4px 12px',
    fontFamily: "'DM Sans', sans-serif", fontSize: '0.82rem', color: '#FAF7F2',
    lineHeight: 1.6,
  },
  msgLine: {
    marginBottom: 2,
  },
  options: {
    display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8,
  },
  optionBtn: {
    padding: '8px 14px', background: '#FFFFFF', border: '1px solid #EAE2D6',
    borderRadius: 100, fontFamily: "'DM Sans', sans-serif", fontSize: '0.78rem',
    fontWeight: 500, color: '#6B5744', cursor: 'pointer', transition: 'all 0.15s',
    minHeight: 36,
  },
  typing: {
    display: 'flex', gap: 4, padding: '12px 16px',
  },
  typingDot: {
    width: 6, height: 6, borderRadius: '50%', background: '#C8B99A',
    animation: 'typingBounce 1s ease infinite',
  },
  inputArea: {
    display: 'flex', alignItems: 'center', gap: 8,
    padding: '12px 14px', borderTop: '1px solid #EAE2D6',
    background: '#FAF7F2',
  },
  chatInput: {
    flex: 1, background: '#FFFFFF', borderRadius: 8,
    padding: '10px 12px', fontSize: '0.82rem', fontFamily: "'DM Sans', sans-serif",
    color: '#3E2E20', outline: 'none', border: '1px solid #EAE2D6',
  },
  sendBtn: {
    width: 36, height: 36, borderRadius: '50%', background: '#C8A84E',
    border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center',
    justifyContent: 'center', color: '#FFFFFF', flexShrink: 0,
  },
}
