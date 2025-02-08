import { MistralModelDTO } from "@/ai-providers/mistral-ai/types";
import { Model } from "@/types";

const information = {
  id: "mistral-ai",
  name: "Mistral AI",
  endpoint: "https://api.mistral.ai/v1/chat/completions",
};

const getModels = async (apiKey: string): Promise<Model[]> => {
  const response = await fetch(`https://api.mistral.ai/v1/models`, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
  });
  const data = (await response.json()) as { data: MistralModelDTO[] };
  const result = data.data.map((model) => ({
    id: model.id,
    name: model.name,
    description: model.description,
    contextLength: model.max_context_length,
    pricePerMillionTokens: null,
  }));
  console.log("🚀 ~ getModels ~ result:", result);
  return result;
};

export const mistralAi = {
  information,
  getModels,
};
