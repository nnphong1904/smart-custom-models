import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/form/button";
import { Input } from "@/components/form/input";
import { Toggle } from "@/components/form/toggle";
import { modelFormSchema, type ModelFormData } from "@/schemas/model-form";
import { Provider } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { mistralAi } from "@/ai-providers/mistral-ai";

export function ModelForm({ provider }: { provider: Provider }) {
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

  const models = getModels.data ?? [];

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="mx-auto w-full px-4">
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Add {provider.name} Model</h1>

        <div className="space-y-6">
          {/* API Key Input */}
          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <Input
                placeholder="Enter API Key"
                className="flex-1"
                type="password"
                {...form.register("apiKey")}
                error={form.formState.errors.apiKey?.message}
              />
              <Button
                type="button"
                variant="primary"
                onClick={() => getModels.mutate({ apiKey: form.getValues("apiKey") })}
                disabled={getModels.isPending}
              >
                {getModels.isPending ? "Checking..." : "Check API Key"}
              </Button>
              {/* TODO: Add a short instructions to guide user to get the API key for each provider */}
            </div>
          </div>

          {/* Model lists */}
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
              <div className="rounded-lg border border-gray-200">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
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
                    {models.map((model) => (
                      <tr key={model.id} className="border-b border-gray-200">
                        <td className="p-3">
                          <input type="checkbox" className="rounded border-gray-300" />
                        </td>
                        <td className="p-3 text-sm text-gray-900">{model.name}</td>
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
