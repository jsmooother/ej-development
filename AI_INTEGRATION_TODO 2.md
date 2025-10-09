# AI Content Generator - Integration Guide

## Current Status: ✅ Mock Implementation Working

The AI content generator is built and working with mock data. When you're ready to connect to a real AI service, follow this guide.

## How It Works Now

1. User enters key facts in "Key Facts & Points" textarea
2. Clicks "Generate Editorial with AI" button
3. API endpoint receives the prompt
4. **Currently:** Returns mock editorial content
5. **Future:** Will call OpenAI/Anthropic API
6. Content fills the "Full Content" textarea
7. User can edit/refine the generated text

## To Integrate Real AI (Later)

### Option 1: OpenAI (ChatGPT)

1. Install OpenAI SDK:
```bash
npm install openai
```

2. Add to `.env`:
```bash
OPENAI_API_KEY=sk-...
```

3. Update `src/app/api/ai/generate-editorial/route.ts`:
```typescript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const completion = await openai.chat.completions.create({
  model: "gpt-4",
  messages: [
    {
      role: "system",
      content: "You are an expert editorial writer for luxury property development in Marbella, Spain. Write engaging, sophisticated articles with an editorial tone similar to architectural journals."
    },
    {
      role: "user",
      content: `Write a compelling editorial article based on these facts: ${prompt}\n\nTitle: ${title}`
    }
  ],
  temperature: 0.7,
  max_tokens: 1500,
});

const content = completion.choices[0].message.content;
```

### Option 2: Anthropic (Claude)

1. Install Anthropic SDK:
```bash
npm install @anthropic-ai/sdk
```

2. Add to `.env`:
```bash
ANTHROPIC_API_KEY=sk-ant-...
```

3. Similar implementation with Claude API

## Features Already Built

✅ **User Input:** Textarea for key facts and points  
✅ **API Endpoint:** `/api/ai/generate-editorial`  
✅ **Loading States:** Button shows "Generating..." while processing  
✅ **Error Handling:** Alerts on failure  
✅ **Content Integration:** Auto-fills content textarea  
✅ **Editable Output:** User can refine AI-generated text  
✅ **Beautiful UI:** Gradient button with lightning icon  

## Cost Estimate

- **OpenAI GPT-4:** ~$0.03 per editorial (1500 tokens)
- **Claude Sonnet:** ~$0.015 per editorial
- **Very affordable** for occasional use

## Future Enhancements

- [ ] Add "Regenerate" button to try again
- [ ] Save AI prompts for reuse
- [ ] Tone selector (formal, casual, technical)
- [ ] Length selector (short, medium, long)
- [ ] Multiple language support
- [ ] SEO optimization suggestions

---

**Current implementation works perfectly for testing the workflow!**  
When ready to go live, just swap the mock response for real AI API calls.

