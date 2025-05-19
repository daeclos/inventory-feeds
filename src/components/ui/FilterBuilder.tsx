import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import ReactDOM from "react-dom";

interface FilterAttribute {
  label: string;
  value: string;
  operators: { label: string; value: string }[];
  inputType: "multiselect" | "text" | "number" | "between";
  options?: { label: string; value: string }[];
}

interface FilterOperator {
  label: string;
  value: string;
}

interface FilterRow {
  id: string;
  attribute: string;
  operator: string;
  values: string[];
  showDropdown: boolean;
}

interface FilterBuilderProps {
  attributes: FilterAttribute[];
  onCancel?: () => void;
  onSubmit?: (filters: FilterRow[]) => void;
}

// --- Filter Attributes Configuration ---
export const filterAttributes: FilterAttribute[] = [
  {
    label: "Color",
    value: "color",
    operators: [
      { label: "Is", value: "is" },
      { label: "Is not", value: "is_not" }
    ],
    inputType: "multiselect",
    options: [
      { label: "Null", value: "null" },
      { label: "Black", value: "black" },
      { label: "Blue", value: "blue" },
      { label: "Burgundy", value: "burgundy" },
      { label: "Green", value: "green" },
      { label: "Grey", value: "grey" },
      { label: "Orange", value: "orange" },
      { label: "Pink", value: "pink" },
      { label: "Purple", value: "purple" },
      { label: "Red", value: "red" },
      { label: "White", value: "white" },
      { label: "Yellow", value: "yellow" }
    ]
  },
  {
    label: "Condition",
    value: "condition",
    operators: [
      { label: "Is", value: "is" },
      { label: "Is not", value: "is_not" }
    ],
    inputType: "multiselect",
    options: [
      { label: "Certified", value: "certified" },
      { label: "New", value: "new" },
      { label: "Used", value: "used" }
    ]
  },
  {
    label: "Count Condition",
    value: "count_condition",
    operators: [
      { label: ">", value: "gt" },
      { label: ">=", value: "gte" },
      { label: "<", value: "lt" },
      { label: "<=", value: "lte" },
      { label: "Between", value: "between" },
      { label: "=", value: "eq" },
      { label: "!=", value: "neq" }
    ],
    inputType: "between"
  },
  {
    label: "Description",
    value: "description",
    operators: [
      { label: "Contains", value: "contains" },
      { label: "Not contains", value: "not_contains" },
      { label: "Starts with", value: "starts_with" },
      { label: "Ends with", value: "ends_with" }
    ],
    inputType: "text"
  },
  {
    label: "Discount",
    value: "discount",
    operators: [
      { label: ">", value: "gt" },
      { label: ">=", value: "gte" },
      { label: "<", value: "lt" },
      { label: "<=", value: "lte" },
      { label: "Between", value: "between" },
      { label: "=", value: "eq" },
      { label: "!=", value: "neq" }
    ],
    inputType: "between"
  },
  {
    label: "Doors",
    value: "doors",
    operators: [
      { label: "Is", value: "is" },
      { label: "Is not", value: "is_not" }
    ],
    inputType: "multiselect",
    options: [
      { label: "2", value: "2" },
      { label: "3", value: "3" },
      { label: "4", value: "4" },
      { label: "5", value: "5" }
    ]
  },
  {
    label: "Drivetrain",
    value: "drivetrain",
    operators: [
      { label: "Is", value: "is" },
      { label: "Is not", value: "is_not" }
    ],
    inputType: "multiselect",
    options: [
      { label: "4x2", value: "4x2" },
      { label: "4x4", value: "4x4" },
      { label: "AWD", value: "awd" },
      { label: "FWD", value: "fwd" },
      { label: "RWD", value: "rwd" },
      { label: "Other", value: "other" }
    ]
  },
  {
    label: "Fuel Type",
    value: "fuel_type",
    operators: [
      { label: "Is", value: "is" },
      { label: "Is not", value: "is_not" }
    ],
    inputType: "multiselect",
    options: [
      { label: "Electric", value: "electric" },
      { label: "Flex", value: "flex" },
      { label: "Gasoline", value: "gasoline" },
      { label: "Hybrid", value: "hybrid" },
      { label: "Other", value: "other" }
    ]
  },
  {
    label: "Image Type",
    value: "image_type",
    operators: [
      { label: "Is", value: "is" },
      { label: "Is not", value: "is_not" }
    ],
    inputType: "multiselect",
    options: [
      { label: "Dealer", value: "dealer" },
      { label: "Placeholder", value: "placeholder" },
      { label: "Stock", value: "stock" }
    ]
  },
  {
    label: "Make",
    value: "make",
    operators: [
      { label: "Contains", value: "contains" },
      { label: "Not contains", value: "not_contains" },
      { label: "Starts with", value: "starts_with" },
      { label: "Ends with", value: "ends_with" }
    ],
    inputType: "text"
  },
  {
    label: "Make Count Condition",
    value: "make_count_condition",
    operators: [
      { label: ">", value: "gt" },
      { label: ">=", value: "gte" },
      { label: "<", value: "lt" },
      { label: "<=", value: "lte" },
      { label: "Between", value: "between" },
      { label: "=", value: "eq" },
      { label: "!=", value: "neq" }
    ],
    inputType: "between"
  },
  {
    label: "Mileage",
    value: "mileage",
    operators: [
      { label: ">", value: "gt" },
      { label: ">=", value: "gte" },
      { label: "<", value: "lt" },
      { label: "<=", value: "lte" },
      { label: "Between", value: "between" },
      { label: "=", value: "eq" },
      { label: "!=", value: "neq" }
    ],
    inputType: "between"
  },
  {
    label: "Model",
    value: "model",
    operators: [
      { label: "Contains", value: "contains" },
      { label: "Not contains", value: "not_contains" },
      { label: "Starts with", value: "starts_with" },
      { label: "Ends with", value: "ends_with" }
    ],
    inputType: "text"
  },
  {
    label: "Model Count",
    value: "model_count",
    operators: [
      { label: ">", value: "gt" },
      { label: ">=", value: "gte" },
      { label: "<", value: "lt" },
      { label: "<=", value: "lte" },
      { label: "Between", value: "between" },
      { label: "=", value: "eq" },
      { label: "!=", value: "neq" }
    ],
    inputType: "between"
  },
  {
    label: "Model Count Condition",
    value: "model_count_condition",
    operators: [
      { label: ">", value: "gt" },
      { label: ">=", value: "gte" },
      { label: "<", value: "lt" },
      { label: "<=", value: "lte" },
      { label: "Between", value: "between" },
      { label: "=", value: "eq" },
      { label: "!=", value: "neq" }
    ],
    inputType: "between"
  },
  {
    label: "Price",
    value: "price",
    operators: [
      { label: ">", value: "gt" },
      { label: ">=", value: "gte" },
      { label: "<", value: "lt" },
      { label: "<=", value: "lte" },
      { label: "Between", value: "between" },
      { label: "=", value: "eq" },
      { label: "!=", value: "neq" }
    ],
    inputType: "between"
  },
  {
    label: "Price Alt.",
    value: "price_alt",
    operators: [
      { label: ">", value: "gt" },
      { label: ">=", value: "gte" },
      { label: "<", value: "lt" },
      { label: "<=", value: "lte" },
      { label: "Between", value: "between" },
      { label: "=", value: "eq" },
      { label: "!=", value: "neq" }
    ],
    inputType: "between"
  },
  {
    label: "Title",
    value: "title",
    operators: [
      { label: "Contains", value: "contains" },
      { label: "Not contains", value: "not_contains" },
      { label: "Starts with", value: "starts_with" },
      { label: "Ends with", value: "ends_with" }
    ],
    inputType: "text"
  },
  {
    label: "Title Orig.",
    value: "title_orig",
    operators: [
      { label: "Contains", value: "contains" },
      { label: "Not contains", value: "not_contains" },
      { label: "Starts with", value: "starts_with" },
      { label: "Ends with", value: "ends_with" }
    ],
    inputType: "text"
  },
  {
    label: "Transmission",
    value: "transmission",
    operators: [
      { label: "Is", value: "is" },
      { label: "Is not", value: "is_not" }
    ],
    inputType: "multiselect",
    options: [
      { label: "Automatic", value: "automatic" },
      { label: "Manual", value: "manual" },
      { label: "Other", value: "other" }
    ]
  },
  {
    label: "Trim",
    value: "trim",
    operators: [
      { label: "Contains", value: "contains" },
      { label: "Not contains", value: "not_contains" },
      { label: "Starts with", value: "starts_with" },
      { label: "Ends with", value: "ends_with" }
    ],
    inputType: "text"
  },
  {
    label: "Type",
    value: "type",
    operators: [
      { label: "Is", value: "is" },
      { label: "Is not", value: "is_not" }
    ],
    inputType: "multiselect",
    options: [
      { label: "Convertible", value: "convertible" },
      { label: "Coupe", value: "coupe" },
      { label: "Crossover", value: "crossover" },
      { label: "Hatchback", value: "hatchback" },
      { label: "Minivan", value: "minivan" },
      { label: "Sedan", value: "sedan" },
      { label: "SUV", value: "suv" },
      { label: "Truck", value: "truck" },
      { label: "Van Wagon", value: "van_wagon" },
      { label: "Wagon", value: "wagon" },
      { label: "Other", value: "other" }
    ]
  },
  {
    label: "Type Count",
    value: "type_count",
    operators: [
      { label: ">", value: "gt" },
      { label: ">=", value: "gte" },
      { label: "<", value: "lt" },
      { label: "<=", value: "lte" },
      { label: "Between", value: "between" },
      { label: "=", value: "eq" },
      { label: "!=", value: "neq" }
    ],
    inputType: "between"
  },
  {
    label: "Type Count Condition",
    value: "type_count_condition",
    operators: [
      { label: ">", value: "gt" },
      { label: ">=", value: "gte" },
      { label: "<", value: "lt" },
      { label: "<=", value: "lte" },
      { label: "Between", value: "between" },
      { label: "=", value: "eq" },
      { label: "!=", value: "neq" }
    ],
    inputType: "between"
  },
  {
    label: "URL",
    value: "url",
    operators: [
      { label: "Contains", value: "contains" },
      { label: "Not contains", value: "not_contains" },
      { label: "Starts with", value: "starts_with" },
      { label: "Ends with", value: "ends_with" }
    ],
    inputType: "text"
  },
  {
    label: "VIN",
    value: "vin",
    operators: [
      { label: "Contains", value: "contains" },
      { label: "Not contains", value: "not_contains" },
      { label: "Starts with", value: "starts_with" },
      { label: "Ends with", value: "ends_with" }
    ],
    inputType: "text"
  },
  {
    label: "Vehicle Type",
    value: "vehicle_type",
    operators: [
      { label: "Is", value: "is" },
      { label: "Is not", value: "is_not" }
    ],
    inputType: "multiselect",
    options: [
      { label: "Car_Truck", value: "car_truck" },
      { label: "Boat", value: "boat" },
      { label: "Commercial", value: "commercial" },
      { label: "Motorcycle", value: "motorcycle" },
      { label: "PowerSport", value: "powersport" },
      { label: "RV_Camper", value: "rv_camper" },
      { label: "Trailer", value: "trailer" },
      { label: "Other", value: "other" }
    ]
  },
  {
    label: "Year",
    value: "year",
    operators: [
      { label: ">", value: "gt" },
      { label: ">=", value: "gte" },
      { label: "<", value: "lt" },
      { label: "<=", value: "lte" },
      { label: "Between", value: "between" },
      { label: "=", value: "eq" },
      { label: "!=", value: "neq" }
    ],
    inputType: "between"
  },
  {
    label: "Year Count",
    value: "year_count",
    operators: [
      { label: ">", value: "gt" },
      { label: ">=", value: "gte" },
      { label: "<", value: "lt" },
      { label: "<=", value: "lte" },
      { label: "Between", value: "between" },
      { label: "=", value: "eq" },
      { label: "!=", value: "neq" }
    ],
    inputType: "between"
  },
  {
    label: "Year Model Count Cond.",
    value: "year_model_count_cond",
    operators: [
      { label: ">", value: "gt" },
      { label: ">=", value: "gte" },
      { label: "<", value: "lt" },
      { label: "<=", value: "lte" },
      { label: "Between", value: "between" },
      { label: "=", value: "eq" },
      { label: "!=", value: "neq" }
    ],
    inputType: "between"
  }
];
// --- Fin configuración atributos ---

export const FilterBuilder: React.FC<FilterBuilderProps> = ({ attributes, onCancel, onSubmit }) => {
  const [filters, setFilters] = useState<FilterRow[]>([
    { id: Date.now().toString(), attribute: "", operator: "", values: [], showDropdown: false }
  ]);
  const dropdownRefs = useRef<{ [id: string]: HTMLDivElement | null }>({});
  const buttonRefs = useRef<{ [id: string]: HTMLButtonElement | null }>({});
  const [dropdownPos, setDropdownPos] = useState<{ [id: string]: { top: number; left: number; width: number } }>({});

  // Handlers
  const addFilter = () => {
    setFilters(f => [...f, { id: Date.now().toString(), attribute: "", operator: "", values: [], showDropdown: false }]);
  };
  const removeFilter = (id: string) => {
    setFilters(f => f.length > 1 ? f.filter(row => row.id !== id) : f);
  };
  const updateFilter = (id: string, key: keyof FilterRow, value: any) => {
    setFilters(f => f.map(row => row.id === id ? { ...row, [key]: value } : row));
  };

  // Obtener el atributo seleccionado para una fila
  const getSelectedAttribute = (attributeValue: string) => {
    return attributes.find(attr => attr.value === attributeValue);
  };

  // refs y efectos para cada menú desplegable
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      setFilters(f => f.map(row => {
        if (row.showDropdown) {
          const ref = dropdownRefs.current[row.id];
          const btn = buttonRefs.current[row.id];
          if (
            ref && !ref.contains(event.target as Node) &&
            btn && !btn.contains(event.target as Node)
          ) {
            return { ...row, showDropdown: false };
          }
        }
        return row;
      }));
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Calcular posición del menú al abrir
  const handleDropdownToggle = (row: FilterRow) => {
    if (!row.showDropdown && buttonRefs.current[row.id]) {
      const rect = buttonRefs.current[row.id]!.getBoundingClientRect();
      setDropdownPos(pos => ({
        ...pos,
        [row.id]: {
          top: rect.bottom + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width
        }
      }));
    }
    updateFilter(row.id, "showDropdown", !row.showDropdown);
  };

  return (
    <div className="border rounded-xl p-6 bg-white max-w-4xl mx-auto mt-8 shadow">
      <div className="flex items-center gap-2 mb-4">
        <span className="font-bold text-lg">Filter Group 1</span>
        <Button type="button" variant="outline" size="icon" title="Add New Filter Attribute" onClick={addFilter}>+</Button>
        <Button type="button" variant="outline" size="icon" title="Remove Last Filter Attribute" onClick={() => removeFilter(filters[filters.length-1].id)}>-</Button>
      </div>
      <table className="w-full border rounded-xl overflow-visible">
        <thead>
          <tr className="bg-gray-100">
            <th className="text-left px-4 py-2 font-semibold">Attribute</th>
            <th className="text-left px-4 py-2 font-semibold">Operator</th>
            <th className="text-left px-4 py-2 font-semibold">Values</th>
            <th className="text-left px-4 py-2 font-semibold">Delete</th>
          </tr>
        </thead>
        <tbody>
          {filters.map((row, idx) => {
            const selectedAttribute = getSelectedAttribute(row.attribute);
            return (
              <tr key={row.id} className="border-b last:border-b-0 hover:bg-gray-50 transition">
                <td className="px-4 py-2">
                  <select
                    className="border rounded px-2 py-1 w-full focus:ring-2 focus:ring-gray-300 focus:outline-none bg-white"
                    value={row.attribute}
                    onChange={e => updateFilter(row.id, "attribute", e.target.value)}
                  >
                    <option value="">Select...</option>
                    {attributes.map(attr => (
                      <option key={attr.value} value={attr.value}>{attr.label}</option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-2">
                  <select
                    className="border rounded px-2 py-1 w-full focus:ring-2 focus:ring-gray-300 focus:outline-none bg-white"
                    value={row.operator}
                    onChange={e => updateFilter(row.id, "operator", e.target.value)}
                  >
                    <option value="">Select...</option>
                    {selectedAttribute?.operators.map(op => (
                      <option key={op.value} value={op.value}>{op.label}</option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-2">
                  {selectedAttribute?.inputType === "multiselect" ? (
                    <div className="relative">
                      <button
                        type="button"
                        ref={el => { buttonRefs.current[row.id] = el; }}
                        className="border rounded px-2 py-1 w-full text-left bg-white focus:ring-2 focus:ring-gray-300 focus:outline-none shadow-sm"
                        onClick={() => handleDropdownToggle(row)}
                      >
                        {row.values.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {row.values.map(val => {
                              const option = selectedAttribute.options?.find(opt => opt.value === val);
                              return (
                                <span 
                                  key={val} 
                                  className="bg-[#FAAE3A]/20 text-[#404042] rounded px-2 py-0.5 text-xs font-semibold flex items-center gap-1"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const newValues = row.values.filter(v => v !== val);
                                    updateFilter(row.id, "values", newValues);
                                  }}
                                >
                                  {option?.label || val}
                                  <span className="cursor-pointer hover:text-red-500">×</span>
                                </span>
                              );
                            })}
                          </div>
                        ) : (
                          <span className="text-gray-400">Select...</span>
                        )}
                        <span className="float-right font-bold">▼</span>
                      </button>
                      {row.showDropdown && dropdownPos[row.id] && ReactDOM.createPortal(
                        <div
                          ref={el => { dropdownRefs.current[row.id] = el; }}
                          className="z-[9999] bg-white border-2 rounded-xl shadow-lg max-h-56 overflow-auto animate-fade-in"
                          style={{
                            position: "absolute",
                            top: dropdownPos[row.id].top,
                            left: dropdownPos[row.id].left,
                            width: dropdownPos[row.id].width,
                            borderColor: '#e5e7eb',
                          }}
                        >
                          {selectedAttribute.options?.map(opt => (
                            <label key={opt.value} className="flex items-center px-3 py-2 cursor-pointer hover:bg-gray-100 rounded transition">
                              <input
                                type="checkbox"
                                checked={row.values.includes(opt.value)}
                                onChange={e => {
                                  let newValues = row.values.slice();
                                  if (e.target.checked) {
                                    newValues.push(opt.value);
                                  } else {
                                    newValues = newValues.filter(v => v !== opt.value);
                                  }
                                  updateFilter(row.id, "values", newValues);
                                }}
                                className="mr-2"
                              />
                              <span>{opt.label}</span>
                            </label>
                          ))}
                        </div>,
                        document.body
                      )}
                    </div>
                  ) : selectedAttribute?.inputType === "between" ? (
                    <div className="flex gap-2">
                      <input
                        className="border rounded px-2 py-1 w-1/2 focus:ring-2 focus:ring-gray-300 focus:outline-none"
                        type="number"
                        value={row.values[0] || ""}
                        onChange={e => updateFilter(row.id, "values", [e.target.value, row.values[1] || ""])}
                        placeholder="Min"
                      />
                      <input
                        className="border rounded px-2 py-1 w-1/2 focus:ring-2 focus:ring-gray-300 focus:outline-none"
                        type="number"
                        value={row.values[1] || ""}
                        onChange={e => updateFilter(row.id, "values", [row.values[0] || "", e.target.value])}
                        placeholder="Max"
                      />
                    </div>
                  ) : (
                    <input
                      className="border rounded px-2 py-1 w-full focus:ring-2 focus:ring-gray-300 focus:outline-none"
                      type={selectedAttribute?.inputType === "number" ? "number" : "text"}
                      value={row.values.join(", ")}
                      onChange={e => updateFilter(row.id, "values", e.target.value.split(",").map(v => v.trim()))}
                      placeholder="Placeholder"
                    />
                  )}
                </td>
                <td className="px-4 py-2 text-center">
                  <Button variant="outline" size="icon" title="Delete" onClick={() => removeFilter(row.id)}>✕</Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}; 