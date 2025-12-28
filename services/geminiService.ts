
import { GoogleGenAI, Type } from "@google/genai";
import { ApplicantProfile, UserProfile, ProjectEvaluationResult, Question, AnalyticalQuestion, FailureSimulation, GovStats } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const MODEL_NAME = "gemini-3-flash-preview";

// Evaluating project ideas with structured JSON output
export const evaluateProjectIdea = async (description: string, profile: ApplicantProfile): Promise<ProjectEvaluationResult> => {
  const prompt = `
    أنت مستشار ريادي خبير في مسرعة أعمال "بيزنس ديفلوبرز". قم بتقييم فكرة المشروع التالية:
    القطاع المستهدف: ${profile.sector}
    المرحلة الحالية: ${profile.projectStage}
    مستوى المتقدم التقني: ${profile.techLevel}
    
    الفكرة المكتوبة: "${description}"

    المطلوب منك تحليل الفكرة بموضوعية واحترافية عبر 5 محاور أساسية (درجة من 20 لكل محور):
    1. Clarity (وضوح الفكرة): هل المشكلة والحل محددين بوضوح؟
    2. Value (القيمة المقترحة): هل يقدم المشروع فائدة ملموسة للعملاء؟
    3. Innovation (التميز والابتكار): هل هناك ميزة تنافسية حقيقية؟
    4. Market (الجدوى السوقية): هل هناك طلب حقيقي وإمكانية نمو؟
    5. Readiness (الجاهزية للتنفيذ): هل الفكرة قابلة للتطبيق بالموارد المتاحة؟

    يجب أن يكون المجموع الكلي من 100.
    
    تصنيفات الحالة (classification):
    - Green: مجموع 80-100 (فكرة ناضجة ومؤهلة).
    - Yellow: مجموع 60-79 (فكرة واعدة تحتاج تطوير).
    - Red: مجموع أقل من 60 (فكرة ضعيفة أو غير واضحة).

    يجب أن يكون الرد بصيغة JSON فقط:
    {
      "clarity": number,
      "value": number,
      "innovation": number,
      "market": number,
      "readiness": number,
      "totalScore": number,
      "aiOpinion": "نص بالعربية يشرح نقاط القوة والضعف وتوصية للمستقبل",
      "classification": "Green" | "Yellow" | "Red"
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            clarity: { type: Type.NUMBER },
            value: { type: Type.NUMBER },
            innovation: { type: Type.NUMBER },
            market: { type: Type.NUMBER },
            readiness: { type: Type.NUMBER },
            totalScore: { type: Type.NUMBER },
            aiOpinion: { type: Type.STRING },
            classification: { type: Type.STRING, enum: ['Green', 'Yellow', 'Red'] }
          },
          required: ["clarity", "value", "innovation", "market", "readiness", "totalScore", "aiOpinion", "classification"]
        }
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (e) {
    return {
      clarity: 10, value: 10, innovation: 10, market: 10, readiness: 10,
      totalScore: 50, aiOpinion: "حدث خطأ أثناء التحليل الذكي. يرجى المحاولة لاحقاً.",
      classification: 'Yellow'
    };
  }
};

// Creating a chat session for the Path Finder interview
export const createPathFinderChat = () => {
  return ai.chats.create({
    model: MODEL_NAME,
    config: {
      systemInstruction: `أنت "مستشار المسار" الذكي في مسرعة بيزنس ديفلوبرز. 
      مهمتك هي إجراء مقابلة ريادية قصيرة (3-5 أسئلة) لتقييم عقلية المستخدم وجاهزيته.
      1. ابدأ بترحيب حماسي واسأل عن جوهر الفكرة.
      2. اطرح سؤالاً واحداً في كل مرة.
      3. ركز على: حل المشكلة، نموذج الربح، والشغف.
      4. كن ودوداً ولكن دقيقاً في ملاحظاتك.
      5. عندما تنتهي من التقييم، أرسل بلوك JSON بالقرار النهائي:
      \`\`\`json
      { "decision": "APPROVED", "reason": "شرح لسبب القبول بناءً على الحوار", "feedback": "توصية ختامية للمستخدم" }
      \`\`\`
      إذا كان المستخدم غير جدي أو إجاباته فارغة، استخدم "REJECTED".`,
    }
  });
};

// Generating educational material for specific startup levels
export const generateLevelMaterial = async (levelId: number, title: string, user: UserProfile): Promise<{ content: string; exercise: string }> => {
  const prompt = `بصفتك مدرب أعمال خبير، أنتج مادة تعليمية للمستوى ${levelId}: ${title}. 
  مشروع المستخدم: ${user.startupName} في قطاع ${user.industry}.
  المطلوب:
  1. محتوى نصي (content) باللغة العربية بأسلوب تعليمي رصين ومحفز.
  2. تمرين تطبيقي (exercise) يطلب من المستخدم تنفيذ مهمة محددة لمشروعه.
  الرد JSON فقط.`;
  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          content: { type: Type.STRING },
          exercise: { type: Type.STRING }
        },
        required: ["content", "exercise"]
      }
    }
  });
  return JSON.parse(response.text || "{}");
};

// Generating quiz questions for a specific level
export const generateLevelQuiz = async (levelId: number, title: string, user: UserProfile): Promise<Question[]> => {
    const prompt = `أنتج اختباراً من 3 أسئلة اختيار من متعدد للمستوى ${levelId}: ${title}. الأسئلة يجب أن تقيس فهم المبادئ المذكورة في هذا المستوى. الرد JSON كمصفوفة.`;
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.NUMBER },
              text: { type: Type.STRING },
              options: { type: Type.ARRAY, items: { type: Type.STRING } },
              correctIndex: { type: Type.NUMBER },
              explanation: { type: Type.STRING }
            },
            required: ["id", "text", "options", "correctIndex", "explanation"]
          }
        }
      }
    });
    return JSON.parse(response.text || "[]");
};

// Evaluating an exercise response from a user
export const evaluateExerciseResponse = async (prompt: string, answer: string): Promise<{ passed: boolean; feedback: string }> => {
  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: `بصفتك مقيم مشاريع، قيّم هذه الإجابة على التمرين: ${prompt}. الإجابة المقدمة: ${answer}. هل هي مقنعة وتنم عن فهم؟ الرد JSON فقط.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          passed: { type: Type.BOOLEAN },
          feedback: { type: Type.STRING }
        },
        required: ["passed", "feedback"]
      }
    }
  });
  return JSON.parse(response.text || "{}");
};

// Generating sector-specific analytical questions for the personality test phase
export const generateAnalyticalQuestions = async (profile: ApplicantProfile): Promise<AnalyticalQuestion[]> => {
    const prompt = `أنتج 3 أسئلة تحليلية ذكية لتقييم رائد أعمال في قطاع ${profile.sector}. الأسئلة يجب أن تتضمن سيناريوهات عملية. الرد JSON.`;
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              text: { type: Type.STRING },
              options: { type: Type.ARRAY, items: { type: Type.STRING } },
              correctIndex: { type: Type.NUMBER },
              difficulty: { type: Type.STRING, enum: ['Easy', 'Medium', 'Hard'] }
            },
            required: ["text", "options", "correctIndex", "difficulty"]
          }
        }
      }
    });
    return JSON.parse(response.text || "[]");
};

// Running multiple AI agents to analyze a project
export const runProjectAgents = async (name: string, description: string, agentIds: string[]): Promise<any> => {
    const prompt = `حلل مشروع: ${name}. الوصف: ${description}. باستخدام الوكلاء: ${agentIds.join(', ')}. الرد JSON يشمل الرؤية، تحليل السوق، شرائح المستخدمين، والفرضيات.`;
    const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    vision: { type: Type.STRING },
                    market: { type: Type.STRING },
                    users: { type: Type.STRING },
                    hypotheses: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["vision", "market", "users", "hypotheses"]
            }
        }
    });
    return JSON.parse(response.text || "{}");
};

// Generating a pitch deck based on project results
export const generatePitchDeck = async (name: string, description: string, results: any): Promise<{ title: string; content: string }[]> => {
    const prompt = `حول نتائج مشروع ${name} إلى عرض تقديمي (Pitch Deck) احترافي. الرد JSON كمصفوفة شرائح.`;
    const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING },
                        content: { type: Type.STRING }
                    },
                    required: ["title", "content"]
                }
            }
        }
    });
    return JSON.parse(response.text || "[]");
};

// Fixed missing export for ExportDecisionEngine component
export const analyzeExportOpportunity = async (formData: any): Promise<any> => {
  const prompt = `حلل فرصة التصدير للمنتج التالي:
    نوع المنتج: ${formData.productType}
    القطاع: ${formData.sector}
    الجاهزية: ${formData.readiness}
    السوق المستهدف: ${formData.targetMarket}
    التوقيت: ${formData.timing}
    
    المطلوب: تقديم قرار تصديري (EXPORT_NOW, WAIT, REJECT) وتحليل للمخاطر والطلب والتنظيمات والتوصيات.
    الرد JSON فقط.`;

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          decision: { type: Type.STRING, enum: ['EXPORT_NOW', 'WAIT', 'REJECT'] },
          analysis: {
            type: Type.OBJECT,
            properties: {
              demand: { type: Type.STRING },
              regulations: { type: Type.STRING },
              risks: { type: Type.STRING },
              seasonality: { type: Type.STRING }
            },
            required: ["demand", "regulations", "risks", "seasonality"]
          },
          recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["decision", "analysis", "recommendations"]
      }
    }
  });
  return JSON.parse(response.text || "{}");
};

// Fixed missing export for SmartFeatures component
export const simulateBrutalTruth = async (formData: any): Promise<FailureSimulation> => {
  const prompt = `قدم "الحقيقة القاسية" حول فشل تصدير المنتج ${formData.productType} إلى ${formData.targetMarket}. كن صريحاً ومباشراً جداً في توضيح لماذا قد يفشل المشروع مالياً وتشغيلياً.
    الرد JSON فقط.`;

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          brutalTruth: { type: Type.STRING },
          probability: { type: Type.NUMBER },
          financialLoss: { type: Type.STRING },
          operationalImpact: { type: Type.STRING },
          missingQuestions: { type: Type.ARRAY, items: { type: Type.STRING } },
          recoveryPlan: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["brutalTruth", "probability", "financialLoss", "operationalImpact", "missingQuestions", "recoveryPlan"]
      }
    }
  });
  return JSON.parse(response.text || "{}");
};

// Fixed missing export for GovDashboard component
export const getGovInsights = async (): Promise<GovStats> => {
  const prompt = `ولد إحصائيات ورؤى وطنية حول سوق التصدير والناجحين والقطاعات الواعدة بناءً على بيانات افتراضية واقعية للمنطقة العربية.
    الرد JSON فقط.`;

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          riskyMarkets: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                failRate: { type: Type.NUMBER }
              },
              required: ["name", "failRate"]
            }
          },
          readySectors: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                score: { type: Type.NUMBER }
              },
              required: ["name", "score"]
            }
          },
          commonFailReasons: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                reason: { type: Type.STRING },
                percentage: { type: Type.NUMBER }
              },
              required: ["reason", "percentage"]
            }
          },
          regulatoryGaps: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["riskyMarkets", "readySectors", "commonFailReasons", "regulatoryGaps"]
      }
    }
  });
  return JSON.parse(response.text || "{}");
};
