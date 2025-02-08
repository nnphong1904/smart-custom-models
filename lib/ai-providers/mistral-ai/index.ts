const information = {
  id: "mistral-ai",
  name: "Mistral AI",
  endpoint: "https://api.mistral.ai/v1/chat/completions",
};

const getModels = async () => {
  const response = await fetch(`https://api.mistral.ai/v1/models`);
  const data = await response.json();
  return data;
};

export const mistralAi = {
  information,
  getModels,
};
