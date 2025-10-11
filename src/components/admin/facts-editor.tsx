"use client";

import { useState } from "react";
import { X, Plus } from "lucide-react";

interface Fact {
  key: string;
  value: string | number;
}

interface FactsEditorProps {
  facts: Record<string, string | number | null>;
  onChange: (facts: Record<string, string | number | null>) => void;
  label?: string;
  description?: string;
}

export function FactsEditor({
  facts,
  onChange,
  label = "Project Facts",
  description = "Add key details about the project (e.g., size, bedrooms, location)"
}: FactsEditorProps) {
  // Convert facts object to array for easier editing
  const [factsList, setFactsList] = useState<Fact[]>(() => {
    return Object.entries(facts || {}).map(([key, value]) => ({
      key,
      value: value ?? ""
    }));
  });

  // Common fact templates
  const templates = [
    { key: "Location", value: "" },
    { key: "Size (m²)", value: "" },
    { key: "Bedrooms", value: "" },
    { key: "Bathrooms", value: "" },
    { key: "Plot Size (m²)", value: "" },
    { key: "Year Built", value: "" },
    { key: "Style", value: "" },
    { key: "Pool", value: "Yes" },
    { key: "Garden", value: "Yes" },
    { key: "Garage", value: "Yes" },
    { key: "Sea Views", value: "Yes" },
  ];

  const updateFacts = (newFactsList: Fact[]) => {
    setFactsList(newFactsList);
    
    // Convert back to object and pass to parent
    const factsObject: Record<string, string | number | null> = {};
    newFactsList.forEach(fact => {
      if (fact.key.trim()) {
        // Try to convert to number if it's numeric
        const numValue = Number(fact.value);
        factsObject[fact.key.trim()] = isNaN(numValue) || fact.value === "" 
          ? fact.value 
          : numValue;
      }
    });
    onChange(factsObject);
  };

  const addFact = (key: string = "", value: string | number = "") => {
    const newFactsList = [...factsList, { key, value }];
    updateFacts(newFactsList);
  };

  const updateFact = (index: number, field: "key" | "value", newValue: string) => {
    const newFactsList = [...factsList];
    newFactsList[index][field] = newValue;
    updateFacts(newFactsList);
  };

  const removeFact = (index: number) => {
    const newFactsList = factsList.filter((_, i) => i !== index);
    updateFacts(newFactsList);
  };

  const addTemplate = (template: { key: string; value: string | number }) => {
    // Check if key already exists
    const exists = factsList.some(fact => fact.key === template.key);
    if (!exists) {
      addFact(template.key, template.value);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h3 className="text-sm font-medium text-gray-900">{label}</h3>
        {description && (
          <p className="mt-1 text-xs text-gray-600">{description}</p>
        )}
      </div>

      {/* Quick Templates */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-gray-700">Quick Add Templates:</label>
        <div className="flex flex-wrap gap-2">
          {templates.map((template) => {
            const exists = factsList.some(fact => fact.key === template.key);
            return (
              <button
                key={template.key}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  addTemplate(template);
                }}
                disabled={exists}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  exists
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100"
                }`}
              >
                {exists ? "✓ " : "+ "}{template.key}
              </button>
            );
          })}
        </div>
      </div>

      {/* Facts List */}
      <div className="space-y-3">
        <label className="text-xs font-medium text-gray-700">Project Facts:</label>
        
        {factsList.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
            <p className="text-sm text-gray-500 mb-3">No facts added yet</p>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                addFact();
              }}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add First Fact
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {factsList.map((fact, index) => (
              <div key={index} className="flex gap-2 items-start">
                <div className="flex-1 grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={fact.key}
                    onChange={(e) => updateFact(index, "key", e.target.value)}
                    placeholder="Fact name (e.g., Location)"
                    className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    value={fact.value}
                    onChange={(e) => updateFact(index, "value", e.target.value)}
                    placeholder="Value (e.g., Marbella)"
                    className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    removeFact(index);
                  }}
                  className="rounded-lg p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  title="Remove fact"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
            
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                addFact();
              }}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add Another Fact
            </button>
          </div>
        )}
      </div>

      {/* Preview */}
      {factsList.length > 0 && (
        <div className="rounded-lg bg-gray-50 border border-gray-200 p-4">
          <h4 className="text-xs font-medium text-gray-700 mb-2">Preview:</h4>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
            {factsList.map((fact, index) => (
              fact.key.trim() && (
                <div key={index} className="flex items-baseline gap-2">
                  <span className="font-medium text-gray-900">{fact.key}:</span>
                  <span className="text-gray-600">{fact.value || "(empty)"}</span>
                </div>
              )
            ))}
          </div>
        </div>
      )}

      {/* Help Text */}
      <div className="rounded-lg bg-blue-50 p-3 border border-blue-200">
        <p className="text-xs text-blue-900">
          <strong>💡 Tips:</strong>
        </p>
        <ul className="mt-1 text-xs text-blue-800 space-y-1 ml-4 list-disc">
          <li>Use templates for common facts or add custom ones</li>
          <li>Numeric values (e.g., "450") will be stored as numbers</li>
          <li>Text values (e.g., "Marbella") will be stored as text</li>
          <li>Facts appear on the project detail page</li>
        </ul>
      </div>
    </div>
  );
}

