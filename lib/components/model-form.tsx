import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/form/button";
import { Input } from "@/components/form/input";
import { Toggle } from "@/components/form/toggle";
import { modelFormSchema, type ModelFormData } from "@/schemas/model-form";
import { Provider } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { mistralAi } from "@/ai-providers/mistral-ai";
import { useState, useEffect, useMemo } from "react";
import { useDebounce } from "@/hooks/use-debounce";

export function ModelForm({ provider }: { provider: Provider }) {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [filteredModels, setFilteredModels] = useState<typeof models>([]);

  const form = useForm<ModelFormData>({
    resolver: zodResolver(modelFormSchema),
    defaultValues: {
      apiKey: "",
      supportPlugins: false,
      supportVision: false,
      supportSystem: false,
      supportStreaming: false,
      headers: [],
      bodyParams: [],
    },
  });

  const {
    fields: headerFields,
    append: appendHeader,
    remove: removeHeader,
  } = useFieldArray({
    control: form.control,
    name: "headers",
  });

  const {
    fields: paramFields,
    append: appendParam,
    remove: removeParam,
  } = useFieldArray({
    control: form.control,
    name: "bodyParams",
  });

  const onSubmit = (data: ModelFormData) => {
    console.log(data);
    // Handle form submission
  };

  const getModelsFromProvider = {
    [mistralAi.information.id]: mistralAi.getModels,
  };

  const getModels = useMutation({
    mutationFn: ({ apiKey }: { apiKey: string }) => {
      return getModelsFromProvider[provider.id](apiKey);
    },
  });

  const models = useMemo(() => getModels.data ?? [], [getModels.data]);

  // Effect to handle search
  useEffect(() => {
    if (!models.length) return;

    if (!debouncedSearchTerm.trim()) {
      setFilteredModels(models);
      return;
    }

    const searchTermLower = debouncedSearchTerm.toLowerCase();
    const filtered = models.filter(
      (model) =>
        model.name.toLowerCase().includes(searchTermLower) ||
        model.id.toLowerCase().includes(searchTermLower),
    );
    setFilteredModels(filtered);
  }, [debouncedSearchTerm, models]);

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="mx-auto w-full px-4">
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Add {provider.name} Model</h1>

        <div className="space-y-6">
          {/* API Key Input */}
          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <div className="flex-1">
                <Input
                  placeholder="Enter API Key"
                  className="w-full"
                  type="password"
                  {...form.register("apiKey")}
                  error={form.formState.errors.apiKey?.message}
                />
                {form.formState.errors.apiKey && (
                  <p className="mt-1 text-sm text-red-500">
                    {form.formState.errors.apiKey.message}
                  </p>
                )}
              </div>
              <Button
                type="button"
                variant="primary"
                onClick={() => {
                  if (!form.getValues("apiKey")) {
                    form.setError("apiKey", {
                      message: "Please enter an API key",
                    });
                    return;
                  }
                  getModels.mutate({ apiKey: form.getValues("apiKey") });
                }}
                disabled={getModels.isPending}
              >
                {getModels.isPending ? "Checking..." : "Check API Key"}
              </Button>
              {/* TODO: Add a short instructions to guide user to get the API key for each provider */}
            </div>
          </div>

          {/* Model lists with search */}
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Available Models</h2>
            <p className="text-sm text-gray-500">
              Enter your API key to fetch available models from {provider.name}
            </p>
            {models.length === 0 ? (
              <div className="rounded-lg border-2 border-dashed border-gray-200 p-8">
                <div className="flex flex-col items-center justify-center text-center">
                  <p className="mt-2 text-sm text-gray-500">No models available</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Search Input */}
                <div className="relative">
                  <Input
                    type="search"
                    placeholder="Search models..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10"
                  />
                  <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>

                {/* Models Table */}
                <div className="rounded-lg border border-gray-200">
                  <div className="max-h-[400px] overflow-y-auto">
                    <table className="w-full">
                      <thead className="sticky top-0 bg-gray-50">
                        <tr className="border-b border-gray-200">
                          <th className="w-8 p-3">
                            <input type="checkbox" className="rounded border-gray-300" />
                          </th>
                          <th className="p-3 text-left text-sm font-medium text-gray-900">Name</th>
                          <th className="p-3 text-left text-sm font-medium text-gray-900">
                            Context Length
                          </th>
                          <th className="p-3 text-left text-sm font-medium text-gray-900">Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(filteredModels.length > 0 ? filteredModels : models).map((model) => (
                          <tr key={model.id} className="border-b border-gray-200">
                            <td className="p-3">
                              <input type="checkbox" className="rounded border-gray-300" />
                            </td>
                            <td className="p-3">
                              <div className="flex flex-col">
                                <span className="text-sm font-medium text-gray-900">
                                  {model.name}
                                </span>
                                <span className="text-sm text-gray-500">{model.id}</span>
                              </div>
                            </td>
                            <td className="p-3 text-sm text-gray-900">
                              {model.contextLength.toLocaleString()}
                            </td>
                            <td className="p-3 text-sm text-gray-900">
                              {model.pricePerMillionTokens ? (
                                <div>
                                  ${model.pricePerMillionTokens.prompt}/1M input tokens
                                  <br />${model.pricePerMillionTokens.completion}/1M output tokens
                                </div>
                              ) : (
                                "Free"
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {/* No Results Message */}
                    {filteredModels.length === 0 && debouncedSearchTerm && (
                      <div className="p-8 text-center">
                        <p className="text-sm text-gray-500">
                          No models found matching "{debouncedSearchTerm}"
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Support Options */}
          <div className="space-y-4">
            <Toggle
              label="Support Plugins (via OpenAI Functions)"
              description="Enable if the model supports the 'functions' or 'tool_calls' parameter."
              checked={form.watch("supportPlugins")}
              onChange={(checked) => form.setValue("supportPlugins", checked)}
            />
            <Toggle
              label="Support OpenAI Vision"
              description="Enable if the model supports image input."
              checked={form.watch("supportVision")}
              onChange={(checked) => form.setValue("supportVision", checked)}
            />
            <Toggle
              label="Support System Role"
              description='Enable if the model supports the "system" role.'
              checked={form.watch("supportSystem")}
              onChange={(checked) => form.setValue("supportSystem", checked)}
            />
            <Toggle
              label="Support Streaming Output"
              description='Enable if the model supports streaming output ("stream": true).'
              checked={form.watch("supportStreaming")}
              onChange={(checked) => form.setValue("supportStreaming", checked)}
            />
          </div>

          {/* Custom Headers */}
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Custom Headers</h2>
            {headerFields.map((field, index) => (
              <div key={field.id} className="flex flex-col sm:flex-row gap-3">
                <Input
                  placeholder="x-header-key"
                  className="flex-1"
                  {...form.register(`headers.${index}.key`)}
                  error={form.formState.errors.headers?.[index]?.key?.message}
                />
                <Input
                  placeholder="Header Value"
                  className="flex-1"
                  {...form.register(`headers.${index}.value`)}
                  error={form.formState.errors.headers?.[index]?.value?.message}
                />
                <Button
                  type="button"
                  variant="danger"
                  className="w-full sm:w-auto"
                  onClick={() => removeHeader(index)}
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="ghost"
              className="p-0 h-auto text-blue-500"
              onClick={() => appendHeader({ key: "", value: "" })}
            >
              + Add Custom Headers
            </Button>
          </div>

          {/* Custom Body Params */}
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Custom Body Params</h2>
            {paramFields.map((field, index) => (
              <div key={field.id} className="flex flex-col sm:flex-row gap-3">
                <select
                  className="rounded border p-2 w-full sm:w-auto"
                  {...form.register(`bodyParams.${index}.type`)}
                >
                  <option value="string">string</option>
                  <option value="number">number</option>
                  <option value="boolean">boolean</option>
                  <option value="object">object</option>
                </select>
                <Input
                  placeholder="Key"
                  className="flex-1"
                  {...form.register(`bodyParams.${index}.key`)}
                  error={form.formState.errors.bodyParams?.[index]?.key?.message}
                />
                <Input
                  placeholder="Value"
                  className="flex-1"
                  {...form.register(`bodyParams.${index}.value`)}
                  error={form.formState.errors.bodyParams?.[index]?.value?.message}
                />
                <Button
                  type="button"
                  variant="danger"
                  className="w-full sm:w-auto"
                  onClick={() => removeParam(index)}
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="ghost"
              className="p-0 h-auto text-blue-500"
              onClick={() => appendParam({ type: "string", key: "", value: "" })}
            >
              + Add Custom Body Params
            </Button>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Saving..." : "Save Model"}
          </Button>
        </div>
      </div>
    </form>
  );
}

// Sample data - move to a separate file in production
