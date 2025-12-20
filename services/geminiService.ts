// Fix: Use correct import for GoogleGenAI and Type
import { GoogleGenAI, Type } from "@google/genai";
import { Job, Candidate } from "../types";

// Fix: Initialize GoogleGenAI with named parameter apiKey from process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Fix: Use recommended model name gemini-3-flash-preview for text tasks
const modelName = "gemini-3-flash-preview";

/**
 * Reviews a candidate's resume against a job description.
 */
export const reviewCandidateApplication = async (
  job: Job,
  candidate: Candidate
): Promise<{
  score: number;
  summary: string;
  pros: string[];
  cons: string[];
  matchAnalysis: string;
}> => {
  if (!process.env.API_KEY) throw new Error("API Key is missing");

  const prompt = `
    You are an expert technical recruiter for Remote Business Partner.
    Please review the following candidate application for the position of "${job.title}".

    Job Description:
    ${job.description}

    Requirements:
    ${job.requirements}

    Candidate Resume/Profile:
    ${candidate.resumeText}

    Analyze the candidate's suitability. Provide a match score (0-100), a professional summary, list of pros and cons, and a detailed match analysis.
  `;

  // Fix: Defined schema using Type and removed deprecated Schema import
  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      score: { type: Type.NUMBER, description: "Suitability score from 0 to 100" },
      summary: { type: Type.STRING, description: "Brief professional summary of the candidate" },
      pros: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of candidate strengths" },
      cons: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of candidate weaknesses or gaps" },
      matchAnalysis: { type: Type.STRING, description: "Detailed analysis of fit" },
    },
    required: ["score", "summary", "pros", "cons", "matchAnalysis"],
  };

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    // Fix: Access response text as a property, not a method
    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text);
  } catch (error) {
    console.error("AI Review Failed:", error);
    throw error;
  }
};

/**
 * Generates a dynamic interview/vetting process based on the job description.
 */
export const generateInterviewProcess = async (job: Job): Promise<string[]> => {
  if (!process.env.API_KEY) throw new Error("API Key is missing");

  const prompt = `
    Create a custom 5-7 step recruitment and vetting process for a "${job.title}" role.
    The process should be specific to the requirements of the job.

    Job Description:
    ${job.description}

    Requirements:
    ${job.requirements}

    Return a list of steps (strings).
  `;

  // Fix: Removed deprecated Schema type
  const responseSchema = {
    type: Type.ARRAY,
    items: { type: Type.STRING },
    description: "A list of recruitment process steps",
  };

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    // Fix: Access response text as a property
    const text = response.text;
    if (!text) throw new Error("No response from AI");

    return JSON.parse(text);
  } catch (error) {
    console.error("AI Process Generation Failed:", error);
    throw error;
  }
};

/**
 * Generates a set of screening questions.
 */
export const generateScreeningQuestions = async (job: Job, candidate?: Candidate): Promise<string[]> => {
    if (!process.env.API_KEY) throw new Error("API Key is missing");
  
    let prompt = `
      Generate 5 key screening interview questions for a candidate applying for: ${job.title}.
      Focus on these requirements: ${job.requirements}.
    `;

    if (candidate) {
        prompt += `
        
        Candidate Resume Context:
        ${candidate.resumeText}
        
        Please tailor the questions to specifically address the candidate's experience level as described in their resume, and probe any potential gaps or areas where they might lack specific requirements.
        `;
    }
  
    // Fix: Removed deprecated Schema type
    const responseSchema = {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of interview questions",
    };
  
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: responseSchema
        }
      });
      // Fix: Access response text as a property
      const text = response.text;
      if (!text) return [];
      return JSON.parse(text);
    } catch (e) {
      console.error(e);
      return [];
    }
}

/**
 * Generates a status update email for a candidate.
 */
export const generateStatusEmail = async (job: Job, candidate: Candidate, newStatus: string): Promise<{subject: string, body: string}> => {
    if (!process.env.API_KEY) throw new Error("API Key is missing");

    const prompt = `
      Write a professional and polite email to a candidate named "${candidate.name}" regarding their application for "${job.title}".
      The status of their application has just been changed to "${newStatus}".
      
      Context based on status:
      - Screening: We are reviewing your application.
      - Interview: We would like to schedule an interview.
      - Offer: We are pleased to offer you the position.
      - Rejected: Unfortunately we are not moving forward.
      - Hired: Welcome to the team.

      Return a JSON object with 'subject' and 'body'. The body should be plain text, ready to send.
    `;

    // Fix: Removed deprecated Schema type
    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        subject: { type: Type.STRING },
        body: { type: Type.STRING },
      },
      required: ["subject", "body"]
    };

    try {
        const response = await ai.models.generateContent({
            model: modelName,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            },
        });
        // Fix: Access response text as a property
        const text = response.text;
        if (!text) throw new Error("No response from AI");
        return JSON.parse(text);
    } catch (e) {
        console.error("AI Email Generation Failed:", e);
        return { subject: `Update regarding ${job.title}`, body: `Dear ${candidate.name},\n\nYour application status has been updated to ${newStatus}.\n\nBest,\nRecruiting Team` };
    }
}

/**
 * Generates a specific email template for candidate communication.
 */
export const generateCandidateEmail = async (
    job: Job, 
    candidate: Candidate, 
    type: 'interview' | 'rejection' | 'offer'
): Promise<{subject: string, body: string}> => {
  if (!process.env.API_KEY) throw new Error("API Key is missing");

  let typeContext = "";
  switch(type) {
      case 'interview':
          typeContext = "Invite the candidate to an initial screening interview. Propose a few available times (placeholders). Be welcoming.";
          break;
      case 'rejection':
          typeContext = "Politely reject the candidate. Thank them for their time and keep the door open for future opportunities. Be empathetic.";
          break;
      case 'offer':
          typeContext = "Extend a formal job offer. Mention that the detailed offer letter is attached (placeholder). Express excitement and next steps.";
          break;
  }

  const prompt = `
    You are a professional recruiter. Write an email to ${candidate.name} regarding the "${job.title}" position.
    
    Task: ${typeContext}
    
    Job Context: 
    Title: ${job.title}
    Department: ${job.department}
    
    Candidate Name: ${candidate.name}
    
    Return a JSON object with 'subject' and 'body'. The body should be ready to send (plain text).
  `;
  
   // Fix: Removed deprecated Schema type
   const responseSchema = {
      type: Type.OBJECT,
      properties: {
        subject: { type: Type.STRING },
        body: { type: Type.STRING },
      },
      required: ["subject", "body"]
    };

    try {
        const response = await ai.models.generateContent({
            model: modelName,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            },
        });
        // Fix: Access response text as a property
        const text = response.text;
        if (!text) throw new Error("No response from AI");
        return JSON.parse(text);
    } catch (e) {
        console.error("AI Email Template Generation Failed:", e);
        throw e;
    }
}

/**
 * Generates a referral email suggesting a candidate apply to a different job.
 */
export const generateReferralEmail = async (candidate: Candidate, targetJob: Job, currentJob: Job): Promise<{subject: string, body: string}> => {
    if (!process.env.API_KEY) throw new Error("API Key is missing");

    const prompt = `
    You are a professional recruiter. Write an email to a candidate named "${candidate.name}" regarding a potential opportunity.
    
    Current Context:
    The candidate applied for "${currentJob.title}" but we want to refer them to a different opening: "${targetJob.title}".
    
    Target Job:
    Title: ${targetJob.title}
    Description: ${targetJob.description}
    
    Write a persuasive and polite email suggesting they consider this new role because their skills might be a strong fit.
    
    Return a JSON object with 'subject' and 'body'. The body should be plain text.
    `;
    
    // Fix: Removed deprecated Schema type
    const responseSchema = {
        type: Type.OBJECT,
        properties: {
          subject: { type: Type.STRING },
          body: { type: Type.STRING },
        },
        required: ["subject", "body"]
      };
  
      try {
          const response = await ai.models.generateContent({
              model: modelName,
              contents: prompt,
              config: {
                  responseMimeType: "application/json",
                  responseSchema: responseSchema,
              },
          });
          // Fix: Access response text as a property
          const text = response.text;
          if (!text) throw new Error("No response from AI");
          return JSON.parse(text);
      } catch (e) {
          console.error("AI Referral Email Generation Failed:", e);
          throw e;
      }
}

/**
 * Generates a job description based on title and basic details.
 */
export const generateJobDescription = async (title: string, department: string, requirements: string): Promise<string> => {
  if (!process.env.API_KEY) throw new Error("API Key is missing");

  const prompt = `
    Write a comprehensive and professional job description for a "${title}" position in the "${department}" department.
    
    ${requirements ? `Key Requirements to include: ${requirements}` : ''}
    
    The description should include:
    - Role Overview
    - Key Responsibilities
    - Ideal Candidate Profile
    
    Keep the tone professional and engaging. Return only the description text.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
    });
    // Fix: Access response text as a property
    return response.text || "";
  } catch (error) {
    console.error("AI Description Generation Failed:", error);
    throw error;
  }
};

/**
 * Generates compelling ad copy for a job.
 */
export const generateJobAd = async (title: string, department: string, description: string): Promise<string> => {
    if (!process.env.API_KEY) throw new Error("API Key is missing");
  
    const prompt = `
      You are an expert copywriter for recruitment. Write a compelling, engaging, and high-converting job advertisement for the following role:
      
      Role: ${title}
      Department: ${department}
      
      Job Description context:
      ${description}
      
      The advertisement should:
      1. Have a catchy headline.
      2. Be optimized for social media (like LinkedIn).
      3. Highlight the opportunity and culture.
      4. Use professional yet exciting tone.
      5. Include relevant emojis.
      
      Return only the ad copy text.
    `;
  
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
      });
      // Fix: Access response text as a property
      return response.text || "";
    } catch (error) {
      console.error("AI Ad Generation Failed:", error);
      throw error;
    }
};

/**
 * Generates a 30-60-90 day onboarding plan.
 */
export const generateOnboardingPlan = async (job: Job, candidateName: string): Promise<string> => {
    if (!process.env.API_KEY) throw new Error("API Key is missing");

    const prompt = `
      Create a comprehensive, structured 30-60-90 Day Success Plan for a new employee named ${candidateName} joining as a ${job.title}.

      Job Description Context:
      ${job.description}

      The plan should be professional, actionable, and formatted in Markdown. 
      It should breakdown goals and milestones for:
      - First 30 Days (Learning & Integration)
      - Days 31-60 (Contributing & Execution)
      - Days 61-90 (Leading & Strategy)

      Format the output nicely with bold headers and bullet points.
    `;

    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
      });
      // Fix: Access response text as a property
      return response.text || "";
    } catch (error) {
      console.error("AI Onboarding Plan Generation Failed:", error);
      throw error;
    }
};

/**
 * Generates Boolean search strings for sourcing.
 */
export const generateSourcingStrategy = async (job: Job): Promise<{
    linkedin: string;
    googleXray: string;
    github?: string;
    tips: string[];
}> => {
    if (!process.env.API_KEY) throw new Error("API Key is missing");

    const prompt = `
      You are an expert Technical Sourcer. Create a boolean search strategy to find candidates for the following role:
      
      Role: ${job.title}
      Requirements: ${job.requirements}
      Location: ${job.location}

      1. Create a complex Boolean search string optimized for LinkedIn Recruiter.
      2. Create a Google X-Ray search string to find profiles on LinkedIn public pages (site:linkedin.com/in).
      3. If the role is technical (Developer/Engineer/Data), create a boolean string for GitHub user search. If not, leave empty.
      4. Provide 3 to 5 quick sourcing tips or relevant keywords/synonyms to look for (e.g. alternative job titles, specific skills).

      Return JSON.
    `;

    // Fix: Removed deprecated Schema type
    const responseSchema = {
        type: Type.OBJECT,
        properties: {
          linkedin: { type: Type.STRING, description: "LinkedIn Recruiter Boolean String" },
          googleXray: { type: Type.STRING, description: "Google X-Ray Boolean String" },
          github: { type: Type.STRING, description: "GitHub Boolean String (Optional)" },
          tips: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Sourcing tips" }
        },
        required: ["linkedin", "googleXray", "tips"]
      };

    try {
        const response = await ai.models.generateContent({
            model: modelName,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            },
        });
        // Fix: Access response text as a property
        const text = response.text;
        if (!text) throw new Error("No response from AI");
        return JSON.parse(text);
    } catch (error) {
        console.error("AI Sourcing Strategy Failed:", error);
        throw error;
    }
}