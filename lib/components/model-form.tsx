import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/form/button";
import { Input } from "@/components/form/input";
import { Toggle } from "@/components/form/toggle";
import { modelFormSchema, type ModelFormData } from "@/schemas/model-form";
import { Provider } from "@/types";

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

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="mx-auto w-full px-4">
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Add {provider.name} Model</h1>

        <div className="space-y-6">
          {/* API Key Input */}
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Input
              placeholder="Enter API Key"
              className="flex-1"
              type="password"
              {...form.register("apiKey")}
              error={form.formState.errors.apiKey?.message}
            />
            <Button type="button" variant="primary">
              Check API Key
            </Button>
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
