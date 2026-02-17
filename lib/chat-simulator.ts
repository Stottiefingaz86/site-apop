/**
 * Chat Activity Simulator
 * Generates a continuous stream of realistic chat activity:
 * - Regular banter messages
 * - Tip announcements
 * - Rain events (announce → countdown → reveal winners)
 * - Jackpot / big win celebrations
 * - Sports bet shares (singles + parlays)
 * - System announcements
 */

import { useChatStore, type ChatMessage } from '@/lib/store/chatStore'

// ─── User Pool ─────────────────────────────────────────
const USERS = [
  { id: 'sim-1', username: 'CryptoKing88', badge: 'vip' as const, vipLevel: 9 },
  { id: 'sim-2', username: 'BetBoss_', badge: 'high-roller' as const },
  { id: 'sim-3', username: 'LuckyDegen', badge: null },
  { id: 'sim-4', username: 'ParlaySharks', badge: 'vip' as const, vipLevel: 5 },
  { id: 'sim-5', username: 'Mod_Alex', badge: 'mod' as const },
  { id: 'sim-6', username: 'NBAJunkie', badge: null },
  { id: 'sim-7', username: 'SlotQueenXO', badge: 'vip' as const, vipLevel: 3 },
  { id: 'sim-8', username: 'WagerWarrior', badge: 'high-roller' as const },
  { id: 'sim-9', username: 'GrindMode99', badge: null },
  { id: 'sim-10', username: 'ChaseTheAce', badge: null },
  { id: 'sim-11', username: 'BigBluffDave', badge: 'vip' as const, vipLevel: 7 },
  { id: 'sim-12', username: 'RainCatcher', badge: null },
  { id: 'sim-13', username: 'OddsGuru', badge: 'high-roller' as const },
  { id: 'sim-14', username: 'FadeThePublic', badge: null },
  { id: 'sim-15', username: 'Moonshot_Mike', badge: 'vip' as const, vipLevel: 6 },
  { id: 'sim-16', username: 'Mod_Jessica', badge: 'mod' as const },
  { id: 'sim-17', username: 'DegenerateKid', badge: null },
  { id: 'sim-18', username: 'WhaleAlert🐋', badge: 'vip' as const, vipLevel: 10 },
  { id: 'sim-19', username: 'LiveBetLarry', badge: null },
  { id: 'sim-20', username: 'StacksOnStacks', badge: 'high-roller' as const },
  { id: 'sim-21', username: 'DaveMason', badge: 'mod' as const },
]

// Dave Mason — mod / sports tipster who gives hold & book insights
const DAVE_MASON = USERS.find(u => u.id === 'sim-21')!

const DAVE_MASON_INSIGHTS = [
  // Hold / book direction insights
  'Book is sitting at 78% liability on the Chiefs ML tonight. Sharp money hammering it since open. If you\'re on the other side, tread carefully 📊',
  'Hold alert: Lakers line moved from -3.5 to -5 in the last 20 min. Book is clearly trying to balance — public is all over LA. Value might be on the Celtics now 🧠',
  'Interesting one here — the over 48.5 on the Bills game opened at 46 and climbed. Book hold is thin. They WANT under tickets. That tells me the sharps are on the over 📈',
  'Line just moved from -110 to -130 on Arsenal ML. That\'s not public action, that\'s syndicate money. The book knows something, respect the move ⚽',
  'Real Madrid line hasn\'t budged despite 70% of tickets on them. That means the book is comfortable holding. They\'re expecting value on the other side 🔍',
  'Chiefs -3.5 seeing reverse line movement. Public is on KC but the line dropped from -4 to -3.5. Book is incentivizing Chiefs bets — they want the other side 🧐',
  'The over/under on this UFC main event is tricky. Book hold is massive — they\'ve got balanced action. Means the number is sharp. Trust the total here 🥊',
  'PSA: anytime you see a half-point move in the last 30 min before a game, that\'s the book reacting to late sharp money. Pay attention to the direction 💡',
  'Liverpool ML at -140 is where the book wants you. The draw at +260 is where the value is. 32% of games in this matchup end in a draw. Book knows this ⚽📉',
  'Public is hammering the over in the Lakers game but the line hasn\'t moved. Book is happy to take that action. When the book doesn\'t adjust, they have info you don\'t 🏀',
  'This is a classic trap line. -3 instead of -3.5 means they want you on the favorite. The half point matters. Book hold is sitting at 6.2% on this one 🎯',
  'Seeing steam move on the Nuggets. Line went from +2 to PK in minutes. When a dog moves to pick\'em that fast, follow the money, not the name 🏀🔥',
  'The book just pulled the player props for the main event. That usually means they got burned on early sharp action. Watch for the repost with adjusted numbers 📋',
  'Quick hold breakdown: Book needs 52.4% win rate at -110 to profit. Right now they\'ve got 61% of tickets on one side. That\'s a dream scenario for the house 💰',
  'Reminder: the book isn\'t trying to predict the winner. They\'re trying to balance their book. When you see lopsided action with no line move, the book WANTS that exposure 🧠',
  'Sharp vs public money split on the Celtics game: 35% of bets but 58% of the money is on Boston. That\'s textbook sharp action disguised in low ticket % 📊',
  'Late steam alert on the under in the Cowboys game. This is pro money coming in. Book just moved the total from 47 to 45.5. That\'s a massive 1.5 point swing 🏈',
  'The handle on this Champions League match is 3x normal volume. When that happens, book hold tightens. Less value in the market — be selective 🌍⚽',
]

const DAVE_MASON_REACTIONS = [
  'good eye, that\'s exactly what the numbers show 👊',
  'be careful with that one — the book has heavy liability the other way',
  'that\'s a sharp take. respect it ✅',
  'agreed. the line movement tells the whole story here',
  'solid analysis. I\'d add that the book hold is thin on this one too 📊',
  'careful chasing steam. late moves don\'t always mean value',
  'this is the kind of game where the book wins no matter what. pick your spots',
  'facts. always follow the money, not the public 💯',
]

// ─── Message Pools ─────────────────────────────────────

const BANTER_MESSAGES = [
  'who else is on this late night grind? 🌙',
  'just cashed out $2k, feeling good tonight 🔥',
  'that last spin was INSANE',
  'anyone watching the game rn?',
  'this chat is lit tonight 🎉',
  'GG to whoever hit that parlay earlier',
  'lmao I just lost everything on a coin flip 😂',
  'who got a good pick for tonight?',
  'going all in on the over, wish me luck 🍀',
  'just deposited again... I have a problem 😅',
  'someone drop a rain pls 🌧️',
  'that was the craziest blackjack hand I ever seen',
  'congrats to the jackpot winner! 🎰',
  'I\'m on a 7 win streak right now 🔥🔥🔥',
  'anyone else love the new slot?',
  'dead chat? 👀',
  'LET\'S GOOOOO 🚀🚀🚀',
  'this is my year, I can feel it',
  'bro that bad beat just killed my entire bankroll',
  'shoutout to the mods keeping it clean in here 💯',
  'who else tailing @ParlaySharks tonight?',
  'I should probably go to bed... one more bet tho',
  'just won $500 on blackjack let\'s ride 🃏',
  'the vibes in this chat are immaculate',
  'someone tip me I\'m broke 😭',
  'imagine not betting the under lmao',
  'that payout was INSANE, 250x multiplier',
  'alright boys I\'m locking in the parlay of the night 🔒',
  'my bookie is sweating rn 💦',
  'GG, see y\'all tomorrow 🫡',
  'that slot just ate my entire balance...',
  'THIS GAME IS RIGGED... jk I love it here 😂',
  'any VIPs in chat? 👑',
  'just hit a 500x on Gonzo\'s Quest!!! 🤯',
  'can\'t believe I cashed out early smh',
  'the live dealer just winked at me through the screen 😏',
  'who\'s up big tonight? 📈',
  'I never win parlays but this one hits different',
  'that rain was clutch, thank you whale 🐋',
  'I need a miracle on this last leg 🙏',
  'DaveMason just saved my bankroll with that hold analysis 📊💰',
  'always check what DaveMason says before placing a bet. man reads the book like a bible 🐐',
  'the book is getting crushed tonight, love to see it 🔥',
  'line movement was wild today, sharps were all over it',
]

const MENTION_MESSAGES = [
  { content: '@{target} nice hit! What was the multiplier? 🎰', type: 'question' },
  { content: 'yo @{target} you still on that hot streak?', type: 'question' },
  { content: '@{target} let\'s gooo that parlay was fire 🔥', type: 'hype' },
  { content: 'thanks for the tip @{target}! 🙏💰', type: 'thanks' },
  { content: '@{target} what do you think about the Lakers game?', type: 'question' },
  { content: '@{target} teach me your ways 🧠', type: 'hype' },
  { content: '@DaveMason what\'s the book saying on this one? 📊', type: 'question' },
  { content: '@DaveMason is the sharp money on the over or under tonight?', type: 'question' },
  { content: '@DaveMason GOAT tipster 🐐 your hold breakdowns are elite', type: 'hype' },
  { content: 'anyone see @DaveMason\'s take on the line movement? man was spot on again 🔥', type: 'hype' },
]

const JACKPOT_MESSAGES = [
  { game: 'Mega Moolah', amount: '$127,450', multiplier: '5,000x' },
  { game: 'Book of Dead', amount: '$34,200', multiplier: '1,800x' },
  { game: 'Gonzo\'s Quest', amount: '$52,800', multiplier: '2,500x' },
  { game: 'Sweet Bonanza', amount: '$18,900', multiplier: '950x' },
  { game: 'Gates of Olympus', amount: '$89,300', multiplier: '4,200x' },
  { game: 'Starburst', amount: '$41,600', multiplier: '1,200x' },
  { game: 'Big Bass Bonanza', amount: '$22,100', multiplier: '1,100x' },
  { game: 'Crypto Fortune', amount: '$63,500', multiplier: '3,000x' },
  { game: 'Wolf Gold', amount: '$15,800', multiplier: '750x' },
  { game: 'The Dog House', amount: '$28,400', multiplier: '1,400x' },
]

const BET_EVENTS = [
  // NFL / Football
  { event: 'KC Chiefs vs BUF Bills', selections: ['Chiefs -3.5', 'Bills +3.5', 'Over 48.5', 'Under 48.5', 'Chiefs ML'], sport: '🏈' },
  { event: 'SF 49ers vs DAL Cowboys', selections: ['49ers -1.5', 'Cowboys +1.5', 'Over 45.5', '49ers ML'], sport: '🏈' },
  { event: 'PHI Eagles vs DET Lions', selections: ['Eagles -2.5', 'Lions ML', 'Over 51.5'], sport: '🏈' },
  // NBA / Basketball
  { event: 'LAL Lakers vs BOS Celtics', selections: ['Lakers ML', 'Celtics -4.5', 'Over 224.5', 'Under 224.5', 'LeBron 30+ pts'], sport: '🏀' },
  { event: 'GSW Warriors vs MIL Bucks', selections: ['Warriors +2.5', 'Bucks ML', 'Over 231.5', 'Curry 25+ pts'], sport: '🏀' },
  { event: 'PHX Suns vs DEN Nuggets', selections: ['Suns ML', 'Nuggets -3.5', 'Over 220.5'], sport: '🏀' },
  // Soccer
  { event: 'Arsenal vs Man City', selections: ['Arsenal ML', 'Draw', 'Man City ML', 'Over 2.5', 'BTTS Yes'], sport: '⚽' },
  { event: 'Real Madrid vs Barcelona', selections: ['Real Madrid ML', 'Draw', 'Barcelona ML', 'Over 3.5'], sport: '⚽' },
  { event: 'Liverpool vs Man United', selections: ['Liverpool -1.5', 'Draw', 'Over 2.5', 'BTTS Yes'], sport: '⚽' },
  // MMA
  { event: 'UFC 310: Main Event', selections: ['Fighter A ML', 'Fighter B ML', 'Over 2.5 Rounds', 'KO/TKO'], sport: '🥊' },
  // NHL
  { event: 'TOR Maple Leafs vs MTL Canadiens', selections: ['Maple Leafs ML', 'Canadiens +1.5', 'Over 5.5'], sport: '🏒' },
  // MLB
  { event: 'NYY Yankees vs BOS Red Sox', selections: ['Yankees ML', 'Red Sox +1.5', 'Over 8.5', 'Under 8.5'], sport: '⚾' },
]

const ODDS_POOL = ['-110', '-120', '+150', '+200', '-140', '+175', '-105', '+250', '-130', '+300', '+180', '-115', '+135', '+225', '-150', '+400', '+165']

const RAIN_AMOUNTS = [100, 250, 500, 750, 1000, 1500, 2000, 5000]

const SYSTEM_MESSAGES = [
  '🎉 Promotion: Deposit now and get 100% bonus up to $1,000!',
  '⚡ New slot "Dragon\'s Fortune" is now live — play now!',
  '🏆 Leaderboard updated: Top 10 players win exclusive rewards',
  '📢 Weekend special: All parlays get 10% profit boost',
  '🔥 Hot streak alert: 5 jackpots hit in the last hour!',
  '💎 VIP exclusive: Double cashback on all live casino games',
  '🎯 Bet of the Day is now available — check the promotions tab',
  '⭐ New achievement unlocked: Community milestone — 1M messages sent!',
]

// ─── Helpers ───────────────────────────────────────────

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function pickUser() {
  return pick(USERS)
}

function pickOtherUser(excludeId: string) {
  const others = USERS.filter(u => u.id !== excludeId)
  return pick(others)
}

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

let msgCounter = 1000

function nextId() {
  return `sim-msg-${Date.now()}-${msgCounter++}`
}

// ─── Message Generators ────────────────────────────────

function generateBanterMessage(): ChatMessage {
  const user = pickUser()
  let content = pick(BANTER_MESSAGES)

  // Sometimes add a mention
  if (Math.random() < 0.15) {
    const target = pickOtherUser(user.id)
    const mentionMsg = pick(MENTION_MESSAGES)
    content = mentionMsg.content.replace('{target}', target.username)
  }

  return {
    id: nextId(),
    userId: user.id,
    username: user.username,
    badge: user.badge,
    content,
    timestamp: new Date(),
    type: 'message',
    mentions: content.match(/@\w+/g)?.map(m => m.slice(1)) || undefined,
  }
}

function generateTipMessage(): ChatMessage {
  const sender = pickUser()
  const recipient = pickOtherUser(sender.id)
  const amounts = [5, 10, 15, 25, 50, 100, 250, 500]
  const amount = pick(amounts)

  return {
    id: nextId(),
    userId: sender.id,
    username: sender.username,
    badge: sender.badge,
    content: '',
    timestamp: new Date(),
    type: 'tip',
    tipAmount: amount,
    tipRecipient: recipient.username,
  }
}

function generateBetShareMessage(): ChatMessage {
  const user = pickUser()
  const isParlay = Math.random() < 0.55 // 55% parlays
  const numLegs = isParlay ? randomBetween(2, 5) : 1

  const legs: { event: string; selection: string; odds: string }[] = []
  const usedEvents = new Set<string>()

  for (let i = 0; i < numLegs; i++) {
    let betEvent = pick(BET_EVENTS)
    // Avoid duplicate events in a parlay
    let attempts = 0
    while (usedEvents.has(betEvent.event) && attempts < 10) {
      betEvent = pick(BET_EVENTS)
      attempts++
    }
    usedEvents.add(betEvent.event)

    legs.push({
      event: betEvent.event,
      selection: pick(betEvent.selections),
      odds: pick(ODDS_POOL),
    })
  }

  // Calculate combined odds
  const decimalOdds = legs.map(l => {
    const am = parseFloat(l.odds)
    if (isNaN(am)) return 2
    return am > 0 ? am / 100 + 1 : 100 / Math.abs(am) + 1
  })
  const combined = decimalOdds.reduce((a, b) => a * b, 1)
  const stake = pick([10, 20, 25, 50, 100, 200, 500])
  const potentialWin = (stake * combined).toFixed(2)

  const combinedAmerican = combined >= 2
    ? `+${Math.round((combined - 1) * 100)}`
    : `-${Math.round(100 / (combined - 1))}`

  return {
    id: nextId(),
    userId: user.id,
    username: user.username,
    badge: user.badge,
    content: '',
    timestamp: new Date(),
    type: 'bet-share',
    betSlip: {
      type: isParlay ? 'parlay' : 'single',
      legs,
      combinedOdds: isParlay ? combinedAmerican : undefined,
      potentialWin: `$${potentialWin}`,
    },
  }
}

function generateJackpotMessage(): ChatMessage {
  const user = pickUser()
  const jackpot = pick(JACKPOT_MESSAGES)

  return {
    id: nextId(),
    userId: user.id,
    username: user.username,
    badge: user.badge,
    content: `🎰💰 MASSIVE WIN! Just hit ${jackpot.amount} on ${jackpot.game}!! ${jackpot.multiplier} multiplier! 🚀🔥`,
    timestamp: new Date(),
    type: 'message',
  }
}

function generateRainMessage(): ChatMessage {
  const user = pick(USERS.filter(u => u.badge === 'vip' || u.badge === 'high-roller'))
  return {
    id: nextId(),
    userId: user.id,
    username: user.username,
    badge: user.badge,
    content: 'Making it rain! 💰🌧️',
    timestamp: new Date(),
    type: 'rain',
  }
}

function generateSystemMessage(): ChatMessage {
  return {
    id: nextId(),
    userId: 'system',
    username: 'System',
    content: pick(SYSTEM_MESSAGES),
    timestamp: new Date(),
    type: 'system',
  }
}

function generateReactionMessage(): ChatMessage {
  const user = pickUser()
  const reactions = [
    'LETS GOOOO 🚀🚀🚀',
    '🔥🔥🔥',
    'W',
    'massive W right there 👑',
    'no way 😱',
    'sheeeesh 💰',
    'absolute unit of a bet 💪',
    'congrats!! 🎉🎉',
    'insane hit!!! 🤯',
    'this is the way 🫡',
    'legend 🐐',
    '💎🙌',
  ]

  return {
    id: nextId(),
    userId: user.id,
    username: user.username,
    badge: user.badge,
    content: pick(reactions),
    timestamp: new Date(),
    type: 'message',
  }
}

// ─── Dave Mason Tipster Insight ───────────────────────────
function generateDaveMasonInsight(): ChatMessage {
  return {
    id: nextId(),
    userId: DAVE_MASON.id,
    username: DAVE_MASON.username,
    badge: DAVE_MASON.badge,
    content: pick(DAVE_MASON_INSIGHTS),
    timestamp: new Date(),
    type: 'message',
  }
}

function generateDaveMasonReaction(): ChatMessage {
  return {
    id: nextId(),
    userId: DAVE_MASON.id,
    username: DAVE_MASON.username,
    badge: DAVE_MASON.badge,
    content: pick(DAVE_MASON_REACTIONS),
    timestamp: new Date(),
    type: 'message',
  }
}

// ─── Rain Event Lifecycle ──────────────────────────────

const RAIN_COUNTDOWN = 15 // seconds the banner shows before distributing

function triggerRainEvent() {
  const store = useChatStore.getState()
  const amount = pick(RAIN_AMOUNTS)
  const triggeredBy = pick(USERS.filter(u => u.badge === 'vip' || u.badge === 'high-roller'))

  // 1. Post rain message in both chat rooms
  const rainMsg = generateRainMessage()
  store.addMessage('casino', { ...rainMsg, id: rainMsg.id + '-casino' })
  store.addMessage('sports', rainMsg)

  // 2. Show rain banner with countdown
  store.setActiveRain({
    id: `rain-${Date.now()}`,
    amount,
    currency: 'USD',
    countdown: RAIN_COUNTDOWN,
    participants: [],
    isActive: true,
    triggeredBy: triggeredBy.username,
  })

  // 3. User must manually join via the rain banner — no auto-join

  // 4. Simulate other users joining throughout the countdown
  let joinCount = 0
  const joinInterval = setInterval(() => {
    const rain = useChatStore.getState().activeRain
    if (!rain || joinCount > 20) {
      clearInterval(joinInterval)
      return
    }
    const joiner = pickUser()
    store.joinRain(joiner.id)
    joinCount++
  }, randomBetween(600, 1800))

  // 5. After countdown + buffer, reveal winners
  setTimeout(() => {
    clearInterval(joinInterval)

    // Check if the current user actually joined this rain event BEFORE clearing it
    const lastRain = useChatStore.getState().activeRain
    const userJoined = lastRain ? lastRain.participants.includes('current-user') : false

    store.setActiveRain(null)

    // Decide winners — 50% chance the current user wins IF they joined
    const numWinners = randomBetween(4, 10)
    const winners: string[] = []
    const currentUserWins = userJoined && Math.random() < 0.5

    if (currentUserWins) {
      winners.push('You')
    }

    // Fill remaining winners from simulated users
    while (winners.length < numWinners) {
      const u = pickUser()
      if (!winners.includes(u.username)) {
        winners.push(u.username)
      }
    }

    const perPerson = (amount / numWinners).toFixed(2)

    // Helper — post a message to both chat rooms
    const addBoth = (msg: ChatMessage) => {
      store.addMessage('casino', { ...msg, id: msg.id + '-casino' })
      store.addMessage('sports', msg)
    }

    // System announcement of winners
    addBoth({
      id: nextId(),
      userId: 'system',
      username: 'System',
      content: `🌧️ Rain ended! $${amount} split between ${numWinners} users ($${perPerson} each). Winners: ${winners.join(', ')} 🎉`,
      timestamp: new Date(),
      type: 'system',
    })

    // If current user won, show a special system message AND update their balance
    if (currentUserWins) {
      const winAmount = parseFloat(perPerson)
      setTimeout(() => {
        addBoth({
          id: nextId(),
          userId: 'system',
          username: 'System',
          content: `💰 You won $${perPerson} from the rain! Balance updated.`,
          timestamp: new Date(),
          type: 'system',
        })
        // Dispatch event so pages can update the displayed balance
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('rain:win', { detail: { amount: winAmount } }))
        }
      }, 800)
    } else if (userJoined) {
      // User joined but didn't win
      setTimeout(() => {
        addBoth({
          id: nextId(),
          userId: 'system',
          username: 'System',
          content: `🌧️ Better luck next time! You didn't win this rain.`,
          timestamp: new Date(),
          type: 'system',
        })
      }, 800)
    }

    // 6. Reactions from other winners (staggered)
    const reactDelay = 1200
    for (let i = 0; i < Math.min(3, winners.length); i++) {
      const winner = winners[i]
      if (winner === 'You') continue
      const winnerUser = USERS.find(u => u.username === winner) || pickUser()

      setTimeout(() => {
        if (!isRunning) return
        addBoth({
          id: nextId(),
          userId: winnerUser.id,
          username: winnerUser.username,
          badge: winnerUser.badge ?? null,
          content: pick([
            'thanks for the rain! 🌧️💰',
            'yooo I caught the rain! 🙏',
            'free money let\'s go 🔥',
            'appreciate the rain whale 🐋❤️',
            'LFG rain hit!! 💸',
            `$${perPerson} secured 🤑`,
            'rain never misses 🌧️🔥',
          ]),
          timestamp: new Date(),
          type: 'message',
        })
      }, reactDelay + i * randomBetween(800, 2000))
    }

    // 7. Some chat hype after the rain
    setTimeout(() => {
      if (!isRunning) return
      addBoth({
        id: nextId(),
        userId: pickUser().id,
        username: pickUser().username,
        badge: pickUser().badge ?? null,
        content: pick([
          'I missed the rain 😭',
          'need another rain pls 🌧️',
          'GG to the winners!',
          'who triggered that rain? 🐋',
          'always late to the rain smh',
        ]),
        timestamp: new Date(),
        type: 'message',
      })
    }, reactDelay + 3000)
  }, (RAIN_COUNTDOWN + 2) * 1000) // Countdown + brief "Distributing..." phase
}

// ─── Main Simulator ────────────────────────────────────

// Weighted message types
type MessageType = 'banter' | 'tip' | 'bet-share' | 'jackpot' | 'reaction' | 'system' | 'dave-insight'

const MESSAGE_WEIGHTS: { type: MessageType; weight: number }[] = [
  { type: 'banter', weight: 35 },
  { type: 'reaction', weight: 17 },
  { type: 'bet-share', weight: 16 },
  { type: 'dave-insight', weight: 12 },
  { type: 'tip', weight: 10 },
  { type: 'jackpot', weight: 5 },
  { type: 'system', weight: 5 },
]

function pickWeightedType(): MessageType {
  const total = MESSAGE_WEIGHTS.reduce((s, w) => s + w.weight, 0)
  let rand = Math.random() * total
  for (const w of MESSAGE_WEIGHTS) {
    rand -= w.weight
    if (rand <= 0) return w.type
  }
  return 'banter'
}

function generateNextMessage(): ChatMessage {
  const type = pickWeightedType()
  switch (type) {
    case 'banter': return generateBanterMessage()
    case 'reaction': return generateReactionMessage()
    case 'bet-share': return generateBetShareMessage()
    case 'tip': return generateTipMessage()
    case 'jackpot': return generateJackpotMessage()
    case 'system': return generateSystemMessage()
    case 'dave-insight': return generateDaveMasonInsight()
    default: return generateBanterMessage()
  }
}

// ─── Exported control ──────────────────────────────────

let messageTimer: ReturnType<typeof setTimeout> | null = null
let rainTimer: ReturnType<typeof setTimeout> | null = null
let isRunning = false

function scheduleNextMessage() {
  if (!isRunning) return

  // Random delay between messages: 2-8 seconds for active feel
  const delay = randomBetween(2000, 8000)

  messageTimer = setTimeout(() => {
    if (!isRunning) return

    const msg = generateNextMessage()
    const store = useChatStore.getState()

    // Add to sports messages (they merge in the chat)
    store.addMessage('sports', msg)

    // Occasionally generate a quick follow-up reaction (simulates fast chat)
    if (Math.random() < 0.25) {
      setTimeout(() => {
        if (!isRunning) return
        // Sometimes Dave Mason reacts to messages with his tipster takes
        if (Math.random() < 0.3) {
          store.addMessage('sports', generateDaveMasonReaction())
        } else {
        store.addMessage('sports', generateReactionMessage())
        }
      }, randomBetween(500, 2000))
    }

    scheduleNextMessage()
  }, delay)
}

function scheduleNextRain(initialDelay?: number) {
  if (!isRunning) return

  // Rain events every ~30 seconds so users frequently see them and can join
  const delay = initialDelay ?? randomBetween(28000, 35000)

  rainTimer = setTimeout(() => {
    if (!isRunning) return
    triggerRainEvent()
    scheduleNextRain() // schedule the next one
  }, delay)
}

export function startChatSimulator() {
  if (isRunning) return
  isRunning = true

  // Start message stream after a short initial delay
  setTimeout(() => {
    scheduleNextMessage()
  }, 1500)

  // First rain happens after ~5 seconds so the user sees it quickly
  scheduleNextRain(5000)
}

export function stopChatSimulator() {
  isRunning = false
  if (messageTimer) {
    clearTimeout(messageTimer)
    messageTimer = null
  }
  if (rainTimer) {
    clearTimeout(rainTimer)
    rainTimer = null
  }
}
