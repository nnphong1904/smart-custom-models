import { Button } from "@/components/form/button";
import { Input } from "@/components/form/input";
import { Toggle } from "@/components/form/toggle";

export function ModelForm() {
  return (
    <div className="mx-auto w-full p-4 sm:p-6">
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Add Custom Model</h1>

        <div className="space-y-6">
          {/* API Key Input */}
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Input placeholder="Enter API Key" className="flex-1" type="password" />
            <Button variant="primary">Check API Key</Button>
          </div>

          {/* Support Options */}
          <div className="space-y-4">
            <Toggle
              label="Support Plugins (via OpenAI Functions)"
              description="Enable if the model supports the 'functions' or 'tool_calls' parameter."
            />
            <Toggle
              label="Support OpenAI Vision"
              description="Enable if the model supports image input."
            />
            <Toggle
              label="Support System Role"
              description='Enable if the model supports the "system" role.'
            />
            <Toggle
              label="Support Streaming Output"
              description='Enable if the model supports streaming output ("stream": true).'
            />
          </div>

          {/* Custom Headers */}
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Custom Headers</h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <Input placeholder="x-header-key" className="flex-1" />
              <Input placeholder="Header Value" className="flex-1" />
              <Button variant="danger" className="w-full sm:w-auto">
                Remove
              </Button>
            </div>
            <Button variant="ghost" className="p-0 h-auto">
              + Add Custom Headers
            </Button>
          </div>

          {/* Custom Body Params */}
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Custom Body Params</h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <select className="rounded border p-2 w-full sm:w-auto">
                <option value="string">string</option>
                <option value="string">number</option>
                <option value="string">boolean</option>
                <option value="string">object</option>
                {/* Add other types as needed */}
              </select>
              <Input placeholder="Key" className="flex-1" />
              <Input placeholder="Value" className="flex-1" />
              <Button variant="danger" className="w-full sm:w-auto">
                Remove
              </Button>
            </div>
            <Button variant="ghost" className="p-0 h-auto">
              + Add Custom Body Params
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Sample data - move to a separate file in production
