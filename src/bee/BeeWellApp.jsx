// @ts-nocheck
import { useState, useEffect, useCallback, useRef } from "react";
import { translate } from "./i18n.js";


    
    // ========== STATES ==========
    const STATES = [
      { id: 'stable', label: 'Stable / Capable', color: 'green', short: 'Stable', desc: 'Pilot online. Clear, present, enough energy for the day.', correction: 'Protect the buffer. Stay at 70%. Do not over-commit.', protocol: 'Name one Great Fox. Protect sleep and meals. Log one gratitude.' },
      { id: 'static', label: 'Scattered / ADHD Static', color: 'yellow', short: 'Scattered', desc: 'Restless, dopamine gap, time blindness, too many tabs open in the mind.', correction: 'Reduce input. Noise-cancel. Visual Silence. One tab only.', protocol: 'MVS: open the smallest next step. Body-double if possible. 10/20 rule.' },
      { id: 'heat', label: 'Rage / Emotional Heat', color: 'red', short: 'Rage', desc: 'Anger, urge to defend or destroy, rejection sting, explosive edge.', correction: 'Cold water on face/hands. Silence. Stillness. 90-second chemical wave.', protocol: 'Do not send the message. Do not decide. Wait 90 seconds. Then Level 0 if needed.' },
      { id: 'shadow', label: 'Threat / Trauma Echo', color: 'orange', short: 'Threat', desc: 'Unsafe, hypervigilant, past echoing into now, body bracing.', correction: '5-4-3-2-1 grounding. Orient to the present room. Name the year.', protocol: 'You are here, now. The past is not happening. Touch something solid.' },
      { id: 'pulse', label: 'Anxiety / Worry Loop', color: 'purple', short: 'Anxiety', desc: 'Spiraling, rumination, future bracing, analysis paralysis.', correction: 'Externalize. Write the loop down. 5-minute container. Then close it.', protocol: 'Park the worry on paper. Return to the Fox. Worry later if needed.' },
      { id: 'gravity', label: 'Depression / Heavy', color: 'blue', short: 'Heavy', desc: 'Numb, heavy, zero energy, Wall of Awful, nothing feels worth it.', correction: 'Rest is valid. Hydrate. Tiny movement only. No shame.', protocol: 'One 10-second action. Sit up. Drink water. That is enough for now.' },
      { id: 'fog', label: 'Shutdown / Freeze', color: 'white', short: 'Freeze', desc: 'Blank, wordless, prefrontal offline, Safety Mode, cannot decide.', correction: 'Stop thinking. One 10-sec physical move. No decisions.', protocol: 'Level 0 Reset. Cold water. Name three objects. Breathe.' },
      { id: 'mania', label: 'High / Manic Edge', color: 'amber', short: 'High', desc: 'Racing thoughts, little need for sleep, grandiosity, urgency, overdrive.', correction: 'Slow the body first. Dim lights. Delay big decisions 24–48 hrs.', protocol: 'No new commitments. Sleep is medicine. Tell one safe person. Protect meds/routine.' },
      { id: 'panic', label: 'Panic / Surge', color: 'rose', short: 'Panic', desc: 'Heart racing, breath short, dread peak, feel like dying or losing control.', correction: 'Longer exhale than inhale. Feet on floor. Name five things you see.', protocol: 'This is a wave. It peaks and falls. You are not in danger from the feeling itself.' },
      { id: 'shame', label: 'Shame Spiral', color: 'rose', short: 'Shame', desc: 'Worthless, exposed, hide, “I am the problem,” collapse inward.', correction: 'Separate person from behavior. Speak to yourself as to a friend.', protocol: 'Name the shame out loud. Reach one safe person or write. Truth Anchor over the lie.' },
      { id: 'grief', label: 'Grief / Loss', color: 'blue', short: 'Grief', desc: 'Aching, waves of sadness, missing, empty chair in the chest.', correction: 'Let the wave move. Do not rush meaning. Gentle structure only.', protocol: 'Cry if tears come. One small nurture. No big life decisions today.' },
      { id: 'obsess', label: 'OCD / Stuck Loop', color: 'purple', short: 'Stuck', desc: 'Intrusive thoughts, urge to check/ritualize, doubt that will not close.', correction: 'Label: “This is an OCD spike.” Delay the ritual. Ride the urge.', protocol: 'Do not argue with the thought. Return to values-based action. One Fox only.' },
      { id: 'dissoc', label: 'Numb / Disconnected', color: 'slate', short: 'Numb', desc: 'Detached, floaty, not fully here, watching yourself from outside.', correction: 'Orient: name room, year, three colors, feet on floor.', protocol: 'Temperature change (cool water). Smell something strong. Slow return is enough.' },
      { id: 'urge', label: 'Urge / Craving', color: 'orange', short: 'Urge', desc: 'Pull toward old habit, substance, escape, self-harm ideation as relief.', correction: 'Urge surfing: it rises, peaks, falls. Delay 15 minutes.', protocol: 'Remove access if possible. Call/text a signal flare. HALT: Hungry Angry Lonely Tired?' },
      { id: 'burnout', label: 'Burnout / Exhausted', color: 'slate', short: 'Burnout', desc: 'Depleted, cynical, over-giving, nothing left in the tank.', correction: 'Stop adding. Subtract. Rest is productive. 70% Governor hard limit.', protocol: 'Cancel one non-essential. Sleep and food first. No hero mode.' },
      { id: 'social', label: 'Social Fear', color: 'yellow', short: 'Social', desc: 'Fear of judgment, freeze in groups, post-event replay, avoid connection.', correction: 'One small exposure beats total isolation. Script one sentence.', protocol: 'You can leave. You can be awkward and still worthy. One safe contact today.' },
      { id: 'lonely', label: 'Lonely / Isolated', color: 'blue', short: 'Lonely', desc: 'Disconnected, unseen, “no one would notice,” hollow.', correction: 'Loneliness lies. Reach one person with a Signal Flare script.', protocol: 'Send the short message. Or sit in a public place. Presence before depth.' },
      { id: 'irritable', label: 'Irritable / Edge', color: 'red', short: 'Edge', desc: 'Everything scrapes, short fuse, sensory overload, snappy.', correction: 'Reduce sensory load. Eat. Dim noise. Alone time is regulation, not rejection.', protocol: 'Warn others: “I am at capacity.” Delay hard conversations.' },
    ];

    const ANCHORS = [
      { lie: 'I am a mistake.', truth: 'I am fearfully and wonderfully made; God does not make mistakes.', ref: 'Psalm 139:14' },
      { lie: 'I am unwanted.', truth: 'I am chosen by God before the world began; I am wanted.', ref: 'Ephesians 1:4' },
      { lie: 'I am a burden.', truth: 'I am sustained by God; He invites me to give Him my weight.', ref: 'Psalm 55:22' },
      { lie: 'I am broken beyond repair.', truth: 'I am a new creation in Christ; the old is gone, the new is here.', ref: '2 Cor 5:17' },
      { lie: 'I am unloved.', truth: 'Nothing can separate me from the love of God in Christ Jesus.', ref: 'Romans 8:38-39' },
      { lie: 'I am alone.', truth: 'The Lord goes before me; He will never leave me nor forsake me.', ref: 'Deuteronomy 31:8' },
      { lie: 'I am unsafe.', truth: 'Even if my father and mother abandon me, the Lord will hold me close.', ref: 'Psalm 27:10' },
      { lie: 'I have no strength.', truth: 'I can do all things through Christ who strengthens me.', ref: 'Philippians 4:13' },
      { lie: 'I am too far gone.', truth: 'He was pierced for my transgressions; by His wounds I am healed.', ref: 'Isaiah 53:5' },
      { lie: 'I must save myself.', truth: 'Come to Me, all who are weary and burdened, and I will give you rest.', ref: 'Matthew 11:28' },
      { lie: 'My past defines me.', truth: 'If anyone is in Christ, he is a new creation. The old has passed away.', ref: '2 Cor 5:17' },
      { lie: 'God is silent.', truth: 'Call to Me and I will answer you, and tell you great and hidden things.', ref: 'Jeremiah 33:3' },
    ];

    const DAILY_VERSES = [
      { text: 'With joy you will draw water from the wells of salvation.', ref: 'Isaiah 12:3' },
      { text: 'Call to me and I will answer you, and will tell you great and hidden things that you have not known.', ref: 'Jeremiah 33:3' },
      { text: 'Write the vision; make it plain on tablets, so he may run who reads it.', ref: 'Habakkuk 2:2' },
      { text: 'Come to me, all who labor and are heavy laden, and I will give you rest.', ref: 'Matthew 11:28' },
      { text: 'He was pierced for our transgressions; he was crushed for our iniquities; upon him was the chastisement that brought us peace, and with his wounds we are healed.', ref: 'Isaiah 53:5' },
      { text: 'The peace of God, which surpasses all understanding, will guard your hearts and your minds in Christ Jesus.', ref: 'Philippians 4:7' },
      { text: 'Out of the depths I cry to you, O Lord! O Lord, hear my voice!', ref: 'Psalm 130:1-2' },
      { text: 'If God is for us, who can be against us?', ref: 'Romans 8:31' },
      { text: 'The Spirit of the Lord is upon me… to set at liberty those who are oppressed.', ref: 'Luke 4:18' },
      { text: 'Now to him who is able to do far more abundantly than all that we ask or think…', ref: 'Ephesians 3:20' },
      { text: 'The Lord is near to the brokenhearted and saves the crushed in spirit.', ref: 'Psalm 34:18' },
      { text: 'Be still, and know that I am God.', ref: 'Psalm 46:10' },
      { text: 'I can do all things through him who strengthens me.', ref: 'Philippians 4:13' },
      { text: 'Cast all your anxiety on him because he cares for you.', ref: '1 Peter 5:7' },
      { text: 'The Lord is my shepherd; I shall not want.', ref: 'Psalm 23:1' },
      { text: 'Fear not, for I am with you; be not dismayed, for I am your God.', ref: 'Isaiah 41:10' },
      { text: 'Create in me a clean heart, O God, and renew a right spirit within me.', ref: 'Psalm 51:10' },
      { text: 'The steadfast love of the Lord never ceases; his mercies never come to an end; they are new every morning.', ref: 'Lamentations 3:22-23' },
      { text: 'Come, everyone who thirsts, come to the waters.', ref: 'Isaiah 55:1' },
      { text: 'I have been crucified with Christ. It is no longer I who live, but Christ who lives in me.', ref: 'Galatians 2:20' },
      { text: 'For God so loved the world, that he gave his only Son…', ref: 'John 3:16' },
      { text: 'The Lord will fight for you, and you have only to be silent.', ref: 'Exodus 14:14' },
      { text: 'My grace is sufficient for you, for my power is made perfect in weakness.', ref: '2 Corinthians 12:9' },
      { text: 'Trust in the Lord with all your heart, and do not lean on your own understanding.', ref: 'Proverbs 3:5' },
      { text: 'He heals the brokenhearted and binds up their wounds.', ref: 'Psalm 147:3' },
      { text: 'I am the way, and the truth, and the life.', ref: 'John 14:6' },
      { text: 'Do not be anxious about anything, but in everything by prayer and supplication with thanksgiving let your requests be made known to God.', ref: 'Philippians 4:6' },
      { text: 'The name of the Lord is a strong tower; the righteous man runs into it and is safe.', ref: 'Proverbs 18:10' },
      { text: 'It is finished.', ref: 'John 19:30' },
      { text: 'Therefore, if anyone is in Christ, he is a new creation. The old has passed away; behold, the new has come.', ref: '2 Corinthians 5:17' },
      { text: 'The Lord your God is in your midst, a mighty one who will save; he will rejoice over you with gladness.', ref: 'Zephaniah 3:17' },
      { text: 'He restores my soul. He leads me in paths of righteousness for his name’s sake.', ref: 'Psalm 23:3' },
      { text: 'Weeping may tarry for the night, but joy comes with the morning.', ref: 'Psalm 30:5' },
      { text: 'The Lord is my light and my salvation; whom shall I fear?', ref: 'Psalm 27:1' },
      { text: 'In all your ways acknowledge him, and he will make straight your paths.', ref: 'Proverbs 3:6' },
      { text: 'God is our refuge and strength, a very present help in trouble.', ref: 'Psalm 46:1' },
      { text: 'I sought the Lord, and he answered me and delivered me from all my fears.', ref: 'Psalm 34:4' },
      { text: 'Blessed are the poor in spirit, for theirs is the kingdom of heaven.', ref: 'Matthew 5:3' },
      { text: 'Draw near to God, and he will draw near to you.', ref: 'James 4:8' },
      { text: 'He who began a good work in you will bring it to completion at the day of Jesus Christ.', ref: 'Philippians 1:6' },
      { text: 'For I know the plans I have for you, declares the Lord, plans for welfare and not for evil, to give you a future and a hope.', ref: 'Jeremiah 29:11' },
      { text: 'The Lord is good, a stronghold in the day of trouble; he knows those who take refuge in him.', ref: 'Nahum 1:7' },
      { text: 'Peace I leave with you; my peace I give to you. Not as the world gives do I give to you.', ref: 'John 14:27' },
      { text: 'And we know that for those who love God all things work together for good.', ref: 'Romans 8:28' },
      { text: 'Be strong and courageous. Do not be frightened, and do not be dismayed, for the Lord your God is with you wherever you go.', ref: 'Joshua 1:9' },
      { text: 'The Lord is close to the brokenhearted and saves those who are crushed in spirit.', ref: 'Psalm 34:18' },
      { text: 'Taste and see that the Lord is good; blessed is the one who takes refuge in him.', ref: 'Psalm 34:8' },
      { text: 'Let us then with confidence draw near to the throne of grace, that we may receive mercy and find grace to help in time of need.', ref: 'Hebrews 4:16' },
    ];

    // Expanded 90-Day (40+ days covering the arc)
    const FORMATION_90 = [
      { day: 1, title: 'Covenant Start', scripture: 'Genesis 1–2 · John 1', focus: 'Before the journey fills with content, make a covenant with honesty. Write a short letter to your future self on Day 90 — not a performance review, a witness. Set it aside sealed. You will open it when the work has had time to act.', emptying: 'What am I carrying into this that is not mine — other people’s expectations, old shame, a demand to be fixed by Day 90?', response: 'I begin with open hands. I will not demand a finished self before I have walked.' },
      { day: 2, title: 'The First Light', scripture: 'Genesis 1:3-5 · John 1:4-5', focus: 'God’s first creative word is light — not the removal of all darkness, but light entering it. Notice where light already exists in your life: a person, a habit, a verse, a moment of clarity. Formation starts by receiving what is already given.', emptying: 'Where have I been living as if the darkness is the only real thing?', response: 'I welcome the light that is already here. I do not wait for a perfect sunrise.' },
      { day: 3, title: 'Naming the Waters', scripture: 'Genesis 1:6-10 · Psalm 23', focus: 'Chaos is often unnamed fear. God separates and names — sky, sea, dry land — and the naming brings order. What in your inner weather still has no name? Anxiety? Grief? Rage? Shame? Naming is not fixing; it is the beginning of stewardship.', emptying: 'What chaos have I been swimming in without admitting its name?', response: 'I let God name what I cannot. I will speak the true name of what I feel.' },
      { day: 4, title: 'Seeds of Promise', scripture: 'Genesis 1:11-13 · Mark 4:26-29', focus: 'Growth in the kingdom is often quiet and underground before it is visible. You are not behind because you cannot see fruit yet. Trust the seed. Stop digging it up every hour to check.', emptying: 'Where am I forcing growth — performance, spiritual results, recovery timelines — instead of planting and waiting?', response: 'I plant and trust the process. I will not dig up the seed today.' },
      { day: 5, title: 'The Greater Light', scripture: 'Genesis 1:14-19 · Psalm 19', focus: 'Lights are given for seasons and signs. Your life has appointed times — not only crises. Ask: what season am I actually in? Winter rest? Spring beginning? Summer intensity? Resisting the season multiplies suffering.', emptying: 'What season am I resisting because I want a different chapter?', response: 'I receive the season I am in. I will not demand summer in winter.' },
      { day: 6, title: 'Living Creatures', scripture: 'Genesis 1:20-25 · Psalm 104', focus: 'Life multiplies according to design. You were not made for permanent barrenness of joy, connection, or purpose. Flourishing is not arrogance; it is agreement with how you were built.', emptying: 'Where have I accepted barrenness as my permanent identity?', response: 'I expect life to multiply in God’s timing. I refuse the identity of permanent drought.' },
      { day: 7, title: 'Image & Rest', scripture: 'Genesis 1:26–2:3 · Matthew 11:28', focus: 'You are image-bearer before you are producer. Rest is not a reward for finishing the list; it is holy. Treating yourself as a machine is a theological error as much as a mental-health one.', emptying: 'Where have I treated myself as a machine that only earns rest by output?', response: 'I am made in His image. I will rest without apologizing for being human.' },
      { day: 8, title: 'The Breath of Life', scripture: 'Genesis 2:7 · John 20:22', focus: 'God breathed into dust and it became a living soul. The same Spirit is offered still. Where you feel lifeless — prayer, body, hope — ask for breath again. Regulation often starts with the literal breath; formation starts with the same gift.', emptying: 'What lifeless places in me need breath more than advice?', response: 'Breathe in. Receive life again. I am not only dust; I carry His breath.' },
      { day: 9, title: 'The Garden Work', scripture: 'Genesis 2:15 · Colossians 3:23', focus: 'Work existed before the fall. Purpose is original, not a punishment. The curse twisted labor; it did not invent it. You can work as worship even while your nervous system is still healing.', emptying: 'Where has work become only curse, survival, or identity — with no room for offering?', response: 'I work as unto the Lord. My worth is not my productivity.' },
      { day: 10, title: 'Not Good to Be Alone', scripture: 'Genesis 2:18 · Hebrews 10:24-25', focus: 'Isolation feels like safety when shame or trauma is loud. It is rarely the design. One safe connection is formation. Risk does not mean flooding yourself with unsafe people — it means refusing total aloneness as a lifestyle.', emptying: 'Where am I hiding from people because exposure feels like death?', response: 'I risk one safe connection. Isolation is not my covenant.' },
      { day: 11, title: 'The First Covering', scripture: 'Genesis 3:21 · Isaiah 61:10', focus: 'Even after failure, God covers. Grace is older than your shame. The coverings you make for yourself — image, achievement, numbness — never fit. His covering does.', emptying: 'What shame am I still wearing like a second skin?', response: 'I receive the covering of Christ. I stop sewing my own fig leaves.' },
      { day: 12, title: 'The Promise in the Curse', scripture: 'Genesis 3:15 · Romans 16:20', focus: 'The first gospel is spoken in the middle of consequence: the seed will crush the serpent. Evil does not get the last word. Your story is not only damage; it is a battlefield where a promise already stands.', emptying: 'Where does the enemy still have unchallenged ground in my self-talk?', response: 'The seed has already won. I will not agree with the serpent’s verdict.' },
      { day: 13, title: 'Walking with God', scripture: 'Genesis 5:24 · Micah 6:8', focus: 'Enoch walked with God. The goal is presence, not spiritual performance metrics. Walking is pace, companionship, direction — not a highlight reel.', emptying: 'Am I performing for God or walking with Him?', response: 'I choose presence over performance. Walk with me today.' },
      { day: 14, title: 'The Ark of Safety', scripture: 'Genesis 6–8 · 1 Peter 3:20-21', focus: 'Safety is found inside the ark, not by mastering the storm. You do not have to understand every wave to be kept. Entering is an act of trust, not of control.', emptying: 'Where am I still trying to ride the storm alone so I can stay in charge?', response: 'I enter the ark. I am kept. I do not need to manage the flood.' },
      { day: 15, title: 'The Rainbow Covenant', scripture: 'Genesis 9:12-17', focus: 'God sets a sign in the sky and remembers. You are allowed to need reminders that you are not forgotten. The covenant holds when your feelings do not.', emptying: 'Where have I assumed God forgot me because the sky looked empty?', response: 'He remembers. The covenant holds. I will look for the sign.' },
      { day: 16, title: 'Leave the Ur', scripture: 'Genesis 12:1-4 · Hebrews 11:8', focus: 'Faith moves before the map is complete. Abraham went without knowing the full itinerary. Leaving “Ur” may mean a habit, a false identity, a room in your mind where you have lived too long.', emptying: 'What familiar place is God asking me to leave — even without a full plan?', response: 'I will go. I do not need the full map to take the next step.' },
      { day: 17, title: 'The Altar First', scripture: 'Genesis 12:7-8 · Romans 12:1', focus: 'Abraham builds altars before the promise is fully seen. Worship is not the prize after results; it is the first response. Offer your body, your day, your confusion.', emptying: 'Have I been waiting to worship until I feel better or see outcomes?', response: 'I build the altar now. My offering is this unfinished day.' },
      { day: 18, title: 'The God Who Sees', scripture: 'Genesis 16:13 · Psalm 139:1-3', focus: 'Hagar names God El Roi — the God who sees. You are not invisible in the wilderness of mental illness, recovery, or waiting. Being seen is the beginning of healing.', emptying: 'Where do I feel invisible — to people, to God, even to myself?', response: 'I am seen. Fully. I do not have to perform to be noticed by Him.' },
      { day: 19, title: 'Laughter from Impossibility', scripture: 'Genesis 18:12-14 · Luke 1:37', focus: 'Sarah laughs at the impossible. God is not offended by honest impossibility — He answers it. What have you quietly labeled “too late” or “too broken”?', emptying: 'What have I labeled impossible so I would not have to hope?', response: 'Nothing is too hard for Him. I reopen one closed door of hope.' },
      { day: 20, title: 'The Provided Ram', scripture: 'Genesis 22:8-14 · John 1:29', focus: 'On the mountain, provision appears when the knife is raised. Jehovah Jireh. You are not asked to supply your own salvation. Look up from the problem you keep trying to solve alone.', emptying: 'Where am I still climbing with my own solution as the only sacrifice?', response: 'He will provide. I look up. I stop offering what only He can give.' },
      { day: 21, title: 'The Well in the Wilderness', scripture: 'Genesis 21:19 · Isaiah 12:3', focus: 'The well was already there; Hagar’s eyes were opened. Provision is sometimes not absent but unseen. Ask for sight more than for a new landscape.', emptying: 'What provision might already be near that I cannot see through panic or shame?', response: 'Open my eyes to the well. I will draw with what little strength I have.' },
      { day: 22, title: 'Wrestling Until Blessing', scripture: 'Genesis 32:24-30', focus: 'Jacob wrestles and will not let go until blessed — and leaves with a limp and a new name. Some encounters with God leave you changed and marked, not polished.', emptying: 'What am I still fighting God for control of?', response: 'I will not let go until You bless me. I accept the limp if it comes with the name.' },
      { day: 23, title: 'Joseph’s Pit', scripture: 'Genesis 37:23-28 · Romans 8:28', focus: 'The pit is real and unjust — and it is not the end of the story. Do not build your whole identity on the worst chapter.', emptying: 'Where am I still defining myself primarily by the pit?', response: 'This pit is not my final chapter. I refuse to live as only a victim of the drop.' },
      { day: 24, title: 'Joseph’s Prison', scripture: 'Genesis 39:20-23 · Psalm 105:17-19', focus: 'The word of the Lord tested him in the dark. Faithfulness in unseen places is not wasted. God is not only the God of promotions.', emptying: 'Am I still faithful when no one is watching and nothing is improving?', response: 'I remain faithful in the unseen place. Hidden obedience still counts.' },
      { day: 25, title: 'Joseph’s Promotion', scripture: 'Genesis 41:39-43 · 1 Peter 5:6', focus: 'Exaltation comes in due time. Forcing your own promotion — relationally, spiritually, vocationally — often breaks what patience would have carried.', emptying: 'Am I forcing doors because waiting feels like abandonment?', response: 'I wait for His timing. I will not pry open what He has not opened.' },
      { day: 26, title: 'You Meant It for Evil', scripture: 'Genesis 50:20 · Romans 8:28', focus: 'Joseph reframes without denying the evil. God meant it for good. This is not gaslighting pain; it is refusing to let evil have the last interpretive word.', emptying: 'What wound am I still calling pure evil with no room for redemption?', response: 'You meant it for good. I release the final verdict to You.' },
      { day: 27, title: 'I Am Who I Am', scripture: 'Exodus 3:13-14 · John 8:58', focus: 'God names Himself. Your deepest identity is held in His name, not in your diagnosis, history, or last failure. Live under the I AM, not under the “I was.”', emptying: 'Whose name have I been living under — critic, parent, illness, past self?', response: 'I live under the name of the I AM. That is my primary identity.' },
      { day: 28, title: 'The Blood on the Door', scripture: 'Exodus 12:13 · 1 Corinthians 5:7', focus: 'Safety comes from the blood, not from the quality of the household’s performance. You are covered. Rest is allowed.', emptying: 'Am I still trying to be safe by perfect behavior, recovery metrics, or image?', response: 'I am covered by the blood. I rest. I stop earning passover.' },
      { day: 29, title: 'Through the Sea', scripture: 'Exodus 14:13-14 · Isaiah 43:2', focus: 'Stand still. The Lord will fight. Thrashing in panic often feels like effort but blocks the path through. Stillness can be the most courageous act.', emptying: 'Where am I still thrashing instead of standing still?', response: 'I stand still. He fights. I walk through on dry ground when He opens it.' },
      { day: 30, title: 'The Wells of Salvation', scripture: 'Isaiah 12:3 · John 4:14', focus: 'Draw with joy. The wells do not run dry on your worst mental-health day. Drawing is allowed when you feel empty — especially then.', emptying: 'Where have I been drawing from empty cisterns — approval, numbing, control?', response: 'I draw from the living well today. Joy may come after the drawing, not before.' },
      { day: 31, title: 'Bitter Waters Made Sweet', scripture: 'Exodus 15:22-25', focus: 'Israel finds bitter water after deliverance. Healing is not linear. God shows a tree; the bitter becomes sweet. Ask Him what to put into the bitterness you are still drinking.', emptying: 'What bitterness am I still drinking as if it were the only water?', response: 'Show me the tree. Make the bitter sweet. I bring You this cup.' },
      { day: 32, title: 'Manna for Today', scripture: 'Exodus 16:4 · Matthew 6:11', focus: 'Daily bread. Not weekly anxiety stockpiles. Manna teaches dependency and present-tense trust. Hoarding tomorrow’s fear starves today’s peace.', emptying: 'Where am I fretting about tomorrow’s manna instead of receiving today’s?', response: 'Give me today my daily bread. I release tomorrow’s inventory.' },
      { day: 33, title: 'Water from the Rock', scripture: 'Exodus 17:6 · 1 Corinthians 10:4', focus: 'Strike the rock — water comes. Paul says the Rock was Christ. You are not meant to be your own fountain. Come thirsty.', emptying: 'Where am I still striking in my own strength for what only He can give?', response: 'You are the Rock. I drink. I stop demanding water from dry stone.' },
      { day: 34, title: 'Under the Banner', scripture: 'Exodus 17:15 · Psalm 20:5', focus: 'Jehovah Nissi — the Lord is my banner. Whose banner have you been fighting under: perfectionism, fear, people-pleasing, rage?', emptying: 'Under whose banner have I been fighting my battles?', response: 'I fight under Your banner alone. I lower every false flag.' },
      { day: 35, title: 'The Presence in the Tent', scripture: 'Exodus 33:14-15 · Psalm 16:11', focus: 'My presence will go with you, and I will give you rest. Prefer the Presence over the promised land if you must choose. Arrival without Him is not arrival.', emptying: 'Am I asking for outcomes more than for His presence?', response: 'If Your presence does not go with me, do not send me up from here.' },
      { day: 36, title: 'Cleft of the Rock', scripture: 'Exodus 33:21-23', focus: 'Hidden in the cleft, covered by His hand. You are allowed to need covering when glory is too much and pain is too close. Refuge is not failure.', emptying: 'Where do I need to be hidden and covered instead of exposed and impressive?', response: 'Hide me in the cleft. Cover me. I do not need to see everything at once.' },
      { day: 37, title: 'Slow to Anger', scripture: 'Exodus 34:6-7 · Psalm 103:8', focus: 'The Lord is slow to anger, abounding in steadfast love. If your inner picture of God is only fury, you are not seeing Him as He names Himself.', emptying: 'Have I painted God as always angry because people were?', response: 'You are slow to anger. I receive Your steadfast love in place of my fear.' },
      { day: 38, title: 'The Lord Who Heals', scripture: 'Exodus 15:26 · Psalm 103:3', focus: 'Jehovah Rapha — the Lord who heals. Bring the wound again even if you have brought it a hundred times. Healing is often iterative, not instant.', emptying: 'What wound have I stopped bringing because I was tired of asking?', response: 'Heal me. I bring it again. I will not pretend I am fine.' },
      { day: 39, title: 'Write the Vision', scripture: 'Habakkuk 2:2-3 · Proverbs 29:18', focus: 'Make it plain so he may run who reads it. Vague vision produces vague living. Clarity is kindness to your future self and to anyone who runs with you.', emptying: 'What vision have I left vague so I could avoid commitment or disappointment?', response: 'I write it clearly. I will run. Ambiguity is not humility.' },
      { day: 40, title: 'Call and I Will Answer', scripture: 'Jeremiah 33:3', focus: 'Call to Me and I will answer you and tell you great and hidden things. Silence is not always absence. Keep calling. Seeking is part of the relationship.', emptying: 'Have I stopped calling because the silence felt like rejection?', response: 'I call again. I expect an answer in His time. I will not orphan myself.' },
      { day: 41, title: 'A Heart of Flesh', scripture: 'Ezekiel 36:26 · Psalm 51:10', focus: 'He replaces stone with flesh. Softness is not weakness; it is the miracle. Stop trying to renovate the old heart with more pressure.', emptying: 'Where am I still trying to force the old heart to behave?', response: 'Give me the new heart. Remove the stone. I consent to softness.' },
      { day: 42, title: 'The Brokenhearted', scripture: 'Psalm 34:18 · Isaiah 61:1', focus: 'The Lord is near to the brokenhearted. Nearness is His specialty in pain. You do not have to clean up before He comes close.', emptying: 'Where am I still pretending I am not broken so I can stay in control?', response: 'I bring the broken pieces. He is near. I stop performing strength.' },
      { day: 43, title: 'He Restores My Soul', scripture: 'Psalm 23:3 · Psalm 19:7', focus: 'He restores my soul — not only my schedule. Soul-restoration may look like sleep, quiet, tears, or Scripture. Let Him lead beside still water.', emptying: 'Where has my soul gone dry while I kept the outer life running?', response: 'Restore my soul. Lead me. I will follow at a human pace.' },
      { day: 44, title: 'When I Am Afraid', scripture: 'Psalm 56:3-4 · Isaiah 41:10', focus: 'When I am afraid, I put my trust in You. Fear is not the failure; refusing to trust through fear is the stuck place. Trust is a placement of weight.', emptying: 'What fear am I feeding with rehearsal instead of entrusting?', response: 'I trust You with this fear. I put the weight on You, not on my control.' },
      { day: 45, title: 'New Every Morning', scripture: 'Lamentations 3:22-23 · Psalm 30:5', focus: 'Mercies new every morning. Yesterday’s collapse does not cancel today’s supply. Stop living under a verdict that expired at sunrise.', emptying: 'Am I still living under yesterday’s failure as if it were today’s identity?', response: 'Today’s mercy is enough for today. I step out from under yesterday’s cloud.' },
      { day: 46, title: 'Be Still', scripture: 'Psalm 46:10 · Exodus 14:14', focus: 'Be still, and know that I am God. Stillness is not passivity; it is the end of playing God. Knowing follows stillness more often than the other way around.', emptying: 'Where is my stillness broken by constant striving and mental noise?', response: 'I am still. You are God. I am not.' },
      { day: 47, title: 'The Shepherd', scripture: 'Psalm 23', focus: 'The Lord is my shepherd; I shall not want. Lack is not the final word when He leads. Let Him choose the pasture; you choose to follow.', emptying: 'Where am I still my own shepherd — exhausted, reactive, over-controlling?', response: 'You are my Shepherd. I rest in the pasture You choose.' },
      { day: 48, title: 'Search Me', scripture: 'Psalm 139:23-24', focus: 'Search me, O God, and know my heart. Invite the searchlight. Hidden rooms stay sick. Confession is not self-hatred; it is agreement with truth.', emptying: 'What am I hiding from His searchlight — and from my own honesty?', response: 'Search me. Know me. Lead me in the way everlasting.' },
      { day: 49, title: 'Out of the Depths', scripture: 'Psalm 130:1-6', focus: 'Out of the depths I cry. Depths are valid places of prayer. You do not need a composed voice. Waiting on the Lord is not wasted time.', emptying: 'Where have I stopped crying out because the depths felt unspiritual?', response: 'I cry from the depths. I wait. My soul waits for the Lord.' },
      { day: 50, title: 'Taste and See', scripture: 'Psalm 34:8 · Psalm 34:4', focus: 'Taste and see that the Lord is good. Faith wants experience, not only correct ideas. Refuge is the doorway to that taste.', emptying: 'Have I only heard about His goodness without coming near enough to taste?', response: 'I want to taste. I take refuge in You. Show me that You are good.' },
      { day: 51, title: 'Cast Your Burden', scripture: 'Psalm 55:22 · 1 Peter 5:7', focus: 'Cast your burden on the Lord — He will sustain you. Casting is active. Clinging to the burden is not loyalty; it is exhaustion.', emptying: 'What burden am I still carrying as proof that I care?', response: 'I cast it. Sustain me. Caring does not require that I carry alone.' },
      { day: 52, title: 'A Clean Heart', scripture: 'Psalm 51:10-12', focus: 'Create in me a clean heart; renew a right spirit; restore the joy of salvation. Ask for joy restoration without shame — it is biblical, not selfish.', emptying: 'Where has my spirit grown dull, cynical, or joyless?', response: 'Create. Renew. Restore the joy. I open the door again.' },
      { day: 53, title: 'The Name That Is a Tower', scripture: 'Proverbs 18:10', focus: 'The name of the Lord is a strong tower; the righteous run into it and are safe. Running toward Him is wisdom, not weakness.', emptying: 'Where am I running instead — into distraction, rage, isolation, old habits?', response: 'I run into Your name. I am safe. I stop running elsewhere.' },
      { day: 54, title: 'Trust and Do Not Lean', scripture: 'Proverbs 3:5-6', focus: 'Trust in the Lord with all your heart; do not lean on your own understanding. Your understanding is real data — it is not ultimate authority.', emptying: 'Where am I leaning on my own understanding as if it were omniscience?', response: 'I trust. I do not lean on myself as the final word. Make my paths straight.' },
      { day: 55, title: 'Plans for Hope', scripture: 'Jeremiah 29:11-13', focus: 'Plans for welfare, a future and a hope. You will seek Me and find Me when you seek with all your heart. Hope is not naive; it is covenantal.', emptying: 'Where have I stopped seeking because hope felt dangerous after disappointment?', response: 'I seek You. I receive the future You hold. I reopen hope carefully and truly.' },
      { day: 56, title: 'He Was Pierced', scripture: 'Isaiah 53:5 · 1 Peter 2:24', focus: 'He was pierced for our transgressions; by His wounds we are healed. Hold the cost without flinching. Healing flows from a real cross, not a metaphor.', emptying: 'Where have I minimized what it cost Him so I could stay casual?', response: 'By Your wounds I am healed. I will not forget the cost.' },
      { day: 57, title: 'The Man of Sorrows', scripture: 'Isaiah 53:3-4', focus: 'A man of sorrows, acquainted with grief. He bore our griefs. You are not more acquainted with pain than He is. Bring the grief; do not only manage it.', emptying: 'What grief am I still carrying as if He did not bear it?', response: 'You bore it. I give You this grief. I stop carrying it alone.' },
      { day: 58, title: 'It Is Finished', scripture: 'John 19:30 · Hebrews 10:12-14', focus: 'It is finished. One sacrifice for sins for all time. Stop trying to finish what He finished — your acceptance, your worthiness, your rescue.', emptying: 'Where am I still trying to complete my own atonement with effort or suffering?', response: 'It is finished. I rest in the finished work. I add nothing to the cross.' },
      { day: 59, title: 'The Empty Tomb', scripture: 'Luke 24:5-6 · 1 Corinthians 15:55-57', focus: 'Why seek the living among the dead? He is risen. Stop looking for life in dead places — old identities, dead relationships as idols, numbing as hope.', emptying: 'Where am I still looking for life in places I already know are tombs?', response: 'He is risen. I look for the living One. I leave the tomb.' },
      { day: 60, title: 'The Cost of Love', scripture: 'Isaiah 53 · John 19', focus: 'This is the cost. Never forget it. Never forget Me again. Let the vision of the Cross interrupt self-hatred and self-salvation alike.', emptying: 'Where have I grown casual about the Cross — or used it as a slogan without surrender?', response: 'I remember. I will not forget. Love this costly reorders my life.' },
      { day: 61, title: 'Peace Be With You', scripture: 'John 20:19-21 · John 14:27', focus: 'Locked room. Fear. Jesus’ first word: Peace. His peace is not the world’s version. Receive it as a person standing in the room, not only as a mood.', emptying: 'Where am I still locked in fear with the doors barred?', response: 'Peace be with me. I receive it. I unlock the door from the inside.' },
      { day: 62, title: 'Thomas and the Wounds', scripture: 'John 20:27-29', focus: 'Put your finger here. Doubt is invited into the wounds, not shamed away. Honest unbelief can become confession: My Lord and my God.', emptying: 'Where do I still need to touch the wounds to believe I am loved?', response: 'My Lord and my God. I believe. Meet me in my need to see.' },
      { day: 63, title: 'Breakfast on the Shore', scripture: 'John 21:9-17', focus: 'Jesus restores Peter with breakfast and three questions of love — not three humiliations. Failure is not the end of calling. Love reinstates.', emptying: 'Where do I still live under the failure of my denial as if it were permanent?', response: 'You know that I love You. Restore me. Feed Your sheep through me again.' },
      { day: 64, title: 'Come to Me', scripture: 'Matthew 11:28-30', focus: 'Come to Me, all who labor and are heavy laden. The yoke is easy because He carries with you. Lay the load down; do not only rearrange it.', emptying: 'What heavy load am I still refusing to lay down because it feels like identity?', response: 'I come. I take Your yoke. I find rest for my soul.' },
      { day: 65, title: 'Abide', scripture: 'John 15:4-5', focus: 'Abide in Me. Apart from Me you can do nothing. Striving without abiding produces burnout that looks like faithfulness.', emptying: 'Where am I striving apart from the Vine and calling it ministry or recovery?', response: 'I abide. You are the Vine. I am the branch. I stop producing alone.' },
      { day: 66, title: 'The Helper', scripture: 'John 14:16-18 · John 16:7', focus: 'Another Helper. You are not orphaned. The Spirit is not a doctrine only — He is present help in weakness, including mental weakness.', emptying: 'Am I living as if I am alone with my diagnosis and my willpower?', response: 'The Helper is with me. I am not orphaned. Come, Holy Spirit.' },
      { day: 67, title: 'Rivers of Living Water', scripture: 'John 7:37-39 · Isaiah 58:11', focus: 'If anyone thirsts, come to Me and drink. Thirst is not failure; it is invitation. Rivers flow from those who drink, not from those who pretend not to need.', emptying: 'Where am I still thirsty and too proud or too ashamed to come?', response: 'I come. I drink. Let rivers flow — even thin ones at first.' },
      { day: 68, title: 'The Final Surrender', scripture: 'Matthew 11:28 · Galatians 2:20', focus: 'Stop trying to save yourself. Give Him all of it — the mind, the past, the control, the timeline. Surrender is not passive; it is the most active trust.', emptying: 'What am I still clutching as if my grip were safety?', response: 'Jesus, I surrender. Fully. Completely. I am Yours.' },
      { day: 69, title: 'Crucified With Christ', scripture: 'Galatians 2:20 · Romans 6:6', focus: 'I have been crucified with Christ. It is no longer I who live. The old self does not get a board seat. Agree with the death so you can agree with the life.', emptying: 'Where is the old self still running the show under a Christian label?', response: 'I have been crucified with Christ. He lives in me. The old is not in charge.' },
      { day: 70, title: 'No Condemnation', scripture: 'Romans 8:1-2', focus: 'No condemnation for those in Christ Jesus. Condemnation is a voice; it is not the verdict of the court of heaven. Stop agreeing with a closed case.', emptying: 'What condemnation am I still agreeing with as if it were God’s voice?', response: 'No condemnation. I am in Christ. I reject the false verdict.' },
      { day: 71, title: 'The Spirit of Adoption', scripture: 'Romans 8:15-16', focus: 'You cry Abba, Father. Adoption is status, not mood. Live as a son or daughter, not as a scared slave earning a place at the table.', emptying: 'Am I still living as a slave to fear rather than as a child of God?', response: 'Abba, Father. I am Yours. I put down the slave’s posture.' },
      { day: 72, title: 'More Than Conquerors', scripture: 'Romans 8:37-39', focus: 'Nothing can separate us from the love of God in Christ Jesus. Not death, life, angels, powers, the past, the future, mental illness, or failure.', emptying: 'What am I still treating as powerful enough to separate me from His love?', response: 'Nothing. Nothing. Nothing. I am held.' },
      { day: 73, title: 'Present Your Bodies', scripture: 'Romans 12:1-2', focus: 'Present your bodies as a living sacrifice; be transformed by the renewal of your mind. Formation is embodied. Your nervous system is part of the offering.', emptying: 'What part of me have I withheld from the altar — mind, body, sexuality, ambition, bitterness?', response: 'I present all of me. Renew my mind. I hold nothing back today.' },
      { day: 74, title: 'The Peace That Guards', scripture: 'Philippians 4:6-7', focus: 'Do not be anxious about anything — by prayer and thanksgiving, let requests be made known. Peace stands guard. Hand over what anxiety keeps rehearsing.', emptying: 'What anxiety am I feeding with mental rehearsal instead of prayer?', response: 'I pray. Your peace guards me. I stop the rehearsal loop.' },
      { day: 75, title: 'I Can Do All Things', scripture: 'Philippians 4:13 · 2 Corinthians 12:9', focus: 'Through Him who strengthens me — and grace sufficient in weakness. Strength is not the absence of weakness; it is His power in it.', emptying: 'Where am I still measuring by my strength alone and despising weakness?', response: 'Your strength. Your grace. Enough. I stop despising my limits.' },
      { day: 76, title: 'He Who Began', scripture: 'Philippians 1:6', focus: 'He who began a good work in you will bring it to completion. Your job is faithfulness; His job is completion. Release the timeline panic.', emptying: 'What fear of unfinished business is driving me harder than love is?', response: 'You will finish. I trust the process. I stay faithful in my lane.' },
      { day: 77, title: 'Rejoice Always', scripture: 'Philippians 4:4-5 · 1 Thessalonians 5:16-18', focus: 'Rejoice in the Lord always; give thanks in all circumstances. Joy is rooted in Him, not in outcomes. Thanksgiving is a discipline of sight.', emptying: 'Where has joy been postponed until circumstances finally improve?', response: 'I rejoice now. I give thanks in this. Joy is not denial; it is direction.' },
      { day: 78, title: 'The Mind of Christ', scripture: 'Philippians 2:5-8 · 1 Corinthians 2:16', focus: 'Have this mind among yourselves: humility, emptying, obedience. The mind of Christ is not only information; it is posture.', emptying: 'Where is my mind still set on self-exaltation, self-protection, or self-pity?', response: 'I take the mind of Christ. I empty myself. I serve.' },
      { day: 79, title: 'Run the Race', scripture: 'Hebrews 12:1-2', focus: 'Lay aside every weight and sin; run with endurance; look to Jesus. Weights are not always sins — sometimes they are good things carried in the wrong way.', emptying: 'What weight am I still carrying in the race that I could lay aside?', response: 'I lay it aside. I look to Jesus. I run with endurance, not sprint-shame.' },
      { day: 80, title: 'The Spirit Within', scripture: 'John 14:16-17 · Romans 8:11', focus: 'The Spirit dwells in you. The same power that raised Jesus gives life to mortal bodies — including exhausted, anxious, depressed bodies.', emptying: 'Am I living as if the Spirit were optional equipment?', response: 'The Spirit is in me. Life is in me. I rely on Him, not only on grit.' },
      { day: 81, title: 'Fruit of the Spirit', scripture: 'Galatians 5:22-23', focus: 'Love, joy, peace, patience, kindness, goodness, faithfulness, gentleness, self-control. Fruit grows; it is not welded on by force. Stay attached to the Vine.', emptying: 'Which fruit is missing where I am striving in the flesh?', response: 'Grow Your fruit in me. I stay on the Vine. I stop forcing produce.' },
      { day: 82, title: 'Put On the New Self', scripture: 'Ephesians 4:22-24 · Colossians 3:12-14', focus: 'Put off the old self; put on the new — compassion, kindness, humility, love. Clothing is chosen daily. Identity is practiced.', emptying: 'What old clothing am I still wearing because it feels familiar?', response: 'I put off the old. I put on the new. Dress me for today.' },
      { day: 83, title: 'Strong in the Lord', scripture: 'Ephesians 6:10-11', focus: 'Be strong in the Lord and in the strength of His might. Put on the whole armor. This is not metaphor-only; it is how you stand when the day is evil.', emptying: 'Where am I fighting in my own strength and calling it faith?', response: 'I am strong in You. I put on the armor. I stand.' },
      { day: 84, title: 'Draw Near', scripture: 'Hebrews 4:16 · James 4:8', focus: 'Draw near to the throne of grace with confidence. Draw near to God and He will draw near to you. Shame says stay away. Grace says come.', emptying: 'Where am I staying at a distance out of shame or disappointment?', response: 'I draw near. Meet me here. I refuse the exile shame assigns me.' },
      { day: 85, title: 'Faithful and True', scripture: 'Revelation 19:11 · 1 Thessalonians 5:24', focus: 'He who calls you is faithful; He will surely do it. Your faithfulness wavers; His does not. Anchor in His character, not in your streak.', emptying: 'Where have I doubted His faithfulness because of my own unfaithfulness?', response: 'You are faithful. You will do it. I lean on Your character.' },
      { day: 86, title: 'A Living Hope', scripture: '1 Peter 1:3-5', focus: 'Born again to a living hope through the resurrection. Hope is alive because He is alive. Flat hope needs resurrection truth, not more pep talk.', emptying: 'Where has hope gone flat or dead in me?', response: 'I receive living hope. I am kept by God’s power. Hope, live again.' },
      { day: 87, title: 'Cast All Your Anxiety', scripture: '1 Peter 5:6-7', focus: 'Humble yourselves… casting all your anxieties on Him, because He cares for you. Humility and casting belong together. Pride keeps the anxiety as a possession.', emptying: 'What anxiety am I still gripping as if caring required ownership?', response: 'I cast it. You care for me. I humble myself under Your hand.' },
      { day: 88, title: 'Kept from Stumbling', scripture: 'Jude 24 · Philippians 1:6', focus: 'He is able to keep you from stumbling and to present you blameless. Completion is His work. Your part is to stay in the keeping.', emptying: 'What fear of falling is louder than trust in His keeping?', response: 'You will keep me. You will finish. I stay under Your keeping care.' },
      { day: 89, title: 'Almost Home', scripture: 'Philippians 3:13-14 · 2 Timothy 4:7', focus: 'Forgetting what lies behind, straining forward. Behind-things that still chain you need release, not endless rehearsal. Press on.', emptying: 'What behind-thing is still chaining my forward motion?', response: 'I forget what lies behind — not by denial, but by release. I press on.' },
      { day: 90, title: 'The Covenant Kept', scripture: 'Philippians 1:6 · Jude 24-25', focus: 'Open the letter you wrote on Day 1. Read it slowly. He who began will complete it. Glory to the only God our Savior. This is not the end of formation — it is a witness marker on the road.', emptying: 'What remains unspoken between me and God as this covenant stretch closes?', response: 'He will finish what He started. I am His. To Him be glory forever. Amen.' },
    ];

    const FORMATION_365 = [
      { day: 1, title: 'The Architect', scripture: 'Hebrews 11:10', reflection: 'Abraham looked for a city with foundations, whose architect and builder is God. Before any building begins, there is a blueprint — and a Builder who does not abandon the site. This year is not yours alone to design. Ask for the plans. Consent to be built.', prayer: 'Lord, show me the blueprint You have for my life and for Your house. I yield the pencil. Amen.' },
      { day: 2, title: 'Refuge in Trouble', scripture: 'Exodus 15:26', reflection: 'Abide. Fruit follows connection, not pressure. “I am the Lord, your healer.” (Exodus 15:26) If you are striving without remaining, you will burn out and call it faithfulness. Come back to the Vine.', prayer: 'Lord, write Your vision on my heart so clearly that I can run with it — and rest when You say rest. Amen.' },
      { day: 3, title: 'Daily Bread', scripture: 'Deuteronomy 31:8', reflection: 'Seeds grow in the dark before they break the soil. “It is the Lord who goes before you. He will be with you; he will not leave you or forsake you.” (Deuteronomy 31:8) You are not behind because you cannot see fruit yet. Stop digging up the seed to inspect it. Water it with trust and ordinary obedience.', prayer: 'Father, I draw from Your well. Let Your peace guard my heart and mind in Christ Jesus. I cast what I cannot carry. Amen.' },
      { day: 4, title: 'Abide in the Vine', scripture: 'Nehemiah 8:10', reflection: 'He cares for you — not as a slogan, as a posture. “The joy of the Lord is your strength.” (Nehemiah 8:10) Cast the anxiety. Clinging to it is not the same as being responsible. Love lets you put the weight down.', prayer: 'Abba, I am Yours. Keep me from striving in my own strength. Teach me to abide. Grow Your fruit in me. Amen.' },
      { day: 5, title: 'Peace That Guards', scripture: 'Psalm 23:1', reflection: 'Stability is not the absence of weather. It is the presence of a Pilot and a Shepherd. “The Lord is my shepherd; I shall not want.” (Psalm 23:1) Name your state if you need to. Then return to this truth. Scripture is ballast, not decoration.', prayer: 'Father, give me today’s bread, today’s mercy, and today’s courage. I release tomorrow into Your hands. Amen.' },
      { day: 6, title: 'Faithful God', scripture: 'Psalm 34:8', reflection: 'Waiting is not wasted when you wait on the Lord. “Oh, taste and see that the Lord is good! Blessed is the man who takes refuge in him!” (Psalm 34:8) Strength renews in the waiting more often than in the forcing. Rest is part of the race, not the opposite of it.', prayer: 'Jesus, I remember the Cross. I remember that it is finished. Help me walk as someone bought with a price and welcomed by name. Amen.' },
      { day: 7, title: 'Armor of God', scripture: 'Psalm 46:10', reflection: 'Remember the Cross when shame tries to narrate your whole story. “Be still, and know that I am God.” (Psalm 46:10) The cost was real. The welcome is real. Healing is not self-improvement alone; it flows from a finished work and a living Lord.', prayer: 'God of all comfort, use even this day for formation. I trust that You finish what You start. Hold me in the unfinished places. Amen.' },
      { day: 8, title: 'Guard Your Heart', scripture: 'Psalm 56:3', reflection: 'Poverty of spirit is not a personality flaw; it is a doorway. “When I am afraid, I put my trust in you.” (Psalm 56:3) Blessed are those who know they need. The kingdom belongs to the needy who come, not to the self-sufficient who perform.', prayer: 'Lord, I receive this word. Search me where I am guarded. Meet me where I am tired. Teach me to trust You in this actual day. Amen.' },
      { day: 9, title: 'Write the Vision', scripture: 'Psalm 130:1', reflection: 'You are not the architect of your own rescue — and you are not abandoned on the worksite. “Out of the depths I cry to you, O Lord!” (Psalm 130:1) What looks unfinished to you is not forgotten by Him. Prefer faithfulness today over a fantasy of arrival.', prayer: 'Holy Spirit, renew my mind. Steady my Pilot. Lead me into truth that sets me free — not only informs me. Amen.' },
      { day: 10, title: 'Through the Waters', scripture: 'Proverbs 3:5-6', reflection: 'Running into His name is not weakness; it is wisdom. “Trust in the Lord with all your heart, and do not lean on your own understanding.” (Proverbs 3:5-6) The strong tower still stands when your strategies fail. Choose refuge over rehearsal of fear.', prayer: 'Lord, write Your vision on my heart so clearly that I can run with it — and rest when You say rest. Amen.' },
      { day: 11, title: 'Create in Me', scripture: 'Isaiah 12:3', reflection: 'The wells of salvation do not close when your mood drops. “With joy you will draw water from the wells of salvation.” (Isaiah 12:3) Draw even if your hands shake. Joy is not always the entrance fee; sometimes it is what follows obedience and presence. You are allowed to come thirsty.', prayer: 'Father, I draw from Your well. Let Your peace guard my heart and mind in Christ Jesus. I cast what I cannot carry. Amen.' },
      { day: 12, title: 'The Lord Who Heals', scripture: 'Isaiah 41:10', reflection: 'When the mind leaks and the page feels stained, bring the mess here. “Fear not, for I am with you; be not dismayed, for I am your God.” (Isaiah 41:10) Externalize what is loud. Let the Word speak louder than the spiral. You are not alone in the room, and you are not only your weather.', prayer: 'Abba, I am Yours. Keep me from striving in my own strength. Teach me to abide. Grow Your fruit in me. Amen.' },
      { day: 13, title: 'Heart Over Appearance', scripture: 'Isaiah 55:1', reflection: 'Depth does not always announce itself with emotion. Sometimes it is the steady choice to stay. “Come, everyone who thirsts, come to the waters.” (Isaiah 55:1) Hold this without rushing to apply it to everyone else. Let it search you. Regulation and formation meet when the Pilot is honest and the heart is open.', prayer: 'Father, give me today’s bread, today’s mercy, and today’s courage. I release tomorrow into Your hands. Amen.' },
      { day: 14, title: 'Take Heart', scripture: 'Jeremiah 33:3', reflection: 'Mercy is new this morning — not recycled leftover grace. “Call to me and I will answer you, and will tell you great and hidden things that you have not known.” (Jeremiah 33:3) Yesterday’s collapse does not cancel today’s supply. Step out from under a verdict that expired at sunrise.', prayer: 'Jesus, I remember the Cross. I remember that it is finished. Help me walk as someone bought with a price and welcomed by name. Amen.' },
      { day: 15, title: 'Spirit of Adoption', scripture: 'Habakkuk 2:2', reflection: 'Today’s word is not a demand to feel better; it is an invitation to come as you are. “Write the vision; make it plain on tablets, so he may run who reads it.” (Habakkuk 2:2) Let this settle under the noise. Formation is rarely loud. It is often the quiet decision to trust again when your nervous system still remembers every storm.', prayer: 'God of all comfort, use even this day for formation. I trust that You finish what You start. Hold me in the unfinished places. Amen.' },
      { day: 16, title: 'The Greatest Is Love', scripture: 'Matthew 5:3', reflection: 'He goes before you into this day. “Blessed are the poor in spirit, for theirs is the kingdom of heaven.” (Matthew 5:3) You do not need the full year mapped. You need the next faithful step with the One who already sees the end. Release the demand to control outcomes you were never assigned.', prayer: 'Lord, I receive this word. Search me where I am guarded. Meet me where I am tired. Teach me to trust You in this actual day. Amen.' },
      { day: 17, title: 'Walk by the Spirit', scripture: 'Matthew 11:28', reflection: 'Abide. Fruit follows connection, not pressure. “Come to me, all who labor and are heavy laden, and I will give you rest.” (Matthew 11:28) If you are striving without remaining, you will burn out and call it faithfulness. Come back to the Vine.', prayer: 'Holy Spirit, renew my mind. Steady my Pilot. Lead me into truth that sets me free — not only informs me. Amen.' },
      { day: 18, title: 'He Who Began', scripture: 'Luke 4:18', reflection: 'Seeds grow in the dark before they break the soil. “He has sent me to proclaim liberty to the captives… to set at liberty those who are oppressed.” (Luke 4:18) You are not behind because you cannot see fruit yet. Stop digging up the seed to inspect it. Water it with trust and ordinary obedience.', prayer: 'Lord, write Your vision on my heart so clearly that I can run with it — and rest when You say rest. Amen.' },
      { day: 19, title: 'Not a Spirit of Fear', scripture: 'John 3:16', reflection: 'He cares for you — not as a slogan, as a posture. “For God so loved the world, that he gave his only Son.” (John 3:16) Cast the anxiety. Clinging to it is not the same as being responsible. Love lets you put the weight down.', prayer: 'Father, I draw from Your well. Let Your peace guard my heart and mind in Christ Jesus. I cast what I cannot carry. Amen.' },
      { day: 20, title: 'Unchanging Christ', scripture: 'John 10:10', reflection: 'Stability is not the absence of weather. It is the presence of a Pilot and a Shepherd. “I came that they may have life and have it abundantly.” (John 10:10) Name your state if you need to. Then return to this truth. Scripture is ballast, not decoration.', prayer: 'Abba, I am Yours. Keep me from striving in my own strength. Teach me to abide. Grow Your fruit in me. Amen.' },
      { day: 21, title: 'Perfect Love', scripture: 'John 15:5', reflection: 'Waiting is not wasted when you wait on the Lord. “I am the vine; you are the branches. Whoever abides in me and I in him, he it is that bears much fruit.” (John 15:5) Strength renews in the waiting more often than in the forcing. Rest is part of the race, not the opposite of it.', prayer: 'Father, give me today’s bread, today’s mercy, and today’s courage. I release tomorrow into Your hands. Amen.' },
      { day: 22, title: 'Stillness Before Him', scripture: 'Acts 1:8', reflection: 'Remember the Cross when shame tries to narrate your whole story. “You will receive power when the Holy Spirit has come upon you.” (Acts 1:8) The cost was real. The welcome is real. Healing is not self-improvement alone; it flows from a finished work and a living Lord.', prayer: 'Jesus, I remember the Cross. I remember that it is finished. Help me walk as someone bought with a price and welcomed by name. Amen.' },
      { day: 23, title: 'Open Hands', scripture: 'Romans 8:15', reflection: 'Poverty of spirit is not a personality flaw; it is a doorway. “You have received the Spirit of adoption as sons, by whom we cry, “Abba! Father!”” (Romans 8:15) Blessed are those who know they need. The kingdom belongs to the needy who come, not to the self-sufficient who perform.', prayer: 'God of all comfort, use even this day for formation. I trust that You finish what You start. Hold me in the unfinished places. Amen.' },
      { day: 24, title: 'Light in Darkness', scripture: 'Romans 8:38-39', reflection: 'You are not the architect of your own rescue — and you are not abandoned on the worksite. “Neither death nor life… nor anything else in all creation, will be able to separate us from the love of God in Christ Jesus.” (Romans 8:38-39) What looks unfinished to you is not forgotten by Him. Prefer faithfulness today over a fantasy of arrival.', prayer: 'Lord, I receive this word. Search me where I am guarded. Meet me where I am tired. Teach me to trust You in this actual day. Amen.' },
      { day: 25, title: 'Clean Hands, Clear Path', scripture: '2 Corinthians 1:3-4', reflection: 'Running into His name is not weakness; it is wisdom. “The Father of mercies and God of all comfort, who comforts us in all our affliction.” (2 Corinthians 1:3-4) The strong tower still stands when your strategies fail. Choose refuge over rehearsal of fear.', prayer: 'Holy Spirit, renew my mind. Steady my Pilot. Lead me into truth that sets me free — not only informs me. Amen.' },
      { day: 26, title: 'Lay the Burden Down', scripture: 'Galatians 2:20', reflection: 'The wells of salvation do not close when your mood drops. “I have been crucified with Christ. It is no longer I who live, but Christ who lives in me.” (Galatians 2:20) Draw even if your hands shake. Joy is not always the entrance fee; sometimes it is what follows obedience and presence. You are allowed to come thirsty.', prayer: 'Lord, write Your vision on my heart so clearly that I can run with it — and rest when You say rest. Amen.' },
      { day: 27, title: 'Abba, Father', scripture: 'Ephesians 2:8-9', reflection: 'When the mind leaks and the page feels stained, bring the mess here. “For by grace you have been saved through faith. And this is not your own doing; it is the gift of God.” (Ephesians 2:8-9) Externalize what is loud. Let the Word speak louder than the spiral. You are not alone in the room, and you are not only your weather.', prayer: 'Father, I draw from Your well. Let Your peace guard my heart and mind in Christ Jesus. I cast what I cannot carry. Amen.' },
      { day: 28, title: 'Eyes on Jesus', scripture: 'Philippians 1:6', reflection: 'Depth does not always announce itself with emotion. Sometimes it is the steady choice to stay. “He who began a good work in you will bring it to completion at the day of Jesus Christ.” (Philippians 1:6) Hold this without rushing to apply it to everyone else. Let it search you. Regulation and formation meet when the Pilot is honest and the heart is open.', prayer: 'Abba, I am Yours. Keep me from striving in my own strength. Teach me to abide. Grow Your fruit in me. Amen.' },
      { day: 29, title: 'A Quiet Life', scripture: 'Colossians 3:2', reflection: 'Mercy is new this morning — not recycled leftover grace. “Set your minds on things that are above, not on things that are on earth.” (Colossians 3:2) Yesterday’s collapse does not cancel today’s supply. Step out from under a verdict that expired at sunrise.', prayer: 'Father, give me today’s bread, today’s mercy, and today’s courage. I release tomorrow into Your hands. Amen.' },
      { day: 30, title: 'The Peace That Guards', scripture: 'Philippians 4:6-7', reflection: 'Peace is not the absence of pressure; it is a guard posted at the heart and mind. Prayer hands over what anxiety keeps rehearsing. Thanksgiving retunes sight. Let the guard take the shift you cannot work alone.', prayer: 'Guard my heart and mind today with Your peace. I hand You the loop. Amen.' },
      { day: 31, title: 'Presence Over Performance', scripture: 'Hebrews 11:1', reflection: 'He goes before you into this day. “Now faith is the assurance of things hoped for, the conviction of things not seen.” (Hebrews 11:1) You do not need the full year mapped. You need the next faithful step with the One who already sees the end. Release the demand to control outcomes you were never assigned.', prayer: 'God of all comfort, use even this day for formation. I trust that You finish what You start. Hold me in the unfinished places. Amen.' },
      { day: 32, title: 'Renewed Strength', scripture: 'Hebrews 13:8', reflection: 'Abide. Fruit follows connection, not pressure. “Jesus Christ is the same yesterday and today and forever.” (Hebrews 13:8) If you are striving without remaining, you will burn out and call it faithfulness. Come back to the Vine.', prayer: 'Lord, I receive this word. Search me where I am guarded. Meet me where I am tired. Teach me to trust You in this actual day. Amen.' },
      { day: 33, title: 'Lamp to My Feet', scripture: '1 Peter 5:7', reflection: 'Seeds grow in the dark before they break the soil. “Casting all your anxieties on him, because he cares for you.” (1 Peter 5:7) You are not behind because you cannot see fruit yet. Stop digging up the seed to inspect it. Water it with trust and ordinary obedience.', prayer: 'Holy Spirit, renew my mind. Steady my Pilot. Lead me into truth that sets me free — not only informs me. Amen.' },
      { day: 34, title: 'Be Still and Know', scripture: 'Jude 24', reflection: 'He cares for you — not as a slogan, as a posture. “Now to him who is able to keep you from stumbling and to present you blameless before the presence of his glory with great joy.” (Jude 24) Cast the anxiety. Clinging to it is not the same as being responsible. Love lets you put the weight down.', prayer: 'Lord, write Your vision on my heart so clearly that I can run with it — and rest when You say rest. Amen.' },
      { day: 35, title: 'Compassion That Runs', scripture: 'Genesis 1:27', reflection: 'Stability is not the absence of weather. It is the presence of a Pilot and a Shepherd. “God created man in his own image, in the image of God he created him.” (Genesis 1:27) Name your state if you need to. Then return to this truth. Scripture is ballast, not decoration.', prayer: 'Father, I draw from Your well. Let Your peace guard my heart and mind in Christ Jesus. I cast what I cannot carry. Amen.' },
      { day: 36, title: 'As the Father Sent Me', scripture: 'Exodus 3:14', reflection: 'Waiting is not wasted when you wait on the Lord. “I AM WHO I AM.” (Exodus 3:14) Strength renews in the waiting more often than in the forcing. Rest is part of the race, not the opposite of it.', prayer: 'Abba, I am Yours. Keep me from striving in my own strength. Teach me to abide. Grow Your fruit in me. Amen.' },
      { day: 37, title: 'If God Is For Us', scripture: 'Exodus 33:14', reflection: 'Remember the Cross when shame tries to narrate your whole story. “My presence will go with you, and I will give you rest.” (Exodus 33:14) The cost was real. The welcome is real. Healing is not self-improvement alone; it flows from a finished work and a living Lord.', prayer: 'Father, give me today’s bread, today’s mercy, and today’s courage. I release tomorrow into Your hands. Amen.' },
      { day: 38, title: 'New Creation', scripture: 'Joshua 1:9', reflection: 'Poverty of spirit is not a personality flaw; it is a doorway. “Be strong and courageous. Do not be frightened… for the Lord your God is with you wherever you go.” (Joshua 1:9) Blessed are those who know they need. The kingdom belongs to the needy who come, not to the self-sufficient who perform.', prayer: 'Jesus, I remember the Cross. I remember that it is finished. Help me walk as someone bought with a price and welcomed by name. Amen.' },
      { day: 39, title: 'Saved by Grace', scripture: 'Job 19:25', reflection: 'You are not the architect of your own rescue — and you are not abandoned on the worksite. “I know that my Redeemer lives.” (Job 19:25) What looks unfinished to you is not forgotten by Him. Prefer faithfulness today over a fantasy of arrival.', prayer: 'God of all comfort, use even this day for formation. I trust that You finish what You start. Hold me in the unfinished places. Amen.' },
      { day: 40, title: 'Put On Love', scripture: 'Psalm 23:3', reflection: 'Running into His name is not weakness; it is wisdom. “He restores my soul. He leads me in paths of righteousness for his name’s sake.” (Psalm 23:3) The strong tower still stands when your strategies fail. Choose refuge over rehearsal of fear.', prayer: 'Lord, I receive this word. Search me where I am guarded. Meet me where I am tired. Teach me to trust You in this actual day. Amen.' },
      { day: 41, title: 'Assurance of Hope', scripture: 'Psalm 34:18', reflection: 'The wells of salvation do not close when your mood drops. “The Lord is near to the brokenhearted and saves the crushed in spirit.” (Psalm 34:18) Draw even if your hands shake. Joy is not always the entrance fee; sometimes it is what follows obedience and presence. You are allowed to come thirsty.', prayer: 'Holy Spirit, renew my mind. Steady my Pilot. Lead me into truth that sets me free — not only informs me. Amen.' },
      { day: 42, title: 'Draw Near', scripture: 'Psalm 51:10', reflection: 'When the mind leaks and the page feels stained, bring the mess here. “Create in me a clean heart, O God, and renew a right spirit within me.” (Psalm 51:10) Externalize what is loud. Let the Word speak louder than the spiral. You are not alone in the room, and you are not only your weather.', prayer: 'Lord, write Your vision on my heart so clearly that I can run with it — and rest when You say rest. Amen.' },
      { day: 43, title: 'All Things New', scripture: 'Psalm 103:2-3', reflection: 'Depth does not always announce itself with emotion. Sometimes it is the steady choice to stay. “Bless the Lord, O my soul… who forgives all your iniquity, who heals all your diseases.” (Psalm 103:2-3) Hold this without rushing to apply it to everyone else. Let it search you. Regulation and formation meet when the Pilot is honest and the heart is open.', prayer: 'Father, I draw from Your well. Let Your peace guard my heart and mind in Christ Jesus. I cast what I cannot carry. Amen.' },
      { day: 44, title: 'Strong Tower', scripture: 'Psalm 139:14', reflection: 'Mercy is new this morning — not recycled leftover grace. “I praise you, for I am fearfully and wonderfully made.” (Psalm 139:14) Yesterday’s collapse does not cancel today’s supply. Step out from under a verdict that expired at sunrise.', prayer: 'Abba, I am Yours. Keep me from striving in my own strength. Teach me to abide. Grow Your fruit in me. Amen.' },
      { day: 45, title: 'Quiet Courage', scripture: 'Proverbs 4:23', reflection: 'Today’s word is not a demand to feel better; it is an invitation to come as you are. “Keep your heart with all vigilance, for from it flow the springs of life.” (Proverbs 4:23) Let this settle under the noise. Formation is rarely loud. It is often the quiet decision to trust again when your nervous system still remembers every storm.', prayer: 'Father, give me today’s bread, today’s mercy, and today’s courage. I release tomorrow into Your hands. Amen.' },
      { day: 46, title: 'Steadfast Love', scripture: 'Isaiah 26:3', reflection: 'He goes before you into this day. “You keep him in perfect peace whose mind is stayed on you, because he trusts in you.” (Isaiah 26:3) You do not need the full year mapped. You need the next faithful step with the One who already sees the end. Release the demand to control outcomes you were never assigned.', prayer: 'Jesus, I remember the Cross. I remember that it is finished. Help me walk as someone bought with a price and welcomed by name. Amen.' },
      { day: 47, title: 'Hope Again', scripture: 'Isaiah 43:2', reflection: 'Abide. Fruit follows connection, not pressure. “When you pass through the waters, I will be with you.” (Isaiah 43:2) If you are striving without remaining, you will burn out and call it faithfulness. Come back to the Vine.', prayer: 'God of all comfort, use even this day for formation. I trust that You finish what You start. Hold me in the unfinished places. Amen.' },
      { day: 48, title: 'The Finished Work', scripture: 'Isaiah 61:1', reflection: 'Seeds grow in the dark before they break the soil. “The Lord has anointed me… to bind up the brokenhearted.” (Isaiah 61:1) You are not behind because you cannot see fruit yet. Stop digging up the seed to inspect it. Water it with trust and ordinary obedience.', prayer: 'Lord, I receive this word. Search me where I am guarded. Meet me where I am tired. Teach me to trust You in this actual day. Amen.' },
      { day: 49, title: 'Grace for This Weakness', scripture: 'Lamentations 3:22-23', reflection: 'He cares for you — not as a slogan, as a posture. “The steadfast love of the Lord never ceases… they are new every morning; great is your faithfulness.” (Lamentations 3:22-23) Cast the anxiety. Clinging to it is not the same as being responsible. Love lets you put the weight down.', prayer: 'Holy Spirit, renew my mind. Steady my Pilot. Lead me into truth that sets me free — not only informs me. Amen.' },
      { day: 50, title: 'Fruit That Remains', scripture: 'Habakkuk 3:18', reflection: 'Stability is not the absence of weather. It is the presence of a Pilot and a Shepherd. “Yet I will rejoice in the Lord; I will take joy in the God of my salvation.” (Habakkuk 3:18) Name your state if you need to. Then return to this truth. Scripture is ballast, not decoration.', prayer: 'Lord, write Your vision on my heart so clearly that I can run with it — and rest when You say rest. Amen.' },
      { day: 51, title: 'Almost Home', scripture: 'Matthew 6:11', reflection: 'Waiting is not wasted when you wait on the Lord. “Give us this day our daily bread.” (Matthew 6:11) Strength renews in the waiting more often than in the forcing. Rest is part of the race, not the opposite of it.', prayer: 'Father, I draw from Your well. Let Your peace guard my heart and mind in Christ Jesus. I cast what I cannot carry. Amen.' },
      { day: 52, title: 'Taste and See', scripture: 'Matthew 28:20', reflection: 'Remember the Cross when shame tries to narrate your whole story. “I am with you always, to the end of the age.” (Matthew 28:20) The cost was real. The welcome is real. Healing is not self-improvement alone; it flows from a finished work and a living Lord.', prayer: 'Abba, I am Yours. Keep me from striving in my own strength. Teach me to abide. Grow Your fruit in me. Amen.' },
      { day: 53, title: 'He Will Provide', scripture: 'Luke 15:20', reflection: 'Poverty of spirit is not a personality flaw; it is a doorway. “His father saw him and felt compassion, and ran and embraced him and kissed him.” (Luke 15:20) Blessed are those who know they need. The kingdom belongs to the needy who come, not to the self-sufficient who perform.', prayer: 'Father, give me today’s bread, today’s mercy, and today’s courage. I release tomorrow into Your hands. Amen.' },
      { day: 54, title: 'Cast the Burden', scripture: 'John 4:14', reflection: 'You are not the architect of your own rescue — and you are not abandoned on the worksite. “Whoever drinks of the water that I will give him will never be thirsty again.” (John 4:14) What looks unfinished to you is not forgotten by Him. Prefer faithfulness today over a fantasy of arrival.', prayer: 'Jesus, I remember the Cross. I remember that it is finished. Help me walk as someone bought with a price and welcomed by name. Amen.' },
      { day: 55, title: 'Slow to Anger', scripture: 'John 14:6', reflection: 'Running into His name is not weakness; it is wisdom. “I am the way, and the truth, and the life.” (John 14:6) The strong tower still stands when your strategies fail. Choose refuge over rehearsal of fear.', prayer: 'God of all comfort, use even this day for formation. I trust that You finish what You start. Hold me in the unfinished places. Amen.' },
      { day: 56, title: 'My Redeemer Lives', scripture: 'John 16:33', reflection: 'The wells of salvation do not close when your mood drops. “In the world you will have tribulation. But take heart; I have overcome the world.” (John 16:33) Draw even if your hands shake. Joy is not always the entrance fee; sometimes it is what follows obedience and presence. You are allowed to come thirsty.', prayer: 'Lord, I receive this word. Search me where I am guarded. Meet me where I am tired. Teach me to trust You in this actual day. Amen.' },
      { day: 57, title: 'The Way, Truth, Life', scripture: 'Romans 5:8', reflection: 'When the mind leaks and the page feels stained, bring the mess here. “God shows his love for us in that while we were still sinners, Christ died for us.” (Romans 5:8) Externalize what is loud. Let the Word speak louder than the spiral. You are not alone in the room, and you are not only your weather.', prayer: 'Holy Spirit, renew my mind. Steady my Pilot. Lead me into truth that sets me free — not only informs me. Amen.' },
      { day: 58, title: 'While We Were Sinners', scripture: 'Romans 8:28', reflection: 'Depth does not always announce itself with emotion. Sometimes it is the steady choice to stay. “And we know that for those who love God all things work together for good.” (Romans 8:28) Hold this without rushing to apply it to everyone else. Let it search you. Regulation and formation meet when the Pilot is honest and the heart is open.', prayer: 'Lord, write Your vision on my heart so clearly that I can run with it — and rest when You say rest. Amen.' },
      { day: 59, title: 'Renewed Mind', scripture: 'Romans 12:2', reflection: 'Mercy is new this morning — not recycled leftover grace. “Do not be conformed to this world, but be transformed by the renewal of your mind.” (Romans 12:2) Yesterday’s collapse does not cancel today’s supply. Step out from under a verdict that expired at sunrise.', prayer: 'Father, I draw from Your well. Let Your peace guard my heart and mind in Christ Jesus. I cast what I cannot carry. Amen.' },
      { day: 60, title: 'Strong Tower', scripture: 'Proverbs 18:10', reflection: 'The name of the Lord is a strong tower. Running into it is wisdom. Safety is found in who He is, not in how tightly you grip control. When the bodyguard rises, choose the tower over the spiral.', prayer: 'I run into Your name today. Be my safety. Amen.' },
      { day: 61, title: 'Strong in the Lord', scripture: 'Galatians 5:22-23', reflection: 'He goes before you into this day. “The fruit of the Spirit is love, joy, peace, patience, kindness, goodness, faithfulness, gentleness, self-control.” (Galatians 5:22-23) You do not need the full year mapped. You need the next faithful step with the One who already sees the end. Release the demand to control outcomes you were never assigned.', prayer: 'Father, give me today’s bread, today’s mercy, and today’s courage. I release tomorrow into Your hands. Amen.' },
      { day: 62, title: 'He Is Faithful', scripture: 'Ephesians 3:20', reflection: 'Abide. Fruit follows connection, not pressure. “Now to him who is able to do far more abundantly than all that we ask or think.” (Ephesians 3:20) If you are striving without remaining, you will burn out and call it faithfulness. Come back to the Vine.', prayer: 'Jesus, I remember the Cross. I remember that it is finished. Help me walk as someone bought with a price and welcomed by name. Amen.' },
      { day: 63, title: 'Never Forsaken', scripture: 'Philippians 4:6-7', reflection: 'Seeds grow in the dark before they break the soil. “Do not be anxious about anything… and the peace of God… will guard your hearts and your minds in Christ Jesus.” (Philippians 4:6-7) You are not behind because you cannot see fruit yet. Stop digging up the seed to inspect it. Water it with trust and ordinary obedience.', prayer: 'God of all comfort, use even this day for formation. I trust that You finish what You start. Hold me in the unfinished places. Amen.' },
      { day: 64, title: 'Confess and Be Cleansed', scripture: 'Colossians 3:14', reflection: 'He cares for you — not as a slogan, as a posture. “And above all these put on love, which binds everything together in perfect harmony.” (Colossians 3:14) Cast the anxiety. Clinging to it is not the same as being responsible. Love lets you put the weight down.', prayer: 'Lord, I receive this word. Search me where I am guarded. Meet me where I am tired. Teach me to trust You in this actual day. Amen.' },
      { day: 65, title: 'Draw from the Well', scripture: '2 Timothy 1:7', reflection: 'Stability is not the absence of weather. It is the presence of a Pilot and a Shepherd. “For God gave us a spirit not of fear but of power and love and self-control.” (2 Timothy 1:7) Name your state if you need to. Then return to this truth. Scripture is ballast, not decoration.', prayer: 'Holy Spirit, renew my mind. Steady my Pilot. Lead me into truth that sets me free — not only informs me. Amen.' },
      { day: 66, title: 'Living Water', scripture: 'Hebrews 12:1-2', reflection: 'Waiting is not wasted when you wait on the Lord. “Let us run with endurance the race that is set before us, looking to Jesus.” (Hebrews 12:1-2) Strength renews in the waiting more often than in the forcing. Rest is part of the race, not the opposite of it.', prayer: 'Lord, write Your vision on my heart so clearly that I can run with it — and rest when You say rest. Amen.' },
      { day: 67, title: 'Restored Soul', scripture: 'James 1:2-4', reflection: 'Remember the Cross when shame tries to narrate your whole story. “Count it all joy, my brothers, when you meet trials of various kinds… that you may be perfect and complete.” (James 1:2-4) The cost was real. The welcome is real. Healing is not self-improvement alone; it flows from a finished work and a living Lord.', prayer: 'Father, I draw from Your well. Let Your peace guard my heart and mind in Christ Jesus. I cast what I cannot carry. Amen.' },
      { day: 68, title: 'A Willing Spirit', scripture: '1 John 1:9', reflection: 'Poverty of spirit is not a personality flaw; it is a doorway. “If we confess our sins, he is faithful and just to forgive us our sins and to cleanse us from all unrighteousness.” (1 John 1:9) Blessed are those who know they need. The kingdom belongs to the needy who come, not to the self-sufficient who perform.', prayer: 'Abba, I am Yours. Keep me from striving in my own strength. Teach me to abide. Grow Your fruit in me. Amen.' },
      { day: 69, title: 'Come Closer', scripture: 'Revelation 21:5', reflection: 'You are not the architect of your own rescue — and you are not abandoned on the worksite. “And he who was seated on the throne said, “Behold, I am making all things new.”” (Revelation 21:5) What looks unfinished to you is not forgotten by Him. Prefer faithfulness today over a fantasy of arrival.', prayer: 'Father, give me today’s bread, today’s mercy, and today’s courage. I release tomorrow into Your hands. Amen.' },
      { day: 70, title: 'No Condemnation', scripture: 'Genesis 16:13', reflection: 'Running into His name is not weakness; it is wisdom. “You are a God of seeing.” (Genesis 16:13) The strong tower still stands when your strategies fail. Choose refuge over rehearsal of fear.', prayer: 'Jesus, I remember the Cross. I remember that it is finished. Help me walk as someone bought with a price and welcomed by name. Amen.' },
      { day: 71, title: 'Run with Endurance', scripture: 'Exodus 14:14', reflection: 'The wells of salvation do not close when your mood drops. “The Lord will fight for you, and you have only to be silent.” (Exodus 14:14) Draw even if your hands shake. Joy is not always the entrance fee; sometimes it is what follows obedience and presence. You are allowed to come thirsty.', prayer: 'God of all comfort, use even this day for formation. I trust that You finish what You start. Hold me in the unfinished places. Amen.' },
      { day: 72, title: 'Love That Binds', scripture: 'Exodus 34:6', reflection: 'When the mind leaks and the page feels stained, bring the mess here. “The Lord, the Lord, a God merciful and gracious, slow to anger, and abounding in steadfast love and faithfulness.” (Exodus 34:6) Externalize what is loud. Let the Word speak louder than the spiral. You are not alone in the room, and you are not only your weather.', prayer: 'Lord, I receive this word. Search me where I am guarded. Meet me where I am tired. Teach me to trust You in this actual day. Amen.' },
      { day: 73, title: 'The Same Forever', scripture: '1 Samuel 16:7', reflection: 'Depth does not always announce itself with emotion. Sometimes it is the steady choice to stay. “Man looks on the outward appearance, but the Lord looks on the heart.” (1 Samuel 16:7) Hold this without rushing to apply it to everyone else. Let it search you. Regulation and formation meet when the Pilot is honest and the heart is open.', prayer: 'Holy Spirit, renew my mind. Steady my Pilot. Lead me into truth that sets me free — not only informs me. Amen.' },
      { day: 74, title: 'Call and Listen', scripture: 'Psalm 16:11', reflection: 'Mercy is new this morning — not recycled leftover grace. “In your presence there is fullness of joy; at your right hand are pleasures forevermore.” (Psalm 16:11) Yesterday’s collapse does not cancel today’s supply. Step out from under a verdict that expired at sunrise.', prayer: 'Lord, write Your vision on my heart so clearly that I can run with it — and rest when You say rest. Amen.' },
      { day: 75, title: 'Fear Not', scripture: 'Psalm 27:1', reflection: 'Today’s word is not a demand to feel better; it is an invitation to come as you are. “The Lord is my light and my salvation; whom shall I fear?” (Psalm 27:1) Let this settle under the noise. Formation is rarely loud. It is often the quiet decision to trust again when your nervous system still remembers every storm.', prayer: 'Father, I draw from Your well. Let Your peace guard my heart and mind in Christ Jesus. I cast what I cannot carry. Amen.' },
      { day: 76, title: 'Create in Me', scripture: 'Psalm 46:1', reflection: 'He goes before you into this day. “God is our refuge and strength, a very present help in trouble.” (Psalm 46:1) You do not need the full year mapped. You need the next faithful step with the One who already sees the end. Release the demand to control outcomes you were never assigned.', prayer: 'Abba, I am Yours. Keep me from striving in my own strength. Teach me to abide. Grow Your fruit in me. Amen.' },
      { day: 77, title: 'I AM', scripture: 'Psalm 55:22', reflection: 'Abide. Fruit follows connection, not pressure. “Cast your burden on the Lord, and he will sustain you.” (Psalm 55:22) If you are striving without remaining, you will burn out and call it faithfulness. Come back to the Vine.', prayer: 'Father, give me today’s bread, today’s mercy, and today’s courage. I release tomorrow into Your hands. Amen.' },
      { day: 78, title: 'His Way Is Perfect', scripture: 'Psalm 119:105', reflection: 'Seeds grow in the dark before they break the soil. “Your word is a lamp to my feet and a light to my path.” (Psalm 119:105) You are not behind because you cannot see fruit yet. Stop digging up the seed to inspect it. Water it with trust and ordinary obedience.', prayer: 'Jesus, I remember the Cross. I remember that it is finished. Help me walk as someone bought with a price and welcomed by name. Amen.' },
      { day: 79, title: 'It Is Finished', scripture: 'Psalm 147:3', reflection: 'He cares for you — not as a slogan, as a posture. “He heals the brokenhearted and binds up their wounds.” (Psalm 147:3) Cast the anxiety. Clinging to it is not the same as being responsible. Love lets you put the weight down.', prayer: 'God of all comfort, use even this day for formation. I trust that You finish what You start. Hold me in the unfinished places. Amen.' },
      { day: 80, title: 'All Things for Good', scripture: 'Proverbs 18:10', reflection: 'Stability is not the absence of weather. It is the presence of a Pilot and a Shepherd. “The name of the Lord is a strong tower; the righteous man runs into it and is safe.” (Proverbs 18:10) Name your state if you need to. Then return to this truth. Scripture is ballast, not decoration.', prayer: 'Lord, I receive this word. Search me where I am guarded. Meet me where I am tired. Teach me to trust You in this actual day. Amen.' },
      { day: 81, title: 'God of All Comfort', scripture: 'Isaiah 40:31', reflection: 'Waiting is not wasted when you wait on the Lord. “They who wait for the Lord shall renew their strength; they shall mount up with wings like eagles.” (Isaiah 40:31) Strength renews in the waiting more often than in the forcing. Rest is part of the race, not the opposite of it.', prayer: 'Holy Spirit, renew my mind. Steady my Pilot. Lead me into truth that sets me free — not only informs me. Amen.' },
      { day: 82, title: 'Due Season', scripture: 'Isaiah 53:5', reflection: 'Remember the Cross when shame tries to narrate your whole story. “He was pierced for our transgressions; he was crushed for our iniquities… and with his wounds we are healed.” (Isaiah 53:5) The cost was real. The welcome is real. Healing is not self-improvement alone; it flows from a finished work and a living Lord.', prayer: 'Lord, write Your vision on my heart so clearly that I can run with it — and rest when You say rest. Amen.' },
      { day: 83, title: 'Set Your Mind Above', scripture: 'Jeremiah 29:11', reflection: 'Poverty of spirit is not a personality flaw; it is a doorway. “For I know the plans I have for you… plans for welfare and not for evil, to give you a future and a hope.” (Jeremiah 29:11) Blessed are those who know they need. The kingdom belongs to the needy who come, not to the self-sufficient who perform.', prayer: 'Father, I draw from Your well. Let Your peace guard my heart and mind in Christ Jesus. I cast what I cannot carry. Amen.' },
      { day: 84, title: 'Throne of Grace', scripture: 'Ezekiel 36:26', reflection: 'You are not the architect of your own rescue — and you are not abandoned on the worksite. “I will give you a new heart, and a new spirit I will put within you.” (Ezekiel 36:26) What looks unfinished to you is not forgotten by Him. Prefer faithfulness today over a fantasy of arrival.', prayer: 'Abba, I am Yours. Keep me from striving in my own strength. Teach me to abide. Grow Your fruit in me. Amen.' },
      { day: 85, title: 'Count It Joy', scripture: 'Zephaniah 3:17', reflection: 'Running into His name is not weakness; it is wisdom. “The Lord your God is in your midst, a mighty one who will save; he will rejoice over you with gladness.” (Zephaniah 3:17) The strong tower still stands when your strategies fail. Choose refuge over rehearsal of fear.', prayer: 'Father, give me today’s bread, today’s mercy, and today’s courage. I release tomorrow into Your hands. Amen.' },
      { day: 86, title: 'Kept from Stumbling', scripture: 'Matthew 6:33', reflection: 'The wells of salvation do not close when your mood drops. “Seek first the kingdom of God and his righteousness, and all these things will be added to you.” (Matthew 6:33) Draw even if your hands shake. Joy is not always the entrance fee; sometimes it is what follows obedience and presence. You are allowed to come thirsty.', prayer: 'Jesus, I remember the Cross. I remember that it is finished. Help me walk as someone bought with a price and welcomed by name. Amen.' },
      { day: 87, title: 'Stillness Before Him', scripture: 'Mark 4:39', reflection: 'When the mind leaks and the page feels stained, bring the mess here. “Peace! Be still!” (Mark 4:39) Externalize what is loud. Let the Word speak louder than the spiral. You are not alone in the room, and you are not only your weather.', prayer: 'God of all comfort, use even this day for formation. I trust that You finish what You start. Hold me in the unfinished places. Amen.' },
      { day: 88, title: 'Hidden Strength', scripture: 'John 1:4-5', reflection: 'Depth does not always announce itself with emotion. Sometimes it is the steady choice to stay. “In him was life, and the life was the light of men. The light shines in the darkness.” (John 1:4-5) Hold this without rushing to apply it to everyone else. Let it search you. Regulation and formation meet when the Pilot is honest and the heart is open.', prayer: 'Lord, I receive this word. Search me where I am guarded. Meet me where I am tired. Teach me to trust You in this actual day. Amen.' },
      { day: 89, title: 'The God Who Is Near', scripture: 'John 8:12', reflection: 'Mercy is new this morning — not recycled leftover grace. “I am the light of the world. Whoever follows me will not walk in darkness.” (John 8:12) Yesterday’s collapse does not cancel today’s supply. Step out from under a verdict that expired at sunrise.', prayer: 'Holy Spirit, renew my mind. Steady my Pilot. Lead me into truth that sets me free — not only informs me. Amen.' },
      { day: 90, title: 'He Who Began', scripture: 'Philippians 1:6', reflection: 'He who began a good work in you will bring it to completion. Ninety days of attention are a witness: the work is His, and He does not quit mid-sentence. Your faithfulness is real; His completion is sure.', prayer: 'You will finish what You started in me. I stay in the work. Amen.' },
      { day: 91, title: 'Rise, Take Heart', scripture: 'John 19:30', reflection: 'He goes before you into this day. “It is finished.” (John 19:30) You do not need the full year mapped. You need the next faithful step with the One who already sees the end. Release the demand to control outcomes you were never assigned.', prayer: 'Father, I draw from Your well. Let Your peace guard my heart and mind in Christ Jesus. I cast what I cannot carry. Amen.' },
      { day: 92, title: 'More Than Enough', scripture: 'Romans 8:1', reflection: 'Abide. Fruit follows connection, not pressure. “There is therefore now no condemnation for those who are in Christ Jesus.” (Romans 8:1) If you are striving without remaining, you will burn out and call it faithfulness. Come back to the Vine.', prayer: 'Abba, I am Yours. Keep me from striving in my own strength. Teach me to abide. Grow Your fruit in me. Amen.' },
      { day: 93, title: 'The Helper Within', scripture: 'Romans 8:31', reflection: 'Seeds grow in the dark before they break the soil. “If God is for us, who can be against us?” (Romans 8:31) You are not behind because you cannot see fruit yet. Stop digging up the seed to inspect it. Water it with trust and ordinary obedience.', prayer: 'Father, give me today’s bread, today’s mercy, and today’s courage. I release tomorrow into Your hands. Amen.' },
      { day: 94, title: 'Do Not Grow Weary', scripture: '1 Corinthians 13:13', reflection: 'He cares for you — not as a slogan, as a posture. “So now faith, hope, and love abide… but the greatest of these is love.” (1 Corinthians 13:13) Cast the anxiety. Clinging to it is not the same as being responsible. Love lets you put the weight down.', prayer: 'Jesus, I remember the Cross. I remember that it is finished. Help me walk as someone bought with a price and welcomed by name. Amen.' },
      { day: 95, title: 'Out of the Depths', scripture: '2 Corinthians 12:9', reflection: 'Stability is not the absence of weather. It is the presence of a Pilot and a Shepherd. “My grace is sufficient for you, for my power is made perfect in weakness.” (2 Corinthians 12:9) Name your state if you need to. Then return to this truth. Scripture is ballast, not decoration.', prayer: 'God of all comfort, use even this day for formation. I trust that You finish what You start. Hold me in the unfinished places. Amen.' },
      { day: 96, title: 'The God Who Sees', scripture: 'Galatians 6:9', reflection: 'Waiting is not wasted when you wait on the Lord. “And let us not grow weary of doing good, for in due season we will reap, if we do not give up.” (Galatians 6:9) Strength renews in the waiting more often than in the forcing. Rest is part of the race, not the opposite of it.', prayer: 'Lord, I receive this word. Search me where I am guarded. Meet me where I am tired. Teach me to trust You in this actual day. Amen.' },
      { day: 97, title: 'Perfect Peace', scripture: 'Ephesians 6:10', reflection: 'Remember the Cross when shame tries to narrate your whole story. “Finally, be strong in the Lord and in the strength of his might.” (Ephesians 6:10) The cost was real. The welcome is real. Healing is not self-improvement alone; it flows from a finished work and a living Lord.', prayer: 'Holy Spirit, renew my mind. Steady my Pilot. Lead me into truth that sets me free — not only informs me. Amen.' },
      { day: 98, title: 'Lamp to My Feet', scripture: 'Philippians 4:13', reflection: 'Poverty of spirit is not a personality flaw; it is a doorway. “I can do all things through him who strengthens me.” (Philippians 4:13) Blessed are those who know they need. The kingdom belongs to the needy who come, not to the self-sufficient who perform.', prayer: 'Lord, write Your vision on my heart so clearly that I can run with it — and rest when You say rest. Amen.' },
      { day: 99, title: 'The Joy of the Lord', scripture: '1 Thessalonians 5:16-18', reflection: 'You are not the architect of your own rescue — and you are not abandoned on the worksite. “Rejoice always, pray without ceasing, give thanks in all circumstances.” (1 Thessalonians 5:16-18) What looks unfinished to you is not forgotten by Him. Prefer faithfulness today over a fantasy of arrival.', prayer: 'Father, I draw from Your well. Let Your peace guard my heart and mind in Christ Jesus. I cast what I cannot carry. Amen.' },
      { day: 100, title: 'Abundant Life', scripture: 'Hebrews 4:16', reflection: 'Running into His name is not weakness; it is wisdom. “Let us then with confidence draw near to the throne of grace, that we may receive mercy and find grace to help in time of need.” (Hebrews 4:16) The strong tower still stands when your strategies fail. Choose refuge over rehearsal of fear.', prayer: 'Abba, I am Yours. Keep me from striving in my own strength. Teach me to abide. Grow Your fruit in me. Amen.' },
      { day: 101, title: 'Power from on High', scripture: 'Hebrews 13:5', reflection: 'The wells of salvation do not close when your mood drops. “I will never leave you nor forsake you.” (Hebrews 13:5) Draw even if your hands shake. Joy is not always the entrance fee; sometimes it is what follows obedience and presence. You are allowed to come thirsty.', prayer: 'Father, give me today’s bread, today’s mercy, and today’s courage. I release tomorrow into Your hands. Amen.' },
      { day: 102, title: 'Nothing Can Separate', scripture: 'James 4:8', reflection: 'When the mind leaks and the page feels stained, bring the mess here. “Draw near to God, and he will draw near to you.” (James 4:8) Externalize what is loud. Let the Word speak louder than the spiral. You are not alone in the room, and you are not only your weather.', prayer: 'Jesus, I remember the Cross. I remember that it is finished. Help me walk as someone bought with a price and welcomed by name. Amen.' },
      { day: 103, title: 'Power in Weakness', scripture: '1 John 4:18', reflection: 'Depth does not always announce itself with emotion. Sometimes it is the steady choice to stay. “There is no fear in love, but perfect love casts out fear.” (1 John 4:18) Hold this without rushing to apply it to everyone else. Let it search you. Regulation and formation meet when the Pilot is honest and the heart is open.', prayer: 'God of all comfort, use even this day for formation. I trust that You finish what You start. Hold me in the unfinished places. Amen.' },
      { day: 104, title: 'Far More Abundantly', scripture: 'Genesis 1:1', reflection: 'Mercy is new this morning — not recycled leftover grace. “In the beginning, God created the heavens and the earth.” (Genesis 1:1) Yesterday’s collapse does not cancel today’s supply. Step out from under a verdict that expired at sunrise.', prayer: 'Lord, I receive this word. Search me where I am guarded. Meet me where I am tired. Teach me to trust You in this actual day. Amen.' },
      { day: 105, title: 'Rejoice Always', scripture: 'Genesis 22:14', reflection: 'Today’s word is not a demand to feel better; it is an invitation to come as you are. “The Lord will provide.” (Genesis 22:14) Let this settle under the noise. Formation is rarely loud. It is often the quiet decision to trust again when your nervous system still remembers every storm.', prayer: 'Holy Spirit, renew my mind. Steady my Pilot. Lead me into truth that sets me free — not only informs me. Amen.' },
      { day: 106, title: 'Looking to Jesus', scripture: 'Exodus 15:26', reflection: 'He goes before you into this day. “I am the Lord, your healer.” (Exodus 15:26) You do not need the full year mapped. You need the next faithful step with the One who already sees the end. Release the demand to control outcomes you were never assigned.', prayer: 'Lord, write Your vision on my heart so clearly that I can run with it — and rest when You say rest. Amen.' },
      { day: 107, title: 'He Cares for You', scripture: 'Deuteronomy 31:8', reflection: 'Abide. Fruit follows connection, not pressure. “It is the Lord who goes before you. He will be with you; he will not leave you or forsake you.” (Deuteronomy 31:8) If you are striving without remaining, you will burn out and call it faithfulness. Come back to the Vine.', prayer: 'Father, I draw from Your well. Let Your peace guard my heart and mind in Christ Jesus. I cast what I cannot carry. Amen.' },
      { day: 108, title: 'Wells of Salvation', scripture: 'Nehemiah 8:10', reflection: 'Seeds grow in the dark before they break the soil. “The joy of the Lord is your strength.” (Nehemiah 8:10) You are not behind because you cannot see fruit yet. Stop digging up the seed to inspect it. Water it with trust and ordinary obedience.', prayer: 'Abba, I am Yours. Keep me from striving in my own strength. Teach me to abide. Grow Your fruit in me. Amen.' },
      { day: 109, title: 'Strong Tower', scripture: 'Psalm 23:1', reflection: 'He cares for you — not as a slogan, as a posture. “The Lord is my shepherd; I shall not want.” (Psalm 23:1) Cast the anxiety. Clinging to it is not the same as being responsible. Love lets you put the weight down.', prayer: 'Father, give me today’s bread, today’s mercy, and today’s courage. I release tomorrow into Your hands. Amen.' },
      { day: 110, title: 'Refuge in Trouble', scripture: 'Psalm 34:8', reflection: 'Stability is not the absence of weather. It is the presence of a Pilot and a Shepherd. “Oh, taste and see that the Lord is good! Blessed is the man who takes refuge in him!” (Psalm 34:8) Name your state if you need to. Then return to this truth. Scripture is ballast, not decoration.', prayer: 'Jesus, I remember the Cross. I remember that it is finished. Help me walk as someone bought with a price and welcomed by name. Amen.' },
      { day: 111, title: 'Daily Bread', scripture: 'Psalm 46:10', reflection: 'Waiting is not wasted when you wait on the Lord. “Be still, and know that I am God.” (Psalm 46:10) Strength renews in the waiting more often than in the forcing. Rest is part of the race, not the opposite of it.', prayer: 'God of all comfort, use even this day for formation. I trust that You finish what You start. Hold me in the unfinished places. Amen.' },
      { day: 112, title: 'Abide in the Vine', scripture: 'Psalm 56:3', reflection: 'Remember the Cross when shame tries to narrate your whole story. “When I am afraid, I put my trust in you.” (Psalm 56:3) The cost was real. The welcome is real. Healing is not self-improvement alone; it flows from a finished work and a living Lord.', prayer: 'Lord, I receive this word. Search me where I am guarded. Meet me where I am tired. Teach me to trust You in this actual day. Amen.' },
      { day: 113, title: 'Peace That Guards', scripture: 'Psalm 130:1', reflection: 'Poverty of spirit is not a personality flaw; it is a doorway. “Out of the depths I cry to you, O Lord!” (Psalm 130:1) Blessed are those who know they need. The kingdom belongs to the needy who come, not to the self-sufficient who perform.', prayer: 'Holy Spirit, renew my mind. Steady my Pilot. Lead me into truth that sets me free — not only informs me. Amen.' },
      { day: 114, title: 'Faithful God', scripture: 'Proverbs 3:5-6', reflection: 'You are not the architect of your own rescue — and you are not abandoned on the worksite. “Trust in the Lord with all your heart, and do not lean on your own understanding.” (Proverbs 3:5-6) What looks unfinished to you is not forgotten by Him. Prefer faithfulness today over a fantasy of arrival.', prayer: 'Lord, write Your vision on my heart so clearly that I can run with it — and rest when You say rest. Amen.' },
      { day: 115, title: 'Armor of God', scripture: 'Isaiah 12:3', reflection: 'Running into His name is not weakness; it is wisdom. “With joy you will draw water from the wells of salvation.” (Isaiah 12:3) The strong tower still stands when your strategies fail. Choose refuge over rehearsal of fear.', prayer: 'Father, I draw from Your well. Let Your peace guard my heart and mind in Christ Jesus. I cast what I cannot carry. Amen.' },
      { day: 116, title: 'Guard Your Heart', scripture: 'Isaiah 41:10', reflection: 'The wells of salvation do not close when your mood drops. “Fear not, for I am with you; be not dismayed, for I am your God.” (Isaiah 41:10) Draw even if your hands shake. Joy is not always the entrance fee; sometimes it is what follows obedience and presence. You are allowed to come thirsty.', prayer: 'Abba, I am Yours. Keep me from striving in my own strength. Teach me to abide. Grow Your fruit in me. Amen.' },
      { day: 117, title: 'Write the Vision', scripture: 'Isaiah 55:1', reflection: 'When the mind leaks and the page feels stained, bring the mess here. “Come, everyone who thirsts, come to the waters.” (Isaiah 55:1) Externalize what is loud. Let the Word speak louder than the spiral. You are not alone in the room, and you are not only your weather.', prayer: 'Father, give me today’s bread, today’s mercy, and today’s courage. I release tomorrow into Your hands. Amen.' },
      { day: 118, title: 'Through the Waters', scripture: 'Jeremiah 33:3', reflection: 'Depth does not always announce itself with emotion. Sometimes it is the steady choice to stay. “Call to me and I will answer you, and will tell you great and hidden things that you have not known.” (Jeremiah 33:3) Hold this without rushing to apply it to everyone else. Let it search you. Regulation and formation meet when the Pilot is honest and the heart is open.', prayer: 'Jesus, I remember the Cross. I remember that it is finished. Help me walk as someone bought with a price and welcomed by name. Amen.' },
      { day: 119, title: 'Search Me, O God', scripture: 'Habakkuk 2:2', reflection: 'Mercy is new this morning — not recycled leftover grace. “Write the vision; make it plain on tablets, so he may run who reads it.” (Habakkuk 2:2) Yesterday’s collapse does not cancel today’s supply. Step out from under a verdict that expired at sunrise.', prayer: 'God of all comfort, use even this day for formation. I trust that You finish what You start. Hold me in the unfinished places. Amen.' },
      { day: 120, title: 'Refuge and Strength', scripture: 'Psalm 46:1', reflection: 'God is our refuge and strength, a very present help in trouble. Present — not delayed. Help — not mere advice. Trouble does not cancel His nearness; it often reveals it.', prayer: 'Be my refuge and strength right now. I come in. Amen.' },
      { day: 121, title: 'Heart Over Appearance', scripture: 'Matthew 11:28', reflection: 'He goes before you into this day. “Come to me, all who labor and are heavy laden, and I will give you rest.” (Matthew 11:28) You do not need the full year mapped. You need the next faithful step with the One who already sees the end. Release the demand to control outcomes you were never assigned.', prayer: 'Holy Spirit, renew my mind. Steady my Pilot. Lead me into truth that sets me free — not only informs me. Amen.' },
      { day: 122, title: 'Take Heart', scripture: 'Luke 4:18', reflection: 'Abide. Fruit follows connection, not pressure. “He has sent me to proclaim liberty to the captives… to set at liberty those who are oppressed.” (Luke 4:18) If you are striving without remaining, you will burn out and call it faithfulness. Come back to the Vine.', prayer: 'Lord, write Your vision on my heart so clearly that I can run with it — and rest when You say rest. Amen.' },
      { day: 123, title: 'Spirit of Adoption', scripture: 'John 3:16', reflection: 'Seeds grow in the dark before they break the soil. “For God so loved the world, that he gave his only Son.” (John 3:16) You are not behind because you cannot see fruit yet. Stop digging up the seed to inspect it. Water it with trust and ordinary obedience.', prayer: 'Father, I draw from Your well. Let Your peace guard my heart and mind in Christ Jesus. I cast what I cannot carry. Amen.' },
      { day: 124, title: 'The Greatest Is Love', scripture: 'John 10:10', reflection: 'He cares for you — not as a slogan, as a posture. “I came that they may have life and have it abundantly.” (John 10:10) Cast the anxiety. Clinging to it is not the same as being responsible. Love lets you put the weight down.', prayer: 'Abba, I am Yours. Keep me from striving in my own strength. Teach me to abide. Grow Your fruit in me. Amen.' },
      { day: 125, title: 'Walk by the Spirit', scripture: 'John 15:5', reflection: 'Stability is not the absence of weather. It is the presence of a Pilot and a Shepherd. “I am the vine; you are the branches. Whoever abides in me and I in him, he it is that bears much fruit.” (John 15:5) Name your state if you need to. Then return to this truth. Scripture is ballast, not decoration.', prayer: 'Father, give me today’s bread, today’s mercy, and today’s courage. I release tomorrow into Your hands. Amen.' },
      { day: 126, title: 'He Who Began', scripture: 'Acts 1:8', reflection: 'Waiting is not wasted when you wait on the Lord. “You will receive power when the Holy Spirit has come upon you.” (Acts 1:8) Strength renews in the waiting more often than in the forcing. Rest is part of the race, not the opposite of it.', prayer: 'Jesus, I remember the Cross. I remember that it is finished. Help me walk as someone bought with a price and welcomed by name. Amen.' },
      { day: 127, title: 'Not a Spirit of Fear', scripture: 'Romans 8:15', reflection: 'Remember the Cross when shame tries to narrate your whole story. “You have received the Spirit of adoption as sons, by whom we cry, “Abba! Father!”” (Romans 8:15) The cost was real. The welcome is real. Healing is not self-improvement alone; it flows from a finished work and a living Lord.', prayer: 'God of all comfort, use even this day for formation. I trust that You finish what You start. Hold me in the unfinished places. Amen.' },
      { day: 128, title: 'Unchanging Christ', scripture: 'Romans 8:38-39', reflection: 'Poverty of spirit is not a personality flaw; it is a doorway. “Neither death nor life… nor anything else in all creation, will be able to separate us from the love of God in Christ Jesus.” (Romans 8:38-39) Blessed are those who know they need. The kingdom belongs to the needy who come, not to the self-sufficient who perform.', prayer: 'Lord, I receive this word. Search me where I am guarded. Meet me where I am tired. Teach me to trust You in this actual day. Amen.' },
      { day: 129, title: 'Perfect Love', scripture: '2 Corinthians 1:3-4', reflection: 'You are not the architect of your own rescue — and you are not abandoned on the worksite. “The Father of mercies and God of all comfort, who comforts us in all our affliction.” (2 Corinthians 1:3-4) What looks unfinished to you is not forgotten by Him. Prefer faithfulness today over a fantasy of arrival.', prayer: 'Holy Spirit, renew my mind. Steady my Pilot. Lead me into truth that sets me free — not only informs me. Amen.' },
      { day: 130, title: 'Morning Mercy', scripture: 'Galatians 2:20', reflection: 'Running into His name is not weakness; it is wisdom. “I have been crucified with Christ. It is no longer I who live, but Christ who lives in me.” (Galatians 2:20) The strong tower still stands when your strategies fail. Choose refuge over rehearsal of fear.', prayer: 'Lord, write Your vision on my heart so clearly that I can run with it — and rest when You say rest. Amen.' },
      { day: 131, title: 'Living Water', scripture: 'Ephesians 2:8-9', reflection: 'The wells of salvation do not close when your mood drops. “For by grace you have been saved through faith. And this is not your own doing; it is the gift of God.” (Ephesians 2:8-9) Draw even if your hands shake. Joy is not always the entrance fee; sometimes it is what follows obedience and presence. You are allowed to come thirsty.', prayer: 'Father, I draw from Your well. Let Your peace guard my heart and mind in Christ Jesus. I cast what I cannot carry. Amen.' },
      { day: 132, title: 'Light in Darkness', scripture: 'Philippians 1:6', reflection: 'When the mind leaks and the page feels stained, bring the mess here. “He who began a good work in you will bring it to completion at the day of Jesus Christ.” (Philippians 1:6) Externalize what is loud. Let the Word speak louder than the spiral. You are not alone in the room, and you are not only your weather.', prayer: 'Abba, I am Yours. Keep me from striving in my own strength. Teach me to abide. Grow Your fruit in me. Amen.' },
      { day: 133, title: 'Clean Hands, Clear Path', scripture: 'Colossians 3:2', reflection: 'Depth does not always announce itself with emotion. Sometimes it is the steady choice to stay. “Set your minds on things that are above, not on things that are on earth.” (Colossians 3:2) Hold this without rushing to apply it to everyone else. Let it search you. Regulation and formation meet when the Pilot is honest and the heart is open.', prayer: 'Father, give me today’s bread, today’s mercy, and today’s courage. I release tomorrow into Your hands. Amen.' },
      { day: 134, title: 'Lay the Burden Down', scripture: '1 Thessalonians 5:24', reflection: 'Mercy is new this morning — not recycled leftover grace. “He who calls you is faithful; he will surely do it.” (1 Thessalonians 5:24) Yesterday’s collapse does not cancel today’s supply. Step out from under a verdict that expired at sunrise.', prayer: 'Jesus, I remember the Cross. I remember that it is finished. Help me walk as someone bought with a price and welcomed by name. Amen.' },
      { day: 135, title: 'Abba, Father', scripture: 'Hebrews 11:1', reflection: 'Today’s word is not a demand to feel better; it is an invitation to come as you are. “Now faith is the assurance of things hoped for, the conviction of things not seen.” (Hebrews 11:1) Let this settle under the noise. Formation is rarely loud. It is often the quiet decision to trust again when your nervous system still remembers every storm.', prayer: 'God of all comfort, use even this day for formation. I trust that You finish what You start. Hold me in the unfinished places. Amen.' },
      { day: 136, title: 'Eyes on Jesus', scripture: 'Hebrews 13:8', reflection: 'He goes before you into this day. “Jesus Christ is the same yesterday and today and forever.” (Hebrews 13:8) You do not need the full year mapped. You need the next faithful step with the One who already sees the end. Release the demand to control outcomes you were never assigned.', prayer: 'Lord, I receive this word. Search me where I am guarded. Meet me where I am tired. Teach me to trust You in this actual day. Amen.' },
      { day: 137, title: 'A Quiet Life', scripture: '1 Peter 5:7', reflection: 'Abide. Fruit follows connection, not pressure. “Casting all your anxieties on him, because he cares for you.” (1 Peter 5:7) If you are striving without remaining, you will burn out and call it faithfulness. Come back to the Vine.', prayer: 'Holy Spirit, renew my mind. Steady my Pilot. Lead me into truth that sets me free — not only informs me. Amen.' },
      { day: 138, title: 'Joy Comes in the Morning', scripture: 'Jude 24', reflection: 'Seeds grow in the dark before they break the soil. “Now to him who is able to keep you from stumbling and to present you blameless before the presence of his glory with great joy.” (Jude 24) You are not behind because you cannot see fruit yet. Stop digging up the seed to inspect it. Water it with trust and ordinary obedience.', prayer: 'Lord, write Your vision on my heart so clearly that I can run with it — and rest when You say rest. Amen.' },
      { day: 139, title: 'Presence Over Performance', scripture: 'Genesis 1:27', reflection: 'He cares for you — not as a slogan, as a posture. “God created man in his own image, in the image of God he created him.” (Genesis 1:27) Cast the anxiety. Clinging to it is not the same as being responsible. Love lets you put the weight down.', prayer: 'Father, I draw from Your well. Let Your peace guard my heart and mind in Christ Jesus. I cast what I cannot carry. Amen.' },
      { day: 140, title: 'Renewed Strength', scripture: 'Exodus 3:14', reflection: 'Stability is not the absence of weather. It is the presence of a Pilot and a Shepherd. “I AM WHO I AM.” (Exodus 3:14) Name your state if you need to. Then return to this truth. Scripture is ballast, not decoration.', prayer: 'Abba, I am Yours. Keep me from striving in my own strength. Teach me to abide. Grow Your fruit in me. Amen.' },
      { day: 141, title: 'Bless the Lord, O My Soul', scripture: 'Exodus 33:14', reflection: 'Waiting is not wasted when you wait on the Lord. “My presence will go with you, and I will give you rest.” (Exodus 33:14) Strength renews in the waiting more often than in the forcing. Rest is part of the race, not the opposite of it.', prayer: 'Father, give me today’s bread, today’s mercy, and today’s courage. I release tomorrow into Your hands. Amen.' },
      { day: 142, title: 'I AM', scripture: 'Joshua 1:9', reflection: 'Remember the Cross when shame tries to narrate your whole story. “Be strong and courageous. Do not be frightened… for the Lord your God is with you wherever you go.” (Joshua 1:9) The cost was real. The welcome is real. Healing is not self-improvement alone; it flows from a finished work and a living Lord.', prayer: 'Jesus, I remember the Cross. I remember that it is finished. Help me walk as someone bought with a price and welcomed by name. Amen.' },
      { day: 143, title: 'Compassion That Runs', scripture: 'Job 19:25', reflection: 'Poverty of spirit is not a personality flaw; it is a doorway. “I know that my Redeemer lives.” (Job 19:25) Blessed are those who know they need. The kingdom belongs to the needy who come, not to the self-sufficient who perform.', prayer: 'God of all comfort, use even this day for formation. I trust that You finish what You start. Hold me in the unfinished places. Amen.' },
      { day: 144, title: 'As the Father Sent Me', scripture: 'Psalm 23:3', reflection: 'You are not the architect of your own rescue — and you are not abandoned on the worksite. “He restores my soul. He leads me in paths of righteousness for his name’s sake.” (Psalm 23:3) What looks unfinished to you is not forgotten by Him. Prefer faithfulness today over a fantasy of arrival.', prayer: 'Lord, I receive this word. Search me where I am guarded. Meet me where I am tired. Teach me to trust You in this actual day. Amen.' },
      { day: 145, title: 'If God Is For Us', scripture: 'Psalm 34:18', reflection: 'Running into His name is not weakness; it is wisdom. “The Lord is near to the brokenhearted and saves the crushed in spirit.” (Psalm 34:18) The strong tower still stands when your strategies fail. Choose refuge over rehearsal of fear.', prayer: 'Holy Spirit, renew my mind. Steady my Pilot. Lead me into truth that sets me free — not only informs me. Amen.' },
      { day: 146, title: 'New Creation', scripture: 'Psalm 51:10', reflection: 'The wells of salvation do not close when your mood drops. “Create in me a clean heart, O God, and renew a right spirit within me.” (Psalm 51:10) Draw even if your hands shake. Joy is not always the entrance fee; sometimes it is what follows obedience and presence. You are allowed to come thirsty.', prayer: 'Lord, write Your vision on my heart so clearly that I can run with it — and rest when You say rest. Amen.' },
      { day: 147, title: 'Saved by Grace', scripture: 'Psalm 103:2-3', reflection: 'When the mind leaks and the page feels stained, bring the mess here. “Bless the Lord, O my soul… who forgives all your iniquity, who heals all your diseases.” (Psalm 103:2-3) Externalize what is loud. Let the Word speak louder than the spiral. You are not alone in the room, and you are not only your weather.', prayer: 'Father, I draw from Your well. Let Your peace guard my heart and mind in Christ Jesus. I cast what I cannot carry. Amen.' },
      { day: 148, title: 'Put On Love', scripture: 'Psalm 139:14', reflection: 'Depth does not always announce itself with emotion. Sometimes it is the steady choice to stay. “I praise you, for I am fearfully and wonderfully made.” (Psalm 139:14) Hold this without rushing to apply it to everyone else. Let it search you. Regulation and formation meet when the Pilot is honest and the heart is open.', prayer: 'Abba, I am Yours. Keep me from striving in my own strength. Teach me to abide. Grow Your fruit in me. Amen.' },
      { day: 149, title: 'Assurance of Hope', scripture: 'Proverbs 4:23', reflection: 'Mercy is new this morning — not recycled leftover grace. “Keep your heart with all vigilance, for from it flow the springs of life.” (Proverbs 4:23) Yesterday’s collapse does not cancel today’s supply. Step out from under a verdict that expired at sunrise.', prayer: 'Father, give me today’s bread, today’s mercy, and today’s courage. I release tomorrow into Your hands. Amen.' },
      { day: 150, title: 'Draw Near', scripture: 'Isaiah 26:3', reflection: 'Today’s word is not a demand to feel better; it is an invitation to come as you are. “You keep him in perfect peace whose mind is stayed on you, because he trusts in you.” (Isaiah 26:3) Let this settle under the noise. Formation is rarely loud. It is often the quiet decision to trust again when your nervous system still remembers every storm.', prayer: 'Jesus, I remember the Cross. I remember that it is finished. Help me walk as someone bought with a price and welcomed by name. Amen.' },
      { day: 151, title: 'All Things New', scripture: 'Isaiah 43:2', reflection: 'He goes before you into this day. “When you pass through the waters, I will be with you.” (Isaiah 43:2) You do not need the full year mapped. You need the next faithful step with the One who already sees the end. Release the demand to control outcomes you were never assigned.', prayer: 'God of all comfort, use even this day for formation. I trust that You finish what You start. Hold me in the unfinished places. Amen.' },
      { day: 152, title: 'The Shepherd’s Care', scripture: 'Isaiah 61:1', reflection: 'Abide. Fruit follows connection, not pressure. “The Lord has anointed me… to bind up the brokenhearted.” (Isaiah 61:1) If you are striving without remaining, you will burn out and call it faithfulness. Come back to the Vine.', prayer: 'Lord, I receive this word. Search me where I am guarded. Meet me where I am tired. Teach me to trust You in this actual day. Amen.' },
      { day: 153, title: 'Hidden Strength', scripture: 'Lamentations 3:22-23', reflection: 'Seeds grow in the dark before they break the soil. “The steadfast love of the Lord never ceases… they are new every morning; great is your faithfulness.” (Lamentations 3:22-23) You are not behind because you cannot see fruit yet. Stop digging up the seed to inspect it. Water it with trust and ordinary obedience.', prayer: 'Holy Spirit, renew my mind. Steady my Pilot. Lead me into truth that sets me free — not only informs me. Amen.' },
      { day: 154, title: 'Steadfast Love', scripture: 'Habakkuk 3:18', reflection: 'He cares for you — not as a slogan, as a posture. “Yet I will rejoice in the Lord; I will take joy in the God of my salvation.” (Habakkuk 3:18) Cast the anxiety. Clinging to it is not the same as being responsible. Love lets you put the weight down.', prayer: 'Lord, write Your vision on my heart so clearly that I can run with it — and rest when You say rest. Amen.' },
      { day: 155, title: 'Hope Again', scripture: 'Matthew 6:11', reflection: 'Stability is not the absence of weather. It is the presence of a Pilot and a Shepherd. “Give us this day our daily bread.” (Matthew 6:11) Name your state if you need to. Then return to this truth. Scripture is ballast, not decoration.', prayer: 'Father, I draw from Your well. Let Your peace guard my heart and mind in Christ Jesus. I cast what I cannot carry. Amen.' },
      { day: 156, title: 'The Finished Work', scripture: 'Matthew 28:20', reflection: 'Waiting is not wasted when you wait on the Lord. “I am with you always, to the end of the age.” (Matthew 28:20) Strength renews in the waiting more often than in the forcing. Rest is part of the race, not the opposite of it.', prayer: 'Abba, I am Yours. Keep me from striving in my own strength. Teach me to abide. Grow Your fruit in me. Amen.' },
      { day: 157, title: 'Grace for This Weakness', scripture: 'Luke 15:20', reflection: 'Remember the Cross when shame tries to narrate your whole story. “His father saw him and felt compassion, and ran and embraced him and kissed him.” (Luke 15:20) The cost was real. The welcome is real. Healing is not self-improvement alone; it flows from a finished work and a living Lord.', prayer: 'Father, give me today’s bread, today’s mercy, and today’s courage. I release tomorrow into Your hands. Amen.' },
      { day: 158, title: 'Fruit That Remains', scripture: 'John 4:14', reflection: 'Poverty of spirit is not a personality flaw; it is a doorway. “Whoever drinks of the water that I will give him will never be thirsty again.” (John 4:14) Blessed are those who know they need. The kingdom belongs to the needy who come, not to the self-sufficient who perform.', prayer: 'Jesus, I remember the Cross. I remember that it is finished. Help me walk as someone bought with a price and welcomed by name. Amen.' },
      { day: 159, title: 'Almost Home', scripture: 'John 14:6', reflection: 'You are not the architect of your own rescue — and you are not abandoned on the worksite. “I am the way, and the truth, and the life.” (John 14:6) What looks unfinished to you is not forgotten by Him. Prefer faithfulness today over a fantasy of arrival.', prayer: 'God of all comfort, use even this day for formation. I trust that You finish what You start. Hold me in the unfinished places. Amen.' },
      { day: 160, title: 'Taste and See', scripture: 'John 16:33', reflection: 'Running into His name is not weakness; it is wisdom. “In the world you will have tribulation. But take heart; I have overcome the world.” (John 16:33) The strong tower still stands when your strategies fail. Choose refuge over rehearsal of fear.', prayer: 'Lord, I receive this word. Search me where I am guarded. Meet me where I am tired. Teach me to trust You in this actual day. Amen.' },
      { day: 161, title: 'He Will Provide', scripture: 'Romans 5:8', reflection: 'The wells of salvation do not close when your mood drops. “God shows his love for us in that while we were still sinners, Christ died for us.” (Romans 5:8) Draw even if your hands shake. Joy is not always the entrance fee; sometimes it is what follows obedience and presence. You are allowed to come thirsty.', prayer: 'Holy Spirit, renew my mind. Steady my Pilot. Lead me into truth that sets me free — not only informs me. Amen.' },
      { day: 162, title: 'Cast the Burden', scripture: 'Romans 8:28', reflection: 'When the mind leaks and the page feels stained, bring the mess here. “And we know that for those who love God all things work together for good.” (Romans 8:28) Externalize what is loud. Let the Word speak louder than the spiral. You are not alone in the room, and you are not only your weather.', prayer: 'Lord, write Your vision on my heart so clearly that I can run with it — and rest when You say rest. Amen.' },
      { day: 163, title: 'When I Am Afraid', scripture: 'Romans 12:2', reflection: 'Depth does not always announce itself with emotion. Sometimes it is the steady choice to stay. “Do not be conformed to this world, but be transformed by the renewal of your mind.” (Romans 12:2) Hold this without rushing to apply it to everyone else. Let it search you. Regulation and formation meet when the Pilot is honest and the heart is open.', prayer: 'Father, I draw from Your well. Let Your peace guard my heart and mind in Christ Jesus. I cast what I cannot carry. Amen.' },
      { day: 164, title: 'The Joy of the Lord', scripture: '2 Corinthians 5:17', reflection: 'Mercy is new this morning — not recycled leftover grace. “If anyone is in Christ, he is a new creation. The old has passed away; behold, the new has come.” (2 Corinthians 5:17) Yesterday’s collapse does not cancel today’s supply. Step out from under a verdict that expired at sunrise.', prayer: 'Abba, I am Yours. Keep me from striving in my own strength. Teach me to abide. Grow Your fruit in me. Amen.' },
      { day: 165, title: 'The Way, Truth, Life', scripture: 'Galatians 5:22-23', reflection: 'Today’s word is not a demand to feel better; it is an invitation to come as you are. “The fruit of the Spirit is love, joy, peace, patience, kindness, goodness, faithfulness, gentleness, self-control.” (Galatians 5:22-23) Let this settle under the noise. Formation is rarely loud. It is often the quiet decision to trust again when your nervous system still remembers every storm.', prayer: 'Father, give me today’s bread, today’s mercy, and today’s courage. I release tomorrow into Your hands. Amen.' },
      { day: 166, title: 'While We Were Sinners', scripture: 'Ephesians 3:20', reflection: 'He goes before you into this day. “Now to him who is able to do far more abundantly than all that we ask or think.” (Ephesians 3:20) You do not need the full year mapped. You need the next faithful step with the One who already sees the end. Release the demand to control outcomes you were never assigned.', prayer: 'Jesus, I remember the Cross. I remember that it is finished. Help me walk as someone bought with a price and welcomed by name. Amen.' },
      { day: 167, title: 'Renewed Mind', scripture: 'Philippians 4:6-7', reflection: 'Abide. Fruit follows connection, not pressure. “Do not be anxious about anything… and the peace of God… will guard your hearts and your minds in Christ Jesus.” (Philippians 4:6-7) If you are striving without remaining, you will burn out and call it faithfulness. Come back to the Vine.', prayer: 'God of all comfort, use even this day for formation. I trust that You finish what You start. Hold me in the unfinished places. Amen.' },
      { day: 168, title: 'Crucified with Christ', scripture: 'Colossians 3:14', reflection: 'Seeds grow in the dark before they break the soil. “And above all these put on love, which binds everything together in perfect harmony.” (Colossians 3:14) You are not behind because you cannot see fruit yet. Stop digging up the seed to inspect it. Water it with trust and ordinary obedience.', prayer: 'Lord, I receive this word. Search me where I am guarded. Meet me where I am tired. Teach me to trust You in this actual day. Amen.' },
      { day: 169, title: 'Strong in the Lord', scripture: '2 Timothy 1:7', reflection: 'He cares for you — not as a slogan, as a posture. “For God gave us a spirit not of fear but of power and love and self-control.” (2 Timothy 1:7) Cast the anxiety. Clinging to it is not the same as being responsible. Love lets you put the weight down.', prayer: 'Holy Spirit, renew my mind. Steady my Pilot. Lead me into truth that sets me free — not only informs me. Amen.' },
      { day: 170, title: 'He Is Faithful', scripture: 'Hebrews 12:1-2', reflection: 'Stability is not the absence of weather. It is the presence of a Pilot and a Shepherd. “Let us run with endurance the race that is set before us, looking to Jesus.” (Hebrews 12:1-2) Name your state if you need to. Then return to this truth. Scripture is ballast, not decoration.', prayer: 'Lord, write Your vision on my heart so clearly that I can run with it — and rest when You say rest. Amen.' },
      { day: 171, title: 'Never Forsaken', scripture: 'James 1:2-4', reflection: 'Waiting is not wasted when you wait on the Lord. “Count it all joy, my brothers, when you meet trials of various kinds… that you may be perfect and complete.” (James 1:2-4) Strength renews in the waiting more often than in the forcing. Rest is part of the race, not the opposite of it.', prayer: 'Father, I draw from Your well. Let Your peace guard my heart and mind in Christ Jesus. I cast what I cannot carry. Amen.' },
      { day: 172, title: 'Confess and Be Cleansed', scripture: '1 John 1:9', reflection: 'Remember the Cross when shame tries to narrate your whole story. “If we confess our sins, he is faithful and just to forgive us our sins and to cleanse us from all unrighteousness.” (1 John 1:9) The cost was real. The welcome is real. Healing is not self-improvement alone; it flows from a finished work and a living Lord.', prayer: 'Abba, I am Yours. Keep me from striving in my own strength. Teach me to abide. Grow Your fruit in me. Amen.' },
      { day: 173, title: 'Draw from the Well', scripture: 'Revelation 21:5', reflection: 'Poverty of spirit is not a personality flaw; it is a doorway. “And he who was seated on the throne said, “Behold, I am making all things new.”” (Revelation 21:5) Blessed are those who know they need. The kingdom belongs to the needy who come, not to the self-sufficient who perform.', prayer: 'Father, give me today’s bread, today’s mercy, and today’s courage. I release tomorrow into Your hands. Amen.' },
      { day: 174, title: 'A New Heart', scripture: 'Genesis 16:13', reflection: 'You are not the architect of your own rescue — and you are not abandoned on the worksite. “You are a God of seeing.” (Genesis 16:13) What looks unfinished to you is not forgotten by Him. Prefer faithfulness today over a fantasy of arrival.', prayer: 'Jesus, I remember the Cross. I remember that it is finished. Help me walk as someone bought with a price and welcomed by name. Amen.' },
      { day: 175, title: 'Refuge in Trouble', scripture: 'Exodus 14:14', reflection: 'Running into His name is not weakness; it is wisdom. “The Lord will fight for you, and you have only to be silent.” (Exodus 14:14) The strong tower still stands when your strategies fail. Choose refuge over rehearsal of fear.', prayer: 'God of all comfort, use even this day for formation. I trust that You finish what You start. Hold me in the unfinished places. Amen.' },
      { day: 176, title: 'A Willing Spirit', scripture: 'Exodus 34:6', reflection: 'The wells of salvation do not close when your mood drops. “The Lord, the Lord, a God merciful and gracious, slow to anger, and abounding in steadfast love and faithfulness.” (Exodus 34:6) Draw even if your hands shake. Joy is not always the entrance fee; sometimes it is what follows obedience and presence. You are allowed to come thirsty.', prayer: 'Lord, I receive this word. Search me where I am guarded. Meet me where I am tired. Teach me to trust You in this actual day. Amen.' },
      { day: 177, title: 'Come Closer', scripture: '1 Samuel 16:7', reflection: 'When the mind leaks and the page feels stained, bring the mess here. “Man looks on the outward appearance, but the Lord looks on the heart.” (1 Samuel 16:7) Externalize what is loud. Let the Word speak louder than the spiral. You are not alone in the room, and you are not only your weather.', prayer: 'Holy Spirit, renew my mind. Steady my Pilot. Lead me into truth that sets me free — not only informs me. Amen.' },
      { day: 178, title: 'No Condemnation', scripture: 'Psalm 16:11', reflection: 'Depth does not always announce itself with emotion. Sometimes it is the steady choice to stay. “In your presence there is fullness of joy; at your right hand are pleasures forevermore.” (Psalm 16:11) Hold this without rushing to apply it to everyone else. Let it search you. Regulation and formation meet when the Pilot is honest and the heart is open.', prayer: 'Lord, write Your vision on my heart so clearly that I can run with it — and rest when You say rest. Amen.' },
      { day: 179, title: 'Run with Endurance', scripture: 'Psalm 27:1', reflection: 'Mercy is new this morning — not recycled leftover grace. “The Lord is my light and my salvation; whom shall I fear?” (Psalm 27:1) Yesterday’s collapse does not cancel today’s supply. Step out from under a verdict that expired at sunrise.', prayer: 'Father, I draw from Your well. Let Your peace guard my heart and mind in Christ Jesus. I cast what I cannot carry. Amen.' },
      { day: 180, title: 'All Things Work', scripture: 'Romans 8:28', reflection: 'Midyear is a good place to remember: for those who love God, all things work together for good. Not all things are good — but all things are under a Redeemer’s hands. Refuse despair’s final interpretation.', prayer: 'Redeem even this. Work it for good according to Your purpose. Amen.' },
      { day: 181, title: 'The Same Forever', scripture: 'Psalm 55:22', reflection: 'He goes before you into this day. “Cast your burden on the Lord, and he will sustain you.” (Psalm 55:22) You do not need the full year mapped. You need the next faithful step with the One who already sees the end. Release the demand to control outcomes you were never assigned.', prayer: 'Father, give me today’s bread, today’s mercy, and today’s courage. I release tomorrow into Your hands. Amen.' },
      { day: 182, title: 'Call and Listen', scripture: 'Psalm 119:105', reflection: 'Abide. Fruit follows connection, not pressure. “Your word is a lamp to my feet and a light to my path.” (Psalm 119:105) If you are striving without remaining, you will burn out and call it faithfulness. Come back to the Vine.', prayer: 'Jesus, I remember the Cross. I remember that it is finished. Help me walk as someone bought with a price and welcomed by name. Amen.' },
      { day: 183, title: 'Fear Not', scripture: 'Psalm 147:3', reflection: 'Seeds grow in the dark before they break the soil. “He heals the brokenhearted and binds up their wounds.” (Psalm 147:3) You are not behind because you cannot see fruit yet. Stop digging up the seed to inspect it. Water it with trust and ordinary obedience.', prayer: 'God of all comfort, use even this day for formation. I trust that You finish what You start. Hold me in the unfinished places. Amen.' },
      { day: 184, title: 'Create in Me', scripture: 'Proverbs 18:10', reflection: 'He cares for you — not as a slogan, as a posture. “The name of the Lord is a strong tower; the righteous man runs into it and is safe.” (Proverbs 18:10) Cast the anxiety. Clinging to it is not the same as being responsible. Love lets you put the weight down.', prayer: 'Lord, I receive this word. Search me where I am guarded. Meet me where I am tired. Teach me to trust You in this actual day. Amen.' },
      { day: 185, title: 'The Lord Who Heals', scripture: 'Isaiah 40:31', reflection: 'Stability is not the absence of weather. It is the presence of a Pilot and a Shepherd. “They who wait for the Lord shall renew their strength; they shall mount up with wings like eagles.” (Isaiah 40:31) Name your state if you need to. Then return to this truth. Scripture is ballast, not decoration.', prayer: 'Holy Spirit, renew my mind. Steady my Pilot. Lead me into truth that sets me free — not only informs me. Amen.' },
      { day: 186, title: 'Heart Over Appearance', scripture: 'Isaiah 53:5', reflection: 'Waiting is not wasted when you wait on the Lord. “He was pierced for our transgressions; he was crushed for our iniquities… and with his wounds we are healed.” (Isaiah 53:5) Strength renews in the waiting more often than in the forcing. Rest is part of the race, not the opposite of it.', prayer: 'Lord, write Your vision on my heart so clearly that I can run with it — and rest when You say rest. Amen.' },
      { day: 187, title: 'It Is Finished', scripture: 'Jeremiah 29:11', reflection: 'Remember the Cross when shame tries to narrate your whole story. “For I know the plans I have for you… plans for welfare and not for evil, to give you a future and a hope.” (Jeremiah 29:11) The cost was real. The welcome is real. Healing is not self-improvement alone; it flows from a finished work and a living Lord.', prayer: 'Father, I draw from Your well. Let Your peace guard my heart and mind in Christ Jesus. I cast what I cannot carry. Amen.' },
      { day: 188, title: 'All Things for Good', scripture: 'Ezekiel 36:26', reflection: 'Poverty of spirit is not a personality flaw; it is a doorway. “I will give you a new heart, and a new spirit I will put within you.” (Ezekiel 36:26) Blessed are those who know they need. The kingdom belongs to the needy who come, not to the self-sufficient who perform.', prayer: 'Abba, I am Yours. Keep me from striving in my own strength. Teach me to abide. Grow Your fruit in me. Amen.' },
      { day: 189, title: 'God of All Comfort', scripture: 'Zephaniah 3:17', reflection: 'You are not the architect of your own rescue — and you are not abandoned on the worksite. “The Lord your God is in your midst, a mighty one who will save; he will rejoice over you with gladness.” (Zephaniah 3:17) What looks unfinished to you is not forgotten by Him. Prefer faithfulness today over a fantasy of arrival.', prayer: 'Father, give me today’s bread, today’s mercy, and today’s courage. I release tomorrow into Your hands. Amen.' },
      { day: 190, title: 'Due Season', scripture: 'Matthew 6:33', reflection: 'Running into His name is not weakness; it is wisdom. “Seek first the kingdom of God and his righteousness, and all these things will be added to you.” (Matthew 6:33) The strong tower still stands when your strategies fail. Choose refuge over rehearsal of fear.', prayer: 'Jesus, I remember the Cross. I remember that it is finished. Help me walk as someone bought with a price and welcomed by name. Amen.' },
      { day: 191, title: 'Set Your Mind Above', scripture: 'Mark 4:39', reflection: 'The wells of salvation do not close when your mood drops. “Peace! Be still!” (Mark 4:39) Draw even if your hands shake. Joy is not always the entrance fee; sometimes it is what follows obedience and presence. You are allowed to come thirsty.', prayer: 'God of all comfort, use even this day for formation. I trust that You finish what You start. Hold me in the unfinished places. Amen.' },
      { day: 192, title: 'Throne of Grace', scripture: 'John 1:4-5', reflection: 'When the mind leaks and the page feels stained, bring the mess here. “In him was life, and the life was the light of men. The light shines in the darkness.” (John 1:4-5) Externalize what is loud. Let the Word speak louder than the spiral. You are not alone in the room, and you are not only your weather.', prayer: 'Lord, I receive this word. Search me where I am guarded. Meet me where I am tired. Teach me to trust You in this actual day. Amen.' },
      { day: 193, title: 'Count It Joy', scripture: 'John 8:12', reflection: 'Depth does not always announce itself with emotion. Sometimes it is the steady choice to stay. “I am the light of the world. Whoever follows me will not walk in darkness.” (John 8:12) Hold this without rushing to apply it to everyone else. Let it search you. Regulation and formation meet when the Pilot is honest and the heart is open.', prayer: 'Holy Spirit, renew my mind. Steady my Pilot. Lead me into truth that sets me free — not only informs me. Amen.' },
      { day: 194, title: 'Kept from Stumbling', scripture: 'John 14:27', reflection: 'Mercy is new this morning — not recycled leftover grace. “Peace I leave with you; my peace I give to you. Not as the world gives do I give to you.” (John 14:27) Yesterday’s collapse does not cancel today’s supply. Step out from under a verdict that expired at sunrise.', prayer: 'Lord, write Your vision on my heart so clearly that I can run with it — and rest when You say rest. Amen.' },
      { day: 195, title: 'Stillness Before Him', scripture: 'John 19:30', reflection: 'Today’s word is not a demand to feel better; it is an invitation to come as you are. “It is finished.” (John 19:30) Let this settle under the noise. Formation is rarely loud. It is often the quiet decision to trust again when your nervous system still remembers every storm.', prayer: 'Father, I draw from Your well. Let Your peace guard my heart and mind in Christ Jesus. I cast what I cannot carry. Amen.' },
      { day: 196, title: 'Open Hands', scripture: 'Romans 8:1', reflection: 'He goes before you into this day. “There is therefore now no condemnation for those who are in Christ Jesus.” (Romans 8:1) You do not need the full year mapped. You need the next faithful step with the One who already sees the end. Release the demand to control outcomes you were never assigned.', prayer: 'Abba, I am Yours. Keep me from striving in my own strength. Teach me to abide. Grow Your fruit in me. Amen.' },
      { day: 197, title: 'Light in Darkness', scripture: 'Romans 8:31', reflection: 'Abide. Fruit follows connection, not pressure. “If God is for us, who can be against us?” (Romans 8:31) If you are striving without remaining, you will burn out and call it faithfulness. Come back to the Vine.', prayer: 'Father, give me today’s bread, today’s mercy, and today’s courage. I release tomorrow into Your hands. Amen.' },
      { day: 198, title: 'A Steady Mind', scripture: '1 Corinthians 13:13', reflection: 'Seeds grow in the dark before they break the soil. “So now faith, hope, and love abide… but the greatest of these is love.” (1 Corinthians 13:13) You are not behind because you cannot see fruit yet. Stop digging up the seed to inspect it. Water it with trust and ordinary obedience.', prayer: 'Jesus, I remember the Cross. I remember that it is finished. Help me walk as someone bought with a price and welcomed by name. Amen.' },
      { day: 199, title: 'Rise, Take Heart', scripture: '2 Corinthians 12:9', reflection: 'He cares for you — not as a slogan, as a posture. “My grace is sufficient for you, for my power is made perfect in weakness.” (2 Corinthians 12:9) Cast the anxiety. Clinging to it is not the same as being responsible. Love lets you put the weight down.', prayer: 'God of all comfort, use even this day for formation. I trust that You finish what You start. Hold me in the unfinished places. Amen.' },
      { day: 200, title: 'More Than Enough', scripture: 'Galatians 6:9', reflection: 'Stability is not the absence of weather. It is the presence of a Pilot and a Shepherd. “And let us not grow weary of doing good, for in due season we will reap, if we do not give up.” (Galatians 6:9) Name your state if you need to. Then return to this truth. Scripture is ballast, not decoration.', prayer: 'Lord, I receive this word. Search me where I am guarded. Meet me where I am tired. Teach me to trust You in this actual day. Amen.' },
      { day: 201, title: 'The Helper Within', scripture: 'Ephesians 6:10', reflection: 'Waiting is not wasted when you wait on the Lord. “Finally, be strong in the Lord and in the strength of his might.” (Ephesians 6:10) Strength renews in the waiting more often than in the forcing. Rest is part of the race, not the opposite of it.', prayer: 'Holy Spirit, renew my mind. Steady my Pilot. Lead me into truth that sets me free — not only informs me. Amen.' },
      { day: 202, title: 'Do Not Grow Weary', scripture: 'Philippians 4:13', reflection: 'Remember the Cross when shame tries to narrate your whole story. “I can do all things through him who strengthens me.” (Philippians 4:13) The cost was real. The welcome is real. Healing is not self-improvement alone; it flows from a finished work and a living Lord.', prayer: 'Lord, write Your vision on my heart so clearly that I can run with it — and rest when You say rest. Amen.' },
      { day: 203, title: 'Out of the Depths', scripture: '1 Thessalonians 5:16-18', reflection: 'Poverty of spirit is not a personality flaw; it is a doorway. “Rejoice always, pray without ceasing, give thanks in all circumstances.” (1 Thessalonians 5:16-18) Blessed are those who know they need. The kingdom belongs to the needy who come, not to the self-sufficient who perform.', prayer: 'Father, I draw from Your well. Let Your peace guard my heart and mind in Christ Jesus. I cast what I cannot carry. Amen.' },
      { day: 204, title: 'The God Who Sees', scripture: 'Hebrews 4:16', reflection: 'You are not the architect of your own rescue — and you are not abandoned on the worksite. “Let us then with confidence draw near to the throne of grace, that we may receive mercy and find grace to help in time of need.” (Hebrews 4:16) What looks unfinished to you is not forgotten by Him. Prefer faithfulness today over a fantasy of arrival.', prayer: 'Abba, I am Yours. Keep me from striving in my own strength. Teach me to abide. Grow Your fruit in me. Amen.' },
      { day: 205, title: 'Perfect Peace', scripture: 'Hebrews 13:5', reflection: 'Running into His name is not weakness; it is wisdom. “I will never leave you nor forsake you.” (Hebrews 13:5) The strong tower still stands when your strategies fail. Choose refuge over rehearsal of fear.', prayer: 'Father, give me today’s bread, today’s mercy, and today’s courage. I release tomorrow into Your hands. Amen.' },
      { day: 206, title: 'Lamp to My Feet', scripture: 'James 4:8', reflection: 'The wells of salvation do not close when your mood drops. “Draw near to God, and he will draw near to you.” (James 4:8) Draw even if your hands shake. Joy is not always the entrance fee; sometimes it is what follows obedience and presence. You are allowed to come thirsty.', prayer: 'Jesus, I remember the Cross. I remember that it is finished. Help me walk as someone bought with a price and welcomed by name. Amen.' },
      { day: 207, title: 'Be Still and Know', scripture: '1 John 4:18', reflection: 'When the mind leaks and the page feels stained, bring the mess here. “There is no fear in love, but perfect love casts out fear.” (1 John 4:18) Externalize what is loud. Let the Word speak louder than the spiral. You are not alone in the room, and you are not only your weather.', prayer: 'God of all comfort, use even this day for formation. I trust that You finish what You start. Hold me in the unfinished places. Amen.' },
      { day: 208, title: 'Compassion That Runs', scripture: 'Genesis 1:1', reflection: 'Depth does not always announce itself with emotion. Sometimes it is the steady choice to stay. “In the beginning, God created the heavens and the earth.” (Genesis 1:1) Hold this without rushing to apply it to everyone else. Let it search you. Regulation and formation meet when the Pilot is honest and the heart is open.', prayer: 'Lord, I receive this word. Search me where I am guarded. Meet me where I am tired. Teach me to trust You in this actual day. Amen.' },
      { day: 209, title: 'Power from on High', scripture: 'Genesis 22:14', reflection: 'Mercy is new this morning — not recycled leftover grace. “The Lord will provide.” (Genesis 22:14) Yesterday’s collapse does not cancel today’s supply. Step out from under a verdict that expired at sunrise.', prayer: 'Holy Spirit, renew my mind. Steady my Pilot. Lead me into truth that sets me free — not only informs me. Amen.' },
      { day: 210, title: 'Nothing Can Separate', scripture: 'Exodus 15:26', reflection: 'Today’s word is not a demand to feel better; it is an invitation to come as you are. “I am the Lord, your healer.” (Exodus 15:26) Let this settle under the noise. Formation is rarely loud. It is often the quiet decision to trust again when your nervous system still remembers every storm.', prayer: 'Lord, write Your vision on my heart so clearly that I can run with it — and rest when You say rest. Amen.' },
      { day: 211, title: 'Power in Weakness', scripture: 'Deuteronomy 31:8', reflection: 'He goes before you into this day. “It is the Lord who goes before you. He will be with you; he will not leave you or forsake you.” (Deuteronomy 31:8) You do not need the full year mapped. You need the next faithful step with the One who already sees the end. Release the demand to control outcomes you were never assigned.', prayer: 'Father, I draw from Your well. Let Your peace guard my heart and mind in Christ Jesus. I cast what I cannot carry. Amen.' },
      { day: 212, title: 'Far More Abundantly', scripture: 'Nehemiah 8:10', reflection: 'Abide. Fruit follows connection, not pressure. “The joy of the Lord is your strength.” (Nehemiah 8:10) If you are striving without remaining, you will burn out and call it faithfulness. Come back to the Vine.', prayer: 'Abba, I am Yours. Keep me from striving in my own strength. Teach me to abide. Grow Your fruit in me. Amen.' },
      { day: 213, title: 'Rejoice Always', scripture: 'Psalm 23:1', reflection: 'Seeds grow in the dark before they break the soil. “The Lord is my shepherd; I shall not want.” (Psalm 23:1) You are not behind because you cannot see fruit yet. Stop digging up the seed to inspect it. Water it with trust and ordinary obedience.', prayer: 'Father, give me today’s bread, today’s mercy, and today’s courage. I release tomorrow into Your hands. Amen.' },
      { day: 214, title: 'Looking to Jesus', scripture: 'Psalm 34:8', reflection: 'He cares for you — not as a slogan, as a posture. “Oh, taste and see that the Lord is good! Blessed is the man who takes refuge in him!” (Psalm 34:8) Cast the anxiety. Clinging to it is not the same as being responsible. Love lets you put the weight down.', prayer: 'Jesus, I remember the Cross. I remember that it is finished. Help me walk as someone bought with a price and welcomed by name. Amen.' },
      { day: 215, title: 'He Cares for You', scripture: 'Psalm 46:10', reflection: 'Stability is not the absence of weather. It is the presence of a Pilot and a Shepherd. “Be still, and know that I am God.” (Psalm 46:10) Name your state if you need to. Then return to this truth. Scripture is ballast, not decoration.', prayer: 'God of all comfort, use even this day for formation. I trust that You finish what You start. Hold me in the unfinished places. Amen.' },
      { day: 216, title: 'Wells of Salvation', scripture: 'Psalm 56:3', reflection: 'Waiting is not wasted when you wait on the Lord. “When I am afraid, I put my trust in you.” (Psalm 56:3) Strength renews in the waiting more often than in the forcing. Rest is part of the race, not the opposite of it.', prayer: 'Lord, I receive this word. Search me where I am guarded. Meet me where I am tired. Teach me to trust You in this actual day. Amen.' },
      { day: 217, title: 'Strong Tower', scripture: 'Psalm 130:1', reflection: 'Remember the Cross when shame tries to narrate your whole story. “Out of the depths I cry to you, O Lord!” (Psalm 130:1) The cost was real. The welcome is real. Healing is not self-improvement alone; it flows from a finished work and a living Lord.', prayer: 'Holy Spirit, renew my mind. Steady my Pilot. Lead me into truth that sets me free — not only informs me. Amen.' },
      { day: 218, title: 'Quiet Courage', scripture: 'Proverbs 3:5-6', reflection: 'Poverty of spirit is not a personality flaw; it is a doorway. “Trust in the Lord with all your heart, and do not lean on your own understanding.” (Proverbs 3:5-6) Blessed are those who know they need. The kingdom belongs to the needy who come, not to the self-sufficient who perform.', prayer: 'Lord, write Your vision on my heart so clearly that I can run with it — and rest when You say rest. Amen.' },
      { day: 219, title: 'Steadfast Love', scripture: 'Isaiah 12:3', reflection: 'You are not the architect of your own rescue — and you are not abandoned on the worksite. “With joy you will draw water from the wells of salvation.” (Isaiah 12:3) What looks unfinished to you is not forgotten by Him. Prefer faithfulness today over a fantasy of arrival.', prayer: 'Father, I draw from Your well. Let Your peace guard my heart and mind in Christ Jesus. I cast what I cannot carry. Amen.' },
      { day: 220, title: 'Abide in the Vine', scripture: 'Isaiah 41:10', reflection: 'Running into His name is not weakness; it is wisdom. “Fear not, for I am with you; be not dismayed, for I am your God.” (Isaiah 41:10) The strong tower still stands when your strategies fail. Choose refuge over rehearsal of fear.', prayer: 'Abba, I am Yours. Keep me from striving in my own strength. Teach me to abide. Grow Your fruit in me. Amen.' },
      { day: 221, title: 'Peace That Guards', scripture: 'Isaiah 55:1', reflection: 'The wells of salvation do not close when your mood drops. “Come, everyone who thirsts, come to the waters.” (Isaiah 55:1) Draw even if your hands shake. Joy is not always the entrance fee; sometimes it is what follows obedience and presence. You are allowed to come thirsty.', prayer: 'Father, give me today’s bread, today’s mercy, and today’s courage. I release tomorrow into Your hands. Amen.' },
      { day: 222, title: 'Faithful God', scripture: 'Jeremiah 33:3', reflection: 'When the mind leaks and the page feels stained, bring the mess here. “Call to me and I will answer you, and will tell you great and hidden things that you have not known.” (Jeremiah 33:3) Externalize what is loud. Let the Word speak louder than the spiral. You are not alone in the room, and you are not only your weather.', prayer: 'Jesus, I remember the Cross. I remember that it is finished. Help me walk as someone bought with a price and welcomed by name. Amen.' },
      { day: 223, title: 'Armor of God', scripture: 'Habakkuk 2:2', reflection: 'Depth does not always announce itself with emotion. Sometimes it is the steady choice to stay. “Write the vision; make it plain on tablets, so he may run who reads it.” (Habakkuk 2:2) Hold this without rushing to apply it to everyone else. Let it search you. Regulation and formation meet when the Pilot is honest and the heart is open.', prayer: 'God of all comfort, use even this day for formation. I trust that You finish what You start. Hold me in the unfinished places. Amen.' },
      { day: 224, title: 'Guard Your Heart', scripture: 'Matthew 5:3', reflection: 'Mercy is new this morning — not recycled leftover grace. “Blessed are the poor in spirit, for theirs is the kingdom of heaven.” (Matthew 5:3) Yesterday’s collapse does not cancel today’s supply. Step out from under a verdict that expired at sunrise.', prayer: 'Lord, I receive this word. Search me where I am guarded. Meet me where I am tired. Teach me to trust You in this actual day. Amen.' },
      { day: 225, title: 'Write the Vision', scripture: 'Matthew 11:28', reflection: 'Today’s word is not a demand to feel better; it is an invitation to come as you are. “Come to me, all who labor and are heavy laden, and I will give you rest.” (Matthew 11:28) Let this settle under the noise. Formation is rarely loud. It is often the quiet decision to trust again when your nervous system still remembers every storm.', prayer: 'Holy Spirit, renew my mind. Steady my Pilot. Lead me into truth that sets me free — not only informs me. Amen.' },
      { day: 226, title: 'Through the Waters', scripture: 'Luke 4:18', reflection: 'He goes before you into this day. “He has sent me to proclaim liberty to the captives… to set at liberty those who are oppressed.” (Luke 4:18) You do not need the full year mapped. You need the next faithful step with the One who already sees the end. Release the demand to control outcomes you were never assigned.', prayer: 'Lord, write Your vision on my heart so clearly that I can run with it — and rest when You say rest. Amen.' },
      { day: 227, title: 'Search Me, O God', scripture: 'John 3:16', reflection: 'Abide. Fruit follows connection, not pressure. “For God so loved the world, that he gave his only Son.” (John 3:16) If you are striving without remaining, you will burn out and call it faithfulness. Come back to the Vine.', prayer: 'Father, I draw from Your well. Let Your peace guard my heart and mind in Christ Jesus. I cast what I cannot carry. Amen.' },
      { day: 228, title: 'Slow to Anger', scripture: 'John 10:10', reflection: 'Seeds grow in the dark before they break the soil. “I came that they may have life and have it abundantly.” (John 10:10) You are not behind because you cannot see fruit yet. Stop digging up the seed to inspect it. Water it with trust and ordinary obedience.', prayer: 'Abba, I am Yours. Keep me from striving in my own strength. Teach me to abide. Grow Your fruit in me. Amen.' },
      { day: 229, title: 'My Redeemer Lives', scripture: 'John 15:5', reflection: 'He cares for you — not as a slogan, as a posture. “I am the vine; you are the branches. Whoever abides in me and I in him, he it is that bears much fruit.” (John 15:5) Cast the anxiety. Clinging to it is not the same as being responsible. Love lets you put the weight down.', prayer: 'Father, give me today’s bread, today’s mercy, and today’s courage. I release tomorrow into Your hands. Amen.' },
      { day: 230, title: 'The Way, Truth, Life', scripture: 'Acts 1:8', reflection: 'Stability is not the absence of weather. It is the presence of a Pilot and a Shepherd. “You will receive power when the Holy Spirit has come upon you.” (Acts 1:8) Name your state if you need to. Then return to this truth. Scripture is ballast, not decoration.', prayer: 'Jesus, I remember the Cross. I remember that it is finished. Help me walk as someone bought with a price and welcomed by name. Amen.' },
      { day: 231, title: 'Spirit of Adoption', scripture: 'Romans 8:15', reflection: 'Waiting is not wasted when you wait on the Lord. “You have received the Spirit of adoption as sons, by whom we cry, “Abba! Father!”” (Romans 8:15) Strength renews in the waiting more often than in the forcing. Rest is part of the race, not the opposite of it.', prayer: 'God of all comfort, use even this day for formation. I trust that You finish what You start. Hold me in the unfinished places. Amen.' },
      { day: 232, title: 'The Greatest Is Love', scripture: 'Romans 8:38-39', reflection: 'Remember the Cross when shame tries to narrate your whole story. “Neither death nor life… nor anything else in all creation, will be able to separate us from the love of God in Christ Jesus.” (Romans 8:38-39) The cost was real. The welcome is real. Healing is not self-improvement alone; it flows from a finished work and a living Lord.', prayer: 'Lord, I receive this word. Search me where I am guarded. Meet me where I am tired. Teach me to trust You in this actual day. Amen.' },
      { day: 233, title: 'Walk by the Spirit', scripture: '2 Corinthians 1:3-4', reflection: 'Poverty of spirit is not a personality flaw; it is a doorway. “The Father of mercies and God of all comfort, who comforts us in all our affliction.” (2 Corinthians 1:3-4) Blessed are those who know they need. The kingdom belongs to the needy who come, not to the self-sufficient who perform.', prayer: 'Holy Spirit, renew my mind. Steady my Pilot. Lead me into truth that sets me free — not only informs me. Amen.' },
      { day: 234, title: 'He Who Began', scripture: 'Galatians 2:20', reflection: 'You are not the architect of your own rescue — and you are not abandoned on the worksite. “I have been crucified with Christ. It is no longer I who live, but Christ who lives in me.” (Galatians 2:20) What looks unfinished to you is not forgotten by Him. Prefer faithfulness today over a fantasy of arrival.', prayer: 'Lord, write Your vision on my heart so clearly that I can run with it — and rest when You say rest. Amen.' },
      { day: 235, title: 'Not a Spirit of Fear', scripture: 'Ephesians 2:8-9', reflection: 'Running into His name is not weakness; it is wisdom. “For by grace you have been saved through faith. And this is not your own doing; it is the gift of God.” (Ephesians 2:8-9) The strong tower still stands when your strategies fail. Choose refuge over rehearsal of fear.', prayer: 'Father, I draw from Your well. Let Your peace guard my heart and mind in Christ Jesus. I cast what I cannot carry. Amen.' },
      { day: 236, title: 'Unchanging Christ', scripture: 'Philippians 1:6', reflection: 'The wells of salvation do not close when your mood drops. “He who began a good work in you will bring it to completion at the day of Jesus Christ.” (Philippians 1:6) Draw even if your hands shake. Joy is not always the entrance fee; sometimes it is what follows obedience and presence. You are allowed to come thirsty.', prayer: 'Abba, I am Yours. Keep me from striving in my own strength. Teach me to abide. Grow Your fruit in me. Amen.' },
      { day: 237, title: 'Perfect Love', scripture: 'Colossians 3:2', reflection: 'When the mind leaks and the page feels stained, bring the mess here. “Set your minds on things that are above, not on things that are on earth.” (Colossians 3:2) Externalize what is loud. Let the Word speak louder than the spiral. You are not alone in the room, and you are not only your weather.', prayer: 'Father, give me today’s bread, today’s mercy, and today’s courage. I release tomorrow into Your hands. Amen.' },
      { day: 238, title: 'Morning Mercy', scripture: '1 Thessalonians 5:24', reflection: 'Depth does not always announce itself with emotion. Sometimes it is the steady choice to stay. “He who calls you is faithful; he will surely do it.” (1 Thessalonians 5:24) Hold this without rushing to apply it to everyone else. Let it search you. Regulation and formation meet when the Pilot is honest and the heart is open.', prayer: 'Jesus, I remember the Cross. I remember that it is finished. Help me walk as someone bought with a price and welcomed by name. Amen.' },
      { day: 239, title: 'Living Water', scripture: 'Hebrews 11:1', reflection: 'Mercy is new this morning — not recycled leftover grace. “Now faith is the assurance of things hoped for, the conviction of things not seen.” (Hebrews 11:1) Yesterday’s collapse does not cancel today’s supply. Step out from under a verdict that expired at sunrise.', prayer: 'God of all comfort, use even this day for formation. I trust that You finish what You start. Hold me in the unfinished places. Amen.' },
      { day: 240, title: 'Taste and See', scripture: 'Psalm 34:8', reflection: 'Taste and see that the Lord is good. Faith eventually wants experience, not only accurate doctrine. Refuge is the doorway. Come near enough to taste.', prayer: 'I want to taste, not only hear about Your goodness. Draw me near. Amen.' },
      { day: 241, title: 'A Willing Spirit', scripture: '1 Peter 5:7', reflection: 'He goes before you into this day. “Casting all your anxieties on him, because he cares for you.” (1 Peter 5:7) You do not need the full year mapped. You need the next faithful step with the One who already sees the end. Release the demand to control outcomes you were never assigned.', prayer: 'Holy Spirit, renew my mind. Steady my Pilot. Lead me into truth that sets me free — not only informs me. Amen.' },
      { day: 242, title: 'Lay the Burden Down', scripture: 'Jude 24', reflection: 'Abide. Fruit follows connection, not pressure. “Now to him who is able to keep you from stumbling and to present you blameless before the presence of his glory with great joy.” (Jude 24) If you are striving without remaining, you will burn out and call it faithfulness. Come back to the Vine.', prayer: 'Lord, write Your vision on my heart so clearly that I can run with it — and rest when You say rest. Amen.' },
      { day: 243, title: 'Abba, Father', scripture: 'Genesis 1:27', reflection: 'Seeds grow in the dark before they break the soil. “God created man in his own image, in the image of God he created him.” (Genesis 1:27) You are not behind because you cannot see fruit yet. Stop digging up the seed to inspect it. Water it with trust and ordinary obedience.', prayer: 'Father, I draw from Your well. Let Your peace guard my heart and mind in Christ Jesus. I cast what I cannot carry. Amen.' },
      { day: 244, title: 'Eyes on Jesus', scripture: 'Exodus 3:14', reflection: 'He cares for you — not as a slogan, as a posture. “I AM WHO I AM.” (Exodus 3:14) Cast the anxiety. Clinging to it is not the same as being responsible. Love lets you put the weight down.', prayer: 'Abba, I am Yours. Keep me from striving in my own strength. Teach me to abide. Grow Your fruit in me. Amen.' },
      { day: 245, title: 'A Quiet Life', scripture: 'Exodus 33:14', reflection: 'Stability is not the absence of weather. It is the presence of a Pilot and a Shepherd. “My presence will go with you, and I will give you rest.” (Exodus 33:14) Name your state if you need to. Then return to this truth. Scripture is ballast, not decoration.', prayer: 'Father, give me today’s bread, today’s mercy, and today’s courage. I release tomorrow into Your hands. Amen.' },
      { day: 246, title: 'Joy Comes in the Morning', scripture: 'Joshua 1:9', reflection: 'Waiting is not wasted when you wait on the Lord. “Be strong and courageous. Do not be frightened… for the Lord your God is with you wherever you go.” (Joshua 1:9) Strength renews in the waiting more often than in the forcing. Rest is part of the race, not the opposite of it.', prayer: 'Jesus, I remember the Cross. I remember that it is finished. Help me walk as someone bought with a price and welcomed by name. Amen.' },
      { day: 247, title: 'Presence Over Performance', scripture: 'Job 19:25', reflection: 'Remember the Cross when shame tries to narrate your whole story. “I know that my Redeemer lives.” (Job 19:25) The cost was real. The welcome is real. Healing is not self-improvement alone; it flows from a finished work and a living Lord.', prayer: 'God of all comfort, use even this day for formation. I trust that You finish what You start. Hold me in the unfinished places. Amen.' },
      { day: 248, title: 'Renewed Strength', scripture: 'Psalm 23:3', reflection: 'Poverty of spirit is not a personality flaw; it is a doorway. “He restores my soul. He leads me in paths of righteousness for his name’s sake.” (Psalm 23:3) Blessed are those who know they need. The kingdom belongs to the needy who come, not to the self-sufficient who perform.', prayer: 'Lord, I receive this word. Search me where I am guarded. Meet me where I am tired. Teach me to trust You in this actual day. Amen.' },
      { day: 249, title: 'Bless the Lord, O My Soul', scripture: 'Psalm 34:18', reflection: 'You are not the architect of your own rescue — and you are not abandoned on the worksite. “The Lord is near to the brokenhearted and saves the crushed in spirit.” (Psalm 34:18) What looks unfinished to you is not forgotten by Him. Prefer faithfulness today over a fantasy of arrival.', prayer: 'Holy Spirit, renew my mind. Steady my Pilot. Lead me into truth that sets me free — not only informs me. Amen.' },
      { day: 250, title: 'I AM', scripture: 'Psalm 51:10', reflection: 'Running into His name is not weakness; it is wisdom. “Create in me a clean heart, O God, and renew a right spirit within me.” (Psalm 51:10) The strong tower still stands when your strategies fail. Choose refuge over rehearsal of fear.', prayer: 'Lord, write Your vision on my heart so clearly that I can run with it — and rest when You say rest. Amen.' },
      { day: 251, title: 'His Way Is Perfect', scripture: 'Psalm 103:2-3', reflection: 'The wells of salvation do not close when your mood drops. “Bless the Lord, O my soul… who forgives all your iniquity, who heals all your diseases.” (Psalm 103:2-3) Draw even if your hands shake. Joy is not always the entrance fee; sometimes it is what follows obedience and presence. You are allowed to come thirsty.', prayer: 'Father, I draw from Your well. Let Your peace guard my heart and mind in Christ Jesus. I cast what I cannot carry. Amen.' },
      { day: 252, title: 'It Is Finished', scripture: 'Psalm 139:14', reflection: 'When the mind leaks and the page feels stained, bring the mess here. “I praise you, for I am fearfully and wonderfully made.” (Psalm 139:14) Externalize what is loud. Let the Word speak louder than the spiral. You are not alone in the room, and you are not only your weather.', prayer: 'Abba, I am Yours. Keep me from striving in my own strength. Teach me to abide. Grow Your fruit in me. Amen.' },
      { day: 253, title: 'If God Is For Us', scripture: 'Proverbs 4:23', reflection: 'Depth does not always announce itself with emotion. Sometimes it is the steady choice to stay. “Keep your heart with all vigilance, for from it flow the springs of life.” (Proverbs 4:23) Hold this without rushing to apply it to everyone else. Let it search you. Regulation and formation meet when the Pilot is honest and the heart is open.', prayer: 'Father, give me today’s bread, today’s mercy, and today’s courage. I release tomorrow into Your hands. Amen.' },
      { day: 254, title: 'New Creation', scripture: 'Isaiah 26:3', reflection: 'Mercy is new this morning — not recycled leftover grace. “You keep him in perfect peace whose mind is stayed on you, because he trusts in you.” (Isaiah 26:3) Yesterday’s collapse does not cancel today’s supply. Step out from under a verdict that expired at sunrise.', prayer: 'Jesus, I remember the Cross. I remember that it is finished. Help me walk as someone bought with a price and welcomed by name. Amen.' },
      { day: 255, title: 'Saved by Grace', scripture: 'Isaiah 43:2', reflection: 'Today’s word is not a demand to feel better; it is an invitation to come as you are. “When you pass through the waters, I will be with you.” (Isaiah 43:2) Let this settle under the noise. Formation is rarely loud. It is often the quiet decision to trust again when your nervous system still remembers every storm.', prayer: 'God of all comfort, use even this day for formation. I trust that You finish what You start. Hold me in the unfinished places. Amen.' },
      { day: 256, title: 'Put On Love', scripture: 'Isaiah 61:1', reflection: 'He goes before you into this day. “The Lord has anointed me… to bind up the brokenhearted.” (Isaiah 61:1) You do not need the full year mapped. You need the next faithful step with the One who already sees the end. Release the demand to control outcomes you were never assigned.', prayer: 'Lord, I receive this word. Search me where I am guarded. Meet me where I am tired. Teach me to trust You in this actual day. Amen.' },
      { day: 257, title: 'Assurance of Hope', scripture: 'Lamentations 3:22-23', reflection: 'Abide. Fruit follows connection, not pressure. “The steadfast love of the Lord never ceases… they are new every morning; great is your faithfulness.” (Lamentations 3:22-23) If you are striving without remaining, you will burn out and call it faithfulness. Come back to the Vine.', prayer: 'Holy Spirit, renew my mind. Steady my Pilot. Lead me into truth that sets me free — not only informs me. Amen.' },
      { day: 258, title: 'Draw Near', scripture: 'Habakkuk 3:18', reflection: 'Seeds grow in the dark before they break the soil. “Yet I will rejoice in the Lord; I will take joy in the God of my salvation.” (Habakkuk 3:18) You are not behind because you cannot see fruit yet. Stop digging up the seed to inspect it. Water it with trust and ordinary obedience.', prayer: 'Lord, write Your vision on my heart so clearly that I can run with it — and rest when You say rest. Amen.' },
      { day: 259, title: 'All Things New', scripture: 'Matthew 6:11', reflection: 'He cares for you — not as a slogan, as a posture. “Give us this day our daily bread.” (Matthew 6:11) Cast the anxiety. Clinging to it is not the same as being responsible. Love lets you put the weight down.', prayer: 'Father, I draw from Your well. Let Your peace guard my heart and mind in Christ Jesus. I cast what I cannot carry. Amen.' },
      { day: 260, title: 'The Shepherd’s Care', scripture: 'Matthew 28:20', reflection: 'Stability is not the absence of weather. It is the presence of a Pilot and a Shepherd. “I am with you always, to the end of the age.” (Matthew 28:20) Name your state if you need to. Then return to this truth. Scripture is ballast, not decoration.', prayer: 'Abba, I am Yours. Keep me from striving in my own strength. Teach me to abide. Grow Your fruit in me. Amen.' },
      { day: 261, title: 'Hidden Strength', scripture: 'Luke 15:20', reflection: 'Waiting is not wasted when you wait on the Lord. “His father saw him and felt compassion, and ran and embraced him and kissed him.” (Luke 15:20) Strength renews in the waiting more often than in the forcing. Rest is part of the race, not the opposite of it.', prayer: 'Father, give me today’s bread, today’s mercy, and today’s courage. I release tomorrow into Your hands. Amen.' },
      { day: 262, title: 'The God Who Is Near', scripture: 'John 4:14', reflection: 'Remember the Cross when shame tries to narrate your whole story. “Whoever drinks of the water that I will give him will never be thirsty again.” (John 4:14) The cost was real. The welcome is real. Healing is not self-improvement alone; it flows from a finished work and a living Lord.', prayer: 'Jesus, I remember the Cross. I remember that it is finished. Help me walk as someone bought with a price and welcomed by name. Amen.' },
      { day: 263, title: 'A Steady Mind', scripture: 'John 14:6', reflection: 'Poverty of spirit is not a personality flaw; it is a doorway. “I am the way, and the truth, and the life.” (John 14:6) Blessed are those who know they need. The kingdom belongs to the needy who come, not to the self-sufficient who perform.', prayer: 'God of all comfort, use even this day for formation. I trust that You finish what You start. Hold me in the unfinished places. Amen.' },
      { day: 264, title: 'The Finished Work', scripture: 'John 16:33', reflection: 'You are not the architect of your own rescue — and you are not abandoned on the worksite. “In the world you will have tribulation. But take heart; I have overcome the world.” (John 16:33) What looks unfinished to you is not forgotten by Him. Prefer faithfulness today over a fantasy of arrival.', prayer: 'Lord, I receive this word. Search me where I am guarded. Meet me where I am tired. Teach me to trust You in this actual day. Amen.' },
      { day: 265, title: 'Grace for This Weakness', scripture: 'Romans 5:8', reflection: 'Running into His name is not weakness; it is wisdom. “God shows his love for us in that while we were still sinners, Christ died for us.” (Romans 5:8) The strong tower still stands when your strategies fail. Choose refuge over rehearsal of fear.', prayer: 'Holy Spirit, renew my mind. Steady my Pilot. Lead me into truth that sets me free — not only informs me. Amen.' },
      { day: 266, title: 'Fruit That Remains', scripture: 'Romans 8:28', reflection: 'The wells of salvation do not close when your mood drops. “And we know that for those who love God all things work together for good.” (Romans 8:28) Draw even if your hands shake. Joy is not always the entrance fee; sometimes it is what follows obedience and presence. You are allowed to come thirsty.', prayer: 'Lord, write Your vision on my heart so clearly that I can run with it — and rest when You say rest. Amen.' },
      { day: 267, title: 'Almost Home', scripture: 'Romans 12:2', reflection: 'When the mind leaks and the page feels stained, bring the mess here. “Do not be conformed to this world, but be transformed by the renewal of your mind.” (Romans 12:2) Externalize what is loud. Let the Word speak louder than the spiral. You are not alone in the room, and you are not only your weather.', prayer: 'Father, I draw from Your well. Let Your peace guard my heart and mind in Christ Jesus. I cast what I cannot carry. Amen.' },
      { day: 268, title: 'Taste and See', scripture: '2 Corinthians 5:17', reflection: 'Depth does not always announce itself with emotion. Sometimes it is the steady choice to stay. “If anyone is in Christ, he is a new creation. The old has passed away; behold, the new has come.” (2 Corinthians 5:17) Hold this without rushing to apply it to everyone else. Let it search you. Regulation and formation meet when the Pilot is honest and the heart is open.', prayer: 'Abba, I am Yours. Keep me from striving in my own strength. Teach me to abide. Grow Your fruit in me. Amen.' },
      { day: 269, title: 'He Will Provide', scripture: 'Galatians 5:22-23', reflection: 'Mercy is new this morning — not recycled leftover grace. “The fruit of the Spirit is love, joy, peace, patience, kindness, goodness, faithfulness, gentleness, self-control.” (Galatians 5:22-23) Yesterday’s collapse does not cancel today’s supply. Step out from under a verdict that expired at sunrise.', prayer: 'Father, give me today’s bread, today’s mercy, and today’s courage. I release tomorrow into Your hands. Amen.' },
      { day: 270, title: 'Cast the Burden', scripture: 'Ephesians 3:20', reflection: 'Today’s word is not a demand to feel better; it is an invitation to come as you are. “Now to him who is able to do far more abundantly than all that we ask or think.” (Ephesians 3:20) Let this settle under the noise. Formation is rarely loud. It is often the quiet decision to trust again when your nervous system still remembers every storm.', prayer: 'Jesus, I remember the Cross. I remember that it is finished. Help me walk as someone bought with a price and welcomed by name. Amen.' },
      { day: 271, title: 'When I Am Afraid', scripture: 'Philippians 4:6-7', reflection: 'He goes before you into this day. “Do not be anxious about anything… and the peace of God… will guard your hearts and your minds in Christ Jesus.” (Philippians 4:6-7) You do not need the full year mapped. You need the next faithful step with the One who already sees the end. Release the demand to control outcomes you were never assigned.', prayer: 'God of all comfort, use even this day for formation. I trust that You finish what You start. Hold me in the unfinished places. Amen.' },
      { day: 272, title: 'The Joy of the Lord', scripture: 'Colossians 3:14', reflection: 'Abide. Fruit follows connection, not pressure. “And above all these put on love, which binds everything together in perfect harmony.” (Colossians 3:14) If you are striving without remaining, you will burn out and call it faithfulness. Come back to the Vine.', prayer: 'Lord, I receive this word. Search me where I am guarded. Meet me where I am tired. Teach me to trust You in this actual day. Amen.' },
      { day: 273, title: 'Abundant Life', scripture: '2 Timothy 1:7', reflection: 'Seeds grow in the dark before they break the soil. “For God gave us a spirit not of fear but of power and love and self-control.” (2 Timothy 1:7) You are not behind because you cannot see fruit yet. Stop digging up the seed to inspect it. Water it with trust and ordinary obedience.', prayer: 'Holy Spirit, renew my mind. Steady my Pilot. Lead me into truth that sets me free — not only informs me. Amen.' },
      { day: 274, title: 'Power from on High', scripture: 'Hebrews 12:1-2', reflection: 'He cares for you — not as a slogan, as a posture. “Let us run with endurance the race that is set before us, looking to Jesus.” (Hebrews 12:1-2) Cast the anxiety. Clinging to it is not the same as being responsible. Love lets you put the weight down.', prayer: 'Lord, write Your vision on my heart so clearly that I can run with it — and rest when You say rest. Amen.' },
      { day: 275, title: 'Renewed Mind', scripture: 'James 1:2-4', reflection: 'Stability is not the absence of weather. It is the presence of a Pilot and a Shepherd. “Count it all joy, my brothers, when you meet trials of various kinds… that you may be perfect and complete.” (James 1:2-4) Name your state if you need to. Then return to this truth. Scripture is ballast, not decoration.', prayer: 'Father, I draw from Your well. Let Your peace guard my heart and mind in Christ Jesus. I cast what I cannot carry. Amen.' },
      { day: 276, title: 'Crucified with Christ', scripture: '1 John 1:9', reflection: 'Waiting is not wasted when you wait on the Lord. “If we confess our sins, he is faithful and just to forgive us our sins and to cleanse us from all unrighteousness.” (1 John 1:9) Strength renews in the waiting more often than in the forcing. Rest is part of the race, not the opposite of it.', prayer: 'Abba, I am Yours. Keep me from striving in my own strength. Teach me to abide. Grow Your fruit in me. Amen.' },
      { day: 277, title: 'Strong in the Lord', scripture: 'Revelation 21:5', reflection: 'Remember the Cross when shame tries to narrate your whole story. “And he who was seated on the throne said, “Behold, I am making all things new.”” (Revelation 21:5) The cost was real. The welcome is real. Healing is not self-improvement alone; it flows from a finished work and a living Lord.', prayer: 'Father, give me today’s bread, today’s mercy, and today’s courage. I release tomorrow into Your hands. Amen.' },
      { day: 278, title: 'He Is Faithful', scripture: 'Genesis 16:13', reflection: 'Poverty of spirit is not a personality flaw; it is a doorway. “You are a God of seeing.” (Genesis 16:13) Blessed are those who know they need. The kingdom belongs to the needy who come, not to the self-sufficient who perform.', prayer: 'Jesus, I remember the Cross. I remember that it is finished. Help me walk as someone bought with a price and welcomed by name. Amen.' },
      { day: 279, title: 'Never Forsaken', scripture: 'Exodus 14:14', reflection: 'You are not the architect of your own rescue — and you are not abandoned on the worksite. “The Lord will fight for you, and you have only to be silent.” (Exodus 14:14) What looks unfinished to you is not forgotten by Him. Prefer faithfulness today over a fantasy of arrival.', prayer: 'God of all comfort, use even this day for formation. I trust that You finish what You start. Hold me in the unfinished places. Amen.' },
      { day: 280, title: 'Confess and Be Cleansed', scripture: 'Exodus 34:6', reflection: 'Running into His name is not weakness; it is wisdom. “The Lord, the Lord, a God merciful and gracious, slow to anger, and abounding in steadfast love and faithfulness.” (Exodus 34:6) The strong tower still stands when your strategies fail. Choose refuge over rehearsal of fear.', prayer: 'Lord, I receive this word. Search me where I am guarded. Meet me where I am tired. Teach me to trust You in this actual day. Amen.' },
      { day: 281, title: 'Draw from the Well', scripture: '1 Samuel 16:7', reflection: 'The wells of salvation do not close when your mood drops. “Man looks on the outward appearance, but the Lord looks on the heart.” (1 Samuel 16:7) Draw even if your hands shake. Joy is not always the entrance fee; sometimes it is what follows obedience and presence. You are allowed to come thirsty.', prayer: 'Holy Spirit, renew my mind. Steady my Pilot. Lead me into truth that sets me free — not only informs me. Amen.' },
      { day: 282, title: 'A New Heart', scripture: 'Psalm 16:11', reflection: 'When the mind leaks and the page feels stained, bring the mess here. “In your presence there is fullness of joy; at your right hand are pleasures forevermore.” (Psalm 16:11) Externalize what is loud. Let the Word speak louder than the spiral. You are not alone in the room, and you are not only your weather.', prayer: 'Lord, write Your vision on my heart so clearly that I can run with it — and rest when You say rest. Amen.' },
      { day: 283, title: 'Refuge in Trouble', scripture: 'Psalm 27:1', reflection: 'Depth does not always announce itself with emotion. Sometimes it is the steady choice to stay. “The Lord is my light and my salvation; whom shall I fear?” (Psalm 27:1) Hold this without rushing to apply it to everyone else. Let it search you. Regulation and formation meet when the Pilot is honest and the heart is open.', prayer: 'Father, I draw from Your well. Let Your peace guard my heart and mind in Christ Jesus. I cast what I cannot carry. Amen.' },
      { day: 284, title: 'Daily Bread', scripture: 'Psalm 46:1', reflection: 'Mercy is new this morning — not recycled leftover grace. “God is our refuge and strength, a very present help in trouble.” (Psalm 46:1) Yesterday’s collapse does not cancel today’s supply. Step out from under a verdict that expired at sunrise.', prayer: 'Abba, I am Yours. Keep me from striving in my own strength. Teach me to abide. Grow Your fruit in me. Amen.' },
      { day: 285, title: 'Abide in the Vine', scripture: 'Psalm 55:22', reflection: 'Today’s word is not a demand to feel better; it is an invitation to come as you are. “Cast your burden on the Lord, and he will sustain you.” (Psalm 55:22) Let this settle under the noise. Formation is rarely loud. It is often the quiet decision to trust again when your nervous system still remembers every storm.', prayer: 'Father, give me today’s bread, today’s mercy, and today’s courage. I release tomorrow into Your hands. Amen.' },
      { day: 286, title: 'No Condemnation', scripture: 'Psalm 119:105', reflection: 'He goes before you into this day. “Your word is a lamp to my feet and a light to my path.” (Psalm 119:105) You do not need the full year mapped. You need the next faithful step with the One who already sees the end. Release the demand to control outcomes you were never assigned.', prayer: 'Jesus, I remember the Cross. I remember that it is finished. Help me walk as someone bought with a price and welcomed by name. Amen.' },
      { day: 287, title: 'Run with Endurance', scripture: 'Psalm 147:3', reflection: 'Abide. Fruit follows connection, not pressure. “He heals the brokenhearted and binds up their wounds.” (Psalm 147:3) If you are striving without remaining, you will burn out and call it faithfulness. Come back to the Vine.', prayer: 'God of all comfort, use even this day for formation. I trust that You finish what You start. Hold me in the unfinished places. Amen.' },
      { day: 288, title: 'Love That Binds', scripture: 'Proverbs 18:10', reflection: 'Seeds grow in the dark before they break the soil. “The name of the Lord is a strong tower; the righteous man runs into it and is safe.” (Proverbs 18:10) You are not behind because you cannot see fruit yet. Stop digging up the seed to inspect it. Water it with trust and ordinary obedience.', prayer: 'Lord, I receive this word. Search me where I am guarded. Meet me where I am tired. Teach me to trust You in this actual day. Amen.' },
      { day: 289, title: 'The Same Forever', scripture: 'Isaiah 40:31', reflection: 'He cares for you — not as a slogan, as a posture. “They who wait for the Lord shall renew their strength; they shall mount up with wings like eagles.” (Isaiah 40:31) Cast the anxiety. Clinging to it is not the same as being responsible. Love lets you put the weight down.', prayer: 'Holy Spirit, renew my mind. Steady my Pilot. Lead me into truth that sets me free — not only informs me. Amen.' },
      { day: 290, title: 'Call and Listen', scripture: 'Isaiah 53:5', reflection: 'Stability is not the absence of weather. It is the presence of a Pilot and a Shepherd. “He was pierced for our transgressions; he was crushed for our iniquities… and with his wounds we are healed.” (Isaiah 53:5) Name your state if you need to. Then return to this truth. Scripture is ballast, not decoration.', prayer: 'Lord, write Your vision on my heart so clearly that I can run with it — and rest when You say rest. Amen.' },
      { day: 291, title: 'Fear Not', scripture: 'Jeremiah 29:11', reflection: 'Waiting is not wasted when you wait on the Lord. “For I know the plans I have for you… plans for welfare and not for evil, to give you a future and a hope.” (Jeremiah 29:11) Strength renews in the waiting more often than in the forcing. Rest is part of the race, not the opposite of it.', prayer: 'Father, I draw from Your well. Let Your peace guard my heart and mind in Christ Jesus. I cast what I cannot carry. Amen.' },
      { day: 292, title: 'Create in Me', scripture: 'Ezekiel 36:26', reflection: 'Remember the Cross when shame tries to narrate your whole story. “I will give you a new heart, and a new spirit I will put within you.” (Ezekiel 36:26) The cost was real. The welcome is real. Healing is not self-improvement alone; it flows from a finished work and a living Lord.', prayer: 'Abba, I am Yours. Keep me from striving in my own strength. Teach me to abide. Grow Your fruit in me. Amen.' },
      { day: 293, title: 'The Lord Who Heals', scripture: 'Zephaniah 3:17', reflection: 'Poverty of spirit is not a personality flaw; it is a doorway. “The Lord your God is in your midst, a mighty one who will save; he will rejoice over you with gladness.” (Zephaniah 3:17) Blessed are those who know they need. The kingdom belongs to the needy who come, not to the self-sufficient who perform.', prayer: 'Father, give me today’s bread, today’s mercy, and today’s courage. I release tomorrow into Your hands. Amen.' },
      { day: 294, title: 'Heart Over Appearance', scripture: 'Matthew 6:33', reflection: 'You are not the architect of your own rescue — and you are not abandoned on the worksite. “Seek first the kingdom of God and his righteousness, and all these things will be added to you.” (Matthew 6:33) What looks unfinished to you is not forgotten by Him. Prefer faithfulness today over a fantasy of arrival.', prayer: 'Jesus, I remember the Cross. I remember that it is finished. Help me walk as someone bought with a price and welcomed by name. Amen.' },
      { day: 295, title: 'Take Heart', scripture: 'Mark 4:39', reflection: 'Running into His name is not weakness; it is wisdom. “Peace! Be still!” (Mark 4:39) The strong tower still stands when your strategies fail. Choose refuge over rehearsal of fear.', prayer: 'God of all comfort, use even this day for formation. I trust that You finish what You start. Hold me in the unfinished places. Amen.' },
      { day: 296, title: 'Spirit of Adoption', scripture: 'John 1:4-5', reflection: 'The wells of salvation do not close when your mood drops. “In him was life, and the life was the light of men. The light shines in the darkness.” (John 1:4-5) Draw even if your hands shake. Joy is not always the entrance fee; sometimes it is what follows obedience and presence. You are allowed to come thirsty.', prayer: 'Lord, I receive this word. Search me where I am guarded. Meet me where I am tired. Teach me to trust You in this actual day. Amen.' },
      { day: 297, title: 'God of All Comfort', scripture: 'John 8:12', reflection: 'When the mind leaks and the page feels stained, bring the mess here. “I am the light of the world. Whoever follows me will not walk in darkness.” (John 8:12) Externalize what is loud. Let the Word speak louder than the spiral. You are not alone in the room, and you are not only your weather.', prayer: 'Holy Spirit, renew my mind. Steady my Pilot. Lead me into truth that sets me free — not only informs me. Amen.' },
      { day: 298, title: 'Due Season', scripture: 'John 14:27', reflection: 'Depth does not always announce itself with emotion. Sometimes it is the steady choice to stay. “Peace I leave with you; my peace I give to you. Not as the world gives do I give to you.” (John 14:27) Hold this without rushing to apply it to everyone else. Let it search you. Regulation and formation meet when the Pilot is honest and the heart is open.', prayer: 'Lord, write Your vision on my heart so clearly that I can run with it — and rest when You say rest. Amen.' },
      { day: 299, title: 'Set Your Mind Above', scripture: 'John 19:30', reflection: 'Mercy is new this morning — not recycled leftover grace. “It is finished.” (John 19:30) Yesterday’s collapse does not cancel today’s supply. Step out from under a verdict that expired at sunrise.', prayer: 'Father, I draw from Your well. Let Your peace guard my heart and mind in Christ Jesus. I cast what I cannot carry. Amen.' },
      { day: 300, title: 'My Peace I Give', scripture: 'John 14:27', reflection: 'Jesus gives a peace the world cannot manufacture — not the numbness of escape, not the high of mania, not the quiet of denial. His presence is the gift. Receive the person, and the peace follows.', prayer: 'I receive the peace that is not of this world. Stay with me. Amen.' },
      { day: 301, title: 'Count It Joy', scripture: 'Romans 8:31', reflection: 'He goes before you into this day. “If God is for us, who can be against us?” (Romans 8:31) You do not need the full year mapped. You need the next faithful step with the One who already sees the end. Release the demand to control outcomes you were never assigned.', prayer: 'Father, give me today’s bread, today’s mercy, and today’s courage. I release tomorrow into Your hands. Amen.' },
      { day: 302, title: 'Kept from Stumbling', scripture: '1 Corinthians 13:13', reflection: 'Abide. Fruit follows connection, not pressure. “So now faith, hope, and love abide… but the greatest of these is love.” (1 Corinthians 13:13) If you are striving without remaining, you will burn out and call it faithfulness. Come back to the Vine.', prayer: 'Jesus, I remember the Cross. I remember that it is finished. Help me walk as someone bought with a price and welcomed by name. Amen.' },
      { day: 303, title: 'Stillness Before Him', scripture: '2 Corinthians 12:9', reflection: 'Seeds grow in the dark before they break the soil. “My grace is sufficient for you, for my power is made perfect in weakness.” (2 Corinthians 12:9) You are not behind because you cannot see fruit yet. Stop digging up the seed to inspect it. Water it with trust and ordinary obedience.', prayer: 'God of all comfort, use even this day for formation. I trust that You finish what You start. Hold me in the unfinished places. Amen.' },
      { day: 304, title: 'Open Hands', scripture: 'Galatians 6:9', reflection: 'He cares for you — not as a slogan, as a posture. “And let us not grow weary of doing good, for in due season we will reap, if we do not give up.” (Galatians 6:9) Cast the anxiety. Clinging to it is not the same as being responsible. Love lets you put the weight down.', prayer: 'Lord, I receive this word. Search me where I am guarded. Meet me where I am tired. Teach me to trust You in this actual day. Amen.' },
      { day: 305, title: 'Light in Darkness', scripture: 'Ephesians 6:10', reflection: 'Stability is not the absence of weather. It is the presence of a Pilot and a Shepherd. “Finally, be strong in the Lord and in the strength of his might.” (Ephesians 6:10) Name your state if you need to. Then return to this truth. Scripture is ballast, not decoration.', prayer: 'Holy Spirit, renew my mind. Steady my Pilot. Lead me into truth that sets me free — not only informs me. Amen.' },
      { day: 306, title: 'Clean Hands, Clear Path', scripture: 'Philippians 4:13', reflection: 'Waiting is not wasted when you wait on the Lord. “I can do all things through him who strengthens me.” (Philippians 4:13) Strength renews in the waiting more often than in the forcing. Rest is part of the race, not the opposite of it.', prayer: 'Lord, write Your vision on my heart so clearly that I can run with it — and rest when You say rest. Amen.' },
      { day: 307, title: 'Lay the Burden Down', scripture: '1 Thessalonians 5:16-18', reflection: 'Remember the Cross when shame tries to narrate your whole story. “Rejoice always, pray without ceasing, give thanks in all circumstances.” (1 Thessalonians 5:16-18) The cost was real. The welcome is real. Healing is not self-improvement alone; it flows from a finished work and a living Lord.', prayer: 'Father, I draw from Your well. Let Your peace guard my heart and mind in Christ Jesus. I cast what I cannot carry. Amen.' },
      { day: 308, title: 'More Than Enough', scripture: 'Hebrews 4:16', reflection: 'Poverty of spirit is not a personality flaw; it is a doorway. “Let us then with confidence draw near to the throne of grace, that we may receive mercy and find grace to help in time of need.” (Hebrews 4:16) Blessed are those who know they need. The kingdom belongs to the needy who come, not to the self-sufficient who perform.', prayer: 'Abba, I am Yours. Keep me from striving in my own strength. Teach me to abide. Grow Your fruit in me. Amen.' },
      { day: 309, title: 'The Helper Within', scripture: 'Hebrews 13:5', reflection: 'You are not the architect of your own rescue — and you are not abandoned on the worksite. “I will never leave you nor forsake you.” (Hebrews 13:5) What looks unfinished to you is not forgotten by Him. Prefer faithfulness today over a fantasy of arrival.', prayer: 'Father, give me today’s bread, today’s mercy, and today’s courage. I release tomorrow into Your hands. Amen.' },
      { day: 310, title: 'Do Not Grow Weary', scripture: 'James 4:8', reflection: 'Running into His name is not weakness; it is wisdom. “Draw near to God, and he will draw near to you.” (James 4:8) The strong tower still stands when your strategies fail. Choose refuge over rehearsal of fear.', prayer: 'Jesus, I remember the Cross. I remember that it is finished. Help me walk as someone bought with a price and welcomed by name. Amen.' },
      { day: 311, title: 'Out of the Depths', scripture: '1 John 4:18', reflection: 'The wells of salvation do not close when your mood drops. “There is no fear in love, but perfect love casts out fear.” (1 John 4:18) Draw even if your hands shake. Joy is not always the entrance fee; sometimes it is what follows obedience and presence. You are allowed to come thirsty.', prayer: 'God of all comfort, use even this day for formation. I trust that You finish what You start. Hold me in the unfinished places. Amen.' },
      { day: 312, title: 'The God Who Sees', scripture: 'Genesis 1:1', reflection: 'When the mind leaks and the page feels stained, bring the mess here. “In the beginning, God created the heavens and the earth.” (Genesis 1:1) Externalize what is loud. Let the Word speak louder than the spiral. You are not alone in the room, and you are not only your weather.', prayer: 'Lord, I receive this word. Search me where I am guarded. Meet me where I am tired. Teach me to trust You in this actual day. Amen.' },
      { day: 313, title: 'Perfect Peace', scripture: 'Genesis 22:14', reflection: 'Depth does not always announce itself with emotion. Sometimes it is the steady choice to stay. “The Lord will provide.” (Genesis 22:14) Hold this without rushing to apply it to everyone else. Let it search you. Regulation and formation meet when the Pilot is honest and the heart is open.', prayer: 'Holy Spirit, renew my mind. Steady my Pilot. Lead me into truth that sets me free — not only informs me. Amen.' },
      { day: 314, title: 'Lamp to My Feet', scripture: 'Exodus 15:26', reflection: 'Mercy is new this morning — not recycled leftover grace. “I am the Lord, your healer.” (Exodus 15:26) Yesterday’s collapse does not cancel today’s supply. Step out from under a verdict that expired at sunrise.', prayer: 'Lord, write Your vision on my heart so clearly that I can run with it — and rest when You say rest. Amen.' },
      { day: 315, title: 'Be Still and Know', scripture: 'Deuteronomy 31:8', reflection: 'Today’s word is not a demand to feel better; it is an invitation to come as you are. “It is the Lord who goes before you. He will be with you; he will not leave you or forsake you.” (Deuteronomy 31:8) Let this settle under the noise. Formation is rarely loud. It is often the quiet decision to trust again when your nervous system still remembers every storm.', prayer: 'Father, I draw from Your well. Let Your peace guard my heart and mind in Christ Jesus. I cast what I cannot carry. Amen.' },
      { day: 316, title: 'Compassion That Runs', scripture: 'Nehemiah 8:10', reflection: 'He goes before you into this day. “The joy of the Lord is your strength.” (Nehemiah 8:10) You do not need the full year mapped. You need the next faithful step with the One who already sees the end. Release the demand to control outcomes you were never assigned.', prayer: 'Abba, I am Yours. Keep me from striving in my own strength. Teach me to abide. Grow Your fruit in me. Amen.' },
      { day: 317, title: 'As the Father Sent Me', scripture: 'Psalm 23:1', reflection: 'Abide. Fruit follows connection, not pressure. “The Lord is my shepherd; I shall not want.” (Psalm 23:1) If you are striving without remaining, you will burn out and call it faithfulness. Come back to the Vine.', prayer: 'Father, give me today’s bread, today’s mercy, and today’s courage. I release tomorrow into Your hands. Amen.' },
      { day: 318, title: 'If God Is For Us', scripture: 'Psalm 34:8', reflection: 'Seeds grow in the dark before they break the soil. “Oh, taste and see that the Lord is good! Blessed is the man who takes refuge in him!” (Psalm 34:8) You are not behind because you cannot see fruit yet. Stop digging up the seed to inspect it. Water it with trust and ordinary obedience.', prayer: 'Jesus, I remember the Cross. I remember that it is finished. Help me walk as someone bought with a price and welcomed by name. Amen.' },
      { day: 319, title: 'Power in Weakness', scripture: 'Psalm 46:10', reflection: 'He cares for you — not as a slogan, as a posture. “Be still, and know that I am God.” (Psalm 46:10) Cast the anxiety. Clinging to it is not the same as being responsible. Love lets you put the weight down.', prayer: 'God of all comfort, use even this day for formation. I trust that You finish what You start. Hold me in the unfinished places. Amen.' },
      { day: 320, title: 'Far More Abundantly', scripture: 'Psalm 56:3', reflection: 'Stability is not the absence of weather. It is the presence of a Pilot and a Shepherd. “When I am afraid, I put my trust in you.” (Psalm 56:3) Name your state if you need to. Then return to this truth. Scripture is ballast, not decoration.', prayer: 'Lord, I receive this word. Search me where I am guarded. Meet me where I am tired. Teach me to trust You in this actual day. Amen.' },
      { day: 321, title: 'Rejoice Always', scripture: 'Psalm 130:1', reflection: 'Waiting is not wasted when you wait on the Lord. “Out of the depths I cry to you, O Lord!” (Psalm 130:1) Strength renews in the waiting more often than in the forcing. Rest is part of the race, not the opposite of it.', prayer: 'Holy Spirit, renew my mind. Steady my Pilot. Lead me into truth that sets me free — not only informs me. Amen.' },
      { day: 322, title: 'Looking to Jesus', scripture: 'Proverbs 3:5-6', reflection: 'Remember the Cross when shame tries to narrate your whole story. “Trust in the Lord with all your heart, and do not lean on your own understanding.” (Proverbs 3:5-6) The cost was real. The welcome is real. Healing is not self-improvement alone; it flows from a finished work and a living Lord.', prayer: 'Lord, write Your vision on my heart so clearly that I can run with it — and rest when You say rest. Amen.' },
      { day: 323, title: 'He Cares for You', scripture: 'Isaiah 12:3', reflection: 'Poverty of spirit is not a personality flaw; it is a doorway. “With joy you will draw water from the wells of salvation.” (Isaiah 12:3) Blessed are those who know they need. The kingdom belongs to the needy who come, not to the self-sufficient who perform.', prayer: 'Father, I draw from Your well. Let Your peace guard my heart and mind in Christ Jesus. I cast what I cannot carry. Amen.' },
      { day: 324, title: 'Wells of Salvation', scripture: 'Isaiah 41:10', reflection: 'You are not the architect of your own rescue — and you are not abandoned on the worksite. “Fear not, for I am with you; be not dismayed, for I am your God.” (Isaiah 41:10) What looks unfinished to you is not forgotten by Him. Prefer faithfulness today over a fantasy of arrival.', prayer: 'Abba, I am Yours. Keep me from striving in my own strength. Teach me to abide. Grow Your fruit in me. Amen.' },
      { day: 325, title: 'Strong Tower', scripture: 'Isaiah 55:1', reflection: 'Running into His name is not weakness; it is wisdom. “Come, everyone who thirsts, come to the waters.” (Isaiah 55:1) The strong tower still stands when your strategies fail. Choose refuge over rehearsal of fear.', prayer: 'Father, give me today’s bread, today’s mercy, and today’s courage. I release tomorrow into Your hands. Amen.' },
      { day: 326, title: 'Quiet Courage', scripture: 'Jeremiah 33:3', reflection: 'The wells of salvation do not close when your mood drops. “Call to me and I will answer you, and will tell you great and hidden things that you have not known.” (Jeremiah 33:3) Draw even if your hands shake. Joy is not always the entrance fee; sometimes it is what follows obedience and presence. You are allowed to come thirsty.', prayer: 'Jesus, I remember the Cross. I remember that it is finished. Help me walk as someone bought with a price and welcomed by name. Amen.' },
      { day: 327, title: 'Steadfast Love', scripture: 'Habakkuk 2:2', reflection: 'When the mind leaks and the page feels stained, bring the mess here. “Write the vision; make it plain on tablets, so he may run who reads it.” (Habakkuk 2:2) Externalize what is loud. Let the Word speak louder than the spiral. You are not alone in the room, and you are not only your weather.', prayer: 'God of all comfort, use even this day for formation. I trust that You finish what You start. Hold me in the unfinished places. Amen.' },
      { day: 328, title: 'Hope Again', scripture: 'Matthew 5:3', reflection: 'Depth does not always announce itself with emotion. Sometimes it is the steady choice to stay. “Blessed are the poor in spirit, for theirs is the kingdom of heaven.” (Matthew 5:3) Hold this without rushing to apply it to everyone else. Let it search you. Regulation and formation meet when the Pilot is honest and the heart is open.', prayer: 'Lord, I receive this word. Search me where I am guarded. Meet me where I am tired. Teach me to trust You in this actual day. Amen.' },
      { day: 329, title: 'The Finished Work', scripture: 'Matthew 11:28', reflection: 'Mercy is new this morning — not recycled leftover grace. “Come to me, all who labor and are heavy laden, and I will give you rest.” (Matthew 11:28) Yesterday’s collapse does not cancel today’s supply. Step out from under a verdict that expired at sunrise.', prayer: 'Holy Spirit, renew my mind. Steady my Pilot. Lead me into truth that sets me free — not only informs me. Amen.' },
      { day: 330, title: 'Faithful God', scripture: 'Luke 4:18', reflection: 'Today’s word is not a demand to feel better; it is an invitation to come as you are. “He has sent me to proclaim liberty to the captives… to set at liberty those who are oppressed.” (Luke 4:18) Let this settle under the noise. Formation is rarely loud. It is often the quiet decision to trust again when your nervous system still remembers every storm.', prayer: 'Lord, write Your vision on my heart so clearly that I can run with it — and rest when You say rest. Amen.' },
      { day: 331, title: 'Armor of God', scripture: 'John 3:16', reflection: 'He goes before you into this day. “For God so loved the world, that he gave his only Son.” (John 3:16) You do not need the full year mapped. You need the next faithful step with the One who already sees the end. Release the demand to control outcomes you were never assigned.', prayer: 'Father, I draw from Your well. Let Your peace guard my heart and mind in Christ Jesus. I cast what I cannot carry. Amen.' },
      { day: 332, title: 'Guard Your Heart', scripture: 'John 10:10', reflection: 'Abide. Fruit follows connection, not pressure. “I came that they may have life and have it abundantly.” (John 10:10) If you are striving without remaining, you will burn out and call it faithfulness. Come back to the Vine.', prayer: 'Abba, I am Yours. Keep me from striving in my own strength. Teach me to abide. Grow Your fruit in me. Amen.' },
      { day: 333, title: 'Write the Vision', scripture: 'John 15:5', reflection: 'Seeds grow in the dark before they break the soil. “I am the vine; you are the branches. Whoever abides in me and I in him, he it is that bears much fruit.” (John 15:5) You are not behind because you cannot see fruit yet. Stop digging up the seed to inspect it. Water it with trust and ordinary obedience.', prayer: 'Father, give me today’s bread, today’s mercy, and today’s courage. I release tomorrow into Your hands. Amen.' },
      { day: 334, title: 'Through the Waters', scripture: 'Acts 1:8', reflection: 'He cares for you — not as a slogan, as a posture. “You will receive power when the Holy Spirit has come upon you.” (Acts 1:8) Cast the anxiety. Clinging to it is not the same as being responsible. Love lets you put the weight down.', prayer: 'Jesus, I remember the Cross. I remember that it is finished. Help me walk as someone bought with a price and welcomed by name. Amen.' },
      { day: 335, title: 'Search Me, O God', scripture: 'Romans 8:15', reflection: 'Stability is not the absence of weather. It is the presence of a Pilot and a Shepherd. “You have received the Spirit of adoption as sons, by whom we cry, “Abba! Father!”” (Romans 8:15) Name your state if you need to. Then return to this truth. Scripture is ballast, not decoration.', prayer: 'God of all comfort, use even this day for formation. I trust that You finish what You start. Hold me in the unfinished places. Amen.' },
      { day: 336, title: 'Slow to Anger', scripture: 'Romans 8:38-39', reflection: 'Waiting is not wasted when you wait on the Lord. “Neither death nor life… nor anything else in all creation, will be able to separate us from the love of God in Christ Jesus.” (Romans 8:38-39) Strength renews in the waiting more often than in the forcing. Rest is part of the race, not the opposite of it.', prayer: 'Lord, I receive this word. Search me where I am guarded. Meet me where I am tired. Teach me to trust You in this actual day. Amen.' },
      { day: 337, title: 'My Redeemer Lives', scripture: '2 Corinthians 1:3-4', reflection: 'Remember the Cross when shame tries to narrate your whole story. “The Father of mercies and God of all comfort, who comforts us in all our affliction.” (2 Corinthians 1:3-4) The cost was real. The welcome is real. Healing is not self-improvement alone; it flows from a finished work and a living Lord.', prayer: 'Holy Spirit, renew my mind. Steady my Pilot. Lead me into truth that sets me free — not only informs me. Amen.' },
      { day: 338, title: 'The Way, Truth, Life', scripture: 'Galatians 2:20', reflection: 'Poverty of spirit is not a personality flaw; it is a doorway. “I have been crucified with Christ. It is no longer I who live, but Christ who lives in me.” (Galatians 2:20) Blessed are those who know they need. The kingdom belongs to the needy who come, not to the self-sufficient who perform.', prayer: 'Lord, write Your vision on my heart so clearly that I can run with it — and rest when You say rest. Amen.' },
      { day: 339, title: 'While We Were Sinners', scripture: 'Ephesians 2:8-9', reflection: 'You are not the architect of your own rescue — and you are not abandoned on the worksite. “For by grace you have been saved through faith. And this is not your own doing; it is the gift of God.” (Ephesians 2:8-9) What looks unfinished to you is not forgotten by Him. Prefer faithfulness today over a fantasy of arrival.', prayer: 'Father, I draw from Your well. Let Your peace guard my heart and mind in Christ Jesus. I cast what I cannot carry. Amen.' },
      { day: 340, title: 'Renewed Mind', scripture: 'Philippians 1:6', reflection: 'Running into His name is not weakness; it is wisdom. “He who began a good work in you will bring it to completion at the day of Jesus Christ.” (Philippians 1:6) The strong tower still stands when your strategies fail. Choose refuge over rehearsal of fear.', prayer: 'Abba, I am Yours. Keep me from striving in my own strength. Teach me to abide. Grow Your fruit in me. Amen.' },
      { day: 341, title: 'Walk by the Spirit', scripture: 'Colossians 3:2', reflection: 'The wells of salvation do not close when your mood drops. “Set your minds on things that are above, not on things that are on earth.” (Colossians 3:2) Draw even if your hands shake. Joy is not always the entrance fee; sometimes it is what follows obedience and presence. You are allowed to come thirsty.', prayer: 'Father, give me today’s bread, today’s mercy, and today’s courage. I release tomorrow into Your hands. Amen.' },
      { day: 342, title: 'He Who Began', scripture: '1 Thessalonians 5:24', reflection: 'When the mind leaks and the page feels stained, bring the mess here. “He who calls you is faithful; he will surely do it.” (1 Thessalonians 5:24) Externalize what is loud. Let the Word speak louder than the spiral. You are not alone in the room, and you are not only your weather.', prayer: 'Jesus, I remember the Cross. I remember that it is finished. Help me walk as someone bought with a price and welcomed by name. Amen.' },
      { day: 343, title: 'Not a Spirit of Fear', scripture: 'Hebrews 11:1', reflection: 'Depth does not always announce itself with emotion. Sometimes it is the steady choice to stay. “Now faith is the assurance of things hoped for, the conviction of things not seen.” (Hebrews 11:1) Hold this without rushing to apply it to everyone else. Let it search you. Regulation and formation meet when the Pilot is honest and the heart is open.', prayer: 'God of all comfort, use even this day for formation. I trust that You finish what You start. Hold me in the unfinished places. Amen.' },
      { day: 344, title: 'Unchanging Christ', scripture: 'Hebrews 13:8', reflection: 'Mercy is new this morning — not recycled leftover grace. “Jesus Christ is the same yesterday and today and forever.” (Hebrews 13:8) Yesterday’s collapse does not cancel today’s supply. Step out from under a verdict that expired at sunrise.', prayer: 'Lord, I receive this word. Search me where I am guarded. Meet me where I am tired. Teach me to trust You in this actual day. Amen.' },
      { day: 345, title: 'Perfect Love', scripture: '1 Peter 5:7', reflection: 'Today’s word is not a demand to feel better; it is an invitation to come as you are. “Casting all your anxieties on him, because he cares for you.” (1 Peter 5:7) Let this settle under the noise. Formation is rarely loud. It is often the quiet decision to trust again when your nervous system still remembers every storm.', prayer: 'Holy Spirit, renew my mind. Steady my Pilot. Lead me into truth that sets me free — not only informs me. Amen.' },
      { day: 346, title: 'Morning Mercy', scripture: 'Jude 24', reflection: 'He goes before you into this day. “Now to him who is able to keep you from stumbling and to present you blameless before the presence of his glory with great joy.” (Jude 24) You do not need the full year mapped. You need the next faithful step with the One who already sees the end. Release the demand to control outcomes you were never assigned.', prayer: 'Lord, write Your vision on my heart so clearly that I can run with it — and rest when You say rest. Amen.' },
      { day: 347, title: 'Living Water', scripture: 'Genesis 1:27', reflection: 'Abide. Fruit follows connection, not pressure. “God created man in his own image, in the image of God he created him.” (Genesis 1:27) If you are striving without remaining, you will burn out and call it faithfulness. Come back to the Vine.', prayer: 'Father, I draw from Your well. Let Your peace guard my heart and mind in Christ Jesus. I cast what I cannot carry. Amen.' },
      { day: 348, title: 'Restored Soul', scripture: 'Exodus 3:14', reflection: 'Seeds grow in the dark before they break the soil. “I AM WHO I AM.” (Exodus 3:14) You are not behind because you cannot see fruit yet. Stop digging up the seed to inspect it. Water it with trust and ordinary obedience.', prayer: 'Abba, I am Yours. Keep me from striving in my own strength. Teach me to abide. Grow Your fruit in me. Amen.' },
      { day: 349, title: 'A Willing Spirit', scripture: 'Exodus 33:14', reflection: 'He cares for you — not as a slogan, as a posture. “My presence will go with you, and I will give you rest.” (Exodus 33:14) Cast the anxiety. Clinging to it is not the same as being responsible. Love lets you put the weight down.', prayer: 'Father, give me today’s bread, today’s mercy, and today’s courage. I release tomorrow into Your hands. Amen.' },
      { day: 350, title: 'Come Closer', scripture: 'Joshua 1:9', reflection: 'Stability is not the absence of weather. It is the presence of a Pilot and a Shepherd. “Be strong and courageous. Do not be frightened… for the Lord your God is with you wherever you go.” (Joshua 1:9) Name your state if you need to. Then return to this truth. Scripture is ballast, not decoration.', prayer: 'Jesus, I remember the Cross. I remember that it is finished. Help me walk as someone bought with a price and welcomed by name. Amen.' },
      { day: 351, title: 'No Condemnation', scripture: 'Job 19:25', reflection: 'Waiting is not wasted when you wait on the Lord. “I know that my Redeemer lives.” (Job 19:25) Strength renews in the waiting more often than in the forcing. Rest is part of the race, not the opposite of it.', prayer: 'God of all comfort, use even this day for formation. I trust that You finish what You start. Hold me in the unfinished places. Amen.' },
      { day: 352, title: 'Eyes on Jesus', scripture: 'Psalm 23:3', reflection: 'Remember the Cross when shame tries to narrate your whole story. “He restores my soul. He leads me in paths of righteousness for his name’s sake.” (Psalm 23:3) The cost was real. The welcome is real. Healing is not self-improvement alone; it flows from a finished work and a living Lord.', prayer: 'Lord, I receive this word. Search me where I am guarded. Meet me where I am tired. Teach me to trust You in this actual day. Amen.' },
      { day: 353, title: 'A Quiet Life', scripture: 'Psalm 34:18', reflection: 'Poverty of spirit is not a personality flaw; it is a doorway. “The Lord is near to the brokenhearted and saves the crushed in spirit.” (Psalm 34:18) Blessed are those who know they need. The kingdom belongs to the needy who come, not to the self-sufficient who perform.', prayer: 'Holy Spirit, renew my mind. Steady my Pilot. Lead me into truth that sets me free — not only informs me. Amen.' },
      { day: 354, title: 'Joy Comes in the Morning', scripture: 'Psalm 51:10', reflection: 'You are not the architect of your own rescue — and you are not abandoned on the worksite. “Create in me a clean heart, O God, and renew a right spirit within me.” (Psalm 51:10) What looks unfinished to you is not forgotten by Him. Prefer faithfulness today over a fantasy of arrival.', prayer: 'Lord, write Your vision on my heart so clearly that I can run with it — and rest when You say rest. Amen.' },
      { day: 355, title: 'Presence Over Performance', scripture: 'Psalm 103:2-3', reflection: 'Running into His name is not weakness; it is wisdom. “Bless the Lord, O my soul… who forgives all your iniquity, who heals all your diseases.” (Psalm 103:2-3) The strong tower still stands when your strategies fail. Choose refuge over rehearsal of fear.', prayer: 'Father, I draw from Your well. Let Your peace guard my heart and mind in Christ Jesus. I cast what I cannot carry. Amen.' },
      { day: 356, title: 'Renewed Strength', scripture: 'Psalm 139:14', reflection: 'The wells of salvation do not close when your mood drops. “I praise you, for I am fearfully and wonderfully made.” (Psalm 139:14) Draw even if your hands shake. Joy is not always the entrance fee; sometimes it is what follows obedience and presence. You are allowed to come thirsty.', prayer: 'Abba, I am Yours. Keep me from striving in my own strength. Teach me to abide. Grow Your fruit in me. Amen.' },
      { day: 357, title: 'Bless the Lord, O My Soul', scripture: 'Proverbs 4:23', reflection: 'When the mind leaks and the page feels stained, bring the mess here. “Keep your heart with all vigilance, for from it flow the springs of life.” (Proverbs 4:23) Externalize what is loud. Let the Word speak louder than the spiral. You are not alone in the room, and you are not only your weather.', prayer: 'Father, give me today’s bread, today’s mercy, and today’s courage. I release tomorrow into Your hands. Amen.' },
      { day: 358, title: 'I AM', scripture: 'Isaiah 26:3', reflection: 'Depth does not always announce itself with emotion. Sometimes it is the steady choice to stay. “You keep him in perfect peace whose mind is stayed on you, because he trusts in you.” (Isaiah 26:3) Hold this without rushing to apply it to everyone else. Let it search you. Regulation and formation meet when the Pilot is honest and the heart is open.', prayer: 'Jesus, I remember the Cross. I remember that it is finished. Help me walk as someone bought with a price and welcomed by name. Amen.' },
      { day: 359, title: 'His Way Is Perfect', scripture: 'Isaiah 43:2', reflection: 'Mercy is new this morning — not recycled leftover grace. “When you pass through the waters, I will be with you.” (Isaiah 43:2) Yesterday’s collapse does not cancel today’s supply. Step out from under a verdict that expired at sunrise.', prayer: 'God of all comfort, use even this day for formation. I trust that You finish what You start. Hold me in the unfinished places. Amen.' },
      { day: 360, title: 'It Is Finished', scripture: 'Isaiah 61:1', reflection: 'Today’s word is not a demand to feel better; it is an invitation to come as you are. “The Lord has anointed me… to bind up the brokenhearted.” (Isaiah 61:1) Let this settle under the noise. Formation is rarely loud. It is often the quiet decision to trust again when your nervous system still remembers every storm.', prayer: 'Lord, I receive this word. Search me where I am guarded. Meet me where I am tired. Teach me to trust You in this actual day. Amen.' },
      { day: 361, title: 'All Things for Good', scripture: 'Lamentations 3:22-23', reflection: 'He goes before you into this day. “The steadfast love of the Lord never ceases… they are new every morning; great is your faithfulness.” (Lamentations 3:22-23) You do not need the full year mapped. You need the next faithful step with the One who already sees the end. Release the demand to control outcomes you were never assigned.', prayer: 'Holy Spirit, renew my mind. Steady my Pilot. Lead me into truth that sets me free — not only informs me. Amen.' },
      { day: 362, title: 'God of All Comfort', scripture: 'Habakkuk 3:18', reflection: 'Abide. Fruit follows connection, not pressure. “Yet I will rejoice in the Lord; I will take joy in the God of my salvation.” (Habakkuk 3:18) If you are striving without remaining, you will burn out and call it faithfulness. Come back to the Vine.', prayer: 'Lord, write Your vision on my heart so clearly that I can run with it — and rest when You say rest. Amen.' },
      { day: 363, title: 'Saved by Grace', scripture: 'Matthew 6:11', reflection: 'Seeds grow in the dark before they break the soil. “Give us this day our daily bread.” (Matthew 6:11) You are not behind because you cannot see fruit yet. Stop digging up the seed to inspect it. Water it with trust and ordinary obedience.', prayer: 'Father, I draw from Your well. Let Your peace guard my heart and mind in Christ Jesus. I cast what I cannot carry. Amen.' },
      { day: 364, title: 'Put On Love', scripture: 'Matthew 28:20', reflection: 'He cares for you — not as a slogan, as a posture. “I am with you always, to the end of the age.” (Matthew 28:20) Cast the anxiety. Clinging to it is not the same as being responsible. Love lets you put the weight down.', prayer: 'Abba, I am Yours. Keep me from striving in my own strength. Teach me to abide. Grow Your fruit in me. Amen.' },
      { day: 365, title: 'It Is Finished', scripture: 'John 19:30 · Philippians 1:6', reflection: 'He finished the work of salvation. He will finish the work in you. The year closes not with your perfection, but with His faithfulness. To the only God our Savior be glory, majesty, dominion, and authority — forever.', prayer: 'Thank You that You finish what You start. I rest in the finished work. Amen.' },
    ];

    const OUTREACH_SCRIPTS = [
      { title: 'Signal Flare · Simple', text: 'Hey. I’m not okay right now and I need someone to know. I don’t need solutions yet — just presence if you can.' },
      { title: 'Signal Flare · Specific', text: 'I’m in a rough state (overwhelm / low / spinning). Can you check in with me in the next hour? Even a short message helps.' },
      { title: 'Boundary · Need Space', text: 'I care about this conversation, but I’m at capacity. I need to step away and come back when I can be present. Thank you for understanding.' },
      { title: 'Accountability · Fox Check', text: 'Quick Fox check: Did you move the one thing today? No judgment — just accountability.' },
      { title: 'Faith · Short Prayer Ask', text: 'Would you pray for me today? I’m carrying more than I can hold alone.' },
      { title: 'Encouragement · Send Out', text: 'Thinking of you. You are not forgotten. One step is still progress. I’m with you.' },
    ];

    const COMMUNITY_ENCOURAGEMENTS = [
      { text: 'You are not the only one who has sat on the floor at 3 a.m. and wondered if God was listening. He was.', tag: 'Seeking' },
      { text: 'The Cross was not a metaphor. It was the cost. And it was for you.', tag: 'Cross' },
      { text: 'Stability is not the absence of storms. It is the Pilot staying online when the weather turns.', tag: 'Regulation' },
      { text: 'Your Day 1 letter still matters. He who began the good work will finish it.', tag: 'Formation' },
      { text: 'Drawing from the wells is allowed on the worst days. Especially on the worst days.', tag: 'Wells' },
      { text: 'Shame says hide. Grace says come. The invitation still stands.', tag: 'Grace' },
      { text: 'One Minimum Viable Shift is still a shift. Small is not nothing.', tag: 'MVS' },
      { text: 'The 90-second wave will pass. You do not have to act on it.', tag: 'Heat' },
      { text: 'You can be both a work in progress and already fully loved.', tag: 'Identity' },
      { text: 'If God is for us, who can be against us? That includes the voice in your own head.', tag: 'Truth' },
    ];

    const CRISIS = [
      { region: 'Worldwide', name: 'IASP Resources', detail: 'Find local crisis lines by country', note: 'International directory', url: 'https://www.iasp.info/suicidalthoughts/' },
      { region: 'USA', name: '988 Suicide & Crisis Lifeline', detail: 'Call or text 988', note: '24/7', callUrl: 'tel:988', textUrl: 'sms:988', url: 'https://988lifeline.org/' },
      { region: 'Canada', name: '9-8-8: Suicide Crisis Helpline', detail: 'Call or text 988', note: '24/7/365 across Canada', callUrl: 'tel:988', textUrl: 'sms:988', url: 'https://988.ca/' },
      { region: 'Canada', name: 'Here24/7 (Guelph-Wellington)', detail: '1-844-437-3247', note: 'Regional crisis & intake', callUrl: 'tel:18444373247' },
      { region: 'UK', name: 'Samaritans', detail: '116 123', note: 'Free, 24/7', callUrl: 'tel:116123', url: 'https://www.samaritans.org/' },
      { region: 'Australia', name: 'Lifeline', detail: '13 11 14', note: '24/7', callUrl: 'tel:131114', url: 'https://www.lifeline.org.au/131114' },
      { region: 'International', name: 'Emergency', detail: 'Local emergency number', note: 'If in immediate danger' },
    ];


    const SITUATION_PACKS = [
      { id: 'panic', label: 'When I feel panic', verses: [
        { text: 'Peace! Be still!', ref: 'Mark 4:39' },
        { text: 'When I am afraid, I put my trust in you.', ref: 'Psalm 56:3' },
        { text: 'God is our refuge and strength, a very present help in trouble.', ref: 'Psalm 46:1' },
        { text: 'Peace I leave with you; my peace I give to you.', ref: 'John 14:27' },
      ], note: 'Longer exhale. Feet on floor. This wave peaks and falls.' },
      { id: 'shame', label: 'When shame is loud', verses: [
        { text: 'There is therefore now no condemnation for those who are in Christ Jesus.', ref: 'Romans 8:1' },
        { text: 'If we confess our sins, he is faithful and just to forgive us.', ref: '1 John 1:9' },
        { text: 'He was pierced for our transgressions… with his wounds we are healed.', ref: 'Isaiah 53:5' },
        { text: 'I am fearfully and wonderfully made.', ref: 'Psalm 139:14' },
      ], note: 'Separate person from behavior. Speak to yourself as to a friend.' },
      { id: 'heavy', label: 'When I feel heavy / depressed', verses: [
        { text: 'The Lord is near to the brokenhearted and saves the crushed in spirit.', ref: 'Psalm 34:18' },
        { text: 'Come to me, all who labor and are heavy laden, and I will give you rest.', ref: 'Matthew 11:28' },
        { text: 'He restores my soul.', ref: 'Psalm 23:3' },
        { text: 'Weeping may tarry for the night, but joy comes with the morning.', ref: 'Psalm 30:5' },
      ], note: 'One 10-second action. Water. Rest is valid. No shame.' },
      { id: 'urge', label: 'When the urge is strong', verses: [
        { text: 'No temptation has overtaken you that is not common to man. God is faithful…', ref: '1 Corinthians 10:13' },
        { text: 'I can do all things through him who strengthens me.', ref: 'Philippians 4:13' },
        { text: 'Walk by the Spirit, and you will not gratify the desires of the flesh.', ref: 'Galatians 5:16' },
        { text: 'The name of the Lord is a strong tower; the righteous man runs into it and is safe.', ref: 'Proverbs 18:10' },
      ], note: 'Urge surfing: 15-minute delay. HALT check. Signal Flare if needed.' },
      { id: 'anxiety', label: 'When anxiety spirals', verses: [
        { text: 'Do not be anxious about anything… the peace of God will guard your hearts.', ref: 'Philippians 4:6-7' },
        { text: 'Cast all your anxieties on him, because he cares for you.', ref: '1 Peter 5:7' },
        { text: 'You keep him in perfect peace whose mind is stayed on you.', ref: 'Isaiah 26:3' },
        { text: 'Be still, and know that I am God.', ref: 'Psalm 46:10' },
      ], note: 'Write the loop. 5-minute container. Then return to one Fox.' },
      { id: 'lonely', label: 'When I feel alone', verses: [
        { text: 'It is the Lord who goes before you. He will not leave you or forsake you.', ref: 'Deuteronomy 31:8' },
        { text: 'Even if my father and mother abandon me, the Lord will hold me close.', ref: 'Psalm 27:10' },
        { text: 'I am with you always, to the end of the age.', ref: 'Matthew 28:20' },
        { text: 'Draw near to God, and he will draw near to you.', ref: 'James 4:8' },
      ], note: 'One Signal Flare message. Presence before depth.' },
      { id: 'high', label: 'When I am too high / racing', verses: [
        { text: 'Be still, and know that I am God.', ref: 'Psalm 46:10' },
        { text: 'The Lord will fight for you, and you have only to be silent.', ref: 'Exodus 14:14' },
        { text: 'Better a patient person than a warrior…', ref: 'Proverbs 16:32' },
        { text: 'In returning and rest you shall be saved; in quietness and in trust shall be your strength.', ref: 'Isaiah 30:15' },
      ], note: 'No big decisions 24–48 hrs. Sleep is medicine. Tell one safe person.' },
      { id: 'grief', label: 'When I am grieving', verses: [
        { text: 'The Lord is near to the brokenhearted.', ref: 'Psalm 34:18' },
        { text: 'He heals the brokenhearted and binds up their wounds.', ref: 'Psalm 147:3' },
        { text: 'Blessed are those who mourn, for they shall be comforted.', ref: 'Matthew 5:4' },
        { text: 'Jesus wept.', ref: 'John 11:35' },
      ], note: 'Let the wave move. Do not rush meaning. Gentle structure only.' },
      { id: 'rage', label: 'When rage is rising', verses: [
        { text: 'Be angry and do not sin; do not let the sun go down on your anger.', ref: 'Ephesians 4:26' },
        { text: 'A soft answer turns away wrath.', ref: 'Proverbs 15:1' },
        { text: 'The Lord is merciful and gracious, slow to anger.', ref: 'Psalm 103:8' },
        { text: 'Know this… let every person be quick to hear, slow to speak, slow to anger.', ref: 'James 1:19' },
      ], note: '90-second rule. Do not send the message. Cold water. Wait.' },
      { id: 'freeze', label: 'When I shut down', verses: [
        { text: 'The Spirit helps us in our weakness.', ref: 'Romans 8:26' },
        { text: 'My grace is sufficient for you, for my power is made perfect in weakness.', ref: '2 Corinthians 12:9' },
        { text: 'He gives power to the faint.', ref: 'Isaiah 40:29' },
        { text: 'Come to me… and I will give you rest.', ref: 'Matthew 11:28' },
      ], note: 'Level 0. One 10-sec move. No decisions. Cold water. Name three objects.' },
    ];

    const STATE_PROTOCOLS = [
      { id: 'panic_shame', match: ['panic','shame'], title: 'Panic + Shame', steps: [
        'Longer exhale than inhale for 1 minute. Feet on floor.',
        'Name out loud: “This is panic. This is shame. Neither is the whole truth.”',
        'Cold water on face or wrists (30 seconds).',
        'Read Romans 8:1 once slowly: no condemnation.',
        'Do not send messages or make decisions for 15 minutes.',
        'When the wave drops 20%: one Signal Flare to a safe person OR one line in Write.',
      ]},
      { id: 'heavy_freeze', match: ['gravity','fog'], title: 'Heavy + Freeze', steps: [
        'Permission: you do not have to be productive.',
        'Sit up or stand for 10 seconds. Drink water.',
        'Name three objects in the room out loud.',
        'One Minimum Viable Shift only (open a curtain, wash face).',
        'Psalm 34:18 — He is near to the brokenhearted.',
        'If possible: text one person “low today, no need to fix me.”',
      ]},
      { id: 'high', match: ['mania'], title: 'High / Manic Edge', steps: [
        'Dim lights. Slow the body. No new commitments.',
        'Delay any big decision 24–48 hours — write it down instead.',
        'Protect sleep and meds/routine as non-negotiable.',
        'Tell one safe person: “I may be running high.”',
        'Be still (Psalm 46:10). Silence is strength, not failure.',
        'Reduce stimulants (caffeine, scrolling, late-night plans).',
      ]},
      { id: 'urge_lonely', match: ['urge','lonely'], title: 'Urge + Lonely', steps: [
        'HALT: Hungry? Angry? Lonely? Tired? Address the body need first if you can.',
        '15-minute urge surf — set a timer. Do not act on the urge yet.',
        'Remove access if possible (keys, app, substance, blade).',
        'Send a Signal Flare script — even a short one.',
        'Proverbs 18:10 — run into the name of the Lord.',
        'If still unsafe: crisis line or emergency services. That is courage.',
      ]},
      { id: 'anxiety_scattered', match: ['pulse','static'], title: 'Anxiety + Scattered', steps: [
        'One tab only. Phone face-down or airplane mode 10 minutes.',
        'Write the worry loop on paper. Close the page.',
        'Name one Great Fox — the smallest next step.',
        '10/20 rule: ten minutes on the Fox, then reassess.',
        'Philippians 4:6-7 — pray the worry; let peace guard.',
        'Visual silence: clear one surface in front of you.',
      ]},
      { id: 'rage', match: ['heat','irritable'], title: 'Rage / Edge', steps: [
        'Do not send the message. Do not drive angry if avoidable.',
        'Cold water. Exit the room if needed. 90-second chemical wave.',
        'Warn others if possible: “At capacity — need space.”',
        'Name what the anger is protecting (hurt, fear, injustice).',
        'Ephesians 4:26 — be angry and do not sin.',
        'When lower: one repair or one boundary — not both at once.',
      ]},
      { id: 'grief', match: ['grief'], title: 'Grief', steps: [
        'Let the wave move. Crying is allowed. Numbness is allowed.',
        'No big life decisions today if possible.',
        'One small nurture: water, food, blanket, short walk.',
        'Psalm 34:18 / John 11:35 — He is near; Jesus wept.',
        'Tell one person you are grieving — not a full story required.',
        'Structure only: bedtime, one meal. That is enough.',
      ]},
      { id: 'threat', match: ['shadow','dissoc'], title: 'Threat / Numb', steps: [
        'Orient: name the year, city, room, three colors you see.',
        'Feet on floor. Touch something solid. Temperature change (cool water).',
        'You are here, now. The past is not happening in this room.',
        '5-4-3-2-1 if you can: see, touch, hear, smell, taste.',
        'Psalm 46:1 — very present help. Stay present, not perfect.',
        'When more here: one safe person or Write one paragraph.',
      ]},
    ];

    const HELPER_PAGES = [
      { id: 'level0', title: 'How to walk someone through Level 0', body: '1. Stay calm. Your nervous system co-regulates theirs.\\n2. Ask: “Can we do five small things in order? No big talk yet.”\\n3. Cold water on face/wrists (20–30 sec).\\n4. Name three objects in the room out loud together.\\n5. “What’s the loudest thought? Say it once — we won’t solve it yet.”\\n6. One physical move: stand, stretch, 10 seconds.\\n7. “We’re waiting 90 seconds before any decision.”\\n8. Only then: water, food, safe person, or professional help.\\n\\nDo not argue theology or life plans in Level 0. Regulate first.' },
      { id: 'nabb', title: 'N.A.B.B. for helpers', body: 'N — Name the state (“This looks like panic / shame / shutdown.”)\\nA — Accept the wave (“It can be here. We don’t have to fix it in 30 seconds.”)\\nB — Breathe (longer exhale together)\\nB — Body / boundary (move, space, or stop the triggering conversation)\\n\\nHelpers: you are not the rescuer of the soul in this minute. You are a steady presence.' },
      { id: 'flare', title: 'Signal Flare — when to encourage reaching out', body: 'Encourage a short honest message over silence:\\n“I’m not okay and I don’t need solutions yet — just presence.”\\n\\nIf they cannot text: sit with them, or help them call a crisis line.\\n\\nIf there is active intent to harm themselves or others: local emergency services. Calling for help is not betrayal; it is care.' },
      { id: 'fox', title: 'Great Fox + MVS for someone overwhelmed', body: 'Ask: “What is the smallest next step that still counts?”\\nExamples: open the document, put on shoes, drink water, sit up.\\n\\nCelebrate motion, not completion.\\nOne Fox per day. Protect sleep and food before productivity sermons.' },
      { id: 'faith', title: 'Faith without pressure', body: 'You can pray with someone without demanding a feeling.\\nShort is fine: “Jesus, be near. Give peace. Keep them safe. Amen.”\\n\\nOffer a verse as a gift, not a correction.\\nAvoid: “Just trust more” as the only response to mental illness.\\nHold both: real faith and real care (rest, meds, therapy, community).' },
    ];

    const CROSSOVER_GUIDE = [
      {
        id: 'why_hard',
        title: 'Why multiple states feel impossible',
        body: 'One diagnosis is already a full-time job. Two or three weather systems at once is not “weakness” — it is load. Anxiety can ride on top of depression. Trauma echoes can trigger rage. ADHD static can make OCD loops louder. Manic edge can hide under shame after the crash. Your Pilot is not failing because the dashboard has more lights on. Start with body regulation, then one Fox — not a full life overhaul.'
      },
      {
        id: 'not_one_label',
        title: 'You are not only one label',
        body: 'Labels can help you get care. They are not the whole story of a day. BEE WELL tracks weather (how you are right now) more than identity. You can be bipolar and still have a panic day. You can have ADHD and still freeze. Naming the present state is more useful than arguing which diagnosis “wins.” Select all that apply. Treat the stack, not the argument.'
      },
      {
        id: 'body_first',
        title: 'Order of operations when stacked',
        body: '1) Safety — urge, panic, rage, freeze: Level 0, breath, remove access, Signal Flare if needed.\\n2) Body — sleep, meds AM/PM, food, water, HALT.\\n3) Mind — write the loop, one Truth Anchor, shrink the Fox to an MVS.\\n4) Story — grief, loneliness, meaning, Formation, prayer.\\nDoing step 4 before step 1 is how people burn out or spiral. Regulate first. Theology and plans second.'
      },
      {
        id: 'depression_anxiety',
        title: 'Heavy + Anxiety (common crossover)',
        feels: 'Want to do nothing and also cannot stop worrying. Exhausted and wired. Guilt for resting while the mind races.',
        try: 'Permission to rest + one container for worry (write it, close it). Water and food before problem-solving. One admin Fox max. Psalm 34:18 and Philippians 4:6-7. Do not demand productivity as proof of faith.'
      },
      {
        id: 'trauma_rage',
        title: 'Threat + Rage',
        feels: 'Body braced, then sudden heat. Old danger feels present. Urge to attack or flee. Shame afterward.',
        try: 'Orient to room and year. Cold water. 90-second rule — no messages. Name the Bodyguard (“protecting me from being hurt again”). Repair later, not mid-wave. You can be angry and still not sin against yourself or others.'
      },
      {
        id: 'adhd_anxiety',
        title: 'Scattered + Anxiety',
        feels: 'Too many tabs, time blindness, and a fear of dropping everything. Starts ten things, finishes none, then self-attack.',
        try: 'One tab. Visual silence. Write the next physical step only. 10/20 rule. Body-double if possible. Shame is not a planner — MVS is. Celebrate opened, not finished.'
      },
      {
        id: 'bipolar_stack',
        title: 'High edge ↔ Heavy crash',
        feels: 'Racing, little sleep, urgency — then emptiness, regret, or depression. Shame about what was said or started while high.',
        try: 'While high: no big decisions 24–48 hrs, protect sleep, tell one safe person, delay spending/commitments. After crash: Level 0 for the body, tiny Fox, no life verdicts. Meds rhythm (AM/PM) is non-negotiable ballast. You are not your last episode.'
      },
      {
        id: 'ocd_shame',
        title: 'Stuck loops + Shame',
        feels: 'Intrusive thoughts, urge to neutralize, then “I am disgusting / broken” for having the thought.',
        try: 'Label: “OCD spike,” not “my true self.” Delay the ritual if safe. Do not argue endlessly with the thought. Return to values-based action (one Fox). Romans 8:1 — no condemnation. Thought ≠ deed ≠ identity.'
      },
      {
        id: 'numb_lonely',
        title: 'Numb / Freeze + Lonely',
        feels: 'Disconnected from body and people. Cannot reach out and cannot feel much. Isolation deepens the fog.',
        try: 'Orient senses first (temperature, feet, three colors). Then one Signal Flare — even “low today.” Do not wait to feel connected before connecting. Presence before depth.'
      },
      {
        id: 'urge_stack',
        title: 'Urge + almost anything',
        feels: 'Craving for substance, escape, or self-harm as relief from the other states.',
        try: 'Urge always jumps the queue. HALT. 15-minute surf. Remove access. Signal Flare or crisis line. Faith is not a substitute for removing the means. Stay alive first — then process the stack.'
      },
      {
        id: 'solutions',
        title: 'What actually helps (when it all hits)',
        body: '• Multi-select your weather — honesty over a single clean label.\\n• Body before insight.\\n• One Fox, not twelve.\\n• Meds AM/PM logged without shame.\\n• Write the noise so it is not only inside.\\n• Scripture as ballast, not a stick.\\n• One safe human > perfect theology in a crisis.\\n• Professional care (doctor, therapist, meds) is wisdom, not failure.\\n• Rest can be obedience.\\n• Tomorrow’s mercy is real — Lamentations 3:22-23.'
      },
      {
        id: 'for_helpers',
        title: 'If you love someone with a stacked mind',
        body: 'Do not demand they pick one feeling. Help with Level 0 before life advice. Ask “body or mind first?” Offer food, water, quiet, or a short walk. Avoid “just choose joy” or “just trust God” as the only tool. Stay for the boring middle — not only the crisis peak. Celebrate small Foxes. You cannot be their Pilot; you can be a steady co-regulator and a pointer back to care.'
      },
    ];


    const colorMap = { green: 'bg-emerald-500', yellow: 'bg-yellow-400', red: 'bg-red-500', orange: 'bg-orange-500', purple: 'bg-purple-500', blue: 'bg-blue-500', white: 'bg-slate-400', amber: 'bg-amber-400', rose: 'bg-rose-500', slate: 'bg-slate-500' };
    const colorBorder = { green: 'border-emerald-500/40', yellow: 'border-yellow-400/40', red: 'border-red-500/40', orange: 'border-orange-500/40', purple: 'border-purple-500/40', blue: 'border-blue-500/40', white: 'border-slate-400/40', amber: 'border-amber-400/40', rose: 'border-rose-500/40', slate: 'border-slate-500/40' };

    function load(key, fallback) {
      try {
        if (typeof window === "undefined") return fallback;
        const r = localStorage.getItem(key);
        return r ? JSON.parse(r) : fallback;
      } catch { return fallback; }
    }
    function save(key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
    }

    export default function App() {
      const [tab, setTab] = useState('cockpit');
      const [selectedStates, setSelectedStates] = useState([]);
      const [anchorIdx, setAnchorIdx] = useState(0);
      const [fox, setFox] = useState(() => load('bw_fox', ''));
      const [note, setNote] = useState('');
      const [logs, setLogs] = useState(() => load('bw_logs', []));
      const [formationMode, setFormationMode] = useState('90');
      const [day90, setDay90] = useState(() => load('bw_day90', 1));
      const [day365, setDay365] = useState(() => load('bw_day365', 1));
      const [completed90, setCompleted90] = useState(() => load('bw_completed90', []));
      const [stability, setStability] = useState(() => load('bw_stability', 78));
      const [journal, setJournal] = useState('');
      const [journalEntries, setJournalEntries] = useState(() => load('bw_journal', []));
      const [favVerses, setFavVerses] = useState(() => load('bw_fav_verses', []));
      const [prayerRequest, setPrayerRequest] = useState('');
      const [myPrayers, setMyPrayers] = useState(() => load('bw_prayers', []));
      const [breathPhase, setBreathPhase] = useState('idle');
      const [breathCount, setBreathCount] = useState(0);
      const [breathRound, setBreathRound] = useState(0);
      const breathTimer = useRef(null);
      const [copiedScript, setCopiedScript] = useState(null);
      const [toolsSub, setToolsSub] = useState('reset');
      const [deferredPrompt, setDeferredPrompt] = useState(null);
      const [installDismissed, setInstallDismissed] = useState(() => load('bw_install_dismissed', false));
      const [encouragementIdx, setEncouragementIdx] = useState(0);
      const [crisisOpen, setCrisisOpen] = useState(false);
      const [crisisStep, setCrisisStep] = useState(0);
      const [packId, setPackId] = useState(null);
      const [dailyFn, setDailyFn] = useState(() => load('bw_daily_fn', {
        sleep: false, medsAM: false, medsPM: false, food: false, move: false, water: false, outside: false, connect: false, word: false, foxDone: false, adminDone: false,
        halt: '', energy: 5, stress: 5, sleepHours: '', adminFox: '', win: '', drain: '', mercy: '', evening: '', date: ''
      }));
      const [dailyHistory, setDailyHistory] = useState(() => load('bw_daily_history', []));
      const [foxHelp, setFoxHelp] = useState(false);
      const [bodyguardHelp, setBodyguardHelp] = useState(false);
      const [showHistory, setShowHistory] = useState(false);
      const [settings, setSettings] = useState(() => load('bw_settings', {
        medsAMTime: '08:00', medsPMTime: '20:00', medsReminders: true, medsLeadMinutes: 0,
        todayMode: false, largeText: false, reduceMotion: false, lang: 'en',
        curriculumMode: false, checkInOpen: false
      }));

      const tx = (s) => translate(settings.lang || "en", s);
      const [checkInStep, setCheckInStep] = useState(0);
      const [toast, setToast] = useState('');
      const [notifPermission, setNotifPermission] = useState(typeof Notification !== 'undefined' ? Notification.permission : 'denied');
      const [nowTick, setNowTick] = useState(() => Date.now());
      const [medsSnooze, setMedsSnooze] = useState(() => load('bw_meds_snooze', { am: 0, pm: 0 }));
      const medsNotified = useRef({ am: '', pm: '' });
      const [customAnchors, setCustomAnchors] = useState(() => load('bw_custom_anchors', []));
      const [safePeople, setSafePeople] = useState(() => load('bw_safe_people', []));
      const [onboarded, setOnboarded] = useState(() => load('bw_onboarded', false));
      const [onboardStep, setOnboardStep] = useState(0);
      const [formSearch, setFormSearch] = useState('');
      const [newAnchor, setNewAnchor] = useState({ lie: '', truth: '', ref: '' });
      const [newPerson, setNewPerson] = useState({ name: '', note: '' });
      const [weeklyNote, setWeeklyNote] = useState(() => load('bw_weekly', { win: '', drain: '', change: '', week: '' }));




      useEffect(() => {
        const t = setInterval(() => setAnchorIdx(i => (i + 1) % ANCHORS.length), 14000);
        return () => clearInterval(t);
      }, []);
      useEffect(() => {
        const t = setInterval(() => setEncouragementIdx(i => (i + 1) % COMMUNITY_ENCOURAGEMENTS.length), 18000);
        return () => clearInterval(t);
      }, []);

      useEffect(() => {
        const handler = (e) => { e.preventDefault(); setDeferredPrompt(e); };
        window.addEventListener('beforeinstallprompt', handler);
        return () => window.removeEventListener('beforeinstallprompt', handler);
      }, []);

      useEffect(() => { save('bw_fox', fox); }, [fox]);
      useEffect(() => { save('bw_logs', logs); }, [logs]);
      useEffect(() => { save('bw_day90', day90); }, [day90]);
      useEffect(() => { save('bw_day365', day365); }, [day365]);
      useEffect(() => { save('bw_completed90', completed90); }, [completed90]);
      useEffect(() => { save('bw_stability', stability); }, [stability]);
      useEffect(() => { save('bw_journal', journalEntries); }, [journalEntries]);
      useEffect(() => { save('bw_fav_verses', favVerses); }, [favVerses]);
      useEffect(() => { save('bw_prayers', myPrayers); }, [myPrayers]);
      useEffect(() => { save('bw_daily_fn', dailyFn); }, [dailyFn]);
      useEffect(() => { save('bw_daily_history', dailyHistory); }, [dailyHistory]);
      useEffect(() => { save('bw_settings', settings); }, [settings]);
      useEffect(() => {
        document.documentElement.style.fontSize = settings.largeText ? '18px' : '16px';
        document.body.style.fontSize = settings.largeText ? '1.05rem' : '';
        document.documentElement.lang = settings.lang || 'en';
      }, [settings.largeText, settings.lang]);

      useEffect(() => { save('bw_meds_snooze', medsSnooze); }, [medsSnooze]);
      useEffect(() => { save('bw_custom_anchors', customAnchors); }, [customAnchors]);
      useEffect(() => { save('bw_safe_people', safePeople); }, [safePeople]);
      useEffect(() => { save('bw_onboarded', onboarded); }, [onboarded]);
      useEffect(() => { save('bw_weekly', weeklyNote); }, [weeklyNote]);


      // Clock tick for countdowns + med reminder window (every 20s)
      useEffect(() => {
        const id = setInterval(() => setNowTick(Date.now()), 20000);
        return () => clearInterval(id);
      }, []);

      useEffect(() => {
        if (!settings.medsReminders) return;
        const parseT = (t) => { const [h, m] = (t || '08:00').split(':').map(Number); return h * 60 + m; };
        const tick = () => {
          const now = new Date();
          const mins = now.getHours() * 60 + now.getMinutes();
          const day = now.toISOString().slice(0, 10);
          const d = load('bw_daily_fn', {});
          const snooze = load('bw_meds_snooze', { am: 0, pm: 0 });
          const lead = Number(settings.medsLeadMinutes) || 0;
          const inWindow = (targetMins) => {
            // Fire from lead minutes before through 15 minutes after scheduled time
            const start = targetMins - lead;
            const end = targetMins + 15;
            return mins >= start && mins <= end;
          };
          const fire = (which, title, body) => {
            if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return;
            try {
              new Notification(title, { body, tag: 'bw-meds-' + which, requireInteraction: true });
            } catch (e) {}
          };
          if (!d.medsAM && inWindow(parseT(settings.medsAMTime)) && medsNotified.current.am !== day && Date.now() >= (snooze.am || 0)) {
            medsNotified.current.am = day;
            fire('am', 'BEE WELL · Morning meds', 'Time for morning meds. Open BEE WELL and check them off when taken.');
          }
          if (!d.medsPM && inWindow(parseT(settings.medsPMTime)) && medsNotified.current.pm !== day && Date.now() >= (snooze.pm || 0)) {
            medsNotified.current.pm = day;
            fire('pm', 'BEE WELL · Evening meds', 'Time for evening meds. Open BEE WELL and check them off when taken.');
          }
        };
        tick();
        const id = setInterval(tick, 20000);
        const onVis = () => { if (document.visibilityState === 'visible') { setNowTick(Date.now()); tick(); } };
        document.addEventListener('visibilitychange', onVis);
        return () => { clearInterval(id); document.removeEventListener('visibilitychange', onVis); };
      }, [settings.medsAMTime, settings.medsPMTime, settings.medsReminders, settings.medsLeadMinutes]);



      const impactMap = { stable: 4, static: -3, heat: -8, shadow: -6, pulse: -5, gravity: -9, fog: -11, mania: -7, panic: -10, shame: -8, grief: -6, obsess: -5, dissoc: -7, urge: -9, burnout: -8, social: -4, lonely: -5, irritable: -5 };

      const toggleState = useCallback((state) => {
        setSelectedStates(prev => {
          const exists = prev.find(s => s.id === state.id);
          if (exists) return prev.filter(s => s.id !== state.id);
          // stable alone clears storms; selecting a storm clears stable
          if (state.id === 'stable') return [state];
          return [...prev.filter(s => s.id !== 'stable'), state];
        });
      }, []);

      const logSelectedStates = useCallback(() => {
        if (selectedStates.length === 0) return;
        const labels = selectedStates.map(s => s.short).join(' + ');
        const entry = { time: new Date().toLocaleString(), state: labels, id: selectedStates.map(s => s.id).join(','), note: note || '' };
        setLogs(prev => [entry, ...prev].slice(0, 120));
        const totalImpact = selectedStates.reduce((sum, s) => sum + (impactMap[s.id] || -3), 0);
        const avgImpact = Math.round(totalImpact / selectedStates.length);
        setStability(s => Math.max(8, Math.min(100, s + avgImpact)));
        setNote('');
      }, [selectedStates, note]);

      const clearStates = () => setSelectedStates([]);

      const matchedProtocols = () => {
        const ids = selectedStates.map(s => s.id);
        return STATE_PROTOCOLS.filter(p => p.match.every(m => ids.includes(m)) || (p.match.length === 1 && ids.includes(p.match[0])));
      };

      const todayKey = () => new Date().toISOString().slice(0, 10);
      const blankDaily = (t) => ({
        sleep: false, medsAM: false, medsPM: false, food: false, move: false, water: false, outside: false, connect: false, word: false, foxDone: false, adminDone: false,
        halt: '', energy: 5, stress: 5, sleepHours: '', adminFox: '', win: '', drain: '', mercy: '', evening: '', date: t
      });
      const ensureDailyDate = () => {
        const t = todayKey();
        if (dailyFn.date !== t) {
          // archive previous day if it had progress
          if (dailyFn.date && dailyFn.date !== t) {
            const prevScore = ['sleep','medsAM','medsPM','food','move','water','outside','connect','word'].filter(k => dailyFn[k]).length;
            if (prevScore > 0 || dailyFn.foxDone) {
              setDailyHistory(h => {
                const without = h.filter(x => x.date !== dailyFn.date);
                return [{ date: dailyFn.date, score: prevScore, medsAM: !!dailyFn.medsAM, medsPM: !!dailyFn.medsPM, foxDone: !!dailyFn.foxDone, energy: dailyFn.energy, stress: dailyFn.stress }, ...without].slice(0, 60);
              });
            }
          }
          setDailyFn(blankDaily(t));
        }
      };
      const patchDaily = (patch) => {
        const t = todayKey();
        setDailyFn(d => {
          const base = d.date === t ? d : blankDaily(t);
          return { ...base, ...patch, date: t };
        });
      };
      const foundationKeys = ['sleep','medsAM','medsPM','food','move','water','outside','connect','word'];
      const dailyScore = () => foundationKeys.filter(k => dailyFn[k]).length;
      const parseMedTime = (t) => { const [h, m] = (t || '08:00').split(':').map(Number); return h * 60 + m; };
      const medsOnTrack = () => {
        if (dailyFn.medsAM && dailyFn.medsPM) return 'complete';
        const now = new Date(nowTick);
        const mins = now.getHours() * 60 + now.getMinutes();
        const am = parseMedTime(settings.medsAMTime);
        const pm = parseMedTime(settings.medsPMTime);
        if (!dailyFn.medsAM && mins >= am) {
          if (mins >= pm && !dailyFn.medsPM) return 'am_missed';
          return 'am_due';
        }
        if (dailyFn.medsAM && !dailyFn.medsPM && mins >= pm) return 'pm_due';
        if (!dailyFn.medsAM && !dailyFn.medsPM) return 'both_open';
        return 'open';
      };
      const nextMedInfo = () => {
        const now = new Date(nowTick);
        const mins = now.getHours() * 60 + now.getMinutes();
        const am = parseMedTime(settings.medsAMTime);
        const pm = parseMedTime(settings.medsPMTime);
        const fmt = (t) => t || '—';
        if (!dailyFn.medsAM) {
          if (mins < am) {
            const diff = am - mins;
            return { which: 'morning', label: 'Morning meds', time: fmt(settings.medsAMTime), due: false, minsLeft: diff, text: `Morning in ${diff} min · ${settings.medsAMTime}` };
          }
          return { which: 'morning', label: 'Morning meds', time: fmt(settings.medsAMTime), due: true, minsLeft: 0, text: `Morning meds due now · set for ${settings.medsAMTime}` };
        }
        if (!dailyFn.medsPM) {
          if (mins < pm) {
            const diff = pm - mins;
            return { which: 'evening', label: 'Evening meds', time: fmt(settings.medsPMTime), due: false, minsLeft: diff, text: `Evening in ${diff} min · ${settings.medsPMTime}` };
          }
          return { which: 'evening', label: 'Evening meds', time: fmt(settings.medsPMTime), due: true, minsLeft: 0, text: `Evening meds due now · set for ${settings.medsPMTime}` };
        }
        return { which: 'done', label: 'Meds complete', time: '', due: false, minsLeft: null, text: 'Both doses checked off today ✓' };
      };
      const snoozeMed = (which, minutes) => {
        const until = Date.now() + minutes * 60 * 1000;
        setMedsSnooze(s => ({ ...s, [which === 'morning' ? 'am' : 'pm']: until }));
        // allow re-notify after snooze
        if (which === 'morning') medsNotified.current.am = '';
        else medsNotified.current.pm = '';
      };
      const testMedNotification = async () => {
        if (typeof Notification === 'undefined') {
          alert('Notifications not available in this browser. You can still use in-app due banners and check-off.');
          return;
        }
        if (Notification.permission !== 'granted') {
          const p = await Notification.requestPermission();
          setNotifPermission(p);
          if (p !== 'granted') return;
        }
        try {
          new Notification('BEE WELL · Test reminder', { body: 'If you see this, notifications are working. Your AM/PM times will alert the same way.', tag: 'bw-meds-test' });
        } catch (e) {
          alert('Could not show notification.');
        }
      };
      const onTrackLabel = () => {
        const s = dailyScore();
        const meds = medsOnTrack();
        if (meds === 'complete' && s >= 6 && dailyFn.foxDone) return { text: tx('On track', color: 'text-emerald-400', detail: tx('Foundations, meds, and Fox are landing.') };
        if (meds === 'am_due' || meds === 'pm_due') return { text: tx('Meds due', color: 'text-amber-400', detail: meds === 'am_due' ? tx('Morning meds not logged yet.') : tx('Evening meds not logged yet.') };
        if (meds === 'am_missed') return { text: tx('Morning meds missed', color: 'text-red-400', detail: tx('Log AM if you took them late — honesty over perfect timing.') };
        if (s >= 5) return { text: tx('Building ballast', color: 'text-emerald-300', detail: `${s}/9 ${tx('foundations · keep going.')}` };
        if (s >= 2) return { text: tx('Getting started', color: 'text-amber-300', detail: `${s}/9 ${tx('foundations · small is still progress.')}` };
        return { text: tx('Open day', color: 'text-slate-400', detail: tx('Tap foundations as you go. Meds AM/PM track separately.') };
      };
      const saveDayToHistory = () => {
        const t = todayKey();
        const score = dailyScore();
        setDailyHistory(h => {
          const without = h.filter(x => x.date !== t);
          return [{ date: t, score, medsAM: !!dailyFn.medsAM, medsPM: !!dailyFn.medsPM, foxDone: !!dailyFn.foxDone, energy: dailyFn.energy, stress: dailyFn.stress }, ...without].slice(0, 60);
        });
      };
      const streakCount = () => {
        // consecutive days ending today or yesterday with score >= 3 or meds complete
        const byDate = {};
        dailyHistory.forEach(x => { byDate[x.date] = x; });
        const t = todayKey();
        const todayScore = dailyScore();
        if (todayScore >= 3 || (dailyFn.medsAM && dailyFn.medsPM)) {
          byDate[t] = { date: t, score: todayScore, medsAM: dailyFn.medsAM, medsPM: dailyFn.medsPM };
        }
        let streak = 0;
        let d = new Date();
        for (let i = 0; i < 60; i++) {
          const key = d.toISOString().slice(0, 10);
          const entry = byDate[key];
          const ok = entry && (entry.score >= 3 || (entry.medsAM && entry.medsPM));
          if (ok) { streak++; d.setDate(d.getDate() - 1); }
          else if (i === 0) { d.setDate(d.getDate() - 1); continue; } // allow today empty
          else break;
        }
        return streak;
      };

      const patternInsights = () => {
        const rows = [...dailyHistory];
        const t = todayKey();
        rows.unshift({ date: t, score: dailyScore(), medsAM: dailyFn.medsAM, medsPM: dailyFn.medsPM, energy: dailyFn.energy, stress: dailyFn.stress });
        if (rows.length < 3) return ['Keep logging a few days — patterns appear after several check-ins.'];
        const tips = [];
        const lowMeds = rows.filter(r => r.medsAM === false || r.medsPM === false).length;
        if (lowMeds >= Math.ceil(rows.length * 0.4)) tips.push('Meds are often incomplete across recent days. Reminder times + check-off can steady the rhythm.');
        const lowScore = rows.filter(r => (r.score || 0) < 3).length;
        if (lowScore >= Math.ceil(rows.length * 0.5)) tips.push('Foundations are often thin. Lead with sleep, food, water before hard tasks.');
        const highStress = rows.filter(r => (r.stress || 0) >= 8).length;
        if (highStress >= 3) tips.push('Stress runs high on several days. Default to one Fox and the 70% Governor.');
        const lowEnergy = rows.filter(r => (r.energy || 5) <= 3).length;
        if (lowEnergy >= 3) tips.push('Energy often reads low. Rest and meds may matter more than productivity pushes.');
        const logsHeavy = logs.filter(l => /Heavy|Freeze|Panic|Shame|Urge/i.test(l.state || '')).length;
        if (logsHeavy >= 5) tips.push('Weather logs often include Heavy, Freeze, Panic, Shame, or Urge — keep Level 0 and Stacks handy.');
        if (!tips.length) tips.push('Recent days look relatively steady. Keep the rhythm: meds, one Fox, honest weather.');
        return tips.slice(0, 4);
      };

      const shareTodayCard = async () => {
        const text = `BEE WELL · Today\\nFox: ${fox || '(not set)'}\\nMeds: ${dailyFn.medsAM ? 'AM✓' : 'AM·'} ${dailyFn.medsPM ? 'PM✓' : 'PM·'}\\nFoundations: ${dailyScore()}/9\\nVerse: "${dailyVerse.text}" — ${dailyVerse.ref}\\n\\nWells of Salvation`;
        if (navigator.share) {
          try { await navigator.share({ title: 'BEE WELL Today', text }); return; } catch(e) {}
        }
        copyText(text);
      };

      const exportTherapistPacket = () => {
        const insights = patternInsights().join('\\n- ');
        const recent = logs.slice(0, 15).map(l => `${l.time} | ${l.state}`).join('\\n');
        const hist = dailyHistory.slice(0, 14).map(h => `${h.date} score=${h.score} meds=${h.medsAM?'AM':'-'}/${h.medsPM?'PM':'-'} E${h.energy||'?'} S${h.stress||'?'}`).join('\\n');
        const text = `BEE WELL · Care packet (user-controlled)\\nExported: ${new Date().toISOString()}\\n\\nNote: Journal contents are NOT included unless the person adds them separately.\\n\\nPatterns:\\n- ${insights}\\n\\nRecent weather logs:\\n${recent || '(none)'}\\n\\nDaily function history:\\n${hist || '(none)'}\\n\\nCurrent Fox: ${fox || '(none)'}\\nStability index: ${stability}\\n`;
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = `bee-well-care-packet-${todayKey()}.txt`; a.click(); URL.revokeObjectURL(url);
      };

      const requestNotifPermission = async () => {
        if (typeof Notification === 'undefined') { alert(tx('Notifications are not available in this browser. You can still set times and check off meds in the app.')); return; }
        const p = await Notification.requestPermission();
        setNotifPermission(p);
        if (p === 'granted') {
          try { new Notification('BEE WELL reminders on', { body: 'Morning and evening meds will notify at your set times while the app can run in the background/tab.', tag: 'bw-meds-on' }); } catch(e) {}
        }
      };

      const patchSettings = (patch) => setSettings(s => ({ ...s, ...patch }));



      const copyText = async (text) => {
        try { await navigator.clipboard.writeText(text); setCopiedScript('ok'); setTimeout(() => setCopiedScript(null), 1500); } catch (e) { alert(tx('Copy failed — select and copy manually.')); }
      };


      const saveJournal = () => {
        if (!journal.trim()) return;
        setJournalEntries(prev => [{ time: new Date().toLocaleString(), text: journal.trim() }, ...prev].slice(0, 80));
        setJournal('');
      };

      const toggleFavVerse = (v) => {
        const key = v.ref + v.text.slice(0, 20);
        setFavVerses(prev => {
          const exists = prev.find(f => f.ref === v.ref && f.text === v.text);
          if (exists) return prev.filter(f => !(f.ref === v.ref && f.text === v.text));
          return [{ ...v }, ...prev].slice(0, 40);
        });
      };

      const isFav = (v) => favVerses.some(f => f.ref === v.ref && f.text === v.text);

      const savePrayer = () => {
        if (!prayerRequest.trim()) return;
        setMyPrayers(prev => [{ time: new Date().toLocaleString(), text: prayerRequest.trim() }, ...prev].slice(0, 30));
        setPrayerRequest('');
      };

      const markDay90 = () => {
        if (!completed90.includes(day90)) setCompleted90(prev => [...prev, day90].sort((a,b)=>a-b));
      };

      const startBreath = () => {
        if (breathTimer.current) clearInterval(breathTimer.current);
        setBreathRound(0);
        setBreathPhase('inhale');
        setBreathCount(4);
        let phase = 'inhale', count = 4, round = 0;
        breathTimer.current = setInterval(() => {
          count -= 1;
          if (count <= 0) {
            if (phase === 'inhale') { phase = 'hold1'; count = 4; }
            else if (phase === 'hold1') { phase = 'exhale'; count = 4; }
            else if (phase === 'exhale') { phase = 'hold2'; count = 4; }
            else {
              round += 1;
              if (round >= 4) { clearInterval(breathTimer.current); setBreathPhase('done'); setBreathRound(4); return; }
              phase = 'inhale'; count = 4;
            }
            setBreathPhase(phase); setBreathRound(round);
          }
          setBreathCount(count);
        }, 1000);
      };
      const stopBreath = () => {
        if (breathTimer.current) clearInterval(breathTimer.current);
        setBreathPhase('idle'); setBreathCount(0); setBreathRound(0);
      };

      
      const importBackup = (file) => {
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const data = JSON.parse(reader.result);
            if (data.logs) setLogs(data.logs);
            if (data.journalEntries || data.journal) setJournalEntries(data.journalEntries || data.journal);
            if (data.fox != null) setFox(data.fox);
            if (data.day90) setDay90(data.day90);
            if (data.day365) setDay365(data.day365);
            if (data.completed90) setCompleted90(data.completed90);
            if (data.stability != null) setStability(data.stability);
            if (data.favVerses) setFavVerses(data.favVerses);
            if (data.dailyFn) setDailyFn(data.dailyFn);
            if (data.dailyHistory) setDailyHistory(data.dailyHistory);
            if (data.settings) setSettings(s => ({ ...s, ...data.settings }));
            if (data.customAnchors) setCustomAnchors(data.customAnchors);
            if (data.safePeople) setSafePeople(data.safePeople);
            alert(tx('Backup imported. Your data is restored on this device.'));
          } catch (e) {
            alert(tx('Could not read that file. Use an Export All (JSON) from BEE WELL.'));
          }
        };
        reader.readAsText(file);
      };

      const allAnchors = () => [...ANCHORS, ...customAnchors.map(a => ({ lie: a.lie, truth: a.truth, ref: a.ref || 'Personal' }))];
      const currentAnchorLive = () => {
        const list = allAnchors();
        return list[anchorIdx % list.length] || ANCHORS[0];
      };

      const signalFlareFor = (person) => {
        const msg = `Hey${person.name ? ' ' + person.name : ''}. I'm not okay right now and I need someone to know. I don't need solutions yet — just presence if you can.`;
        if (navigator.share) {
          navigator.share({ text: msg }).catch(() => copyText(msg));
        } else {
          copyText(msg);
        }
      };

      const weekKey = () => {
        const d = new Date();
        const onejan = new Date(d.getFullYear(), 0, 1);
        const week = Math.ceil((((d - onejan) / 86400000) + onejan.getDay() + 1) / 7);
        return d.getFullYear() + '-W' + week;
      };

const handleInstall = async () => {
        if (!deferredPrompt) {
          alert(tx('To install: use your browser menu → “Add to Home Screen” / “Install App”. On iPhone: Share → Add to Home Screen.'));
          return;
        }
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') setDeferredPrompt(null);
      };

      const currentAnchor = currentAnchorLive();
      const current90 = FORMATION_90.find(d => d.day === day90) || FORMATION_90.find(d => d.day <= day90) || FORMATION_90[0];
      const current365 = FORMATION_365.find(d => d.day === day365) || FORMATION_365.reduce((a, b) => (b.day <= day365 ? b : a), FORMATION_365[0]);
      const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
      const dailyVerse = DAILY_VERSES[dayOfYear % DAILY_VERSES.length];
      const encouragement = COMMUNITY_ENCOURAGEMENTS[encouragementIdx];

      const NavButton = ({ id, label, icon }) => (
        <button onClick={() => setTab(id)} className={`flex flex-col items-center gap-0.5 px-2 py-2 rounded-xl transition-all ${tab === id ? 'text-amber-400 bg-amber-400/10' : 'text-slate-500 hover:text-slate-300'}`}>
          <span className="text-base leading-none">{icon}</span>
          <span className="text-[9px] font-medium tracking-wide">{tx(label)}</span>
        </button>
      );

      // COCKPIT
      const Cockpit = () => (
        <div className="space-y-4 pb-4">
          {!onboarded && (
            <div className="rounded-2xl bg-gradient-to-br from-amber-950/60 to-slate-900 border border-amber-700/40 p-5 space-y-3">
              <div className="text-[10px] uppercase tracking-widest text-amber-500">{tx("Welcome · BEE WELL")}</div>
              {onboardStep === 0 && (
                <>
                  <p className="text-sm text-slate-200 leading-relaxed">{tx("This is a regulation + formation kit — not a replacement for a doctor, therapist, or emergency care. When the Pilot is offline, we start with the body. Then one Fox. Then the Word.")}</p>
                  <button onClick={() => setOnboardStep(1)} className="w-full py-2.5 rounded-xl bg-amber-600 text-white text-sm font-medium">{tx("Continue")}</button>
                </>
              )}
              {onboardStep === 1 && (
                <>
                  <p className="text-sm text-slate-200 leading-relaxed">{tx("Cockpit is your weather, Fox, meds, and tank. I'm not okay guides you step by step. Formation holds the 90-day and 365 tracks.")}</p>
                  <button onClick={() => setOnboardStep(2)} className="w-full py-2.5 rounded-xl bg-amber-600 text-white text-sm font-medium">{tx("Continue")}</button>
                </>
              )}
              {onboardStep === 2 && (
                <>
                  <p className="text-sm text-slate-200 leading-relaxed">{tx("Set morning/evening med times below. Add a safe person in Vault. Your data stays on this device — Export JSON to back up.")}</p>
                  <button onClick={() => setOnboarded(true)} className="w-full py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-medium">{tx("Enter BEE WELL")}</button>
                </>
              )}
            </div>
          )}
          {!installDismissed && (
            <div className="rounded-2xl bg-amber-950/40 border border-amber-700/40 p-3.5 flex items-center justify-between gap-3">
              <div className="text-sm text-amber-100">{tx("Install BEE WELL on your home screen for offline access.")}</div>
              <div className="flex gap-2 shrink-0">
                <button onClick={handleInstall} className="px-3 py-1.5 rounded-lg bg-amber-600 text-white text-xs font-medium">{tx("Install")}</button>
                <button onClick={() => { setInstallDismissed(true); save('bw_install_dismissed', true); }} className="px-2 py-1.5 text-slate-400 text-xs">{tx("Later")}</button>
              </div>
            </div>
          )}

          <button
            onClick={() => { setCrisisOpen(true); setCrisisStep(0); }}
            className="w-full py-4 rounded-2xl bg-red-950/50 border-2 border-red-700/60 text-red-100 font-semibold text-base shadow-lg shadow-red-950/30"
          >
            I'm not okay — guide me
          </button>

          {crisisOpen && (
            <div className="rounded-2xl bg-slate-900 border border-red-800/50 p-5 space-y-4">
              <div className="flex justify-between items-center">
                <div className="text-[10px] uppercase tracking-widest text-red-400">Crisis pathway · Step {crisisStep + 1} of 5</div>
                <button onClick={() => setCrisisOpen(false)} className="text-slate-500 text-sm">{tx("Close")}</button>
              </div>
              {crisisStep === 0 && (
                <div className="space-y-3">
                  <p className="text-sm text-slate-200 font-medium">{tx("Do these in order. Do not decide anything else for the next few minutes.")}</p>
                  <ol className="text-sm text-slate-300 space-y-2 list-decimal list-inside">
                    <li>{tx("Cold water on face or wrists — 20–30 seconds.")}</li>
                    <li>{tx("Name three objects in the room out loud.")}</li>
                    <li>{tx("Name the year and where you are.")}</li>
                    <li>{tx("One physical move: stand or stretch 10 seconds.")}</li>
                    <li>{tx("Wait 90 seconds before any message or decision.")}</li>
                  </ol>
                  <button onClick={() => setCrisisStep(1)} className="w-full py-3 rounded-xl bg-red-800 text-white text-sm font-medium">{tx("Done — next")}</button>
                </div>
              )}
              {crisisStep === 1 && (
                <div className="space-y-3 text-center">
                  <p className="text-sm text-slate-300">{tx("Box breath helps the wave pass. Longer exhale if you can.")}</p>
                  <button onClick={() => { setCrisisOpen(false); setTab('tools'); setToolsSub('breath'); startBreath(); }} className="w-full py-3 rounded-xl bg-amber-600 text-white text-sm font-medium">{tx("Start Box Breath")}</button>
                  <button onClick={() => setCrisisStep(2)} className="w-full py-2.5 rounded-xl bg-slate-800 text-slate-300 text-sm">{tx("Skip to next")}</button>
                </div>
              )}
              {crisisStep === 2 && (
                <div className="space-y-3">
                  <p className="text-sm text-slate-300">{tx("You do not have to be alone in this. Copy a Signal Flare if you can send it.")}</p>
                  <div className="bg-slate-800/50 rounded-xl p-3 text-sm text-slate-200">{tx("Hey. I'm not okay right now and I need someone to know. I don't need solutions yet — just presence if you can.")}</div>
                  <button onClick={() => { navigator.clipboard?.writeText("Hey. I'm not okay right now and I need someone to know. I don't need solutions yet — just presence if you can."); setCrisisStep(3); }} className="w-full py-3 rounded-xl bg-indigo-600 text-white text-sm font-medium">{tx("Copy & continue")}</button>
                  <button onClick={() => setCrisisStep(3)} className="w-full py-2.5 rounded-xl bg-slate-800 text-slate-300 text-sm">{tx("Skip")}</button>
                </div>
              )}
              {crisisStep === 3 && (
                <div className="space-y-3">
                  <p className="text-sm text-slate-300">{tx("One truth to hold while the feeling is loud:")}</p>
                  <div className="bg-slate-800/50 rounded-xl p-3">
                    <div className="text-sm text-slate-500 line-through mb-1">{tx(currentAnchor.lie)}</div>
                    <div className="text-base text-amber-100 font-medium">{tx(currentAnchor.truth)}</div>
                    <div className="text-xs text-amber-600 mt-2">{currentAnchor.ref}</div>
                  </div>
                  <button onClick={() => setCrisisStep(4)} className="w-full py-3 rounded-xl bg-amber-600 text-white text-sm font-medium">{tx("Next")}</button>
                </div>
              )}
              {crisisStep === 4 && (
                <div className="space-y-3">
                  <p className="text-sm text-slate-300">{tx("If you may act on suicidal thoughts now, have seriously harmed yourself, or cannot stay safe, call your local emergency number or go to the nearest emergency department. Otherwise, choose a support option below.")}</p>
                  {CRISIS.map((c, i) => (
                    <div key={i} className="p-2.5 rounded-lg bg-slate-800/40 text-sm">
                      <div className="text-white font-medium">{c.name}</div>
                      <div className="text-amber-300/90 text-xs">{c.detail}</div>
                      {c.note && <div className="text-slate-500 text-[11px] mt-0.5">{c.note}</div>}
                      <div className="flex flex-wrap gap-2 mt-2">
                        {c.callUrl && <a href={c.callUrl} className="text-xs px-2.5 py-1 rounded-lg bg-amber-700/80 text-white">{tx("Call")}</a>}
                        {c.textUrl && <a href={c.textUrl} className="text-xs px-2.5 py-1 rounded-lg bg-indigo-700/80 text-white">{tx("Text")}</a>}
                        {c.url && <a href={c.url} target="_blank" rel="noreferrer" className="text-xs px-2.5 py-1 rounded-lg bg-slate-700 text-slate-100">{tx("Support website ↗")}</a>}
                      </div>
                    </div>
                  ))}
                  <button onClick={() => setCrisisOpen(false)} className="w-full py-3 rounded-xl bg-slate-700 text-white text-sm font-medium">{tx("I'm steadier — close")}</button>
                  <button onClick={() => { setCrisisOpen(false); setTab('write'); }} className="w-full py-2.5 rounded-xl bg-slate-800 text-slate-300 text-sm">{tx("Go to Write")}</button>
                </div>
              )}
            </div>
          )}

          <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950/40 border border-indigo-800/30 p-4 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-[10px] uppercase tracking-widest text-indigo-400">{tx("Today")}</div>
                <div className={`text-sm font-semibold mt-0.5 ${onTrackLabel().color}`}>{onTrackLabel().text}</div>
                <div className="text-xs text-slate-400 mt-0.5">{onTrackLabel().detail}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-500">{tx("Streak")}</div>
                <div className="text-xl font-bold text-white">{streakCount()}<span className="text-xs text-slate-500 font-normal">d</span></div>
              </div>
            </div>
            <div className="bg-slate-900/70 rounded-xl p-3">
              <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">{tx("Great Fox")}</div>
              <div className="text-sm text-white font-medium">{fox || 'Not named yet — set it below'}</div>
              <button
                onClick={() => patchDaily({ foxDone: !dailyFn.foxDone })}
                className={`mt-2 text-xs px-2.5 py-1 rounded-lg border ${dailyFn.foxDone ? 'border-emerald-500/50 text-emerald-300 bg-emerald-950/30' : 'border-slate-600 text-slate-400'}`}
              >{dailyFn.foxDone ? tx('✓ Fox moved') : tx('Mark Fox done')}</button>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-slate-900/70 rounded-lg p-2">
                <div className="text-slate-500">{tx("Foundations")}</div>
                <div className="text-white font-semibold text-sm">{dailyScore()}/9</div>
              </div>
              <div className="bg-slate-900/70 rounded-lg p-2">
                <div className="text-slate-500">{tx("Meds")}</div>
                <div className={`font-semibold text-sm ${dailyFn.medsAM && dailyFn.medsPM ? 'text-emerald-400' : nextMedInfo().due ? 'text-amber-400' : 'text-slate-300'}`}>
                  {dailyFn.medsAM ? 'AM✓' : 'AM·'} {dailyFn.medsPM ? 'PM✓' : 'PM·'}
                </div>
                <div className="text-[9px] text-slate-500 mt-0.5 leading-tight">{nextMedInfo().which === 'done' ? 'Done' : nextMedInfo().due ? tx('Due now') : nextMedInfo().minsLeft != null ? `${nextMedInfo().minsLeft}m` : ''}</div>
              </div>
              <div className="bg-slate-900/70 rounded-lg p-2">
                <div className="text-slate-500">{tx("Tank")}</div>
                <div className="text-white font-semibold text-sm">⚡{dailyFn.energy || 5} · ⚠{dailyFn.stress || 5}</div>
              </div>
            </div>
            <div className="text-[11px] text-slate-500 leading-relaxed">
              <span className="text-slate-400 font-medium">{tx("Tank:")}</span> Energy (how full you feel) and Stress (how loaded you feel), 1–10. Set the sliders in Daily Function below. Low energy or high stress = shrink the plan.
            </div>
            {dailyFn.adminFox && (
              <div className="text-xs text-slate-400">{tx("Admin:")} <span className="text-slate-200">{dailyFn.adminFox}</span>
                <button onClick={() => patchDaily({ adminDone: !dailyFn.adminDone })} className="ml-2 text-amber-500">{dailyFn.adminDone ? '✓' : tx('Mark done')}</button>
              </div>
            )}
            <button onClick={shareTodayCard} className="w-full py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-300">{tx("Share today’s card")}</button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => { setTab('formation'); setFormationMode('90'); }} className="rounded-xl bg-indigo-950/40 border border-indigo-800/40 p-3 text-left">
              <div className="text-[10px] uppercase tracking-widest text-indigo-400">{tx("90-Day")}</div>
              <div className="text-lg font-semibold text-white">Day {day90}</div>
              <div className="text-[11px] text-slate-400 truncate">{(FORMATION_90.find(d => d.day === day90) || {}).title || tx('Open track')}</div>
            </button>
            <button onClick={() => { setTab('formation'); setFormationMode('365'); }} className="rounded-xl bg-amber-950/40 border border-amber-800/40 p-3 text-left">
              <div className="text-[10px] uppercase tracking-widest text-amber-500">{tx("365 House")}</div>
              <div className="text-lg font-semibold text-white">Day {day365}</div>
              <div className="text-[11px] text-slate-400 truncate">{(FORMATION_365.find(d => d.day === day365) || {}).title || tx('Open track')}</div>
            </button>
          </div>

          {safePeople.length > 0 && (
            <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-3">
              <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-2">{tx("Signal Flare · safe people")}</div>
              <div className="flex flex-wrap gap-2">
                {safePeople.map((p, i) => (
                  <button key={i} onClick={() => signalFlareFor(p)} className="px-3 py-2 rounded-xl bg-indigo-600/80 text-white text-xs font-medium">{p.name}</button>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-2xl bg-gradient-to-br from-amber-950/70 to-slate-900 border border-amber-800/40 p-5">
            <div className="flex justify-between items-start">
              <div className="text-[10px] uppercase tracking-widest text-amber-500/90 mb-2 flex items-center gap-1.5">{tx("📖 Daily Verse")}</div>
              <button onClick={() => toggleFavVerse(dailyVerse)} className="text-lg leading-none" title={tx("Favorite")}>{isFav(dailyVerse) ? '★' : '☆'}</button>
            </div>
            <div className="text-[15px] font-medium text-amber-50 leading-relaxed">“{dailyVerse.text}”</div>
            <div className="text-sm text-amber-400/90 mt-2.5 font-medium">{dailyVerse.ref}</div>
          </div>

          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4">
            <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">{tx("Truth Rotation · Lie → Truth")}</div>
            <div className="text-sm text-slate-500 line-through mb-1">{tx(currentAnchor.lie)}</div>
            <div className="text-base font-medium text-amber-100 leading-snug">{tx(currentAnchor.truth)}</div>
            <div className="text-xs text-amber-600/80 mt-2">{currentAnchor.ref}</div>
          </div>

          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5">
            <div className="flex justify-between items-center mb-2">
              <div className="text-[10px] uppercase tracking-widest text-slate-500">{tx("The Great Fox · One lever")}</div>
              <button onClick={() => setFoxHelp(h => !h)} className="text-[10px] text-amber-500 uppercase tracking-wide">{foxHelp ? tx('Hide') : tx('What is this?')}</button>
            </div>
            {foxHelp && (
              <div className="mb-4 p-3 rounded-xl bg-amber-950/30 border border-amber-800/40 text-sm text-slate-300 space-y-2 leading-relaxed text-left">
                <p>{tx("The Great Fox is your one highest-leverage move for today — the single action that makes everything else easier or less necessary.")}</p>
                <p>{tx("It comes from the idea of prioritization under limited capacity: when the mind is full, a long to-do list becomes another wall. One Fox cuts through the noise.")}</p>
                <p className="text-slate-400">{tx("Good Fox examples: “Send the one email.” “Take the meds.” “Open Formation Day 12.” “Call Mom for 5 minutes.” “Put laundry in the machine — don’t fold yet.”")}</p>
                <p className="text-slate-400">{tx("Bad Fox examples: “Fix my whole life.” “Catch up on everything.” “Be productive.” Those are wishes, not levers.")}</p>
                <p><span className="text-amber-200 font-medium">{tx("70% Governor:")}</span> {tx("leave buffer. If the Fox costs your entire tank, shrink it until it is doable. An unfinished small Fox beats a heroic plan you abandon.")}</p>
                <p><span className="text-amber-200 font-medium">{tx("MVS link:")}</span> {tx("if the Fox still feels huge, turn it into a Minimum Viable Shift (Tools → MVS) — the smallest physical start.")}</p>
              </div>
            )}
            {fox ? <div className="text-lg font-semibold text-white mb-3 text-center">{fox}</div> : <div className="text-slate-400 mb-3 text-sm text-center">{tx("Name the one thing that matters most today.")}</div>}
            <input value={fox} onChange={e => setFox(e.target.value)} placeholder={tx("My Great Fox today is…")} className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50" />
            <div className="text-[11px] text-slate-500 mt-2 text-center">{tx("One lever. Leave 30% buffer. Celebrate motion, not perfection.")}</div>
          </div>

          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4">
            <div className="flex justify-between items-end mb-2">
              <div>
                <div className="text-[10px] uppercase tracking-widest text-slate-500">{tx("Stability Index")}</div>
                <div className="text-3xl font-bold text-white">{stability}</div>
              </div>
              <div className={`text-sm font-medium ${stability >= 70 ? 'text-emerald-400' : stability >= 40 ? 'text-amber-400' : 'text-red-400'}`}>
                {stability >= 70 ? tx('Calm') : stability >= 40 ? tx('Elevated') : tx('Critical')}
              </div>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-700 ${stability >= 70 ? 'bg-emerald-500' : stability >= 40 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${stability}%` }} />
            </div>
          </div>

          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4">
            <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">{tx("Weather Check · Select All That Apply")}</div>
            <div className="text-xs text-slate-500 mb-3">{tx("You can run more than one weather system at once. Tap to select / deselect.")}</div>
            {selectedStates.length > 0 ? (
              <div className="mb-4 space-y-3">
                <div className="flex flex-wrap gap-1.5">
                  {selectedStates.map(s => (
                    <span key={s.id} className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border ${colorBorder[s.color]} bg-slate-800/80 text-slate-200`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${colorMap[s.color]}`} />
                      {tx(s.short)}
                    </span>
                  ))}
                </div>
                <div className="p-3.5 rounded-xl border border-slate-700 bg-slate-800/50 space-y-3">
                  <div className="text-[10px] uppercase tracking-widest text-amber-500/90">{tx("Combined Response")}</div>
                  {selectedStates.map(s => (
                    <div key={s.id} className="text-sm border-b border-slate-700/60 pb-2 last:border-0 last:pb-0">
                      <div className="font-medium text-white flex items-center gap-2 mb-0.5">
                        <span className={`w-2 h-2 rounded-full ${colorMap[s.color]}`} />
                        {tx(s.label)}
                      </div>
                      <div className="text-slate-400 text-xs mb-1">{tx(s.desc)}</div>
                      <div className="text-amber-200/90 text-xs font-medium">→ {tx(s.correction)}</div>
                      <div className="text-slate-500 text-xs mt-1 leading-relaxed">{tx(s.protocol)}</div>
                    </div>
                  ))}
                  {selectedStates.length > 1 && (
                    <div className="text-xs text-indigo-300/90 pt-1 leading-relaxed">
                      Stack rule: regulate the body first (panic, rage, freeze, urge), then the mind (anxiety, stuck, shame), then the story (grief, loneliness). One Level 0 beats three unfinished plans.
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button onClick={logSelectedStates} className="flex-1 py-2.5 rounded-xl bg-amber-600 text-white text-sm font-medium">{tx("Log These States")}</button>
                  <button onClick={clearStates} className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-sm">{tx("Clear")}</button>
                </div>
              </div>
            ) : (
              <div className="text-slate-500 text-sm mb-3">{tx("Tap one or more states below.")}</div>
            )}
            <div className="grid grid-cols-2 gap-2">
              {STATES.map(s => {
                const on = selectedStates.some(x => x.id === s.id);
                return (
                  <button key={s.id} onClick={() => toggleState(s)} className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-left text-sm transition-all active:scale-[0.98] ${on ? `${colorBorder[s.color]} bg-slate-800 ring-1 ring-offset-0 ring-amber-500/30` : 'border-slate-700 bg-slate-800/40'}`}>
                    <span className={`w-2 h-2 rounded-full shrink-0 ${colorMap[s.color]}`} />
                    <span className="text-slate-200 truncate">{tx(s.short)}</span>
                    {on && <span className="ml-auto text-amber-400 text-xs">✓</span>}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4">
            <div className="flex justify-between items-center mb-2">
              <div className="text-[10px] uppercase tracking-widest text-slate-500">{tx("Name the Bodyguard")}</div>
              <button onClick={() => setBodyguardHelp(h => !h)} className="text-[10px] text-amber-500 uppercase tracking-wide">{bodyguardHelp ? tx('Hide') : tx('What is this?')}</button>
            </div>
            {bodyguardHelp && (
              <div className="mb-3 p-3 rounded-xl bg-slate-800/60 border border-slate-700 text-sm text-slate-300 space-y-2 leading-relaxed">
                <p>{tx("The Bodyguard is the part of your brain trying to protect you — even when that looks like panic, rage, shutdown, scrolling, or shutting people out.")}</p>
                <p>{tx("It is not the enemy. It is often an old strategy that once kept you safe and is now running too loud or too late. Naming it reduces shame and gives the Pilot something concrete to work with.")}</p>
                <p className="text-slate-400">{tx("Examples: “Protecting me from rejection.” “Protecting me from failing in public.” “Protecting me from feeling the grief.” “Protecting me from being controlled.” “Protecting me from boredom / emptiness.”")}</p>
                <p>{tx("Once named, you can thank the Bodyguard for trying — and still choose a wiser next step (Level 0, one Fox, a boundary, a Signal Flare).")}</p>
              </div>
            )}
            <textarea value={note} onChange={e => setNote(e.target.value)} placeholder={tx("What is my brain trying to protect me from right now?")} rows={2} className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 resize-none" />
            <div className="text-[11px] text-slate-500 mt-2">{tx("Optional. Logs with your weather state when you tap Log These States.")}</div>
          </div>

          {matchedProtocols().length > 0 && (
            <div className="rounded-2xl bg-indigo-950/40 border border-indigo-800/40 p-4 space-y-3">
              <div className="text-[10px] uppercase tracking-widest text-indigo-400">{tx("Matched protocol for your stack")}</div>
              {matchedProtocols().slice(0, 2).map(p => (
                <div key={p.id} className="bg-slate-900/60 rounded-xl p-3">
                  <div className="text-sm font-medium text-white mb-2">{p.title}</div>
                  <ol className="text-xs text-slate-300 space-y-1.5 list-decimal list-inside">
                    {p.steps.map((s, i) => <li key={i}>{s}</li>)}
                  </ol>
                </div>
              ))}
            </div>
          )}

          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4 space-y-4">
            <div className="flex justify-between items-start gap-2">
              <div>
                <div className="text-[10px] uppercase tracking-widest text-slate-500">{tx("Daily Function")}</div>
                <div className="text-sm text-slate-300 mt-0.5">{tx("Make the outer life hold while the inner life heals.")}</div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-lg font-bold text-white">{dailyScore()}<span className="text-sm text-slate-500">{tx("/9")}</span></div>
                <div className="flex gap-2 justify-end mt-0.5">
                  <button onClick={() => setShowHistory(h => !h)} className="text-[10px] text-indigo-400">{showHistory ? tx('Hide') : tx('History')}</button>
                  <button onClick={() => { saveDayToHistory(); }} className="text-[10px] text-emerald-400">{tx("Save day")}</button>
                  <button onClick={() => setDailyFn(blankDaily(todayKey()))} className="text-[10px] text-amber-500">{tx("Reset")}</button>
                </div>
              </div>
            </div>

            {nextMedInfo().due && (
              <div className="rounded-xl border-2 border-amber-500/60 bg-amber-950/40 p-3 space-y-2">
                <div className="text-sm font-semibold text-amber-100">{tx(nextMedInfo().label)} — due now</div>
                <div className="text-xs text-amber-200/80">Scheduled for {nextMedInfo().time}. Take them when you can, then check off.</div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => patchDaily(nextMedInfo().which === 'morning' ? { medsAM: true } : { medsPM: true })}
                    className="flex-1 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-medium"
                  >Check off {nextMedInfo().which}</button>
                  <button onClick={() => snoozeMed(nextMedInfo().which, 10)} className="px-3 py-2.5 rounded-lg bg-slate-800 border border-slate-600 text-slate-200 text-xs">{tx("Snooze 10m")}</button>
                  <button onClick={() => snoozeMed(nextMedInfo().which, 30)} className="px-3 py-2.5 rounded-lg bg-slate-800 border border-slate-600 text-slate-200 text-xs">{tx("Snooze 30m")}</button>
                </div>
              </div>
            )}

            <div className={`rounded-xl border p-3 ${dailyFn.medsAM && dailyFn.medsPM ? 'border-emerald-500/40 bg-emerald-950/20' : nextMedInfo().due ? 'border-amber-500/50 bg-amber-950/20' : 'border-slate-700 bg-slate-900/40'}`}>
              <div className="flex justify-between items-start mb-2 gap-2">
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-amber-400">{tx("Meds · alarm & check off")}</div>
                  <div className="text-xs text-slate-300 mt-1">{nextMedInfo().text}</div>
                </div>
                <div className={`text-xs font-medium shrink-0 ${
                  medsOnTrack() === 'complete' ? 'text-emerald-400' :
                  nextMedInfo().due ? 'text-amber-400' : 'text-slate-400'
                }`}>
                  {medsOnTrack() === 'complete' ? tx('Complete') : nextMedInfo().due ? tx('Due') : tx('Scheduled')}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className={`rounded-xl p-2.5 border ${dailyFn.medsAM ? 'border-emerald-500/40 bg-emerald-950/30' : 'border-slate-700 bg-slate-900/50'}`}>
                  <div className="text-[10px] text-slate-500 mb-1">{tx("Morning · set time")}</div>
                  <input type="time" value={settings.medsAMTime} onChange={e => patchSettings({ medsAMTime: e.target.value })} className="w-full bg-slate-800 border border-slate-600 rounded-lg px-2 py-1.5 text-sm text-white mb-2" />
                  <button onClick={() => patchDaily({ medsAM: !dailyFn.medsAM })} className={`w-full py-2.5 rounded-lg text-sm font-medium border ${dailyFn.medsAM ? 'border-emerald-500/50 text-emerald-200' : 'border-slate-600 text-slate-200'}`}>
                    {dailyFn.medsAM ? tx('✓ Morning taken') : tx('Check off morning')}
                  </button>
                </div>
                <div className={`rounded-xl p-2.5 border ${dailyFn.medsPM ? 'border-emerald-500/40 bg-emerald-950/30' : 'border-slate-700 bg-slate-900/50'}`}>
                  <div className="text-[10px] text-slate-500 mb-1">{tx("Evening · set time")}</div>
                  <input type="time" value={settings.medsPMTime} onChange={e => patchSettings({ medsPMTime: e.target.value })} className="w-full bg-slate-800 border border-slate-600 rounded-lg px-2 py-1.5 text-sm text-white mb-2" />
                  <button onClick={() => patchDaily({ medsPM: !dailyFn.medsPM })} className={`w-full py-2.5 rounded-lg text-sm font-medium border ${dailyFn.medsPM ? 'border-emerald-500/50 text-emerald-200' : 'border-slate-600 text-slate-200'}`}>
                    {dailyFn.medsPM ? tx('✓ Evening taken') : tx('Check off evening')}
                  </button>
                </div>
              </div>

              <div className="mb-2">
                <div className="text-[10px] text-slate-500 mb-1">{tx("Remind me")}</div>
                <div className="flex flex-wrap gap-1.5">
                  {[['0', 'At time'], ['5', '5 min early'], ['15', '15 min early']].map(([v, lab]) => (
                    <button key={v} onClick={() => patchSettings({ medsLeadMinutes: Number(v) })} className={`text-xs px-2.5 py-1 rounded-full border ${Number(settings.medsLeadMinutes) === Number(v) ? 'border-amber-500 text-amber-200 bg-amber-950/30' : 'border-slate-600 text-slate-400'}`}>{lab}</button>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 items-center mb-2">
                <button onClick={() => patchSettings({ medsReminders: !settings.medsReminders })} className={`text-xs px-2.5 py-1.5 rounded-lg border ${settings.medsReminders ? 'border-amber-500/50 text-amber-200 bg-amber-950/30' : 'border-slate-600 text-slate-400'}`}>
                  {settings.medsReminders ? tx('Reminders ON') : tx('Reminders OFF')}
                </button>
                <button onClick={requestNotifPermission} className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-600 text-slate-300">
                  {notifPermission === 'granted' ? tx('Notifications OK') : tx('Allow notifications')}
                </button>
                <button onClick={testMedNotification} className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-600 text-slate-300">{tx("Test alert")}</button>
              </div>
              <div className="text-[11px] text-slate-500 leading-relaxed">
                Set times like an alarm. You’ll get an <span className="text-slate-400">{tx("in-app due banner")}</span> plus a browser notification when allowed. Check off when taken (even late). Snooze 10 or 30 minutes if you need. For best results: install to home screen, allow notifications, and open the app once a day.
              </div>
            </div>

            <div>
              <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-2">{tx("Foundation checks")}</div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  ['sleep', 'Sleep protected'],
                  ['food', 'Ate something'],
                  ['water', 'Hydrated'],
                  ['move', 'Moved body'],
                  ['outside', 'Light / outside'],
                  ['connect', 'One connection'],
                  ['word', 'Word / prayer'],
                ].map(([k, label]) => (
                  <button
                    key={k}
                    onClick={() => patchDaily({ [k]: !dailyFn[k] })}
                    className={`px-3 py-2.5 rounded-xl border text-left text-sm transition-all ${dailyFn[k] ? 'border-emerald-500/40 bg-emerald-950/30 text-emerald-200' : 'border-slate-700 bg-slate-800/40 text-slate-400'}`}
                  >
                    {dailyFn[k] ? '✓ ' : ''}{tx(label)}
                  </button>
                ))}
              </div>
              <div className="text-[11px] text-slate-500 mt-2">{tx("Not a score of your worth — ballast for a hard brain day. Meds count in the /9 above.")}</div>
            </div>

            {showHistory && (
              <div className="rounded-xl bg-slate-800/40 border border-slate-700 p-3 space-y-2">
                <div className="text-[10px] uppercase tracking-widest text-slate-500">{tx("Last 14 days")}</div>
                {(() => {
                  const byDate = {};
                  dailyHistory.forEach(x => { byDate[x.date] = x; });
                  const t = todayKey();
                  byDate[t] = { date: t, score: dailyScore(), medsAM: dailyFn.medsAM, medsPM: dailyFn.medsPM, foxDone: dailyFn.foxDone };
                  const rows = [];
                  const d = new Date();
                  for (let i = 0; i < 14; i++) {
                    const key = d.toISOString().slice(0, 10);
                    rows.push(byDate[key] || { date: key, score: 0, medsAM: false, medsPM: false });
                    d.setDate(d.getDate() - 1);
                  }
                  return rows.map(r => (
                    <div key={r.date} className="flex items-center gap-2 text-xs">
                      <span className="text-slate-500 w-20 shrink-0">{r.date.slice(5)}</span>
                      <div className="flex-1 h-2 bg-slate-900 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500/80 rounded-full" style={{ width: `${Math.min(100, (r.score / 9) * 100)}%` }} />
                      </div>
                      <span className="text-slate-400 w-8 text-right">{r.score}/9</span>
                      <span className={r.medsAM && r.medsPM ? 'text-emerald-400' : r.medsAM || r.medsPM ? 'text-amber-400' : 'text-slate-600'}>
                        {r.medsAM && r.medsPM ? 'M✓' : r.medsAM ? 'AM' : r.medsPM ? 'PM' : '—'}
                      </span>
                    </div>
                  ));
                })()}
                <div className="text-[11px] text-slate-500">{tx("Streak counts days with 3+ foundations or full meds. Tap Save day to lock progress into history.")}</div>
              </div>
            )}

            <div>
              <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-2">{tx("HALT · Body needs first")}</div>
              <div className="flex flex-wrap gap-1.5">
                {['Hungry', 'Angry', 'Lonely', 'Tired'].map(h => (
                  <button
                    key={h}
                    onClick={() => patchDaily({ halt: dailyFn.halt === h ? '' : h })}
                    className={`px-2.5 py-1.5 rounded-full text-xs border ${dailyFn.halt === h ? 'border-amber-500 bg-amber-950/40 text-amber-200' : 'border-slate-700 text-slate-400'}`}
                  >{h}</button>
                ))}
              </div>
              {dailyFn.halt === 'Hungry' && <div className="text-xs text-amber-200/90 mt-2">{tx("Eat something simple before hard decisions. Blood sugar is not a moral failure.")}</div>}
              {dailyFn.halt === 'Angry' && <div className="text-xs text-amber-200/90 mt-2">{tx("90-second rule. Do not send the message yet. Name what the anger is protecting.")}</div>}
              {dailyFn.halt === 'Lonely' && <div className="text-xs text-amber-200/90 mt-2">{tx("One Signal Flare beats isolation. Presence before depth — a short text counts.")}</div>}
              {dailyFn.halt === 'Tired' && <div className="text-xs text-amber-200/90 mt-2">{tx("Rest can be the Fox. Shrink the plan. Sleep is regulation.")}</div>}
            </div>

            <div>
              <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">{tx("Tank · how much bandwidth do I have?")}</div>
              <p className="text-[11px] text-slate-500 mb-2 leading-relaxed">
                Not a medical score. An honest gauge for the Pilot: should today be a build day or a ballast day? {tx("Energy is how full you feel. Stress is how loaded you feel. Low energy or high stress means shrink the plan — one Fox, not ten.")}
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-[10px] text-slate-400 mb-1">Energy (fullness) · {dailyFn.energy || 5}/10</div>
                  <input type="range" min="1" max="10" value={dailyFn.energy || 5} onChange={e => patchDaily({ energy: +e.target.value })} className="w-full accent-amber-500" />
                  <div className="text-[10px] text-slate-600 mt-0.5">{tx("1 empty · 10 fueled")}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 mb-1">Stress (load) · {dailyFn.stress || 5}/10</div>
                  <input type="range" min="1" max="10" value={dailyFn.stress || 5} onChange={e => patchDaily({ stress: +e.target.value })} className="w-full accent-red-500" />
                  <div className="text-[10px] text-slate-600 mt-0.5">{tx("1 calm · 10 maxed")}</div>
                </div>
              </div>
            </div>
            {(dailyFn.energy <= 3 || dailyFn.stress >= 8) && (
              <div className="text-xs text-red-200/90 bg-red-950/30 border border-red-900/40 rounded-xl p-2.5">{tx("Tank is low or overloaded. One Fox only. Prefer Level 0 or rest over hero mode. The 70% Governor is not optional today.")}</div>
            )}

            <div>
              <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">{tx("Sleep last night (hours)")}</div>
              <input
                type="number"
                min="0"
                max="24"
                step="0.5"
                value={dailyFn.sleepHours || ''}
                onChange={e => patchDaily({ sleepHours: e.target.value })}
                placeholder={tx("e.g. 6.5")}
                className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500"
              />
              <div className="text-[11px] text-slate-500 mt-1">{tx("Sleep debt often drives the stack. Honest hours help the Pilot plan the day.")}</div>
            </div>

            <div>
              <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">{tx("Admin Fox · life logistics")}</div>
              <div className="text-[11px] text-slate-500 mb-1.5">{tx("Separate from the Great Fox if needed. One boring life task that reduces future chaos.")}</div>
              <input
                value={dailyFn.adminFox || ''}
                onChange={e => patchDaily({ adminFox: e.target.value })}
                placeholder={tx("e.g. Pay the one bill · book the appointment · reply to one email")}
                className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500"
              />
            </div>

            <div className="space-y-2">
              <div className="text-[10px] uppercase tracking-widest text-slate-500">{tx("Evening review · close the day")}</div>
              <input
                value={dailyFn.win || ''}
                onChange={e => patchDaily({ win: e.target.value })}
                placeholder={tx("One win (even tiny)")}
                className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500"
              />
              <input
                value={dailyFn.drain || ''}
                onChange={e => patchDaily({ drain: e.target.value })}
                placeholder={tx("What drained you? (to avoid or shrink tomorrow)")}
                className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500"
              />
              <input
                value={dailyFn.mercy || ''}
                onChange={e => patchDaily({ mercy: e.target.value })}
                placeholder={tx("One mercy you received or offered")}
                className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500"
              />
              <textarea
                value={dailyFn.evening || ''}
                onChange={e => patchDaily({ evening: e.target.value })}
                placeholder={tx("Anything else to put down before sleep…")}
                rows={2}
                className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 resize-none"
              />
            </div>
          </div>

          <button onClick={() => { setTab('tools'); setToolsSub('reset'); }} className="w-full py-3.5 rounded-2xl bg-red-950/40 border border-red-800/50 text-red-200 font-medium text-sm">
            🚨 Level 0 Reset · Open Protocol
          </button>
        </div>
      );

      // FORMATION
      const Formation = () => {
        const q = formSearch.trim().toLowerCase();
        const match90 = (d) => !q || [d.title, d.scripture, d.focus, d.emptying, d.response].join(' ').toLowerCase().includes(q);
        const match365 = (d) => !q || [d.title, d.scripture, d.reflection, d.prayer].join(' ').toLowerCase().includes(q);
        return (
        <div className="space-y-4 pb-4">
          <input
            value={formSearch}
            onChange={e => setFormSearch(e.target.value)}
            placeholder={tx("Search 90 / 365 (e.g. peace, shame, rest)…")}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500"
          />
          {settings.curriculumMode && (
            <div className="rounded-xl bg-indigo-950/30 border border-indigo-800/40 p-3 text-xs text-indigo-200/90 leading-relaxed">
              Curriculum mode: use this track in a group or with a sponsor. One day at a time. Discuss the emptying question; pray the response together.
            </div>
          )}
          <div className="flex gap-2 p-1 bg-slate-900 rounded-xl border border-slate-800">
            <button onClick={() => setFormationMode('90')} className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${formationMode === '90' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400'}`}>{tx("90-Day")}</button>
            <button onClick={() => setFormationMode('365')} className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${formationMode === '365' ? 'bg-amber-600 text-white shadow' : 'text-slate-400'}`}>{tx("365 House")}</button>
          </div>

          {formationMode === '90' ? (
            <div className="rounded-2xl bg-gradient-to-br from-indigo-950/80 to-slate-900 border border-indigo-900/40 p-5">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-indigo-400">Day {day90} · Week {Math.ceil(day90 / 7)}</div>
                  <h2 className="text-xl font-semibold text-white mt-1">{current90.title}</h2>
                  <div className="text-sm text-indigo-300 mt-1">{current90.scripture}</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-indigo-300">{completed90.length}<span className="text-sm text-slate-500">{tx("/90")}</span></div>
                </div>
              </div>
              <div className="space-y-3 mt-4">
                <div className="bg-slate-900/60 rounded-xl p-3"><div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">{tx("Focus")}</div><div className="text-sm text-slate-200">{current90.focus}</div></div>
                <div className="bg-slate-900/60 rounded-xl p-3"><div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">{tx("Emptying")}</div><div className="text-sm text-slate-200">{current90.emptying}</div></div>
                <div className="bg-slate-900/60 rounded-xl p-3"><div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">{tx("Response")}</div><div className="text-sm text-amber-100 italic">{current90.response}</div></div>
              </div>
              <div className="flex gap-2 mt-5">
                <button onClick={() => setDay90(d => Math.max(1, d - 1))} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-sm">{tx("← Prev")}</button>
                <button onClick={markDay90} className="flex-1 py-2 rounded-xl bg-indigo-600 text-white text-sm font-medium">{completed90.includes(day90) ? tx('✓ Done') : tx('Mark Complete')}</button>
                <button onClick={() => setDay90(d => Math.min(90, d + 1))} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-sm">{tx("Next →")}</button>
              </div>
              <div className="mt-3 flex gap-2">
                <input id="jump90" type="number" min="1" max="90" placeholder={tx("Jump to day…")} className="flex-1 bg-slate-800/60 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500" />
                <button onClick={() => { const n = parseInt(document.getElementById('jump90').value, 10); if (n >{tx("= 1 && n")} <= 90) setDay90(n); }} className="px-4 py-2 rounded-xl bg-slate-700 text-sm text-slate-200">{tx("Go")}</button>
              </div>
              <div className="mt-2 text-[11px] text-slate-500 text-center">{FORMATION_90.length} days with full content</div>
            </div>
          ) : (
            <div className="rounded-2xl bg-gradient-to-br from-amber-950/60 to-slate-900 border border-amber-900/40 p-5">
              <div className="text-[10px] uppercase tracking-widest text-amber-500 mb-1">Day {day365} · Building His House</div>
              <h2 className="text-xl font-semibold text-white mt-1">{current365.title}</h2>
              <div className="text-sm text-amber-300 mt-1">{current365.scripture}</div>
              <div className="mt-4 space-y-3">
                <div className="bg-slate-900/60 rounded-xl p-3"><div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">{tx("Reflection")}</div><div className="text-sm text-slate-200 leading-relaxed">{current365.reflection}</div></div>
                <div className="bg-slate-900/60 rounded-xl p-3"><div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">{tx("Prayer")}</div><div className="text-sm text-amber-100 italic">{current365.prayer}</div></div>
              </div>
              <div className="flex gap-2 mt-5">
                <button onClick={() => setDay365(d => Math.max(1, d - 1))} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-sm">{tx("← Prev")}</button>
                <button onClick={() => setDay365(d => Math.min(365, d + 1))} className="flex-1 py-2 rounded-xl bg-amber-600 text-white text-sm font-medium">{tx("Next Day →")}</button>
              </div>
              <div className="mt-3 flex gap-2">
                <input id="jump365" type="number" min="1" max="365" placeholder={tx("Jump to day…")} className="flex-1 bg-slate-800/60 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500" />
                <button onClick={() => { const n = parseInt(document.getElementById('jump365').value, 10); if (n >{tx("= 1 && n")} <= 365) setDay365(n); }} className="px-4 py-2 rounded-xl bg-slate-700 text-sm text-slate-200">{tx("Go")}</button>
              </div>
              <div className="mt-2 text-[11px] text-slate-500 text-center">{tx("365 daily devotionals · full year")}</div>
            </div>
          )}
          {q && (
            <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4 space-y-2 max-h-64 overflow-y-auto">
              <div className="text-[10px] uppercase tracking-widest text-slate-500">{tx("Search results")}</div>
              {formationMode === '90'
                ? FORMATION_90.filter(match90).slice(0, 20).map(d => (
                    <button key={d.day} onClick={() => { setDay90(d.day); setFormSearch(''); }} className="block w-full text-left text-sm py-2 border-b border-slate-800 text-slate-300">
                      <span className="text-indigo-400">Day {d.day}</span> · {d.title}
                    </button>
                  ))
                : FORMATION_365.filter(match365).slice(0, 20).map(d => (
                    <button key={d.day} onClick={() => { setDay365(d.day); setFormSearch(''); }} className="block w-full text-left text-sm py-2 border-b border-slate-800 text-slate-300">
                      <span className="text-amber-500">Day {d.day}</span> · {d.title}
                    </button>
                  ))}
            </div>
          )}
        </div>
      );
      };

      // TOOLS
      const Tools = () => (
        <div className="space-y-4 pb-4">
          <div className="flex gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800 overflow-x-auto">
            {[['reset','Level 0'],['breath','Breath'],['outreach','Outreach'],['mvs','MVS'],['word','When…'],['protocols','Protocols'],['crossover','Stacks']].map(([id,label]) => (
              <button key={id} onClick={() => setToolsSub(id)} className={`flex-1 min-w-[4.2rem] py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${toolsSub === id ? 'bg-slate-700 text-white' : 'text-slate-400'}`}>{tx(label)}</button>
            ))}
          </div>

          {toolsSub === 'reset' && (
            <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 space-y-4">
              <div className="text-[10px] uppercase tracking-widest text-red-400">{tx("Level 0 · Emergency Reset")}</div>
              <p className="text-sm text-slate-300">{tx("When the Pilot is offline. Do these in order. No thinking required.")}</p>
              <ol className="space-y-3 text-sm">
                <li className="flex gap-3"><span className="text-amber-400 font-bold w-5">1</span><div><span className="text-white font-medium">{tx("Cold water")}</span><br/><span className="text-slate-400">{tx("Face or wrists · 20–30 sec.")}</span></div></li>
                <li className="flex gap-3"><span className="text-amber-400 font-bold w-5">2</span><div><span className="text-white font-medium">{tx("Name three objects")}</span><br/><span className="text-slate-400">{tx("Out loud. Orient to room and year.")}</span></div></li>
                <li className="flex gap-3"><span className="text-amber-400 font-bold w-5">3</span><div><span className="text-white font-medium">{tx("External brain")}</span><br/><span className="text-slate-400">{tx("Write the one loudest thought.")}</span></div></li>
                <li className="flex gap-3"><span className="text-amber-400 font-bold w-5">4</span><div><span className="text-white font-medium">{tx("One physical move")}</span><br/><span className="text-slate-400">{tx("Stand. Stretch. 10 seconds is enough.")}</span></div></li>
                <li className="flex gap-3"><span className="text-amber-400 font-bold w-5">5</span><div><span className="text-white font-medium">{tx("90-second rule")}</span><br/><span className="text-slate-400">{tx("Ride the chemical wave. Do not act.")}</span></div></li>
              </ol>
              <div className="pt-2 border-t border-slate-800">
                <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-2">{tx("N.A.B.B. Protocol")}</div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-800/50 rounded-lg p-2.5"><span className="text-amber-400 font-bold">N</span> · {tx("Name the state")}</div>
                  <div className="bg-slate-800/50 rounded-lg p-2.5"><span className="text-amber-400 font-bold">A</span> · {tx("Accept the wave")}</div>
                  <div className="bg-slate-800/50 rounded-lg p-2.5"><span className="text-amber-400 font-bold">B</span> · {tx("Breathe")}</div>
                  <div className="bg-slate-800/50 rounded-lg p-2.5"><span className="text-amber-400 font-bold">B</span> · {tx("Body move or boundary")}</div>
                </div>
              </div>
            </div>
          )}

          {toolsSub === 'breath' && (
            <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 text-center space-y-5">
              <div className="text-[10px] uppercase tracking-widest text-slate-500">{tx("Box Breath · 4-4-4-4")}</div>
              <div className={`mx-auto w-36 h-36 rounded-full border-4 flex items-center justify-center transition-all duration-1000 ${breathPhase === 'idle' || breathPhase === 'done' ? 'border-slate-700' : 'border-amber-500 breath-circle'}`}>
                <div>
                  <div className="text-3xl font-bold text-white">{breathPhase === 'idle' ? '—' : breathPhase === 'done' ? '✓' : breathCount}</div>
                  <div className="text-xs text-slate-400 mt-1 capitalize">
                    {breathPhase === 'idle' && tx('Ready')}
                    {breathPhase === 'inhale' && tx('Inhale')}
                    {breathPhase === 'hold1' && tx('Hold')}
                    {breathPhase === 'exhale' && tx('Exhale')}
                    {breathPhase === 'hold2' && tx('Hold')}
                    {breathPhase === 'done' && tx('Complete')}
                  </div>
                </div>
              </div>
              <div className="text-sm text-slate-400">Round {Math.min(breathRound + (breathPhase !== 'idle' && breathPhase !== 'done' ? 1 : 0), 4)} of 4</div>
              {breathPhase === 'idle' || breathPhase === 'done' ? (
                <button onClick={startBreath} className="w-full py-3 rounded-xl bg-amber-600 text-white font-medium">{tx("Start 4 Rounds")}</button>
              ) : (
                <button onClick={stopBreath} className="w-full py-3 rounded-xl bg-slate-700 text-slate-200 font-medium">{tx("Stop")}</button>
              )}
            </div>
          )}

          {toolsSub === 'outreach' && (
            <div className="space-y-3">
              <div className="text-[10px] uppercase tracking-widest text-slate-500 px-1">{tx("Signal Flare · Copy & Send")}</div>
              {OUTREACH_SCRIPTS.map((s, i) => (
                <div key={i} className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4">
                  <div className="text-xs font-medium text-amber-400 mb-1.5">{tx(s.title)}</div>
                  <div className="text-sm text-slate-200 leading-relaxed mb-3">{tx(s.text)}</div>
                  <button onClick={() => { navigator.clipboard?.writeText(s.text); setCopiedScript(i); setTimeout(() => setCopiedScript(null), 1500); }} className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300">
                    {copiedScript === i ? tx('Copied ✓') : tx('Copy script')}
                  </button>
                </div>
              ))}
            </div>
          )}

          {toolsSub === 'mvs' && (
            <div className="space-y-4">
              <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 space-y-3">
                <div className="text-[10px] uppercase tracking-widest text-slate-500">{tx("Minimum Viable Shift")}</div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  When the <span className="text-amber-200">{tx("Wall of Awful")}</span> is high, the full task feels impossible. An MVS is the smallest physical move that still counts as starting — so small it feels almost silly. Momentum comes after motion, not before.
                </p>
                <div className="bg-slate-800/50 rounded-xl p-3">
                  <div className="text-[10px] uppercase tracking-widest text-amber-500/90 mb-1.5">{tx("Name your MVS right now")}</div>
                  <input
                    value={fox}
                    onChange={e => setFox(e.target.value)}
                    placeholder={tx("e.g. Open the email draft — don’t send yet")}
                    className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
                  />
                  <div className="text-[11px] text-slate-500 mt-1.5">{tx("This syncs with your Great Fox on the Cockpit.")}</div>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 space-y-3">
                <div className="text-[10px] uppercase tracking-widest text-slate-500">{tx("Examples by domain")}</div>
                <div className="space-y-2.5 text-sm">
                  <div className="bg-slate-800/40 rounded-xl p-3">
                    <div className="text-amber-300 font-medium text-xs mb-1">{tx("Work / tasks")}</div>
                    <div className="text-slate-300 space-y-1">
                      <div>{tx("→ Open the document (don’t write yet)")}</div>
                      <div>{tx("→ Create the blank file and name it")}</div>
                      <div>{tx("→ Reply with one sentence only")}</div>
                      <div>{tx("→ Put the materials on the desk")}</div>
                    </div>
                  </div>
                  <div className="bg-slate-800/40 rounded-xl p-3">
                    <div className="text-amber-300 font-medium text-xs mb-1">{tx("Body / health")}</div>
                    <div className="text-slate-300 space-y-1">
                      <div>{tx("→ Fill the water glass (don’t finish it yet)")}</div>
                      <div>{tx("→ Put on shoes (don’t leave yet)")}</div>
                      <div>{tx("→ Stand up for 10 seconds")}</div>
                      <div>{tx("→ Lay out clothes for later")}</div>
                    </div>
                  </div>
                  <div className="bg-slate-800/40 rounded-xl p-3">
                    <div className="text-amber-300 font-medium text-xs mb-1">{tx("Home / life admin")}</div>
                    <div className="text-slate-300 space-y-1">
                      <div>{tx("→ Put one item in the sink or laundry")}</div>
                      <div>{tx("→ Open the bill PDF (don’t pay yet)")}</div>
                      <div>{tx("→ Set a 5-minute timer and clear one surface")}</div>
                      <div>{tx("→ Text the appointment request — send later if needed")}</div>
                    </div>
                  </div>
                  <div className="bg-slate-800/40 rounded-xl p-3">
                    <div className="text-amber-300 font-medium text-xs mb-1">{tx("Faith / formation")}</div>
                    <div className="text-slate-300 space-y-1">
                      <div>{tx("→ Open Formation to today’s day (don’t finish it yet)")}</div>
                      <div>{tx("→ Read only the Daily Verse")}</div>
                      <div>{tx("→ Write one line in Write / Bleed")}</div>
                      <div>{tx("→ Pray one honest sentence out loud")}</div>
                    </div>
                  </div>
                  <div className="bg-slate-800/40 rounded-xl p-3">
                    <div className="text-amber-300 font-medium text-xs mb-1">{tx("People / repair")}</div>
                    <div className="text-slate-300 space-y-1">
                      <div>{tx("→ Open the message thread (don’t type yet)")}</div>
                      <div>{tx("→ Draft “thinking of you” — send when ready")}</div>
                      <div>{tx("→ Use a Signal Flare script from Outreach")}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 space-y-3">
                <div className="text-[10px] uppercase tracking-widest text-slate-500">{tx("Core rules")}</div>
                <div className="bg-slate-800/50 rounded-xl p-3 text-sm text-slate-300">{tx("10/20 Rule: Work or move for 10 minutes, then decide if you continue. Most resistance dies in the first 10. Twenty minutes is a bonus, not the entry fee.")}</div>
                <div className="bg-slate-800/50 rounded-xl p-3 text-sm text-slate-300">{tx("Memory Shield: Write the next step the moment it appears. Working memory blackouts are real — do not trust the brain to hold it.")}</div>
                <div className="bg-slate-800/50 rounded-xl p-3 text-sm text-slate-300">{tx("70% Governor: Leave buffer. An MVS that costs your whole tank is not minimum — shrink it again.")}</div>
                <div className="bg-slate-800/50 rounded-xl p-3 text-sm text-slate-300">{tx("One Fox: One highest-leverage lever per day. Everything else is optional until the Fox moves.")}</div>
                <div className="bg-slate-800/50 rounded-xl p-3 text-sm text-slate-300">{tx("Body first: If you are in Panic, Rage, Freeze, or Urge — Level 0 or breath before any task. Regulate, then shift.")}</div>
              </div>

              <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 space-y-2">
                <div className="text-[10px] uppercase tracking-widest text-slate-500">{tx("If even the MVS feels impossible")}</div>
                <ol className="text-sm text-slate-300 space-y-2 list-decimal list-inside">
                  <li>{tx("Shrink again until it is laughably small.")}</li>
                  <li>{tx("Change environment for 2 minutes (different chair, different room).")}</li>
                  <li>{tx("Body-double: sit on a call or in a café while you only open the thing.")}</li>
                  <li>{tx("Log the weather state on Cockpit — you may need Level 0, not productivity.")}</li>
                  <li>{tx("Permission: rest can be the MVS. Hydrate. Sleep. That still counts.")}</li>
                </ol>
              </div>
            </div>
          )}

          {toolsSub === 'word' && (
            <div className="space-y-3">
              <div className="text-[10px] uppercase tracking-widest text-slate-500 px-1">{tx("When I feel… · Scripture for the moment")}</div>
              <p className="text-sm text-slate-400 px-1">{tx("Pick the weather. Receive the Word. Not a lecture — a ballast.")}</p>
              {SITUATION_PACKS.map(pack => (
                <div key={pack.id} className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden">
                  <button
                    onClick={() => setPackId(packId === pack.id ? null : pack.id)}
                    className="w-full flex justify-between items-center p-4 text-left"
                  >
                    <span className="text-sm font-medium text-white">{tx(pack.label)}</span>
                    <span className="text-slate-500 text-xs">{packId === pack.id ? '▲' : '▼'}</span>
                  </button>
                  {packId === pack.id && (
                    <div className="px-4 pb-4 space-y-3 border-t border-slate-800 pt-3">
                      <div className="text-xs text-amber-200/80">{pack.note}</div>
                      {pack.verses.map((v, i) => (
                        <div key={i} className="bg-slate-800/50 rounded-xl p-3">
                          <div className="text-sm text-slate-200 leading-relaxed">“{v.text}”</div>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-xs text-amber-500">{v.ref}</span>
                            <button onClick={() => toggleFavVerse(v)} className="text-sm">{isFav(v) ? '★' : '☆'}</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {toolsSub === 'protocols' && (
            <div className="space-y-3">
              <div className="text-[10px] uppercase tracking-widest text-slate-500 px-1">{tx("Stacked-state protocols")}</div>
              <p className="text-sm text-slate-400 px-1">{tx("Body first, then mind, then story. Follow the steps in order.")}</p>
              {STATE_PROTOCOLS.map(p => (
                <div key={p.id} className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4">
                  <div className="text-sm font-medium text-white mb-2">{p.title}</div>
                  <ol className="text-xs text-slate-300 space-y-1.5 list-decimal list-inside">
                    {p.steps.map((s, i) => <li key={i}>{s}</li>)}
                  </ol>
                </div>
              ))}
            </div>
          )}

          {toolsSub === 'crossover' && (
            <div className="space-y-3">
              <div className="rounded-2xl bg-gradient-to-br from-indigo-950/50 to-slate-900 border border-indigo-800/40 p-4">
                <div className="text-[10px] uppercase tracking-widest text-indigo-400 mb-1">{tx("Mental health · stacks & crossovers")}</div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  One illness is hard enough. Multiple diagnoses — or several states in one day — is a different kind of weight. This guide names how that feels and what to do without demanding a single clean label.
                </p>
                <p className="text-xs text-slate-500 mt-2">{tx("Not a diagnosis tool. Not a replacement for a doctor or therapist. A map for the Pilot when the dashboard is crowded.")}</p>
              </div>
              {CROSSOVER_GUIDE.map(g => (
                <div key={g.id} className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4 space-y-2">
                  <div className="text-sm font-medium text-white">{tx(g.title)}</div>
                  {g.body && <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">{tx(g.body).replace(/\\n/g, '\n')}</p>}
                  {g.feels && (
                    <div className="bg-slate-800/50 rounded-xl p-3">
                      <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">{tx("How it often feels")}</div>
                      <p className="text-sm text-slate-300 leading-relaxed">{tx(g.feels)}</p>
                    </div>
                  )}
                  {g.try && (
                    <div className="bg-amber-950/20 border border-amber-900/30 rounded-xl p-3">
                      <div className="text-[10px] uppercase tracking-widest text-amber-500/90 mb-1">{tx("Try this")}</div>
                      <p className="text-sm text-amber-100/90 leading-relaxed">{tx(g.try)}</p>
                    </div>
                  )}
                </div>
              ))}
              <button onClick={() => setTab('cockpit')} className="w-full py-3 rounded-xl bg-indigo-600 text-white text-sm font-medium">
                Go to Cockpit · select your stack
              </button>
            </div>
          )}
        </div>
      );

      // WRITE
      const Write = () => (
        <div className="space-y-4 pb-4">
          <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-5">
            <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">{tx("Bleed Through the Page")}</div>
            <h2 className="text-lg font-semibold text-white mb-2">{tx("Write it out")}</h2>
            <p className="text-sm text-slate-400 mb-4">{tx("When the mind is a faucet that cannot be tamed — put it on the page. Private. On-device only.")}</p>
            <textarea value={journal} onChange={e => setJournal(e.target.value)} placeholder={tx("Start bleeding… racing thoughts, the fog, the heat, the prayer, the silence…")} rows={8} className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/40 resize-none leading-relaxed" />
            <div className="flex gap-2 mt-3">
              <button onClick={saveJournal} className="flex-1 py-3 rounded-xl bg-amber-600 text-white font-medium text-sm">{tx("Save Entry")}</button>
              <button onClick={() => {
                const text = journalEntries.map(e => `--- ${e.time} ---\n${e.text}\n`).join('\n') || 'No entries yet.';
                const blob = new Blob([text], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a'); a.href = url; a.download = `bee-well-journal.txt`; a.click(); URL.revokeObjectURL(url);
              }} className="px-4 py-3 rounded-xl bg-slate-800 text-slate-300 text-sm">{tx("Export")}</button>
            </div>
          </div>
          {journalEntries.length > 0 && (
            <div className="space-y-3">
              <div className="text-[10px] uppercase tracking-widest text-slate-500 px-1">Recent entries · {journalEntries.length}</div>
              {journalEntries.slice(0, 10).map((e, i) => (
                <div key={i} className="rounded-xl bg-slate-900/70 border border-slate-800 p-4">
                  <div className="text-[11px] text-slate-500 mb-1.5">{e.time}</div>
                  <div className="text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">{e.text.length > 320 ? e.text.slice(0, 320) + '…' : e.text}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      );

      // COMMUNITY
      const Community = () => (
        <div className="space-y-4 pb-4">
          <div className="rounded-2xl bg-gradient-to-br from-indigo-950/50 to-slate-900 border border-indigo-900/30 p-5">
            <div className="text-[10px] uppercase tracking-widest text-indigo-400 mb-2">{tx("You Are Not Alone")}</div>
            <p className="text-sm text-slate-300 leading-relaxed mb-3">
              BEE WELL is a rescue-focused family. Personal deliverance becomes a roadmap for others. This space holds encouragement and private prayer — fully on your device for now.
            </p>
            <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800">
              <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-2">{tx("Rotating Encouragement")}</div>
              <div className="text-sm text-amber-50 leading-relaxed">“{tx(encouragement.text)}”</div>
              <div className="text-[11px] text-indigo-400 mt-2">{tx(encouragement.tag)}</div>
            </div>
          </div>

          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5">
            <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-2">{tx("Private Prayer Wall")}</div>
            <p className="text-xs text-slate-400 mb-3">{tx("Write a request. Stored only on this device. A reminder that you asked.")}</p>
            <textarea value={prayerRequest} onChange={e => setPrayerRequest(e.target.value)} placeholder={tx("Lord, I need…")} rows={3} className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/40 resize-none" />
            <button onClick={savePrayer} className="mt-2 w-full py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium">{tx("Save Prayer")}</button>
            {myPrayers.length > 0 && (
              <div className="mt-4 space-y-2 max-h-48 overflow-y-auto">
                {myPrayers.map((p, i) => (
                  <div key={i} className="text-sm bg-slate-800/40 rounded-lg p-2.5">
                    <div className="text-[10px] text-slate-500">{p.time}</div>
                    <div className="text-slate-200 mt-0.5">{p.text}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5">
            <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-3">{tx("Favorite Verses")}</div>
            {favVerses.length === 0 ? (
              <div className="text-sm text-slate-500">{tx("Star any Daily Verse from the Cockpit to keep it here.")}</div>
            ) : (
              <div className="space-y-2">
                {favVerses.map((v, i) => (
                  <div key={i} className="flex justify-between gap-2 bg-slate-800/40 rounded-lg p-3">
                    <div>
                      <div className="text-sm text-slate-200 leading-snug">“{v.text}”</div>
                      <div className="text-xs text-amber-500 mt-1">{v.ref}</div>
                    </div>
                    <button onClick={() => toggleFavVerse(v)} className="text-amber-400 shrink-0">★</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5">
            <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-2">{tx("Ministry Motto")}</div>
            <div className="text-base text-amber-100 font-medium">{tx("“If God is for us, who can be against us?”")}</div>
            <div className="text-xs text-slate-500 mt-1">{tx("Romans 8:31 · BEE WELL Ministries")}</div>
          </div>
        </div>
      );

      // VISION
      const Vision = () => (
        <div className="space-y-4 pb-4">
          <div className="rounded-2xl bg-gradient-to-br from-amber-950/60 to-slate-900 border border-amber-800/40 p-5">
            <div className="text-[10px] uppercase tracking-widest text-amber-500 mb-2">{tx("BEE WELL Ministries")}</div>
            <h2 className="text-xl font-semibold text-white mb-1">{tx("The Wells of Salvation")}</h2>
            <p className="text-sm text-amber-100/90 italic mb-4">{tx("“With joy you will draw water from the wells of salvation.” — Isaiah 12:3")}</p>
            <p className="text-sm text-slate-300 leading-relaxed">{tx("BEE WELL is both a regulation system for a complex mind and a ministry born from personal deliverance. The tools exist so the Pilot can stay online long enough to keep seeking, keep writing the vision, and eventually run with it.")}</p>
          </div>

          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 space-y-4">
            <div className="text-[10px] uppercase tracking-widest text-slate-500">{tx("Why This Exists")}</div>
            <p className="text-sm text-slate-300 leading-relaxed">{tx("It began in a bedroom at night — six months of crying out to a God who might not have been listening. Addiction. Mania. Psych wards. Weight and shame. A mind that leaked onto the page. Then progressive vision: an empty Cross, a crown of thorns pressed in, and finally Jesus — broken beyond recognition, bloodied, finished.")}</p>
            <p className="text-sm text-amber-100/95 leading-relaxed italic border-l-2 border-amber-600/60 pl-3">{tx("“This is the cost of your sin. Never forget it. Never forget Me again.”")}</p>
            <p className="text-sm text-slate-300 leading-relaxed">{tx("The last wall fell one evening on the edge of a bed: “Jesus… I can’t do this anymore. I can’t save myself. I give You my life. All of it. I’m Yours.” What followed was not the numbness of pills or the oblivion of blackouts. It was peace — real, tangible, the day the running stopped.")}</p>
            <p className="text-sm text-slate-400 leading-relaxed">{tx("That story is not a museum piece. It is the reason the Cockpit, the Formation tracks, and the Write space exist: so others can stay alive long enough to meet the same mercy.")}</p>
          </div>

          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 space-y-3">
            <div className="text-[10px] uppercase tracking-widest text-slate-500">{tx("The Mandate")}</div>
            <div className="space-y-3 text-sm text-slate-300 leading-relaxed">
              <p><span className="text-amber-400 font-medium">{tx("Seek the hidden things.")}</span> {tx("Call to Him — He answers and reveals what the world cannot see (Jeremiah 33:3).")}</p>
              <p><span className="text-amber-400 font-medium">{tx("Write the vision.")}</span> {tx("Make it plain so the one who reads it may run (Habakkuk 2:2–3).")}</p>
              <p><span className="text-amber-400 font-medium">{tx("Dream beyond yourself.")}</span> {tx("He is able to do far more than all we ask or think (Ephesians 3:20).")}</p>
              <p><span className="text-amber-400 font-medium">{tx("Raise a rescue family.")}</span> {tx("Liberty to the oppressed; light in the dark (Luke 4:18).")}</p>
              <p><span className="text-amber-400 font-medium">{tx("Lead from brokenness.")}</span> {tx("Personal deliverance becomes a roadmap for others — not a platform for pride.")}</p>
            </div>
          </div>

          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5">
            <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-3">{tx("What We Hold")}</div>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li className="flex gap-2"><span className="text-amber-400 shrink-0">•</span><span><span className="text-white font-medium">{tx("Proclaim the Gospel")}</span> {tx("— the finished work of the Cross, not self-help alone.")}</span></li>
              <li className="flex gap-2"><span className="text-amber-400 shrink-0">•</span><span><span className="text-white font-medium">{tx("Restore the broken")}</span> {tx("— mind, body, and story; regulation and grace together.")}</span></li>
              <li className="flex gap-2"><span className="text-amber-400 shrink-0">•</span><span><span className="text-white font-medium">{tx("Raise disciples and leaders")}</span> {tx("— people who can stay stable enough to serve.")}</span></li>
              <li className="flex gap-2"><span className="text-amber-400 shrink-0">•</span><span><span className="text-white font-medium">{tx("Equip for ministry")}</span> {tx("— practical tools + spiritual formation, not theory only.")}</span></li>
              <li className="flex gap-2"><span className="text-amber-400 shrink-0">•</span><span><span className="text-white font-medium">{tx("Advance the Kingdom")}</span> {tx("— one recovered life at a time, then communities.")}</span></li>
            </ul>
            <div className="mt-4 pt-3 border-t border-slate-800 text-sm text-amber-100/90 font-medium">
              “If God is for us, who can be against us?” — Romans 8:31
            </div>
          </div>

          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 space-y-2">
            <div className="text-[10px] uppercase tracking-widest text-slate-500">{tx("How to Use This App in That Light")}</div>
            <p className="text-sm text-slate-300 leading-relaxed">
              Cockpit keeps the Pilot online. Formation roots you in Scripture over 90 days and a full year. Tools catch you in the storm. Write lets the mind bleed onto the page instead of into destruction. Together reminds you that you are not the only one who has sat on the floor at 3 a.m. Vision holds the reason any of this matters.
            </p>
            <p className="text-sm text-slate-400 leading-relaxed">
              Draw from the wells. Stay alive. Run when you can. Rest when you must. He finishes what He starts.
            </p>
          </div>

          <button onClick={handleInstall} className="w-full py-3.5 rounded-2xl bg-amber-600/90 text-white font-medium text-sm">
            📱 Install BEE WELL
          </button>
        </div>
      );

      // VAULT
      const exportData = () => {
        const payload = {
          exported: new Date().toISOString(), version: 2, fox, stability, day90, day365, completed90,
          logs, journalEntries, favVerses, myPrayers, dailyFn, dailyHistory, settings,
          customAnchors, safePeople, weeklyNote, medsSnooze
        };
        const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = `bee-well-export-${new Date().toISOString().slice(0,10)}.json`; a.click(); URL.revokeObjectURL(url);
      };
      const exportJournalText = () => {
        const text = journalEntries.map(e => `--- ${e.time} ---\n${e.text}\n`).join('\n') || 'No journal entries yet.';
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = `bee-well-journal-${new Date().toISOString().slice(0,10)}.txt`; a.click(); URL.revokeObjectURL(url);
      };

      const Vault = () => (
        <div className="space-y-4 pb-4">
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 text-center">
              <div className="text-2xl font-bold text-white">{logs.length}</div>
              <div className="text-[10px] text-slate-400">{tx("State Logs")}</div>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 text-center">
              <div className="text-2xl font-bold text-white">{journalEntries.length}</div>
              <div className="text-[10px] text-slate-400">{tx("Writings")}</div>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 text-center">
              <div className="text-2xl font-bold text-white">{completed90.length}</div>
              <div className="text-[10px] text-slate-400">{tx("90-Day")}</div>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button onClick={exportData} className="flex-1 min-w-[40%] py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-200">{tx("Export All (JSON)")}</button>
            <button onClick={exportJournalText} className="flex-1 min-w-[40%] py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-200">{tx("Export Journal")}</button>
            <button onClick={exportTherapistPacket} className="flex-1 min-w-[40%] py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-200">{tx("Care packet")}</button>
            <button onClick={shareTodayCard} className="flex-1 min-w-[40%] py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-200">{tx("Share Today")}</button>
            <button onClick={() => window.print()} className="flex-1 min-w-[40%] py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-200">{tx("Print helpers")}</button>
            <label className="flex-1 min-w-[40%] py-2.5 rounded-xl bg-indigo-950/40 border border-indigo-700/40 text-sm text-indigo-200 text-center cursor-pointer">
              Import backup
              <input type="file" accept="application/json,.json" className="hidden" onChange={e => { importBackup(e.target.files?.[0]); e.target.value = ''; }} />
            </label>
          </div>

          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4 space-y-3">
            <div className="text-[10px] uppercase tracking-widest text-slate-500">{tx("Safe people · one-tap Signal Flare")}</div>
            <p className="text-xs text-slate-400">{tx("Save 1–3 people. When you need presence, share a short flare without writing from scratch.")}</p>
            {safePeople.map((p, i) => (
              <div key={i} className="flex items-center gap-2 bg-slate-800/40 rounded-xl p-2.5">
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-white font-medium truncate">{p.name}</div>
                  {p.note && <div className="text-xs text-slate-500 truncate">{p.note}</div>}
                </div>
                <button onClick={() => signalFlareFor(p)} className="text-xs px-2.5 py-1.5 rounded-lg bg-indigo-600 text-white shrink-0">{tx("Flare")}</button>
                <button onClick={() => setSafePeople(sp => sp.filter((_, j) => j !== i))} className="text-xs text-slate-500 px-1">✕</button>
              </div>
            ))}
            {safePeople.length < 3 && (
              <div className="space-y-2">
                <input value={newPerson.name} onChange={e => setNewPerson(p => ({ ...p, name: e.target.value }))} placeholder={tx("Name")} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white" />
                <input value={newPerson.note} onChange={e => setNewPerson(p => ({ ...p, note: e.target.value }))} placeholder={tx("Note (optional)")} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white" />
                <button onClick={() => { if (!newPerson.name.trim()) return; setSafePeople(sp => [...sp, { ...newPerson, name: newPerson.name.trim() }]); setNewPerson({ name: '', note: '' }); }} className="w-full py-2 rounded-lg bg-slate-700 text-sm text-white">{tx("Add person")}</button>
              </div>
            )}
          </div>

          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4 space-y-3">
            <div className="text-[10px] uppercase tracking-widest text-slate-500">{tx("Your Truth Anchors")}</div>
            <p className="text-xs text-slate-400">{tx("Add personal lie → truth pairs. They join the rotating Truth Anchors on Cockpit.")}</p>
            {customAnchors.map((a, i) => (
              <div key={i} className="bg-slate-800/40 rounded-xl p-2.5 text-sm">
                <div className="text-slate-500 line-through text-xs">{a.lie}</div>
                <div className="text-amber-100">{a.truth}</div>
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-amber-600">{a.ref || 'Personal'}</span>
                  <button onClick={() => setCustomAnchors(c => c.filter((_, j) => j !== i))} className="text-xs text-slate-500">{tx("Remove")}</button>
                </div>
              </div>
            ))}
            <input value={newAnchor.lie} onChange={e => setNewAnchor(a => ({ ...a, lie: e.target.value }))} placeholder={tx("The lie…")} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white" />
            <input value={newAnchor.truth} onChange={e => setNewAnchor(a => ({ ...a, truth: e.target.value }))} placeholder={tx("The truth…")} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white" />
            <input value={newAnchor.ref} onChange={e => setNewAnchor(a => ({ ...a, ref: e.target.value }))} placeholder={tx("Verse or note (optional)")} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white" />
            <button onClick={() => { if (!newAnchor.lie.trim() || !newAnchor.truth.trim()) return; setCustomAnchors(c => [...c, { ...newAnchor }]); setNewAnchor({ lie: '', truth: '', ref: '' }); }} className="w-full py-2 rounded-lg bg-amber-700 text-sm text-white">{tx("Add anchor")}</button>
          </div>

          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4 space-y-3">
            <div className="text-[10px] uppercase tracking-widest text-slate-500">{tx("Weekly review")}</div>
            <p className="text-xs text-slate-400">{tx("Once a week: what worked, what cost too much, one change.")}</p>
            <input value={weeklyNote.win || ''} onChange={e => setWeeklyNote(w => ({ ...w, win: e.target.value, week: weekKey() }))} placeholder={tx("Wins this week")} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white" />
            <input value={weeklyNote.drain || ''} onChange={e => setWeeklyNote(w => ({ ...w, drain: e.target.value, week: weekKey() }))} placeholder={tx("What drained you")} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white" />
            <input value={weeklyNote.change || ''} onChange={e => setWeeklyNote(w => ({ ...w, change: e.target.value, week: weekKey() }))} placeholder={tx("One change for next week")} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white" />
            {weeklyNote.week && <div className="text-[11px] text-slate-500">Saved for {weeklyNote.week}</div>}
          </div>

          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4 space-y-3">
            <div className="text-[10px] uppercase tracking-widest text-slate-500">{tx("Pattern insights")}</div>
            {patternInsights().map((tip, i) => (
              <div key={i} className="text-sm text-slate-300 bg-slate-800/40 rounded-lg p-2.5 leading-relaxed">{tx(tip)}</div>
            ))}
          </div>

          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4 space-y-3">
            <div className="text-[10px] uppercase tracking-widest text-slate-500">{tx("Settings")}</div>
            <label className="flex items-center justify-between text-sm text-slate-300">
              <span>{tx("Larger text")}</span>
              <input type="checkbox" checked={!!settings.largeText} onChange={e => patchSettings({ largeText: e.target.checked })} />
            </label>
            <label className="flex items-center justify-between text-sm text-slate-300">
              <span>{tx("Reduce motion")}</span>
              <input type="checkbox" checked={!!settings.reduceMotion} onChange={e => patchSettings({ reduceMotion: e.target.checked })} />
            </label>
            <label className="flex items-center justify-between text-sm text-slate-300">
              <span>{tx("Today mode (simpler Cockpit)")}</span>
              <input type="checkbox" checked={!!settings.todayMode} onChange={e => patchSettings({ todayMode: e.target.checked })} />
            </label>
            <label className="flex items-center justify-between text-sm text-slate-300">
              <span>{tx("Curriculum / group notes mode")}</span>
              <input type="checkbox" checked={!!settings.curriculumMode} onChange={e => patchSettings({ curriculumMode: e.target.checked })} />
            </label>
            <div className="text-sm text-slate-300">
              <div className="mb-1">{tx("Language (UI labels)")}</div>
              <select value={settings.lang || 'en'} onChange={e => patchSettings({ lang: e.target.value })} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white">
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
              </select>
            </div>
            <div className="text-[11px] text-slate-500 leading-relaxed">
              Screens, buttons, and weather follow this language. Scripture and the 90/365 readings stay in English.
            </div>
            <div className="text-[11px] text-slate-500 leading-relaxed">
              Data stays on this device. Use Export All JSON to back up or move to another phone (import coming: paste JSON via file open on desktop). Care packet excludes private journal text.
            </div>
          </div>

          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4">
            <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-3">{tx("Recent State Logs")}</div>
            {logs.length === 0 ? (
              <div className="text-slate-500 text-sm py-4 text-center">{tx("No logs yet. Log a state from the Cockpit.")}</div>
            ) : (
              <div className="space-y-2 max-h-56 overflow-y-auto">
                {logs.slice(0, 20).map((l, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm py-1.5 border-b border-slate-800/60 last:border-0">
                    <span className="text-[11px] text-slate-500 shrink-0 w-28">{l.time}</span>
                    <span className="text-slate-200">{l.state}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4 space-y-3">
            <div className="text-[10px] uppercase tracking-widest text-slate-500">{tx("Helper one-pagers · For walking with others")}</div>
            <p className="text-xs text-slate-400">{tx("Copy and share with a pastor, sponsor, friend, or group. Regulate first — then talk.")}</p>
            {HELPER_PAGES.map(h => (
              <div key={h.id} className="bg-slate-800/40 rounded-xl p-3">
                <div className="flex justify-between items-start gap-2 mb-1.5">
                  <div className="text-sm font-medium text-white">{tx(h.title)}</div>
                  <button
                    onClick={() => copyText(h.title + '\n\n' + h.body.replace(/\\n/g, '\n'))}
                    className="text-xs px-2 py-1 rounded-lg bg-slate-700 text-slate-200 shrink-0"
                  >{copiedScript === 'ok' ? tx('Copied') : tx('Copy')}</button>
                </div>
                <pre className="text-xs text-slate-400 whitespace-pre-wrap font-sans leading-relaxed">{tx(h.body).replace(/\\n/g, '\n')}</pre>
              </div>
            ))}
          </div>

          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4">
            <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-3">{tx("Crisis & Support · Worldwide")}</div>
            <div className="space-y-2">
              {CRISIS.map((c, i) => (
                <div key={i} className="p-2.5 rounded-lg bg-slate-800/40 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white font-medium">{c.name}</span>
                    <span className="text-[10px] text-slate-500 uppercase">{c.region}</span>
                  </div>
                  <div className="text-amber-300/90 text-xs mt-0.5">{c.detail}</div>
                  {c.note && <div className="text-slate-500 text-[11px]">{c.note}</div>}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {c.callUrl && <a href={c.callUrl} className="text-xs px-2.5 py-1 rounded-lg bg-amber-700/80 text-white">{tx("Call")}</a>}
                    {c.textUrl && <a href={c.textUrl} className="text-xs px-2.5 py-1 rounded-lg bg-indigo-700/80 text-white">{tx("Text")}</a>}
                    {c.url && <a href={c.url} target="_blank" rel="noreferrer" className="text-xs px-2.5 py-1 rounded-lg bg-slate-700 text-slate-100">{tx("Support website ↗")}</a>}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-slate-500 mt-3">{tx("If you are in immediate danger, call your local emergency number. You are not alone.")}</p>
          </div>
        </div>
      );


      const CheckInSheet = () => (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 p-3" onClick={() => patchSettings({ checkInOpen: false })}>
          <div role="dialog" aria-modal="true" className="w-full max-w-lg max-h-[86dvh] overflow-y-auto rounded-2xl border border-indigo-600/50 bg-slate-900 p-4 shadow-2xl space-y-3" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between gap-3">
              <div className="text-[11px] uppercase tracking-widest text-indigo-300">Quick check-in · {checkInStep + 1}/3</div>
              <button type="button" onClick={() => patchSettings({ checkInOpen: false })} className="rounded-lg px-2 py-1 text-sm text-slate-300">{tx("Close")}</button>
            </div>
            {checkInStep === 0 && (
              <div className="space-y-2">
                <p className="text-base text-slate-100">{tx("How’s the weather? Tap one primary state.")}</p>
                <div className="grid grid-cols-2 gap-1.5">
                  {STATES.map(s => (
                    <button type="button" key={s.id} onClick={() => { setSelectedStates([s]); setCheckInStep(1); }} className="rounded-xl border border-slate-700 px-3 py-3 text-left text-sm text-slate-100 active:scale-[0.98]">{tx(s.short)}</button>
                  ))}
                </div>
              </div>
            )}
            {checkInStep === 1 && (
              <div className="space-y-3">
                <p className="text-base text-slate-100">{tx("Set your tank (energy / stress).")}</p>
                <div>
                  <div className="text-xs text-slate-400">Energy {dailyFn.energy || 5}/10</div>
                  <input type="range" min="1" max="10" value={dailyFn.energy || 5} onChange={e => patchDaily({ energy: +e.target.value })} className="w-full accent-amber-500" />
                </div>
                <div>
                  <div className="text-xs text-slate-400">Stress {dailyFn.stress || 5}/10</div>
                  <input type="range" min="1" max="10" value={dailyFn.stress || 5} onChange={e => patchDaily({ stress: +e.target.value })} className="w-full accent-red-500" />
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setCheckInStep(0)} className="flex-1 rounded-xl bg-slate-800 py-3 text-sm text-slate-200">{tx("Back")}</button>
                  <button type="button" onClick={() => setCheckInStep(2)} className="flex-1 rounded-xl bg-indigo-600 py-3 text-sm text-white">{tx("Next")}</button>
                </div>
              </div>
            )}
            {checkInStep === 2 && (
              <div className="space-y-3">
                <p className="text-base text-slate-100">{tx("Name today’s Great Fox (one lever).")}</p>
                <input value={fox} onChange={e => setFox(e.target.value)} placeholder={tx("One thing…")} className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-3 text-white" />
                <div className="flex gap-2">
                  <button type="button" onClick={() => setCheckInStep(1)} className="flex-1 rounded-xl bg-slate-800 py-3 text-sm text-slate-200">{tx("Back")}</button>
                  <button type="button" onClick={() => { if (selectedStates.length) logSelectedStates(); saveDayToHistory(); patchSettings({ checkInOpen: false }); setToast('Check-in saved.'); window.setTimeout(() => setToast(''), 2400); }} className="flex-1 rounded-xl bg-amber-600 py-3 text-sm font-medium text-white">{tx("Done · log & close")}</button>
                </div>
              </div>
            )}
          </div>
        </div>
      );


      return (
        <div id="bee-root" className="mx-auto flex h-dvh max-w-lg flex-col overflow-hidden bg-[#0b1120]">
          <header className="shrink-0 border-b border-slate-800 bg-slate-950 px-4 pt-[max(0.6rem,env(safe-area-inset-top))] pb-2.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-sm font-bold text-slate-900 shadow-lg shadow-amber-500/20">🐝</div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold tracking-tight text-white">BEE WELL</div>
                  <div className="truncate text-[10px] text-slate-500">{tx("Wells of Salvation")}</div>
                </div>
              </div>
              <div className="flex shrink-0 overflow-hidden rounded-lg border border-slate-700" role="group" aria-label={tx("Language")}>
                {[['en','EN'],['es','ES'],['fr','FR']].map(([code, lab]) => (
                  <button key={code} type="button" onClick={() => patchSettings({ lang: code })} className={`px-2.5 py-1.5 text-[11px] font-semibold tracking-wide ${(settings.lang || 'en') === code ? 'bg-amber-500 text-slate-950' : 'text-slate-400'}`}>{lab}</button>
                ))}
              </div>
            </div>
            <div className="mt-2 flex items-center gap-1.5">
              <button type="button" onClick={() => { setCheckInStep(0); patchSettings({ checkInOpen: true }); setTab('cockpit'); }} className="rounded-lg bg-indigo-600 px-3 py-2 text-[12px] font-semibold text-white">{tx("Check-in")}</button>
              <button type="button" onClick={() => patchSettings({ todayMode: !settings.todayMode })} className={`rounded-lg border px-3 py-2 text-[12px] font-semibold uppercase tracking-wide ${settings.todayMode ? 'border-amber-500/50 text-amber-300' : 'border-slate-700 text-slate-400'}`}>{tx("Today")}</button>
              <button type="button" onClick={handleInstall} className="ml-auto rounded-lg border border-amber-700/40 px-2.5 py-2 text-[11px] font-medium text-amber-400">{tx("Install")}</button>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto px-4 py-4" style={settings.largeText ? { fontSize: '1.05rem' } : undefined}>
            {tab === 'cockpit' && Cockpit()}
            {tab === 'formation' && Formation()}
            {tab === 'tools' && Tools()}
            {tab === 'write' && Write()}
            {tab === 'community' && Community()}
            {tab === 'vision' && Vision()}
            {tab === 'vault' && Vault()}
          </main>

          <nav className="safe-bottom shrink-0 border-t border-slate-800 bg-slate-950">
            <div className="flex justify-around px-0.5 py-1">
              {NavButton({ id: "cockpit", label: "Cockpit", icon: "🧭" })}
              {NavButton({ id: "formation", label: "Form", icon: "📖" })}
              {NavButton({ id: "tools", label: "Tools", icon: "🛠️" })}
              {NavButton({ id: "write", label: "Write", icon: "✍️" })}
              {NavButton({ id: "community", label: "Together", icon: "🤝" })}
              {NavButton({ id: "vision", label: "Vision", icon: "✝️" })}
              {NavButton({ id: "vault", label: "Vault", icon: "🗄️" })}
            </div>
          </nav>
          {toast && <div className="fixed left-1/2 top-24 z-50 -translate-x-1/2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-lg">{tx(toast)}</div>}
          {settings.checkInOpen && CheckInSheet()}
        </div>
      );
    }

    
  