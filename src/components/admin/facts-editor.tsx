"use client";

import { useState } from "react";
import { X, Plus } from "lucide-react";

interface Fact {
  key: string;
  value: string | number;
}

interface FactTemplate {
  key: string;
  label: string;
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
  // Ensure mandatory facts are always present
  const ensureMandatoryFacts = (factsList: Fact[]) => {
    const mandatoryFacts = [
      { key: "sqm", value: "" },
      { key: "bedrooms", value: "" }
    ];
    
    const result = [...factsList];
    
    // Add mandatory facts if they don't exist
    mandatoryFacts.forEach(mandatory => {
      if (!result.some(fact => fact.key === mandatory.key)) {
        result.unshift(mandatory);
      }
    });
    
    return result;
  };

  // Convert facts object to array for easier editing, ensuring mandatory facts
  const [factsList, setFactsList] = useState<Fact[]>(() => {
    const initialFacts = Object.entries(facts || {}).map(([key, value]) => ({
      key,
      value: value ?? ""
    }));
    return ensureMandatoryFacts(initialFacts);
  });

  // Common fact templates
  // Note: Keys must match what the frontend expects (lowercase, no spaces)
  const templates: FactTemplate[] = [
    { key: "sqm", label: "Size (m²)", value: "" },
    { key: "bedrooms", label: "Bedrooms", value: "" },
    { key: "bathrooms", label: "Bathrooms", value: "" },
    { key: "location", label: "Location", value: "" },
    { key: "plot", label: "Plot Size (m²)", value: "" },
    { key: "yearBuilt", label: "Year Built", value: "" },
    { key: "style", label: "Style", value: "" },
    { key: "pool", label: "Pool", value: "Yes" },
    { key: "garden", label: "Garden", value: "Yes" },
    { key: "garage", label: "Garage", value: "Yes" },
    { key: "seaViews", label: "Sea Views", value: "Yes" },
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
    
    // Prevent renaming of mandatory facts
    if (field === "key") {
      const currentFact = factsList[index];
      if (currentFact && (currentFact.key === "sqm" || currentFact.key === "bedrooms")) {
        return;
      }
    }
    
    newFactsList[index][field] = newValue;
    updateFacts(newFactsList);
  };

  const removeFact = (index: number) => {
    const fact = factsList[index];
    // Prevent deletion of mandatory facts
    if (fact && (fact.key === "sqm" || fact.key === "bedrooms")) {
      return;
    }
    const newFactsList = factsList.filter((_, i) => i !== index);
    updateFacts(newFactsList);
  };

  const addTemplate = (template: FactTemplate) => {
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

      {/* Frontpage Facts Indicator */}
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
        <div className="flex items-start gap-2">
          <div className="flex-shrink-0">
            <svg className="h-4 w-4 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="text-xs">
            <p className="font-medium text-amber-800">Frontpage Display</p>
            <p className="text-amber-700">These facts will show on your homepage project cards:</p>
            <ul className="mt-1 space-y-0.5 text-amber-700">
              <li>• <code className="bg-amber-100 px-1 rounded text-amber-900">sqm</code> → Size badge (top-left)</li>
              <li>• <code className="bg-amber-100 px-1 rounded text-amber-900">bedrooms</code> → Bedrooms badge (bottom-right)</li>
            </ul>
            <p className="mt-1 text-amber-700 font-medium">Keys must be lowercase!</p>
          </div>
        </div>
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
                {exists ? "✓ " : "+ "}{template.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Facts List */}
      <div className="space-y-6">
        {/* Required Facts Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-medium text-gray-900">Required Facts</h4>
            <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
              Frontpage Display
            </span>
          </div>
          <p className="text-xs text-gray-600">These facts will appear on your homepage project cards</p>
          
          <div className="space-y-2">
            {factsList
              .filter(fact => fact.key === "sqm" || fact.key === "bedrooms")
              .map((fact, index) => {
                const originalIndex = factsList.findIndex(f => f === fact);
                return (
                  <div key={originalIndex} className="flex gap-2 items-start">
                    <div className="flex-1 grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={fact.key}
                        onChange={(e) => updateFact(originalIndex, "key", e.target.value)}
                        placeholder="Fact name (e.g., Location)"
                        disabled={true}
                        className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-900 cursor-not-allowed"
                      />
                      <input
                        type="text"
                        value={fact.value}
                        onChange={(e) => updateFact(originalIndex, "value", e.target.value)}
                        placeholder={`Enter ${fact.key === "sqm" ? "size in m²" : "number of bedrooms"}`}
                        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Optional Facts Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-900">Optional Facts</h4>
          </div>
          <p className="text-xs text-gray-600">Additional details that appear on the project detail page</p>
          
          {factsList.filter(fact => fact.key !== "sqm" && fact.key !== "bedrooms").length === 0 ? (
            <div className="text-center py-6 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
              <p className="text-sm text-gray-500 mb-3">No optional facts added yet</p>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  addFact();
                }}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add First Optional Fact
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {factsList
                .filter(fact => fact.key !== "sqm" && fact.key !== "bedrooms")
                .map((fact, index) => {
                  const originalIndex = factsList.findIndex(f => f === fact);
                  return (
                    <div key={originalIndex} className="flex gap-2 items-start">
                      <div className="flex-1 grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={fact.key}
                          onChange={(e) => updateFact(originalIndex, "key", e.target.value)}
                          placeholder="Fact name (e.g., Location)"
                          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <input
                          type="text"
                          value={fact.value}
                          onChange={(e) => updateFact(originalIndex, "value", e.target.value)}
                          placeholder="Value (e.g., Marbella)"
                          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          removeFact(originalIndex);
                        }}
                        className="rounded-lg p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Remove fact"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  );
                })}
              
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  addFact();
                }}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add Another Optional Fact
              </button>
            </div>
          )}
        </div>
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
          <li>Numeric values (e.g., &quot;450&quot;) will be stored as numbers</li>
          <li>Text values (e.g., &quot;Marbella&quot;) will be stored as text</li>
          <li>Facts appear on the project detail page</li>
        </ul>
      </div>
    </div>
  );
}

