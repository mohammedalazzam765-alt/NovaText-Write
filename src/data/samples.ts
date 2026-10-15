export interface SamplePreset {
  id: string;
  title: string;
  description: string;
  text: string;
}

export const SAMPLE_PRESETS: SamplePreset[] = [
  {
    id: 'sample-academic-grammar',
    title: 'Academic Paper (With Grammar Errors)',
    description: 'Demonstrates real-time spell checking, subject-verb correction, and wordiness reduction.',
    text: `In order to achieve high academic performance, students must manage their time effectively. Due to the fact that modern curriculum demands are rigorous, they is often overwhelmed. Many scholars beleive that procrastination causes individuals to loose focus. Furthermore, teh research team concluded that each and every student requires close proximity to helpful mentors. At this point in time, we must completely eliminate unnecessary distractions to ensure favorable educational outcomes.`
  },
  {
    id: 'sample-business-email',
    title: 'Business Proposal & Pitch',
    description: 'Perfect for testing formal paraphrasing and executive summarization.',
    text: `Good morning team, I am writing to propose a new direction for our Q3 marketing strategy. We need to make sure that our digital outreach aligns with customer retention goals. Our previous campaign helped us get lots of new leads, but our conversion rate was suboptimal. I think we should look into automated onboarding workflows to make the customer journey more seamless and accelerate our revenue growth.`
  },
  {
    id: 'sample-tech-article',
    title: 'Tech Essay on Future Writing',
    description: 'Great for testing summarization, plagiarism detection, and fluency rewrites.',
    text: `Artificial intelligence has sparked a transformative revolution in modern composition and communicative arts. Where writers once struggled with writer's block and repetitive phrasing, contemporary neural architectures provide contextual suggestions in milliseconds. However, human editorial judgment remains paramount. Critical thinking, nuanced empathy, and authentic voice cannot be replaced by algorithmic token generation.`
  },
  {
    id: 'sample-creative-story',
    title: 'Creative Narrative',
    description: 'Explore creative mode paraphrasing and sensory vocabulary expansion.',
    text: `The autumn wind blew softly through the quiet street as the evening sun slipped beneath the horizon. She walked slowly toward the old wooden bridge, listening to the gentle rustle of falling leaves. In her hand, she held a faded letter that had arrived years ago, its ink worn by time and weathered memories.`
  }
];
